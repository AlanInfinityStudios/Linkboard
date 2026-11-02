// Usage statistics: page view, install, play and complete events, only on the real sites.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const run = async (standalone) => {
    const ctx = await b.newContext(); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(e.message));
    await ctx.route('https://test.github.io/**', r => { const f = new URL(r.request().url()).pathname.replace('/Linkboard/', '') || 'index.html'; const p = path.join('/home/user/linkboard', f); fs.existsSync(p) ? r.fulfill({ path: p }) : r.fulfill({ status: 404 }); });
    await ctx.route('https://gc.zgo.at/count.js', r => r.fulfill({ contentType: 'text/javascript', body: 'window.__gc=[];window.goatcounter.count=o=>window.__gc.push(o.path+(o.event?"!":""));' }));
    await ctx.route('https://wordolio.app/**', r => r.abort());
    if (standalone) await pg.addInitScript(() => Object.defineProperty(navigator, 'standalone', { value: true }));
    await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, 'install-asked': true, updatedAt: 1 })); });
    await pg.goto('https://test.github.io/Linkboard/index.html'); await pg.waitForTimeout(1200);
    return pg;
  };
  let pg = await run(false);
  await pg.click('#modeWall'); await pg.waitForTimeout(300);
  await pg.evaluate(() => store.set('done-wall-0', true)); await pg.evaluate(() => store.set('done-wall-0', true));
  let gc = await pg.evaluate(() => window.__gc);
  ok(gc[0] === '/', 'browser page view ' + gc.join(' '));
  ok(gc.includes('play/the-wall!') && gc.filter(x => x === 'complete/the-wall!').length === 1, 'play and complete events, completion counted once');
  ok(!gc.includes('install!'), 'no install event in the browser');
  pg = await run(true); await pg.reload(); await pg.waitForTimeout(1200);
  gc = await pg.evaluate(() => window.__gc);
  ok(gc.includes('/home-screen') && !gc.includes('install!'), 'second open from icon: no repeat install ' + gc.join(' '));
  const ctx2 = await b.newContext(); const p2 = await ctx2.newPage(); p2.on('pageerror', e => errs.push(e.message));
  await p2.goto('http://localhost:8765/index.html'); await p2.waitForTimeout(800);
  ok(await p2.evaluate(() => !STATS_ON && !document.querySelector('script[src*="gc.zgo.at"]')), 'nothing sent from previews and tests');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
