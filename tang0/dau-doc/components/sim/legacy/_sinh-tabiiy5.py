#!/usr/bin/env python3
"""Sinh components/sim/legacy/tabiiy5.js – gói "mã cũ nhúng tạm" (D3, cờ trục 9 ma_cu_nhung_tam, hạn gỡ đợt 2).

Đề xuất 007 bước 1: sim.legacy_embed chạy hàm cũ theo params.code_ref trong iframe sandbox.
Gói chỉ chứa phần mã cũ cần cho 26 ACT.* + 88 cảnh VIDEOS.*.draw của tabiiy5:
  - CSS cũ (bỏ @font-face base64),
  - từ điển RUDICT (chỉ khóa xuất hiện trong phần mã được lấy + mẫu có '{}') và lớp .ru (Object.prototype getter – CHỈ trong iframe),
  - 11 khối <script> video (VIDEO_HELPERS, VK, VIDEOS v1…v10x),
  - hằng UI + hàm chữ (LT, T, tx, ui, uiP, esc, strip…) và vùng ACT (từ 'const ACT = {}' đến trước 'function GACT').
Chạy lại:  python3 -I _sinh-tabiiy5.py   (đọc $R/fix2/tabiiy5/index.html; không sửa file đó)
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..', '..'))
SRC = os.path.join(R, 'fix2', 'tabiiy5', 'index.html')
OUT = os.path.join(HERE, 'tabiiy5.js')

h = open(SRC, encoding='utf-8').read()

def between(a, b, start=0):
    i = h.index(a, start); j = h.index(b, i); return h[i:j], j

# 1) CSS
m = re.search(r'<style>\s*/\* baloo', h)
css_end = h.index('</style>', m.start())
css = h[m.end() - len('/* baloo'):css_end]
css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)
css = re.sub(r'/\*[^*]*-normal \*/\s*', '', css)

# 2) khối script video
scripts = []
for sm in re.finditer(r'<script>', h):
    body_start = sm.end(); body_end = h.index('</script>', body_start)
    body = h[body_start:body_end]
    head = body.lstrip()[:160]
    if head.startswith('/* Video darslar') or head.startswith('/* Video ·'):
        scripts.append(body)
video_js = '\n;\n'.join(scripts)

# 3) chữ + ACT
ui_js, _ = between('const UI = {', '/* ───── Speaker')
act_js, _ = between('const ACT = {};', 'function GACT(')

# 4) lớp tiếng Nga
i = h.index('window.RUDICT=') + len('window.RUDICT=')
rud, end = json.JSONDecoder().raw_decode(h, i)
ru_layer, _ = between('/* Lớp tiếng Nga', '/* Nội dung chương 1')
code = video_js + ui_js + act_js
sub = {k: v for k, v in rud.items() if '{}' in k or k in code}

js = (
    '/* SINH TỰ ĐỘNG bởi _sinh-tabiiy5.py từ fix2/tabiiy5/index.html – KHÔNG SỬA TAY.\n'
    ' * Mã cũ nhúng tạm (D3: tabiiy5 được dùng sim.legacy_embed, cờ trục 9 ma_cu_nhung_tam, hạn gỡ ở đợt 2).\n'
    ' * Chỉ chạy bên trong iframe sandbox của components/sim/legacy_embed.js. */\n'
    '(window.T0_LEGACY = window.T0_LEGACY || {})["tabiiy5"] = ' + json.dumps({
        'flag': 'ma_cu_nhung_tam',
        'source': 'fix2/tabiiy5/index.html',
        'css': css,
        'ru': sub,
        'js': ru_layer + '\n;\n' + video_js + '\n;\n' + ui_js + '\n;\n' + act_js,
    }, ensure_ascii=False).replace('</', '<\\/') + ';\n'
)
open(OUT, 'w', encoding='utf-8').write(js)
print('ghi', OUT, len(js.encode('utf-8')), 'byte; video', len(scripts), 'khối; ru', len(sub), '/', len(rud), 'khóa')
