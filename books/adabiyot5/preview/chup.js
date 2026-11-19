// Chụp kiểm tra bản xem trước adabiyot5 ở 390×844. Chạy: node chup.js
// Phục vụ dist/index.html tại http://t0.local/; mau/adabiyot5/* lấy từ _mau/ (file đã tải mẫu); file chưa tải -> 404 (ghi nhận riêng).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = __dirname, ORIGIN = 'http://t0.local/';
const TYPES = { '.html': 'text/html', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.json': 'application/json' };
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [], missing = new Set();
  await ctx.route('http://t0.local/**', (route) => {
    const u = new URL(route.request().url());
    let p = decodeURIComponent(u.pathname.slice(1)) || 'index.html';
    let f = p.startsWith('mau/adabiyot5/') ? path.join(D, '_mau', p.slice('mau/adabiyot5/'.length)) : path.join(D, 'dist', p);
    if (!fs.existsSync(f)) { missing.add(p); return route.fulfill({ status: 404, body: '' }); }
    route.fulfill({ status: 200, contentType: TYPES[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  const out = [];
  async function shot(name, url, act) {
    await page.goto(ORIGIN + url, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    if (act) await act();
    await page.waitForTimeout(500);
    const hs = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: path.join(D, '_anh', name + '.png') });
    out.push({ name, url, cuon_ngang_px: hs, ok: hs <= 0 });
  }
  await shot('1-ghim-trang8', 'index.html?book=adabiyot5&mode=pin&page=8&lang=vi');
  await shot('2-doc-van-u2', 'index.html?book=adabiyot5&mode=reading&lang=vi', async () => {
    await page.evaluate(() => window.T0 && T0.setMode('reading', { target: { lesson: 'u2.1' } }));
  });
  await shot('3-doc-van-trang-dung-lai', 'index.html?book=adabiyot5&mode=reading&lang=vi', async () => {
    await page.evaluate(() => window.T0 && T0.setMode('reading', { target: { lesson: 'u2.1' } }));
    await page.waitForTimeout(300);
    const b = await page.$('button.r-chip:has-text("Trang")'); if (b) await b.click();
  });
  await shot('4-bai-hoc-u2', 'index.html?book=adabiyot5&mode=lesson&lang=vi', async () => {
    await page.evaluate(() => window.T0 && T0.setMode('lesson', { target: { lesson: 'u2.1' } }));
  });
  await shot('5-bai-tap-thao-luan', 'index.html?book=adabiyot5&mode=reading&lang=vi', async () => {
    await page.evaluate(() => window.T0 && T0.setMode('reading', { target: { lesson: 'u2.1' } }));
    await page.waitForTimeout(300);
    await page.evaluate(() => { const e = document.getElementById('r-ex-u2_1_7'); if (e) e.scrollIntoView(); });
  });
  const unsup = await page.evaluate(() => [...document.querySelectorAll('.t0-unsupported')].map((e) => e.textContent.trim()).slice(0, 10));
  await br.close();
  const res = { viewport: '390x844', anh: out, loi_console: errors, file_chua_tai_404: [...missing].sort(), khung_chua_ho_tro_mau: unsup };
  fs.writeFileSync(path.join(D, '_anh', 'ket-qua.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res, null, 1));
})();
