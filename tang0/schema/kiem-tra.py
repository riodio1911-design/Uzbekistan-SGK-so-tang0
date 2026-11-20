#!/usr/bin/env python3
"""Kiem tra thanh phan Schema tang 0 (v0.9).
Chay: python3 -I kiem-tra.py [R]   (R = goc scratchpad; mac dinh = 2 cap tren thu muc file nay)
1. book.schema.json / features.schema.json hop le theo JSON Schema 2020-12
2. vi-du/*.features.json va vi-du/*.book-trich.json hop le
3. bang-anh-xa.csv: moi dong co schema_path va duong dan ton tai trong schema
4. moi loai_khoi + cau_truc_du_lieu cua 7 ban kiem ke co it nhat mot dong
5. tham chieu noi bo trong ban trich (ref/…_refs) tro toi id co trong ban trich
6. neu thu-vien/bai-tap|mo-phong/danh-muc.json da co: moi kind ex.*/sim.* trong vi-du phai co trong danh muc
7. quyet dinh D2 (v0.9.0): version, id ben, giao bai + ket qua cho ca 7 cuon, asset_sources, vai tro ai_feedback, anchor_id
   + de xuat 015 (dot 1): id bai theo so in dung quy tac (_tools/id_ben.py), khong trung, khong hau to tu dat (-2, _2, b)
   + de xuat 020: tien to '@<nguon>/' chi xet o truong kieu asset_path (images, background, src, path, ...), khong quet chuoi OCR
8. 7 cuon that (R/books/<cuon>/book.json, neu co): hop le theo book.schema + quy tac id cua muc 7
Ma thoat 0 = tieu chi 'Xong khi' dat (muc 1-4, 7 va 8); muc 5-6 chi bao cao."""
import csv, glob, json, os, re, sys
from jsonschema import Draft202012Validator
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "_tools"))
from id_ben import ex_id_ok, FIG_ID_RE  # quy tac id ben (de xuat 015)

HERE = os.path.dirname(os.path.abspath(__file__))
R = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(HERE, "..", ".."))
ok = True
def load(p): return json.load(open(p, encoding="utf8"))

S = {k: load(os.path.join(HERE, f"{k}.schema.json")) for k in ("book", "features")}
for k, s in S.items():
    Draft202012Validator.check_schema(s); print(f"[1] {k}.schema.json: schema hop le")

# 2
for kind in ("features", "book"):
    files = sorted(glob.glob(os.path.join(HERE, "vi-du", f"*.{ 'features' if kind=='features' else 'book-trich'}.json")))
    v = Draft202012Validator(S[kind])
    for f in files:
        errs = sorted(v.iter_errors(load(f)), key=lambda e: list(e.path))
        print(f"[2] {os.path.basename(f)}: {'HOP LE' if not errs else f'{len(errs)} LOI'}")
        for e in errs[:5]: print("     -", "/".join(map(str, e.path)), e.message[:160])
        ok &= not errs

# 3
def resolve(path):
    sch, _, p = path.partition(":")
    node = S[sch]
    if p.startswith("$defs/"):
        return p[6:] in node["$defs"]
    for part in [x for x in p.split("/") if x]:
        # di qua $ref
        while "$ref" in node: node = S[sch]["$defs"][node["$ref"].split("/")[-1]]
        if part == "*":
            node = node.get("items") or node.get("additionalProperties")
        else:
            node = node.get("properties", {}).get(part)
        if node is None: return False
    return True

rows = list(csv.DictReader(open(os.path.join(HERE, "bang-anh-xa.csv"), encoding="utf8")))
empty = [r for r in rows if not r["schema_path"].strip()]
bad = [r for r in rows if r["schema_path"].strip() and not resolve(r["schema_path"].strip())]
print(f"[3] bang-anh-xa.csv: {len(rows)} dong; co schema_path {len(rows)-len(empty)}/{len(rows)} "
      f"({100*(len(rows)-len(empty))/len(rows):.0f}%); duong dan khong ton tai: {len(bad)}")
for r in bad: print("     -", r["book"], r["ma_goc"], r["schema_path"])
ok &= not empty and not bad

# 4
miss = []
have = {(r["book"], r["ma_goc"]) for r in rows}
for f in sorted(glob.glob(os.path.join(R, "kiem-ke", "*.json"))):
    inv = load(f); b = inv["ma_cuon"]
    for n in [d["ten"] for d in inv["cau_truc_du_lieu"]] + [k["ma"] for k in inv["loai_khoi"]]:
        if (b, n) not in have: miss.append((b, n))
tot = sum(len(load(f)["cau_truc_du_lieu"]) + len(load(f)["loai_khoi"]) for f in glob.glob(os.path.join(R, "kiem-ke", "*.json")))
print(f"[4] do phu kiem ke: {tot-len(miss)}/{tot} ma goc co dong" + ("" if not miss else f"; thieu {miss}"))
ok &= not miss

# 5
for f in sorted(glob.glob(os.path.join(HERE, "vi-du", "*.book-trich.json"))):
    d = load(f)
    ids = set()
    for coll in ("exercises", "simulations", "videos", "figures", "workbook_sets", "glossary", "lessons", "units"):
        ids |= {x.get("id") for x in d.get(coll, [])}
    ids |= set(d.get("media", {}).get("clips", {}))
    ids |= {a["id"] for a in d.get("reading", {}).get("anchors", []) if "id" in a}
    for l in d.get("lessons", []):
        ids |= {b.get("id") for b in l.get("blocks", [])}
    ids |= {g["term"]["uz"] for g in d.get("glossary", [])}
    refs = []
    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("ref", "video_ref", "figure_ref", "simulation_ref", "workbook_ref", "audio_ref", "exercise_ref", "lesson", "unit"):
                    if isinstance(v, str): refs.append(v)
                elif k.endswith("_refs") and isinstance(v, list): refs.extend(v)
                walk(v)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(d)
    ext = sorted({r for r in refs if r not in ids})
    print(f"[5] {os.path.basename(f)}: {len(refs)} tham chieu, {len(refs)-sum(r in ext for r in refs)} trong ban trich, "
          f"ngoai ban trich: {ext[:8]}{' ...' if len(ext) > 8 else ''}")

# 6
used = {"ex": set(), "sim": set()}
for f in glob.glob(os.path.join(HERE, "vi-du", "*.json")):
    for m in re.finditer(r'"(ex|sim)\.([a-z0-9_]+)"', open(f, encoding="utf8").read()):
        used[m.group(1)].add(f"{m.group(1)}.{m.group(2)}")
for key, sub in (("ex", "bai-tap"), ("sim", "mo-phong")):
    p = os.path.join(R, "tang0", "thu-vien", sub, "danh-muc.json")
    if not os.path.exists(p):
        print(f"[6] {sub}/danh-muc.json chua co -> {len(used[key])} id {key}.* trong vi-du la ID TAM: {sorted(used[key])}")
        continue
    cat = {x.get("id") for x in load(p)}
    miss6 = sorted(used[key] - cat)
    print(f"[6] doi chieu {sub}/danh-muc.json: {len(used[key])-len(miss6)}/{len(used[key])} id co trong danh muc; thieu: {miss6}")

# 7 – quyet dinh D2 (v0.9.0)
d2 = []
for k, sch in S.items():
    if sch.get("version") not in ("0.9.0", "0.10.0"): d2.append(f"{k}.schema.json: version khong hop le")
for f in sorted(glob.glob(os.path.join(HERE, "vi-du", "*.features.json"))):
    x = load(f); n = os.path.basename(f)
    if x.get("schema_version") not in ("0.9.0", "0.10.0"): d2.append(f"{n}: schema_version khong hop le")
    fe = x.get("features", {})
    for key in ("teacher_assign", "teacher_class_results", "results_to_db", "teacher_grading"):
        if fe.get(key) is not True: d2.append(f"{n}: features.{key} phai true (D2 quyet dinh 3)")
    if "classroom" not in x: d2.append(f"{n}: thieu classroom (D2 quyet dinh 3)")
    if "giao_vien" not in x["axes"]["5"]["values"]: d2.append(f"{n}: truc 5 thieu giao_vien (D2 quyet dinh 3)")
    if "ket_qua_chi_localstorage" in x["axes"]["9"].get("flags", []): d2.append(f"{n}: con co ket_qua_chi_localstorage")
POS = re.compile(r"(\.(ex|fig)\d+$)|(^g\.[^.]+\.\d+$)")
# 020: chi cac truong kieu $defs/asset_path (khong quet chuoi OCR/van ban – kimyo8 tr.72 co "@," trong OCR)
ASSET_KEYS = {"images", "background", "background_src", "src", "img", "image", "path", "file", "poster", "avatar", "cover"}
def asset_strings(o, path="", key=None):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ("ocr", "text", "tr", "text_lines", "prompt", "narration"): continue
            yield from asset_strings(v, f"{path}/{k}", k if k in ASSET_KEYS or key == "images" else None)
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from asset_strings(v, f"{path}/{i}", key)
    elif isinstance(o, str) and key and o.startswith("@"):
        yield path, o
# 015: quy tac id ben cho bai theo so in + hinh; khong trung id trong cung tap hop
def id_rule_errors(x):
    e = []
    for coll in ("exercises", "figures", "simulations", "videos"):
        ids = [y.get("id") for y in x.get(coll, [])]
        e += [f"{coll}: id trung '{i}'" for i in sorted({i for i in ids if ids.count(i) > 1})]
    for y in x.get("exercises", []): e += ex_id_ok(y)
    for y in x.get("figures", []):
        if re.match(r"^p\d+\.", y["id"]) and not FIG_ID_RE.match(y["id"]): e.append(f"hinh '{y['id']}' khong dung mau p<n>.rasm<so> | p<n>.rasm_<slug>")
    return e
for f in sorted(glob.glob(os.path.join(HERE, "vi-du", "*.book-trich.json"))):
    x = load(f); n = os.path.basename(f)
    if x.get("schema_version") not in ("0.9.0", "0.10.0"): d2.append(f"{n}: schema_version khong hop le")
    srcs = set((x.get("asset_sources") or {}).keys())
    anchors = {a.get("id") for a in (x.get("reading") or {}).get("anchors", [])}
    def walk(o, path=""):
        if isinstance(o, dict):
            if isinstance(o.get("id"), str) and POS.search(o["id"]): d2.append(f"{n}{path}: id theo vi tri '{o['id']}' (D2: dung id ben, id cu vao legacy_ids)")
            r = (o.get("ai_feedback") or {}).get("role") if isinstance(o.get("ai_feedback"), dict) else None
            if r in ("feedback", "score"): d2.append(f"{n}{path}: ai_feedback.role '{r}' la bi danh cu")
            for k, v in o.items(): walk(v, f"{path}/{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o): walk(v, f"{path}/{i}")
    walk(x)
    for path, o in asset_strings(x):
        src = o[1:].split("/", 1)[0]
        if src not in srcs: d2.append(f"{n}{path}: tien to @{src} khong co trong asset_sources")
    d2.extend(f"{n}: {m}" for m in id_rule_errors(x))
    for p in x.get("pages", []):
        for l in p.get("text_lines", []):
            if len(l) == 8 and l[7] is not None and l[7] not in anchors: d2.append(f"{n}: text_lines anchor_id '{l[7]}' khong co trong reading.anchors")
print(f"[7] quyet dinh D2: {'dat' if not d2 else f'{len(d2)} loi'}")
for e in d2[:20]: print("     -", e)
ok &= not d2

# 8 – 7 cuon that
vb = Draft202012Validator(S["book"])
for f in sorted(glob.glob(os.path.join(R, "books", "*", "book.json"))):
    x = load(f); n = f.split(os.sep)[-2]
    errs = list(vb.iter_errors(x))
    srcs = set((x.get("asset_sources") or {}).keys())
    e8 = [f"{'/'.join(map(str, er.path))[:70]}: {er.message[:110]}" for er in errs[:5]]
    e8 += [f"{p}: tien to @{o[1:].split('/', 1)[0]} khong co trong asset_sources" for p, o in asset_strings(x) if o[1:].split("/", 1)[0] not in srcs][:5]
    e8 += id_rule_errors(x)
    pos = [y["id"] for c in ("exercises", "figures") for y in x.get(c, []) if POS.search(y["id"])]
    e8 += [f"id theo vi tri '{i}'" for i in pos[:5]]
    print(f"[8] {n}: {'HOP LE' if not e8 else f'{len(errs)} loi schema, {len(e8)} loi'}; "
          f"{len(x.get('exercises', []))} bai, {sum(1 for y in x.get('exercises', []) if 'series' in y)} co series")
    for m in e8[:10]: print("     -", m)
    ok &= not e8

print("KET QUA:", "DAT" if ok else "CHUA DAT")
sys.exit(0 if ok else 1)
