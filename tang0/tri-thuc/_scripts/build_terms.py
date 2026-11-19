# Dựng thuat-ngu.csv + thuat-ngu.json từ dữ liệu đã trích (../_dump/*.json, tạo bởi dump.js)
# Chạy: cd _dump && python3 -I ../_scripts/build_terms.py
import json, re, csv, collections, unicodedata

D = {k: json.load(open(k + '.json')) for k in
     ['matematika5', 'informatika5', 'tabiiy5', 'biologiya5', 'adabiyot5', 'kimyo8', 'fizika8']}
SUBJ = {'matematika5': 'mathematics', 'informatika5': 'informatics', 'tabiiy5': 'natural_science',
        'biologiya5': 'biology', 'adabiyot5': 'literature', 'kimyo8': 'chemistry', 'fizika8': 'physics'}
GRADE = {'matematika5': 5, 'informatika5': 5, 'tabiiy5': 5, 'biologiya5': 5, 'adabiyot5': 5, 'kimyo8': 8, 'fizika8': 8}
# Thứ tự ưu tiên khi chọn dạng chữ hiển thị
PRIO = ['glossary', 'keyword', 'key_concept', 'bold', 'fig_item', 'fig_label', 'chapter_title', 'lesson_title', 'unit_title']

APOS = re.compile(r"[ʻ‘’`'ʼ]")
def norm(s):
    s = unicodedata.normalize('NFC', s or '').strip()
    s = APOS.sub("'", s)
    s = re.sub(r'[«»“”"„]', '', s)
    s = re.sub(r'\s+', ' ', s).strip(' .,:;!?…–-')
    return s.lower()

def clean(s):
    s = re.sub(r'\*\*', '', s or '')
    return re.sub(r'\s+', ' ', s).strip().strip(' .;:')

RAW = []   # mỗi lần xuất hiện
SKIP = collections.Counter()
def add(book, kind, uz, vi=None, ru=None, page=None, ref=None, en=None, d=None, ru_src=None, code=None):
    uz, vi, ru = clean(uz), clean(vi), clean(ru)
    if kind in ('fig_item', 'fig_label'):
        # bỏ nhãn liệt kê "a) ", "4. " ở đầu; loại tên không phải thuật ngữ (ký hiệu thuần, câu mô tả có dấu ':')
        uz = re.sub(r'^(?:[a-zа-я]\)|\d+[.)])\s*', '', uz); vi = re.sub(r'^(?:[a-zа-я]\)|\d+[.)])\s*', '', vi or ''); ru = re.sub(r'^(?:[a-zа-я]\)|\d+[.)])\s*', '', ru or '')
        if ':' in uz or not re.search(r'[^\W\d_]{3,}', uz):
            SKIP[(book, kind + '_khong_phai_thuat_ngu')] += 1; return
    if not uz or len(norm(uz)) < 2 or re.fullmatch(r'[\d\W_]+', norm(uz)):
        SKIP[(book, kind)] += 1; return
    RAW.append(dict(book=book, kind=kind, uz=uz, vi=vi, ru=ru, page=page, ref=ref, en=en, d=d, ru_src=ru_src, code=code))

# ---------- tabiiy5 ----------
t = D['tabiiy5']; B = t['window.BOOK']; RD = t['window.RUDICT']
def rud(s):
    for c in (s, s[:1].upper() + s[1:], s.lower()):
        if c in RD: return RD[c]
    return None
termpage = {}
for p, hs in t['HOT'].items():
    for h in hs:
        if h['k'] == 'term': termpage.setdefault(h['ref'], int(p))
for c in B['chapters']:
    add('tabiiy5', 'chapter_title', c['title']['uz'], c['title'].get('vi'), rud(c['title']['uz']), c['page'], f"bob{c['no']}", ru_src='RUDICT', code='BOOK.chapters[].title')
    for g in c.get('glossary', []):
        r = rud(g[0])
        add('tabiiy5', 'glossary', g[0], g[1], r, termpage.get(g[0], c['pages'][1]), f"bob{c['no']}",
            d={'uz': g[2], 'vi': g[3]}, ru_src='RUDICT' if r else None, code='BOOK.chapters[].glossary')
    for l in c['lessons']:
        add('tabiiy5', 'lesson_title', l['title']['uz'], l['title'].get('vi'), rud(l['title']['uz']), l['page'], l['id'], ru_src='RUDICT', code='BOOK.lessons[].title')
        def walk(o):
            if isinstance(o, dict):
                if isinstance(o.get('uz'), str) and '**' in o['uz']:
                    bu = re.findall(r'\*\*(.+?)\*\*', o['uz']); bv = re.findall(r'\*\*(.+?)\*\*', o.get('vi') or '')
                    if len(bu) == len(bv):
                        for a, b in zip(bu, bv):
                            r = rud(a)
                            add('tabiiy5', 'bold', a, b, r, l['page'], l['id'], ru_src='RUDICT' if r else None, code='**…** trong BOOK.blocks')
                    else:
                        SKIP[('tabiiy5', 'bold_lech')] += 1
                for v in o.values(): walk(v)
            elif isinstance(o, list):
                for v in o: walk(v)
        walk(l['blocks'])

# ---------- biologiya5 ----------
b = D['biologiya5']; B = b['window.BOOK']; PG = b['window.PG']
gwru = {x['uz']: x['ru'] for x in PG['T'] if x.get('k') == 'gw'}
figpage = {}
for p, arr in PG['figs'].items():
    for f in arr: figpage.setdefault(f[0], int(p))
for g in B['glossary']:
    add('biologiya5', 'glossary', g[0], g[1], gwru.get(g[0]), None, 'ilmiy_atamalar', d={'uz': g[2], 'vi': g[3]}, code='BOOK.glossary + PG.T(k=gw)')
for c in B['chapters']:
    add('biologiya5', 'chapter_title', c['title']['uz'], c['title'].get('vi'), c['title'].get('ru'), c['page'], f"bob{c['no']}", code='BOOK.chapters[].title')
for l in B['lessons']:
    add('biologiya5', 'lesson_title', l['title']['uz'], l['title'].get('vi'), l['title'].get('ru'), l.get('page'), l['id'], code='BOOK.lessons[].title')
    for blk in l['blocks']:
        if blk['type'] == 'keywords':
            for it in blk['items']:
                add('biologiya5', 'keyword', it['uz'], it.get('vi'), it.get('ru'), l.get('page'), l['id'], code='block keywords')
        if blk['type'] == 'figure':
            pg = figpage.get(blk.get('n'), l.get('page'))
            for it in (blk.get('xp') or {}).get('items', []):
                nm = it.get('name') or {}
                add('biologiya5', 'fig_item', nm.get('uz'), nm.get('vi'), nm.get('ru'), pg, f"fig{blk.get('n')}",
                    d={k: v for k, v in (it.get('desc') or {}).items()} or None, code='figure.xp.items[].name')
            for lb in blk.get('labels') or []:
                tt = lb.get('t') or {}
                add('biologiya5', 'fig_label', tt.get('uz'), tt.get('vi'), tt.get('ru'), pg, f"fig{blk.get('n')}", code='figure.labels[].t')

# ---------- adabiyot5 ----------
A = D['adabiyot5']['DATA']
def find_pg(u, w):
    k = norm(w)[:max(4, len(norm(w)) - 2)]
    for blk in u['blocks']:
        if k and k in norm(json.dumps(blk, ensure_ascii=False)) and blk.get('pg'):
            return blk['pg']
    return u['meta']['pages'][0]
for u in A['units']:
    m = u['meta']
    add('adabiyot5', 'unit_title', m['title']['uz'], m['title'].get('vi'), m['title'].get('ru'), m['pages'][0], u['id'], code='DATA.units[].meta.title')
    for g in u.get('gloss', []):
        add('adabiyot5', 'glossary', g['w'], (g.get('tr') or {}).get('vi'), (g.get('tr') or {}).get('ru'), find_pg(u, g['w']), u['id'],
            d=g.get('d'), code='DATA.units[].gloss')

# ---------- informatika5 ----------
inf = D['informatika5']; PG = inf['window.PG']
TAGS = r'(?:qsq|jrg|xlq|atm|mb|diz|das|dast|tar|e-jad|mad|xavf|int)\.'
def split_head(h):
    h = h.strip(); en = None
    if h.endswith(')'):
        depth = 0
        for i in range(len(h) - 1, -1, -1):
            if h[i] == ')': depth += 1
            elif h[i] == '(':
                depth -= 1
                if depth == 0:
                    en = h[i + 1:-1].strip(); h = h[:i].strip(); break
    tags = []
    while True:
        m = re.search(r'\s(' + TAGS + r')$', h)
        if not m: break
        tags.insert(0, m.group(1).rstrip('.')); h = h[:m.start()].strip()
    return h, en, tags
for p in range(130, 176):
    for x in PG[str(p)]['tr']:
        tt = x['t']
        if ' — ' not in tt['uz']: continue
        hu, du = tt['uz'].split(' — ', 1)
        hv, dv = (tt['vi'].split(' — ', 1) + [''])[:2] if ' — ' in tt.get('vi', '') else (tt.get('vi'), '')
        hr, dr = (tt['ru'].split(' — ', 1) + [''])[:2] if ' — ' in tt.get('ru', '') else (tt.get('ru'), '')
        term, en, tags = split_head(hu)
        r = add('informatika5', 'glossary', term, hv, hr, p, 'glossariy', en=en, d={'uz': du, 'vi': dv, 'ru': dr}, code='PG.tr (trang Glossariy 130–175)')
        if RAW and RAW[-1]['uz'] == clean(term) and tags: RAW[-1]['tags'] = tags
# "Kalit so‘zlar." trong bài
def kw_split(s):
    s = re.sub(r'^\s*(Kalit so\S*z(?:lar)?|Từ khóa|Từ khoá|Ключевые слова|Ключевое слово)\.\s*', '', s)
    out = []
    for sent in re.split(r'(?<=[.!?])\s+', s):
        m = re.match(r'^([^:]{1,60}):\s*(.*)$', sent)
        if m: out.append([m.group(1).strip(), m.group(2).strip()])
        elif out: out[-1][1] += ' ' + sent
    return out
for p in range(1, 129):
    for x in PG.get(str(p), {}).get('tr', []):
        tt = x['t']
        if not re.match(r'^\s*Kalit so\S*z', tt['uz']): continue
        U, V, Rr = kw_split(tt['uz']), kw_split(tt.get('vi', '')), kw_split(tt.get('ru', ''))
        if len(U) == len(V):
            for i, (a, da) in enumerate(U):
                rr = Rr[i] if len(Rr) == len(U) else [None, None]
                add('informatika5', 'keyword', a, V[i][0], rr[0], p, None, d={'uz': da, 'vi': V[i][1], 'ru': rr[1]}, code="PG.tr 'Kalit so‘zlar.'")
        else:
            SKIP[('informatika5', 'kw_lech')] += 1

# ---------- kimyo8 / fizika8 / matematika5 / informatika5: CH, TP, fig, Tayanch ----------
def split_list(s):
    parts, depth, cur = [], 0, ''
    for ch in s:
        if ch in '([': depth += 1
        if ch in ')]': depth -= 1
        if ch in ',;' and depth == 0: parts.append(cur); cur = ''
        else: cur += ch
    parts.append(cur)
    return [p.strip().strip('.') for p in parts if p.strip().strip('.')]
for bk in ['matematika5', 'informatika5', 'kimyo8', 'fizika8']:
    d = D[bk]
    for row in d['CH']:
        if bk == 'informatika5' and row[1] == 'Glossariy': continue
        add(bk, 'chapter_title', row[1], row[2], row[3], row[0], None, code='CH')
    for tid, tp in d['window.TP'].items():
        if tp.get('kind'): continue   # bỏ book/intro/summary: không phải tên bài
        ti = tp.get('title') or {}
        uz = re.sub(r'^\d+\s*-\s*§\.?\s*', '', ti.get('uz', ''))
        vi = re.sub(r'^Bài \d+\.\s*', '', ti.get('vi', '') or '')
        ru = re.sub(r'^§\s*\d+\.\s*', '', ti.get('ru', '') or '')
        add(bk, 'lesson_title', uz, vi, ru, tp.get('page'), tid, code='TP[].title')
    PG = d['window.PG']
    for p, v in PG.items():
        for f in v.get('fig', []) or []:
            for it in f.get('items', []):
                nm = it.get('name') or {}
                add(bk, 'fig_item', nm.get('uz'), nm.get('vi'), nm.get('ru'), int(p), f"fig{f.get('no') or ''}".strip(),
                    d=it.get('desc'), code='PG.fig[].items[].name')
        if bk == 'kimyo8':
            for x in v.get('tr', []):
                tt = x['t']
                if tt['uz'].startswith('Tayanch tushunchalar'):
                    U = split_list(tt['uz'].split(':', 1)[1]); V = split_list(tt['vi'].split(':', 1)[1]) if ':' in tt['vi'] else []
                    Rr = split_list(tt['ru'].split(':', 1)[1]) if ':' in tt.get('ru', '') else []
                    if len(U) == len(V):
                        for i, a in enumerate(U):
                            add(bk, 'key_concept', a, V[i], Rr[i] if len(Rr) == len(U) else None, int(p), None, code="PG.tr 'Tayanch tushunchalar:'")
                    else:
                        SKIP[(bk, 'tayanch_lech')] += 1

# ---------- gộp ----------
VI_STOP = {'cac', 'cua', 'va', 'su', 'cai', 'con', 'chiec', 'mot', 'hai', 'nhung', 'bo', 'phan', 'the', 'trong', 'co', 'la', 'cho', 'voi', 'tren', 'duoi'}
def vtoks(s):
    s = unicodedata.normalize('NFKD', (s or '').lower().replace('đ', 'd')).encode('ascii', 'ignore').decode()
    return set(re.findall(r'[a-z0-9]+', s)) - VI_STOP
def rtoks(s):
    return {w[:5] for w in re.findall(r'[а-яё]{3,}', (s or '').lower())}
groups = collections.OrderedDict()
for r in RAW:
    k = norm(r['uz']); clusters = groups.setdefault(k, [])
    placed = False
    for cl in clusters:
        for o in cl:
            if r.get('en') and o.get('en') and r['en'].lower() != o['en'].lower(): continue
            if (vtoks(r['vi']) & vtoks(o['vi'])) or (rtoks(r['ru']) & rtoks(o['ru'])) or norm(r['vi']) == norm(o['vi']):
                cl.append(r); placed = True; break
        if placed: break
    if not placed: clusters.append([r])
# trải phẳng: mỗi cụm nghĩa là một mục; cùng chữ uz khác nghĩa -> tách mục, ghi chú
flat = collections.OrderedDict()
for k, clusters in groups.items():
    for i, cl in enumerate(clusters):
        key = k if i == 0 else f'{k}#{i+1}'
        for r in cl: r['homonym_of'] = k if len(clusters) > 1 else None; r['sense'] = i + 1
        flat[key] = cl
groups = flat
# gộp dạng in đậm biến cách vào thuật ngữ cùng cuốn có cùng bản dịch vi
vi_index = {}
for k, rs in groups.items():
    for r in rs:
        if r['kind'] in ('glossary', 'keyword', 'key_concept') and r['vi']:
            vi_index.setdefault((r['book'], norm(r['vi'])), k)
for k in list(groups):
    rs = groups[k]
    if all(r['kind'] == 'bold' for r in rs):
        tgt = vi_index.get((rs[0]['book'], norm(rs[0]['vi'])))
        if tgt and tgt != k and k.startswith(tgt[:max(3, len(tgt) - 3)]):
            for r in rs: r['merged_form'] = r['uz']
            groups[tgt].extend(rs); del groups[k]

APOS_SL = str.maketrans({'ʻ': '', '‘': '', '’': '', "'": '', '`': '', 'ʼ': ''})
def slug(s):
    s = norm(s).translate(APOS_SL)
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-z0-9]+', '_', s).strip('_')
    return s[:48] or 'x'
def toks(s): return set(re.findall(r'\w+', (s or '').lower()))

rows, full, used = [], [], set()
for k, rs in groups.items():
    rs.sort(key=lambda r: PRIO.index(r['kind']))
    main = rs[0]
    sid = 'term.' + slug(main['uz']) + (f"__{SUBJ[main['book']]}" if main.get('sense', 1) > 1 else ''); base = sid; i = 2
    while sid in used: sid = f'{base}_{i}'; i += 1
    used.add(sid)
    vi = next((r['vi'] for r in rs if r['vi']), '')
    ru = next((r['ru'] for r in rs if r['ru']), '')
    ru_src = next((r['ru_src'] for r in rs if r['ru'] and r['ru'] == ru), None)
    vi_alt = []
    for r in rs:
        if r['vi'] and norm(r['vi']) != norm(vi) and norm(r['vi']) not in [norm(x) for x in vi_alt]: vi_alt.append(r['vi'])
    books = sorted({r['book'] for r in rs}, key=list(SUBJ).index)
    subj = sorted({SUBJ[r['book']] for r in rs})
    grades = sorted({GRADE[r['book']] for r in rs})
    kinds = []
    for r in rs:
        if r['kind'] not in kinds: kinds.append(r['kind'])
    # nguồn: cuon:trN (gộp theo cuốn)
    src_by = collections.OrderedDict()
    for r in rs:
        tag = f"tr{r['page']}" if r['page'] else (r['ref'] or '?')
        if r['page'] and r['ref'] and r['book'] in ('tabiiy5', 'biologiya5', 'adabiyot5'): tag += f"/{r['ref']}"
        src_by.setdefault(r['book'], [])
        if tag not in src_by[r['book']]: src_by[r['book']].append(tag)
    nguon = '; '.join(f"{bk}:{','.join(v)}" for bk, v in src_by.items())
    en = next((r['en'] for r in rs if r.get('en')), None)
    tags = next((r.get('tags') for r in rs if r.get('tags')), None)
    defs = next((r['d'] for r in rs if r.get('d') and r['kind'] in ('glossary', 'keyword')), None)
    notes = ['loai=' + ','.join(kinds)]
    if en: notes.append('en=' + en)
    if tags: notes.append('linh_vuc=' + ','.join(tags))
    if defs: notes.append('co_dinh_nghia')
    if ru_src == 'RUDICT': notes.append('ru_tu_RUDICT')
    forms = sorted({r['uz'] for r in rs if norm(r['uz']) != norm(main['uz'])})
    if forms: notes.append('dang_khac_uz=' + ' | '.join(forms[:4]))
    if vi_alt: notes.append('vi_khac=' + ' | '.join(vi_alt[:4]))
    if main.get('homonym_of'):
        notes.append(f"dong_am_tach_nghia={main['sense']} (cung chu uz, ban dich khac nghia)")
    if len(subj) > 1:
        notes.append('KIEM_TRA_nghia_lien_mon')
    if len(rs) > 1: notes.append(f'so_lan={len(rs)}')
    rows.append([sid, main['uz'], ru, vi, ';'.join(subj), ';'.join(map(str, grades)), nguon, '; '.join(notes)])
    full.append({
        'id': sid, 'term': {k2: v for k2, v in (('uz', main['uz']), ('ru', ru), ('vi', vi)) if v},
        'en': en, 'definition': defs, 'subjects': subj, 'grades': grades, 'kinds': kinds,
        'variants': {'uz': forms, 'vi': vi_alt}, 'ru_source': ru_src or ('data' if ru else None),
        'axes': {'3': ['thuat_ngu'], '8': ['uz', 'vi', 'ru'] if ru else ['uz', 'vi']},
        'sources': [{'book': r['book'], 'page': r['page'], 'ref': r['ref'], 'kind': r['kind'], 'code': r['code']} for r in rs],
    })

with open('../thuat-ngu.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f); w.writerow(['id', 'uz', 'ru', 'vi', 'mon', 'lop_xuat_hien', 'nguon', 'ghi_chu']); w.writerows(rows)
json.dump(full, open('../thuat-ngu.json', 'w'), ensure_ascii=False, indent=1)

# thống kê cho README
st = {'raw': len(RAW), 'rows': len(rows), 'skip': {f'{a}|{b}': n for (a, b), n in SKIP.items()}}
per_book = collections.defaultdict(lambda: collections.Counter())
for r in RAW: per_book[r['book']][r['kind']] += 1
st['raw_per_book_kind'] = {k: dict(v) for k, v in per_book.items()}
rows_book = collections.Counter(); cov = collections.defaultdict(lambda: collections.Counter())
for e in full:
    bks = {s['book'] for s in e['sources']}
    for bk in bks:
        rows_book[bk] += 1
        cov[bk]['uz'] += 1; cov[bk]['vi'] += bool(e['term'].get('vi')); cov[bk]['ru'] += bool(e['term'].get('ru'))
        if e['ru_source'] == 'RUDICT': cov[bk]['ru_rudict'] += 1
    if len(bks) > 1: rows_book['_nhieu_cuon'] += 1
st['rows_per_book'] = dict(rows_book); st['coverage'] = {k: dict(v) for k, v in cov.items()}
kc = collections.Counter(e['kinds'][0] for e in full); st['rows_by_main_kind'] = dict(kc)
st['all3'] = sum(1 for e in full if all(e['term'].get(x) for x in ('uz', 'vi', 'ru')))
st['vi'] = sum(1 for e in full if e['term'].get('vi')); st['ru'] = sum(1 for e in full if e['term'].get('ru'))
st['need_review_lien_mon'] = sum(1 for r in rows if 'KIEM_TRA' in r[7]); st['homonym_rows'] = sum(1 for r in rows if 'dong_am' in r[7])
st['multi_book_examples'] = [[e['id'], e['term'].get('uz'), sorted({s['book'] for s in e['sources']})] for e in full if len({s['book'] for s in e['sources']}) > 1][:40]
json.dump(st, open('stats_terms.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in st.items() if k != 'multi_book_examples'}, ensure_ascii=False, indent=1))
