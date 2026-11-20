/* sim.scene_player – trình phát "video" hoạt hình dựng bằng mã (R1, tối thiểu để ghim video mở được).
 * params: {video: <id trong book.videos> | <đối tượng video>}. Mỗi cảnh: tiêu đề, hình (T0.renderSim(scene.visual)),
 * lời thuyết minh (T0.media.play(audio_ref) – không có file thì giọng trình duyệt). Tự sang cảnh khi đọc xong.
 * sim.scene_page_image nay ở components/sim/scene_vk.js. */
(function () {
  const T0 = window.T0;
  const CSS = `
.sp{display:flex;flex-direction:column;gap:var(--space-3,12px)}
.sp-stage{background:var(--color-video-bg,#0b1a26);border-radius:var(--radius-md,10px);padding:var(--space-3,12px);min-height:180px;display:flex;flex-direction:column;justify-content:center;color:#fff}
.sp-stage .t0-unsupported{color:#cfd8e0;border-color:#4a6378}
.sp-title{margin:0;font-size:var(--text-h3,18px);font-family:var(--font-display)}
.sp-nar{margin:0;line-height:var(--lh-body,1.5);font-size:var(--text-body,16px)}
.sp-ctl{display:flex;gap:var(--space-2,8px);align-items:center;flex-wrap:wrap}
.sp-dots{display:flex;flex-wrap:wrap;gap:0 2px;flex:1;min-width:0;justify-content:center}
.sp-dots button{width:32px;min-width:32px;height:var(--touch-min,44px);border:0;background:transparent;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center}
.sp-dots button::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--color-line)}
.sp-dots button[aria-current="true"]::before{background:var(--color-accent);width:22px;border-radius:5px}
.sp-real video{display:block;width:100%;max-height:70vh;border-radius:var(--radius-md,10px);background:#000}
.sp.is-real .sp-anim{display:none}
.sp:not(.is-real) .sp-real{display:none}`;
  function css() { if (!document.getElementById('sp-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'sp-css', textContent: CSS })); }
  const L = { real: { uz: 'Haqiqiy video', ru: 'Настоящее видео', vi: 'Video thật' }, anim: { uz: 'Animatsiya', ru: 'Анимация', vi: 'Hoạt hình' }, play: { uz: 'Ijro', ru: 'Пуск', vi: 'Phát' }, pause: { uz: 'To‘xtatish', ru: 'Пауза', vi: 'Dừng' }, prev: { uz: 'Oldingi', ru: 'Назад', vi: 'Trước' }, next: { uz: 'Keyingi', ru: 'Далее', vi: 'Tiếp' } };

  T0.registerSim('sim.scene_player', {
    mount(el, params, ctx) {
      css();
      const E = T0.ui.el;
      const v = typeof params.video === 'string' ? T0.find('video', params.video) : params.video;
      const root = E('div', { class: 'sp' });
      el.append(root);
      if (!v) { root.append(E('div', { class: 't0-unsupported', text: T0.s('not_found') + ': ' + params.video })); return { unmount() { root.remove(); } }; }
      let i = 0, playing = false, visual = null, token = 0;
      const stage = E('div', { class: 'sp-stage' });
      const title = E('h3', { class: 'sp-title' });
      const nar = E('p', { class: 'sp-nar', 'aria-live': 'polite' });
      const prev = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.prev) }, '◀');
      const play = E('button', { class: 't0-btn primary', type: 'button' });
      const next = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.next) }, '▶');
      const dots = E('div', { class: 'sp-dots' });
      // G (009): video thật giáo viên gắn (T0.classroom.mediaFor) – phát <video>, nút chuyển về hoạt hình
      const realBox = E('div', { class: 'sp-real' });
      const sw = E('button', { class: 't0-btn', type: 'button', hidden: true });
      let useReal = true, realSrc = null;
      function syncReal() {
        let m = null; try { m = T0.classroom && T0.classroom.mediaFor ? T0.classroom.mediaFor(v.id) : null; } catch (e) { m = null; }
        const src = m && m.src;
        sw.hidden = !src;
        if (src !== realSrc) { realSrc = src; realBox.innerHTML = ''; if (src) realBox.append(E('video', { src, controls: true, playsinline: true, preload: 'metadata', title: (m.title || T0.t(v.title) || '') })); }
        const on = !!src && useReal;
        root.classList.toggle('is-real', on);
        if (on) setPlaying(false); else { const vd = realBox.querySelector('video'); if (vd) vd.pause(); }
        sw.textContent = on ? '🎞 ' + T0.t(L.anim) : '🎬 ' + T0.t(L.real);
      }
      sw.onclick = () => { useReal = !useReal; syncReal(); };
      const animBox = E('div', { class: 'sp-anim' }, title, stage, nar, E('div', { class: 'sp-ctl' }, prev, dots, next, play));
      root.append(realBox, animBox, E('div', { class: 'sp-ctl' }, sw));
      function show(n) {
        i = Math.max(0, Math.min(v.scenes.length - 1, n));
        const sc = v.scenes[i];
        if (visual && visual.unmount) visual.unmount();
        stage.innerHTML = '';
        title.textContent = T0.t(sc.title) || T0.t(v.title);
        nar.textContent = T0.t(sc.narration);
        visual = sc.visual.type === 'image' ? (stage.append(E('img', { src: T0.asset(sc.visual.src), alt: '', style: { width: '100%' } })), null) : T0.renderSim(stage, { kind: sc.visual.kind, params: sc.visual.params || {} });
        dots.innerHTML = '';
        v.scenes.forEach((_, j) => { const d = E('button', { type: 'button', 'aria-label': String(j + 1), 'aria-current': String(j === i) }); d.onclick = () => go(j); dots.append(d); });
        prev.disabled = i === 0; next.disabled = i === v.scenes.length - 1;
      }
      async function speakScene() {
        const my = ++token;
        const sc = v.scenes[i];
        const t0 = Date.now();
        if (sc.narration && sc.narration.audio_ref) await T0.media.play(sc.narration.audio_ref, { text: sc.narration });
        else await T0.media.speak(T0.t(sc.narration));
        const wait = (sc.min_seconds || 0) * 1000 - (Date.now() - t0);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        if (my !== token || !playing) return;
        if (i < v.scenes.length - 1) { show(i + 1); speakScene(); } else setPlaying(false);
      }
      function setPlaying(p) { playing = p; play.textContent = p ? '❚❚ ' + T0.t(L.pause) : '▶ ' + T0.t(L.play); if (!p) { token++; T0.media.stop(); } }
      function go(n) { const was = playing; setPlaying(false); show(n); if (was) { setPlaying(true); speakScene(); } }
      play.onclick = () => { if (playing) setPlaying(false); else { setPlaying(true); speakScene(); } };
      prev.onclick = () => go(i - 1); next.onclick = () => go(i + 1);
      const off = T0.on('t0:lang', () => { const was = playing; setPlaying(false); show(i); syncReal(); prev.setAttribute('aria-label', T0.t(L.prev)); next.setAttribute('aria-label', T0.t(L.next)); if (was) { setPlaying(true); speakScene(); } });
      const offM = T0.on('t0:mediaoverride', () => syncReal());
      setPlaying(false); show(0); syncReal();
      if (params.autoplay && !root.classList.contains('is-real')) { setPlaying(true); speakScene(); }
      return { unmount() { setPlaying(false); off(); offM(); const vd = realBox.querySelector('video'); if (vd) vd.pause(); visual && visual.unmount && visual.unmount(); root.remove(); }, show };
    },
  });

  // sim.scene_page_image: bản đầy đủ ở components/sim/scene_vk.js (B, 001) – bản chỉ-crop cũ đã xóa (D, 20/11)
})();
