const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  await pg.evaluate(() => startWall(27)); await pg.waitForTimeout(300);
  ok((await pg.textContent('#wall')).includes('Bakerloo'), 'UK wall 28 has Tube lines');
  // find one group in UK
  await pg.evaluate(() => { const ids = W.clues.filter(c => c.group === 0).map(c => c.id); ids.forEach(id => document.querySelector(`.wtile[data-id="${id}"]`).click()); });
  await pg.waitForTimeout(1200);
  ok(await pg.evaluate(() => W.found.length === 1), 'UK group found');
  await pg.evaluate(() => { store.set('done-wall-3', true); const p = profile(); p.lang = 'en-US'; store.set('profile', p); });
  await pg.evaluate(() => startWall(27)); await pg.waitForTimeout(300);
  const t = await pg.textContent('#wall');
  ok(!t.includes('Bakerloo') && t.includes('Mulan'), 'US wall 28 is American');
  ok(await pg.evaluate(() => W.found.length === 0), 'half-played UK wall starts fresh in US');
  ok(await pg.evaluate(() => isDone('wall-3')), 'completed walls carry over');
  await pg.evaluate(() => startWall(0)); await pg.waitForTimeout(200);
  ok((await pg.textContent('#wall')).includes('Seville'), 'shared wall 1 unchanged for US');
  // back to UK: UK save of wall 28 was overwritten? check UK resumes fresh or not crash
  await pg.evaluate(() => { const p = profile(); p.lang = 'en-GB'; store.set('profile', p); startWall(27); }); await pg.waitForTimeout(300);
  ok((await pg.textContent('#wall')).includes('Bakerloo'), 'UK again shows UK wall');
  // every US wall renders
  const bad = await pg.evaluate(() => { const p = profile(); p.lang = 'en-US'; store.set('profile', p); const out = []; for (const k of Object.keys(WALLS_US)) { try { startWall(+k); if (W.clues.length !== 16) out.push(k); } catch (e) { out.push(k + e.message); } } return out; });
  ok(bad.length === 0, 'all US walls start ' + bad.join());
  await pg.evaluate(() => startWall(27)); await pg.waitForTimeout(300); await pg.screenshot({ path: require('os').tmpdir() + '/us-wall.png' });
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
