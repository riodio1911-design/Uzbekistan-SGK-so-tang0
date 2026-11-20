/* sim.ratio_bars — agent F (005). params {parts:[{n, label:{uz,ru,vi}}], unit?, mode?}. Sơ đồ đoạn thẳng tỉ số:
 * mỗi đối tượng một băng n phần bằng nhau; có giá trị 1 phần → giá trị từng đối tượng và tổng. Nhãn theo ngôn ngữ đang chọn. */
(function () {
  const T0 = window.T0;
  T0.registerSim('sim.ratio_bars', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el, inter = K.interactive(params, ctx);
      const v = { parts: (params.parts || []).map((p) => ({ n: Math.max(1, +p.n || 1), label: p.label })), unit: params.unit == null ? null : +params.unit };
      if (!v.parts.length) v.parts = [{ n: 1, label: 'A' }, { n: 2, label: 'B' }];
      if (inter && v.unit == null) v.unit = 1;
      const cols = [K.C.a, K.C.b, K.C.c];
      const val = (x) => K.fmt(+(+x).toFixed(2));
      return K.shell(el, {
        kind: 'sim.ratio_bars',
        draw(view) {
          const mx = Math.max(...v.parts.map((p) => p.n)), bw = Math.max(18, Math.min(40, Math.floor(280 / mx)));
          const tot = v.parts.reduce((a, p) => a + p.n, 0), hasU = v.unit != null;
          const box = E('div', { class: 't0m-bars' });
          v.parts.forEach((p, i) => {
            const bx = E('div', { class: 'bx' });
            const us = hasU ? K.fmt(v.unit) : '';
            for (let k = 0; k < p.n; k++) bx.append(E('span', { style: { width: bw + 'px', background: cols[i % 3], fontSize: (us.length > 3 ? 10 : 13) + 'px' }, text: bw >= 24 ? us : '' }));
            box.append(E('div', null, E('div', { class: 'lb' }, T0.t(p.label) || '', hasU ? ' — ' + val(p.n * v.unit) : ''), bx));
          });
          view.append(E('div', { class: 't0m-fig', style: { justifyContent: 'flex-start' } }, box),
            E('div', { class: 't0m-big', text: v.parts.map((p) => p.n).join(' : ') + (hasU ? ' → ' + v.parts.map((p) => val(p.n * v.unit)).join(' : ') : '') }),
            E('div', { class: 't0m-note', text: K.t('total', { t: tot }) + (hasU ? ' = ' + val(tot * v.unit) : '') }));
        },
        controls: inter ? (c, draw) => {
          v.parts.forEach((p) => c.append(K.range(T0.t(p.label) || '·', p.n, 1, 12, 1, (x) => { p.n = x; draw(); })));
          c.append(K.number(K.t('unit'), v.unit, { min: 0.01, step: 'any' }, (x) => { if (x > 0) { v.unit = x; draw(); } }));
        } : null,
      });
    },
  });
})();
