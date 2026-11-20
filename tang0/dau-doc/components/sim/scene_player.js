/* sim.scene_player – trình phát "video" hoạt hình dựng bằng mã (R1; viết lại theo openVideo() bản cũ – agent L, đối đẳng V01/L05/L06/T01).
 * params: {video: <id trong book.videos> | <đối tượng video>, autoplay?: bool (mặc định: tự chạy khi nằm trong modal), start?: số cảnh}.
 * Mỗi cảnh: tiêu đề + lời thuyết minh SONG NGỮ (T0.ui.bi: dòng gốc lang_base + ngôn ngữ đọc + ngôn ngữ phụ), hình
 * (T0.renderSim(scene.visual)), thuyết minh T0.media.play(audio_ref, {anyLang}) – như say() bản cũ: MP3 thu sẵn của ngôn ngữ
 * đang hiện, không có thì giọng trình duyệt đúng tiếng, không có nữa thì MP3 của tiếng khác (vd. uz -> vi_*.mp3).
 * Điều khiển: ‹ ❚❚/▶ › 🔊 (tắt tiếng, nhớ theo cuốn: T0.store 'snd') + thanh tiến độ (bấm để nhảy cảnh) + số cảnh i / n.
 * Thời lượng cảnh = max(thời lượng clip, min_seconds, ước lượng theo chữ khi tắt tiếng/không có tiếng).
 * Video thật của giáo viên (T0.classroom.mediaFor/mediaAvail): thanh "▶ VI ▶ UZ … ✎ Hoạt hình"; GV có thêm "🎬 Thay video"
 * (T0.classroom.mediaForm: theo từng tiếng, URL hoặc MP4 ≤ 20 MB). Sự kiện: t0:mediaoverride, t0:lang.
 * sim.scene_page_image ở components/sim/scene_vk.js. */
(function () {
  const T0 = window.T0;
  const CSS = `
.sp{display:flex;flex-direction:column;gap:var(--space-3,12px)}
.sp-anim{display:flex;flex-direction:column;gap:var(--space-3,12px)}
.sp-stage{background:var(--color-video-bg,#0b1a26);border-radius:var(--radius-md,10px);padding:var(--space-3,12px);min-height:180px;display:flex;flex-direction:column;justify-content:center;color:#fff}
.sp-stage .t0-unsupported{color:#cfd8e0;border-color:#4a6378}
.sp-title{margin:0;font-size:var(--text-h3,18px);font-family:var(--font-display);line-height:1.3}
.sp-title .t0-bi-sub{font-family:var(--font-body);font-size:var(--text-sm,14px);font-weight:600}
.sp-nar{margin:0;line-height:var(--lh-body,1.5);font-size:var(--text-body,16px);min-height:3em}
.sp-nar .t0-bi-sub{font-size:var(--text-ui,15px)}
.sp-ctl{display:flex;gap:var(--space-2,8px);align-items:center}
.sp-ctl .t0-btn{padding:0 12px;flex:none}
.sp-ctl .sp-pl{min-width:56px}
.sp-ctl .sp-mute[aria-pressed="false"]{opacity:.55}
.sp-prog{flex:1;min-width:40px;height:var(--touch-min,44px);display:flex;align-items:center;cursor:pointer;touch-action:manipulation}
.sp-prog>div{position:relative;width:100%;height:6px;border-radius:3px;background:var(--color-line)}
.sp-prog i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--color-accent);width:0}
.sp-n{flex:none;font-weight:700;font-size:var(--text-sm,14px);font-variant-numeric:tabular-nums;min-width:3.2em;text-align:right}
.sp-dots{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sp-vm{display:flex;gap:6px;flex-wrap:wrap}
.sp-vm:empty{display:none}
.sp-vm .t0-btn{min-height:36px;font-size:var(--text-sm,14px);padding:0 12px}
.sp-vm .t0-btn[aria-pressed="true"]{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.sp-real video{display:block;width:100%;max-height:70vh;border-radius:var(--radius-md,10px);background:#000}
.sp-real .sp-link{padding:26px 14px;text-align:center;border-radius:var(--radius-md,10px);background:var(--color-surface-2)}
.sp.is-real .sp-anim{display:none}
.sp:not(.is-real) .sp-real{display:none}`;
  function css() { if (!document.getElementById('sp-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'sp-css', textContent: CSS })); }
  const L = {
    anim: { uz: 'Animatsiya', ru: 'Анимация', vi: 'Hoạt hình' }, play: { uz: 'Ijro', ru: 'Пуск', vi: 'Phát' }, pause: { uz: 'To‘xtatish', ru: 'Пауза', vi: 'Dừng' },
    prev: { uz: 'Oldingi', ru: 'Назад', vi: 'Trước' }, next: { uz: 'Keyingi', ru: 'Далее', vi: 'Tiếp' }, snd: { uz: 'Ovoz', ru: 'Озвучка', vi: 'Giọng đọc' },
    open: { uz: 'Videoni ochish', ru: 'Открыть видео', vi: 'Mở video' }, replace: { uz: 'Videoni almashtirish', ru: 'Заменить видео', vi: 'Thay video' },
    scene: { uz: 'Sahna', ru: 'Сцена', vi: 'Cảnh' },
  };
  const tu = (o) => (T0.tUI ? T0.tUI(o) : T0.t(o));
  const bi = (o, opts) => (T0.ui.bi ? T0.ui.bi(o, opts) : T0.ui.el('div', { text: T0.t(o) }));

  T0.registerSim('sim.scene_player', {
    mount(el, params, ctx) {
      css();
      const E = T0.ui.el;
      const v = typeof params.video === 'string' ? T0.find('video', params.video) : params.video;
      const root = E('div', { class: 'sp', 'data-video': (v && v.id) || '' });
      el.append(root);
      if (!v || !(v.scenes || []).length) { root.append(E('div', { class: 't0-unsupported', text: T0.s('not_found') + ': ' + (params.video && params.video.id || params.video) })); return { unmount() { root.remove(); } }; }
      const n = v.scenes.length;
      let i = 0, playing = false, visual = null, token = 0, raf = 0, t0 = 0, dur = 0, dead = false;
      let snd = T0.store.get('snd', true) !== false;
      const C = () => T0.classroom || null;

      const title = E('h3', { class: 'sp-title' });
      const stage = E('div', { class: 'sp-stage' });
      const nar = E('div', { class: 'sp-nar', 'aria-live': 'polite' });
      const prev = E('button', { class: 't0-btn sp-prev', type: 'button' }, '‹');
      const play = E('button', { class: 't0-btn primary sp-pl', type: 'button' });
      const next = E('button', { class: 't0-btn sp-next', type: 'button' }, '›');
      const mute = E('button', { class: 't0-btn sp-mute', type: 'button' }, '🔊');
      const fill = E('i');
      const prog = E('div', { class: 'sp-prog', role: 'slider', tabindex: '0', 'aria-valuemin': '1', 'aria-valuemax': String(n) }, E('div', null, fill));
      const num = E('span', { class: 'sp-n' });
      const vm = E('div', { class: 'sp-vm' });
      // danh sách cảnh cho trình đọc màn hình / bàn phím (ẩn khỏi mắt; thanh tiến độ là bản nhìn thấy)
      const dots = E('nav', { class: 'sp-dots' });
      v.scenes.forEach((_, j) => dots.append(E('button', { type: 'button', onclick: () => go(j) }, String(j + 1))));
      const realBox = E('div', { class: 'sp-real' });
      const formBox = E('div', { class: 'sp-form' });
      const animBox = E('div', { class: 'sp-anim' }, title, stage, nar, E('div', { class: 'sp-ctl' }, prev, play, next, mute, prog, num), dots);
      root.append(vm, realBox, animBox, formBox);

      function labels() {
        prev.setAttribute('aria-label', T0.t(L.prev)); next.setAttribute('aria-label', T0.t(L.next));
        mute.setAttribute('aria-label', tu(L.snd)); mute.title = tu(L.snd); mute.setAttribute('aria-pressed', String(snd));
        mute.textContent = snd ? '🔊' : '🔇';
        play.textContent = playing ? '❚❚' : '▶';
        play.setAttribute('aria-label', T0.t(playing ? L.pause : L.play));
        prog.setAttribute('aria-label', T0.t(L.scene));
      }
      function setBar(frac) { fill.style.width = (Math.min(1, (i + Math.max(0, Math.min(1, frac))) / n) * 100).toFixed(2) + '%'; }
      function render() {
        const sc = v.scenes[i];
        title.innerHTML = ''; title.append(bi(sc.title || v.title, { tags: false }));
        nar.innerHTML = ''; if (sc.narration) nar.append(bi(sc.narration));
        num.textContent = (i + 1) + ' / ' + n;
        prog.setAttribute('aria-valuenow', String(i + 1)); prog.setAttribute('aria-valuetext', (i + 1) + ' / ' + n);
        prev.disabled = i === 0; next.disabled = i === n - 1;
        [...dots.children].forEach((d, j) => { d.setAttribute('aria-current', String(j === i)); d.setAttribute('aria-label', T0.t(L.scene) + ' ' + (j + 1) + ' / ' + n); });
        labels();
      }
      function show(k) {
        i = Math.max(0, Math.min(n - 1, k));
        const sc = v.scenes[i];
        if (visual && visual.unmount) visual.unmount();
        stage.innerHTML = '';
        const vis = sc.visual || {};
        visual = vis.type === 'image' ? (stage.append(E('img', { src: T0.asset(vis.src), alt: '', style: { width: '100%' } })), null) : vis.kind ? T0.renderSim(stage, { kind: vis.kind, params: vis.params || {} }) : null;
        render(); setBar(0);
      }
      function stopTick() { if (raf) cancelAnimationFrame(raf); raf = 0; }
      function tick() {
        raf = 0;
        if (dead || !playing) return;
        setBar(dur ? (Date.now() - t0) / dur : 0);
        raf = requestAnimationFrame(tick);
      }
      // phát một cảnh: tiếng (nếu bật) + chờ đủ thời lượng, rồi sang cảnh sau
      async function runScene() {
        const my = ++token;
        const sc = v.scenes[i];
        const nr = sc.narration || {};
        const text = T0.t(nr);
        const rate = T0.media.rate || 1;
        const minMs = (sc.min_seconds || 0) * 1000;
        const pk = nr.audio_ref && T0.media.pickLang ? T0.media.pickLang(nr.audio_ref) : null;
        const clipMs = pk && pk.file && T0.media.clipDur ? (T0.media.clipDur(nr.audio_ref, pk.lang) || 0) * 1000 / rate : 0;
        const est = T0.media.estimate ? T0.media.estimate(T0.t(nr, pk ? pk.lang : undefined) || text) : Math.max(6500, text.length * 85);
        dur = Math.max(minMs, clipMs ? clipMs + 700 : est);
        t0 = Date.now(); stopTick(); raf = requestAnimationFrame(tick);
        let spoke = Promise.resolve();
        if (snd) {
          if (nr.audio_ref) spoke = T0.media.play(nr.audio_ref, { text: nr, anyLang: true, onLang: (l) => { root.dataset.audioLang = l; } });
          else if (text) spoke = T0.media.speak(text);
        } else T0.media.stop();
        const st = Date.now();
        await spoke;
        if (my !== token || !playing || dead) return;
        // đã phát xong tiếng: không chờ ước lượng chữ, chỉ chờ min_seconds (+ đệm nhỏ); không có tiếng: chờ đủ ước lượng
        const spokeMs = Date.now() - st;
        const target = snd && spokeMs > 800 ? Math.max(minMs, spokeMs + 600) : dur;
        dur = target;
        const wait = target - (Date.now() - t0);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));
        if (my !== token || !playing || dead) return;
        if (i < n - 1) { show(i + 1); runScene(); } else { setBar(1); setPlaying(false); }
      }
      function setPlaying(p) {
        playing = p;
        if (!p) { token++; stopTick(); T0.media.stop(); }
        labels();
      }
      function go(k) { const was = playing; setPlaying(false); show(k); if (was) { setPlaying(true); runScene(); } }
      play.onclick = () => {
        if (playing) { setPlaying(false); return; }
        if (i === n - 1 && fill.style.width === '100%') show(0);
        setPlaying(true); runScene();
      };
      prev.onclick = () => go(i - 1); next.onclick = () => go(i + 1);
      mute.onclick = () => { snd = !snd; T0.store.set('snd', snd); labels(); if (playing) { setPlaying(false); setPlaying(true); runScene(); } };
      prog.onclick = (e) => { const r = prog.getBoundingClientRect(); go(Math.floor(((e.clientX - r.left) / Math.max(1, r.width)) * n)); };
      prog.onkeydown = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); } };

      /* ---- video thật của GV (T01) ---- */
      let mode = null, realKey = '', formOpen = false;
      const LN = (l) => (l === 'all' ? T0.LANGS.map((x) => x.toUpperCase()).join('·') : l.toUpperCase());
      function avail() {
        try {
          const c = C(); if (!c || !c.mediaFor) return [];
          const a = c.mediaAvail ? c.mediaAvail(v.id) || [] : [];
          if (a.length) return a;
          const m = c.mediaFor(v.id); // classroom không có mediaAvail (hoặc chỉ có override chung): một nút theo tiếng của nó
          return m && m.src ? [m.lang || 'all'] : [];
        } catch (e) { return []; }
      }
      function prefMode(a) {
        if (!a.length) return 'anim';
        const p = T0.store.get('vpref', null);
        if (p === 'anim') return 'anim';
        if (p && a.includes(p)) return p;
        for (const l of [T0.lang, T0.lang2, 'all', T0.baseLang ? T0.baseLang() : 'uz']) if (l && a.includes(l)) return l;
        return a[0];
      }
      function syncReal() {
        const a = avail();
        const teacher = !!(C() && C().isTeacher && C().isTeacher() && C().mediaForm);
        if (mode == null || (mode !== 'anim' && !a.includes(mode))) mode = prefMode(a);
        vm.innerHTML = '';
        if (a.length) {
          a.forEach((l) => vm.append(E('button', { class: 't0-btn', type: 'button', 'data-vm': l, 'aria-pressed': String(mode === l), onclick: () => { mode = l; T0.store.set('vpref', l); syncReal(); } }, '▶ ' + LN(l))));
          vm.append(E('button', { class: 't0-btn', type: 'button', 'data-vm': 'anim', 'aria-pressed': String(mode === 'anim'), onclick: () => { mode = 'anim'; T0.store.set('vpref', 'anim'); syncReal(); } }, '✎ ' + tu(L.anim)));
        }
        if (teacher) vm.append(E('button', { class: 't0-btn', type: 'button', 'data-vm': 'edit', 'aria-expanded': String(formOpen), onclick: toggleForm }, '🎬 ' + tu(L.replace)));
        const on = mode !== 'anim' && a.includes(mode);
        root.classList.toggle('is-real', on);
        if (on) {
          setPlaying(false);
          const m = C().mediaFor(v.id, mode);
          const key = mode + '|' + (m && m.src);
          if (key !== realKey) {
            realKey = key; realBox.innerHTML = '';
            if (m && m.src) realBox.append(m.direct === false ? E('div', { class: 'sp-link' }, E('a', { class: 't0-btn primary', href: m.src, target: '_blank', rel: 'noopener' }, '▶ ' + tu(L.open))) : E('video', { src: m.src, controls: true, autoplay: true, playsinline: true, preload: 'metadata', title: (m.title || T0.t(v.title) || '') }));
          }
        } else { realKey = ''; const vd = realBox.querySelector('video'); if (vd) vd.pause(); realBox.innerHTML = ''; }
      }
      function toggleForm() {
        formOpen = !formOpen; formBox.innerHTML = '';
        if (formOpen) formBox.append(C().mediaForm(v.id, { lang: mode && mode !== 'anim' ? mode : T0.lang, onDone: (l) => { formOpen = false; formBox.innerHTML = ''; mode = l || null; syncReal(); } }));
        syncReal();
      }

      const off = T0.on('t0:lang', () => { const was = playing; setPlaying(false); render(); syncReal(); if (was) { setPlaying(true); runScene(); } });
      const offM = T0.on('t0:mediaoverride', () => syncReal());
      show(Math.max(0, Math.min(n - 1, +params.start || 0)));
      syncReal();
      const auto = params.autoplay != null ? !!params.autoplay : !!el.closest('.t0-modal');
      if (auto && !root.classList.contains('is-real')) { setPlaying(true); runScene(); } else labels();
      return {
        unmount() { dead = true; setPlaying(false); off(); offM(); const vd = realBox.querySelector('video'); if (vd) vd.pause(); visual && visual.unmount && visual.unmount(); root.remove(); },
        show: (k) => go(k), play: () => { if (!playing) play.click(); }, pause: () => setPlaying(false),
        state: () => ({ i, n, playing, snd, mode, dur }),
      };
    },
  });
  // sim.scene_page_image: bản đầy đủ ở components/sim/scene_vk.js (B, 001)
})();
