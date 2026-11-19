/* ex.choice_multi — chọn nhiều (agent C, đề xuất 003).
 * Dữ liệu: options[] đa ngữ; correct[] (tùy chọn); data.allow_free_text + data.free_text_placeholder (WB chips: "chọn hoặc viết").
 * Chấm set_equal (tất cả hoặc không: sort(chọn) === correct). Không có correct (rule none) → không chấm, chỉ lưu (noCheck). */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const d = ex.data || {};
    const opts = ex.options || [];
    const correct = Array.isArray(ex.correct) ? ex.correct.slice().sort((a, b) => a - b) : null;
    const graded = !!(correct && correct.length) && !(ex.grading && ex.grading.rule === 'none');
    const st = U.store(ctx, ex);
    const saved = st.get({});
    let sel = new Set(Array.isArray(saved.sel) ? saved.sel : []);
    let checked = false;
    const box = E('div', { class: 'exc-chips', role: 'group' });
    const btns = opts.map((o, i) => {
      const b = E('button', { type: 'button', class: 'exc-check', role: 'checkbox', 'aria-checked': 'false' }, E('span', { class: 'box', 'aria-hidden': 'true' }), E('span', { text: T0.t(o) }));
      b.onclick = () => { if (sel.has(i)) sel.delete(i); else sel.add(i); checked = false; save(); paint(); };
      box.append(b); return b;
    });
    box.style.display = 'grid';
    el.append(box);
    let free = null;
    if (d.allow_free_text) {
      free = E('input', { class: 'exc-in', type: 'text', placeholder: T0.t(d.free_text_placeholder) || U.s('exc_free'), 'aria-label': T0.t(d.free_text_placeholder) || U.s('exc_free'), style: { width: '100%', marginTop: 'var(--space-2,8px)' } });
      free.value = saved.free || '';
      free.oninput = save;
      el.append(free);
    }
    function save() { st.set({ sel: [...sel].sort((a, b) => a - b), free: free ? free.value : undefined }); }
    function paint(sol) {
      btns.forEach((b, i) => {
        b.setAttribute('aria-checked', String(sel.has(i)));
        b.classList.remove('exc-ok', 'exc-bad', 'sol');
        if (checked && graded && sel.has(i)) b.classList.add(correct.includes(i) ? 'exc-ok' : 'exc-bad');
        if (sol && graded && correct.includes(i)) b.classList.add('exc-ok');
      });
    }
    paint();
    const api = {
      check() {
        if (!sel.size && !(free && free.value.trim())) return { empty: true, feedback: U.s('exc_empty') };
        save();
        if (!graded) return { ok: null, feedback: T0.s('saved') };
        checked = true; paint();
        const a = [...sel].sort((x, y) => x - y);
        const ok = JSON.stringify(a) === JSON.stringify(correct);
        return { ok, score: ok ? 1 : 0, feedback: ok ? U.s('exc_all_right') : U.s('exc_some_wrong') };
      },
      reset() { sel = new Set(); checked = false; if (free) free.value = ''; st.set(null); paint(); },
      _answer(arr) { sel = new Set(arr); paint(); },
    };
    if (graded) api.showSolution = () => paint(true);
    else api.noCheck = true;
    return api;
  }
  T0.registerEx('ex.choice_multi', { render });
})();
