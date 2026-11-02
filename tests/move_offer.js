// The old github.io address offers the move once wordolio.app answers.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  for (const [live, standalone] of [[true, false], [false, false], [true, true]]) {
    const ctx = await b.newContext({ viewport: { width: 820, height: 1180 } }); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
    await ctx.route('https://test.github.io/**', r => { const f = new URL(r.request().url()).pathname.replace('/Linkboard/', '') || 'index.html'; const p = path.join('/home/user/linkboard', f); fs.existsSync(p) ? r.fulfill({ path: p }) : r.fulfill({ status: 404 }); });
    await ctx.route('https://wordolio.app/**', r => live ? (r.request().url().includes('#move') || r.request().resourceType() === 'document' ? r.fulfill({ body: '<h1>new home</h1>', contentType: 'text/html' }) : r.fulfill({ body: '{}' })) : r.abort());
    if (standalone) await pg.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
    await pg.addInitScript(() => localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'Alan', lang: 'en-GB' }, 'done-wall-3': true, updatedAt: 9 })));
    await pg.goto('https://test.github.io/Linkboard/index.html'); await pg.waitForTimeout(1500);
    const shown = await pg.isVisible('.move-ov');
    ok(shown === live, `live=${live} standalone=${standalone}: offer ${shown ? 'shown' : 'hidden'}`);
    if (shown && standalone) { ok(await pg.isVisible('#moveCopy'), 'home screen users get a copy button'); await pg.screenshot({ path: 'shots/move-offer.png' }); }
    if (shown && !standalone) { await pg.click('#moveGo'); await pg.waitForTimeout(1500); ok(pg.url().startsWith('https://wordolio.app/#move=z'), 'tap takes progress to wordolio.app'); }
    await ctx.close();
  }
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
