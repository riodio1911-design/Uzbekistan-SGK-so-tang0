/* ex.label_diagram — gắn nhãn vào ô trên sơ đồ (agent C, đề xuất 003).
 * Dữ liệu: options[] (các nhãn), items[] = {id, prompt, correct: chỉ số nhãn đúng của ô i} (thư viện: labels[] theo thứ tự ô);
 *   data.image (ảnh sơ đồ) + data.boxes [[x, y], …] % (góc trên-trái ô); dự phòng data.page_image {page, volume}.
 * Thao tác: chọn nhãn rồi chạm ô (hoặc chạm ô rồi chọn nhãn); chạm ô đã gắn để gỡ.
 * Chấm per_box: điểm = số ô gắn đúng / số ô. */
(function () {
  const T0 = window.T0;
  const CSS = `.exld-fig{position:relative;margin:0 0 var(--space-3,12px)}
.exld-fig .exc-img,.exld-fig .t0-crop{width:100%}
.exld-b{position:absolute;min-width:var(--touch-min,44px);min-height:var(--touch-min,44px);max-width:45%;padding:2px 8px;border:2px dashed var(--color-accent);border-radius:var(--radius-sm,6px);background:color-mix(in srgb,var(--color-surface) 88%,transparent);color:var(--color-ink);font:inherit;font-size:var(--text-sm,13px);font-weight:700;cursor:pointer;line-height:1.2;overflow-wrap:anywhere}
.exld-b.set{border-style:solid}
.exld-b.armed{box-shadow:0 0 0 3px var(--color-accent-soft)}
.exld-b.ok{border-color:var(--color-ok);background:var(--color-ok-soft)}.exld-b.bad{border-color:var(--color-bad);background:var(--color-bad-soft)}
.exld-ls{display:grid;gap:6px;margin:0 0 var(--space-3,12px);padding:0;list-style:none}
.exld-ls li{display:flex;align-items:center;gap:8px}
.exld-ls .exc-chip{flex:1;justify-content:flex-start;border-radius:var(--radius-md,10px)}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exld-css', CSS); const E = U.el;
    const d = ex.data || {};
    const labels = ex.options || ex.labels || [];
    const n = (ex.items || []).length || (d.boxes || []).length || labels.length;
    const correct = (ex.items || []).length ? ex.items.map((it) => it.correct) : [...Array(n).keys()];
    const boxes = d.boxes || ex.boxes || [];
    const st = U.store(ctx, ex);
    let val = Object.assign({}, st.get({}));
    let armL = null, armB = null, checked = false;
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_label_hint') }));
    const fig = E('div', { class: 'exld-fig' });
    const pg = d.page_image ? { page: d.page_image.page, volume: d.page_image.volume } : null;
    const img = U.imgOrPage(d.image || ex.image, pg);
    if (img) fig.append(img);
    const bb = [...Array(n).keys()].map((i) => {
      const [x, y] = boxes[i] || [4, 6 + i * 14];
      const b = E('button', { type: 'button', class: 'exld-b', style: { left: x + '%', top: y + '%' } });
      b.onclick = () => tapB(i); fig.append(b); return b;
    });
    el.append(fig);
    // danh sách ô (dễ chạm trên điện thoại) + nhãn
    const pool = E('div', { class: 'exc-chips', role: 'radiogroup' });
    const lb = labels.map((l, j) => { const b = U.chip(T0.t(l), { role: 'radio', 'aria-checked': 'false' }); b.onclick = () => tapL(j); pool.append(b); return b; });
    el.append(pool);
    function tapB(i) {
      if (armL != null) { put(i, armL); return; }
      if (val[i] != null && armB == null) { delete val[i]; checked = false; st.set(val); }
      armB = armB === i ? null : i; paint();
    }
    function tapL(j) {
      if (armB != null) { put(armB, j); return; }
      armL = armL === j ? null : j; paint();
    }
    function put(i, j) { Object.keys(val).forEach((k) => { if (val[k] === j) delete val[k]; }); val[i] = j; armL = armB = null; checked = false; st.set(val); paint(); }
    function paint(sol) {
      bb.forEach((b, i) => {
        const v = sol ? correct[i] : val[i];
        b.textContent = v != null ? T0.t(labels[v]) : (i + 1) + ' ?';
        b.classList.toggle('set', v != null); b.classList.toggle('armed', armB === i);
        b.classList.remove('ok', 'bad');
        if ((checked || sol) && v != null) b.classList.add(v === correct[i] ? 'ok' : 'bad');
        b.setAttribute('aria-label', (i + 1) + ': ' + (v != null ? T0.t(labels[v]) : '?'));
      });
      const usedL = new Set(Object.values(val));
      lb.forEach((b, j) => { b.setAttribute('aria-checked', String(armL === j)); b.style.opacity = usedL.has(j) && armL !== j ? '.55' : ''; });
    }
    paint();
    return {
      check() {
        const made = Object.keys(val).length;
        if (!made) return { empty: true, feedback: U.s('exc_empty') };
        checked = true; armL = armB = null; paint();
        const r = correct.filter((c, i) => val[i] === c).length, ok = r === n;
        return { ok, score: n ? r / n : 0, feedback: ok ? U.s('exc_all_right') : (made < n ? U.s('exc_not_all') + ' ' : '') + `(${r}/${n})` };
      },
      reset() { val = {}; armL = armB = null; checked = false; st.set(null); paint(); },
      showSolution() { val = Object.fromEntries(correct.map((c, i) => [i, c])); checked = true; paint(); },
      _put(i, j) { put(i, j); },
    };
  }
  T0.registerEx('ex.label_diagram', { render });
})();
