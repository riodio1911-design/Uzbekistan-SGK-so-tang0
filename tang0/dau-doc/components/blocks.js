/* components/blocks.js — R2. Hiển thị 13 block.type của schema (text, list, prompt, image, figure, video,
   simulation, exercise, poem, prose, table, procedure, workbook_link).
   Nhãn mục lấy theo rubric của bộ sách qua T0.rubricData (sinh từ tri-thuc/rubric-bo-sach.json).
   API: T0.blocks.render(el, block, ctx) -> {unmount()} ; T0.blocks.rubric(code) -> {label, concept}|null ;
        T0.blocks.u (tiện ích dùng chung: esc, md, tx, asset, h, cropStyle, listenBtn).
   ctx (do modes/lesson.js truyền): {renderExercise(el, exId), openWorkbook(id), dual:boolean} — đều tùy chọn. */
(function () {
  const T0 = window.T0 = window.T0 || {};

  const UI = {
    listen: { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' },
    stop: { uz: 'To‘xtatish', ru: 'Стоп', vi: 'Dừng' },
    play: { uz: 'Ko‘rish', ru: 'Смотреть', vi: 'Xem' },
    scenes: { uz: 'sahna', ru: 'сцен', vi: 'cảnh' },
    open: { uz: 'Ochish', ru: 'Открыть', vi: 'Mở' },
    need: { uz: 'Sizga kerak bo‘ladi:', ru: 'Вам понадобится:', vi: 'Em cần chuẩn bị:' },
    steps: { uz: 'Ishni bajarish tartibi:', ru: 'Порядок выполнения:', vi: 'Các bước thực hiện:' },
    missing: { uz: 'Ma’lumot topilmadi', ru: 'Данные не найдены', vi: 'Không tìm thấy dữ liệu' },
    zoom: { uz: 'Kattalashtirish', ru: 'Увеличить', vi: 'Phóng to' },
    video_note: { uz: 'Video izoh', ru: 'Видеопояснение', vi: 'Video giải thích' },
    think_set: { uz: 'Fikrlash mashqlari', ru: 'Упражнения на размышление', vi: 'Bài tập tư duy' },
    term: { uz: 'Atama', ru: 'Термин', vi: 'Thuật ngữ' },
    page: { uz: 'bet', ru: 'стр.', vi: 'trang' }
  };

  /* ---------- tiện ích ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /* **đậm** + ký pháp phân số {a/b} (đề xuất 012, components/text/math.js) */
  const md = s => { const h = esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); return T0.math ? T0.math.fromEscaped(h) : h; };
  const L = () => T0.lang || 'uz';
  const t = o => (T0.t ? T0.t(o) : (o && (o[L()] || o.uz))) || '';
  /* tx: chuỗi đa ngữ -> HTML (có **đậm**); ctx.dual: hiện thêm dòng bản gốc (lang_base) khi đang xem bản dịch */
  const tx = (o, ctx) => {
    if (o == null) return '';
    if (typeof o === 'string') return md(o);
    let h = md(t(o));
    const base = (T0.book && T0.book.profile && T0.book.profile.lang_base) || 'uz';
    if (ctx && ctx.dual && L() !== base && o[base] && o[L()]) h += `<span class="t0b-orig" lang="${base}">${md(o[base])}</span>`;
    return h;
  };
  const plain = o => t(o).replace(/\*\*/g, '');
  const asset = p => !p ? '' : /^(data:|https?:|blob:|\/)/.test(p) ? p :
    (T0.asset ? T0.asset(p) : 'mau/' + ((T0.book && T0.book.book_id) || '') + '/' + p);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const byId = (arr, id) => (arr || []).find(x => x.id === id);
  /* ảnh trang theo ngôn ngữ in: ưu tiên bản in của lang hiện tại, rồi lang_base, rồi bất kỳ */
  const pageImg = (n, vol) => {
    const b = T0.book || {}; const pg = (b.pages || []).find(p => p.n === n && (!vol || !p.volume || p.volume === vol));
    if (!pg || !pg.images) return '';
    const base = (b.profile && b.profile.lang_base) || 'uz';
    return pg.images[L()] || pg.images[base] || Object.values(pg.images)[0] || '';
  };
  /* page_crop {page, box:[x,y,w,h] %} -> style nền cắt từ ảnh trang */
  const cropStyle = crop => {
    const src = pageImg(crop.page, crop.volume); if (!src) return '';
    const [x, y, w, hh] = crop.box; const ww = w || 100, hgt = hh || ww;
    return `background-image:url('${asset(src)}');background-size:${(100 / ww) * 100}% auto;` +
      `background-position:${ww >= 100 ? 0 : (x / (100 - ww)) * 100}% ${hgt >= 100 ? 0 : (y / (100 - hgt)) * 100}%;aspect-ratio:${ww}/${hgt * 1.319};`;
  };
  /* Khóa của rubric-bo-sach.json là mô tả cho người đọc ("poem|prose (rub read)", "task kind=topshiriq", "Eslang (vở)"),
     còn book.json dùng block.rubric thật ("poem", "task.topshiriq", "Eslang"). Chuẩn hóa khi tra (đề xuất 011, DD-5):
     bỏ phần "(…)" cuối, tách "a|b", "x kind=y" -> "x.y". Khóa nguyên văn vẫn ưu tiên. */
  const rubricAliases = k => {
    const out = [k];
    const base = String(k).replace(/\s*\([^)]*\)\s*$/, '').trim();
    out.push(base);
    const m = /^(\S+)\s+kind=(\S+)$/.exec(base); if (m) out.push(m[1] + '.' + m[2]);
    base.split('|').forEach(x => out.push(x.trim()));
    return out.filter(Boolean);
  };
  const rubIdx = {};
  const rubricIndex = set => {
    const d = T0.rubricData; const src = d && d.books && d.books[set];
    if (!src) return null;
    if (rubIdx[set] && rubIdx[set].src === src) return rubIdx[set].map;
    const map = {};
    Object.keys(src).forEach(k => { map[k] = src[k]; });
    Object.keys(src).forEach(k => rubricAliases(k).forEach(a => { if (!(a in map)) map[a] = src[k]; }));
    rubIdx[set] = { src, map };
    return map;
  };
  const rubric = code => {
    const d = T0.rubricData; if (!d || !code) return null;
    const f = T0.features || {}; const ax2 = (f.axes && f.axes['2']) || {};
    const set = ax2.rubric_set || (T0.book && T0.book.book_id);
    const idx = rubricIndex(set);
    const m = idx && idx[code];
    return m ? { label: m.label, concept: m.concept, position: (d.concepts[m.concept] || {}).position } : null;
  };

  /* nút nghe theo khối: dùng T0.media.play(clipId) — core tự rơi về giọng trình duyệt nếu không có file */
  let playing = null;
  const listenBtn = (clipId, hostEl) => {
    const b = h('button', 't0b-listen k-hit');
    b.type = 'button';
    const set = on => { b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${on ? '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>' : '<path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/>'}</svg><span>${esc(t(on ? UI.stop : UI.listen))}</span>`; };
    set(false);
    b.onclick = () => {
      const on = playing && playing.b === b;
      if (playing) { playing.set(false); playing.host && playing.host.classList.remove('t0b-speaking'); playing = null; }
      if (T0.media) T0.media.stop();
      if (on) return;
      playing = { b, set, host: hostEl }; set(true); hostEl && hostEl.classList.add('t0b-speaking');
      const me = playing;
      const done = () => { if (playing === me) { set(false); hostEl && hostEl.classList.remove('t0b-speaking'); playing = null; } };
      /* core: T0.media.play -> Promise xong khi đọc hết (file theo lang, hoặc giọng trình duyệt đọc chữ ở clip.text_path) */
      let pr = null; try { pr = T0.media.play(clipId, {}); } catch (e) { console.warn(e); }
      if (pr && pr.then) pr.then(done, done); else setTimeout(done, 8000);
    };
    return b;
  };

  /* ---------- đầu khối: nhãn rubric + nút nghe ---------- */
  function head(sec, b, ctx, opt) {
    const r = rubric(b.rubric);
    const row = h('div', 't0b-head');
    const lab = (opt && opt.label) || (r && r.label);
    if (lab) row.append(h('div', 't0b-rub', esc(t(lab))));
    else row.append(h('span'));
    if (b.audio_ref) row.append(listenBtn(b.audio_ref, sec));
    if (lab || b.audio_ref) sec.append(row);
    if (r) sec.dataset.concept = r.concept;
  }
  const paras = (arr, ctx, tag) => (arr || []).map(p => `<${tag || 'p'}>${tx(p, ctx)}</${tag || 'p'}>`).join('');

  function exercises(sec, refs, ctx) {
    (refs || []).forEach(id => {
      const host = h('div', 't0b-ex'); sec.append(host);
      if (ctx && ctx.renderExercise) ctx.renderExercise(host, id);
      else {
        const ex = byId(T0.book.exercises, id);
        if (ex && T0.renderEx) T0.renderEx(host, ex, ctx || {}); else host.innerHTML = `<div class="t0b-missing">${esc(t(UI.missing))}: ${esc(id)}</div>`;
      }
    });
  }

  /* ---------- 13 dạng khối ---------- */
  const R = {};
  R.text = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    const body = h('div', 't0b-body', paras(b.paras, ctx)); sec.append(body);
    /* steps: danh sách đánh số trong khối learn (biologiya5 TC04a, đề xuất 011) */
    if (b.steps && b.steps.length) sec.append(h('ol', 't0b-olist', paras(b.steps, ctx, 'li')));
    if (b.gallery && b.gallery.length) {
      const g = h('div', 't0b-gallery');
      b.gallery.forEach(it => {
        const f = h('figure', '', `<img src="${esc(asset(it.src))}" alt="${esc(plain(it.caption))}" loading="lazy">${it.caption ? `<figcaption>${tx(it.caption, ctx)}</figcaption>` : ''}`);
        f.querySelector('img').onerror = function () { this.replaceWith(h('div', 't0b-noimg', esc(it.src))); };
        g.append(f);
      });
      sec.append(g);
    }
    if (b.note) sec.append(h('p', 't0b-note', tx(b.note, ctx)));
    /* video_ref trong khối chữ: nút "Video izoh" mở trình phát cảnh trong hộp thoại (biologiya5 TC04a) */
    if (b.video_ref) sec.append(videoNoteBtn(b.video_ref, ctx));
    exercises(sec, b.exercise_refs, ctx);
  };
  function videoNoteBtn(ref, ctx) {
    const v = byId(T0.book.videos, ref);
    const btn = h('button', 't0b-vnote k-hit', `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10l6-3v10l-6-3z" fill="currentColor"/></svg><span>${esc(t(UI.video_note))}</span>${v && v.title ? `<small>${tx(v.title)}</small>` : ''}`);
    btn.type = 'button';
    if (!v) { btn.disabled = true; btn.title = t(UI.missing) + ': ' + ref; return btn; }
    btn.onclick = () => openVideo(v, ctx);
    return btn;
  }
  function openVideo(v, ctx) {
    const box = h('div');
    let inst = null;
    T0.ui.modal(box, { title: plain(v.title) || t(UI.video_note), wide: true, onClose: () => { inst && inst.unmount && inst.unmount(); T0.media && T0.media.stop(); } });
    inst = T0.renderSim(box, { id: v.id, kind: 'sim.scene_player', params: { video: v, autoplay: true } }, ctx);
    return inst;
  }
  R.list = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    if (b.checkable) {
      const box = h('div', 't0b-checks');
      (b.items || []).forEach((it, i) => {
        const key = 'check:' + (b.id || 'b') + ':' + i;
        const lab = h('label', 't0b-check k-hit', `<input type="checkbox"><span>${tx(it, ctx)}</span>`);
        const inp = lab.querySelector('input'); inp.checked = !!(T0.store && T0.store.get(key, false));
        inp.onchange = () => T0.store && T0.store.set(key, inp.checked);
        box.append(lab);
      });
      sec.append(box);
    } else sec.append(h('ul', 't0b-list', paras(b.items, ctx, 'li')));
  };
  R.prompt = (sec, b, ctx) => {
    const r = rubric(b.rubric);
    const companion = r && r.concept === 'companion_character';
    sec.classList.add(companion ? 't0b-companion' : 't0b-think');
    const ic = h('div', 't0b-ic', companion
      ? '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="12" width="28" height="24" rx="8" fill="currentColor"/><circle cx="19" cy="24" r="3.5" fill="var(--color-surface)"/><circle cx="29" cy="24" r="3.5" fill="var(--color-surface)"/><rect x="22" y="4" width="4" height="8" rx="2" fill="currentColor"/><rect x="16" y="38" width="16" height="6" rx="3" fill="currentColor"/></svg>'
      : '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="20" r="13" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M19 37h10M20 42h8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M24 12v9l5 3" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/></svg>');
    const wrap = h('div', 't0b-bubble');
    sec.append(ic, wrap);
    head(wrap, b, ctx);
    if (b.title) wrap.append(h('h3', 't0b-title', tx(b.title, ctx)));
    wrap.append(h('div', 't0b-body', paras(b.paras, ctx)));
    exercises(wrap, b.exercise_refs, ctx);
  };
  R.image = (sec, b, ctx) => {
    head(sec, b, ctx);
    const f = h('figure', 't0b-figure');
    if (b.src) f.innerHTML = `<img src="${esc(asset(b.src))}" alt="${esc(plain(b.caption))}" loading="lazy">`;
    else if (b.crop) { const st = cropStyle(b.crop); f.innerHTML = st ? `<div class="t0b-crop" role="img" aria-label="${esc(plain(b.caption))}" style="${st}"></div>` : `<div class="t0b-noimg">p.${b.crop.page}</div>`; }
    if (b.caption) f.append(h('figcaption', '', tx(b.caption, ctx)));
    sec.append(f);
  };
  R.figure = (sec, b, ctx) => {
    head(sec, b, ctx);
    const fig = byId(T0.book.figures, b.figure_ref);
    const host = h('div', 't0b-simhost'); sec.append(host);
    if (!fig) { host.innerHTML = `<div class="t0b-missing">${esc(t(UI.missing))}: ${esc(b.figure_ref)}</div>`; return; }
    /* figures dùng chung renderer sim.figure_explorer của R1; params = chính bản ghi figure */
    return T0.renderSim(host, { id: fig.id, kind: 'sim.figure_explorer', params: fig }, ctx);
  };
  R.video = (sec, b, ctx) => {
    head(sec, b, ctx);
    const v = byId(T0.book.videos, b.video_ref);
    if (!v) { sec.append(h('div', 't0b-missing', esc(t(UI.missing)) + ': ' + esc(b.video_ref))); return; }
    const card = h('button', 't0b-vcard k-hit');
    card.type = 'button';
    card.innerHTML = `<span class="t0b-vplay" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
      <span class="t0b-vtxt"><b>${tx(v.title, ctx)}</b><small>${(v.scenes || []).length} ${esc(t(UI.scenes))}</small></span>`;
    sec.append(card);
    let inst = null;
    card.onclick = () => {
      const host = h('div', 't0b-simhost'); card.replaceWith(host);
      inst = T0.renderSim(host, { id: v.id, kind: 'sim.scene_player', params: { video: v, autoplay: true } }, ctx);
    };
    return { unmount() { inst && inst.unmount && inst.unmount(); } };
  };
  R.simulation = (sec, b, ctx) => {
    const sim = byId(T0.book.simulations, b.simulation_ref);
    head(sec, b, ctx, sim && sim.title ? { label: sim.title } : null);
    const host = h('div', 't0b-simhost'); sec.append(host);
    if (!sim) { host.innerHTML = `<div class="t0b-missing">${esc(t(UI.missing))}: ${esc(b.simulation_ref)}</div>`; return; }
    /* sim.figure_explorer dạng "parts" (tabiiy5 mountFlower: SVG vẽ bằng mã, tọa độ theo viewbox) do renderer của R1 vẽ.
       Hình nền vẽ bằng mã đã xuất thành tệp: quy ước params.background_src mặc định 'sim/<id>.svg' (đề xuất D2). */
    if (sim.kind === 'sim.figure_explorer' && sim.params && Array.isArray(sim.params.parts) && !sim.params.background_src)
      return T0.renderSim(host, Object.assign({}, sim, { params: Object.assign({ background_src: 'sim/' + sim.id + '.svg' }, sim.params) }), ctx);
    return T0.renderSim(host, sim, ctx);
  };
  R.exercise = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    if (b.paras) sec.append(h('div', 't0b-body', paras(b.paras, ctx)));
    exercises(sec, b.exercise_refs, ctx);
  };
  R.poem = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title && !b.untitled) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    if (b.by) sec.append(h('div', 't0b-by', tx(b.by, ctx)));
    const p = h('div', 't0b-poem');
    (b.stanzas || []).forEach(st => p.append(h('p', 't0b-stanza', st.map(l => `<span>${tx(l, ctx)}</span>`).join(''))));
    sec.append(p);
  };
  R.prose = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title && !b.untitled) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    if (b.by) sec.append(h('div', 't0b-by', tx(b.by, ctx)));
    sec.append(h('div', 't0b-prose', paras(b.paras, ctx)));
  };
  R.table = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    const tb = b.table || {}; const cols = tb.cols || [];
    const rows = Array.isArray(tb.rows) ? tb.rows : Array.from({ length: tb.rows || 0 }, () => cols.map(() => null));
    const first = tb.first_col;
    const w = h('div', 't0b-tablewrap');
    w.innerHTML = `<table class="t0b-table">${cols.length ? `<thead><tr>${cols.map(c => `<th>${tx(c, ctx)}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map((r, i) => `<tr>${first ? `<th scope="row">${tx(first[i], ctx)}</th>` : ''}${(first ? r.slice(1) : r).map(c => `<td>${c ? tx(c, ctx) : ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    sec.append(w);
  };
  R.procedure = (sec, b, ctx) => {
    head(sec, b, ctx);
    if (b.title) sec.append(h('h3', 't0b-title', tx(b.title, ctx)));
    if (b.paras) sec.append(h('div', 't0b-body', paras(b.paras, ctx)));
    if (b.need) sec.append(h('div', 't0b-need', `<b>${esc(t(UI.need))}</b><p>${tx(b.need, ctx)}</p>`));
    if (b.steps) sec.append(h('div', 't0b-steps', `<b>${esc(t(UI.steps))}</b><ol>${paras(b.steps, ctx, 'li')}</ol>`));
    exercises(sec, b.exercise_refs, ctx);
  };
  R.workbook_link = (sec, b, ctx) => {
    head(sec, b, ctx);
    const btn = h('button', 't0b-wblink k-hit', `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 3h11l3 3v15H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="2"/></svg><span>${paras(b.paras, ctx, 'span')}</span><span aria-hidden="true">→</span>`);
    btn.type = 'button';
    if (ctx && ctx.openWorkbook && b.workbook_ref) btn.onclick = () => ctx.openWorkbook(b.workbook_ref);
    else btn.disabled = true;
    sec.append(btn);
  };

  function render(el, b, ctx) {
    const sec = h('section', 't0b t0b-' + b.type);
    if (b.id) sec.dataset.block = b.id;
    if (b.rubric) sec.dataset.rubric = b.rubric;
    el.append(sec);
    const fn = R[b.type];
    let inst = null;
    if (!fn) sec.innerHTML = `<div class="t0-unsupported">block.type: ${esc(b.type)}</div>`;
    else { try { inst = fn(sec, b, ctx || {}); } catch (e) { console.error('[blocks]', b.id, e); sec.append(h('div', 't0b-missing', 'error: ' + esc(b.type))); } }
    return { el: sec, unmount() { if (inst && inst.unmount) inst.unmount(); sec.remove(); } };
  }

  /* ---------- mở khối/thuật ngữ từ ghim (đề xuất 011) ----------
     Chế độ ghim (modes/pin.js, agent D) gọi: T0.blocks.canOpen(pin.kind, pin.ref) -> bool ; T0.blocks.openRef(pin.kind, pin.ref, ctx)
       link   ref = id bài (biologiya5 "l1")  -> hộp "Fikrlash mashqlari": các khối think/explore/widget của bài
       skills ref = id khối (tabiiy5 "l11.skills") -> hộp chứa khối đó (danh sách tự đánh giá có ô tick)
       term   ref = id thuật ngữ ("term.gul") -> thẻ thuật ngữ (tên, định nghĩa, nghe)
     Cũng dùng được: findBlock(id), openBlocks(blocks, {title}), openLink(lessonId), openTerm(id). */
  const THINK = ['think', 'explore', 'widget'];
  function findBlock(id) {
    for (const l of (T0.book && T0.book.lessons) || []) for (const b of l.blocks || []) if (b.id === id) return { block: b, lesson: l };
    return null;
  }
  function openBlocks(blocks, opts = {}) {
    const box = h('div', 't0b-modalbody');
    const insts = [];
    const m = T0.ui.modal(box, { title: opts.title || '', wide: true, onClose: () => { insts.forEach(i => i.unmount && i.unmount()); T0.media && T0.media.stop(); } });
    blocks.forEach(b => insts.push(render(box, b, opts.ctx || {})));
    return m;
  }
  function openLink(lessonId, ctx) {
    const l = byId(T0.book && T0.book.lessons, lessonId); if (!l) return null;
    let bl = (l.blocks || []).filter(b => THINK.includes(b.rubric));
    if (!bl.length) {
      if (ctx && ctx.go && T0.availableModes && T0.availableModes().includes('lesson')) { ctx.go('lesson', { target: { lesson: lessonId } }); return null; }
      bl = l.blocks || [];
    }
    return openBlocks(bl, { title: t(UI.think_set) + (l.title ? ' · ' + plain(l.title) : ''), ctx });
  }
  function openTerm(id) {
    const g = byId(T0.book && T0.book.glossary, id); if (!g) return null;
    const box = h('div', 't0b-term');
    const base = (T0.book.profile && T0.book.profile.lang_base) || 'uz';
    box.innerHTML = `<p class="t0b-term-w">${tx(g.term)}${L() !== base && g.term && g.term[base] && g.term[base] !== t(g.term) ? `<span class="t0b-orig" lang="${base}">${md(g.term[base])}</span>` : ''}</p>` +
      (g.definition ? `<p class="t0b-term-d">${tx(g.definition)}</p>` : '') +
      (g.page ? `<p class="t0b-term-p">${esc(t(UI.page))} ${esc(g.page)}</p>` : '');
    const say = [plain(g.term), plain(g.definition)].filter(Boolean).join('. ');
    const b = h('button', 't0-btn k-hit', `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" fill="currentColor"/></svg><span>${esc(t(UI.listen))}</span>`);
    b.type = 'button';
    b.onclick = () => { T0.media && T0.media.stop(); T0.media && T0.media.speak(say); };
    box.append(b);
    return T0.ui.modal(box, { title: t(UI.term), onClose: () => T0.media && T0.media.stop() });
  }
  function canOpen(kind, ref) {
    if (!T0.book || !ref) return false;
    if (kind === 'link') return !!byId(T0.book.lessons, ref);
    if (kind === 'skills') return !!findBlock(ref) || !!byId(T0.book.lessons, String(ref).split('.')[0]);
    if (kind === 'term') return !!byId(T0.book.glossary, ref);
    return false;
  }
  function openRef(kind, ref, ctx) {
    if (kind === 'link') return openLink(ref, ctx);
    if (kind === 'term') return openTerm(ref);
    if (kind === 'skills') {
      const f = findBlock(ref);
      if (f) { const r = rubric(f.block.rubric); return openBlocks([f.block], { title: (r && t(r.label)) || plain(f.block.title) || plain(f.lesson.title), ctx }); }
      const l = byId(T0.book.lessons, String(ref).split('.')[0]);
      const bl = l && (l.blocks || []).filter(b => b.rubric === 'skills');
      return bl && bl.length ? openBlocks(bl, { title: plain(l.title), ctx }) : null;
    }
    return null;
  }

  T0.blocks = { render, rubric, types: Object.keys(R), findBlock, openBlocks, openLink, openTerm, openVideo, canOpen, openRef,
    u: { esc, md, tx, t, plain, asset, h, cropStyle, pageImg, listenBtn, byId } };

  /* ---------- CSS (dùng biến tokens.css) ---------- */
  const css = `
.t0b{background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-md);padding:var(--space-4);margin:0 0 var(--space-4);box-shadow:var(--shadow-1);transition:box-shadow var(--dur-base)}
.t0b.t0b-speaking{box-shadow:0 0 0 3px var(--color-accent-soft),var(--shadow-1);border-color:var(--color-accent)}
.t0b-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);margin-bottom:var(--space-2)}
.t0b-rub{font-family:var(--font-display);font-weight:800;color:var(--color-accent-ink);font-size:var(--text-ui);text-transform:none}
.t0b-title{font-family:var(--font-display);font-size:var(--text-h3);line-height:1.25;margin:0 0 var(--space-2);color:var(--color-ink)}
.t0b-body p,.t0b-prose p{margin:0 0 var(--space-2);line-height:var(--lh-body);font-size:var(--text-body)}
.t0b-orig{display:block;color:var(--color-ink-2);font-size:var(--text-sm);margin-top:2px}
.t0b-listen{display:inline-flex;align-items:center;gap:6px;min-height:var(--touch-min);padding:0 var(--space-3);border-radius:var(--radius-pill);border:1px solid var(--color-line);background:var(--color-surface-2);color:var(--color-accent-ink);font:inherit;font-size:var(--text-sm);font-weight:700;cursor:pointer;flex:none}
.t0b-listen[aria-pressed=true]{background:var(--color-accent);color:var(--color-on-accent);border-color:var(--color-accent)}
.t0b-list{margin:0;padding-left:1.3em}.t0b-list li{margin:0 0 6px;line-height:var(--lh-body)}
.t0b-list[data-x]{}
.t0b[data-concept=objectives]{background:var(--color-accent-soft);border-color:transparent}
.t0b-checks{display:grid;gap:var(--space-2)}
.t0b-check{display:flex;gap:var(--space-3);align-items:flex-start;min-height:var(--touch-min);padding:var(--space-2);border-radius:var(--radius-sm);background:var(--color-surface-2);cursor:pointer;line-height:var(--lh-body)}
.t0b-check input{width:24px;height:24px;flex:none;margin:2px 0 0;accent-color:var(--color-accent)}
.t0b-think,.t0b-companion{display:flex;gap:var(--space-3);align-items:flex-start}
.t0b-ic{width:48px;height:48px;flex:none;color:var(--color-accent)}
.t0b-companion .t0b-ic{color:var(--hue-purple)}
.t0b-bubble{flex:1;min-width:0}
.t0b-think{background:var(--color-highlight-soft);border-color:transparent}
.t0b-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-3);margin:var(--space-3) 0}
.t0b-gallery figure,.t0b-figure{margin:0}
.t0b-gallery img,.t0b-figure img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:var(--radius-sm);display:block;background:var(--color-surface-2)}
.t0b-figure img{aspect-ratio:auto}
.t0b-gallery figcaption,.t0b-figure figcaption{font-size:var(--text-sm);color:var(--color-ink-2);margin-top:4px;line-height:1.35}
.t0b-crop{width:100%;background-repeat:no-repeat;border-radius:var(--radius-sm)}
.t0b-noimg,.t0b-missing,.t0-unsupported{padding:var(--space-3);border:1px dashed var(--color-line);border-radius:var(--radius-sm);color:var(--color-ink-2);font-size:var(--text-sm)}
.t0b-note{margin:var(--space-2) 0 0;padding:var(--space-2) var(--space-3);border-left:4px solid var(--hue-orange);background:var(--hue-orange-soft);border-radius:var(--radius-xs);color:var(--color-ink)}
.t0b-vcard{display:flex;align-items:center;gap:var(--space-3);width:100%;text-align:left;padding:var(--space-3);border-radius:var(--radius-md);border:0;background:var(--color-video-bg);color:#fff;font:inherit;cursor:pointer;min-height:72px}
.t0b-vplay{width:52px;height:52px;border-radius:50%;background:var(--color-accent);display:grid;place-items:center;flex:none;color:var(--color-on-accent)}
.t0b-vtxt{display:flex;flex-direction:column;gap:2px;min-width:0}.t0b-vtxt small{opacity:.75}
.t0b-video>.t0b-head .t0b-rub{color:var(--hue-red)}
.t0b-poem{font-family:var(--font-reading);font-size:var(--text-reading);line-height:var(--lh-reading)}
.t0b-stanza{margin:0 0 var(--space-3)}.t0b-stanza span{display:block}
.t0b-prose{font-family:var(--font-reading)}
.t0b-by{color:var(--color-ink-2);font-style:italic;margin:-4px 0 var(--space-2)}
.t0b-tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.t0b-table{border-collapse:collapse;width:100%;font-size:var(--text-sm)}
.t0b-table th,.t0b-table td{border:1px solid var(--color-line);padding:6px 8px;text-align:left;vertical-align:top}
.t0b-table thead th{background:var(--color-surface-2)}
.t0b-need{background:var(--color-accent-soft);border-radius:var(--radius-sm);padding:var(--space-3);margin:var(--space-2) 0}.t0b-need p{margin:4px 0 0}
.t0b-olist{margin:0 0 var(--space-2);padding-left:1.5em}.t0b-olist li{margin:0 0 6px;line-height:var(--lh-body)}
.t0b-vnote{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;width:100%;min-height:var(--touch-min);margin-top:var(--space-2);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);border:1px solid var(--color-line);background:var(--color-surface-2);color:var(--pin-video);font:inherit;font-weight:700;text-align:left;cursor:pointer}
.t0b-vnote small{flex:1 1 100%;font-weight:400;color:var(--color-ink-2);font-size:var(--text-sm)}
.t0b-vnote[disabled]{opacity:.5;cursor:default}
.t0b-term-w{font-family:var(--font-display);font-size:var(--text-h3);font-weight:800;margin:0 0 var(--space-2)}
.t0b-term-d{margin:0 0 var(--space-3);line-height:var(--lh-body)}
.t0b-term-p{margin:0 0 var(--space-3);color:var(--color-ink-2);font-size:var(--text-sm)}
.t0b-steps ol{margin:6px 0 0;padding-left:1.4em}.t0b-steps li{margin-bottom:6px;line-height:var(--lh-body)}
.t0b-wblink{display:flex;align-items:center;gap:var(--space-3);width:100%;min-height:var(--touch-min);padding:var(--space-3);border-radius:var(--radius-md);border:2px dashed var(--pin-workbook);background:transparent;color:var(--color-ink);font:inherit;font-weight:700;text-align:left;cursor:pointer}
.t0b-wblink>span:nth-child(2){flex:1}
.t0b-wblink svg{color:var(--pin-workbook);flex:none}
.t0b-ex{margin-top:var(--space-3)}
.t0b-simhost{margin-top:var(--space-2)}
`;
  if (!document.getElementById('t0b-css')) { const s = document.createElement('style'); s.id = 't0b-css'; s.textContent = css; document.head.append(s); }
})();
