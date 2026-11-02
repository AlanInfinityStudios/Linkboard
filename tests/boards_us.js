const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  const labels = () => pg.evaluate(() => B.tiles.map(t => t.label));
  await pg.evaluate(() => startBoard(17)); await pg.waitForTimeout(1200);
  ok((await labels()).includes('Haggis'), 'UK level 17 is Round Britain');
  await pg.evaluate(() => { const [a, b] = [0, 1]; swapSlots(a, b); }); await pg.waitForTimeout(600);
  await pg.evaluate(() => { const p = profile(); p.lang = 'en-US'; store.set('profile', p); startBoard(17); }); await pg.waitForTimeout(1200);
  const L = await labels();
  ok(L.includes('Yellow cab') && !L.includes('Haggis'), 'US level 17 is Coast to coast');
  for (const i of [5, 12]) { await pg.evaluate(i => startBoard(i), i); await pg.waitForTimeout(900); ok(await pg.evaluate(() => B.level.us === true), 'US level ' + i + ' replaced'); }
  await pg.evaluate(() => startBoard(2)); await pg.waitForTimeout(900);
  const L2 = await labels();
  ok(L2.includes('Conductor') && L2.includes('Bus pass') && L2.includes('Wrench') && !L2.includes('Spanner'), 'level 2 swaps once each');
  ok(new Set(L2).size === L2.length, 'level 2 labels unique');
  // every US level builds and has unique labels; every UK level unchanged
  const r = await pg.evaluate(() => LEVELS().map((l, i) => { const { tiles } = buildLevel(l, i); const lab = tiles.map(t => t.label); return lab.length === new Set(lab).size ? null : i + ':' + lab.filter((x, k) => lab.indexOf(x) !== k); }).filter(Boolean));
  ok(r.length === 0, 'all US levels have unique tiles ' + r.join(' '));
  await pg.evaluate(() => startBoard(17)); await pg.waitForTimeout(1200); await pg.screenshot({ path: require('os').tmpdir() + '/us-board.png' });
  await pg.evaluate(() => { const p = profile(); p.lang = 'en-GB'; store.set('profile', p); startBoard(2); }); await pg.waitForTimeout(900);
  ok((await labels()).includes('Spanner'), 'UK level 2 still British');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
