/* sim.test_tube – thí nghiệm trong ống nghiệm (agent E, đề xuất 004; gốc __DRAW.cTube).
 * params: {start:{label, color}, add:{label, color?}, result:{type: color|gas|precip, color?, label}, eq?, title?}.
 * label: chuỗi (công thức – tự viết chỉ số dưới) hoặc chuỗi đa ngữ {uz,ru,vi}. */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { cl, seg, lerp, txt, TL, board, pretty, L, fit } = K;
    const st = v.start || {}, ad = v.add || {}, res = v.result || {};
    const lab = (o) => (o == null ? '' : typeof o === 'string' ? pretty(o) : L(o));
    const x = 480, top = 150, bot = 470, w = 90;
    const sc = st.color || '#B3E5FC', rc = res.color || sc, mix = seg(t, 3.2, 5.5);
    let s = `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bot - top}" rx="${w / 2}" fill="#F7FBFF" stroke="#78909C" stroke-width="4"/>`;
    const lvl = lerp(330, 300, seg(t, 1.5, 3.2));
    s += `<defs><linearGradient id="mixg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${rc}"/><stop offset="${1 - mix}" stop-color="${rc}"/><stop offset="${Math.min(1, 1 - mix + 0.01)}" stop-color="${sc}"/><stop offset="1" stop-color="${sc}"/></linearGradient><clipPath id="tb"><rect x="${x - w / 2 + 4}" y="${top}" width="${w - 8}" height="${bot - top - 4}" rx="${w / 2 - 4}"/></clipPath></defs>`;
    s += `<g clip-path="url(#tb)"><rect x="${x - w / 2}" y="${lvl}" width="${w}" height="${bot - lvl}" fill="${res.type === 'color' ? (mix > 0.98 ? rc : 'url(#mixg)') : sc}" opacity=".85"/></g>`;
    /* ống nhỏ giọt + giọt */
    const dp = seg(t, 0.8, 1.6), dy = lerp(40, 90, dp);
    s += `<g opacity="${1 - seg(t, 4, 5)}"><rect x="${x - 10}" y="${dy - 50}" width="20" height="60" rx="6" fill="#E3F2FD" stroke="#78909C" stroke-width="3"/><ellipse cx="${x}" cy="${dy - 58}" rx="16" ry="12" fill="#EF9A9A"/></g>`;
    for (let k = 0; k < 4; k++) { const u = seg(t, 1.6 + k * 0.4, 2.2 + k * 0.4); if (u > 0 && u < 1) s += `<circle cx="${x}" cy="${lerp(dy + 14, lvl, u)}" r="7" fill="${ad.color || '#E0E0E0'}"/>`; }
    if (res.type === 'precip') for (let k = 0; k < Math.floor(mix * 26); k++) { const u = cl((t - 3.2 - k * 0.08) / 2.4), xx = x - 30 + ((k * 37) % 60), yy = lerp(lvl + 15, bot - 18 - (k % 5) * 5, u); s += `<circle cx="${xx}" cy="${yy}" r="${5 + (k % 3)}" fill="${res.color || '#FFFFFF'}" stroke="#90A4AE" stroke-width="1"/>`; }
    if (res.type === 'gas' && mix > 0) {
      for (let k = 0; k < 14; k++) { const u = (t * 0.7 + k / 14) % 1, xx = x - 28 + ((k * 29) % 56) + 5 * Math.sin(t * 5 + k); s += `<circle cx="${xx}" cy="${lerp(bot - 20, lvl, u)}" r="${4 + (k % 3) * 2}" fill="${res.color ? res.color : 'none'}" fill-opacity=".35" stroke="#546E7A" stroke-width="2" opacity="${1 - u * 0.6}"/>`; }
      if (mix > 0.3) s += txt(x + 80, lvl - 20, '↑', { fs: 44, c: '#546E7A' });
    }
    const sl = lab(st.label), al = '+ ' + lab(ad.label), rl = lab(res.label);
    s += txt(220, 240, sl, { fs: fit(sl, 26, 360) }) + txt(220, 320, al, { fs: fit(al, 24, 360), c: '#51636F', op: seg(t, 1, 2) });
    if (rl) s += txt(740, 260, rl, { fs: fit(rl, 26, 400), c: res.type === 'precip' ? '#5D4037' : '#14324A', op: seg(t, 4.5, 5.5) });
    if (v.eq) { const e = pretty(v.eq); s += `<g opacity="${seg(t, 5.5, 6.5)}"><rect x="40" y="482" width="880" height="50" rx="10" fill="#fff" stroke="#D3DDE5"/>${txt(480, 516, e, { fs: fit(e, 28, 860) })}</g>`; }
    return board(s);
  }
  T0.registerSim('sim.test_tube', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.test_tube' }); } });
})();
