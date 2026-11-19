/* ex.open_response – trả lời mở / tự luận (R1). Chấm: none_with_model_answer (lưu, sau khi lưu hiện lời giải mẫu),
 * keyword_regex nếu ý có answer_pattern. Nhận xét AI: nút "Gợi ý" của khung renderEx (ai_feedback.role).
 * Dữ liệu: exercise.items[] = {label?, prompt?, open, solution?, answer_pattern?} hoặc chính exercise. */
(function () {
  const T0 = window.T0;
  const CSS = `
.ex-or-row{margin-bottom:var(--space-3,12px)}
.ex-or-row:last-child{margin-bottom:0}
.ex-or-p{margin:0 0 var(--space-2,8px);font-size:var(--text-ui,15px)}
.ex-or-ta{display:block;width:100%;min-height:110px;resize:vertical;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);padding:var(--space-2,8px) var(--space-3,12px);font:inherit;font-size:var(--text-body,16px);line-height:var(--lh-body,1.5);background:var(--color-surface);color:var(--color-ink);background-image:repeating-linear-gradient(transparent,transparent calc(1.5em - 1px),var(--color-line) calc(1.5em - 1px),var(--color-line) 1.5em);background-attachment:local;background-position:0 var(--space-2,8px)}
.ex-or-ta:focus-visible{outline:3px solid var(--color-accent);outline-offset:1px}
.ex-or-row .t0-solution{margin-top:var(--space-2,8px)}
.ex-or-row .t0-solution b{display:block;font-size:var(--text-xs,12px);color:var(--color-ink-2);text-transform:uppercase;letter-spacing:.04em}`;
  function css() { if (!document.getElementById('ex-or-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'ex-or-css', textContent: CSS })); }
  const EMPTY = { uz: 'Avval javobingizni yozing.', ru: 'Сначала напиши свой ответ.', vi: 'Em hãy viết câu trả lời trước đã.' };
  const MODEL = { uz: 'Namuna javob', ru: 'Образец ответа', vi: 'Lời giải mẫu' };

  T0.registerEx('ex.open_response', {
    render(el, ex, ctx) {
      css();
      const E = T0.ui.el;
      const items = Array.isArray(ex.items) && ex.items.length ? ex.items : [ex];
      const key = (ctx.storeKey || 'ex:' + ex.id) + ':v';
      const saved = (ctx.store && ctx.store.get(key)) || {};
      const rows = items.map((it, i) => {
        const row = E('div', { class: 'ex-or-row' });
        const id = 'or' + Math.random().toString(36).slice(2, 8);
        if (it !== ex && (it.prompt || it.label)) row.append(E('label', { class: 'ex-or-p', for: id, text: [it.label, T0.t(it.prompt)].filter(Boolean).join('. ') }));
        const ta = E('textarea', { class: 'ex-or-ta', id, rows: '4', 'aria-label': T0.t(ex.prompt) || T0.s('exercise') });
        ta.value = saved[i] || '';
        row.append(ta);
        el.append(row);
        return { it, ta, row, sol: null };
      });
      const graded = rows.some((r) => r.it.answer_pattern);
      const showSol = () => rows.forEach((r) => {
        if (r.sol || !r.it.solution) return;
        r.sol = E('div', { class: 't0-solution' }, E('b', { text: T0.t(MODEL) }), T0.t(r.it.solution));
        r.row.append(r.sol);
      });
      return {
        noCheck: !graded,
        check() {
          if (!rows.some((r) => r.ta.value.trim())) {
            const first = rows[0] && rows[0].ta; if (first) first.focus();
            return { ok: null, score: null, empty: true, feedback: T0.t(EMPTY) };
          }
          const vals = {};
          rows.forEach((r, i) => { vals[i] = r.ta.value; });
          if (ctx.store) ctx.store.set(key, vals);
          const filled = rows.filter((r) => r.ta.value.trim()).length;
          if (filled) showSol();
          if (!graded) return { ok: null, score: null, feedback: filled ? T0.s('saved') : '' };
          const g = rows.filter((r) => r.it.answer_pattern);
          const right = g.filter((r) => { try { return new RegExp(r.it.answer_pattern, 'i').test(r.ta.value); } catch (e) { return false; } }).length;
          return { ok: right === g.length, score: right / g.length };
        },
        reset() {
          rows.forEach((r) => { r.ta.value = ''; if (r.sol) { r.sol.remove(); r.sol = null; } });
          if (ctx.store) ctx.store.remove(key);
        },
        showSolution: showSol,
      };
    },
  });
})();
