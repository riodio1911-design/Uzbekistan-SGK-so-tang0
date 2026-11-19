"""Sinh vi-du/<cuon>.features.json tu ho so 9 truc cua 7 ban kiem ke (da chuyen sang enum v0.9).
Chay: python3 -I make_features.py <thu-muc-schema>"""
import json, sys, os

OUT = os.path.join(sys.argv[1], "vi-du")
TTS = "tts_trinh_duyet"
A_FEATS = dict(results_local=True, ai_hint=True, tutor_chat=True, reminders=True, dark_mode=True,
               deep_link=True, thumbnails=True, translation_drawer=True)

def mk(book, axes, layers, caps, features, tutor, sources, notes):
    return {"schema_version": "0.9", "book_id": book, "axes": axes, "layers": layers,
            "capabilities": caps, "features": features, "tutor": tutor, "sources": sources, "notes": notes}

def a7(grade, age, aud=("hoc_sinh",), readers=("vi", "ru")):
    band = {5: "5-7", 8: "8-9"}[grade]
    return {"grade_bands": [band], "grades": [grade], "age": age, "audience": list(aud), "reader_langs": list(readers)}

B = {}

B["matematika5"] = mk("matematika5", {
    "1": {"values": ["anh_trang_quet", "vo_bai_tap_in"], "page_count": {"textbook": 176, "workbook": 221},
          "note": "AHA! Matematika 5; so trang in i–iv roi 1–172 / 1–217"},
    "2": {"structure": ["chuong", "chu_de_mo_dau_bai_tong_ket", "trang", "bo_vo_bai_tap"], "rubric_set": None, "rubrics": []},
    "3": ["ghi_chu_dich_vung_trang", "video_hoat_hinh_dung_bang_ma", "audio_thuyet_minh", "mo_hinh_tuong_tac"],
    "4": ["ex.short_answer", "ex.open_response", "ex.choice_single"],
    "5": {"values": ["tu_dong", "khong_cham"], "rules": ["chuan_hoa_chuoi_so", "dap_an_thay_the", "nhieu_o_mot_y",
          "loi_giai_sau_2_lan_sai", "chi_dem_da_lam", "ai_goi_y_khong_cham", "diem_thang_10_theo_bo"]},
    "6": ["cham_vung_dich", "ghim_tren_trang", "modal", "o_nhap_tren_trang", "thanh_truot_tham_so", "trinh_chieu_canh", "chat_ai_co_tool"],
    "7": a7(5, "10–11", ("hoc_sinh", "giao_vien")),
    "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["uz"],
          "audio": {"vi": "mp3_khong_ro", "uz": TTS, "ru": TTS}, "audio_granularity": "audio_theo_canh",
          "translation_display": ["bong_bong", "ngan_dich"], "translation_fill": "day_du_trong_du_lieu", "reviewed_by_native": None},
    "9": {"bundle_mb": 52.44, "html_mb": 1.5, "flags": ["du_lieu_cung_trong_html", "ai_can_sample", "font_khong_nap"]},
}, {"trang_goc_ghim": True, "bai_hoc": False, "doc_van": False, "vo_bai_tap": True, "default_view": "trang_goc_ghim"},
   ["sample", "db", "user"],
   dict(A_FEATS, teacher_assign=True, teacher_class_results=True, results_to_db=True, teacher_media_replace=False, progress_tracking=True),
   {"persona": "robo", "roles": ["tro_chuyen", "goi_y", "do_nhanh", "nhac_viec"], "model_tier": {"goi_y": "quick"}},
   [{"book": "matematika5", "code": "kiem-ke/matematika5.json#ho_so_9_truc"}, {"book": "matematika5", "code": "WBI, WBS, hw/, res/"}],
   "Cuon duy nhat co giao bai + ket qua lop qua db.")

B["informatika5"] = mk("informatika5", {
    "1": {"values": ["anh_trang_quet"], "page_count": {"textbook": 176}},
    "2": {"structure": ["chuong", "chu_de_mo_dau_bai_tong_ket", "trang"], "rubric_set": None, "rubrics": []},
    "3": ["ghi_chu_dich_vung_trang", "video_hoat_hinh_dung_bang_ma", "audio_thuyet_minh", "demo_man_hinh", "muc_luc_mo_dun"],
    "4": ["ex.open_response", "ex.short_answer", "ex.choice_single", "ex.order", "ex.sort_bins", "ex.spreadsheet"],
    "5": {"values": ["tu_dong", "khong_cham"], "rules": ["chuan_hoa_chuoi_so", "dap_an_thay_the", "loi_giai_mau_sau_khi_luu", "ai_goi_y_khong_cham"]},
    "6": ["cham_vung_dich", "ghim_tren_trang", "modal", "nut_len_xuong", "chon_nhom_cho_the", "sua_o_cong_thuc",
          "trinh_chieu_canh", "mo_phong_thao_tac_phan_mem", "chat_ai_co_tool"],
    "7": a7(5, "10–11"),
    "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["uz"],
          "audio": {"vi": "mp3_khong_ro", "uz": TTS, "ru": TTS}, "audio_granularity": "audio_theo_canh",
          "translation_display": ["bong_bong", "ngan_dich"], "translation_fill": "day_du_trong_du_lieu", "reviewed_by_native": None},
    "9": {"bundle_mb": 44.7, "html_mb": 1.89, "flags": ["du_lieu_cung_trong_html", "ai_can_sample", "ket_qua_chi_localstorage", "ghi_de_gv_can_quyen_admin"]},
}, {"trang_goc_ghim": True, "bai_hoc": False, "doc_van": False, "default_view": "trang_goc_ghim"},
   ["sample", "db", "user", "assets"],
   dict(A_FEATS, teacher_media_replace=True, reduced_motion=True),
   {"persona": "robo", "roles": ["tro_chuyen", "goi_y", "do_nhanh", "nhac_viec"], "model_tier": {"goi_y": "quick"}},
   [{"book": "informatika5", "code": "kiem-ke/informatika5.json#ho_so_9_truc"}, {"book": "informatika5", "code": "window.DM, window.DEMO_STG"}],
   "Gia tri D1 'mo_phong_thao_tac_phan_mem' (truc 6) den tu 81 kich ban DM.")

B["tabiiy5"] = mk("tabiiy5", {
    "1": {"values": ["anh_trang_quet", "vo_bai_tap_in"], "page_count": {"textbook": 142, "workbook": 117},
          "note": "SGK Tabiiy fanlar 5 (2024), anh trang p008–p149 + Mashq daftari w001–w117"},
    "2": {"structure": ["chuong", "bai_so_hieu", "trang", "bo_vo_bai_tap"], "rubric_set": "tabiiy5",
          "rubrics": ["objectives", "think", "explore", "learn", "video", "quiz", "skills", "workbook", "career", "problem", "robot"]},
    "3": ["van_ban_song_ngu", "gallery_anh", "video_hoat_hinh_dung_bang_ma", "audio_thuyet_minh", "thuat_ngu", "nghe_nghiep", "mo_hinh_tuong_tac"],
    "4": ["ex.sort_bins", "ex.order", "ex.choice_single", "ex.true_false", "ex.match_pairs", "ex.fill_blanks", "ex.short_answer", "ex.table_fill",
          "ex.open_response", "ex.sketch", "ex.crossword", "ex.choice_per_row", "ex.choice_multi", "ex.label_diagram", "ex.self_check",
          "ex.experiment_variables", "ex.list_examples", "ex.sim_task", "ex.mark_done"],
    "5": {"values": ["tu_dong", "ai", "khong_cham"], "rules": ["chuan_hoa_chuoi_so", "regex_tu_khoa_du_phong", "ai_cham_diem_0_2", "tu_kiem_tra"]},
    "6": ["ghim_tren_trang", "modal", "chon_nhom_cho_the", "nut_len_xuong", "noi_cot", "thanh_truot_tham_so", "webaudio", "ve_muc",
          "o_nhap_tren_trang", "trinh_chieu_canh", "nghe_theo_khoi", "chat_ai_co_tool"],
    "7": a7(5, "10–11"),
    "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["uz"],
          "audio": {"uz": "mp3_khong_ro", "vi": "mp3_khong_ro", "ru": "mp3_khong_ro"}, "audio_granularity": "audio_theo_khoi",
          "translation_display": ["ngan_dich", "dong_duoi_dong"], "translation_fill": "tu_dien_runtime", "reviewed_by_native": None},
    "9": {"bundle_mb": 231, "html_mb": 1.81, "unused_mb": 84.15,
          "flags": ["du_lieu_cung_trong_html", "ai_can_sample", "ket_qua_chi_localstorage", "ghi_de_gv_can_quyen_admin", "asset_toi_da_20mb"]},
}, {"trang_goc_ghim": True, "bai_hoc": True, "doc_van": False, "vo_bai_tap": True, "default_view": "trang_goc_ghim"},
   ["sample", "db", "user", "assets", "downloads"],
   dict(A_FEATS, ai_hint=False, ai_feedback=True, teacher_media_replace=True, workbook_export=True, page_audio_queue=True,
        speech_rate=True, ink_on_page=True, glossary_view=False),
   {"persona": "robo", "roles": ["tro_chuyen", "cham_bai", "do_nhanh", "nhac_viec", "huong_dan"], "model_tier": {"cham_bai": "quick"}},
   [{"book": "tabiiy5", "code": "kiem-ke/tabiiy5.json#ho_so_9_truc"}, {"book": "tabiiy5", "code": "window.WB, WBGEO, HOT, BOOK"}],
   "Ban 'Trang goc': lop bai hoc mo trong modal tu diem cham. Ban dich ru lay qua RUDICT luc chay.")

B["biologiya5"] = mk("biologiya5", {
    "1": {"values": ["anh_trang_quet", "bo_cuc_theo_ban_nga", "trang_dung_lai_chu_that"], "page_count": {"textbook": 96},
          "note": "Anh trang + lop chu dung lai tu PG (bo cuc ban Nga, chu Uzbek do vao cung hop)"},
    "2": {"structure": ["chuong", "bai_so_hieu", "trang"], "rubric_set": "biologiya5",
          "rubrics": ["think", "learn", "explore", "keywords", "questions", "task", "lab", "quiz", "glossary"]},
    "3": ["van_ban_song_ngu", "hinh_co_nhan", "kham_pha_hinh", "bang", "video_hoat_hinh_dung_bang_ma", "audio_thuyet_minh", "thuat_ngu", "tu_khoa", "mo_hinh_tuong_tac"],
    "4": ["ex.choice_single", "ex.sort_bins", "ex.order", "ex.open_response", "ex.table_fill", "ex.label_reveal", "ex.choice_per_row"],
    "5": {"values": ["tu_dong", "ai", "khong_cham"], "rules": ["ai_nhan_xet_dinh_tinh", "tu_kiem_tra"]},
    "6": ["ghim_tren_trang", "modal", "diem_nong_tren_hinh", "cham_chon", "trinh_chieu_canh", "nghe_theo_khoi", "chat_ai_co_tool"],
    "7": a7(5, "10–11", ("hoc_sinh", "phu_huynh", "giao_vien")),
    "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["ru"],
          "audio": {"uz": "mp3_khong_ro", "vi": "mp3_khong_ro", "ru": "mp3_khong_ro"}, "audio_granularity": "audio_theo_khoi",
          "translation_display": ["dong_duoi_dong"], "translation_fill": "day_du_trong_du_lieu", "reviewed_by_native": None},
    "9": {"bundle_mb": 233.78, "html_mb": 3.61, "unused_mb": 71,
          "flags": ["gan_gioi_han_256mb", "ai_can_sample", "ket_qua_chi_localstorage", "ghi_de_gv_can_quyen_admin", "capability_khai_bao_thieu_user"]},
}, {"trang_goc_ghim": True, "bai_hoc": True, "doc_van": False, "default_view": "trang_goc_ghim"},
   ["sample", "db", "user", "assets"],
   dict(results_local=True, ai_feedback=True, tutor_chat=True, reminders=True, dark_mode=True, reduced_motion=True, deep_link=True,
        teacher_media_replace=True, teacher_content_edit=True, page_audio_queue=True, speech_rate=True, glossary_view=True, progress_tracking=True),
   {"persona": "robo", "roles": ["tro_chuyen", "cham_bai", "do_nhanh", "nhac_viec", "huong_dan"]},
   [{"book": "biologiya5", "code": "kiem-ke/biologiya5.json#ho_so_9_truc"}, {"book": "biologiya5", "code": "window.PG (W,H,st,pg,T,figs,end), db edit"}],
   "Ma goi use('user') nhung artifact khong khai bao user (khong chac) - xem flag.")

B["adabiyot5"] = mk("adabiyot5", {
    "1": {"values": ["anh_trang_quet", "anh_nen_xoa_chu", "trang_dung_lai_chu_that"], "page_count": {"textbook": 98},
          "note": "Van hoc lop 5 Phan I (Toshkent 2024); che do html = bg/ + chu SVG tu LN_"},
    "2": {"structure": ["don_vi_doc", "trang"], "rubric_set": "adabiyot5",
          "rubrics": ["bio", "pre", "poem", "prose", "think", "know", "talk", "task.topshiriq", "task.ijodiy", "task.uyga", "gloss", "quiz"]},
    "3": ["van_ban_song_ngu", "tho", "van_xuoi", "tieu_su_tac_gia", "hadis_trich_dan", "so_tu", "phim_tranh", "audio_thuyet_minh", "bang"],
    "4": ["ex.choice_single", "ex.open_response", "ex.table_fill", "ex.fill_blanks", "ex.mark_done", "ex.oral_recording"],
    "5": {"values": ["tu_dong", "ai", "khong_cham"], "rules": ["ai_nhan_xet_dinh_tinh"]},
    "6": ["cham_vung_dich", "doc_theo_cau", "popup_so_tu", "ghim_tren_trang", "o_nhap_tren_trang", "modal", "chat_ai_co_tool"],
    "7": a7(5, "10–11"),
    "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["uz"],
          "audio": {"uz": "mp3_tts", "vi": "mp3_tts", "ru": "mp3_tts"}, "audio_granularity": "audio_theo_cau",
          "translation_display": ["dong_duoi_dong", "ngan_dich"], "translation_fill": "day_du_trong_du_lieu", "reviewed_by_native": False},
    "9": {"bundle_mb": 219, "html_mb": 1.38, "unused_mb": 45,
          "flags": ["gan_gioi_han_256mb", "audio_giong_may", "ban_dich_chua_duyet", "ket_qua_chi_localstorage", "ai_can_sample", "capability_khai_bao_thieu_user"]},
}, {"trang_goc_ghim": True, "bai_hoc": True, "doc_van": True, "default_view": "trang_goc_ghim"},
   ["sample", "db", "user", "assets"],
   dict(results_local=True, ai_feedback=True, tutor_chat=True, dark_mode=True, reduced_motion=True, deep_link=True,
        teacher_media_replace=True, teacher_content_edit=True, page_audio_queue=True, glossary_view=True, progress_tracking=True),
   {"persona": "oqilbek", "roles": ["cham_bai", "tro_chuyen"]},
   [{"book": "adabiyot5", "code": "kiem-ke/adabiyot5.json#ho_so_9_truc"}, {"book": "adabiyot5", "code": "DATA.units, SPR, HOT, LN_, GEO, db quiz"}],
   "Cuon duy nhat co ca ba lop. Quiz 116 cau la bo sung (khong co trong sach).")

for bk, total, html, pages, extra_flags, notes in [
        ("kimyo8", 117.65, 2.85, 208, [], "Ban in Nga song song (pages_ru + RUTXT)."),
        ("fizika8", 130, 3.51, 176, ["ten_thuong_hieu_trong_title"], "Cung khung voi kimyo8; pages_ru/p157.jpg nghi hong (khong chac).")]:
    B[bk] = mk(bk, {
        "1": {"values": ["anh_trang_quet", "ban_in_nga_song_song", "ocr_ban_in"], "page_count": {"textbook": pages}},
        "2": {"structure": ["chuong", "bai_so_hieu", "chu_de_mo_dau_bai_tong_ket", "trang"], "rubric_set": None, "rubrics": []},
        "3": ["ghi_chu_dich_vung_trang", "kham_pha_hinh", "video_hoat_hinh_dung_bang_ma", "audio_thuyet_minh", "ocr_ban_nga"],
        "4": ["ex.short_answer", "ex.open_response", "ex.choice_single", "ex.order", "ex.sort_bins"],
        "5": {"values": ["tu_dong", "khong_cham"], "rules": ["chuan_hoa_chuoi_so", "dap_an_thay_the", "loi_giai_sau_2_lan_sai",
              "loi_giai_mau_sau_khi_luu", "ai_goi_y_khong_cham"]},
        "6": ["ghim_tren_trang", "cham_vung_dich", "modal", "hoat_hinh_theo_thoi_gian", "trinh_chieu_canh", "nut_len_xuong",
              "chon_nhom_cho_the", "diem_nong_tren_hinh", "chat_ai_co_tool"],
        "7": a7(8, "13–14"),
        "8": {"base": "uz", "text": ["uz", "vi", "ru"], "print_editions": ["uz", "ru"],
              "audio": {"vi": "mp3_khong_ro", "uz": TTS, "ru": TTS}, "audio_granularity": "audio_theo_canh",
              "translation_display": ["bong_bong", "ngan_dich"], "translation_fill": "day_du_trong_du_lieu", "reviewed_by_native": None},
        "9": {"bundle_mb": total, "html_mb": html, "flags": ["du_lieu_cung_trong_html", "ai_can_sample", "ket_qua_chi_localstorage",
              "ghi_de_gv_can_quyen_admin", "asset_toi_da_20mb"] + extra_flags},
    }, {"trang_goc_ghim": True, "bai_hoc": False, "doc_van": False, "default_view": "trang_goc_ghim"},
       ["sample", "db", "user", "assets"],
       dict(A_FEATS, teacher_media_replace=True, teacher_bulk_media=True, print_edition_switch=True),
       {"persona": "robo", "roles": ["tro_chuyen", "goi_y", "do_nhanh", "nhac_viec"], "model_tier": {"goi_y": "quick"}},
       [{"book": bk, "code": f"kiem-ke/{bk}.json#ho_so_9_truc"}, {"book": bk, "code": "window.PG, window.TP, window.RUTXT, db media/"}],
       notes)

os.makedirs(OUT, exist_ok=True)
for bk, d in B.items():
    with open(os.path.join(OUT, f"{bk}.features.json"), "w", encoding="utf8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
print("ok", len(B))
