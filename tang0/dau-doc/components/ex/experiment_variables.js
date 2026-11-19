/* ex.experiment_variables — chọn yếu tố và xác định biến của thí nghiệm (agent C, đề xuất 003).
 * Dữ liệu (data.* hoặc cấp exercise): factors[] đa ngữ; dependent_options[] (đáp án đúng = chỉ số 0, hiển thị đã xáo);
 *   control_options[] (tùy chọn; danh sách biến giữ nguyên = control_options + factors); labels[4] (nhãn 4 phần, tùy chọn).
 * Đáp án: {factor, indep, dep, ctrl: []}. Chấm consistency_3 (0..3): (1) indep === factor; (2) dep === 0;
 *   (3) ≥ 2 biến giữ nguyên và không gồm yếu tố đã chọn. score = điểm/3. */
(function () {
  const T0 = window.T0;
  const CSS = `.exev-part{margin:0 0 var(--space-3,12px)}.exev-part h4{margin:0 0 6px;font-size:var(--text-ui,15px)}
.exev-res{list-style:none;margin:var(--space-2,8px) 0 0;padding:0;display:grid;gap:4px;font-size:var(--text-sm,13px)}
.exev-res li.ok{color:var(--color-ok)}.exev-res li.bad{color:var(--color-bad)}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exev-css', CSS); const E = U.el;
    const d = Object.assign({}, ex, ex.data || {});
    const factors = d.factors || [];
    const deps = d.dependent_options || [];
    const ctrlOpts = [...(d.control_options || []).map((o, i) => ({ o, key: 'c' + i })), ...factors.map((o, i) => ({ o, key: 'f' + i }))];
    const labels = d.labels || [];
    const depOrder = U.perm(deps.length, d.dependent_shuffle);
    const st = U.store(ctx, ex);
    let v = Object.assign({ factor: null, indep: null, dep: null, ctrl: [] }, st.get({}) || {});
    const part = (k, sk, opts, multi) => {
      const box = E('div', { class: 'exev-part', role: multi ? 'group' : 'radiogroup' });
      const title = T0.t(labels[k]) || U.s(sk);
      box.append(E('h4', { text: title })); box.setAttribute('aria-label', title);
      const chips = E('div', { class: 'exc-chips' });
      box.append(chips); el.append(box);
      return opts.map(([label, val]) => { const b = U.chip(T0.t(label), { role: multi ? 'checkbox' : 'radio', 'aria-checked': 'false', 'data-v': val }); chips.append(b); return b; });
    };
    const bF = part(0, 'exc_factor', factors.map((f, i) => [f, i]));
    const bI = part(1, 'exc_indep', factors.map((f, i) => [f, i]));
    const bD = part(2, 'exc_dep', depOrder.map((i) => [deps[i], i]));
    const bC = part(3, 'exc_ctrl', ctrlOpts.map((c) => [c.o, c.key]), true);
    const res = E('ul', { class: 'exev-res', hidden: true });
    el.append(res);
    bF.forEach((b) => { b.onclick = () => { v.factor = +b.dataset.v; changed(); }; });
    bI.forEach((b) => { b.onclick = () => { v.indep = +b.dataset.v; changed(); }; });
    bD.forEach((b) => { b.onclick = () => { v.dep = +b.dataset.v; changed(); }; });
    bC.forEach((b) => { b.onclick = () => { const k = b.dataset.v; v.ctrl = v.ctrl.includes(k) ? v.ctrl.filter((x) => x !== k) : [...v.ctrl, k]; changed(); }; });
    function changed() { st.set(v); res.hidden = true; paint(); }
    function paint() {
      bF.forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.v === v.factor)));
      bI.forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.v === v.indep)));
      bD.forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.v === v.dep)));
      bC.forEach((b) => b.setAttribute('aria-checked', String(v.ctrl.includes(b.dataset.v))));
    }
    paint();
    function grade() {
      const c1 = v.factor != null && v.indep === v.factor;
      const c2 = v.dep === 0;
      const c3 = v.ctrl.length >= 2 && !(v.factor != null && v.ctrl.includes('f' + v.factor));
      return [c1, c2, c3];
    }
    return {
      check() {
        if (v.factor == null && v.indep == null && v.dep == null && !v.ctrl.length) return { empty: true, feedback: U.s('exc_empty') };
        const g = grade(); const pts = g.filter(Boolean).length;
        res.innerHTML = '';
        ['exc_ev1', 'exc_ev2', 'exc_ev3'].forEach((k, i) => res.append(E('li', { class: g[i] ? 'ok' : 'bad', text: (g[i] ? '✓ ' : '✗ ') + U.s(k) })));
        res.hidden = false;
        return { ok: pts === 3, score: pts / 3, feedback: `${T0.s('score')}: ${pts}/3` };
      },
      reset() { v = { factor: null, indep: null, dep: null, ctrl: [] }; st.set(null); res.hidden = true; paint(); },
      showSolution() {
        const f = v.factor != null ? v.factor : 0;
        v = { factor: f, indep: f, dep: 0, ctrl: ctrlOpts.filter((c) => c.key[0] === 'c').slice(0, 3).map((c) => c.key) };
        paint();
      },
      _set(o) { v = Object.assign(v, o); paint(); },
    };
  }
  T0.registerEx('ex.experiment_variables', { render });
})();
