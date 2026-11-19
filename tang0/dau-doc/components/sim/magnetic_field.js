/* sim.magnetic_field – đường sức từ, kim la bàn, lực Ampe (agent E, đề xuất 004; gốc __DRAW.pField).
 * params: {type: bar|horseshoe|coil|wire|earth|force, current?: 'in'|'out' (wire, force), title?, note?}. */
(function () {
  const T0 = window.T0;
  const S = {
    northGeo: { uz: 'Shimoliy geografik qutb', ru: 'Северный геогр. полюс', vi: 'Cực Bắc địa lí' },
    southGeo: { uz: 'Janubiy geografik qutb', ru: 'Южный геогр. полюс', vi: 'Cực Nam địa lí' },
    out: { uz: 'tok bizga qarab ⊙', ru: 'ток на нас ⊙', vi: 'dòng điện hướng ra ⊙' },
    in: { uz: 'tok bizdan ⊗', ru: 'ток от нас ⊗', vi: 'dòng điện hướng vào ⊗' },
  };
  function draw(t, v, K) {
    const { seg, ez, txt, TL, board } = K;
    const ty = v.type || 'bar';
    const dash = -(t * 40) % 40;
    const wire = (d, c = '#37474F', w = 5) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    const line = (d, c = '#0B7FD1') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="14 10" stroke-dashoffset="${dash}" opacity=".9"/>`;
    const needle = (x, y, ang) => `<g transform="translate(${x} ${y}) rotate(${(ang * 180) / Math.PI})"><circle r="15" fill="#fff" stroke="#90A4AE" stroke-width="2"/><path d="M12 0 L0 -4 L0 4Z" fill="#D2362B"/><path d="M-12 0 L0 -4 L0 4Z" fill="#1565C0"/></g>`;
    const dip = (x, y, poles) => { let bx = 0, by = 0; poles.forEach(([px, py, q]) => { const dx = x - px, dy = y - py, r3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; bx += (q * dx) / r3; by += (q * dy) / r3; }); return Math.atan2(by, bx); };
    const stream = (x, y, poles, dir) => { let d = `M${x} ${y}`; for (let k = 0; k < 260; k++) { const a = dip(x, y, poles); x += Math.cos(a) * 5 * dir; y += Math.sin(a) * 5 * dir; if (x < 10 || x > 950 || y < 10 || y > 530) break; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; if (poles.some(([px, py, q]) => q * dir < 0 && Math.hypot(x - px, y - py) < 14)) break; } return d; };
    let s = '';
    if (ty === 'bar' || ty === 'coil' || ty === 'earth') {
      const cx = 480, cy = 270, hl = ty === 'coil' ? 120 : 110, poles = ty === 'earth' ? [[cx, cy + 60, 1], [cx, cy - 60, -1]] : [[cx + hl - 10, cy, 1], [cx - hl + 10, cy, -1]];
      for (let k = 0; k < 14; k++) { const a = (k / 14) * 2 * Math.PI; s += line(stream(poles[0][0] + Math.cos(a) * 16, poles[0][1] + Math.sin(a) * 16, poles, 1)); }
      if (ty === 'bar') s += `<rect x="${cx - hl}" y="${cy - 28}" width="${hl}" height="56" fill="#1565C0"/><rect x="${cx}" y="${cy - 28}" width="${hl}" height="56" fill="#D2362B"/>` + txt(cx - hl / 2, cy + 11, 'S', { fs: 30, c: '#fff' }) + txt(cx + hl / 2, cy + 11, 'N', { fs: 30, c: '#fff' });
      if (ty === 'coil') {
        for (let k = 0; k < 10; k++) { const x = cx - hl + 12 + (k * (2 * hl - 24)) / 9; s += `<ellipse cx="${x}" cy="${cy}" rx="10" ry="46" fill="none" stroke="#B5651D" stroke-width="5"/>`; }
        s += txt(cx + hl + 30, cy - 50, 'N', { fs: 28, c: '#D2362B' }) + txt(cx - hl - 30, cy - 50, 'S', { fs: 28, c: '#1565C0' }) + wire(`M${cx - hl + 12} ${cy + 46} L${cx - hl + 12} ${cy + 120} L${cx - 60} ${cy + 120} M${cx + 60} ${cy + 120} L${cx + hl - 12} ${cy + 120} L${cx + hl - 12} ${cy + 46}`, '#37474F', 4) + `<line x1="${cx - 30}" y1="${cy + 105}" x2="${cx - 30}" y2="${cy + 135}" stroke="#37474F" stroke-width="4"/><line x1="${cx - 14}" y1="${cy + 112}" x2="${cx - 14}" y2="${cy + 128}" stroke="#37474F" stroke-width="8"/>`;
      }
      if (ty === 'earth') s += `<circle cx="${cx}" cy="${cy}" r="${hl}" fill="#4FC3F7" stroke="#0277BD" stroke-width="3"/><path d="M${cx - 60} ${cy - 40} q30 -30 60 -10 q20 20 50 0 q10 40 -30 50 q-40 10 -80 -40z" fill="#81C784"/><line x1="${cx}" y1="${cy - hl - 20}" x2="${cx}" y2="${cy + hl + 20}" stroke="#37474F" stroke-dasharray="6 6"/>` + TL(cx + 140, cy - hl + 10, S.northGeo, 20, undefined, 1, 'start') + TL(cx + 140, cy + hl - 10, S.southGeo, 20, undefined, 1, 'start') + txt(cx - 24, cy - 48, 'S', { fs: 22, c: '#1565C0' }) + txt(cx - 24, cy + 78, 'N', { fs: 22, c: '#D2362B' });
      [[230, 120], [480, 90], [730, 120], [180, 270], [780, 270], [230, 420], [480, 450], [730, 420]].forEach(([x, y]) => (s += needle(x, y, dip(x, y, poles))));
    }
    if (ty === 'horseshoe') {
      s += `<path d="M300 160 L300 380 Q300 470 390 470 L570 470 Q660 470 660 380 L660 160 L600 160 L600 380 Q600 410 570 410 L390 410 Q360 410 360 380 L360 160Z" fill="#B0BEC5"/><rect x="300" y="120" width="60" height="60" fill="#D2362B"/><rect x="600" y="120" width="60" height="60" fill="#1565C0"/>` + txt(330, 162, 'N', { fs: 28, c: '#fff' }) + txt(630, 162, 'S', { fs: 28, c: '#fff' });
      for (let k = 0; k < 5; k++) { const y = 125 + k * 12; s += line(`M362 ${y} L598 ${y}`); }
      s += needle(480, 220, 0);
    }
    if (ty === 'wire') {
      const cx = 480, cy = 280, out = v.current !== 'in';
      for (let k = 1; k <= 4; k++) {
        const r = k * 48; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#0B7FD1" stroke-width="2.5" stroke-dasharray="14 10" stroke-dashoffset="${(out ? 1 : -1) * dash}"/>`;
        const a = (out ? -1 : 1) * t * 0.6 + k, ax = cx + Math.cos(a) * r, ay = cy + Math.sin(a) * r, ang = a + ((out ? -1 : 1) * Math.PI) / 2;
        s += `<path d="M${ax + Math.cos(ang) * 10} ${ay + Math.sin(ang) * 10} L${ax + Math.cos(ang + 2.5) * 10} ${ay + Math.sin(ang + 2.5) * 10} L${ax + Math.cos(ang - 2.5) * 10} ${ay + Math.sin(ang - 2.5) * 10}Z" fill="#0B7FD1"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="22" fill="#FFB074" stroke="#B5651D" stroke-width="3"/>` + (out ? `<circle cx="${cx}" cy="${cy}" r="6" fill="#37474F"/>` : `<path d="M${cx - 10} ${cy - 10} L${cx + 10} ${cy + 10} M${cx + 10} ${cy - 10} L${cx - 10} ${cy + 10}" stroke="#37474F" stroke-width="4"/>`);
      [[480, 120], [680, 280], [480, 440], [280, 280]].forEach(([x, y]) => { const a = Math.atan2(y - cy, x - cx) + ((out ? -1 : 1) * Math.PI) / 2; s += needle(x, y, a); });
      s += TL(780, 500, out ? S.out : S.in, 22);
    }
    if (ty === 'force') {
      /* B: N (trên) → S (dưới); dây vuông góc mặt phẳng; F theo quy tắc bàn tay trái */
      const dir = v.current === 'in' ? -1 : 1;
      s += `<rect x="200" y="120" width="560" height="44" fill="#D2362B"/><rect x="200" y="380" width="560" height="44" fill="#1565C0"/>` + txt(480, 150, 'N', { fs: 28, c: '#fff' }) + txt(480, 410, 'S', { fs: 28, c: '#fff' });
      for (let k = 0; k < 7; k++) s += line(`M${240 + k * 80} 166 L${240 + k * 80} 378`);
      const dx = dir * ez(seg(t, 2, 5)) * 90;
      s += `<circle cx="${480 + dx}" cy="272" r="20" fill="#FFB074" stroke="#B5651D" stroke-width="3"/>` + (v.current === 'in' ? `<path d="M${470 + dx} 262 L${490 + dx} 282 M${490 + dx} 262 L${470 + dx} 282" stroke="#37474F" stroke-width="4"/>` : `<circle cx="${480 + dx}" cy="272" r="6" fill="#37474F"/>`);
      s += `<g opacity="${seg(t, 1, 2)}"><line x1="${480 + dx + dir * 28}" y1="272" x2="${480 + dx + dir * 110}" y2="272" stroke="#2E7D32" stroke-width="7"/><path d="M${480 + dx + dir * 124} 272 L${480 + dx + dir * 104} 260 L${480 + dx + dir * 104} 284Z" fill="#2E7D32"/>${txt(480 + dx + dir * 80, 256, 'F', { fs: 26, c: '#2E7D32' })}</g>` + txt(250, 272, 'B ↓', { fs: 24, c: '#0B7FD1' });
    }
    return board(s);
  }
  T0.registerSim('sim.magnetic_field', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.magnetic_field' }); } });
})();
