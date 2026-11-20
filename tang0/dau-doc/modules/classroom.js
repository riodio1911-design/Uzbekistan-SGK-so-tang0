/* T0 classroom – vở bài tập, giao bài, kết quả lớp, GV chấm câu mở, video thật của GV (đề xuất 009, agent G).
 * JS thuần ES2020, tự đăng ký vào window.T0.classroom. Không sửa core: nghe sự kiện của core.
 *
 * DỮ LIỆU (D2 N3, mẫu matematika5; tên collection lấy từ features.classroom.db):
 *   hw/<set>                 $defs/assignment  {on, due, kind, target, by, ts}      – chỉ GV ghi
 *   res/<khóa>               $defs/class_result {set, uid, ok, tot, opd, op, mark, answers, lang, ts} – học sinh ghi (debounce)
 *   grade/<khóa>             $defs/teacher_grade {set, uid, items{<ý>:{score,max,comment,ts}}, mark, by, ts} – chỉ GV ghi
 *   media/<video id>         teacher.media_overrides[id] = {by:{all|uz|ru|vi:{mode,url|asset,title}}} – chỉ GV ghi
 *   <khóa> = features.classroom.result_key:
 *     '<set>_<uid>'   (D2, phẳng – bảng lớp đọc res where set==; quyền db mặc định: mọi Contributor ghi được mọi dòng)
 *     '<uid>/s/<set>' (đề xuất G, lồng – thêm tài liệu tóm tắt res/<uid>, grade/<uid>; quyền {self}: học sinh chỉ đọc/ghi
 *                      phần của mình, GV đọc cả lớp). Quy tắc db: T0.classroom.dbRules(features).
 *   Không có db (xem trước, ngoài Claude): hw và bài làm chỉ lưu ở trình duyệt (offline_fallback: localStorage).
 *
 * LƯU Ở TRÌNH DUYỆT (T0.store, tiền tố t0:<book>:)
 *   cls:ans  = $defs/answer_map {'<bài>.<ý>': {v, ok, t(số lần nộp), score}}  – nguồn cho res/ (migrate.js cũng ghi vào đây)
 *   cls:hw   = bản sao hw/ (khi không có db: nơi GV thử giao bài)
 *
 * NGHE: t0:load (khởi tạo), t0:exresult {id, ok, score, v?, items?} (ghi bài làm), t0:page {page, volume} (thanh điểm vở),
 *       t0:mode, t0:lang, t0:migrated {exercises:[id]} (đẩy kết quả đã chuyển từ bản cũ).
 * PHÁT: t0:clsans {id}, t0:hw {hw}, t0:mediaoverride {id}.
 *
 * API: T0.classroom.enabled(), .sets(), .setsOf(exId), .exercisesOf(setId), .score(setId), .answers(),
 *      .record(detail), .openHW(), .openSet(id), .openClass(setId), .mediaFor(videoId, lang), .openMedia(),
 *      .mountButton(host), .dbRules(features), .units(ex), .isTeacher(), ._mock(dbNs, userNs) (thử).
 */
(function () {
  'use strict';
  const T0 = (window.T0 = window.T0 || {});
  const C = (T0.classroom = T0.classroom || {});

  /* ---------------- chuỗi giao diện ---------------- */
  const STR = {
    hw: { uz: 'Uy vazifalari', ru: 'Домашние задания', vi: 'Bài về nhà' },
    assigned: { uz: 'Berilgan', ru: 'Задано', vi: 'Đã giao' },
    assigned_h: { uz: 'O‘qituvchi bergan vazifalar', ru: 'Задания учителя', vi: 'Giáo viên đã giao' },
    due: { uz: 'Muddat', ru: 'Срок', vi: 'Hạn nộp' },
    overdue: { uz: 'muddati o‘tgan', ru: 'срок прошёл', vi: 'quá hạn' },
    open: { uz: 'Ochish', ru: 'Открыть', vi: 'Mở' },
    cls: { uz: 'Sinf natijalari', ru: 'Результаты класса', vi: 'Kết quả cả lớp' },
    pupil: { uz: 'O‘quvchi', ru: 'Ученик', vi: 'Học sinh' },
    pupil_anon: { uz: 'O‘quvchi', ru: 'Ученик', vi: 'Học sinh' },
    right: { uz: 'To‘g‘ri', ru: 'Верно', vi: 'Đúng' },
    mark: { uz: 'Baho', ru: 'Оценка', vi: 'Điểm' },
    open_done: { uz: 'Ochiq javoblar', ru: 'Открытые ответы', vi: 'Câu mở' },
    tmark: { uz: 'O‘qituvchi bahosi', ru: 'Оценка учителя', vi: 'Điểm GV' },
    grade_btn: { uz: 'Baholash', ru: 'Оценить', vi: 'Chấm' },
    none: { uz: 'Hali natija yo‘q.', ru: 'Пока нет результатов.', vi: 'Chưa có kết quả.' },
    teacher: { uz: 'O‘qituvchi', ru: 'Учитель', vi: 'Giáo viên' },
    intro: { uz: 'O‘qituvchi bergan vazifalar yuqorida. Javobi bor savollar avtomatik tekshiriladi; baho = to‘g‘ri ÷ jami × {s}.', ru: 'Задания учителя показаны сверху. Ответы проверяются автоматически; оценка = верные ÷ все × {s}.', vi: 'Bài giáo viên giao hiện ở trên cùng. Câu có đáp án được chấm tự động; điểm = số câu đúng ÷ tổng số câu × {s}.' },
    offline: { uz: 'Sinf natijalari kitob Claude ichida ochilganda va o‘quvchilar ma’lumot yoza olganda ishlaydi. Hozir natijalar faqat shu brauzerda saqlanadi.', ru: 'Результаты класса работают, когда книга открыта в Claude и ученики могут записывать данные. Сейчас всё хранится только в этом браузере.', vi: 'Kết quả cả lớp chỉ hoạt động khi sách mở trong Claude và học sinh có quyền ghi dữ liệu. Hiện kết quả chỉ lưu trong trình duyệt này.' },
    loading: { uz: 'Yuklanmoqda…', ru: 'Загрузка…', vi: 'Đang tải…' },
    slow: { uz: 'Ma’lumotlarga hozircha ulanib bo‘lmadi.', ru: 'Пока не удаётся получить данные.', vi: 'Chưa kết nối được dữ liệu.' },
    back: { uz: 'Orqaga', ru: 'Назад', vi: 'Quay lại' },
    save: { uz: 'Saqlash', ru: 'Сохранить', vi: 'Lưu' },
    saved: { uz: 'Saqlandi', ru: 'Сохранено', vi: 'Đã lưu' },
    save_fail: { uz: 'Saqlab bo‘lmadi', ru: 'Не удалось сохранить', vi: 'Không lưu được' },
    answer: { uz: 'Javob', ru: 'Ответ', vi: 'Bài làm' },
    no_answer: { uz: '(javob yo‘q)', ru: '(нет ответа)', vi: '(chưa làm)' },
    comment: { uz: 'Izoh', ru: 'Комментарий', vi: 'Nhận xét' },
    score: { uz: 'Ball', ru: 'Балл', vi: 'Điểm câu' },
    final: { uz: 'Yakuniy baho', ru: 'Итоговая оценка', vi: 'Điểm cuối' },
    auto_part: { uz: 'Avtomatik tekshirilgan', ru: 'Проверено автоматически', vi: 'Chấm tự động' },
    ai: { uz: 'Sun’iy intellekt', ru: 'ИИ', vi: 'AI' },
    no_open: { uz: 'Bu vazifada ochiq savol yo‘q.', ru: 'В этом задании нет открытых вопросов.', vi: 'Bộ này không có câu mở.' },
    set_score: { uz: 'To‘plam', ru: 'Набор', vi: 'Bộ' },
    lesson: { uz: 'Dars', ru: 'Урок', vi: 'Bài' },
    review: { uz: 'Takrorlash', ru: 'Повторение', vi: 'Ôn tập' },
    other: { uz: 'Boshqa', ru: 'Другое', vi: 'Khác' },
    videos: { uz: 'Haqiqiy video', ru: 'Настоящее видео', vi: 'Video thật' },
    video_url: { uz: 'Video havolasi (https://…)', ru: 'Ссылка на видео (https://…)', vi: 'Đường dẫn video (https://…)' },
    video_up: { uz: 'yoki fayl yuklash (≤ 20 MB)', ru: 'или загрузить файл (≤ 20 МБ)', vi: 'hoặc tải tệp lên (≤ 20 MB)' },
    delete: { uz: 'O‘chirish', ru: 'Удалить', vi: 'Xóa' },
    all_langs: { uz: 'Barcha tillar', ru: 'Все языки', vi: 'Mọi ngôn ngữ' },
    too_big: { uz: 'Fayl 20 MB dan katta', ru: 'Файл больше 20 МБ', vi: 'Tệp lớn hơn 20 MB' },
    uploading: { uz: 'Yuklanmoqda…', ru: 'Загрузка…', vi: 'Đang tải lên…' },
    exercises: { uz: 'Topshiriqlar', ru: 'Задания', vi: 'Bài tập' },
    teacher_note: { uz: 'O‘qituvchi', ru: 'Учитель', vi: 'GV' },
  };
  const s = (k) => T0.t(STR[k]) || k;
  C.STR = STR;

  /* ---------------- tiện ích ---------------- */
  const E = (...a) => T0.ui.el(...a);
  const AUTO_KINDS = new Set(['ex.choice_single', 'ex.choice_multi', 'ex.short_answer', 'ex.sort_bins', 'ex.order', 'ex.match_pairs', 'ex.true_false', 'ex.fill_blanks', 'ex.choice_per_row', 'ex.select_in_text', 'ex.number_line', 'ex.label_image']);
  const OPEN_MODES = new Set(['giao_vien', 'ai', 'khong_cham']);
  const SEG_OK = /^[A-Za-z0-9_\-.~:@+]+$/;
  const seg = (x) => { const v = String(x); return SEG_OK.test(v) && v !== '.' && v !== '..' ? v : v.replace(/[^A-Za-z0-9_\-.~:@+]/g, (c) => '~' + c.charCodeAt(0).toString(16)); };
  const nonEmpty = (v) => v != null && v !== '' && !(typeof v === 'object' && !Object.values(v).some((x) => x != null && String(x).trim() !== ''));
  const round1 = (x) => Math.round(x * 10) / 10;
  const today = () => new Date().toISOString().slice(0, 10);

  let state = null; // trạng thái theo cuốn
  function fresh() {
    return {
      book: T0.book && T0.book.book_id, db: null, user: null, uid: null, teacher: !!window.__TEACH, connected: false,
      hw: (T0.store && T0.store.get('cls:hw', {})) || {}, ans: null, media: {}, pend: {}, queues: {}, unsub: [], index: null,
      mySummary: null, myGrades: {},
    };
  }

  /* ---------------- cấu hình ---------------- */
  function cfg() {
    const F = T0.features || {}; const c = F.classroom || {}; const db = c.db || {};
    const b = T0.book || {};
    return {
      unit: c.assign_unit || ((b.workbook_sets || []).length ? 'workbook_set' : 'lesson'),
      hw: db.assignments || 'hw', res: db.results || 'res', grade: db.grades || 'grade', media: 'media',
      key: c.result_key || '<uid>/s/<set>',
      debounce: c.push_debounce_ms != null ? c.push_debounce_ms : 1500,
      detect: c.teacher_detect || ['user.canEdit', 'window.__TEACH'],
      scale: c.score_scale === undefined ? 10 : c.score_scale,
      modes: c.teacher_grading_modes || ['tu_dong'],
      offline: c.offline_fallback || 'localStorage',
    };
  }
  const nested = () => cfg().key.includes('/');
  C.enabled = function () {
    const F = T0.features || {}; const f = F.features || {};
    return !!(T0.book && (F.classroom || f.teacher_assign || f.results_to_db || f.teacher_class_results || (F.layers || {}).vo_bai_tap));
  };
  C.isTeacher = () => !!(state && state.teacher);

  /* Quy tắc db cho lúc publish (capabilities.db.rules). Lồng: học sinh chỉ thấy phần mình; phẳng: theo D2 (res mặc định). */
  C.dbRules = function (features) {
    const c = (features && features.classroom) || (T0.features && T0.features.classroom) || {};
    const db = c.db || {}; const hw = db.assignments || 'hw', res = db.results || 'res', gr = db.grades || 'grade';
    const isNested = String(c.result_key || '<uid>/s/<set>').includes('/');
    const rules = [
      { path: hw, read: 'view', write: 'admin' },
      { path: 'media', read: 'view', write: 'admin' },
      { path: 'edit', read: 'view', write: 'admin' },
      { path: 'quiz', read: 'view', write: 'admin' },
    ];
    if (isNested) {
      rules.push({ path: res, read: 'admin', write: 'admin' }, { path: res + '/{self}', read: 'interact', write: 'interact' });
      rules.push({ path: gr, read: 'admin', write: 'admin' }, { path: gr + '/{self}', read: 'interact', write: 'admin' });
    } else {
      rules.push({ path: gr, read: 'interact', write: 'admin' }); // res/ giữ mặc định (interact ghi) như matematika5 cũ
    }
    return rules;
  };
  C.capabilities = (features) => ({ db: { rules: C.dbRules(features) }, user: { scopes: ['profile'] } });

  /* ---------------- bộ bài (set) ---------------- */
  function buildIndex() {
    const b = T0.book || {}; const unit = cfg().unit;
    const exs = b.exercises || [];
    const sets = []; const exToSets = {};
    const add = (set, exIds) => { set.ex = exIds.filter((id) => exs.some((e) => e.id === id)); if (!set.ex.length) return; sets.push(set); set.ex.forEach((id) => (exToSets[id] = exToSets[id] || []).push(set.id)); };
    if (unit === 'workbook_set') {
      (b.workbook_sets || []).forEach((w) => add({ id: w.id, kind: 'workbook_set', obj: w, unit: w.unit, review: !!w.review }, w.exercise_refs || exs.filter((e) => e.volume === w.volume && w.page_range && e.page >= w.page_range[0] && e.page <= w.page_range[1]).map((e) => e.id)));
    } else if (unit === 'lesson') {
      (b.lessons || []).forEach((l) => add({ id: l.id, kind: 'lesson', obj: l, unit: l.unit }, exs.filter((e) => e.lesson === l.id).map((e) => e.id)));
    } else if (unit === 'unit') {
      (b.units || []).forEach((u) => { const ls = new Set(u.lesson_refs || []); add({ id: u.id, kind: 'unit', obj: u, unit: u.id }, exs.filter((e) => ls.has(e.lesson)).map((e) => e.id)); });
    } else {
      exs.forEach((e) => add({ id: e.id, kind: unit === 'quiz_set' ? 'quiz_set' : 'exercise', obj: e, unit: (T0.find('lesson', e.lesson) || {}).unit }, [e.id]));
    }
    return { sets, byId: Object.fromEntries(sets.map((x) => [x.id, x])), exToSets };
  }
  function idx() { if (!state) state = fresh(); if (!state.index) state.index = buildIndex(); return state.index; }
  C.sets = () => idx().sets;
  C.setsOf = (exId) => idx().exToSets[exId] || [];
  C.exercisesOf = (setId) => ((idx().byId[setId] || {}).ex || []).map((id) => T0.find('exercise', id)).filter(Boolean);
  C.setName = function (x) {
    if (typeof x === 'string') x = idx().byId[x];
    if (!x) return '';
    const o = x.obj || {};
    const title = T0.t(o.title) || T0.t(o.prompt) || x.id;
    const no = o.no != null && o.no !== '' ? o.no + ' · ' : '';
    return no + title;
  };

  /* ---------------- ý (đơn vị chấm) ---------------- */
  function isAuto(ex, it) {
    if (it.open) return false;
    if ((it.answer != null && it.answer !== '') || it.correct != null || it.answer_pattern) return true;
    const g = ((it !== ex && it.grading) || ex.grading || {}).mode;
    if (g && OPEN_MODES.has(g)) return false;
    if (g === 'tu_dong') return true;
    const k = (it !== ex && it.kind) || ex.kind;
    if (k === 'ex.sort_bins') return Array.isArray(ex.cards) && ex.cards.some((c) => c.bin != null);
    return AUTO_KINDS.has(k);
  }
  C.units = function (ex) {
    if (!ex) return [];
    const items = Array.isArray(ex.items) && ex.items.length ? ex.items : null;
    if (!items) return [{ key: ex.id, idx: 0, it: ex, auto: isAuto(ex, ex) }];
    return items.map((it, i) => {
      const iid = it.id != null && it.id !== '' ? String(it.id) : String(i);
      const key = iid.startsWith(ex.id + '.') ? iid : ex.id + '.' + iid;
      return { key, idx: i, it, auto: isAuto(ex, it) };
    });
  };

  /* ---------------- bài làm (answer_map) ---------------- */
  function ans() { if (!state) state = fresh(); if (!state.ans) state.ans = T0.store.get('cls:ans', {}) || {}; return state.ans; }
  C.answers = () => ans();
  function saveAns() { T0.store.set('cls:ans', ans()); }
  function storedValues(id) {
    const v = T0.store.get('ex:' + id + ':v', null);
    if (v != null) return { v, byIndex: true };
    const a = T0.store.get('ex:' + id + ':ans', null);
    if (a != null) return { v: a, byIndex: false };
    return null;
  }
  /* detail: {id, ok, score, v?, items?:[{id?, v, ok, score}]} – v/items là phần core nên chuyển tiếp (YEU-CAU G1). */
  C.record = function (detail) {
    if (!detail || !detail.id || !T0.book) return;
    const ex = T0.find('exercise', detail.id); if (!ex) return;
    const units = C.units(ex); const A = ans(); const now = Date.now();
    const per = Array.isArray(detail.items) ? detail.items : null;
    const sv = detail.v !== undefined ? { v: detail.v, byIndex: Array.isArray(ex.items) && ex.items.length > 0 } : storedValues(ex.id);
    const rule = (ex.grading || {}).rule || ((T0.book.grading_defaults || {}).short_answer_rule);
    units.forEach((u) => {
      let v, ok = null, score;
      const p = per && (per.find((x) => x && x.id != null && String(x.id) === String(u.it.id)) || per[u.idx]);
      if (p) { v = p.v; ok = p.ok === true || p.ok === false ? p.ok : null; score = p.score; }
      else {
        if (sv) v = sv.byIndex && units.length > 1 ? (sv.v || {})[u.idx] : sv.byIndex && sv.v && typeof sv.v === 'object' && !Array.isArray(sv.v) && Object.keys(sv.v).every((k) => /^\d+$/.test(k)) ? sv.v[0] : sv.v;
        if (u.auto) {
          if (u.it.answer != null && u.it.answer !== '' && v != null && v !== '' && T0.grade) ok = !!T0.grade.shortAnswer(v, u.it.answer, (u.it.grading || {}).rule || rule);
          else if (units.length === 1) { ok = detail.ok === true ? true : detail.ok === false ? false : null; score = typeof detail.score === 'number' ? detail.score : undefined; }
          else if (detail.ok === true) ok = true;
          else if (typeof detail.score === 'number') { score = detail.score; ok = null; }
        }
      }
      if (!u.auto && !nonEmpty(v)) return; // câu mở chưa làm: không ghi
      const prev = A[u.key] || {};
      const rec = { v: v === undefined ? (prev.v !== undefined ? prev.v : null) : v, ok, t: (prev.t || 0) + 1 };
      if (typeof score === 'number') rec.score = Math.max(0, Math.min(1, score));
      if (prev.ai) rec.ai = prev.ai;
      A[u.key] = rec;
    });
    saveAns();
    T0.emit('t0:clsans', { id: ex.id, t: now });
    C.setsOf(ex.id).forEach(schedulePush);
    renderBar();
  };
  /* Kết quả AI chấm (gia sư open_grade) – lưu kèm bài làm (D2 G6). */
  C.recordAI = function (key, ai) {
    const A = ans(); A[key] = Object.assign({}, A[key] || { v: null, ok: null, t: 0 }, { ai }); saveAns();
    const ex = (T0.book.exercises || []).find((e) => C.units(e).some((u) => u.key === key));
    if (ex) C.setsOf(ex.id).forEach(schedulePush);
  };

  C.score = function (setId, answers) {
    const A = answers || ans(); let ok = 0, tot = 0, op = 0, opd = 0;
    C.exercisesOf(setId).forEach((ex) => C.units(ex).forEach((u) => {
      const a = A[u.key];
      if (u.auto) { tot++; if (a) ok += a.ok === true ? 1 : typeof a.score === 'number' ? a.score : 0; }
      else { op++; if (a && nonEmpty(a.v)) opd++; }
    }));
    ok = Math.round(ok * 100) / 100;
    const sc = cfg().scale;
    return { ok: Math.round(ok), okExact: ok, tot, op, opd, mark: tot && sc ? round1((ok / tot) * sc) : null };
  };
  function answersOf(setId) {
    const A = ans(); const out = {};
    C.exercisesOf(setId).forEach((ex) => C.units(ex).forEach((u) => { if (A[u.key]) out[u.key] = A[u.key]; }));
    return out;
  }

  /* ---------------- db ---------------- */
  function resPath(setId, uid, coll) { return (coll || cfg().res) + '/' + cfg().key.replace('<set>', seg(setId)).replace('<uid>', seg(uid)); }
  function queue(path, fn) { // một lần ghi mỗi tài liệu
    const q = state.queues; const prev = q[path] || Promise.resolve();
    const next = prev.catch(() => {}).then(fn);
    q[path] = next; return next;
  }
  function schedulePush(setId) {
    if (!state || !state.db || !state.uid) return;
    clearTimeout(state.pend[setId]);
    state.pend[setId] = setTimeout(() => pushRes(setId), cfg().debounce);
  }
  C.flush = function () { if (!state) return Promise.resolve(); const ids = Object.keys(state.pend); ids.forEach((id) => clearTimeout(state.pend[id])); state.pend = {}; return Promise.all(ids.map(pushRes)); };
  function pushRes(setId) {
    if (!state || !state.db || !state.uid) return Promise.resolve();
    delete state.pend[setId];
    const sc = C.score(setId); const uid = state.uid; const db = state.db;
    const body = { set: setId, uid, ok: sc.ok, tot: sc.tot, opd: sc.opd, op: sc.op, mark: sc.mark, answers: answersOf(setId), lang: T0.lang, ts: Date.now() };
    const path = resPath(setId, uid);
    const w = queue(path, () => db.doc(path).set(body));
    if (!nested()) return w.catch(onWriteErr);
    const sp = cfg().res + '/' + seg(uid);
    const sum = state.mySummary || { uid, sets: {} };
    sum.sets = Object.assign({}, sum.sets, { [setId]: { ok: sc.ok, tot: sc.tot, opd: sc.opd, op: sc.op, mark: sc.mark, ts: body.ts } });
    sum.uid = uid; sum.ts = body.ts; state.mySummary = sum;
    return Promise.all([w, queue(sp, () => db.doc(sp).set(JSON.parse(JSON.stringify(sum))))]).catch(onWriteErr);
  }
  function onWriteErr(e) { if (e && (e.code === 'invalid_argument' || e.code === 'not_granted')) { state.readOnly = true; } else if (e && e.code === 'quota_exceeded') T0.ui.toast(s('save_fail')); }

  function withTimeout(p, ms) { return Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]); }
  async function connect(st) {
    try {
      const cl = window.claude;
      if (!cl || typeof cl.use !== 'function') return;
      const [db, user] = await Promise.all([withTimeout(cl.use('db'), 10000), withTimeout(cl.use('user'), 10000)]);
      if (st !== state) return;
      st.db = db || null; st.user = user || null;
      if (user) {
        try { st.uid = await user.id(); } catch (e) { st.uid = null; }
        if (!st.teacher && cfg().detect.includes('user.canEdit')) { try { st.teacher = !!(await user.canEdit()); } catch (e) { /* */ } }
      }
      if (cfg().detect.includes('window.__TEACH') && window.__TEACH) st.teacher = true;
      if (!st.db) return;
      st.connected = true;
      // hw/: đăng ký một lần cho mỗi cuốn
      st.unsub.push(st.db.collection(cfg().hw).onSnapshot((q) => {
        if (st !== state) return;
        const h = {}; q.docs.forEach((d) => { h[d.id] = d.data(); });
        st.hw = h; T0.store.set('cls:hw', h); T0.emit('t0:hw', { hw: h }); renderBar(); refreshButton();
      }, () => {}));
      // media/: video thật GV gắn
      st.unsub.push(st.db.collection(cfg().media).onSnapshot((q) => {
        if (st !== state) return;
        const m = {}; q.docs.forEach((d) => { m[d.id] = d.data(); });
        st.media = m; T0.emit('t0:mediaoverride', { all: true });
      }, () => {}));
      if (st.uid && nested()) {
        try { const d = await st.db.doc(cfg().res + '/' + seg(st.uid)).get(); if (d.exists) st.mySummary = JSON.parse(JSON.stringify(d.data())); } catch (e) { /* */ }
      }
      // đẩy những bộ đã có bài làm mà chưa từng đẩy (vd. vừa chuyển từ bản cũ, hoặc làm khi chưa có mạng)
      if (st.uid) {
        const pushed = T0.store.get('cls:pushed', {}) || {};
        C.sets().forEach((x) => { const sc = C.score(x.id); const sig = [sc.okExact, sc.tot, sc.opd].join('/'); if ((sc.okExact || sc.opd) && pushed[x.id] !== sig) { pushed[x.id] = sig; schedulePush(x.id); } });
        T0.store.set('cls:pushed', pushed);
      }
      refreshButton();
    } catch (e) { console.warn('classroom: không kết nối được db', e); }
  }
  C._mock = function (db, user) { window.claude = { use: async (n) => (n === 'db' ? db : n === 'user' ? user : null) }; if (T0.book) init(); };

  /* ---------------- giao bài ---------------- */
  async function setHW(id, patch) {
    const x = idx().byId[id];
    const cur = Object.assign({}, state.hw[id] || {}, patch, { kind: x ? x.kind : cfg().unit, ts: Date.now() });
    if (state.uid) cur.by = state.uid;
    delete cur.assigned;
    state.hw = Object.assign({}, state.hw, { [id]: cur });
    T0.store.set('cls:hw', state.hw);
    if (state.db) { try { await queue(cfg().hw + '/' + seg(id), () => state.db.doc(cfg().hw + '/' + seg(id)).set(cur)); } catch (e) { T0.ui.toast(s('save_fail')); } }
    T0.emit('t0:hw', { hw: state.hw }); renderBar(); refreshButton();
  }
  C.setHW = setHW;
  const isOn = (a) => !!(a && (a.on || a.assigned));

  /* ---------------- CSS ---------------- */
  const CSS = `
.t0c-fab{position:fixed;left:var(--space-3,12px);bottom:calc(var(--space-3,12px) + env(safe-area-inset-bottom,0px));z-index:calc(var(--z-modal,1000) - 1);box-shadow:var(--shadow-2)}
.t0c-cnt{min-width:22px;height:22px;border-radius:11px;background:var(--pin-workbook,#6A3FB5);color:#fff;font-size:var(--text-xs,12px);font-weight:700;display:inline-flex;align-items:center;justify-content:center;padding:0 6px}
.t0c-cnt[hidden]{display:none}
@media (max-width:479px){.t0c-bar .t0c-bl{display:none}.t0c-bar .t0-btn{padding:0 12px}}
.t0c-intro{font-size:var(--text-sm,13px);color:var(--color-ink-2);margin:0 0 var(--space-3,12px);line-height:var(--lh-body,1.5)}
.t0c-h{font-weight:700;font-size:var(--text-ui,15px);margin:var(--space-4,16px) 0 var(--space-2,8px)}
.t0c-grp{border-top:1px solid var(--color-line)}
.t0c-grp>summary{list-style:none;cursor:pointer;min-height:var(--touch-min,44px);display:flex;align-items:center;gap:8px;font-weight:700;font-size:var(--text-ui,15px)}
.t0c-grp>summary::-webkit-details-marker{display:none}
.t0c-grp>summary::before{content:'▸';color:var(--color-ink-2);transition:transform .15s}
.t0c-grp[open]>summary::before{transform:rotate(90deg)}
.t0c-grp>summary .t0c-sub{font-weight:400;color:var(--color-ink-2);font-size:var(--text-sm,13px);margin-left:auto}
.t0c-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2,8px);padding:var(--space-2,8px) 0;border-bottom:1px dashed var(--color-line)}
.t0c-row:last-child{border-bottom:0}
.t0c-nm{flex:1 1 180px;min-width:0;font-size:var(--text-ui,15px);line-height:1.35;overflow-wrap:anywhere}
.t0c-badge{display:inline-block;font-size:var(--text-xs,12px);font-weight:700;border-radius:var(--radius-pill,999px);padding:2px 8px;margin-left:4px;background:var(--color-accent-soft);color:var(--color-accent-ink);white-space:nowrap}
.t0c-badge.late{background:var(--color-bad-soft);color:var(--color-bad)}
.t0c-badge.tm{background:var(--color-ok-soft);color:var(--color-ok)}
.t0c-sc{font-variant-numeric:tabular-nums;font-size:var(--text-sm,13px);color:var(--color-ink-2);min-width:64px;text-align:right}
.t0c-ctl{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-2,8px);width:100%;justify-content:flex-end}
.t0c-chk{display:inline-flex;align-items:center;gap:6px;min-height:var(--touch-min,44px);font-size:var(--text-sm,13px);font-weight:700;cursor:pointer;padding:0 4px}
.t0c-chk input{width:22px;height:22px;accent-color:var(--color-accent)}
.t0c-date{min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:0 8px;font:inherit;font-size:var(--text-sm,13px);background:var(--color-surface);color:var(--color-ink);max-width:160px}
.t0c-tblw{overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}
.t0c-tbl{border-collapse:collapse;width:100%;font-size:var(--text-sm,13px);font-variant-numeric:tabular-nums}
.t0c-tbl th,.t0c-tbl td{padding:6px 8px;border-bottom:1px solid var(--color-line);text-align:left;vertical-align:middle}
.t0c-tbl th{color:var(--color-ink-2);font-weight:600;white-space:nowrap}
.t0c-tbl td.n{text-align:right;white-space:nowrap}
.t0c-note{font-size:var(--text-sm,13px);color:var(--color-ink-2);margin:var(--space-3,12px) 0 0}
.t0c-q{border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:var(--space-3,12px);margin:0 0 var(--space-3,12px);display:flex;flex-direction:column;gap:var(--space-2,8px)}
.t0c-q .p{font-weight:600;line-height:1.4}
.t0c-q .a{white-space:pre-wrap;background:var(--color-surface-2);border-radius:var(--radius-sm,6px);padding:var(--space-2,8px);overflow-wrap:anywhere}
.t0c-q .ai{font-size:var(--text-sm,13px);color:var(--color-ink-2)}
.t0c-q .r{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);align-items:center}
.t0c-q input[type=number],.t0c-fin input{width:84px;min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:0 8px;font:inherit;background:var(--color-surface);color:var(--color-ink)}
.t0c-q textarea{width:100%;box-sizing:border-box;min-height:64px;border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:8px;font:inherit;background:var(--color-surface);color:var(--color-ink)}
.t0c-fin{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);align-items:center;position:sticky;bottom:calc(-1 * var(--space-4,16px));background:var(--color-surface);padding:var(--space-3,12px) 0;border-top:1px solid var(--color-line)}
.t0c-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--space-3,12px) + env(safe-area-inset-bottom,0px));z-index:calc(var(--z-modal,1000) - 1);display:flex;align-items:center;gap:var(--space-2,8px);max-width:calc(100vw - 32px);box-sizing:border-box;background:var(--color-surface);color:var(--color-ink);border:1.5px solid var(--pin-workbook,#6A3FB5);border-radius:var(--radius-pill,999px);padding:4px 4px 4px var(--space-3,12px);box-shadow:var(--shadow-2);font-size:var(--text-sm,13px)}
.t0c-bar .nm{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.t0c-bar .sc{white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--color-ink-2)}
.t0c-bar .mk{white-space:nowrap;font-weight:700;color:var(--pin-workbook,#6A3FB5)}
:root[data-theme=dark] .t0c-bar .mk{color:var(--hue-purple,#A88BE8)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .t0c-bar .mk{color:var(--hue-purple,#A88BE8)}}
body.t0c-has-bar .t0c-fab{display:none}
.t0-modal-open .t0c-bar,.t0-modal-open .t0c-fab{display:none}
.t0c-vrow{display:flex;flex-direction:column;gap:var(--space-2,8px);padding:var(--space-3,12px) 0;border-bottom:1px solid var(--color-line)}
.t0c-vrow input[type=url]{min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);padding:0 10px;font:inherit;background:var(--color-surface);color:var(--color-ink);width:100%;box-sizing:border-box}
.t0c-vrow select{min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);font:inherit;background:var(--color-surface);color:var(--color-ink);padding:0 8px}
.t0c-vrow .r{display:flex;flex-wrap:wrap;gap:var(--space-2,8px);align-items:center}
.t0c-vrow input[type=file]{max-width:100%;font-size:var(--text-sm,13px)}
.t0c-sheet .t0-ex{border-bottom:1px solid var(--color-line);padding-bottom:var(--space-4,16px);margin-bottom:var(--space-4,16px)}
`;
  function css() { if (document.getElementById('t0c-css')) return; document.head.append(E('style', { id: 't0c-css', text: CSS })); }

  /* ---------------- nút "Bài về nhà" ---------------- */
  const ICON = '<svg width="18" height="18" viewBox="0 0 20 20" style="display:block"><rect x="4" y="2.5" width="12" height="15" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 7h6M7 10.5h6M7 14h3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  let btn = null;
  function assignedOpen() { return C.sets().filter((x) => isOn(state.hw[x.id])); }
  function refreshButton() {
    if (!btn) return;
    btn.hidden = !C.enabled();
    const cnt = btn.querySelector('.t0c-cnt');
    const n = state ? assignedOpen().filter((x) => { const sc = C.score(x.id); return sc.okExact + sc.opd < sc.tot + sc.op; }).length : 0;
    cnt.textContent = n; cnt.hidden = !n;
    btn.setAttribute('aria-label', s('hw') + (n ? ' (' + n + ')' : ''));
    btn.querySelector('.l').textContent = s('hw');
  }
  C.mountButton = function (host) {
    css();
    if (btn) btn.remove();
    btn = E('button', { class: 't0-btn t0c-btn' + (host ? '' : ' t0c-fab'), type: 'button', onclick: () => C.openHW(), 'data-t0-under-modal': host ? null : '' },
      E('span', { 'aria-hidden': 'true', html: ICON }),
      E('span', { class: 'l', text: s('hw') }), E('span', { class: 't0c-cnt', hidden: true }));
    (host || document.body).append(btn);
    refreshButton();
    return btn;
  };

  /* ---------------- bảng "Bài về nhà" ---------------- */
  function unitTitle(uid) { const u = T0.find('unit', uid); return u ? (u.no != null && u.no !== '' && u.no !== 0 ? u.no + '. ' : '') + T0.t(u.title) : s('other'); }
  function scoreText(sc) { return sc.tot ? sc.ok + ' / ' + sc.tot + (sc.mark != null && sc.okExact ? ' · ' + sc.mark : '') : sc.op ? sc.opd + ' / ' + sc.op : '—'; }
  function row(x, back) {
    const a = state.hw[x.id] || {}; const sc = C.score(x.id);
    const nm = E('div', { class: 't0c-nm' }, C.setName(x));
    if (isOn(a)) {
      const late = a.due && a.due < today() && sc.okExact + sc.opd < sc.tot + sc.op;
      nm.append(E('span', { class: 't0c-badge' + (late ? ' late' : '') }, s('assigned') + (a.due ? ' · ' + a.due : '') + (late ? ' · ' + s('overdue') : '')));
    }
    const g = state.myGrades[x.id];
    if (g && g.mark != null) nm.append(E('span', { class: 't0c-badge tm' }, s('teacher_note') + ': ' + g.mark));
    const r = E('div', { class: 't0c-row', 'data-set': x.id }, nm, E('span', { class: 't0c-sc', text: scoreText(sc) }));
    const ctl = E('div', { class: 't0c-ctl' });
    if (state.teacher) {
      const cb = E('input', { type: 'checkbox' }); cb.checked = isOn(a);
      cb.onchange = () => setHW(x.id, { on: cb.checked }).then(back);
      const dt = E('input', { type: 'date', class: 't0c-date', value: a.due || '', 'aria-label': s('due') });
      dt.onchange = () => setHW(x.id, { due: dt.value || '' });
      ctl.append(E('label', { class: 't0c-chk' }, cb, s('assigned')), dt, T0.ui.button(s('cls'), () => C.openClass(x.id)));
    }
    ctl.append(T0.ui.button(s('open'), () => { T0.ui.closeAll(); C.openSet(x.id); }, 'primary'));
    r.append(ctl);
    return r;
  }
  C.openHW = function () {
    if (!state) init();
    css();
    const box = E('div', { class: 't0c-hw' });
    const m = T0.ui.modal(box, { title: s('hw'), wide: true });
    const draw = () => {
      box.innerHTML = '';
      box.append(E('p', { class: 't0c-intro', text: s('intro').replace('{s}', cfg().scale || 10) }));
      if (state.teacher) {
        const tools = E('div', { class: 't0c-ctl', style: { justifyContent: 'flex-start' } }, E('span', { class: 't0c-badge', text: s('teacher') }));
        if (hasMediaTargets()) tools.append(T0.ui.button(s('videos'), () => C.openMedia()));
        box.append(tools);
      }
      const all = C.sets();
      const asg = all.filter((x) => isOn(state.hw[x.id]));
      if (asg.length) { box.append(E('div', { class: 't0c-h', text: s('assigned_h') })); asg.forEach((x) => box.append(row(x, draw))); }
      const rev = all.filter((x) => x.review);
      if (rev.length) box.append(group(s('review'), rev, false));
      const groups = []; const by = {};
      all.filter((x) => !x.review).forEach((x) => { const k = x.unit || '_'; if (!by[k]) { by[k] = []; groups.push(k); } by[k].push(x); });
      const curUnit = currentUnit();
      groups.forEach((k) => box.append(group(k === '_' ? s('other') : unitTitle(k), by[k], groups.length === 1 || k === curUnit)));
      if (!state.connected) box.append(E('p', { class: 't0c-note', text: s('offline') }));
      function group(title, list, open) {
        const sc = list.reduce((a, x) => { const v = C.score(x.id); a.ok += v.okExact; a.tot += v.tot; return a; }, { ok: 0, tot: 0 });
        const d = E('details', { class: 't0c-grp' }, E('summary', null, E('span', { text: title }), E('span', { class: 't0c-sub', text: sc.tot ? Math.round(sc.ok) + ' / ' + sc.tot : String(list.length) })));
        if (open) d.open = true;
        let filled = false;
        const fill = () => { if (filled) return; filled = true; list.forEach((x) => d.append(row(x, draw))); };
        if (open) fill(); else d.addEventListener('toggle', fill);
        return d;
      }
    };
    draw();
    loadMyGrades().then((ch) => { if (ch && document.body.contains(box)) draw(); });
    return m;
  };
  function currentUnit() {
    const pg = state.lastPage; if (!pg) return null;
    const x = C.sets().find((y) => y.kind === 'workbook_set' && y.obj.page_range && y.obj.volume === pg.volume && pg.page >= y.obj.page_range[0] && pg.page <= y.obj.page_range[1]);
    if (x) return x.unit;
    const u = (T0.book.units || []).find((y) => y.page_range && pg.page >= y.page_range[0] && pg.page <= y.page_range[1]);
    return u ? u.id : null;
  }
  async function loadMyGrades() {
    if (!state.db || !state.uid) return false;
    try {
      if (nested()) {
        const d = await state.db.doc(cfg().grade + '/' + seg(state.uid)).get();
        state.myGrades = d.exists ? Object.assign({}, (d.data() || {}).sets || {}) : {};
      } else {
        const ids = C.sets().filter((x) => isOn(state.hw[x.id]) || C.score(x.id).op).map((x) => x.id).slice(0, 40);
        const got = await Promise.all(ids.map((id) => state.db.doc(resPath(id, state.uid, cfg().grade)).get().catch(() => null)));
        const g = {}; got.forEach((d, i) => { if (d && d.exists) g[ids[i]] = d.data(); });
        state.myGrades = g;
      }
      return true;
    } catch (e) { return false; }
  }

  /* ---------------- mở một bộ ---------------- */
  C.openSet = function (id) {
    const x = idx().byId[id];
    const modes = T0.availableModes ? T0.availableModes() : [];
    if (!x) {
      const w = T0.find('workbook', id); // ghim workbook của bộ không có bài tập
      if (w && w.page_range && modes.includes('pin')) return T0.setMode('pin', { target: { page: w.page_range[0], volume: w.volume } });
      T0.ui.toast(T0.s('not_found') + ': ' + id); return null;
    }
    const o = x.obj || {};
    if (x.kind === 'workbook_set') {
      if (modes.includes('lesson')) return T0.setMode('lesson', { target: { workbook: id } });
      if (o.page_range && modes.includes('pin')) return T0.setMode('pin', { target: { page: o.page_range[0], volume: o.volume } });
    } else if (x.kind === 'lesson' && modes.includes('lesson')) {
      return T0.setMode('lesson', { target: { lesson: id } });
    }
    return openSheet(x);
  };
  function openSheet(x) {
    const box = E('div', { class: 't0c-sheet' });
    const m = T0.ui.modal(box, { title: C.setName(x), wide: true });
    const exs = C.exercisesOf(x.id);
    const pg = exs.map((e) => e.page).filter((n) => n != null);
    if (pg.length && T0.availableModes().includes('pin')) {
      box.append(E('div', { class: 't0c-ctl', style: { justifyContent: 'flex-start', marginBottom: '12px' } },
        T0.ui.button(T0.t({ uz: 'Sahifada ochish', ru: 'Открыть на странице', vi: 'Mở trên trang' }) + ' ' + Math.min(...pg), () => { m.close(); T0.setMode('pin', { target: { page: Math.min(...pg), volume: exs[0].volume } }); })));
    }
    exs.forEach((e) => T0.renderEx(box, e));
    return m;
  }

  /* ---------------- kết quả cả lớp (GV) ---------------- */
  async function names(uids) {
    try { if (state.user && uids.length) return (await state.user.profiles(uids)) || {}; } catch (e) { /* */ }
    return {};
  }
  async function classRows(setId) {
    const db = state.db; if (!db) return [];
    let rows = [], grades = {};
    if (nested()) {
      const q = await db.collection(cfg().res).get();
      rows = q.docs.map((d) => { const v = d.data() || {}; const r = (v.sets || {})[setId]; return r ? Object.assign({ set: setId, uid: v.uid || d.id }, r) : null; }).filter(Boolean);
      const g = await db.collection(cfg().grade).get().catch(() => ({ docs: [] }));
      g.docs.forEach((d) => { const v = d.data() || {}; const r = (v.sets || {})[setId]; if (r) grades[v.uid || d.id] = r; });
    } else {
      const q = await db.collection(cfg().res).where('set', '==', setId).get();
      rows = q.docs.map((d) => d.data());
      const g = await db.collection(cfg().grade).where('set', '==', setId).get().catch(() => ({ docs: [] }));
      g.docs.forEach((d) => { const v = d.data() || {}; if (v.uid) grades[v.uid] = v; });
    }
    rows.forEach((r) => { r.grade = grades[r.uid] || null; });
    return rows;
  }
  C.openClass = async function (setId) {
    css();
    const box = E('div', { class: 't0c-cls' }, E('p', { text: s('loading') }));
    const m = T0.ui.modal(box, { title: s('cls') + ' · ' + C.setName(setId), wide: true });
    const slow = setTimeout(() => { if (box.textContent === s('loading')) box.firstChild.textContent = s('slow'); }, 10000);
    let rows = [];
    try { rows = await classRows(setId); } catch (e) { console.warn(e); }
    clearTimeout(slow);
    const nm = await names(rows.map((r) => r.uid));
    rows.sort((a, b) => (b.mark || 0) - (a.mark || 0) || (b.ok || 0) - (a.ok || 0));
    box.innerHTML = '';
    if (rows.length) {
      const tb = E('table', { class: 't0c-tbl' });
      tb.append(E('thead', null, E('tr', null, ...[s('pupil'), s('right'), s('mark') + ' (' + (cfg().scale || '—') + ')', s('open_done'), s('tmark'), ''].map((h) => E('th', { text: h })))));
      const body = E('tbody'); tb.append(body);
      rows.forEach((r) => {
        const name = (nm[r.uid] && nm[r.uid].name) || s('pupil_anon');
        const mk = r.tot ? round1((r.ok / r.tot) * (cfg().scale || 10)) : '—';
        const gbtn = r.op ? T0.ui.button(s('grade_btn'), () => openGrade(setId, r, name, () => C.openClass(setId))) : '';
        body.append(E('tr', null, E('td', { text: name }), E('td', { class: 'n', text: (r.ok || 0) + ' / ' + (r.tot || 0) }), E('td', { class: 'n', text: String(mk) }),
          E('td', { class: 'n', text: (r.opd || 0) + ' / ' + (r.op || 0) }), E('td', { class: 'n', text: r.grade && r.grade.mark != null ? String(r.grade.mark) : '—' }), E('td', null, gbtn)));
      });
      box.append(E('div', { class: 't0c-tblw' }, tb));
    } else box.append(E('p', { text: s('none') }));
    if (!state.db) box.append(E('p', { class: 't0c-note', text: s('offline') }));
    box.append(E('p', null, T0.ui.button('‹ ' + s('hw'), () => { m.close(); })));
    return m;
  };

  /* ---------------- GV chấm câu mở ---------------- */
  function valText(v) {
    if (v == null || v === '') return s('no_answer');
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return v.filter((x) => x != null && x !== '').join('\n');
    return Object.entries(v).filter(([, x]) => x != null && x !== '').map(([k, x]) => k + ': ' + x).join('\n');
  }
  async function openGrade(setId, r, name, onDone) {
    const db = state.db; let detail = r;
    if (nested() && db) { try { const d = await db.doc(resPath(setId, r.uid)).get(); if (d.exists) detail = d.data(); } catch (e) { /* */ } }
    let prev = r.grade;
    if (nested() && db) { try { const d = await db.doc(resPath(setId, r.uid, cfg().grade)).get(); if (d.exists) prev = d.data(); } catch (e) { /* */ } }
    prev = prev || { items: {} };
    const A = detail.answers || {};
    const box = E('div', { class: 't0c-grade' });
    const m = T0.ui.modal(box, { title: s('grade_btn') + ' · ' + name, wide: true });
    const sc = C.score(setId, A);
    box.append(E('p', { class: 't0c-intro', text: s('auto_part') + ': ' + sc.ok + ' / ' + sc.tot }));
    const inputs = [];
    C.exercisesOf(setId).forEach((ex) => C.units(ex).forEach((u) => {
      if (u.auto) return;
      const a = A[u.key] || {}; const g = (prev.items || {})[u.key] || {};
      const max = g.max || 2;
      const num = E('input', { type: 'number', min: '0', max: String(max), step: '0.5', value: g.score != null ? String(g.score) : '', 'aria-label': s('score') });
      const cm = E('textarea', { 'aria-label': s('comment'), placeholder: s('comment') }); cm.value = g.comment || '';
      const q = E('div', { class: 't0c-q' },
        E('div', { class: 'p', text: ([ex.no ? '№' + ex.no : null, u.it !== ex ? u.it.label : null].filter(Boolean).join(' ') + ' ' + (T0.t(u.it.prompt) || T0.t(ex.prompt) || T0.t(ex.title) || (ex.page ? 'p. ' + ex.page + ' · ' : '') + ex.id)).trim() }),
        E('div', { class: 'a', text: valText(a.v) }),
        a.ai ? E('div', { class: 'ai', text: s('ai') + ': ' + (a.ai.score != null ? a.ai.score + '/2 · ' : '') + (a.ai.feedback || '') }) : null,
        E('div', { class: 'r' }, E('label', { class: 't0c-chk' }, s('score') + ' ', num, ' / ' + max)), cm);
      box.append(q);
      inputs.push({ key: u.key, num, cm, max, prev: g });
    }));
    if (!inputs.length) box.append(E('p', { text: s('no_open') }));
    const fin = E('input', { type: 'number', min: '0', max: String(cfg().scale || 10), step: '0.1', 'aria-label': s('final') });
    const calc = () => {
      let pts = sc.okExact, n = sc.tot;
      inputs.forEach((x) => { n++; const v = parseFloat(x.num.value); if (!isNaN(v)) pts += Math.max(0, Math.min(x.max, v)) / x.max; });
      return n ? round1((pts / n) * (cfg().scale || 10)) : null;
    };
    fin.value = prev.mark != null ? String(prev.mark) : '';
    fin.placeholder = String(calc() == null ? '' : calc());
    let touched = prev.mark != null;
    fin.oninput = () => { touched = true; };
    inputs.forEach((x) => { x.num.oninput = () => { fin.placeholder = String(calc() == null ? '' : calc()); if (!touched) fin.value = ''; }; });
    const saveB = T0.ui.button(s('save'), async () => {
      saveB.disabled = true;
      const now = Date.now(); const items = {};
      inputs.forEach((x) => {
        const v = parseFloat(x.num.value);
        if (isNaN(v) && !x.cm.value.trim()) return;
        const it = { max: x.max, ts: now };
        if (!isNaN(v)) it.score = Math.max(0, Math.min(x.max, v));
        if (x.cm.value.trim()) it.comment = x.cm.value.trim();
        items[x.key] = it;
      });
      const fv = parseFloat(fin.value);
      const mark = !isNaN(fv) ? fv : calc();
      const doc = { set: setId, uid: r.uid, items, mark: mark == null ? null : mark, ts: now };
      if (state.uid) doc.by = state.uid;
      try {
        if (!db) throw new Error('no db');
        const p = resPath(setId, r.uid, cfg().grade);
        await queue(p, () => db.doc(p).set(doc));
        if (nested()) {
          const sp = cfg().grade + '/' + seg(r.uid);
          await queue(sp, async () => { const d = await db.doc(sp).get(); const cur = d.exists ? JSON.parse(JSON.stringify(d.data())) : { uid: r.uid, sets: {} }; cur.uid = r.uid; cur.sets = Object.assign({}, cur.sets, { [setId]: { mark: doc.mark, ts: now } }); cur.ts = now; return db.doc(sp).set(cur); });
        }
        T0.ui.toast(s('saved')); m.close(); onDone && onDone();
      } catch (e) { saveB.disabled = false; T0.ui.toast(s('save_fail')); }
    }, 'primary');
    box.append(E('div', { class: 't0c-fin' }, E('label', { class: 't0c-chk' }, s('final') + ' ', fin, ' / ' + (cfg().scale || 10)), saveB));
  }
  C._openGrade = openGrade;

  /* ---------------- thanh điểm vở (chế độ ghim) ---------------- */
  let bar = null;
  function setAtPage(pg) {
    if (!pg) return null;
    return C.sets().find((x) => x.kind === 'workbook_set' && x.obj.page_range && (!x.obj.volume || !pg.volume || x.obj.volume === pg.volume) && pg.page >= x.obj.page_range[0] && pg.page <= x.obj.page_range[1]) || null;
  }
  function renderBar() {
    if (!state || !document.body) return;
    const x = T0.currentMode && T0.currentMode() === 'pin' ? setAtPage(state.lastPage) : null;
    if (!x) { if (bar) bar.hidden = true; document.body.classList.remove('t0c-has-bar'); return; }
    css();
    if (!bar) { bar = E('div', { class: 't0c-bar', role: 'status', 'aria-live': 'polite', 'data-t0-under-modal': '' }); document.body.append(bar); }
    const sc = C.score(x.id); const a = state.hw[x.id] || {};
    bar.innerHTML = '';
    bar.append(...[E('span', { class: 'nm', title: C.setName(x), text: C.setName(x) }),
      E('span', { class: 'sc', text: sc.tot ? sc.ok + ' / ' + sc.tot : sc.opd + ' / ' + sc.op }),
      sc.mark != null && sc.okExact ? E('span', { class: 'mk', text: sc.mark + ' / ' + cfg().scale }) : null,
      isOn(a) ? E('span', { class: 't0c-badge', text: s('assigned') + (a.due ? ' · ' + a.due : '') }) : null,
      E('button', { class: 't0-btn', type: 'button', onclick: () => C.openHW(), 'aria-label': s('hw'), title: s('hw') }, E('span', { 'aria-hidden': 'true', html: ICON }), E('span', { class: 't0c-bl', text: s('hw') }))].filter(Boolean));
    bar.hidden = false;
    document.body.classList.add('t0c-has-bar');
  }
  C.renderBar = renderBar;

  /* (D, 20/11) Phần chặn tạm ghim workbook ở pha capture đã gỡ: modes/pin.js gọi thẳng C.openSet(ref). */

  /* ---------------- video thật của GV (media/) ---------------- */
  function hasMediaTargets() {
    const F = (T0.features || {}).features || {};
    return !!(F.teacher_media_replace || (T0.book.teacher && T0.book.teacher.media_overrides) || (T0.book.simulations || []).some((x) => (x.params || {}).teacher_media_replace));
  }
  function mediaTargets() {
    const b = T0.book;
    const v = (b.videos || []).map((x) => ({ id: x.id, title: T0.t(x.title) || x.id }));
    const sims = (b.simulations || []).filter((x) => (x.params || {}).teacher_media_replace).map((x) => ({ id: x.id, title: T0.t(x.title) || x.id }));
    return v.concat(sims);
  }
  C.mediaFor = function (id, lang) {
    if (!state) return null;
    const src = state.media[id] || ((T0.book.teacher || {}).media_overrides || {})[id];
    if (!src) return null;
    const by = src.by || { all: src };
    const l = lang || T0.lang;
    const o = by[l] || by.all || null;
    if (!o || o.mode === 'default') return null;
    const url = o.mode === 'asset' && o.asset ? (/^(https?:|\/)/.test(o.asset) ? o.asset : '/_blob/' + o.asset) : o.url;
    return url ? Object.assign({}, o, { src: url }) : null;
  };
  C.openMedia = function () {
    css();
    const box = E('div');
    const m = T0.ui.modal(box, { title: s('videos'), wide: true });
    const langs = ['all'].concat(T0.LANGS);
    mediaTargets().forEach((t) => {
      const cur = (state.media[t.id] && state.media[t.id].by) || {};
      const sel = E('select', { 'aria-label': 'lang' }, ...langs.map((l) => E('option', { value: l, text: l === 'all' ? s('all_langs') : l })));
      const url = E('input', { type: 'url', placeholder: s('video_url'), 'aria-label': s('video_url') });
      const file = E('input', { type: 'file', accept: 'video/*', 'aria-label': s('video_up') });
      const showCur = () => { const o = cur[sel.value]; url.value = o && o.mode === 'url' ? o.url || '' : ''; };
      sel.onchange = showCur; showCur();
      const save = async (val) => {
        const by = Object.assign({}, cur);
        if (val) by[sel.value] = val; else delete by[sel.value];
        const p = cfg().media + '/' + seg(t.id);
        try {
          if (!state.db) throw new Error('no db');
          if (Object.keys(by).length) await queue(p, () => state.db.doc(p).set({ by })); else await queue(p, () => state.db.doc(p).delete());
          Object.keys(cur).forEach((k) => delete cur[k]); Object.assign(cur, by);
          T0.ui.toast(s('saved')); T0.emit('t0:mediaoverride', { id: t.id });
        } catch (e) { T0.ui.toast(s('save_fail')); }
      };
      const up = async () => {
        const f = file.files && file.files[0]; if (!f) return save(url.value.trim() ? { mode: 'url', url: url.value.trim() } : null);
        if (f.size > 20 * 1024 * 1024) { T0.ui.toast(s('too_big')); return; }
        try { const as = await window.claude.use('assets'); if (!as) throw new Error('no assets'); T0.ui.toast(s('uploading')); const r = await as.upload(f); await save({ mode: 'asset', asset: r.id, title: f.name }); }
        catch (e) { T0.ui.toast(s('save_fail')); }
      };
      box.append(E('div', { class: 't0c-vrow' }, E('b', { text: t.title }), E('div', { class: 'r' }, sel, E('span', { class: 't0c-sub', text: Object.keys(cur).join(', ') })), url,
        E('label', { class: 't0c-note' }, s('video_up') + ' ', file),
        E('div', { class: 'r' }, T0.ui.button(s('save'), up, 'primary'), T0.ui.button(s('delete'), () => save(null)))));
    });
    return m;
  };

  /* ---------------- vòng đời ---------------- */
  function init() {
    if (state) { state.unsub.forEach((u) => { try { u(); } catch (e) { /* */ } }); Object.values(state.pend).forEach(clearTimeout); }
    state = fresh();
    if (!C.enabled()) { if (btn) btn.hidden = true; renderBar(); return; }
    if (!btn) { const host = document.getElementById('t0-tools'); C.mountButton(host || null); } else refreshButton();
    renderBar();
    connect(state);
  }
  C._state = () => state;
  C.init = init;
  T0.on('t0:load', init);
  T0.on('t0:exresult', (e) => { try { C.record(e.detail); } catch (err) { console.error(err); } refreshButton(); });
  T0.on('t0:page', (e) => { if (!state) return; state.lastPage = e.detail || null; renderBar(); });
  T0.on('t0:mode', () => renderBar());
  T0.on('t0:answer', () => renderBar());
  T0.on('t0:lang', () => { refreshButton(); renderBar(); });
  T0.on('t0:migrated', (e) => { if (!state) return; state.ans = null; ((e.detail && e.detail.exercises) || []).forEach((id) => C.setsOf(id).forEach(schedulePush)); refreshButton(); renderBar(); });
  if (T0.book) setTimeout(init, 0);
})();
