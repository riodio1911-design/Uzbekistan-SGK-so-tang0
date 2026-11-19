/* modes/lesson.js — R2. Lớp bật thêm "bài học" (D1): dựng lại bài theo khối từ book.lessons[].blocks,
   kèm giới thiệu chương (units[].intro), vở bài tập (workbook_sets) và bài tập (T0.renderEx).
   available: features.layers.bai_hoc !== false VÀ có ít nhất một bài có blocks.
   Ghi nhớ vị trí: T0.store 'lesson:view'. ctx.target của setMode: {lesson}|{workbook}|{page} (mở đúng bài). Không viết cứng môn/lớp: mọi chữ nội dung lấy từ book.json. */
(function () {
  const T0 = window.T0 = window.T0 || {};
  const UI = {
    label: { uz: 'Dars', ru: 'Урок', vi: 'Bài học' },
    lessons: { uz: 'Mavzular', ru: 'Темы', vi: 'Các bài' },
    workbook: { uz: 'Mashq daftari', ru: 'Рабочая тетрадь', vi: 'Vở bài tập' },
    intro: { uz: 'Bob bilan tanishuv', ru: 'Знакомство с главой', vi: 'Giới thiệu chương' },
    listenAll: { uz: 'Butun darsni tinglash', ru: 'Слушать весь урок', vi: 'Nghe cả bài' },
    stop: { uz: 'To‘xtatish', ru: 'Стоп', vi: 'Dừng' },
    prev: { uz: 'Oldingi', ru: 'Назад', vi: 'Bài trước' }, next: { uz: 'Keyingi', ru: 'Далее', vi: 'Bài tiếp' },
    page: { uz: 'bet', ru: 'стр.', vi: 'trang' },
    ask: { uz: 'Yordamchidan so‘rash', ru: 'Спросить помощника', vi: 'Hỏi gia sư' },
    orig: { uz: 'Asl matn', ru: 'Оригинал', vi: 'Kèm bản gốc' },
    skills: { uz: 'Ko‘nikmalar', ru: 'Навыки', vi: 'Kỹ năng' },
    need: { uz: 'Sizga kerak bo‘ladi:', ru: 'Вам понадобится:', vi: 'Em cần chuẩn bị:' },
    steps: { uz: 'Ishni bajarish tartibi:', ru: 'Порядок выполнения:', vi: 'Các bước thực hiện:' },
    pageImg: { uz: 'Daftar sahifasi', ru: 'Страница тетради', vi: 'Trang vở in' },
    none: { uz: 'Bu kitobda dars bloklari yo‘q.', ru: 'В этой книге нет блоков урока.', vi: 'Cuốn này chưa có dữ liệu bài học.' }
  };
  const B = () => T0.blocks.u;
  const t = o => (T0.t ? T0.t(o) : (o && (o[T0.lang] || o.uz))) || '';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function available(book, features) {
    if (features && features.layers && features.layers.bai_hoc === false) return false;
    return !!(book && (book.lessons || []).some(l => l.blocks && l.blocks.length));
  }

  /* danh mục điều hướng: theo chương; mỗi bài có blocks; sau đó bộ vở bài tập gắn với bài */
  function toc(book) {
    const out = []; const seen = new Set();
    const lessons = (book.lessons || []).filter(l => l.blocks && l.blocks.length);
    const wbs = book.workbook_sets || [];
    (book.units || []).forEach(u => {
      const ls = lessons.filter(l => l.unit === u.id);
      ls.forEach(l => {
        seen.add(l.id); out.push({ type: 'lesson', id: l.id, unit: u, item: l });
        wbs.filter(w => w.lesson === l.id).forEach(w => { seen.add(w.id); out.push({ type: 'wb', id: w.id, unit: u, item: w }); });
      });
    });
    lessons.filter(l => !seen.has(l.id)).forEach(l => out.push({ type: 'lesson', id: l.id, unit: null, item: l }));
    wbs.filter(w => !seen.has(w.id)).forEach(w => out.push({ type: 'wb', id: w.id, unit: null, item: w }));
    return out;
  }

  function mount(root, ctx0) {
    const book = T0.book; const list = toc(book);
    let cur = (T0.store && T0.store.get('lesson:view', null)) || null;
    if (!cur || !list.some(x => x.type === cur.type && x.id === cur.id)) cur = list[0] ? { type: list[0].type, id: list[0].id } : null;
    let dual = !!(T0.store && T0.store.get('lesson:dual', false));
    let mounted = [];   // các khối/bài tập đã gắn (để unmount)
    let queue = null;   // nghe cả bài

    root.innerHTML = '';
    const wrap = B().h('div', 't0l');
    root.append(wrap);

    /* ctx riêng của lớp bài học (không chép book/lang để core giữ getter theo trạng thái hiện tại) */
    const ctx = {
      mode: 'lesson',
      get dual() { return dual; },
      renderExercise: (el, id) => renderExercise(el, id),
      openWorkbook: id => go({ type: 'wb', id })
    };
    const goMode = (ctx0 && ctx0.go) || ((m, o) => T0.setMode(m, o));
    const target = ctx0 && ctx0.target;
    if (target && (target.lesson || target.workbook)) {
      const want = target.lesson ? { type: 'lesson', id: target.lesson } : { type: 'wb', id: target.workbook };
      if (list.some(x => x.type === want.type && x.id === want.id)) cur = want;
    } else if (target && target.page != null) {
      const hit = list.find(x => x.type === 'lesson' && (x.item.page === target.page || (x.item.page_range && target.page >= x.item.page_range[0] && target.page <= x.item.page_range[1])));
      if (hit) cur = { type: 'lesson', id: hit.id };
    }

    function go(v) { stopQueue(); cur = v; T0.store && T0.store.set('lesson:view', v); draw(); root.scrollIntoView && wrap.scrollIntoView({ block: 'start' }); window.scrollTo && window.scrollTo(0, 0); }

    /* bài tập: T0.renderEx của core vẽ phần đầu (prompt), nút Kiểm tra/Làm lại, phản hồi, lưu 'res:<id>' */
    function renderExercise(el, id) {
      const ex = B().byId(book.exercises, id);
      const host = B().h('div', 't0l-ex'); host.dataset.exRef = id; el.append(host);
      if (!ex) { host.innerHTML = `<div class="t0b-missing">${esc(id)}</div>`; return; }
      try { mounted.push(T0.renderEx(host, ex, ctx)); } catch (e) { console.error('[lesson] renderEx', id, e); host.innerHTML = `<div class="t0b-missing">${esc(ex.kind)}</div>`; }
    }

    function clearMounted() { mounted.forEach(m => { try { m && m.unmount && m.unmount(); } catch (e) {} }); mounted = []; }

    /* nghe cả bài: phát lần lượt audio_ref của các khối, tô khối đang đọc */
    function stopQueue() {
      if (!queue) return; const q = queue; queue = null; clearTimeout(q.tm); q.cur && q.cur.classList.remove('t0b-speaking');
      try { T0.media && T0.media.stop(); } catch (e) {}
      const b = wrap.querySelector('[data-a=all]'); if (b) { b.setAttribute('aria-pressed', 'false'); b.lastChild.textContent = t(UI.listenAll); }
    }
    function playAll(btn) {
      if (queue) { stopQueue(); return; }
      const secs = [...wrap.querySelectorAll('.t0l-main [data-block]')].map(s => ({ s, b: findBlock(s.dataset.block) })).filter(x => x.b && x.b.audio_ref);
      if (!secs.length) return;
      queue = { k: 0, tm: null, cur: null };
      btn.setAttribute('aria-pressed', 'true'); btn.lastChild.textContent = t(UI.stop);
      const step = () => {
        if (!queue) return;
        if (queue.cur) queue.cur.classList.remove('t0b-speaking');
        if (queue.k >= secs.length) { stopQueue(); return; }
        const { s, b } = secs[queue.k++]; queue.cur = s; s.classList.add('t0b-speaking'); s.scrollIntoView({ block: 'center', behavior: 'smooth' });
        const me = queue; let pr = null;
        try { pr = T0.media.play(b.audio_ref, {}); } catch (e) {}
        const nxt = () => { if (queue === me) queue.tm = setTimeout(step, 400); };
        if (pr && pr.then) pr.then(ok => { if (ok === false) stopQueue(); else nxt(); }, nxt); else nxt();
      };
      step();
    }
    function findBlock(id) { for (const l of book.lessons || []) for (const b of l.blocks || []) if (b.id === id) return b; return null; }

    function draw() {
      clearMounted(); stopQueue();
      if (!cur) { wrap.innerHTML = `<p class="t0b-missing">${esc(t(UI.none))}</p>`; return; }
      const idx = list.findIndex(x => x.type === cur.type && x.id === cur.id); const entry = list[idx];
      const groups = []; list.forEach((x, k) => { const g = x.unit ? x.unit.id : '_'; let gg = groups.find(y => y.id === g); if (!gg) groups.push(gg = { id: g, unit: x.unit, items: [] }); gg.items.push([x, k]); });
      const optLabel = x => x.type === 'lesson' ? `${x.item.no ? x.item.no + ' · ' : ''}${B().plain(x.item.title)}` : `${t(UI.workbook)} · ${x.item.no ? x.item.no + ' ' : ''}${B().plain(x.item.title)}`;
      const hasAudio = entry.type === 'lesson' && (entry.item.blocks || []).some(b => b.audio_ref);
      const base = (book.profile && book.profile.lang_base) || 'uz';
      wrap.innerHTML = `<div class="t0l-bar"><label class="t0l-sel"><span class="t0l-vh">${esc(t(UI.lessons))}</span><select class="k-hit" data-a="sel">${groups.map(g => `<optgroup label="${esc(g.unit ? (g.unit.no != null ? g.unit.no + '. ' : '') + B().plain(g.unit.title) : '—')}">${g.items.map(([x, k]) => `<option value="${k}"${k === idx ? ' selected' : ''}>${esc(optLabel(x))}</option>`).join('')}</optgroup>`).join('')}</select></label>
        <div class="t0l-tools">${hasAudio ? `<button type="button" class="t0l-btn k-hit" data-a="all" aria-pressed="false"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/></svg><span>${esc(t(UI.listenAll))}</span></button>` : ''}
        ${T0.lang !== base ? `<button type="button" class="t0l-btn k-hit" data-a="dual" aria-pressed="${dual}">${esc(t(UI.orig))}</button>` : ''}
        ${T0.tutor ? `<button type="button" class="t0l-btn k-hit" data-a="ask">${esc(t(UI.ask))}</button>` : ''}</div></div>
        <article class="t0l-main"></article>
        <nav class="t0l-nav">${idx > 0 ? `<button type="button" class="t0l-btn k-hit" data-a="prev">← ${esc(t(UI.prev))}</button>` : '<span></span>'}${idx < list.length - 1 ? `<button type="button" class="t0l-btn t0l-primary k-hit" data-a="next">${esc(t(UI.next))} →</button>` : '<span></span>'}</nav>`;
      const main = wrap.querySelector('.t0l-main');
      if (entry.type === 'lesson') drawLesson(main, entry); else drawWorkbook(main, entry);
      wrap.querySelector('[data-a=sel]').onchange = e => { const x = list[+e.target.value]; go({ type: x.type, id: x.id }); };
      wrap.querySelectorAll('.t0l-bar [data-a], .t0l-nav [data-a]').forEach(b => {
        const a = b.dataset.a; if (a === 'sel') return;
        b.onclick = () => {
          if (a === 'prev') { const x = list[idx - 1]; go({ type: x.type, id: x.id }); }
          if (a === 'next') { const x = list[idx + 1]; go({ type: x.type, id: x.id }); }
          if (a === 'all') playAll(b);
          if (a === 'dual') { dual = !dual; T0.store && T0.store.set('lesson:dual', dual); draw(); }
          if (a === 'ask') T0.tutor.open({ role: 'chat', context: contextText(entry) });
        };
      });
    }

    /* ngữ cảnh gửi gia sư: chữ của bài hiện tại (giới hạn 9000 ký tự như gia-su/prompts.json role chat) */
    function contextText(entry) {
      const parts = []; const it = entry.item; const P = o => o ? (o.uz || '') + (T0.lang !== 'uz' && o[T0.lang] ? ' / ' + o[T0.lang] : '') : '';
      parts.push((it.no || '') + ' ' + P(it.title));
      if (entry.type === 'lesson') (it.blocks || []).forEach(b => { if (b.title) parts.push(P(b.title)); (b.paras || []).concat(b.items || []).forEach(p => parts.push(P(p))); });
      else { parts.push(P(it.skills)); parts.push(P(it.need)); (it.steps || []).forEach(s => parts.push(P(s))); }
      return { kind: entry.type, id: entry.id, text: parts.join('\n').replace(/\*\*/g, '').slice(0, 9000) };
    }

    function drawLesson(main, entry) {
      const l = entry.item; const u = entry.unit;
      if (u && u.intro && u.intro.length && (u.lesson_refs || [])[0] === l.id) {
        const sec = B().h('section', 't0l-unit');
        sec.innerHTML = `<div class="t0l-unit-h">${u.no != null ? `<span class="t0l-unit-no">${esc(u.no)}</span>` : ''}<div><small>${esc(t(UI.intro))}</small><h2>${B().tx(u.title, ctx)}</h2></div></div>
          ${u.image ? `<img class="t0l-unit-img" src="${esc(B().asset(u.image))}" alt="" loading="lazy">` : ''}
          <ul>${u.intro.map(p => `<li>${B().tx(p, ctx)}</li>`).join('')}</ul>`;
        main.append(sec);
      }
      const hd = B().h('header', 't0l-head');
      const pageLab = l.page != null ? `${esc(t(UI.page))} ${esc(l.page)}` : '';
      const canPin = T0.availableModes && T0.availableModes().includes('pin');
      hd.innerHTML = `${l.no != null ? `<span class="t0l-no">${esc(l.no)}</span>` : ''}<h1>${B().tx(l.title, ctx)}</h1>${pageLab ? (canPin ? `<button type="button" class="t0l-btn t0l-pg k-hit"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="2"/></svg>${pageLab}</button>` : `<span class="t0l-pgl">${pageLab}</span>`) : ''}`;
      const pg = hd.querySelector('.t0l-pg'); if (pg) pg.onclick = () => goMode('pin', { target: { page: l.page } });
      main.append(hd);
      (l.blocks || []).forEach(b => mounted.push(T0.blocks.render(main, b, ctx)));
    }

    function drawWorkbook(main, entry) {
      const w = entry.item;
      const hd = B().h('header', 't0l-head t0l-wbhead');
      hd.innerHTML = `${w.no ? `<span class="t0l-no">${esc(w.no)}</span>` : ''}<div><small>${esc(t(UI.workbook))}${w.kind ? ' · ' + B().tx(w.kind, ctx) : ''}</small><h1>${B().tx(w.title, ctx)}</h1></div>`;
      main.append(hd);
      if (w.skills) main.append(B().h('section', 't0b t0l-wbskills', `<div class="t0b-rub">${esc(t(UI.skills))}</div><p>${B().tx(w.skills, ctx)}</p>`));
      if (w.need || w.steps) {
        const s = B().h('section', 't0b');
        if (w.need) s.append(B().h('div', 't0b-need', `<b>${esc(t(UI.need))}</b><p>${B().tx(w.need, ctx)}</p>`));
        if (w.steps) s.append(B().h('div', 't0b-steps', `<b>${esc(t(UI.steps))}</b><ol>${w.steps.map(x => `<li>${B().tx(x, ctx)}</li>`).join('')}</ol>`));
        main.append(s);
      }
      /* trang vở in (ảnh gốc) để đối chiếu — chạm để phóng to */
      const vol = w.volume; const [p0, p1] = w.page_range || [];
      const pages = (book.pages || []).filter(p => (!vol || p.volume === vol) && p0 != null && p.n >= p0 && p.n <= (p1 || p0));
      if (pages.length) {
        const s = B().h('section', 't0b t0l-wbpages', `<div class="t0b-rub">${esc(t(UI.pageImg))}</div>`);
        const row = B().h('div', 't0l-thumbs');
        pages.forEach(p => {
          const src = B().pageImg(p.n, p.volume); if (!src) return;
          const btn = B().h('button', 't0l-thumb k-hit', `<img src="${esc(B().asset(src))}" alt="${esc(t(UI.pageImg))} ${p.n}" loading="lazy"><span>${esc(p.label || p.n)}</span>`);
          btn.type = 'button';
          btn.onclick = () => { const im = B().h('img', 't0l-bigpage'); im.src = B().asset(src); im.alt = ''; T0.ui.modal(im, { title: `${t(UI.workbook)} · ${p.label || p.n}` }); };
          row.append(btn);
        });
        s.append(row); main.append(s);
      }
      const refs = (w.exercise_refs || []).slice();
      (book.exercises || []).forEach(e => { if (e.volume === vol && w.lesson && e.lesson === w.lesson && e.page != null && e.page >= p0 && e.page <= (p1 || p0) && !refs.includes(e.id)) refs.push(e.id); });
      refs.forEach(id => { const s = B().h('section', 't0b t0l-wbex'); main.append(s); renderExercise(s, id); });
    }

    const onLang = () => draw();
    document.addEventListener('t0:lang', onLang);
    draw();
    return { unmount() { stopQueue(); clearMounted(); document.removeEventListener('t0:lang', onLang); root.innerHTML = ''; } };
  }

  const css = `
.t0l{max-width:780px;margin:0 auto;padding:0 var(--space-4) var(--space-8);box-sizing:border-box;color:var(--color-ink);font-family:var(--font-body)}
.t0l *{box-sizing:border-box}
.t0l-bar{position:sticky;top:0;z-index:var(--z-bar);display:flex;flex-wrap:wrap;gap:var(--space-2);align-items:center;padding:var(--space-2) 0;background:var(--color-bg);border-bottom:1px solid var(--color-line);margin-bottom:var(--space-4)}
.t0l-sel{flex:1 1 220px;min-width:0}
@media (max-width:599px){.t0l-bar{position:static}.t0l-tools{flex-wrap:nowrap;overflow-x:auto;width:100%}.t0l-tools .t0l-btn{flex:none}.t0l-unit-img{max-height:170px}}
.t0l-sel select{width:100%;min-height:var(--touch-min);font:inherit;font-weight:700;color:var(--color-ink);background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-sm);padding:0 10px}
.t0l-vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.t0l-tools{display:flex;gap:var(--space-2);flex-wrap:wrap}
.t0l-btn{display:inline-flex;align-items:center;gap:6px;min-height:var(--touch-min);padding:0 var(--space-3);border-radius:var(--radius-pill);border:1px solid var(--color-line);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-sm);font-weight:700;cursor:pointer}
.t0l-btn[aria-pressed=true]{background:var(--color-accent-soft);border-color:var(--color-accent);color:var(--color-accent-ink)}
.t0l-primary{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.t0l-unit{background:var(--color-accent-soft);border-radius:var(--radius-lg);padding:var(--space-4);margin-bottom:var(--space-5)}
.t0l-unit-h{display:flex;gap:var(--space-3);align-items:center}
.t0l-unit-no{width:56px;height:56px;border-radius:50%;background:var(--color-accent);color:var(--color-on-accent);display:grid;place-items:center;font:800 28px var(--font-display);flex:none}
.t0l-unit-h small{color:var(--color-accent-ink);font-weight:700}.t0l-unit-h h2{margin:0;font-family:var(--font-display);font-size:var(--text-h2);line-height:1.15}
.t0l-unit-img{width:100%;max-height:260px;object-fit:contain;margin:var(--space-3) 0;border-radius:var(--radius-md);background:var(--color-surface)}
.t0l-unit ul{margin:var(--space-3) 0 0;padding-left:1.2em}.t0l-unit li{margin-bottom:6px;line-height:var(--lh-body)}
.t0l-head{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2) var(--space-3);margin:0 0 var(--space-4)}
.t0l-head h1{margin:0;font-family:var(--font-display);font-size:var(--text-h1);line-height:1.1;flex:1 1 auto}
.t0l-head small{color:var(--color-ink-2);font-weight:700}
.t0l-wbhead>div{flex:1}
.t0l-no{background:var(--color-accent);color:var(--color-on-accent);font:800 var(--text-lg) var(--font-display);padding:2px 12px;border-radius:var(--radius-pill)}
.t0l-pgl{color:var(--color-ink-2);font-size:var(--text-sm)}
.t0l-wbex .t0-ex{border:0}
.t0l-wbskills p{margin:4px 0 0;line-height:var(--lh-body)}
.t0l-thumbs{display:flex;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-2)}
.t0l-thumb{border:1px solid var(--color-line);border-radius:var(--radius-sm);background:var(--color-page-paper);padding:4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;font-size:var(--text-xs);color:var(--color-ink-2)}
.t0l-thumb img{width:120px;height:auto;display:block}
.t0l-bigpage{max-width:100%;height:auto;display:block}
.t0l-nav{display:flex;justify-content:space-between;gap:var(--space-3);margin-top:var(--space-5)}
`;
  if (!document.getElementById('t0l-css')) { const s = document.createElement('style'); s.id = 't0l-css'; s.textContent = css; document.head.append(s); }

  if (T0.registerMode) T0.registerMode('lesson', { label: UI.label, available, mount });
})();
