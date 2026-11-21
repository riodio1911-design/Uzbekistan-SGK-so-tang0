#!/usr/bin/env python3
"""Gắn kết quả nhà máy media (clips_<lang>.json) vào book.json: media.clips[id][lang] + media.files.

Dùng: python3 -I gan-clips.py --book books/kimyo8/book.json --clips media/kimyo8/clips_ru.json --lang ru
"""
import argparse, json, os
ap = argparse.ArgumentParser()
ap.add_argument('--book', required=True); ap.add_argument('--clips', required=True); ap.add_argument('--lang', required=True)
a = ap.parse_args()
book = json.load(open(a.book, encoding='utf-8'))
new = json.load(open(a.clips, encoding='utf-8'))
clips = book['media']['clips']
miss = [k for k in new if k not in clips]
for k, v in new.items():
    if k in clips:
        clips[k][a.lang] = {x: v[x] for x in ('file', 'start', 'dur', 'source_hash', 'text_path') if x in v}
files = book['media'].setdefault('files', [])
have = {f['path'] for f in files}
for p in sorted({v['file'] for v in new.values()}):
    if p not in have:
        files.append({'path': p, 'kind': 'audio', 'lang': a.lang, 'used': True})
json.dump(book, open(a.book, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({'gan': len(new) - len(miss), 'khong_co_clip': miss[:10], 'files': len(files)}, ensure_ascii=False))
