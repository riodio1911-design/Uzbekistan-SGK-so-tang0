#!/usr/bin/env python3
"""Ap quyet dinh D2 (18/11/2026) vao cac file JSON cua tang 0. Chay lai nhieu lan van cho cung ket qua (idempotent).
Chay:  python3 -I quyet-dinh/ap-d2.py      (tu bat ky dau)
Sau do: python3 -I _cong-cu/sinh-enum.py && python3 -I _cong-cu/kiem-tra-truc.py --cap-nhat-nguon
Phan sua van ban (README, JS dau doc, build.py giao dien, lap-phieu.py) lam tay, liet ke trong quyet-dinh/D2.md."""
import json, os, re

R = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
VER = "0.9.0"


def P(*a): return os.path.join(R, *a)


def load(rel): return json.load(open(P(rel), encoding="utf8"))


def save(rel, obj, indent=2):
    raw = open(P(rel), encoding="utf8").read()
    out = json.dumps(obj, ensure_ascii=False, indent=indent) + ("\n" if raw.endswith("\n") else "")
    if out != raw:
        open(P(rel), "w", encoding="utf8").write(out)
        print("  sua", rel)


def front(d, key, val, after=None):
    """Dat key=val ngay sau `after` (giu thu tu khoa cho de doc)."""
    items = [(k, v) for k, v in d.items() if k != key]
    out, done = {}, False
    for k, v in items:
        out[k] = v
        if k == after and not done:
            out[key] = val; done = True
    if not done:
        out = {key: val, **out} if after is None else {**out, key: val}
    d.clear(); d.update(out)


# ------------------------------------------------------------------ 1. tu-dien-truc.json
def ten(uz, ru, vi): return {"uz": uz, "ru": ru, "vi": vi}


def add_val(T, axis, nhom, vid, t, mo_ta, **kw):
    gv = T["truc"][axis]["gia_tri"]
    cur = next((v for v in gv if v["id"] == vid), None)
    new = {"id": vid, "ten": t, "mo_ta": mo_ta, "bi_danh": [], "nhom": nhom, **kw,
           "nguon": cur.get("nguon", []) if cur else []}
    if cur:
        cur.clear(); cur.update(new); return
    last = max([i for i, v in enumerate(gv) if v.get("nhom") == nhom], default=len(gv) - 1)
    gv.insert(last + 1, new)


def tu_dien():
    T = load("tu-dien-truc.json")
    T["version"] = VER
    T["d2"] = "Đã chốt ở D2 ngày 18/11/2026 (xem quyet-dinh/D2.md)."
    add_val(T, "3", "noi_dung", "video_nguoi_dan", ten("Taqdimotchi videosi", "Видео с ведущим", "Video người dẫn"),
            "Video có người dẫn (quay thật hoặc avatar) – loại media.presenter_video của nhà máy media. Chưa cuốn nào có; thêm ở D2 theo đề xuất M2.")
    add_val(T, "5", "quy_tac", "chuan_hoa_dau_nhay_uz", ten("Tutuq belgilarini ‘ ga keltirish", "Приведение апострофов к ‘", "Chuẩn hóa dấu nháy về ‘"),
            "Đổi mọi kiểu dấu nháy (' ` ʻ ’ ʼ ‘) về ‘ trước khi so (o' → o‘, g` → g‘). Quy tắc accept_v2 – MẶC ĐỊNH từ D2; nrm_v1 (bỏ dấu nháy) không còn là mặc định.")
    add_val(T, "5", "quy_tac", "giao_vien_cham_cau_mo", ten("O‘qituvchi ochiq javobni baholaydi", "Учитель оценивает открытые ответы", "Giáo viên chấm câu mở"),
            "Bài làm mở đẩy lên db res/<bộ>_<uid>; giáo viên chấm điểm và nhận xét trong bảng kết quả lớp, ghi db grade/<bộ>_<uid>. Bật ở v1 (D2).")
    T["truc"]["8"]["nhom"]["khong_ngon_ngu"] = {
        "vi": "Mã không ngôn ngữ", "dung_o": ["book:$defs.media_lang", "nha-may-media:phieu.lang"],
        "ghi_chu": "zxx (ISO 639-2) = sản phẩm không có nội dung ngôn ngữ (ảnh, sfx). Chỉ dùng cho media; KHÔNG dùng cho chữ, bản in, người đọc."}
    add_val(T, "8", "khong_ngon_ngu", "zxx", ten("Tilsiz (zxx)", "Без языка (zxx)", "Không ngôn ngữ (zxx)"),
            "Media không có nội dung ngôn ngữ: hiệu ứng âm thanh, ảnh minh họa. Thêm ở D2 theo đề xuất M2.")
    add_val(T, "9", "rang_buoc", "anh_trang_o_artifact_dong_hanh",
            ten("Sahifa rasmlari hamroh artifaktda", "Изображения страниц во вспомогательном артефакте", "Ảnh trang ở artifact đồng hành"),
            "Ảnh trang của bản in thứ hai (pages_ru/ khi bản gốc là uz) nằm ở một artifact đồng hành, khai báo trong book.asset_sources, để gói chính (có audio 64 kbps) không vượt 256 MB. D2.")
    add_val(T, "9", "tinh_nang", "teacher_grading", ten("O‘qituvchi baholashi", "Оценивание учителем", "Giáo viên chấm bài"),
            "GV chấm câu mở / bài có chế độ giao_vien trong bảng kết quả lớp (db grade/). Bật ở v1 (D2).")
    add_val(T, "9", "tinh_nang", "subtitles", ten("Subtitrlar", "Субтитры", "Phụ đề"),
            "Hiện phụ đề WebVTT (media.files kind=subtitle) cho video/audio. Thêm ở D2 theo đề xuất M2.")
    # mo ta cac gia tri lien quan
    for v in T["truc"]["5"]["gia_tri"]:
        if v["id"] == "giao_vien":
            v["mo_ta"] = "Giáo viên chấm (bật ở v1 theo D2: câu mở, vẽ, thu âm, ô bảng không có đáp án)."
        if v["id"] == "chuan_hoa_chuoi_so":
            v["mo_ta"] = "Chuẩn hóa chuỗi/số trước khi so (chữ thường, khoảng trắng, dấu phẩy thập phân, dung sai 1e-6). Đi cùng chuan_hoa_dau_nhay_uz (accept_v2)."
    save("tu-dien-truc.json", T, indent=1)


# ------------------------------------------------------------------ 2. book.schema.json
def book_schema():
    B = load("schema/book.schema.json")
    d, Pp = B["$defs"], B["properties"]
    front(B, "version", VER, after="$id")
    B["title"] = "Book content (tang 0, v0.9.0 – D2 da chot)"
    Pp["schema_version"] = {"enum": ["0.9", VER], "description": "0.9.0 = sau D2 (18/11/2026); '0.9' (ban nhap) van hop le de tuong thich."}

    # --- profile: subject_id, country, tutor (D2 theo de xuat gia-su + R1)
    pp = d["profile"]["properties"]
    front(pp, "subject_id", {"type": "string", "pattern": "^[a-z][a-z0-9_]*$",
          "description": "Ma mon snake_case (mathematics, natural_science, literature...). Gia su chon subject_rules theo truong nay. Thieu thi dau doc suy tu subject (tuong thich). D2."}, after="subject")
    front(pp, "country", {"type": "string", "description": "Ten nuoc cua bo sach bang tieng Anh, dien vao loi nhac gia su (vd. 'Uzbekistan'); khong viet cung trong mau. D2."}, after="langs")
    front(pp, "country_code", {"type": "string", "pattern": "^[A-Z]{2}$", "description": "ISO 3166-1 alpha-2 (vd. UZ)."}, after="country")
    pp["tutor_persona"]["description"] = "Nhan vat gia su (ten cu; dung tutor.persona – giu de tuong thich)"
    front(pp, "tutor", {"type": "object", "additionalProperties": False,
          "description": "Cau hinh gia su cua cuon; gia-su/prompts.json doc profile.tutor.*. D2.",
          "properties": {"persona": {"enum": ["robo", "oqilbek"]},
                         "persona_origin": {"type": "string", "description": "Ghi de cau mo ta nhan vat khi sach khong co nhan vat nay"},
                         "subject_scope": {"type": "string", "description": "Cum mo ta pham vi cau hoi (mac dinh suy tu subject)"},
                         "software_list": {"type": "string", "description": "Chi sach Tin: phan mem sach dung"}}}, after="tutor_persona")

    # --- nguon tai nguyen (D2 quyet dinh 2: anh trang ban Nga o artifact dong hanh)
    d["asset_path"] = {"type": "string", "pattern": "^(@[a-z0-9_]+/)?[^@\\s][^\\s]*$",
                       "description": "Duong dan tai nguyen. Mac dinh tuong doi voi artifact cua cuon. Tien to '@<nguon>/' = file nam o asset_sources.<nguon> (vd. '@ru_pages/pages_ru/p021.jpg' = artifact dong hanh chua anh trang ban in Nga). Dau doc giai qua T0.asset(). D2."}
    d["asset_source"] = {"type": "object", "required": ["kind"], "additionalProperties": False,
                         "description": "Mot nguon tai nguyen ngoai artifact cua cuon. D2: dung cho anh trang ban in thu hai (pages_ru/) de goi chinh <= 256 MB khi audio 64 kbps.",
                         "properties": {
                             "kind": {"enum": ["self", "companion_artifact", "url"], "description": "self = chinh artifact cuon; companion_artifact = artifact dong hanh; url = nguon ngoai co dinh"},
                             "url": {"type": ["string", "null"], "description": "Goc URL cua nguon (vd. link artifact dong hanh); null khi chua publish"},
                             "title": {"$ref": "#/$defs/i18n"},
                             "role": {"enum": ["page_images", "audio", "video", "fonts", "other"]},
                             "edition": {"$ref": "#/$defs/lang", "description": "Ban in co anh trang o nguon nay (vd. ru)"},
                             "fallback_base": {"type": "string", "description": "Tien to dung khi url chua co (ban xem truoc / phat trien). '' = cung thu muc voi cuon."},
                             "bytes": {"type": "integer", "minimum": 0},
                             "file_count": {"type": "integer", "minimum": 0},
                             "note": {"type": "string"}}}
    front(Pp, "asset_sources", {"description": "Nguon tai nguyen ngoai artifact cua cuon, khoa = ten nguon dung trong tien to '@<nguon>/' cua asset_path. D2.",
                                "type": "object", "propertyNames": {"pattern": "^[a-z0-9_]+$"},
                                "additionalProperties": {"$ref": "#/$defs/asset_source"}}, after="profile")
    pg = d["page"]["properties"]
    pg["images"]["additionalProperties"] = {"$ref": "#/$defs/asset_path"}
    pg["images"]["description"] = "Anh trang theo ngon ngu ban in: {uz:'pages/p021.jpg', ru:'@ru_pages/pages_ru/p021.jpg'} (ban in thu hai o artifact dong hanh – D2)"
    pg["background"] = {"$ref": "#/$defs/asset_path", "description": "Anh nen da xoa chu (adabiyot5 bg/) cho 'trang dung lai chu that'"}
    # text_lines: them phan tu thu 8 anchor_id (D2 theo de xuat R3)
    tl = pg["text_lines"]
    tl["description"] = ("Lop chu that (LN_.pg / PG.pg o biologiya5): [x, y, w, size, style_idx, text, anchor_idx, anchor_id?] theo he toa do print_text. "
                         "anchor_id (phan tu 8, tuy chon, D2) = id trong reading.anchors; dau doc uu tien anchor_id, thieu thi ghep theo duoi so cua id (cach cu).")
    tl["items"]["maxItems"] = 8
    pi = tl["items"]["prefixItems"]
    if len(pi) == 7:
        pi.append({"type": ["string", "null"]})

    # --- media: lang co zxx, subtitle, render_hash, bitrate
    d["media_lang"] = {"enum": ["uz", "ru", "vi", "kaa", "zxx"], "description": "Ngon ngu cua media; zxx = khong co noi dung ngon ngu (sfx, anh). D2."}
    mf = d["media"]["properties"]["files"]["items"]["properties"]
    mf["path"] = {"$ref": "#/$defs/asset_path"}
    if "subtitle" not in mf["kind"]["enum"]:
        mf["kind"]["enum"].append("subtitle")
    mf["kind"]["description"] = "subtitle = WebVTT (D2, nha may media media.subtitles)"
    mf["lang"] = {"$ref": "#/$defs/media_lang"}
    front(mf, "bitrate_kbps", {"type": "number", "description": "Audio giao: 64 kbps (D2). File cu (vd. audio_vi ~32 kbps) giu nguyen toi khi sinh lai."}, after="bytes")
    d["media"]["properties"]["clips"]["additionalProperties"]["propertyNames"] = {"$ref": "#/$defs/media_lang"}
    cp = d["clip"]["properties"]
    front(cp, "render_hash", {"$ref": "#/$defs/source_hash",
          "description": "source_hash cua phieu/bien ban nha may media (bam media_type, lang, text_hash, giong, format_profile, lexicon, pipeline). Lech = can render lai du chu khong doi. D2 theo de xuat M2."}, after="source_hash")
    cp["source_hash"] = {"$ref": "#/$defs/source_hash", "description": "= text_hash: sha256(NFC(chuoi o text_path))"}

    # --- ai_feedback.role theo id vai tro cua gia-su/prompts.json (D2 theo de xuat R3)
    af = d["exercise"]["properties"]["ai_feedback"]["properties"]
    af["role"] = {"enum": ["hint", "open_feedback", "open_grade", "feedback", "score"],
                  "description": "id vai tro trong gia-su/prompts.json. 'feedback' (= open_feedback) va 'score' (= open_grade) la bi danh cu, khong dung cho du lieu moi (D2)."}

    # --- cach cham theo bai (D2: accept_v2 mac dinh, giao_vien bat o v1)
    d["grading"] = {"type": "object", "additionalProperties": False,
                    "description": "Ghi de cach cham cua kind (mac dinh lay trong thu-vien/bai-tap/danh-muc.json: grading.default_rule).",
                    "properties": {
                        "mode": {"enum": ["tu_dong", "ai", "giao_vien", "khong_cham"]},
                        "rule": {"type": "string", "pattern": "^[a-z0-9_]+$",
                                 "description": "id quy tac trong thu vien bai tap: accept_v2 (mac dinh dap an ngan, D2), accept_v2_math, nrm_v1 (bi danh cu = accept_v2_math), per_position (mac dinh ex.order, D2), all_or_nothing..."},
                        "max_score": {"type": "number", "minimum": 0},
                        "teacher_review": {"type": "boolean", "description": "Dua bai vao hang cho GV cham trong bang ket qua lop (truc 5 giao_vien, bat o v1 – D2)"}}}
    front(Pp, "grading_defaults", {"type": "object", "additionalProperties": False,
          "description": "Cach cham mac dinh cua ca cuon (ghi de bang exercise.grading.rule). D2: accept_v2 la mac dinh chung; cuon Toan/Ly/Hoa co the dat accept_v2_math (van doi dau nhay ve ‘).",
          "properties": {"short_answer_rule": {"enum": ["accept_v2", "accept_v2_math"], "default": "accept_v2"},
                         "order_rule": {"enum": ["per_position", "all_or_nothing"], "default": "per_position"}}}, after="asset_sources")
    d["legacy_ids"] = {"type": "array", "uniqueItems": True, "items": {"type": "string"},
                       "description": "Id cu theo vi tri (vd. 'p21.ex0') truoc khi doi sang id ben (D2); dung de chuyen trang thai hoc sinh/khoa luu cu."}
    ex = d["exercise"]["properties"]
    front(ex, "legacy_ids", {"$ref": "#/$defs/legacy_ids"}, after="id")
    ex["cards"]["items"]["properties"]["image"] = {"$ref": "#/$defs/asset_path", "description": "Anh cua the (thay data.card_images ghep theo thu tu – D2 theo de xuat R2)"}
    front(ex, "cell_options", {"type": "array", "items": {"$ref": "#/$defs/i18n"},
          "description": "ex.table_fill: phuong an chon cho o (FUNCS cua tabiiy5); dap an cua hang = items[].correct (chi so). D2 theo de xuat R2."}, after="table")
    front(ex, "grading", {"$ref": "#/$defs/grading"}, after="ai_feedback")
    front(ex, "audio_ref", {"$ref": "#/$defs/id", "description": "Khoa media.clips doc de bai (nha may: media.exercise_prompt_audio). D2 theo de xuat M2."}, after="prompt")
    ei = d["exercise_item"]["properties"]
    ei["answer"]["description"] = ("Dap an chap nhan, phuong an thay the noi bang '|', nhieu o noi bang ';'. Cham mac dinh accept_v2 (D2): chu thuong, "
                                   "moi dau nhay ' ` ʻ ’ ʼ doi ve ‘, gop khoang trang, so so voi dung sai 1e-6.")
    front(ei, "audio_ref", {"$ref": "#/$defs/id", "description": "Khoa media.clips doc y nay (D2)."}, after="prompt")
    front(ei, "grading", {"$ref": "#/$defs/grading"}, after="ai_feedback")
    for k in ("figure", "simulation", "glossary_entry"):
        front(d[k]["properties"], "legacy_ids", {"$ref": "#/$defs/legacy_ids"}, after="id")

    # --- thuat ngu: forms + audio_ref
    ge = d["glossary_entry"]["properties"]
    front(ge, "forms", {"type": "array", "uniqueItems": True, "items": {"type": "string"},
          "description": "Dang bien to cua term o ngon ngu ban goc (lang_base) da gap trong van ban, de gach chan/khop chu giai (vd. 'unguridagi' cua 'Ungur'). D2 theo de xuat R3."}, after="term")
    front(ge, "audio_ref", {"$ref": "#/$defs/id", "description": "Khoa media.clips doc thuat ngu (nha may: media.term_audio). D2 theo de xuat M2."}, after="short")

    # --- id ben
    d["id"]["description"] = ("Id BEN (D2): lay tu khoa noi dung – so bai/so hinh in tren sach (p21.q5, p37.rasm4), khoa goc cua ma (t4, l11, u2.1) – "
                              "KHONG dung chi so vi tri trong mang (ex0, fig0). Id cu ghi vao legacy_ids.")

    # --- cac ghi chu D2 cho cau hoi schema
    lk = d["lesson"]["properties"]["kind"]
    if "D2" not in lk.get("description", ""):
        lk["description"] = (lk.get("description", "") + " D2: giu chu de TP (b0/i*/t*/s*) la lessons[] co kind, khong tach topics.").strip()
    ag = d["reading"]["properties"]["audio_groups"]
    if "D2" not in ag["description"]:
        ag["description"] += " D2: du thua voi sentence.audio_ref; tuy chon, giu de tuong thich, du lieu moi khong bat buoc."
    if "D2" not in B["properties"]["translation_memory"].get("description", "") and "$ref" in B["properties"]["translation_memory"]:
        B["properties"]["translation_memory"] = {"$ref": "#/$defs/translation_memory",
            "description": "RUDICT. D2: giu (tuy chon) de tuong thich; buoc 4 uu tien do ru thang vao chuoi i18n."}

    # --- lop giao vien: giao bai + ket qua + GV cham (D2 quyet dinh 3, mau matematika5)
    d["answer_map"] = {"type": "object", "description": "khoa '<exercise>.<item>' -> {v, ok, t, score}",
                       "additionalProperties": {"type": "object", "additionalProperties": False,
                                                "properties": {"v": {}, "ok": {"type": ["boolean", "null"]}, "t": {"type": "integer"}, "score": {"type": "number"},
                                                               "ai": {"type": "object", "description": "Ket qua AI (open_grade: {score 0-2, feedback})"}}}}
    d["learner_state"]["properties"]["answers"] = {"$ref": "#/$defs/answer_map"}
    d["assignment"] = {"type": "object", "additionalProperties": False,
                       "description": "db hw/<set_id> (matematika5 setHW: {on, due}). D2: dung cho ca 7 cuon.",
                       "properties": {"on": {"type": "boolean", "description": "Da giao"},
                                      "assigned": {"type": "boolean", "description": "Ten cu cua on (v0.9 nhap) – giu de tuong thich"},
                                      "due": {"type": "string", "pattern": "^([0-9]{4}-[0-9]{2}-[0-9]{2})?$", "description": "Han nop YYYY-MM-DD ('' = khong han)"},
                                      "kind": {"enum": ["workbook_set", "lesson", "exercise", "quiz_set", "unit"]},
                                      "target": {"$ref": "#/$defs/id", "description": "id muc duoc giao (mac dinh = khoa)"},
                                      "note": {"$ref": "#/$defs/i18n"}, "by": {"type": "string"}, "ts": {"type": "integer"}}}
    d["class_result"] = {"type": "object", "required": ["set", "uid"], "additionalProperties": False,
                         "description": "db res/<set>_<uid>: hoc sinh day ket qua (matematika5 pushRes, debounce 1,5 s). D2: ca 7 cuon.",
                         "properties": {"set": {"$ref": "#/$defs/id"}, "uid": {"type": "string"},
                                        "ok": {"type": "integer", "minimum": 0, "description": "so y tu dong dung"},
                                        "tot": {"type": "integer", "minimum": 0, "description": "so y co dap an"},
                                        "opd": {"type": "integer", "minimum": 0, "description": "so y mo da lam"},
                                        "op": {"type": "integer", "minimum": 0, "description": "so y mo"},
                                        "mark": {"type": ["number", "null"], "description": "thang 10 = ok/tot x 10"},
                                        "answers": {"$ref": "#/$defs/answer_map", "description": "Bai lam (bat buoc voi y mo de GV cham)"},
                                        "lang": {"$ref": "#/$defs/lang"}, "ts": {"type": "integer"}},
                         "examples": [{"set": "a11", "uid": "u_42", "ok": 4, "tot": 5, "opd": 1, "op": 2, "mark": 8, "ts": 1763424000000}]}
    d["teacher_grade"] = {"type": "object", "required": ["set", "uid", "items"], "additionalProperties": False,
                          "description": "db grade/<set>_<uid>: GV cham y mo (truc 5 giao_vien, bat o v1 – D2). Chi GV (user.canEdit) ghi.",
                          "properties": {"set": {"$ref": "#/$defs/id"}, "uid": {"type": "string"},
                                         "items": {"type": "object", "additionalProperties": {"type": "object", "additionalProperties": False,
                                                   "properties": {"score": {"type": "number", "minimum": 0}, "max": {"type": "number", "minimum": 0},
                                                                  "comment": {"type": "string"}, "ts": {"type": "integer"}}}},
                                         "mark": {"type": ["number", "null"]}, "by": {"type": "string"}, "ts": {"type": "integer"}}}
    tp = d["teacher"]["properties"]
    tp["assignments"] = {"description": "db hw/<set> (mau matematika5). D2: ca 7 cuon.", "type": "object", "additionalProperties": {"$ref": "#/$defs/assignment"}}
    tp["results"] = {"description": "db res/<set>_<uid>: ket qua hoc sinh day len (class_result); learner_state cu van hop le.",
                     "type": "object", "additionalProperties": {"anyOf": [{"$ref": "#/$defs/class_result"}, {"$ref": "#/$defs/learner_state"}]}}
    tp["grades"] = {"description": "db grade/<set>_<uid>: diem va nhan xet cua GV (D2).", "type": "object", "additionalProperties": {"$ref": "#/$defs/teacher_grade"}}
    d["teacher"]["description"] = "Lop du lieu cua giao vien: ghi de dung chung (db), giao bai (hw/), ket qua lop (res/), GV cham (grade/). D2: giao bai + ket qua cho ca 7 cuon."
    save("schema/book.schema.json", B)


# ------------------------------------------------------------------ 3. features.schema.json
def features_schema():
    F = load("schema/features.schema.json")
    front(F, "version", VER, after="$id")
    F["title"] = "Book feature profile (9 axes, tang 0 v0.9.0 – D2 da chot)"
    pr = F["properties"]
    pr["schema_version"] = {"enum": ["0.9", VER]}
    fe = pr["features"]["properties"]
    front(fe, "teacher_grading", {"type": "boolean", "description": "GV cham cau mo / bai giao_vien trong bang ket qua lop (db grade/). D2: bat o v1."}, after="teacher_class_results")
    fe["subtitles"] = {"type": "boolean", "description": "Hien phu de WebVTT cho video/audio (D2)"}
    a9 = pr["axes"]["properties"]["9"]["properties"]
    front(a9, "companion_mb", {"type": "number", "description": "MB anh trang dat o artifact dong hanh (asset_sources, D2)"}, after="unused_mb")
    front(pr, "classroom", {
        "type": "object", "additionalProperties": False, "required": ["assign_unit"],
        "description": "Giao bai + ket qua lop (D2 quyet dinh 3: ca 7 cuon theo mau matematika5: hw/, res/, user.canEdit, user.profiles). Can capabilities db + user.",
        "properties": {
            "assign_unit": {"enum": ["workbook_set", "lesson", "exercise", "quiz_set", "unit"], "description": "Don vi GV giao (matematika5: bo vo bai tap)"},
            "db": {"type": "object", "additionalProperties": False, "description": "Ten collection (mac dinh hw / res / grade)",
                   "properties": {"assignments": {"type": "string", "default": "hw"}, "results": {"type": "string", "default": "res"},
                                  "grades": {"type": "string", "default": "grade"}}},
            "result_key": {"type": "string", "default": "<set>_<uid>"},
            "push_debounce_ms": {"type": "integer", "minimum": 0, "default": 1500},
            "teacher_detect": {"type": "array", "uniqueItems": True, "items": {"enum": ["user.canEdit", "window.__TEACH"]}},
            "class_names_from": {"enum": ["user.profiles"]},
            "score_scale": {"type": ["number", "null"], "description": "Thang diem (10 = ok/tot x 10); null = khong quy diem"},
            "teacher_grading_modes": {"type": "array", "uniqueItems": True, "items": {"enum": ["tu_dong", "ai", "giao_vien", "khong_cham"]},
                                      "description": "Che do cham co mat trong bang ket qua lop"},
            "offline_fallback": {"enum": ["localStorage", "none"], "description": "Khong co db thi luu trong trinh duyet"}}}, after="features")
    F["allOf"] = [{
        "if": {"properties": {"features": {"anyOf": [{"properties": {"results_to_db": {"const": True}}, "required": ["results_to_db"]},
                                                     {"properties": {"teacher_assign": {"const": True}}, "required": ["teacher_assign"]}]}},
               "required": ["features"]},
        "then": {"required": ["classroom"], "properties": {"capabilities": {"allOf": [{"contains": {"const": "db"}}, {"contains": {"const": "user"}}]}}},
        "$comment": "D2: luu ket qua len db / giao bai can khoi classroom va capability db + user."}]
    save("schema/features.schema.json", F)


# ------------------------------------------------------------------ 4. vi-du features (7 cuon)
ASSIGN = {"matematika5": "workbook_set", "tabiiy5": "workbook_set", "informatika5": "lesson", "kimyo8": "lesson",
          "fizika8": "lesson", "biologiya5": "lesson", "adabiyot5": "lesson"}
COMPANION = {"kimyo8": 45.72, "fizika8": 44.5}   # MB pages_ru/ (nha-may-media/kiem-ke/media-hien-co.csv)
SHORT = {"matematika5", "informatika5", "kimyo8", "fizika8", "tabiiy5"}


def vidu_features():
    for b in ASSIGN:
        rel = f"schema/vi-du/{b}.features.json"
        f = load(rel)
        f["schema_version"] = VER
        ax = f["axes"]
        v5 = ax["5"]["values"]
        if "giao_vien" not in v5:
            v5.insert(v5.index("khong_cham") if "khong_cham" in v5 else len(v5), "giao_vien")
        rules = ax["5"].setdefault("rules", [])
        if b in SHORT and "chuan_hoa_dau_nhay_uz" not in rules:
            rules.insert(0, "chuan_hoa_dau_nhay_uz")
        if "giao_vien_cham_cau_mo" not in rules:
            rules.append("giao_vien_cham_cau_mo")
        fl = ax["9"].setdefault("flags", [])
        if "ket_qua_chi_localstorage" in fl:
            fl.remove("ket_qua_chi_localstorage")
        if b in COMPANION:
            if "anh_trang_o_artifact_dong_hanh" not in fl: fl.append("anh_trang_o_artifact_dong_hanh")
            ax["9"]["companion_mb"] = COMPANION[b]
        caps = f["capabilities"]
        for c in ("db", "user"):
            if c not in caps: caps.append(c)
        fe = f["features"]
        for k in ("teacher_assign", "teacher_class_results", "results_to_db", "teacher_grading"):
            fe[k] = True
        fe["results_local"] = True
        f["classroom"] = {"assign_unit": ASSIGN[b], "db": {"assignments": "hw", "results": "res", "grades": "grade"},
                          "result_key": "<set>_<uid>", "push_debounce_ms": 1500, "teacher_detect": ["user.canEdit", "window.__TEACH"],
                          "class_names_from": "user.profiles", "score_scale": 10,
                          "teacher_grading_modes": [m for m in ("tu_dong", "ai", "giao_vien") if m in v5], "offline_fallback": "localStorage"}
        # dat classroom ngay sau features
        front(f, "classroom", f.pop("classroom"), after="features")
        srcs = f.setdefault("sources", [])
        tag = {"book": "matematika5", "code": "D2: mau giao bai/ket qua openHW, setHW, pushRes, classRes (fix/matematika5)"}
        if tag not in srcs: srcs.append(tag)
        note = f.get("notes", "")
        add = " D2 (18/11/2026): v1 bat giao bai + ket qua lop (db hw/res/grade) va GV cham (giao_vien) cho ca 7 cuon."
        if b in COMPANION:
            add += f" Anh trang ban Nga (pages_ru/, {COMPANION[b]} MB) chuyen sang artifact dong hanh de them audio uz/ru 64 kbps."
        if "D2 (18/11/2026)" not in note:
            f["notes"] = (note + add).strip()
        save(rel, f, indent=1)


# ------------------------------------------------------------------ 5. vi-du book-trich (3 cuon)
PROF = {"kimyo8": ("chemistry",), "tabiiy5": ("natural_science",), "adabiyot5": ("literature",)}
ROLE = {"feedback": "open_feedback", "score": "open_grade"}


def walk_replace(o, mp):
    if isinstance(o, dict):
        return {k: walk_replace(v, mp) for k, v in o.items()}
    if isinstance(o, list):
        return [walk_replace(v, mp) for v in o]
    if isinstance(o, str) and o in mp:
        return mp[o]
    return o


def fix_roles(o):
    if isinstance(o, dict):
        if isinstance(o.get("ai_feedback"), dict) and o["ai_feedback"].get("role") in ROLE:
            o["ai_feedback"]["role"] = ROLE[o["ai_feedback"]["role"]]
        for v in o.values(): fix_roles(v)
    elif isinstance(o, list):
        for v in o: fix_roles(v)


def profile_fix(bk, b):
    pr = bk["profile"]
    pr["subject_id"] = PROF[b][0]
    pr["country"] = "Uzbekistan"
    pr["country_code"] = "UZ"
    pr["tutor"] = {"persona": pr.get("tutor_persona", "robo")}
    order = ["title", "subject", "subject_id", "grade", "age", "grade_band", "audience", "lang_base", "langs", "country", "country_code",
             "tutor_persona", "tutor", "edition", "volumes"]
    bk["profile"] = {k: pr[k] for k in order if k in pr} | {k: v for k, v in pr.items() if k not in order}


def gloss_ids(bk, subject_id):
    """D2 id ben: g.<don vi>.<chi so> -> id thuat ngu cua tri-thuc/thuat-ngu.json (term.<slug>), id cu vao legacy_ids."""
    T = load("tri-thuc/thuat-ngu.json")
    idx = {}
    for t in T: idx.setdefault(t["term"]["uz"].strip().lower(), []).append(t)
    for g in bk.get("glossary", []):
        if not re.fullmatch(r"g\.[^.]+\.\d+", g.get("id", "")): continue
        cands = idx.get(g["term"]["uz"].strip().lower(), [])
        pick = next((t for t in cands if subject_id in t.get("subjects", [])), cands[0] if cands else None)
        if not pick: continue
        old = g["id"]
        g2 = {"id": pick["id"], "legacy_ids": [old]}
        g2.update({k: v for k, v in g.items() if k != "id"})
        g.clear(); g.update(g2)


def vidu_book():
    # kimyo8: id ben + anh trang ru o artifact dong hanh
    rel = "schema/vi-du/kimyo8.book-trich.json"; bk = load(rel)
    mp = {}
    for e in bk.get("exercises", []):
        m = re.fullmatch(r"p(\d+)\.ex\d+", e["id"])
        if m and e.get("no"):
            mp[e["id"]] = f"p{m.group(1)}.q{e['no']}"
    for f in bk.get("figures", []):
        m = re.fullmatch(r"p(\d+)\.fig\d+", f["id"])
        if m and f.get("no"):
            mp[f["id"]] = f"p{m.group(1)}.rasm{f['no']}"
    if mp:
        bk = walk_replace(bk, mp)
        inv = {v: k for k, v in mp.items()}
        for coll in ("exercises", "figures"):
            for x in bk.get(coll, []):
                if x["id"] in inv:
                    lg = x.get("legacy_ids", [])
                    if inv[x["id"]] not in lg: lg.append(inv[x["id"]])
                    x["legacy_ids"] = lg
                    x2 = {"id": x["id"], "legacy_ids": x.pop("legacy_ids")}
                    x2.update({k: v for k, v in x.items() if k != "id"}); x.clear(); x.update(x2)
    for p in bk.get("pages", []):
        im = p.get("images", {})
        if "ru" in im and not im["ru"].startswith("@"):
            im["ru"] = "@ru_pages/" + im["ru"]
    bk["asset_sources"] = {"ru_pages": {"kind": "companion_artifact", "url": None, "role": "page_images", "edition": "ru",
                                        "title": {"uz": "Kimyo 8 – rus tilidagi nashr sahifalari", "ru": "Химия 8 – страницы русского издания", "vi": "Hóa 8 – ảnh trang bản in tiếng Nga"},
                                        "fallback_base": "", "file_count": 208, "bytes": 45720000,
                                        "note": "D2: pages_ru/ (208 ảnh, ~45,72 MB theo kiểm kê media) đặt ở artifact đồng hành; điền url khi publish. Bản xem trước dùng fallback_base ''."}}
    bk["grading_defaults"] = {"short_answer_rule": "accept_v2_math"}
    profile_fix(bk, "kimyo8"); fix_roles(bk)
    bk["schema_version"] = VER
    bk = {k: bk[k] for k in ["schema_version", "book_id", "profile", "asset_sources", "grading_defaults"] if k in bk} | {k: v for k, v in bk.items() if k not in ("schema_version", "book_id", "profile", "asset_sources", "grading_defaults")}
    save(rel, bk, indent=1)

    # tabiiy5: cards[].image, cell_options
    rel = "schema/vi-du/tabiiy5.book-trich.json"; bk = load(rel)
    FUNCS = [("gulni poyaga biriktiradi", "gắn hoa vào thân"), ("gul g‘unchasini himoya qiladi", "bảo vệ nụ hoa"),
             ("hasharotlarni jalb etadi", "thu hút côn trùng"), ("chang donachalarini hosil qiladi", "tạo ra hạt phấn"),
             ("urug‘kurtak va tuxum hujayrani saqlaydi, mevaga aylanadi", "chứa noãn và tế bào trứng, phát triển thành quả")]
    for e in bk.get("exercises", []):
        dt = e.get("data") or {}
        if "card_images" in dt:
            imgs = list(dt.pop("card_images").values())
            for i, c in enumerate(e.get("cards", [])):
                if i < len(imgs) and not c.get("image"): c["image"] = imgs[i]
            if not dt: e.pop("data", None)
        if e["id"] == "wb.a11.parts" and "cell_options" not in e:
            e2 = {}
            for k, v in e.items():
                e2[k] = v
                if k == "items": e2["cell_options"] = [{"uz": u, "vi": v_} for u, v_ in FUNCS]
            e.clear(); e.update(e2)
    gloss_ids(bk, PROF["tabiiy5"][0])
    profile_fix(bk, "tabiiy5"); fix_roles(bk)
    bk["schema_version"] = VER
    save(rel, bk, indent=1)

    # adabiyot5: anchor_id cho text_lines, forms cho chu giai
    rel = "schema/vi-du/adabiyot5.book-trich.json"; bk = load(rel)
    by_idx = {}
    for a in (bk.get("reading") or {}).get("anchors", []):
        m = re.search(r"(\d+)$", a.get("id", ""))
        if m: by_idx[int(m.group(1))] = a["id"]
    for p in bk.get("pages", []):
        for l in p.get("text_lines", []):
            if len(l) == 7:
                l.append(by_idx.get(l[6]) if isinstance(l[6], int) and l[6] >= 0 else None)
    texts = []

    def grab(o):
        if isinstance(o, dict):
            if isinstance(o.get("uz"), str): texts.append(o["uz"])
            for v in o.values(): grab(v)
        elif isinstance(o, list):
            for v in o: grab(v)
    grab(bk.get("lessons", []))
    Q = lambda s: re.sub(r"[‘’ʻʼ'`]", "‘", s.lower())
    words = set()
    for t in texts:
        for w in re.findall(r"[A-Za-zÀ-ÿʻʼ‘’'`ʻЀ-ӿ-]+", t):
            words.add(w.strip("-"))
    for g in bk.get("glossary", []):
        term = g.get("term", {}).get("uz", "").strip()
        if not term or " " in term: continue
        base = Q(term)
        forms = sorted({w for w in words if Q(w).startswith(base) and Q(w) != base and len(w) - len(term) <= 8})
        if forms:
            g2 = {}
            for k, v in g.items():
                g2[k] = v
                if k == "term": g2["forms"] = forms
            g.clear(); g.update(g2)
    gloss_ids(bk, PROF["adabiyot5"][0])
    profile_fix(bk, "adabiyot5"); fix_roles(bk)
    bk["schema_version"] = VER
    save(rel, bk, indent=1)


# ------------------------------------------------------------------ 6. thu vien bai tap
def bai_tap():
    rel = "thu-vien/bai-tap/danh-muc.json"; C = load(rel)
    E = {e["id"]: e for e in C}
    sa = E["ex.short_answer"]["grading"]
    rules = {r["id"]: r for r in sa["rules"]}
    rules["accept_v2"].update({"default": True, "status": "mac_dinh_d2",
        "rule": ("MẶC ĐỊNH (D2, 18/11/2026). accept(): chữ thường; MỌI dấu nháy ' ` ʻ ’ ʼ ‘ → ‘ (o' o` oʻ o’ → o‘, g' → g‘; giữ lại, không bỏ); gộp khoảng trắng, bỏ khoảng trắng đầu/cuối. "
                 "Đáp án là chuỗi (phương án tách '|') hoặc mảng phương án; một ý nhiều ô tách ';' (số phần bằng nhau, từng phần đúng). "
                 "Phương án kiểu số thì so |parseFloat(v, ',' → '.') − a| < 1e-6. Không có đáp án thì ý không tính vào tổng.")})
    rules.setdefault("accept_v2_math", {"id": "accept_v2_math", "used_by": []})
    rules["accept_v2_math"].update({"status": "tuy_chon_d2",
        "rule": ("Tùy chọn cho đáp án biểu thức (Toán, Lý, Hóa): accept_v2 rồi thêm các bước toán của nrm_v1 – ',' → '.'; * x х · → ×; − – — → -; "
                 "bỏ khoảng trắng quanh ; : < > = × ÷ + - /; dãy số chỉ khác khoảng trắng nhóm nghìn coi là bằng. KHÔNG bỏ dấu nháy (khác nrm_v1 cũ). "
                 "Đặt bằng exercise.grading.rule = 'accept_v2_math'.")})
    rules["nrm_v1"].update({"status": "bi_danh_d2", "alias_of": "accept_v2_math",
        "rule": ("BÍ DANH CŨ (D2): không còn là mặc định. Dữ liệu ghi 'nrm_v1' được chấm như accept_v2_math (dấu nháy đổi về ‘ thay vì bị bỏ). "
                 "Hành vi gốc của 4 cuốn: chữ thường; bỏ dấu nháy ‘ ’ ʻ ʼ ' `; ',' → '.'; * x х · → ×; − – — → -; bỏ khoảng trắng quanh toán tử; gộp khoảng trắng.")})
    rules["nrm_v1_parts"].update({"status": "bi_danh_d2", "alias_of": "accept_v2",
        "rule": "BÍ DANH CŨ (D2): tách ';' thành các phần đã nằm trong accept_v2 (mặc định). Hành vi gốc: số phần bằng nhau, từng phần đúng theo nrm_v1 (matematika5 one())."})
    order = ["accept_v2", "accept_v2_math", "nrm_v1", "nrm_v1_parts"]
    sa["rules"] = [rules[k] for k in order] + [r for k, r in rules.items() if k not in order]
    front(sa, "default_rule", "accept_v2", after="modes")
    E["ex.short_answer"]["notes"] = ("D2 (18/11/2026): mặc định accept_v2 – đổi mọi kiểu dấu nháy về ‘ (o‘, g‘). nrm_v1 giữ làm bí danh tương thích "
                                     "(= accept_v2_math). Đáp án biểu thức của Toán/Lý/Hóa đặt grading.rule = accept_v2_math khi chuyển ở bước ④. "
                                     "Một số đáp án matematika5 là chữ số viết bằng chữ Uzbek.")
    # ex.order: mac dinh per_position
    og = E["ex.order"]["grading"]
    for r in og["rules"]:
        if r["id"] == "per_position":
            r.update({"default": True, "status": "mac_dinh_d2",
                      "rule": "MẶC ĐỊNH (D2). Xáo ngẫu nhiên khi mở; Kiểm tra tô từng vị trí đúng/sai (v[i] === i); điểm = số vị trí đúng / số mục; ý tính 'đúng' khi mọi vị trí đúng."})
        if r["id"] == "all_or_nothing":
            r["status"] = "tuy_chon_d2"
            r["rule"] = "Tùy chọn (grading.rule = 'all_or_nothing'): 1 điểm khi mọi vị trí đúng, ngược lại 0. Vở tabiiy5 (WB order, WB plate) giữ cách này."
    front(og, "default_rule", "per_position", after="modes")
    E["ex.order"]["notes"] = ("Ba cách tương tác (↑/↓, chạm theo thứ tự, gõ số) dùng cùng dữ liệu nên là ui, không phải dạng riêng. "
                              "D2: mặc định per_position (5/5 cuốn đang dùng); all_or_nothing là tùy chọn cho vở tabiiy5.")
    # giao_vien bat o v1
    GV = {"ex.open_response", "ex.sketch", "ex.oral_recording", "ex.table_fill", "ex.sim_task"}
    for i in GV:
        g = E[i]["grading"]
        if "giao_vien" not in g["modes"]:
            g["modes"].append("giao_vien")
        if not any(r.get("id") == "giao_vien_review" for r in g.get("rules", [])):
            g.setdefault("rules", []).append({"id": "giao_vien_review", "used_by": [], "status": "v1_d2",
                "rule": ("Bật ở v1 (D2). Bài làm đẩy lên db res/<bộ>_<uid> (answers); GV (user.canEdit) mở 'Kết quả cả lớp', chấm điểm + nhận xét từng ý, "
                         "ghi db grade/<bộ>_<uid> (book.schema $defs.teacher_grade). AI (nếu có) chỉ gợi ý; điểm GV là điểm cuối. Với ex.table_fill chỉ áp cho ô không có đáp án.")})
        a5 = E[i]["axes"].setdefault("5", [])
        if "giao_vien" not in a5: a5.append("giao_vien")
    save(rel, C)


# ------------------------------------------------------------------ 7. thu vien mo phong
def mo_phong():
    rel = "thu-vien/mo-phong/danh-muc.json"; C = load(rel)
    fe = next(e for e in C if e["id"] == "sim.figure_explorer")
    if not any(p["name"] == "background_src" for p in fe["params"]):
        i = next(i for i, p in enumerate(fe["params"]) if p["name"] == "background") + 1
        fe["params"].insert(i, {"name": "background_src", "type": "chuoi (asset_path)", "default": "sim/<id>.svg",
                                "note": "D2 (đề xuất R1/R2): ảnh nền chính thức; hình vẽ bằng mã xuất thành sim/<id>.svg; ảnh trang dùng page_crop. Có thể mang tiền tố '@<nguồn>/'."})
    save(rel, C, indent=1)


# ------------------------------------------------------------------ 8. gia su
def gia_su():
    rel = "gia-su/prompts.json"; G = load(rel)
    G["version"] = VER
    for ar in G["age_rules"]:
        if ar.get("status") == "de_xuat":
            ar["status"] = "duyet_d2"
            ar["note"] = "Đề xuất của agent Gia sư, đã duyệt ở D2 (18/11/2026); cần thử với học sinh/giáo viên thật."
    for r in G["roles"]:
        if r["id"] == "open_grade":
            r["store"] = {"db": "res/<set>_<uid>.answers[<key>].ai", "teacher_override": "grade/<set>_<uid>",
                          "note": "D2: kết quả AI chấm lưu lên db cùng bài làm; điểm GV (trục 5 giao_vien) là điểm cuối."}
        if r["id"] == "open_feedback":
            r["store"] = {"db": "res/<set>_<uid>.answers[<key>].ai", "note": "D2: nhận xét AI lưu cùng bài làm để GV xem."}
    hi = G["host_interface"]["methods"]
    hi["usageGuide()"] = "D2 (duyệt): trả về book_usage_guide sinh từ chú giải ghim thật (không viết tay)"
    save(rel, G, indent=1)


# ------------------------------------------------------------------ 9. nha may media
def nha_may():
    """Sua tren van ban de giu dinh dang gon cua file (moi muc mot dong)."""
    rel = "nha-may-media/danh-muc-loai-media.json"
    raw = open(P(rel), encoding="utf8").read(); s = raw
    s = s.replace('"version": "0.9-draft"', f'"version": "{VER}"', 1)
    s = re.sub(r'"audio_giao": "[^"]*"', '"audio_giao": "MP3 CBR, mono, 44,1 kHz, 64 kbps (0,48 MB/phút) – CHỐT D2 (18/11/2026). Bỏ mức 32 kbps. Audio cũ ~32 kbps (audio_vi của kimyo8/fizika8) giữ nguyên tới khi sinh lại."', s, count=1)
    s = re.sub(r'"ghi_chu_gioi_han": "[^"]*"', '"ghi_chu_gioi_han": "Mỗi asset ≤ ~20 MB (ràng buộc artifact); nhà máy dùng trần an toàn 18 MiB. Ở 64 kbps một sprite tối đa ~39 phút.",\n    "ngan_sach_dung_luong": "D2: mỗi artifact ≤ 256 MB, mục tiêu ≤ 230 MB. Vượt 230 MB thì lần lượt: (1) chuyển ảnh trang của bản in thứ hai (pages_ru/ khi bản gốc là uz) sang artifact đồng hành, khai báo book.asset_sources + tiền tố \'@<nguồn>/\' trong đường dẫn; (2) gỡ file thừa; (3) vẫn vượt 256 MB thì báo người. KHÔNG hạ bitrate audio."' if '"ngan_sach_dung_luong"' not in s else r'\g<0>', s, count=1)
    s = s.replace('"bitrate_kbps": [64, 32]', '"bitrate_kbps": [64]')
    s = s.replace('giá trị trục chưa có trong từ điển ghi ở de_xuat_truc_moi (xem BAO-CAO)', 'giá trị trục mới đề xuất đã được duyệt ở D2 và đưa vào từ điển (video_nguoi_dan, subtitles)')
    s = s.replace('"axes": {"7": ["3-4", "5-7", "8-9", "10-11"], "9": ["asset_toi_da_20mb", "gan_gioi_han_256mb", "teacher_media_replace"]},\n      "de_xuat_truc_moi": {"3": ["video_nguoi_dan"]},',
                  '"axes": {"3": ["video_nguoi_dan"], "7": ["3-4", "5-7", "8-9", "10-11"], "9": ["asset_toi_da_20mb", "gan_gioi_han_256mb", "teacher_media_replace"]},')
    s = s.replace('"axes": {"3": ["video_hoat_hinh_dung_bang_ma"], "7": ["3-4", "5-7", "8-9", "10-11"]},\n      "de_xuat_truc_moi": {"9": ["subtitles"]},',
                  '"axes": {"3": ["video_hoat_hinh_dung_bang_ma"], "7": ["3-4", "5-7", "8-9", "10-11"], "9": ["subtitles"]},')
    s = s.replace("(đề xuất kind 'subtitle')", "(kind 'subtitle', D2)")
    json.loads(s)
    assert "de_xuat_truc_moi\": {" not in s, "con de_xuat_truc_moi"
    if s != raw:
        open(P(rel), "w", encoding="utf8").write(s); print("  sua", rel)


if __name__ == "__main__":
    for fn in (tu_dien, book_schema, features_schema, vidu_features, vidu_book, bai_tap, mo_phong, gia_su, nha_may):
        print(fn.__name__); fn()
