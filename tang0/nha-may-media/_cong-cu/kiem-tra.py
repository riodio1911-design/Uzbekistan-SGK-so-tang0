#!/usr/bin/env python3
"""Tu kiem tra thiet ke nha may media (M2).
1) danh-muc-loai-media.json: id duy nhat, axes chi dung gia tri co trong tu-dien-truc.json,
   de_xuat_truc_moi KHONG co san trong tu dien.
2) Hai schema hop le (check_schema), $ref sang book.schema.json phan giai duoc.
3) Bien ban mau (_thu/ket-qua-mau.json) hop le; cac phieu "sai co chu y" bi tu choi.
Chay: python3 -I _cong-cu/kiem-tra.py
"""
import copy, json, os, sys
from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TANG0 = os.path.dirname(HERE)
ok = True


def load(p):
    return json.load(open(p, encoding="utf-8"))


def fail(msg):
    global ok
    ok = False
    print("  KHONG DAT:", msg)


# 1. danh muc vs tu dien truc
td = load(os.path.join(TANG0, "tu-dien-truc.json"))
vals = {t: {g["id"] for g in v["gia_tri"]} for t, v in td["truc"].items()}
dm = load(os.path.join(HERE, "danh-muc-loai-media.json"))
ids = [x["id"] for x in dm["items"]]
print(f"[1] danh muc: {len(ids)} loai")
if len(ids) != len(set(ids)):
    fail("id trung")
n_axis = 0
for x in dm["items"]:
    for t, vs in x.get("axes", {}).items():
        for v in vs:
            n_axis += 1
            if v not in vals.get(t, set()):
                fail(f"{x['id']} truc {t}: '{v}' khong co trong tu-dien-truc.json")
    for t, vs in x.get("de_xuat_truc_moi", {}).items():
        for v in vs:
            if v in vals.get(t, set()):
                fail(f"{x['id']} de xuat '{v}' da co trong truc {t}")
    for gb in x.get("grade_bands", []):
        if gb not in vals["7"]:
            fail(f"{x['id']} grade_band la {gb}")
print(f"    {n_axis} gia tri truc da doi chieu")

# 2. schema
book = load(os.path.join(TANG0, "schema", "book.schema.json"))
ph = load(os.path.join(HERE, "phieu-dat-hang.schema.json"))
kq = load(os.path.join(HERE, "ket-qua.schema.json"))
reg = Registry().with_resources([(s["$id"], Resource.from_contents(s)) for s in (book, ph, kq)])
for s in (ph, kq):
    Draft202012Validator.check_schema(s)
vph = Draft202012Validator(ph, registry=reg, format_checker=FormatChecker())
vkq = Draft202012Validator(kq, registry=reg, format_checker=FormatChecker())
print("[2] check_schema: dat")

# 3. mau
mau = load(os.path.join(HERE, "_thu", "ket-qua-mau.json"))
errs = list(vkq.iter_errors(mau))
print(f"[3] ket-qua-mau: {'dat' if not errs else 'KHONG DAT'}")
for e in errs[:5]:
    fail(f"ket-qua-mau {list(e.absolute_path)}: {e.message[:150]}")

base_p = os.path.join(HERE, "_thu", "phieu", "kimyo8", "t4-s0__scene_narration__uz.json")
if os.path.exists(base_p):
    base = load(base_p)
    if list(vph.iter_errors(base)):
        fail("phieu goc khong hop le")
    cases = []
    c = copy.deepcopy(base); c["voice"]["model"] = "eleven_multilingual_v2"; cases.append(("uz khong dung eleven_v3", c))
    c = copy.deepcopy(base); c["status"] = "san_xuat"; cases.append(("san_xuat khi hash tam_tinh/chua co text", c))
    c = copy.deepcopy(base); c["status"] = "xong"; cases.append(("trang thai la", c))
    c = copy.deepcopy(base); c["source_hash"] = "abc"; cases.append(("source_hash sai dang", c))
    c = copy.deepcopy(base); c["constraints"]["max_bytes"] = 30_000_000; cases.append(("vuot 20 MB", c))
    c = copy.deepcopy(base); c["media_type"] = "media.illustration"; cases.append(("anh nhung lang=uz", c))
    c = copy.deepcopy(base); c["source"] = {"kind": "text"}; cases.append(("source rong", c))
    rej = 0
    for name, c in cases:
        if list(vph.iter_errors(c)):
            rej += 1
        else:
            fail(f"phieu sai khong bi bat: {name}")
    print(f"[3] phieu sai co chu y bi tu choi: {rej}/{len(cases)}")
else:
    print("[3] (bo qua phieu sai: chua chay lap-phieu tren _thu)")

print("KET QUA:", "DAT" if ok else "KHONG DAT")
sys.exit(0 if ok else 1)
