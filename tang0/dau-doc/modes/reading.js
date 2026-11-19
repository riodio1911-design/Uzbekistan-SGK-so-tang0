/* modes/reading.js — lớp "đọc văn" (R3, tầng 0 v0.9, bản thử 1).
 * Đọc văn bản thật của book.lessons[].blocks (text/prose/poem; câu kiểu `sentence`),
 * book.reading (anchors, audio_groups) và pages[].text_lines + print_text (trang dựng lại chữ thật).
 * Đọc theo câu: tô sáng câu đang đọc, bấm câu để nghe, chọn tốc độ, chọn giọng (bản gốc / bản dịch);
 * câu có `no_read` thì bỏ qua. Chú giải: bấm từ có trong book.glossary. Bài tập: T0.renderEx (R1).
 * Chỉ dùng hợp đồng core: T0.t, T0.lang, t0:lang, T0.media, T0.store, T0.ui, T0.tutor, T0.renderEx.
 */
(function () {
  'use strict';
  const T0 = (window.T0 = window.T0 || {});

  // ---------- chuỗi giao diện (uz bắt buộc) ----------
  const S = {
    label: { uz: 'O‘qish', ru: 'Чтение', vi: 'Đọc văn' },
    play: { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' },
    pause: { uz: 'To‘xtatish', ru: 'Стоп', vi: 'Dừng' },
    prev: { uz: 'Oldingi gap', ru: 'Предыдущее', vi: 'Câu trước' },
    next: { uz: 'Keyingi gap', ru: 'Следующее', vi: 'Câu sau' },
    speed: { uz: 'Tezlik', ru: 'Скорость', vi: 'Tốc độ' },
    voice: { uz: 'Ovoz', ru: 'Голос', vi: 'Giọng' },
    original: { uz: 'Asl matn', ru: 'Оригинал', vi: 'Bản gốc' },
    translation: { uz: 'Tarjima', ru: 'Перевод', vi: 'Bản dịch' },
    view_text: { uz: 'Matn', ru: 'Текст', vi: 'Văn bản' },
    view_page: { uz: 'Sahifa', ru: 'Страница', vi: 'Trang' },
    pages: { uz: 'betlar', ru: 'стр.', vi: 'trang' },
    page: { uz: 'bet', ru: 'стр.', vi: 'trang' },
    glossary: { uz: 'Lug‘at', ru: 'Словарь', vi: 'Chú giải' },
    ask: { uz: 'Savol berish', ru: 'Спросить', vi: 'Hỏi gia sư' },
    lesson: { uz: 'Dars', ru: 'Урок', vi: 'Bài' },
    exercise: { uz: 'Topshiriq', ru: 'Задание', vi: 'Bài tập' },
    tap_hint: { uz: 'Gapni bosing — tinglang', ru: 'Нажмите на строку, чтобы послушать', vi: 'Bấm vào câu để nghe' },
    no_text: { uz: 'Bu darsda o‘qiladigan matn yo‘q', ru: 'В этом уроке нет текста для чтения', vi: 'Bài này chưa có văn bản để đọc' },
    no_page: { uz: 'Bu sahifa uchun matn qatlami yo‘q', ru: 'Для этой страницы нет текстового слоя', vi: 'Trang này chưa có lớp chữ thật' },
    not_read: { uz: 'Ovoz yo‘q', ru: 'Без озвучки', vi: 'Không đọc' }
  };
  const RATES = [0.75, 1, 1.25];

  // ---------- tiện ích ----------
  const tt = (o) => (T0.t ? T0.t(o) : (o && (o[T0.lang] || o.uz)) || '');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const sget = (k, d) => { try { const v = T0.store && T0.store.get(k); return v == null ? d : v; } catch (e) { return d; } };
  const sset = (k, v) => { try { T0.store && T0.store.set(k, v); } catch (e) { /* bỏ qua */ } };
  const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  const assetUrl = (book, p) => {
    if (!p) return '';
    if (/^(data:|https?:|blob:|\/)/.test(p)) return p;
    if (typeof T0.asset === 'function') return T0.asset(p);
    return 'mau/' + book.book_id + '/' + p;
  };
  const READ_TYPES = { text: 1, prose: 1, poem: 1 };

  // ---------- mô hình: gom câu theo thứ tự tài liệu ----------
  // key = đường dẫn câu đúng như reading.anchors[].target: <block_id>/title | /paras/i | /stanzas/i/j
  function buildModel(book, lesson) {
    const sents = []; // {key, block, s, readable, idx}
    const byKey = {};
    const add = (key, block, s) => {
      if (!s || typeof s !== 'object') return;
      const it = { key, block, s, readable: !s.no_read, idx: sents.length };
      sents.push(it); byKey[key] = it;
    };
    (lesson.blocks || []).forEach((b) => {
      if (!READ_TYPES[b.type]) return;
      if (b.title && !b.untitled) add(b.id + '/title', b, b.title);
      (b.paras || []).forEach((s, i) => add(b.id + '/paras/' + i, b, s));
      (b.stanzas || []).forEach((st, i) => st.forEach((s, j) => add(b.id + '/stanzas/' + i + '/' + j, b, s)));
    });
    return { sents, byKey, readable: sents.filter((x) => x.readable) };
  }

  function readableLessons(book) {
    return (book.lessons || []).filter((l) => (l.blocks || []).some((b) => READ_TYPES[b.type] && (b.paras || b.stanzas)));
  }

  function available(book, features) {
    if (!book) return false;
    const lay = features && features.layers;
    if (lay && lay.doc_van === false) return false;
    const has = readableLessons(book).some((l) => (l.blocks || []).some((b) => b.type === 'poem' || b.type === 'prose')) || !!book.reading;
    return lay ? !!lay.doc_van && has : has;
  }

  // ---------- chú giải: tìm thuật ngữ trong chữ uz ----------
  const LETTER = "\\p{L}\\p{M}‘’ʻʼ'`";
  function glossMatchers(book, unitId) {
    return (book.glossary || [])
      .filter((g) => g.auto_underline !== false && g.term && g.term.uz && (!g.unit || !unitId || g.unit === unitId))
      .map((g) => {
        // D2: term + forms[] (dạng biến tố đã gặp), dạng dài trước
        const t = [g.term.uz].concat(g.forms || []).map((x) => String(x).trim()).filter(Boolean).sort((a, b) => b.length - a.length)
          .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[‘’ʻʼ']/g, "[‘’ʻʼ']")).join('|');
        // khớp đầu từ, cho phép đuôi biến tố (Ungur → unguridagi)
        return { g, re: new RegExp('(^|[^' + LETTER + '])(' + t + ')([' + LETTER + ']*)', 'giu') };
      });
  }
  function markGloss(text, matchers) {
    let html = esc(text);
    if (!matchers.length) return html;
    // làm trên chuỗi gốc để tránh khớp vào thẻ; đánh dấu bằng ký tự riêng rồi thay
    let out = text; const hits = [];
    matchers.forEach((m) => {
      out = out.replace(m.re, (all, pre, word, tail) => { hits.push({ id: m.g.id, w: word + tail }); return pre + '\u0001' + (hits.length - 1) + '\u0002'; });
    });
    if (!hits.length) return html;
    return out.split(/(\u0001\d+\u0002)/).map((part) => {
      const mm = /^\u0001(\d+)\u0002$/.exec(part);
      if (!mm) return esc(part);
      const hit = hits[+mm[1]];
      return '<button type="button" class="r-gl" data-g="' + esc(hit.id) + '">' + esc(hit.w) + '</button>';
    }).join('');
  }

  // ---------- CSS (biến tokens.css) ----------
  const CSS = `
.r-wrap{font-family:var(--font-body);color:var(--color-ink);max-width:760px;margin:0 auto;padding:0 var(--space-8);box-sizing:border-box;overflow-wrap:anywhere}
.r-wrap *{box-sizing:border-box}
.r-hero{position:relative;overflow:hidden;border-radius:var(--radius-md);margin:var(--space-8) 0 var(--space-6);background:var(--color-page-paper);box-shadow:var(--shadow-1)}
.r-hero img{position:absolute;left:0;display:block;max-width:none}
.r-head h2{font-family:var(--font-display);font-size:var(--text-h2);line-height:1.2;margin:var(--space-6) 0 var(--space-3)}
.r-head .r-sub{color:var(--color-ink-2);font-size:var(--text-ui);margin:0 0 var(--space-4)}
.r-meta{display:flex;flex-wrap:wrap;gap:var(--space-4);align-items:center;color:var(--color-ink-2);font-size:var(--text-sm);margin-bottom:var(--space-6)}
.r-chip{display:inline-flex;align-items:center;gap:var(--space-3);min-height:max(44px,var(--touch-min));min-width:max(44px,var(--touch-min));padding:0 var(--space-7);border-radius:var(--radius-pill);border:1px solid var(--color-line);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui);cursor:pointer;justify-content:center}
.r-chip[aria-pressed="true"]{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.r-chip:focus-visible,.r-s:focus-visible,.r-gl:focus-visible,.r-ln:focus-visible{outline:3px solid var(--color-accent);outline-offset:2px}
.r-seg{display:inline-flex;gap:var(--space-2);flex-wrap:wrap}
.r-hint{font-size:var(--text-sm);color:var(--color-ink-2);margin:0 0 var(--space-6)}
.r-block{margin:0 0 var(--space-9)}
.r-text p{font-family:var(--font-reading);font-size:var(--text-reading);line-height:var(--lh-reading);margin:0 0 var(--space-6)}
.r-poem{background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-lg);padding:var(--space-9) var(--space-8);box-shadow:var(--shadow-1)}
.r-poem h3{font-family:var(--font-reading);font-size:var(--text-h3);margin:0 0 var(--space-6);text-align:center}
.r-stanza{margin:0 0 var(--space-8);display:flex;flex-direction:column;align-items:flex-start}
.r-stanza:last-child{margin-bottom:0}
.r-s{display:inline;border-radius:var(--radius-xs);transition:background var(--dur-fast);-webkit-tap-highlight-color:transparent}
.r-s.r-on{cursor:pointer}
@media (hover:hover){.r-s.r-on:hover{background:var(--color-tr-hover)}.r-ln:hover rect{fill:rgba(216,111,0,.12)}}
.r-line{display:block;width:100%;font-family:var(--font-reading);font-size:var(--text-reading);line-height:var(--lh-reading);min-height:max(44px,var(--touch-min));padding:var(--space-3) var(--space-4);border-radius:var(--radius-sm)}
h3 .r-s.r-on,.r-line.r-on{cursor:pointer}
h3 .r-s{display:inline-flex;align-items:center;min-height:max(44px,var(--touch-min));padding:0 var(--space-4)}
.r-cur{background:var(--color-highlight-soft)!important;box-shadow:0 0 0 2px var(--hue-orange) inset}
.r-tr{display:block;font-family:var(--font-body);font-size:var(--text-sm);line-height:1.45;color:var(--color-ink-2);margin-top:var(--space-1)}
.r-text .r-tr{margin:-4px 0 var(--space-6)}
.r-nr{color:inherit}
.r-gl{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:help;text-decoration:underline dotted var(--color-accent);text-decoration-thickness:2px;text-underline-offset:3px;position:relative}
.r-gl::after{content:"";position:absolute;left:50%;top:50%;width:max(100%,44px);height:44px;transform:translate(-50%,-50%)}
.r-ex{background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-lg);padding:var(--space-8);box-shadow:var(--shadow-1)}
.r-ex-h{font-family:var(--font-display);font-size:var(--text-lg);margin:0 0 var(--space-6);display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap}
.r-tag{font-size:var(--text-xs);color:var(--color-ink-2);border:1px solid var(--color-line);border-radius:var(--radius-pill);padding:2px var(--space-4);font-family:var(--font-body)}
.r-bar{position:sticky;bottom:0;z-index:var(--z-bar);margin:var(--space-10) calc(-1 * var(--space-8)) 0;padding:var(--space-4) var(--space-8) calc(var(--space-4) + env(safe-area-inset-bottom,0px));background:var(--color-surface);border-top:1px solid var(--color-line);box-shadow:0 -6px 20px rgba(0,0,0,.08);display:flex;flex-wrap:wrap;gap:var(--space-4);align-items:center;justify-content:center}
.r-bar .r-main{background:var(--color-accent);color:var(--color-on-accent);border-color:var(--color-accent);font-weight:700;min-width:112px}
.r-bar .r-grp{display:inline-flex;align-items:center;gap:var(--space-3)}
.r-bar .r-lbl{font-size:var(--text-xs);color:var(--color-ink-2)}
.r-bar select{min-height:max(44px,var(--touch-min));border-radius:var(--radius-pill);border:1px solid var(--color-line);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui);padding:0 var(--space-6)}
.r-page{position:relative;background:var(--color-page-paper);border-radius:var(--radius-sm);box-shadow:var(--shadow-1);overflow:hidden;margin:0 0 var(--space-8)}
.r-page svg{display:block;width:100%;height:auto}
.r-page text{font-family:var(--font-page)}
.r-ln{cursor:pointer}
.r-page rect{fill:transparent}
.r-ln.r-curp rect{fill:rgba(242,194,48,.45);stroke:#D86F00;stroke-width:1}
.r-gloss-pop dl{margin:0}.r-gloss-pop dt{font-weight:700;font-size:var(--text-lg)}.r-gloss-pop dd{margin:var(--space-2) 0 var(--space-6);line-height:1.5}
.r-gloss-pop .r-short{color:var(--color-ink-2);font-size:var(--text-sm)}
.r-empty{padding:var(--space-10);text-align:center;color:var(--color-ink-2)}
@media (max-width:520px){.r-bar .r-lbl{display:none}.r-bar{gap:var(--space-3)}.r-bar .r-main{min-width:64px}.r-bar .r-main .r-mt{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.r-bar select{padding:0 var(--space-4)}.r-head h2{font-size:var(--text-h3)}.r-poem{padding:var(--space-8) var(--space-6)}}
`;
  function ensureCss() {
    if (document.getElementById('t0-reading-css')) return;
    const st = document.createElement('style'); st.id = 't0-reading-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  // ---------- mount ----------
  function mount(el, ctx) {
    ctx = ctx || {};
    ensureCss();
    const book = ctx.book || T0.book;
    const base = (book.profile && book.profile.lang_base) || 'uz';
    const lessons = readableLessons(book);
    const st = {
      lessonId: ctx.lesson || ctx.lessonId || sget('reading:lesson', null),
      view: sget('reading:view', 'text'),
      rate: (T0.media && +T0.media.rate) || 1,
      voice: sget('reading:voice', 'orig'), // 'orig' = lang_base, 'tr' = ngôn ngữ giao diện
      showTr: sget('reading:showTr', true) !== false,
      cur: -1, // chỉ số trong model.sents
      playing: false, token: 0, timer: 0
    };
    if (!lessons.some((l) => l.id === st.lessonId)) st.lessonId = lessons[0] && lessons[0].id;
    // đích nhảy tới (từ ghim text_anchor của chế độ ghim): chuỗi khóa câu, {key}, {page}, {lesson}
    const tg = ctx.target || null;
    const tgKey = typeof tg === 'string' ? tg : tg && (tg.key || tg.target) || null;
    const tgPage = (tg && tg.page) || ctx.page || null;
    if (tg && tg.lesson && lessons.some((l) => l.id === tg.lesson)) st.lessonId = tg.lesson;
    if (tgKey) { const lk = lessons.find((l) => (l.blocks || []).some((b) => tgKey.indexOf(b.id + '/') === 0)); if (lk) st.lessonId = lk.id; }
    else if (tgPage && lessons.length) {
      const lp = lessons.find((l) => l.page_range && tgPage >= l.page_range[0] && tgPage <= l.page_range[1]);
      if (lp) st.lessonId = lp.id;
    }
    let model = null, lesson = null, unit = null;
    const root = h('div', 'r-wrap');
    root.setAttribute('data-mode', 'reading');
    el.appendChild(root);

    const voiceLang = () => (st.voice === 'tr' && T0.lang !== base ? T0.lang : base);

    // ----- phát -----
    function clipFor(s, lang) {
      const c = s.audio_ref && book.media && book.media.clips && book.media.clips[s.audio_ref];
      return c && c[lang] ? c[lang] : null;
    }
    function playOne(it) {
      const my = st.token;
      const lang = voiceLang();
      const s = it.s;
      const text = s[lang] || s.uz;
      return new Promise((res) => {
        let done = false;
        const fin = () => { if (done) return; done = true; clearTimeout(st.timer); res(my === st.token); };
        let r = null;
        try {
          if (T0.media && T0.media.play) {
            // core: play(clipId, {lang, rate, text, onEnd}) -> Promise; không có file → giọng trình duyệt đọc `text`
            r = T0.media.play(s.audio_ref || null, { lang, rate: st.rate, text: s, onEnd: fin });
          }
        } catch (e) { r = null; }
        if (r && typeof r.then === 'function') r.then(fin, fin);
        // dự phòng khi core không báo kết thúc: ước lượng theo dur của clip / độ dài câu
        const c = clipFor(s, lang);
        const ms = (c ? c.dur * 1000 : Math.max(1500, text.length * 70)) / st.rate;
        st.timer = setTimeout(fin, ms + 4000);
      });
    }
    function stop() {
      st.token++; st.playing = false; clearTimeout(st.timer);
      try { T0.media && T0.media.stop && T0.media.stop(); } catch (e) { /* bỏ qua */ }
      syncBar();
    }
    async function playFrom(idx, single) {
      stop();
      const my = ++st.token;
      st.playing = true; syncBar();
      let i = idx;
      while (i < model.sents.length && my === st.token) {
        const it = model.sents[i];
        if (it.readable) {
          setCur(i, true);
          const ok = await playOne(it);
          if (!ok || my !== st.token) return;
          if (single) break;
        }
        i++;
      }
      if (my === st.token) { st.playing = false; syncBar(); }
    }
    function nextReadable(from, dir) {
      for (let i = from + dir; i >= 0 && i < model.sents.length; i += dir) if (model.sents[i].readable) return i;
      return -1;
    }

    // ----- tô sáng -----
    function setCur(i, scroll) {
      st.cur = i;
      root.querySelectorAll('.r-cur').forEach((n) => { n.classList.remove('r-cur'); n.removeAttribute('aria-current'); });
      root.querySelectorAll('.r-curp').forEach((n) => n.classList.remove('r-curp'));
      const it = model.sents[i];
      if (!it) return;
      const nodes = root.querySelectorAll('[data-k="' + CSS_ESC(it.key) + '"]');
      nodes.forEach((n) => {
        if (n.classList.contains('r-ln')) n.classList.add('r-curp');
        else { n.classList.add('r-cur'); n.setAttribute('aria-current', 'true'); }
      });
      if (scroll && nodes[0] && nodes[0].scrollIntoView) {
        try { nodes[0].scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { /* bỏ qua */ }
      }
    }
    const CSS_ESC = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/"/g, '\\"'));

    // ----- chú giải -----
    function openGloss(ids) {
      const list = (book.glossary || []).filter((g) => !ids || ids.includes(g.id));
      const box = h('div', 'r-gloss-pop');
      const dl = h('dl');
      list.forEach((g) => {
        const sh = g.short && g.short[T0.lang];
        dl.appendChild(h('dt', null, esc(tt(g.term)) + (sh ? ' <span class="r-short">— ' + esc(sh) + '</span>' : '')));
        dl.appendChild(h('dd', null, esc(tt(g.definition))));
      });
      box.appendChild(dl);
      if (T0.ui && T0.ui.modal) T0.ui.modal(box, { title: tt(S.glossary) });
    }

    // ----- dựng -----
    function render() {
      stop();
      root.innerHTML = '';
      lesson = lessons.find((l) => l.id === st.lessonId);
      if (!lesson) { root.appendChild(h('div', 'r-empty', esc(tt(S.no_text)))); return; }
      unit = (book.units || []).find((u) => u.id === lesson.unit) || null;
      model = buildModel(book, lesson);
      const gm = glossMatchers(book, unit && unit.id);
      const showTr = st.showTr && T0.lang !== base;
      const trOf = (s) => (showTr && s[T0.lang] ? '<span class="r-tr" lang="' + T0.lang + '">' + esc(s[T0.lang]) + '</span>' : '');

      // đầu đơn vị: ảnh cắt từ trang (hero) + tên + phụ đề
      const hero = unit && unit.hero;
      const pg = hero && (book.pages || []).find((p) => p.n === hero.page);
      const himg = pg && pg.images && (pg.images[T0.lang] || pg.images[base] || Object.values(pg.images)[0]);
      if (himg && hero.box) {
        const [x, y, w, hh] = hero.box; const PW = (book.print_text && book.print_text.width) || 595, PH = (book.print_text && book.print_text.height) || 842;
        const d = h('div', 'r-hero'); d.style.aspectRatio = (w * PW) / (hh * PH);
        const im = new Image(); im.alt = ''; im.decoding = 'async'; im.loading = 'lazy'; im.src = assetUrl(book, himg);
        im.style.width = (10000 / w) + '%'; im.style.top = (-y / hh * 100) + '%'; im.style.left = (-x / w * 100) + '%';
        d.appendChild(im); root.appendChild(d);
      }
      const head = h('div', 'r-head');
      head.appendChild(h('h2', null, esc(tt((unit && unit.title) || lesson.title))));
      if (unit && unit.subtitle) head.appendChild(h('p', 'r-sub', esc(tt(unit.subtitle))));
      root.appendChild(head);

      // hàng chọn: bài (nếu nhiều), xem văn bản / trang, bản dịch, chú giải
      const meta = h('div', 'r-meta');
      if (lesson.page_range) meta.appendChild(h('span', null, esc(tt(S.pages)) + ' ' + lesson.page_range[0] + '–' + lesson.page_range[1]));
      if (lessons.length > 1) {
        const sel = document.createElement('select'); sel.className = 'r-chip'; sel.setAttribute('aria-label', tt(S.lesson));
        lessons.forEach((l) => { const o = document.createElement('option'); o.value = l.id; o.textContent = tt(l.title); if (l.id === st.lessonId) o.selected = true; sel.appendChild(o); });
        sel.onchange = () => { st.lessonId = sel.value; sset('reading:lesson', sel.value); render(); };
        meta.appendChild(sel);
      }
      const hasPage = (book.pages || []).some((p) => p.text_lines && p.text_lines.length && lesson.page_range && p.n >= lesson.page_range[0] && p.n <= lesson.page_range[1]);
      const seg = h('span', 'r-seg');
      [['text', S.view_text], ['page', S.view_page]].forEach(([v, lab]) => {
        if (v === 'page' && !hasPage) return;
        const b = h('button', 'r-chip', esc(tt(lab))); b.type = 'button'; b.setAttribute('aria-pressed', String(st.view === v));
        b.onclick = () => { st.view = v; sset('reading:view', v); render(); };
        seg.appendChild(b);
      });
      if (seg.children.length > 1) meta.appendChild(seg);
      if (T0.lang !== base) {
        const b = h('button', 'r-chip', esc(tt(S.translation))); b.type = 'button'; b.setAttribute('aria-pressed', String(st.showTr));
        b.onclick = () => { st.showTr = !st.showTr; sset('reading:showTr', st.showTr); render(); };
        meta.appendChild(b);
      }
      if ((book.glossary || []).some((g) => !unit || !g.unit || g.unit === unit.id)) {
        const b = h('button', 'r-chip', esc(tt(S.glossary))); b.type = 'button';
        b.onclick = () => openGloss((book.glossary || []).filter((g) => !unit || !g.unit || g.unit === unit.id).map((g) => g.id));
        meta.appendChild(b);
      }
      if (T0.tutor && T0.tutor.open) {
        const b = h('button', 'r-chip', esc(tt(S.ask))); b.type = 'button';
        b.onclick = () => {
          const it = model.sents[st.cur];
          const blk = it ? it.block : null;
          // context = tham số ghi đè cho mẫu gia-su/prompts.json ({{context}}, {{current_chapter}})
          T0.tutor.open({ role: 'chat', context: { context: (blk ? blockText(blk) : lessonText(lesson, null)).slice(0, 7000), current_chapter: tt((unit && unit.title) || lesson.title) + (unit && unit.subtitle ? ' — ' + tt(unit.subtitle) : '') } });
        };
        meta.appendChild(b);
      }
      root.appendChild(meta);
      if (model.readable.length) root.appendChild(h('p', 'r-hint', esc(tt(S.tap_hint))));

      if (st.view === 'page' && hasPage) renderPages(); else renderText(gm, trOf);
      renderBar();
      if (st.cur >= 0) setCur(st.cur, false);
    }

    function sentHtml(it, gm, cls) {
      const s = it.s;
      const on = it.readable ? ' r-on' : ' r-nr';
      const attrs = ' data-k="' + esc(it.key) + '" lang="' + base + '"' + (it.readable ? ' role="button" tabindex="0" aria-label="' + esc(tt(S.play) + ': ' + (s[base] || s.uz)) + '"' : '');
      return '<span class="' + (cls || 'r-s') + on + '"' + attrs + '>' + markGloss(s[base] || s.uz, gm) + '</span>';
    }

    function renderText(gm, trOf) {
      const keyOf = (bid, sfx) => model.byKey[bid + sfx];
      (lesson.blocks || []).forEach((b, bi) => {
        if (b.type === 'poem') {
          const d = h('section', 'r-block r-poem');
          const ti = keyOf(b.id, '/title');
          if (ti) d.appendChild(h('h3', null, sentHtml(ti, gm) + trOf(ti.s)));
          (b.stanzas || []).forEach((stz, i) => {
            const sd = h('div', 'r-stanza');
            stz.forEach((_, j) => { const it = keyOf(b.id, '/stanzas/' + i + '/' + j); sd.insertAdjacentHTML('beforeend', sentHtml(it, gm, 'r-s r-line') .replace('</span>', '') + trOf(it.s) + '</span>'); });
            d.appendChild(sd);
          });
          root.appendChild(d);
        } else if (b.type === 'text' || b.type === 'prose') {
          const d = h('section', 'r-block r-text');
          const ti = !b.untitled && keyOf(b.id, '/title');
          if (ti && b.type === 'prose') d.appendChild(h('h3', null, sentHtml(ti, gm) + trOf(ti.s)));
          (b.paras || []).forEach((_, i) => {
            const it = keyOf(b.id, '/paras/' + i);
            const p = h('p', null, sentHtml(it, gm)); d.appendChild(p);
            const tr = trOf(it.s); if (tr) d.insertAdjacentHTML('beforeend', tr.replace('class="r-tr"', 'class="r-tr" style="display:block"'));
          });
          root.appendChild(d);
        } else if (b.type === 'exercise') {
          (b.exercise_refs || []).forEach((rid) => {
            const ex = (book.exercises || []).find((e) => e.id === rid);
            if (!ex) return;
            const card = h('section', 'r-block r-ex');
            card.id = 'r-ex-' + rid.replace(/[^\w-]/g, '_');
            const hd = h('div', 'r-ex-h', esc(rubricLabel(b.rubric) || tt(S.exercise)) + (ex.page ? ' <span class="r-tag">' + esc(tt(S.page)) + ' ' + ex.page + '</span>' : ''));
            card.appendChild(hd);
            const body = h('div'); card.appendChild(body);
            root.appendChild(card);
            const exCtx = {
              // không truyền book/lang: makeCtx của core định nghĩa chúng là getter (Object.assign sẽ lỗi)
              mode: 'reading', variant: 'lesson_block', lesson: lesson.id, block: b.id,
              ai_context: (ex.ai_feedback && ex.ai_feedback.context === 'preceding_text') ? lessonText(lesson, bi).slice(-7000) : null
            };
            try { if (T0.renderEx) T0.renderEx(body, ex, exCtx); else body.textContent = ex.kind; } catch (e) { body.textContent = '⚠ ' + ex.kind; console.error('[reading] renderEx', ex.kind, e); }
          });
        }
      });
    }

    function rubricLabel(code) {
      // nhãn mục theo bộ sách: T0.blocks.rubric (R2, từ tri-thuc/rubric-bo-sach.json); không có thì để trống
      try { const r = T0.blocks && T0.blocks.rubric && T0.blocks.rubric(code); if (r && r.label) return tt(r.label); } catch (e) { /* bỏ qua */ }
      return '';
    }
    function blockText(b) {
      const out = [];
      if (b.title) out.push(b.title.uz);
      (b.paras || []).forEach((s) => out.push(s.uz));
      (b.stanzas || []).forEach((stz) => { stz.forEach((s) => out.push(s.uz)); out.push(''); });
      return out.join('\n');
    }
    function lessonText(l, uptoIdx) {
      return (l.blocks || []).filter((b, i) => READ_TYPES[b.type] && (uptoIdx == null || i < uptoIdx)).map(blockText).join('\n\n');
    }

    // ----- trang dựng lại chữ thật: ảnh nền đã xoá chữ + SVG text_lines -----
    function renderPages() {
      const pt = book.print_text || {};
      const W = pt.width || 595, H = pt.height || 842, styles = pt.styles || [];
      const anchors = (book.reading && book.reading.anchors) || [];
      const anchorByIdx = {};
      const anchorById = {};
      anchors.forEach((a) => { anchorById[a.id] = a; const m = /(\d+)$/.exec(a.id || ''); if (m) anchorByIdx[m[1]] = a; });
      (book.pages || []).filter((p) => p.text_lines && lesson.page_range && p.n >= lesson.page_range[0] && p.n <= lesson.page_range[1]).forEach((p) => {
        const wrap = h('div', 'r-page');
        wrap.setAttribute('aria-label', tt(S.page) + ' ' + (p.label || p.n));
        const groups = new Map(); const plain = [];
        const seen = new Set();
        p.text_lines.forEach((l) => {
          const key = l[0] + ',' + l[1] + ',' + l[5];
          if (seen.has(key)) return; seen.add(key); // dòng in trùng (lớp in chồng)
          // D2: ưu tiên anchor_id (phần tử 8); thiếu thì ghép theo đuôi số của id (cách cũ)
          const an = (l[7] && anchorById[l[7]]) || (l[6] >= 0 ? anchorByIdx[l[6]] : null);
          if (an) { const k = an.target; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(l); }
          else plain.push(l);
        });
        const tx = (l) => {
          const s = styles[l[4]] || [];
          const four = s.length >= 4; const bold = four ? s[1] : s[0], ital = four ? s[2] : s[1], col = s[s.length - 1] || '#231f20';
          return '<text x="' + l[0] + '" y="' + l[1] + '" font-size="' + l[3] + '" textLength="' + l[2] + '" lengthAdjust="spacingAndGlyphs" fill="' + esc(col) + '"' + (bold ? ' font-weight="700"' : '') + (ital ? ' font-style="italic"' : '') + '>' + esc(l[5]) + '</text>';
        };
        let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img">';
        if (p.background) svg += '<image href="' + esc(assetUrl(book, p.background)) + '" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="none"/>';
        svg += plain.filter((l) => l[1] < H - 2).map(tx).join('');
        groups.forEach((ls, k) => {
          const it = model.byKey[k];
          const rd = it && it.readable;
          const rects = ls.map((l) => '<rect x="' + (l[0] - 2) + '" y="' + (l[1] - l[3] * 0.95) + '" width="' + (l[2] + 4) + '" height="' + (l[3] * 1.3) + '" rx="2"/>').join('');
          svg += '<g class="' + (rd ? 'r-ln' : 'r-lnx') + '" data-k="' + esc(k) + '"' + (rd ? ' role="button" tabindex="0" aria-label="' + esc(tt(S.play) + ': ' + (it.s.uz || '')) + '"' : '') + '>' + rects + ls.map(tx).join('') + '</g>';
        });
        svg += '</svg>';
        wrap.innerHTML = svg;
        root.appendChild(wrap);
      });
      if (!root.querySelector('.r-page')) root.appendChild(h('div', 'r-empty', esc(tt(S.no_page))));
    }

    // ----- thanh điều khiển -----
    let bar = null;
    function renderBar() {
      bar = h('div', 'r-bar');
      bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', tt(S.label));
      const mk = (cls, label, txt, fn) => { const b = h('button', 'r-chip ' + cls, txt); b.type = 'button'; b.setAttribute('aria-label', label); b.title = label; b.onclick = fn; bar.appendChild(b); return b; };
      mk('r-prev', tt(S.prev), '‹', () => { const i = nextReadable(st.cur < 0 ? -1 : st.cur, -1); if (i >= 0) { if (st.playing) playFrom(i); else setCur(i, true); } });
      mk('r-main', tt(S.play), '▶ <span class="r-mt">' + esc(tt(S.play)) + '</span>', () => {
        if (st.playing) { stop(); return; }
        const start = st.cur >= 0 && model.sents[st.cur] && model.sents[st.cur].readable ? st.cur : nextReadable(-1, 1);
        if (start >= 0) playFrom(start);
      });
      mk('r-next', tt(S.next), '›', () => { const i = nextReadable(st.cur, 1); if (i >= 0) { if (st.playing) playFrom(i); else setCur(i, true); } });
      // tốc độ
      const g1 = h('span', 'r-grp'); g1.appendChild(h('span', 'r-lbl', esc(tt(S.speed))));
      const sel = document.createElement('select'); sel.className = 'r-rate'; sel.setAttribute('aria-label', tt(S.speed));
      RATES.forEach((r) => { const o = document.createElement('option'); o.value = r; o.textContent = r + '×'; if (r === st.rate) o.selected = true; sel.appendChild(o); });
      sel.onchange = () => { st.rate = +sel.value; if (T0.media && T0.media.setRate) T0.media.setRate(st.rate); if (st.playing && st.cur >= 0) playFrom(st.cur); };
      g1.appendChild(sel); bar.appendChild(g1);
      // giọng: bản gốc / bản dịch (chỉ khi giao diện khác ngôn ngữ gốc)
      if (T0.lang !== base) {
        const g2 = h('span', 'r-grp r-seg'); g2.appendChild(h('span', 'r-lbl', esc(tt(S.voice))));
        [['orig', base.toUpperCase()], ['tr', T0.lang.toUpperCase()]].forEach(([v, lab]) => {
          const b = h('button', 'r-chip r-voice', esc(lab)); b.type = 'button'; b.setAttribute('aria-pressed', String(st.voice === v));
          b.setAttribute('aria-label', tt(S.voice) + ': ' + (v === 'orig' ? tt(S.original) : tt(S.translation)));
          b.onclick = () => { st.voice = v; sset('reading:voice', v); g2.querySelectorAll('.r-voice').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); if (st.playing && st.cur >= 0) playFrom(st.cur); };
          g2.appendChild(b);
        });
        bar.appendChild(g2);
      }
      root.appendChild(bar);
      syncBar();
    }
    function syncBar() {
      if (!bar) return;
      const m = bar.querySelector('.r-main');
      if (m) { m.innerHTML = (st.playing ? '❚❚ ' : '▶ ') + '<span class="r-mt">' + esc(tt(st.playing ? S.pause : S.play)) + '</span>'; m.setAttribute('aria-label', st.playing ? tt(S.pause) : tt(S.play)); m.setAttribute('aria-pressed', String(st.playing)); }
    }

    // ----- sự kiện -----
    function onClick(e) {
      const g = e.target.closest && e.target.closest('.r-gl');
      if (g) { e.stopPropagation(); openGloss([g.dataset.g]); return; }
      const n = e.target.closest && e.target.closest('[data-k].r-on, [data-k].r-ln');
      if (n && root.contains(n)) {
        const it = model.byKey[n.getAttribute('data-k')];
        if (it && it.readable) playFrom(it.idx, true);
      }
    }
    function onKey(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const n = e.target.closest && e.target.closest('[data-k].r-on, [data-k].r-ln');
      if (n) { e.preventDefault(); onClick({ target: n, stopPropagation() {} }); }
    }
    let q = 0;
    const onLang = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; render(); }); };
    const onRate = (e) => { const r = e && e.detail && +e.detail.rate; if (r) { st.rate = r; const sl = root.querySelector('.r-rate'); if (sl) sl.value = String(RATES.includes(r) ? r : 1); } };
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    document.addEventListener('t0:lang', onLang);
    document.addEventListener('t0:rate', onRate);

    render();
    if (tgKey && model && model.byKey[tgKey]) setCur(model.byKey[tgKey].idx, true);

    return {
      unmount() {
        stop();
        document.removeEventListener('t0:lang', onLang);
        document.removeEventListener('t0:rate', onRate);
        if (q) cancelAnimationFrame(q);
        root.remove();
      },
      // dùng cho kiểm thử/ghim nhảy tới câu
      _state: st, _play: (k) => { const it = model && model.byKey[k]; if (it) playFrom(it.idx, true); }
    };
  }

  const def = { label: S.label, available, mount };
  if (typeof T0.registerMode === 'function') T0.registerMode('reading', def);
  else { (T0._pendingModes = T0._pendingModes || []).push(['reading', def]); }
  T0._reading = { buildModel, glossMatchers, markGloss, available };
})();
