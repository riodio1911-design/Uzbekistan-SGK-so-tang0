#!/usr/bin/env python3
"""Sinh doi-chieu.json: so dem cu (_work/counts_old.json, dem tu du lieu goc) vs moi (dem tu book.json).
Chay: python3 -I doi-chieu.py <R>.  'moi' = bieu dien day du bang schema; 'tu_che' = da dua vao book.json nhung theo cach
tam (muc trong tu-che.md, co danh dau _tu_che hoac quy uoc ghi o tu-che.md). lech = cu - moi - tu_che."""
import json, os, sys, collections as C

R = sys.argv[1]; B = os.path.join(R, "books", "matematika5")
o = json.load(open(os.path.join(B, "_work", "counts_old.json")))
b = json.load(open(os.path.join(B, "book.json"), encoding="utf8"))
P = {v: [p for p in b["pages"] if p["volume"] == v] for v in ("tb", "wb")}
EX = {v: [e for e in b["exercises"] if e.get("volume") == v and not e["id"].endswith(".quiz")] for v in ("tb", "wb")}
quiz = [e for e in b["exercises"] if e["id"].endswith(".quiz")]
items = lambda v: [it for e in EX[v] for it in e["items"]]
pk = lambda v: C.Counter(q["kind"] for p in P[v] for q in p.get("pins", []))
fields = [f for p in P["wb"] for f in p.get("fields", [])]
scenes = [s for v in b["videos"] for s in v["scenes"]]
sk = C.Counter(s["visual"]["kind"] for s in scenes)
simk = C.Counter(s["kind"] for s in b["simulations"])
clips = b["media"]["clips"]
tagged = lambda t: sum(1 for e in b["exercises"] if t in (e.get("data") or {}).get("_tu_che", []))

SK = {"lines": "sim.scene_text_lines", "img": "sim.scene_page_image", "pv": "sim.place_value", "shift": "sim.decimal_shift",
      "frac": "sim.fraction_model", "area": "sim.fraction_area", "tri": "sim.triangle_area", "cuboid": "sim.cuboid_volume", "ratio": "sim.ratio_bars"}
rows = []
def row(muc, cu, moi, tu_che=0, nguon="", ghi_chu=""):
    rows.append({"muc": muc, "cu": cu, "moi": moi, "tu_che": tu_che, "lech": cu - moi - tu_che, "nguon_cu": nguon, "ghi_chu": ghi_chu})

row("trang SGK (anh + du lieu)", o["tb"]["pages"], len(P["tb"]), nguon="window.PG", ghi_chu="pages[] volume=tb")
row("trang vo bai tap", o["wb"]["pages"], len(P["wb"]), nguon="window.WBP", ghi_chu="pages[] volume=wb")
row("anh trang (file)", 397, sum(1 for f in b["media"]["files"] if f["kind"] == "page_image"), nguon="pages/ + wb/ cua artifact cu", ghi_chu="giu nguyen ten file")
row("vung dich SGK", o["tb"]["tr"], sum(len(p["tr"]) for p in P["tb"]), nguon="PG[].tr")
row("vung dich vo", o["wb"]["tr"], sum(len(p["tr"]) for p in P["wb"]), nguon="WBP[].tr")
for k, nk in (("ex", "exercise"), ("video", "video"), ("quiz", "quiz"), ("model", "simulation")):
    row(f"ghim SGK '{k}'", o["tb"]["pin_kinds"].get(k, 0), pk("tb")[nk], nguon="PG[].pin", ghi_chu=f"pins kind={nk}")
row("ghim SGK 'wb' (sinh tu WBS luc chay)", o["wbs_pins"], pk("tb")["workbook"], nguon="WBS[].b", ghi_chu="pins kind=workbook, toa do nhu ma goc")
row("ghim vo 'ex'", o["wb"]["pin_kinds"]["ex"], pk("wb")["exercise"], nguon="WBP[].pin")
tagged_tb = sum(1 for e in EX["tb"] if (e.get("data") or {}).get("_tu_che"))
row("bai tap SGK", o["tb"]["ex"], len(EX["tb"]) - tagged_tb, tagged_tb, nguon="PG[].ex", ghi_chu="tu_che = bai co id theo quy uoc tam (TC5 trung so tren trang, TC6 so '★'); noi dung day du")
tagged_wb = sum(1 for e in EX["wb"] if (e.get("data") or {}).get("_tu_che"))
row("bai tap vo", o["wb"]["ex"], len(EX["wb"]) - tagged_wb, tagged_wb, nguon="WBP[].ex", ghi_chu="tu_che = bai co o nhieu phan (TC1) / o mo tren trang (TC3) / so '★' (TC6)")
row("y dien dap so – SGK, modal (ex.short_answer)", o["tb"]["ans"], sum(1 for it in items("tb") if it.get("kind") == "ex.short_answer"), nguon="PG items.ans")
row("y dien dap so – vo, o tren trang (ex.short_answer)", o["wb"]["ans"], sum(1 for it in items("wb") if it.get("kind") == "ex.short_answer"), nguon="WBP items.ans")
row("y tu luan – SGK (ex.open_response)", o["tb"]["open"], sum(1 for it in items("tb") if it.get("open")), nguon="PG items.open")
row("y tu luan – vo (ex.open_response)", o["wb"]["open"], sum(1 for it in items("wb") if it.get("open")), nguon="WBP items.open")
row("bo trac nghiem (ex.choice_single)", o["quiz_sets"], len(quiz), nguon="TP[].quiz")
row("cau trac nghiem", o["quiz_q"], sum(len(e["items"]) for e in quiz), nguon="TP[].quiz[]")
row("dap an tu dong (ans)", o["tb"]["ans"] + o["wb"]["ans"], sum(1 for v in ("tb", "wb") for it in items(v) if it.get("answer")), nguon="items.ans")
row("dap an trac nghiem (c)", o["quiz_q"], sum(1 for e in quiz for it in e["items"] if isinstance(it.get("correct"), int)), nguon="quiz[].c")
row("loi giai (sol)", o["tb"]["sol"] + o["wb"]["sol"], sum(1 for v in ("tb", "wb") for it in items(v) if it.get("solution")), nguon="items.sol")
n_multi = sum(1 for f in fields if "/" in f["item_key"]); n_open = sum(1 for f in fields if f["type"] == "textarea")
row("o nhap tren anh trang vo", o["wbi_fields"], len(fields) - n_multi - n_open, n_multi + n_open, nguon="window.WBI",
    ghi_chu=f"pages[].fields; tu_che: {n_multi} o thuoc y nhieu phan (TC1, item_key '<y>/<k>'), {n_open} nut y mo (TC3, type textarea)")
row("y co o tren trang vo", o["wbi_items"], len({(f["exercise_ref"], f["item_key"].split("/")[0]) for f in fields}), nguon="WBI '<i>.<j>'")
row("hinh / diem hinh kham pha", 0, len(b.get("figures", [])), nguon="(cuon khong co PG.fig)")
row("chu de TP -> lessons", o["topics"], len(b["lessons"]), nguon="window.TP")
row("video trinh chieu", o["videos"], len(b["videos"]), nguon="TP[].video")
for k, n in o["scene_kinds"].items():
    row(f"canh video '{k}'", n, sk[SK[k]], nguon="TP[].video[].v.k", ghi_chu=SK[k])
for k, n in o["models"].items():
    row(f"mo hinh '{k}'", n, simk[SK[k]], nguon="TP[].model", ghi_chu=SK[k] + " (simulations[], mode interactive)")
row("clip audio vi", o["audio_vi"], sum(1 for c in clips.values() if "vi" in c), nguon="window.AUDIO.vi", ghi_chu="media.clips, co source_hash")
row("clip audio uz", 0, sum(1 for c in clips.values() if "uz" in c), nguon="(khong co; TTS trinh duyet)", ghi_chu="media.fallback_tts=true")
row("clip audio ru", 0, sum(1 for c in clips.values() if "ru" in c), nguon="(khong co; TTS trinh duyet)", ghi_chu="media.fallback_tts=true")
row("file audio", len(o["audio_files"]), sum(1 for f in b["media"]["files"] if f["kind"] == "audio"), nguon="audio_vi/vi_1.mp3, vi_2.mp3")
row("chuong (CH) + muc 'Kirish' cua chSel", o["chapters"] + 1, len(b["units"]), nguon="CH, renderBrand()")
row("bo vo (WBS)", o["wbs"], len(b["workbook_sets"]), nguon="window.WBS")
row("thuat ngu", 0, len(b.get("glossary", [])), nguon="(cuon khong co bang thuat ngu)",
    ghi_chu="tri-thuc/thuat-ngu.json co dong nguon matematika5 chi la ten chuong/ten bai (chapter_title/lesson_title) – da nam o units/lessons")
row("chuoi giao dien U", o["ui_keys"], len(b["ui_strings"]), nguon="U", ghi_chu="ui_strings")
out = {"book_id": "matematika5", "nguon_cu": "fix/matematika5/index.html (artifact KMgpp6evxs3s6mvGSYpyvE), dem bang _tools/convert.py",
       "quy_uoc": "lech = cu - moi - tu_che; 'moi' = bieu dien day du theo schema v0.9.0; 'tu_che' = co trong book.json nhung theo cach tam ghi o tu-che.md",
       "tong_lech": sum(abs(r["lech"]) for r in rows), "dong": rows}
json.dump(out, open(os.path.join(B, "doi-chieu.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("dong", len(rows), "tong lech", out["tong_lech"])
for r in rows:
    if r["lech"]: print("LECH", r)
