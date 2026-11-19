/* components/sim/scene_kit.js — agent B (đề xuất 001). Tiện ích chung cho các cảnh "video" dạng chữ/thẻ
 * (scene_text.js, scene_vk.js). Cảnh vẽ bên trong sân khấu tối của sim.scene_player (.sp-stage), nhưng cũng
 * chạy độc lập (nền tối riêng khi không nằm trong .sp-stage).
 *
 * T0.sceneKit = {
 *   css(),                         chèn CSS chung (một lần)
 *   E(tag, cls, ...kids),          tạo phần tử; chuỗi con dựng phân số qua T0.math.frag
 *   txt(v) -> chuỗi theo T0.lang;   sub(v) -> chuỗi bản gốc (lang_base) khi đang xem bản dịch, ngược lại ''
 *   line(v, cls) -> phần tử: dòng chính + (nếu có) dòng gốc nhỏ bên dưới
 *   reveal(nodes, delayS)          hiện lần lượt (animation-delay i*delayS); tôn trọng prefers-reduced-motion
 *   mount(el, params, build)       khung chuẩn: build(root, params, {animate}) ; tự vẽ lại khi đổi ngôn ngữ
 *   asset(p), num(v, d)
 * }
 */
(function () {
  const T0 = window.T0 = window.T0 || {};
  if (T0.sceneKit) return;

  const CSS = `
.sk{position:relative;width:100%;color:#fff;font-family:var(--font-body);line-height:1.35;display:flex;flex-direction:column;gap:var(--space-3,12px);min-width:0}
.sk.sk-solo{background:var(--color-video-bg,#0F2433);border-radius:var(--radius-md,10px);padding:var(--space-4,16px)}
.sk *{box-sizing:border-box}
.sk-in{opacity:0;transform:translateY(10px);animation:sk-in .55s cubic-bezier(.2,.7,.2,1) forwards}
.sk-pop{opacity:0;transform:scale(.86);animation:sk-pop .5s cubic-bezier(.2,.8,.25,1.2) forwards}
@keyframes sk-in{to{opacity:1;transform:none}}
@keyframes sk-pop{to{opacity:1;transform:none}}
.sk.sk-still .sk-in,.sk.sk-still .sk-pop{animation:none;opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.sk .sk-in,.sk .sk-pop{animation:none;opacity:1;transform:none}.sk .sk-kb{animation:none!important}}
.sk-title{margin:0;font-family:var(--font-display);font-weight:800;font-size:clamp(18px,4.6vw,24px);line-height:1.25;color:#fff;overflow-wrap:anywhere}
.sk-sub{display:block;font-size:.72em;font-weight:500;color:#A9C3D3;margin-top:2px;overflow-wrap:anywhere}
.sk-title .sk-sub{font-family:var(--font-body)}
.sk-main{overflow-wrap:anywhere}`;

  const css = () => { if (!document.getElementById('sk-css')) { const s = document.createElement('style'); s.id = 'sk-css'; s.textContent = CSS; document.head.append(s); } };
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  const base = () => ((T0.book && T0.book.profile) || {}).lang_base || 'uz';
  const txt = (v) => (v == null ? '' : typeof v === 'string' || typeof v === 'number' ? String(v) : (T0.t ? T0.t(v) : v.uz || ''));
  /* bản gốc nhỏ bên dưới: cùng quy tắc với renderEx của core (đang xem bản dịch, chuỗi có bản gốc khác bản đang xem) */
  const sub = (v) => {
    if (!isObj(v)) return '';
    const b = base(), l = T0.lang || 'uz';
    if (l === b || !v[l] || !v[b] || v[l] === v[b]) return '';
    return v[b];
  };
  function addText(e, s) {
    if (s == null || s === '') return;
    if (T0.math && T0.math.has(String(s))) e.append(T0.math.frag(String(s)));
    else e.append(document.createTextNode(String(s)));
  }
  function E(tag, cls, ...kids) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    for (const k of kids.flat()) { if (k == null || k === false) continue; if (k.nodeType) e.append(k); else addText(e, k); }
    return e;
  }
  function line(v, cls, tag) {
    const e = E(tag || 'div', cls);
    e.append(E('span', 'sk-main', txt(v)));
    const s = sub(v);
    if (s) { const sp = E('span', 'sk-sub', s); sp.lang = base(); e.append(sp); }
    return e;
  }
  function reveal(nodes, delayS, cls) {
    nodes.forEach((n, i) => { n.classList.add(cls || 'sk-in'); n.style.animationDelay = (i * delayS).toFixed(2) + 's'; });
  }
  const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : (v != null && isFinite(+v) && v !== '' ? +v : d));
  const asset = (p) => (!p ? '' : T0.asset ? T0.asset(p) : p);

  /* khung chuẩn: vẽ một lần có hiệu ứng; đổi ngôn ngữ thì vẽ lại tĩnh (scene_player cũng tự dựng lại cảnh) */
  function mount(el, params, build, kind) {
    css();
    const root = document.createElement('div');
    root.className = 'sk sk-' + kind + (el.closest && el.closest('.sp-stage') ? '' : ' sk-solo');
    el.append(root);
    let extra = null;
    const draw = (animate) => {
      if (extra && extra.cleanup) extra.cleanup();
      root.innerHTML = '';
      root.classList.toggle('sk-still', !animate);
      extra = build(root, params || {}, { animate }) || null;
    };
    draw(true);
    const off = T0.on ? T0.on('t0:lang', () => draw(false)) : null;
    return { el: root, unmount() { off && off(); if (extra && extra.cleanup) extra.cleanup(); root.remove(); } };
  }

  T0.sceneKit = { css, E, txt, sub, line, reveal, mount, num, asset, isObj };
})();
