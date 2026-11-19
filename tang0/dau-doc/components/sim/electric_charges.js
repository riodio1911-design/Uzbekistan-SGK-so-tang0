/* sim.electric_charges – 1–2 điện tích, đường sức điện, lực hút/đẩy (agent E, đề xuất 004; gốc __DRAW.pCharge).
 * params: {q: [1,-1] (dấu), sep?: 300 (px trong khung 960), move?: bool, title?, note?}. */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { seg, ez, txt, board } = K;
    const q = v.q && v.q.length ? v.q : [1, -1], n = q.length, sep = v.sep || 300, dash = -(t * 40) % 40;
    const pos = q.map((c, i) => [n === 1 ? 480 : 480 + ((i ? 1 : -1) * sep) / 2 + (n === 2 && v.move ? (q[0] * q[1] > 0 ? 1 : -1) * (i ? 1 : -1) * ez(seg(t, 2, 5)) * 40 : 0), 270, c]);
    const ang = (x, y) => { let ex = 0, ey = 0; pos.forEach(([px, py, c]) => { const dx = x - px, dy = y - py, r3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; ex += (c * dx) / r3; ey += (c * dy) / r3; }); return Math.atan2(ey, ex); };
    let s = '';
    pos.forEach(([px, py, c]) => {
      if (c < 0 && q.some((x) => x > 0)) return;
      const dir = c > 0 ? 1 : -1;
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * 2 * Math.PI; let x = px + Math.cos(a) * 30, y = py + Math.sin(a) * 30, d = `M${x} ${y}`;
        for (let j = 0; j < 240; j++) { const g = ang(x, y); x += Math.cos(g) * 5 * dir; y += Math.sin(g) * 5 * dir; if (x < 5 || x > 955 || y < 5 || y > 535) break; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; if (pos.some(([qx, qy, cc]) => cc * c < 0 && Math.hypot(x - qx, y - qy) < 26)) break; }
        s += `<path d="${d}" fill="none" stroke="#7E57C2" stroke-width="2" stroke-dasharray="12 9" stroke-dashoffset="${dir * dash}" opacity=".85"/>`;
      }
    });
    pos.forEach(([px, py, c]) => { s += `<circle cx="${px}" cy="${py}" r="28" fill="${c > 0 ? '#D2362B' : '#1565C0'}"/>` + txt(px, py + 12, c > 0 ? '+' : '−', { fs: 38, c: '#fff' }); });
    if (n === 2) {
      const att = q[0] * q[1] < 0, o = seg(t, 1, 2);
      pos.forEach(([px, py], i) => { const dir = (i ? 1 : -1) * (att ? -1 : 1); s += `<g opacity="${o}"><line x1="${px + dir * 34}" y1="${py - 48}" x2="${px + dir * 110}" y2="${py - 48}" stroke="#2E7D32" stroke-width="6"/><path d="M${px + dir * 124} ${py - 48} L${px + dir * 104} ${py - 60} L${px + dir * 104} ${py - 36}Z" fill="#2E7D32"/>${txt(px + dir * 76, py - 62, 'F', { fs: 24, c: '#2E7D32' })}</g>`; });
    }
    return board(s);
  }
  T0.registerSim('sim.electric_charges', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.electric_charges' }); } });
})();
