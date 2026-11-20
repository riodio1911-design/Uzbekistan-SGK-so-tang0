/* sim.decimal_shift — agent F (005). params {n, op:'×'|'÷', by:10|100|1000, mode?}.
 * Bảng hàng (có cột 0,1–0,001), chữ số trượt sang trái/phải theo số chữ số 0, rồi hiện kết quả. Câu "Raqamlar chapga…" đa ngữ. */
(function () {
  const T0 = window.T0;
  function digs(x) { // 11 ô: 8 nguyên + 3 thập phân
    const s = (+x).toFixed(3), [i, f] = s.split('.');
    const a = Array(11).fill(''); const ip = i.padStart(8, ' ').slice(-8);
    for (let k = 0; k < 8; k++) a[k] = ip[k] === ' ' ? '' : ip[k];
    for (let k = 0; k < 3; k++) a[8 + k] = f[k];
    let last = 10; while (last > 7 && a[last] === '0') { a[last] = ''; last--; }
    return a;
  }
  T0.registerSim('sim.decimal_shift', {
    mount(el, params, ctx) {
      const K = T0.mathKit, E = T0.ui.el;
      const v = { n: +params.n || 32, op: params.op === '÷' || params.op === ':' || params.op === '/' ? '÷' : '×', by: +params.by || 10 };
      let timers = [];
      const clear = () => { timers.forEach(clearTimeout); timers = []; };
      return K.shell(el, {
        kind: 'sim.decimal_shift',
        cleanup: clear,
        draw(view) {
          clear();
          const st = Math.round(Math.log10(v.by)), r = +(v.op === '×' ? v.n * v.by : v.n / v.by).toFixed(3);
          const a = digs(v.n), b = digs(r);
          const used = [...a.keys()].filter((i) => a[i] !== '' || b[i] !== '');
          const f = Math.min(...used), to = Math.max(7, ...used), P = K.places();
          const tb = E('table', { class: 't0m-pvt' });
          const hr = E('tr'), dr = E('tr');
          for (let i = f; i <= to; i++) { hr.append(E('th', { scope: 'col', text: P[i] })); dr.append(E('td', null, E('span', { class: 'd', text: a[i] }))); }
          tb.append(hr, dr);
          const res = E('span', { style: { opacity: '0', transition: 'opacity .5s' }, text: K.fmt(r) });
          const replay = E('button', { class: 't0-btn ghost', type: 'button', 'aria-label': K.t('replay') }, '↻');
          view.append(E('div', { class: 't0m-fig' }, tb),
            E('div', { class: 't0m-big' }, K.fmt(v.n) + ' ' + v.op + ' ' + K.fmt(v.by) + ' = ', res),
            E('div', { class: 't0m-note', text: K.t(v.op === '×' ? 'shift_left' : 'shift_right', { n: st }) }), replay);
          const dir = v.op === '×' ? -st : st;
          const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
          const finish = () => { if (!tb.isConnected) return; [...dr.cells].forEach((td, k) => { td.innerHTML = ''; td.append(E('span', { class: 'd', text: b[f + k] })); }); res.style.opacity = '1'; };
          const anim = () => {
            const tds = dr.cells; if (tds.length < 2) { finish(); return; }
            const w = tds[1].getBoundingClientRect().left - tds[0].getBoundingClientRect().left;
            tb.querySelectorAll('.d').forEach((d) => { d.style.transform = `translateX(${dir * w}px)`; });
            timers.push(setTimeout(() => { res.style.opacity = '1'; }, 800), setTimeout(finish, 1300));
          };
          if (still) finish(); else timers.push(setTimeout(anim, 700));
          replay.onclick = () => { view.innerHTML = ''; this.draw(view); };
        },
        controls: K.interactive(params, ctx) ? (c, draw) => {
          c.append(K.number(K.t('number'), v.n, { min: 0.001, max: 9999999, step: 'any' }, (x) => { if (x > 0) { v.n = x; draw(); } }),
            K.seg(K.t('operation'), [['×', '×'], ['÷', '÷']], v.op, (o) => { v.op = o; draw(); }),
            K.seg(K.t('by'), [[10, '10'], [100, '100'], [1000, '1000']], v.by, (o) => { v.by = o; draw(); }));
        } : null,
      });
    },
  });
})();
