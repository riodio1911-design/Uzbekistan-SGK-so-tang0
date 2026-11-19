#!/usr/bin/env python3
"""lap-phieu.py - script cua agent Dao dien media.

Doc kiem-ke/nhu-cau.json (agent M1 tao), sinh phieu dat hang hop le theo
phieu-dat-hang.schema.json vao phieu/<cuon>/*.json cho cac diem co trang thai
`thieu` hoac `chi_tts_trinh_duyet`, kem tong hop phieu/_tong-hop.{json,csv}.

Chay:  python3 -I lap-phieu.py [--vao kiem-ke/nhu-cau.json] [--ra phieu]
                               [--sach kimyo8,fizika8] [--chi-muc-cache f.json]
                               [--thoi-diem 2026-11-18T00:00:00Z] [--gom-cu]
Thu bang du lieu gia:  python3 -I lap-phieu.py --vao _thu/nhu-cau.json --ra _thu/phieu

Doc nhu-cau.json mot cach "chiu dung": chap nhan nhieu ten khoa (xem ALIAS) vi
dinh dang cuoi cung cua M1 chua chot khi viet script nay. Diem nao khong doc
duoc thi ghi vao tong hop (bo_qua) chu khong lam hong ca lan chay.
"""
import argparse, csv, datetime as dt, hashlib, json, os, re, shutil, sys, unicodedata
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
TANG0 = os.path.dirname(HERE)
PIPELINE_VERSION = "nmm-0.9"
LEXICON_VERSION = "thuat-ngu.csv@0.9"
CPM_DEFAULT = 900            # ky tu/phut khi khong biet ngon ngu (uoc luong)
CPM = {"uz": 754, "vi": 861, "ru": 703, "kaa": 754}  # do tu clip co san (kiem-ke/BAO-CAO.md cua M1); kaa tam lay = uz
MB_PER_MIN = {64: 0.48}   # 64 kbps = 8 KB/s = 0,48 MB/phut (MB = 10^6 B). D2: chot 64 kbps, bo muc 32 kbps
MAX_BYTES = 18874368         # tran an toan 18 MiB < 20 MB/asset
STATUS_GEN = {"thieu", "chi_tts_trinh_duyet"}
LANGS = {"uz", "ru", "vi", "kaa"}
AUDIO_TYPES = {"media.narration_page", "media.narration_block", "media.sentence_audio",
               "media.figure_point_audio", "media.scene_narration", "media.term_audio",
               "media.exercise_prompt_audio"}
NO_LANG_TYPES = {"media.illustration", "media.sfx"}

# ---- ten khoa chap nhan trong nhu-cau.json -------------------------------
ALIAS = {
    "id": ["id", "item_id", "diem_id", "ma", "key", "clip_id"],
    "kind": ["loai", "loai_media", "loai_can", "media_type", "can", "kind", "type"],
    "where": ["gan_voi", "khoi", "cap", "vi_tri", "loai_diem", "diem", "scope", "level"],
    "lang": ["ngon_ngu", "lang", "langs", "ngon_ngu_list"],
    "status": ["trang_thai", "status", "tinh_trang"],
    "chars": ["ky_tu", "so_ky_tu", "chars", "do_dai", "len", "do_dai_ky_tu"],
    "preview": ["dau_80", "trich", "preview", "80_ky_tu_dau", "van_ban_dau", "mau"],
    "text": ["van_ban", "text", "van_ban_nguon", "nguon"],
    "text_path": ["text_path", "con_tro", "json_path", "duong_dan"],
    "text_hash": ["source_hash", "text_hash", "sha256", "hash"],
    "page": ["trang", "page"],
    "lesson": ["bai", "lesson", "chuong", "unit"],
    "grade": ["cap_lop", "grade_band"],
    "purpose": ["muc_dich", "purpose", "vai_tro"],
}
PURPOSE_MAP = {  # muc_dich trong nhu-cau.json cua M1 -> media.*
    "canh_video": "media.scene_narration", "video_canh": "media.code_video", "buoc_demo": "media.scene_narration",
    "khoi_bai": "media.narration_block", "gioi_thieu_chuong": "media.narration_block",
    "diem_hinh": "media.figure_point_audio", "diem_hinh_loi_dan": "media.figure_point_audio",
    "bo_phan_mo_hinh": "media.figure_point_audio", "thuat_ngu": "media.term_audio",
    "cau_van": "media.sentence_audio", "dong_tho": "media.sentence_audio", "tieu_de": "media.sentence_audio",
    "cau_hoi": "media.sentence_audio", "phim_tranh": "media.code_video",
}
BOOK_CONTAINER_KEYS = ["books", "sach", "cuon", "theo_cuon", "items_by_book"]
ITEM_CONTAINER_KEYS = ["diem", "items", "points", "diem_can_media", "nhu_cau", "danh_sach"]

KIND_MAP = {
    "doc_theo_cau": "media.sentence_audio", "video_ma": "media.code_video",
    "video_nguoi_dan": "media.presenter_video", "anh_minh_hoa": "media.illustration",
    "hieu_ung": "media.sfx", "phu_de": "media.subtitles", "ban_quay_mp4": "media.sim_recording_mp4",
    "quay_mp4": "media.sim_recording_mp4", "loi_doc_diem_hinh": "media.figure_point_audio",
    "diem_hinh": "media.figure_point_audio", "thuat_ngu": "media.term_audio",
    "bai_tap_loi_doc": "media.exercise_prompt_audio", "canh_video": "media.scene_narration",
    "thuyet_minh_canh": "media.scene_narration", "thuyet_minh_trang": "media.narration_page",
    "thuyet_minh_khoi": "media.narration_block", "thuyet_minh_bai": "media.narration_block",
}
SKIP_KINDS = {"anh_trang": "anh trang quet khong do nha may san xuat", "khac": "loai 'khac' can nguoi phan loai"}
WHERE_HINTS = [  # (regex tren where/id, media_type) cho loai 'thuyet_minh'
    (r"canh|scene|video|-s\d+$", "media.scene_narration"),
    (r"hinh|figure|fig|diem_hinh|point|\.p\d+$", "media.figure_point_audio"),
    (r"bai_tap|exercise|\bex\b", "media.exercise_prompt_audio"),
    (r"thuat_ngu|term", "media.term_audio"),
    (r"trang|page|^p\d+|\btr\b", "media.narration_page"),
    (r"cau|sentence", "media.sentence_audio"),
]
PERSONA = {"media.sentence_audio": "storyteller", "media.presenter_video": "presenter",
           "media.term_audio": "narrator", "media.scene_narration": "narrator"}
LANG_PRIO = {"uz": 1, "ru": 2, "kaa": 3, "vi": 4, "zxx": 3}
TYPE_PRIO_ADJ = {"media.sfx": 1, "media.presenter_video": 1, "media.sim_recording_mp4": 2,
                 "media.illustration": 1, "media.subtitles": 1}
CER = {"uz": 0.08, "ru": 0.05, "vi": 0.06, "kaa": 0.10}


def pick(d, key, default=None):
    for k in ALIAS[key]:
        if isinstance(d, dict) and k in d and d[k] not in (None, ""):
            return d[k]
    return default


def nfc(s):
    return unicodedata.normalize("NFC", s)


def sha(obj):
    if isinstance(obj, str):
        b = nfc(obj).encode("utf-8")
    else:
        b = json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
        b = nfc(b.decode("utf-8")).encode("utf-8")
    return "sha256:" + hashlib.sha256(b).hexdigest()


def safe_id(s):
    s = re.sub(r"[^A-Za-z0-9_.:#-]+", ".", str(s)).strip(".")
    return s if s and re.match(r"[A-Za-z0-9]", s) else "x" + s


def grade_band_for(book, need):
    g = pick(need, "grade")
    if g in {"0-2", "3-4", "5-7", "8-9", "10-11"}:
        return g
    m = re.search(r"(\d+)$", book)
    if not m:
        return None
    n = int(m.group(1))
    return "0-2" if n <= 2 else "3-4" if n <= 4 else "5-7" if n <= 7 else "8-9" if n <= 9 else "10-11"


# ---- doc nhu-cau.json ------------------------------------------------------
def iter_books(data):
    """Tra ve [(book, [need,...])] tu nhieu dang co the."""
    if isinstance(data, dict):
        for k in BOOK_CONTAINER_KEYS:
            if k in data:
                return iter_books(data[k])
        out = []
        for book, v in data.items():
            if book.startswith("_") or book in ("version", "mo_ta", "ghi_chu", "meta", "tong", "nguon"):
                continue
            if isinstance(v, list):
                out.append((book, v))
            elif isinstance(v, dict):
                items = next((v[k] for k in ITEM_CONTAINER_KEYS if isinstance(v.get(k), list)), None)
                if items is not None:
                    out.append((book, items))
        return out
    if isinstance(data, list):  # [{book:..., diem:[...]}] hoac [{book:..., id:...}]
        grouped = defaultdict(list)
        for x in data:
            if not isinstance(x, dict):
                continue
            b = x.get("book") or x.get("cuon") or x.get("ma_cuon")
            items = next((x[k] for k in ITEM_CONTAINER_KEYS if isinstance(x.get(k), list)), None)
            if items is not None:
                grouped[b].extend(items)
            else:
                grouped[b].append(x)
        return list(grouped.items())
    return []


def expand_langs(need):
    """Tra ve [(lang, status, per_lang_dict)]. Ho tro: lang chuoi/list; status chuoi/dict theo lang;
    hoac khoa 'theo_ngon_ngu': {uz:{trang_thai,ky_tu,...}}."""
    per = need.get("theo_ngon_ngu") or need.get("by_lang") or need.get("ngon_ngu_chi_tiet")
    if isinstance(per, dict):
        return [(l, pick(v, "status") if isinstance(v, dict) else v, v if isinstance(v, dict) else {})
                for l, v in per.items()]
    lang = pick(need, "lang")
    st = pick(need, "status")
    if isinstance(lang, dict):
        return [(l, (v if isinstance(v, str) else pick(v, "status")), v if isinstance(v, dict) else {})
                for l, v in lang.items()]
    langs = lang if isinstance(lang, list) else [lang] if lang else ["zxx"]
    if isinstance(st, dict):
        return [(l, st.get(l), {}) for l in langs]
    return [(l, st, {}) for l in langs]


def media_type_for(need, item_id):
    kind = pick(need, "kind")
    if isinstance(kind, list):
        kind = kind[0] if kind else None
    if not kind:
        return None, "khong co loai media"
    kind = str(kind)
    if kind.startswith("media."):
        return kind, None
    purpose = pick(need, "purpose")
    if purpose in PURPOSE_MAP and kind in ("thuyet_minh", "doc_theo_cau", "video_ma"):
        return PURPOSE_MAP[purpose], None
    if kind in SKIP_KINDS:
        return None, SKIP_KINDS[kind]
    if kind in KIND_MAP:
        return KIND_MAP[kind], None
    if kind.startswith("thuyet_minh") or kind in ("loi_doc", "audio"):
        w = pick(need, "where")
        where = " ".join(str(x) for x in [w if isinstance(w, str) else "", purpose or "", item_id])
        for rx, mt in WHERE_HINTS:
            if re.search(rx, where, re.I):
                return mt, None
        return "media.narration_block", None
    return None, "loai chua anh xa: " + kind


def target_for(mt, book, item, lang, need, per):
    t = {}
    if mt in AUDIO_TYPES or mt == "media.sfx":
        t["book_path"] = f"/media/clips/{item}/{lang if lang != 'zxx' else 'uz'}"
        t["clip_id"] = item
        m = re.match(r"([A-Za-z]+\d+)", item)
        grp = m.group(1).lower() if m else "chung"
        if mt == "media.term_audio":
            grp = "terms"
        t["sprite_group"] = "audio/zxx/sfx.mp3" if mt == "media.sfx" else f"audio/{lang}/{book}-{grp}.mp3"
    elif mt == "media.code_video":
        t["book_path"] = "/videos/-"
        t["video_id"] = item
    elif mt == "media.subtitles":
        t["book_path"] = "/media/files/-"
        t["video_id"] = item
    else:
        t["book_path"] = "/media/files/-"
    tp = pick(per, "text_path") or pick(need, "text_path")
    if isinstance(tp, str) and tp.startswith("/"):
        tp = re.sub(r"/(uz|ru|vi|kaa)$", "/" + lang, tp) if lang in LANGS else tp
        t["text_path"] = tp
    p = pick(need, "page")
    if isinstance(p, int):
        t["page"] = p
    les = pick(need, "lesson")
    if les not in (None, ""):
        t["lesson"] = str(les)
    return t


def format_profile(mt):
    if mt in AUDIO_TYPES or mt == "media.sfx":
        return "mp3_mono_44k_64"
    return {"media.code_video": "json_video", "media.sim_recording_mp4": "mp4_h264_720p",
            "media.presenter_video": "mp4_h264_540p", "media.illustration": "webp_1600",
            "media.subtitles": "vtt"}.get(mt, "khac")


def source_kind(mt):
    return {"media.sentence_audio": "sentences", "media.code_video": "video_json",
            "media.sim_recording_mp4": "scene_params", "media.presenter_video": "script",
            "media.illustration": "image_prompt", "media.sfx": "sfx_prompt",
            "media.term_audio": "term"}.get(mt, "text")


VOICES = {}  # nap tu --giong: {"uz:narrator": "<voice_id>", "uz": "<voice_id>"} sau khi nguoi duyet giong mau


def approved_voice(lang, persona):
    return VOICES.get(f"{lang}:{persona}") or VOICES.get(lang)


def build_order(book, need, lang, status, per, mt, now, cache):
    item = safe_id(pick(need, "id"))
    if mt in NO_LANG_TYPES:
        lang = "zxx"
    chars = pick(per, "chars", pick(need, "chars"))
    try:
        chars = int(chars) if chars is not None else None
    except (TypeError, ValueError):
        chars = None
    preview = pick(per, "preview", pick(need, "preview"))
    text = pick(per, "text", pick(need, "text"))
    if isinstance(text, dict):  # {uz:..., ru:...} hoac {ky_tu, dau_80}
        chars = chars if chars is not None else pick(text, "chars")
        preview = preview or pick(text, "preview")
        text = text.get(lang) if isinstance(text.get(lang), str) else None
    if not isinstance(text, str) or (preview and text == preview and chars and chars > len(text)):
        text = None  # chi co doan trich, khong phai van ban day du
    if isinstance(preview, str):
        preview = preview[:80]
    text_hash = pick(per, "text_hash", pick(need, "text_hash"))
    if isinstance(text_hash, str) and re.fullmatch(r"[0-9a-f]{64}", text_hash):
        text_hash = "sha256:" + text_hash
    if not (isinstance(text_hash, str) and re.fullmatch(r"sha256:[0-9a-f]{64}", text_hash)):
        text_hash = sha(text) if text else None
    if text and chars is None:
        chars = len(nfc(text))

    tgt = target_for(mt, book, item, lang, need, per)
    voice = None
    if mt in AUDIO_TYPES:
        persona = PERSONA.get(mt, "narrator")
        voice = {"provider": "elevenlabs", "model": "eleven_v3",
                 "voice_id": approved_voice(lang, persona) or "chua_chot", "persona": persona}
    elif mt == "media.presenter_video":
        voice = {"provider": "heygen", "voice_id": "chua_chot", "avatar_id": "chua_chot", "persona": "presenter"}
    elif mt in ("media.sfx", "media.illustration", "media.code_video", "media.subtitles", "media.sim_recording_mp4"):
        voice = {"provider": "none"}

    cpm = CPM.get(lang, CPM_DEFAULT)
    cons = {"format_profile": format_profile(mt), "max_bytes": MAX_BYTES, "lexicon_version": LEXICON_VERSION}
    gb = grade_band_for(book, need)
    if gb:
        cons["grade_band"] = gb
    if mt in AUDIO_TYPES:
        cons["chars_per_minute"] = cpm
        if chars:
            cons["expected_seconds"] = round(chars / cpm * 60, 1)
        if lang in CER:
            cons["stt_cer_max"] = CER[lang]
    lex = need.get("lexicon") or need.get("thuat_ngu")
    if isinstance(lex, list) and lex:
        cons["lexicon"] = [x for x in lex if isinstance(x, str) and x.startswith("term.")]

    src = {"kind": source_kind(mt)}
    if text:
        src["text"] = nfc(text)
    if "text_path" in tgt:
        src["text_path"] = tgt["text_path"]
    legacy = pick(per, "text_path") or pick(need, "text_path")
    if isinstance(legacy, str) and legacy and not legacy.startswith("/"):
        src["legacy_path"] = legacy
    if chars is not None:
        src["chars"] = chars
    if preview:
        src["preview"] = preview
    if text_hash:
        src["text_hash"] = text_hash
    if mt == "media.term_audio" and item.startswith("term."):
        src["term_id"] = item
    if mt in NO_LANG_TYPES and "prompt" not in src:
        src["prompt"] = preview or f"(Bien kich viet mo ta cho {item})"
    # bao dam thoa anyOf cua source
    if not any(k in src for k in ("text", "sentences", "video", "scene", "sim", "prompt", "term_id")) \
            and not ("text_path" in src and "chars" in src) and not ("legacy_path" in src and "chars" in src):
        src.setdefault("text_path", tgt.get("text_path") or f"/_can_tim/{item}")
        src.setdefault("chars", chars or 0)

    hash_inputs = ["media_type", "lang", "text_hash", "voice", "format_profile", "lexicon_version", "pipeline_version"]
    hin = {"media_type": mt, "lang": lang, "text_hash": text_hash,
           "voice": {k: v for k, v in (voice or {}).items() if k != "persona"},
           "format_profile": cons["format_profile"], "lexicon_version": LEXICON_VERSION,
           "pipeline_version": PIPELINE_VERSION}
    hash_status = "chot" if text_hash and (voice or {}).get("voice_id") != "chua_chot" else "tam_tinh"
    if not text_hash:
        hin["text_hash"] = None
        hin["provisional"] = {"item": item, "chars": chars, "preview": preview}
        hash_inputs.append("provisional")
    source_hash = sha(hin)

    note = str((per or {}).get("ghi_chu") or need.get("ghi_chu") or "")
    na1 = "na=1" in note
    prio = min(5, LANG_PRIO.get(lang, 3) + TYPE_PRIO_ADJ.get(mt, 0) + (1 if na1 else 0))
    order = {
        "schema_version": "0.9-draft",
        "order_id": f"{book}:{item}:{mt}:{lang}",
        "book": book, "item_id": item, "media_type": mt, "lang": lang,
        "target": tgt, "source": src, "constraints": cons,
        "source_hash": source_hash, "hash_status": hash_status, "hash_inputs": hash_inputs,
        "priority": prio, "status": "moi",
        "history": [{"status": "moi", "at": now, "by": "agent:dao_dien",
                     "note": f"tu nhu-cau trang_thai={status}"}],
        "attempt": 0,
        **({"notes": "na=1: che do bai hoc chu y khong doc cau nay; chi can cho che do doc van/cham dong dich"} if na1 else {}),
        "origin": {"need_id": str(pick(need, "id")), "need_status": status,
                   "need_kind": str(pick(need, "kind")), "created_by": "agent:dao_dien",
                   "created_at": now, "mo_rong": bool(need.get("mo_rong"))},
    }
    if voice:
        order["voice"] = voice
    hr = []
    if voice and voice.get("voice_id") == "chua_chot":
        hr.append({"kind": "giong_mau", "reason": f"chua chot giong {voice.get('persona')} cho {lang}", "done": False})
    if mt == "media.presenter_video":
        hr.append({"kind": "avatar", "reason": "duyet avatar + persona", "done": False})
    if mt == "media.illustration" and gb in ("0-2", "3-4"):
        hr.append({"kind": "anh", "reason": "moi anh cho cap 0-4", "done": False})
    if mt == "media.code_video":
        hr.append({"kind": "kich_ban", "reason": "giao vien bo mon duyet kich ban video dau chuong", "done": False})
    if hr:
        order["human_review"] = hr
    if cache and hash_status == "chot" and source_hash in cache:
        order["status"] = "giao"
        order["reuse"] = {"cache_hit": True, "from_file": str(cache[source_hash])}
        order["history"].append({"status": "giao", "at": now, "by": "agent:dieu_phoi", "note": "trung cache"})
    return order


def load_validator():
    from jsonschema import Draft202012Validator, FormatChecker
    from referencing import Registry, Resource
    book = json.load(open(os.path.join(TANG0, "schema", "book.schema.json"), encoding="utf-8"))
    phieu = json.load(open(os.path.join(HERE, "phieu-dat-hang.schema.json"), encoding="utf-8"))
    reg = Registry().with_resources([(book["$id"], Resource.from_contents(book)),
                                     (phieu["$id"], Resource.from_contents(phieu))])
    Draft202012Validator.check_schema(phieu)
    return Draft202012Validator(phieu, registry=reg, format_checker=FormatChecker())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vao", default=os.path.join(HERE, "kiem-ke", "nhu-cau.json"))
    ap.add_argument("--ra", default=os.path.join(HERE, "phieu"))
    ap.add_argument("--sach", default="")
    ap.add_argument("--chi-muc-cache", default="")
    ap.add_argument("--thoi-diem", default="")
    ap.add_argument("--giong", default="", help="JSON giong da duyet {lang hoac lang:persona: voice_id}")
    ap.add_argument("--gom-cu", action="store_true", help="sinh phieu ca cho diem trang_thai 'cu' (hash lech)")
    ap.add_argument("--gom-mo-rong", action="store_true",
                    help="sinh phieu ca cho diem mo_rong=true (diem hinh kham pha ma chua phat; D2: mac dinh KHONG lap)")
    ap.add_argument("--gom-na1", action="store_true",
                    help="sinh phieu ca cho cau na=1 / no_read (D2: che do doc bo qua cau nay nen mac dinh KHONG lap)")
    a = ap.parse_args()
    if not os.path.exists(a.vao):
        print(f"Chua co {a.vao} (M1 chua ghi xong). Thu: --vao {os.path.join(HERE, '_thu', 'nhu-cau.json')}")
        return 2
    now = a.thoi_diem or dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    gen_status = STATUS_GEN | ({"cu"} if a.gom_cu else set())
    data = json.load(open(a.vao, encoding="utf-8"))
    cache = {}
    if a.chi_muc_cache:
        cache = json.load(open(a.chi_muc_cache, encoding="utf-8"))
    only = {s for s in a.sach.split(",") if s}
    if a.giong:
        VOICES.update(json.load(open(a.giong, encoding="utf-8")))
    val = load_validator()

    orders, skipped = [], Counter()
    status_seen = Counter()
    seen_books = set()
    for book, needs in iter_books(data):
        if not book or (only and book not in only):
            continue
        seen_books.add(book)
        for need in needs:
            if not isinstance(need, dict):
                skipped[(book, "diem khong phai object")] += 1
                continue
            if pick(need, "id") in (None, ""):
                skipped[(book, "diem khong co id")] += 1
                continue
            if need.get("mo_rong") and not a.gom_mo_rong:
                skipped[(book, "mo_rong=true (diem hinh chua phat; them --gom-mo-rong)")] += 1
                continue
            mt, why = media_type_for(need, str(pick(need, "id")))
            for lang, st, per in expand_langs(need):
                lang = "zxx" if lang == "*" else lang
                status_seen[str(st)] += 1
                if st not in gen_status:
                    continue
                if mt is None:
                    skipped[(book, why)] += 1
                    continue
                if lang not in LANGS and lang != "zxx":
                    skipped[(book, f"ngon ngu la: {lang}")] += 1
                    continue
                if "na=1" in str((per or {}).get("ghi_chu") or need.get("ghi_chu") or "") and not a.gom_na1:
                    skipped[(book, "na=1 (cau no_read: che do doc bo qua, D2; them --gom-na1)")] += 1
                    continue
                orders.append(build_order(book, need, lang, st, per, mt, now, cache))

    # gop trung order_id (cung diem xuat hien 2 lan): giu ban dau, dem lai
    uniq = {}
    for o in orders:
        if o["order_id"] in uniq:
            skipped[(o["book"], "trung order_id")] += 1
            continue
        uniq[o["order_id"]] = o
    orders = list(uniq.values())

    errors = []
    for o in orders:
        for e in val.iter_errors(o):
            errors.append((o["order_id"], "/".join(map(str, e.absolute_path)), e.message[:200]))

    books = sorted({o["book"] for o in orders} | seen_books)  # D2: xoa ca thu muc cua cuon khong con phieu
    os.makedirs(a.ra, exist_ok=True)
    for b in books:
        d = os.path.join(a.ra, b)
        if os.path.isdir(d):
            shutil.rmtree(d)
        os.makedirs(d)
    for o in orders:
        fn = f"{o['item_id']}__{o['media_type'].split('.', 1)[1]}__{o['lang']}.json".replace(":", "_").replace("#", "_")
        with open(os.path.join(a.ra, o["book"], fn), "w", encoding="utf-8") as f:
            json.dump(o, f, ensure_ascii=False, indent=1)

    agg = defaultdict(lambda: {"so_phieu": 0, "ky_tu": 0, "hash_tam_tinh": 0, "trung_cache": 0})
    for o in orders:
        k = (o["book"], o["lang"], o["media_type"])
        g = agg[k]
        g["so_phieu"] += 1
        g["ky_tu"] += o["source"].get("chars") or 0
        g["hash_tam_tinh"] += o["hash_status"] == "tam_tinh"
        g["trung_cache"] += bool(o.get("reuse", {}).get("cache_hit"))
    rows = []
    for (b, l, mt), g in sorted(agg.items()):
        mins = g["ky_tu"] / CPM.get(l, CPM_DEFAULT) if mt in AUDIO_TYPES else 0
        rows.append({"book": b, "lang": l, "media_type": mt, **g,
                     "phut_uoc_luong": round(mins, 1),
                     "mb_64kbps": round(mins * MB_PER_MIN[64], 1)})
    with open(os.path.join(a.ra, "_tong-hop.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else ["book"])
        w.writeheader()
        w.writerows(rows)
    summary = {
        "nguon": os.path.relpath(a.vao, HERE), "thoi_diem": now, "pipeline_version": PIPELINE_VERSION,
        "cong_thuc": f"phut = ky_tu / ky_tu_moi_phut {CPM} (do tu clip co san, M1; uoc luong); MB = phut x 0,48 (64 kbps, chot D2); chi tinh loai audio",
        "tong_phieu": len(orders),
        "theo_cuon": dict(Counter(o["book"] for o in orders)),
        "theo_ngon_ngu": dict(Counter(o["lang"] for o in orders)),
        "theo_loai": dict(Counter(o["media_type"] for o in orders)),
        "theo_trang_thai_nguon": dict(Counter(o["origin"]["need_status"] for o in orders)),
        "gom_mo_rong": a.gom_mo_rong,
        "gom_na1": a.gom_na1,
        "phieu_na1": sum("notes" in o for o in orders),
        "trang_thai_da_gap_trong_nhu_cau": dict(status_seen),
        "hash_tam_tinh": sum(o["hash_status"] == "tam_tinh" for o in orders),
        "can_nguoi_duyet": dict(Counter(h["kind"] for o in orders for h in o.get("human_review", []))),
        "bo_qua": [{"book": b, "ly_do": r, "so": n} for (b, r), n in sorted(skipped.items())],
        "loi_schema": len(errors),
        "chi_tiet_loi": [{"order_id": i, "path": p, "msg": m} for i, p, m in errors[:50]],
        "bang": rows,
    }
    with open(os.path.join(a.ra, "_tong-hop.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=1)
    print(f"Phieu: {len(orders)} | cuon: {summary['theo_cuon']} | loi schema: {len(errors)} | bo qua: {sum(skipped.values())}")
    for i, p, m in errors[:10]:
        print("  LOI", i, p, m)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
