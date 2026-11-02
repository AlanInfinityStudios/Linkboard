// Daily challenge tests (Word Steps and Letter Lock). Serve the repo on port 8765, then run from a scratch folder with a shots/ subfolder: node tests/daily.js
// Daily challenge: Easy, Medium, Hard in order; shared pot of 3 hints per game per day.
const { chromium } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify({ profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 }));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  ok((await pg.textContent('#modeSteps')).includes('Easy, Medium and Hard'), 'steps card shows the daily set');
  const solveSteps = async () => pg.evaluate(() => { const d = stepsDist(S.level.target), { near } = stepsWords(); let w = stepsCur(); const path = [];
    while (w !== S.level.target) { w = near(w).find(n => d.get(n) === d.get(w) - 1); path.push(w); } return path; });
  const submit = async w => { await pg.evaluate(w => { S.edit = [...w]; }, w); await pg.click('#sSubmit'); };
  await pg.click('#modeSteps'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.ghead-c small')).includes('Easy · 1 of 3'), 'opens Easy first: ' + await pg.textContent('.ghead-c small'));
  await pg.click('#sHint'); await pg.click('#sHint');
  ok((await pg.textContent('#sHintN')).includes('1 left today'), 'pot down to 1');
  for (const w of await solveSteps()) await submit(w);
  await pg.waitForTimeout(1000);
  ok((await pg.textContent('.done-sheet')).includes('Next: Medium'), 'offers Medium next');
  await pg.click('#rNext'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.ghead-c small')).includes('Medium · 2 of 3'), 'Medium opens');
  ok((await pg.textContent('#sHintN')).includes('1 left today'), 'pot is shared (still 1 left)');
  await pg.click('#sHint');
  ok(await pg.isDisabled('#sHint'), 'hint button disabled when pot empty');
  // leave mid-puzzle, come back via home
  await pg.evaluate(w => { S.edit = [...w]; }, (await solveSteps())[0]); await pg.click('#sSubmit');
  await pg.click('#back'); await pg.waitForTimeout(300);
  ok((await pg.textContent('#modeSteps')).includes('Medium next'), 'home card shows Medium next: ' + await pg.textContent('#modeSteps .status'));
  await pg.reload(); await pg.waitForTimeout(600); await pg.click('#modeSteps'); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => S.daily && S.idx === 1 && S.words.length === 2), 'medium progress restored after reload');
  for (const w of await solveSteps()) await submit(w);
  await pg.waitForTimeout(1000); await pg.click('#rNext'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.ghead-c small')).includes('Hard · 3 of 3'), 'Hard opens');
  for (const w of await solveSteps()) await submit(w);
  await pg.waitForTimeout(1000);
  ok((await pg.textContent('.done-sheet')).includes("Today's challenge complete"), 'day summary shown');
  await pg.screenshot({ path: 'shots/n-daysum.png' });
  ok(await pg.evaluate(() => !Object.keys(store.get()).some(k => k.startsWith('done-steps') || k.startsWith('best-steps'))), 'daily does not touch level progress');
  await pg.click('#rHome'); await pg.waitForTimeout(300);
  ok((await pg.textContent('#modeSteps')).includes("Today's challenge complete"), 'card complete');
  ok((await pg.textContent('.statstrip')).includes('1 / 4'), 'dailies count 1 / 4');
  // Lock daily: solve three
  await pg.click('#modeLock'); await pg.waitForTimeout(300);
  for (let k = 0; k < 3; k++) {
    ok((await pg.textContent('.ghead-c small')).includes(['Easy', 'Medium', 'Hard'][k]), 'lock ' + ['Easy', 'Medium', 'Hard'][k]);
    await pg.evaluate(() => { K.nums.forEach(n => K.guess[n] = K.answer[n]); renderLock(); }); await pg.click('#kCheck'); await pg.waitForTimeout(1000);
    if (k < 2) await pg.click('#rNext'), await pg.waitForTimeout(300);
  }
  ok((await pg.textContent('.done-sheet')).includes("Today's challenge complete"), 'lock day summary');
  await pg.click('#rLevels'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.ghead-c small')).includes('Level 1'), 'play more levels opens level 1');
  await pg.click('#back'); await pg.waitForTimeout(300); await pg.screenshot({ path: 'shots/n-home-daily.png', fullPage: true });
  console.log(errs.join('\n') || 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
