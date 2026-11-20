// Đo bổ sung v2: thuyết minh mặc định, bong bóng onRoute, tự luận p37, chế độ tối hệ thống.
const { chromium } = require('playwright'); const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const NEW = 'http://localhost:8702/index.html';
(async () => {
  const b = await chromium.launch(); const out = {};
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const p = await ctx.newPage(); const mp3 = []; p.on('request', (r) => { if (/\.mp3/.test(r.url())) mp3.push(r.url().replace(/^.*\//, '')); });
  await p.addInitScript(() => { const A = window.Audio; window.__auds = []; window.Audio = function (...a) { const x = new A(...a); window.__auds.push(x); return x; }; window.Audio.prototype = A.prototype; });
  await p.goto(NEW + '#p5'); await sleep(1500);
  out.darkBg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  out.lang = await p.evaluate(() => T0.lang + '/' + (T0.lang2 || ''));
  await p.evaluate(() => document.querySelectorAll('.rb-bubble').forEach((x) => x.remove()));
  await p.click('.pm-pin[data-ref="video.t1"]'); await sleep(3500);
  out.audio = await p.evaluate(() => (window.__auds || []).map((a) => ({ src: a.src.replace(/^.*\//, ''), paused: a.paused, t: a.currentTime.toFixed(1) })));
  out.mp3 = mp3.slice(); out.n = await p.$eval('.t0-modal .sp-n', (e) => e.textContent).catch(() => null);
  await p.screenshot({ path: '_anh/v2/F44b-moi-390.png' });
  await p.keyboard.press('Escape'); await sleep(300);
  // onRoute: p20 -> p21 (bài 4 bắt đầu trang 21)
  await p.goto(NEW + '#p19'); await sleep(1500); await p.evaluate(() => document.querySelectorAll('.rb-bubble').forEach((x) => x.remove()));
  for (let i = 0; i < 2; i++) { await p.keyboard.press('ArrowRight'); await sleep(2500); }
  out.route = { hash: p.url().replace(/^.*#/, ''), bubble: await p.$eval('.rb-bubble', (e) => e.innerText).catch(() => null) };
  await p.screenshot({ path: '_anh/v2/F14b-moi-390.png' });
  // tự luận p37
  await p.goto(NEW + '#p37'); await sleep(1200); await p.evaluate(() => document.querySelectorAll('.rb-bubble').forEach((x) => x.remove()));
  await p.$eval('.pm-pin[data-ref="p37.q1"]', (e) => e.click()); await sleep(600);
  await p.fill('.t0-modal textarea', 'Câu trả lời thử');
  const btns = await p.$$eval('.t0-modal button', (a) => a.map((x) => x.textContent.trim()));
  await p.evaluate(() => { const b = [...document.querySelectorAll('.t0-modal button')].find((x) => /Lưu|Saqlash/.test(x.textContent)); b && b.click(); }); await sleep(400);
  out.open = { btns, body: await p.$eval('.t0-modal', (e) => e.innerText.slice(0, 500)) };
  await p.screenshot({ path: '_anh/v2/F16-moi-390.png' });
  await p.keyboard.press('Escape'); await sleep(300);
  out.doneAfter = await p.$$eval('.pm-pin.done', (a) => a.map((x) => x.dataset.ref));
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
