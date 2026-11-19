/* ex.list_examples — nêu n ví dụ thuộc một lớp (agent C, đề xuất 003).
 * Dữ liệu (data.* hoặc cấp exercise): n (mặc định 2); accept_pattern, reject_pattern (regex, chuỗi); flags (mặc định 'i');
 *   reject_feedback (đa ngữ). Chấm regex_class: ví dụ đúng nếu khớp accept và không khớp reject; điểm = số đúng / n.
 *   Hai ví dụ trùng nhau chỉ tính một. Mẫu hiện có uz/vi; thiếu ru (xem YEU-CAU.md). */
(function () {
  const T0 = window.T0;
  function render(el, ex, ctx) {
    const U = T0.exu; const E = U.el;
    const d = Object.assign({}, ex, ex.data || {});
    const n = +d.n || 2;
    const fl = (d.flags || 'i').replace(/[gy]/g, '') + (/u/.test(d.flags || '') ? '' : 'u');
    const re = (s) => { try { return s ? new RegExp(s, fl) : null; } catch (e) { return null; } };
    const acc = re(d.accept_pattern), rej = re(d.reject_pattern);
    const st = U.store(ctx, ex);
    let val = Array.isArray(st.get(null)) ? st.get(null) : [];
    const fbx = E('div', { class: 'exc-sol', hidden: true });
    const ins = [...Array(n).keys()].map((i) => {
      const inp = E('input', { class: 'exc-in', type: 'text', autocomplete: 'off', placeholder: U.s('exc_example') + ' ' + (i + 1), 'aria-label': U.s('exc_example') + ' ' + (i + 1), style: { width: '100%' } });
      inp.value = val[i] || '';
      inp.oninput = () => { val[i] = inp.value; st.set(val); inp.classList.remove('exc-ok', 'exc-bad'); fbx.hidden = true; };
      el.append(E('div', { style: { margin: '0 0 var(--space-2,8px)' } }, inp));
      return inp;
    });
    el.append(fbx);
    return {
      check() {
        const vs = ins.map((x) => x.value.trim());
        if (!vs.some(Boolean)) return { empty: true, feedback: U.s('exc_empty') };
        const seen = new Set(); let r = 0, rejected = false;
        vs.forEach((v, i) => {
          const k = U.norm(v);
          const isRej = !!(v && rej && rej.test(v));
          const ok = !!v && !!acc && acc.test(v) && !isRej && !seen.has(k);
          if (isRej) rejected = true;
          if (ok) { r++; seen.add(k); }
          ins[i].classList.toggle('exc-ok', ok); ins[i].classList.toggle('exc-bad', !ok);
        });
        if (rejected && d.reject_feedback) { fbx.textContent = T0.t(d.reject_feedback); fbx.hidden = false; }
        const ok = r === n;
        return { ok, score: r / n, feedback: ok ? U.s('exc_all_right') : `(${r}/${n})` };
      },
      reset() { val = []; st.set(null); ins.forEach((x) => { x.value = ''; x.classList.remove('exc-ok', 'exc-bad'); }); fbx.hidden = true; },
      _fill(arr) { arr.forEach((v, i) => { if (ins[i]) { ins[i].value = v; ins[i].dispatchEvent(new Event('input')); } }); },
    };
  }
  T0.registerEx('ex.list_examples', { render });
})();
