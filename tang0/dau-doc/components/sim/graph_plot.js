/* sim.graph_plot – đồ thị: điểm hiện dần rồi nối đường (agent E, đề xuất 004; gốc __DRAW.pGraph).
 * params: {pts: [[x,y],…], line?: true, dash?: bool (gióng xuống trục), xl?, yl?, xt?: [vạch x], yt?: [vạch y],
 *          xmax?, ymax?, title?, note?}. Dùng lại được cho biểu đồ số liệu (đề xuất 048). */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { seg, lerp, txt, board, fit } = K;
    const P = v.pts && v.pts.length ? v.pts : [[0, 0], [1, 1]];
    const X0 = 140, Y0 = 440, Wd = 690, Ht = 340;
    const xm = v.xmax || Math.max(...P.map((p) => p[0])) * 1.1 || 1, ym = v.ymax || Math.max(...P.map((p) => p[1])) * 1.15 || 1;
    const X = (x) => X0 + (x / xm) * Wd, Y = (y) => Y0 - (y / ym) * Ht;
    const num = (x) => String(x).replace('.', ',');
    let s = `<line x1="${X0}" y1="${Y0}" x2="${X0 + Wd + 20}" y2="${Y0}" stroke="#37474F" stroke-width="3"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - Ht - 30}" stroke="#37474F" stroke-width="3"/>`;
    s += `<path d="M${X0 + Wd + 32} ${Y0} l-14 -7 v14z M${X0} ${Y0 - Ht - 42} l-7 14 h14z" fill="#37474F"/>`;
    s += txt(X0 + Wd + 30, Y0 + 40, v.xl || 'x', { fs: 26, a: 'end' }) + txt(X0 + 14, Y0 - Ht - 30, v.yl || 'y', { fs: 26, a: 'start' });
    (v.xt || []).forEach((x) => (s += `<line x1="${X(x)}" y1="${Y0}" x2="${X(x)}" y2="${Y0 + 8}" stroke="#37474F" stroke-width="2"/>` + txt(X(x), Y0 + 32, num(x), { fs: 22, fw: 600 })));
    (v.yt || []).forEach((y) => (s += `<line x1="${X0 - 8}" y1="${Y(y)}" x2="${X0}" y2="${Y(y)}" stroke="#37474F" stroke-width="2"/>` + txt(X0 - 14, Y(y) + 7, num(y), { fs: 22, fw: 600, a: 'end' }) + `<line x1="${X0}" y1="${Y(y)}" x2="${X0 + Wd}" y2="${Y(y)}" stroke="#E3EAF0" stroke-width="1"/>`));
    const k = Math.floor(seg(t, 0.8, 4.5) * P.length + 0.0001);
    P.slice(0, k).forEach((p) => (s += (v.dash ? `<path d="M${X(p[0])} ${Y0} L${X(p[0])} ${Y(p[1])} L${X0} ${Y(p[1])}" stroke="#90A4AE" stroke-dasharray="5 5" fill="none"/>` : '') + `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="8" fill="#0B7FD1"/>`));
    if (v.line !== false && P.length > 1) {
      const lp = seg(t, 4.5, 6.5);
      if (lp > 0) {
        const m = lp * (P.length - 1), k2 = Math.floor(m), f = m - k2;
        let d = `M${X(P[0][0])} ${Y(P[0][1])}`;
        for (let j = 1; j <= k2; j++) d += ` L${X(P[j][0])} ${Y(P[j][1])}`;
        if (k2 < P.length - 1) { const a = P[k2], b = P[k2 + 1]; d += ` L${X(lerp(a[0], b[0], f))} ${Y(lerp(a[1], b[1], f))}`; }
        s += `<path d="${d}" fill="none" stroke="#D2362B" stroke-width="5" stroke-linejoin="round"/>`;
      }
    }
    return board(s);
  }
  T0.registerSim('sim.graph_plot', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.graph_plot' }); } });
})();
