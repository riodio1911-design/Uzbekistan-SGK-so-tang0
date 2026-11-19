/* ex.short_answer – điền đáp án ngắn (R1). Chấm accept_v2 mặc định – D2; exercise.grading.rule = accept_v2_math|nrm_v1 (bí danh) cho đáp án biểu thức (T0.grade.shortAnswer).
 * Dữ liệu: exercise.items[] = {label?, prompt?, answer ('a|b', 'p1;p2'), solution?} hoặc exercise.answer.
 * Ý không có answer thì không tính điểm. */
(function () {
  const T0 = window.T0;
  const CSS = `
.ex-sa-row{display:grid;grid-template-columns:auto 1fr;gap:var(--space-2,8px) var(--space-3,12px);align-items:center;margin-bottom:var(--space-3,12px)}
.ex-sa-row:last-child{margin-bottom:0}
.ex-sa-l{font-weight:700;color:var(--color-ink-2);min-width:2ch}
.ex-sa-p{grid-column:1/-1;margin:0;font-size:var(--text-ui,15px)}
.ex-sa-in{width:100%;min-width:0;min-height:var(--touch-min,44px);border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);padding:0 var(--space-3,12px);font:inherit;font-size:var(--text-body,16px);background:var(--color-surface);color:var(--color-ink)}
.ex-sa-in:focus-visible{outline:3px solid var(--color-accent);outline-offset:1px}
.ex-sa-in.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}
.ex-sa-in.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.ex-sa-row .t0-solution{grid-column:1/-1}`;
  function css() { if (!document.getElementById('ex-sa-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'ex-sa-css', textContent: CSS })); }

  T0.registerEx('ex.short_answer', {
    render(el, ex, ctx) {
      css();
      const E = T0.ui.el;
      const items = Array.isArray(ex.items) && ex.items.length ? ex.items : [ex];
      const saved = (ctx.store && ctx.store.get((ctx.storeKey || 'ex:' + ex.id) + ':v')) || {};
      const rows = items.map((it, i) => {
        const id = 'sa' + Math.random().toString(36).slice(2, 8);
        const row = E('div', { class: 'ex-sa-row' });
        if (it !== ex && it.prompt) row.append(E('p', { class: 'ex-sa-p', text: T0.t(it.prompt) }));
        const lab = E('label', { class: 'ex-sa-l', for: id, text: it.label || (items.length > 1 ? String(i + 1) : '') });
        const inp = E('input', { class: 'ex-sa-in', id, type: 'text', inputmode: /^[\d.,|;\s-]+$/.test(it.answer || '') ? 'decimal' : 'text', autocomplete: 'off', spellcheck: 'false', placeholder: T0.t(it.placeholder) || '' });
        if (!lab.textContent) lab.setAttribute('aria-label', T0.s('exercise'));
        inp.value = saved[i] || '';
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const b = el.closest('.t0-ex') && el.closest('.t0-ex').querySelector('.t0-ex-foot .primary'); b && b.click(); } });
        inp.addEventListener('input', () => inp.classList.remove('ok', 'bad'));
        row.append(lab, inp);
        el.append(row);
        return { it, inp, row, sol: null };
      });
      const key = (ctx.storeKey || 'ex:' + ex.id) + ':v';
      return {
        check() {
          let n = 0, right = 0;
          const vals = {};
          rows.forEach((r, i) => {
            vals[i] = r.inp.value;
            const g = T0.grade.shortAnswer(r.inp.value, r.it.answer, ((r.it.grading || ex.grading) || {}).rule || ((T0.book && T0.book.grading_defaults) || {}).short_answer_rule);
            r.inp.classList.remove('ok', 'bad');
            if (g === null) return;
            n++;
            if (g) right++;
            r.inp.classList.add(g ? 'ok' : 'bad');
          });
          if (ctx.store) ctx.store.set(key, vals);
          if (!n) return { ok: null, score: null };
          return { ok: right === n, score: right / n, feedback: n > 1 ? `${T0.s('score')}: ${right}/${n}` : '' };
        },
        reset() {
          rows.forEach((r) => { r.inp.value = ''; r.inp.classList.remove('ok', 'bad'); if (r.sol) { r.sol.remove(); r.sol = null; } });
          if (ctx.store) ctx.store.remove(key);
        },
        showSolution() {
          rows.forEach((r) => {
            if (r.sol) return;
            const first = String(r.it.answer || '').split('|')[0];
            const txt = [first, T0.t(r.it.solution)].filter(Boolean).join(' — ');
            if (!txt) return;
            r.sol = E('div', { class: 't0-solution', text: txt });
            r.row.append(r.sol);
          });
        },
        _fill: (vals) => rows.forEach((r, i) => { r.inp.value = vals[i] != null ? vals[i] : ''; }),
      };
    },
  });
})();
