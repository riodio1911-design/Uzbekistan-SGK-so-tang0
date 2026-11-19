/* ex.true_false — đúng/sai theo dòng (agent C, đề xuất 003).
 * Dữ liệu: items[] = {id, prompt: đa ngữ, correct: bool} (thư viện: rows[{statement, answer}] → nhận cả hai).
 * Chấm per_row_bool: điểm = số dòng đúng / số dòng. Chưa chọn dòng nào: {empty}. */
(function () {
  const T0 = window.T0;
  const CSS = `.extf-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2,8px) var(--space-3,12px);padding:var(--space-2,8px) 0;border-bottom:1px solid var(--color-line)}
.extf-row:last-child{border-bottom:0}.extf-s{flex:1 1 220px;min-width:0;line-height:var(--lh-body,1.5)}.extf-b{display:flex;gap:6px;flex:none}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('extf-css', CSS); const E = U.el;
    const rows = (ex.items || ex.rows || []).map((r) => ({ text: r.prompt || r.statement, correct: r.correct != null ? !!r.correct : !!r.answer }));
    const st = U.store(ctx, ex);
    let val = Object.assign({}, st.get({}));
    const ui = rows.map((r, i) => {
      const yes = U.chip(U.s('exc_true'), { 'aria-pressed': 'false' });
      const no = U.chip(U.s('exc_false'), { 'aria-pressed': 'false' });
      const set = (v) => { val[i] = v; st.set(val); paint(); };
      yes.onclick = () => set(true); no.onclick = () => set(false);
      const row = E('div', { class: 'extf-row', role: 'group' }, E('div', { class: 'extf-s' }, rows.length > 1 ? E('b', { text: (i + 1) + '. ' }) : null, T0.t(r.text)), E('div', { class: 'extf-b' }, yes, no));
      el.append(row);
      return { yes, no };
    });
    let checked = false;
    function paint(sol) {
      ui.forEach((u, i) => {
        u.yes.setAttribute('aria-pressed', String(val[i] === true));
        u.no.setAttribute('aria-pressed', String(val[i] === false));
        [u.yes, u.no].forEach((b) => b.classList.remove('ok', 'bad', 'sol'));
        if (checked && val[i] != null) (val[i] ? u.yes : u.no).classList.add(val[i] === rows[i].correct ? 'ok' : 'bad');
        if (sol) (rows[i].correct ? u.yes : u.no).classList.add('sol');
      });
    }
    paint();
    return {
      check() {
        const answered = rows.filter((r, i) => val[i] != null).length;
        if (!answered) return { empty: true, feedback: U.s('exc_empty') };
        checked = true; paint();
        const right = rows.filter((r, i) => val[i] === r.correct).length;
        const ok = right === rows.length;
        return { ok, score: right / rows.length, feedback: ok ? U.s('exc_all_right') : (answered < rows.length ? U.s('exc_not_all') + ' ' : '') + `(${right}/${rows.length})` };
      },
      reset() { val = {}; checked = false; st.set(null); paint(); },
      showSolution() { paint(true); },
      _answer(i, v) { (v ? ui[i].yes : ui[i].no).click(); },
    };
  }
  T0.registerEx('ex.true_false', { render });
})();
