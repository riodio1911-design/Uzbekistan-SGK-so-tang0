/* sim.electrolysis – bình điện phân: ion về hai cực, kim loại bám catot, khí thoát ra (agent E, đề xuất 004; gốc __DRAW.pElectro).
 * params: {cat: 'Cu²⁺', an: 'SO₄²⁻', color?: màu dung dịch, depColor?: màu lớp bám | 'none', gas?, eq?, title?}. */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { seg, lerp, txt, board, pretty, fit } = K;
    let s = `<path d="M220 200 L740 200 L720 480 L240 480 Z" fill="#E1F5FE" stroke="#78909C" stroke-width="4"/><rect x="228" y="250" width="504" height="226" fill="${v.color || '#B3E5FC'}" opacity=".7"/>`;
    s += `<rect x="300" y="160" width="26" height="260" fill="#546E7A"/><rect x="634" y="160" width="26" height="260" fill="#90A4AE"/>` + txt(313, 146, 'K (−)', { fs: 24, c: '#1565C0' }) + txt(647, 146, 'A (+)', { fs: 24, c: '#C2410C' });
    s += `<path d="M313 160 L313 90 L455 90 M505 90 L647 90 L647 160" fill="none" stroke="#37474F" stroke-width="5" stroke-linejoin="round"/><line x1="465" y1="80" x2="465" y2="100" stroke="#37474F" stroke-width="9"/><line x1="480" y1="70" x2="480" y2="110" stroke="#37474F" stroke-width="4"/>` + txt(452, 132, '−', { fs: 22, c: '#2F5BD0' }) + txt(494, 132, '+', { fs: 22, c: '#C2410C' });
    const dep = seg(t, 2, 8);
    if (dep > 0 && v.depColor !== 'none') s += `<rect x="326" y="250" width="${4 + dep * 8}" height="170" fill="${v.depColor || '#B5651D'}"/>`;
    const cat = v.cat || 'M⁺', an = v.an || 'X⁻';
    for (let k = 0; k < 8; k++) {
      const u = (t * 0.18 + k / 8) % 1, y = 280 + (k % 4) * 45;
      s += `<g transform="translate(${lerp(560, 345, u)} ${y})"><circle r="19" fill="#FFCCBC" stroke="#C2410C" stroke-width="2"/>${txt(0, 6, cat, { fs: cat.length > 3 ? 13 : 15, c: '#C2410C' })}</g>`;
      const w = (t * 0.18 + k / 8 + 0.5) % 1, y2 = 300 + (k % 4) * 45;
      s += `<g transform="translate(${lerp(400, 615, w)} ${y2})"><circle r="19" fill="#C5CAE9" stroke="#283593" stroke-width="2"/>${txt(0, 6, an, { fs: an.length > 3 ? 12 : 15, c: '#283593' })}</g>`;
    }
    if (v.gas) { for (let k = 0; k < 10; k++) { const u = (t * 0.6 + k / 10) % 1; s += `<circle cx="${615 + ((k * 13) % 30)}" cy="${lerp(470, 255, u)}" r="${3 + (k % 3)}" fill="none" stroke="#455A64" stroke-width="1.6"/>`; } s += txt(710, 240, pretty(v.gas), { fs: 22, c: '#455A64' }); }
    if (v.eq) { const e = pretty(v.eq); s += `<g opacity="${seg(t, 5, 6)}"><rect x="100" y="488" width="760" height="46" rx="10" fill="#fff" stroke="#D3DDE5"/>${txt(480, 520, e, { fs: fit(e, 26, 740) })}</g>`; }
    return board(s);
  }
  T0.registerSim('sim.electrolysis', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.electrolysis' }); } });
})();
