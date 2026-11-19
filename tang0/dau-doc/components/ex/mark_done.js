/* ex.mark_done — xác nhận đã làm một nhiệm vụ (agent C, đề xuất 003).
 * Dữ liệu: title/prompt (core vẽ ở phần đầu), task_kind (hoặc data.kind): topshiriq | uyga | ijodiy; paras[] (tùy chọn).
 * Không chấm: nút "Bajardim" lưu ngay vào T0.store; nút Lưu ở chân bài ghi kết quả {ok:null}. */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const kind = ex.task_kind || (ex.data && ex.data.kind);
    if (kind && T0.s('exc_kind_' + kind) !== 'exc_kind_' + kind) el.append(E('p', { style: { margin: '0 0 var(--space-2,8px)' } }, E('span', { class: 'exc-tag', text: T0.s('exc_kind_' + kind) })));
    (ex.paras || (ex.data && ex.data.paras) || []).forEach((p) => el.append(E('p', { class: 'exc-qt', text: T0.t(p) })));
    const st = U.store(ctx, ex);
    let done = !!st.get(false);
    const b = E('button', { type: 'button', class: 'exc-check', role: 'checkbox', 'aria-checked': String(done) }, E('span', { class: 'box', 'aria-hidden': 'true' }), E('span', { text: U.s('exc_done') }));
    b.onclick = () => { done = !done; st.set(done); b.setAttribute('aria-checked', String(done)); };
    el.append(b);
    return {
      noCheck: true,
      check() { return done ? { ok: null, feedback: U.s('exc_marked') + ' ✓' } : { empty: true, feedback: U.s('exc_done') + '?' }; },
      reset() { done = false; st.set(false); b.setAttribute('aria-checked', 'false'); },
    };
  }
  T0.registerEx('ex.mark_done', { render });
})();
