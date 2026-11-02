// Run from a scratch folder with a shots/ subfolder while the repo is served on port 8765.
// Wallet, weekly chest, pretend video and test shop.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify({ profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 }));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(600);
  ok((await pg.textContent('.walletbar')).includes('10'), 'wallet starts at 10');
  ok((await pg.textContent('.chest-txt')).includes('Play today'), 'chest not started');
  await pg.click('#modeWheel'); await pg.waitForTimeout(300);
  ok((await pg.textContent('#clueN')).includes('1 free'), 'wheel shows 1 free');
  await pg.click('#clue'); await pg.click('#clue'); await pg.waitForTimeout(200);
  ok((await pg.textContent('#clueN')).includes('10 in wallet'), 'after free clue: wallet 10');
  await pg.click('#clue'); await pg.click('#clue'); await pg.waitForTimeout(200);
  ok((await pg.textContent('#clueN')).includes('9 in wallet'), 'second clue from wallet');
  await pg.click('#back'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.chest-txt')).includes('1 of 7'), 'chest has 1 day: ' + await pg.textContent('.chest-txt'));
  // chest payout: pretend a full week has passed
  await pg.evaluate(() => { const d = dayNumber(); store.set('chest', { start: d - 7, days: [0, 1, 2, 3, 4, 5, 6].map(k => d - 7 + k) }); showHome(); });
  await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => walletN()) === 19, 'full week pays 10 (9 + 10 = 19): ' + await pg.evaluate(() => walletN()));
  await pg.evaluate(() => { const d = dayNumber(); store.set('chest', { start: d - 8, days: [d - 8, d - 6, d - 5] }); showHome(); });
  ok(await pg.evaluate(() => walletN()) === 22, 'partial week pays days only (+3)');
  // non-tester shop
  await pg.click('#walletBtn'); await pg.waitForTimeout(200);
  ok(!(await pg.$('.pack')) && !(await pg.$('#video')), 'no shop without tester code');
  await pg.click('#shopClose');
  // tester code
  await pg.click('#nav-settings'); await pg.fill('#tCode', 'wordolio-test'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.panels')).includes('Test shop is on'), 'tester code turns shop on');
  await pg.click('#nav-home'); await pg.click('#walletBtn'); await pg.waitForTimeout(200);
  await pg.screenshot({ path: 'shots/n-shop.png' });
  await pg.click('#video'); await pg.waitForTimeout(400); await pg.screenshot({ path: 'shots/n-video.png' });
  await pg.waitForTimeout(5200); await pg.click('#vClaim'); await pg.waitForTimeout(200);
  ok(await pg.evaluate(() => walletN()) === 23, 'video gives +1');
  await pg.click('#video'); await pg.waitForTimeout(5600); await pg.click('#vClaim'); await pg.waitForTimeout(200);
  ok(await pg.isDisabled('#video'), 'video capped at 2 a day');
  await pg.click('.pack[data-k="0"]'); await pg.click('#bYes'); await pg.waitForTimeout(200);
  ok(await pg.evaluate(() => walletN()) === 34, 'test purchase adds 10: ' + await pg.evaluate(() => walletN()));
  await pg.click('#shopClose'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.walletbar')).includes('34'), 'home wallet updated');
  await pg.screenshot({ path: 'shots/n-home-wallet.png' });
  // Linkology hint uses free first
  await pg.click('#modeBoard'); await pg.waitForTimeout(1500);
  ok((await pg.textContent('#hintN')) === '35', 'board shows free + wallet: ' + await pg.textContent('#hintN'));
  console.log(errs.join('\n') || 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
