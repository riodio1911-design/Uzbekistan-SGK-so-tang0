"""Trich 1-2 trang/bai that tu ma HTML cua kimyo8 (ghim), tabiiy5 (bai hoc), adabiyot5 (doc van)
va chuyen sang book.schema.json v0.9.  Chay: python3 -I make_trich.py <R> <schema_dir>
Chi doc file HTML; khong sua gi ngoai <schema_dir>/vi-du/."""
import json, os, re, sys, hashlib, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jx import grab

R, OUT = sys.argv[1], os.path.join(sys.argv[2], "vi-du")
LANGS = ("uz", "ru", "vi", "kaa")

def H(t):
    return "sha256:" + hashlib.sha256(unicodedata.normalize("NFC", t).encode("utf8")).hexdigest()

def i18n(o):
    return {k: o[k] for k in LANGS if isinstance(o, dict) and k in o and isinstance(o[k], str)}

def strip_b64(s):
    return re.sub(r"data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+", "DATA", s)

def save(name, d):
    with open(os.path.join(OUT, name), "w", encoding="utf8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)

# ------------------------------------------------------------------ kimyo8
def kimyo8():
    s = open(f"{R}/fix/kimyo8/index.html", encoding="utf8").read()
    PG, TP, RU = grab(s, "window.PG"), grab(s, "window.TP"), grab(s, "window.RUTXT")
    AUD = grab(s, "window.AUDIO={vi:")   # {"t4-s0":[file,start,dur]}
    CH = grab(s, "const CH")
    pin_kind = {"ex": "exercise", "fig": "figure", "video": "video", "quiz": "quiz", "model": "activity"}
    pages, exercises, figures = [], [], []
    for n in ("21", "37"):
        p = PG[n]
        pg = {"n": int(n), "volume": "tb", "label": n,
              "images": {"uz": f"pages/p{int(n):03d}.jpg", "ru": f"pages_ru/p{int(n):03d}.jpg"},
              "tr": [dict({"box": t["b"], "text": i18n(t["t"])}, **({"heading": True} if t.get("h") else {})) for t in p.get("tr", [])],
              "pins": [], "ocr": {"ru": RU.get(n, [])}}
        for i, e in enumerate(p.get("ex", [])):
            eid = f"p{n}.ex{i}"
            items = []
            for it in e["items"]:
                x = {"label": it.get("l", "")}
                if it.get("q"): x["prompt"] = i18n(it["q"])
                if it.get("open"): x.update(open=True, kind="ex.open_response")
                if "ans" in it: x.update(answer=it["ans"], kind="ex.short_answer")
                if it.get("sol"): x["solution"] = i18n(it["sol"])
                items.append(x)
            kinds = {x.get("kind") for x in items}
            exercises.append({"id": eid, "kind": kinds.pop() if len(kinds) == 1 else "ex.short_answer",
                              "no": e["no"], "page": int(n), "volume": "tb", "box": e["b"], "prompt": i18n(e["q"]),
                              "items": items, "placement": ["modal"],
                              "ai_feedback": {"role": "hint"}})
        for i, f in enumerate(p.get("fig", [])):
            figures.append({"id": f"p{n}.fig{i}", "no": f["no"], "page": int(n), "box": f["b"], "caption": i18n(f["cap"]),
                            "intro": i18n(f["intro"]),
                            "points": [{"x": it["x"], "y": it["y"], "name": i18n(it["name"]), "desc": i18n(it["desc"])} for it in f["items"]]})
        for q in p.get("pin", []):
            k = q["k"]
            ref = (f"p{n}.{k}{q['i']}" if k in ("ex", "fig") else
                   {"video": f"video.{q.get('t')}", "quiz": f"{q.get('t')}.quiz", "model": f"{q.get('t')}.model"}[k])
            pg["pins"].append({"kind": pin_kind[k], "ref": ref, "x": round(q["x"], 2), "y": round(q["y"], 2)})
        pages.append(pg)

    tid = "t4"; t = TP[tid]
    clips, scenes = {}, []
    for i, sc in enumerate(t["video"][:3]):
        cid = f"{tid}-s{i}"
        a = AUD[cid]
        clips[cid] = {"vi": {"file": f"audio_vi/vi_{a[0]}.mp3", "start": a[1], "dur": a[2],
                             "source_hash": H(sc["n"]["vi"]), "text_path": f"/videos/0/scenes/{i}/narration/vi"}}
        v = sc["v"]
        if v["k"] == "img":
            visual = {"type": "sim", "kind": "sim.scene_page_image", "params": {"crop": {"page": v["page"], "box": v["crop"]}}}
        else:
            params = {k: (i18n(val) if isinstance(val, dict) else val) for k, val in v.items() if k != "k"}
            visual = {"type": "sim", "kind": {"cShell": "sim.atom_shells"}[v["k"]], "params": params}
        scenes.append({"title": i18n(sc["t"]), "narration": dict(i18n(sc["n"]), audio_ref=cid), "visual": visual})
    m = t["model"]
    quiz = {"id": f"{tid}.quiz", "kind": "ex.choice_single", "lesson": tid, "placement": ["modal", "chat"],
            "items": [{"prompt": i18n(q["q"]), "options": [i18n(a) if isinstance(a, dict) else {"uz": a} for a in q["a"]], "correct": q["c"]} for q in t["quiz"]]}
    model = {"id": f"{tid}.model", "kind": "ex.sort_bins", "lesson": tid, "prompt": i18n(m["q"]), "placement": ["modal"],
             "bins": [i18n(b) for b in m["bins"]], "cards": [{"text": i18n(c["t"]), "bin": c["bin"]} for c in m["cards"]]}
    ch = CH[0]
    book = {
        "schema_version": "0.9", "book_id": "kimyo8",
        "profile": {"title": {"uz": "Kimyo", "vi": "Hóa học", "ru": "Химия"}, "subject": "chemistry", "grade": 8, "age": "13–14",
                    "grade_band": "8-9", "audience": "hoc_sinh", "lang_base": "uz", "langs": ["uz", "vi", "ru"], "tutor_persona": "robo",
                    "edition": {"authors": ["I.R. Asqarov", "K. G‘opirov", "N.X. To‘xtaboyev"], "print_editions": ["uz", "ru"]},
                    "volumes": [{"id": "tb", "kind": "textbook", "page_count": 208, "first_page": 1}]},
        "units": [{"id": "ch1", "no": 1, "start_page": ch[0], "title": {"uz": ch[1], "vi": ch[2], "ru": ch[3]}}],
        "lessons": [{"id": tid, "unit": "ch1", "sec": t["sec"], "kind": "lesson", "page": t["page"], "title": i18n(t["title"]),
                     "video_refs": [f"video.{tid}"], "exercise_refs": [quiz["id"], model["id"]]}],
        "pages": pages,
        "exercises": exercises + [quiz, model],
        "videos": [{"id": f"video.{tid}", "title": i18n(t["title"]), "lesson": tid, "kind": "lesson", "scenes": scenes}],
        "figures": figures,
        "media": {"fallback_tts": True,
                  "files": [{"path": f"audio_vi/vi_{AUD[f'{tid}-s0'][0]}.mp3", "kind": "audio", "lang": "vi", "voice": "unknown", "used": True}],
                  "clips": clips},
        "teacher": {"edit_role": "admin", "media_overrides": {}},
    }
    save("kimyo8.book-trich.json", book)

# ------------------------------------------------------------------ tabiiy5
def js_obj(s, start):
    """Doc mot literal JS {..} / [..] (khoa khong ngoac, chuoi '..' hoac \"..\") tu vi tri start -> python."""
    i, depth, out, q = start, 0, [], None
    while True:
        c = s[i]
        if q:
            if c == "\\": out.append(s[i:i + 2]); i += 2; continue
            if c == q:
                q = None; out.append('"'); i += 1; continue
            out.append('\\"' if c == '"' else c); i += 1; continue
        if c in "'\"": q = c; out.append('"'); i += 1; continue
        if c in "{[": depth += 1
        if c in "}]":
            depth -= 1
            if depth == 0:
                out.append(c); break
        out.append(c); i += 1
    txt = "".join(out)
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', txt)
    txt = re.sub(r",(\s*[}\]])", r"\1", txt)
    return json.loads(txt)

def tabiiy5():
    s = strip_b64(open(f"{R}/fix2/tabiiy5/index.html", encoding="utf8").read())
    RUD = grab(s, "window.RUDICT")
    def T(o):
        d = i18n(o)
        if "ru" not in d and d.get("uz") in RUD: d["ru"] = RUD[d["uz"]]
        return d
    HOT, SPRITE = grab(s, "HOT ="), grab(s, "SPRITE =")
    WBGEO = grab(s, "window.WBGEO=")
    i = s.index('id: "l11"'); i = s.rfind("{", 0, i)
    L = js_obj(s, i)
    ci = s.index("chapter: {", s.index("window.BOOK =")) + len("chapter: ")
    C = js_obj(s, ci)
    gi = s.index("glossary: [", s.index("window.BOOK =")) + len("glossary: ")
    G = js_obj(s, gi)
    ki = s.index("ACT.key11 = el => sorter(el, ") + len("ACT.key11 = el => sorter(el, ")
    cards = js_obj(s, ki); bins = js_obj(s, s.index("[", s.index("], [", ki) + 1))
    pi = s.index("const PARTS = ") + len("const PARTS = ")
    parts = js_obj(s, pi)

    lid = L["id"]; blocks = []; exercises = []; sims = []; clips = {}
    rub_type = {"objectives": "list", "skills": "list", "think": "prompt", "robot": "prompt", "learn": "text",
                "explore": "text", "video": "video", "quiz": "exercise", "workbook": "workbook_link", "flower": "simulation"}
    for bi, b in enumerate(L["blocks"]):
        t = b["type"]; bid = f"{lid}-{bi}"
        o = {"id": bid, "type": rub_type[t], "rubric": t}
        if "title" in b: o["title"] = T(b["title"])
        if t in ("objectives", "skills"): o["items"] = [T(x) for x in b["items"]]; o["checkable"] = t == "skills"
        if t in ("think", "robot", "workbook"): o["paras"] = [T(b["text"])]
        if t == "explore":
            o["paras"] = [T(x) for x in b["text"]]; o["exercise_refs"] = [b["activity"]]
            exercises.append({"id": b["activity"], "kind": "ex.sort_bins", "lesson": lid, "placement": ["lesson", "modal"],
                              "bins": [T(x["n"]) for x in bins],
                              "cards": [{"text": T(c["n"]), "bin": [x["k"] for x in bins].index(c["bin"])} for c in cards],
                              "data": {"card_images": {c["k"]: c["img"] for c in cards}}})
        if t == "learn":
            o["paras"] = [T(x) for x in b["paras"]]
            if b.get("gallery"): o["gallery"] = [{"src": g["img"], "caption": T(g["cap"])} for g in b["gallery"]]
            if b.get("note"): o["note"] = T(b["note"])
        if t == "video": o["video_ref"] = b["id"]
        if t == "flower":
            o["simulation_ref"] = "flower"
            sims.append({"id": "flower", "kind": "sim.figure_explorer", "lesson": lid,
                         "params": {"viewbox": [80, 60, 500, 500],
                                    "parts": [{"key": p["k"], "name": T(p["n"]), "function": T(p["f"]), "hx": p["hx"], "hy": p["hy"]} for p in parts]}})
        if t == "quiz":
            o["exercise_refs"] = [bid]
            exercises.append({"id": bid, "kind": "ex.choice_single", "lesson": lid, "title": T(b["title"]), "prompt": T(b["prompt"]),
                              "placement": ["lesson", "modal"],
                              "items": [{"prompt": T(q["q"]), "options": [T(a) for a in q["a"]], "correct": q["c"]} for q in b["qs"]]})
        if t == "workbook": o["workbook_ref"] = "a11"
        if f"{lid}-b{bi}-uz" in SPRITE:
            o["audio_ref"] = f"{lid}-b{bi}"
            clips[o["audio_ref"]] = {l: {"file": "audio2/" + SPRITE[f"{lid}-b{bi}-{l}"][0], "start": SPRITE[f"{lid}-b{bi}-{l}"][1],
                                         "dur": SPRITE[f"{lid}-b{bi}-{l}"][2], "text_path": f"/lessons/0/blocks/{bi}"} for l in ("uz", "vi", "ru")}
        blocks.append(o)

    # video v1: canh ve tay draw(p,s,L) -> custom_code; loi thuyet minh lay tu nguon
    vi = s.index("V.v1 = {"); V1 = s[vi:s.index("V.v2", vi)]
    title = js_obj(V1, V1.index("title: ") + len("title: "))
    narr = [js_obj(V1, m.end() - 1) for m in re.finditer(r"\bn: \{", V1)]
    mins = [int(x) for x in re.findall(r"min: (\d+)", V1)]
    scenes = []
    for k, (n, mn) in enumerate(zip(narr, mins)):
        cid = f"v1-s{k}"
        if f"{cid}-uz" in SPRITE:
            clips[cid] = {l: {"file": "audio2/" + SPRITE[f"{cid}-{l}"][0], "start": SPRITE[f"{cid}-{l}"][1], "dur": SPRITE[f"{cid}-{l}"][2],
                              "source_hash": H(T(n)[l]) if l in T(n) else None} for l in ("uz", "vi", "ru")}
            for l in clips[cid]:
                if clips[cid][l]["source_hash"] is None: del clips[cid][l]["source_hash"]
        scenes.append({"narration": dict(T(n), **({"audio_ref": cid} if cid in clips else {})), "min_seconds": mn,
                       "visual": {"type": "sim", "kind": "sim.scene_custom_draw", "params": {"code_ref": f"tabiiy5/index.html#V.v1.scenes[{k}].draw"}}})

    # vo bai tap: muc a11 (trang vo 1) - 2 bai dau + bai trac nghiem t1
    w0 = s.index("WB.chapters[1] = {"); W = s[w0:s.index("WB.chapters[2]", w0)]
    W = re.sub(r"kw: /((?:\\/|[^/\n])+)/[a-z]*", lambda m: "kw: " + json.dumps(m.group(1)), W)
    W = re.sub(r"\bU\('((?:\\'|[^'])*)',\s*'((?:\\'|[^'])*)'\)", lambda m: "{uz:'" + m.group(1) + "',vi:'" + m.group(2) + "'}", W)
    A = js_obj(W, W.index("{ id: 'a11'"))
    wb_ex = []
    for it in A["items"][:2]:
        e = {"id": f"wb.a11.{it['id']}", "lesson": lid, "volume": "wb", "page": A["page"], "placement": ["workbook"]}
        if it["t"] == "open":
            e.update(kind="ex.open_response", prompt=T(it["q"]), ai_feedback={"role": "score", "model_tier": "quick"},
                     items=[{"id": it["id"], "answer_pattern": it["kw"],
                             "hint": it["hint"], "ai_feedback": True}])
        else:
            e.update(kind="ex.table_fill", prompt=T(it["q"]),
                     items=[{"id": f"{it['id']}.{k}", "prompt": T(r["p"]), "correct": r["a"]} for k, r in enumerate(it["rows"])],
                     data={"flowers": [{"src": f["img"], "name": T(f["n"])} for f in it["flowers"]]})
        wb_ex.append(e)
    M = js_obj(W, W.index("{ t: 'mcq', id: 't1'"))
    wb_ex.append({"id": "wb.ch1.t1", "kind": "ex.choice_single", "volume": "wb", "placement": ["workbook"],
                  "items": [{"id": "t1", "prompt": T(M["q"]), "options": [T(x) for x in M["opts"]], "correct": M["a"]}]})

    def pins_of(n):
        km = {"audio": "audio", "video": "video", "act": "activity", "quiz": "quiz", "skills": "skills", "flower": "simulation", "term": "term", "wb": "workbook"}
        out = []
        for h in HOT.get(str(n), []):
            p = {"kind": km[h["k"]], "ref": h["ref"], "x": h["x"], "y": h["y"]}
            if h["k"] == "term": p.update(w=h["w"], h=h["h"])
            out.append(p)
        return out
    g1 = WBGEO["1"]
    wbpage = {"n": 1, "volume": "wb", "images": {"uz": "wbpages/w001.jpg"}, "ink": True,
              "fields": [{"type": "box", "box": b} for b in g1["b"]] + [{"type": "underline", "line": l} for l in g1["l"]]}
    book = {
        "schema_version": "0.9", "book_id": "tabiiy5",
        "profile": {"title": T({"uz": "Tabiiy fanlar", "vi": "Khoa học tự nhiên"}), "subject": "natural science", "grade": 5, "age": "10–11",
                    "grade_band": "5-7", "audience": "hoc_sinh", "lang_base": "uz", "langs": ["uz", "vi", "ru"], "tutor_persona": "robo",
                    "edition": {"year": 2024, "print_editions": ["uz"]},
                    "volumes": [{"id": "tb", "kind": "textbook", "page_count": 142, "first_page": 8},
                                {"id": "wb", "kind": "workbook", "title": {"uz": "Mashq daftari", "vi": "Vở bài tập"}, "page_count": 117, "first_page": 1}]},
        "units": [{"id": "ch1", "no": C["no"], "title": T(C["title"]), "start_page": C["page"], "image": C["img"],
                   "intro": [T(x) for x in C["intro"]], "lesson_refs": [lid]}],
        "lessons": [{"id": lid, "unit": "ch1", "no": L["no"], "page": L["page"], "title": T(L["title"]), "kind": "lesson", "blocks": blocks}],
        "pages": [{"n": n, "volume": "tb", "label": str(n), "images": {"uz": f"pages/p{n:03d}.jpg"}, "pins": pins_of(n)} for n in (9, 10)] + [wbpage],
        "exercises": exercises + wb_ex,
        "simulations": sims,
        "videos": [{"id": "v1", "title": T(title), "lesson": lid, "kind": "clip", "scenes": scenes}],
        "workbook_sets": [{"id": "a11", "no": A["no"], "unit": "ch1", "kind": T(A["kind"]), "title": T(A["title"]), "volume": "wb",
                           "page_range": [A["page"], A["page"]], "lesson": lid, "skills": T(A["skills"]), "need": T(A["need"]),
                           "steps": [T(x) for x in A["steps"]], "exercise_refs": [e["id"] for e in wb_ex[:2]]}],
        "media": {"fallback_tts": False,
                  "files": [{"path": f"audio2/ch1-{l}.mp3", "kind": "audio", "lang": l, "voice": "unknown", "used": True} for l in ("uz", "vi", "ru")]
                           + [{"path": f"audio/ch1-{l}.mp3", "kind": "audio", "lang": l, "voice": "unknown", "used": False} for l in ("uz", "vi", "ru")],
                  "clips": clips},
        "glossary": [{"id": f"g.ch1.{k}", "term": T({"uz": g[0], "vi": g[1]}), "definition": T({"uz": g[2], "vi": g[3]}), "unit": "ch1"} for k, g in enumerate(G[:3])],
        "teacher": {"edit_role": "admin", "media_overrides": {}},
    }
    save("tabiiy5.book-trich.json", book)

# ------------------------------------------------------------------ adabiyot5
def adabiyot5():
    s = strip_b64(open(f"{R}/fix2/adabiyot5/index.html", encoding="utf8").read())
    D, SPR, HOT, LN, GEO = grab(s, "DATA="), grab(s, "SPR="), grab(s, "HOT="), grab(s, "LN_="), grab(s, "GEO=")
    ui, u = 1, D["units"][1]
    PAGE = 8
    sel = [b for b in u["blocks"] if b.get("pg") == PAGE] + [b for b in u["blocks"] if b.get("bid") == "u2.1.7"]
    clips, groups = {}, {}
    def sent(o):
        d = i18n(o)
        if "f" in o and "a" in o:
            cid = f"{o['f']}#{o['a']}"
            for l in ("uz", "vi", "ru"):
                r = SPR.get(l, {}).get(o["f"], [])
                if o["a"] < len(r) and r[o["a"]][2] > 0 and l in d:
                    clips.setdefault(cid, {})[l] = {"file": f"audio/{l}/{o['f']}_{r[o['a']][0]}.mp3", "start": r[o["a"]][1],
                                                    "dur": r[o["a"]][2], "source_hash": H(d[l])}
            if cid in clips:
                d["audio_ref"] = cid
                g = groups.setdefault(o["f"], [None] * (o["a"] + 1))
                if len(g) <= o["a"]: g.extend([None] * (o["a"] + 1 - len(g)))
                g[o["a"]] = cid
        if o.get("na"): d["no_read"] = True
        return d
    def crop(c): return {"page": c[0], "box": c[1:5]}
    blocks, exercises = [], []
    for b in sel:
        t, bid = b["t"], b["bid"]
        o = {"id": bid, "rubric": t, "page": b["pg"]}
        if "title" in b: o["title"] = sent(b["title"])
        if t == "bio": o.update(type="text", paras=[sent(x) for x in b["paras"]], crop=crop(b["crop"]))
        elif t == "poem":
            o.update(type="poem", stanzas=[[sent(x) for x in st] for st in b["stanzas"]])
            if b.get("crop"): o["crop"] = crop(b["crop"])
        elif t == "p":
            o.update(type="text", paras=[sent(x) for x in b["paras"]])
            if b.get("style"): o["style"] = b["style"]
        elif t == "quiz":
            o.update(type="exercise", exercise_refs=[bid], teacher_editable=True)
            exercises.append({"id": bid, "kind": "ex.choice_single", "lesson": "u2.1", "page": b["pg"], "supplementary": True, "teacher_editable": True,
                              "placement": ["on_page", "lesson"],
                              "items": [{"prompt": i18n(q["q"]), "options": [i18n(a) for a in q["a"]], "correct": q["c"]} for q in b["qs"]]})
        elif t == "talk":
            o.update(type="exercise", exercise_refs=[bid])
            exercises.append({"id": bid, "kind": "ex.open_response", "lesson": "u2.1", "page": b["pg"], "placement": ["lesson", "on_page"],
                              "ai_feedback": {"role": "feedback", "context": "preceding_text"},
                              "items": [{"id": f"{bid}.{k}", "prompt": sent(q), "ai_feedback": True} for k, q in enumerate(b["qs"])]})
        blocks.append(o)
    # tieu su (bio) khong co bid trong du lieu -> dat theo quy uoc u2.1.0 (nhu kiem ke)
    anchors = []
    bmap = {id(b): b for b in u["blocks"]}
    for hi, h in enumerate(HOT):
        if h[0] != PAGE or h[3] != ui: continue
        blk = u["blocks"][h[4]]
        key = h[5]
        tgt = (f"{blk['bid']}/title" if key == "t" else
               f"{blk['bid']}/stanzas/{key[0]}/{key[1]}" if isinstance(key, list) else f"{blk['bid']}/paras/{key}")
        anchors.append({"id": f"hot{hi}", "page": h[0], "x": h[1], "y": h[2], "target": tgt})
    page = {"n": PAGE, "label": str(PAGE), "images": {"uz": f"pages/p{PAGE:03d}.jpg"}, "background": f"bg/p{PAGE:03d}.jpg",
            "text_lines": [l for l in LN["pg"][str(PAGE)]],
            "pins": [{"kind": "quiz", "ref": "u2.1.3", "x": 92, "y": GEO["anch"]["u2.1.3"][1]}]
                    + [{"kind": "text_anchor", "ref": a["id"], "x": a["x"], "y": a["y"]} for a in anchors]}
    book = {
        "schema_version": "0.9", "book_id": "adabiyot5",
        "profile": {"title": {"uz": "Adabiyot", "vi": "Văn học", "ru": "Литература"}, "subject": "literature", "grade": 5, "age": "10–11",
                    "grade_band": "5-7", "audience": "hoc_sinh", "lang_base": "uz", "langs": ["uz", "vi", "ru"], "tutor_persona": "oqilbek",
                    "edition": {"part": "I", "year": 2024, "city": "Toshkent", "print_editions": ["uz"],
                                "note": "Ban dich chua qua nguoi ban ngu duyet; audio la giong may (TTS)"},
                    "volumes": [{"id": "tb", "kind": "textbook", "page_count": 98, "first_page": 1}]},
        "units": [{"id": u["id"], "no": u["meta"]["no"], "kind": u["meta"]["kind"], "title": i18n(u["meta"]["title"]),
                   "subtitle": i18n(u["meta"]["sub"]), "page_range": u["meta"]["pages"], "hero": crop(u["meta"]["hero"]), "lesson_refs": ["u2.1"]}],
        "lessons": [{"id": "u2.1", "unit": u["id"], "page_range": u["meta"]["pages"], "title": i18n(u["meta"]["title"]), "blocks": blocks}],
        "pages": [page],
        "print_text": {"width": 581.11, "height": 822.05, "styles": LN["st"]},
        "reading": {"granularity": "sentence", "highlight": "line", "audio_groups": groups, "anchors": anchors},
        "exercises": exercises,
        "media": {"fallback_tts": True,
                  "files": [{"path": f"audio/{l}/u2_p1_0.mp3", "kind": "audio", "lang": l, "voice": "tts", "used": True} for l in ("uz", "vi", "ru")],
                  "clips": clips},
        "glossary": [{"id": f"g.{u['id']}.{k}", "term": {"uz": g["w"]}, "definition": i18n(g["d"]), "short": g.get("tr", {}), "unit": u["id"],
                      "auto_underline": True} for k, g in enumerate(u["gloss"][:3])],
        "teacher": {"edit_role": "admin", "content_overrides": {}, "media_overrides": {}},
    }
    save("adabiyot5.book-trich.json", book)

os.makedirs(OUT, exist_ok=True)
for f in (kimyo8, tabiiy5, adabiyot5):
    f(); print("ok", f.__name__)
