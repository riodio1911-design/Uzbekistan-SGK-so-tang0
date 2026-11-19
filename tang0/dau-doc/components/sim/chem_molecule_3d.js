/* sim.chem_molecule_3d – 1–3 phân tử xoay 3D (agent E, đề xuất 004; gốc __DRAW.cMol).
 * params: {mol: 'H2O' | ['CH4','NH3','H2O'], title?, note?}. Hình học: K.PRE (~30 chất) hoặc xếp vòng quanh nguyên tử trung tâm.
 * Thêm so với bản cũ: kéo ngang trên hình để tự xoay (chế độ tương tác nhẹ). */
(function () {
  const T0 = window.T0;
  function draw(t, v, K, drag) {
    const { seg, txt, atom, board, pretty, geom, bondsOf, RAD } = K;
    const ms = [].concat(v.mol || v.mols || []), n = ms.length || 1;
    let s = '';
    ms.forEach((f, mi) => {
      const g = geom(f), cx = (960 * (mi + 0.5)) / n, cy = 260, sc = Math.min(150, (330 / n) * 0.62), a = t * 0.8 + mi + drag.a, tilt = 0.35;
      const pr = (q) => { const X = q.x * Math.cos(a) + q.z * Math.sin(a), Zz = -q.x * Math.sin(a) + q.z * Math.cos(a), Y = q.y * Math.cos(tilt) - Zz * Math.sin(tilt), Z2 = q.y * Math.sin(tilt) + Zz * Math.cos(tilt); return [cx + X * sc, cy - Y * sc, Z2]; };
      const P = g.map(pr), it = [];
      bondsOf(g).forEach(([i, j]) => it.push({ z: (P[i][2] + P[j][2]) / 2 - 0.01, s: `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}" stroke="#5B6B7A" stroke-width="${sc * 0.09}" stroke-linecap="round"/>` }));
      P.forEach((p2, k) => it.push({ z: p2[2], s: atom(p2[0], p2[1], g[k].el, (RAD(g[k].el) * sc) / 105, 1, p2[2] > -0.25 || g.length < 3) }));
      it.sort((x, y) => x.z - y.z);
      s += it.map((x) => x.s).join('') + txt(cx, 478, pretty(f), { fs: n > 2 ? 34 : 40, op: seg(t, 0.3, 1) });
    });
    return board(s);
  }
  T0.registerSim('sim.chem_molecule_3d', {
    mount(el, params) {
      const K = T0.simKit, drag = { a: 0 };
      const inst = K.scene(el, params, (t) => draw(t, params || {}, K, drag), { kind: 'sim.chem_molecule_3d' });
      const svg = inst.el.querySelector('svg');
      let x0 = null;
      svg.style.touchAction = 'pan-y';
      svg.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
      svg.addEventListener('pointermove', (e) => { if (x0 == null) return; drag.a += ((e.clientX - x0) / Math.max(200, svg.clientWidth)) * 4; x0 = e.clientX; });
      const up = () => { x0 = null; };
      svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); svg.addEventListener('pointerleave', up);
      return inst;
    },
  });
})();
