// Chạy đối chiếu bản cũ / bản mới kimyo8 bằng Playwright.
// Cách chạy (từ bất kỳ đâu):
//   (cd $R/doi-dang/kimyo8/_cu && python3 -m http.server 8701) &
//   (cd $R/tang0/dau-doc/dist/kimyo8 && python3 -m http.server 8702) &
//   node $R/doi-dang/kimyo8/_cong-cu/chay.js [lọc-id]
// Ghi ảnh vào ../_anh/<id>-<cu|moi>-<390|1280>.png và số đo vào ../_anh/do.json
// AI (sample) được GIẢ LẬP như nhau ở cả hai bản (trả về một câu cố định) để so luồng giao diện, không so chất lượng AI.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '_anh');
fs.mkdirSync(OUT, { recursive: true });
const OLD = 'http://localhost:8701/index.html', NEW = 'http://localhost:8702/index.html';
const VPS = [[390, 844], [1280, 800]];
const FILTER = process.argv[2] ? new RegExp(process.argv[2]) : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function mock(teacher) {
  return `(() => { window.__MOCK_TEACH=${teacher ? 'true' : 'false'}; ${teacher ? 'window.__TEACH=true;' : ''}
    const fake = async (input, opts) => { const t = '[AI giả lập] Gợi ý: hãy viết phương trình phản ứng trước rồi tính số mol.'; try { opts && opts.onText && opts.onText({ text: t }); } catch (e) {} await new Promise(r=>setTimeout(r,300)); return { text: t }; };
    fake.json = async () => ({});
    window.claude = { use: async (n) => { if (n === 'sample') return fake; if (n === 'user') return { canEdit: async () => window.__MOCK_TEACH, id: async () => 'u1', name: async () => 'Thu' }; if (n === 'assets') return { upload: async () => ({ id: 'x' }) }; return null; } };
  })();`;
}

// ---------- kịch bản ----------
// Mỗi kịch bản: id, nhóm, mô tả, cu(page, vp) / moi(page, vp) -> trả số đo (tùy chọn)
const oldGo = async (p, n) => { await p.evaluate((n) => { location.hash = '#p' + n; }, n); await sleep(500); };
const newOpen = async (p, n, lang) => { await p.goto(NEW + '?page=' + n + (lang ? '&lang=' + lang : ''), { waitUntil: 'load' }); await sleep(900); };
const newLang = async (p, l) => { await p.selectOption('#t0-lang', l); await sleep(500); };
const newModalSim = async (p, videoId, idx) => {
  await p.evaluate(({ videoId, idx }) => {
    const box = document.createElement('div');
    window.T0.ui.modal(box, { title: 'video', wide: true });
    window.T0.renderSim(box, { kind: 'sim.scene_player', params: { video: videoId } });
    const ds = box.querySelectorAll('.sp-dots button'); if (ds[idx]) ds[idx].click();
  }, { videoId, idx });
};
const oldVideo = async (p, id, idx) => { await p.evaluate(({ id, idx }) => { openVideo(id); for (let k = 0; k < idx; k++) document.getElementById('vN').click(); }, { id, idx }); };
const clickIf = async (p, sel) => { const e = await p.$(sel); if (e) { try { await e.click({ timeout: 2000 }); } catch (x) { await e.evaluate((n) => n.click()); } return true; } return false; };
const count = (p, sel) => p.$$eval(sel, (a) => a.length);
const text = (p, sel) => p.$eval(sel, (e) => e.innerText.slice(0, 400)).catch(() => null);
const sceneMeasure = async (p, root) => p.evaluate((root) => {
  const r = document.querySelector(root); if (!r) return null;
  return { svg: r.querySelectorAll('svg').length, svgNodes: [...r.querySelectorAll('svg *')].length, unsupported: r.querySelectorAll('.t0-unsupported').length, text: r.innerText.replace(/\s+/g, ' ').slice(0, 300) };
}, root);

const SCENE = { // kind -> [topic, scene index] (lấy từ TP bản cũ)
  img: ['t1', 0], steps: ['b0', 2], lines: ['t1', 2], cMol: ['i1', 0], cIcons: ['i2', 0], cReact: ['t2', 3], cShell: ['t4', 0],
  pCharge: ['i9', 0], cIonic: ['i14', 0], pGraph: ['t25', 0], cTube: ['t27', 2], cBond: ['t37', 0], cLab: ['t37', 1], cReact0: ['t37', 2],
  cFountain: ['t37', 3], cIon: ['t37', 4], cSmoke: ['t37', 5], cBurn: ['t37', 6], cLife: ['t37', 8],
};

const S = [
  { id: 'F01', nhom: 'giao-dien', ten: 'Màn khởi động trang 5',
    cu: async (p) => { await oldGo(p, 5); await sleep(1800); return { robo: await count(p, '.rb-btn'), bubble: await text(p, '.rb-bubble'), top: await text(p, 'header.top') }; },
    moi: async (p) => { await newOpen(p, 5); await sleep(1800); return { robo: await count(p, '.rb-btn,[class*=robo]'), top: await text(p, '.t0-top'), bar: await text(p, '.pm-bar'), lang: await p.$eval('#t0-lang', (e) => e.value) }; } },
  { id: 'F02', nhom: 'ngon-ngu', ten: 'Chọn tiếng Việt',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '#segL [data-v=vi]'); await sleep(400); return { bar: await text(p, '#pbar'), sel: await text(p, '#chSel') }; },
    moi: async (p) => { await newOpen(p, 5); await newLang(p, 'vi'); return { top: await text(p, '.t0-top'), bar: await text(p, '.pm-bar') }; } },
  { id: 'F03', nhom: 'ngon-ngu', ten: 'Chạm vùng chữ: ghi chú dịch (VI)',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#segL [data-v=vi]'); await clickIf(p, '.page[data-pg="21"] .tz:nth-of-type(3)'); await sleep(400); return { tip: await text(p, '.tip') }; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); const b = (await p.$$('.pm-tr'))[2]; if (b) await b.click(); await sleep(400); return { tip: await text(p, '.pm-bub') }; } },
  { id: 'F04', nhom: 'ngon-ngu', ten: 'Song ngữ VI+RU',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#segL [data-v=both]'); await clickIf(p, '.page[data-pg="21"] .tz:nth-of-type(3)'); await sleep(400); const t = await text(p, '.tip'); await clickIf(p, '#segL [data-v=vi]'); return { tip: t }; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); return { note: 'không có chế độ song ngữ: chỉ chọn 1 trong uz/ru/vi', opts: await p.$$eval('#t0-lang option', (a) => a.map((o) => o.textContent)) }; } },
  { id: 'F05', nhom: 'giao-dien', ten: 'Ngăn dịch (Tarjima) cả trang + OCR Nga',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#segL [data-v=both]'); await clickIf(p, '#bTr'); await sleep(400); const r = { items: await count(p, '#drawer .tri'), ocr: await count(p, '#drawer details.rux'), exBtn: await count(p, '#drawer [data-ex]') }; await clickIf(p, '#segL [data-v=vi]'); return r; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); await clickIf(p, '.pm-bar button[aria-label="Bản dịch"]'); await sleep(400); return { p: await count(p, '.pm-drawer p'), pins: await count(p, '.pm-drawer li'), ocr: await p.evaluate(() => /Распознан|OCR|Русское/.test(document.body.innerText)) }; } },
  { id: 'F06', nhom: 'giao-dien', ten: 'Dải hình thu nhỏ',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#bTh'); await sleep(500); return { thumbs: await count(p, '#thumbs [data-go]') }; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); return { thumbs: await count(p, '[class*=thumb]'), pageSelect: await count(p, '.pm-sel option') }; } },
  { id: 'F07', nhom: 'giao-dien', ten: 'Đổi bản in UZ -> RU',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#bPL'); await sleep(600); const r = { ru: await count(p, '.page.ru'), pinsCol: await count(p, '.page.ru .hs') }; await clickIf(p, '#bPL'); return r; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); const b = await p.$('.pm-seg button:has-text("RU")'); if (b) await b.click(); await sleep(600); const r = { seg: await count(p, '.pm-seg button'), img: await p.$eval('.pm-page img', (i) => i.getAttribute('src')).catch(() => null) }; const u = await p.$('.pm-seg button:has-text("UZ")'); if (u) await u.click(); return r; } },
  { id: 'F08', nhom: 'robo', ten: 'Robo: nhân vật nổi + bong bóng chào',
    pre: (p) => p.evaluate(() => { try { localStorage.removeItem('robo.kim:greeted'); } catch (e) {} }),
    cu: async (p) => { await p.reload(); await sleep(2600); return { robo: await count(p, '.rb-btn svg'), bubble: await text(p, '.rb-bubble'), pose: await p.$eval('.rb-btn svg', (s) => s.getAttribute('class')).catch(() => null) }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await sleep(2000); return { robo: await p.evaluate(() => /robo/i.test(document.body.innerHTML.replace(/T0_PROMPTS[\s\S]*/, ''))), floating: await count(p, '.rb-btn,.rb-dock,[class*=tutor-fab]') }; } },
  { id: 'F09', nhom: 'robo', ten: 'Robo: bảng Hỏi đáp + câu gợi ý + AI chat',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.rb-bubble .rb-x'); await clickIf(p, '.rb-btn'); await sleep(500); await p.fill('#rbIn', 'Nguyên tử là gì?'); await clickIf(p, '#rbSend'); await sleep(1200); return { chips: await count(p, '.rb-chip[data-q]'), msgs: await count(p, '.rb-msg'), last: await text(p, '.rb-msg:last-child') }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); return { chatEntry: await p.evaluate(() => !!document.querySelector('[aria-label*="Robo"],[data-tutor]')), lessonMode: await p.evaluate(() => window.T0.availableModes()) }; } },
  { id: 'F10', nhom: 'robo', ten: 'Robo: Đố nhanh (localQuiz)',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.rb-bubble .rb-x'); await clickIf(p, '.rb-btn'); await sleep(300); await clickIf(p, '.rb-chip[data-q=q3]'); await sleep(500); await clickIf(p, '[data-qa]'); await sleep(400); return { last: await text(p, '.rb-msg:last-child') }; },
    moi: async () => ({ none: true }) },
  { id: 'F11', nhom: 'robo', ten: 'Robo: Nhiệm vụ / nhắc bài / giờ học hằng ngày / bước tiếp theo',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.rb-bubble .rb-x'); await clickIf(p, '.rb-btn'); await sleep(300); await clickIf(p, '.rb-tabs [data-t=tasks]'); await sleep(300); await p.fill('#rbT', 'Làm bài 5 trang 21'); await clickIf(p, '#rbAdd .rb-go'); await sleep(400); return { tasks: await count(p, '.rb-task'), cards: await count(p, '.rb-card') }; },
    moi: async () => ({ none: true }) },
  { id: 'F12', nhom: 'robo', ten: 'Robo: Hướng dẫn dùng sách',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.rb-bubble .rb-x'); await clickIf(p, '.rb-btn'); await sleep(300); await clickIf(p, '.rb-tabs [data-t=help]'); await sleep(300); return { cards: await count(p, '.rb-card') }; },
    moi: async () => ({ none: true }) },
  { id: 'F13', nhom: 'robo', ten: 'Robo: nhắc hạn đến giờ (checkDue, badge, hoãn 10 phút)',
    pre: (p) => p.evaluate(() => { try { localStorage.setItem('robo.kim:tasks', JSON.stringify([{ id: 'a', text: 'Ôn bài 4', due: new Date(Date.now() - 60000).toISOString(), done: false, fired: false }])); localStorage.setItem('robo.kim:greeted', 'true'); } catch (e) {} }),
    cu: async (p) => { await p.reload(); await sleep(2600); const r = { bubble: await text(p, '.rb-bubble'), badge: await text(p, '.rb-badge') }; await p.evaluate(() => localStorage.removeItem('robo.kim:tasks')); return r; },
    moi: async () => ({ none: true }) },
  { id: 'F14', nhom: 'robo', ten: 'Robo: bong bóng khi sang bài mới (onRoute)',
    cu: async (p) => { await oldGo(p, 20); await sleep(300); await oldGo(p, 21); await sleep(1800); return { bubble: await text(p, '.rb-bubble') }; },
    moi: async () => ({ none: true }) },
  { id: 'F15', nhom: 'bai-tap', ten: 'Bài tập đáp án ngắn: chấm, sai 2 lần -> lời giải, gợi ý AI',
    cu: async (p) => { await oldGo(p, 21); await clickIf(p, '#segL [data-v=vi]'); await clickIf(p, '.hs.ex'); await sleep(400); const inp = await p.$('#mB input'); await inp.fill('5'); await clickIf(p, '#mB [data-a=chk]'); await sleep(100); await clickIf(p, '#mB [data-a=chk]'); await sleep(200); await clickIf(p, '#mB .solw button'); await clickIf(p, '#mB [data-a=hint]'); await sleep(900); const r = { fb: await text(p, '#mB .fb'), sol: await text(p, '#mB .sol'), hintBtn: await count(p, '#mB [data-a=hint]:not([hidden])') }; return r; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); await clickIf(p, '.pm-pin[data-ref="p21.q5"]'); await sleep(500); const inp = await p.$('.t0-modal input[type=text],.t0-modal input:not([type])'); if (inp) await inp.fill('5'); const chk = async () => { const b = await p.$('.t0-modal button:has-text("Kiểm tra")'); if (b) await b.click(); await sleep(250); }; await chk(); await chk(); const so = await p.$('.t0-modal button:has-text("lời giải")'); if (so) await so.click(); await sleep(200); const r = { modal: await text(p, '.t0-modal'), hintBtn: await count(p, '.t0-modal button:has-text("Gợi ý")') }; const h = await p.$('.t0-modal button:has-text("Gợi ý")'); if (h) { await h.click(); await sleep(1500); r.tutor = await text(p, '.t0-tutor'); } return r; } },
  { id: 'F16', nhom: 'bai-tap', ten: 'Bài tự luận: lưu + lời giải mẫu',
    cu: async (p) => { await oldGo(p, 37); await clickIf(p, '.hs.ex'); await sleep(400); await p.fill('#mB textarea', 'Câu trả lời thử'); await clickIf(p, '#mB [data-a=save]'); await sleep(200); await clickIf(p, '#mB .solw button'); await sleep(200); return { fb: await text(p, '#mB .fb'), sol: await text(p, '#mB .sol') }; },
    moi: async (p) => { await newOpen(p, 37, 'vi'); await clickIf(p, '.pm-pin[data-ref="p37.q1"]'); await sleep(500); const ta = await p.$('.t0-modal textarea'); if (ta) await ta.fill('Câu trả lời thử'); const b = await p.$('.t0-modal button:has-text("Kiểm tra"),.t0-modal button:has-text("Lưu")'); if (b) await b.click(); await sleep(300); const so = await p.$('.t0-modal button:has-text("lời giải")'); if (so) await so.click(); await sleep(200); return { modal: await text(p, '.t0-modal') }; } },
  { id: 'F17', nhom: 'bai-tap', ten: 'Trắc nghiệm bài (quiz 5 câu)',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.hs.quiz'); await sleep(300); await clickIf(p, '#mB .opt'); await sleep(200); return { body: await text(p, '#mB') }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await clickIf(p, '.pm-pin[data-ref="t1.quiz"]'); await sleep(500); const o = await p.$('.t0-modal input[type=radio],.t0-modal .t0-opt,.t0-modal label'); if (o) await o.click(); await sleep(200); return { body: await text(p, '.t0-modal') }; } },
  { id: 'F18', nhom: 'bai-tap', ten: 'Hoạt động sắp thứ tự (order)',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.hs.model'); await sleep(300); await clickIf(p, '#mB #oc'); await sleep(200); return { body: await text(p, '#mB') }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await clickIf(p, '.pm-pin[data-ref="t1.model"]'); await sleep(500); const b = await p.$('.t0-modal button:has-text("Kiểm tra")'); if (b) await b.click(); await sleep(200); return { body: await text(p, '.t0-modal'), unsupported: await count(p, '.t0-modal .t0-unsupported') }; } },
  { id: 'F19', nhom: 'bai-tap', ten: 'Hoạt động phân loại (sort)',
    cu: async (p) => { await p.evaluate(() => openModel('t2')); await sleep(300); await clickIf(p, '#mB [data-c] '); await clickIf(p, '#mB #oc'); await sleep(200); return { body: await text(p, '#mB') }; },
    moi: async (p) => { await newOpen(p, 10, 'vi'); await clickIf(p, '.pm-pin[data-ref="t2.model"]'); await sleep(500); const b = await p.$('.t0-modal button:has-text("Kiểm tra")'); if (b) await b.click(); await sleep(200); return { body: await text(p, '.t0-modal'), unsupported: await count(p, '.t0-modal .t0-unsupported') }; } },
  { id: 'F20', nhom: 'mo-phong', ten: 'Khám phá hình (openFig)',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '.hs.fig'); await sleep(300); await clickIf(p, '#mB .fxl [data-j="1"]'); await sleep(200); return { pts: await count(p, '#mB .fx [data-j]'), info: await text(p, '#fxi') }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); const pin = await p.$('.pm-pin[data-kind=figure],.pm-pin[data-ref^="p5.rasm"],.pm-pin[data-ref^="fig"]'); if (pin) await pin.click(); else { const pins = await p.$$('.pm-pin'); if (pins[0]) await pins[0].click(); } await sleep(600); const pt = (await p.$$('.t0-modal button'))[3]; if (pt) await pt.click(); await sleep(200); return { body: await text(p, '.t0-modal') }; } },
  { id: 'F21', nhom: 'video', ten: 'Mở video bài 1 từ ghim (cảnh ảnh trang + phụ đề + thuyết minh)',
    cu: async (p) => { await oldGo(p, 5); await clickIf(p, '#segL [data-v=vi]'); await clickIf(p, '.hs.video:nth-of-type(2)'); await p.evaluate(() => { const b = [...document.querySelectorAll('.hs.video')].find((x) => /1-§/.test(x.title)); b && b.click(); }); await sleep(2500); return { m: await sceneMeasure(p, '#mB'), cap: await text(p, '#vC'), au: await p.evaluate(() => window.__AUEL ? { src: window.__AUEL.src, paused: window.__AUEL.paused } : null) }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await clickIf(p, '.pm-pin[data-ref="video.t1"]'); await sleep(600); const pl = await p.$('.t0-modal .sp-ctl .t0-btn.primary'); if (pl) await pl.click(); await sleep(2000); return { m: await sceneMeasure(p, '.t0-modal'), au: await p.evaluate(() => [...document.querySelectorAll('audio')].map((a) => ({ src: a.src, paused: a.paused }))) }; } },
];
for (const [k, [tid, i]] of Object.entries(SCENE)) {
  S.push({ id: 'V-' + k, nhom: 'video-canh', ten: 'Cảnh ' + k + ' (' + tid + ' cảnh ' + (i + 1) + ')', canh: true,
    cu: async (p) => { await oldVideo(p, tid, i); await p.evaluate(() => { const b = document.getElementById('vPl'); if (b && b.textContent === '❚❚') b.click(); }); await sleep(200); await p.evaluate(() => document.getElementById('vPl').click()); await sleep(3200); return sceneMeasure(p, '#mB'); },
    moi: async (p) => { await newModalSim(p, 'video.' + tid, i); await sleep(3200); return sceneMeasure(p, '.t0-modal'); } });
}
S.push(
  { id: 'F40', nhom: 'giao-vien', ten: 'Chế độ giáo viên: thay video từng thứ tiếng + quản lý hàng loạt', teacher: true,
    cu: async (p) => { await oldGo(p, 5); await sleep(800); const btn = await count(p, '#bVM'); await clickIf(p, '#bVM'); await sleep(400); const r = { btn, mgrRows: await count(p, '#mB .vmt tr') }; return r; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await sleep(1500); const tools = await text(p, '#t0-tools'); const b = await p.$('#t0-tools button'); if (b) await b.click(); await sleep(500); return { tools, modal: await text(p, '.t0-modal') }; } },
  { id: 'F41', nhom: 'giao-vien', ten: 'Nút "Thay video" trong trình phát (GV)', teacher: true,
    cu: async (p) => { await oldGo(p, 5); await sleep(800); await p.evaluate(() => openVideo('t1')); await sleep(500); await clickIf(p, '.vmb [data-vm=edit]'); await sleep(300); return { bar: await text(p, '.vmb'), form: await count(p, '.vmf') }; },
    moi: async (p) => { await newOpen(p, 5, 'vi'); await sleep(1500); await clickIf(p, '.pm-pin[data-ref="video.t1"]'); await sleep(600); return { body: await text(p, '.t0-modal') }; } },
  { id: 'F42', nhom: 'giao-dien', ten: 'Chế độ tối',
    dark: true,
    cu: async (p) => { await oldGo(p, 21); await sleep(400); return { bg: await p.evaluate(() => getComputedStyle(document.body).backgroundColor) }; },
    moi: async (p) => { await newOpen(p, 21, 'vi'); await clickIf(p, '#t0-theme'); await sleep(300); return { bg: await p.evaluate(() => getComputedStyle(document.body).backgroundColor) }; } },
  { id: 'F43', nhom: 'giao-dien', ten: 'Liên kết sâu tới trang + tiến độ ghim (done)',
    cu: async (p) => { await p.goto(OLD + '#p37'); await sleep(800); return { url: p.url(), pages: await p.$$eval('.page[data-pg]', (a) => a.map((x) => x.dataset.pg)), done: await count(p, '.hs.done') }; },
    moi: async (p) => { await p.goto(NEW + '?page=37&lang=vi'); await sleep(900); return { url: p.url(), page: await p.$$eval('.pm-page', (a) => a.map((x) => x.dataset.n)), done: await count(p, '.pm-pin.done') }; } },
);

S.push({ id: 'F44', nhom: 'ngon-ngu', ten: 'Thuyết minh vi khi mở video ở thiết lập mặc định',
  cu: async (p) => { await p.evaluate(() => { localStorage.removeItem('kim8.l2'); }); await p.reload(); await sleep(900); await p.evaluate(() => openVideo('t1')); await sleep(2500); return { au: await p.evaluate(() => window.__AUEL ? { src: window.__AUEL.src.replace(/^.*\//,''), paused: window.__AUEL.paused } : null), cap: await text(p, '#vC') }; },
  moi: async (p) => { await p.evaluate(() => { localStorage.removeItem('t0:_:lang'); }); await p.goto(NEW + '?page=5'); await sleep(900); await clickIf(p, '.pm-pin[data-ref="video.t1"]'); await sleep(500); const pl = await p.$('.t0-modal .sp-ctl .t0-btn.primary'); if (pl) await pl.click(); await sleep(2500); return { lang: await p.evaluate(() => T0.lang), au: await p.evaluate(() => [...document.querySelectorAll('audio')].map((a) => ({ src: a.src.replace(/^.*\//,''), paused: a.paused }))), badge: await text(p, '.t0-badge-voice.on'), nar: await text(p, '.sp-nar') }; } });
(async () => {
  const browser = await chromium.launch();
  const res = fs.existsSync(path.join(OUT, 'do.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'do.json'), 'utf8')) : {};
  for (const [w, h] of VPS) {
    for (const side of ['cu', 'moi']) {
      const mk = async (teacher, dark) => {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: dark ? 'dark' : 'light' });
        await ctx.addInitScript(mock(teacher));
        const p = await ctx.newPage();
        const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 160)));
        const reqs = []; p.on('request', (r) => { if (/\.mp3/.test(r.url())) reqs.push(r.url().replace(/^.*\//, '')); });
        await p.goto(side === 'cu' ? OLD + '#p5' : NEW + '?page=5', { waitUntil: 'load' });
        await sleep(800);
        return { ctx, p, errs, reqs };
      };
      let cur = await mk(false, false);
      for (const sc of S) {
        if (FILTER && !FILTER.test(sc.id)) continue;
        let env = cur;
        if (sc.teacher || sc.dark) env = await mk(!!sc.teacher, !!sc.dark);
        const { p } = env;
        const key = `${sc.id}-${side}-${w}`;
        let m = null;
        try {
          if (sc.pre) { await sc.pre(p); }
          m = await sc[side](p);
        } catch (e) { m = { loi: String(e.message).slice(0, 200) }; }
        await sleep(150);
        await p.screenshot({ path: path.join(OUT, `${key}.png`) });
        res[key] = { ten: sc.ten, nhom: sc.nhom, do: m, mp3: env.reqs.slice(-3), loi_trang: env.errs.slice(-3) };
        // đóng modal / panel để kịch bản sau sạch
        try {
          await p.keyboard.press('Escape');
          await p.evaluate(() => { try { closeModal(); } catch (e) {} document.querySelectorAll('.t0-modal-scrim').forEach((x) => x.remove()); const rp = document.querySelector('.rb-panel'); if (rp) document.querySelector('.rb-btn').click(); document.querySelectorAll('.rb-bubble').forEach((b) => b.remove()); try { window.T0 && T0.media.stop(); } catch (e) {} });
        } catch (e) {}
        if (env !== cur) await env.ctx.close();
        process.stdout.write('.');
      }
      await cur.ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'do.json'), JSON.stringify(res, null, 1));
  await browser.close();
  console.log('\nxong', Object.keys(res).length);
})();
