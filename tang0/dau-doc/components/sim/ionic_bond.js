/* sim.ionic_bond – liên kết ion: n electron lớp ngoài của a chuyển sang b (agent E, đề xuất 004; gốc __DRAW.cIonic).
 * params: {a: 'Na', b: 'Cl', n: 1, title?, note?}. */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { seg, ez, lerp, txt, board, shells, EC, col, SUP } = K;
    const a = v.a || 'Na', b = v.b || 'Cl', n = v.n || 1, p = ez(seg(t, 2, 5));
    const sa = shells(a) || [1], sb = shells(b) || [1], R0 = 34, ax = 270, bx = 690, cy = 260;
    const ring = (cx, sh, el, lose) => {
      let o = '';
      sh.forEach((cnt, i) => {
        const r = R0 + i * R0 * 0.75, last = i === sh.length - 1;
        o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#9FB3C2" stroke-width="2" opacity="${last && lose ? 1 - p * 0.8 : 1}"/>`;
        const m = cnt - (last && lose ? n : 0);
        for (let k = 0; k < m; k++) { const an = (k / cnt) * 2 * Math.PI + t * 0.3; o += `<circle cx="${cx + Math.cos(an) * r}" cy="${cy + Math.sin(an) * r}" r="7" fill="#0B7FD1" stroke="#fff" stroke-width="1.5"/>`; }
      });
      return o + `<circle cx="${cx}" cy="${cy}" r="${R0 * 0.62}" fill="url(#ag${EC[el] ? el : 'Ca'})"/>` + txt(cx, cy + 8, el, { fs: 24, c: col(el)[2] });
    };
    let s = ring(ax, sa, a, true) + ring(bx, sb, b, false);
    const ra = R0 + (sa.length - 1) * R0 * 0.75, rb = R0 + (sb.length - 1) * R0 * 0.75, last = sa[sa.length - 1];
    for (let k = 0; k < n; k++) {
      const an = ((last - 1 - k) / last) * 2 * Math.PI + t * 0.3, x0 = ax + Math.cos(an) * ra, y0 = cy + Math.sin(an) * ra;
      const slot = ((sb[sb.length - 1] + k) / 8) * 2 * Math.PI + t * 0.3, x1 = bx + Math.cos(slot) * rb, y1 = cy + Math.sin(slot) * rb;
      s += `<circle cx="${lerp(x0, x1, p)}" cy="${lerp(y0, y1, p) - Math.sin(p * Math.PI) * 90}" r="8" fill="#F28C18" stroke="#fff" stroke-width="2"/>`;
    }
    const q = seg(t, 5.5, 6.5), sp = n > 1 ? SUP[String(n)] : '';
    s += txt(ax, cy - ra - 28, a + sp + '⁺', { fs: 34, c: '#C2410C', op: q }) + txt(bx, cy - rb - 28, b + sp + '⁻', { fs: 34, c: '#2F5BD0', op: q });
    s += txt(480, 480, `${a} − ${n}e⁻ → ${a}${sp}⁺      ${b} + ${n}e⁻ → ${b}${sp}⁻`, { fs: 28, op: seg(t, 6, 7) });
    return board(s);
  }
  T0.registerSim('sim.ionic_bond', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.ionic_bond' }); } });
})();
