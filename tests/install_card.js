// First-launch "add to home screen" card.
const { chromium, devices } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const ipad = await b.newContext({ ...devices['iPad (gen 7)'] }); const pg = await ipad.newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(800);
  ok(!(await pg.isVisible('.install-ov')), 'not shown over the welcome screen');
  await pg.fill('#pName', 'Alan'); await pg.click('.welcome .btn.primary'); await pg.waitForTimeout(2500);
  ok(await pg.isVisible('.install-ov'), 'iPad: card shown after welcome');
  ok((await pg.textContent('.install-ov')).includes('Add to Home Screen'), 'iPad: shows the steps');
  await pg.screenshot({ path: 'shots/install-ipad.png' });
  await pg.click('#instOk'); await pg.reload(); await pg.waitForTimeout(2500);
  ok(!(await pg.isVisible('.install-ov')), 'asked once only');
  // already installed on the home screen
  const st = await b.newContext({ ...devices['iPad (gen 7)'] }); const p2 = await st.newPage(); p2.on('pageerror', e => errs.push(e.message));
  await p2.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { value: true }); localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await p2.goto('http://localhost:8765/index.html'); await p2.waitForTimeout(2500);
  ok(!(await p2.isVisible('.install-ov')), 'not shown in the home screen app');
  // desktop Chrome without an install event: nothing
  const dk = await b.newContext(); const p3 = await dk.newPage(); p3.on('pageerror', e => errs.push(e.message));
  await p3.addInitScript(() => localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })));
  await p3.goto('http://localhost:8765/index.html'); await p3.waitForTimeout(2500);
  ok(!(await p3.isVisible('.install-ov')), 'no card when the browser cannot install');
  // with an install event: the real button
  await p3.evaluate(() => { localStorage.clear(); storeData = null; store.set('profile', { name: 'A', lang: 'en-GB' }); const e = new Event('beforeinstallprompt'); e.prompt = () => { window.prompted = true; }; e.userChoice = Promise.resolve({}); dispatchEvent(e); maybeOfferInstall(); });
  ok(await p3.isVisible('#instGo'), 'install button shown when the browser supports it');
  await p3.click('#instGo'); ok(await p3.evaluate(() => window.prompted === true), 'button opens the real install prompt');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
