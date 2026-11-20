/* sim.place_value — agent F (005). params {n, mode?:'interactive'}. Bảng hàng + khai triển tổng (325 146 = 300 000 + …).
 * Tên hàng đa ngữ (T0.mathKit.UI.places) thay mảng PVN tiếng Uzbek của mã cũ. */
(function () {
  const T0 = window.T0;
  function digits(n) { // 8 hàng nguyên
    const s = String(Math.max(0, Math.round(n))).padStart(8, ' ').slice(-8);
    return s.split('').map((c) => (c === ' ' ? '' : c));
  }
  T0.registerSim('sim.place_value', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el;
      const v = { n: +params.n || 325146 };
      return K.shell(el, {
        kind: 'sim.place_value',
        draw(view) {
          const a = digits(v.n), f = Math.max(0, a.findIndex((x) => x !== '')), P = K.places();
          const tb = E('table', { class: 't0m-pvt' });
          const hr = E('tr'), dr = E('tr');
          for (let i = f; i < 8; i++) { hr.append(E('th', { scope: 'col', text: P[i] })); dr.append(E('td', { text: a[i] })); }
          tb.append(hr, dr);
          const parts = a.map((d, i) => (d && d !== '0' ? K.fmt(+d * Math.pow(10, 7 - i)) : null)).filter(Boolean);
          view.append(E('div', { class: 't0m-fig' }, tb), E('div', { class: 't0m-big', text: K.fmt(v.n) }), E('div', { class: 't0m-note', text: parts.join(' + ') }));
        },
        controls: K.interactive(params, ctx) ? (c, draw) => {
          c.append(K.number(K.t('number'), v.n, { min: 1, max: 99999999, step: 1 }, (x) => { v.n = Math.max(1, Math.min(99999999, Math.round(x))); draw(); }));
        } : null,
      });
    },
  });
})();
