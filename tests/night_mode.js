// Night mode: follows the device, can be forced on or off in Settings, survives a reload.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 }, colorScheme: 'dark' })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1, 'install-asked': 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(800);
  const th = () => pg.evaluate(() => document.documentElement.dataset.theme);
  ok(await th() === 'dark', 'automatic follows a dark device');
  ok(await pg.evaluate(() => getComputedStyle(document.body).color) !== 'rgb(41, 36, 45)', 'text is light in the dark');
  await pg.evaluate(() => showSettings()); await pg.waitForTimeout(400);
  await pg.click('[data-night="off"]'); ok(await th() === 'light', 'off forces light');
  await pg.click('[data-night="on"]'); ok(await th() === 'dark', 'on forces dark');
  await pg.reload(); await pg.waitForTimeout(800); ok(await th() === 'dark', 'choice survives reload');
  ok(await pg.evaluate(() => store.get().profile.name === 'A'), 'profile kept');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
