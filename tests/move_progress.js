// Moving progress between addresses via #move= link.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const old = await (await b.newContext()).newPage(); old.on('pageerror', e => errs.push(e.message));
  await old.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'Alan', lang: 'en-US' }, 'done-wall-3': true, 'done-board-0': true, 'save-lock-2': { v: 1, guess: { 5: 'A' } }, streak: 7, updatedAt: 1000 })); });
  await old.goto('http://localhost:8765/index.html'); await old.waitForTimeout(600);
  const packed = await old.evaluate(() => packProgress());
  ok(/^[zj][A-Za-z0-9_-]+$/.test(packed), 'packs to a link-safe string, length ' + packed.length);
  // new address: fresh device with nothing saved
  const ctx = await b.newContext(); const nw = await ctx.newPage(); nw.on('pageerror', e => errs.push(e.message));
  await nw.goto('http://127.0.0.1:8765/index.html#move=' + packed); await nw.waitForTimeout(1200);
  const s = await nw.evaluate(() => store.get());
  ok(s.profile && s.profile.name === 'Alan' && s.profile.lang === 'en-US', 'profile moved');
  ok(s['done-wall-3'] && s['done-board-0'] && s.streak === 7 && s['save-lock-2'], 'progress moved');
  ok(await nw.evaluate(() => location.hash === ''), 'link tidied after moving');
  ok(await nw.evaluate(() => !!JSON.parse(localStorage.getItem('linkboard-v3'))['done-wall-3']), 'saved to storage');
  // a device that already has some progress keeps it and gains the moved levels
  const ctx2 = await b.newContext(); const p2 = await ctx2.newPage(); p2.on('pageerror', e => errs.push(e.message));
  await p2.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'Al', lang: 'en-GB' }, 'done-wall-9': true, updatedAt: 5000 })); });
  await p2.goto('http://127.0.0.1:8765/index.html#move=' + packed); await p2.waitForTimeout(1200);
  const s2 = await p2.evaluate(() => store.get());
  ok(s2['done-wall-9'] && s2['done-wall-3'] && s2.profile.name === 'Al', 'merge keeps local and adds moved levels');
  // a broken link does not wipe anything
  await p2.goto('http://127.0.0.1:8765/index.html#move=zAAAA'); await p2.waitForTimeout(1000);
  ok(await p2.evaluate(() => store.get()['done-wall-9'] === true), 'broken link leaves progress alone');
  ok(await nw.evaluate(() => typeof offerMove === 'function' && MOVE_LIVE === false), 'move offer switched off for now');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
