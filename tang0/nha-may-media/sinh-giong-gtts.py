#!/usr/bin/env python3
"""Sinh thuyết minh cảnh video bằng giọng Google Dịch (gTTS) cho một cuốn, gộp thành vài file sprite.

Dùng:  python3 -I sinh-giong-gtts.py --book books/kimyo8/book.json --lang ru --out media/kimyo8
Ra:
  <out>/audio_<lang>/<lang>_<n>.mp3        sprite 64 kbps mono, mỗi file ≤ ~6 MB
  <out>/clips_<lang>.json                  {clip_id: {file, start, dur, source_hash, text_path, voice}}
  <out>/bao-cao_<lang>.json                số cảnh, số ký tự, thời lượng, cảnh lỗi
Chạy lại được: cảnh đã có trong _cache/<sha>.mp3 không gọi lại (khóa = sha256 của chữ + giọng + định dạng).
Quyết định nhóm duyệt 21/11/2026: dùng giọng Google Dịch miễn phí cho tiếng Nga; tiếng Uzbek tạm chưa làm.
"""
import argparse, hashlib, json, os, subprocess, sys, time

ap = argparse.ArgumentParser()
ap.add_argument('--book', required=True)
ap.add_argument('--lang', default='ru')
ap.add_argument('--out', required=True)
ap.add_argument('--max-mb', type=float, default=6.0)
ap.add_argument('--limit', type=int, default=0, help='chỉ làm N cảnh đầu (thử)')
a = ap.parse_args()

from gtts import gTTS  # pip install --break-system-packages gTTS

VOICE = f'gtts:{a.lang}:translate.google.com'
FMT = 'mp3:64k:mono:44100'
book = json.load(open(a.book, encoding='utf-8'))
clips = book['media']['clips']
cache = os.path.join(a.out, '_cache'); os.makedirs(cache, exist_ok=True)
outdir = os.path.join(a.out, f'audio_{a.lang}'); os.makedirs(outdir, exist_ok=True)

def dur(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)

# 1) danh sách cảnh có chữ thuyết minh của ngôn ngữ này
items = []
for vi, v in enumerate(book.get('videos', [])):
    for si, s in enumerate(v.get('scenes', [])):
        nr = s.get('narration') or {}
        txt = (nr.get(a.lang) or '').strip()
        cid = nr.get('audio_ref') or (s.get('narration_audio') or {}).get('ref')
        if not cid:
            # quy ước của cuốn: clip id = <lesson>-s<i>
            cid = f"{v.get('lesson')}-s{si}"
        if txt and cid in clips:
            items.append((cid, txt, f'/videos/{vi}/scenes/{si}/narration/{a.lang}'))
if a.limit: items = items[:a.limit]
print(f'{len(items)} cảnh, {sum(len(t) for _, t, _ in items)} ký tự', flush=True)

# 2) sinh từng cảnh (có cache), chuẩn hóa về 64k mono
errs, made = [], []
for k, (cid, txt, tp) in enumerate(items):
    h = hashlib.sha256(f'{txt}|{VOICE}|{FMT}'.encode()).hexdigest()
    mp3 = os.path.join(cache, h + '.mp3')
    if not os.path.exists(mp3):
        raw = mp3 + '.raw.mp3'
        for attempt in range(4):
            try:
                gTTS(txt, lang=a.lang).save(raw); break
            except Exception as e:
                if attempt == 3: errs.append({'clip': cid, 'error': str(e)[:200]}); raw = None
                else: time.sleep(5 * (attempt + 1))
        if not raw: continue
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-18:TP=-1.5,apad=pad_dur=0.25', '-ac', '1', '-ar', '44100', '-b:a', '64k', mp3], check=True)
        os.remove(raw); time.sleep(0.6)
    made.append((cid, txt, tp, h, mp3, dur(mp3)))
    if k % 25 == 0: print(f'  {k+1}/{len(items)}', flush=True)

# 3) gộp sprite: giải mã từng cảnh ra PCM (đếm đúng số mẫu), nối PCM rồi mã hóa MỘT lần,
#    nên start/dur khớp mẫu âm thanh, không trôi do khoảng lặng đệm của từng file MP3.
SR = 44100
def pcm(path):
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
spr, cur, cur_sec, n = {}, [], 0.0, 1
max_sec = a.max_mb * 1e6 * 8 / 64000   # dung lượng ở 64 kbps
def flush(group, n):
    if not group: return
    raw = os.path.join(a.out, f'_spr_{n}.pcm'); start = 0
    with open(raw, 'wb') as f:
        for cid, txt, tp, h, mp3, d in group:
            b = pcm(mp3); f.write(b); ns = len(b) // 2
            spr[cid] = {'file': f'audio_{a.lang}/{a.lang}_{n}.mp3', 'start': round(start / SR, 3), 'dur': round(ns / SR, 3),
                        'source_hash': 'sha256:' + h, 'text_path': tp, 'voice': VOICE}
            start += ns
    out = os.path.join(outdir, f'{a.lang}_{n}.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-i', raw, '-b:a', '64k', out], check=True)
    os.remove(raw)
for f in os.listdir(outdir): os.remove(os.path.join(outdir, f))
for m in made:
    if cur and cur_sec + m[5] > max_sec:
        flush(cur, n); n += 1; cur, cur_sec = [], 0.0
    cur.append(m); cur_sec += m[5]
flush(cur, n)

json.dump(spr, open(os.path.join(a.out, f'clips_{a.lang}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
rep = {'lang': a.lang, 'voice': VOICE, 'scenes': len(items), 'made': len(spr), 'errors': errs,
       'files': sorted(os.listdir(outdir)), 'minutes': round(sum(m[5] for m in made) / 60, 1),
       'mb': round(sum(os.path.getsize(os.path.join(outdir, f)) for f in os.listdir(outdir)) / 1e6, 1)}
json.dump(rep, open(os.path.join(a.out, f'bao-cao_{a.lang}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(rep, ensure_ascii=False))
sys.exit(1 if errs and not spr else 0)
