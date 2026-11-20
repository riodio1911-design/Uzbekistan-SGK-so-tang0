/* sim.triangle_area — agent F (005). params {b, h, apex (vị trí đỉnh theo phần đáy, có thể <0 hoặc >1), show:'plain'|'height'|'rect', mode?}.
 * Vẽ tam giác, đường cao, hình chữ nhật bao; S = a × h ÷ 2. Chú thích đa ngữ. */
(function () {
  const T0 = window.T0;
  const num = (x) => +(+x).toFixed(2);
  T0.registerSim('sim.triangle_area', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el, inter = K.interactive(params, ctx);
      const v = { b: +params.b || 6, h: +params.h || 4, apex: params.apex == null ? 0.5 : +params.apex, show: params.show || 'plain' };
      if (inter && v.show === 'plain') v.show = 'height';
      return K.shell(el, {
        kind: 'sim.triangle_area',
        draw(view) {
          const ax = v.apex * v.b, x0 = Math.min(0, ax), x1 = Math.max(v.b, ax);
          const sc = Math.min(230 / Math.max(x1 - x0, 1), 170 / v.h);
          const W = (x1 - x0) * sc + 130, H = v.h * sc + 50;
          const X = (x) => ((x - x0) * sc + 65).toFixed(1), Y = (y) => (H - 28 - y * sc).toFixed(1);
          const sh = v.show; let s = '';
          if (sh === 'rect') s += `<rect x="${X(x0)}" y="${Y(v.h)}" width="${((x1 - x0) * sc).toFixed(1)}" height="${(v.h * sc).toFixed(1)}" fill="none" stroke="currentColor" stroke-opacity=".6" stroke-dasharray="5 4"/>`;
          s += `<path d="M${X(0)} ${Y(0)}L${X(v.b)} ${Y(0)}L${X(ax)} ${Y(v.h)}Z" fill="${K.C.b}" fill-opacity=".55" stroke="currentColor" stroke-width="2"/>`;
          if (sh !== 'plain') {
            const right = ax > v.b / 2;
            s += `<path d="M${X(ax)} ${Y(v.h)}L${X(ax)} ${Y(0)}" stroke="${K.C.a}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
            if (ax < 0 || ax > v.b) s += `<path d="M${X(ax < 0 ? 0 : v.b)} ${Y(0)}L${X(ax)} ${Y(0)}" stroke="currentColor" stroke-opacity=".6" stroke-dasharray="4 4"/>`;
            s += `<path d="M${(+X(ax) + (right ? -9 : 9)).toFixed(1)} ${Y(0)}v-9h${right ? 9 : -9}" fill="none" stroke="${K.C.a}" stroke-width="1.5"/>`;
            s += `<text x="${(+X(ax) + (right ? 8 : -8)).toFixed(1)}" y="${Y(v.h / 2)}" fill="${K.C.a}" font-size="15" font-weight="700" text-anchor="${right ? 'start' : 'end'}">h = ${K.fmt(v.h)}</text>`;
          }
          s += `<text x="${X(v.b / 2)}" y="${(+Y(0) + 19).toFixed(1)}" fill="currentColor" font-size="15" font-weight="700" text-anchor="middle">a = ${K.fmt(v.b)}</text>`;
          view.append(E('div', { class: 't0m-fig' }, K.svg(Math.round(W), Math.round(H), s, `a=${v.b}, h=${v.h}`)));
          if (sh !== 'plain') view.append(E('div', { class: 't0m-big', text: `S = a × h ÷ 2 = ${K.fmt(v.b)} × ${K.fmt(v.h)} ÷ 2 = ${K.fmt(num((v.b * v.h) / 2))}` }));
          if (sh === 'rect') {
            const rr = K.fmt(num((x1 - x0) * v.h));
            view.append(E('div', { class: 't0m-note', text: K.t('rect_note', { r: x1 - x0 > v.b ? rr + ' (' + K.t('rect_base', { r: K.fmt(num(v.b * v.h)) }) + ')' : rr }) }));
          }
        },
        controls: inter ? (c, draw) => {
          c.append(K.range(K.t('base'), v.b, 1, 20, 1, (x) => { v.b = x; draw(); }),
            K.range(K.t('height_h'), v.h, 1, 20, 1, (x) => { v.h = x; draw(); }),
            K.range(K.t('apex'), v.apex, -0.6, 1.6, 0.05, (x) => { v.apex = x; draw(); }),
            K.seg('', [['height', 'h', K.t('show_height')], ['rect', '▭', K.t('show_rect')]], v.show, (s) => { v.show = s; draw(); }));
        } : null,
      });
    },
  });
})();
