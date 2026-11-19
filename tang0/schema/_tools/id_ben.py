#!/usr/bin/env python3
"""Quy tac id ben thong nhat (de xuat 015, D3 19/11/2026) – thu vien dung chung + script sinh lai id.

Dung lam thu vien:  from id_ben import slug_no, slug_caption, parse_ex_id, series_token, ex_id_ok
Chay:  python3 -I id_ben.py <R> [--ghi] [cuon ...]
  khong co --ghi: chi in bang doi id (cu -> moi) va so luong; co --ghi: ghi lai books/<cuon>/book.json.
Chay lai nhieu lan van cho cung ket qua (id da dung quy tac thi giu nguyen).

Quy tac (README schema, muc "Quy uoc id"):
  bai tap theo so in : <tap><trang>[.<series>].q<slug so in>     tap = p (SGK) | w (vo, khi vo danh so trang rieng)
  series token       : m<N> (N-mashq) | test | amaliy | g<k> (nhom thu k khong ten, k>=2; ghep sau token co ten: m9.g2)
  slug so in         : ★->star, *->s, cac dau – — - . khoang trang -> _, chu thuong, bo ky tu khac [a-z0-9_]
  hinh               : p<trang>.rasm<so in> | p<trang>.rasm_<slug 3 tu dau chu thich uz> (trung trong trang thi them tu)
Id cu (neu doi) duoc noi vao legacy_ids; moi tham chieu bang dung id cu trong book.json doi theo.
"""
import json, os, re, sys, unicodedata

SERIES_KINDS = ("main", "mashq", "test", "amaliy", "misol", "warmup", "other")
TOKEN_RE = r"(?:m\d+|test|amaliy|misol|g\d+)"
EX_ID_RE = re.compile(r"^(?P<vol>[pw])(?P<page>\d+)(?P<series>(?:\." + TOKEN_RE + r")*)\.q(?P<no>[a-z0-9_]+)$")
FIG_ID_RE = re.compile(r"^p\d+\.rasm(?:\d+[a-z0-9_]*|_[a-z0-9_]+)$")
APOS = "'‘’ʻʼ`´"


def _ascii(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    for a in APOS:
        s = s.replace(a, "")
    return s


def slug_no(no):
    """Slug so in cua bai: '★'->'star', '6*'->'6s', '1-misol'->'1_misol', '1–3'->'1_3', 'T1'->'t1', '4.1'->'4_1'."""
    s = str(no).strip().replace("★", "star").replace("*", "s")
    s = re.sub(r"^\d+\s*-\s*mashq\s+", "", s, flags=re.I)  # '1-mashq 2' (fizika8): ten day da nam o series m1
    s = _ascii(s).lower()
    s = re.sub(r"[\s\-–—.,/]+", "_", s)
    s = re.sub(r"[^a-z0-9_]", "", s)
    return re.sub(r"_+", "_", s).strip("_")


def slug_caption(text, words=3):
    s = _ascii(str(text)).lower()
    toks = [t for t in re.split(r"[^a-z0-9]+", s) if t]
    return "_".join(toks[:words]), toks


def series_token(series):
    """exercise.series -> token trong id ('' neu la nhom chinh thu nhat)."""
    if not series:
        return ""
    k, n, g = series.get("kind"), series.get("no"), series.get("group")
    t = []
    if k == "mashq":
        t.append(f"m{n}")
    elif k in ("test", "amaliy", "misol"):
        t.append(k)
    if g and g >= 2:
        t.append(f"g{g}")
    return ".".join(t)


def series_from_token(tok):
    """'m9.g2' -> {'kind':'mashq','no':9,'group':2}; '' -> None."""
    if not tok:
        return None
    s = {}
    for part in tok.split("."):
        if re.fullmatch(r"m\d+", part):
            s.update(kind="mashq", no=int(part[1:]))
        elif part in ("test", "amaliy", "misol"):
            s["kind"] = part
        elif re.fullmatch(r"g\d+", part):
            s.setdefault("kind", "main")
            s["group"] = int(part[1:])
    return s


def parse_ex_id(i):
    m = EX_ID_RE.match(i)
    if not m:
        return None
    return {"vol": m["vol"], "page": int(m["page"]), "series": m["series"].lstrip("."), "no": m["no"]}


def ex_id_ok(e):
    """Tra ve danh sach loi quy tac id cua mot bai tap co id theo so in (rong = dat)."""
    i = e["id"]
    # chi xet bai danh theo so in; id kieu khac theo ma goc / hinh (p19.rasm13.nhan, p7.wl, t4.quiz, l11.sort) khong xet o day
    if not re.match(r"^[pw]\d+\.", i) or ("no" not in e and not re.search(r"\.q[^.]*$", i)):
        return []
    p = parse_ex_id(i)
    if not p:
        return [f"id '{i}' khong dung mau <tap><trang>[.<series>].q<slug>"]
    err = []
    if "no" in e and p["no"] != slug_no(e["no"]):
        err.append(f"id '{i}': q-token '{p['no']}' != slug(no='{e['no']}') = '{slug_no(e['no'])}' (hau to tu dat kieu -2/_2/b?)")
    if series_token(e.get("series")) != p["series"]:
        err.append(f"id '{i}': token series '{p['series']}' khong khop exercise.series {e.get('series')}")
    if "page" in e and e["page"] != p["page"]:
        err.append(f"id '{i}': trang trong id khac exercise.page={e['page']}")
    return err


# ---------------------------------------------------------------- sinh lai id cho mot cuon
def _uz(t):
    return (t.get("uz") if isinstance(t, dict) else t) or ""


def named_regions(book):
    """Vung day bai co ten tren trang (hien chi kimyo8: 'N- AMALIY ISH', 'TEST SAVOLLARI'):
    tu tieu de toi tieu de ke tiep tren cung trang. -> {(volume,page): [(y0,y1,series)]}"""
    out = {}
    carry = {}  # volume -> series cua vung keo toi cuoi trang truoc (day bai sang trang sau, nhu fizika8 'N-mashq')
    for p in sorted(book.get("pages", []), key=lambda p: (str(p.get("volume")), p["n"])):
        hs = sorted([t for t in p.get("tr", []) if t.get("heading")], key=lambda t: t["box"][1])
        regs = []
        c = carry.pop(p.get("volume"), None)
        if c:
            regs.append((-1, hs[0]["box"][1] if hs else 1e9, c))  # chi keo sang dung 1 trang
        for k, t in enumerate(hs):
            u = _uz(t.get("text")).strip()
            m = re.match(r"^(\d+)\s*-\s*amaliy ish\b", u, re.I)
            s = None
            if m:
                s = {"kind": "amaliy", "no": int(m.group(1)), "title": t["text"]}
            elif re.match(r"^test savollari\b", u, re.I):
                s = {"kind": "test", "title": t["text"]}
            if s:
                y1 = hs[k + 1]["box"][1] if k + 1 < len(hs) else 1e9
                regs.append((t["box"][1], y1, s))
                if y1 == 1e9:
                    carry[p.get("volume")] = s
        if regs:
            out[(p.get("volume"), p["n"])] = regs
    return out


def plan_book(book):
    """-> (doi_id {cu: moi}, series {id_moi: series}) cho bai tap va hinh."""
    ren, ser = {}, {}
    regions = named_regions(book)
    ex = [e for e in book.get("exercises", []) if re.match(r"^[pw]\d+\.", e["id"]) and "no" in e]
    # nhom theo trang, giu thu tu in (thu tu mang)
    by_page = {}
    for e in ex:
        by_page.setdefault(e["id"].split(".")[0], []).append(e)
    # cuon da dat token series theo quy uoc (fizika8, hoac da chay script nay): giu token cu, chi chuan hoa slug
    keep = any(re.search(r"\.(?:m\d+|test|amaliy|g\d+)\.q", e["id"]) or e.get("series") for e in ex)
    for pref, lst in by_page.items():
        state = {}  # named token -> (group, seen)
        for e in lst:
            if keep:
                m = re.match(r"^[pw]\d+((?:\." + TOKEN_RE + r")*)\.q", e["id"])
                s = e.get("series") or series_from_token(m.group(1).lstrip(".") if m else "")
            else:
                base = None
                box = e.get("box")
                for y0, y1, rs in regions.get((e.get("volume"), e.get("page")), []):
                    if box and y0 <= box[1] < y1:
                        base = dict(rs)
                key = series_token(base) if base else ""
                g, seen = state.get(key, (1, set()))
                sl = slug_no(e["no"])
                if sl in seen:
                    g, seen = g + 1, set()
                seen.add(sl)
                state[key] = (g, seen)
                if g >= 2:
                    base = dict(base or {"kind": "main"})
                    base["group"] = g
                s = base
            tok = series_token(s)
            new = pref + (("." + tok) if tok else "") + ".q" + slug_no(e["no"])
            if new != e["id"]:
                ren[e["id"]] = new
            if s:
                ser[new] = s
    # hinh khong so in: rasm_<slug 3 tu>, trung trong trang thi them tu
    used = {}
    for f in book.get("figures", []):
        if re.match(r"^p\d+\.rasm\d", f["id"]) or not re.match(r"^p\d+\.", f["id"]) or str(f.get("no", "")).strip():
            continue
        pg = f["id"].split(".")[0]
        s3, toks = slug_caption(_uz(f.get("caption")))
        n = 3
        cand = s3
        while (pg, cand) in used and n < len(toks):
            n += 1
            cand = "_".join(toks[:n])
        used[(pg, cand)] = 1
        new = f"{pg}.rasm_{cand}"
        if new != f["id"]:
            ren[f["id"]] = new
    return ren, ser


def apply(book, ren, ser):
    n_ref = 0

    def sub(v):
        nonlocal n_ref
        if isinstance(v, str):
            if v in ren:
                n_ref += 1
                return ren[v]
            head, sep, tail = v.partition("/")
            if sep and head in ren:
                n_ref += 1
                return ren[head] + "/" + tail
        return v

    def walk(o):
        if isinstance(o, dict):
            for k in list(o.keys()):
                v = o[k]
                if k == "legacy_ids":  # id cu giu nguyen
                    continue
                if isinstance(v, (dict, list)):
                    walk(v)
                else:
                    o[k] = sub(v)
            for k in [k for k in o if k in ren]:  # khoa dict (vd. media.clips, teacher.*)
                o[ren[k]] = o.pop(k)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                if isinstance(v, (dict, list)):
                    walk(v)
                else:
                    o[i] = sub(v)

    # 1) legacy_ids + series truoc khi doi tham chieu
    for coll in ("exercises", "figures"):
        for x in book.get(coll, []):
            old = x["id"]
            if old in ren:
                li = x.setdefault("legacy_ids", [])
                if old not in li:
                    li.append(old)
    walk(book)  # doi id + moi tham chieu (exact hoac '<id>/<phan>')
    for x in book.get("exercises", []):
        if x["id"] in ser:
            x["series"] = ser[x["id"]]
        # nhan tam TC5/TC6 (matematika5) da duoc quy tac chinh thuc thay
        d = x.get("data")
        if isinstance(d, dict) and isinstance(d.get("_tu_che"), list):
            d["_tu_che"] = [t for t in d["_tu_che"] if t not in ("TC5", "TC6")]
            if not d["_tu_che"]:
                del d["_tu_che"]
            if not d:
                del x["data"]
    return n_ref


def dump(book, path, raw):
    if raw.startswith("{\n"):
        txt = json.dumps(book, ensure_ascii=False, indent=1)
    else:
        txt = json.dumps(book, ensure_ascii=False, separators=(",", ":"))
    open(path, "w", encoding="utf8").write(txt + ("\n" if raw.endswith("\n") else ""))


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    R, books = a[0], a[1:] or ["matematika5", "informatika5", "tabiiy5", "biologiya5", "adabiyot5", "kimyo8", "fizika8"]
    write = "--ghi" in sys.argv
    tong = {}
    for b in books:
        p = os.path.join(R, "books", b, "book.json")
        raw = open(p, encoding="utf8").read()
        book = json.loads(raw)
        ren, ser = plan_book(book)
        changed_series = sum(1 for e in book.get("exercises", []) if ser.get(ren.get(e["id"], e["id"])) != e.get("series"))
        n_ref = apply(book, ren, ser) if (ren or changed_series) else 0
        errs = [m for e in book.get("exercises", []) for m in ex_id_ok(e)]
        ids = [e["id"] for e in book.get("exercises", [])]
        dup = sorted({i for i in ids if ids.count(i) > 1})
        figs = [f["id"] for f in book.get("figures", [])]
        badfig = [i for i in figs if re.match(r"^p\d+\.", i) and not FIG_ID_RE.match(i)]
        print(f"== {b}: doi {len(ren)} id ({sum(1 for k in ren if k in ids or True)}), series moi/sua {changed_series}, "
              f"tham chieu doi {n_ref}; loi quy tac {len(errs)}, trung {len(dup)}, hinh sai mau {len(badfig)}")
        for k, v in list(ren.items())[:400]:
            print(f"   {k} -> {v}")
        for m in errs[:10] + dup[:10] + badfig[:10]:
            print("   !", m)
        tong[b] = len(ren)
        if write and (ren or changed_series):
            dump(book, p, raw)
    print("TONG:", tong, "(da ghi)" if write else "(chua ghi; them --ghi)")


if __name__ == "__main__":
    main()
