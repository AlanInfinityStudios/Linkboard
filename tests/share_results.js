const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] }); const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { window.__shared = []; Object.defineProperty(navigator, 'share', { value: async d => { window.__shared.push(d.text); } }); });
  await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify({ profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 }));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(600);
  // steps daily easy
  await pg.click('#modeSteps'); await pg.waitForTimeout(200);
  await pg.evaluate(() => { const d = stepsDist(S.level.target), { near } = stepsWords(); let w = stepsCur(); while (w !== S.level.target) { w = near(w).find(n => d.get(n) === d.get(w) - 1); S.words.push(w); } S.words.pop(); S.edit = [...S.level.target]; });
  await pg.click('#sSubmit'); await pg.waitForTimeout(900); await pg.click('#shareRes'); await pg.waitForTimeout(100); await pg.click('.share-ov [data-k=more]'); await pg.waitForTimeout(100);
  await pg.screenshot({ path: 'shots/n-share-sheet.png' });
  await pg.click('#rHome'); await pg.click('#modeWheel'); await pg.waitForTimeout(300); await pg.click('#shareRes'); await pg.click('.share-ov [data-k=more]'); await pg.waitForTimeout(100);
  await pg.click('#back'); await pg.click('#modeFive'); await pg.waitForTimeout(200);
  await pg.evaluate(() => { for (const w of [D.answer]) { [...w].forEach(c => fiveKey(c)); fiveKey('Enter'); } }); await pg.waitForTimeout(2500);
  if (await pg.$('#share')) { await pg.click('#share'); await pg.click('.share-ov [data-k=more]'); }
  await pg.waitForTimeout(200);
  console.log(JSON.stringify(await pg.evaluate(() => window.__shared), null, 1)); console.log(errs); await b.close(); })();
