/* sim.chem_fixed_scene – 8 cảnh hóa học vẽ cố định về amoniac (agent E, đề xuất 004; gốc window.CHEM của kimyo8).
 * params: {k: cBond | cLab | cReact0 | cFountain | cIon | cSmoke | cLife | cBurn}. Không có tham số nội dung;
 * nhãn chữ đã chuyển sang đa ngữ {uz,ru,vi} (bản cũ in uz + một ngôn ngữ phụ). Logic vẽ giữ nguyên. */
(function () {
  const T0 = window.T0;
  const COL = { N: ['#6E9BFF', '#2F5BD0'], H: ['#FFFFFF', '#B9C3CC'], Cl: ['#7BE07F', '#2E9E3A'], O: ['#FF8A80', '#D2362B'], Ca: ['#E3E3E3', '#9A9A9A'] };
  const DEFS = `<defs>${Object.entries(COL).map(([k, c]) => `<radialGradient id="g${k}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>`).join('')}<radialGradient id="glow" r="50%"><stop offset="0" stop-color="#FFE27A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE27A" stop-opacity="0"/></radialGradient><linearGradient id="pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF5FA8"/><stop offset="1" stop-color="#D81B78"/></linearGradient></defs>`;
  /* nhãn đa ngữ của 8 cảnh */
  const S = {
    pairs: { uz: 'Elektron juftlari', ru: 'Электронные пары', vi: 'Các cặp electron' },
    lone: { uz: 'erkin juft', ru: 'свободная пара', vi: 'cặp tự do' },
    pyramid: { uz: 'Shakli: piramida', ru: 'Форма: пирамида', vi: 'Hình dạng: chóp tam giác' },
    cotton: { uz: 'paxta', ru: 'вата', vi: 'bông' },
    lighter: { uz: 'havodan yengil', ru: 'легче воздуха', vi: 'nhẹ hơn không khí' },
    vol: { uz: '4 hajm gaz → 2 hajm', ru: '4 объёма газа → 2 объёма', vi: '4 thể tích khí → 2 thể tích' },
    phph: { uz: '+ fenolftalein', ru: '+ фенолфталеин', vi: '+ phenolphtalein' },
    val4: { uz: 'valentlik: IV', ru: 'валентность: IV', vi: 'hoá trị: IV' },
    ox3: { uz: 'oksidlanish darajasi: −3', ru: 'степень окисления: −3', vi: 'số oxi hoá: −3' },
    smoke: { uz: 'oq «tutun»', ru: 'белый «дым»', vi: '«khói» trắng' },
    fert: { uz: 'Azotli o‘g‘itlar', ru: 'Азотные удобрения', vi: 'Phân đạm' },
    uses: { uz: 'NH₃ → HNO₃ · sovutgich · nashatir spirti', ru: 'NH₃ → HNO₃ · хладагент · нашатырный спирт', vi: 'NH₃ → HNO₃ · chất làm lạnh · amoniac y tế' },
    nocat: { uz: 'katalizatorsiz', ru: 'без катализатора', vi: 'không có xúc tác' },
    pt: { uz: 'Pt katalizatori bilan', ru: 'с катализатором Pt', vi: 'có xúc tác Pt' },
    burn: { uz: 'Ammiakning yonishi', ru: 'Горение аммиака', vi: 'Amoniac cháy trong oxi' },
  };
  const ARIA = { cBond: { uz: 'NH₃ molekulasida bog‘lanish', ru: 'Связи в молекуле NH₃', vi: 'Liên kết trong phân tử NH₃' }, cLab: { uz: 'Laboratoriyada ammiak olish', ru: 'Получение аммиака в лаборатории', vi: 'Điều chế NH₃ trong phòng thí nghiệm' }, cReact0: { uz: 'Ammiak sintezi', ru: 'Синтез аммиака', vi: 'Tổng hợp NH₃' }, cFountain: { uz: '«Favvora» tajribasi', ru: 'Опыт «фонтан»', vi: 'Thí nghiệm «vòi phun»' }, cIon: { uz: 'Ammoniy ioni', ru: 'Ион аммония', vi: 'Ion amoni' }, cSmoke: { uz: 'NH₃ va HCl: oq tutun', ru: 'NH₃ и HCl: белый дым', vi: 'NH₃ gặp HCl: khói trắng' }, cLife: { uz: 'Ammiakning qo‘llanilishi', ru: 'Применение аммиака', vi: 'Ứng dụng của amoniac' }, cBurn: { uz: 'Ammiakning yonishi', ru: 'Горение аммиака', vi: 'Amoniac cháy trong oxi' } };

  function scenes(K) {
    const { cl, seg, ez, lerp } = K;
    const txt = (x, y, s, o) => K.txt(x, y, s, o);
    const TL = (x, y, o, fs = 20, c, op = 1, a = 'middle') => K.txt(x, y, K.L(o), { fs: fs * 1.1, c, op, a });
    const atom = (x, y, el, r, op = 1, lab = true) => { r = r || (el === 'H' ? 20 : 30); return `<g opacity="${op}"><circle cx="${x}" cy="${y}" r="${r}" fill="url(#g${el})" stroke="#1E2B38" stroke-opacity=".25"/>${lab ? txt(x, y + r * 0.36, el, { fs: r * 0.95, c: el === 'H' ? '#334' : '#fff' }) : ''}</g>`; };
    const e = (x, y, c) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="#fff" stroke-width="1.5"/>`;
    const board = (inner) => `${DEFS}<rect width="960" height="540" rx="18" fill="#F4F8FC"/>${inner}`;
    const nh3 = (x, y, sc, op = 1) => `<g opacity="${op}" transform="translate(${x} ${y}) scale(${sc})">${atom(0, 0, 'N', 22)}${atom(-22, 16, 'H', 13)}${atom(22, 16, 'H', 13)}${atom(0, -24, 'H', 13)}</g>`;

    function cBond(t) {
      const cx = 250, cy = 290, p = ez(seg(t, 1.5, 4.5)), q = seg(t, 5, 6.5);
      let s = `<line x1="480" y1="60" x2="480" y2="500" stroke="#D3DDE5" stroke-width="2" stroke-dasharray="6 8"/>` + TL(250, 50, S.pairs, 22);
      const pos = { L: [-1, 0], R: [1, 0], B: [0, 1] };
      for (const k of ['L', 'R', 'B']) {
        const [dx, dy] = pos[k], far = 200, near = 95, hx = cx + dx * lerp(far, near, p), hy = cy + dy * lerp(far * 0.8, near, p);
        if (q > 0) s += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#5B6B7A" stroke-width="8" stroke-linecap="round" opacity="${q}"/>`;
        s += atom(hx, hy, 'H');
        const mx = cx + dx * lerp(46, 58, p), my = cy + dy * lerp(46, 58, p), ox = dy ? 7 : 0, oy = dx ? 7 : 0;
        if (q < 1) s += `<g opacity="${1 - q}">` + e(mx - ox, my - oy, '#2F5BD0') + e(lerp(hx - dx * 30, mx + ox, p), lerp(hy - dy * 30, my + oy, p), '#F28C18') + `</g>`;
      }
      s += atom(cx, cy, 'N', 34) + `<g>${e(cx - 8, cy - 50, '#2F5BD0')}${e(cx + 8, cy - 50, '#2F5BD0')}</g>`;
      if (t > 6) s += `<ellipse cx="${cx}" cy="${cy - 52}" rx="34" ry="20" fill="url(#glow)" opacity="${0.5 + 0.5 * Math.sin(t * 4)}"/>` + TL(cx + 50, cy - 70, S.lone, 17, undefined, seg(t, 6, 7), 'start');
      if (t > 7) { const o = seg(t, 7, 8); s += txt(cx + 52, cy + 52, 'δ−', { fs: 22, c: '#2F5BD0', op: o }) + txt(cx - 155, cy - 28, 'δ+', { fs: 20, c: '#C2410C', op: o }) + txt(cx + 155, cy - 28, 'δ+', { fs: 20, c: '#C2410C', op: o }) + txt(cx + 30, cy + 140, 'δ+', { fs: 20, c: '#C2410C', op: o }); }
      s += txt(250, 500, 'N: 5 e⁻   ·   H: 1 e⁻', { fs: 22, fw: 600, c: '#51636F' });
      const a = t * 0.9, tilt = 0.42, P = [[0, 0.36, 0, 'N']].concat([0, 1, 2].map((k) => { const th = (k * 2 * Math.PI) / 3; return [0.94 * Math.cos(th), -0.32, 0.94 * Math.sin(th), 'H']; }));
      const pr = ([x, y, z]) => { const X = x * Math.cos(a) + z * Math.sin(a), Zz = -x * Math.sin(a) + z * Math.cos(a); const Y = y * Math.cos(tilt) - Zz * Math.sin(tilt), Z2 = y * Math.sin(tilt) + Zz * Math.cos(tilt); return [720 + X * 150, 300 - Y * 150, Z2]; };
      const pts = P.map((v) => pr(v)), lob = pr([0, 0.95, 0]);
      const items = [];
      for (let k = 1; k < 4; k++) items.push({ z: (pts[0][2] + pts[k][2]) / 2 - 0.01, s: `<line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[k][0]}" y2="${pts[k][1]}" stroke="#5B6B7A" stroke-width="12" stroke-linecap="round"/>` });
      const mx = (lob[0] + pts[0][0]) / 2, my = (lob[1] + pts[0][1]) / 2;
      const lobS = `<ellipse cx="${mx}" cy="${my}" rx="22" ry="40" transform="rotate(${(Math.atan2(lob[0] - pts[0][0], pts[0][1] - lob[1]) * 180) / Math.PI} ${mx} ${my})" fill="#FFE27A" opacity=".55"/>`;
      pts.forEach((p2, k) => items.push({ z: p2[2], s: atom(p2[0], p2[1], P[k][3], P[k][3] === 'N' ? 40 : 27, 1, P[k][3] === 'N' || p2[2] > -0.2) }));
      items.sort((x, y) => x.z - y.z);
      s += lobS + items.map((x) => x.s).join('') + TL(720, 50, S.pyramid, 22) + txt(720, 500, '∠HNH ≈ 107°', { fs: 24, c: '#51636F' });
      return board(s);
    }
    function cLab(t) {
      let s = `<rect x="100" y="470" width="460" height="16" rx="6" fill="#8D6E63"/><rect x="130" y="170" width="12" height="300" fill="#90A4AE"/><rect x="130" y="300" width="140" height="10" fill="#90A4AE"/>`;
      s += `<g transform="rotate(8 330 330)"><rect x="200" y="300" width="270" height="60" rx="30" fill="#E3F2FD" stroke="#78909C" stroke-width="4"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<circle cx="${222 + k * 10}" cy="${334 + (k % 3) * 7}" r="5.5" fill="${k % 2 ? '#FAFAFA' : '#B0BEC5'}"/>`).join('')}</g>`;
      const f = 1 + 0.12 * Math.sin(t * 14) + 0.06 * Math.sin(t * 23);
      s += `<rect x="235" y="440" width="50" height="30" rx="6" fill="#455A64"/><path d="M260 ${440 - 58 * f} C 240 ${425 - 20 * f} 243 438 260 440 C 277 438 280 ${425 - 20 * f} 260 ${440 - 58 * f}Z" fill="#FF9800" opacity=".9"/><path d="M260 ${440 - 32 * f} C 251 430 253 438 260 440 C 267 438 269 430 260 ${440 - 32 * f}Z" fill="#FFEB3B"/>`;
      s += `<rect x="610" y="110" width="80" height="250" rx="38" fill="#E3F2FD" stroke="#78909C" stroke-width="4"/><rect x="605" y="350" width="90" height="30" rx="10" fill="#FFF8E1" stroke="#D7CCC8"/><path d="M466 352 L570 400 L650 400 L650 150" fill="none" stroke="#78909C" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
      const path = (u) => { const P = [[466, 352], [570, 400], [650, 400], [650, 150]], Ls = [0, 114, 194, 444]; const d = u * 444; for (let k = 1; k < 4; k++) if (d <= Ls[k]) { const r = (d - Ls[k - 1]) / (Ls[k] - Ls[k - 1]); return [lerp(P[k - 1][0], P[k][0], r), lerp(P[k - 1][1], P[k][1], r)]; } return P[3]; };
      const n = Math.floor(cl(t - 1.5, 0, 8) * 2.5);
      for (let k = 0; k < n; k++) { const age = t - 1.5 - k / 2.5, u = cl(age / 2.2); let [x, y] = path(u); if (u >= 1) { const slot = k % 12; x = 630 + (slot % 3) * 20 + 6 * Math.sin(t * 2 + k); y = 135 + Math.floor(slot / 3) * 26 + 5 * Math.cos(t * 2.4 + k); } s += nh3(x, y, 0.4); }
      s += txt(650, 95, 'NH₃↑', { fs: 30, c: '#2F5BD0', op: seg(t, 2, 3) }) + txt(330, 520, 'NH₄Cl + Ca(OH)₂', { fs: 22, c: '#51636F' }) + TL(712, 372, S.cotton, 16, '#795548', 1, 'start');
      s += `<g opacity="${seg(t, 4, 5)}"><rect x="40" y="22" width="880" height="56" rx="12" fill="#fff" stroke="#D3DDE5"/>${txt(480, 60, '2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O', { fs: 28 })}</g>` + TL(820, 470, S.lighter, 18, undefined, seg(t, 5, 6));
      return board(s);
    }
    function cReact0(t) {
      const p = ez(seg(t, 2.2, 5.2));
      let s = '';
      const N0 = [[150, 260], [200, 260]], H0 = [[300, 200], [340, 200], [300, 280], [340, 280], [300, 360], [340, 360]];
      const tgt = (c) => [[c[0], c[1] - 6], [c[0] - 34, c[1] + 30], [c[0] + 34, c[1] + 30], [c[0], c[1] - 48]];
      const T1 = tgt([700, 250]), T2 = tgt([840, 250]);
      const Nt = [T1[0], T2[0]], Ht = [T1[1], T1[2], T1[3], T2[1], T2[2], T2[3]];
      if (p < 0.02) { s += `<line x1="150" y1="260" x2="200" y2="260" stroke="#5B6B7A" stroke-width="10"/>`; [0, 2, 4].forEach((k) => (s += `<line x1="${H0[k][0]}" y1="${H0[k][1]}" x2="${H0[k + 1][0]}" y2="${H0[k + 1][1]}" stroke="#5B6B7A" stroke-width="7"/>`)); }
      if (p > 0.98) [T1, T2].forEach((T) => { for (let k = 1; k < 4; k++) s += `<line x1="${T[0][0]}" y1="${T[0][1]}" x2="${T[k][0]}" y2="${T[k][1]}" stroke="#5B6B7A" stroke-width="7"/>`; });
      N0.forEach((a, k) => (s += atom(lerp(a[0], Nt[k][0], p), lerp(a[1], Nt[k][1], p), 'N', 26)));
      H0.forEach((a, k) => (s += atom(lerp(a[0], Ht[k][0], p), lerp(a[1], Ht[k][1], p), 'H', 17)));
      s += txt(480, 265, '⇄', { fs: 60, c: '#0B7FD1' }) + txt(480, 305, 'p↑ · t° · kat.', { fs: 20, fw: 600, c: '#51636F' });
      s += txt(175, 440, 'N₂', { fs: 28 }) + txt(320, 440, '3H₂', { fs: 28 }) + txt(770, 440, '2NH₃', { fs: 28 });
      s += `<g opacity="${seg(t, 5.6, 6.6)}"><rect x="40" y="470" width="420" height="52" rx="12" fill="#fff" stroke="#D3DDE5"/>${txt(250, 505, 'N: 2 = 2 ✓     H: 6 = 6 ✓', { fs: 24, c: '#1E7A3C' })}</g>`;
      s += `<g opacity="${seg(t, 7, 8.5)}"><rect x="490" y="470" width="430" height="52" rx="12" fill="#fff" stroke="#D3DDE5"/>${K.txt(705, 504, K.L(S.vol), { fs: K.fit(K.L(S.vol), 22, 410) })}</g>`;
      s += txt(480, 60, 'N₂ + 3H₂ ⇄ 2NH₃ + Q', { fs: 32, op: seg(t, 0.3, 1.2) });
      return board(s);
    }
    function cFountain(t) {
      const p = seg(t, 2.5, 8);
      let s = `<circle cx="480" cy="180" r="120" fill="#E3F2FD" stroke="#78909C" stroke-width="5"/><rect x="465" y="290" width="30" height="60" fill="#E3F2FD" stroke="#78909C" stroke-width="5"/><line x1="480" y1="330" x2="480" y2="470" stroke="#78909C" stroke-width="6"/>`;
      s += `<path d="M330 400 L630 400 L610 510 L350 510 Z" fill="#E1F5FE" stroke="#78909C" stroke-width="4"/><rect x="340" y="420" width="280" height="85" fill="#B3E5FC" opacity=".8"/>`;
      const fill = ez(p);
      if (p > 0) {
        s += `<line x1="480" y1="470" x2="480" y2="${lerp(470, 120, cl(p * 3))}" stroke="${p > 0.15 ? '#E91E8C' : '#4FC3F7'}" stroke-width="5"/>`;
        if (p > 0.3) for (let k = 0; k < 14; k++) { const a = -Math.PI / 2 + (k - 6.5) * 0.2, r = 40 + ((t * 120 + k * 37) % 60); s += `<circle cx="${480 + Math.cos(a) * r * 0.9}" cy="${120 + Math.sin(a) * r * 0.5 + r * 0.35}" r="4" fill="#E91E8C" opacity=".85"/>`; }
        s += `<clipPath id="fl"><circle cx="480" cy="180" r="116"/></clipPath><rect x="360" y="${300 - fill * 180}" width="240" height="${fill * 180}" fill="url(#pink)" opacity=".85" clip-path="url(#fl)"/>`;
      }
      for (let k = 0; k < 10; k++) { const op = 1 - cl(p * 1.4 - k * 0.06); if (op <= 0) continue; s += nh3(420 + (k % 4) * 40 + 10 * Math.sin(t * 2 + k), 120 + Math.floor(k / 4) * 45 + 8 * Math.cos(t * 2.3 + k), 0.4, op); }
      s += txt(160, 120, '1 V H₂O', { fs: 28, c: '#0B7FD1' }) + txt(160, 160, '≈ 700 V NH₃', { fs: 28, c: '#2F5BD0' }) + TL(160, 215, S.phph, 18);
      s += `<g opacity="${seg(t, 6, 7)}"><rect x="660" y="80" width="270" height="110" rx="12" fill="#fff" stroke="#D3DDE5"/>${txt(795, 125, 'NH₃ + H₂O ⇄', { fs: 24 })}${txt(795, 165, 'NH₄⁺ + OH⁻', { fs: 26, c: '#D81B78' })}</g>`;
      return board(s);
    }
    function cIon(t) {
      const p = ez(seg(t, 1.5, 4.5)), q = seg(t, 4.8, 6), cx = 380, cy = 320;
      let s = '';
      const Hs = [[cx - 100, cy + 60], [cx + 100, cy + 60], [cx, cy + 115]];
      Hs.forEach((h) => (s += `<line x1="${cx}" y1="${cy}" x2="${h[0]}" y2="${h[1]}" stroke="#5B6B7A" stroke-width="8"/>`));
      const hx = lerp(cx + 260, cx, p), hy = lerp(cy - 230, cy - 115, p);
      if (q > 0) s += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#5B6B7A" stroke-width="8" opacity="${q}"/>`;
      Hs.forEach((h) => (s += atom(h[0], h[1], 'H', 22)));
      s += atom(cx, cy, 'N', 36);
      const ey = lerp(cy - 50, cy - 75, p);
      if (q < 1) s += `<g opacity="${1 - q}">` + e(cx - 8, ey, '#2F5BD0') + e(cx + 8, ey, '#2F5BD0') + `</g>`;
      s += atom(hx, hy, 'H', 22) + txt(hx + 26, hy - 18, '+', { fs: 30, c: '#C2410C', op: 1 - q });
      if (t < 4.5) s += `<path d="M${cx + 30} ${cy - 70} Q ${cx + 120} ${cy - 140} ${hx - 24} ${hy + 10}" fill="none" stroke="#F28C18" stroke-width="3" stroke-dasharray="8 6" opacity="${seg(t, 0.5, 1.5)}"/>`;
      if (q > 0) s += `<g opacity="${q}">${txt(cx - 170, cy + 20, '[', { fs: 220, fw: 300 })}${txt(cx + 170, cy + 20, ']', { fs: 220, fw: 300 })}${txt(cx + 205, cy - 130, '+', { fs: 44, c: '#C2410C' })}</g>`;
      s += txt(480, 60, 'NH₃ + H⁺ → NH₄⁺', { fs: 32 });
      s += `<g opacity="${seg(t, 6, 7)}"><rect x="630" y="230" width="310" height="170" rx="12" fill="#fff" stroke="#D3DDE5"/>${K.txt(785, 285, K.L(S.val4), { fs: K.fit(K.L(S.val4), 24, 290) })}${K.txt(785, 355, K.L(S.ox3), { fs: K.fit(K.L(S.ox3), 22, 290) })}</g>`;
      return board(s);
    }
    function cSmoke(t) {
      const bottle = (x, lab, c) => `<path d="M${x - 50} 500 L${x - 50} 360 Q ${x - 50} 330 ${x - 20} 320 L${x - 20} 280 L${x + 20} 280 L${x + 20} 320 Q ${x + 50} 330 ${x + 50} 360 L${x + 50} 500 Z" fill="#E3F2FD" stroke="#78909C" stroke-width="4"/><rect x="${x - 46}" y="420" width="92" height="76" fill="${c}" opacity=".35"/>${txt(x, 470, lab, { fs: 24 })}`;
      let s = bottle(170, 'NH₃', '#4FC3F7') + bottle(790, 'HCl', '#81C784');
      const n = 12;
      for (let k = 0; k < n; k++) {
        const u = (t * 0.18 + k / n) % 1, x = lerp(170, 450, u), y = 270 - Math.sin(u * Math.PI) * 120 + 8 * Math.sin(k + t * 3);
        if (t > 1) s += nh3(x, y, 0.36, 1 - seg(u, 0.85, 1));
        const v = (t * 0.18 + k / n + 0.05) % 1, x2 = lerp(790, 510, v), y2 = 270 - Math.sin(v * Math.PI) * 120 + 8 * Math.cos(k + t * 3);
        if (t > 1) s += `<g opacity="${1 - seg(v, 0.85, 1)}" transform="translate(${x2} ${y2}) scale(.36)">${atom(-14, 0, 'H', 13)}${atom(16, 0, 'Cl', 22)}</g>`;
      }
      const w = seg(t, 3, 9);
      for (let k = 0; k < Math.floor(w * 40); k++) { const a = k * 2.399, r = Math.sqrt(k) * 12; s += `<circle cx="${480 + Math.cos(a) * r * 1.4}" cy="${190 + Math.sin(a) * r * 0.7 - 6 * Math.sin(t + k)}" r="${10 + (k % 5)}" fill="#FFFFFF" stroke="#CFD8DC" opacity=".9"/>`; }
      s += txt(480, 95, 'NH₃ + HCl → NH₄Cl', { fs: 32, op: seg(t, 4, 5) }) + TL(480, 325, S.smoke, 20, undefined, seg(t, 5, 6));
      return board(s);
    }
    function cLife(t) {
      let s = `<rect width="960" height="540" fill="#DDF0FC"/><circle cx="830" cy="90" r="46" fill="#FFD54F"/><rect y="330" width="960" height="210" fill="#8D6E63"/><rect y="320" width="960" height="20" fill="#6D4C41"/>`;
      const g = ez(seg(t, 2, 8));
      for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) {
        const x = 60 + c * 105 + (r % 2) * 40, y = 360 + r * 55, h = lerp(14, 60 + r * 8, g) * (0.85 + ((c * 7 + r) % 5) * 0.05);
        s += `<path d="M${x} ${y} Q ${x - 4} ${y - h / 2} ${x} ${y - h}" stroke="#2E7D32" stroke-width="5" fill="none"/><ellipse cx="${x - 12}" cy="${y - h * 0.6}" rx="${8 + g * 8}" ry="${4 + g * 3}" fill="#43A047" transform="rotate(-30 ${x - 12} ${y - h * 0.6})"/><ellipse cx="${x + 12}" cy="${y - h * 0.75}" rx="${8 + g * 8}" ry="${4 + g * 3}" fill="#66BB6A" transform="rotate(30 ${x + 12} ${y - h * 0.75})"/>`;
      }
      if (t >= 0.5 && t <= 7) for (let k = 0; k < 26; k++) { const u = (t * 0.6 + k * 0.13) % 1; s += `<circle cx="${80 + ((k * 97) % 800) + 20 * Math.sin(k * 1.3)}" cy="${lerp(150 + (k % 5) * 12, 330, u)}" r="4" fill="#FAFAFA" stroke="#B0BEC5"/>`; }
      s += `<g opacity="${seg(t, 0.5, 1.5)}"><rect x="30" y="25" width="430" height="122" rx="14" fill="#fff" opacity=".92"/>${TL(245, 70, S.fert, 22)}${txt(245, 126, 'NH₄NO₃ · (NH₄)₂SO₄ · NH₃(aq)', { fs: 22, c: '#2F5BD0' })}</g>`;
      s += `<g opacity="${seg(t, 6, 7)}"><rect x="490" y="160" width="440" height="120" rx="14" fill="#fff" opacity=".92"/>${K.txt(710, 228, K.L(S.uses), { fs: K.fit(K.L(S.uses), 22, 420) })}</g>`;
      return `${DEFS}<rect width="960" height="540" rx="18" fill="#DDF0FC"/>` + s;
    }
    function cBurn(t) {
      let s = `<rect x="120" y="140" width="220" height="330" rx="24" fill="#E3F2FD" stroke="#78909C" stroke-width="5"/><rect x="110" y="128" width="240" height="20" rx="6" fill="#B0BEC5"/>` + txt(230, 505, 'O₂', { fs: 28, c: '#D2362B' });
      for (let k = 0; k < 8; k++) { const x = 150 + (k % 4) * 50 + 8 * Math.sin(t * 1.6 + k), y = 200 + Math.floor(k / 4) * 170 + 10 * Math.cos(t * 1.3 + k); s += `<g transform="translate(${x} ${y}) scale(.45)">${atom(-16, 0, 'O', 20)}${atom(16, 0, 'O', 20)}</g>`; }
      s += `<rect x="222" y="300" width="16" height="170" fill="#90A4AE"/>` + txt(250, 455, '← NH₃', { fs: 20, c: '#2F5BD0', a: 'start' });
      const f = 1 + 0.14 * Math.sin(t * 15) + 0.07 * Math.sin(t * 27), on = seg(t, 1, 1.6);
      s += `<g opacity="${on}"><path d="M230 ${300 - 70 * f} C 205 ${280 - 25 * f} 212 298 230 300 C 248 298 255 ${280 - 25 * f} 230 ${300 - 70 * f}Z" fill="#E6EE9C"/><path d="M230 ${300 - 40 * f} C 220 290 222 298 230 300 C 238 298 240 290 230 ${300 - 40 * f}Z" fill="#FFF59D"/></g>`;
      s += `<g opacity="${seg(t, 2, 3)}"><rect x="400" y="140" width="520" height="110" rx="14" fill="#fff" stroke="#D3DDE5"/>${txt(660, 185, '4NH₃ + 3O₂ → 2N₂ + 6H₂O', { fs: 28 })}${TL(660, 228, S.nocat, 17)}</g>`;
      s += `<g opacity="${seg(t, 5, 6)}"><rect x="400" y="290" width="520" height="110" rx="14" fill="#FFF8E1" stroke="#FFB300"/>${txt(660, 335, '4NH₃ + 5O₂ → 4NO + 6H₂O', { fs: 28, c: '#B45309' })}${TL(660, 378, S.pt, 17)}</g>`;
      const g = seg(t, 6, 7);
      if (g > 0) { s += `<g opacity="${g}"><rect x="560" y="430" width="200" height="60" rx="10" fill="#CFD8DC" stroke="#78909C"/>${txt(660, 468, 'Pt', { fs: 24, c: '#455A64' })}</g>`; for (let k = 0; k < 6; k++) { const u = (t * 0.5 + k / 6) % 1; s += `<g opacity="${g}" transform="translate(${lerp(460, 860, u)} ${470 + 12 * Math.sin(u * 9)}) scale(.45)">${atom(-16, 0, 'N', 20)}${atom(16, 0, 'O', 20)}</g>`; } }
      s += TL(480, 64, S.burn, 26);
      return board(s);
    }
    return { cBond, cLab, cReact0, cFountain, cIon, cSmoke, cLife, cBurn };
  }
  let cache = null;
  T0.registerSim('sim.chem_fixed_scene', {
    mount(el, params) {
      const K = T0.simKit;
      cache = cache || scenes(K);
      const k = (params || {}).k;
      const fn = cache[k];
      if (!fn) { const u = T0.ui.el('div', { class: 't0-unsupported', text: T0.s('unsupported') + ': sim.chem_fixed_scene/' + k }); el.append(u); return { unmount() { u.remove(); } }; }
      return K.scene(el, params, (t) => fn(t), { kind: 'sim.chem_fixed_scene', label: ARIA[k], tEnd: 9 });
    },
  });
})();
