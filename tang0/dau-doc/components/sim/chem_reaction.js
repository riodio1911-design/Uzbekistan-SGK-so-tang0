/* sim.chem_reaction – phản ứng hóa học có theo dõi nguyên tử (agent E, đề xuất 004; gốc __DRAW.cReact).
 * params: {eq: 'Ca + 2H2O -> Ca(OH)2 + H2' (mũi tên -> → = ⇄ <=>), cond?: 't°', title?, note?}.
 * Hệ số nhỏ: từng nguyên tử bay từ chất đầu sang sản phẩm; nhiều phân tử/phân tử lớn: mờ dần + huy hiệu ×k.
 * Cuối cảnh hiện bảng đếm nguyên tố hai vế (✓ khi cân bằng – K.balance). */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const { seg, ez, lerp, txt, atom, board, pretty, parseEq, geom, bondsOf, counts, RAD, fit } = K;
    const eq = String(v.eq || '');
    const e = parseEq(eq);
    const nL = e.L.reduce((a, x) => a + x.k, 0), nR = e.R.reduce((a, x) => a + x.k, 0);
    const big = e.L.concat(e.R).some((x) => geom(x.f).length > 9), many = Math.max(nL, nR) > 12 || big;
    const layout = (side, x0, x1) => {
      const mols = [];
      side.forEach((tm) => { for (let k = 0; k < (many ? 1 : tm.k); k++) mols.push({ f: tm.f, g: geom(tm.f), badge: many && tm.k > 1 ? tm.k : 0 }); });
      const n = mols.length || 1, cols = n <= 3 ? n : Math.ceil(Math.sqrt(n * 1.4)), rows = Math.ceil(n / cols), cw = (x1 - x0) / cols, rh = Math.min(130, 300 / rows), sc = Math.min(46, cw / 3.4, rh / 2.8);
      mols.forEach((m, i) => { const cx = x0 + cw * ((i % cols) + 0.5), cy = 250 - ((rows - 1) * rh) / 2 + Math.floor(i / cols) * rh; Object.assign(m, { cx, cy, sc, atoms: m.g.map((a) => ({ el: a.el, x: cx + a.x * sc, y: cy - a.y * sc })) }); });
      return mols;
    };
    const Lm = layout(e.L, 40, 410), Rm = layout(e.R, 550, 920), p = ez(seg(t, 2.2, 5.4));
    const all = Lm.concat(Rm);
    const r0 = (all.length ? Math.min(...all.map((m) => m.sc)) : 40) * 0.5;
    const bond = (m, w, op = 1) => bondsOf(m.g).map(([i, j]) => `<line x1="${m.atoms[i].x}" y1="${m.atoms[i].y}" x2="${m.atoms[j].x}" y2="${m.atoms[j].y}" stroke="#5B6B7A" stroke-width="${w}" opacity="${op}"/>`).join('');
    let s = '';
    if (!many) {
      const pool = {}, used = {}, draws = [];
      Lm.forEach((m) => m.atoms.forEach((a) => (pool[a.el] = pool[a.el] || []).push(a)));
      Rm.forEach((m) => m.atoms.forEach((b) => { const k = (used[b.el] = used[b.el] || 0); used[b.el]++; const a = (pool[b.el] || [])[k] || b; draws.push({ el: b.el, x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) }); }));
      if (p < 0.05) Lm.forEach((m) => (s += bond(m, Math.max(3, r0 * 0.35))));
      if (p > 0.97) Rm.forEach((m) => (s += bond(m, Math.max(3, r0 * 0.35))));
      draws.forEach((d) => (s += atom(d.x, d.y, d.el, Math.max(9, (RAD(d.el) * r0) / 22))));
    } else {
      const fade = seg(t, 2.2, 4.5);
      [[Lm, 1 - fade * 0.65], [Rm, fade]].forEach(([ms, op]) => ms.forEach((m) => {
        if (m.g.length > 9) { const w = Math.max(90, pretty(m.f).length * 15); s += `<g opacity="${op}"><rect x="${m.cx - w / 2}" y="${m.cy - 26}" width="${w}" height="52" rx="26" fill="#fff" stroke="#0B7FD1" stroke-width="3"/>${txt(m.cx, m.cy + 9, pretty(m.f), { fs: 24 })}</g>`; return; }
        s += bond(m, 4, op);
        m.atoms.forEach((a) => (s += atom(a.x, a.y, a.el, Math.max(9, (RAD(a.el) * r0) / 22), op)));
        if (m.badge) s += `<g opacity="${op}"><circle cx="${m.cx - m.sc * 1.9}" cy="${m.cy - m.sc * 1.1}" r="20" fill="#0B7FD1"/>${txt(m.cx - m.sc * 1.9, m.cy - m.sc * 1.1 + 7, '×' + m.badge, { fs: 18, c: '#fff' })}</g>`;
      }));
    }
    s += txt(480, 262, e.rev ? '⇄' : '→', { fs: 54, c: '#0B7FD1' });
    if (v.cond) s += txt(480, 304, pretty(v.cond), { fs: fit(v.cond, 22, 170), fw: 600, c: '#51636F' });
    const head = pretty(eq.replace(/\s*->\s*/, ' → ').replace(/\s*<=>\s*/, ' ⇄ '));
    s += txt(480, 62, head, { fs: fit(head, 38, 900), op: seg(t, 0.2, 1) });
    const sideTxt = (side) => side.map((x) => (x.k > 1 ? x.k : '') + pretty(x.f)).join(' + ');
    const lt = sideTxt(e.L), rt = sideTxt(e.R);
    s += txt(225, 445, lt, { fs: fit(lt, 26, 380), c: '#51636F' }) + txt(735, 445, rt, { fs: fit(rt, 26, 380), c: '#51636F' });
    const cL = counts(e.L), cR = counts(e.R), ok = Object.keys(cL).every((k) => cL[k] === cR[k]) && Object.keys(cR).every((k) => cL[k] === cR[k]);
    const tally = Object.keys(cL).map((k) => k + ': ' + cL[k] + ' = ' + (cR[k] || 0)).join('   ') + (ok ? '  ✓' : '');
    s += `<g opacity="${seg(t, 5.8, 6.8)}"><rect x="60" y="468" width="840" height="56" rx="12" fill="#fff" stroke="#D3DDE5"/>${txt(480, 505, tally, { fs: fit(tally, 26, 800), c: ok ? '#1E7A3C' : '#B3261E' })}</g>`;
    return board(s);
  }
  T0.registerSim('sim.chem_reaction', { mount(el, params) { const K = T0.simKit; return K.scene(el, params, (t) => draw(t, params || {}, K), { kind: 'sim.chem_reaction' }); } });
})();
