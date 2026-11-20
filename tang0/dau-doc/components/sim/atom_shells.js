/* sim.atom_shells – mô hình lớp electron (V07, agent L: viết lại theo cShell của thư viện __DRAW bản cũ kimyo8/fizika8).
 * params: {el: ['Na','K'] | 'O' (hoặc elements), title?: i18n, note?: i18n}.
 * Khung SVG 960×540 qua T0.simKit.scene (rAF, dừng khi khuất, bấm để phát lại, prefers-reduced-motion -> trạng thái cuối):
 *  – mỗi nguyên tố: các vòng lớp, electron hiện dần (0,8–5 s) rồi quay (lớp chẵn/lẻ ngược chiều), hạt nhân '+Z' tô theo nguyên tố,
 *    nhãn 'X · Z = n' phía trên, cấu hình '2, 8, 1' phía dưới (hiện ở 4–5 s);
 *  – tiêu đề và ghi chú vẽ TRONG hình bằng K.TL (song ngữ: dòng gốc + bản dịch nhỏ), như bản cũ.
 * Cấu hình lớp: K.shells (Z ≤ 36). */
(function () {
  const T0 = window.T0;
  function draw(t, v, K) {
    const els = [].concat(v.el || v.elements || []).filter(Boolean);
    const n = Math.max(1, els.length);
    let s = '';
    els.forEach((el, i) => {
      const sh = K.shells(el) || [1];
      const cx = 960 * (i + 0.5) / n, cy = 250;
      const R0 = Math.min(56, 150 / (1 + 0.75 * Math.max(0, sh.length - 1)), 260 / (sh.length * 0.75 + 1.2) / Math.max(1, n * 0.55));
      const f = K.seg(t, 0.8, 5);
      sh.forEach((cnt, k) => {
        const r = R0 + k * R0 * 0.75;
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="#9FB3C2" stroke-width="2"/>`;
        const shown = Math.round(cnt * f);
        for (let j = 0; j < shown; j++) {
          const a = (j / cnt) * 2 * Math.PI + t * 0.25 * (k % 2 ? -1 : 1);
          const outer = k === sh.length - 1;
          s += `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="7" fill="${outer ? '#F29A0B' : '#0B7FD1'}" stroke="#fff" stroke-width="1.5"/>`;
        }
      });
      s += `<circle cx="${cx.toFixed(1)}" cy="${cy}" r="${(R0 * 0.62).toFixed(1)}" fill="url(#ag${K.EC[el] ? el : 'Ca'})"/>` + K.txt(cx, cy + R0 * 0.22, '+' + (K.Z[el] || '?'), { fs: R0 * 0.55, c: '#fff' });
      const outerR = R0 + (sh.length - 1) * R0 * 0.75;
      s += K.txt(cx, cy - outerR - 22, el + ' · Z = ' + (K.Z[el] || '?'), { fs: 24, op: K.seg(t, 0.2, 1) });
      s += K.txt(cx, cy + outerR + 44, sh.join(', '), { fs: 24, c: '#0B7FD1', op: K.seg(t, 4, 5) });
    });
    if (v.title) s += K.TL(480, 40, v.title, 20);
    if (v.note) s += K.TL(480, 500, v.note, 17, '#51636F', K.seg(t, 5, 6));
    return K.board(s);
  }
  T0.registerSim('sim.atom_shells', {
    mount(el, params) {
      const K = T0.simKit;
      const p = params || {};
      const label = [].concat(p.el || p.elements || []).map((x) => x + ': ' + ((K && K.shells(x)) || []).join(', ')).join('; ');
      if (!K) { const d = T0.ui.el('div', { text: label }); el.append(d); return { unmount() { d.remove(); } }; }
      // tiêu đề/ghi chú vẽ trong SVG (như bản cũ) -> không lặp ở chú thích HTML
      return K.scene(el, { _src: p }, (t, k) => draw(t, p, k), { kind: 'sim.atom_shells', tEnd: 6, label: [T0.t(p.title), label, T0.t(p.note)].filter(Boolean).join('. ') });
    },
  });
})();
