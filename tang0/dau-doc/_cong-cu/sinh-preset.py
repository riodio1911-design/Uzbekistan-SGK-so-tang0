#!/usr/bin/env python3
"""Sinh preset sim.screen_demo (agent E, đề xuất 006; D3: mẫu stage là preset của thư viện mô phỏng).
Nguồn: books/informatika5/tu-che/demo-stg.json (TC01, window.DEMO_STG cũ).
Ra:  tang0/thu-vien/mo-phong/presets/screen_demo.json  (tài sản thư viện, nhãn i18n)
     tang0/dau-doc/components/sim/screen_demo_presets.js (bản nạp cho đầu đọc)
Chạy lại: python3 -I sinh-preset.py   (khi sửa JSON preset trực tiếp: python3 -I sinh-preset.py --tu-preset)"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(HERE, '../../..'))  # dau-doc/_cong-cu -> scratchpad (D chuyển từ _thu/E, 20/11; build.py gọi --tu-preset)
SRC = os.path.join(R, 'books/informatika5/tu-che/demo-stg.json')
OUT_JSON = os.path.join(R, 'tang0/thu-vien/mo-phong/presets/screen_demo.json')
OUT_JS = os.path.join(R, 'tang0/dau-doc/components/sim/screen_demo_presets.js')

# Nhãn có chữ Uzbek -> i18n. Nhãn giao diện phần mềm tiếng Anh (File, Save…) và tên tệp giữ nguyên chuỗi.
TR = {
    'Kompyuter': ('Kompyuter', 'Компьютер', 'Máy tính'),
    'Hujjatlar': ('Hujjatlar', 'Документы', 'Tài liệu'),
    '📁 Hujjatlar': ('📁 Hujjatlar', '📁 Документы', '📁 Tài liệu'),
    'Brauzer': ('Brauzer', 'Браузер', 'Trình duyệt'),
    'Pochta': ('Pochta', 'Почта', 'Thư điện tử'),
    'Rasmlar': ('Rasmlar', 'Рисунки', 'Hình ảnh'),
    '⏻ O‘chirish': ('⏻ O‘chirish', '⏻ Выключение', '⏻ Tắt máy'),
    'Hujjat1 – Word': ('Hujjat1 – Word', 'Документ1 – Word', 'Tài liệu1 – Word'),
    'Rasm – Paint': ('Rasm – Paint', 'Рисунок – Paint', 'Hình – Paint'),
    'Kitob1 – Excel': ('Kitob1 – Excel', 'Книга1 – Excel', 'Sổ1 – Excel'),
    'Fill (rang)': ('Fill (rang)', 'Fill (заливка)', 'Fill (tô màu)'),
    '📊 Column (ustunli)': ('📊 Column (ustunli)', '📊 Column (гистограмма)', '📊 Column (cột)'),
    '◔ Pie (doiraviy)': ('◔ Pie (doiraviy)', '◔ Pie (круговая)', '◔ Pie (tròn)'),
    '📈 Line (chiziqli)': ('📈 Line (chiziqli)', '📈 Line (линейная)', '📈 Line (đường)'),
    'Yangi sahifa': ('Yangi sahifa', 'Новая вкладка', 'Thẻ mới'),
    'Qidiruv': ('Qidiruv', 'Поиск', 'Tìm kiếm'),
    '📁 Maktab': ('📁 Maktab', '📁 Школа', '📁 Trường học'),
    'Chap tugma': ('Chap tugma', 'Левая кнопка', 'Nút trái'),
    'O‘ng tugma': ('O‘ng tugma', 'Правая кнопка', 'Nút phải'),
}


def i18n(x):
    if isinstance(x, str) and x in TR:
        uz, ru, vi = TR[x]
        return {'uz': uz, 'ru': ru, 'vi': vi}
    return x


def main():
    if '--tu-preset' in sys.argv:
        pre = json.load(open(OUT_JSON, encoding='utf-8'))
    else:
        src = json.load(open(SRC, encoding='utf-8'))
        stages = {}
        for name, st in src['stages'].items():
            els = []
            for e in st['els']:
                e = dict(e)
                for f in ('l', 'ph'):
                    if f in e:
                        e[f] = i18n(e[f])
                els.append(e)
            stages[name] = {k: v for k, v in st.items() if k != 'els'} | {'els': els}
        pre = {
            'kind': 'sim.screen_demo',
            'version': '0.10',
            'note': 'Preset mẫu màn hình 16:10 (toạ độ %). Phần tử {id,k,x,y,w,h,l,g,c,col,ph}; '
                    'k ∈ win tab btn ico txt inp menu mi dlg cell hd area key lbl. l/ph: chuỗi hoặc {uz,ru,vi}. '
                    'Trong book: params.stage = tên preset; params.stage_def = mẫu riêng của cuốn (cùng dạng) – tùy chọn.',
            'source': 'books/informatika5/tu-che/demo-stg.json (TC01, window.DEMO_STG)',
            'stages': stages,
        }
        os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
        with open(OUT_JSON, 'w', encoding='utf-8') as f:
            json.dump(pre, f, ensure_ascii=False, indent=1)
    js = ('/* SINH TỰ ĐỘNG bởi dau-doc/_thu/E/sinh-preset.py từ thu-vien/mo-phong/presets/screen_demo.json – đừng sửa tay. */\n'
          'window.T0_SIM_PRESETS = window.T0_SIM_PRESETS || {};\n'
          'window.T0_SIM_PRESETS["sim.screen_demo"] = '
          + json.dumps(pre['stages'], ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n')
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)
    n = sum(len(s['els']) for s in pre['stages'].values())
    print('preset:', len(pre['stages']), 'mẫu,', n, 'phần tử ->', OUT_JSON, OUT_JS)


main()
