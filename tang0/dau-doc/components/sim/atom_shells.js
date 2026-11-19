/* sim.atom_shells – nguyên tử theo lớp electron (R1, bản tối giản cho cảnh video kimyo8 t4).
 * params: {el: ['Na','K'] | 'O', title?, note?}. Cấu hình lớp: bảng nhỏ dưới đây (Z 1–20 + vài nguyên tố nặng). */
(function () {
  const T0 = window.T0;
  const SH = { H: [1], He: [2], Li: [2, 1], Be: [2, 2], B: [2, 3], C: [2, 4], N: [2, 5], O: [2, 6], F: [2, 7], Ne: [2, 8], Na: [2, 8, 1], Mg: [2, 8, 2], Al: [2, 8, 3], Si: [2, 8, 4], P: [2, 8, 5], S: [2, 8, 6], Cl: [2, 8, 7], Ar: [2, 8, 8], K: [2, 8, 8, 1], Ca: [2, 8, 8, 2], Br: [2, 8, 18, 7], Kr: [2, 8, 18, 8], Rb: [2, 8, 18, 8, 1], I: [2, 8, 18, 18, 7], Cs: [2, 8, 18, 18, 8, 1] };
  const NS = 'http://www.w3.org/2000/svg';
  function svg(tag, a) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); return e; }
  function atom(sym) {
    const sh = SH[sym] || [];
    const Z = sh.reduce((a, b) => a + b, 0);
    const n = sh.length, R = 18 + n * 16, size = 2 * R + 8;
    const s = svg('svg', { viewBox: `0 0 ${size} ${size}`, width: '100%', role: 'img', 'aria-label': `${sym}: ${sh.join(', ')}` });
    s.style.maxWidth = '220px';
    const c = size / 2;
    sh.forEach((k, i) => {
      const r = 18 + (i + 1) * 16;
      s.append(svg('circle', { cx: c, cy: c, r, fill: 'none', stroke: 'currentColor', 'stroke-opacity': '.45' }));
      for (let j = 0; j < k; j++) {
        const a = (j / k) * Math.PI * 2 - Math.PI / 2;
        const outer = i === n - 1;
        s.append(svg('circle', { cx: c + r * Math.cos(a), cy: c + r * Math.sin(a), r: outer ? 4.5 : 3, fill: outer ? '#F2C230' : '#7FC4F0' }));
      }
    });
    s.append(svg('circle', { cx: c, cy: c, r: 15, fill: '#C9303A' }));
    const t = svg('text', { x: c, y: c + 4, 'text-anchor': 'middle', 'font-size': '11', 'font-weight': '700', fill: '#fff' });
    t.textContent = '+' + Z; s.append(t);
    return s;
  }
  T0.registerSim('sim.atom_shells', {
    mount(el, params) {
      const E = T0.ui.el;
      const els = [].concat(params.el || params.elements || []);
      const root = E('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', color: 'inherit' } });
      const draw = () => {
        root.innerHTML = '';
        if (params.title) root.append(E('div', { style: { fontWeight: '700' }, text: T0.t(params.title) }));
        const row = E('div', { style: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' } });
        els.forEach((sym) => row.append(E('figure', { style: { margin: 0, textAlign: 'center', flex: '1 1 120px', maxWidth: '220px' } }, atom(sym), E('figcaption', { style: { fontWeight: '700' }, text: sym + ' ' + (SH[sym] || []).join(' · ') }))));
        root.append(row);
        if (params.note) root.append(E('div', { style: { fontSize: '14px', opacity: '.9', textAlign: 'center' }, text: T0.t(params.note) }));
      };
      draw();
      const off = T0.on('t0:lang', draw);
      el.append(root);
      return { unmount() { off(); root.remove(); } };
    },
  });
})();
