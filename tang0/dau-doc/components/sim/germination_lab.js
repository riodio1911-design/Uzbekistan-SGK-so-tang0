/* sim.germination_lab — agent F (đề xuất 007).
 * - variant "workbook_two_cups" (tabiiy5 wb1.sim): renderer gốc, mọi số liệu lấy từ params
 *   {days, conditions[f][2], result_table[f][2], predictions[4], text[13], factor?} – không còn RES viết cứng.
 *   Yếu tố (factor) mặc định lấy từ đáp án bài params.factor_from (T0.store 'ex:<id>' → .factor) nếu có, không thì cho chọn ngay trong mô phỏng.
 * - bản khác (ACT.lab13 …) có params.code_ref → nhúng mã cũ tạm (T0.legacy, cờ ma_cu_nhung_tam).
 */
(function () {
  const T0 = window.T0;
  const CSS = `
.t0gl{display:flex;flex-direction:column;gap:10px}
.t0gl-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.t0gl select{min-height:var(--touch-min,44px);font:inherit;border:1px solid var(--color-line);border-radius:var(--radius-sm,8px);background:var(--color-surface);color:var(--color-ink);padding:0 8px;max-width:100%}
.t0gl-cups{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.t0gl-cup{border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:8px;text-align:center;background:var(--color-surface-2)}
.t0gl-cup b{display:block;font-size:var(--text-sm,14px);margin-bottom:4px}
.t0gl-cup svg{width:100%;max-width:160px;height:auto}
.t0gl table{border-collapse:collapse;width:100%;font-size:var(--text-sm,14px)}
.t0gl td,.t0gl th{border:1px solid var(--color-line);padding:4px 6px;text-align:left}
.t0gl-fb{padding:8px 10px;border-radius:var(--radius-sm,8px)}
.t0gl-fb.ok{background:var(--color-ok-soft);color:var(--color-ink)}.t0gl-fb.bad{background:var(--color-bad-soft);color:var(--color-ink)}`;
  function css() { if (!document.getElementById('t0gl-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0gl-css', textContent: CSS })); }
  // mầm cây đơn giản (thay window.__plant của mã cũ)
  function sprout(x, y, s) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C0 -14 0 -26 0 -34" stroke="#3E9B4F" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M0 -26 C-14 -34 -22 -30 -24 -24 C-16 -20 -8 -20 0 -26Z" fill="#3E9B4F"/><path d="M0 -32 C12 -42 22 -40 24 -34 C16 -28 8 -28 0 -32Z" fill="#2F7D3E"/></g>`;
  }

  function workbook(el, P, ctx) {
    css();
    const E = T0.ui.el, t = (o) => T0.t(o);
    const X = P.text || [];
    const tx = (i, fb) => (X[i] ? t(X[i]) : fb);
    const conds = P.conditions || [], RES = P.result_table || [], PRED = P.predictions || [], DAYS = P.days || 7;
    const factors = [X[1], X[2], X[3]];
    const fromEx = (() => { try { const v = P.factor_from && T0.store.get('ex:' + P.factor_from); const f = v && (v.factor != null ? v.factor : v.value && v.value.factor); return f === '' || f == null ? null : +f; } catch (e) { return null; } })();
    const st = { f: P.factor != null ? +P.factor : fromEx != null ? fromEx : 0, pred: '', day: 0, timer: 0 };
    const root = E('div', { class: 't0gl' });
    el.append(root);
    const truth = () => { const r = RES[st.f] || [0, 0]; return r[0] && r[1] ? 0 : r[0] ? 1 : r[1] ? 2 : 3; };
    function cup(k) {
      const f = st.f, grow = st.day >= DAYS && (RES[f] || [])[k];
      let s = `<svg viewBox="0 0 140 110" aria-hidden="true"><path d="M35 30 L105 30 L98 104 L42 104Z" fill="#E3F4FB" stroke="#9CC9E8" stroke-width="3"/><rect x="40" y="62" width="60" height="40" fill="${f === 2 && k ? '#E8D5A3' : '#6B4A2E'}"/>`;
      [55, 85].forEach((x) => { s += grow ? sprout(x, 64, 0.9) : `<ellipse cx="${x}" cy="60" rx="6" ry="4" fill="#5D7B2E"/>`; });
      if (f === 1 && k) s += '<rect x="0" y="0" width="140" height="110" fill="#000" opacity=".35"/>';
      return s + '</svg>';
    }
    function draw() {
      root.innerHTML = '';
      const fsel = E('select', { 'aria-label': tx(0, 'Omil') });
      factors.forEach((o, j) => fsel.append(new Option(o ? t(o) : String(j + 1), String(j))));
      fsel.value = String(st.f);
      fsel.onchange = () => { st.f = +fsel.value; st.day = 0; clearInterval(st.timer); draw(); };
      root.append(E('div', { class: 't0gl-row' }, E('b', { text: tx(0, 'Omil') + ':' }), fsel, fromEx != null ? E('small', { text: '(' + tx(4, '') + ')' }) : null));
      const psel = E('select', { 'aria-label': tx(5, 'Bashorat') });
      psel.append(new Option('—', ''));
      PRED.forEach((o, j) => psel.append(new Option(t(o), String(j))));
      psel.value = st.pred;
      psel.onchange = () => { st.pred = psel.value; st.day = 0; clearInterval(st.timer); draw(); };
      root.append(E('label', { class: 't0gl-row' }, E('b', { text: tx(5, 'Bashorat') + ':' }), psel));
      const cups = E('div', { class: 't0gl-cups' });
      [0, 1].forEach((k) => cups.append(E('div', { class: 't0gl-cup' }, E('b', { text: (k + 1) + ' · ' + t((conds[st.f] || [])[k]) }), E('div', { html: cup(k) }))));
      root.append(cups);
      const run = T0.ui.el('button', { class: 't0-btn primary', type: 'button', disabled: st.pred === '' }, tx(6, '▶'));
      run.onclick = () => { clearInterval(st.timer); st.day = 0; st.timer = setInterval(() => { st.day++; draw(); if (st.day >= DAYS) { clearInterval(st.timer); report(); } }, 250); };
      root.append(E('div', { class: 't0gl-row' }, run, E('span', { 'aria-live': 'polite', text: tx(7, 'Kun') + ': ' + st.day + '/' + DAYS })));
      if (st.day >= DAYS) {
        const tb = E('table', null, E('tr', null, E('th', { text: '' }), E('th', { text: tx(8, '') }), E('th', { text: tx(9, '') })));
        [0, 1].forEach((k) => tb.append(E('tr', null, E('td', { text: String(k + 1) }), E('td', { text: t((conds[st.f] || [])[k]) }), E('td', { text: ((RES[st.f] || [])[k] || 0) + '/2' }))));
        root.append(tb);
        const ok = +st.pred === truth();
        root.append(E('p', { class: 't0gl-fb ' + (ok ? 'ok' : 'bad'), 'aria-live': 'polite', text: (ok ? tx(10, '✓') : tx(11, '✗')) + (st.f === 1 && X[12] ? ' ' + t(X[12]) : '') }));
      }
    }
    function report() { try { ctx && ctx.onResult && ctx.onResult({ factor: st.f, prediction: +st.pred, ok: +st.pred === truth() }); } catch (e) {} }
    draw();
    const off = T0.on('t0:lang', draw);
    return { unmount() { clearInterval(st.timer); off(); root.remove(); }, state: st };
  }

  T0.registerSim('sim.germination_lab', {
    mount(el, params, ctx) {
      params = params || {};
      if (params.variant === 'workbook_two_cups' || (params.conditions && params.result_table)) return workbook(el, params, ctx);
      if (T0.legacy && T0.legacy.has(params.code_ref)) return T0.legacy.mount(el, params);
      const box = T0.ui.el('div', { class: 't0-unsupported', 'data-kind': 'sim.germination_lab' }, T0.s('unsupported') + ': ', T0.ui.el('code', { text: 'sim.germination_lab' }));
      el.append(box); return { unmount() { box.remove(); } };
    },
  });
})();
