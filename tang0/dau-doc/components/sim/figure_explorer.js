/* sim.figure_explorer – khám phá hình có điểm nóng đánh số (R1).
 * params nhận 3 dạng:
 *  1) {figure: <id trong book.figures> | <đối tượng figure>}  (schema $defs/figure: page, box, src?, caption, intro, points[{x,y,name,desc}])
 *  2) dạng thư viện: {background:'page_crop'|'image', page?, b|box, src?, cap, intro, items[{x,y,name,desc}]}
 *  3) dạng tabiiy5 mountFlower: {viewbox:[x,y,w,h], parts[{name, function, hx, hy}]} – hình vẽ bằng mã chưa tham số hóa,
 *     ảnh nền lấy từ params.background_src (vd. 'sim/flower.svg' do R2 xuất, phủ đúng viewbox); thiếu ảnh thì nền trống.
 * Mở từ ghim: T0.renderSim(el, {kind:'sim.figure_explorer', params:{figure:'p37.rasm4'}}). */
(function () {
  const T0 = window.T0;
  const CSS = `
.fx{display:flex;flex-direction:column;gap:var(--space-3,12px)}
.fx-intro{margin:0;line-height:var(--lh-body,1.5);font-size:var(--text-ui,15px)}
.fx-stage{position:relative;border:1px solid var(--color-line);border-radius:var(--radius-md,10px);overflow:hidden;background:var(--color-page-paper)}
.fx-stage .t0-crop{border-radius:0}
.fx-dot{position:absolute;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;border:2px solid var(--pin-ring,#fff);background:var(--pin-figure);color:#fff;font:700 13px/1 var(--font-body);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-pin);cursor:pointer;padding:0}
.fx-dot[aria-pressed="true"]{background:var(--pin-active);color:#14324A;transform:translate(-50%,-50%) scale(1.15)}
.fx-dot:focus-visible{outline:3px solid var(--color-accent);outline-offset:2px}
.fx-info{min-height:3em;background:var(--color-surface-2);border-radius:var(--radius-md,10px);padding:var(--space-3,12px);font-size:var(--text-ui,15px);line-height:var(--lh-body,1.5)}
.fx-info h3{margin:0 0 4px;font-size:var(--text-body,16px)}
.fx-info p{margin:0}
.fx-list{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);list-style:none;margin:0;padding:0}
.fx-list button{min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-sm,13px);padding:0 var(--space-3,12px);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.fx-list button b{display:inline-flex;width:22px;height:22px;border-radius:50%;background:var(--pin-figure);color:#fff;align-items:center;justify-content:center;font-size:12px}
.fx-list button[aria-pressed="true"]{border-color:var(--pin-figure);background:var(--color-accent-soft)}
.fx-row{display:flex;gap:var(--space-2,8px);flex-wrap:wrap}`;
  function css() { if (!document.getElementById('fx-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'fx-css', textContent: CSS })); }
  const TOUR = { uz: 'Sayohat', ru: 'Обзор', vi: 'Tham quan' };
  const LISTEN = { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' };

  function normalize(params) {
    let f = params.figure;
    if (typeof f === 'string') f = T0.find('figure', f);
    if (f) return { page: f.page, box: f.box, src: f.src, caption: f.caption, intro: f.intro, no: f.no, points: (f.points || []).map((p) => ({ x: p.x, y: p.y, name: p.name, desc: p.desc })) };
    if (params.parts) {
      const [vx, vy, vw, vh] = params.viewbox || [0, 0, 100, 100];
      return { blank: vw / vh, bgSrc: params.background_src || params.src || null, caption: params.cap || params.caption, intro: params.intro, points: params.parts.map((p) => ({ x: ((p.hx - vx) / vw) * 100, y: ((p.hy - vy) / vh) * 100, name: p.name, desc: p.function || p.desc })) };
    }
    return { page: params.page, box: params.b || params.box, src: params.src, caption: params.cap || params.caption, intro: params.intro, no: params.no, points: params.items || params.points || [] };
  }

  T0.registerSim('sim.figure_explorer', {
    mount(el, params, ctx) {
      css();
      const E = T0.ui.el;
      const F = normalize(params || {});
      const root = E('div', { class: 'fx' });
      el.append(root);
      let sel = -1, tourTimer = null;
      const offLang = T0.on('t0:lang', () => draw());
      function draw() {
        root.innerHTML = '';
        if (F.intro) root.append(E('p', { class: 'fx-intro', text: T0.t(F.intro) }));
        const stage = E('div', { class: 'fx-stage' });
        if (F.blank) {
          const box = E('div', { style: { aspectRatio: String(F.blank), width: '100%', position: 'relative' } });
          if (F.bgSrc) {
            const im = E('img', { src: T0.asset(F.bgSrc), alt: T0.t(F.caption), style: { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'fill' } });
            im.onerror = () => im.remove();
            box.append(im);
          }
          stage.append(box);
        }
        else if (F.src && !F.box) stage.append(E('img', { src: T0.asset(F.src), alt: T0.t(F.caption), style: { display: 'block', width: '100%' } }));
        else stage.append(T0.ui.pageCrop(F.page, F.box, { src: F.src, alt: T0.t(F.caption) }));
        const info = E('div', { class: 'fx-info', 'aria-live': 'polite' });
        const list = E('ul', { class: 'fx-list' });
        const dots = F.points.map((p, i) => {
          const d = E('button', { type: 'button', class: 'fx-dot k-hit', style: { left: p.x + '%', top: p.y + '%' }, 'aria-label': (i + 1) + '. ' + T0.t(p.name), 'aria-pressed': 'false', text: String(i + 1) });
          d.onclick = () => pick(i);
          stage.append(d);
          const lb = E('button', { type: 'button', 'aria-pressed': 'false' }, E('b', { text: String(i + 1) }), T0.t(p.name));
          lb.onclick = () => pick(i);
          list.append(E('li', null, lb));
          return [d, lb];
        });
        function pick(i, speak) {
          sel = i;
          dots.forEach(([d, lb], j) => { d.setAttribute('aria-pressed', String(i === j)); lb.setAttribute('aria-pressed', String(i === j)); });
          const p = F.points[i];
          info.innerHTML = '';
          info.append(E('h3', { text: (i + 1) + '. ' + T0.t(p.name) }), E('p', { text: T0.t(p.desc) }));
          if (speak) return T0.media.speak([T0.t(p.name), T0.t(p.desc)].join('. '));
        }
        const row = E('div', { class: 'fx-row' });
        const tour = T0.ui.button('▶ ' + T0.t(TOUR), async () => {
          if (tourTimer) { tourTimer = null; T0.media.stop(); tour.textContent = '▶ ' + T0.t(TOUR); return; }
          tourTimer = 1; tour.textContent = '■ ' + T0.t(TOUR);
          for (let i = 0; i < F.points.length && tourTimer; i++) { await pick(i, true); await new Promise((r) => setTimeout(r, 400)); }
          tourTimer = null; tour.textContent = '▶ ' + T0.t(TOUR);
        });
        row.append(tour);
        if (F.intro) row.append(T0.ui.button('🔊 ' + T0.t(LISTEN), () => T0.media.speak(T0.t(F.intro))));
        root.append(stage, info, list, row);
        if (sel >= 0) pick(sel); else info.textContent = T0.t(F.caption);
      }
      draw();
      return { unmount() { tourTimer = null; offLang(); T0.media.stop(); root.remove(); }, pick: (i) => root.querySelectorAll('.fx-dot')[i].click() };
    },
  });
})();
