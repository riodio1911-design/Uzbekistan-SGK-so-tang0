#!/usr/bin/env python3
"""Buoc 4 – chuyen TOAN BO matematika5 (fix/matematika5/index.html) sang book.schema v0.9.0.
Dau vao: _work/raw.json do tang0/tri-thuc/_scripts/dump.js sinh (chay script cua sach trong vm, DOM gia).
Chay:  python3 -I convert.py <R>      (R = goc scratchpad)
Ghi:   books/matematika5/book.json, _work/counts_old.json, _work/tu_che_counts.json
Chi doc ngoai books/matematika5/."""
import json, os, re, sys, hashlib, unicodedata, collections as C

R = sys.argv[1]
B = os.path.join(R, "books", "matematika5")
RAW = json.load(open(os.path.join(B, "_work", "raw.json"), encoding="utf8"))
URL_OLD = "https://claude.ai/artifact/KMgpp6evxs3s6mvGSYpyvE"
LANGS = ("uz", "ru", "vi", "kaa")
TC = C.Counter()          # dem cho tu-che.md


def H(t):
    return "sha256:" + hashlib.sha256(unicodedata.normalize("NFC", t).encode("utf8")).hexdigest()


def i18n(o):
    """Chuoi da ngu; chuoi tran (bieu thuc toan, ten rieng – khong phu thuoc ngon ngu) -> {uz: s} (TC2)."""
    if isinstance(o, str):
        TC["TC2_chuoi_trung_tinh"] += 1
        return {"uz": o}
    return {k: o[k] for k in LANGS if isinstance(o, dict) and isinstance(o.get(k), str)}


def keep_str_or_i18n(o):
    return o if isinstance(o, str) else i18n(o)


PG, WBP, TP = RAW["window.PG"], RAW["window.WBP"], RAW["window.TP"]
WBS, WBI, AUD = RAW["window.WBS"], RAW["window.WBI"], RAW["window.AUDIO"]["vi"]
CH, U = RAW["CH"], RAW["U"]
# dump.js chay ca WBS.forEach(...) -> PG[tb].pin da co ghim 'wb' sinh luc chay; bo ra va sinh lai tu WBS (nhu ma goc)
for p in PG.values():
    p["pin"] = [q for q in p["pin"] if q["k"] != "wb"]

roman = ["i", "ii", "iii", "iv"]
book_no = lambda n: roman[n - 1] if n <= 4 else str(n - 4)          # bookNo() – dung cho ca SGK va vo


def ch_of(page):                                                     # chOf()
    c = 0
    for i, x in enumerate(CH):
        if x[0] <= page:
            c = i + 1
    return c


unit_id = lambda page: f"ch{ch_of(page)}" if ch_of(page) else "intro"

# ------------------------------------------------------------------ id ben cho bai tap
NO_TOKEN = {"★": "star"}


def ex_ids(vol, P):
    """(n,i) -> id ben '<p|w><n>.q<so in>'; trung so tren cung trang -> them '-2', '-3' (TC5)."""
    out = {}
    pre = "p" if vol == "tb" else "w"
    for n, p in P.items():
        seen = C.Counter()
        for i, e in enumerate(p["ex"]):
            tok = NO_TOKEN.get(e["no"], re.sub(r"[^A-Za-z0-9]", "", e["no"]) or "x")
            if e["no"] == "★":
                TC["TC6_so_bai_sao"] += 1
            seen[tok] += 1
            eid = f"{pre}{n}.q{tok}" + (f"-{seen[tok]}" if seen[tok] > 1 else "")
            if seen[tok] > 1:
                TC["TC5_trung_so_bai"] += 1
            out[(n, i)] = eid
    return out


IDS = {"tb": ex_ids("tb", PG), "wb": ex_ids("wb", WBP)}


def item_ids(e):
    ids, seen = [], C.Counter()
    for j, it in enumerate(e["items"]):
        base = re.sub(r"[^A-Za-z0-9]", "", it.get("l") or "") or f"i{j + 1}"
        seen[base] += 1
        ids.append(base if seen[base] == 1 else f"{base}-{seen[base]}")
    return ids


OPEN_GRADING = {"mode": "giao_vien", "rule": "giao_vien_review", "teacher_review": True}


def conv_ex(vol, n, i, e):
    eid = IDS[vol][(n, i)]
    iids = item_ids(e)
    items = []
    for j, it in enumerate(e["items"]):
        x = {"id": iids[j], "label": it.get("l", "")}
        if it.get("q") is not None:
            x["prompt"] = i18n(it["q"])
        if it.get("open"):
            x.update(open=True, kind="ex.open_response", grading=dict(OPEN_GRADING))
        if "ans" in it:
            x.update(answer=it["ans"], kind="ex.short_answer")
        if it.get("sol"):
            x["solution"] = i18n(it["sol"])
        items.append(x)
    kinds = {x["kind"] for x in items}
    kind = kinds.pop() if len(kinds) == 1 else "ex.short_answer"
    o = {"id": eid, "legacy_ids": [f"{'p' if vol == 'tb' else 'w'}{n}.ex{i}"], "kind": kind, "no": e["no"],
         "page": int(n), "volume": vol, "box": e["b"], "prompt": i18n(e["q"]), "items": items,
         "placement": ["modal"] if vol == "tb" else ["on_page", "modal", "workbook"],
         "ai_feedback": {"role": "hint", "model_tier": "quick"}}
    if kind == "ex.open_response":
        o["grading"] = dict(OPEN_GRADING)
    tags = []
    if e["no"] == "★": tags.append("TC6")
    if re.search(r"-\d+$", eid): tags.append("TC5")
    if vol == "wb":
        I = WBI.get(n, {})
        if any(len(I.get(f"{i}.{j}", [])) > 1 and not it.get("open") for j, it in enumerate(e["items"])): tags.append("TC1")
        if any(f"{i}.{j}" in I and it.get("open") for j, it in enumerate(e["items"])): tags.append("TC3")
    if tags:
        o["data"] = {"_tu_che": tags}
    return o


def pin_ref(vol, n, q):
    k = q["k"]
    if k == "ex":
        return "exercise", IDS[vol][(n, q["i"])]
    if k == "video":
        return "video", f"video.{q['t']}"
    if k == "quiz":
        return "quiz", f"{q['t']}.quiz"
    if k == "model":
        return "simulation", f"{q['t']}.model"
    raise ValueError(k)


# ------------------------------------------------------------------ trang + bai tap
pages, exercises = [], []
for vol, P, prefix in (("tb", PG, "pages/p"), ("wb", WBP, "wb/w")):
    for n in sorted(P, key=int):
        p = P[n]
        pg = {"n": int(n), "volume": vol, "label": book_no(int(n)),
              "images": {"uz": f"{prefix}{int(n):03d}.jpg"},
              "tr": [dict({"box": t["b"], "text": i18n(t["t"])}, **({"heading": True} if t.get("h") else {})) for t in p["tr"]],
              "pins": []}
        for q in p["pin"]:
            kind, ref = pin_ref(vol, n, q)
            pg["pins"].append({"kind": kind, "ref": ref, "x": round(q["x"], 2), "y": round(q["y"], 2)})
        if vol == "tb":                      # ghim 'wb' sinh tu WBS (ma goc: WBS.forEach -> PG[x.tb].pin.push)
            for x in WBS:
                if x.get("tb") == int(n) and x.get("b"):
                    pg["pins"].append({"kind": "workbook", "ref": x["id"],
                                       "x": round(max(2.5, x["b"][0] - 2.6), 2), "y": round(x["b"][1] + x["b"][3] / 2, 2)})
        for i, e in enumerate(p["ex"]):
            exercises.append(conv_ex(vol, n, i, e))
        if vol == "wb":                      # WBI -> fields
            fields = []
            I = WBI.get(n, {})
            for key in sorted(I, key=lambda s: tuple(map(int, s.split(".")))):
                i, j = map(int, key.split("."))
                e = p["ex"][i]; it = e["items"][j]
                eid = IDS["wb"][(n, i)]; iid = item_ids(e)[j]
                ps = I[key]
                if it.get("open"):
                    TC["TC3_o_mo_tren_trang"] += 1
                    fields.append({"type": "textarea", "box": ps[0][:3], "exercise_ref": eid, "item_key": iid})
                    continue
                for k, f in enumerate(ps):
                    if len(ps) > 1:
                        TC["TC1_o_nhieu_phan"] += 1
                    fields.append({"type": "input", "box": f[:3], "exercise_ref": eid,
                                   "item_key": iid if len(ps) == 1 else f"{iid}/{k}"})
            if fields:
                pg["fields"] = fields
        pages.append(pg)

# ------------------------------------------------------------------ chu de TP -> lessons, videos, quiz, simulations
SIM = {"pv": "sim.place_value", "shift": "sim.decimal_shift", "frac": "sim.fraction_model", "area": "sim.fraction_area",
       "tri": "sim.triangle_area", "cuboid": "sim.cuboid_volume", "ratio": "sim.ratio_bars"}


def params_of(v):
    out = {}
    for k, val in v.items():
        if k == "k":
            continue
        if k == "parts":
            val = [dict(pp, label=i18n(pp["label"])) for pp in val]
        out[k] = val
    return out


def visual(v):
    k = v["k"]
    if k == "img":
        return {"type": "sim", "kind": "sim.scene_page_image",
                "params": {"crop": {"page": v["page"], "volume": "tb", "box": v["crop"]}}}
    if k == "lines":
        return {"type": "sim", "kind": "sim.scene_text_lines",
                "params": {"lines": [keep_str_or_i18n(l) for l in v["lines"]], "delay_s": 1.3}}
    return {"type": "sim", "kind": SIM[k], "params": params_of(v)}


lessons, videos, simulations, clips = [], [], [], {}
tids = sorted(TP, key=lambda t: TP[t]["page"])
for vi_idx, tid in enumerate(tids):
    t = TP[tid]
    les = {"id": tid, "unit": unit_id(t["page"]), "kind": t.get("kind") or "lesson", "page": t["page"],
           "title": i18n(t["title"]), "video_refs": [f"video.{tid}"]}
    scenes = []
    for i, s in enumerate(t["video"]):
        cid = f"{tid}-s{i}"
        nar = i18n(s["n"])
        if cid in AUD:
            a = AUD[cid]
            nar["audio_ref"] = cid
            clips[cid] = {"vi": {"file": f"audio_vi/vi_{a[0]}.mp3", "start": a[1], "dur": a[2],
                                 "source_hash": H(s["n"]["vi"]), "text_path": f"/videos/{vi_idx}/scenes/{i}/narration/vi"}}
        scenes.append({"title": i18n(s["t"]), "narration": nar, "visual": visual(s["v"])})
    videos.append({"id": f"video.{tid}", "title": i18n(t["title"]), "lesson": tid, "kind": "lesson", "scenes": scenes})
    if t.get("quiz"):
        exercises.append({"id": f"{tid}.quiz", "kind": "ex.choice_single", "lesson": tid, "page": t["page"], "volume": "tb",
                          "title": i18n(t["title"]), "placement": ["modal", "chat"],
                          "items": [{"id": f"q{k + 1}", "prompt": i18n(q["q"]), "options": [i18n(a) for a in q["a"]], "correct": q["c"]}
                                    for k, q in enumerate(t["quiz"])]})
        les["exercise_refs"] = [f"{tid}.quiz"]
    if t.get("model"):
        m = t["model"]
        simulations.append({"id": f"{tid}.model", "kind": SIM[m["k"]], "title": i18n(t["title"]), "lesson": tid,
                            "page": t["page"], "params": dict(params_of(m), mode="interactive")})
        les["simulation_refs"] = [f"{tid}.model"]
    lessons.append(les)

# ------------------------------------------------------------------ chuong
units = [{"id": "intro", "no": 0, "title": {"uz": "Kirish · Mundarija"}, "start_page": 1, "page_range": [1, CH[0][0] - 1],
          "lesson_refs": [l["id"] for l in lessons if ch_of(l["page"]) == 0]}]
for i, c in enumerate(CH):
    end = (CH[i + 1][0] - 1) if i + 1 < len(CH) else 176
    units.append({"id": f"ch{i + 1}", "no": i + 1, "title": {"uz": c[1], "vi": c[2], "ru": c[3]}, "start_page": c[0],
                  "page_range": [c[0], end], "lesson_refs": [l["id"] for l in lessons if ch_of(l["page"]) == i + 1]})

# ------------------------------------------------------------------ bo vo WBS
def set_title(x):
    out = {}
    for L in ("uz", "vi", "ru"):
        u = U[L]
        if x.get("rev"):
            head = ("I " if x["rev"] == 1 else "II ") + u["rev"]
        else:
            head = u["wb"]
        s = f"{head} {x['from'] - 4}–{x['to'] - 4}"
        if not x.get("rev"):
            s += f" · {u['lsn']} {x['tb'] - 4}" + ("-bet" if L == "uz" else "")
        out[L] = s
    return out


workbook_sets = []
for x in WBS:
    o = {"id": x["id"], "unit": unit_id(x["tb"]), "volume": "wb", "title": set_title(x), "page_range": [x["from"], x["to"]],
         "exercise_refs": [IDS["wb"][(str(n), i)] for n in range(x["from"], x["to"] + 1) for i in range(len(WBP[str(n)]["ex"]))],
         "item_count": x["n"], "score_scale": 10}
    if x.get("b"):
        o["textbook_pin"] = {"page": x["tb"], "box": x["b"]}
    else:
        o["textbook_pin"] = {"page": x["tb"]}
    if x.get("rev"):
        o["review"] = True
        o["no"] = "I" if x["rev"] == 1 else "II"
    workbook_sets.append(o)

# ------------------------------------------------------------------ media
files = [{"path": "audio_vi/vi_1.mp3", "kind": "audio", "lang": "vi", "voice": "unknown", "bytes": 5960847, "used": True},
         {"path": "audio_vi/vi_2.mp3", "kind": "audio", "lang": "vi", "voice": "unknown", "bytes": 1441559, "used": True}]
files += [{"path": f"pages/p{n:03d}.jpg", "kind": "page_image", "lang": "uz", "used": True} for n in range(1, 177)]
files += [{"path": f"wb/w{n:03d}.jpg", "kind": "page_image", "lang": "uz", "used": True} for n in range(1, 222)]

book = {
    "schema_version": "0.9.0",
    "book_id": "matematika5",
    "profile": {
        "title": {"uz": "Matematika", "vi": "Toán", "ru": "Математика"},
        "subject": "mathematics", "subject_id": "mathematics", "grade": 5, "age": "10–11", "grade_band": "5-7",
        "audience": "hoc_sinh", "lang_base": "uz", "langs": ["uz", "vi", "ru"], "country": "Uzbekistan", "country_code": "UZ",
        "tutor_persona": "robo", "tutor": {"persona": "robo", "subject_scope": "maths questions"},
        "edition": {"series": "AHA! Matematika", "print_editions": ["uz"],
                    "note": "So trang in: 4 trang dau danh so La Ma (i–iv), sau do 1–172 (SGK) / 1–217 (vo) = n − 4. Anh trang 1241×1635 px (ti le 0,759; _tu_che TC7: schema chua co truong ti le anh trang)."},
        "volumes": [
            {"id": "tb", "kind": "textbook", "title": {"uz": "Darslik", "vi": "Sách giáo khoa", "ru": "Учебник"}, "page_count": 176, "first_page": 1},
            {"id": "wb", "kind": "workbook", "title": {"uz": U["uz"]["wb"], "vi": U["vi"]["wb"], "ru": U["ru"]["wb"]}, "page_count": 221, "first_page": 1},
        ],
    },
    "asset_sources": {"self": {"kind": "self", "url": URL_OLD, "role": "page_images", "fallback_base": "",
                                "file_count": 399, "note": "Anh trang + audio giu nguyen ten file cua artifact cu; buoc publish chep server-side."}},
    "grading_defaults": {"short_answer_rule": "accept_v2_math", "order_rule": "per_position"},
    "units": units,
    "lessons": lessons,
    "pages": pages,
    "exercises": exercises,
    "simulations": simulations,
    "videos": videos,
    "workbook_sets": workbook_sets,
    "media": {"fallback_tts": True, "files": files, "clips": clips},
    "glossary": [],
    "teacher": {"edit_role": "can_edit", "assignments": {}, "results": {}, "grades": {}},
    "ui_strings": {k: {"uz": U["uz"][k], "vi": U["vi"][k], "ru": U["ru"][k]} for k in U["uz"]},
}
json.dump(book, open(os.path.join(B, "book.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)

# ------------------------------------------------------------------ so dem cu (doc thang tu du lieu goc)
def cnt(P):
    it = [x for p in P.values() for e in p["ex"] for x in e["items"]]
    return {"pages": len(P), "tr": sum(len(p["tr"]) for p in P.values()), "pins": sum(len(p["pin"]) for p in P.values()),
            "ex": sum(len(p["ex"]) for p in P.values()), "items": len(it), "ans": sum("ans" in x for x in it),
            "open": sum(bool(x.get("open")) for x in it), "sol": sum(bool(x.get("sol")) for x in it),
            "pin_kinds": dict(C.Counter(q["k"] for p in P.values() for q in p["pin"]))}


vk = C.Counter(s["v"]["k"] for t in TP.values() for s in t["video"])
old = {"tb": cnt(PG), "wb": cnt(WBP), "wbs": len(WBS), "wbs_pins": sum(1 for x in WBS if x.get("b")),
       "wbi_pages": len(WBI), "wbi_items": sum(len(v) for v in WBI.values()), "wbi_fields": sum(len(ps) for v in WBI.values() for ps in v.values()),
       "topics": len(TP), "videos": sum(1 for t in TP.values() if t.get("video")), "scenes": sum(len(t["video"]) for t in TP.values()),
       "scene_kinds": dict(vk), "quiz_sets": sum(1 for t in TP.values() if t.get("quiz")),
       "quiz_q": sum(len(t.get("quiz") or []) for t in TP.values()),
       "models": dict(C.Counter(t["model"]["k"] for t in TP.values() if t.get("model"))),
       "audio_vi": len(AUD), "audio_files": sorted({a[0] for a in AUD.values()}), "chapters": len(CH), "ui_keys": len(U["uz"])}
json.dump(old, open(os.path.join(B, "_work", "counts_old.json"), "w"), ensure_ascii=False, indent=1)
json.dump(dict(TC), open(os.path.join(B, "_work", "tu_che_counts.json"), "w"), ensure_ascii=False, indent=1)
print("book.json:", os.path.getsize(os.path.join(B, "book.json")) // 1024, "KB;", len(pages), "trang,", len(exercises), "bai tap,",
      len(videos), "video,", len(simulations), "mo phong,", len(clips), "clip")
print(json.dumps(old, ensure_ascii=False)); print(dict(TC))
