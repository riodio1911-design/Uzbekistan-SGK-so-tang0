/* ex.match_pairs — nối cặp (agent C, đề xuất 003).
 * Dữ liệu: items[] = {id, prompt (bên trái), correct: chỉ số bên phải}; options[] = bên phải.
 *   (thư viện: left[], right[], answer[] → nhận cả hai). Đáp án lưu: {chỉ số trái: chỉ số phải}.
 * Thao tác: chạm trái rồi phải (hoặc phải rồi trái); nối lại một mục phải thì gỡ nối cũ; chạm cặp đã nối để gỡ.
 * Chấm per_pair: điểm = số cặp đúng / số cặp. Cặp hiện bằng số + màu giống nhau ở hai bên. */
(function () {
  const T0 = window.T0;
  const HUES = ['--hue-blue', '--hue-orange', '--hue-green', '--hue-purple', '--hue-teal', '--hue-crimson', '--hue-gold', '--hue-red'];
  const CSS = `.exmp{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2,8px) var(--space-3,12px);align-items:start}
.exmp-col{display:grid;gap:var(--space-2,8px)}
.exmp .exc-chip{width:100%;border-radius:var(--radius-md,10px);justify-content:flex-start;font-size:var(--text-sm,13px);padding:6px 10px}
.exmp .exc-chip .bd{flex:none;min-width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;background:var(--color-line)}
.exmp .exc-chip.armed{border-color:var(--color-accent);box-shadow:0 0 0 3px var(--color-accent-soft)}
.exmp .exc-chip.paired{border-color:var(--pc)}
.exmp .exc-chip.paired .bd{background:var(--pc)}
@media (min-width:600px){.exmp .exc-chip{font-size:var(--text-ui,15px)}}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exmp-css', CSS); const E = U.el;
    const left = ex.items ? ex.items.map((it) => it.prompt) : (ex.left || []);
    const right = ex.options || ex.right || [];
    const ans = ex.items ? ex.items.map((it) => it.correct) : (ex.answer || []);
    const st = U.store(ctx, ex);
    let pair = Object.assign({}, st.get({}));
    let armL = null, armR = null, checked = false;
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_match_hint') }));
    const wrap = E('div', { class: 'exmp' });
    const colL = E('div', { class: 'exmp-col' }), colR = E('div', { class: 'exmp-col' });
    wrap.append(colL, colR); el.append(wrap);
    const bL = left.map((t, i) => { const b = U.chip([E('span', { class: 'bd', text: String(i + 1) }), E('span', { text: T0.t(t) })], { 'aria-pressed': 'false' }); b.onclick = () => tapL(i); colL.append(b); return b; });
    const bR = right.map((t, j) => { const b = U.chip([E('span', { class: 'bd', text: '·' }), E('span', { text: T0.t(t) })], { 'aria-pressed': 'false' }); b.onclick = () => tapR(j); colR.append(b); return b; });
    const leftOf = (j) => { const k = Object.keys(pair).find((i) => pair[i] === j); return k == null ? null : +k; };
    function link(i, j) {
      const o = leftOf(j); if (o != null) delete pair[o];
      pair[i] = j; armL = armR = null; checked = false; st.set(pair); paint();
    }
    function tapL(i) {
      if (armR != null) return link(i, armR);
      if (pair[i] != null && armL == null) { delete pair[i]; checked = false; st.set(pair); armL = i; return paint(); }
      armL = armL === i ? null : i; paint();
    }
    function tapR(j) {
      if (armL != null) return link(armL, j);
      const o = leftOf(j);
      if (o != null && armR == null) { delete pair[o]; checked = false; st.set(pair); armR = j; return paint(); }
      armR = armR === j ? null : j; paint();
    }
    function paint(sol) {
      const p = sol ? Object.fromEntries(ans.map((a, i) => [i, a])) : pair;
      bL.forEach((b, i) => {
        const on = p[i] != null;
        b.classList.toggle('paired', on); b.classList.toggle('armed', armL === i);
        b.setAttribute('aria-pressed', String(armL === i || on));
        b.style.setProperty('--pc', `var(${HUES[i % HUES.length]})`);
        b.classList.remove('ok', 'bad');
        if ((checked || sol) && on) b.classList.add(p[i] === ans[i] ? 'ok' : 'bad');
      });
      bR.forEach((b, j) => {
        const i = Object.keys(p).find((k) => p[k] === j);
        const on = i != null;
        b.classList.toggle('paired', on); b.classList.toggle('armed', armR === j);
        b.setAttribute('aria-pressed', String(armR === j || on));
        b.querySelector('.bd').textContent = on ? String(+i + 1) : '·';
        if (on) b.style.setProperty('--pc', `var(${HUES[+i % HUES.length]})`);
        b.setAttribute('aria-label', (on ? (+i + 1) + ' ↔ ' : '') + T0.t(right[j]));
      });
    }
    paint();
    return {
      check() {
        const n = left.length;
        const made = Object.keys(pair).length;
        if (!made) return { empty: true, feedback: U.s('exc_empty') };
        checked = true; armL = armR = null; paint();
        const r = ans.filter((a, i) => pair[i] === a).length;
        const ok = r === n;
        return { ok, score: n ? r / n : 0, feedback: ok ? U.s('exc_all_right') : (made < n ? U.s('exc_not_all') + ' ' : '') + `(${r}/${n})` };
      },
      reset() { pair = {}; armL = armR = null; checked = false; st.set(null); paint(); },
      showSolution() { pair = Object.fromEntries(ans.map((a, i) => [i, a])); checked = true; paint(); },
      _pair(i, j) { tapL(i); tapR(j); },
    };
  }
  T0.registerEx('ex.match_pairs', { render });
})();
