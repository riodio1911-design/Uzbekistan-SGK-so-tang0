/* sim.fraction_model — agent F (005). params {shape:'circle'|'bar', items:[{n,d}], sep?:'+'|'='|'×'…, res?:{n,d}, mode?}.
 * Mỗi phân số vẽ thành hình tròn/băng chia d phần (phân số > 1 dùng nhiều hình), kèm nhãn và hỗn số. Nhãn "Surat/Maxraj" đa ngữ. */
(function () {
  const T0 = window.T0;
  function shapeSvg(K, f, col, shape) {
    const wh = Math.max(1, Math.ceil(f.n / f.d)); let s = '', W, H;
    if (shape === 'circle') {
      W = wh * 66; H = 66;
      for (let w = 0; w < wh; w++) {
        const cx = 33 + w * 66;
        for (let i = 0; i < f.d; i++) {
          const a0 = (i / f.d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / f.d) * 2 * Math.PI - Math.PI / 2, on = w * f.d + i < f.n;
          s += f.d === 1 ? `<circle cx="${cx}" cy="33" r="29" fill="${on ? col : 'none'}" stroke="currentColor" stroke-width="1.5"/>`
            : `<path d="M${cx} 33L${(cx + 29 * Math.cos(a0)).toFixed(1)} ${(33 + 29 * Math.sin(a0)).toFixed(1)}A29 29 0 0 1 ${(cx + 29 * Math.cos(a1)).toFixed(1)} ${(33 + 29 * Math.sin(a1)).toFixed(1)}Z" fill="${on ? col : 'none'}" stroke="currentColor" stroke-width="1.5"/>`;
        }
      }
    } else {
      W = 150; H = wh * 30;
      for (let w = 0; w < wh; w++) for (let i = 0; i < f.d; i++) {
        const on = w * f.d + i < f.n;
        s += `<rect x="${(1 + (i * 148) / f.d).toFixed(1)}" y="${1 + w * 30}" width="${(148 / f.d).toFixed(1)}" height="24" fill="${on ? col : 'none'}" stroke="currentColor" stroke-width="1.5"/>`;
      }
    }
    return K.svg(W, H, s, f.n + '/' + f.d);
  }
  T0.registerSim('sim.fraction_model', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el, inter = K.interactive(params, ctx);
      const v = K.clone(params);
      v.items = (v.items && v.items.length ? v.items : [{ n: 1, d: 2 }]).map((f) => ({ n: Math.max(0, +f.n || 0), d: Math.max(1, +f.d || 1) }));
      v.shape = v.shape === 'bar' ? 'bar' : 'circle';
      if (inter) delete v.res; // như mã cũ: mô hình tương tác không giữ kết quả cố định
      const cols = [K.C.a, K.C.b, K.C.c];
      return K.shell(el, {
        kind: 'sim.fraction_model',
        draw(view) {
          const row = E('div', { class: 't0m-row' });
          const cell = (f, i) => E('div', { class: 't0m-cell' }, E('div', { class: 't0m-fig' }, shapeSvg(K, f, cols[i % 3], v.shape)), K.fracLabel(f));
          v.items.forEach((f, i) => { if (i) row.append(E('div', { class: 't0m-sign', text: v.sep || '' })); row.append(cell(f, i)); });
          if (v.res) { row.append(E('div', { class: 't0m-sign', text: '=' })); row.append(cell(v.res, 2)); }
          view.append(row);
        },
        controls: inter ? (c, draw) => {
          v.items.forEach((f, i) => {
            const nm = v.items.length > 1 ? ' ' + (i + 1) : '';
            let nIn;
            const nr = K.range(K.t('numerator') + nm, f.n, 0, Math.min(60, f.d * 4), 1, (x) => { f.n = x; draw(); });
            nIn = nr.querySelector('input');
            c.append(nr, K.range(K.t('denominator') + nm, f.d, 1, 12, 1, (x) => { f.d = x; nIn.max = Math.min(60, x * 4); if (f.n > x * 4) { f.n = x * 4; nIn.value = f.n; nr.querySelector('output').textContent = f.n; } draw(); }));
          });
          c.append(K.seg(K.t('shape'), [['circle', '○', K.t('circle')], ['bar', '▭', K.t('bar')]], v.shape, (s) => { v.shape = s; draw(); }));
        } : null,
      });
    },
  });
})();
