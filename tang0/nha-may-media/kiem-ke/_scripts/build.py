# python3 -I build.py  — M1 Kiem ke media: doc dump (tu dump.js) + danh sach file artifact -> nhu-cau.json, media-hien-co.csv, tong-hop.csv
import json, re, os, csv, collections, datetime

KK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.dirname(os.path.dirname(os.path.dirname(KK)))  # $R
DU = os.path.join(KK, '_du-lieu')
DP = os.path.join(DU, 'dump')
LANGS = ['uz', 'vi', 'ru']
BOOKS = ['matematika5', 'informatika5', 'tabiiy5', 'biologiya5', 'adabiyot5', 'kimyo8', 'fizika8']
HTML = {b: (f'fix2/{b}/index.html' if b in ('tabiiy5', 'adabiyot5') else f'fix/{b}/index.html') for b in BOOKS}

ART = {}
for l in open(os.path.join(DU, 'files-tong.tsv'), encoding='utf8').read().splitlines()[1:]:
    b, ver, n, note = l.split('\t')
    ART[b] = {'version': ver, 'so_file': int(n), 'ghi_chu': note}
for b in BOOKS:
    ART[b]['url'] = json.load(open(os.path.join(R, 'kiem-ke', b + '.json'), encoding='utf8'))['url']

def strip(s):
    if not isinstance(s, str): return ''
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'\{([^{}/]+)/([^{}/]+)\}', r'\1/\2', s)
    s = re.sub(r'[*_`#]', '', s)
    return re.sub(r'\s+', ' ', s).strip()

def txt(parts, lg):
    out = []
    for p in parts:
        if isinstance(p, dict):
            v = p.get(lg)
            if lg == 'ru' and not v: v = p.get('uz')  # theo ma: x.ru||x.uz
            out.append(strip(v))
        elif isinstance(p, str):
            out.append(strip(p))
    return ' '.join(x for x in out if x)

def L(text):
    return {'ky_tu': len(text), 'dau_80': text[:80]}

def point(pid, loai, muc_dich, gan_voi, text_path, per_lang, ghi_chu=None):
    d = {'id': pid, 'loai': loai, 'muc_dich': muc_dich, 'gan_voi': gan_voi, 'text_path': text_path, 'ngon_ngu': per_lang}
    if muc_dich in ('diem_hinh', 'diem_hinh_loi_dan'): d['mo_rong'] = True
    if ghi_chu: d['ghi_chu'] = ghi_chu
    return d

def lang_entry(text, status, src=None, note=None):
    e = {'trang_thai': status}
    e.update(L(text))
    if src: e['nguon_hien_co'] = src
    if note: e['ghi_chu'] = note
    return e

result = {}
media_rows = []
orphans = {}

# ---------------- ho A: matematika5, informatika5, kimyo8, fizika8 ----------------
def family_a(b):
    d = json.load(open(os.path.join(DP, b + '.json'), encoding='utf8'))
    TP, AU, PG = d['TP'], d['AUDIO'].get('vi', {}), d['PG']
    DM = d.get('DM') if isinstance(d.get('DM'), dict) else {}
    pts, used = [], set()
    nvid = 0
    for tp, t in TP.items():
        vids = t.get('video') or []
        if vids:
            nvid += 1
            pts.append(point(f'video.{tp}', 'video_ma', 'video_canh', {'trang': t.get('page'), 'chu_de': tp, 'kind': t.get('kind'), 'so_canh': len(vids)},
                             f'TP.{tp}.video', {'*': {'trang_thai': 'co_san', 'ky_tu': 0, 'dau_80': strip((t.get('title') or {}).get('uz', ''))[:80],
                                                       'nguon_hien_co': {'kieu': 'dung_bang_ma', 'trinh_phat': 'openVideo (trinh chieu canh SVG/crop anh trang)'}}},
                             'Video dung bang ma da chay duoc; neu can mp4 thi quay bang Playwright.'))
        for i, sc in enumerate(vids):
            n = sc.get('n') or {}
            cid = f'{tp}-s{i}'
            per = {}
            for lg in LANGS:
                tx = strip(n.get(lg, ''))
                if lg == 'vi' and cid in AU:
                    f, st, du = AU[cid]; used.add(cid)
                    per[lg] = lang_entry(tx, 'co_san', {'file': f'audio_vi/vi_{f}.mp3', 'start': st, 'dur': du})
                else:
                    per[lg] = lang_entry(tx, 'chi_tts_trinh_duyet', note='say(): __AU.has() false -> speechSynthesis neu trinh duyet co giong')
            pts.append(point(cid, 'thuyet_minh', 'canh_video', {'trang': t.get('page'), 'chu_de': tp, 'canh': i}, f'TP.{tp}.video[{i}].n', per))
    for dk, D in DM.items():
        for i, stp in enumerate(D.get('steps') or []):
            if not stp.get('t'): continue
            cid = f'{dk}-s{i}'
            per = {}
            for lg in LANGS:
                tx = strip(stp['t'].get(lg, ''))
                if lg == 'vi' and cid in AU:
                    f, st, du = AU[cid]; used.add(cid)
                    per[lg] = lang_entry(tx, 'co_san', {'file': f'audio_vi/vi_{f}.mp3', 'start': st, 'dur': du})
                else:
                    per[lg] = lang_entry(tx, 'chi_tts_trinh_duyet', note='openDemo: speechSynthesis')
            pts.append(point(cid, 'thuyet_minh', 'buoc_demo', {'trang': D.get('page'), 'demo': dk, 'buoc': i}, f'DM.{dk}.steps[{i}].t', per))
    nfig = nfi = 0
    for pg, P in PG.items():
        for j, fg in enumerate(P.get('fig') or []):
            nfig += 1
            base = f'p{pg}.fig{j}'
            per = {lg: lang_entry(txt([fg.get('cap'), fg.get('intro')], lg), 'thieu', note='openFig chi hien chu, khong co nut doc') for lg in LANGS}
            pts.append(point(base + '.intro', 'thuyet_minh', 'diem_hinh_loi_dan', {'trang': int(pg), 'hinh': fg.get('no') or j}, f'PG.{pg}.fig[{j}].intro', per,
                             'Diem mo rong: hinh kham pha chua co loi doc'))
            for k, it in enumerate(fg.get('items') or []):
                nfi += 1
                per = {lg: lang_entry(txt([it.get('name'), it.get('desc')], lg), 'thieu') for lg in LANGS}
                pts.append(point(f'{base}.i{k}', 'thuyet_minh', 'diem_hinh', {'trang': int(pg), 'hinh': fg.get('no') or j, 'diem': k + 1}, f'PG.{pg}.fig[{j}].items[{k}]', per))
    orph = [k for k in AU if k not in used]
    for k in orph:
        f, st, du = AU[k]
        pts.append(point(k, 'thuyet_minh', 'khong_ro', {}, None, {'vi': {'trang_thai': 'thua', 'ky_tu': 0, 'dau_80': '', 'nguon_hien_co': {'file': f'audio_vi/vi_{f}.mp3', 'start': st, 'dur': du}}},
                         'Khoa AUDIO.vi khong khop canh/buoc nao trong TP/DM'))
    stats = {'chu_de_co_video': nvid, 'canh_video': sum(len(t.get('video') or []) for t in TP.values()), 'audio_vi_khoa': len(AU), 'audio_vi_khoa_thua': len(orph),
             'hinh_kham_pha': nfig, 'diem_hinh': nfi, 'demo': len(DM), 'buoc_demo_co_loi': sum(1 for D in DM.values() for s in D.get('steps') or [] if s.get('t'))}
    return pts, stats

# ---------------- ho B: tabiiy5, biologiya5 ----------------
NARR_TAB = {'learn', 'think', 'robot', 'explore', 'problem', 'career', 'objectives'}
def block_parts(b):
    t = b['type']
    if t == 'learn':
        arr = [b.get('title')] + list(b.get('paras') or [])
        if b.get('steps'):
            arr += [{lg: f'{k+1}. ' + (s.get(lg) or s.get('uz') or '') for lg in LANGS} for k, s in enumerate(b['steps'])]
        if b.get('note'): arr.append(b['note'])
        return arr
    if t in ('think', 'robot'): return [b.get('text')]
    if t in ('explore', 'problem', 'career'):
        x = b.get('text') or b.get('paras') or []
        return [b.get('title')] + (x if isinstance(x, list) else [x])
    if t == 'objectives':
        return [{'uz': 'Mavzuni o‘rganish davomida:', 'vi': 'Trong bài học này, em sẽ:', 'ru': 'Mavzuni o‘rganish davomida:'}] + list(b.get('items') or [])
    return []

def family_b(b):
    d = json.load(open(os.path.join(DP, b + '.json'), encoding='utf8'))
    SP = d['SPRITE']
    if b == 'tabiiy5':
        x = list(json.load(open(os.path.join(DP, 'tabiiy5-ru.json'), encoding='utf8')).values())[0]
        lessons, chapters, VIDS = x['L'], x['C'], x['V']
        narr = NARR_TAB
        missing_files = set()
    else:
        B = d['BOOK']; lessons = B['lessons']; chapters = B['chapters']; VIDS = d['VIDEOS']
        narr = {'learn'}
        missing_files = {v[0] for k, v in SP.items() if k.startswith('fx')}
    present = set(open(os.path.join(DU, f'files-{b}-audio.tsv'), encoding='utf8').read().split())
    pref = 'audio2/' if b == 'tabiiy5' else 'audio/'
    used = set()
    pts = []
    def per_from(nid, parts_or_text, note_missing):
        per = {}
        for lg in LANGS:
            tx = parts_or_text if isinstance(parts_or_text, str) else txt(parts_or_text, lg)
            if isinstance(parts_or_text, dict): tx = strip(parts_or_text.get(lg) or (parts_or_text.get('uz') if lg == 'ru' else ''))
            k = f'{nid}-{lg}'
            if k in SP:
                used.add(k)
                f, st, du = SP[k]
                if (pref + f) in present:
                    per[lg] = lang_entry(tx, 'co_san', {'file': pref + f, 'start': st, 'dur': du})
                else:
                    per[lg] = lang_entry(tx, 'thieu', {'file': pref + f, 'start': st, 'dur': du}, 'Khoa SPRITE con nhung file da go khoi artifact')
            else:
                per[lg] = lang_entry(tx, 'thieu', note=note_missing)
        return per
    for ch in chapters:
        nid = 'intro' if ch['no'] == 1 else f"ch{ch['no']}-intro"
        pts.append(point(nid, 'thuyet_minh', 'gioi_thieu_chuong', {'chuong': ch['no'], 'trang': ch.get('page')}, f"BOOK.chapters[{ch['no']}].intro",
                         per_from(nid, ch.get('intro') or [], 'HAS_MP3=true nen khong dung TTS trinh duyet; khong co clip -> im')))
    for Lz in lessons:
        for i, bl in enumerate(Lz['blocks']):
            if bl['type'] in narr:
                nid = f"{Lz['id']}-b{i}"
                pts.append(point(nid, 'thuyet_minh', 'khoi_bai', {'bai': Lz['id'], 'trang': Lz.get('page'), 'khoi': i, 'kieu_khoi': bl['type']},
                                 f"BOOK.lessons[{Lz['id']}].blocks[{i}]", per_from(nid, block_parts(bl), 'Khong co clip: khoi khong hien nut Nghe')))
            if b == 'biologiya5' and bl['type'] == 'figure' and bl.get('xp'):
                for k, it in enumerate(bl['xp'].get('items') or []):
                    nid = f"fx{bl['n']}-{k}"
                    pts.append(point(nid, 'thuyet_minh', 'diem_hinh', {'bai': Lz['id'], 'hinh': bl['n'], 'diem': k + 1}, f"BOOK.lessons[{Lz['id']}].blocks[{i}].xp.items[{k}]",
                                     per_from(nid, [it.get('name'), it.get('desc')], 'Chua co clip'),
                                     'Ma hien tai khong phat fx (chua noi vao trinh kham pha hinh)'))
    for vid, V in VIDS.items():
        sc = V.get('scenes') or []
        pts.append(point(f'video.{vid}', 'video_ma', 'video_canh', {'bai': V.get('lesson'), 'video': vid, 'so_canh': len(sc)}, f'VIDEOS.{vid}',
                         {'*': {'trang_thai': 'co_san', 'ky_tu': 0, 'dau_80': strip((V.get('title') or {}).get('uz', ''))[:80],
                                'nguon_hien_co': {'kieu': 'dung_bang_ma', 'trinh_phat': 'Player (SVG 960x540 ve bang draw())'}}},
                         'Video dung bang ma; neu can mp4 thi quay bang Playwright.'))
        for i, s in enumerate(sc):
            nid = f'{vid}-s{i}'
            pts.append(point(nid, 'thuyet_minh', 'canh_video', {'bai': V.get('lesson'), 'video': vid, 'canh': i}, f'VIDEOS.{vid}.scenes[{i}].n',
                             per_from(nid, s.get('n') or {}, 'Khong co clip')))
    gx = list(json.load(open(os.path.join(DP, b + '-g.json'), encoding='utf8')).values())[0]
    for gi, g in enumerate(gx.get('G') or []):
        tx = {'uz': strip(g[0]), 'vi': strip(g[1]), 'ru': strip(g[0])}
        per = {lg: lang_entry(tx[lg], 'chi_tts_trinh_duyet', note=('ky_tu ru uoc luong bang uz (glossary khong co ru rieng)' if lg == 'ru' else 'nut loa trong tooltip thuat ngu: speechSynthesis')) for lg in LANGS}
        pts.append(point(f'term.{gi}', 'thuyet_minh', 'thuat_ngu', {'chuong': g[4] if len(g) > 4 else None}, f'BOOK.glossary[{gi}][0]', per,
                         'Tu don: nen tai dung giua cac cuon theo thuat-ngu.csv'))
    for pp in gx.get('P') or []:
        per = {lg: lang_entry(txt([pp['n'], pp['f']], lg), 'chi_tts_trinh_duyet', note='mo hinh hoa (PARTS): speechSynthesis') for lg in LANGS}
        pts.append(point(f"part.{pp['k']}", 'thuyet_minh', 'bo_phan_mo_hinh', {'mo_hinh': 'hoa'}, f"PARTS[{pp['k']}]", per,
                         None if b == 'tabiiy5' else 'PARTS chep tu tabiiy5; can xac nhan widget hoa co hien trong biologiya5'))
    orph = [k for k in SP if k not in used]
    for k in orph:
        f, st, du = SP[k]; lg = k.rsplit('-', 1)[1]
        pts.append(point(k.rsplit('-', 1)[0] + '#thua', 'thuyet_minh', 'khong_ro', {}, None,
                         {lg: {'trang_thai': 'thua', 'ky_tu': 0, 'dau_80': '', 'nguon_hien_co': {'file': pref + f, 'start': st, 'dur': du}}}))
    stats = {'khoa_sprite': len(SP), 'khoa_sprite_thua': len(orph), 'video': len(VIDS), 'canh_video': sum(len(V.get('scenes') or []) for V in VIDS.values()),
             'file_sprite_khong_con': sorted(missing_files)}
    return pts, stats

# ---------------- ho C: adabiyot5 ----------------
def family_c(b):
    d = json.load(open(os.path.join(DP, b + '.json'), encoding='utf8'))
    U, SPR = d['DATA']['units'], d['SPR']
    present = set(open(os.path.join(DU, f'files-{b}-audio.tsv'), encoding='utf8').read().split())
    pts, used, nscene = [], set(), 0
    def walk(o, ctx, path):
        if isinstance(o, dict):
            if isinstance(o.get('uz'), str) and 'f' in o and o.get('a') is not None:
                f, a = o['f'], o['a']
                nid = f'{f}#{a}'
                per = {}
                for lg in LANGS:
                    tx = strip(o.get(lg, ''))
                    arr = SPR.get(lg, {}).get(f)
                    sp = arr[a] if arr and a < len(arr) else None
                    if sp: used.add((lg, f, a))
                    if o.get('na'):
                        per[lg] = lang_entry(tx, 'thieu' if lg == 'uz' else 'chi_tts_trinh_duyet', note='na=1: ma chu y khong phat clip; dong dich vi/ru bam vao thi say() bang trinh duyet')
                    elif sp and sp[2] > 0:
                        fn = f'audio/{lg}/{f}_{sp[0]}.mp3'
                        per[lg] = lang_entry(tx, 'co_san' if fn in present else 'thieu', {'file': fn, 'start': sp[1], 'dur': sp[2]})
                    else:
                        per[lg] = lang_entry(tx, 'thieu' if lg == 'uz' else 'chi_tts_trinh_duyet')
                kind = 'cau_hoi' if '.qs[' in path else ('dong_tho' if '.stanzas[' in path else ('tieu_de' if path.endswith('.title') else 'cau_van'))
                pts.append(point(nid, 'doc_theo_cau', kind, dict(ctx), 'DATA.units' + path, per))
            for k, v in o.items():
                if k in ('uz', 'vi', 'ru'): continue
                walk(v, ctx, f'{path}.{k}')
        elif isinstance(o, list):
            for i, v in enumerate(o): walk(v, ctx, f'{path}[{i}]')
    for ui, u in enumerate(U):
        for bi, bl in enumerate(u['blocks']):
            ctx = {'don_vi': u['id'], 'khoi': bl.get('bid') or bl.get('id') or f'{u["id"]}.{bi}', 'kieu_khoi': bl.get('t'), 'trang': bl.get('pg')}
            walk(bl, ctx, f'[{ui}].blocks[{bi}]')
            if bl.get('scenes'):
                nscene += 1
                pts.append(point(f'phim.{ctx["khoi"]}', 'video_ma', 'phim_tranh', dict(ctx, so_canh=len(bl['scenes'])), f'DATA.units[{ui}].blocks[{bi}].scenes',
                                 {'*': {'trang_thai': 'co_san', 'ky_tu': 0, 'dau_80': '', 'nguon_hien_co': {'kieu': 'dung_bang_ma', 'trinh_phat': 'phim tranh: tranh cat tu trang + phu de + audio cau'}}}))
    orph = 0
    for lg in SPR:
        for f, arr in SPR[lg].items():
            for a, sp in enumerate(arr):
                if sp and (lg, f, a) not in used and sp[2] > 0:
                    orph += 1
                    pts.append(point(f'{f}#{a}#thua', 'doc_theo_cau', 'khong_ro', {}, None,
                                     {lg: {'trang_thai': 'thua', 'ky_tu': 0, 'dau_80': '', 'nguon_hien_co': {'file': f'audio/{lg}/{f}_{sp[0]}.mp3', 'start': sp[1], 'dur': sp[2]}}}))
    stats = {'nhom_audio': {lg: len(SPR[lg]) for lg in SPR}, 'moc_cau_thua': orph, 'phim_tranh': nscene}
    return pts, stats

ALL_STATS = {}
for b in BOOKS:
    if b in ('matematika5', 'informatika5', 'kimyo8', 'fizika8'): pts, st = family_a(b)
    elif b in ('tabiiy5', 'biologiya5'): pts, st = family_b(b)
    else: pts, st = family_c(b)
    ids = [p['id'] for p in pts]
    dup = [k for k, v in collections.Counter(ids).items() if v > 1]
    assert not dup, (b, dup[:5])
    ALL_STATS[b] = st
    result[b] = {'artifact_url': ART[b]['url'], 'artifact_version': ART[b]['version'], 'html_nguon': '$R/' + HTML[b], 'thong_ke_nguon': st,
                 'so_diem': len(pts), 'diem': pts}

out = {
    '_mo_ta': 'Kiem ke diem can media cua 7 cuon (M1, tang 0 thu nghiem 1). Moi diem co id on dinh (= khoa clip trong ma/schema: AUDIO/SPRITE/SPR, hoac p<trang>.fig<j>.i<k>, video.<id>). '
              'ngon_ngu[lang] = {trang_thai, ky_tu, dau_80, nguon_hien_co?, ghi_chu?}; lang "*" dung cho video_ma (khong phu thuoc ngon ngu). Khong chep nguyen van dai: chi ky_tu + 80 ky tu dau.',
    'phien_ban': '0.9-nhap',
    'tao_luc': datetime.date.today().isoformat(),
    'ngon_ngu': LANGS,
    'enum': {
        'trang_thai': ['co_san', 'thieu', 'chi_tts_trinh_duyet', 'thua'],
        'loai': ['thuyet_minh', 'doc_theo_cau', 'video_ma', 'video_nguoi_dan', 'anh_trang', 'anh_minh_hoa', 'hieu_ung', 'khac'],
        'muc_dich': ['canh_video', 'buoc_demo', 'khoi_bai', 'gioi_thieu_chuong', 'diem_hinh', 'diem_hinh_loi_dan', 'cau_van', 'dong_tho', 'tieu_de', 'cau_hoi', 'thuat_ngu', 'bo_phan_mo_hinh', 'video_canh', 'phim_tranh', 'khong_ro'],
    },
    'quy_uoc': {
        'co_san': 'co file am thanh thu san trong artifact va ma phat duoc',
        'thieu': 'chua co am thanh nao (ke ca TTS trinh duyet), hoac khoa clip tro toi file da go',
        'chi_tts_trinh_duyet': 'ma doc bang speechSynthesis cua trinh duyet (phu thuoc may nguoi xem, thuong khong co giong uz)',
        'thua': 'doan am thanh co trong artifact nhung khong diem nao dung',
        'mo_rong': 'diem co mo_rong=true: diem hinh kham pha (muc_dich diem_hinh*) chua duoc ma phat (kimyo8/fizika8 chua tung co audio; biologiya5 fx da co 1200 doan nhung chua noi va file da go 6/11): nhu cau de xuat, tong-hop.csv tach rieng',
    },
    'sach': result,
}
json.dump(out, open(os.path.join(KK, 'nhu-cau.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
json.dump(ALL_STATS, open(os.path.join(DU, 'thong-ke.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print({b: result[b]['so_diem'] for b in BOOKS})
print(json.dumps(ALL_STATS, ensure_ascii=False))
