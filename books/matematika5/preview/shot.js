// Chụp bản xem trước matematika5 ở 390×844. Chạy (từ thư mục preview/): node shot.js
// Ảnh/audio của cuốn được phục vụ từ _mau/ qua page.route (dist không chứa ảnh; files.json tham chiếu artifact cũ).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const HERE = __dirname, base = 'file://' + path.join(HERE, 'dist', 'index.html');
(async () => {
  const b = await chromium.launch();
  const errs = [], report = [];
  fs.mkdirSync(path.join(HERE, '_anh'), { recursive: true });
  async function shot(q, name, fn, vw = 390, vh = 844) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1, hasTouch: true });
    const p = await ctx.newPage();
    const miss = [];
    await p.route(/\/mau\/matematika5\/(.+)$/, (route) => {
      const rel = decodeURIComponent(route.request().url().split('/mau/matematika5/')[1]);
      const f = path.join(HERE, '_mau', rel);
      if (fs.existsSync(f)) route.fulfill({ path: f }); else { miss.push(rel); route.fulfill({ status: 404, body: '' }); }
    });
    p.on('console', (m) => { if (m.type() === 'error' && !/404|ERR_FILE_NOT_FOUND|Failed to load resource/.test(m.text())) errs.push(name + ': ' + m.text()); });
    p.on('pageerror', (e) => errs.push(name + ': ' + e));
    p.setDefaultTimeout(5000);
    await p.goto(base + q); await p.waitForTimeout(800);
    let note = '';
    if (fn) note = (await fn(p)) || '';
    await p.waitForTimeout(500);
    const m = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth > window.innerWidth + 1,
      unsupported: [...document.querySelectorAll('.t0-unsupported')].map((e) => e.textContent.trim().slice(0, 80)),
    }));
    report.push({ name, ...m, miss: miss.slice(0, 5), note });
    await p.screenshot({ path: path.join(HERE, '_anh', name + '.png') });
    await ctx.close();
  }
  const Q = '?book=matematika5&mode=pin';
  await shot(Q + '&page=8&lang=vi', 'm5-tb-p8-vi');
  await shot(Q + '&page=11&lang=vi', 'm5-tb-p11-tr-vi', async (p) => { await p.click('.pm-tr >> nth=1', { force: true }); });
  await shot(Q + '&page=11&lang=vi', 'm5-ex-p11q1-vi', async (p) => { await p.click('.pm-pin[data-ref="p11.q1"]', { force: true }); await p.waitForTimeout(300);
    const inp = p.locator('input').first(); if (await inp.count()) { await inp.fill('206000'); } });
  await shot(Q + '&page=8&lang=ru', 'm5-video-t8-ru', async (p) => { await p.click('.pm-pin[data-ref="video.t8"]', { force: true }); });
  await shot(Q + '&page=8&lang=vi', 'm5-video-t8-canh3-lines-vi', async (p) => { await p.click('.pm-pin[data-ref="video.t8"]', { force: true }); await p.waitForTimeout(300);
    const dots = p.locator('[role=dialog] button[aria-label]'); const n = await dots.count();
    for (let k = 0; k < n; k++) { const l = await dots.nth(k).getAttribute('aria-label'); if (/(^|\D)3(\D|$)/.test(l || '')) { await dots.nth(k).click({ force: true }); return 'canh: ' + l; } }
    return 'khong tim thay nut canh 3'; });
  await shot(Q + '&page=8&lang=vi', 'm5-quiz-t8-vi', async (p) => { await p.click('.pm-pin[data-ref="t8.quiz"]', { force: true }); });
  await shot(Q + '&page=9&lang=vi', 'm5-model-t8-vi', async (p) => { await p.click('.pm-pin[data-ref="t8.model"]', { force: true }); });
  await shot(Q + '&page=7&lang=uz', 'm5-tb-p7-wbpin-uz', async (p) => { await p.click('.pm-pin[data-ref="s1"]', { force: true }); });
  await shot(Q + '&page=8&lang=vi', 'm5-wb-w5-vi', async (p) => {
    await p.evaluate(() => window.T0.setMode('pin', { target: { page: 5, volume: 'wb' } })); await p.waitForTimeout(600);
    return await p.evaluate(() => 'inputs-on-page=' + document.querySelectorAll('.pm-page input').length);
  });
  await shot(Q + '&page=8&lang=vi&theme=dark', 'm5-tb-p8-dark-vi');
  fs.writeFileSync(path.join(HERE, '_anh', 'ket-qua.json'), JSON.stringify({ report, errs }, null, 1));
  console.log(JSON.stringify(report, null, 0).replace(/\},\{/g, '},\n{'));
  console.log('ERR', errs);
  await b.close();
})();
