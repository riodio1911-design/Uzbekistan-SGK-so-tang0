/* sim.predict_check — agent F (007, biologiya5 redi3). params {image?, question, options[], option_values[], items[{n, a}], explanation}.
 * Dự đoán cho từng mục bằng nút phương án → "Tekshirish" chấm từng mục (đúng/sai) và hiện giải thích. Trả về {check(), reset()} như bài tập;
 * kết quả gửi ctx.onResult({ok, score}) nếu có. */
(function () {
  const T0 = window.T0;
  const CSS = `
.t0pc{display:flex;flex-direction:column;gap:10px}
.t0pc img{max-width:100%;border-radius:var(--radius-md,10px);align-self:center;max-height:320px;object-fit:contain}
.t0pc-q{font-weight:700;margin:0}
.t0pc-it{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:8px 10px;border:1px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface)}
.t0pc-it>span{flex:1 1 160px;min-width:0}
.t0pc-it.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}.t0pc-it.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.t0pc-it .mk{font-weight:800;min-width:1.2em}
.t0pc-fb{margin:0;padding:8px 10px;border-radius:var(--radius-sm,8px);background:var(--color-surface-2)}
.t0pc-row{display:flex;gap:8px;flex-wrap:wrap}`;
  const UI = { pick: { uz: 'Har biri uchun bashoratingizni tanlang', ru: 'Выберите прогноз для каждого пункта', vi: 'Chọn dự đoán cho từng mục' } };
  T0.registerSim('sim.predict_check', {
    mount(el, P, ctx) {
      if (!document.getElementById('t0pc-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0pc-css', textContent: CSS }));
      const E = T0.ui.el, t = T0.t;
      const items = P.items || [], opts = P.options || [], vals = P.option_values || opts.map((_, i) => i);
      const st = { ans: items.map(() => null), checked: false };
      const root = E('div', { class: 't0pc' });
      el.append(root);
      function draw() {
        root.innerHTML = '';
        if (P.image) root.append(E('img', { src: T0.asset(P.image), alt: '', loading: 'lazy' }));
        if (P.question) root.append(E('p', { class: 't0pc-q', text: t(P.question) }));
        root.append(E('small', { text: t(UI.pick) }));
        items.forEach((it, i) => {
          const ok = st.ans[i] === it.a;
          const row = E('div', { class: 't0pc-it' + (st.checked && st.ans[i] != null ? (ok ? ' ok' : ' bad') : ''), role: 'group', 'aria-label': t(it.n) });
          row.append(E('span', { text: t(it.n) }));
          const seg = E('span', { class: 't0m-seg t0pc-row' });
          opts.forEach((o, j) => {
            const b = E('button', { class: 't0-btn' + (st.ans[i] === vals[j] ? ' primary' : ''), type: 'button', 'aria-pressed': String(st.ans[i] === vals[j]) }, t(o));
            b.onclick = () => { st.ans[i] = vals[j]; st.checked = false; draw(); };
            seg.append(b);
          });
          row.append(seg);
          if (st.checked && st.ans[i] != null) row.append(E('span', { class: 'mk', 'aria-label': ok ? '✓' : '✗', text: ok ? '✓' : '✗' }));
          root.append(row);
        });
        const chk = E('button', { class: 't0-btn primary', type: 'button', disabled: st.ans.some((a) => a == null) }, T0.s('check'));
        chk.onclick = () => api.check();
        const rst = E('button', { class: 't0-btn', type: 'button' }, T0.s('reset'));
        rst.onclick = () => api.reset();
        root.append(E('div', { class: 't0pc-row' }, chk, rst));
        if (st.checked) {
          const n = items.filter((it, i) => st.ans[i] === it.a).length;
          root.append(E('p', { class: 't0pc-fb', 'aria-live': 'polite' }, E('b', { text: n + ' / ' + items.length + '. ' }), t(P.explanation) || ''));
        }
      }
      const api = {
        check() { st.checked = true; draw(); const n = items.filter((it, i) => st.ans[i] === it.a).length; const r = { ok: n === items.length, score: items.length ? n / items.length : 0 }; try { ctx && ctx.onResult && ctx.onResult(r); } catch (e) {} return r; },
        reset() { st.ans = items.map(() => null); st.checked = false; draw(); },
        unmount() { off(); root.remove(); },
        state: st,
      };
      draw();
      const off = T0.on('t0:lang', draw);
      return api;
    },
  });
})();
