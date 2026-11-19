#!/usr/bin/env python3
"""build.py – đầu đọc tầng 0 (R1).

1. Sinh data/<book_id>.js từ tang0/schema/vi-du/<cuon>.book-trich.json + .features.json
   (window.T0_SAMPLES[<book_id>] = {book, features}) và data/prompts.js (window.T0_PROMPTS từ gia-su/prompts.json).
2. Viết lại khối <!-- T0:SCRIPTS --> trong index.html: components/**/*.js, modes/*.js, data/*.js.
3. Gộp thành dist/index.html một file (CSS/JS nội tuyến), chép mau/ sang dist/mau/,
   ghi dist/files.json = danh sách file phụ (ảnh, audio) để publish sau qua `files`.

Chạy: python3 -I build.py
"""
import json, os, re, shutil, sys, hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
T0 = os.path.dirname(HERE)
VIDU = os.path.join(T0, 'schema', 'vi-du')
BOOKS = ['kimyo8', 'tabiiy5', 'adabiyot5']


def rel(p):
    return os.path.relpath(p, HERE).replace(os.sep, '/')


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def js_safe(obj):
    s = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return s.replace('</', '<\\/').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


def gen_data():
    out = []
    for c in BOOKS:
        bp = os.path.join(VIDU, c + '.book-trich.json')
        fp = os.path.join(VIDU, c + '.features.json')
        if not os.path.exists(bp):
            print('  thiếu', bp); continue
        book = json.load(open(bp, encoding='utf-8'))
        feats = json.load(open(fp, encoding='utf-8')) if os.path.exists(fp) else {}
        bid = book['book_id']
        p = os.path.join(HERE, 'data', bid + '.js')
        write(p, '/* sinh bởi build.py từ schema/vi-du – KHÔNG sửa tay */\n'
                 'window.T0_SAMPLES=window.T0_SAMPLES||{};\n'
                 f'window.T0_SAMPLES[{json.dumps(bid)}]={{book:{js_safe(book)},features:{js_safe(feats)}}};\n')
        out.append(p)
    pr = json.load(open(os.path.join(T0, 'gia-su', 'prompts.json'), encoding='utf-8'))
    p = os.path.join(HERE, 'data', 'prompts.js')
    write(p, '/* sinh bởi build.py từ gia-su/prompts.json */\nwindow.T0_PROMPTS=' + js_safe(pr) + ';\n')
    out.insert(0, p)
    return out


def list_scripts():
    comps = []
    for root, dirs, files in os.walk(os.path.join(HERE, 'components')):
        dirs[:] = sorted(d for d in dirs if not d.startswith('_'))
        comps += [os.path.join(root, f) for f in sorted(files) if f.endswith('.js')]
    modes = sorted(os.path.join(HERE, 'modes', f) for f in os.listdir(os.path.join(HERE, 'modes')) if f.endswith('.js'))
    # blocks.js (R2) trước các component khác cho chắc
    comps.sort(key=lambda p: (0 if p.endswith('blocks.js') else 1, p))
    return comps + modes


def patch_index(scripts, data):
    ip = os.path.join(HERE, 'index.html')
    html = open(ip, encoding='utf-8').read()
    block = '\n'.join(f'<script src="{rel(s)}"></script>' for s in scripts + data)
    html = re.sub(r'(<!-- T0:SCRIPTS:BEGIN[^>]*-->)(.*?)(<!-- T0:SCRIPTS:END -->)',
                  lambda m: m.group(1) + '\n' + block + '\n' + m.group(3), html, flags=re.S)
    write(ip, html)
    return html


def inline(html):
    def css(m):
        href = m.group(1)
        txt = open(os.path.normpath(os.path.join(HERE, href)), encoding='utf-8').read()
        return '<style>\n' + txt + '\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)"[^>]*>', css, html)

    def js(m):
        src = m.group(1)
        txt = open(os.path.join(HERE, src), encoding='utf-8').read().replace('</script', '<\\/script')
        return f'<script>/* {src} */\n' + txt + '\n</script>'
    html = re.sub(r'<script src="([^"]+)"></script>', js, html)
    return html


def main():
    data = gen_data()
    scripts = list_scripts()
    html = patch_index(scripts, data)
    dist = os.path.join(HERE, 'dist')
    os.makedirs(dist, exist_ok=True)
    one = inline(html)
    write(os.path.join(dist, 'index.html'), one)
    # file phụ
    files = []
    src_m = os.path.join(HERE, 'mau')
    dst_m = os.path.join(dist, 'mau')
    if os.path.isdir(dst_m):
        shutil.rmtree(dst_m)
    if os.path.isdir(src_m):
        shutil.copytree(src_m, dst_m)
        for root, _, fs in os.walk(dst_m):
            for f in sorted(fs):
                p = os.path.join(root, f)
                files.append({'path': os.path.relpath(p, dist).replace(os.sep, '/'), 'bytes': os.path.getsize(p),
                              'sha256': hashlib.sha256(open(p, 'rb').read()).hexdigest()})
    write(os.path.join(dist, 'files.json'), json.dumps({'page': 'index.html', 'files': files}, ensure_ascii=False, indent=1))
    kb = os.path.getsize(os.path.join(dist, 'index.html')) / 1024
    print(f'dist/index.html {kb:.0f} KB; {len(scripts)} script; {len(files)} file phụ '
          f'({sum(f["bytes"] for f in files)/1048576:.1f} MB)')
    for s in scripts:
        print('  +', rel(s))


if __name__ == '__main__':
    main()
