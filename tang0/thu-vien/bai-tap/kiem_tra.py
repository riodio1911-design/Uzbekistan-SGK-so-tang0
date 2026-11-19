"""Kiểm tra Thư viện bài tập: phủ đủ loai_bai_tap của 7 bản kiểm kê, id hợp lệ, không trùng.
Chạy: python3 -I kiem_tra.py  (đọc ../../../kiem-ke/*.json)
"""
import csv, json, os, re, sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
KK = os.path.normpath(os.path.join(HERE, '..', '..', '..', 'kiem-ke'))
BOOKS = ['matematika5', 'informatika5', 'tabiiy5', 'biologiya5', 'adabiyot5', 'kimyo8', 'fizika8']
AGE = {'0-2', '3-4', '5-7', '8-9', '10-11'}  # cap LOP (grade band), xem tang0/tu-dien-truc.json truc 7
GRADE = {'tu_dong', 'ai', 'giao_vien', 'khong_cham'}
UI = {'modal', 'on_page_scan', 'on_page_rebuilt', 'lesson_block', 'workbook_interactive', 'quiz_set', 'tutor_chat'}

err = []
cat = json.load(open(os.path.join(HERE, 'danh-muc.json'), encoding='utf8'))
ids = [e['id'] for e in cat]
for k, n in Counter(ids).items():
    if n > 1: err.append(f'id trùng: {k}')
names = Counter(e['name']['uz'] for e in cat) + Counter(e['name']['vi'] for e in cat)
for k, n in names.items():
    if n > 1: err.append(f'tên trùng: {k}')
for e in cat:
    if not re.fullmatch(r'ex\.[a-z0-9_]+(\.[a-z0-9_]+)?', e['id']): err.append(f'id sai mẫu: {e["id"]}')
    for f in ['name', 'description', 'data_shape', 'grading', 'ui_variants', 'axes', 'sources', 'grade_bands', 'role']:
        if f not in e: err.append(f'{e["id"]}: thiếu {f}')
    if not e['name'].get('uz'): err.append(f'{e["id"]}: name thiếu uz')
    if set(e['grading']['modes']) - GRADE: err.append(f'{e["id"]}: grading mode lạ')
    if set(e['ui_variants']) - UI: err.append(f'{e["id"]}: ui lạ {set(e["ui_variants"]) - UI}')
    for k in ('observed', 'suggested'):
        if set(e['grade_bands'][k]) - AGE: err.append(f'{e["id"]}: cấp lớp lạ')
    for s in e['sources']:
        if s['book'] not in BOOKS: err.append(f'{e["id"]}: book lạ {s["book"]}')

# D2 (18/11/2026): accept_v2 mac dinh, nrm_v1 chi la bi danh; ex.order mac dinh per_position; giao_vien bat o v1
E = {e['id']: e for e in cat}
for e in cat:
    rids = [r['id'] for r in e['grading'].get('rules', [])]
    dr = e['grading'].get('default_rule')
    if dr is not None and dr not in rids: err.append(f'{e["id"]}: default_rule {dr} khong co trong rules')
    for r in e['grading'].get('rules', []):
        if r.get('alias_of') and r['alias_of'] not in rids: err.append(f'{e["id"]}: {r["id"]}.alias_of {r["alias_of"]} khong co')
        if r.get('default') and r['id'] != dr: err.append(f'{e["id"]}: rule default {r["id"]} khac default_rule {dr}')
if E['ex.short_answer']['grading'].get('default_rule') != 'accept_v2': err.append('D2: ex.short_answer phai mac dinh accept_v2')
nr = next((r for r in E['ex.short_answer']['grading']['rules'] if r['id'] == 'nrm_v1'), None)
if not nr or not nr.get('alias_of'): err.append('D2: nrm_v1 phai la bi danh (alias_of)')
if E['ex.order']['grading'].get('default_rule') != 'per_position': err.append('D2: ex.order phai mac dinh per_position')
if 'giao_vien' not in E['ex.open_response']['grading']['modes']: err.append('D2: ex.open_response phai co che do giao_vien (v1)')
print('D2: mac dinh dap an ngan =', E['ex.short_answer']['grading'].get('default_rule'), '| ex.order =', E['ex.order']['grading'].get('default_rule'),
      '| dang co giao_vien:', sorted(e['id'] for e in cat if 'giao_vien' in e['grading']['modes']))

rows = list(csv.DictReader(open(os.path.join(HERE, 'bang-anh-xa.csv'), encoding='utf8')))
mapped = defaultdict(set)
for r in rows:
    if r['ex_id'] not in ids: err.append(f'csv: ex_id không có trong danh mục: {r["ex_id"]}')
    mapped[(r['book'], r['ma_goc'])].add(r['ex_id'])

total = 0
for b in BOOKS:
    d = json.load(open(os.path.join(KK, b + '.json'), encoding='utf8'))
    for it in d['loai_bai_tap']:
        total += 1
        if (b, it['ma']) not in mapped: err.append(f'thiếu dòng: {b} / {it["ma"]}')

# mỗi ex_id phải có ít nhất 1 dòng csv
used = {r['ex_id'] for r in rows}
for i in ids:
    if i not in used: err.append(f'ex_id không có dòng ánh xạ: {i}')

print(f'Mã loai_bai_tap trong kiểm kê: {total}; đã ánh xạ: {sum(1 for k in mapped if k[1])} cặp (book, ma_goc); dòng csv: {len(rows)}')
print(f'Mục danh mục: {len(cat)} ({sum(e["role"]=="exercise" for e in cat)} dạng bài + {sum(e["role"]=="aid" for e in cat)} trợ giúp)')
cnt = Counter()
for e in cat:
    for s in e['sources']:
        if isinstance(s.get('count'), int): cnt[e['id']] += s['count']
print('Số lượng theo dạng (cộng count trong sources):')
for k, v in cnt.most_common(): print(f'  {k:28s} {v}')
print('LỖI:' if err else 'OK – không lỗi')
for x in err: print('  -', x)
sys.exit(1 if err else 0)
