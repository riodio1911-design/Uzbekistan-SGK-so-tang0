/* components/ex/_chung.js — agent C (đợt 1, đề xuất 002/003). Tiện ích dùng chung cho các renderer ex.* mới.
 * Nạp trước các file ex/*.js khác (build.py sắp theo tên; '_' đứng trước chữ cái). Các renderer chỉ gọi T0.exu lúc render,
 * nên thứ tự nạp không bắt buộc tuyệt đối.
 * Cung cấp: T0.exu = {el, t, s, css, store, asset, perm, imgOrPage, chip, norm, mapBank, hideHead}
 * Chuỗi giao diện: T0.addStrings({exc_*}) -> T0.s('exc_*'), đủ uz/ru/vi. */
(function () {
  const T0 = window.T0;
  if (!T0) return;
  const STR = {
    exc_up: { uz: 'Yuqoriga', ru: 'Выше', vi: 'Lên' },
    exc_down: { uz: 'Pastga', ru: 'Ниже', vi: 'Xuống' },
    exc_drag: { uz: 'Sudrash', ru: 'Перетащить', vi: 'Kéo' },
    exc_order_hint: { uz: '▲▼ tugmalari yoki sudrash bilan tartibni o‘zgartiring.', ru: 'Меняйте порядок кнопками ▲▼ или перетаскиванием.', vi: 'Dùng nút ▲▼ hoặc kéo thả để đổi thứ tự.' },
    exc_cycle: { uz: 'Doira: oxirgisidan keyin yana birinchisi keladi.', ru: 'Цикл: после последнего снова идёт первый.', vi: 'Vòng tròn: sau bước cuối lại quay về bước đầu.' },
    exc_true: { uz: 'To‘g‘ri', ru: 'Верно', vi: 'Đúng' },
    exc_false: { uz: 'Noto‘g‘ri', ru: 'Неверно', vi: 'Sai' },
    exc_not_all: { uz: 'Hamma qatorlarga javob bering.', ru: 'Ответьте на все строки.', vi: 'Hãy trả lời hết các dòng.' },
    exc_empty: { uz: 'Avval javob bering.', ru: 'Сначала дайте ответ.', vi: 'Hãy trả lời trước đã.' },
    exc_all_right: { uz: 'Barakalla! Hammasi to‘g‘ri.', ru: 'Молодец! Всё верно.', vi: 'Giỏi lắm! Tất cả đều đúng.' },
    exc_some_wrong: { uz: 'Qizil bilan belgilanganlarni qayta ko‘ring.', ru: 'Проверьте то, что отмечено красным.', vi: 'Hãy xem lại các ô viền đỏ.' },
    exc_done: { uz: 'Bajardim', ru: 'Выполнено', vi: 'Em đã làm xong' },
    exc_kind_topshiriq: { uz: 'Topshiriq', ru: 'Задание', vi: 'Nhiệm vụ' },
    exc_kind_uyga: { uz: 'Uyga vazifa', ru: 'Домашнее задание', vi: 'Bài về nhà' },
    exc_kind_ijodiy: { uz: 'Ijodiy ish', ru: 'Творческая работа', vi: 'Bài sáng tạo' },
    exc_marked: { uz: 'Belgilandi', ru: 'Отмечено', vi: 'Đã đánh dấu' },
    exc_rec: { uz: 'Yozib olish', ru: 'Записать', vi: 'Ghi âm' },
    exc_stop: { uz: 'To‘xtatish', ru: 'Остановить', vi: 'Dừng' },
    exc_file: { uz: 'Audio fayl tanlash', ru: 'Выбрать аудиофайл', vi: 'Chọn tệp âm thanh' },
    exc_rec_local: { uz: 'Yozuv faqat shu qurilmada qoladi, hech qayerga yuborilmaydi.', ru: 'Запись остаётся только на этом устройстве и никуда не отправляется.', vi: 'Bản ghi chỉ ở trên máy này, không gửi đi đâu.' },
    exc_no_mic: { uz: 'Mikrofon ishlamadi – fayl tanlang.', ru: 'Микрофон недоступен – выберите файл.', vi: 'Không dùng được micro – hãy chọn tệp.' },
    exc_recording: { uz: 'Yozilmoqda…', ru: 'Идёт запись…', vi: 'Đang ghi…' },
    exc_pen: { uz: 'Qalam', ru: 'Карандаш', vi: 'Bút' },
    exc_eraser: { uz: 'O‘chirg‘ich', ru: 'Ластик', vi: 'Tẩy' },
    exc_undo: { uz: 'Bekor qilish', ru: 'Отменить', vi: 'Hoàn tác' },
    exc_clear: { uz: 'Tozalash', ru: 'Очистить', vi: 'Xoá hết' },
    exc_draw_hint: { uz: 'Barmoq yoki sichqoncha bilan chizing.', ru: 'Рисуйте пальцем или мышью.', vi: 'Vẽ bằng ngón tay hoặc chuột.' },
    exc_show_all: { uz: 'Hammasini ko‘rsatish', ru: 'Показать все', vi: 'Hiện tất cả' },
    exc_hide_all: { uz: 'Yashirish', ru: 'Скрыть все', vi: 'Ẩn tất cả' },
    exc_reveal_hint: { uz: 'Raqamni bosing – nomi ochiladi. Avval o‘zingiz eslab ko‘ring.', ru: 'Нажмите на номер – откроется название. Сначала попробуйте вспомнить сами.', vi: 'Chạm vào số để hiện tên. Hãy tự nhớ trước đã.' },
    exc_revealed: { uz: 'Ochildi', ru: 'Открыто', vi: 'Đã mở' },
    exc_match_hint: { uz: 'Chapdan birini, so‘ng o‘ngdan mosini bosing.', ru: 'Нажмите элемент слева, затем подходящий справа.', vi: 'Chạm một ô bên trái rồi ô phù hợp bên phải.' },
    exc_label_hint: { uz: 'Nomni tanlang, so‘ng rasmdagi katakni bosing.', ru: 'Выберите название, затем нажмите на клетку на рисунке.', vi: 'Chọn một tên rồi chạm vào ô trên hình.' },
    exc_across: { uz: 'Gorizontal', ru: 'По горизонтали', vi: 'Hàng ngang' },
    exc_down_w: { uz: 'Vertikal', ru: 'По вертикали', vi: 'Hàng dọc' },
    exc_type_word: { uz: 'So‘zni yozing', ru: 'Введите слово', vi: 'Gõ từ' },
    exc_cw_hint: { uz: 'Savolni tanlang va javobni yozing (lotin yozuvida).', ru: 'Выберите вопрос и впишите ответ (латиницей, по-узбекски).', vi: 'Chọn câu hỏi rồi gõ đáp án (tiếng Uzbek, chữ Latinh).' },
    exc_letters: { uz: 'harf', ru: 'букв', vi: 'ô' },
    exc_sheet_hint: { uz: 'Sonlarni o‘zgartiring – natija qayta hisoblanadi. Katakni bosib, formulasini ko‘ring.', ru: 'Меняйте числа – результат пересчитается. Нажмите на ячейку, чтобы увидеть формулу.', vi: 'Sửa số – kết quả tự tính lại. Chạm vào ô để xem công thức.' },
    exc_formula: { uz: 'Formula', ru: 'Формула', vi: 'Công thức' },
    exc_example: { uz: 'Misol', ru: 'Пример', vi: 'Ví dụ' },
    exc_prediction: { uz: 'Bashoratingiz', ru: 'Ваш прогноз', vi: 'Dự đoán của em' },
    exc_result: { uz: 'Natija va taqqoslash', ru: 'Результат и сравнение', vi: 'Kết quả và so sánh' },
    exc_no_sim: { uz: 'Virtual tajriba topilmadi', ru: 'Виртуальный опыт не найден', vi: 'Không tìm thấy thí nghiệm ảo' },
    exc_bank: { uz: 'So‘zlar', ru: 'Слова', vi: 'Từ cho sẵn' },
    exc_answer: { uz: 'Javob', ru: 'Ответ', vi: 'Đáp án' },
    exc_free: { uz: 'Boshqa…', ru: 'Другое…', vi: 'Ý khác…' },
    exc_factor: { uz: 'Tanlangan omil', ru: 'Выбранный фактор', vi: 'Yếu tố đã chọn' },
    exc_indep: { uz: 'O‘zgartiriladigan (erkli) o‘zgaruvchi', ru: 'Изменяемая (независимая) переменная', vi: 'Biến thay đổi (độc lập)' },
    exc_dep: { uz: 'O‘lchanadigan (erksiz) o‘zgaruvchi', ru: 'Измеряемая (зависимая) переменная', vi: 'Biến đo được (phụ thuộc)' },
    exc_ctrl: { uz: 'O‘zgarishsiz saqlanadigan o‘zgaruvchilar', ru: 'Контролируемые переменные', vi: 'Biến giữ nguyên (kiểm soát)' },
    exc_ev1: { uz: 'Erkli o‘zgaruvchi = tanlangan omil', ru: 'Независимая переменная = выбранный фактор', vi: 'Biến độc lập = yếu tố đã chọn' },
    exc_ev2: { uz: 'Erksiz o‘zgaruvchi to‘g‘ri tanlangan', ru: 'Зависимая переменная выбрана верно', vi: 'Chọn đúng biến phụ thuộc' },
    exc_ev3: { uz: 'Kamida 2 ta nazorat o‘zgaruvchisi, tanlangan omilsiz', ru: 'Не меньше 2 контролируемых переменных, без выбранного фактора', vi: 'Ít nhất 2 biến kiểm soát, không gồm yếu tố đã chọn' },
  };
  T0.addStrings && T0.addStrings(STR);

  const CSS = `
.exc-hint{margin:0 0 var(--space-2,8px);color:var(--color-ink-2);font-size:var(--text-sm,13px);line-height:1.4}
.exc-chip{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:var(--touch-min,44px);min-width:var(--touch-min,44px);padding:6px 14px;border:1.5px solid var(--color-line);border-radius:var(--radius-pill,999px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);line-height:1.3;cursor:pointer;text-align:left;max-width:100%;overflow-wrap:anywhere}
.exc-chip[aria-pressed="true"],.exc-chip[aria-checked="true"]{border-color:var(--color-accent);background:var(--color-accent-soft);color:var(--color-ink)}
.exc-chip.ok,.exc-ok{border-color:var(--color-ok)!important;background:var(--color-ok-soft)!important}
.exc-chip.bad,.exc-bad{border-color:var(--color-bad)!important;background:var(--color-bad-soft)!important}
.exc-chip.sol{outline:2px dashed var(--color-ok);outline-offset:2px}
.exc-chip:focus-visible,.exc-btn:focus-visible,.exc-in:focus-visible{outline:3px solid var(--color-accent);outline-offset:2px}
.exc-chip[disabled]{cursor:default;opacity:.75}
.exc-chips{display:flex;flex-wrap:wrap;gap:var(--space-2,8px)}
.exc-btn{display:inline-flex;align-items:center;justify-content:center;min-width:var(--touch-min,44px);min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);cursor:pointer;padding:0 10px}
.exc-btn[disabled]{opacity:.35;cursor:default}
.exc-in{min-height:var(--touch-min,44px);border:1.5px solid var(--color-line);border-radius:var(--radius-sm,6px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-body,16px);padding:0 10px;min-width:0;max-width:100%}
textarea.exc-in{width:100%;min-height:88px;padding:8px 10px;line-height:var(--lh-body,1.5);resize:vertical}
.exc-img{display:block;max-width:100%;height:auto;border-radius:var(--radius-sm,6px);background:var(--color-page-paper)}
.exc-sol{background:var(--color-highlight-soft);border-radius:var(--radius-md,10px);padding:var(--space-2,8px) var(--space-3,12px);font-size:var(--text-ui,15px);line-height:var(--lh-body,1.5);margin-top:var(--space-2,8px)}
.exc-q{margin:0 0 var(--space-3,12px)}
.exc-q:last-child{margin-bottom:0}
.exc-qt{margin:0 0 6px;line-height:var(--lh-body,1.5)}
.exc-qt b{color:var(--color-ink-2);margin-right:4px}
.exc-tag{display:inline-block;font-size:var(--text-xs,12px);font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:var(--color-accent-ink);background:var(--color-accent-soft);border-radius:var(--radius-pill,999px);padding:2px 10px}
.exc-check{display:flex;align-items:flex-start;gap:var(--space-3,12px);width:100%;min-height:var(--touch-min,44px);padding:10px 12px;border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);line-height:1.4;text-align:left;cursor:pointer}
.exc-check .box{flex:none;width:24px;height:24px;border-radius:6px;border:2px solid var(--color-line);display:inline-flex;align-items:center;justify-content:center;color:var(--color-on-accent);font-size:16px;font-weight:800;line-height:1}
.exc-check[aria-checked="true"]{border-color:var(--color-accent);background:var(--color-accent-soft)}
.exc-check[aria-checked="true"] .box{background:var(--color-accent);border-color:var(--color-accent)}
.exc-check[aria-checked="true"] .box::after{content:'✓'}
.exc-list{display:grid;gap:var(--space-2,8px);margin:0;padding:0;list-style:none}
`;
  function css(id, text) {
    if (document.getElementById(id)) return;
    const s = document.createElement('style'); s.id = id; s.textContent = text; document.head.append(s);
  }
  css('exc-common-css', CSS);

  const E = (...a) => T0.ui.el(...a);
  const t = (o) => (o && typeof o === 'object' && !Array.isArray(o) && ('text' in o) && !('uz' in o) ? T0.t(o.text) : T0.t(o));

  /* ---- T0.sheet: MỘT bộ tính bảng tính cho ex.spreadsheet (C) và sim.spreadsheet_mini (E). Không dùng eval/Function.
   * rows: hàng 0 = tên cột ('', 'A', 'B'…), cột 0 = số hàng. Hỗ trợ + - * / × ÷ ( ), số (, hoặc .), ô A1 (cột nhiều chữ),
   * ô chứa công thức được tính đệ quy (chặn vòng lặp), SUM/AVERAGE/MAX/MIN/COUNT với vùng A1:B3 hoặc danh sách (',' hoặc ';').
   * T0.sheet.eval(rows, '=…') -> chuỗi: số làm tròn 4 chữ số, dấu thập phân ','; '#NAME?' (hàm lạ, ký tự lạ, sai cú pháp),
   *   '#ERR' (chia 0, vòng lặp, không hữu hạn). T0.sheet.value(rows, 'B5') -> số (ném lỗi). T0.sheet.make(rows) -> {value, raw}. */
  const SheetErr = (code) => Object.assign(new Error(code), { code });
  function makeSheet(rows) {
    rows = rows || [];
    const head = rows[0] || [];
    const colIdx = (L) => head.findIndex((h, i) => i > 0 && String(h).toUpperCase() === L);
    const rowIdx = (n) => rows.findIndex((r, i) => i > 0 && String(r[0]) === String(n));
    const raw = (addr) => { const m = /^([A-Z]+)(\d+)$/.exec(addr); if (!m) return null; const c = colIdx(m[1]), r = rowIdx(m[2]); return c < 0 || r < 0 ? null : rows[r][c]; };
    const num = (s) => { const v = parseFloat(String(s).replace(',', '.').replace(/\s/g, '')); return isNaN(v) ? 0 : v; };
    function value(addr, seen) {
      seen = seen || new Set();
      if (seen.has(addr)) throw SheetErr('#ERR');
      const s = raw(addr);
      if (s == null || s === '') return 0;
      if (String(s).trim().startsWith('=')) { seen.add(addr); const v = evalF(String(s).trim().slice(1), seen); seen.delete(addr); return v; }
      return num(s);
    }
    function range(a, b) {
      const ma = /^([A-Z]+)(\d+)$/.exec(a), mb = /^([A-Z]+)(\d+)$/.exec(b); if (!ma || !mb) throw SheetErr('#NAME?');
      const ca = colIdx(ma[1]), cb = colIdx(mb[1]); if (ca < 0 || cb < 0) throw SheetErr('#NAME?');
      const out = [];
      const c1 = Math.min(ca, cb), c2 = Math.max(ca, cb), r1 = Math.min(+ma[2], +mb[2]), r2 = Math.max(+ma[2], +mb[2]);
      for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) out.push(head[c] + r);
      return out;
    }
    function evalF(srcIn, seen) {
      const src = String(srcIn).toUpperCase().replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, '');
      const toks = src.match(/\d+(?:[.,]\d+)?|[A-Z]+\d+|[A-Z]+|[-+*/():;,]/g) || [];
      if (toks.join('') !== src) throw SheetErr('#NAME?');
      let p = 0;
      const peek = () => toks[p], eat = (t) => { if (toks[p] !== t) throw SheetErr('#NAME?'); p++; };
      function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const o = toks[p++]; const w = term(); v = o === '+' ? v + w : v - w; } return v; }
      function term() { let v = fac(); while (peek() === '*' || peek() === '/') { const o = toks[p++]; const w = fac(); if (o === '/' && w === 0) throw SheetErr('#ERR'); v = o === '*' ? v * w : v / w; } return v; }
      function args() {
        const vals = [];
        eat('(');
        while (peek() !== ')') {
          if (peek() == null) throw SheetErr('#NAME?');
          if (/^[A-Z]+\d+$/.test(peek()) && toks[p + 1] === ':') { const a = toks[p]; p += 2; const b = toks[p++]; range(a, b).forEach((x) => vals.push(value(x, seen))); }
          else vals.push(expr());
          if (peek() === ';' || peek() === ',') p++; else if (peek() !== ')') throw SheetErr('#NAME?');
        }
        eat(')');
        return vals;
      }
      const F = { SUM: (a) => a.reduce((s, x) => s + x, 0), AVERAGE: (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0), MAX: (a) => (a.length ? Math.max(...a) : 0), MIN: (a) => (a.length ? Math.min(...a) : 0), COUNT: (a) => a.length };
      function fac() {
        const t = toks[p++];
        if (t == null) throw SheetErr('#NAME?');
        if (t === '-') return -fac();
        if (t === '+') return fac();
        if (t === '(') { const v = expr(); eat(')'); return v; }
        if (/^\d/.test(t)) return num(t);
        if (/^[A-Z]+\d+$/.test(t)) return value(t, seen);
        if (F[t]) return F[t](args());
        throw SheetErr('#NAME?');
      }
      const v = expr();
      if (p !== toks.length) throw SheetErr('#NAME?');
      return v;
    }
    return { value: (addr, seen) => value(String(addr).toUpperCase(), seen), raw, evalF };
  }
  T0.sheet = {
    make: makeSheet,
    value: (rows, addr) => makeSheet(rows).value(addr),
    eval(rows, f) {
      if (f == null || f === '') return '';
      try {
        const v = makeSheet(rows).evalF(String(f).trim().replace(/^=/, ''), new Set());
        return Number.isFinite(v) ? String(+v.toFixed(4)).replace('.', ',') : '#ERR';
      } catch (e) { return e && e.code ? e.code : '#NAME?'; }
    },
  };

  T0.exu = {
    el: E, t, s: (k) => T0.s(k), css,
    // lưu đáp án người học: khóa '<storeKey>:ans' (storeKey do core đặt: 'ex:<id>')
    store(ctx, ex) {
      const key = ((ctx && ctx.storeKey) || ('ex:' + (ex.id || ex.kind))) + ':ans';
      return {
        get(def) { try { const v = T0.store.get(key); return v == null ? def : v; } catch (e) { return def; } },
        set(v) { try { T0.store.set(key, v); } catch (e) { /* bỏ qua */ } },
        key,
      };
    },
    // bản đồ đáp án dùng chung với ô trên trang vở (core T0.answers, 'ex:<id>:v'); không có core mới thì là no-op
    ans(ex) {
      const ok = !!(T0.answers && ex && ex.id);
      return {
        get() { try { return ok ? T0.answers.get(ex.id) : {}; } catch (e) { return {}; } },
        set(k, v) { try { if (ok) T0.answers.set(ex.id, String(k), v == null ? '' : String(v), { src: 'ex' }); } catch (e) { /* */ } },
        clear() { try { if (ok) T0.store.remove(T0.answers.key(ex.id)); } catch (e) { /* */ } },
      };
    },
    asset: (p) => (!p ? '' : T0.asset(p)),
    // hoán vị hiển thị: dùng 'given' nếu là hoán vị hợp lệ, nếu không thì xáo ngẫu nhiên (không trùng thứ tự đúng khi n>1)
    perm(n, given) {
      if (Array.isArray(given) && given.length === n && [...given].sort((a, b) => a - b).every((v, i) => v === i)) return given.slice();
      const a = [...Array(n).keys()];
      if (n < 2) return a;
      for (let k = 0; k < 20; k++) {
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        if (a.some((v, i) => v !== i)) return a;
      }
      return a.reverse();
    },
    // ảnh: đường dẫn ảnh, hoặc dự phòng là phần cắt trang {page, box, volume}
    imgOrPage(src, page, opts = {}) {
      if (src) {
        const img = E('img', { class: 'exc-img', src: T0.asset(src), alt: opts.alt || '', loading: 'lazy', draggable: 'false' });
        if (page && page.page) img.onerror = () => { const c = T0.ui.pageCrop(page.page, page.box || [0, 0, 100, 100], { volume: page.volume }); img.replaceWith(c); };
        else img.onerror = () => { img.style.display = 'none'; };
        return img;
      }
      if (page && page.page) return T0.ui.pageCrop(page.page, page.box || [0, 0, 100, 100], { volume: page.volume });
      return null;
    },
    chip(label, attrs) { return E('button', Object.assign({ type: 'button', class: 'exc-chip' }, attrs || {}), label); },
    norm: (s) => (T0.grade ? T0.grade.norm(s) : String(s || '').toLowerCase().trim()),
    // từ người học gõ/chọn theo ngôn ngữ giao diện -> dạng uz của từ trong ngân hàng (thư viện: "lưu dạng uz của từ trong bank")
    mapBank(v, bank) {
      const n = T0.exu.norm(v);
      if (!n || !Array.isArray(bank)) return v;
      for (const w of bank) {
        if (w && typeof w === 'object') { if (Object.values(w).some((x) => T0.exu.norm(x) === n)) return w.uz || Object.values(w)[0]; }
        else if (T0.exu.norm(w) === n) return w;
      }
      return v;
    },
    // renderer tự vẽ lời dẫn (ví dụ fill_blanks có chỗ trống nằm trong lời dẫn): ẩn phần đầu do core vẽ
    hideHead(el) {
      const w = el.closest && el.closest('.t0-ex');
      const h = w && w.querySelector(':scope > .t0-ex-head .t0-ex-prompt');
      if (h) h.hidden = true;
    },
  };
})();
