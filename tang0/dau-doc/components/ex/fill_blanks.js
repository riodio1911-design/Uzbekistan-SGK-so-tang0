/* ex.fill_blanks — điền chỗ trống (agent C, đề xuất 003).
 * Hai dạng dữ liệu trong book.json:
 *  (a) tabiiy5: items[] = {id, prompt: đa ngữ có '…' đánh dấu chỗ trống, answer: chuỗi (dạng uz), label?};
 *      data.bank[] (đa ngữ, tùy chọn), data.groups[] + data.rows[].group (tiêu đề nhóm).
 *      Chỗ trống = dấu '…' đầu tiên không nằm trong ngoặc của lời câu theo ngôn ngữ đang xem; không có thì ô nằm cuối câu.
 *  (b) adabiyot5: lời dẫn (exercise.prompt) chứa các chỗ trống theo data.auto_blank_pattern; items[] = {id, open: true}.
 *      Renderer tự vẽ lời dẫn với ô nhập ngay trong câu và ẩn lời dẫn do core vẽ.
 * Chấm: accept_v2_per_blank (mặc định) | exact_per_blank — cả hai so qua T0.grade.shortAnswer sau khi đổi từ trong ngân hàng
 *   về dạng uz (thư viện: "chọn từ bank thì lưu dạng uz"). Ô open / không có answer: không chấm. */
(function () {
  const T0 = window.T0;
  const CSS = `.exfb-bank{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 var(--space-3,12px);padding:var(--space-2,8px);border:1.5px dashed var(--color-line);border-radius:var(--radius-md,10px)}
.exfb-bank .exc-chip{min-height:var(--touch-min,44px);padding:4px 12px;font-size:var(--text-sm,13px)}
.exfb-bank .exc-chip.used{opacity:.45}
.exfb-bank b{flex:1 1 100%;font-size:var(--text-xs,12px);color:var(--color-ink-2);text-transform:uppercase;letter-spacing:.03em}
.exfb-g{margin:var(--space-3,12px) 0 var(--space-1,4px);font-size:var(--text-sm,13px);font-weight:700;color:var(--color-accent-ink)}
.exfb-row{margin:0 0 var(--space-2,8px);line-height:2.6;overflow-wrap:anywhere}
.exfb-row .lb{font-weight:700;color:var(--color-ink-2);margin-right:4px}
.exfb-in{display:inline-block;vertical-align:middle;width:11em;max-width:100%;margin:0 4px;border-width:0 0 2px;border-radius:4px 4px 0 0;background:var(--color-surface-2)}
.exfb-in.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}.exfb-in.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.exfb-sol{display:inline-block;font-size:var(--text-sm,13px);color:var(--color-ok);font-weight:700;margin-left:2px}
.exfb-p{line-height:2.6;margin:0;overflow-wrap:anywhere}`;

  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exfb-css', CSS); const E = U.el;
    const d = ex.data || {};
    const items = ex.items || [];
    const bank = Array.isArray(d.bank) ? d.bank : null;
    const rule = ex.grading && ex.grading.rule;
    const st = U.store(ctx, ex);
    let val = Object.assign({}, st.get({}));
    const inputs = []; // {inp, item, i}
    let lastFocus = null;
    const listId = bank ? 'exfb' + Math.random().toString(36).slice(2, 8) : null;

    const mkInput = (i, item, label) => {
      const inp = E('input', { class: 'exc-in exfb-in', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': label || ((i + 1) + ''), list: listId || null });
      inp.value = val[i] || '';
      inp.oninput = () => { val[i] = inp.value; st.set(val); inp.classList.remove('ok', 'bad'); paintBank(); };
      inp.onfocus = () => { lastFocus = inputs.findIndex((x) => x.inp === inp); };
      inputs.push({ inp, item, i });
      return inp;
    };

    // ngân hàng từ: chạm để điền vào ô đang chọn (hoặc ô trống đầu tiên)
    let bankBtns = [];
    if (bank) {
      const bx = E('div', { class: 'exfb-bank' }, E('b', { text: U.s('exc_bank') }));
      bankBtns = bank.map((w) => {
        const b = U.chip(T0.t(w));
        b.onclick = () => {
          let k = lastFocus != null && inputs[lastFocus] && !inputs[lastFocus].inp.value ? lastFocus : inputs.findIndex((x) => !x.inp.value);
          if (k < 0) k = lastFocus != null ? lastFocus : 0;
          const x = inputs[k]; if (!x) return;
          x.inp.value = T0.t(w); x.inp.dispatchEvent(new Event('input'));
          const nx = inputs.findIndex((y, j) => j > k && !y.inp.value);
          lastFocus = nx >= 0 ? nx : k;
        };
        bx.append(b); return b;
      });
      el.append(bx);
      const dl = E('datalist', { id: listId });
      bank.forEach((w) => dl.append(E('option', { value: T0.t(w) })));
      el.append(dl);
    }
    function paintBank() {
      if (!bank) return;
      const used = new Set(inputs.map((x) => U.norm(U.mapBank(x.inp.value, bank))));
      bank.forEach((w, k) => bankBtns[k].classList.toggle('used', used.has(U.norm(w.uz || T0.t(w)))));
    }

    const pattern = d.auto_blank_pattern ? (() => { try { return new RegExp(d.auto_blank_pattern, 'g'); } catch (e) { return null; } })() : null;
    const allOpen = items.length > 0 && items.every((it) => it.open || it.answer == null);
    if (pattern && allOpen && ex.prompt) {
      // (b) chỗ trống nằm trong lời dẫn
      U.hideHead(el);
      const text = T0.t(ex.prompt);
      const p = E('p', { class: 'exfb-p' });
      let last = 0, k = 0, m;
      pattern.lastIndex = 0;
      while ((m = pattern.exec(text)) && k < 200) {
        const keep = m[1] || '';
        p.append(text.slice(last, m.index) + keep);
        p.append(mkInput(k, items[k] || { open: true }));
        last = m.index + m[0].length; k++;
        if (m[0].length === 0) pattern.lastIndex++;
      }
      p.append(text.slice(last));
      if (!k) p.append(' ', mkInput(0, items[0] || { open: true }));
      el.append(p);
    } else {
      // (a) mỗi mục một câu
      const groups = Array.isArray(d.groups) ? d.groups : null;
      let g = null;
      items.forEach((it, i) => {
        const gi = d.rows && d.rows[i] ? d.rows[i].group : null;
        if (groups && gi != null && gi !== g && groups[gi]) { el.append(E('div', { class: 'exfb-g', text: T0.t(groups[gi]) })); g = gi; }
        const row = E('div', { class: 'exfb-row' });
        if (it.label) row.append(E('span', { class: 'lb', text: it.label }));
        let text = T0.t(it.prompt);
        if (!text && d.rows && d.rows[i]) text = [d.rows[i].pre, '…', d.rows[i].post].filter((x) => x != null).map(T0.t).join(' ');
        // chỗ trống: '…' đầu tiên không nằm trong ngoặc '(…)'
        let pos = -1;
        for (let j = text.indexOf('…'); j >= 0; j = text.indexOf('…', j + 1)) { if (text[j - 1] !== '(') { pos = j; break; } }
        const label = (it.label || (i + 1) + '.') + ' ' + text.replace(/…/g, '___');
        if (pos >= 0) row.append(text.slice(0, pos), mkInput(i, it, label), text.slice(pos + 1));
        else row.append(text + ' ', mkInput(i, it, label));
        el.append(row);
      });
    }
    paintBank();

    const gradedIdx = inputs.filter((x) => x.item && x.item.answer != null && x.item.answer !== '' && !x.item.open);
    const solShown = [];
    const answerShown = (a) => {
      const first = Array.isArray(a) ? a[0] : String(a).split('|')[0];
      if (bank) { const w = bank.find((b) => b && typeof b === 'object' && U.norm(b.uz) === U.norm(first)); if (w) return T0.t(w); }
      return first;
    };
    const api = {
      check() {
        if (!inputs.some((x) => x.inp.value.trim())) return { empty: true, feedback: U.s('exc_empty') };
        if (!gradedIdx.length) return { ok: null, feedback: T0.s('saved') };
        let right = 0;
        gradedIdx.forEach((x) => {
          const v = bank ? U.mapBank(x.inp.value, bank) : x.inp.value;
          const ok = !!T0.grade.shortAnswer(v, x.item.answer, rule === 'exact_per_blank' ? 'accept_v2' : rule);
          x.inp.classList.toggle('ok', ok); x.inp.classList.toggle('bad', !ok);
          if (ok) right++;
        });
        const n = gradedIdx.length, ok = right === n;
        return { ok, score: right / n, feedback: ok ? U.s('exc_all_right') : U.s('exc_some_wrong') + ` (${right}/${n})` };
      },
      reset() {
        val = {}; st.set(null);
        inputs.forEach((x) => { x.inp.value = ''; x.inp.classList.remove('ok', 'bad'); });
        solShown.forEach((s) => s.remove()); solShown.length = 0; paintBank();
      },
      _fill(arr) { arr.forEach((v, k) => { if (inputs[k]) { inputs[k].inp.value = v; inputs[k].inp.dispatchEvent(new Event('input')); } }); },
    };
    if (gradedIdx.length) {
      api.showSolution = () => {
        gradedIdx.forEach((x) => {
          if (x.inp.classList.contains('ok')) return;
          const s = E('span', { class: 'exfb-sol', text: '→ ' + answerShown(x.item.answer) });
          x.inp.after(s); solShown.push(s);
        });
      };
    } else api.noCheck = true;
    return api;
  }
  T0.registerEx('ex.fill_blanks', { render, ownsPrompt: (ex) => !!(ex.data && ex.data.auto_blank_pattern) });
})();
