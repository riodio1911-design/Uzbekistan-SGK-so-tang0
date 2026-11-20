/* Robo – trợ lý nổi dùng chung của tầng 0 (đợt đối đẳng, agent R; chép và tổng quát hóa từ script Robo của 7 bản cũ).
 *
 * Gắn vào document.body (ngoài T0.root) nên có ở MỌI chế độ (pin / lesson / reading) và không mất khi đổi chế độ.
 * Không viết cứng gì của một cuốn: nhân vật, lời chào, nhãn vai, giọng, mẫu lời nhắc, công cụ lấy từ gia-su/prompts.json
 * (window.T0_PROMPTS: personas, roles.chat/quick_quiz, tools, ui_strings, age_rules) và book.profile; bật/tắt theo features:
 *   features.features.tutor_chat  -> tab Hỏi đáp có AI (capability sample, nhớ age_rules.chat_turns_kept lượt, nút Dừng)
 *   features.features.reminders   -> tab Nhiệm vụ, nhắc đến hạn (30 s) + badge, giờ học hằng ngày, công cụ add/list_reminders
 *   features.tutor.roles          -> 'do_nhanh' bật Đố nhanh (câu trắc nghiệm placement 'chat' của bài), 'tro_chuyen', 'nhac_viec'
 *   features.features.robo === false / tutor_help === false -> tắt cả nhân vật / tab Hướng dẫn
 * Ngữ cảnh trang (R05): trang đang hiện (.pm-page[data-n] của chế độ ghim, hoặc bài của chế độ bài học/đọc) -> chữ gốc | bản dịch,
 * bài tập trên trang, OCR bản in khác (pages[].ocr) khi đang xem/đọc bằng thứ tiếng đó; cắt theo roles.chat.context.max_chars.
 * Lưu: T0.store 'robo:*' (tiền tố theo book_id). Nhập một lần khóa cũ 'robo.<x>:*' của bản cũ (cùng origin khi phát hành đè URL cũ).
 * API: window.T0.robo = { open(tab), close(), bubble(html, acts), quiz(), addTask(text, dueIso), context(), openLesson(id), pose(p) }
 * Sự kiện nghe: t0:load (dựng lại), t0:page, t0:mode (đổi bài -> bong bóng), t0:lang, t0:exresult (bước tiếp theo).
 */
(function () {
  'use strict';
  const T0 = window.T0;
  if (!T0) return;

  /* ---------------- chuỗi ---------------- */
  const PR = () => window.T0_PROMPTS || {};
  const UIS = () => PR().ui_strings || {};
  let RL = null; // ngôn ngữ riêng của Robo (R13); null = theo T0.lang
  const lang = () => RL || T0.lang;
  const tl = (o) => T0.t(o, lang());
  const U = (k) => tl(UIS()[k]) || '';
  // nhãn nút/tab: theo chế độ song ngữ của core (T0.tUI 'uz · vi') khi Robo theo ngôn ngữ chung; đã chọn riêng (UZ/VI/RU) -> một tiếng
  const UL = (k) => { const o = UIS()[k]; if (!o) return ''; return !RL && typeof T0.tUI === 'function' ? T0.tUI(o) : tl(o); };
  const tlUI = (o) => (!RL && typeof T0.tUI === 'function' ? T0.tUI(o) : tl(o));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  const plain = (s) => (T0.math && T0.math.plain ? T0.math.plain(String(s)) : String(s));

  /* ---------------- nhân vật ---------------- */
  // Robot trong sách: thân trắng xám, đèn LED, huy hiệu trên ngực = 3 sọc màu (profile.tutor.badge_colors, mặc định 3 sọc của bản cũ).
  let uid = 0;
  function robotSvg(pose, badge) {
    const k = 'rb' + (++uid);
    const b = (badge && badge.length >= 3) ? badge : ['#1E9AD6', '#FFFFFF', '#2E9B48'];
    return `<svg class="rb-svg rb-${pose}" viewBox="0 0 120 170" aria-hidden="true" focusable="false">
      <defs><linearGradient id="${k}M" x1="0" x2="1"><stop offset="0" stop-color="#F4F6F8"/><stop offset="1" stop-color="#C9D1D8"/></linearGradient>
      <linearGradient id="${k}G" x1="0" x2="1"><stop offset="0" stop-color="#9AA5AF"/><stop offset="1" stop-color="#6E7A85"/></linearGradient></defs>
      <ellipse cx="60" cy="164" rx="30" ry="5" fill="#000" opacity=".12" class="rb-shadow"/>
      <g class="rb-body">
        <g class="rb-legs"><rect x="40" y="118" width="16" height="36" rx="6" fill="url(#${k}M)" stroke="#AAB4BD"/><rect x="64" y="118" width="16" height="36" rx="6" fill="url(#${k}M)" stroke="#AAB4BD"/>
          <rect x="37" y="148" width="22" height="12" rx="5" fill="#D5DBE0" stroke="#AAB4BD"/><rect x="61" y="148" width="22" height="12" rx="5" fill="#D5DBE0" stroke="#AAB4BD"/>
          <rect x="41" y="130" width="14" height="5" fill="url(#${k}G)"/><rect x="65" y="130" width="14" height="5" fill="url(#${k}G)"/></g>
        <rect x="36" y="106" width="48" height="16" rx="6" fill="url(#${k}G)"/>
        <g class="rb-arm-l"><rect x="20" y="66" width="13" height="40" rx="6" fill="url(#${k}M)" stroke="#AAB4BD"/><rect x="21" y="80" width="11" height="5" fill="url(#${k}G)"/><path d="M20 104 q-4 8 3 10 M33 104 q4 8 -3 10" stroke="#8A96A0" stroke-width="3" fill="none" stroke-linecap="round"/></g>
        <g class="rb-arm-r"><rect x="87" y="66" width="13" height="40" rx="6" fill="url(#${k}M)" stroke="#AAB4BD"/><rect x="88" y="80" width="11" height="5" fill="url(#${k}G)"/><path d="M87 104 q-4 8 3 10 M100 104 q4 8 -3 10" stroke="#8A96A0" stroke-width="3" fill="none" stroke-linecap="round"/></g>
        <rect x="32" y="62" width="56" height="48" rx="14" fill="url(#${k}M)" stroke="#AAB4BD"/>
        <rect x="44" y="72" width="32" height="24" rx="4" fill="#fff" stroke="#C9D1D8"/>
        <rect x="46" y="75" width="28" height="6" fill="${esc(b[0])}"/><rect x="46" y="81" width="28" height="1.2" fill="#D32F2F"/><rect x="46" y="82.2" width="28" height="5.6" fill="${esc(b[1])}"/><rect x="46" y="87.8" width="28" height="1.2" fill="#D32F2F"/><rect x="46" y="89" width="28" height="6" fill="${esc(b[2])}"/>
        <rect x="52" y="56" width="16" height="8" rx="3" fill="url(#${k}G)"/>
        <g class="rb-head">
          <rect x="22" y="14" width="10" height="26" rx="5" fill="url(#${k}G)"/><rect x="88" y="14" width="10" height="26" rx="5" fill="url(#${k}G)"/>
          <path d="M28 30 C28 6, 92 6, 92 30 L92 40 C92 56, 28 56, 28 40Z" fill="url(#${k}G)"/>
          <path d="M34 30 C34 18, 86 18, 86 30 L86 40 C86 52, 34 52, 34 40Z" fill="#F7F8FA"/>
          <g class="rb-eyes"><circle cx="48" cy="34" r="7" fill="#fff" stroke="#9AA5AF"/><circle cx="72" cy="34" r="7" fill="#fff" stroke="#9AA5AF"/>
            <circle cx="48" cy="34" r="4.2" fill="#5B4636"/><circle cx="72" cy="34" r="4.2" fill="#5B4636"/><circle cx="49.5" cy="32.5" r="1.4" fill="#fff"/><circle cx="73.5" cy="32.5" r="1.4" fill="#fff"/></g>
          <path class="rb-mouth" d="M54 44 q6 4 12 0" stroke="#B0685A" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <rect x="54" y="8" width="12" height="5" rx="2.5" fill="#6E7A85"/><circle class="rb-led" cx="60" cy="8" r="2.6" fill="#4AADF2"/>
        </g>
      </g></svg>`;
  }
  // Nhân vật "cuốn sách biết nói" (persona khác robo, không có ảnh riêng): sách mở có mặt, cùng bộ tư thế.
  function bookSvg(pose) {
    return `<svg class="rb-svg rb-${pose}" viewBox="0 0 120 170" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="164" rx="34" ry="5" fill="#000" opacity=".12" class="rb-shadow"/>
      <g class="rb-body">
        <g class="rb-arm-l"><path d="M18 96 q-12 10 -6 26" stroke="#7A4E2D" stroke-width="5" fill="none" stroke-linecap="round"/></g>
        <g class="rb-arm-r"><path d="M102 96 q12 -14 8 -30" stroke="#7A4E2D" stroke-width="5" fill="none" stroke-linecap="round"/></g>
        <path d="M44 140 v16 M76 140 v16" stroke="#7A4E2D" stroke-width="5" stroke-linecap="round"/>
        <path d="M14 46 Q37 36 60 50 Q83 36 106 46 V142 Q83 132 60 146 Q37 132 14 142Z" fill="#C0392B" stroke="#8E2A20" stroke-width="2"/>
        <path d="M20 48 Q40 40 58 52 V138 Q40 128 20 136Z" fill="#FFF9EC"/><path d="M62 52 Q80 40 100 48 V136 Q80 128 62 138Z" fill="#FFF3DA"/>
        <path d="M26 112 h26 M26 120 h22 M68 112 h26 M68 120 h22" stroke="#D9C9A8" stroke-width="2"/>
        <g class="rb-head">
          <g class="rb-eyes"><circle cx="40" cy="78" r="8" fill="#fff" stroke="#9AA5AF"/><circle cx="80" cy="78" r="8" fill="#fff" stroke="#9AA5AF"/>
            <circle cx="40" cy="78" r="4.4" fill="#3B2A1E"/><circle cx="80" cy="78" r="4.4" fill="#3B2A1E"/><circle cx="41.5" cy="76.5" r="1.4" fill="#fff"/><circle cx="81.5" cy="76.5" r="1.4" fill="#fff"/></g>
          <path class="rb-mouth" d="M52 96 q8 6 16 0" stroke="#B0685A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <circle class="rb-led" cx="60" cy="46" r="3" fill="#F7B924"/>
        </g>
      </g></svg>`;
  }
  function avatar(pose) {
    const c = S.cfg;
    if (c.avatarImg) return `<span class="rb-svg rb-${pose} rb-img"><span class="rb-body"><img src="${esc(c.avatarImg)}" alt=""></span></span>`;
    return c.persona.id === 'robo' ? robotSvg(pose, c.badge) : bookSvg(pose);
  }

  const CSS = `
.rb-dock{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(14px + var(--rb-lift,0px) + env(safe-area-inset-bottom,0px));z-index:calc(var(--z-modal,50) - 3);display:flex;align-items:flex-end;gap:8px;pointer-events:none;font-family:var(--font-body,Nunito,system-ui,sans-serif);transition:bottom var(--dur-base,220ms)}
.rb-btn{pointer-events:auto;border:0;background:none;padding:0;width:78px;height:110px;cursor:pointer;filter:drop-shadow(0 8px 14px rgba(10,40,70,.28));position:relative;flex:none}
.rb-btn:focus-visible{outline:3px solid var(--color-accent,#0A74C0);outline-offset:4px;border-radius:16px}
.rb-badge{position:absolute;top:2px;right:0;min-width:20px;height:20px;border-radius:10px;background:var(--color-bad,#D32F2F);color:#fff;font:800 12px/20px var(--font-body,Nunito,sans-serif);text-align:center;padding:0 5px;border:2px solid var(--color-surface,#fff);box-sizing:content-box}
.rb-badge[hidden]{display:none}
.rb-svg{display:block;width:100%;height:100%;overflow:visible}
.rb-img .rb-body{display:block;width:100%;height:100%}.rb-img img{width:100%;height:100%;object-fit:contain;border-radius:18px}
.rb-body{animation:rbFloat 3.2s ease-in-out infinite;transform-origin:60px 160px}
.rb-shadow{animation:rbShadow 3.2s ease-in-out infinite;transform-origin:60px 164px}
.rb-eyes{animation:rbBlink 4.5s infinite;transform-origin:60px 34px;transform-box:fill-box}
.rb-led{animation:rbLed 2s infinite}
.rb-arm-r{transform-origin:93px 70px}
.rb-wave .rb-arm-r{animation:rbWave 1.6s ease-in-out 3}
.rb-talk .rb-mouth{animation:rbTalk .28s infinite alternate;transform-origin:center;transform-box:fill-box}
.rb-talk .rb-arm-r{animation:rbGesture 1.4s ease-in-out infinite}
.rb-think .rb-head{animation:rbTilt 2.4s ease-in-out infinite;transform-origin:60px 50px}
.rb-think .rb-led{fill:#F7B924}
.rb-happy .rb-body{animation:rbJump .6s ease-in-out 2}
.rb-happy .rb-led{fill:#5BD47A}
@keyframes rbFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes rbShadow{0%,100%{transform:scaleX(1);opacity:.14}50%{transform:scaleX(.8);opacity:.08}}
@keyframes rbBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes rbLed{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes rbWave{0%,100%{transform:rotate(0)}25%{transform:rotate(-150deg)}50%{transform:rotate(-120deg)}75%{transform:rotate(-155deg)}}
@keyframes rbGesture{0%,100%{transform:rotate(0)}50%{transform:rotate(-35deg)}}
@keyframes rbTalk{from{transform:scaleY(1)}to{transform:scaleY(2.2)}}
@keyframes rbTilt{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes rbJump{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@media (prefers-reduced-motion:reduce){.rb-body,.rb-shadow,.rb-eyes,.rb-led,.rb-arm-r,.rb-mouth,.rb-head,.rb-bubble,.rb-dots span{animation:none!important}}
.rb-bubble{pointer-events:auto;max-width:min(300px,calc(100vw - 120px));background:var(--color-surface,#fff);color:var(--color-ink,#14324A);border:2px solid #9AA5AF;border-radius:20px 20px 4px 20px;padding:10px 14px;font:600 14.5px/1.45 var(--font-body,Nunito,system-ui,sans-serif);box-shadow:0 8px 24px rgba(10,40,70,.18);margin-bottom:62px;animation:rbPop .25s ease-out;box-sizing:border-box}
.rb-bubble b{font-weight:800}
.rb-bubble .rb-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;clear:both}
.rb-bubble button,.rb-panel .rb-chip{border:1px solid var(--color-line,#D5E4EF);background:var(--color-surface,#fff);color:var(--color-accent-ink,#075C99);border-radius:999px;padding:5px 12px;min-height:32px;font:800 13px var(--font-body,Nunito,sans-serif);cursor:pointer;text-align:left}
.rb-bubble button:hover,.rb-panel .rb-chip:hover{background:var(--color-surface-2,#EAF4FB)}
.rb-bubble .rb-x{float:right;border:0;padding:0 0 0 8px;min-height:0;color:var(--color-ink-2,#4A6378);font-size:18px;line-height:1;background:none}
@keyframes rbPop{from{transform:scale(.85) translateY(8px);opacity:0}to{transform:none;opacity:1}}
.rb-panel{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:calc(132px + var(--rb-lift,0px) + env(safe-area-inset-bottom,0px));z-index:calc(var(--z-modal,50) - 2);width:min(400px,calc(100vw - 28px));height:min(600px,calc(100vh - 170px - var(--rb-lift,0px)));background:var(--color-surface,#fff);color:var(--color-ink,#14324A);border:1px solid var(--color-line,#D5E4EF);border-radius:22px;box-shadow:0 20px 60px rgba(10,30,50,.3);display:flex;flex-direction:column;overflow:hidden;font-family:var(--font-body,Nunito,system-ui,sans-serif);box-sizing:border-box}
.rb-ph{display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(90deg,var(--color-accent,#0A74C0),color-mix(in srgb,var(--color-accent,#0A74C0) 72%,#fff));color:var(--color-on-accent,#fff)}
.rb-ph .rb-av{width:40px;height:52px;background:#fff;border-radius:12px;padding:2px;flex:none;box-sizing:border-box}
.rb-ph .rb-av .rb-body{animation:none}
.rb-ph b{font:800 18px var(--font-display,"Baloo 2",Nunito,sans-serif);display:block;line-height:1.1}
.rb-ph small{font-size:12px;opacity:.92}
.rb-ph .rb-sp{margin-left:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
.rb-ph button{border:1px solid rgba(255,255,255,.65);background:transparent;color:inherit;border-radius:999px;padding:2px 9px;min-height:26px;font:800 12px var(--font-body,Nunito,sans-serif);cursor:pointer}
.rb-ph button[aria-pressed="true"]{background:#fff;color:#0A4F80;border-color:#fff}
.rb-ph button:focus-visible,.rb-tabs button:focus-visible,.rb-panel button:focus-visible{outline:3px solid var(--hue-orange,#D86F00);outline-offset:2px}
.rb-tabs{display:flex;border-bottom:1px solid var(--color-line,#D5E4EF)}
.rb-tabs button{flex:1;border:0;background:none;padding:7px 4px;min-height:40px;line-height:1.2;font:800 13.5px var(--font-body,Nunito,sans-serif);color:var(--color-ink-2,#4A6378);border-bottom:3px solid transparent;cursor:pointer}
.rb-tabs button[aria-selected="true"]{color:var(--color-accent-ink,#075C99);border-bottom-color:var(--hue-orange,#E27A00)}
.rb-body2{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--color-bg,#F4F9FD);-webkit-overflow-scrolling:touch}
.rb-msg{max-width:88%;padding:9px 12px;border-radius:16px;font-size:14.5px;line-height:1.5;overflow-wrap:anywhere}
.rb-msg.me{align-self:flex-end;background:var(--color-accent,#0A74C0);color:var(--color-on-accent,#fff);border-bottom-right-radius:4px}
.rb-msg.bot{align-self:flex-start;background:var(--color-surface,#fff);border:1px solid var(--color-line,#D5E4EF);border-bottom-left-radius:4px}
.rb-msg .rb-say{border:0;background:none;color:var(--color-accent-ink,#075C99);font:800 12px var(--font-body,Nunito,sans-serif);padding:4px 0 0;cursor:pointer}
.rb-msg .rb-qopts{display:grid;gap:5px;margin-top:6px}
.rb-msg .rb-note{margin:6px 0 0}
.rb-dots span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#9AA5AF;margin-right:4px;animation:rbDot 1s infinite}
.rb-dots span:nth-child(2){animation-delay:.15s}.rb-dots span:nth-child(3){animation-delay:.3s}
@keyframes rbDot{0%,100%{opacity:.3}50%{opacity:1}}
.rb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px 0;background:var(--color-bg,#F4F9FD)}
.rb-in{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--color-line,#D5E4EF);background:var(--color-surface,#fff)}
.rb-in textarea{flex:1;resize:none;height:42px;min-width:0;border:1px solid var(--color-line,#D5E4EF);border-radius:14px;padding:9px 12px;font:600 14.5px var(--font-body,Nunito,sans-serif);background:var(--color-bg,#F4F9FD);color:var(--color-ink,#14324A);box-sizing:border-box}
.rb-in button{border:0;background:var(--hue-orange,#E27A00);color:#fff;border-radius:14px;padding:0 14px;min-height:42px;font:800 14px var(--font-body,Nunito,sans-serif);cursor:pointer}
.rb-in button:disabled{opacity:.5}
.rb-card{background:var(--color-surface,#fff);border:1px solid var(--color-line,#D5E4EF);border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.5}
.rb-card h4{margin:0 0 6px;font:800 15px var(--font-display,"Baloo 2",Nunito,sans-serif)}
.rb-card ul{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:5px}
.rb-card li{display:flex;align-items:center;gap:8px}
.rb-pin{flex:none;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;box-shadow:var(--shadow-pin,0 1px 3px rgba(0,0,0,.3))}
.rb-pin svg{width:14px;height:14px}
.rb-task{display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-top:1px solid var(--color-line,#D5E4EF)}
.rb-task:first-of-type{border-top:0}
.rb-task input{width:18px;height:18px;accent-color:var(--hue-green,#2A8040);margin-top:2px;flex:none}
.rb-task .due{font-size:12px;color:var(--color-ink-2,#4A6378)}
.rb-task .due.late{color:var(--color-bad,#C9303A);font-weight:800}
.rb-task .del{margin-left:auto;border:0;background:none;color:var(--color-ink-2,#4A6378);cursor:pointer;font-size:18px;min-width:32px;min-height:32px}
.rb-form{display:grid;gap:6px}
.rb-form input{border:1px solid var(--color-line,#D5E4EF);border-radius:10px;padding:6px 9px;min-height:36px;font:600 14px var(--font-body,Nunito,sans-serif);background:var(--color-bg,#F4F9FD);color:var(--color-ink,#14324A);min-width:0;box-sizing:border-box;color-scheme:inherit}
.rb-form .row2{display:flex;gap:6px;flex-wrap:wrap}
.rb-form .row2 input{flex:1}
.rb-go{border:0;background:var(--color-accent,#0A74C0);color:var(--color-on-accent,#fff);border-radius:999px;padding:6px 14px;min-height:34px;font:800 13px var(--font-body,Nunito,sans-serif);cursor:pointer;justify-self:start}
.rb-go.off{background:#9AA5AF}
.rb-note{font-size:12px;color:var(--color-ink-2,#4A6378)}
@media (max-width:560px){.rb-tabs button{font-size:12.5px}.rb-panel{left:10px;right:10px;width:auto;bottom:calc(106px + var(--rb-lift,0px) + env(safe-area-inset-bottom,0px));height:calc(100vh - 140px - var(--rb-lift,0px));height:calc(100dvh - 140px - var(--rb-lift,0px))}.rb-btn{width:64px;height:90px}.rb-bubble{margin-bottom:48px}}
:root.rb-on{--t0-fab-w:96px}
@media (max-width:560px){:root.rb-on{--t0-fab-w:80px}}
/* chừa chỗ bên phải cho nhân vật: thanh đáy nào muốn tránh thì gắn [data-t0-fab-avoid]; .pm-foot (chú giải + số trang của chế độ ghim) là dự phòng */
:root.rb-on [data-t0-fab-avoid],:root.rb-on .pm-foot{padding-right:var(--t0-fab-w)!important}
@media print{.rb-dock,.rb-panel{display:none!important}}
`;

  /* ---------------- trạng thái (mỗi cuốn) ---------------- */
  const S = { cfg: null, dock: null, btn: null, bubbleEl: null, panel: null, tab: 'ask', sample: undefined, ctl: null,
    chatLog: [], turns: [], tasks: [], daily: '', lastLesson: null, cur: null, timers: [], offs: [], routeT: null };

  const store = {
    get: (k, d) => { try { return T0.store.get('robo:' + k, d); } catch (e) { return d; } },
    set: (k, v) => { try { T0.store.set('robo:' + k, v); } catch (e) { /* bỏ qua */ } },
  };
  // Nhập khóa cũ 'robo.<x>:*' (bản cũ, cùng origin khi phát hành đè URL cũ) – chỉ một lần, chỉ khi có đúng một tiền tố.
  function importLegacy() {
    if (store.get('legacy', false)) return;
    store.set('legacy', true);
    try {
      const pre = new Set();
      for (let i = 0; i < localStorage.length; i++) { const m = /^(robo\.[A-Za-z0-9_-]+:)tasks$/.exec(localStorage.key(i) || ''); if (m) pre.add(m[1]); }
      if (pre.size !== 1) return;
      const p = [...pre][0], g = (k) => { const v = localStorage.getItem(p + k); try { return v == null ? null : JSON.parse(v); } catch (e) { return null; } };
      const t = g('tasks'); if (Array.isArray(t) && t.length && !store.get('tasks', []).length) store.set('tasks', t);
      const d = g('daily'); if (d && !store.get('daily', '')) store.set('daily', d);
      if (g('greeted')) store.set('greeted', true);
      const l = g('lang'); if (l && !store.get('lang', null)) store.set('lang', l);
    } catch (e) { /* bỏ qua */ }
  }

  /* ---------------- cấu hình từ book / features / prompts ---------------- */
  function cfg() {
    const b = T0.book, pr = b.profile || {}, P = PR();
    const F = (T0.features && T0.features.features) || {};
    const tf = (T0.features && T0.features.tutor) || {};
    const tp = pr.tutor || {};
    const pid = tp.persona || pr.tutor_persona || tf.persona || 'robo';
    const persona = (P.personas || []).find((x) => x.id === pid) || (P.personas || [])[0] || { id: 'robo', name: { uz: 'Robo' } };
    const roles = Array.isArray(tf.roles) ? tf.roles : null;
    const has = (r) => !roles || roles.includes(r);
    const chatRole = (P.roles || []).find((r) => r.id === 'chat') || {};
    const quizRole = (P.roles || []).find((r) => r.id === 'quick_quiz') || {};
    const band = pr.grade_band;
    const ar = (P.age_rules || []).find((a) => a.grade_band === band) || {};
    const langs = (pr.langs || T0.LANGS).filter((l) => T0.LANGS.includes(l));
    const c = {
      persona, roles, chatRole, quizRole,
      chat: !!F.tutor_chat && has('tro_chuyen'),
      reminders: !!F.reminders && has('nhac_viec'),
      quiz: (roles ? roles.includes('do_nhanh') : true) && quizIds().length > 0,
      help: F.tutor_help !== false,
      turnsKept: +ar.chat_turns_kept || 10,
      maxChars: (chatRole.context && +chatRole.context.max_chars) || 9000,
      langs: langs.length ? langs : T0.LANGS,
      badge: tp.badge_colors || null,
      avatarImg: typeof tp.avatar === 'string' ? T0.asset(tp.avatar) : null,
    };
    c.on = F.robo !== false && !!P.personas && (c.chat || c.reminders || c.quiz);
    return c;
  }
  const personaName = () => tl(S.cfg.persona.name) || 'Robo';
  const roleLabel = () => { const r = tl(S.cfg.persona.role_label) || ''; return r === personaName() ? '' : r; };

  /* ---------------- bài / trang / ngữ cảnh ---------------- */
  const lpage = (l) => (l.page != null ? l.page : l.page_range ? l.page_range[0] : null);
  function mainLessons() {
    const ls = T0.book.lessons || [];
    const k = ls.filter((l) => l.kind === 'lesson');
    return k.length ? k : ls.filter((l) => l.kind !== 'book');
  }
  function textbookVol() { const v = ((T0.book.profile || {}).volumes || []).find((x) => x.kind === 'textbook'); return v ? v.id : null; }
  function lessonOfPage(n, vol) {
    const ex = (T0.book.exercises || []).find((e) => String(e.page) === String(n) && e.lesson && (!vol || !e.volume || e.volume === vol));
    if (ex) { const l = T0.find('lesson', ex.lesson); if (l && (l.kind === 'lesson' || !mainLessons().some((m) => m.kind === 'lesson'))) return l; }
    const tv = textbookVol();
    if (vol && tv && vol !== tv) return null;
    let best = null;
    for (const l of mainLessons()) {
      if (l.page_range && +n >= +l.page_range[0] && +n <= +l.page_range[1]) return l;
      const p = lpage(l);
      if (p != null && +p <= +n && (!best || +p >= +lpage(best))) best = l;
    }
    return best;
  }
  function shownPages() {
    const els = T0.currentMode() === 'pin' ? [...document.querySelectorAll('.pm-page[data-n]')] : [];
    if (els.length) return els.map((e) => ({ n: +e.dataset.n, vol: e.dataset.vol || null }));
    return S.cur ? [S.cur] : [];
  }
  function route() {
    const m = T0.currentMode();
    let lesson = null, pages = [];
    if (m !== 'pin') {
      // 1) t0:route {lesson} (nếu chế độ phát), 2) khối đang hiện [data-block] -> bài chứa khối, 3) đích của t0:mode, 4) T0.store
      if (S.routeLesson && S.routeMode === m) lesson = T0.find('lesson', S.routeLesson);
      if (!lesson && T0.root) {
        const blk = T0.root.querySelector('[data-block]');
        if (blk) lesson = (T0.book.lessons || []).find((l) => (l.blocks || []).some((x) => x.id === blk.dataset.block)) || null;
      }
      if (!lesson && S.modeTarget && S.modeTarget.lesson) lesson = T0.find('lesson', S.modeTarget.lesson);
      if (!lesson && m === 'lesson') { const v = T0.store.get('lesson:view', null); if (v && v.type === 'lesson') lesson = T0.find('lesson', v.id); }
      if (!lesson && m === 'reading') { const id = T0.store.get('reading:lesson', null); if (id) lesson = T0.find('lesson', id); }
    }
    if (!lesson && m === 'pin' && T0.pageNav && typeof T0.pageNav.context === 'function') {
      try { const c = T0.pageNav.context() || {}; if (c.lesson) lesson = T0.find('lesson', c.lesson); if (c.pages && c.pages.length) pages = c.pages.map((n) => ({ n, vol: c.volume || null })); } catch (e) { /* */ }
      if (lesson) { if (!pages.length) pages = shownPages(); return { mode: m, lesson, pages }; }
    }
    if (!lesson) { pages = shownPages(); for (const pg of pages.slice().reverse()) { lesson = lessonOfPage(pg.n, pg.vol); if (lesson) break; } }
    return { mode: m, lesson, pages };
  }
  const findPage = (n, vol) => (T0.book.pages || []).find((p) => String(p.n) === String(n) && (!vol || !p.volume || p.volume === vol)) || null;
  function i18nStrings(node, lg, out, depth) {
    if (node == null || depth > 6 || out.length > 400) return;
    if (typeof node === 'string') { out.push(node); return; }
    if (Array.isArray(node)) { node.forEach((x) => i18nStrings(x, lg, out, depth + 1)); return; }
    if (typeof node !== 'object') return;
    if (T0.LANGS.some((k) => typeof node[k] === 'string')) { out.push(T0.t(node, lg)); return; }
    for (const k of ['title', 'text', 'paras', 'items', 'prompt', 'steps', 'caption', 'q', 'lines']) if (node[k] != null) i18nStrings(node[k], lg, out, depth + 1);
  }
  const pair = (o, base, l2) => { const a = plain(T0.t(o, base)), b = l2 && T0.hasLang(o, l2) ? plain(T0.t(o, l2)) : ''; return b && b !== a ? a + ' | ' + b : a; };
  function pageText(p, base, l2, ocrLangs) {
    const out = [];
    (p.tr || []).forEach((t) => { const s = pair(t.text, base, l2); if (s) out.push(s); });
    if (!(p.tr || []).length && Array.isArray(p.text_lines)) out.push(p.text_lines.map((r) => (Array.isArray(r) ? r[5] : r && r.text) || '').filter(Boolean).join(' '));
    (T0.book.exercises || []).filter((e) => String(e.page) === String(p.n) && (!p.volume || !e.volume || e.volume === p.volume)).forEach((e) => {
      const its = (e.items || []).map((it) => (it.label ? it.label + ') ' : '') + plain(T0.t(it.prompt, base))).filter((s) => s.trim()).join('; ');
      out.push('Exercise ' + (e.no || e.id) + ': ' + pair(e.prompt || e.title, base, l2) + (its ? ' ' + its : ''));
    });
    const ocr = [];
    for (const k of ocrLangs) if (p.ocr && Array.isArray(p.ocr[k]) && p.ocr[k].length) ocr.push([k, p.ocr[k].join('\n')]);
    return { text: out.join('\n'), ocr };
  }
  // Ngữ cảnh cho vai chat (prompts.json roles.chat: {{context}}, {{current_chapter}}) – hợp đồng host_interface.context()
  function context() {
    const b = T0.book, pr = b.profile || {}, base = pr.lang_base || 'uz';
    const L = lang();
    const l2 = L !== base ? L : (S.cfg.langs.find((x) => x !== base) || null);
    const P = PR(), LN = P.languages || {};
    const r = route();
    const ed = T0.store.get('pin:ed', null);
    const ocrLangs = [...new Set([L, ed].filter((x) => x && x !== base))];
    let body = '', ocr = '';
    r.pages.forEach(({ n, vol }) => {
      const p = findPage(n, vol); if (!p) return;
      const t = pageText(p, base, l2, ocrLangs);
      body += 'Book page ' + (p.label || p.n) + ':\n' + t.text + '\n';
      t.ocr.forEach(([k, s]) => { ocr += '\nOfficial ' + ((LN[k] || {}).name || k) + ' edition of page ' + (p.label || p.n) + ' (OCR):\n' + s + '\n'; });
    });
    // khối bài học gắn trang (blocks[].page) của các trang đang hiện; trang chỉ có ảnh -> dùng khối của bài
    const pgSet = new Set(r.pages.map((x) => String(x.n)));
    let blocks = [];
    if (pgSet.size) (b.lessons || []).forEach((l) => (l.blocks || []).forEach((bl) => { if (bl.page != null && pgSet.has(String(bl.page))) blocks.push(bl); }));
    if (r.lesson && (r.lesson.blocks || []).length && (r.mode !== 'pin' || (!blocks.length && body.replace(/Book page[^\n]*\n/g, '').trim().length < 200))) blocks = r.lesson.blocks;
    if (blocks.length) {
      const a = [], c = []; i18nStrings(blocks, base, a, 0); if (l2) i18nStrings(blocks, l2, c, 0);
      body += a.map((s, i) => (c[i] && c[i] !== s ? plain(s) + ' | ' + plain(c[i]) : plain(s))).join('\n');
    }
    let text = (body + ocr).trim().slice(0, S.cfg.maxChars);
    const lsn = r.lesson;
    let ctxText = '';
    if (lsn) ctxText = `Current lesson ${lsn.no || lsn.sec || ''} "${plain(T0.t(lsn.title, base))}"${l2 ? ' / "' + plain(T0.t(lsn.title, l2)) + '"' : ''}. Lesson content (${(LN[base] || {}).name || base} original${l2 ? ' | ' + ((LN[l2] || {}).name || l2) + ' translation' : ''}):\n` + text;
    else if (text) ctxText = 'Current page content:\n' + text;
    let chapter = '';
    if (lsn) {
      const u = (b.units || []).find((x) => x.id === lsn.unit || (x.lesson_refs || []).includes(lsn.id));
      if (u) chapter = `Current chapter: ${u.no != null ? u.no + '. ' : ''}${plain(T0.t(u.title, base))}${l2 ? ' / ' + plain(T0.t(u.title, l2)) : ''}`;
    }
    return { lesson: lsn, pages: r.pages, mode: r.mode, text, context: ctxText, current_chapter: chapter };
  }
  function promptParams(ctx) {
    const P = PR(), pr = T0.book.profile || {}, L = lang(), base = pr.lang_base || 'uz', LN = P.languages || {};
    const lessons = (T0.book.lessons || []).map((l) => `${l.id}: ${l.no || l.sec || ''} ${T0.t(l.title, base)}${L !== base ? ' / ' + T0.t(l.title, L) : ''}`).join('\n');
    return {
      lang: L, reply_lang: (LN[L] || {}).prompt_name, ui_lang_name: (LN[L] || {}).name, bilingual: L !== base ? 'yes' : '',
      persona_name_ui: personaName(), lesson_list: lessons,
      tools: (pr.tutor || {}).tools === false || !S.cfg.reminders ? '' : 'yes',
      context: ctx.context, current_chapter: ctx.current_chapter,
    };
  }

  /* ---------------- điều hướng (công cụ open_lesson, nút Mở) ---------------- */
  function openLesson(id) {
    const l = T0.find('lesson', id);
    const m = T0.currentMode(), av = T0.availableModes();
    if (!l) { const pg = /^p?(\d+)$/.exec(String(id)); if (pg) { goPage(+pg[1]); return true; } return false; }
    if ((m === 'lesson' || m === 'reading') && av.includes(m)) { T0.setMode(m, { target: { lesson: l.id } }); return true; }
    const p = lpage(l);
    if (p != null && av.includes('pin')) { goPage(p, l.volume); return true; }
    if (av.includes('lesson')) { T0.setMode('lesson', { target: { lesson: l.id } }); return true; }
    return false;
  }
  function goPage(n, vol) {
    if (T0.currentMode() === 'pin' && T0.pageNav && typeof T0.pageNav.go === 'function') { T0.pageNav.go(n, vol || undefined); return; }
    if (typeof T0.goto === 'function') { T0.goto({ page: n, volume: vol || null }); return; }
    T0.setMode('pin', { target: { page: n, volume: vol || null } });
  }

  /* ---------------- đố nhanh (R08) ---------------- */
  function quizIds() {
    const ex = T0.book.exercises || [];
    const chat = ex.filter((e) => (e.placement || []).includes('chat') && (e.items || []).some((it) => it.options && it.correct != null));
    return (chat.length ? chat : ex.filter((e) => e.kind === 'ex.choice_single' && e.lesson && (e.items || []).some((it) => it.options && it.correct != null))).map((e) => e.id);
  }
  function quizFor(lesson) {
    if (!lesson) return null;
    const ids = new Set(quizIds());
    const ex = (T0.book.exercises || []).filter((e) => ids.has(e.id) && (e.lesson === lesson.id || (lesson.exercise_refs || []).includes(e.id)));
    const qs = [];
    ex.forEach((e) => (e.items || []).forEach((it) => { if (it.options && it.correct != null) qs.push({ ex: e, it }); }));
    return qs.length ? qs : null;
  }
  const lessonTitle = (l) => { const t = tl(l.title); const no = l.no != null ? String(l.no) : ''; return no && !t.includes(no) ? no + '. ' + t : t; };
  function localQuiz(lesson) {
    lesson = lesson || route().lesson;
    const qs = quizFor(lesson);
    if (!S.panel) togglePanel('ask');
    if (!qs) { S.chatLog.push({ who: 'bot', html: esc(U('quiz_none')) }); renderPanel(); return; }
    const q = qs[Math.floor(Math.random() * qs.length)];
    const id = 'q' + Date.now().toString(36);
    S.chatLog.push({ who: 'bot', qid: id, quiz: q, lesson: lesson.id, html: quizHtml(q, id, lesson) });
    renderPanel(); pose('think', 3000);
  }
  function quizHtml(q, id, lesson, picked) {
    const head = `<b>${esc(tl(S.cfg.quizRole.name) || U('tab_ask'))} · ${esc(lessonTitle(lesson))}</b><br>${esc(tl(q.it.prompt))}`;
    if (picked != null) return head + `<br>👉 ${esc(tl(q.it.options[picked]))}`;
    return head + `<div class="rb-qopts">${q.it.options.map((a, j) => `<button type="button" class="rb-chip" data-qa="${id}|${j}">${esc(tl(a))}</button>`).join('')}</div>`;
  }
  function answerQuiz(btn) {
    const [id, j] = btn.dataset.qa.split('|');
    const m = S.chatLog.find((x) => x.qid === id);
    if (!m || m.answered) return;
    m.answered = true; m.picked = +j;
    const q = m.quiz, c = +q.it.correct, ok = +j === c;
    const lesson = T0.find('lesson', m.lesson);
    m.html = quizHtml(q, id, lesson, +j);
    const ui = S.cfg.quizRole.ui || {};
    S.chatLog.push({ who: 'bot', html: (ok ? `✅ <b>${esc(tl(ui.right))}</b>` : `💡 ${esc(tl(ui.wrong))} <b>${esc(tl(q.it.options[c]))}</b>`), more: m.lesson });
    pose(ok ? 'happy' : 'think', 1500); renderPanel();
  }

  /* ---------------- nhắc việc (R09–R11) ---------------- */
  // đọc lại từ kho (tab khác / công cụ khác có thể đã ghi); bản trong bộ nhớ luôn được lưu ngay khi đổi nên đọc lại là an toàn
  const syncTasks = () => { const t = store.get('tasks', null); if (Array.isArray(t)) S.tasks = t; const d = store.get('daily', null); if (typeof d === 'string') S.daily = d; };
  const saveTasks = () => { store.set('tasks', S.tasks); store.set('daily', S.daily); };
  function addTask(text, dueIso, src) {
    S.tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text: String(text).slice(0, 200), due: dueIso || null, done: false, src: src || null, fired: false });
    saveTasks(); updateBadge();
  }
  function tomorrow18() { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(18, 0, 0, 0); return d.toISOString(); }
  function updateBadge() {
    const n = S.cfg && S.cfg.reminders ? S.tasks.filter((x) => !x.done && x.due && new Date(x.due) <= new Date()).length : 0;
    const b = S.btn && S.btn.querySelector('.rb-badge');
    if (b) { b.hidden = !n; b.textContent = n; }
    if (S.btn) S.btn.setAttribute('aria-label', personaName() + (roleLabel() ? ' – ' + roleLabel() : '') + (n ? ' (' + n + ')' : ''));
  }
  function checkDue() {
    if (!S.cfg || !S.cfg.reminders) return false;
    syncTasks(); updateBadge();
    const now = new Date(); let shown = false;
    const due = S.tasks.find((x) => !x.done && x.due && new Date(x.due) <= now && !x.fired);
    if (due) {
      due.fired = true; saveTasks(); shown = true;
      bubble(`⏰ <b>${esc(due.text)}</b>`, [
        { label: UL('done_btn'), run: () => { due.done = true; saveTasks(); updateBadge(); pose('happy', 1500); if (S.panel) renderPanel(); } },
        { label: UL('snooze'), run: () => { due.due = new Date(Date.now() + 600000).toISOString(); due.fired = false; saveTasks(); updateBadge(); } },
      ], 'wave', 0, true);
    }
    if (!shown && S.daily) {
      const [h, m] = S.daily.split(':').map(Number); const k = now.toDateString();
      if ((now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)) && store.get('dailyFired', '') !== k) {
        store.set('dailyFired', k); shown = true;
        const nx = nextStep();
        bubble(`📚 <b>${esc(U('study_time'))}</b>${nx ? `<br>${esc(nx.label)}` : ''}`, nx ? [{ label: UL('open_btn'), run: () => openLesson(nx.id) }] : [], 'wave', 0, true);
      }
    }
    return shown;
  }
  // Bước tiếp theo: bài đầu tiên có câu đố nhanh/trắc nghiệm mà chưa có kết quả 'res:<id>' (T0.renderEx ghi khi chấm)
  function nextStep() {
    const ids = new Set(quizIds());
    const ex = T0.book.exercises || [];
    for (const l of mainLessons()) {
      const qs = ex.filter((e) => ids.has(e.id) && e.lesson === l.id);
      if (!qs.length) continue;
      if (qs.some((e) => T0.store.get('res:' + e.id, null) == null)) return { id: l.id, label: lessonTitle(l) };
    }
    return null;
  }

  /* ---------------- nhân vật, bong bóng ---------------- */
  function pose(p, ms) {
    const s = S.btn && S.btn.querySelector('.rb-svg'); if (!s) return;
    s.setAttribute('class', 'rb-svg rb-' + p + (S.cfg.avatarImg ? ' rb-img' : ''));
    clearTimeout(pose._t);
    if (ms) pose._t = setTimeout(() => s.setAttribute('class', 'rb-svg rb-idle' + (S.cfg.avatarImg ? ' rb-img' : '')), ms);
  }
  function closeBubble() { if (S.bubbleEl) { S.bubbleEl.remove(); S.bubbleEl = null; } }
  function bubble(html, acts = [], p = 'wave', ms = 12000, important) {
    if (!S.dock || S.panel) return;
    if (S.bubbleEl && S.bubbleEl._imp && !important) return; // nhắc hạn không bị bong bóng thường đè
    closeBubble();
    const el = document.createElement('div');
    el.className = 'rb-bubble'; el.setAttribute('role', 'status'); el._imp = !!important;
    el.innerHTML = `<button type="button" class="rb-x" aria-label="${esc(U('close') || '×')}">×</button>${html}${acts.length ? `<div class="rb-acts">${acts.map((a, i) => `<button type="button" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}`;
    S.dock.insertBefore(el, S.btn); S.bubbleEl = el; pose(p, 5000);
    el.querySelector('.rb-x').onclick = closeBubble;
    el.querySelectorAll('[data-i]').forEach((b) => (b.onclick = () => { const a = acts[+b.dataset.i]; closeBubble(); a.run(); }));
    clearTimeout(bubble._t);
    if (ms) bubble._t = setTimeout(() => { if (S.bubbleEl === el && !el.matches(':hover') && !el.contains(document.activeElement)) closeBubble(); }, ms);
  }
  function greet() {
    if (store.get('greeted', false)) return;
    store.set('greeted', true);
    const acts = [];
    if (S.cfg.chat || S.cfg.quiz) acts.push({ label: UL('tab_ask'), run: () => togglePanel('ask') });
    if (S.cfg.help) acts.push({ label: UL('tab_help'), run: () => togglePanel('help') });
    else if (S.cfg.reminders) acts.push({ label: UL('tab_tasks'), run: () => togglePanel('tasks') });
    bubble(`<b>${esc(tl(S.cfg.persona.greeting))}</b>`, acts, 'wave', 15000);
  }
  // R04: sang bài mới -> nêu tên bài (+ câu dẫn của bài nếu có), mời Đố nhanh / hỏi / nhắc bài tập
  function onRoute() {
    clearTimeout(S.routeT);
    S.routeT = setTimeout(() => {
      if (!S.dock) return;
      const r = route(), l = r.lesson;
      if (!l || l.id === S.lastLesson) return;
      S.lastLesson = l.id;
      const lead = (l.blocks || []).find((b) => /think|prompt|question/.test(b.type || ''));
      const ls = []; if (lead) i18nStrings(lead.paras || lead.text || lead.items, lang(), ls, 0);
      const acts = [];
      if (S.cfg.quiz && quizFor(l)) acts.push({ label: tlUI(S.cfg.quizRole.name), run: () => { togglePanel('ask'); localQuiz(l); } });
      if (S.cfg.chat) acts.push({ label: UL('tab_ask'), run: () => togglePanel('ask') });
      const hw = (T0.book.exercises || []).some((e) => e.lesson === l.id && !quizIds().includes(e.id)) || (l.exercise_refs || []).length;
      if (S.cfg.reminders && hw && !S.tasks.some((x) => x.src === l.id && !x.done)) acts.push({ label: UL('add_hw'), run: () => { addTask(lessonTitle(l) + ' – ' + U('hw_default'), tomorrow18(), l.id); togglePanel('tasks'); } });
      const lt = ls.length ? ls[0].slice(0, 200) : '';
      setTimeout(() => bubble(`<b>${esc(lessonTitle(l))}</b>${lt ? '<br>' + esc(lt) : ''}`, acts, 'wave', 14000), 300);
    }, 600);
  }

  /* ---------------- bảng điều khiển ---------------- */
  const tabs = () => [S.cfg.chat || S.cfg.quiz ? 'ask' : null, S.cfg.reminders ? 'tasks' : null, S.cfg.help ? 'help' : null].filter(Boolean);
  function togglePanel(which) {
    if (S.panel && !which) { S.panel.remove(); S.panel = null; S.btn.setAttribute('aria-expanded', 'false'); S.btn.focus(); return; }
    closeBubble();
    const tb = tabs();
    if (which && tb.includes(which)) S.tab = which;
    if (!tb.includes(S.tab)) S.tab = tb[0];
    if (!S.panel) {
      S.panel = document.createElement('section');
      S.panel.className = 'rb-panel'; S.panel.id = 'rb-panel';
      S.panel.setAttribute('aria-label', personaName());
      S.panel.setAttribute('data-t0-under-modal', '');
      S.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !document.querySelector('.t0-modal-scrim')) { e.stopPropagation(); togglePanel(); } });
      document.body.appendChild(S.panel);
      S.btn.setAttribute('aria-expanded', 'true');
    }
    renderPanel();
    const f = S.panel.querySelector('#rbIn') || S.panel.querySelector('[role=tab][aria-selected=true]');
    if (f && window.innerWidth > 560) f.focus();
  }
  function renderPanel() {
    if (!S.panel) return;
    const L = lang(), tb = tabs();
    S.panel.innerHTML = `<div class="rb-ph"><div class="rb-av">${avatar('idle')}</div><div><b>${esc(personaName())}</b><small>${esc(roleLabel())}</small></div><div class="rb-sp" role="group" aria-label="${esc(U('reply_lang'))}">${S.cfg.langs.map((l) => `<button type="button" data-l="${l}" aria-pressed="${L === l}">${l.toUpperCase()}</button>`).join('')}<button type="button" data-close aria-label="${esc(U('close') || '×')}">✕</button></div></div>
      ${tb.length > 1 ? `<div class="rb-tabs" role="tablist">${tb.map((k) => `<button type="button" role="tab" data-t="${k}" aria-selected="${S.tab === k}">${esc(UL('tab_' + k))}</button>`).join('')}</div>` : ''}
      <div class="rb-body2" id="rbBody" role="${S.tab === 'ask' ? 'log' : 'region'}" aria-live="polite"></div>${S.tab === 'ask' ? askFooter() : ''}`;
    S.panel.querySelectorAll('[data-l]').forEach((b) => (b.onclick = () => { RL = b.dataset.l; store.set('lang', RL); renderPanel(); updateBadge(); }));
    S.panel.querySelector('[data-close]').onclick = () => togglePanel();
    S.panel.querySelectorAll('[data-t]').forEach((b) => (b.onclick = () => { S.tab = b.dataset.t; renderPanel(); }));
    const body = S.panel.querySelector('#rbBody');
    if (S.tab === 'ask') renderAsk(body); else if (S.tab === 'tasks') renderTasks(body); else renderHelp(body);
  }
  function askFooter() {
    const chips = (UIS().chips || []).map((c, i) => ({ c, i })).filter(({ i }) => (i === 2 ? S.cfg.quiz || S.cfg.chat : i === 3 ? S.cfg.help || S.cfg.chat : S.cfg.chat));
    return `<div class="rb-chips">${chips.map(({ c, i }) => `<button type="button" class="rb-chip" data-q="q${i + 1}">${esc(tl(c))}</button>`).join('')}</div>` +
      (S.cfg.chat ? `<form class="rb-in"><textarea id="rbIn" rows="1" placeholder="${esc(U('ask_placeholder'))}" aria-label="${esc(U('ask_placeholder'))}"></textarea><button type="submit" id="rbSend">${esc(UL('send'))}</button></form>` : '');
  }
  function renderAsk(body) {
    if (!S.chatLog.length) {
      const noAI = S.cfg.chat && S.sample === null;
      S.chatLog.push({ who: 'bot', html: md(tl(S.cfg.persona.greeting)) + (noAI ? `<p class="rb-note">${esc(U('no_ai'))}</p>` : '') });
    }
    body.innerHTML = S.chatLog.map((m, i) => `<div class="rb-msg ${m.who}">${m.html}${m.who === 'bot' && m.say ? `<br><button type="button" class="rb-say" data-say="${i}">🔊 ${esc(U('listen'))}</button>` : ''}${m.more && i === S.chatLog.length - 1 ? `<br><button type="button" class="rb-chip" data-more="${esc(m.more)}" style="margin-top:6px">${esc(UL('quiz_more'))}</button>` : ''}</div>`).join('');
    body.scrollTop = body.scrollHeight;
    body.querySelectorAll('[data-say]').forEach((b) => (b.onclick = () => speak(S.chatLog[+b.dataset.say].say)));
    body.querySelectorAll('[data-qa]').forEach((b) => (b.onclick = () => answerQuiz(b)));
    body.querySelectorAll('[data-more]').forEach((b) => (b.onclick = () => localQuiz(T0.find('lesson', b.dataset.more))));
    const form = S.panel.querySelector('.rb-in'), inp = S.panel.querySelector('#rbIn');
    if (form) {
      form.onsubmit = (e) => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ''; ask(v); };
      inp.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.onsubmit(e); } };
    }
    S.panel.querySelectorAll('[data-q]').forEach((b) => (b.onclick = () => {
      const k = b.dataset.q, chip = (UIS().chips || [])[+k.slice(1) - 1];
      if (k === 'q3' && S.cfg.quiz) { const l = route().lesson; if (l && quizFor(l)) return localQuiz(l); }
      if (k === 'q4') {
        S.chatLog.push({ who: 'me', html: esc(tl(chip)) });
        const g = guide();
        S.chatLog.push({ who: 'bot', html: g.map((x) => `<b>${esc(x.q)}</b><br>${x.html}`).join('<br><br>'), say: g.map((x) => x.q + ' ' + x.say).join(' ') });
        return renderPanel();
      }
      if (!S.cfg.chat) { const l = route().lesson; return localQuiz(l); }
      ask(tl(chip));
    }));
    if (S.ctl) { const s = S.panel.querySelector('#rbSend'); if (s) { s.textContent = UL('stop'); s.type = 'button'; s.onclick = () => S.ctl && S.ctl.abort(); } }
  }
  function speak(text) {
    if (!text) return;
    pose('talk');
    const done = () => pose('idle');
    try { const p = T0.media.speak(plain(text).replace(/[*#_`]/g, ''), { lang: lang() }); if (p && p.then) p.then(done, done); else setTimeout(done, 3000); }
    catch (e) { done(); }
  }

  /* ---------------- hỏi AI (R05/R06) ---------------- */
  function tools(params) {
    const EXEC = {
      open_lesson: ({ id }) => { const ok = openLesson(id); return ok ? { opened: id } : { error: 'unknown id', id }; },
      add_reminder: ({ text, due_iso }) => { let d = due_iso ? new Date(due_iso) : null; if (d && isNaN(d)) d = null; addTask(text, d ? d.toISOString() : null); if (S.tab === 'tasks') renderPanel(); return { saved: true, due: d ? d.toString() : null }; },
      list_reminders: () => S.tasks.map((x) => ({ text: x.text, due: x.due, done: x.done })),
    };
    const allow = new Set(((S.cfg.chatRole.call || {}).tools) || Object.keys(EXEC));
    return (PR().tools || []).filter((d) => EXEC[d.name] && allow.has(d.name) && (d.name === 'open_lesson' || S.cfg.reminders))
      .map((d) => ({ name: d.name, description: T0.tutor.render(d.description, params), inputSchema: d.input_schema, execute: EXEC[d.name] }));
  }
  function systemPrompt() {
    const ctx = context();
    const built = T0.tutor.build('chat', promptParams(ctx));
    return { text: built.text, params: built.params, ctx };
  }
  async function ask(q) {
    if (S.ctl) return;
    S.chatLog.push({ who: 'me', html: esc(q) });
    if (!S.sample) { S.chatLog.push({ who: 'bot', html: esc(S.sample === null ? U('no_ai') : U('fail')) }); return renderPanel(); }
    const msg = { who: 'bot', html: '<span class="rb-dots" aria-label="' + esc(U('thinking')) + '"><span></span><span></span><span></span></span>' };
    S.chatLog.push(msg);
    S.turns.push({ role: 'user', content: q });
    if (S.turns.length > S.cfg.turnsKept) S.turns = S.turns.slice(-S.cfg.turnsKept);
    while (S.turns.length && S.turns[0].role !== 'user') S.turns.shift();
    S.ctl = new AbortController(); pose('think'); renderPanel();
    const call = S.cfg.chatRole.call || {};
    try {
      const sp = systemPrompt();
      const opts = { cache: call.cache === false ? false : undefined, signal: S.ctl.signal, onText: ({ text }) => {
        msg.html = md(text); pose('talk');
        const b = S.panel && S.panel.querySelector('#rbBody');
        if (b && S.tab === 'ask') { const el = b.lastElementChild; if (el) el.innerHTML = msg.html; b.scrollTop = b.scrollHeight; }
      } };
      const tl0 = tools(sp.params); if (tl0.length) opts.tools = tl0;
      if (S.cfg.chatRole.model_tier && S.cfg.chatRole.model_tier !== 'default') opts.modelTier = S.cfg.chatRole.model_tier;
      const out = await S.sample([{ role: 'user', content: sp.text }, { role: 'assistant', content: tl(call.assistant_ack) || 'OK' }, ...S.turns], opts);
      const text = typeof out === 'string' ? out : out && out.text != null ? out.text : '';
      msg.html = md(text); msg.say = text; S.turns.push({ role: 'assistant', content: text });
      if (S.tab === 'tasks') { /* công cụ có thể đã thêm nhắc việc */ }
    } catch (e) {
      const code = e && e.code, codes = UIS().error_codes || {};
      msg.html = (e && e.text ? md(e.text) + '<br>' : '') + esc(code === 'cancelled' || (e && e.name === 'AbortError') ? U('stopped') : U(codes[code] || 'fail'));
      S.turns.pop();
    } finally { S.ctl = null; pose('idle'); renderPanel(); updateBadge(); }
  }

  /* ---------------- tab Nhiệm vụ ---------------- */
  function renderTasks(body) {
    syncTasks();
    const L = lang(), now = new Date();
    const r = route(); const nx = nextStep();
    const loc = L === 'vi' ? 'vi-VN' : L === 'ru' ? 'ru-RU' : L === 'uz' ? 'uz-UZ' : L;
    const fmt = (iso) => { try { return new Date(iso).toLocaleString(loc, { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return iso; } };
    const pad = (n) => String(n).padStart(2, '0'); const d = new Date(Date.now() + 86400000);
    const defDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const defText = r.lesson ? lessonTitle(r.lesson) + ' – ' + U('hw_default') : '';
    const nextCard = S.cfg.quiz ? `<div class="rb-card"><h4>${esc(UL('next_step'))}</h4>${nx ? `${esc(nx.label)} <button type="button" class="rb-go" data-open="${esc(nx.id)}" style="margin-left:6px">${esc(UL('open_btn'))}</button>` : esc(U('all_done'))}</div>` : '';
    body.innerHTML = `${nextCard}
      <div class="rb-card"><h4>${esc(UL('hw_title'))}</h4>${S.tasks.length ? S.tasks.map((x) => { const late = !x.done && x.due && new Date(x.due) < now; return `<div class="rb-task"><input type="checkbox" data-done="${x.id}" ${x.done ? 'checked' : ''} aria-label="${esc(x.text)}"><div><div style="${x.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(x.text)}</div>${x.due ? `<div class="due ${late ? 'late' : ''}">${esc(U('due'))}: ${esc(fmt(x.due))}${late ? ' · ' + esc(U('late')) : ''}</div>` : ''}</div><button type="button" class="del" data-del="${x.id}" aria-label="${esc(U('delete'))}: ${esc(x.text)}">×</button></div>`; }).join('') : `<p class="rb-note" style="margin:0">${esc(U('empty'))}</p>`}
        <form class="rb-form" id="rbAdd" style="margin-top:10px"><input id="rbT" placeholder="${esc(U('what'))}" value="${esc(defText)}" aria-label="${esc(U('what'))}"><div class="row2"><input id="rbD" type="date" value="${defDate}" aria-label="${esc(U('date'))}"><input id="rbH" type="time" value="18:00" aria-label="${esc(U('time'))}"></div><button class="rb-go" type="submit">${esc(UL('add'))}</button></form></div>
      <div class="rb-card"><h4>${esc(UL('daily'))}</h4><form class="rb-form" id="rbDaily"><div class="row2"><input id="rbDT" type="time" value="${S.daily || '19:00'}" aria-label="${esc(UL('daily'))}"><button class="rb-go" type="submit">${esc(UL('daily_set'))}</button>${S.daily ? `<button class="rb-go off" type="button" id="rbOff">${esc(UL('daily_off'))}</button>` : ''}</div>${S.daily ? `<p class="rb-note" style="margin:0">${esc(U('daily_on'))}</p>` : ''}</form></div>
      <p class="rb-note">${esc(U('store_note'))}</p>`;
    body.querySelectorAll('[data-done]').forEach((cb) => (cb.onchange = () => { const x = S.tasks.find((y) => y.id === cb.dataset.done); if (!x) return; x.done = cb.checked; saveTasks(); updateBadge(); if (cb.checked) pose('happy', 1500); renderPanel(); }));
    body.querySelectorAll('[data-del]').forEach((b) => (b.onclick = () => { S.tasks = S.tasks.filter((y) => y.id !== b.dataset.del); saveTasks(); updateBadge(); renderPanel(); }));
    body.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => openLesson(b.dataset.open)));
    body.querySelector('#rbAdd').onsubmit = (e) => {
      e.preventDefault(); const v = body.querySelector('#rbT').value.trim(); if (!v) return;
      const dd = body.querySelector('#rbD').value, hh = body.querySelector('#rbH').value || '18:00';
      const due = dd ? new Date(dd + 'T' + hh) : null;
      addTask(v, due && !isNaN(due) ? due.toISOString() : null, r.lesson ? r.lesson.id : null); pose('happy', 1500); renderPanel();
    };
    body.querySelector('#rbDaily').onsubmit = (e) => { e.preventDefault(); S.daily = body.querySelector('#rbDT').value; store.set('dailyFired', ''); saveTasks(); pose('happy', 1500); renderPanel(); };
    const off = body.querySelector('#rbOff'); if (off) off.onclick = () => { S.daily = ''; saveTasks(); renderPanel(); };
  }

  /* ---------------- tab Hướng dẫn (R12): sinh từ ghim thật và tính năng bật ---------------- */
  // Màu/nhãn ghim: dùng T0.pinKinds (modes/pin.js) nếu có; dự phòng bảng gọn cùng biến màu --pin-*.
  const PINK = {
    exercise: ['--pin-exercise', { uz: 'Topshiriq', ru: 'Задание', vi: 'Bài tập' }], question: ['--pin-exercise', { uz: 'Savol', ru: 'Вопрос', vi: 'Câu hỏi' }],
    skills: ['--pin-exercise', { uz: 'Ko‘nikmalar', ru: 'Навыки', vi: 'Kỹ năng' }], quiz: ['--pin-quiz', { uz: 'Test', ru: 'Тест', vi: 'Trắc nghiệm' }],
    activity: ['--pin-model', { uz: 'Faoliyat', ru: 'Активность', vi: 'Hoạt động' }], simulation: ['--pin-model', { uz: 'Model', ru: 'Модель', vi: 'Mô hình' }],
    demo: ['--pin-demo', { uz: 'Namoyish', ru: 'Демонстрация', vi: 'Trình diễn' }], video: ['--pin-video', { uz: 'Video', ru: 'Видео', vi: 'Video' }],
    story: ['--pin-video', { uz: 'Hikoya', ru: 'История', vi: 'Truyện tranh' }], figure: ['--pin-figure', { uz: 'Rasmni o‘rganish', ru: 'Рисунок', vi: 'Khám phá hình' }],
    audio: ['--pin-audio', { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' }], text_anchor: ['--pin-audio', { uz: 'Tinglash', ru: 'Слушать', vi: 'Nghe' }],
    workbook: ['--pin-workbook', { uz: 'Mashq daftari', ru: 'Рабочая тетрадь', vi: 'Vở bài tập' }], link: ['--pin-workbook', { uz: 'Dars ko‘rinishi', ru: 'Урок', vi: 'Bản bài học' }],
    term: ['--pin-text', { uz: 'Atama', ru: 'Термин', vi: 'Thuật ngữ' }],
  };
  function pinInfo(k) {
    const K = T0.pinKinds && T0.pinKinds[k];
    if (K) return { c: K.c, l: tl(K.l), i: K.i || '' };
    const f = PINK[k]; return f ? { c: f[0], l: tl(f[1]), i: '' } : null;
  }
  function guide() {
    const F = (T0.features && T0.features.features) || {};
    const pages = T0.book.pages || [];
    const out = [];
    const kinds = []; pages.forEach((p) => (p.pins || []).forEach((pin) => { if (!kinds.includes(pin.kind)) kinds.push(pin.kind); }));
    const infos = kinds.map((k) => [k, pinInfo(k)]).filter((x) => x[1]);
    const seen = new Set(); const uniq = infos.filter(([, i]) => { const key = i.c + '|' + i.l; if (seen.has(key)) return false; seen.add(key); return true; });
    if (uniq.length) out.push({ q: U('guide_pins_q'), html: md(U('guide_pins_a')) + '<ul>' + uniq.map(([, i]) => `<li><span class="rb-pin" style="background:var(${i.c},#0A74C0)">${i.i ? `<svg viewBox="0 0 20 20" aria-hidden="true">${i.i}</svg>` : ''}</span>${esc(i.l)}</li>`).join('') + '</ul>', say: U('guide_pins_a') + ' ' + uniq.map(([, i]) => i.l).join(', ') });
    const hasTr = pages.some((p) => (p.tr || []).length || (p.text_lines || []).length);
    if (hasTr || S.cfg.langs.length > 1) {
      const parts = [];
      if (pages.some((p) => (p.tr || []).length)) parts.push(U('guide_tr_tap'));
      if (F.translation_drawer) parts.push(U('guide_tr_drawer'));
      parts.push(U('guide_tr_lang'));
      const eds = [...new Set(pages.flatMap((p) => Object.keys(p.images || {})))];
      if (F.print_edition_switch && eds.length > 1) parts.push(U('guide_tr_edition') + ' **' + eds.map((e) => e.toUpperCase()).join(' / ') + '**');
      out.push({ q: U('guide_tr_q'), html: md(parts.join(' ')), say: parts.join(' ').replace(/\*\*/g, '') });
    }
    if (S.cfg.reminders) {
      const a = U('guide_rem_a') + (S.cfg.chat ? ' ' + U('guide_rem_chat') : '');
      out.push({ q: U('guide_rem_q'), html: md(a), say: a.replace(/\*\*/g, '') });
    }
    return out;
  }
  function renderHelp(body) {
    const ab = S.cfg.chat ? U('abilities') : U('abilities_offline');
    body.innerHTML = guide().map((g) => `<div class="rb-card"><h4>${esc(g.q)}</h4>${g.html}</div>`).join('') +
      `<div class="rb-card"><h4>${esc(personaName())}</h4>${md(ab)}</div>`;
  }

  /* ---------------- vị trí: tránh thanh đáy (lớp học, nhãn giọng đọc) ---------------- */
  function lift() {
    if (!S.dock) return;
    const r = S.dock.getBoundingClientRect();
    let need = 0;
    document.querySelectorAll('.t0c-bar,.t0-badge-voice.on,[data-t0-bottom-bar]').forEach((e) => {
      if (S.dock.contains(e) || e.offsetParent === null && getComputedStyle(e).position !== 'fixed') return;
      const b = e.getBoundingClientRect(); if (!b.width || !b.height) return;
      if (b.right > r.left - 4 && b.left < r.right + 4 && b.top > innerHeight * 0.5) need = Math.max(need, innerHeight - b.top - 6);
    });
    const v = Math.max(0, Math.round(need)) + 'px';
    if (document.documentElement.style.getPropertyValue('--rb-lift') !== v) document.documentElement.style.setProperty('--rb-lift', v);
  }

  /* ---------------- dựng / gỡ ---------------- */
  function teardown() {
    S.timers.forEach((t) => clearInterval(t)); S.timers = [];
    S.offs.forEach((f) => f()); S.offs = [];
    clearTimeout(S.routeT);
    if (S.ctl) try { S.ctl.abort(); } catch (e) { /* */ }
    closeBubble();
    if (S.panel) S.panel.remove();
    if (S.dock) S.dock.remove();
    document.documentElement.classList.remove('rb-on');
    Object.assign(S, { dock: null, btn: null, panel: null, chatLog: [], turns: [], ctl: null, lastLesson: null, cur: null });
  }
  function injectCss() {
    if (document.getElementById('rb-css')) return;
    const st = document.createElement('style'); st.id = 'rb-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function mount() {
    teardown();
    if (!T0.book || !window.T0_PROMPTS) return;
    S.cfg = cfg();
    if (!S.cfg.on) return;
    importLegacy();
    S.tasks = store.get('tasks', []); if (!Array.isArray(S.tasks)) S.tasks = [];
    S.daily = store.get('daily', '') || '';
    const rl = store.get('lang', null); RL = rl && S.cfg.langs.includes(rl) ? rl : null;
    S.tab = (S.cfg.chat || S.cfg.quiz) ? 'ask' : S.cfg.reminders ? 'tasks' : 'help';
    injectCss();
    const dock = document.createElement('div');
    dock.className = 'rb-dock'; dock.setAttribute('data-t0-under-modal', '');
    dock.innerHTML = `<button type="button" class="rb-btn" aria-expanded="false" aria-controls="rb-panel">${avatar('wave')}<span class="rb-badge" hidden></span></button>`;
    document.body.appendChild(dock);
    document.documentElement.classList.add('rb-on');
    S.dock = dock; S.btn = dock.querySelector('.rb-btn');
    S.btn.onclick = () => togglePanel();
    updateBadge();
    if (S.cfg.chat) {
      S.sample = undefined;
      const timeout = new Promise((res) => setTimeout(() => res(null), 4000));
      Promise.race([T0.tutor.sample(), timeout]).then((fn) => { S.sample = fn || null; if (S.panel && S.tab === 'ask' && S.chatLog.length === 1) { S.chatLog = []; renderPanel(); } });
    }
    S.offs.push(T0.on('t0:page', (e) => { S.cur = e.detail ? { n: e.detail.page, vol: e.detail.volume || null } : null; onRoute(); }));
    S.offs.push(T0.on('t0:route', (e) => { const d = e.detail || {}; if (d.page != null) S.cur = { n: d.page, vol: d.volume || null }; S.routeLesson = d.lesson || null; S.routeMode = T0.currentMode(); onRoute(); }));
    S.offs.push(T0.on('t0:mode', (e) => { S.modeTarget = (e.detail && e.detail.target) || null; S.routeLesson = null; onRoute(); }));
    S.offs.push(T0.on('t0:lang', () => { if (!RL) { if (S.panel) renderPanel(); updateBadge(); } }));  // T0.lang/lang2/dual đổi -> nhãn kép theo
    S.offs.push(T0.on('t0:exresult', () => { if (S.panel && S.tab === 'tasks') renderPanel(); }));
    const onKey = (e) => { if (e.key === 'Escape' && S.panel && !document.querySelector('.t0-modal-scrim') && !S.panel.contains(e.target)) togglePanel(); };
    document.addEventListener('keydown', onKey); S.offs.push(() => document.removeEventListener('keydown', onKey));
    window.addEventListener('resize', lift); S.offs.push(() => window.removeEventListener('resize', lift));
    S.timers.push(setInterval(checkDue, 30000));
    S.timers.push(setInterval(lift, 1000));
    // chế độ bài học/đọc không phát t0:page: theo dõi bài đang mở qua T0.store (lesson:view / reading:lesson)
    let lastKey = null;
    S.timers.push(setInterval(() => { const m = T0.currentMode(); if (m === 'pin') return; const blk = T0.root && T0.root.querySelector('[data-block]'); const k = m + JSON.stringify(T0.store.get(m === 'lesson' ? 'lesson:view' : 'reading:lesson', null)) + (blk ? blk.dataset.block : ''); if (k !== lastKey) { lastKey = k; onRoute(); } }, 1500));
    setTimeout(() => { if (!S.dock) return; lift(); if (!checkDue()) greet(); }, 1400);
    onRoute();
  }

  T0.on('t0:load', () => setTimeout(mount, 0));
  if (T0.book) setTimeout(mount, 0);

  T0.robo = {
    open: (tab) => S.dock && togglePanel(tab || S.tab),
    close: () => { if (S.panel) togglePanel(); },
    bubble: (html, acts, p, ms) => bubble(html, acts || [], p, ms),
    quiz: (lessonId) => localQuiz(lessonId ? T0.find('lesson', lessonId) : null),
    addTask, context: () => (S.cfg ? context() : null), prompt: () => (S.cfg ? systemPrompt().text : ''), openLesson, pose: (p, ms) => pose(p, ms),
    nextStep: () => (S.cfg ? nextStep() : null), state: () => S,
  };
})();
