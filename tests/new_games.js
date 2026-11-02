// Acceptance tests for Word Steps and Letter Lock levels. Serve the repo on port 8765 (python3 -m http.server 8765), then run: node tests/new_games.js
// Acceptance tests for Word Steps and Letter Lock.
const { chromium } = require('playwright');
const out = require('os').tmpdir() + '/wordolio-shots/';
require('fs').mkdirSync(out, { recursive: true });
const save = { profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 };
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1194, height: 834 } });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify(save));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(800);
  await pg.screenshot({ path: out + 'n-home.png' });
  const msg = () => pg.textContent('#msg');
  const step = async (word) => {
    const cur = await pg.evaluate(() => S.words[S.words.length - 1]);
    const i = [...word].findIndex((c, k) => c !== cur[k]);
    if (i >= 0) { await pg.click(`.st.edit[data-p="${i}"]`); await pg.keyboard.press(word[i]); }
    await pg.click('#sSubmit');
  };
  // ---------- Word Steps ----------
  await pg.evaluate(() => startSteps(0)); await pg.waitForTimeout(400);
  ok((await pg.textContent('.ghead-c small')).includes('Level 1'), 'steps opens level 1');
  // Two letters changed in one go is impossible through the UI (a new change resets the edit); check the rule directly.
  await pg.evaluate(() => { S.edit = [..."wald"]; }); await pg.click('#sSubmit');
  ok((await msg()) === 'Change just one letter.', 'two-letter change rejected: ' + await msg());
  await pg.evaluate(() => { S.edit = [..."cold"]; }); await pg.click('#sSubmit');
  ok((await msg()) === 'Change just one letter.', 'unchanged word rejected');
  await step('cqld');
  ok((await msg()).includes("isn't in our dictionary"), 'non-word rejected: ' + await msg());
  await step('cord'); ok(/Nice|Good|Lovely|works/.test(await msg()), 'valid step accepted');
  await step('word');
  await pg.click('#sUndo'); ok(await pg.evaluate(() => S.words.join()) === 'cold,cord', 'undo works');
  await step('word');
  // reload restores
  await pg.reload(); await pg.waitForTimeout(600);
  await pg.evaluate(() => startSteps(0)); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => S.words.join()) === 'cold,cord,word', 'progress restored after reload');
  await step('cord');
  ok((await msg()).includes('already used'), 'repeat word rejected');
  await pg.evaluate(() => { S.edit = [..."word"]; });
  // hints lead forward
  await pg.click('#sHint'); const h1 = await msg();
  ok(/letter \d/.test(h1), 'hint 1 shows a position: ' + h1);
  await pg.click('#sHint'); const h2 = await msg();
  const named = (h2.match(/([A-Z]{4})/) || [])[1];
  const fwd = await pg.evaluate(w => { const d = stepsDist(S.level.target); return d.get(w.toLowerCase()) === d.get(stepsCur()) - 1; }, named || 'XXXX');
  ok(fwd, 'hint 2 names a word one step closer: ' + h2);
  await pg.screenshot({ path: out + 'n-steps-ipad.png' });
  await step('ward'); await step('warm'); await pg.waitForTimeout(1000);
  ok(await pg.isVisible('.done-sheet'), 'result sheet shown');
  const sheet = await pg.textContent('.done-sheet');
  ok(sheet.includes('Moves taken') && sheet.includes('Shortest route') && sheet.includes('Hints used'), 'result sheet numbers');
  const best = await pg.evaluate(() => store.get()['best-steps-0']);
  ok(best && best.stars === 1 && best.moves === 4 && best.hints === 2, 'stars: shortest route with 2 hints = 1 star ' + JSON.stringify(best));
  await pg.screenshot({ path: out + 'n-steps-done.png' });
  await pg.click('#rNext'); await pg.waitForTimeout(300);
  ok((await pg.textContent('.ghead-c small')).includes('Level 2'), 'next level opens');
  // alternative route for love to hate (min 3): any valid route counts
  await step('hove'); await step('have'); await step('hate'); await pg.waitForTimeout(1000);
  const b2 = await pg.evaluate(() => store.get()['best-steps-1']);
  ok(b2 && b2.stars === 3, 'perfect route, no hints = 3 stars ' + JSON.stringify(b2));
  await pg.click('#rHome'); await pg.waitForTimeout(300);
  
  // levels grid
  await pg.click('#modeSteps'); await pg.click('#levels'); await pg.waitForTimeout(300);
  const lv = await pg.evaluate(() => [...document.querySelectorAll('.lv')].slice(0, 5).map(x => x.className.replace(/\s+/g, ' ').trim()));
  ok(lv[0].includes('done') && lv[2].indexOf('locked') < 0 && lv[3].includes('locked'), 'level grid states ' + lv.join('|'));
  await pg.screenshot({ path: out + 'n-levels.png' });
  // min matches BFS for every level
  const bad = await pg.evaluate(() => STEPS_LEVELS.filter(l => stepsDist(l.target).get(l.start) !== l.min).map(l => l.start));
  ok(bad.length === 0, 'every level min matches in-app BFS ' + bad.join());
  await pg.click('#back');

  // ---------- Letter Lock ----------
  await pg.evaluate(() => startLock(0)); await pg.waitForTimeout(400);
  const info = await pg.evaluate(() => {
    const L = LOCK_LEVELS, onetoone = L.every(l => new Set(l.key).size === 26 && [...l.key].every((c, i) => c.charCodeAt(0) - 65 !== i));
    return { onetoone, lens: L.map(l => l.text.replace(/[^A-Za-z]/g, '').length) };
  });
  ok(info.onetoone, 'every key is one-to-one and never keeps a letter in its own place');
  ok(Math.min(...info.lens) >= 30 && Math.max(...info.lens) <= 90, 'phrase lengths 30 to 90: ' + Math.min(...info.lens) + '-' + Math.max(...info.lens));
  const key1 = await pg.evaluate(() => [...document.querySelectorAll('.pc small')].map(x => x.textContent).join());
  ok(await pg.isDisabled('#kCheck'), 'check disabled until every letter filled');
  const rev = await pg.evaluate(() => [...K.revealed][0]);
  await pg.click(`.pc[data-n="${rev}"]`); await pg.keyboard.press('z');
  ok((await msg()).includes('locked'), 'revealed letter stays locked');
  const free = await pg.evaluate(() => K.nums.filter(n => !K.revealed.has(n)).slice(0, 2));
  await pg.click(`.pc[data-n="${free[0]}"]`); await pg.keyboard.press('q');
  const allQ = await pg.evaluate(n => [...document.querySelectorAll(`.pc[data-n="${n}"] b`)].every(x => x.textContent === 'Q'), free[0]);
  ok(allQ, 'a letter fills every matching number');
  await pg.click(`.pc[data-n="${free[1]}"]`); await pg.keyboard.press('q');
  ok((await msg()).includes('already used Q'), 'duplicate letter warned: ' + await msg());
  await pg.click(`.pc[data-n="${free[0]}"]`); await pg.click('#kClear');
  ok(await pg.evaluate(n => !K.guess[n], free[0]), 'clear letter works');
  // Fill everything wrong-ish: correct answer except swap two letters
  await pg.evaluate(() => { const ns = K.nums.filter(n => !K.revealed.has(n)); ns.forEach(n => K.guess[n] = K.answer[n]); const [a, b] = ns; [K.guess[a], K.guess[b]] = [K.guess[b], K.guess[a]]; saveLock(); renderLock(); });
  ok(!(await pg.isDisabled('#kCheck')), 'check enabled when full');
  await pg.click('#kCheck');
  ok((await msg()) === 'Not quite. Some letters still need changing.', 'wrong check message');
  ok(await pg.evaluate(() => Object.keys(K.guess).length === K.nums.length), 'wrong check keeps progress');
  await pg.click('#kHint'); await pg.waitForTimeout(100);
  await pg.reload(); await pg.waitForTimeout(600); await pg.evaluate(() => startLock(0)); await pg.waitForTimeout(300);
  const key2 = await pg.evaluate(() => [...document.querySelectorAll('.pc small')].map(x => x.textContent).join());
  ok(key1 === key2, 'same key after reload');
  ok(await pg.evaluate(() => K.hints === 1 && K.checks === 1), 'hints and checks restored');
  await pg.screenshot({ path: out + 'n-lock-ipad.png' });
  await pg.evaluate(() => { K.nums.forEach(n => K.guess[n] = K.answer[n]); renderLock(); });
  await pg.click('#kCheck'); await pg.waitForTimeout(1000);
  const ls = await pg.textContent('.done-sheet');
  ok(ls.includes('Code cracked!') && ls.includes('Answer checks'), 'lock result sheet');
  const lb = await pg.evaluate(() => store.get()['best-lock-0']);
  ok(lb && lb.stars === 2 && lb.checks === 2 && lb.hints === 1, 'lock stars ' + JSON.stringify(lb));
  await pg.screenshot({ path: out + 'n-lock-done.png' });
  await pg.click('#rHome');
  await pg.click('#nav-stats'); await pg.waitForTimeout(400); await pg.screenshot({ path: out + 'n-stats.png', fullPage: true });
  await ctx.close();

  // ---------- Phones ----------
  for (const w of [320, 390]) {
    const c2 = await b.newContext({ viewport: { width: w, height: w === 320 ? 640 : 844 }, deviceScaleFactor: 2 });
    const p2 = await c2.newPage();
    p2.on('pageerror', e => errs.push(w + ': ' + e.message));
    await p2.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify(save));
    await p2.goto('http://localhost:8765/index.html'); await p2.waitForTimeout(800);
    await p2.screenshot({ path: out + `n-home-${w}.png`, fullPage: true });
    // Steps: a 6-letter level must fit
    await p2.evaluate(() => startSteps(STEPS_LEVELS.findIndex(l => l.start.length === 6)));
    await p2.waitForTimeout(300);
    const ov = await p2.evaluate(() => document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll('.rung')].some(r => r.getBoundingClientRect().right > innerWidth));
    ok(!ov, `steps fits at ${w}px`);
    await p2.screenshot({ path: out + `n-steps-${w}.png` });
    let worst = 0;
    for (let i = 0; i < 50; i++) {
      await p2.evaluate(i => startLock(i), i);
      const o = await p2.evaluate(() => { const r = document.querySelector('#phrase').getBoundingClientRect(); return Math.max(0, ...[...document.querySelectorAll('.pw')].map(x => x.getBoundingClientRect().right - r.right)); });
      worst = Math.max(worst, o);
    }
    ok(worst <= 0.5, `every lock phrase fits at ${w}px (worst overflow ${worst})`);
    await p2.evaluate(() => startLock(49)); await p2.waitForTimeout(200);
    await p2.screenshot({ path: out + `n-lock-${w}.png` });
    await c2.close();
  }
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors');
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
  await b.close();
})();
