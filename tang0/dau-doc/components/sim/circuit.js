/* sim.circuit – mạch điện nối tiếp / song song có dòng chạy (agent E, đề xuất 004; gốc __DRAW.pCircuit).
 * params: {items: [lamp|switch|res|amm|volt|cap|motor], layout: series|parallel, closed: bool,
 *          volt?: chỉ số linh kiện gắn vôn kế song song (nối tiếp), vread?, amm?: ampe kế mạch chính (song song), aread?,
 *          read?: {i: số đọc}, labels?: {i: nhãn}, title?, note?}. */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { lerp, txt, board, fit } = K;
    const wire = (d, c = '#37474F', w = 5) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    const sym = (type, x, y, on, o = {}) => {
      if (type === 'lamp') { const g = on ? 0.55 + 0.25 * Math.sin(t * 6.7) : 0; return `<circle cx="${x}" cy="${y}" r="44" fill="url(#aglow)" opacity="${g}"/><circle cx="${x}" cy="${y}" r="22" fill="${on ? '#FFF59D' : '#fff'}" stroke="#37474F" stroke-width="4"/><path d="M${x - 15} ${y - 15} L${x + 15} ${y + 15} M${x + 15} ${y - 15} L${x - 15} ${y + 15}" stroke="#37474F" stroke-width="3"/>`; }
      if (type === 'res') return `<rect x="${x - 34}" y="${y - 14}" width="68" height="28" fill="#fff" stroke="#37474F" stroke-width="4"/>` + (o.label ? txt(x, y - 24, o.label, { fs: fit(o.label, 22, 170) }) : '');
      if (type === 'switch') return `<circle cx="${x - 30}" cy="${y}" r="6" fill="#37474F"/><circle cx="${x + 30}" cy="${y}" r="6" fill="#37474F"/><line x1="${x - 30}" y1="${y}" x2="${on ? x + 30 : x + 22}" y2="${on ? y : y - 30}" stroke="#37474F" stroke-width="5" stroke-linecap="round"/>`;
      if (type === 'amm' || type === 'volt') return `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="#37474F" stroke-width="4"/>` + txt(x, y + 9, type === 'amm' ? 'A' : 'V', { fs: 24 }) + (o.read ? txt(x, y - 34, o.read, { fs: fit(o.read, 22, 190), c: '#0B7FD1' }) : '');
      if (type === 'cap') return `<line x1="${x - 8}" y1="${y - 28}" x2="${x - 8}" y2="${y + 28}" stroke="#37474F" stroke-width="6"/><line x1="${x + 8}" y1="${y - 28}" x2="${x + 8}" y2="${y + 28}" stroke="#37474F" stroke-width="6"/>`;
      if (type === 'motor') return `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="#37474F" stroke-width="4"/>` + txt(x, y + 9, 'M', { fs: 24 });
      return '';
    };
    const symL = (type, x, y, on, o = {}) => sym(type, x, y, type === 'switch' ? o.cl : on, o) + (o.label && type !== 'res' ? txt(x, y + (type === 'lamp' ? 52 : 50), o.label, { fs: fit(o.label, 22, 170) }) : '');
    const gapW = (k) => (k === 'lamp' ? 44 : k === 'res' ? 68 : k === 'switch' ? 60 : k === 'cap' ? 16 : 48);
    const items = v.items && v.items.length ? v.items : ['lamp'], par = v.layout === 'parallel', on = v.closed !== false;
    const flow = on && (par || !items.some((x) => x === 'volt' || x === 'cap'));
    const read = v.read || {}, labels = v.labels || {};
    const L = 150, R = 810, T = 140, B = 400;
    let s = wire(`M${L} ${B} L${L} 290 M${L} 250 L${L} ${T}`);
    s += `<line x1="${L - 34}" y1="262" x2="${L + 34}" y2="262" stroke="#37474F" stroke-width="4"/><line x1="${L - 18}" y1="276" x2="${L + 18}" y2="276" stroke="#37474F" stroke-width="10"/>` + txt(L - 50, 250, '+', { fs: 26, c: '#C2410C' }) + txt(L - 50, 300, '−', { fs: 28, c: '#2F5BD0' });
    const path = [], paths = [];
    if (!par) {
      const n = items.length, xs = items.map((_, i) => L + ((R - L) * (i + 1)) / (n + 1));
      let d = `M${L} ${T}`;
      xs.forEach((x, i) => { const g = gapW(items[i]); d += ` L${x - g / 2 - 12} ${T} M${x + g / 2 + 12} ${T}`; });
      s += wire(d + ` L${R} ${T} L${R} ${B} L${L} ${B}`);
      xs.forEach((x, i) => { const g = gapW(items[i]); s += wire(`M${x - g / 2 - 12} ${T} L${x - g / 2} ${T} M${x + g / 2} ${T} L${x + g / 2 + 12} ${T}`) + symL(items[i], x, T, flow, { cl: on, read: read[i], label: labels[i] }); });
      path.push([L, 250], [L, T], [R, T], [R, B], [L, B], [L, 290]);
      if (v.volt != null && xs[v.volt] != null) { const x = xs[v.volt]; s += wire(`M${x - 40} ${T} L${x - 40} ${T + 80} L${x - 24} ${T + 80} M${x + 24} ${T + 80} L${x + 40} ${T + 80} L${x + 40} ${T}`, '#546E7A', 3) + sym('volt', x, T + 80, on, { read: v.vread }); }
    } else {
      const n = items.length, ys = items.map((_, i) => T + ((B - T - 80) * i) / Math.max(1, n - 1) * 0.9 + 30), X1 = 340, X2 = 700;
      s += wire(`M${L} ${T} L${X1} ${T} M${X2} ${T} L${R} ${T} L${R} ${B} L${L} ${B}`) + wire(`M${X1} ${T} L${X1} ${ys[n - 1]} M${X2} ${T} L${X2} ${ys[n - 1]}`);
      items.forEach((it, i) => { const y = ys[i], g = gapW(it); s += wire(`M${X1} ${y} L${520 - g / 2} ${y} M${520 + g / 2} ${y} L${X2} ${y}`) + symL(it, 520, y, flow && it !== 'cap', { cl: on, read: read[i], label: labels[i] }) + `<circle cx="${X1}" cy="${y}" r="5" fill="#37474F"/><circle cx="${X2}" cy="${y}" r="5" fill="#37474F"/>`; });
      if (v.amm) s += sym('amm', (R + X2) / 2 + 10, T, on, { read: v.aread });
      ys.forEach((y, i) => { if (items[i] !== 'cap' && items[i] !== 'volt') paths.push([[L, 250], [L, T], [X1, T], [X1, y], [X2, y], [X2, T], [R, T], [R, B], [L, B], [L, 290]]); });
    }
    if (flow) {
      const all = paths.length ? paths : [path];
      all.forEach((pp, pi) => {
        const segs = []; let tot = 0;
        for (let i = 1; i < pp.length; i++) { const d = Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]); segs.push([pp[i - 1], pp[i], d]); tot += d; }
        const N = Math.round(24 / Math.sqrt(all.length));
        for (let k = 0; k < N; k++) { let u = (t * 90 + (k * tot) / N + pi * 37) % tot; for (const [a, b, d] of segs) { if (u <= d) { s += `<circle cx="${lerp(a[0], b[0], u / d)}" cy="${lerp(a[1], b[1], u / d)}" r="5" fill="#F28C18"/>`; break; } u -= d; } }
      });
      s += txt(R + 40, T + 20, 'I', { fs: 26, c: '#F28C18', a: 'start' }) + txt(R + 40, T + 48, '→', { fs: 24, c: '#F28C18', a: 'start' });
    }
    return board(s);
  }
  T0.registerSim('sim.circuit', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.circuit' }); } });
})();
