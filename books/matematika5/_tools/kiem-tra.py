#!/usr/bin/env python3
"""Kiem tra books/matematika5 (buoc 4). Chay: python3 -I kiem-tra.py <R>
1 book.json / features.json hop le (JSON Schema 2020-12, nap nhu tang0/schema/kiem-tra.py)
2 moi ex.* / sim.* co trong thu vien; moi gia tri truc trong features co trong tu-dien-truc.json
3 moi pins[].ref, *_ref, *_refs, audio_ref, fields.exercise_ref/item_key tro toi muc co that; id duy nhat
4 D2: khong id theo vi tri, schema_version 0.9.0, ai_feedback.role khong la bi danh cu
5 gia su: dien thu moi vai tro cua prompts.json bang profile cua book.json (ham cua gia-su/kiem-tra-loi-nhac.py)
Ma thoat 0 = dat."""
import json, os, re, sys, importlib.util
from jsonschema import Draft202012Validator

R = sys.argv[1]
T = os.path.join(R, "tang0"); B = os.path.join(R, "books", "matematika5")
load = lambda p: json.load(open(p, encoding="utf8"))
book, feat = load(os.path.join(B, "book.json")), load(os.path.join(B, "features.json"))
errs = []

# 1
for nm, doc in (("book", book), ("features", feat)):
    s = load(os.path.join(T, "schema", f"{nm}.schema.json"))
    Draft202012Validator.check_schema(s)
    e = sorted(Draft202012Validator(s).iter_errors(doc), key=lambda x: list(x.path))
    print(f"[1] {nm}.json: {'HOP LE' if not e else f'{len(e)} LOI'}")
    for x in e[:10]: print("    -", "/".join(map(str, x.path)), x.message[:200])
    errs += [f"{nm}: {x.message[:80]}" for x in e]

# 2
exc = {x["id"] for x in load(os.path.join(T, "thu-vien", "bai-tap", "danh-muc.json"))}
simc = {x["id"] for x in load(os.path.join(T, "thu-vien", "mo-phong", "danh-muc.json"))}
txt = json.dumps(book, ensure_ascii=False) + json.dumps(feat, ensure_ascii=False)
used_ex = set(re.findall(r'"(ex\.[a-z0-9_.]+)"', txt)); used_sim = set(re.findall(r'"(sim\.[a-z0-9_.]+)"', txt))
print(f"[2] ex.* dung {len(used_ex)}: thieu {sorted(used_ex - exc)}; sim.* dung {len(used_sim)}: thieu {sorted(used_sim - simc)}")
errs += [f"ex {x}" for x in used_ex - exc] + [f"sim {x}" for x in used_sim - simc]
TD = load(os.path.join(T, "tu-dien-truc.json"))
dict_vals = set(re.findall(r'"(?:id|ma|value)": "([^"]+)"', json.dumps(TD["truc"], ensure_ascii=False)))
ax = feat["axes"]; vals = []
vals += ax["1"]["values"] + ax["2"]["structure"] + ax["3"] + ax["4"] + ax["5"]["values"] + ax["5"]["rules"] + ax["6"]
vals += ax["7"]["grade_bands"] + ax["7"]["audience"] + [ax["8"]["base"]] + ax["8"]["text"] + list(ax["8"]["audio"].values())
vals += [ax["8"]["audio_granularity"]] + ax["8"]["translation_display"] + [ax["8"]["translation_fill"]] + ax["9"]["flags"]
vals += feat["capabilities"] + [k for k, v in feat["features"].items() if v is True and k not in ("results_local",)] + ["results_local"]
miss = sorted({v for v in vals if v not in dict_vals})
print(f"[2] gia tri truc trong features: {len(set(vals))}, khong co trong tu-dien-truc.json: {miss}")
errs += [f"truc {m}" for m in miss]

# 3
ids = {}
def reg(kind, i):
    if i in ids.setdefault(kind, set()): errs.append(f"id trung {kind}:{i}")
    ids[kind].add(i)
for k in ("exercises", "simulations", "videos", "workbook_sets", "lessons", "units"):
    for x in book.get(k, []): reg(k, x["id"])
clips = set(book["media"]["clips"])
exmap = {x["id"]: x for x in book["exercises"]}
allid = set().union(*ids.values()) | clips
PIN = {"exercise": "exercises", "quiz": "exercises", "video": "videos", "simulation": "simulations", "workbook": "workbook_sets"}
bad = []; npin = nfield = 0
for p in book["pages"]:
    for q in p.get("pins", []):
        npin += 1
        if q.get("ref") not in ids.get(PIN.get(q["kind"], ""), set()): bad.append(f"pin {p['volume']}{p['n']} {q}")
    for f in p.get("fields", []):
        nfield += 1
        e = exmap.get(f["exercise_ref"])
        iid = f["item_key"].split("/")[0]
        if not e or iid not in {it["id"] for it in e["items"]}: bad.append(f"field {p['volume']}{p['n']} {f}")
refs = []
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ("lesson", "unit", "audio_ref", "exercise_ref") and isinstance(v, str): refs.append(v)
            elif k.endswith("_refs") and isinstance(v, list): refs.extend(v)
            else: walk(v)
    elif isinstance(o, list):
        for x in o: walk(x)
walk({k: v for k, v in book.items() if k != "pages"})
bad += [f"ref {r}" for r in refs if r not in allid]
print(f"[3] {npin} ghim, {nfield} o nhap, {len(refs)} tham chieu khac: {len(bad)} tro sai"); [print("    -", b) for b in bad[:10]]
errs += bad

# 4
POS = re.compile(r"(\.(ex|fig)\d+$)|(^g\.[^.]+\.\d+$)")
d2 = []
def w4(o):
    if isinstance(o, dict):
        if isinstance(o.get("id"), str) and POS.search(o["id"]): d2.append(o["id"])
        af = o.get("ai_feedback")
        if isinstance(af, dict) and af.get("role") in ("feedback", "score"): d2.append("role " + af["role"])
        for v in o.values(): w4(v)
    elif isinstance(o, list):
        for v in o: w4(v)
w4(book)
if book["schema_version"] != "0.9.0" or feat["schema_version"] != "0.9.0": d2.append("schema_version")
for k in ("teacher_assign", "teacher_class_results", "results_to_db", "teacher_grading"):
    if feat["features"].get(k) is not True: d2.append("features." + k)
print(f"[4] D2: {'dat' if not d2 else d2[:10]}"); errs += d2

# 5
spec = importlib.util.spec_from_file_location("klh", os.path.join(T, "gia-su", "kiem-tra-loi-nhac.py"))
K = importlib.util.module_from_spec(spec); spec.loader.exec_module(K)
P = load(os.path.join(T, "gia-su", "prompts.json"))
pr = book["profile"]
prof = dict(id=book["book_id"], title=pr["title"]["uz"], subject=pr["subject"], subject_id=pr["subject_id"], grade=pr["grade"],
            age=pr["age"], lang_base=pr["lang_base"], ui_langs=pr["langs"], audience=pr["audience"], country=pr["country"],
            first_lesson_id=book["lessons"][0]["id"], tutor=dict(pr["tutor"]), layers=[],
            pins=[("blue", "explainer video"), ("green", "exercise with automatic checking"), ("red", "interactive model"),
                  ("purple", "quiz"), ("teal", "workbook")])
K.PROFILES[:] = [prof]
n, rows, terr = K.check_fill(P)
for prof_, roles, band, st, perr in rows:
    print(f"[5] gia su: {n} loi nhac dien thu (vai tro {','.join(r['id'] for r in roles)}; cap {band}, luat tuoi {st}): {terr} loi")
    for e in perr[:10]: print("    -", e)
errs += ["gia su"] * terr

print("KET QUA:", "DAT" if not errs else f"CHUA DAT ({len(errs)})")
sys.exit(0 if not errs else 1)
