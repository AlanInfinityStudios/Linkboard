const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(600);
  await pg.evaluate(() => startWheel()); await pg.waitForTimeout(300);
  const w0 = await pg.evaluate(() => walletN());
  for (let i = 0; i < 5; i++) { if (await pg.isEnabled('#clue')) { await pg.click('#clue'); await pg.waitForTimeout(200); } }
  ok(await pg.evaluate(() => wheelState().clues) === 3, 'clues capped at 3');
  ok(await pg.evaluate(() => walletN()) === w0 - 2, 'only 2 wallet hints spent (1 free)');
  ok(await pg.isDisabled('#clue') && (await pg.textContent('#clue')).includes('All 3 clues used'), 'button says all used: ' + await pg.textContent('#clue'));
  await pg.evaluate(() => wheelClueUse()); ok(await pg.evaluate(() => wheelState().clues) === 3 && await pg.evaluate(() => walletN()) === w0 - 2, 'forced 4th does nothing');
  await pg.screenshot({ path: require('os').tmpdir() + '/wheel-clues.png' });
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
