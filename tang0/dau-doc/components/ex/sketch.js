/* ex.sketch — vẽ phác (agent C, đề xuất 003).
 * Dữ liệu: crop {page, volume?, box[x,y,w,h]%} (ảnh nền là phần cắt trang/vở) hoặc thư viện crop_box [trang,x,y,w,h];
 *   data.canvas_size [w,h] cho nền trống (mặc định 640×400). Nét lưu tọa độ chuẩn hóa 0..1: [{c: màu|'erase', w, p:[[x,y],…]}].
 * Không chấm / giáo viên chấm (giao_vien_review, v1): chỉ lưu nét (T0.store), Kiểm tra = Lưu. */
(function () {
  const T0 = window.T0;
  const COLORS = ['#14324A', '#C0392B', '#1F6FB2', '#1E7A3C'];
  const CSS = `.exsk-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 var(--space-2,8px)}
.exsk-tools .sw{width:var(--touch-min,44px);height:var(--touch-min,44px);border-radius:50%;border:3px solid var(--color-surface);box-shadow:0 0 0 1.5px var(--color-line);cursor:pointer;padding:0}
.exsk-tools .sw[aria-pressed="true"]{box-shadow:0 0 0 3px var(--color-accent)}
.exsk-tools .exc-btn[aria-pressed="true"]{border-color:var(--color-accent);background:var(--color-accent-soft)}
.exsk-pad{position:relative;width:100%;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);overflow:hidden;background:var(--color-page-paper)}
.exsk-pad .t0-crop{border-radius:0}
.exsk-pad canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}`;
  function render(el, ex, ctx) {
    const U = T0.exu; U.css('exsk-css', CSS); const E = U.el;
    const d = ex.data || {};
    let crop = ex.crop || null;
    if (!crop && Array.isArray(ex.crop_box)) crop = { page: ex.crop_box[0], box: ex.crop_box.slice(1) };
    const st = U.store(ctx, ex);
    let strokes = Array.isArray(st.get(null)) ? st.get(null) : [];
    let color = COLORS[0], erase = false;
    el.append(E('p', { class: 'exc-hint', text: U.s('exc_draw_hint') }));
    const tools = E('div', { class: 'exsk-tools', role: 'toolbar' });
    const sws = COLORS.map((c, i) => { const b = E('button', { type: 'button', class: 'sw', style: { background: c }, 'aria-label': U.s('exc_pen') + ' ' + (i + 1), 'aria-pressed': String(i === 0) }); b.onclick = () => { color = c; erase = false; tb(); }; tools.append(b); return b; });
    const er = E('button', { type: 'button', class: 'exc-btn', 'aria-pressed': 'false', title: U.s('exc_eraser') }, '⌫ ' + U.s('exc_eraser'));
    er.onclick = () => { erase = !erase; tb(); };
    const un = E('button', { type: 'button', class: 'exc-btn', title: U.s('exc_undo'), 'aria-label': U.s('exc_undo') }, '↶');
    un.onclick = () => { strokes.pop(); save(); redraw(); };
    const cl = E('button', { type: 'button', class: 'exc-btn', title: U.s('exc_clear') }, U.s('exc_clear'));
    cl.onclick = () => { strokes = []; save(); redraw(); };
    tools.append(er, un, cl); el.append(tools);
    function tb() { sws.forEach((b, i) => b.setAttribute('aria-pressed', String(!erase && COLORS[i] === color))); er.setAttribute('aria-pressed', String(erase)); }

    const pad = E('div', { class: 'exsk-pad' });
    if (crop && crop.page) pad.append(T0.ui.pageCrop(crop.page, crop.box || [0, 0, 100, 100], { volume: crop.volume }));
    else { const [w, h] = Array.isArray(d.canvas_size) ? d.canvas_size : [640, 400]; pad.style.aspectRatio = `${w} / ${h}`; pad.style.background = 'var(--color-surface)'; }
    const cv = E('canvas', { 'aria-label': T0.t(ex.prompt) || 'sketch', role: 'img' });
    pad.append(cv); el.append(pad);
    const g = cv.getContext('2d');
    function size() {
      const r = cv.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
      if (!r.width) return;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); redraw();
    }
    function line(s) {
      const W = cv.width, H = cv.height, dpr = window.devicePixelRatio || 1;
      g.globalCompositeOperation = s.c === 'erase' ? 'destination-out' : 'source-over';
      g.strokeStyle = s.c === 'erase' ? '#000' : s.c; g.lineWidth = (s.c === 'erase' ? 18 : 3) * dpr; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath();
      s.p.forEach(([x, y], k) => (k ? g.lineTo(x * W, y * H) : g.moveTo(x * W, y * H)));
      if (s.p.length === 1) g.lineTo(s.p[0][0] * W + 0.1, s.p[0][1] * H);
      g.stroke();
    }
    function redraw() { g.clearRect(0, 0, cv.width, cv.height); strokes.forEach(line); }
    function save() { st.set(strokes); }
    let cur = null;
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [+((e.clientX - r.left) / r.width).toFixed(4), +((e.clientY - r.top) / r.height).toFixed(4)]; };
    cv.addEventListener('pointerdown', (e) => { e.preventDefault(); cv.setPointerCapture(e.pointerId); cur = { c: erase ? 'erase' : color, p: [pt(e)] }; strokes.push(cur); line(cur); });
    cv.addEventListener('pointermove', (e) => { if (!cur) return; cur.p.push(pt(e)); redraw(); });
    const end = () => { if (!cur) return; cur = null; if (strokes.length > 400) strokes = strokes.slice(-400); save(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    const ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(cv); else setTimeout(size, 50);
    requestAnimationFrame(size);
    return {
      noCheck: true,
      check() { return strokes.length ? { ok: null, feedback: T0.s('saved') } : { empty: true, feedback: U.s('exc_draw_hint') }; },
      reset() { strokes = []; save(); redraw(); },
      answer() { return strokes; },
      _draw(pts) { strokes.push({ c: color, p: pts }); save(); redraw(); },
    };
  }
  T0.registerEx('ex.sketch', { render });
})();
