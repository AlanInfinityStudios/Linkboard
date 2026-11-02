const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-US' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  const i = await pg.evaluate(() => LOCK_LEVELS.findIndex(l => /neighbour/i.test(l.text)));
  const all = [...Array(await pg.evaluate(() => LOCK_LEVELS.length)).keys()];
  if (i >= 0) { await pg.evaluate(i => startLock(i), i); await pg.waitForTimeout(200); ok(await pg.evaluate(() => K.text.includes('NEIGHBOR') && !K.text.includes('NEIGHBOUR')), 'US spelling in lock ' + i); }
  else console.log('no neighbour in levels (daily only)');
  const r = await pg.evaluate(() => { const bad = []; LOCK_LEVELS.forEach((l, i) => { startLock(i); if (Object.keys(K.guess).some(n => !K.nums.includes(+n))) bad.push(i); }); return bad; });
  ok(r.length === 0, 'reveals only use letters in the phrase ' + r);
  // complete one US phrase
  await pg.evaluate(() => { startLock(0); K.nums.forEach(n => K.guess[n] = K.answer[n]); renderLock(); }); await pg.click('#kCheck'); await pg.waitForTimeout(1200);
  ok(await pg.isVisible('.done-sheet'), 'US lock completes');
  const d = await pg.evaluate(() => [...LOCK_LEVELS, ...LOCK_DAILY].map(l => lockText(l)).filter(t => /neighbour|colour|centre|grey|holiday|autumn|queue/i.test(t)));
  ok(d.length === 0, 'no British spellings left in US ' + d.join(' | '));
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
