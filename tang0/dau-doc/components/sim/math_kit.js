/* components/sim/math_kit.js — agent F, đề xuất 005. Bộ dùng chung cho 7 mô phỏng Toán (place_value, decimal_shift,
 * fraction_model, fraction_area, triangle_area, cuboid_volume, ratio_bars). Các file kind đọc T0.mathKit LÚC MOUNT
 * (không lúc nạp) nên thứ tự nạp file không quan trọng.
 * Chuỗi giao diện đa ngữ (thay chữ Uzbek viết cứng của mã cũ: PVN, "Raqamlar chapga", "Surat/Maxraj", "Bir qavatda … kub"):
 * T0.mathKit.UI – cũng là bản nguồn để A chép vào ui_strings của thư viện mô phỏng (xem YEU-CAU.md).
 * Phân số: dùng T0.text.frac(n, d) nếu agent B đã có (đề xuất 012), không thì phân số chồng HTML tại đây.
 */
(function () {
  const T0 = window.T0;
  const UI = {
    places: {
      uz: ['O‘n mln', 'Mln', 'Yuz ming', 'O‘n ming', 'Ming', 'Yuz', 'O‘n', 'Bir', '0,1', '0,01', '0,001'],
      ru: ['Дес. млн', 'Млн', 'Сот. тыс.', 'Дес. тыс.', 'Тыс.', 'Сотни', 'Десятки', 'Единицы', '0,1', '0,01', '0,001'],
      vi: ['Chục triệu', 'Triệu', 'Trăm nghìn', 'Chục nghìn', 'Nghìn', 'Trăm', 'Chục', 'Đơn vị', '0,1', '0,01', '0,001'],
    },
    number: { uz: 'Son', ru: 'Число', vi: 'Số' },
    operation: { uz: 'Amal', ru: 'Действие', vi: 'Phép tính' },
    by: { uz: 'Nechaga', ru: 'На сколько', vi: 'Với' },
    shift_left: { uz: 'Raqamlar chapga {n} xona suriladi', ru: 'Цифры сдвигаются влево на {n} разр.', vi: 'Các chữ số dịch sang trái {n} hàng' },
    shift_right: { uz: 'Raqamlar o‘ngga {n} xona suriladi', ru: 'Цифры сдвигаются вправо на {n} разр.', vi: 'Các chữ số dịch sang phải {n} hàng' },
    numerator: { uz: 'Surat', ru: 'Числитель', vi: 'Tử số' },
    denominator: { uz: 'Maxraj', ru: 'Знаменатель', vi: 'Mẫu số' },
    shape: { uz: 'Shakl', ru: 'Фигура', vi: 'Hình' },
    circle: { uz: 'Doira', ru: 'Круг', vi: 'Hình tròn' },
    bar: { uz: 'Chiziq', ru: 'Полоса', vi: 'Băng' },
    first: { uz: '1-kasr', ru: '1-я дробь', vi: 'Phân số 1' },
    second: { uz: '2-kasr', ru: '2-я дробь', vi: 'Phân số 2' },
    area_note: { uz: '{t} ta teng bo‘lakdan {k} tasi ikki marta bo‘yalgan', ru: 'Из {t} равных частей {k} закрашены дважды', vi: 'Trong {t} ô bằng nhau có {k} ô được tô hai lần' },
    base: { uz: 'Asos a', ru: 'Основание a', vi: 'Đáy a' },
    height_h: { uz: 'Balandlik h', ru: 'Высота h', vi: 'Chiều cao h' },
    apex: { uz: 'Uch', ru: 'Вершина', vi: 'Đỉnh' },
    show_height: { uz: 'Balandlik', ru: 'Высота', vi: 'Đường cao' },
    show_rect: { uz: 'To‘rtburchak', ru: 'Прямоугольник', vi: 'Hình chữ nhật' },
    rect_note: { uz: 'To‘rtburchak yuzi {r}; uchburchak – asos × balandlikning yarmi', ru: 'Площадь прямоугольника {r}; треугольник – половина основания × высоту', vi: 'Diện tích hình chữ nhật {r}; tam giác bằng nửa đáy × chiều cao' },
    rect_base: { uz: 'asos bo‘yicha: {r}', ru: 'по основанию: {r}', vi: 'theo đáy: {r}' },
    length: { uz: 'Uzunlik', ru: 'Длина', vi: 'Chiều dài' },
    width: { uz: 'Eni', ru: 'Ширина', vi: 'Chiều rộng' },
    height: { uz: 'Balandlik', ru: 'Высота', vi: 'Chiều cao' },
    layers: { uz: 'Bir qavatda {a} ta kub, {h} qavat', ru: 'В одном слое {a} куб., слоёв: {h}', vi: 'Mỗi lớp {a} hình lập phương, {h} lớp' },
    unit: { uz: '1 qism =', ru: '1 часть =', vi: '1 phần =' },
    total: { uz: 'Jami {t} ta teng qism', ru: 'Всего равных частей: {t}', vi: 'Tổng cộng {t} phần bằng nhau' },
    replay: { uz: 'Qayta ko‘rsatish', ru: 'Показать снова', vi: 'Xem lại' },
  };
  const C = { a: '#FFB74D', b: '#64B5F6', c: '#81C784', dark: '#12352B' };
  const CSS = `
.t0m{display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;color:inherit;min-width:0}
.t0m-fig{max-width:100%;overflow-x:auto;display:flex;justify-content:center;width:100%}
.t0m-fig svg{max-width:100%;height:auto;flex:none}
.t0m-big{font-size:clamp(17px,4.6vw,21px);font-weight:700;text-align:center;line-height:1.5}
.t0m-note{font-size:var(--text-sm,14px);text-align:center;opacity:.9}
.t0m-pvt{border-collapse:collapse;margin:0 auto;font-variant-numeric:tabular-nums}
.t0m-pvt th{font-size:11px;font-weight:600;padding:2px 3px;opacity:.85;border-bottom:1px solid currentColor;max-width:58px;line-height:1.15;vertical-align:bottom}
.t0m-pvt td{font-size:clamp(18px,5vw,24px);font-weight:700;text-align:center;padding:4px 3px;min-width:26px;border-left:1px dashed rgba(127,127,127,.5)}
.t0m-pvt td .d{display:inline-block;transition:transform .9s ease}
.t0m-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:center}
.t0m-cell{display:flex;flex-direction:column;align-items:center;gap:6px}
.t0m-sign{font-size:26px;font-weight:700}
.t0m-ctl{display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center;width:100%;padding-top:6px;border-top:1px solid var(--color-line)}
.t0m-ctl label{display:flex;align-items:center;gap:6px;min-height:var(--touch-min,44px);font-size:var(--text-sm,14px);flex:1 1 140px;max-width:260px}
.t0m-ctl input[type=range]{flex:1;min-width:80px;height:var(--touch-min,44px);accent-color:var(--color-accent)}
.t0m-ctl input[type=number]{width:120px;min-height:var(--touch-min,44px);font:inherit;border:1px solid var(--color-line);border-radius:var(--radius-sm,8px);background:var(--color-surface);color:var(--color-ink);padding:0 8px}
.t0m-ctl output{min-width:2.2em;font-weight:700;text-align:right}
.t0m-seg{display:inline-flex;gap:4px;flex-wrap:wrap}
.t0m-seg button{min-width:var(--touch-min,44px);min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);background:var(--color-surface);color:var(--color-ink);font:inherit;cursor:pointer;padding:0 12px}
.t0m-seg button[aria-pressed=true]{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.t0m-fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.05;margin:0 .1em;font-size:.95em}
.t0m-fr>span:first-child{border-bottom:2px solid currentColor;padding:0 .15em}
.t0m-bars{display:flex;flex-direction:column;gap:9px;align-items:flex-start;max-width:100%}
.t0m-bars .lb{font-size:14px;font-weight:700;opacity:.9}
.t0m-bars .bx{display:flex;flex-wrap:wrap}
.t0m-bars .bx span{height:30px;border:1.5px solid currentColor;display:grid;place-items:center;color:${C.dark};font-weight:800;margin-left:-1.5px}`;
  function css() { if (!document.getElementById('t0m-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0m-css', textContent: CSS })); }
  const t = (k, vars) => { let s = T0.t(UI[k]) || ''; if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]); return s; };
  const places = () => UI.places[T0.lang] || UI.places.uz;
  function fmt(n) {
    if (!isFinite(n)) return '—';
    const neg = n < 0; n = Math.abs(n);
    const [i, f] = String(+n.toFixed(6)).split('.');
    const sep = T0.lang === 'vi' ? '.' : ' ';
    return (neg ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) + (f ? ',' + f : '');
  }
  function frac(n, d) {
    if (T0.text && typeof T0.text.frac === 'function') { try { const e = T0.text.frac(n, d); if (e && e.nodeType) return e; } catch (e) {} }
    const s = document.createElement('span'); s.className = 't0m-fr'; s.setAttribute('role', 'math'); s.setAttribute('aria-label', n + '/' + d);
    const a = document.createElement('span'); a.textContent = n; const b = document.createElement('span'); b.textContent = d; s.append(a, b); return s;
  }
  // nhãn phân số kèm hỗn số: 5/4 = 1 1/4 ; 6/2 = 3
  function fracLabel(f) {
    const E = T0.ui.el, w = Math.floor(f.n / f.d), r = f.n % f.d;
    const box = E('div', { class: 't0m-big' }, frac(f.n, f.d));
    if (f.n > f.d && r) box.append(' = ' + w, frac(r, f.d)); else if (w && f.n === f.d * w && f.d !== 1) box.append(' = ' + w);
    return box;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function svg(w, h, inner, label) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('width', w); s.setAttribute('height', h);
    s.setAttribute('role', 'img'); if (label) s.setAttribute('aria-label', label);
    s.innerHTML = inner; return s;
  }
  // điều khiển
  function range(label, value, min, max, step, onInput) {
    const E = T0.ui.el;
    const out = E('output', { text: String(value) });
    const inp = E('input', { type: 'range', min, max, step: step || 1, value, 'aria-label': label });
    inp.addEventListener('input', () => { out.textContent = inp.value; onInput(+inp.value); });
    return E('label', null, E('span', { text: label }), inp, out);
  }
  function number(label, value, attrs, onInput) {
    const E = T0.ui.el;
    const inp = E('input', Object.assign({ type: 'number', value, 'aria-label': label, inputmode: 'decimal' }, attrs || {}));
    inp.addEventListener('input', () => { const v = parseFloat(String(inp.value).replace(',', '.')); if (isFinite(v)) onInput(v); });
    return E('label', null, E('span', { text: label }), inp);
  }
  function seg(label, options, value, onPick) {
    const E = T0.ui.el;
    const box = E('span', { class: 't0m-seg', role: 'group', 'aria-label': label });
    options.forEach(([v, txt, aria]) => {
      const b = E('button', { type: 'button', 'aria-pressed': String(v === value), 'aria-label': aria || null }, txt);
      b.onclick = () => { box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); onPick(v); };
      box.append(b);
    });
    return box;
  }
  // khung chung: vẽ lại khi đổi ngôn ngữ; interactive → thêm vùng điều khiển
  function shell(el, opts) {
    css();
    const E = T0.ui.el;
    const root = E('div', { class: 't0m', 'data-sim': opts.kind });
    const view = E('div', { class: 't0m', style: { gap: '8px' } });
    root.append(view);
    let ctl = null;
    const draw = () => { view.innerHTML = ''; opts.draw(view); };
    const build = () => {
      if (ctl) ctl.remove();
      if (opts.controls) { ctl = E('div', { class: 't0m-ctl' }); opts.controls(ctl, draw); root.append(ctl); }
      draw();
    };
    el.append(root);
    build();
    const off = T0.on('t0:lang', build);
    return { unmount() { off(); opts.cleanup && opts.cleanup(); root.remove(); }, redraw: draw, root };
  }
  const interactive = (p, ctx) => p.mode === 'interactive' || !!(ctx && ctx.interactive);
  const clone = (o) => JSON.parse(JSON.stringify(o || {}));
  T0.mathKit = { UI, C, t, places, fmt, frac, fracLabel, svg, range, number, seg, shell, interactive, clone, css };
})();
