/* ex.choice_single – trắc nghiệm một đáp án (R1). Quy tắc chấm: index_match (thư viện bài tập).
 * Dữ liệu: exercise.items[] = {prompt, options[], correct} hoặc chính exercise có options/correct.
 * Chọn đổi được tới khi bấm Kiểm tra; Kiểm tra thì khóa, tô đúng/sai. Điểm = số câu đúng / số câu. */
(function () {
  const T0 = window.T0;
  const CSS = `
.ex-cs-q{margin:0 0 var(--space-4,16px)}
.ex-cs-q:last-child{margin-bottom:0}
.ex-cs-p{margin:0 0 var(--space-2,8px);font-size:var(--text-body,16px);line-height:var(--lh-body,1.5)}
.ex-cs-p b{color:var(--color-ink-2);margin-right:4px}
.ex-cs-sub{display:block;color:var(--color-ink-2);font-size:var(--text-sm,13px)}
.ex-cs-opts{display:grid;gap:var(--space-2,8px)}
.ex-cs-o{display:flex;align-items:center;gap:var(--space-2,8px);text-align:left;min-height:var(--touch-min,44px);padding:var(--space-2,8px) var(--space-3,12px);border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);cursor:pointer}
.ex-cs-o .k{flex:none;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--color-line);display:inline-flex;align-items:center;justify-content:center;font-size:var(--text-xs,12px);font-weight:700;color:var(--color-ink-2)}
.ex-cs-o[aria-checked="true"]{border-color:var(--color-accent);background:var(--color-accent-soft)}
.ex-cs-o[aria-checked="true"] .k{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.ex-cs-o.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}
.ex-cs-o.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.ex-cs-o[disabled]{cursor:default}
.ex-cs-o:focus-visible{outline:3px solid var(--color-accent);outline-offset:2px}`;
  function css() { if (!document.getElementById('ex-cs-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'ex-cs-css', textContent: CSS })); }

  T0.registerEx('ex.choice_single', {
    render(el, ex, ctx) {
      css();
      const E = T0.ui.el;
      const qs = Array.isArray(ex.items) && ex.items.length ? ex.items : [ex];
      const state = qs.map(() => -1);
      const rows = [];
      let locked = false;
      qs.forEach((q, qi) => {
        const box = E('div', { class: 'ex-cs-q', role: 'radiogroup' });
        const pid = 'cs' + Math.random().toString(36).slice(2, 8);
        if (q !== ex && q.prompt) {
          const p = E('p', { class: 'ex-cs-p', id: pid }, qs.length > 1 ? E('b', { text: (qi + 1) + '.' }) : null, T0.t(q.prompt));
          box.append(p); box.setAttribute('aria-labelledby', pid);
        }
        const opts = E('div', { class: 'ex-cs-opts' });
        const btns = (q.options || []).map((o, oi) => {
          const b = E('button', { type: 'button', class: 'ex-cs-o', role: 'radio', 'aria-checked': 'false' },
            E('span', { class: 'k', text: 'ABCDEFGH'[oi] }), E('span', { text: T0.t(o) }));
          b.onclick = () => {
            if (locked) return;
            state[qi] = oi;
            btns.forEach((x, i) => x.setAttribute('aria-checked', String(i === oi)));
          };
          opts.append(b);
          return b;
        });
        box.append(opts);
        el.append(box);
        rows.push({ q, btns });
      });
      const correctOf = (q) => (Array.isArray(q.correct) ? q.correct[0] : q.correct);
      return {
        check() {
          locked = true;
          let right = 0;
          rows.forEach(({ q, btns }, qi) => {
            const c = correctOf(q);
            btns.forEach((b, i) => {
              b.disabled = true;
              b.classList.toggle('ok', i === c && state[qi] === c);
              b.classList.toggle('bad', i === state[qi] && i !== c);
            });
            if (state[qi] === c) right++;
          });
          const score = right / rows.length;
          return { ok: right === rows.length, score, feedback: rows.length > 1 ? `${T0.s('score')}: ${right}/${rows.length}` : '' };
        },
        reset() {
          locked = false;
          state.fill(-1);
          rows.forEach(({ btns }) => btns.forEach((b) => { b.disabled = false; b.classList.remove('ok', 'bad'); b.setAttribute('aria-checked', 'false'); }));
        },
        showSolution() {
          rows.forEach(({ q, btns }) => { const c = correctOf(q); if (btns[c]) btns[c].classList.add('ok'); });
        },
        // cho người kiểm thử / gia sư
        _answer: (qi, oi) => rows[qi] && rows[qi].btns[oi] && rows[qi].btns[oi].click(),
      };
    },
  });
})();
