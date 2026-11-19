# python3 -I csv_out.py — tu nhu-cau.json + danh sach file artifact -> tong-hop.csv, media-hien-co.csv
import json, os, csv, collections

KK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.dirname(os.path.dirname(os.path.dirname(KK)))
DU = os.path.join(KK, '_du-lieu')
NC = json.load(open(os.path.join(KK, 'nhu-cau.json'), encoding='utf8'))
S = NC['sach']
LANGS = NC['ngon_ngu']
BOOKS = list(S)

# --- he so toc do doc: do tu chinh cac clip co_san (ky_tu / giay) ---
ch, du = collections.Counter(), collections.Counter()
for b in BOOKS:
    for p in S[b]['diem']:
        for lg, e in p['ngon_ngu'].items():
            src = e.get('nguon_hien_co') or {}
            if e['trang_thai'] == 'co_san' and 'dur' in src and e['ky_tu'] > 0:
                ch[lg] += e['ky_tu']; du[lg] += src['dur']
RATE = {lg: round(ch[lg] / du[lg] * 60) for lg in LANGS}  # ky tu / phut
MB_PER_MIN = 64000 / 8 * 60 / 1e6  # 0.48 MB/phut o 64 kbps

rows = []
tot = {lg: collections.Counter() for lg in LANGS}
for b in BOOKS:
    for lg in LANGS:
        c = collections.Counter()
        for p in S[b]['diem']:
            if p['loai'] == 'video_ma': continue
            e = p['ngon_ngu'].get(lg)
            if not e: continue
            st = e['trang_thai']
            if st == 'thua':
                c['thua'] += 1; c['thua_giay'] += (e.get('nguon_hien_co') or {}).get('dur', 0); continue
            c['diem'] += 1; c['ky_tu'] += e['ky_tu']; c[st] += 1
            if st == 'co_san': c['giay_co'] += (e.get('nguon_hien_co') or {}).get('dur', 0)
            if st in ('thieu', 'chi_tts_trinh_duyet'):
                c['ky_can'] += e['ky_tu']
                if p.get('mo_rong'): c['mr_diem'] += 1; c['mr_ky'] += e['ky_tu']
                else: c['cot_diem'] += 1; c['cot_ky'] += e['ky_tu']
        for k, v in c.items(): tot[lg][k] += v
        rows.append((b, lg, c))
for lg in LANGS: rows.append(('TAT_CA', lg, tot[lg]))

def mins(k, lg): return round(k / RATE[lg], 1)
with open(os.path.join(KK, 'tong-hop.csv'), 'w', newline='', encoding='utf8') as f:
    w = csv.writer(f)
    w.writerow(['book', 'lang', 'so_diem', 'tong_ky_tu', 'so_co_ban_thu', 'phut_ban_thu_hien_co', 'so_chi_tts_trinh_duyet', 'so_thieu', 'so_doan_thua',
                'ky_tu_can_tts', 'phut_uoc_luong_can_tts', 'mb_uoc_luong_mp3_64kbps',
                'cot_loi_so_diem', 'cot_loi_ky_tu', 'cot_loi_phut', 'mo_rong_so_diem', 'mo_rong_ky_tu', 'mo_rong_phut', 'cong_thuc'])
    for b, lg, c in rows:
        m = mins(c['ky_can'], lg)
        w.writerow([b, lg, c['diem'], c['ky_tu'], c['co_san'], round(c['giay_co'] / 60, 1), c['chi_tts_trinh_duyet'], c['thieu'], c['thua'],
                    c['ky_can'], m, round(m * MB_PER_MIN, 1),
                    c['cot_diem'], c['cot_ky'], mins(c['cot_ky'], lg), c['mr_diem'], c['mr_ky'], mins(c['mr_ky'], lg),
                    f'uoc luong: phut = ky_tu_can_tts / {RATE[lg]} ky tu/phut (toc do do tu clip co_san {lg}); MB = phut x 0.48 (64 kbps)'])

# --- media-hien-co.csv ---
tong = {}
for l in open(os.path.join(DU, 'files-tong.tsv'), encoding='utf8').read().splitlines()[1:]:
    b, ver, n, note = l.split('\t'); tong[b] = (ver, n, note)
def audio_sum(fn, filt=lambda p: True, col=-1, pathcol=0):
    n = s = 0
    for l in open(os.path.join(DU, fn), encoding='utf8').read().splitlines():
        x = l.split('\t')
        if filt(x): n += 1; s += int(x[col])
    return n, round(s / 1e6, 2)

KKJ = {b: json.load(open(os.path.join(R, 'kiem-ke', b + '.json'), encoding='utf8'))['kich_thuoc'] for b in BOOKS}
def kk_mb(b, key):
    t = KKJ[b]['theo_thu_muc'].get(key)
    return t['mb'] if t else ''

def pts(b, pred):
    return sum(1 for p in S[b]['diem'] if pred(p))
def lang_pts(b, lg, st, loai=None):
    return sum(1 for p in S[b]['diem'] if (loai is None or p['loai'] == loai) and p['ngon_ngu'].get(lg, {}).get('trang_thai') == st)

M = []
def add(*r): M.append(r)
for b in BOOKS:
    ver = tong[b][0]
    # audio thu san
    if b in ('matematika5', 'informatika5', 'kimyo8', 'fizika8'):
        n, mb = audio_sum('files-ho-a-audio.tsv', lambda x: x[0] == b)
        add(b, 'thuyet_minh', 'vi', 'file thu san', n, mb, ('canh video (TP) + buoc demo (DM)' if b == 'informatika5' else 'canh video (TP)'),
            f'{n} MP3 sprite audio_vi/; {lang_pts(b, "vi", "co_san")} doan theo AUDIO.vi; giong khong ro nguon (voice unknown); ban {ver}')
        for lg in ('uz', 'ru'):
            add(b, 'thuyet_minh', lg, 'tts_trinh_duyet', lang_pts(b, lg, 'chi_tts_trinh_duyet'), 0, 'canh video' + (' + buoc demo' if b == 'informatika5' else ''),
                'speechSynthesis; chi chay neu may nguoi xem co giong ' + lg)
    elif b in ('tabiiy5', 'biologiya5'):
        for lg in LANGS:
            n, mb = audio_sum(f'files-{b}-audio.tsv', lambda x, lg=lg: x[0].endswith(f'-{lg}.mp3'))
            add(b, 'thuyet_minh', lg, 'file thu san', n, mb, 'khoi bai + canh video' + (' + gioi thieu chuong' if b == 'tabiiy5' else ''),
                f'{lang_pts(b, lg, "co_san")} doan sprite dang phat; ' + ('audio2/ (audio/ thua da go 6/11)' if b == 'tabiiy5' else 'audio/l*.mp3 (fx-*.mp3 ~71 MB da go 6/11, khoa SPRITE fx con 1200)') + f'; ban {ver}')
    else:
        for lg in LANGS:
            n, mb = audio_sum(f'files-{b}-audio.tsv', lambda x, lg=lg: x[0].startswith(f'audio/{lg}/'))
            add(b, 'doc_theo_cau', lg, 'file thu san', n, mb, 'cau van/dong tho/tieu de (DATA.units, moc SPR)',
                f'{lang_pts(b, lg, "co_san")} cau co moc; giong may TTS (ghi o chan trang); 158 file audio/ goc da go 6/11; ban {ver}')
        for lg in ('vi', 'ru'):
            add(b, 'doc_theo_cau', lg, 'tts_trinh_duyet', lang_pts(b, lg, 'chi_tts_trinh_duyet'), 0, 'cau na=1 (cau hoi, cho trong)', 'say() khi bam dong dich')
    if b in ('tabiiy5', 'biologiya5'):
        for lg in LANGS:
            add(b, 'thuyet_minh', lg, 'tts_trinh_duyet', lang_pts(b, lg, 'chi_tts_trinh_duyet'), 0, 'thuat ngu (glossary) + bo phan mo hinh hoa (PARTS)', 'speechSynthesis khi bam nut loa')
    if b != 'adabiyot5':
        add(b, 'khac', '*', 'tts_trinh_duyet', '', 0, 'tro ly Robo (cau tra loi AI)', 'speak(): doc cau tra loi sinh luc chay bang speechSynthesis; khong san xuat truoc duoc')
    # video dung bang ma
    nv = pts(b, lambda p: p['loai'] == 'video_ma')
    canh = sum(p['gan_voi'].get('so_canh', 0) for p in S[b]['diem'] if p['loai'] == 'video_ma')
    add(b, 'video_ma', '*', 'dung_bang_ma', nv, 0, 'bai/chu de', f'{canh} canh; khong co file video; GV co the thay bang video that qua db media/ hoac quiz/ (assets <=20 MB)' if b != 'matematika5' else f'{canh} canh; khong co file video; matematika5 khong co capability assets')
    if b == 'informatika5':
        add(b, 'khac', '*', 'dung_bang_ma', 81, 0, 'trang (DM)', 'mo phong thao tac phan mem (81 kich ban DM, 459 buoc co loi)')
    # anh
    kk = KKJ[b]['theo_thu_muc']
    if b == 'matematika5':
        add(b, 'anh_trang', 'uz', 'file thu san', 176, kk_mb(b, 'pages/'), 'trang SGK', 'pages/p001-p176')
        add(b, 'anh_trang', 'uz', 'file thu san', 221, kk_mb(b, 'wb/'), 'trang vo bai tap', 'wb/w001-w221')
    elif b == 'informatika5':
        add(b, 'anh_trang', 'uz', 'file thu san', 176, kk_mb(b, 'pages/'), 'trang SGK', 'pages/; MB uoc luong (kiem-ke)')
    elif b in ('kimyo8', 'fizika8'):
        n = 208 if b == 'kimyo8' else 176
        add(b, 'anh_trang', 'uz', 'file thu san', n, kk_mb(b, 'pages/'), 'trang SGK', 'pages/' + ('' if b == 'kimyo8' else '; MB uoc luong (kiem-ke)'))
        add(b, 'anh_trang', 'ru', 'file thu san', n, kk_mb(b, 'pages_ru/'), 'trang ban in Nga', 'pages_ru/' + ('' if b == 'kimyo8' else '; p157 chi 14 089 B, co the hong; MB uoc luong'))
        nf = pts(b, lambda p: p['muc_dich'] == 'diem_hinh_loi_dan')
        add(b, 'anh_minh_hoa', '*', 'dung_bang_ma', nf, 0, 'hinh kham pha (PG.fig)', 'cat vung tu anh trang bang CSS, khong co file anh rieng')
    elif b == 'tabiiy5':
        add(b, 'anh_trang', 'uz', 'file thu san', 142, kk_mb(b, 'pages/'), 'trang SGK', 'pages/p008-p149; MB uoc luong (kiem-ke)')
        add(b, 'anh_trang', 'uz', 'file thu san', 117, kk_mb(b, 'wbpages/'), 'trang vo bai tap', 'wbpages/; w116 chi 10 984 B; MB uoc luong')
        add(b, 'anh_minh_hoa', '*', 'file thu san', 160, kk_mb(b, 'img/'), 'khoi bai/vo bai tap', 'img/ 151 jpg + 9 png; 13 anh khong thay tham chieu (kiem-ke); MB uoc luong')
    elif b == 'biologiya5':
        add(b, 'anh_trang', 'ru', 'file thu san', 96, kk_mb(b, 'pg/'), 'trang sach (bo cuc ban Nga)', 'pg/; 12 file 32 727 B cung sha256 -> co the trang trong/giu cho')
        add(b, 'anh_minh_hoa', '*', 'file thu san', 93, kk_mb(b, 'img/'), 'hinh danh so + anh khoi pic', 'img/f1-f83 + 10 x*.jpg')
    else:
        add(b, 'anh_trang', 'uz', 'file thu san', 98, kk_mb(b, 'pages/'), 'trang goc', 'pages/; MB uoc luong (kiem-ke)')
        add(b, 'anh_trang', 'uz', 'file thu san', 98, kk_mb(b, 'bg/'), 'nen trang da xoa chu', 'bg/ (che do html ve lai chu SVG); MB uoc luong')

with open(os.path.join(KK, 'media-hien-co.csv'), 'w', newline='', encoding='utf8') as f:
    w = csv.writer(f)
    w.writerow(['book', 'loai', 'ngon_ngu', 'nguon', 'so_luong', 'mb', 'gan_voi', 'ghi_chu'])
    for r in M: w.writerow(r)
print('RATE', RATE)
for b, lg, c in rows: print(b, lg, dict(c))
