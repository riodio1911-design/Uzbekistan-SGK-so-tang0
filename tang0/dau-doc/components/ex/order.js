/* ex.order — xếp thứ tự (agent C, đề xuất 002).
 * Dữ liệu (book.json): sequence[] theo ĐÚNG thứ tự; mỗi phần tử là chuỗi đa ngữ hoặc {text: đa ngữ, image?: đường dẫn}
 *   (dạng object là đề xuất 002, tương thích ngược). Thư viện còn gọi là items[] → nhận cả hai.
 *   data.shuffle: hoán vị hiển thị cố định (tùy chọn); data.layout: 'list' | 'cycle'; data.image: ảnh minh họa;
 *   data.feedback_wrong: lời nhắc khi sai; data.item_images (chuỗi 'code:…', mã cũ vẽ SVG) — bỏ qua, chờ ảnh xuất ra file.
 * Chấm: grading.rule 'per_position' (MẶC ĐỊNH D2: tô từng vị trí, điểm = số vị trí đúng / n) | 'all_or_nothing'.
 * Thao tác: nút ▲▼ (≥44px) hoặc kéo tay cầm ⠿ (pointer events, chạy cả cảm ứng). Lời giải: showSolution xếp đúng. */
(function () {
  const T0 = window.T0;
  const CSS = `
.exo-list{display:grid;gap:var(--space-2,8px);margin:0;padding:0;list-style:none;counter-reset:exo}
.exo-it{display:flex;align-items:center;gap:var(--space-2,8px);padding:4px;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);touch-action:pan-y;transition:transform .12s}
.exo-it.drag{box-shadow:var(--shadow-2);border-color:var(--color-accent);transition:none;z-index:2;position:relative}
.exo-n{flex:none;width:28px;height:28px;border-radius:50%;background:var(--color-surface-2);color:var(--color-ink-2);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-sm,13px)}
.exo-it.ok .exo-n{background:var(--color-ok);color:#fff}.exo-it.bad .exo-n{background:var(--color-bad);color:#fff}
.exo-h{flex:none;width:var(--touch-min,44px);height:var(--touch-min,44px);display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--color-ink-2);font-size:20px;cursor:grab;touch-action:none;border-radius:var(--radius-sm,6px)}
.exo-h:active{cursor:grabbing}
.exo-tx{flex:1;min-width:0;display:flex;align-items:center;gap:var(--space-2,8px);font-size:var(--text-ui,15px);line-height:1.4;overflow-wrap:anywhere;padding:6px 0}
.exo-tx img{width:56px;height:56px;object-fit:contain;flex:none;border-radius:6px;background:var(--color-page-paper)}
.exo-bt{flex:none;display:flex;gap:4px}
.exo-bt .exc-btn{padding:0;font-size:16px}
.exo-cycle{margin:var(--space-2,8px) 0 0;font-size:var(--text-sm,13px);color:var(--color-ink-2)}
@media (max-width:420px){.exo-bt{flex-direction:column}.exo-bt .exc-btn{min-height:var(--touch-min,44px)}}`;

  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exo-css', CSS); const E = U.el;
    const d = ex.data || {};
    const seq = ex.sequence || ex.items || [];
    const n = seq.length;
    const rule = (ex.grading && ex.grading.rule) || (T0.book && T0.book.grading_defaults && T0.book.grading_defaults['ex.order']) || 'per_position';
    const allOrNothing = rule === 'all_or_nothing';
    const st = U.store(ctx, ex);
    const init = U.perm(n, d.shuffle);
    const valid = (a) => Array.isArray(a) && a.length === n && [...a].sort((x, y) => x - y).every((v, i) => v === i);
    const saved = st.get(null);
    let order = saved && valid(saved.order) ? saved.order.slice() : init.slice();
    let marks = null; // null | mảng true/false theo vị trí

    if (d.image) { const im = U.imgOrPage(d.image, null); if (im) { im.style.maxHeight = '220px'; im.style.margin = '0 auto var(--space-3,12px)'; el.append(im); } }
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_order_hint') }));
    const list = E('ol', { class: 'exo-list', 'aria-label': T0.t(ex.prompt) || T0.t(ex.title) || 'order' });
    el.append(list);
    if (d.layout === 'cycle') el.append(E('p', { class: 'exo-cycle', text: '↻ ' + U.s('exc_cycle') }));

    const itemText = (k) => { const v = seq[k]; return v && typeof v === 'object' && 'text' in v && !('uz' in v) ? T0.t(v.text) : T0.t(v); };
    const itemImg = (k) => { const v = seq[k]; return v && typeof v === 'object' && v.image ? v.image : null; };

    function move(from, to) {
      if (to < 0 || to >= n || from === to) return;
      const [x] = order.splice(from, 1); order.splice(to, 0, x);
      marks = null; st.set({ order }); draw(to);
    }
    function draw(focusPos) {
      const hadFocus = el.contains(document.activeElement);
      list.innerHTML = '';
      order.forEach((k, pos) => {
        const li = E('li', { class: 'exo-it' + (marks ? (marks[pos] ? ' ok' : ' bad') : ''), 'data-k': k });
        const h = E('button', { type: 'button', class: 'exo-h', 'aria-label': U.s('exc_drag'), title: U.s('exc_drag'), text: '⠿' });
        const tx = E('div', { class: 'exo-tx' });
        const im = itemImg(k); if (im) tx.append(E('img', { src: U.asset(im), alt: '', loading: 'lazy' }));
        tx.append(E('span', { text: itemText(k) }));
        const up = E('button', { type: 'button', class: 'exc-btn', 'aria-label': U.s('exc_up') + ': ' + itemText(k), text: '▲', 'data-dir': 'up' });
        const dn = E('button', { type: 'button', class: 'exc-btn', 'aria-label': U.s('exc_down') + ': ' + itemText(k), text: '▼', 'data-dir': 'down' });
        if (pos === 0) up.disabled = true;
        if (pos === n - 1) dn.disabled = true;
        up.onclick = () => move(pos, pos - 1);
        dn.onclick = () => move(pos, pos + 1);
        li.append(E('span', { class: 'exo-n', text: String(pos + 1) }), h, tx, E('div', { class: 'exo-bt' }, up, dn));
        list.append(li);
        dragify(h, li, pos);
      });
      if (focusPos != null) {
        const li = list.children[focusPos];
        const b = li && (li.querySelector('[data-dir="up"]:not([disabled])') || li.querySelector('[data-dir="down"]:not([disabled])'));
        if (b && hadFocus) b.focus({ preventScroll: true });
      }
    }
    // kéo thả bằng pointer: dời phần tử theo trục dọc, thả thì tính vị trí mới theo tâm các mục khác
    function dragify(handle, li, pos) {
      handle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        const y0 = e.clientY;
        const rects = [...list.children].map((c) => c.getBoundingClientRect());
        li.classList.add('drag');
        let target = pos;
        const onMove = (ev) => {
          const dy = ev.clientY - y0;
          li.style.transform = `translateY(${dy}px)`;
          const cy = rects[pos].top + rects[pos].height / 2 + dy;
          target = pos;
          rects.forEach((r, i) => { if (i < pos && cy < r.top + r.height / 2) target = Math.min(target, i); if (i > pos && cy > r.top + r.height / 2) target = Math.max(target, i); });
          [...list.children].forEach((c, i) => {
            if (i === pos) return;
            const h = rects[pos].height + 8;
            c.style.transform = (target > pos && i > pos && i <= target) ? `translateY(${-h}px)` : (target < pos && i < pos && i >= target) ? `translateY(${h}px)` : '';
          });
        };
        const onUp = () => {
          handle.removeEventListener('pointermove', onMove);
          handle.removeEventListener('pointerup', onUp);
          handle.removeEventListener('pointercancel', onUp);
          [...list.children].forEach((c) => { c.style.transform = ''; });
          li.classList.remove('drag');
          if (target !== pos) move(pos, target);
        };
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', onUp);
        handle.addEventListener('pointercancel', onUp);
      });
      // bàn phím trên tay cầm: mũi tên lên/xuống
      handle.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') { e.preventDefault(); move(pos, pos - 1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); move(pos, pos + 1); }
      });
    }
    draw();

    return {
      check() {
        const m = order.map((k, pos) => k === pos);
        const right = m.filter(Boolean).length;
        const ok = right === n;
        if (allOrNothing) { marks = ok ? m : null; }
        else marks = m;
        draw();
        const score = allOrNothing ? (ok ? 1 : 0) : (n ? right / n : 0);
        let feedback;
        if (ok) feedback = U.s('exc_all_right');
        else if (allOrNothing) feedback = T0.t(d.feedback_wrong) || T0.s('wrong');
        else feedback = U.s('exc_some_wrong') + ` (${right}/${n})`;
        st.set({ order });
        return { ok, score, feedback };
      },
      reset() { order = init.slice(); marks = null; st.set(null); draw(); },
      showSolution() { order = [...Array(n).keys()]; marks = order.map(() => true); draw(); },
      answer() { return order.slice(); },
      _set(arr) { order = arr.slice(); marks = null; draw(); },
    };
  }
  T0.registerEx('ex.order', { render });
})();
