/* components/sim/scene_vk.js — agent B (đề xuất 001). Cảnh "video" dạng thẻ/hình (mẫu window.VK của tabiiy5,
 * biologiya5; __DRAW.cIcons của kimyo8, fizika8), theo params của thu-vien/mo-phong/danh-muc.json:
 *   sim.scene_cards      {title, items:[chuoi_da_ngu], c1?, min?, n?}       thẻ ý hiện dần, màu xoay vòng
 *   sim.scene_explain    {img, title, points:[chuoi_da_ngu], c1?, min?}     ảnh (zoom chậm) + điểm giải thích
 *   sim.scene_icon_grid  {title?, items:[{e: emoji | img: url, t}], c1?}    lưới hình + nhãn, hiện lần lượt
 *   sim.scene_page_image {crop:{page, box, volume?} | crop:[x,y,w,h] + page | crop:[page,x,y,w,h]}  (a) cắt ảnh trang
 *                        {img, z0=1.02, z1=1.14, fx=.5, fy=.5, fit, bg, title?}                    (b) ảnh rời Ken Burns (VK.photo)
 * sim.scene_page_image thay bản tối thiểu trong scene_player.js (chỉ nhận crop): bản này nhận cả img và volume.
 * c1 (màu nền sáng của SVG cũ) không dùng: cảnh vẽ trên sân khấu tối thống nhất của trình phát. */
(function () {
  const T0 = window.T0;
  const K = () => T0.sceneKit;

  const CSS = `
.sk-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:var(--space-3,12px)}
.sk-card{--h:#5FB8F5;border-radius:var(--radius-md,10px);padding:.8em .9em;background:color-mix(in srgb,var(--h) 24%,#0F2433);border-left:5px solid var(--h);font-size:clamp(15px,3.9vw,18px);font-weight:700;min-width:0}
.sk-card:nth-child(5n+2){--h:#7DD87F}.sk-card:nth-child(5n+3){--h:#F5B04F}.sk-card:nth-child(5n+4){--h:#F59AC0}.sk-card:nth-child(5n+5){--h:#B79CF7}
.sk-explain{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--space-3,12px);align-items:center}
@media (min-width:640px){.sk-explain{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr)}}
.sk-media{position:relative;overflow:hidden;border-radius:var(--radius-md,10px);background:#1C3446;aspect-ratio:4/3;max-height:46vh;width:100%}
.sk-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.sk-kb{animation:sk-kb var(--kb-dur,9s) ease-out forwards;transform:scale(var(--z0,1));transform-origin:var(--fx,50%) var(--fy,50%)}
@keyframes sk-kb{from{transform:scale(var(--z0,1))}to{transform:scale(var(--z1,1.1))}}
.sk-still .sk-kb{animation:none;transform:scale(var(--z1,1.1))}
.sk-noimg{position:absolute;inset:0;display:grid;place-items:center;color:#7F9AAC}
.sk-noimg svg{width:30%;max-width:96px;height:auto}
.sk-points{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.5em;font-size:clamp(15px,3.8vw,18px)}
.sk-points li{display:flex;gap:.6em;align-items:flex-start;font-weight:600}
.sk-points li::before{content:"";flex:none;width:.55em;height:.55em;border-radius:50%;background:var(--hue-gold,#E8A317);margin-top:.45em}
.sk-points li>div{min-width:0;flex:1}
.sk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(46%,150px),1fr));gap:var(--space-3,12px)}
.sk-tile{display:flex;flex-direction:column;align-items:center;gap:.45em;text-align:center;padding:.7em .5em;border-radius:var(--radius-md,10px);background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);font-size:clamp(14px,3.6vw,17px);font-weight:700;min-width:0}
.sk-emoji{font-size:clamp(40px,11vw,60px);line-height:1.1;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}
.sk-tile .sk-media{aspect-ratio:4/3;max-height:none}
.sk-tile>div{width:100%}
.sk-photo .sk-media{aspect-ratio:16/9;max-height:56vh}
.sk-photo figcaption{font-family:var(--font-display);font-weight:800;font-size:clamp(16px,4.2vw,21px);line-height:1.25}
.sk-photo figure{margin:0;display:flex;flex-direction:column;gap:var(--space-2,8px)}
.sk-crop{max-width:100%;margin:0 auto;width:100%}`;
  const css = () => { if (!document.getElementById('sk-vk-css')) { const s = document.createElement('style'); s.id = 'sk-vk-css'; s.textContent = CSS; document.head.append(s); } };
  const NOIMG = '<svg viewBox="0 0 96 64" aria-hidden="true"><rect x="2" y="2" width="92" height="60" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="30" cy="24" r="7" fill="currentColor"/><path d="M10 54l22-20 14 12 12-9 26 17z" fill="currentColor"/></svg>';

  /* ảnh có khung + dự phòng khi thiếu tệp (không hiện khung "chưa hỗ trợ": dữ liệu đúng, chỉ thiếu tệp ở bản xem trước) */
  function media(src, alt, kb) {
    const box = K().E('div', 'sk-media');
    if (!src) { box.innerHTML = `<div class="sk-noimg">${NOIMG}</div>`; return box; }
    const img = document.createElement('img');
    img.alt = alt || ''; img.decoding = 'async'; img.draggable = false;
    img.src = K().asset(src);
    if (kb) {
      img.className = 'sk-kb';
      img.style.setProperty('--z0', kb.z0); img.style.setProperty('--z1', kb.z1);
      img.style.setProperty('--fx', (kb.fx * 100) + '%'); img.style.setProperty('--fy', (kb.fy * 100) + '%');
      img.style.setProperty('--kb-dur', kb.dur + 's');
      img.style.objectPosition = (kb.fx * 100) + '% ' + (kb.fy * 100) + '%';
      if (kb.fit === 'contain' || /meet/.test(kb.fit || '')) img.style.objectFit = 'contain';
    }
    img.onerror = () => { img.remove(); box.insertAdjacentHTML('beforeend', `<div class="sk-noimg" title="${String(src).replace(/"/g, '&quot;')}">${NOIMG}</div>`); };
    box.append(img);
    return box;
  }
  const title = (p, root) => { if (p.title) root.append(K().line(p.title, 'sk-title', 'h4')); };

  T0.registerSim('sim.scene_cards', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        title(p, root);
        const g = K().E('div', 'sk-cards');
        const nodes = (Array.isArray(p.items) ? p.items : []).map((it) => K().line(it, 'sk-card'));
        g.append(...nodes); root.append(g);
        if (o.animate) K().reveal(nodes, 0.9);
      }, 'cards');
    },
  });

  T0.registerSim('sim.scene_explain', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        const wrap = K().E('div', 'sk-explain');
        const m = media(p.img, K().txt(p.title), { z0: 1, z1: 1.1, fx: 0.5, fy: 0.5, dur: K().num(p.min, 9) });
        const side = K().E('div', '');
        title(p, side);
        const ul = K().E('ul', 'sk-points');
        const nodes = (Array.isArray(p.points) ? p.points : []).map((pt) => { const li = K().E('li', ''); li.append(K().line(pt, '')); return li; });
        ul.append(...nodes); side.append(ul);
        wrap.append(m, side); root.append(wrap);
        if (o.animate) K().reveal(nodes, 1.0);
      }, 'explain');
    },
  });

  T0.registerSim('sim.scene_icon_grid', {
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p, o) => {
        title(p, root);
        const g = K().E('div', 'sk-grid');
        const nodes = (Array.isArray(p.items) ? p.items : []).map((it) => {
          const lab = it.t != null ? it.t : it.label;
          const tile = K().E('div', 'sk-tile');
          if (it.img) tile.append(media(it.img, K().txt(lab)));
          else { const e = K().E('span', 'sk-emoji', it.e || '•'); e.setAttribute('aria-hidden', 'true'); tile.append(e); }
          tile.append(K().line(lab, ''));
          return tile;
        });
        g.append(...nodes); root.append(g);
        if (o.animate) K().reveal(nodes, 0.7, 'sk-pop');
      }, 'grid');
    },
  });

  /* ---------- sim.scene_page_image: (a) cắt ảnh trang, (b) ảnh rời Ken Burns ---------- */
  function normCrop(p) {
    let c = p.crop, page = p.page, box = null, volume = p.volume;
    if (Array.isArray(c)) { if (c.length >= 5) { page = c[0]; box = c.slice(1, 5); } else box = c.slice(0, 4); }
    else if (c && typeof c === 'object') { page = c.page != null ? c.page : page; box = c.box; volume = c.volume || volume; }
    return page != null ? { page: +page, box: box || [0, 0, 100, 100], volume } : null;
  }
  const pageImageDef = {
    __b: true,
    mount(el, params) {
      css();
      return K().mount(el, params, (root, p) => {
        root.classList.add('sk-photo');
        if (p.img || p.src) {
          const fig = K().E('figure', '');
          const z0 = K().num(p.z0, 1.02), z1 = K().num(p.z1, 1.14);
          const m = media(p.img || p.src, K().txt(p.title), { z0, z1, fx: K().num(p.fx, 0.5), fy: K().num(p.fy, 0.5), fit: p.fit, dur: K().num(p.min, 8) });
          if (p.bg) m.style.background = p.bg;
          fig.append(m);
          if (p.title) fig.append(K().line(p.title, '', 'figcaption'));
          root.append(fig);
          return;
        }
        const c = normCrop(p);
        if (!c) { root.append(K().E('div', 'sk-media', '')); root.lastChild.innerHTML = `<div class="sk-noimg">${NOIMG}</div>`; return; }
        const box = K().E('div', 'sk-crop');
        box.append(T0.ui.pageCrop(c.page, c.box, { volume: c.volume, alt: K().txt(p.title) }));
        root.append(box);
        if (p.title) root.append(K().line(p.title, 'sk-title', 'h4'));
      }, 'page');
    },
  };
  T0.registerSim('sim.scene_page_image', pageImageDef);
  /* scene_player.js (nạp sau theo thứ tự chữ cái) đăng ký lại bản chỉ-crop: giữ bản đầy đủ này */
  if (T0.on) T0.on('t0:simreg', (e) => {
    if (e.detail && e.detail.id === 'sim.scene_page_image' && T0._sim && T0._sim['sim.scene_page_image'] !== pageImageDef) {
      T0.registerSim('sim.scene_page_image', pageImageDef);
    }
  });
})();
