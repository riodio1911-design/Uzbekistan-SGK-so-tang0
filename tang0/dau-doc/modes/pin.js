/* Chế độ nền "trang gốc + ghim" (R1 → D, tầng 0 v0.10).
 * Ảnh trang theo bản in (images[uz|ru]); vùng chạm dịch `tr` (bong bóng theo T0.lang); ghim `pins` (tọa độ %)
 * mở bài tập / hình / video / mô phỏng / thuật ngữ trong modal, ghim audio phát clip. Lật trang (nút, ←/→, vuốt), phóng to.
 * Bản in khác bản dàn trang (vd. pages_ru): tọa độ `tr` thuộc bản dàn trang (profile.edition.layout_from || lang_base)
 * nên ẩn vùng dịch, ghim dồn thành cột lề phải (như kimyo8 cũ); bản dịch xem ở ngăn "Tarjima".
 * 010: trang dựng lại chữ thật (background + text_lines, không cần images) vẽ bằng T0.printPage (dùng chung với
 *      reading.js); đổi uz/ru/vi trong cùng hộp chữ; dòng có reading.anchors bấm nghe (thay chấm text_anchor).
 * 008: pages[].fields vẽ thành ô nhập đè đúng box (%); đáp án ghi vào T0.answers ('ex:<id>:v') – cùng chỗ với modal
 *      bài tập nên hai chiều đồng bộ; "Kiểm tra trang" chấm các ô chấm được. Màn hẹp: chạm ô → bảng nhập lớn.
 */
(function () {
  const T0 = window.T0;
  const L = {
    label: { uz: 'Sahifa', ru: 'Страницы', vi: 'Trang gốc' },
    prev: { uz: 'Oldingi sahifa', ru: 'Предыдущая страница', vi: 'Trang trước' },
    next: { uz: 'Keyingi sahifa', ru: 'Следующая страница', vi: 'Trang sau' },
    page: { uz: 'Sahifa', ru: 'Стр.', vi: 'Trang' },
    edition: { uz: 'Nashr', ru: 'Издание', vi: 'Bản in' },
    tr: { uz: 'Tarjima', ru: 'Перевод', vi: 'Bản dịch' },
    trShow: { uz: 'Tarjima joylarini ko‘rsatish', ru: 'Показать места перевода', vi: 'Hiện vùng có bản dịch' },
    pins: { uz: 'Belgilar', ru: 'Значки', vi: 'Ghim' },
    zoomIn: { uz: 'Kattalashtirish', ru: 'Увеличить', vi: 'Phóng to' },
    zoomOut: { uz: 'Kichiklashtirish', ru: 'Уменьшить', vi: 'Thu nhỏ' },
    listen: { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' },
    onPage: { uz: 'Sahifadagi belgilar', ru: 'Значки на странице', vi: 'Ghim trên trang' },
    missing: { uz: 'Bu parchada ma’lumot yo‘q', ru: 'В этом фрагменте нет данных', vi: 'Bản trích chưa có dữ liệu này' },
    noTr: { uz: 'Bu sahifada tarjima yo‘q', ru: 'На этой странице нет перевода', vi: 'Trang này chưa có bản dịch' },
    scan: { uz: 'Asl sahifa rasmi', ru: 'Скан страницы', vi: 'Ảnh trang gốc' },
    checkPage: { uz: 'Sahifani tekshirish', ru: 'Проверить страницу', vi: 'Kiểm tra trang' },
    checkShort: { uz: 'Tekshirish', ru: 'Проверить', vi: 'Kiểm tra' },
    nothing: { uz: 'Hali hech narsa yozilmagan', ru: 'Пока ничего не заполнено', vi: 'Chưa điền ô nào' },
    saved: { uz: 'Javoblar saqlandi', ru: 'Ответы сохранены', vi: 'Đã lưu câu trả lời' },
    answer: { uz: 'Javob', ru: 'Ответ', vi: 'Câu trả lời' },
    done: { uz: 'Tayyor', ru: 'Готово', vi: 'Xong' },
    back: { uz: 'Orqaga', ru: 'Назад', vi: 'Quay lại' },
    term: { uz: 'Atama', ru: 'Термин', vi: 'Thuật ngữ' },
    field: { uz: 'Javob katagi', ru: 'Поле ответа', vi: 'Ô trả lời' },
    note: { uz: 'Eslatma', ru: 'Заметка', vi: 'Ghi chú' },
    open: { uz: 'Javob yozish', ru: 'Написать ответ', vi: 'Viết câu trả lời' },
    choose: { uz: '— tanlang —', ru: '— выберите —', vi: '— chọn —' },
  };
  const KIND = {
    exercise: { c: '--pin-exercise', l: { uz: 'Topshiriq', ru: 'Задание', vi: 'Bài tập' }, i: '<path d="M4 16l1-4 8-8 3 3-8 8-4 1z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>' },
    question: { c: '--pin-exercise', l: { uz: 'Savol', ru: 'Вопрос', vi: 'Câu hỏi' }, i: '<path d="M7 7.5a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7V13" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="16" r="1.3" fill="#fff"/>' },
    skills: { c: '--pin-exercise', l: { uz: 'Ko‘nikmalar', ru: 'Навыки', vi: 'Kỹ năng' }, i: '<path d="M5 10.5l3 3 7-7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' },
    quiz: { c: '--pin-quiz', l: { uz: 'Test', ru: 'Тест', vi: 'Trắc nghiệm' }, i: '<path d="M7 7.5a3 3 0 1 1 4 2.8c-.8.4-1 1-1 1.7V13" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="16" r="1.3" fill="#fff"/>' },
    activity: { c: '--pin-model', l: { uz: 'Faoliyat', ru: 'Активность', vi: 'Hoạt động' }, i: '<rect x="4" y="4" width="5" height="5" rx="1" fill="#fff"/><rect x="11" y="4" width="5" height="5" rx="1" fill="#fff" opacity=".7"/><rect x="4" y="11" width="5" height="5" rx="1" fill="#fff" opacity=".7"/><rect x="11" y="11" width="5" height="5" rx="1" fill="#fff"/>' },
    simulation: { c: '--pin-model', l: { uz: 'Model', ru: 'Модель', vi: 'Mô hình' }, i: '<circle cx="10" cy="10" r="2.5" fill="#fff"/><ellipse cx="10" cy="10" rx="7" ry="3" fill="none" stroke="#fff" stroke-width="1.6"/><ellipse cx="10" cy="10" rx="3" ry="7" fill="none" stroke="#fff" stroke-width="1.6"/>' },
    demo: { c: '--pin-demo', l: { uz: 'Namoyish', ru: 'Демонстрация', vi: 'Trình diễn' }, i: '<rect x="3" y="4" width="14" height="10" rx="1.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M8 17h4" stroke="#fff" stroke-width="2"/>' },
    video: { c: '--pin-video', l: { uz: 'Video', ru: 'Видео', vi: 'Video' }, i: '<path d="M7 5l9 5-9 5z" fill="#fff"/>' },
    story: { c: '--pin-video', l: { uz: 'Hikoya', ru: 'История', vi: 'Truyện tranh' }, i: '<path d="M7 5l9 5-9 5z" fill="#fff"/>' },
    figure: { c: '--pin-figure', l: { uz: 'Rasmni o‘rganish', ru: 'Рисунок', vi: 'Khám phá hình' }, i: '<circle cx="8.5" cy="8.5" r="4.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 12l4.5 4.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' },
    audio: { c: '--pin-audio', l: { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' }, i: '<path d="M4 8h3l4-3v10l-4-3H4z" fill="#fff"/><path d="M13.5 7.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>' },
    text_anchor: { c: '--pin-audio', l: { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' }, i: '<path d="M4 8h3l4-3v10l-4-3H4z" fill="#fff"/><path d="M13.5 7.5a3.5 3.5 0 0 1 0 5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>' },
    workbook: { c: '--pin-workbook', l: { uz: 'Mashq daftari', ru: 'Рабочая тетрадь', vi: 'Vở bài tập' }, i: '<rect x="5" y="3" width="10" height="14" rx="1" fill="none" stroke="#fff" stroke-width="2"/>' },
    link: { c: '--pin-workbook', l: { uz: 'Dars ko‘rinishi', ru: 'Урок', vi: 'Bản bài học' }, i: '<path d="M5 6h10M5 10h10M5 14h7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' },
    term: { c: '--pin-text', l: { uz: 'Atama', ru: 'Термин', vi: 'Thuật ngữ' }, i: '<path d="M6 4h8v12l-4-3-4 3z" fill="#fff"/>' },
    _: { c: '--pin-text', l: { uz: 'Belgi', ru: 'Значок', vi: 'Ghim' }, i: '<circle cx="10" cy="10" r="3" fill="#fff"/>' },
  };
  const kindOf = (k) => KIND[k] || KIND._;
  const COMPACT_W = 560; // bề rộng trang (px) dưới mức này: ô nhập chạm để mở bảng nhập lớn

  const CSS = `
.pm{display:flex;flex-direction:column;min-height:calc(100vh - 120px)}
.pm-bar{position:sticky;top:var(--t0-top-h,0);z-index:calc(var(--z-bar,100) - 1);display:flex;flex-wrap:wrap;gap:var(--space-2,8px);align-items:center;padding:var(--space-2,8px) max(var(--space-4,16px),env(safe-area-inset-left));background:color-mix(in srgb,var(--color-desk) 88%,transparent);backdrop-filter:blur(6px)}
.pm-grp{display:flex;gap:4px;align-items:center}
.pm-sel{min-height:var(--touch-min,44px);border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);background:var(--color-surface);color:var(--color-ink);font:inherit;font-size:var(--text-ui,15px);padding:0 var(--space-3,12px);max-width:44vw}
.pm-seg{display:inline-flex;border:1px solid var(--color-line);border-radius:var(--radius-pill,999px);overflow:hidden;background:var(--color-surface)}
.pm-seg button{min-height:calc(var(--touch-min,44px) - 2px);min-width:var(--touch-min,44px);border:0;background:transparent;color:var(--color-ink-2);font:inherit;font-size:var(--text-sm,13px);font-weight:700;cursor:pointer;padding:0 10px}
.pm-seg button[aria-pressed="true"]{background:var(--color-accent);color:var(--color-on-accent)}
.pm-tog[aria-pressed="true"]{background:var(--color-accent-soft);border-color:var(--color-accent);color:var(--color-accent-ink)}
.pm-sp{flex:1}
.pm-scroll{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:var(--space-2,8px) var(--space-4,16px) var(--space-8,48px);touch-action:pan-x pan-y pinch-zoom}
.pm-spread{display:flex;gap:var(--space-3,12px);justify-content:center;margin:0 auto;transition:width var(--dur-base,200ms)}
.pm-page{position:relative;flex:1 1 0;min-width:0;max-width:900px;background:var(--color-page-paper);box-shadow:var(--shadow-2);border-radius:var(--radius-xs,3px);aspect-ratio:var(--ar,.707);user-select:none;-webkit-user-select:none;container-type:inline-size}
.pm-spread.zoomed .pm-page{max-width:none}
.pm-page img.pm-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}
.pm-page .t0-pp{position:absolute;inset:0;height:100%}
.pm-page .pm-missing{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--color-ink-2);font-size:var(--text-sm,13px);text-align:center;padding:16px}
.pm-label{position:absolute;bottom:-1.6em;left:0;right:0;text-align:center;font-size:var(--text-xs,12px);color:var(--color-ink-2)}
.pm-tr{position:absolute;border:0;padding:0;margin:0;background:transparent;border-radius:3px;cursor:pointer;z-index:2}
.pm-tr:hover,.pm.show-tr .pm-tr{background:var(--color-tr-hover)}
.pm.show-tr .pm-tr{outline:1px dashed color-mix(in srgb,var(--pin-text) 60%,transparent)}
.pm-tr[aria-expanded="true"]{background:var(--color-tr-hover);outline:2px solid var(--pin-text)}
.pm-tr:focus-visible{outline:3px solid var(--color-accent)}
.pm-ln{cursor:pointer;outline:none}
.pm-ln:focus-visible rect{stroke:var(--color-accent);stroke-width:2}
.pm-ln.t0-pp-b:focus-visible{outline:3px solid var(--color-accent)}
@media (hover:hover){.pm-ln:hover rect{fill:var(--color-tr-hover)}.pm-ln.t0-pp-b:hover{background:var(--color-tr-hover)}}
.pm-ln.playing rect{fill:rgba(242,194,48,.45);stroke:#D86F00;stroke-width:1}
.pm-ln.t0-pp-b.playing{background:rgba(242,194,48,.45);box-shadow:0 0 0 1px #D86F00}
.pm-bub{position:absolute;z-index:6;width:min(360px,92%);background:var(--color-surface);color:var(--color-ink);border:1px solid var(--color-line);border-radius:var(--radius-md,10px);box-shadow:var(--shadow-2);padding:var(--space-3,12px);font-size:var(--text-ui,15px);line-height:var(--lh-body,1.5)}
.pm-bub p{margin:0 0 var(--space-2,8px)}
.pm-bub .h{font-weight:700}
.pm-bub-row{display:flex;gap:var(--space-2,8px);justify-content:flex-end}
.pm-pin{position:absolute;z-index:4;width:var(--pin-size,28px);height:var(--pin-size,28px);transform:translate(-50%,-50%);border-radius:50%;border:2px solid var(--pin-ring,#fff);background:var(--pc);box-shadow:var(--shadow-pin);cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;transition:transform var(--dur-fast,120ms)}
.pm-pin::after{content:"";position:absolute;left:50%;top:50%;width:var(--touch-min,44px);height:var(--touch-min,44px);transform:translate(-50%,-50%);border-radius:50%}
.pm-pin svg{width:62%;height:62%}
.pm-pin.video,.pm-pin.story{width:var(--pin-size-video,36px);height:var(--pin-size-video,36px)}
.pm-pin:hover{transform:translate(-50%,-50%) scale(1.12)}
.pm-pin:focus-visible{outline:3px solid var(--color-accent);outline-offset:3px}
.pm-pin.missing{opacity:.45;filter:grayscale(.6)}
.pm-pin.done::before{content:"✓";position:absolute;right:-7px;top:-7px;width:16px;height:16px;border-radius:50%;background:var(--color-ok);color:#fff;font-size:11px;line-height:16px;text-align:center;font-weight:700}
.pm-pin.playing{background:var(--pin-active);animation:pm-pulse 1s infinite}
@keyframes pm-pulse{50%{box-shadow:0 0 0 8px color-mix(in srgb,var(--pin-active) 35%,transparent)}}
@media (prefers-reduced-motion:reduce){.pm-pin.playing{animation:none}}
.pm.no-pins .pm-pin{display:none}
.pm-drawer h3{font-size:var(--text-sm,13px);text-transform:uppercase;letter-spacing:.05em;color:var(--color-ink-2);margin:var(--space-4,16px) 0 var(--space-2,8px)}
.pm-drawer h3:first-child{margin-top:0}
.pm-drawer p{margin:0 0 var(--space-3,12px);line-height:var(--lh-body,1.5)}
.pm-drawer p.h{font-weight:700}
.pm-drawer ul{list-style:none;margin:0;padding:0;display:grid;gap:var(--space-2,8px)}
.pm-drawer li button{width:100%;justify-content:flex-start;border-radius:var(--radius-md,10px);text-align:left}
.pm-dot{flex:none;width:22px;height:22px;border-radius:50%;background:var(--pc);display:inline-flex;align-items:center;justify-content:center}
.pm-dot svg{width:62%;height:62%}
.pm-term dt{font-weight:700;font-size:var(--text-h3,18px);margin:0 0 var(--space-2,8px)}
.pm-term dd{margin:0 0 var(--space-3,12px);line-height:var(--lh-body,1.5)}
.pm-term .sub{color:var(--color-ink-2);font-size:var(--text-sm,13px)}
/* 008 – ô nhập trên trang vở (màu cố định vì nằm trên giấy trắng của ảnh trang) */
.pm-fl{position:absolute;inset:0;z-index:3;pointer-events:none}
.pm-fl>*{pointer-events:auto}
.pm-f{position:absolute;box-sizing:border-box;margin:0;border:1.5px solid #0E8A8A;border-radius:.5cqw;background:rgba(255,255,255,.93);color:#14212C;font:600 var(--pf-fs,1.75cqw)/1.15 var(--font-body);padding:0 .6cqw;min-height:8px;-webkit-appearance:none;appearance:none}
.pm-f::placeholder{color:#7FA9A9;font-weight:500}
.pm-f:focus,.pm-f:focus-visible{outline:2px solid #0A74C0;outline-offset:1px;z-index:5}
textarea.pm-f{resize:none;padding:.4cqw .6cqw;line-height:1.3;overflow:auto}
.pm-f.wl{border-style:dashed;background:transparent;background-image:repeating-linear-gradient(transparent 0,transparent calc(var(--lh) - 1px),rgba(14,138,138,.35) calc(var(--lh) - 1px),rgba(14,138,138,.35) var(--lh));line-height:var(--lh);padding-top:0;padding-bottom:0}
.pm-f.cell{text-align:center;text-transform:uppercase;padding:0;font-weight:700}
select.pm-f{padding:0 .4cqw;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,#0E8A8A 50%),linear-gradient(135deg,#0E8A8A 50%,transparent 50%);background-position:calc(100% - 1.2cqw) 55%,calc(100% - .7cqw) 55%;background-size:.5cqw .5cqw;background-repeat:no-repeat;padding-right:1.8cqw}
.pm-f.sz-sm{--pf-fs:1.45cqw}.pm-f.sz-lg{--pf-fs:2.2cqw}
.pm-f.ok{border-color:#1E7A3C;background-color:#E3F6E8}
.pm-f.bad{border-color:#B3261E;background-color:#FDE9E7}
button.pm-f{cursor:pointer;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center}
button.pm-f.empty{color:#7FA9A9;font-weight:500}
button.pm-f.multi{white-space:normal;align-items:flex-start;padding-top:.4cqw}
.pm-f.op{width:auto!important;min-width:6%;background:#FFF6DC;border-color:#C99700;gap:.4em}
.pm-f.op.has{background:#E3F6E8;border-color:#1E7A3C}
.pm-t{position:absolute;box-sizing:border-box;margin:0;padding:0;border:1.5px dashed rgba(14,138,138,.55);background:transparent;cursor:pointer;border-radius:.4cqw;color:#0E8A8A;display:flex;align-items:center;justify-content:center;font:700 2cqw/1 var(--font-body)}
.pm-t.box[aria-pressed="true"]::after{content:"✓";font-size:max(12px,2.2cqw);color:#14212C}
.pm-t.underline{border:0;border-bottom:2px dashed rgba(14,138,138,.55);border-radius:0}
.pm-t.underline[aria-pressed="true"]{border-bottom:3px solid #0A74C0;background:rgba(10,116,192,.12)}
.pm-t.circle{border-radius:50%}
.pm-t.circle[aria-pressed="true"]{border:2.5px solid #0A74C0;background:rgba(10,116,192,.08)}
.pm-t.box[aria-pressed="true"]{border-style:solid;border-color:#0A74C0;background:rgba(10,116,192,.10)}
.pm-t.dot{border-radius:50%;border-style:solid;background:rgba(255,255,255,.85)}
.pm-t.dot.sel{border-color:#0A74C0;background:#0A74C0;box-shadow:0 0 0 3px rgba(10,116,192,.3)}
.pm-t.dot.paired{background:var(--pcol,#0E8A8A);border-color:var(--pcol,#0E8A8A);color:#fff}
.pm-t.ok{border-color:#1E7A3C!important;background-color:#E3F6E8!important;color:#1E7A3C}
.pm-t.bad{border-color:#B3261E!important;background-color:#FDE9E7!important;color:#B3261E}
.pm-t:focus-visible{outline:2px solid #0A74C0;outline-offset:2px}
.pm-t::before,.pm-f.hit::before{content:"";position:absolute;left:50%;top:50%;width:max(100%,var(--hit,0px));height:max(100%,var(--hit,0px));transform:translate(-50%,-50%)}
.pm-note{position:absolute;transform:translate(-50%,-50%);width:max(22px,3cqw);height:max(22px,3cqw);border-radius:50%;border:2px solid #fff;background:#C99700;color:#fff;cursor:pointer;padding:0;font-size:max(11px,1.6cqw);box-shadow:var(--shadow-pin)}
.pm-note.has{background:#1E7A3C}
.pm-note::after{content:"";position:absolute;left:50%;top:50%;width:var(--touch-min,44px);height:var(--touch-min,44px);transform:translate(-50%,-50%)}
.pm-lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.pm-chk{background:var(--color-accent);border-color:var(--color-accent);color:var(--color-on-accent);font-weight:700}
.pm-ed label{display:block;font-weight:600;margin:0 0 var(--space-2,8px);line-height:var(--lh-body,1.5)}
.pm-ed .sub{display:block;font-weight:400;color:var(--color-ink-2);font-size:var(--text-sm,13px);margin-bottom:var(--space-2,8px)}
.pm-ed input,.pm-ed textarea{display:block;width:100%;min-height:var(--touch-min,44px);border:1.5px solid var(--color-line);border-radius:var(--radius-md,10px);padding:var(--space-2,8px) var(--space-3,12px);font:inherit;font-size:var(--text-body,16px);background:var(--color-surface);color:var(--color-ink);box-sizing:border-box}
.pm-ed textarea{min-height:140px;resize:vertical;line-height:var(--lh-body,1.5)}
.pm-ed .row{display:flex;gap:var(--space-2,8px);justify-content:flex-end;margin-top:var(--space-3,12px)}
@media (max-width:599px){.pm-hide-s{display:none}}
`;
  function css() { if (!document.getElementById('pm-css')) document.head.append(Object.assign(document.createElement('style'), { id: 'pm-css', textContent: CSS })); }
  const icon = (k) => `<svg viewBox="0 0 20 20" aria-hidden="true">${kindOf(k).i}</svg>`;
  const escA = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hasImg = (p) => !!(p.images && Object.keys(p.images).length);
  const hasText = (p) => !!(p.text_lines && p.text_lines.length);
  const showable = (p) => hasImg(p) || hasText(p) || !!p.background;

  function available(book, features) {
    const lay = (features && features.layers) || {};
    if (lay.trang_goc_ghim === false) return false;
    return !!(book && (book.pages || []).some(showable));
  }

  function mount(host, ctx) {
    css();
    const E = T0.ui.el;
    const book = T0.book;
    const prof = book.profile || {};
    const volOrder = (prof.volumes || []).map((v) => v.id);
    const pages = (book.pages || []).filter(showable)
      .slice().sort((a, b) => (volOrder.indexOf(a.volume) - volOrder.indexOf(b.volume)) || (a.n - b.n));
    const base = prof.lang_base || 'uz';
    const layLang = T0.printPage.layoutLang();
    const edsOf = (p) => (hasText(p) && (!hasImg(p) || !scanView) ? T0.printPage.langs(p) : hasImg(p) ? Object.keys(p.images) : [layLang]);
    let scanView = !!T0.store.get('pin:scan', false); // trang vừa có ảnh quét vừa có chữ dựng lại: xem ảnh quét
    const anyBoth = pages.some((p) => hasImg(p) && hasText(p));
    let edChosen = T0.store.get('pin:ed', null);
    let idx = 0;
    const findIdx = (n, vol) => pages.findIndex((p) => p.n === n && (!vol || p.volume === vol));
    if (ctx.target && ctx.target.page != null) { const j = findIdx(ctx.target.page, ctx.target.volume); if (j >= 0) idx = j; }
    else idx = Math.min(pages.length - 1, Math.max(0, T0.store.get('pin:page', 0) | 0));
    let zoom = 1, showTr = false, showPins = true, openBub = null, playingPin = null, playingLn = null, backIdx = null;
    const cleanup = [];

    const root = E('div', { class: 'pm' });
    host.append(root);
    const bar = E('div', { class: 'pm-bar' });
    const scroll = E('div', { class: 'pm-scroll' });
    const spread = E('div', { class: 'pm-spread' });
    scroll.append(spread);
    root.append(bar, scroll);

    const editions = () => [...new Set(pages.flatMap(edsOf))];
    const editionFor = (p) => {
      const eds = edsOf(p);
      if (edChosen && eds.includes(edChosen)) return edChosen;
      return eds.includes(base) ? base : eds.includes(layLang) ? layLang : eds[0]; // mặc định bản gốc; bản khác chọn bằng nút
    };
    const volTitle = (vid) => { const v = (prof.volumes || []).find((x) => x.id === vid); return v && v.kind !== 'textbook' ? (T0.t(v.title) || v.id) + ' · ' : ''; };
    const pageName = (p) => volTitle(p.volume) + T0.t(L.page) + ' ' + (p.label || p.n);
    const twoUp = () => zoom === 1 && scroll.clientWidth >= 1100 && pages[idx + 1] && pages[idx + 1].volume === pages[idx].volume;
    const shown = () => (twoUp() ? [pages[idx], pages[idx + 1]] : [pages[idx]]);

    /* ---------- thanh công cụ ---------- */
    function drawBar() {
      bar.innerHTML = '';
      const prev = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.prev), title: T0.t(L.prev), html: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
      const next = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.next), title: T0.t(L.next), html: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' });
      prev.disabled = idx <= 0; next.disabled = idx >= pages.length - 1;
      prev.onclick = () => go(idx - (twoUp() && idx > 1 ? 2 : 1));
      next.onclick = () => go(idx + (twoUp() ? 2 : 1));
      const sel = E('select', { class: 'pm-sel', 'aria-label': T0.t(L.page) });
      pages.forEach((p, i) => sel.append(new Option(pageName(p), String(i), false, i === idx)));
      sel.onchange = () => go(+sel.value);
      bar.append(E('div', { class: 'pm-grp' }, prev, sel, next));
      if (backIdx != null) {
        const bk = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.back) + ': ' + pageName(pages[backIdx]), title: T0.t(L.back) }, '↩ ', E('span', { class: 'pm-hide-s', text: pageName(pages[backIdx]) }));
        bk.onclick = () => { const b = backIdx; backIdx = null; go(b); };
        bar.append(bk);
      }
      const eds = editions();
      if (eds.length > 1) {
        const cur = editionFor(pages[idx]);
        const seg = E('div', { class: 'pm-seg', role: 'group', 'aria-label': T0.t(L.edition) });
        eds.forEach((ed) => {
          const b = E('button', { type: 'button', 'aria-pressed': String(cur === ed), text: ed.toUpperCase(), title: T0.t(L.edition) + ' ' + ed.toUpperCase() });
          b.onclick = () => { edChosen = ed; T0.store.set('pin:ed', ed); drawBar(); drawPages(); };
          seg.append(b);
        });
        bar.append(seg);
      }
      if (anyBoth) {
        const sc = E('button', { class: 't0-btn pm-tog', type: 'button', 'aria-pressed': String(scanView), title: T0.t(L.scan), 'aria-label': T0.t(L.scan), html: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 14l4-4 3 3 2-2 3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>' });
        sc.onclick = () => { scanView = !scanView; T0.store.set('pin:scan', scanView); drawBar(); drawPages(); };
        bar.append(sc);
      }
      bar.append(E('span', { class: 'pm-sp' }));
      if (shown().some((p) => (p.fields || []).some((f) => gradeable(f)))) {
        const ck = E('button', { class: 't0-btn pm-chk', type: 'button', title: T0.t(L.checkPage), 'aria-label': T0.t(L.checkPage) }, '✓ ', E('span', { text: T0.t(L.checkShort) }));
        ck.onclick = checkPage;
        bar.append(ck);
      }
      const trT = E('button', { class: 't0-btn pm-tog pm-hide-s', type: 'button', 'aria-pressed': String(showTr), title: T0.t(L.trShow), 'aria-label': T0.t(L.trShow), text: 'Aa' });
      trT.onclick = () => { showTr = !showTr; root.classList.toggle('show-tr', showTr); trT.setAttribute('aria-pressed', String(showTr)); };
      const pinT = E('button', { class: 't0-btn pm-tog', type: 'button', 'aria-pressed': String(showPins), title: T0.t(L.pins), 'aria-label': T0.t(L.pins), html: '<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="8" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 12.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' });
      pinT.onclick = () => { showPins = !showPins; root.classList.toggle('no-pins', !showPins); pinT.setAttribute('aria-pressed', String(showPins)); };
      const zo = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.zoomOut), title: T0.t(L.zoomOut), text: '−' });
      const zi = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.zoomIn), title: T0.t(L.zoomIn), text: '+' });
      zo.disabled = zoom <= 1; zi.disabled = zoom >= 2.5;
      zo.onclick = () => setZoom(zoom - 0.5); zi.onclick = () => setZoom(zoom + 0.5);
      const dr = E('button', { class: 't0-btn', type: 'button', 'aria-label': T0.t(L.tr) }, E('span', { 'aria-hidden': 'true', text: '☰' }), E('span', { class: 'pm-hide-s', text: T0.t(L.tr) }));
      dr.onclick = openDrawer;
      bar.append(trT, pinT, E('div', { class: 'pm-grp' }, zo, zi), dr);
    }
    function setZoom(z) {
      const cx = (scroll.scrollLeft + scroll.clientWidth / 2) / scroll.scrollWidth;
      zoom = Math.max(1, Math.min(2.5, z));
      drawBar(); drawPages();
      requestAnimationFrame(() => { scroll.scrollLeft = cx * scroll.scrollWidth - scroll.clientWidth / 2; });
    }

    /* ---------- trang ---------- */
    function drawPages() {
      closeBub();
      spread.innerHTML = '';
      spread.classList.toggle('zoomed', zoom > 1);
      spread.style.width = zoom > 1 ? (zoom * 100) + '%' : '';
      shown().forEach((p) => spread.append(drawPage(p)));
      T0.store.set('pin:page', idx);
      T0.emit('t0:page', { page: pages[idx].n, volume: pages[idx].volume });
      requestAnimationFrame(() => spread.querySelectorAll('.pm-page').forEach(layoutPage));
    }
    function drawPage(p) {
      const live = hasText(p) && (!hasImg(p) || !scanView);
      const ed = editionFor(p);
      const pg = E('div', { class: 'pm-page' + (live ? ' live' : ''), 'data-n': p.n, 'data-vol': p.volume || '' });
      let aligned = true, label = pageName(p);
      if (live) {
        const pt = book.print_text || {};
        pg.style.setProperty('--ar', String((pt.width || 595) / (pt.height || 842)));
        const r = T0.printPage.render(p, {
          lang: ed, label,
          groupClass: (k, g) => (g.anchor && T0.sentenceAt(k) ? 'pm-ln' : 't0-pp-g'),
          groupAttrs: (k, g) => { if (!g.anchor) return ''; const s = T0.sentenceAt(k); return s ? ' role="button" tabindex="0" aria-label="' + escA(T0.t(L.listen) + ': ' + T0.t(s.s, ed).slice(0, 90)) + '"' : ''; },
        });
        pg.append(r.el);
        pg._fit = r.fit;
        if (ed !== layLang) label += ' · ' + ed.toUpperCase();
        pg.setAttribute('data-ed', ed);
      } else if (hasImg(p)) {
        const src = p.images[ed] || p.images[layLang] || p.images[base] || Object.values(p.images)[0];
        const usedEd = p.images[ed] ? ed : p.images[layLang] ? layLang : p.images[base] ? base : Object.keys(p.images)[0];
        aligned = usedEd === layLang; // tọa độ tr/pins thuộc bản dàn trang
        pg.setAttribute('data-ed', usedEd);
        const img = E('img', { class: 'pm-img', alt: pageName(p), src: T0.asset(src), draggable: 'false', decoding: 'async' });
        img.onload = () => { if (img.naturalWidth) pg.style.setProperty('--ar', String(img.naturalWidth / img.naturalHeight)); layoutPage(pg); };
        img.onerror = () => pg.append(E('div', { class: 'pm-missing', text: src + ' – ' + T0.s('not_found') }));
        pg.append(img);
        if (usedEd !== layLang) label += ' · ' + usedEd.toUpperCase();
      } else {
        const img = E('img', { class: 'pm-img', alt: pageName(p), src: T0.asset(p.background), draggable: 'false' });
        pg.append(img);
      }
      pg.append(E('div', { class: 'pm-label', text: label }));
      if (aligned) (p.tr || []).forEach((t) => {
        const [x, y, w, h] = t.box;
        const b = E('button', { class: 'pm-tr', type: 'button', style: { left: x + '%', top: y + '%', width: w + '%', height: h + '%' }, 'aria-label': T0.t(L.tr) + ': ' + T0.t(t.text).slice(0, 80), 'aria-expanded': 'false' });
        b.onclick = (e) => { e.stopPropagation(); toggleBub(pg, b, t); };
        pg.append(b);
      });
      // ô nhập trên trang (008) – chỉ khi tọa độ khớp
      if (aligned && (p.fields || []).length) pg.append(drawFields(p, pg));
      // ghim (trang chữ sống: text_anchor thay bằng dòng bấm nghe)
      let pins = (p.pins || []).filter((pin) => !(live && pin.kind === 'text_anchor')).map((pin) => Object.assign({}, pin));
      if (!aligned) { // cột lề phải, giữ thứ tự theo y, giãn cách tối thiểu
        pins.sort((a, b) => a.y - b.y);
        let last = -99;
        pins.forEach((pin) => { pin.y = Math.max(pin.y, last + 5.5); last = pin.y; pin.x = 95; });
      }
      pins.forEach((pin) => pg.append(drawPin(pin, p)));
      return pg;
    }
    function layoutPage(pg) {
      if (!pg.isConnected) return;
      if (pg._fit) pg._fit();
      spreadPins(pg);
      layoutFields(pg);
    }
    // Ghim gần nhau hơn vùng chạm tối thiểu (vd. 3 ghim cách nhau 5% trên màn 390px) thì giãn ngang quanh tâm nhóm.
    function spreadPins(pg) {
      const W = pg.clientWidth, H = pg.clientHeight;
      if (!W || !H) return;
      const min = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--touch-min')) || 44;
      const bs = [...pg.querySelectorAll('.pm-pin')].map((b) => ({ b, x: parseFloat(b.dataset.x0 || b.style.left), y: parseFloat(b.dataset.y0 || b.style.top) }));
      bs.forEach((o) => { o.b.dataset.x0 = o.x; o.b.dataset.y0 = o.y; o.px = (o.x / 100) * W; o.py = (o.y / 100) * H; });
      const used = new Set();
      bs.slice().sort((a, b) => a.py - b.py || a.px - b.px).forEach((o) => {
        if (used.has(o)) return;
        const row = bs.filter((q) => !used.has(q) && Math.abs(q.py - o.py) < min).sort((a, b) => a.px - b.px);
        row.forEach((q) => used.add(q));
        if (row.length < 2) { o.b.style.left = o.x + '%'; return; }
        const pos = row.map((q) => q.px);
        for (let i = 1; i < pos.length; i++) pos[i] = Math.max(pos[i], pos[i - 1] + min);
        const shift = (row.reduce((s, q) => s + q.px, 0) - pos.reduce((s, v) => s + v, 0)) / row.length;
        let lo = pos[0] + shift, hi = pos[pos.length - 1] + shift, adj = 0;
        if (lo < min / 2) adj = min / 2 - lo; else if (hi > W - min / 2) adj = W - min / 2 - hi;
        row.forEach((q, i) => { q.b.style.left = ((pos[i] + shift + adj) / W * 100) + '%'; q.b.style.top = q.y + '%'; });
      });
    }
    function resolve(pin) {
      const r = pin.ref;
      switch (pin.kind) {
        case 'exercise': case 'quiz': case 'activity': case 'question': case 'skills':
          return T0.find('exercise', r) ? 'exercise' : T0.find('simulation', r) ? 'simulation' : T0.find('figure', r) ? 'figure' : null;
        case 'workbook': {
          if (T0.find('exercise', r)) return 'exercise';
          const ws = T0.find('workbook', r);
          if (ws && ws.page_range && findIdx(ws.page_range[0], ws.volume) >= 0) return 'page';
          return ws && T0.availableModes().includes('lesson') ? 'lesson' : null;
        }
        case 'link': return T0.find('lesson', r) && T0.availableModes().includes('lesson') ? 'lesson' : T0.find('exercise', r) ? 'exercise' : null;
        case 'term': return T0.find('glossary', r) ? 'term' : null;
        case 'figure': return T0.find('figure', r) ? 'figure' : T0.find('simulation', r) ? 'simulation' : null;
        case 'video': case 'story': return T0.find('video', r) ? 'video' : null;
        case 'simulation': case 'demo': return T0.find('simulation', r) ? 'simulation' : null;
        case 'audio': return T0.find('clip', r) ? 'audio' : null;
        case 'text_anchor': {
          if (T0.find('clip', r)) return 'audio';
          const an = ((book.reading && book.reading.anchors) || []).find((a) => a.id === r);
          return an && T0.sentenceAt(an.target) ? 'sentence' : null;
        }
        default: return null;
      }
    }
    function drawPin(pin, p) {
      const k = kindOf(pin.kind);
      const how = resolve(pin);
      const title = T0.t(k.l) + (pin.ref ? ' · ' + labelOf(pin, how) : '');
      const b = E('button', { class: 'pm-pin k-hit ' + pin.kind + (how ? '' : ' missing'), type: 'button', style: { left: pin.x + '%', top: pin.y + '%', '--pc': `var(${k.c})` }, 'aria-label': title, title, 'data-ref': pin.ref || '', 'data-kind': pin.kind, html: icon(pin.kind) });
      if (how === 'exercise' && T0.store.get('res:' + pin.ref)) b.classList.add('done');
      b.onclick = (e) => { e.stopPropagation(); openPin(pin, how, b); };
      return b;
    }
    function labelOf(pin, how) {
      if (how === 'term') { const g = T0.find('glossary', pin.ref); return g ? T0.t(g.term) : pin.ref; }
      if (how === 'sentence') { const an = ((book.reading && book.reading.anchors) || []).find((a) => a.id === pin.ref); const s = an && T0.sentenceAt(an.target); return s ? T0.t(s.s).slice(0, 60) : pin.ref; }
      const coll = how === 'audio' ? 'clip' : how === 'page' ? 'workbook' : how;
      const o = coll && T0.find(coll, pin.ref);
      if (!o || how === 'audio') return pin.ref;
      return (o.no ? o.no + '. ' : '') + (T0.t(o.title) || T0.t(o.caption) || T0.t(o.prompt) || pin.ref).slice(0, 60);
    }
    function openPin(pin, how, btn) {
      closeBub();
      if (!how) { T0.ui.toast(T0.t(L.missing) + ': ' + (pin.ref || pin.kind)); return; }
      if (how === 'lesson') {
        const tgt = pin.kind === 'workbook' ? { workbook: pin.ref } : { lesson: pin.ref };
        ctx.go('lesson', { target: tgt }); return;
      }
      if (how === 'page') { const ws = T0.find('workbook', pin.ref); const j = findIdx(ws.page_range[0], ws.volume); backIdx = idx; go(j, true); return; }
      if (how === 'term') { openTerm(pin.ref); return; }
      if (how === 'audio' || how === 'sentence') {
        if (playingPin === btn) { T0.media.stop(); clearPlaying(); return; }
        T0.media.stop(); clearPlaying();
        playingPin = btn; btn.classList.add('playing');
        let pr;
        if (how === 'audio') pr = T0.media.play(pin.ref);
        else { const an = book.reading.anchors.find((a) => a.id === pin.ref); pr = T0.playSentence(T0.sentenceAt(an.target).s); }
        pr.finally(() => { btn.classList.remove('playing'); if (playingPin === btn) playingPin = null; });
        return;
      }
      if (how === 'exercise') { T0.openExercise(pin.ref, { wide: false }); return; }
      const box = E('div');
      let inst = null;
      const title = labelOf(pin, how);
      T0.ui.modal(box, { title, wide: true, onClose: () => { inst && inst.unmount && inst.unmount(); T0.media.stop(); } });
      if (how === 'figure') inst = T0.renderSim(box, { kind: 'sim.figure_explorer', params: { figure: pin.ref } });
      else if (how === 'video') inst = T0.renderSim(box, { kind: 'sim.scene_player', params: { video: pin.ref } });
      else inst = T0.renderSim(box, pin.ref);
    }
    function openTerm(id) {
      const g = T0.find('glossary', id);
      const dl = E('dl', { class: 'pm-term' }, E('dt', { lang: T0.lang, text: T0.t(g.term) }));
      if (T0.lang !== base && g.term && g.term[base]) dl.append(E('dd', { class: 'sub', lang: base, text: g.term[base] }));
      if (g.definition) dl.append(E('dd', { lang: T0.lang, text: T0.t(g.definition) }));
      const row = E('div', { class: 'pm-bub-row' }, T0.ui.button('🔊 ' + T0.t(L.listen), () => T0.media.speak(T0.t(g.term) + '. ' + T0.t(g.definition))));
      if (g.page && findIdx(g.page) >= 0 && findIdx(g.page) !== idx) row.append(T0.ui.button(T0.t(L.page) + ' ' + g.page, () => { m.close(); backIdx = idx; go(findIdx(g.page), true); }));
      const m = T0.ui.modal(E('div', null, dl, row), { title: T0.t(L.term) });
    }

    /* ---------- dòng chữ sống bấm nghe (010) ---------- */
    function clearPlaying() {
      if (playingLn) { root.querySelectorAll('.pm-ln.playing').forEach((n) => n.classList.remove('playing')); playingLn = null; }
      if (playingPin) { playingPin.classList.remove('playing'); playingPin = null; }
    }
    function playLine(node) {
      const k = node.getAttribute('data-k');
      if (playingLn === k) { T0.media.stop(); clearPlaying(); return; }
      const hit = T0.sentenceAt(k); if (!hit) return;
      T0.media.stop(); clearPlaying();
      playingLn = k;
      root.querySelectorAll('.pm-ln[data-k="' + (window.CSS && CSS.escape ? CSS.escape(k) : k) + '"]').forEach((n) => n.classList.add('playing'));
      const pg = node.closest('.pm-page');
      const lang = pg && pg.getAttribute('data-ed');
      T0.playSentence(hit.s, { lang: T0.LANGS.includes(lang) ? lang : undefined }).finally(() => { if (playingLn === k) clearPlaying(); });
    }

    /* ---------- ô nhập trên trang (008) ---------- */
    const SEP = (ex) => (ex && /open_response|essay|note/.test(ex.kind) ? '\n' : ';');
    const PAGE_ID = (p) => 'page:' + (p.volume || '_') + ':' + p.n;
    function fieldInfo(f, p) {
      const ex = f.exercise_ref ? T0.find('exercise', f.exercise_ref) : null;
      const id = ex ? ex.id : f.exercise_ref || PAGE_ID(p);
      const r = ex ? T0.answers.resolve(ex, f) : { key: f.item_key != null ? String(f.item_key) : 'v', part: f.part != null ? +f.part : null };
      return { ex, id, key: r.key, part: r.part, tf: r.tf };
    }
    function readVal(fi) {
      const v = T0.answers.getItem(fi.id, fi.key);
      return fi.part != null ? T0.answers.part(v, fi.part, SEP(fi.ex)) : String(v == null ? '' : v);
    }
    function writeVal(fi, val) {
      if (fi.part != null) { const cur = T0.answers.getItem(fi.id, fi.key); T0.answers.set(fi.id, fi.key, T0.answers.withPart(cur, fi.part, val, SEP(fi.ex)), { src: 'page' }); }
      else T0.answers.set(fi.id, fi.key, val, { src: 'page' });
      T0.store.remove('res:' + fi.id);
    }
    function boxOf(f) {
      if (f.box) { const [x, y, w, h] = f.box; return { x, y, w, h: h != null ? h : null }; }
      if (f.line) { const [x1, y, x2] = f.line; return { x: x1, y: y - 1.2, w: x2 - x1, h: 2.4 }; }
      return null;
    }
    function itemOf(fi) { const items = (fi.ex && fi.ex.items) || []; return /^\d+$/.test(fi.key) ? items[+fi.key] : null; }
    function fieldLabel(fi, f) {
      const it = itemOf(fi);
      const parts = [];
      if (fi.ex) parts.push(T0.s('exercise') + (fi.ex.no ? ' ' + fi.ex.no : ''));
      if (it && it.label) parts.push(it.label);
      if (fi.part != null) parts.push(String(fi.part + 1));
      return parts.join(' · ') || T0.t(L.field);
    }
    const isOpenBtn = (f) => f.type === 'open_button' || (f.type === 'textarea' && f.box && f.box.length === 3);
    function gradeable(f) {
      if (!f.exercise_ref) return false;
      const ex = T0.find('exercise', f.exercise_ref); if (!ex) return false;
      if (isOpenBtn(f) || f.type === 'note') return false;
      return !!exGrader(ex);
    }
    function drawFields(p, pg) {
      const layer = E('div', { class: 'pm-fl' });
      const lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lines.setAttribute('class', 'pm-lines'); lines.setAttribute('viewBox', '0 0 100 100'); lines.setAttribute('preserveAspectRatio', 'none'); lines.setAttribute('aria-hidden', 'true');
      layer.append(lines);
      (p.fields || []).forEach((f, i) => {
        const b = boxOf(f); if (!b) return;
        const fi = fieldInfo(f, p);
        const node = drawField(f, fi, b, p, i);
        if (!node) return;
        node.dataset.fi = String(i);
        node.dataset.ex = fi.id;
        layer.append(node);
        node._f = f; node._fi = fi;
      });
      return layer;
    }
    function place(node, b, defH) {
      node.style.left = b.x + '%'; node.style.top = b.y + '%';
      if (b.w) node.style.width = b.w + '%';
      node.style.height = (b.h != null && b.h > 0 ? b.h : defH) + '%';
      return node;
    }
    function drawField(f, fi, b, p, i) {
      const ex = fi.ex;
      const label = fieldLabel(fi, f);
      const t = f.type;
      const szc = f.size ? ' sz-' + f.size : '';
      if (isOpenBtn(f)) { // nút mở bài tự luận (matematika5 TC3)
        const it = itemOf(fi);
        const n = E('button', { class: 'pm-f op hit', type: 'button', 'aria-label': T0.t(L.open) + ': ' + label, title: label }, '✎ ', (f.label || (it && it.label) || (ex && ex.no) || ''));
        place(n, b, 2.4);
        n.onclick = (e) => { e.stopPropagation(); if (ex) T0.openExercise(ex.id); };
        return n;
      }
      if (t === 'note' && !(b.w > 0)) { // ghi chú tự do: chấm mở bảng nhập
        const n = E('button', { class: 'pm-note', type: 'button', 'aria-label': T0.t(L.note) + ': ' + label, title: T0.t(L.note), text: '✎' });
        n.style.left = b.x + '%'; n.style.top = b.y + '%';
        n.onclick = (e) => { e.stopPropagation(); editField(n, true); };
        return n;
      }
      if (t === 'box' || t === 'underline' || t === 'circle') {
        const n = E('button', { class: 'pm-t ' + t, type: 'button', 'aria-pressed': 'false', 'aria-label': label + ' · ' + optLabel(fi, f), title: optLabel(fi, f) });
        place(n, b, 2.6);
        n.onclick = (e) => { e.stopPropagation(); toggleChoice(n); };
        return n;
      }
      if (t === 'dot') {
        const n = E('button', { class: 'pm-t dot', type: 'button', 'aria-label': label + ' · ' + optLabel(fi, f) });
        place(n, b, 3);
        n.onclick = (e) => { e.stopPropagation(); tapDot(n); };
        return n;
      }
      if (t === 'select') {
        const opts = (ex && (ex.options || ex.cell_options || (ex.data || {}).cell_options)) || (itemOf(fi) || {}).options || [];
        const n = E('select', { class: 'pm-f' + szc, 'aria-label': label });
        n.append(new Option(T0.t(L.choose), ''));
        opts.forEach((o, j) => n.append(new Option(T0.t(o), String(j))));
        place(n, b, 2.4);
        n.onchange = () => { writeVal(n._fi, n.value); n.classList.remove('ok', 'bad'); };
        n.onclick = (e) => e.stopPropagation();
        return n;
      }
      // ô chữ: input/textarea/cell/gap/table_cell/write_lines/note có kích thước
      const multi = t === 'textarea' || t === 'write_lines' || t === 'note' || (t === 'table_cell' && b.h > 4);
      const cls = 'pm-f' + szc + (t === 'cell' ? ' cell' : '') + (t === 'write_lines' ? ' wl' : '');
      const ph = T0.t(f.placeholder) || ((itemOf(fi) || {}).label ? itemOf(fi).label + (fi.part != null ? ' ' + (fi.part + 1) : '') : '');
      const defH = multi ? 6 : 2.4;
      const n = E(multi ? 'textarea' : 'input', { class: cls, 'aria-label': label, placeholder: t === 'cell' ? '' : ph, autocomplete: 'off', spellcheck: 'false' });
      if (!multi) { n.type = 'text'; const ans = String((itemOf(fi) || {}).answer || ''); if (ans && /^[\d.,|;\s/-]+$/.test(ans)) n.inputMode = 'decimal'; }
      if (t === 'cell') n.maxLength = 3;
      if (f.rows) n.dataset.rows = String(f.rows);
      if (f.list_ref) { const lst = listFor(f.list_ref, ex); if (lst) { const dlId = 'pmdl-' + String(f.list_ref).replace(/\W/g, '_'); if (!document.getElementById(dlId)) document.body.append(E('datalist', { id: dlId }, lst.map((x) => E('option', { value: T0.t(x) })))); n.setAttribute('list', dlId); } }
      place(n, b, defH);
      n._multi = multi;
      n.addEventListener('input', () => { n.classList.remove('ok', 'bad'); writeVal(n._fi, n.value); });
      n.addEventListener('click', (e) => e.stopPropagation());
      n.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !multi) { e.preventDefault(); focusNext(n); } });
      return n;
    }
    function listFor(ref, ex) {
      const v = (ex && ex.data && ex.data[ref]) || (ex && ex[ref]) || (book.lists && book.lists[ref]);
      return Array.isArray(v) ? v : null;
    }
    function optLabel(fi, f) {
      const ex = fi.ex; if (!ex) return '';
      const m = /^opt:(\d+)$/.exec(String(f.item_key || ''));
      if (m && ex.options) return T0.t(ex.options[+m[1]]).slice(0, 80);
      if (fi.tf) return fi.tf === 'T' ? '✓' : '✗';
      const d = /^([LR])(\d+)$/.exec(String(f.item_key || ''));
      if (d) return d[1] === 'L' ? T0.t(((ex.items || [])[+d[2]] || {}).prompt) : T0.t((ex.options || [])[+d[2]]);
      return '';
    }
    function focusNext(n) {
      const all = [...spread.querySelectorAll('input.pm-f,textarea.pm-f,select.pm-f')];
      const j = all.indexOf(n); if (all[j + 1]) all[j + 1].focus(); else n.blur();
    }
    // chọn ô (box/underline/circle): opt:k (một/nhiều đáp án), <i>:T|F (đúng/sai – loại trừ trong cùng ý)
    function toggleChoice(n) {
      const fi = n._fi, f = n._f, ex = fi.ex;
      const ik = String(f.item_key || '');
      if (fi.tf) {
        const cur = T0.answers.getItem(fi.id, fi.key);
        writeVal(fi, cur === fi.tf ? '' : fi.tf);
      } else if (/^opt:\d+$/.test(ik)) {
        const on = T0.answers.getItem(fi.id, ik) === '1';
        if (!on && ex && ex.kind === 'ex.choice_single') Object.keys(T0.answers.get(fi.id)).forEach((k) => { if (/^opt:/.test(k)) T0.answers.set(fi.id, k, '', { src: 'page' }); });
        T0.answers.set(fi.id, ik, on ? '' : '1', { src: 'page' });
        T0.store.remove('res:' + fi.id);
      } else {
        writeVal(fi, readVal(fi) === '1' ? '' : '1');
      }
      refreshFields();
    }
    // nối cặp (dot L<i> – R<j>): chạm trái rồi chạm phải; lưu L<i> = j
    let dotSel = null;
    function tapDot(n) {
      const fi = n._fi; const ik = String(n._f.item_key || '');
      const m = /^([LR])(\d+)$/.exec(ik); if (!m) return;
      const side = m[1], k = m[2];
      if (!dotSel || dotSel.fi.id !== fi.id || dotSel.side === side) {
        if (side === 'L' && T0.answers.getItem(fi.id, 'L' + k) !== '' && !dotSel) { T0.answers.set(fi.id, 'L' + k, '', { src: 'page' }); }
        dotSel = { fi, side, k, n };
      } else {
        const L_ = side === 'L' ? k : dotSel.k, R_ = side === 'R' ? k : dotSel.k;
        const map = T0.answers.get(fi.id);
        Object.keys(map).forEach((key) => { if (/^L\d+$/.test(key) && String(map[key]) === R_) T0.answers.set(fi.id, key, '', { src: 'page' }); });
        T0.answers.set(fi.id, 'L' + L_, R_, { src: 'page' });
        T0.store.remove('res:' + fi.id);
        dotSel = null;
      }
      refreshFields();
    }
    // bảng nhập lớn (màn hẹp, hoặc ghi chú)
    function editField(n, always) {
      const fi = n._fi, f = n._f;
      const it = itemOf(fi);
      const multi = n._multi || f.type === 'note' || f.type === 'textarea' || f.type === 'write_lines';
      const box = E('div', { class: 'pm-ed' });
      const id = 'pme' + Math.random().toString(36).slice(2, 7);
      const lab = E('label', { for: id });
      if (fi.ex && (fi.ex.prompt || fi.ex.title)) lab.append(E('span', { class: 'sub', text: T0.t(fi.ex.prompt) || T0.t(fi.ex.title) }));
      lab.append((it && T0.t(it.prompt)) || fieldLabel(fi, f));
      const inp = E(multi ? 'textarea' : 'input', { id, autocomplete: 'off', spellcheck: 'false', placeholder: T0.t(f.placeholder) || '' });
      if (!multi) inp.type = 'text';
      if (f.type === 'cell') inp.maxLength = 3;
      inp.value = readVal(fi);
      const ok = T0.ui.button(T0.t(L.done), () => { writeVal(fi, inp.value); m.close(); refreshFields(); }, 'primary');
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !multi) ok.click(); });
      box.append(lab, inp, E('div', { class: 'row' }, ok));
      const m = T0.ui.modal(box, { title: fieldLabel(fi, f) });
      setTimeout(() => inp.focus(), 30);
    }
    // bố trí theo kích thước thật: cỡ chữ, dòng kẻ, chế độ hẹp
    function layoutFields(pg) {
      const W = pg.clientWidth, H = pg.clientHeight; if (!W) return;
      const compact = W < COMPACT_W;
      pg.classList.toggle('compact', compact);
      const touch = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--touch-min')) || 44;
      pg.querySelectorAll('.pm-fl').forEach((layer) => {
        [...layer.children].forEach((n) => {
          if (!n._f) return;
          if (n.classList.contains('pm-t')) n.style.setProperty('--hit', Math.min(touch, Math.max(n.clientWidth, n.clientHeight) * 2) + 'px');
          if (n.tagName === 'TEXTAREA' && n.dataset.rows) n.style.setProperty('--lh', (n.clientHeight / +n.dataset.rows) + 'px');
          // màn hẹp: ô chữ thành nút mở bảng nhập lớn (gõ trực tiếp trên ô 10 px rất khó)
          const isText = (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') && !n.classList.contains('cell');
          if (compact && isText) swapToButton(n);
          else if (!compact && n._isProxy) swapToInput(n);
        });
      });
      refreshFields(pg);
    }
    function swapToButton(n) {
      const b = E('button', { class: n.className.replace(/\b(ok|bad)\b/g, '') + ' hit' + (n._multi ? ' multi' : ''), type: 'button', 'aria-label': n.getAttribute('aria-label') + ' · ' + T0.t(L.open), style: n.getAttribute('style') });
      b._f = n._f; b._fi = n._fi; b._multi = n._multi; b._isProxy = true; b._orig = n;
      b.dataset.fi = n.dataset.fi; b.dataset.ex = n.dataset.ex;
      b.onclick = (e) => { e.stopPropagation(); editField(b); };
      b.style.setProperty('--hit', '30px');
      n.replaceWith(b);
    }
    function swapToInput(b) { const n = b._orig; n.setAttribute('style', b.getAttribute('style')); b.replaceWith(n); }
    function refreshFields(scope) {
      const pal = ['#0E8A8A', '#C2410C', '#6A3FB5', '#1E7A3C', '#B3261E', '#0A74C0', '#A16207', '#BE185D'];
      (scope ? [scope] : [...spread.querySelectorAll('.pm-page')]).forEach((pg) => {
        const lines = pg.querySelector('.pm-lines');
        let segs = '';
        const dots = {};
        pg.querySelectorAll('.pm-fl > *').forEach((n) => {
          const fi = n._fi, f = n._f; if (!fi) return;
          const ik = String(f.item_key || '');
          if (n.classList.contains('pm-t') && n.classList.contains('dot')) {
            dots[ik] = n; n.classList.toggle('sel', !!(dotSel && dotSel.n === n));
            return;
          }
          if (n.classList.contains('pm-t')) {
            const on = fi.tf ? T0.answers.getItem(fi.id, fi.key) === fi.tf : /^opt:/.test(ik) ? T0.answers.getItem(fi.id, ik) === '1' : readVal(fi) === '1';
            n.setAttribute('aria-pressed', String(on));
            if (!on) n.classList.remove('ok', 'bad');
            return;
          }
          if (n.classList.contains('pm-note')) { n.classList.toggle('has', !!readVal(fi)); return; }
          if (n.classList.contains('op')) { const v = T0.answers.get(fi.id); n.classList.toggle('has', Object.keys(v).length > 0); return; }
          const v = readVal(fi);
          if (n._isProxy) { n.textContent = v || n._orig.placeholder || ''; n.classList.toggle('empty', !v); return; }
          if (document.activeElement !== n && n.value !== v) n.value = v;
        });
        // cặp nối
        const seen = new Set();
        Object.keys(dots).forEach((ik) => {
          const m = /^L(\d+)$/.exec(ik); const n = dots[ik];
          n.classList.remove('paired'); n.style.removeProperty('--pcol'); n.textContent = '';
          if (!m) return;
          const j = T0.answers.getItem(n._fi.id, ik);
          const r = j !== '' ? dots['R' + j] : null;
          if (!r) return;
          const col = pal[+m[1] % pal.length];
          [n, r].forEach((x) => { x.classList.add('paired'); x.style.setProperty('--pcol', col); });
          n.textContent = r.textContent = String(+m[1] + 1);
          seen.add(r);
          const c = (x) => [parseFloat(x.style.left) + parseFloat(x.style.width || 0) / 2, parseFloat(x.style.top) + parseFloat(x.style.height || 0) / 2];
          const [x1, y1] = c(n), [x2, y2] = c(r);
          segs += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="0.5" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:3px"/>';
        });
        Object.keys(dots).forEach((ik) => { const n = dots[ik]; if (/^R/.test(ik) && !seen.has(n)) { n.classList.remove('paired'); n.textContent = ''; } });
        if (lines) lines.innerHTML = segs;
      });
    }

    /* ---------- chấm trên trang ---------- */
    function exGrader(ex) {
      const k = ex.kind;
      if (/choice_single|choice_multi/.test(k) && ex.correct != null) return 'choice';
      if (k === 'ex.true_false') return 'tf';
      if (/choice_per_row|label_diagram/.test(k)) return 'select';
      if (k === 'ex.match_pairs') return 'pairs';
      if (k === 'ex.crossword' && ex.data && ex.data.words) return 'cross';
      if (k === 'ex.list_examples' && ex.data && ex.data.accept_pattern) return 'list';
      if ((ex.items || []).some((it) => it.answer != null && it.answer !== '') || (ex.answer != null && ex.answer !== '')) return 'text';
      return null;
    }
    function gradeExOnPage(ex, nodes) {
      const g = exGrader(ex); if (!g) return null;
      const A = T0.answers.get(ex.id);
      const marks = []; // [node, ok]
      let n = 0, right = 0, any = false;
      const rule = ((ex.grading || {}).rule) || ((book.grading_defaults || {}).short_answer_rule);
      if (g === 'text') {
        nodes.forEach((x) => {
          const fi = x._fi; const it = itemOf(fi) || (fi.key === 'v' || fi.key === '0' ? ex : null); if (!it) return;
          let ans = it.answer; if (ans == null || ans === '') return;
          const v = readVal(fi); if (v) any = true;
          if (fi.part != null) { const alts = String(ans).split('|').map((a) => T0.answers.part(a, fi.part, ';')).filter(Boolean); ans = alts.join('|'); }
          const ok = !!v && !!T0.grade.shortAnswer(v, ans, rule);
          n++; if (ok) right++; marks.push([x, ok]);
        });
      } else if (g === 'choice') {
        const corr = [].concat(ex.correct).map(String);
        const chosen = Object.keys(A).filter((k) => /^opt:/.test(k) && A[k] === '1').map((k) => k.slice(4));
        any = chosen.length > 0;
        nodes.forEach((x) => { const m = /^opt:(\d+)$/.exec(String(x._f.item_key || '')); if (m && chosen.includes(m[1])) marks.push([x, corr.includes(m[1])]); });
        n = 1; right = chosen.length === corr.length && chosen.every((c) => corr.includes(c)) ? 1 : 0;
      } else if (g === 'tf') {
        (ex.items || []).forEach((it, i) => {
          const v = A[String(i)]; n++; if (v) any = true;
          const ok = (v === 'T' && it.correct === true) || (v === 'F' && it.correct === false);
          if (ok) right++;
          nodes.forEach((x) => { if (x._fi.key === String(i) && x._fi.tf === v) marks.push([x, ok]); });
        });
      } else if (g === 'select') {
        nodes.forEach((x) => {
          const it = itemOf(x._fi); if (!it || it.correct == null) return;
          const v = readVal(x._fi); if (v !== '') any = true;
          const ok = v !== '' && [].concat(it.correct).map(String).includes(v);
          n++; if (ok) right++; marks.push([x, ok]);
        });
      } else if (g === 'pairs') {
        (ex.items || []).forEach((it, i) => {
          const v = A['L' + i]; n++; if (v != null && v !== '') any = true;
          const ok = v != null && v !== '' && +v === +it.correct; if (ok) right++;
          nodes.forEach((x) => { if (String(x._f.item_key) === 'L' + i && v != null && v !== '') marks.push([x, ok]); });
        });
      } else if (g === 'cross') {
        const W_ = ex.data.words;
        nodes.forEach((x) => {
          const v = readVal(x._fi); if (v) any = true;
          const want = String(x._f.item_key || '').split(';').map((s) => { const [w, k] = s.split('.'); return ((W_[w] || {}).letters || [])[+k]; }).filter((s) => s != null);
          if (!want.length) return;
          const ok = !!v && want.every((l) => T0.grade.norm(l) === T0.grade.norm(v));
          n++; if (ok) right++; marks.push([x, ok]);
        });
      } else if (g === 'list') {
        const d = ex.data; let acc, rej;
        try { acc = new RegExp(d.accept_pattern, d.flags || 'i'); rej = d.reject_pattern ? new RegExp(d.reject_pattern, d.flags || 'i') : null; } catch (e) { return null; }
        const seen = new Set();
        nodes.forEach((x) => {
          const v = T0.grade.norm(readVal(x._fi)); if (v) any = true;
          const ok = !!v && acc.test(v) && !(rej && rej.test(v)) && !seen.has(v); if (v) seen.add(v);
          n++; if (ok) right++; marks.push([x, ok]);
        });
      }
      if (!any) return { empty: true };
      return { ok: n > 0 && right === n, score: n ? right / n : 0, right, n, marks };
    }
    function checkPage() {
      const byEx = new Map();
      spread.querySelectorAll('.pm-fl > *').forEach((x) => {
        if (!x._fi || !x._fi.ex || !gradeable(x._f)) return;
        x.classList.remove('ok', 'bad');
        if (!byEx.has(x._fi.ex.id)) byEx.set(x._fi.ex.id, { ex: x._fi.ex, nodes: [] });
        byEx.get(x._fi.ex.id).nodes.push(x);
      });
      let R = 0, N = 0, done = 0;
      byEx.forEach(({ ex, nodes }) => {
        const r = gradeExOnPage(ex, nodes);
        if (!r || r.empty) return;
        done++; R += r.right; N += r.n;
        r.marks.forEach(([x, ok]) => x.classList.add(ok ? 'ok' : 'bad'));
        const rec = { ok: r.ok, score: r.score, t: Date.now(), src: 'page' };
        T0.store.set('res:' + ex.id, rec);
        T0.emit('t0:exresult', Object.assign({ id: ex.id, kind: ex.kind }, rec));
      });
      if (!done) { T0.ui.toast(T0.t(L.nothing)); return; }
      T0.ui.toast(T0.s('score') + ': ' + R + '/' + N + (R === N ? ' – ' + T0.s('correct') : ''));
    }

    /* ---------- bong bóng dịch ---------- */
    function closeBub() { if (openBub) { openBub.bub.remove(); openBub.btn.setAttribute('aria-expanded', 'false'); openBub = null; } }
    function toggleBub(pg, btn, t) {
      if (openBub && openBub.btn === btn) { closeBub(); return; }
      closeBub();
      const [x, y, w, h] = t.box;
      const text = T0.t(t.text);
      const speak = T0.ui.button('🔊 ' + T0.t(L.listen), () => T0.media.speak(text));
      const close = T0.ui.button(T0.s('close'), closeBub, 'ghost');
      const bub = E('div', { class: 'pm-bub', role: 'dialog', 'aria-label': T0.t(L.tr) }, E('p', { class: t.heading ? 'h' : '', lang: T0.lang, text }), E('div', { class: 'pm-bub-row' }, speak, close));
      const below = y + h < 70;
      bub.style.left = Math.max(1, Math.min(x, 100 - 1 - Math.min(92, 360 / pg.clientWidth * 100))) + '%';
      if (below) bub.style.top = (y + h + 0.8) + '%'; else bub.style.bottom = (100 - y + 0.8) + '%';
      pg.append(bub);
      btn.setAttribute('aria-expanded', 'true');
      openBub = { bub, btn };
    }

    /* ---------- ngăn dịch ---------- */
    function openDrawer() {
      const box = E('div', { class: 'pm-drawer' });
      shown().forEach((p) => {
        box.append(E('h3', { text: pageName(p) }));
        const trs = (p.tr || []).slice().sort((a, b) => a.box[1] - b.box[1]);
        if (trs.length) trs.forEach((t) => box.append(E('p', { class: t.heading ? 'h' : '', lang: T0.lang, text: T0.t(t.text) })));
        else if (hasText(p) && book.reading) { // trang chữ sống không có tr: câu theo anchor của trang, bản theo T0.lang
          const seen = new Set(); let n = 0;
          p.text_lines.forEach((l) => {
            const an = l[7] ? book.reading.anchors.find((a) => a.id === l[7]) : null;
            if (!an || seen.has(an.target)) return; seen.add(an.target);
            const hit = T0.sentenceAt(an.target); if (!hit) return;
            n++; box.append(E('p', { lang: T0.lang, text: T0.t(hit.s) }));
          });
          if (!n) box.append(E('p', { text: T0.t(L.noTr) }));
        } else box.append(E('p', { text: T0.t(L.noTr) }));
        const pins = (p.pins || []).filter((pin) => pin.kind !== 'text_anchor');
        if (pins.length) {
          box.append(E('h3', { text: T0.t(L.onPage) }));
          const ul = E('ul');
          pins.forEach((pin) => {
            const how = resolve(pin);
            const b = E('button', { class: 't0-btn', type: 'button', disabled: !how }, E('span', { class: 'pm-dot', style: { '--pc': `var(${kindOf(pin.kind).c})` }, html: icon(pin.kind) }), T0.t(kindOf(pin.kind).l) + ' · ' + labelOf(pin, how));
            b.onclick = () => { m.close(); openPin(pin, how, scroll.querySelector(`.pm-pin[data-ref="${window.CSS && window.CSS.escape ? window.CSS.escape(pin.ref || '') : pin.ref}"]`) || b); };
            ul.append(E('li', null, b));
          });
          box.append(ul);
        }
      });
      const m = T0.ui.modal(box, { title: T0.t(L.tr) });
    }

    /* ---------- điều hướng ---------- */
    function go(i, keepBack) {
      if (!pages.length) return;
      T0.media.stop(); clearPlaying();
      if (!keepBack) backIdx = null;
      dotSel = null;
      idx = Math.max(0, Math.min(pages.length - 1, i));
      drawBar(); drawPages();
      scroll.scrollTop = 0;
      if (window.scrollY > bar.offsetTop) window.scrollTo({ top: 0 });
    }
    const onKey = (e) => {
      if (document.querySelector('.t0-modal-scrim')) return;
      if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
      const ln = e.target && e.target.closest && e.target.closest('.pm-ln');
      if (ln && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); playLine(ln); return; }
      if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'ArrowRight') go(idx + 1);
      else if (e.key === 'Escape') closeBub();
    };
    document.addEventListener('keydown', onKey);
    cleanup.push(() => document.removeEventListener('keydown', onKey));
    let tx = null, ty = null;
    scroll.addEventListener('touchstart', (e) => { if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; } else tx = null; }, { passive: true });
    scroll.addEventListener('touchend', (e) => {
      if (tx == null || zoom > 1) return;
      if (e.target && e.target.closest && e.target.closest('.pm-fl')) { tx = null; return; }
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      tx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    scroll.addEventListener('click', (e) => {
      const ln = e.target.closest && e.target.closest('.pm-ln');
      if (ln) { e.stopPropagation(); closeBub(); playLine(ln); return; }
      if (!e.target.closest('.pm-bub')) closeBub();
    });
    cleanup.push(T0.on('t0:lang', () => { drawBar(); drawPages(); }));
    cleanup.push(T0.on('t0:exresult', (e) => { const b = scroll.querySelector(`.pm-pin[data-ref="${e.detail.id}"]`); if (b) b.classList.add('done'); }));
    cleanup.push(T0.on('t0:playend', () => { if (playingPin) { playingPin.classList.remove('playing'); playingPin = null; } }));
    // đồng bộ hai chiều: modal bài tập ghi 'ex:<id>:v' -> ô trên trang cập nhật
    cleanup.push(T0.on('t0:answer', (e) => { if (!e.detail || e.detail.src !== 'page') refreshFields(); }));
    cleanup.push(T0.on('t0:modalclose', () => refreshFields()));
    let rw = scroll.clientWidth;
    const onResize = () => { if (Math.abs(scroll.clientWidth - rw) > 40) { rw = scroll.clientWidth; drawBar(); drawPages(); } else spread.querySelectorAll('.pm-page').forEach(layoutPage); };
    window.addEventListener('resize', onResize);
    cleanup.push(() => window.removeEventListener('resize', onResize));
    // chiều cao thanh trên của khung để thanh công cụ dính ngay dưới
    const top = document.querySelector('.t0-top');
    if (top) document.documentElement.style.setProperty('--t0-top-h', top.offsetHeight + 'px');

    if (!pages.length) { root.append(E('div', { class: 't0-unsupported', text: T0.s('not_found') })); return { unmount() { root.remove(); } }; }
    drawBar(); drawPages();
    return {
      unmount() { cleanup.forEach((f) => f()); T0.media.stop(); root.remove(); },
      go: (n, vol) => { const j = findIdx(n, vol); if (j >= 0) go(j); },
      _check: checkPage,
    };
  }

  T0.registerMode('pin', { label: L.label, available, mount });
})();
