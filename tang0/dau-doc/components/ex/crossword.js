/* ex.crossword — ô chữ (agent C, đề xuất 003).
 * Dữ liệu: data.words {số: {dir: 'A'|'V', row, col, letters[] (mỗi phần tử một ô, có thể 2 ký tự như 'o‘','ch'), clue: đa ngữ}};
 *   data.grid {rows, cols} (thiếu thì tính từ các từ); data.note (đa ngữ). Thư viện cũng nhận words ở cấp exercise.
 * Thao tác: lưới chỉ để nhìn (ô nhỏ, không đạt 44px trên điện thoại) → chọn câu hỏi trong danh sách (≥44px) rồi gõ cả từ
 *   vào ô nhập; chạm ô trên lưới cũng chọn từ. Chữ được tách vào ô theo letters[] (ô 2 ký tự). Ô giao nhau dùng chung giá trị.
 * Chấm per_word_norm: mỗi từ đúng nếu norm(nhập) === norm(letters.join('')); điểm = số từ đúng / số từ. */
(function () {
  const T0 = window.T0;
  const CSS = `.excw-wrap{overflow-x:auto;margin:0 0 var(--space-3,12px);-webkit-overflow-scrolling:touch}
.excw-grid{display:grid;gap:2px;margin:0 auto;width:max-content;max-width:100%}
.excw-c{position:relative;width:var(--cw);height:var(--cw);border:1.5px solid var(--color-ink-2);background:var(--color-surface);color:var(--color-ink);font-weight:700;font-size:calc(var(--cw) * .42);display:flex;align-items:center;justify-content:center;text-transform:uppercase;cursor:pointer;border-radius:2px;line-height:1}
.excw-c.hl{background:var(--color-accent-soft);border-color:var(--color-accent)}
.excw-c.ok{background:var(--color-ok-soft);border-color:var(--color-ok)}.excw-c.bad{background:var(--color-bad-soft);border-color:var(--color-bad)}
.excw-c i{position:absolute;left:1px;top:0;font-size:calc(var(--cw) * .28);font-style:normal;font-weight:600;color:var(--color-ink-2);line-height:1}
.excw-x{visibility:hidden}
.excw-ent{display:flex;gap:var(--space-2,8px);align-items:center;margin:0 0 var(--space-3,12px);position:sticky;bottom:0;background:var(--color-surface);padding:6px 0}
.excw-ent .exc-in{flex:1;text-transform:lowercase}
.excw-cl h4{margin:var(--space-2,8px) 0 6px;font-size:var(--text-sm,13px);color:var(--color-ink-2);text-transform:uppercase;letter-spacing:.03em}
.excw-cl ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.excw-cl button{display:flex;gap:8px;align-items:flex-start;width:100%;min-height:var(--touch-min,44px);padding:8px 10px;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-sm,13px);line-height:1.4;text-align:left;cursor:pointer}
.excw-cl button b{flex:none;min-width:20px}
.excw-cl button[aria-pressed="true"]{border-color:var(--color-accent);background:var(--color-accent-soft)}
.excw-cl button.ok{border-color:var(--color-ok)}.excw-cl button.bad{border-color:var(--color-bad)}
.excw-cl .len{color:var(--color-ink-2);white-space:nowrap}`;
  const APOS = /[‘’ʻʼ'`]/g;
  const nl = (s) => String(s || '').toLowerCase().replace(APOS, '‘').replace(/\s+/g, '');

  function render(el, ex, ctx) {
    const U = T0.exu; U.css('excw-css', CSS); const E = U.el;
    const d = ex.data || {};
    const wobj = d.words || ex.words || {};
    const words = Object.keys(wobj).map((k) => {
      const w = wobj[k];
      return { no: k, dir: (w.dir || w.d || 'A').toUpperCase().startsWith('V') || (w.dir || '').toUpperCase() === 'D' ? 'V' : 'A', row: +(w.row ?? w.r), col: +(w.col ?? w.c), letters: w.letters || w.a || [], clue: w.clue || w.q };
    });
    let R = (d.grid && d.grid.rows) || 0, C = (d.grid && d.grid.cols) || 0;
    words.forEach((w) => { const n = w.letters.length; R = Math.max(R, w.row + (w.dir === 'V' ? n : 1)); C = Math.max(C, w.col + (w.dir === 'A' ? n : 1)); });
    const key = (r, c) => r + ',' + c;
    const cellsOf = (w) => w.letters.map((_, i) => key(w.row + (w.dir === 'V' ? i : 0), w.col + (w.dir === 'A' ? i : 0)));
    const used = new Map(); // key -> [word idx]
    words.forEach((w, wi) => cellsOf(w).forEach((k) => { if (!used.has(k)) used.set(k, []); used.get(k).push(wi); }));
    const st = U.store(ctx, ex);
    const A = U.ans(ex);
    let val = Object.assign({}, st.get(null) || (() => { const m = A.get(), o = {}; words.forEach((w) => cellsOf(w).forEach((k, i) => { const v = m[w.no + '.' + i]; if (v) o[k] = v; })); return o; })()); // key -> chuỗi ô
    const sync = () => words.forEach((w) => cellsOf(w).forEach((k, i) => A.set(w.no + '.' + i, val[k] || '')));
    let sel = 0, marks = null;

    if (T0.t(d.note)) el.append(E('p', { class: 'exc-hint', text: T0.t(d.note) }));
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_cw_hint') }));
    const wrap = E('div', { class: 'excw-wrap' });
    const grid = E('div', { class: 'excw-grid', 'aria-hidden': 'true' });
    wrap.append(grid); el.append(wrap);
    const cellEl = new Map();
    const starts = new Map(); words.forEach((w) => { const k = key(w.row, w.col); if (!starts.has(k)) starts.set(k, w.no); });
    function sizeGrid() {
      const avail = Math.max(240, (el.clientWidth || 340));
      const cw = Math.max(20, Math.min(40, Math.floor((avail - (C - 1) * 2) / C)));
      grid.style.setProperty('--cw', cw + 'px');
      grid.style.gridTemplateColumns = `repeat(${C}, ${cw}px)`;
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const k = key(r, c);
      const cell = E('div', { class: 'excw-c' + (used.has(k) ? '' : ' excw-x') });
      if (used.has(k)) {
        if (starts.has(k)) cell.append(E('i', { text: starts.get(k) }));
        cell.append(E('span'));
        cell.onclick = () => { const ws = used.get(k); select(ws.length > 1 && ws[0] === sel ? ws[1] : ws[0]); };
        cellEl.set(k, cell);
      }
      grid.append(cell);
    }
    sizeGrid();
    if (window.ResizeObserver) new ResizeObserver(sizeGrid).observe(el);

    const ent = E('div', { class: 'excw-ent' });
    const lab = E('b', { style: { minWidth: '28px' } });
    const inp = E('input', { class: 'exc-in', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: U.s('exc_type_word') });
    ent.append(lab, inp); el.append(ent);

    const cl = E('div', { class: 'excw-cl' });
    const clueBtn = [];
    [['A', 'exc_across'], ['V', 'exc_down_w']].forEach(([dir, sk]) => {
      const ws = words.map((w, i) => [w, i]).filter(([w]) => w.dir === dir).sort((a, b) => a[0].no - b[0].no);
      if (!ws.length) return;
      const ol = E('ol');
      ws.forEach(([w, i]) => {
        const b = E('button', { type: 'button', 'aria-pressed': 'false' }, E('b', { text: w.no + '.' }), E('span', null, T0.t(w.clue) + ' ', E('span', { class: 'len', text: `(${w.letters.length} ${U.s('exc_letters')})` })));
        b.onclick = () => { select(i); inp.focus({ preventScroll: true }); };
        clueBtn[i] = b; ol.append(E('li', null, b));
      });
      cl.append(E('h4', { text: U.s(sk) }), ol);
    });
    el.append(cl);

    const wordVal = (wi) => cellsOf(words[wi]).map((k) => val[k] || '');
    // tách chuỗi gõ vào các ô theo letters[] (ô 2 ký tự như 'ch', 'o‘')
    function split(wi, s) {
      const L = words[wi].letters; const src = nl(s); const out = []; let p = 0;
      for (let i = 0; i < L.length && p < src.length; i++) {
        const want = nl(L[i]);
        if (want.length > 1 && src.startsWith(want, p)) { out.push(src.substr(p, want.length)); p += want.length; }
        else if (src[p + 1] === '‘' && want.length > 1) { out.push(src.substr(p, 2)); p += 2; }
        else { out.push(src[p]); p += 1; }
      }
      return out;
    }
    function select(wi) {
      sel = wi; const w = words[wi];
      lab.textContent = w.no + (w.dir === 'A' ? '→' : '↓');
      inp.setAttribute('aria-label', w.no + '. ' + T0.t(w.clue));
      inp.maxLength = w.letters.join('').length + 4;
      const v = wordVal(wi); const firstEmpty = v.indexOf('');
      inp.value = (firstEmpty < 0 ? v : v.slice(0, firstEmpty)).join('');
      paint();
    }
    inp.oninput = () => {
      const cs = cellsOf(words[sel]); const parts = split(sel, inp.value);
      cs.forEach((k, i) => { if (i < parts.length) val[k] = parts[i]; else if (!crossFilled(k)) delete val[k]; });
      marks = null; st.set(val); sync(); paint();
    };
    // ô giao nhau đã điền bởi từ khác (đã đủ chữ) thì không xóa khi sửa từ này
    function crossFilled(k) { return used.get(k).some((wi) => wi !== sel && wordVal(wi).every(Boolean)); }
    function paint() {
      const hl = new Set(cellsOf(words[sel] || { letters: [] }));
      cellEl.forEach((c, k) => {
        c.querySelector('span').textContent = val[k] || '';
        c.classList.toggle('hl', hl.has(k));
        c.classList.remove('ok', 'bad');
        if (marks) { const ws = used.get(k); if (ws.every((wi) => marks[wi])) c.classList.add('ok'); else if (ws.some((wi) => marks[wi] === false)) c.classList.add('bad'); }
      });
      clueBtn.forEach((b, i) => { if (!b) return; b.setAttribute('aria-pressed', String(i === sel)); b.classList.toggle('ok', !!marks && marks[i] === true); b.classList.toggle('bad', !!marks && marks[i] === false); });
    }
    if (words.length) select(0);
    return {
      check() {
        if (!Object.keys(val).length) return { empty: true, feedback: U.s('exc_empty') };
        marks = words.map((w, i) => nl(wordVal(i).join('')) === nl(w.letters.join('')));
        paint();
        const r = marks.filter(Boolean).length, n = words.length, ok = r === n;
        return { ok, score: n ? r / n : 0, feedback: ok ? U.s('exc_all_right') : U.s('exc_some_wrong') + ` (${r}/${n})` };
      },
      reset() { val = {}; marks = null; st.set(null); A.clear(); select(0); },
      showSolution() { words.forEach((w) => cellsOf(w).forEach((k, i) => { val[k] = w.letters[i]; })); marks = words.map(() => true); select(sel); },
      _word(wi, s) { select(wi); inp.value = s; inp.dispatchEvent(new Event('input')); },
    };
  }
  T0.registerEx('ex.crossword', { render });
})();
