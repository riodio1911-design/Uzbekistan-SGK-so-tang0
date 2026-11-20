#!/usr/bin/env python3
"""build.py – đầu đọc tầng 0 (v0.10, agent D đợt 1).

Hai cách chạy:
  python3 -I build.py                      bản mẫu (3 cuốn trích từ tang0/schema/vi-du) -> dist/index.html (như R1)
  python3 -I build.py --book kimyo8        bản xem trước một cuốn THẬT từ $R/books/kimyo8/book.json + features.json
                                           -> dist/kimyo8/index.html (+ dist/kimyo8/mau/kimyo8/ = file mẫu cục bộ
                                              từ books/<cuon>/preview/_mau, + dist/kimyo8/files.json)
  python3 -I build.py --book all           cả 7 cuốn
Tùy chọn: --out <thư mục> (mặc định dist/<cuon>), --no-patch (không viết lại khối T0:SCRIPTS trong index.html).

Script nạp (thứ tự): core.js, components/**/*.js (blocks.js và file '_*.js' trước, bỏ thư mục '_*' trừ khi file gốc
tham chiếu), modules/**/*.js, modes/*.js, data/*.js. Thư mục con bắt đầu bằng '_' (vd. _thu) bị bỏ qua;
components/sim/legacy/<book_id>.js (mã cũ nhúng tạm) chỉ gộp vào dist của chính cuốn đó (bản mẫu: mọi gói).

files.json của bản --book: {page, files: {đường dẫn đăng: {artifact, path}}} cho tham số `files` của Artifact publish
(chép phía server từ artifact cũ, url lấy ở kiem-ke/<cuon>.json); 'local_samples' = file mẫu có trong dist để chụp thử.
Trước khi gộp, chạy _cong-cu/sinh-preset.py --tu-preset (screen_demo_presets.js khớp thu-vien/mo-phong/presets/screen_demo.json).
KHÔNG publish.
"""
import argparse, glob, hashlib, json, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
T0 = os.path.dirname(HERE)
R = os.path.dirname(T0)
VIDU = os.path.join(T0, 'schema', 'vi-du')
SAMPLE_BOOKS = ['kimyo8', 'tabiiy5', 'adabiyot5']
ALL_BOOKS = ['kimyo8', 'fizika8', 'matematika5', 'informatika5', 'adabiyot5', 'biologiya5', 'tabiiy5']


def rel(p, base=HERE):
    return os.path.relpath(p, base).replace(os.sep, '/')


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)


def js_safe(obj):
    s = json.dumps(obj, ensure_ascii=False, separators=(',', ':'))
    return s.replace('</', '<\\/').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


def data_js(book, feats):
    bid = book['book_id']
    return ('/* sinh bởi build.py – KHÔNG sửa tay */\nwindow.T0_SAMPLES=window.T0_SAMPLES||{};\n'
            f'window.T0_SAMPLES[{json.dumps(bid)}]={{book:{js_safe(book)},features:{js_safe(feats)}}};\n')


def prompts_js():
    pr = json.load(open(os.path.join(T0, 'gia-su', 'prompts.json'), encoding='utf-8'))
    return '/* sinh bởi build.py từ gia-su/prompts.json */\nwindow.T0_PROMPTS=' + js_safe(pr) + ';\n'


def gen_sample_data():
    out = [os.path.join(HERE, 'data', 'prompts.js')]
    write(out[0], prompts_js())
    for c in SAMPLE_BOOKS:
        bp = os.path.join(VIDU, c + '.book-trich.json')
        fp = os.path.join(VIDU, c + '.features.json')
        if not os.path.exists(bp):
            print('  thiếu', bp); continue
        book = json.load(open(bp, encoding='utf-8'))
        feats = json.load(open(fp, encoding='utf-8')) if os.path.exists(fp) else {}
        p = os.path.join(HERE, 'data', book['book_id'] + '.js')
        write(p, data_js(book, feats))
        out.append(p)
    return out


def walk_js(sub):
    top = os.path.join(HERE, sub)
    res = []
    if not os.path.isdir(top):
        return res
    for root, dirs, files in os.walk(top):
        dirs[:] = sorted(d for d in dirs if not d.startswith('_'))
        res += [os.path.join(root, f) for f in sorted(files) if f.endswith('.js')]
    return res


def list_scripts():
    def key(p):
        b = os.path.basename(p)
        # blocks.js, rồi thư viện dùng chung '_*.js' của từng thư mục, rồi phần còn lại theo đường dẫn
        return (0 if b == 'blocks.js' else 1, os.path.dirname(p), 0 if b.startswith('_') else 1, p)
    # components/sim/legacy/<book_id>.js (mã cũ nhúng tạm, F/007) KHÔNG nạp chung – xem legacy_scripts()
    comps = sorted((p for p in walk_js('components') if not p.startswith(LEGACY + os.sep)), key=key)
    mods = sorted(walk_js('modules'), key=key)
    modes_d = os.path.join(HERE, 'modes')
    modes = sorted(os.path.join(modes_d, f) for f in os.listdir(modes_d) if f.endswith('.js'))
    return comps + mods + modes


LEGACY = os.path.join(HERE, 'components', 'sim', 'legacy')


def legacy_scripts(book_id=None):
    """Gói mã cũ nhúng tạm: chỉ components/sim/legacy/<book_id>.js của chính cuốn đó (book_id=None: mọi gói, cho bản mẫu)."""
    if not os.path.isdir(LEGACY):
        return []
    fs = sorted(f for f in os.listdir(LEGACY) if f.endswith('.js') and not f.startswith('_'))
    return [os.path.join(LEGACY, f) for f in fs if book_id is None or f == book_id + '.js']


def script_block(paths, base):
    return '\n'.join(f'<script src="{rel(s, base)}"></script>' for s in paths)


def patch_index(scripts, data):
    ip = os.path.join(HERE, 'index.html')
    html = open(ip, encoding='utf-8').read()
    html = re.sub(r'(<!-- T0:SCRIPTS:BEGIN[^>]*-->)(.*?)(<!-- T0:SCRIPTS:END -->)',
                  lambda m: m.group(1) + '\n' + script_block(scripts + data, HERE) + '\n' + m.group(3), html, flags=re.S)
    write(ip, html)
    return html


def inline(html, extra_js=None):
    """Gộp CSS/JS vào một file. extra_js: {src: text} cho script không có trên đĩa (data sinh trong bộ nhớ)."""
    extra_js = extra_js or {}

    def css(m):
        txt = open(os.path.normpath(os.path.join(HERE, m.group(1))), encoding='utf-8').read()
        return '<style>\n' + txt + '\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)"[^>]*>', css, html)

    def js(m):
        src = m.group(1)
        txt = extra_js[src] if src in extra_js else open(os.path.join(HERE, src), encoding='utf-8').read()
        return f'<script>/* {src} */\n' + txt.replace('</script', '<\\/script') + '\n</script>'
    return re.sub(r'<script src="([^"]+)"></script>', js, html)


def copy_tree_files(src, dst, dist_root):
    files = []
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    if os.path.isdir(src):
        shutil.copytree(src, dst)
        for root, _, fs in os.walk(dst):
            for f in sorted(fs):
                p = os.path.join(root, f)
                files.append({'path': rel(p, dist_root), 'bytes': os.path.getsize(p),
                              'sha256': hashlib.sha256(open(p, 'rb').read()).hexdigest()})
    return files


def build_samples(no_patch):
    data = gen_sample_data()
    scripts = list_scripts() + legacy_scripts()
    html = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read() if no_patch else patch_index(scripts, data)
    dist = os.path.join(HERE, 'dist')
    write(os.path.join(dist, 'index.html'), inline(html))
    files = copy_tree_files(os.path.join(HERE, 'mau'), os.path.join(dist, 'mau'), dist)
    write(os.path.join(dist, 'files.json'), json.dumps({'page': 'index.html', 'files': files}, ensure_ascii=False, indent=1))
    kb = os.path.getsize(os.path.join(dist, 'index.html')) / 1024
    print(f'dist/index.html {kb:.0f} KB; {len(scripts)} script; {len(files)} file phụ')
    return scripts


def old_artifact_url(cuon, book):
    kk = os.path.join(R, 'kiem-ke', cuon + '.json')
    if os.path.exists(kk):
        u = json.load(open(kk, encoding='utf-8')).get('url')
        if u:
            return u
    m = re.search(r'https://claude\.ai/artifact/[A-Za-z0-9]+', json.dumps(book.get('profile', {}), ensure_ascii=False))
    return m.group(0) if m else None


def build_book(cuon, scripts, out=None):
    bdir = os.path.join(R, 'books', cuon)
    book = json.load(open(os.path.join(bdir, 'book.json'), encoding='utf-8'))
    fp = os.path.join(bdir, 'features.json')
    feats = json.load(open(fp, encoding='utf-8')) if os.path.exists(fp) else {}
    bid = book['book_id']
    dist = out or os.path.join(HERE, 'dist', cuon)
    os.makedirs(dist, exist_ok=True)
    # index.html với khối script riêng cho cuốn này (chỉ một cuốn trong T0_SAMPLES)
    html = open(os.path.join(HERE, 'index.html'), encoding='utf-8').read()
    scripts = scripts + legacy_scripts(bid)
    data_srcs = ['data/prompts.js', f'data/__book_{bid}.js']
    html = re.sub(r'(<!-- T0:SCRIPTS:BEGIN[^>]*-->)(.*?)(<!-- T0:SCRIPTS:END -->)',
                  lambda m: m.group(1) + '\n' + script_block(scripts, HERE) + '\n' +
                  '\n'.join(f'<script src="{s}"></script>' for s in data_srcs) + '\n' + m.group(3), html, flags=re.S)
    title = book.get('profile', {}).get('title', {})
    html = re.sub(r'<title>.*?</title>', '<title>' + (title.get('uz') if isinstance(title, dict) else str(title) or bid) + '</title>', html, count=1)
    one = inline(html, {'data/prompts.js': prompts_js(), f'data/__book_{bid}.js': data_js(book, feats)})
    write(os.path.join(dist, 'index.html'), one)
    # file mẫu cục bộ (để chụp thử) và bản đồ file của artifact cũ (để publish sau)
    local = copy_tree_files(os.path.join(bdir, 'preview', '_mau'), os.path.join(dist, 'mau', bid), dist)
    url = old_artifact_url(cuon, book)
    paths = sorted({f['path'] for f in (book.get('media') or {}).get('files', []) if f.get('path')})
    for p in book.get('pages', []):
        for v in list((p.get('images') or {}).values()) + [p.get('background')]:
            if v and not v.startswith('@') and not re.match(r'^(https?:|data:|/)', v):
                paths.append(v)
    paths = sorted(set(paths))
    # '@<nguồn>/x': file ở artifact đồng hành; khi nguồn chưa có url, bản xem trước đặt nó tại
    # mau/<bid>/<fallback_base>x (đúng như T0.asset giải), và trong artifact cũ nó nằm ở x.
    srcs = book.get('asset_sources') or {}
    ref = {}
    for p in paths if url else []:
        m = re.match(r'^@([^/]+)/(.*)$', p)
        if m:
            s = srcs.get(m.group(1)) or {}
            if s.get('url'):
                continue
            ref['mau/' + bid + '/' + (s.get('fallback_base') or '') + m.group(2)] = {'artifact': url, 'path': m.group(2)}
        else:
            ref['mau/' + bid + '/' + p] = {'artifact': url, 'path': p}
    write(os.path.join(dist, 'files.json'), json.dumps({
        'page': 'index.html', 'book': bid, 'old_artifact': url,
        'note': 'files = map cho tham số files của Artifact publish (chép server-side từ artifact cũ). '
                'asset_sources (@nguồn/…) chưa có url thì publish riêng. local_samples = file có trong dist để chụp thử.',
        'files': ref, 'local_samples': local}, ensure_ascii=False, indent=1))
    kb = os.path.getsize(os.path.join(dist, 'index.html')) / 1024
    print(f'{rel(dist)}/index.html {kb:.0f} KB; {len(scripts)} script; {len(local)} file mẫu; {len(ref)} file tham chiếu')
    return dist


def gen_generated():
    """Sinh lại file JS lấy từ tài sản thư viện trước khi gộp (E/006: screen_demo_presets.js <- presets/screen_demo.json)."""
    import subprocess
    tool = os.path.join(HERE, '_cong-cu', 'sinh-preset.py')
    if os.path.exists(tool) and os.path.exists(os.path.join(T0, 'thu-vien', 'mo-phong', 'presets', 'screen_demo.json')):
        r = subprocess.run([sys.executable, '-I', tool, '--tu-preset'], capture_output=True, text=True)
        if r.returncode:
            print('LỖI sinh-preset.py:', r.stderr.strip()[-400:], file=sys.stderr); sys.exit(1)
        print('  sinh lại components/sim/screen_demo_presets.js từ presets/screen_demo.json')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--book', help='tên cuốn trong $R/books (hoặc all)')
    ap.add_argument('--out', help='thư mục ra (chỉ khi một cuốn)')
    ap.add_argument('--no-patch', action='store_true')
    a = ap.parse_args()
    gen_generated()
    scripts = list_scripts()
    if not a.book:
        scripts = build_samples(a.no_patch)
        for s in scripts:
            print('  +', rel(s))
        return
    books = ALL_BOOKS if a.book == 'all' else a.book.split(',')
    for c in books:
        if not os.path.exists(os.path.join(R, 'books', c, 'book.json')):
            print('không có', c, file=sys.stderr); sys.exit(1)
        build_book(c, scripts, a.out if len(books) == 1 else None)


if __name__ == '__main__':
    main()
