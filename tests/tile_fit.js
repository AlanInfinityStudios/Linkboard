// Linkology: every tile's text must fit inside its tile (long single words like WHEELBARROW on wide iPad boards).
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[1366, 1024, 'ipad-pro-land'], [1180, 820, 'ipad-air-land'], [820, 1180, 'ipad-port'], [390, 844, 'phone'], [360, 640, 'small-phone']]) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    pg.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1, 'install-asked': 1 })); });
    await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(600);
    const n = await pg.evaluate(() => BOARD_LEVELS.length);
    const bad = [];
    for (let i = 0; i < n; i++) {
      await pg.evaluate(i => startBoard(i), i); await pg.waitForTimeout(250);
      bad.push(...await pg.evaluate(() => [...document.querySelectorAll('#board .tile')].filter(t => {
        if (t.querySelector('.pic')) return false;
        const r = document.createRange(); r.selectNodeContents(t.querySelector('.tx') || t); const tr = r.getBoundingClientRect(), tb = t.getBoundingClientRect();
        return tr.left < tb.left - 0.5 || tr.right > tb.right + 0.5 || tr.top < tb.top - 0.5 || tr.bottom > tb.bottom + 0.5;
      }).map(t => t.textContent)));
    }
    ok(!bad.length, `${tag}: all ${n} levels fit ${bad.length ? JSON.stringify([...new Set(bad)].slice(0, 8)) : ''}`);
    if (process.argv[2] && tag.startsWith('ipad-pro')) { await pg.evaluate(() => startBoard(6)); await pg.waitForTimeout(600); await pg.screenshot({ path: process.argv[2] + '/' + tag + '.png' }); }
  }
  ok(!errs.length, 'no page errors ' + errs.join(' | '));
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
