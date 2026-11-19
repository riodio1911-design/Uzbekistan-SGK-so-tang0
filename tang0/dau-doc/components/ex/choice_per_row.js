/* ex.choice_per_row — mỗi hàng chọn một phương án từ bộ dùng chung (agent C, đề xuất 003).
 * Dữ liệu: options[] đa ngữ; items[] = {id, prompt, correct: số | mảng số chấp nhận} (thư viện: rows[{label, answer[]}] → nhận cả hai);
 *   data.image (ảnh chung), data.row_images[] (ảnh từng hàng), data.check_requires_all_rows; solution/explanation (hiện sau Kiểm tra).
 * Chấm per_row_in_set: điểm = số hàng có lựa chọn thuộc đáp án / số hàng. */
(function () {
  const T0 = window.T0;
  const CSS = `.excr-row{padding:var(--space-2,8px) 0;border-bottom:1px solid var(--color-line)}.excr-row:last-child{border-bottom:0}
.excr-h{display:flex;align-items:center;gap:var(--space-2,8px);margin:0 0 6px;line-height:1.4;font-weight:600}
.excr-h img{width:56px;height:56px;object-fit:contain;border-radius:6px;background:var(--color-page-paper);flex:none}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('excr-css', CSS); const E = U.el;
    const d = ex.data || {};
    const opts = ex.options || [];
    const rows = (ex.items || ex.rows || []).map((r) => {
      const a = r.correct != null ? r.correct : r.answer;
      return { text: r.prompt || r.label, ok: Array.isArray(a) ? a : a == null ? [] : [a] };
    });
    const st = U.store(ctx, ex);
    let val = Object.assign({}, st.get({}));
    let checked = false;
    if (d.image) { const im = U.imgOrPage(d.image); if (im) { im.style.maxHeight = '240px'; im.style.margin = '0 auto var(--space-3,12px)'; el.append(im); } }
    const ui = rows.map((r, i) => {
      const h = E('div', { class: 'excr-h' });
      if (d.row_images && d.row_images[i]) h.append(E('img', { src: U.asset(d.row_images[i]), alt: '', loading: 'lazy', onerror: (e) => { e.target.style.display = 'none'; } }));
      h.append(E('span', { text: T0.t(r.text) }));
      const chips = E('div', { class: 'exc-chips', role: 'radiogroup', 'aria-label': T0.t(r.text) });
      const bs = opts.map((o, oi) => {
        const b = U.chip(T0.t(o), { role: 'radio', 'aria-checked': 'false' });
        b.onclick = () => { val[i] = oi; checked = false; st.set(val); paint(); };
        chips.append(b); return b;
      });
      el.append(E('div', { class: 'excr-row' }, h, chips));
      return bs;
    });
    const solText = ex.solution || ex.explanation || d.explanation;
    const solBox = solText ? E('div', { class: 'exc-sol', hidden: true, text: T0.t(solText) }) : null;
    if (solBox) el.append(solBox);
    function paint(sol) {
      ui.forEach((bs, i) => bs.forEach((b, oi) => {
        b.setAttribute('aria-checked', String(val[i] === oi));
        b.classList.remove('ok', 'bad', 'sol');
        if (checked && val[i] === oi) b.classList.add(rows[i].ok.includes(oi) ? 'ok' : 'bad');
        if (sol && rows[i].ok.includes(oi)) b.classList.add('sol');
      }));
    }
    paint();
    return {
      check() {
        const answered = rows.filter((r, i) => val[i] != null).length;
        if (!answered) return { empty: true, feedback: U.s('exc_empty') };
        if (d.check_requires_all_rows && answered < rows.length) return { empty: true, feedback: U.s('exc_not_all') };
        checked = true; paint();
        const right = rows.filter((r, i) => r.ok.includes(val[i])).length;
        const ok = right === rows.length;
        if (solBox) solBox.hidden = false;
        return { ok, score: right / rows.length, feedback: ok ? U.s('exc_all_right') : (answered < rows.length ? U.s('exc_not_all') + ' ' : '') + `(${right}/${rows.length})` };
      },
      reset() { val = {}; checked = false; st.set(null); if (solBox) solBox.hidden = true; paint(); },
      showSolution() { paint(true); if (solBox) solBox.hidden = false; },
      _answer(i, oi) { ui[i][oi].click(); },
    };
  }
  T0.registerEx('ex.choice_per_row', { render });
})();
