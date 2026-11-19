/* ex.self_check — tự đánh giá theo danh sách kỹ năng (agent C, đề xuất 003).
 * Dữ liệu: items[] = {id, prompt: đa ngữ} (thư viện: items[] chuỗi đa ngữ → nhận cả hai). Đáp án lưu: {chỉ số: bool}.
 * Không chấm (noCheck): chỉ lưu tick; phản hồi "x/y". */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const items = (ex.items || []).map((it) => (it && typeof it === 'object' && ('prompt' in it || 'text' in it) ? (it.prompt || it.text) : it));
    const st = U.store(ctx, ex);
    let val = Object.assign({}, st.get({}));
    const list = E('ul', { class: 'exc-list' });
    const btns = items.map((p, i) => {
      const b = E('button', { type: 'button', class: 'exc-check', role: 'checkbox', 'aria-checked': String(!!val[i]) }, E('span', { class: 'box', 'aria-hidden': 'true' }), E('span', { text: T0.t(p) }));
      b.onclick = () => { val[i] = !val[i]; st.set(val); b.setAttribute('aria-checked', String(!!val[i])); };
      list.append(E('li', null, b));
      return b;
    });
    el.append(list);
    return {
      noCheck: true,
      check() {
        const n = items.filter((p, i) => val[i]).length;
        return n ? { ok: null, feedback: `${T0.s('saved')}: ${n}/${items.length} ✓` } : { empty: true, feedback: U.s('exc_empty') };
      },
      reset() { val = {}; st.set(null); btns.forEach((b) => b.setAttribute('aria-checked', 'false')); },
      _answer(i) { btns[i].click(); },
    };
  }
  T0.registerEx('ex.self_check', { render });
})();
