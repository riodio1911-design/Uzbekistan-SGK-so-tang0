#!/usr/bin/env python3
"""Sinh lai enum truc trong schema/features.schema.json va schema/book.schema.json tu tu-dien-truc.json.
Chay (tu bat ky dau):  python3 -I sinh-enum.py          -> ghi lai schema neu khac
                       python3 -I sinh-enum.py --kiem   -> chi so sanh, ma thoat 1 neu schema lech tu dien
Chi thay mang "enum" (va "pattern" truc 4) o cac duong dan trong DICH; khong dong vao noi dung khac."""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(HERE, ".."))
D = json.load(open(os.path.join(R, "tu-dien-truc.json"), encoding="utf8"))["truc"]


def ids(axis, nhom=None, co=None):
    return [v["id"] for v in D[axis]["gia_tri"]
            if (nhom is None or v.get("nhom") == nhom) and (co is None or v.get(co))]


A = "properties/axes/properties/"
# (file, duong dan toi node co "enum", danh sach id)
DICH = [
    ("features", A + "1/properties/values/items", ids("1", "ban_in")),
    ("features", A + "2/properties/structure/items", ids("2", "cau_truc")),
    ("features", A + "3/items", ids("3", "noi_dung")),
    ("features", A + "5/properties/values/items", ids("5", "che_do")),
    ("features", A + "5/properties/rules/items", ids("5", "quy_tac")),
    ("features", A + "6/items", ids("6", "tuong_tac")),
    ("features", A + "7/properties/grade_bands/items", ids("7", "cap_lop")),
    ("features", A + "7/properties/audience/items", ids("7", "doi_tuong")),
    ("features", A + "7/properties/reader_langs/items", ids("8", "ngon_ngu")),
    ("features", A + "8/properties/base", ids("8", "ngon_ngu", "ngon_ngu_ban_in")),
    ("features", A + "8/properties/text/items", ids("8", "ngon_ngu")),
    ("features", A + "8/properties/print_editions/items", ids("8", "ngon_ngu", "ngon_ngu_ban_in")),
    ("features", A + "8/properties/audio/additionalProperties", ids("8", "nguon_audio")),
    ("features", A + "8/properties/audio/propertyNames", ids("8", "ngon_ngu")),
    ("features", A + "8/properties/audio_granularity", ids("8", "do_min_audio")),
    ("features", A + "8/properties/translation_display/items", ids("8", "hien_thi_dich")),
    ("features", A + "8/properties/translation_fill", ids("8", "cach_dich")),
    ("features", A + "9/properties/flags/items", ids("9", "rang_buoc")),
    ("features", "properties/capabilities/items", ids("9", "capability")),
    ("book", "$defs/lang", ids("8", "ngon_ngu")),
    ("book", "$defs/profile/properties/lang_base", ids("8", "ngon_ngu", "ngon_ngu_ban_in")),
    ("book", "$defs/profile/properties/grade_band", ids("7", "cap_lop")),
    ("book", "$defs/profile/properties/audience", ids("7", "doi_tuong", "doi_tuong_sach")),
    # them o D2 (v0.9.0)
    ("book", "$defs/media_lang", ids("8", "ngon_ngu") + ids("8", "khong_ngon_ngu")),
    ("book", "$defs/grading/properties/mode", ids("5", "che_do")),
    ("features", "properties/classroom/properties/teacher_grading_modes/items", ids("5", "che_do")),
]
PATTERN4 = ("features", A + "4/items", D["4"]["pattern"])
COMMENT = "Enum truc sinh tu tang0/tu-dien-truc.json bang _cong-cu/sinh-enum.py; sua tu dien roi chay lai, KHONG sua tay."


def node(doc, path):
    n = doc
    for part in path.split("/"):
        n = n[part]
    return n


def main():
    check = "--kiem" in sys.argv
    lech = []
    for f in ("features", "book"):
        p = os.path.join(R, "schema", f"{f}.schema.json")
        raw = open(p, encoding="utf8").read()
        doc = json.loads(raw)
        for ff, path, vals in DICH:
            if ff != f: continue
            n = node(doc, path)
            if n.get("enum") != vals:
                lech.append(f"{f}:{path}: {n.get('enum')} -> {vals}")
                n["enum"] = vals
        if f == PATTERN4[0]:
            n = node(doc, PATTERN4[1])
            if n.get("pattern") != PATTERN4[2]:
                lech.append(f"{f}:{PATTERN4[1]} pattern"); n["pattern"] = PATTERN4[2]
            ax = node(doc, "properties/axes")
            if ax.get("$comment") != COMMENT:
                lech.append(f"{f}: $comment"); ax["$comment"] = COMMENT
        if f == "book":
            pr = node(doc, "$defs/profile/properties")
            c = COMMENT + " (grade_band, audience, lang_base, $defs/lang)"
            if pr["grade_band"].get("$comment") != c:
                lech.append("book: $comment"); pr["grade_band"]["$comment"] = c
        if not check:
            out = json.dumps(doc, ensure_ascii=False, indent=2) + ("\n" if raw.endswith("\n") else "")
            if out != raw:
                open(p, "w", encoding="utf8").write(out)
    # khoa object features phai trung nhom tinh_nang (chi kiem, khong sinh vi co mo ta)
    fs = json.load(open(os.path.join(R, "schema", "features.schema.json"), encoding="utf8"))
    keys = set(fs["properties"]["features"]["properties"])
    tn = set(ids("9", "tinh_nang"))
    if keys != tn:
        lech.append(f"features.properties.features khac nhom tinh_nang truc 9: thua {sorted(keys - tn)}, thieu {sorted(tn - keys)}")
    for x in lech: print(("LECH  " if check else "SUA   ") + x)
    print(f"{'Kiem' if check else 'Sinh'} enum: {len(DICH)} enum + pattern truc 4; {len(lech)} {'cho lech' if check else 'thay doi'}")
    sys.exit(1 if (check and lech) else 0)


if __name__ == "__main__":
    main()
