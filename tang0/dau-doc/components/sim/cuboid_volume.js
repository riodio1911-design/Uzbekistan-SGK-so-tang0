/* sim.cuboid_volume — agent F (005). params {l, w, h, mode?}. Hình hộp ghép từ khối lập phương đơn vị (phép chiếu xiên),
 * V = l × w × h và câu "Bir qavatda … kub" đa ngữ. */
(function () {
  const T0 = window.T0;
  T0.registerSim('sim.cuboid_volume', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el;
      const v = { l: Math.max(1, +params.l || 1), w: Math.max(1, +params.w || 1), h: Math.max(1, +params.h || 1) };
      return K.shell(el, {
        kind: 'sim.cuboid_volume',
        draw(view) {
          const u = Math.min(30, 210 / (v.l + v.w * 0.5), 150 / (v.h + v.w * 0.5)), dx = u * 0.5, dy = u * 0.35;
          const W = v.l * u + v.w * dx + 8, H = v.h * u + v.w * dy + 8; let s = '';
          for (let z = v.w - 1; z >= 0; z--) for (let y = 0; y < v.h; y++) for (let x = 0; x < v.l; x++) {
            if (!(z === 0 || y === v.h - 1 || x === v.l - 1)) continue;
            const px = (4 + x * u + z * dx).toFixed(1), py = (H - 4 - (y + 1) * u - z * dy).toFixed(1), U = u.toFixed(1);
            s += `<g stroke="${K.C.dark}" stroke-width="1"><rect x="${px}" y="${py}" width="${U}" height="${U}" fill="${K.C.b}"/><path d="M${px} ${py}l${dx.toFixed(1)} ${(-dy).toFixed(1)}h${U}l${(-dx).toFixed(1)} ${dy.toFixed(1)}z" fill="#A8D4FA"/><path d="M${(+px + u).toFixed(1)} ${py}l${dx.toFixed(1)} ${(-dy).toFixed(1)}v${U}l${(-dx).toFixed(1)} ${dy.toFixed(1)}z" fill="#3D8ED0"/></g>`;
          }
          view.append(E('div', { class: 't0m-fig' }, K.svg(Math.round(W), Math.round(H), s, `${v.l}×${v.w}×${v.h}`)),
            E('div', { class: 't0m-big', text: `V = ${v.l} × ${v.w} × ${v.h} = ${K.fmt(v.l * v.w * v.h)}` }),
            E('div', { class: 't0m-note', text: K.t('layers', { a: v.l * v.w, h: v.h }) }));
        },
        controls: K.interactive(params, ctx) ? (c, draw) => {
          c.append(K.range(K.t('length'), v.l, 1, 10, 1, (x) => { v.l = x; draw(); }),
            K.range(K.t('width'), v.w, 1, 8, 1, (x) => { v.w = x; draw(); }),
            K.range(K.t('height'), v.h, 1, 8, 1, (x) => { v.h = x; draw(); }));
        } : null,
      });
    },
  });
})();
