#!/usr/bin/env python3
"""Kiem tra gia tri 9 truc o moi thanh phan tang 0 co trong tu-dien-truc.json.
Chay:  python3 -I kiem-tra-truc.py                  -> bao loi, ma thoat 1 neu co loi
       python3 -I kiem-tra-truc.py --cap-nhat-nguon -> ghi lai truong `nguon` cua tu dien theo noi dang dung
Quet: schema/features.schema.json, schema/book.schema.json, schema/vi-du/*.json, thu-vien/bai-tap/danh-muc.json,
      thu-vien/mo-phong/danh-muc.json, tri-thuc/rubric-bo-sach.json, tri-thuc/thuat-ngu.json, gia-su/prompts.json,
      nha-may-media/danh-muc-loai-media.json, giao-dien/tokens.json (hai muc cuoi them o D2).
Loi = gia tri khong co trong tu dien (neu la bi_danh thi goi y id chuan), truong cap lop sai ten, enum schema lech tu dien."""
import glob, importlib.util, io, json, os, sys
from collections import defaultdict
from contextlib import redirect_stdout

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(HERE, ".."))
TD = os.path.join(R, "tu-dien-truc.json")
DICT = json.load(open(TD, encoding="utf8"))
T = DICT["truc"]

def load(rel): return json.load(open(os.path.join(R, rel), encoding="utf8"))

IDS = {a: {v["id"]: v for v in t["gia_tri"]} for a, t in T.items()}
ALIAS = defaultdict(dict)
for a, t in T.items():
    for v in t["gia_tri"]:
        for b in v.get("bi_danh", []):
            ALIAS[a].setdefault(b, []).append(v["id"])
def grp(a, nhom, co=None):
    return {i for i, v in IDS[a].items() if v.get("nhom") == nhom and (co is None or v.get(co))}

ERR, WARN = [], []
USED = defaultdict(set)      # (truc, id) -> {thanh phan}

def chk(axis, val, where, comp, allowed=None, label=None):
    """allowed: tap id hop le (mac dinh moi id cua truc)."""
    ok_set = allowed if allowed is not None else set(IDS[axis])
    if isinstance(val, str) and val in ok_set:
        USED[(axis, val)].add(comp); return
    hint = ""
    if val in ALIAS.get(axis, {}): hint = f" (bi_danh cu -> dung {', '.join(ALIAS[axis][val])})"
    elif val in IDS[axis]: hint = f" (co trong truc {axis} nhung sai nhom: {IDS[axis][val].get('nhom')}, cho phep nhom {label})"
    ERR.append(f"{where}: truc {axis} gia tri '{val}' khong co trong tu dien{hint}")

def walk_axes(o, where, comp, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == "axes" and isinstance(v, dict):
                for a, vals in v.items():
                    if a not in T: ERR.append(f"{where}{path}: truc '{a}' khong ton tai"); continue
                    for x in (vals if isinstance(vals, list) else [vals]):
                        chk(a, x, f"{where}{path}.axes.{a}", comp)
            else:
                walk_axes(v, where, comp, f"{path}.{k}" if not path or not path.endswith("]") else f"{path}.{k}")
    elif isinstance(o, list):
        for i, x in enumerate(o):
            tag = x.get("id") if isinstance(x, dict) and isinstance(x.get("id"), str) else i
            walk_axes(x, where, comp, f"{path}[{tag}]")

def no_old_field(o, where, names=("age_levels", "age_level", "age_band", "age_bands")):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in names: ERR.append(f"{where}: truong cu '{k}' -> doi thanh grade_bands (cap LOP)")
            no_old_field(v, where, names)
    elif isinstance(o, list):
        for x in o: no_old_field(x, where, names)

# ---- 0. tu dien tu than
for a, t in T.items():
    seen = set()
    for v in t["gia_tri"]:
        if v["id"] in seen: ERR.append(f"tu-dien truc {a}: id trung {v['id']}")
        seen.add(v["id"])
        for k in ("uz", "ru", "vi"):
            if not v.get("ten", {}).get(k): ERR.append(f"tu-dien truc {a} {v['id']}: thieu ten.{k}")
        if "mo_ta" not in v: ERR.append(f"tu-dien truc {a} {v['id']}: thieu mo_ta")
        if v.get("nhom") not in t["nhom"]: ERR.append(f"tu-dien truc {a} {v['id']}: nhom '{v.get('nhom')}' chua khai bao")
    for b in ALIAS[a]:
        if b in IDS[a]: ERR.append(f"tu-dien truc {a}: bi_danh '{b}' trung id chuan")

def axis_of(path):
    if "grading" in path: return "5"
    if "reader_langs" in path or "lang" in path: return "8"
    if "capabilities" in path: return "9"
    if "grade_band" in path or "audience" in path: return "7"
    return path.split("/axes/properties/")[1].split("/")[0]

# ---- 1. schema enum (dung lai sinh-enum.py --kiem)
spec = importlib.util.spec_from_file_location("sinh_enum", os.path.join(HERE, "sinh-enum.py"))
se = importlib.util.module_from_spec(spec); spec.loader.exec_module(se)
for f in ("features", "book"):
    doc = load(f"schema/{f}.schema.json")
    for ff, path, vals in se.DICH:
        if ff != f: continue
        cur = se.node(doc, path).get("enum")
        if cur != vals:
            for x in (cur or []):
                if x not in vals: ERR.append(f"schema/{f}.schema.json:{path}: enum co '{x}' khong co trong tu dien (chay sinh-enum.py)")
            if set(cur or []) == set(vals): ERR.append(f"schema/{f}.schema.json:{path}: enum lech thu tu/thieu so voi tu dien (chay sinh-enum.py)")
            for x in vals:
                if x not in (cur or []): ERR.append(f"schema/{f}.schema.json:{path}: thieu '{x}' (chay sinh-enum.py)")
        for x in (cur or []):
            USED[(axis_of(path), x)].add(f"{f}.schema")
fs = load("schema/features.schema.json")
if se.node(fs, se.PATTERN4[1]).get("pattern") != T["4"]["pattern"]:
    ERR.append("features.schema.json: pattern truc 4 lech tu dien")
keys = set(fs["properties"]["features"]["properties"])
for k in keys - grp("9", "tinh_nang"): ERR.append(f"features.schema.json:properties.features.{k}: khong co trong truc 9 nhom tinh_nang")
for k in keys & grp("9", "tinh_nang"): USED[("9", k)].add("features.schema")
for k in grp("9", "tinh_nang") - keys: ERR.append(f"tu-dien truc 9 tinh_nang '{k}' khong co trong features.schema.json")
book = load("schema/book.schema.json")
no_old_field(book, "schema/book.schema.json")

# ---- 2. vi-du features
for f in sorted(glob.glob(os.path.join(R, "schema/vi-du/*.features.json"))):
    rel = os.path.relpath(f, R); d = json.load(open(f, encoding="utf8")); ax = d["axes"]; c = "vi-du"
    W = lambda p: f"{rel}:axes.{p}"
    G = [("1", ax["1"]["values"], "1", "ban_in", None), ("2.structure", ax["2"]["structure"], "2", "cau_truc", None),
         ("3", ax["3"], "3", "noi_dung", None), ("5.values", ax["5"]["values"], "5", "che_do", None),
         ("5.rules", ax["5"].get("rules", []), "5", "quy_tac", None), ("6", ax["6"], "6", "tuong_tac", None),
         ("7.grade_bands", ax["7"]["grade_bands"], "7", "cap_lop", None), ("7.audience", ax["7"]["audience"], "7", "doi_tuong", None),
         ("7.reader_langs", ax["7"].get("reader_langs", []), "8", "ngon_ngu", None),
         ("8.base", [ax["8"]["base"]], "8", "ngon_ngu", "ngon_ngu_ban_in"), ("8.text", ax["8"]["text"], "8", "ngon_ngu", None),
         ("8.print_editions", ax["8"].get("print_editions", []), "8", "ngon_ngu", "ngon_ngu_ban_in"),
         ("8.audio(keys)", list(ax["8"].get("audio", {})), "8", "ngon_ngu", None),
         ("8.audio(values)", list(ax["8"].get("audio", {}).values()), "8", "nguon_audio", None),
         ("8.audio_granularity", [ax["8"]["audio_granularity"]] if "audio_granularity" in ax["8"] else [], "8", "do_min_audio", None),
         ("8.translation_display", ax["8"].get("translation_display", []), "8", "hien_thi_dich", None),
         ("8.translation_fill", [ax["8"]["translation_fill"]] if "translation_fill" in ax["8"] else [], "8", "cach_dich", None),
         ("9.flags", ax["9"].get("flags", []), "9", "rang_buoc", None)]
    for p, vals, a, g, co in G:
        for x in vals: chk(a, x, W(p), c, grp(a, g, co), g)
    for x in ax["4"]: chk("4", x, W("4"), c)
    for x in d.get("capabilities", []): chk("9", x, f"{rel}:capabilities", c, grp("9", "capability"), "capability")
    for x in d.get("features", {}): chk("9", x, f"{rel}:features", c, grp("9", "tinh_nang"), "tinh_nang")
    for x in d.get("classroom", {}).get("teacher_grading_modes", []): chk("5", x, f"{rel}:classroom.teacher_grading_modes", c, grp("5", "che_do"), "che_do")
    rs = ax["2"].get("rubric_set")
    for code in ax["2"].get("rubrics", []):
        key = f"{rs}:{code}"
        hit = [v["id"] for v in T["2"]["gia_tri"] if key in v.get("ma_goc", [])]
        if not hit: ERR.append(f"{W('2.rubrics')}: ma goc '{code}' (bo {rs}) khong anh xa toi khai niem nao (them vao ma_goc trong tu dien)")
        for h in hit: USED[("2", h)].add(c)
for f in sorted(glob.glob(os.path.join(R, "schema/vi-du/*.book-trich.json"))):
    rel = os.path.relpath(f, R); d = json.load(open(f, encoding="utf8")); pr = d.get("profile", {})
    chk("7", pr.get("grade_band"), f"{rel}:profile.grade_band", "vi-du", grp("7", "cap_lop"), "cap_lop")
    chk("7", pr.get("audience"), f"{rel}:profile.audience", "vi-du", grp("7", "doi_tuong", "doi_tuong_sach"), "doi_tuong_sach")
    for x in pr.get("langs", []): chk("8", x, f"{rel}:profile.langs", "vi-du", grp("8", "ngon_ngu"), "ngon_ngu")
    no_old_field(d, rel)

# ---- 3. thu vien bai tap
rel = "thu-vien/bai-tap/danh-muc.json"; cat = load(rel)
walk_axes(cat, rel, "bai-tap"); no_old_field(cat, rel)
ex_ids = {e["id"] for e in cat}
if ex_ids != set(IDS["4"]): ERR.append(f"truc 4 lech danh muc bai tap: thua {sorted(set(IDS['4']) - ex_ids)}, thieu {sorted(ex_ids - set(IDS['4']))}")
for e in cat:
    for k in ("observed", "suggested"):
        for x in e.get("grade_bands", {}).get(k, []): chk("7", x, f"{rel}[{e['id']}].grade_bands.{k}", "bai-tap", grp("7", "cap_lop"), "cap_lop")
    for x in e.get("grading", {}).get("modes", []): chk("5", x, f"{rel}[{e['id']}].grading.modes", "bai-tap", grp("5", "che_do"), "che_do")
    a4 = e.get("axes", {}).get("4")
    if a4 is not None and a4 != [e["id"]]: WARN.append(f"{rel}[{e['id']}]: axes.4 = {a4} (quy uoc: chinh id cua muc)")

# ---- 4. thu vien mo phong
rel = "thu-vien/mo-phong/danh-muc.json"; cat = load(rel)
walk_axes(cat, rel, "mo-phong"); no_old_field(cat, rel)
for e in cat:
    for x in e.get("grade_bands", []): chk("7", x, f"{rel}[{e['id']}].grade_bands", "mo-phong", grp("7", "cap_lop"), "cap_lop")

# ---- 5. tri thuc
rel = "tri-thuc/rubric-bo-sach.json"; rb = load(rel)
walk_axes(rb, rel, "rubric-bo-sach")
cids = {c["id"] for c in rb["concepts"]}
k2 = grp("2", "khai_niem")
for x in cids - k2: ERR.append(f"{rel}: khai niem '{x}' chua co trong tu dien truc 2 (them muc moi, bang mo rong)")
for x in k2 - cids: ERR.append(f"tu-dien truc 2: khai niem '{x}' khong co trong {rel}")
rel = "tri-thuc/thuat-ngu.json"; walk_axes(load(rel), rel, "thuat-ngu")

# ---- 6. gia su
rel = "gia-su/prompts.json"; P = load(rel)
walk_axes(P, rel, "prompts"); no_old_field(P, rel)
for ar in P.get("age_rules", []):
    if ar.get("grade_band") is None:
        chk("7", ar.get("audience"), f"{rel}:age_rules[audience]", "prompts", grp("7", "doi_tuong"), "doi_tuong")
    else:
        chk("7", ar["grade_band"], f"{rel}:age_rules[].grade_band", "prompts", grp("7", "cap_lop"), "cap_lop")
for x in P["params"]["audience"]["enum"]: chk("7", x, f"{rel}:params.audience.enum", "prompts", grp("7", "doi_tuong", "doi_tuong_sach"), "doi_tuong_sach")
for x in P.get("audiences", {}): chk("7", x, f"{rel}:audiences", "prompts", grp("7", "doi_tuong"), "doi_tuong")
for r in P.get("roles", []):
    for x in r.get("audiences", []): chk("7", x, f"{rel}:roles[{r['id']}].audiences", "prompts", grp("7", "doi_tuong"), "doi_tuong")
for pz in P.get("personas", []):
    for x in pz.get("grade_bands_seen", []): chk("7", x, f"{rel}:personas[{pz['id']}].grade_bands_seen", "prompts", grp("7", "cap_lop"), "cap_lop")
for x in P.get("languages", {}): chk("8", x, f"{rel}:languages", "prompts", grp("8", "ngon_ngu"), "ngon_ngu")

# ---- 7. nha may media + giao dien (them o D2, v0.9.0)
rel = "nha-may-media/danh-muc-loai-media.json"; M = load(rel)
walk_axes(M, rel, "nha-may-media")
for x in M.get("items", []):
    if x.get("de_xuat_truc_moi"): ERR.append(f"{rel}[{x['id']}]: con de_xuat_truc_moi (D2 da duyet -> dua vao axes + tu dien)")
    for gb in x.get("grade_bands", []): chk("7", gb, f"{rel}[{x['id']}].grade_bands", "nha-may-media", grp("7", "cap_lop"), "cap_lop")
rel = "giao-dien/tokens.json"; walk_axes(load(rel), rel, "giao-dien")
for f in sorted(glob.glob(os.path.join(R, "schema/vi-du/*.book-trich.json"))):
    rel = os.path.relpath(f, R)
    def _g(o):
        if isinstance(o, dict):
            g = o.get("grading")
            if isinstance(g, dict) and "mode" in g: chk("5", g["mode"], f"{rel}:grading.mode", "vi-du", grp("5", "che_do"), "che_do")
            for v in o.values(): _g(v)
        elif isinstance(o, list):
            for v in o: _g(v)
    _g(json.load(open(f, encoding="utf8")))

# ---- nguon
stale = 0
for a, t in T.items():
    for v in t["gia_tri"]:
        new = sorted(USED.get((a, v["id"]), set()))
        if v.get("nguon") != new: stale += 1; v["nguon"] = new
unused = [f"{a}:{v['id']}" for a, t in T.items() for v in t["gia_tri"] if not v["nguon"]]
if "--cap-nhat-nguon" in sys.argv:
    json.dump(DICT, open(TD, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"Da cap nhat nguon cho {stale} gia tri.")
elif stale:
    WARN.append(f"{stale} gia tri co truong nguon cu (chay --cap-nhat-nguon)")

print("So gia tri chuan moi truc:", {a: len(t["gia_tri"]) for a, t in T.items()})
print(f"Gia tri trong tu dien chua thanh phan nao dung: {len(unused)} {unused}")
for w in WARN: print("CANH BAO:", w)
for e in ERR: print("LOI:", e)
print(f"KET QUA: {len(ERR)} loi, {len(WARN)} canh bao -> {'DAT' if not ERR else 'CHUA DAT'}")
sys.exit(1 if ERR else 0)
