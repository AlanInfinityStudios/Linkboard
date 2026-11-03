// Night mode: letters typed into Letter Lock must stay readable on a dark background.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const lum = rgb => { const [r, g, b] = rgb.match(/\d+/g).map(Number); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
(async () => { const b = await chromium.launch();
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 }, colorScheme: 'dark' })).newPage();
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1, 'install-asked': 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(800);
  await pg.evaluate(() => startLock(0)); await pg.waitForTimeout(800);
  for (let k = 0; k < 3; k++) { const cells = await pg.$$('.pc:not(.locked):not(.punct)'); await cells[k * 3].click(); await pg.keyboard.press('KeyT'); await pg.waitForTimeout(150); }
  const r = await pg.evaluate(() => [...document.querySelectorAll('.pc.guessed b, .ref.guessed')].map(e => { const c = getComputedStyle(e); return [c.backgroundColor, c.color]; }));
  ok(r.length > 0, 'typed letters show as guessed');
  ok(r.every(([bg, fg]) => Math.abs(lum(bg) - lum(fg)) > 0.4), 'guessed letters readable ' + JSON.stringify(r.slice(0, 2)));
  if (process.argv[2]) await pg.screenshot({ path: process.argv[2] + '/lk.png' });
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
