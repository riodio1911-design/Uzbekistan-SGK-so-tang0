/* ex.sim_task — dự đoán → làm thí nghiệm ảo → so sánh (agent C, đề xuất 003).
 * Dữ liệu: data.sim (hoặc sim): id mô phỏng trong book.simulations (renderer sim.* do agent E/F làm, gọi qua T0.renderSim);
 *   prediction (tùy chọn, đa ngữ): câu hỏi dự đoán. Đáp án lưu: {prediction, result}.
 * Không chấm / giáo viên chấm (v1): Kiểm tra = Lưu. */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const d = ex.data || {};
    const st = U.store(ctx, ex);
    const saved = st.get({}) || {};
    const lab = (k, txt) => E('label', { class: 'exc-qt', style: { display: 'block', fontWeight: 600 } }, txt || U.s(k));
    const pr = E('textarea', { class: 'exc-in', rows: 3 });
    pr.value = saved.prediction || '';
    el.append(lab('exc_prediction', T0.t(ex.prediction || d.prediction) || null), pr);
    const host = E('div', { style: { margin: 'var(--space-3,12px) 0' } });
    el.append(host);
    const simId = d.sim || ex.sim;
    let simCtl = null;
    if (simId && (typeof simId === 'object' || T0.find('simulation', simId))) simCtl = T0.renderSim(host, simId, { exercise: ex });
    else host.append(E('div', { class: 'exc-hint', text: U.s('exc_no_sim') + (simId ? ': ' + simId : '') }));
    const rs = E('textarea', { class: 'exc-in', rows: 3 });
    rs.value = saved.result || '';
    el.append(lab('exc_result'), rs);
    const save = () => st.set({ prediction: pr.value, result: rs.value });
    pr.oninput = save; rs.oninput = save;
    pr.setAttribute('aria-label', U.s('exc_prediction')); rs.setAttribute('aria-label', U.s('exc_result'));
    return {
      noCheck: true,
      check() { save(); return pr.value.trim() || rs.value.trim() ? { ok: null, feedback: T0.s('saved') } : { empty: true, feedback: U.s('exc_empty') }; },
      reset() { pr.value = ''; rs.value = ''; st.set(null); },
      unmount() { simCtl && simCtl.unmount && simCtl.unmount(); },
    };
  }
  T0.registerEx('ex.sim_task', { render });
})();
