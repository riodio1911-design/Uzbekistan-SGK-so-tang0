/* sim.fraction_area — agent F (005). params {a:{n,d}, b:{n,d}, mode?}. Mô hình diện tích của a × b:
 * hình vuông chia a.d cột × b.d hàng, tô cột (a) và hàng (b), phần giao = tích. Câu chú thích đa ngữ. */
(function () {
  const T0 = window.T0;
  T0.registerSim('sim.fraction_area', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el;
      const fix = (f, dn, dd) => ({ n: Math.max(0, +((f || {}).n) || dn), d: Math.max(1, +((f || {}).d) || dd) });
      const v = { a: fix(params.a, 1, 3), b: fix(params.b, 2, 3) };
      return K.shell(el, {
        kind: 'sim.fraction_area',
        draw(view) {
          const a = v.a, b = v.b, S = 200; let s = '';
          for (let i = 0; i < a.d; i++) for (let j = 0; j < b.d; j++) {
            const ia = i < a.n, ib = j < b.n;
            s += `<rect x="${((i * S) / a.d).toFixed(1)}" y="${((j * S) / b.d).toFixed(1)}" width="${(S / a.d).toFixed(1)}" height="${(S / b.d).toFixed(1)}" fill="${ia && ib ? K.C.c : ia ? K.C.b : ib ? K.C.a : 'none'}" fill-opacity="${ia && ib ? 1 : 0.45}" stroke="currentColor" stroke-width="1.2"/>`;
          }
          const sv = K.svg(204, 204, `<g transform="translate(2 2)">${s}</g>`, `${a.n}/${a.d} × ${b.n}/${b.d}`);
          view.append(E('div', { class: 't0m-fig' }, sv),
            E('div', { class: 't0m-big' }, K.frac(a.n, a.d), ' × ', K.frac(b.n, b.d), ' = ', K.frac(a.n * b.n, a.d * b.d)),
            E('div', { class: 't0m-note', text: K.t('area_note', { t: a.d * b.d, k: a.n * b.n }) }));
        },
        controls: K.interactive(params, ctx) ? (c, draw) => {
          [['a', 'first'], ['b', 'second']].forEach(([k, lab]) => {
            const f = v[k];
            const nr = K.range(K.t(lab) + ' · ' + K.t('numerator'), f.n, 1, f.d, 1, (x) => { f.n = x; draw(); });
            const nIn = nr.querySelector('input');
            c.append(nr, K.range(K.t(lab) + ' · ' + K.t('denominator'), f.d, 2, 10, 1, (x) => { f.d = x; nIn.max = x; if (f.n > x) { f.n = x; nIn.value = x; nr.querySelector('output').textContent = x; } draw(); }));
          });
        } : null,
      });
    },
  });
})();
