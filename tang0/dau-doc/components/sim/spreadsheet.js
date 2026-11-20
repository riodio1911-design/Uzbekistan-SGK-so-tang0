/* sim.spreadsheet_mini – bảng tính mini (agent E, đề xuất 006; gốc informatika5 V() k='sheet', openModel sheet, sheetVal).
 *  sim.spreadsheet_mini  params: {rows: [['','A','B'],['1',…],…], formula?: '=SUM(B2:B5)', hi?: 'B3', interactive?: bool}
 *     – cảnh: bảng chỉ đọc, ô hi tô nổi; có formula thì ô hi hiện kết quả tính.
 *     – tương tác (interactive): sửa ô và công thức, ô hi tính lại ngay.
 *  ex.spreadsheet do agent C làm (components/ex/spreadsheet.js) – file này KHÔNG đăng ký ex.* để không đè.
 *  Bộ tính: T0.sheet.eval(rows, formula) trong components/ex/_chung.js – MỘT bản dùng chung với ex.spreadsheet (C gộp 20/11),
 *  không dùng eval/Function: + − × ÷ ( ), số, ô A1, ô công thức đệ quy, SUM/AVERAGE/MAX/MIN/COUNT(A1:B3), ';' = ','. */
(function () {
  const T0 = window.T0;
  const CSS = `
.ss{display:flex;flex-direction:column;gap:var(--space-2,8px);max-width:100%}
.ss-fx{display:flex;align-items:center;gap:var(--space-2,8px);border:1px solid var(--color-line);border-radius:var(--radius-sm,6px);padding:0 var(--space-2,8px);background:var(--color-surface);min-height:var(--touch-min,44px);font-family:var(--font-mono)}
.ss-fx i{color:var(--color-ink-2);font-style:italic;font-weight:700}
.ss-fx input{flex:1;min-width:0;border:0;background:transparent;color:var(--color-ink);font:inherit;min-height:var(--touch-min,44px)}
.ss-wrap{overflow-x:auto;max-width:100%}
.ss-t{border-collapse:collapse;font-size:var(--text-ui,15px);background:var(--color-surface);color:var(--color-ink);min-width:100%}
.ss-t td{border:1px solid var(--color-line);padding:0 var(--space-2,8px);height:var(--touch-min,44px);min-width:56px;white-space:nowrap}
.ss-t tr:first-child td,.ss-t td:first-child{background:var(--color-surface-2);color:var(--color-ink-2);font-weight:700;text-align:center;min-width:36px}
.ss-t td.hi{outline:3px solid var(--color-accent);outline-offset:-3px;background:var(--color-accent-soft);font-weight:800}
.ss-t input{width:100%;min-width:56px;min-height:40px;border:0;background:transparent;color:inherit;font:inherit}
.ss-t td.num,.ss-t td.num input{text-align:right;font-variant-numeric:tabular-nums}
.ss-hint{font-size:var(--text-sm,14px);color:var(--color-ink-2);margin:0}
.sp-stage .ss-t{color:#14212C;background:#fff}.sp-stage .ss-fx{background:#fff;color:#14212C}.sp-stage .ss-fx input{color:#14212C}`;
  function css() { if (!document.getElementById('ss-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'ss-css', textContent: CSS })); }
  const Lb = { hint: { uz: 'Katakdagi sonni yoki formulani o‘zgartiring – natija qayta hisoblanadi.', ru: 'Измените число в ячейке или формулу – результат пересчитается.', vi: 'Sửa số trong ô hoặc công thức – kết quả tự tính lại.' }, formula: { uz: 'Formula', ru: 'Формула', vi: 'Công thức' } };

  /* ---------- bộ tính: dùng bộ chung T0.sheet (components/ex/_chung.js, agent C gộp 20/11) ---------- */
  // T0.sheet.eval(rows, formula) -> chuỗi; '#NAME?' cho hàm/ký tự lạ, '#ERR' cho chia 0. Tra lúc chạy nên thứ tự nạp không quan trọng.
  const evaluate = (rows, f) => (T0.sheet && T0.sheet.eval ? T0.sheet.eval(rows, f) : '#ERR');

  /* ---------- bảng ---------- */
  function table(host, cfg) {
    css();
    const E = T0.ui.el;
    const rows = JSON.parse(JSON.stringify(cfg.rows || [['', 'A']]));
    let f = cfg.formula || '';
    const hi = cfg.hi || '';
    const root = E('div', { class: 'ss' });
    host.append(root);
    const hd = rows[0];
    let fxIn = null;
    const isNum = (v) => /^-?\d+([.,]\d+)?$/.test(String(v).trim());
    function draw() {
      root.innerHTML = '';
      if (f || cfg.edit) {
        const fx = E('label', { class: 'ss-fx' }, E('i', { text: 'fx' }));
        if (cfg.edit) { fxIn = E('input', { value: f, 'aria-label': T0.t(Lb.formula), spellcheck: 'false', autocomplete: 'off' }); fxIn.onchange = () => { f = fxIn.value.trim(); if (f && f[0] !== '=') f = '=' + f; draw(); cfg.onChange && cfg.onChange(); }; fx.append(fxIn); }
        else fx.append(E('span', { text: f }));
        root.append(fx);
      }
      const t = E('table', { class: 'ss-t' });
      rows.forEach((r, i) => {
        const tr = E('tr');
        r.forEach((c, j) => {
          const ref = i && j ? hd[j] + r[0] : '';
          const td = E('td');
          const val = ref && ref === hi && f ? evaluate(rows, f) : c;
          if (ref === hi && hi) td.classList.add('hi');
          if (ref && isNum(val)) td.classList.add('num');
          if (cfg.edit && ref && !(ref === hi && f)) {
            const inp = E('input', { value: c, 'aria-label': ref, inputmode: isNum(c) || c === '' ? 'decimal' : 'text' });
            inp.onchange = () => { rows[i][j] = inp.value; draw(); cfg.onChange && cfg.onChange(); };
            td.append(inp);
          } else td.textContent = val;
          if (ref === hi && hi) td.setAttribute('aria-live', 'polite');
          tr.append(td);
        });
        t.append(tr);
      });
      root.append(E('div', { class: 'ss-wrap' }, t));
      if (cfg.edit) root.append(E('p', { class: 'ss-hint', text: T0.t(Lb.hint) }));
    }
    draw();
    const off = T0.on('t0:lang', draw);
    return { root, value: () => (hi && f ? evaluate(rows, f) : ''), state: () => ({ rows, formula: f }), unmount() { off(); root.remove(); } };
  }

  T0.registerSim('sim.spreadsheet_mini', {
    mount(el, params) {
      const p = params || {};
      return table(el, { rows: p.rows, formula: p.formula, hi: p.hi || p.highlight, edit: !!p.interactive });
    },
  });

})();
