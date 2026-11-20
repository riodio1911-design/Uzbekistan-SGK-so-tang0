/* T0 core – đầu đọc dùng chung tầng 0 (R1). JS thuần ES2020, không framework.
 *
 * HỢP ĐỒNG (tóm tắt – chi tiết xem HUONG-DAN.md bước ③):
 *  T0.load(book, features)            nạp một cuốn; phát 't0:load'
 *  T0.book, T0.features, T0.lang, T0.setLang(l) (phát 't0:lang' {lang})
 *  T0.t(obj[, lang])                  chuỗi đa ngữ theo lang, dự phòng uz, rồi giá trị đầu tiên
 *  T0.s(key)                          chuỗi giao diện của core (uz/ru/vi)
 *  T0.registerMode(name, {label, available(book,features)->bool, mount(el,ctx)->{unmount()}})
 *  T0.availableModes() -> [name]; T0.setMode(name, opts) (gắn vào T0.root); phát 't0:mode'
 *  T0.registerEx(id, {render(el, item, ctx)->{check()->{ok,score,feedback}, reset(), showSolution?()}})
 *      `item` = CẢ đối tượng bài tập (book.exercises[i]); nếu có item.items[] thì renderer vẽ từng ý.
 *      Renderer KHÔNG vẽ exercise.prompt/no – renderEx vẽ phần đầu, nút Kiểm tra/Làm lại, phản hồi.
 *      check(): ok = true/false, hoặc null nếu không chấm (tự luận); score 0..1; feedback chuỗi tùy chọn;
 *      empty: true = chưa trả lời gì -> core chỉ hiện feedback, không lưu kết quả.
 *  T0.renderEx(el, exercise|id, ctx?) -> controller | null; dạng chưa có renderer: khung "chưa hỗ trợ: ex.xxx".
 *      Ý có kind khác kind của bài (item.kind) được tách và vẽ bằng renderer của kind đó.
 *  T0.registerSim(id, {mount(el, params, ctx)->{unmount()}}), T0.renderSim(el, sim|{kind,params}|id, ctx?)
 *  T0.media.play(clipId, {onSentence?(i,text), onEnd?, text?, rate?, lang?}) -> Promise (xong khi đọc hết)
 *      rate: áp cho cả file audio lẫn giọng trình duyệt (mặc định T0.media.rate). Không có file/clip theo lang:
 *      đọc opts.text, hoặc chữ trỏ bởi clip.text_path, bằng speechSynthesis + nhãn 'giọng trình duyệt'.
 *  ctx truyền vào renderEx/renderSim/mount có thể ghi đè book/lang; ctx.ai_context -> {{context}} của gia sư.
 *  T0.media.speak(text, {lang?, rate?, onSentence?}) -> Promise   (đọc chữ tùy ý bằng giọng trình duyệt)
 *  T0.media.stop(), T0.media.setRate(r), T0.media.rate, T0.media.has(clipId)
 *  T0.store.get(key, def), .set(key, val), .remove(key)  – localStorage, tiền tố 't0:<book_id>:'
 *  T0.ui.modal(contentEl, {title, onClose, wide}) -> {el, body, close()}; T0.ui.toast(msg, ms)
 *  T0.ui.el(tag, attrs, ...children)  tiện ích tạo DOM
 *  T0.tutor.open({role, context})     điền mẫu gia-su/prompts.json (window.T0_PROMPTS) bằng T0.book.profile
 *  T0.asset(path) -> URL tương đối 'mau/<book_id>/<path>' (đổi gốc bằng T0.assetBase)
 *  T0.find(kind, id) – tra exercises/figures/videos/simulations/lessons/pages/glossary
 *  T0.on(evt, fn) / T0.emit(evt, detail) – sự kiện trên document, tên 't0:*'
 *  --- v0.10 (agent D, đợt 1) ---
 *  T0.answers.get/getItem/set/setAll/clear/resolve(ex, field)/part/withPart – bản đồ đáp án 'ex:<id>:v' dùng chung
 *      modal bài tập ↔ ô trên trang vở (008); phát 't0:answer' {id, key, value, src}.
 *  T0.printPage.render(page, {lang, groupClass, groupAttrs, background}) -> {el, groups, fit()} – vẽ trang dựng lại
 *      chữ thật (010); T0.printPage.langs(page), .layoutLang() (= profile.edition.layout_from || lang_base).
 *  T0.sentenceAt(target) -> {s, block, lesson, exercise?, item?} theo reading.anchors[].target; T0.playSentence(s, opts).
 *  't0:exresult' {id, kind, ok, score, t, v (T0.answers), items? [{id, v, ok, score}]}.
 *  body.t0-modal-open khi có modal; phần tử có [data-t0-under-modal] tự ẩn dưới modal.
 *  --- v0.11 (agent L, đối đẳng) ---
 *  Ngôn ngữ: T0.lang (đọc) + T0.lang2 (phụ, chế độ song ngữ 'vi+ru') + T0.dual (kèm dòng gốc lang_base). Mặc định khi chưa
 *      chọn: T0.defaultLang(book, features) theo features.axes.7.reader_langs. T0.setLang('vi'|'vi+ru'), T0.setLang2(l),
 *      T0.setDual(bool); 't0:lang' {lang, lang2, dual}. T0.shownLangs(), T0.tl(obj) -> [{lang,text,main}],
 *      T0.ui.bi(obj, {tag, lineTag, cls}) -> phần tử song ngữ, T0.tUI(obj) -> 'uz · vi' (nhãn kép), T0.s() dùng tUI, T0.s1() một tiếng.
 *      T0.baseLang(), T0.bookLangs(), T0.readerLangs().
 *  Media: T0.media.play(clip, {anyLang:true, onLang(l, isFile)}) chọn ngôn ngữ như say() bản cũ (T0.media.pickLang);
 *      T0.media.clipDur(clip, lang), T0.media.estimate(text), T0.media.hasVoice(lang).
 */
(function () {
  'use strict';
  const T0 = (window.T0 = window.T0 || {});
  T0.version = '0.11.0';
  T0.LANGS = ['uz', 'ru', 'vi'];
  T0.book = null;
  T0.features = null;
  T0.root = null;
  T0.assetBase = 'mau/{book}/';
  const modes = (T0._modes = T0._modes || {});
  const modeOrder = (T0._modeOrder = T0._modeOrder || []);
  const exReg = (T0._ex = T0._ex || {});
  const simReg = (T0._sim = T0._sim || {});

  /* ---------------- sự kiện ---------------- */
  T0.on = (evt, fn) => { document.addEventListener(evt, fn); return () => document.removeEventListener(evt, fn); };
  T0.emit = (evt, detail) => document.dispatchEvent(new CustomEvent(evt, { detail }));

  /* ---------------- lưu trữ ---------------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) { /* bỏ qua */ } }
  const mem = {};
  function prefix() { return 't0:' + ((T0.book && T0.book.book_id) || '_') + ':'; }
  T0.store = {
    prefix,
    get(key, def) {
      const k = prefix() + key;
      const raw = lsGet(k);
      const v = raw != null ? raw : mem[k];
      if (v == null) return def;
      try { return JSON.parse(v); } catch (e) { return v; }
    },
    set(key, val) {
      const k = prefix() + key;
      const s = JSON.stringify(val);
      mem[k] = s;
      lsSet(k, s);
      return val;
    },
    remove(key) { const k = prefix() + key; delete mem[k]; lsDel(k); },
  };
  // khóa toàn cục (không thuộc cuốn nào): ngôn ngữ, chủ đề
  const gGet = (k, d) => { const v = lsGet('t0:_:' + k); return v == null ? d : v; };
  const gSet = (k, v) => lsSet('t0:_:' + k, v);

  /* ---------------- ngôn ngữ ---------------- */
  /* v0.11 (L, đối đẳng): ngôn ngữ đọc = T0.lang; ngôn ngữ phụ T0.lang2 (chế độ song ngữ, vd. 'vi+ru');
   * T0.dual = hiện kèm dòng gốc lang_base (uz) bên cạnh bản dịch (bong bóng, phụ đề, nhãn hình, nhãn nút) như bản cũ.
   * Mặc định khi người dùng chưa chọn (không ?lang=, chưa lưu): theo features.axes.7.reader_langs (ưu tiên ngôn ngữ trình
   * duyệt nếu nằm trong reader_langs), không có thì lang_base – đặt trong T0.load. */
  const parseLangs = (s) => String(s || '').split(/[+\s,|]+/).filter((x) => T0.LANGS.includes(x));
  const qL = parseLangs(new URLSearchParams(location.search).get('lang'));
  const sL = parseLangs(gGet('lang', ''));
  T0._langExplicit = !!(qL.length || sL.length);
  T0.lang = qL[0] || sL[0] || 'uz';
  T0.lang2 = (function () {
    const l2 = qL.length ? (qL[1] || '') : (parseLangs(gGet('lang2', ''))[0] || '');
    return l2 && l2 !== T0.lang ? l2 : '';
  })();
  T0.dual = gGet('dual', '1') !== '0';
  T0.t = function (obj, lang) {
    if (obj == null) return '';
    if (typeof obj === 'string' || typeof obj === 'number') return String(obj);
    const l = lang || T0.lang;
    if (obj[l]) return obj[l];
    if (obj.uz) return obj.uz;
    for (const k of ['ru', 'vi', 'kaa']) if (obj[k]) return obj[k];
    return '';
  };
  T0.hasLang = (obj, lang) => !!(obj && typeof obj === 'object' && obj[lang || T0.lang]);
  // setLang('vi') | setLang('vi+ru') (ngôn ngữ phụ) ; setLang(l, {keep2:true}) giữ ngôn ngữ phụ đang có
  T0.setLang = function (l, opts = {}) {
    const ls = parseLangs(l);
    if (!ls.length) return;
    T0.lang = ls[0];
    let l2 = ls.length > 1 ? ls[1] : opts.keep2 ? T0.lang2 : '';
    if (l2 === T0.lang) l2 = '';
    T0.lang2 = l2;
    T0._langExplicit = true;
    gSet('lang', T0.lang); gSet('lang2', l2);
    document.documentElement.lang = T0.lang;
    T0.media.stop();
    T0.emit('t0:lang', { lang: T0.lang, lang2: l2, dual: T0.dual });
  };
  T0.setLang2 = (l2) => T0.setLang(T0.lang + (l2 ? '+' + l2 : ''));
  T0.setDual = function (on) {
    T0.dual = !!on; gSet('dual', on ? '1' : '0');
    T0.emit('t0:lang', { lang: T0.lang, lang2: T0.lang2, dual: T0.dual });
  };
  T0.baseLang = () => ((T0.book && T0.book.profile) || {}).lang_base || 'uz';
  T0.bookLangs = function () {
    const p = (T0.book && T0.book.profile) || {};
    const ls = (p.langs || []).filter((x) => T0.LANGS.includes(x));
    return ls.length ? ls : T0.LANGS.slice();
  };
  T0.readerLangs = function (features) {
    const f = features || T0.features || {};
    const a7 = (f.axes && f.axes['7']) || {};
    return (a7.reader_langs || []).filter((x) => T0.LANGS.includes(x));
  };
  // ngôn ngữ mặc định cho người dùng chưa chọn
  T0.defaultLang = function (book, features) {
    const p = (book && book.profile) || {};
    const rl = T0.readerLangs(features);
    const nav = [].concat(navigator.languages || [], navigator.language || []).map((x) => String(x).slice(0, 2).toLowerCase());
    const hit = nav.find((x) => rl.includes(x));
    return hit || rl[0] || p.lang_base || 'uz';
  };
  // ngôn ngữ cần hiện cho một chuỗi song ngữ, theo thứ tự: gốc (khi dual), ngôn ngữ đọc, ngôn ngữ phụ
  T0.shownLangs = function () {
    const base = T0.baseLang();
    const out = [];
    if (T0.dual && base !== T0.lang) out.push(base);
    out.push(T0.lang);
    if (T0.lang2 && !out.includes(T0.lang2)) out.push(T0.lang2);
    return out;
  };
  // [{lang, text, main}] – các dòng cần hiện (bỏ dòng thiếu/trùng); chuỗi thường -> 1 dòng
  T0.tl = function (obj) {
    if (obj == null) return [];
    if (typeof obj === 'string' || typeof obj === 'number') return [{ lang: null, text: String(obj), main: true }];
    const seen = new Set(); const out = [];
    T0.shownLangs().forEach((l) => { const s = obj[l]; if (typeof s === 'string' && s.trim() && !seen.has(s.trim())) { seen.add(s.trim()); out.push({ lang: l, text: s, main: l === T0.lang }); } });
    if (!out.some((x) => x.main)) { const s = T0.t(obj); if (s && !seen.has(s.trim())) out.splice(out.length && out[0].lang === T0.baseLang() ? 1 : 0, 0, { lang: T0.lang, text: s, main: true }); }
    return out;
  };
  // nhãn giao diện kép như bản cũ: 'uz · vi' (· ru khi song ngữ); dual tắt hoặc lang = gốc -> một ngôn ngữ
  T0.tUI = function (obj) {
    if (obj == null || typeof obj !== 'object') return obj == null ? '' : String(obj);
    const ls = T0.shownLangs();
    if (ls.length < 2) return T0.t(obj);
    const parts = []; ls.forEach((l) => { const s = obj[l] || (l === T0.lang ? T0.t(obj) : ''); if (s && !parts.includes(s)) parts.push(s); });
    return parts.join(' · ') || T0.t(obj);
  };

  const STR = {
    check: { uz: 'Tekshirish', ru: 'Проверить', vi: 'Kiểm tra' },
    reset: { uz: 'Qaytadan', ru: 'Заново', vi: 'Làm lại' },
    save: { uz: 'Saqlash', ru: 'Сохранить', vi: 'Lưu' },
    solution: { uz: 'Yechimni ko‘rish', ru: 'Показать решение', vi: 'Xem lời giải' },
    hint: { uz: 'Maslahat', ru: 'Подсказка', vi: 'Gợi ý' },
    correct: { uz: 'To‘g‘ri!', ru: 'Верно!', vi: 'Đúng rồi!' },
    wrong: { uz: 'Yana urinib ko‘ring', ru: 'Попробуй ещё раз', vi: 'Thử lại nhé' },
    saved: { uz: 'Saqlandi', ru: 'Сохранено', vi: 'Đã lưu' },
    close: { uz: 'Yopish', ru: 'Закрыть', vi: 'Đóng' },
    unsupported: { uz: 'Hali qo‘llab-quvvatlanmaydi', ru: 'Пока не поддерживается', vi: 'Chưa hỗ trợ' },
    browser_voice: { uz: 'brauzer ovozi', ru: 'голос браузера', vi: 'giọng trình duyệt' },
    no_voice: { uz: 'Ovoz topilmadi', ru: 'Голос не найден', vi: 'Không có giọng đọc' },
    exercise: { uz: 'Topshiriq', ru: 'Задание', vi: 'Bài tập' },
    tutor_preview: { uz: 'So‘rov (oldindan ko‘rish)', ru: 'Запрос (предпросмотр)', vi: 'Xem trước lời nhắc' },
    tutor_no_ai: { uz: 'Sun’iy intellekt bu ko‘rinishda ishlamaydi – quyida yuboriladigan so‘rov.', ru: 'ИИ в этом просмотре недоступен – ниже запрос, который будет отправлен.', vi: 'AI chưa chạy ở chế độ xem này – dưới đây là lời nhắc sẽ được gửi.' },
    tutor_thinking: { uz: 'O‘ylayapman…', ru: 'Думаю…', vi: 'Đang nghĩ…' },
    tutor_ask: { uz: 'Savolingiz…', ru: 'Ваш вопрос…', vi: 'Câu hỏi của em…' },
    send: { uz: 'Yuborish', ru: 'Отправить', vi: 'Gửi' },
    not_found: { uz: 'Topilmadi', ru: 'Не найдено', vi: 'Không tìm thấy' },
    score: { uz: 'Natija', ru: 'Результат', vi: 'Kết quả' },
  };
  T0.addStrings = (o) => Object.assign(STR, o);
  T0.s = (key) => (STR[key] ? T0.tUI(STR[key]) : key);
  T0.s1 = (key) => T0.t(STR[key]) || key; // một ngôn ngữ (cho chỗ chật)

  /* ---------------- DOM tiện ích ---------------- */
  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') { for (const [sk, sv] of Object.entries(v)) { if (sk.startsWith('--')) e.style.setProperty(sk, sv); else e.style[sk] = sv; } }
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
    return e;
  }

  /* ---------------- CSS của core (dùng biến tokens.css) ---------------- */
  const CSS = `
.t0-btn{min-height:var(--touch-min,44px);min-width:var(--touch-min,44px);padding:0 var(--space-4,16px);border-radius:var(--radius-pill,999px);border:1px solid var(--color-line);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.t0-btn:hover{background:var(--color-surface-2)}
.t0-btn:focus-visible,.t0-focus:focus-visible{outline:3px solid var(--color-accent);outline-offset:2px}
.t0-btn.primary{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent)}
.t0-btn.ghost{border-color:transparent;background:transparent}
.t0-btn[disabled]{opacity:.5;cursor:default}
.t0-btn[hidden],[hidden].t0-btn{display:none!important}
.t0-modal-open [data-t0-under-modal]{display:none!important}
.t0-modal-scrim{position:fixed;inset:0;background:var(--color-scrim);z-index:var(--z-modal,1000);display:flex;align-items:flex-end;justify-content:center}
@media (min-width:700px){.t0-modal-scrim{align-items:center;padding:var(--space-5,24px)}}
.t0-modal{background:var(--color-surface);color:var(--color-ink);width:100%;max-width:640px;max-height:92vh;display:flex;flex-direction:column;border-radius:var(--radius-lg,16px) var(--radius-lg,16px) 0 0;box-shadow:var(--shadow-modal)}
@media (min-width:700px){.t0-modal{border-radius:var(--radius-lg,16px)}}
.t0-modal.wide{max-width:960px}
.t0-modal-h{display:flex;align-items:center;gap:var(--space-2,8px);padding:var(--space-2,8px) var(--space-2,8px) var(--space-2,8px) var(--space-4,16px);border-bottom:1px solid var(--color-line)}
.t0-modal-h h2{flex:1;margin:0;font-size:var(--text-h3,18px);font-family:var(--font-display);line-height:1.3}
.t0-modal-b{padding:var(--space-4,16px);overflow:auto;-webkit-overflow-scrolling:touch}
.t0-toast{position:fixed;left:50%;bottom:calc(var(--space-5,24px) + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--color-inverse-bg);color:var(--color-inverse-ink);padding:var(--space-3,12px) var(--space-4,16px);border-radius:var(--radius-pill,999px);z-index:var(--z-top,2000);font-size:var(--text-ui,15px);max-width:calc(100vw - 32px);box-shadow:var(--shadow-2)}
.t0-badge-voice{position:fixed;right:var(--space-3,12px);bottom:calc(var(--space-3,12px) + env(safe-area-inset-bottom,0px));z-index:var(--z-popover,1500);background:var(--color-surface);color:var(--color-ink-2);border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);padding:6px 12px;font-size:var(--text-sm,13px);box-shadow:var(--shadow-1);display:none;align-items:center;gap:8px}
.t0-badge-voice.on{display:inline-flex}
.t0-ex{display:flex;flex-direction:column;gap:var(--space-3,12px)}
.t0-ex-head{display:flex;gap:var(--space-2,8px);align-items:flex-start}
.t0-ex-no{flex:none;min-width:28px;height:28px;border-radius:var(--radius-round,50%);background:var(--color-accent-soft);color:var(--color-accent-ink);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-sm,13px)}
.t0-ex-prompt{margin:0;font-size:var(--text-body,16px);line-height:var(--lh-body,1.5);font-weight:600}
.t0-ex-sub{font-size:var(--text-sm,13px);color:var(--color-ink-2);margin-top:2px;font-weight:400}
.t0-ex-foot{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);align-items:center}
.t0-ex-fb{min-height:1.4em;font-size:var(--text-ui,15px);border-radius:var(--radius-md,10px);padding:0}
.t0-ex-fb.ok{color:var(--color-ok);background:var(--color-ok-soft);padding:var(--space-2,8px) var(--space-3,12px)}
.t0-ex-fb.bad{color:var(--color-bad);background:var(--color-bad-soft);padding:var(--space-2,8px) var(--space-3,12px)}
.t0-ex-fb.info{background:var(--color-surface-2);padding:var(--space-2,8px) var(--space-3,12px)}
.t0-unsupported{border:2px dashed var(--color-line);border-radius:var(--radius-md,10px);padding:var(--space-4,16px);color:var(--color-ink-2);font-size:var(--text-ui,15px)}
.t0-missing{display:flex;align-items:center;justify-content:center;text-align:center;border:1px dashed var(--color-line);border-radius:var(--radius-md,10px);padding:var(--space-2,8px);color:var(--color-ink-2);font-size:var(--text-sm,13px)}
.t0-unsupported code{font-family:var(--font-mono);color:var(--color-ink)}
.t0-solution{background:var(--color-highlight-soft);border-radius:var(--radius-md,10px);padding:var(--space-2,8px) var(--space-3,12px);font-size:var(--text-ui,15px);line-height:var(--lh-body,1.5)}
.t0-tutor pre{white-space:pre-wrap;word-break:break-word;font-family:var(--font-mono);font-size:var(--text-sm,13px);background:var(--color-surface-2);border-radius:var(--radius-md,10px);padding:var(--space-3,12px);max-height:45vh;overflow:auto;margin:0}
.t0-tutor .t0-tutor-ans{white-space:pre-wrap;line-height:var(--lh-body,1.5);margin:var(--space-3,12px) 0}
.t0-tutor-note{font-size:var(--text-sm,13px);color:var(--color-ink-2);margin:0 0 var(--space-2,8px)}
.t0-tutor-row{display:flex;gap:var(--space-2,8px);margin-top:var(--space-3,12px)}
.t0-pp{position:relative;container-type:inline-size;width:100%;background:var(--color-page-paper)}
.t0-pp svg{display:block;width:100%;height:100%}
.t0-pp text{font-family:var(--font-page,var(--font-body))}
.t0-pp rect{fill:transparent}
.t0-pp-ov{position:absolute;inset:0;pointer-events:none}
.t0-pp-b{position:absolute;overflow:hidden;font-family:var(--font-page,var(--font-body));text-align:justify;hyphens:auto;-webkit-hyphens:auto;pointer-events:auto;margin:0}
.t0-pp-b.one{white-space:nowrap;text-align:left}
.t0-bi{display:flex;flex-direction:column;gap:2px}
.t0-bi-sub{font-size:.88em;color:var(--color-ink-2);font-weight:400}
.t0-bi-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.04em;border:1px solid currentColor;border-radius:4px;padding:0 3px;margin-right:6px;vertical-align:2px;opacity:.75}
.t0-tutor-row input{flex:1;min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);padding:0 var(--space-3,12px);font:inherit;background:var(--color-surface);color:var(--color-ink);min-width:0}
`;
  function injectCss() {
    if (document.getElementById('t0-core-css')) return;
    document.head.append(el('style', { id: 't0-core-css', text: CSS }));
  }

  /* ---------------- UI ---------------- */
  let modalStack = [];
  T0.ui = {
    el,
    modal(content, opts = {}) {
      injectCss();
      const prevFocus = document.activeElement;
      const titleId = 't0m' + Math.random().toString(36).slice(2, 8);
      const closeBtn = el('button', { class: 't0-btn ghost', 'aria-label': T0.s('close'), title: T0.s('close'), html: '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' });
      const body = el('div', { class: 't0-modal-b' });
      if (content) body.append(content);
      const box = el('div', { class: 't0-modal' + (opts.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId },
        el('div', { class: 't0-modal-h' }, el('h2', { id: titleId, text: opts.title || '' }), closeBtn), body);
      const scrim = el('div', { class: 't0-modal-scrim' }, box);
      let closed = false;
      const api = {
        el: box, body, scrim,
        setTitle(t) { box.querySelector('h2').textContent = t; },
        close() {
          if (closed) return; closed = true;
          scrim.remove(); modalStack = modalStack.filter((m) => m !== api);
          document.removeEventListener('keydown', onKey, true);
          if (!modalStack.length) { document.body.style.overflow = ''; document.body.classList.remove('t0-modal-open'); }
          try { opts.onClose && opts.onClose(); } catch (e) { console.error(e); }
          T0.emit('t0:modalclose', {});
          if (prevFocus && prevFocus.focus) prevFocus.focus();
        },
      };
      function onKey(e) {
        if (modalStack[modalStack.length - 1] !== api) return;
        if (e.key === 'Escape') { e.stopPropagation(); api.close(); }
        else if (e.key === 'Tab') {
          const f = [...box.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      closeBtn.onclick = () => api.close();
      scrim.addEventListener('click', (e) => { if (e.target === scrim) api.close(); });
      document.addEventListener('keydown', onKey, true);
      document.body.append(scrim);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('t0-modal-open');
      modalStack.push(api);
      setTimeout(() => closeBtn.focus(), 0);
      return api;
    },
    closeAll() { [...modalStack].reverse().forEach((m) => m.close()); },
    toast(msg, ms = 2400) {
      injectCss();
      const t = el('div', { class: 't0-toast', role: 'status', 'aria-live': 'polite', text: msg });
      document.body.append(t);
      setTimeout(() => t.remove(), ms);
      return t;
    },
    button(label, onclick, cls) { return el('button', { class: 't0-btn ' + (cls || ''), type: 'button', onclick }, label); },
    /* chữ song ngữ: dòng gốc (lang_base) + dòng ngôn ngữ đọc + dòng ngôn ngữ phụ, mỗi dòng có lang=; dòng không phải
     * ngôn ngữ đọc mang lớp .t0-bi-sub (nhỏ, nhạt). opts: {tag:'div', lineTag:'span'|'div', cls, tags:true (nhãn VI/RU khi song ngữ)} */
    bi(obj, opts = {}) {
      injectCss();
      const lines = T0.tl(obj);
      const box = el(opts.tag || 'div', { class: 't0-bi' + (opts.cls ? ' ' + opts.cls : '') });
      const many = lines.filter((x) => x.lang !== T0.baseLang() || x.main).length > 1;
      lines.forEach((x, i) => {
        const ln = el(opts.lineTag || 'div', { class: 't0-bi-l' + (i ? ' t0-bi-sub' : '') + (x.main ? ' t0-bi-main' : ''), lang: x.lang || null });
        if (many && opts.tags !== false && x.lang && x.lang !== T0.baseLang()) ln.append(el('span', { class: 't0-bi-tag', text: x.lang.toUpperCase() }));
        ln.append(document.createTextNode(x.text));
        box.append(ln);
      });
      return box;
    },
  };

  /* ---------------- tra dữ liệu ---------------- */
  const COLL = { exercise: 'exercises', figure: 'figures', video: 'videos', simulation: 'simulations', lesson: 'lessons', unit: 'units', glossary: 'glossary', workbook: 'workbook_sets' };
  T0.find = function (kind, id) {
    const b = T0.book; if (!b) return null;
    if (kind === 'page') return (b.pages || []).find((p) => p.n === id) || null;
    if (kind === 'clip') return (b.media && b.media.clips && b.media.clips[id]) || null;
    const arr = b[COLL[kind] || kind];
    return Array.isArray(arr) ? arr.find((x) => x.id === id) || null : null;
  };
  // JSON pointer (/videos/0/scenes/0/narration/vi)
  T0.pointer = function (ptr) {
    if (!ptr || !T0.book) return undefined;
    let cur = T0.book;
    for (const seg of ptr.split('/').slice(1)) {
      if (cur == null) return undefined;
      cur = cur[seg.replace(/~1/g, '/').replace(/~0/g, '~')];
    }
    return cur;
  };
  // đường dẫn ảnh trang n theo bản in; trang không có trong dữ liệu thì suy theo mẫu tên của trang cùng tập
  T0.pageImage = function (n, edition, volume) {
    const b = T0.book; if (!b) return null;
    const ed = edition || (b.profile || {}).lang_base || 'uz';
    const pg = (b.pages || []).find((p) => p.n === n && (!volume || p.volume === volume));
    if (pg && pg.images) return pg.images[ed] || pg.images[(b.profile || {}).lang_base] || Object.values(pg.images)[0];
    const ref = (b.pages || []).find((p) => p.images && p.images[ed] && (!volume || p.volume === volume));
    if (!ref) return null;
    return ref.images[ed].replace(/(\d+)(\.\w+)$/, (m, d, ext) => String(n).padStart(d.length, '0') + ext);
  };
  // phần cắt của ảnh trang: box [x,y,w,h] % trang
  T0.ui_pageCrop = function (n, box, opts = {}) {
    const src = opts.src || T0.pageImage(n, opts.edition, opts.volume);
    const [x, y, w, h] = box || [0, 0, 100, 100];
    const wrap = el('div', { class: 't0-crop', style: { position: 'relative', overflow: 'hidden', width: '100%', aspectRatio: String((w / h) * 0.707), background: 'var(--color-page-paper)', borderRadius: 'var(--radius-sm,6px)' } });
    const img = el('img', { alt: opts.alt || '', src: src ? T0.asset(src) : '', draggable: 'false', style: { position: 'absolute', maxWidth: 'none', width: (10000 / w) + '%', height: (10000 / h) + '%', left: (-x / w * 100) + '%', top: (-y / h * 100) + '%' } });
    img.onload = () => { if (img.naturalWidth) wrap.style.aspectRatio = String((w * img.naturalWidth) / (h * img.naturalHeight)); };
    img.onerror = () => { wrap.classList.add('t0-crop-missing'); wrap.append(el('div', { class: 't0-missing', style: { position: 'absolute', inset: '0' }, text: (src || '') + ' – ' + T0.s('not_found') })); };
    wrap.append(img);
    return wrap;
  };
  T0.ui.pageCrop = T0.ui_pageCrop;
  // D2: '@<nguồn>/đường-dẫn' = file ở book.asset_sources.<nguồn> (vd. ảnh trang bản Nga ở artifact đồng hành).
  // url có thì ghép url + đường dẫn; chưa có (bản xem trước) thì dùng fallback_base ('' = cùng chỗ với cuốn).
  T0.asset = (path) => {
    path = String(path == null ? '' : path);
    if (/^(https?:|data:|blob:|\/)/.test(path)) return path;
    const base = T0.assetBase.replace('{book}', (T0.book && T0.book.book_id) || '');
    const m = /^@([a-z0-9_]+)\/(.*)$/.exec(path);
    if (!m) return base + path;
    const src = ((T0.book && T0.book.asset_sources) || {})[m[1]] || {};
    if (src.url) return String(src.url).replace(/\/?$/, '/') + m[2];
    return (src.fallback_base != null && /^(https?:|\/)/.test(src.fallback_base) ? src.fallback_base : base + (src.fallback_base || '')) + m[2];
  };

  /* ---------------- câu theo đường dẫn (reading.anchors[].target) ---------------- */
  // 'u1.1.8/paras/0' | '<poem>/stanzas/i/j' | '<id>/title' | '<khối exercise>/items/k' (-> exercise.items[k].prompt)
  T0.sentenceAt = function (target) {
    const b = T0.book; if (!b || !target) return null;
    const i = target.indexOf('/');
    const bid = i < 0 ? target : target.slice(0, i);
    const segs = i < 0 ? [] : target.slice(i + 1).split('/');
    let block = null, lesson = null;
    for (const l of b.lessons || []) { const x = (l.blocks || []).find((y) => y.id === bid); if (x) { block = x; lesson = l; break; } }
    let cur = block;
    if (block && block.type === 'exercise' && segs[0] === 'items') {
      const ex = T0.find('exercise', (block.exercise_refs || [])[0]) || T0.find('exercise', bid);
      const it = ex && (ex.items || [])[+segs[1]];
      return it ? { s: it.prompt || it, block, lesson, exercise: ex, item: it } : null;
    }
    if (!block) { const ex = T0.find('exercise', bid); if (ex) cur = ex; else return null; }
    for (const s of segs) { if (cur == null) return null; cur = Array.isArray(cur) ? cur[+s] : cur[s]; }
    if (!cur || typeof cur !== 'object') return null;
    return { s: cur.prompt && !T0.LANGS.some((l) => typeof cur[l] === 'string') ? cur.prompt : cur, block, lesson };
  };
  // phát một câu: file theo audio_ref nếu có, không thì giọng trình duyệt đọc chữ (kể cả câu no_read khi người học tự bấm)
  T0.playSentence = function (s, opts = {}) {
    if (!s) return Promise.resolve(false);
    return T0.media.play(s.audio_ref || null, Object.assign({ text: s }, opts));
  };

  /* ---------------- trang dựng lại chữ thật (010) – dùng chung cho pin.js và reading.js ----------------
   * T0.printPage.render(page, opts) -> {el, groups, fit()}
   *   page.text_lines [x,y,w,size,style,text,anchor_idx,anchor_id?] theo hệ tọa độ book.print_text (width×height),
   *   page.background (ảnh nền đã xóa chữ, hoặc ảnh trắng giữ chỗ).
   *   opts.lang: ngôn ngữ muốn hiện. Bằng ngôn ngữ dàn trang (profile.edition.layout_from || lang_base) -> vẽ đúng từng dòng
   *     bằng SVG; khác -> chữ của print_text.paragraphs[anchor_idx].text[lang] đổ lại vào đúng hộp của đoạn (cắt theo
   *     split_paragraphs = chỉ số từ của lang_base), cỡ chữ tự co cho vừa.
   *   opts.groupClass(key, info) / opts.groupAttrs(key, info) -> class / chuỗi thuộc tính thêm cho nhóm dòng (để bấm).
   *   Khóa nhóm: reading.anchors[].target nếu dòng có anchor; không thì 'para:<anchor_idx>'.
   *   opts.background === false: không vẽ ảnh nền.
   */
  const escX = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let anchorCache = null;
  function anchorMaps() {
    const b = T0.book;
    if (anchorCache && anchorCache.book === b) return anchorCache;
    const byId = {}, byIdx = {};
    ((b.reading && b.reading.anchors) || []).forEach((a) => { byId[a.id] = a; const m = /(\d+)$/.exec(a.id || ''); if (m) byIdx[m[1]] = a; });
    anchorCache = { book: b, byId, byIdx };
    return anchorCache;
  }
  T0.printPage = {
    layoutLang() { const p = (T0.book && T0.book.profile) || {}; return (p.edition && p.edition.layout_from) || p.lang_base || 'uz'; },
    has(page) { return !!(page && page.text_lines && page.text_lines.length); },
    // ngôn ngữ có thể hiện trên trang: ngôn ngữ dàn trang + ngôn ngữ có trong print_text.paragraphs
    langs(page) {
      const out = [T0.printPage.layoutLang()];
      const paras = (T0.book.print_text || {}).paragraphs;
      if (Array.isArray(paras) && page && page.text_lines) {
        const idx = page.text_lines.find((l) => l[6] >= 0);
        const pp = idx && paras[idx[6]];
        if (pp && pp.text) T0.LANGS.forEach((l) => { if (pp.text[l] && !out.includes(l)) out.push(l); });
      }
      return out;
    },
    render(page, opts = {}) {
      injectCss();
      const pt = T0.book.print_text || {};
      const W = pt.width || 595, H = pt.height || 842, styles = pt.styles || [];
      const lay = T0.printPage.layoutLang();
      const want = opts.lang || lay;
      const paras = Array.isArray(pt.paragraphs) ? pt.paragraphs : null;
      const am = anchorMaps();
      const groups = new Map(); const plain = []; const seen = new Set();
      (page.text_lines || []).forEach((l) => {
        const k0 = l[0] + ',' + l[1] + ',' + l[5];
        if (seen.has(k0)) return; seen.add(k0); // dòng in trùng (lớp in chồng)
        const an = (l[7] && am.byId[l[7]]) || (l[6] >= 0 && !paras ? am.byIdx[l[6]] : null);
        const key = an ? an.target : l[6] >= 0 ? 'para:' + l[6] : null;
        if (!key) { plain.push(l); return; }
        if (!groups.has(key)) groups.set(key, { key, lines: [], anchor: an || null, para: l[6] >= 0 ? l[6] : null });
        groups.get(key).lines.push(l);
      });
      const st = (l) => { const s = styles[l[4]] || []; const four = s.length >= 4; return { bold: four ? s[1] : s[0], ital: four ? s[2] : s[1], col: s[s.length - 1] || '#231f20' }; };
      const tx = (l) => { const s = st(l); return '<text x="' + l[0] + '" y="' + l[1] + '" font-size="' + l[3] + '" textLength="' + l[2] + '" lengthAdjust="spacingAndGlyphs" fill="' + escX(s.col) + '"' + (s.bold ? ' font-weight="700"' : '') + (s.ital ? ' font-style="italic"' : '') + '>' + escX(l[5]) + '</text>'; };
      const reflow = want !== lay && !!paras;
      const boxes = []; let html = '';
      let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + escX(opts.label || '') + '">';
      if (page.background && opts.background !== false) svg += '<image href="' + escX(T0.asset(page.background)) + '" x="0" y="0" width="' + W + '" height="' + H + '" preserveAspectRatio="none"/>';
      let gsvg = '';
      groups.forEach((g) => {
        const cls = (opts.groupClass && opts.groupClass(g.key, g)) || 't0-pp-g';
        const attrs = (opts.groupAttrs && opts.groupAttrs(g.key, g)) || '';
        const pp = reflow && g.para != null ? paras[g.para] : null;
        const txt0 = pp && pp.text && pp.text[want];
        if (!txt0) {
          const rects = g.lines.map((l) => '<rect x="' + (l[0] - 2) + '" y="' + (l[1] - l[3] * 0.95) + '" width="' + (l[2] + 4) + '" height="' + (l[3] * 1.3) + '" rx="2"/>').join('');
          gsvg += '<g class="' + escX(cls) + '" data-k="' + escX(g.key) + '"' + attrs + '>' + rects + g.lines.map(tx).join('') + '</g>';
          return;
        }
        // đổ lại chữ ngôn ngữ khác vào hộp của đoạn (theo drawPage(uzm) của biologiya5 cũ)
        const ls = g.lines;
        const x0 = Math.min(...ls.map((l) => l[0])), x1 = Math.max(...ls.map((l) => l[0] + l[2]));
        const ys = [...new Set(ls.map((l) => Math.round(l[1])))].sort((a, b) => a - b);
        const by = {}; ls.forEach((l) => { const k = l[3] + '|' + l[4]; by[k] = (by[k] || 0) + l[5].length; });
        const top = Object.keys(by).sort((a, b) => by[b] - by[a])[0].split('|'); const sz = +top[0]; const s = st({ 4: +top[1] });
        const y0 = ys[0] - sz * 0.95, y1 = ys[ys.length - 1] + sz * 0.38;
        const lh = ys.length > 1 ? Math.max(1.05, (ys[ys.length - 1] - ys[0]) / (ys.length - 1) / sz) : 1.2;
        const fl = ls.filter((l) => Math.round(l[1]) === ys[0]);
        const ind = ys.length > 1 ? Math.max(0, Math.min(...fl.map((l) => l[0])) - x0) : 0;
        let txt = txt0;
        const fr = page.split_paragraphs && page.split_paragraphs[g.para];
        if (fr) { // chỉ số từ của lang_base -> tỉ lệ cho ngôn ngữ khác
          const base = (T0.book.profile || {}).lang_base || 'uz';
          const nb = String(pp.text[base] || txt0).split(' ').length || 1;
          const w = txt.split(' ');
          const a = want === base ? fr[0] : Math.round(fr[0] / nb * w.length), z = want === base ? fr[1] : Math.round(fr[1] / nb * w.length);
          txt = w.slice(a, z).join(' ');
        }
        boxes.push([x0, y0, x1, y1]);
        const one = ys.length === 1;
        html += '<div class="t0-pp-b ' + escX(cls) + (one ? ' one' : '') + '" data-k="' + escX(g.key) + '"' + attrs + ' lang="' + want + '" style="left:' + (x0 / W * 100).toFixed(2) + '%;top:' + (y0 / H * 100).toFixed(2) + '%;width:' + ((x1 - x0) / W * 100).toFixed(2) + '%;height:' + ((y1 - y0) / H * 100).toFixed(2) + '%;font-size:' + (sz / W * 100).toFixed(3) + 'cqw;line-height:' + lh.toFixed(2) + ';text-indent:' + (ind / W * 100).toFixed(2) + 'cqw;color:' + escX(s.col) + ';' + (s.bold ? 'font-weight:700;' : '') + (s.ital ? 'font-style:italic;' : '') + '">' + escX(txt) + '</div>';
      });
      svg += plain.filter((l) => l[1] < H - 2 && !boxes.some((b) => l[1] > b[1] && l[1] < b[3] + 1 && l[0] > b[0] - 3 && l[0] < b[2] + 3)).map(tx).join('');
      svg += gsvg + '</svg>';
      const wrap = el('div', { class: 't0-pp' + (reflow ? ' reflow' : ''), 'data-lang': want, style: { aspectRatio: W + ' / ' + H } });
      wrap.innerHTML = svg + (html ? '<div class="t0-pp-ov">' + html + '</div>' : '');
      const fit = () => wrap.querySelectorAll('.t0-pp-b:not(.one)').forEach((b) => {
        let f = parseFloat(b.style.fontSize), k = 0;
        while (b.scrollHeight > b.clientHeight + 2 && k++ < 12) { f *= 0.95; b.style.fontSize = f.toFixed(3) + 'cqw'; }
      });
      return { el: wrap, groups, fit, reflow, lang: want };
    },
  };

  /* ---------------- bản đồ đáp án dùng chung (008): modal bài tập <-> ô trên trang vở ----------------
   * T0.store 'ex:<id>:v' = { '<chỉ số ý>': giá trị, '<item_key khác>': giá trị } (định dạng của short_answer/open_response).
   */
  T0.answers = {
    key: (id) => 'ex:' + id + ':v',
    get(id) { const v = T0.store.get(T0.answers.key(id), null); return v && typeof v === 'object' ? Object.assign({}, v) : {}; },
    getItem(id, k) { const v = T0.answers.get(id)[k]; return v == null ? '' : v; },
    set(id, k, value, opts = {}) {
      const m = T0.answers.get(id);
      if (value == null || value === '') delete m[k]; else m[k] = value;
      T0.store.set(T0.answers.key(id), m);
      T0.emit('t0:answer', { id, key: k, value, src: opts.src || null });
      return m;
    },
    setAll(id, map, opts = {}) { T0.store.set(T0.answers.key(id), Object.assign({}, map)); T0.emit('t0:answer', { id, key: null, value: map, src: opts.src || null }); },
    clear(id) { T0.store.remove(T0.answers.key(id)); T0.store.remove('res:' + id); T0.emit('t0:answer', { id, key: null, value: null }); },
    // phần thứ k của giá trị nhiều phần ('p1;p2' hoặc nhiều dòng)
    part(v, k, sep) { const a = String(v == null ? '' : v).split(sep || ';'); return (a[k] || '').trim(); },
    withPart(v, k, val, sep) { sep = sep || ';'; const a = String(v == null ? '' : v).split(sep); while (a.length <= k) a.push(''); a[k] = String(val == null ? '' : val).replace(sep === ';' ? /;/g : /\n/g, ' '); while (a.length && !a[a.length - 1].trim()) a.pop(); return a.join(sep); },
    // item_key của ô trang -> {key, part}: khớp id/nhãn ý -> chỉ số; '<ý>/<k>', 'line:<k>' -> phần k; còn lại giữ nguyên
    resolve(ex, field) {
      const items = (ex && Array.isArray(ex.items)) ? ex.items : [];
      let ik = field.item_key == null ? null : String(field.item_key);
      let part = field.part != null ? +field.part : null;
      const idxOf = (k) => { const i = items.findIndex((it) => it.id === k || (it.label && it.label === k)); return i; };
      if (ik == null) return { key: items.length ? '0' : 'v', part };
      let m = /^line:(\d+)$/.exec(ik);
      if (m) return { key: '0', part: +m[1] };
      if (idxOf(ik) >= 0) return { key: String(idxOf(ik)), part };
      m = /^(.+)\/(\d+)$/.exec(ik);
      if (m && idxOf(m[1]) >= 0) return { key: String(idxOf(m[1])), part: +m[2] };
      m = /^(\d+):([TF])$/.exec(ik);
      if (m) { const i = idxOf(m[1]); return { key: String(i >= 0 ? i : m[1]), part, tf: m[2] }; }
      if (/^\d+$/.test(ik) && items[+ik]) return { key: ik, part };
      return { key: ik, part };
    },
  };

  /* ---------------- nạp cuốn ---------------- */
  function ageAttr(band) { return band ? String(band).replace('-', '_') : ''; }
  T0.load = function (book, features) {
    if (!book || !book.book_id) throw new Error('T0.load: thiếu book.book_id');
    T0.media.stop();
    T0.book = book;
    T0.features = features || { layers: { trang_goc_ghim: true } };
    const p = book.profile || {};
    // L01: người dùng chưa chọn ngôn ngữ -> theo reader_langs của cuốn (không lưu, để cuốn khác tự chọn theo cuốn đó)
    if (!T0._langExplicit) {
      const l = T0.defaultLang(book, T0.features);
      if (l !== T0.lang) { T0.lang = l; document.documentElement.lang = l; }
      if (T0.lang2 === T0.lang) T0.lang2 = '';
    }
    const root = document.documentElement;
    root.dataset.book = book.book_id;
    const ab = p.audience === 'giao_vien' ? 'giao_vien' : ageAttr(p.grade_band);
    if (ab) root.dataset.age = ab; else delete root.dataset.age;
    if (p.accent) root.dataset.accent = p.accent;
    document.title = T0.t(p.title) || book.book_id;
    T0.emit('t0:load', { book, features: T0.features });
    return T0;
  };

  /* ---------------- chế độ ---------------- */
  T0.registerMode = function (name, def) {
    if (!def || typeof def.mount !== 'function') throw new Error('registerMode: thiếu mount');
    modes[name] = def;
    if (!modeOrder.includes(name)) modeOrder.push(name);
    T0.emit('t0:modes', { name });
  };
  const ORDER = ['pin', 'lesson', 'reading'];
  T0.availableModes = function () {
    const list = modeOrder.filter((n) => {
      try { return modes[n].available ? !!modes[n].available(T0.book, T0.features) : true; } catch (e) { console.error(e); return false; }
    });
    return list.sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
  };
  T0.modeLabel = (n) => (modes[n] ? T0.t(modes[n].label) || n : n);
  let current = null;
  T0.currentMode = () => (current ? current.name : null);
  T0.makeCtx = function (extra) {
    const ctx = {
      T0, store: T0.store, ui: T0.ui, media: T0.media, tutor: T0.tutor,
      go: (mode, opts) => T0.setMode(mode, opts),
      openExercise: (id) => T0.openExercise(id),
    };
    const ex = extra || {};
    // book/features/lang là getter (luôn theo trạng thái hiện tại) trừ khi bên gọi truyền giá trị riêng
    for (const k of ['book', 'features', 'lang']) if (!(k in ex)) Object.defineProperty(ctx, k, { get: () => T0[k], enumerable: true });
    return Object.assign(ctx, ex);
  };
  T0.setMode = function (name, opts = {}) {
    const host = opts.el || T0.root;
    if (!host) throw new Error('setMode: chưa có T0.root');
    if (!modes[name]) { console.warn('Không có chế độ', name); return null; }
    if (current && current.inst) { try { current.inst.unmount && current.inst.unmount(); } catch (e) { console.error(e); } }
    T0.media.stop();
    host.innerHTML = '';
    host.dataset.mode = name;
    const ctx = T0.makeCtx({ mode: name, target: opts.target || null, opts });
    let inst = null;
    try { inst = modes[name].mount(host, ctx) || {}; }
    catch (e) { console.error(e); host.append(el('div', { class: 't0-unsupported', text: 'Lỗi chế độ ' + name + ': ' + e.message })); }
    current = { name, inst };
    T0.store.set('mode', name);
    T0.emit('t0:mode', { mode: name, target: opts.target || null });
    return inst;
  };

  /* ---------------- bài tập ---------------- */
  T0.registerEx = function (id, def) {
    if (!/^ex\./.test(id)) console.warn('registerEx: id nên bắt đầu bằng ex.', id);
    exReg[id] = def; T0.emit('t0:exreg', { id });
  };
  T0.hasEx = (id) => !!exReg[id];
  function unsupported(kind) {
    return el('div', { class: 't0-unsupported', 'data-kind': kind }, T0.s('unsupported') + ': ', el('code', { text: kind }));
  }
  function itemGroups(ex) {
    const items = Array.isArray(ex.items) ? ex.items : null;
    if (!items || !items.some((it) => it.kind && it.kind !== ex.kind)) return [ex];
    const groups = []; let cur = null;
    items.forEach((it) => {
      const k = it.kind || ex.kind;
      if (!cur || cur.kind !== k) { cur = Object.assign({}, ex, { kind: k, items: [] }); groups.push(cur); }
      cur.items.push(it);
    });
    return groups;
  }
  // dựng một bài (không phần đầu/chân) – dùng chung cho renderEx và cho R2/R3 nếu muốn tự làm khung
  T0.renderExBody = function (host, ex, ctx) {
    const parts = itemGroups(ex).map((g) => {
      const box = el('div', { class: 't0-ex-part', 'data-kind': g.kind });
      host.append(box);
      const r = exReg[g.kind];
      if (!r) { box.append(unsupported(g.kind)); return { unsupported: true, kind: g.kind }; }
      try { return r.render(box, g, ctx) || {}; }
      catch (e) { console.error(e); box.innerHTML = ''; box.append(unsupported(g.kind + ' (lỗi)')); return { unsupported: true }; }
    });
    const live = parts.filter((p) => !p.unsupported);
    return {
      parts,
      unsupported: !live.length,
      check() {
        const rs = live.map((p) => (p.check ? p.check() : { ok: null }) || { ok: null });
        if (rs.length && rs.every((r) => r.empty)) return { ok: null, score: null, empty: true, feedback: rs[0].feedback };
        const graded = rs.filter((r) => r.ok === true || r.ok === false);
        if (!graded.length) return { ok: null, score: null, feedback: rs.map((r) => r.feedback).filter(Boolean).join(' ') };
        const score = graded.reduce((s, r) => s + (typeof r.score === 'number' ? r.score : r.ok ? 1 : 0), 0) / graded.length;
        return { ok: graded.every((r) => r.ok), score, feedback: rs.map((r) => r.feedback).filter(Boolean).join(' ') };
      },
      reset() { live.forEach((p) => p.reset && p.reset()); },
      showSolution() { live.forEach((p) => p.showSolution && p.showSolution()); },
      hasSolution: live.some((p) => p.showSolution),
      noCheck: live.length > 0 && live.every((p) => p.noCheck),
    };
  };
  T0.renderEx = function (host, exercise, ctxIn) {
    injectCss();
    const ex = typeof exercise === 'string' ? T0.find('exercise', exercise) : exercise;
    if (!ex) { host.append(el('div', { class: 't0-unsupported', text: T0.s('not_found') + ': ' + exercise })); return null; }
    const wrap = el('div', { class: 't0-ex', 'data-ex': ex.id || '', 'data-kind': ex.kind });
    host.append(wrap);
    const ctx = T0.makeCtx(Object.assign({ exercise: ex, storeKey: 'ex:' + (ex.id || ex.kind) }, ctxIn || {}));
    const reg0 = exReg[ex.kind];
    const owns = !!(reg0 && (typeof reg0.ownsPrompt === 'function' ? reg0.ownsPrompt(ex) : reg0.ownsPrompt)); // renderer tự vẽ lời dẫn (C, 003)
    if (!(ctxIn && ctxIn.bare) && (ex.prompt || ex.title || ex.no) && !(owns && !ex.no)) {
      const pr = owns ? el('span', { class: 't0-ex-prompt' }) : el('p', { class: 't0-ex-prompt' }, T0.t(ex.prompt) || T0.t(ex.title));
      if (!owns && ex.prompt && T0.dual && T0.lang !== (T0.book.profile || {}).lang_base && T0.hasLang(ex.prompt) && ex.prompt.uz && T0.lang !== 'uz') {
        pr.append(el('div', { class: 't0-ex-sub', text: ex.prompt[(T0.book.profile || {}).lang_base || 'uz'] || '' }));
      }
      wrap.append(el('div', { class: 't0-ex-head' }, ex.no ? el('span', { class: 't0-ex-no', text: ex.no }) : null, pr));
    }
    const body = el('div', { class: 't0-ex-body' });
    wrap.append(body);
    const c = T0.renderExBody(body, ex, ctx);
    if (c.unsupported) return Object.assign(c, { el: wrap });
    if (ctxIn && ctxIn.noFooter) return Object.assign(c, { el: wrap });
    const fb = el('div', { class: 't0-ex-fb', role: 'status', 'aria-live': 'polite' });
    const foot = el('div', { class: 't0-ex-foot' });
    let wrong = 0;
    const solBtn = el('button', { class: 't0-btn', type: 'button', hidden: true }, T0.s('solution'));
    solBtn.onclick = () => { c.showSolution(); solBtn.hidden = true; };
    const chk = el('button', { class: 't0-btn primary', type: 'button' }, c.noCheck ? T0.s('save') : T0.s('check'));
    chk.onclick = () => {
      const r = c.check() || {};
      if (r.empty) { fb.className = 't0-ex-fb info'; fb.textContent = r.feedback || ''; return; } // chưa làm: không lưu, không tính
      fb.className = 't0-ex-fb ' + (r.ok === true ? 'ok' : r.ok === false ? 'bad' : 'info');
      fb.textContent = r.feedback || (r.ok === true ? T0.s('correct') : r.ok === false ? T0.s('wrong') : T0.s('saved'));
      if (r.ok === false) { wrong++; if (wrong >= 2 && c.hasSolution) solBtn.hidden = false; }
      const rec = { ok: r.ok, score: r.score, t: Date.now() };
      if (ex.id) T0.store.set('res:' + ex.id, rec);
      // G (009): kèm bản đồ đáp án và đúng/sai từng ý nếu renderer trả r.items = [{id, v, ok, score}]
      T0.emit('t0:exresult', Object.assign({ id: ex.id, kind: ex.kind, v: ex.id ? T0.answers.get(ex.id) : null, items: Array.isArray(r.items) ? r.items : undefined }, rec));
      if (ctxIn && ctxIn.onResult) ctxIn.onResult(r);
    };
    const rst = el('button', { class: 't0-btn', type: 'button' }, T0.s('reset'));
    rst.onclick = () => { c.reset(); fb.className = 't0-ex-fb'; fb.textContent = ''; wrong = 0; solBtn.hidden = true; };
    foot.append(chk, rst, solBtn);
    const role = ex.ai_feedback && ex.ai_feedback.role;
    if (role) {
      const hb = el('button', { class: 't0-btn ghost', type: 'button' }, '💡 ' + T0.s('hint'));
      hb.onclick = () => T0.tutor.open({ role: T0.tutor.roleId(role), context: T0.tutor.exerciseContext(ex, wrap, ctx) });
      foot.append(hb);
    }
    wrap.append(foot, fb);
    return Object.assign(c, { el: wrap, feedbackEl: fb });
  };
  T0.openExercise = function (id, opts = {}) {
    const ex = typeof id === 'string' ? T0.find('exercise', id) : id;
    const box = el('div');
    const m = T0.ui.modal(box, { title: ex ? (T0.s('exercise') + (ex.no ? ' ' + ex.no : '')) : T0.s('not_found'), wide: opts.wide });
    const c = T0.renderEx(box, ex || String(id), opts.ctx);
    return { modal: m, controller: c };
  };

  /* ---------------- mô phỏng ---------------- */
  T0.registerSim = function (id, def) { simReg[id] = def; T0.emit('t0:simreg', { id }); };
  T0.hasSim = (id) => !!simReg[id];
  T0.renderSim = function (host, sim, ctxIn) {
    injectCss();
    const s = typeof sim === 'string' ? T0.find('simulation', sim) : sim;
    if (!s) { host.append(el('div', { class: 't0-unsupported', text: T0.s('not_found') + ': ' + sim })); return { unmount() {} }; }
    const r = simReg[s.kind];
    if (!r) { const u = unsupported(s.kind); host.append(u); return { unsupported: true, unmount() { u.remove(); } }; }
    try { return r.mount(host, s.params || {}, T0.makeCtx(Object.assign({ sim: s }, ctxIn || {}))) || { unmount() {} }; }
    catch (e) { console.error(e); const u = unsupported(s.kind + ' (lỗi)'); host.append(u); return { unsupported: true, unmount() { u.remove(); } }; }
  };

  /* ---------------- media ---------------- */
  const audio = typeof Audio !== 'undefined' ? new Audio() : null;
  if (audio) audio.preload = 'auto';
  const badFiles = new Set();
  let playToken = 0, stopTimer = null, badge = null;
  function showBadge(on) {
    injectCss();
    if (!badge) {
      badge = el('div', { class: 't0-badge-voice', role: 'status' });
      document.body.append(badge);
    }
    badge.innerHTML = '';
    badge.append(el('span', { 'aria-hidden': 'true', text: '🔈' }), el('span', { text: T0.s('browser_voice') }));
    badge.classList.toggle('on', !!on);
  }
  function splitSentences(text) {
    const s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return [];
    const parts = s.match(/[^.!?…]+(?:[.!?…]+["»”)]*)?\s*/g) || [s];
    return parts.map((x) => x.trim()).filter(Boolean);
  }
  function clipText(clipId, lang, opts) {
    if (opts && opts.text) return T0.t(opts.text, lang);
    const c = T0.find('clip', clipId);
    if (!c) return '';
    const any = c[lang] || c.uz || Object.values(c)[0];
    if (!any || !any.text_path) return '';
    let ptr = any.text_path;
    const m = ptr.match(/\/(uz|ru|vi|kaa)$/);
    if (m) ptr = ptr.slice(0, -m[0].length);
    const v = T0.pointer(ptr);
    return flattenText(v, lang);
  }
  function flattenText(v, lang) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map((x) => flattenText(x, lang)).filter(Boolean).join(' ');
    if (typeof v === 'object') {
      if (T0.LANGS.some((l) => typeof v[l] === 'string')) return T0.t(v, lang);
      const keys = ['title', 'text', 'narration', 'items', 'paras', 'lines', 'body'];
      return keys.filter((k) => k in v).map((k) => flattenText(v[k], lang)).filter(Boolean).join(' ');
    }
    return '';
  }
  const LOCALE = { uz: 'uz-UZ', ru: 'ru-RU', vi: 'vi-VN', kaa: 'uz-UZ' };
  function pickVoice(lang) {
    if (!window.speechSynthesis) return null;
    const vs = speechSynthesis.getVoices() || [];
    return vs.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang)) ||
      (lang === 'uz' || lang === 'kaa' ? vs.find((v) => /^tr/i.test(v.lang)) : null) || null;
  }
  function speak(text, opts = {}) {
    const token = opts._token || ++playToken;
    const lang = opts.lang || T0.lang;
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth || !text) { if (!synth && text) T0.ui.toast(T0.s('no_voice')); resolve(false); return; }
      const sents = splitSentences(T0.math && T0.math.plain ? T0.math.plain(text) : text); // B (012): {2/3} -> 2/3
      let i = 0;
      showBadge(true);
      T0.media.engine = 'tts';
      const next = () => {
        if (token !== playToken) { resolve(false); return; }
        if (i >= sents.length) { showBadge(false); T0.media.engine = null; opts.onEnd && opts.onEnd(); resolve(true); return; }
        const u = new SpeechSynthesisUtterance(sents[i]);
        u.lang = LOCALE[lang] || lang;
        const v = pickVoice(lang); if (v) u.voice = v;
        u.rate = opts.rate || T0.media.rate;
        const idx = i;
        u.onstart = () => { opts.onSentence && opts.onSentence(idx, sents[idx]); };
        u.onend = () => { i++; next(); };
        u.onerror = () => { i++; next(); };
        synth.speak(u);
      };
      try { synth.cancel(); } catch (e) { /* */ }
      next();
    });
  }
  T0.media = {
    rate: parseFloat(gGet('rate', '1')) || 1,
    engine: null,
    splitSentences,
    setRate(r) { this.rate = Math.max(0.5, Math.min(2, +r || 1)); gSet('rate', String(this.rate)); if (audio) audio.playbackRate = this.rate; T0.emit('t0:rate', { rate: this.rate }); },
    has(clipId, lang) { const c = T0.find('clip', clipId); const x = c && c[lang || T0.lang]; return !!(x && !badFiles.has(x.file)); },
    clipText: (id, lang) => clipText(id, lang || T0.lang),
    speak(text, opts = {}) { T0.media.stop(); return speak(T0.t(text, opts.lang), opts); },
    // có giọng trình duyệt đúng ngôn ngữ (không tính giọng Thổ thay cho uz)
    hasVoice(lang) { try { return !!(window.speechSynthesis && (speechSynthesis.getVoices() || []).some((v) => v.lang && v.lang.toLowerCase().startsWith(lang))); } catch (e) { return false; } },
    /* L05/V10 – như say() bản cũ: đi qua các ngôn ngữ đang hiện (đọc, phụ, gốc): có file thu sẵn -> phát file đó; có giọng
     * trình duyệt đúng tiếng -> đọc tiếng đó; hết lượt mà chưa có -> file của bất kỳ ngôn ngữ nào (vd. uz chỉ có MP3 vi) */
    pickLang(clipId, opts = {}) {
      const c = T0.find('clip', clipId) || {};
      const okFile = (l) => !!(c[l] && c[l].file && !badFiles.has(c[l].file));
      const shown = [opts.lang || T0.lang].concat(T0.lang2 || [], T0.baseLang());
      for (const l of shown) { if (okFile(l)) return { lang: l, file: true }; if (T0.media.hasVoice(l)) return { lang: l, file: false }; }
      const any = T0.readerLangs().concat(Object.keys(c)).find(okFile);
      return any ? { lang: any, file: true } : { lang: opts.lang || T0.lang, file: false };
    },
    clipDur(clipId, lang) { const c = T0.find('clip', clipId); const x = c && c[lang || T0.lang]; return x && x.dur ? x.dur : null; },
    // ước lượng thời lượng đọc (ms) khi không có file – như bản cũ: ≥ 6,5 s, ~85 ms/ký tự
    estimate(text) { return Math.max(6500, String(text || '').length * 85); },
    play(clipId, opts = {}) {
      T0.media.stop();
      const token = ++playToken;
      if (opts.anyLang) { const pk = T0.media.pickLang(clipId, opts); opts = Object.assign({}, opts, { lang: pk.lang }); if (opts.onLang) opts.onLang(pk.lang, pk.file); }
      const lang = opts.lang || T0.lang;
      const c = T0.find('clip', clipId);
      const x = c && c[lang];
      T0.emit('t0:play', { clipId, lang });
      const fallback = () => {
        if (token !== playToken) return Promise.resolve(false);
        const text = clipText(clipId, lang, opts);
        if (!text) { T0.ui.toast(T0.s('no_voice')); return Promise.resolve(false); }
        return speak(text, Object.assign({}, opts, { lang, _token: token }));
      };
      if (!x || !audio || badFiles.has(x.file)) return fallback().finally(() => token === playToken && T0.emit('t0:playend', { clipId }));
      return new Promise((resolve) => {
        const src = T0.asset(x.file);
        let done = false;
        const finish = (ok) => { if (done) return; done = true; clearTimeout(stopTimer); audio.removeEventListener('error', onErr); audio.removeEventListener('timeupdate', onTime); if (token === playToken) { T0.media.engine = null; opts.onEnd && opts.onEnd(); T0.emit('t0:playend', { clipId }); } resolve(ok); };
        const onErr = () => { if (done) return; done = true; badFiles.add(x.file); audio.removeEventListener('timeupdate', onTime); fallback().then(resolve); };
        const end = (x.start || 0) + (x.dur || 0);
        const onTime = () => { if (x.dur && audio.currentTime >= end - 0.05) { audio.pause(); finish(true); } };
        audio.addEventListener('error', onErr, { once: true });
        audio.addEventListener('timeupdate', onTime);
        audio.onended = () => finish(true);
        const abs = new URL(src, location.href).href;
        if (audio.src !== abs) audio.src = src;
        audio.playbackRate = opts.rate || T0.media.rate;
        const start = () => {
          try { audio.currentTime = x.start || 0; } catch (e) { /* */ }
          T0.media.engine = 'file';
          opts.onSentence && opts.onSentence(0, clipText(clipId, lang, opts));
          const p = audio.play();
          if (p && p.catch) p.catch((e) => { if (e && e.name === 'NotAllowedError') finish(false); else onErr(); });
          if (x.dur) stopTimer = setTimeout(() => { if (!done) { audio.pause(); finish(true); } }, (x.dur / (opts.rate || T0.media.rate)) * 1000 + 1500);
        };
        if (audio.readyState >= 1 && audio.src === abs) start();
        else audio.addEventListener('loadedmetadata', start, { once: true });
        audio.load && audio.readyState < 1 && audio.load();
      });
    },
    stop() {
      playToken++;
      clearTimeout(stopTimer);
      if (audio) { try { audio.pause(); } catch (e) { /* */ } }
      if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) { /* */ } }
      if (badge) badge.classList.remove('on');
      T0.media.engine = null;
    },
  };
  if (window.speechSynthesis && speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', () => {});

  /* ---------------- gia sư ---------------- */
  function renderTpl(tpl, params, depth = 0) {
    let s = tpl, prev = null;
    const truthy = (v) => !!v && v !== '0' && v !== 'false';
    while (prev !== s) {
      prev = s;
      s = s.replace(/\{\{\s*([#^])\s*(\w+)\s*\}\}([\s\S]*?)\{\{\s*\/\s*\2\s*\}\}/g, (m, op, nm, body) => ((op === '#') === truthy(params[nm]) ? body : ''));
    }
    s = s.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, k) => (params[k] != null ? String(params[k]) : m));
    if (s.includes('{{') && depth < 3) return renderTpl(s, params, depth + 1);
    return s.replace(/\n{3,}/g, '\n\n').replace(/\n\s*\n(?=Lessons in the book)/g, '\n').trim();
  }
  function gradeBand(g) { g = +g; return g <= 2 ? '0-2' : g <= 4 ? '3-4' : g <= 7 ? '5-7' : g <= 9 ? '8-9' : '10-11'; }
  const PIN_EN = { exercise: 'exercise', figure: 'figure explorer with numbered parts', video: 'video', quiz: 'quiz', activity: 'activity', simulation: 'interactive model', demo: 'demo', audio: 'audio (listen)', term: 'term', workbook: 'workbook', skills: 'skills', question: 'question', story: 'story', text_anchor: 'text to listen', link: 'link' };
  function usageGuide() {
    const kinds = new Set();
    (T0.book.pages || []).forEach((p) => (p.pins || []).forEach((pin) => kinds.add(pin.kind)));
    if (!kinds.size) return '';
    return 'the original pages are shown; tapping a text shows its translation; pins on pages: ' + [...kinds].map((k) => PIN_EN[k] || k).join(', ') + '.';
  }
  T0.tutor = {
    missing: [],
    render: renderTpl,
    params(runtime = {}) {
      const P = window.T0_PROMPTS; const b = T0.book; const pr = b.profile || {};
      const missing = [];
      const lang = T0.lang;
      const personaId = (pr.tutor && pr.tutor.persona) || pr.tutor_persona || 'robo';
      const persona = (P.personas || []).find((x) => x.id === personaId) || P.personas[0];
      const audience = pr.audience || 'hoc_sinh';
      const aud = P.audiences[audience] || P.audiences.hoc_sinh;
      const band = pr.grade_band || gradeBand(pr.grade);
      const ar = (audience === 'giao_vien' && P.age_rules.find((a) => a.audience === 'giao_vien')) || P.age_rules.find((a) => a.grade_band === band) || {};
      const sid = pr.subject_id || (missing.push('subject_id'), String(pr.subject || '').trim().replace(/\s+/g, '_'));
      const country = pr.country || (missing.push('country'), '(country: not set in profile)');
      const layers = (T0.features && T0.features.layers) || {};
      const L = P.languages;
      const tutorP = pr.tutor || {};
      const lessons = (b.lessons || []).map((l) => `${l.id}: ${l.no || l.sec || ''} ${T0.t(l.title, pr.lang_base)}${lang !== pr.lang_base ? ' / ' + T0.t(l.title, lang) : ''}`).join('\n');
      T0.tutor.missing = missing;
      const p = {
        title: T0.t(pr.title, pr.lang_base), subject: pr.subject, subject_id: sid,
        subject_scope: tutorP.subject_scope || P.params.subject_scope.default,
        grade: String(pr.grade), age: pr.age, grade_band: band, audience, country,
        lang_base: pr.lang_base, lang,
        base_lang_name: (L[pr.lang_base] || {}).name, reply_lang: (L[lang] || {}).prompt_name, ui_lang_name: (L[lang] || {}).name,
        bilingual: lang !== pr.lang_base ? 'yes' : '',
        persona: persona.id, persona_name: persona.name.uz, persona_name_ui: T0.t(persona.name),
        persona_origin: tutorP.persona_origin || persona.origin,
        user_noun: aud.user_noun, audience_line: aud.audience_line, assistant_kind: aud.assistant_kind, safety_rules: aud.safety_rules,
        style: ar.style, max_words: ar.max_words, hint_sentences: ar.hint_sentences, feedback_sentences: ar.feedback_sentences, grade_feedback_sentences: ar.grade_feedback_sentences,
        subject_rules: (P.subject_rules || []).filter((r) => (r.applies_to || []).includes(sid)).map((r) => r.text).join('\n'),
        reading_layer: layers.doc_van ? 'yes' : '', reading_rules: P.layer_rules && P.layer_rules.reading ? P.layer_rules.reading.text : '',
        software_list: tutorP.software_list || '', tools: tutorP.tools === false ? '' : 'yes',
        now: new Date().toString(),
        lesson_id_example: (b.lessons && b.lessons[0] && b.lessons[0].id) || 'l1',
        book_usage_guide: usageGuide(), lesson_list: lessons,
        current_chapter: '', context: '',
        exercise: '', correct_answer: '', pupil_answer: '(nothing yet)', question: '', question_ui: '',
        question_kind: (P.params.question_kind || {}).default || '', good_answer: (P.params.good_answer || {}).default || '',
      };
      for (const [k, v] of Object.entries(runtime || {})) if (v != null) p[k] = v;
      return p;
    },
    build(role, context) {
      const P = window.T0_PROMPTS;
      if (!P) throw new Error('Chưa nạp gia-su/prompts.json (window.T0_PROMPTS)');
      const r = P.roles.find((x) => x.id === T0.tutor.roleId(role)) || P.roles.find((x) => x.id === 'chat');
      const params = T0.tutor.params(context || {});
      return { role: r, params, text: r.template ? renderTpl(r.template, params) : '' };
    },
    // ai_feedback.role của schema (hint|feedback|score) -> id vai trò trong gia-su/prompts.json
    ROLE_MAP: { hint: 'hint', feedback: 'open_feedback', score: 'open_grade', grade: 'open_grade', chat: 'chat' },
    roleId(r) { return T0.tutor.ROLE_MAP[r] || r; },
    exerciseContext(ex, wrapEl, ctx) {
      const items = ex.items || [];
      const ans = items.map((it) => it.answer || (it.options && it.correct != null ? T0.t(it.options[it.correct], 'uz') : '')).filter(Boolean).join('; ');
      const pupil = wrapEl ? [...wrapEl.querySelectorAll('input[type=text],textarea')].map((i) => i.value).filter(Boolean).join('; ') : '';
      const lb = (T0.book.profile || {}).lang_base || 'uz';
      return { exercise: T0.t(ex.prompt, lb) + (items.length ? ' ' + items.map((it) => (it.label ? it.label + ': ' : '') + T0.t(it.prompt, lb)).join(' ').trim() : ''), correct_answer: ans, pupil_answer: pupil || '(nothing yet)', question: T0.t(ex.prompt, lb), question_ui: T0.lang !== lb ? T0.t(ex.prompt) : '', context: ctx && ctx.ai_context ? 'Text before the question:\n' + String(ctx.ai_context).slice(-7000) : undefined };
    },
    async sample() {
      try { if (window.claude && typeof window.claude.use === 'function') return await window.claude.use('sample'); } catch (e) { /* */ }
      return null;
    },
    open({ role = 'chat', context = {} } = {}) {
      injectCss();
      let built;
      const box = el('div', { class: 't0-tutor' });
      try { built = T0.tutor.build(role, context); }
      catch (e) { box.append(el('p', { text: e.message })); return T0.ui.modal(box, { title: 'Tutor' }); }
      const r = built.role;
      const title = T0.t(r.name) + ' · ' + built.params.persona_name_ui;
      const m = T0.ui.modal(box, { title });
      const ans = el('div', { class: 't0-tutor-ans', 'aria-live': 'polite' });
      const note = el('p', { class: 't0-tutor-note', text: T0.s('tutor_thinking') });
      const det = el('details', null, el('summary', { class: 't0-btn ghost', text: T0.s('tutor_preview') }), el('pre', { text: built.text || JSON.stringify(r.behavior || {}, null, 1) }));
      box.append(note, ans, det);
      if (T0.tutor.missing.length) box.append(el('p', { class: 't0-tutor-note', text: 'profile thiếu: ' + T0.tutor.missing.join(', ') }));
      const history = [];
      const showPreview = () => { note.textContent = T0.s('tutor_no_ai'); det.open = true; };
      if (!r.ai) { showPreview(); return m; }
      // window.claude.use resolve muộn hoặc null sau 10 s – không chặn hiển thị
      const timeout = new Promise((res) => setTimeout(() => res(null), 4000));
      Promise.race([T0.tutor.sample(), timeout]).then(async (sample) => {
        if (!sample) { showPreview(); return; }
        const call = r.call || {};
        const opts = { modelTier: r.model_tier || undefined, cache: call.cache === false ? false : undefined, onText: ({ text }) => { ans.textContent = text; } };
        const ask = async (input) => {
          note.textContent = T0.s('tutor_thinking');
          try {
            const out = call.output === 'json' && sample.json ? await sample.json(input, opts) : await sample(input, opts);
            const text = typeof out === 'string' ? out : out && out.text != null ? out.text : JSON.stringify(out);
            ans.textContent = text; note.textContent = '';
            return text;
          } catch (e) {
            const codes = (window.T0_PROMPTS.ui_strings || {}).error_codes || {};
            note.textContent = T0.t((window.T0_PROMPTS.ui_strings || {})[codes[e && e.code]] || (window.T0_PROMPTS.ui_strings || {}).fail) || String(e && e.message);
            return null;
          }
        };
        if (call.shape === 'messages') {
          const ack = T0.t(call.assistant_ack);
          history.push({ role: 'user', content: built.text }, { role: 'assistant', content: ack });
          note.textContent = '';
          ans.textContent = T0.t((T0.find && ((window.T0_PROMPTS.personas || []).find((p) => p.id === built.params.persona) || {}).greeting)) || '';
          const inp = el('input', { type: 'text', placeholder: T0.s('tutor_ask'), 'aria-label': T0.s('tutor_ask') });
          const send = el('button', { class: 't0-btn primary', type: 'button' }, T0.s('send'));
          const go = async () => {
            const q = inp.value.trim(); if (!q) return; inp.value = '';
            history.push({ role: 'user', content: q });
            const keep = call.turns_kept || 10;
            const msgs = history.slice(0, 2).concat(history.slice(2).slice(-keep * 2 + 1));
            const t = await ask(msgs);
            if (t) history.push({ role: 'assistant', content: t });
          };
          send.onclick = go; inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
          box.insertBefore(el('div', { class: 't0-tutor-row' }, inp, send), det);
        } else {
          await ask(built.text);
        }
      });
      return m;
    },
  };

  /* ---------------- tiện ích chấm (dùng chung cho renderer) ---------------- */
  // D2 (18/11/2026): mặc định accept_v2 – MỌI dấu nháy (' ` ʻ ’ ʼ ‘) đổi về ‘ (o' → o‘, g` → g‘), không bỏ.
  // accept_v2_math (tùy chọn qua exercise.grading.rule) = accept_v2 + bước toán của nrm_v1. 'nrm_v1' = bí danh cũ của accept_v2_math.
  const APOS = /[‘’ʻʼ'`]/g;
  function norm(s) { // accept_v2
    return String(s == null ? '' : s).toLowerCase().replace(APOS, '‘').replace(/\s+/g, ' ').trim();
  }
  function normMath(s) { // accept_v2_math
    return norm(s).replace(/,/g, '.').replace(/[*xх·]/g, '×').replace(/[−–—]/g, '-')
      .replace(/\s*([;:<>=×÷+\-/])\s*/g, '$1').replace(/\s+/g, ' ').trim();
  }
  const RULE_ALIAS = { nrm_v1: 'accept_v2_math', nrm_v1_parts: 'accept_v2' };
  function oneEq(v, a, rule) {
    const math = rule === 'accept_v2_math';
    const x = math ? normMath(v) : norm(v), y = math ? normMath(a) : norm(a);
    if (!x) return false;
    if (x === y) return true;
    if (math && /^[\d ]+$/.test(x) && /^[\d ]+$/.test(y) && x.replace(/ /g, '') === y.replace(/ /g, '')) return true;
    const nx = x.replace(',', '.'), ny = y.replace(',', '.');
    if (/^-?\d+(\.\d+)?$/.test(nx) && /^-?\d+(\.\d+)?$/.test(ny)) return Math.abs(parseFloat(nx) - parseFloat(ny)) < 1e-6;
    return false;
  }
  T0.grade = {
    norm, normMath,
    nrm: normMath, // tương thích: tên cũ, nay không bỏ dấu nháy
    DEFAULT_RULE: 'accept_v2',
    rule(r) { r = RULE_ALIAS[r] || r; return r === 'accept_v2_math' ? r : 'accept_v2'; },
    // answer: 'a|b' phương án (hoặc mảng); 'p1;p2' nhiều phần. rule: accept_v2 (mặc định) | accept_v2_math | nrm_v1 (bí danh)
    shortAnswer(value, answer, rule) {
      if (answer == null || answer === '' || (Array.isArray(answer) && !answer.length)) return null;
      const r = T0.grade.rule(rule);
      const alts = Array.isArray(answer) ? answer.map(String) : String(answer).split('|');
      return alts.some((alt) => {
        if (alt.includes(';')) {
          const ps = alt.split(';'), vs = String(value).split(';');
          return ps.length === vs.length && ps.every((p, i) => oneEq(vs[i], p, r));
        }
        return oneEq(value, alt, r);
      });
    },
  };

  /* ---------------- khởi động khung (index.html gọi) ---------------- */
  T0.boot = function (opts) {
    injectCss();
    document.documentElement.lang = T0.lang;
    T0.root = opts.root;
    return T0;
  };
  injectCss.call && document.readyState !== 'loading' ? injectCss() : document.addEventListener('DOMContentLoaded', injectCss);
})();
