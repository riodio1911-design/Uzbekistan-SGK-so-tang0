// node _thu.js : chup preview/dist o 390x844, bao loi console + cuon ngang
const { chromium } = require('playwright'); const path = require('path');
const base = 'file://' + path.resolve(__dirname, 'dist/index.html');
(async () => {
  const b = await chromium.launch(); const errs = [], rep = [];
  async function shot(q, name, fn) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    p.on('pageerror', e => errs.push(name + ': ' + e));
    p.on('requestfailed', r => errs.push(name + ': request failed ' + r.url()));
    await p.goto(base + q); await p.waitForTimeout(900);
    let r = null; if (fn) { try { r = await fn(p); } catch (e) { r = 'ERR ' + e.message.slice(0, 120); } await p.waitForTimeout(500); }
    const over = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    await p.screenshot({ path: path.join(__dirname, '_anh', name + '.png') });
    rep.push([name, { over, r }]); await ctx.close();
  }
  await shot('?book=tabiiy5&mode=pin&page=9&lang=uz', 'p009-ghim-uz', p => p.evaluate(() => document.querySelectorAll('.pm-pin').length + ' ghim, missing=' + document.querySelectorAll('.pm-pin.missing').length));
  await shot('?book=tabiiy5&mode=pin&page=26&lang=vi', 'p026-sort-vi', async p => { await p.click('.pm-pin[data-kind="activity"]', { force: true }); await p.waitForTimeout(500); return p.evaluate(() => !!document.querySelector('.t0-modal')); });
  await shot('?book=tabiiy5&mode=pin&page=9&lang=ru', 'p009-ru-modal-key11', async p => { await p.click('.pm-pin[data-ref="key11"]', { force: true }); await p.waitForTimeout(500); return p.evaluate(() => (document.querySelector('.t0-modal') || {}).innerText?.slice(0, 120)); });
  await shot('?book=tabiiy5&mode=lesson&lang=vi', 'bai-l11-vi', p => p.evaluate(() => document.body.innerText.slice(0, 120)));
  await shot('?book=tabiiy5&mode=pin&page=1&lang=uz', 'vo-w001-uz', p => p.evaluate(() => document.querySelector('.t0-top h1').innerText + ' | ' + [...document.querySelectorAll('img')].map(i => i.getAttribute('src')).join(',')));
  console.log(JSON.stringify(rep, null, 1)); console.log('LOI', errs.length, errs.slice(0, 10)); await b.close();
})();
