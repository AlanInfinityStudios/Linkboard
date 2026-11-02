// Walls 101-150 start and solve in UK and US.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { if (!c) console.log('FAIL ' + m); else if (process.env.V) console.log('PASS ' + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  ok(await pg.evaluate(() => WALLS.length === 150), '150 walls'); let n = 0;
  for (const lang of ['en-GB', 'en-US']) {
    await pg.evaluate(l => { const p = profile(); p.lang = l; store.set('profile', p); }, lang);
    for (let i = 100; i < 150; i++) {
      await pg.evaluate(i => startWall(i), i); await pg.waitForTimeout(150);
      ok(await pg.evaluate(() => W.clues.length === 16 && document.querySelectorAll('.wtile').length === 16), `${lang} wall ${i + 1} has 16 tiles`);
      for (let g = 0; g < 3; g++) {
        await pg.evaluate(g => { W.clues.filter(c => c.group === g).forEach(c => document.querySelector(`.wtile[data-id="${c.id}"]`).click()); }, g);
        await pg.waitForTimeout(900);
      }
      ok(await pg.evaluate(() => W.found.length >= 3), `${lang} wall ${i + 1} groups found`); n++;
    }
  }
  await pg.evaluate(() => startWall(145)); await pg.waitForTimeout(300); await pg.screenshot({ path: 'shots/us-wall-146.png' });
  console.log('walls played', n);
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
