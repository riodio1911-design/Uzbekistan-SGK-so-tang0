/* ex.spreadsheet — bảng tính nhỏ (agent C, đề xuất 003; sim.spreadsheet_mini dạng cảnh thuộc đề xuất 006 – agent E).
 * Dữ liệu (data.* hoặc cấp exercise): rows[][] (hàng 0 = tên cột "", "A", "B"…; cột 0 = số hàng); formula ('=B2+B3+B4');
 *   highlight ('B5' – ô chứa công thức/kết quả). Bộ tính hỗ trợ + - * / ( ), số thập phân (, hoặc .), tham chiếu ô,
 *   SUM/AVERAGE/MAX/MIN/COUNT với vùng A1:B3 hoặc danh sách. Ô bắt đầu bằng '=' là công thức. Không dùng eval.
 * Không chấm (rule none): chỉ tính và hiển thị; Kiểm tra = Lưu (trả về giá trị ô highlight trong phản hồi).
 * T0.exu.sheetEval(rows, addr) dùng lại được cho sim.spreadsheet_mini. */
(function () {
  const T0 = window.T0;
  const CSS = `.exss-fx{display:flex;align-items:center;gap:var(--space-2,8px);margin:0 0 var(--space-2,8px)}
.exss-fx b{flex:none;min-width:44px;text-align:center;font-family:var(--font-mono);color:var(--color-ink-2)}
.exss-fx .exc-in{flex:1;font-family:var(--font-mono)}
.exss-w{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--color-line);border-radius:var(--radius-sm,6px)}
.exss{border-collapse:collapse;min-width:100%;font-size:var(--text-ui,15px)}
.exss th{background:var(--color-surface-2);color:var(--color-ink-2);font-weight:600;font-size:var(--text-sm,13px);padding:4px 8px;border:1px solid var(--color-line);min-width:36px}
.exss td{border:1px solid var(--color-line);padding:0;min-width:84px}
.exss td input{width:100%;min-height:var(--touch-min,44px);border:0;background:transparent;color:var(--color-ink);font:inherit;padding:0 8px}
.exss td input:focus{outline:2px solid var(--color-accent);outline-offset:-2px}
.exss td.hi{background:var(--color-highlight-soft)}
.exss td.hi input{font-weight:800}
.exss td.err input{color:var(--color-bad)}`;

  // ---- bộ tính (đệ quy, có chặn vòng lặp) ----
  function makeSheet(rows) {
    const head = rows[0] || [];
    const colIdx = (L) => head.findIndex((h, i) => i > 0 && String(h).toUpperCase() === L);
    const rowIdx = (n) => rows.findIndex((r, i) => i > 0 && String(r[0]) === String(n));
    const raw = (addr) => { const m = /^([A-Z]+)(\d+)$/.exec(addr); if (!m) return null; const c = colIdx(m[1]), r = rowIdx(m[2]); return c < 0 || r < 0 ? null : rows[r][c]; };
    const num = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/\s/g, '')); return isNaN(v) ? 0 : v; };
    function value(addr, seen) {
      seen = seen || new Set();
      if (seen.has(addr)) throw new Error('#CYCLE');
      const s = raw(addr);
      if (s == null || s === '') return 0;
      if (String(s).startsWith('=')) { seen.add(addr); const v = evalF(String(s).slice(1), seen); seen.delete(addr); return v; }
      return num(s);
    }
    function range(a, b) {
      const ma = /^([A-Z]+)(\d+)$/.exec(a), mb = /^([A-Z]+)(\d+)$/.exec(b); if (!ma || !mb) throw new Error('#REF');
      const out = [];
      const c1 = Math.min(colIdx(ma[1]), colIdx(mb[1])), c2 = Math.max(colIdx(ma[1]), colIdx(mb[1]));
      const r1 = Math.min(+ma[2], +mb[2]), r2 = Math.max(+ma[2], +mb[2]);
      for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) out.push(head[c] + r);
      return out;
    }
    function evalF(src, seen) {
      const toks = src.toUpperCase().match(/\d+(?:[.,]\d+)?|[A-Z]+\d+|[A-Z]+|[-+*/():;,]/g) || [];
      let p = 0;
      const peek = () => toks[p], eat = (t) => { if (toks[p] !== t) throw new Error('#ERR'); p++; };
      function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const o = toks[p++]; const w = term(); v = o === '+' ? v + w : v - w; } return v; }
      function term() { let v = fac(); while (peek() === '*' || peek() === '/') { const o = toks[p++]; const w = fac(); if (o === '/' && w === 0) throw new Error('#DIV/0'); v = o === '*' ? v * w : v / w; } return v; }
      function args() {
        const vals = [];
        eat('(');
        while (peek() !== ')') {
          if (/^[A-Z]+\d+$/.test(peek() || '') && toks[p + 1] === ':') { const a = toks[p]; p += 2; const b = toks[p++]; range(a, b).forEach((x) => vals.push(value(x, seen))); }
          else vals.push(expr());
          if (peek() === ';' || peek() === ',') p++; else if (peek() !== ')') throw new Error('#ERR');
        }
        eat(')');
        return vals;
      }
      function fac() {
        const t = toks[p++];
        if (t == null) throw new Error('#ERR');
        if (t === '-') return -fac();
        if (t === '+') return fac();
        if (t === '(') { const v = expr(); eat(')'); return v; }
        if (/^\d/.test(t)) return num(t);
        if (/^[A-Z]+\d+$/.test(t)) return value(t, seen);
        const F = { SUM: (a) => a.reduce((s, x) => s + x, 0), AVERAGE: (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0), MAX: (a) => Math.max(...a), MIN: (a) => Math.min(...a), COUNT: (a) => a.length };
        if (F[t]) return F[t](args());
        throw new Error('#NAME?');
      }
      const v = expr();
      if (p !== toks.length) throw new Error('#ERR');
      return v;
    }
    return { value, raw };
  }
  const fmt = (v) => (Number.isFinite(v) ? String(Math.round(v * 1000) / 1000) : '#ERR');

  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exss-css', CSS); const E = U.el;
    const d = Object.assign({}, ex, ex.data || {});
    const st = U.store(ctx, ex);
    const base = (d.rows || []).map((r) => r.map((c) => (c == null ? '' : String(c))));
    const hiAddr = (d.highlight || '').toUpperCase();
    const fill = (rows) => {
      if (hiAddr && d.formula) {
        const m = /^([A-Z]+)(\d+)$/.exec(hiAddr);
        const c = m ? (rows[0] || []).findIndex((h, i) => i > 0 && String(h).toUpperCase() === m[1]) : -1;
        const r = m ? rows.findIndex((x, i) => i > 0 && String(x[0]) === m[2]) : -1;
        if (c > 0 && r > 0 && !rows[r][c]) rows[r][c] = d.formula;
      }
      return rows;
    };
    const saved = st.get(null);
    let rows = fill(Array.isArray(saved) && saved.length === base.length ? saved.map((r) => r.slice()) : base.map((r) => r.slice()));
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_sheet_hint') }));
    const fx = E('div', { class: 'exss-fx' });
    const fxName = E('b', { text: hiAddr || '' });
    const fxIn = E('input', { class: 'exc-in', type: 'text', 'aria-label': U.s('exc_formula'), spellcheck: 'false', autocomplete: 'off' });
    fx.append(fxName, fxIn); el.append(fx);
    const w = E('div', { class: 'exss-w' });
    const tb = E('table', { class: 'exss' });
    w.append(tb); el.append(w);
    let cur = null; // [r, c]
    const inputs = [];
    rows.forEach((r, ri) => {
      const tr = E('tr');
      r.forEach((cell, ci) => {
        if (ri === 0 || ci === 0) { tr.append(E('th', { scope: ri === 0 ? 'col' : 'row', text: cell })); return; }
        const addr = rows[0][ci] + rows[ri][0];
        const inp = E('input', { type: 'text', inputmode: 'decimal', 'aria-label': addr, autocomplete: 'off' });
        const td = E('td', { class: addr === hiAddr ? 'hi' : '' }, inp);
        inp.onfocus = () => { cur = [ri, ci]; fxName.textContent = addr; fxIn.value = rows[ri][ci]; inp.value = rows[ri][ci]; };
        inp.onblur = () => { setTimeout(paint, 0); };
        inp.oninput = () => { rows[ri][ci] = inp.value; fxIn.value = inp.value; st.set(rows); paintOthers(inp); };
        inp.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); } };
        inputs.push({ inp, ri, ci, addr, td });
        tr.append(td);
      });
      tb.append(tr);
    });
    fxIn.oninput = () => { if (!cur) return; rows[cur[0]][cur[1]] = fxIn.value; st.set(rows); paint(); };
    function shown(x) {
      const s = rows[x.ri][x.ci];
      if (!String(s).startsWith('=')) return { t: s, err: false };
      try { return { t: fmt(makeSheet(rows).value(x.addr)), err: false }; } catch (e) { return { t: e.message || '#ERR', err: true }; }
    }
    function paintOthers(except) { inputs.forEach((x) => { if (x.inp === except) return; const v = shown(x); x.inp.value = v.t; x.td.classList.toggle('err', v.err); }); }
    function paint() { inputs.forEach((x) => { if (document.activeElement === x.inp) return; const v = shown(x); x.inp.value = v.t; x.td.classList.toggle('err', v.err); }); }
    // mặc định chọn ô highlight để thấy công thức
    const hx = inputs.find((x) => x.addr === hiAddr);
    if (hx) { cur = [hx.ri, hx.ci]; fxIn.value = rows[hx.ri][hx.ci]; }
    paint();
    const hiVal = () => { if (!hx) return ''; const v = shown(hx); return hiAddr + ' = ' + v.t; };
    return {
      noCheck: true,
      check() { st.set(rows); return { ok: null, feedback: T0.s('saved') + (hx ? ' · ' + hiVal() : '') }; },
      reset() { rows = fill(base.map((r) => r.slice())); st.set(null); if (hx) fxIn.value = rows[hx.ri][hx.ci]; paint(); },
      value: (addr) => makeSheet(rows).value(addr.toUpperCase()),
      _set(addr, v) { const x = inputs.find((y) => y.addr === addr); if (x) { rows[x.ri][x.ci] = v; st.set(rows); paint(); } },
    };
  }
  T0.exu && (T0.exu.sheetEval = (rows, addr) => makeSheet(rows).value(addr));
  T0.registerEx('ex.spreadsheet', { render });
})();
