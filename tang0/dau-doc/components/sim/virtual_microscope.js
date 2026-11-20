/* sim.virtual_microscope — agent F (007, biologiya5 micro3). params {img, objectives[4,10,40], focus_targets{obj:0–100}, focus,
 * zoom_scale[], eyepiece, sharp_tolerance, strings{objective, focus_label, magnification, sharp, blurry}} – mọi số liệu từ params. */
(function () {
  const T0 = window.T0;
  const CSS = `
.t0vm{display:grid;grid-template-columns:minmax(0,260px) 1fr;gap:16px;align-items:center}
@media (max-width:560px){.t0vm{grid-template-columns:1fr}.t0vm-eye{max-width:240px;margin:0 auto;width:100%}}
.t0vm-eye{aspect-ratio:1;border-radius:50%;overflow:hidden;border:10px solid #14324A;background:#000}
.t0vm-eye img{width:100%;height:100%;object-fit:cover;transition:transform .3s,filter .15s}
.t0vm input[type=range]{width:100%;height:var(--touch-min,44px);accent-color:var(--color-accent)}
.t0vm-row{display:flex;gap:8px;flex-wrap:wrap}
.t0vm p{margin:6px 0 0}`;
  T0.registerSim('sim.virtual_microscope', {
    mount(el, P) {
      if (!document.getElementById('t0vm-css')) document.head.append(Object.assign(document.createElement('style'), { id: 't0vm-css', textContent: CSS }));
      const E = T0.ui.el, t = T0.t, S = P.strings || {};
      const OBJ = P.objectives || [4, 10, 40], TG = P.focus_targets || {}, Z = P.zoom_scale || OBJ.map((o) => o / OBJ[0]);
      const eyep = P.eyepiece || 10, tol = P.sharp_tolerance == null ? 3 : P.sharp_tolerance;
      const st = { o: 0, f: P.focus == null ? 20 : +P.focus };
      const root = E('div', { class: 't0vm' });
      el.append(root);
      let img, mag, msg, btns, rng;
      function build() {
        root.innerHTML = '';
        img = E('img', { src: T0.asset(P.img || ''), alt: '' });
        const right = E('div');
        right.append(E('div', { style: { fontWeight: '700', marginBottom: '6px' }, text: t(S.objective) || 'Obj' }));
        btns = E('div', { class: 't0vm-row', role: 'group' });
        OBJ.forEach((x, i) => { const b = E('button', { class: 't0-btn', type: 'button' }, x + '×'); b.onclick = () => { st.o = i; upd(); }; btns.append(b); });
        const id = 'vm' + Math.random().toString(36).slice(2, 8);
        rng = E('input', { id, type: 'range', min: 0, max: 100, value: st.f });
        rng.oninput = () => { st.f = +rng.value; upd(); };
        mag = E('p', { style: { fontWeight: '800' }, 'aria-live': 'polite' }); msg = E('p', { 'aria-live': 'polite' });
        right.append(btns, E('label', { for: id, style: { display: 'block', fontWeight: '700', margin: '12px 0 0' }, text: t(S.focus_label) || '' }), rng, mag, msg);
        root.append(E('div', { class: 't0vm-eye' }, img), right);
        upd();
      }
      function upd() {
        const tg = TG[OBJ[st.o]] != null ? +TG[OBJ[st.o]] : 50, d = Math.abs(st.f - tg);
        img.style.transform = `scale(${Z[st.o] || 1})`;
        img.style.filter = `blur(${Math.max(0, (d - tol) / 4).toFixed(1)}px)`;
        [...btns.children].forEach((b, i) => { b.classList.toggle('primary', i === st.o); b.setAttribute('aria-pressed', String(i === st.o)); });
        mag.textContent = (t(S.magnification) || '') + ': ' + eyep + '× · ' + OBJ[st.o] + '× = ' + eyep * OBJ[st.o] + '×';
        msg.textContent = d <= tol ? t(S.sharp) || '✓' : t(S.blurry) || '…';
      }
      build();
      const off = T0.on('t0:lang', build);
      return { unmount() { off(); root.remove(); }, state: st, sharp: () => Math.abs(st.f - (+TG[OBJ[st.o]] || 50)) <= tol };
    },
  });
})();
