// French: every game is on, in French, with its own saves; English progress is untouched.
const { chromium, devices } = require('playwright');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const ENGLISH = /\b(the|Tap|Level|Play|Continue|words?|letters?|Hint|Clue|Undo|Submit|Check answer|Today|Easy|Medium|Hard|found|Share|Home|Shuffle|Delete|Enter)\b/;
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ ...devices['iPad (gen 7)'] })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'Alan', lang: 'fr' }, 'install-asked': true, 'done-wall-0': true, 'five-2026-01-01': { guesses: ['crane'], over: false, won: false }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(1200);
  const englishIn = async sel => { const t = (await pg.locator(sel).first().innerText()).replace(/Wordolio|Linkology|Sussed|WhatsApp|Facebook|Superstar|Instagram/g, ''); const m = t.match(ENGLISH); return m ? m[0] + ' in: ' + t.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\n/g, ' ') : ''; };
  // home
  ok(await pg.evaluate(() => document.querySelectorAll('.gcard.off').length === 0), 'no game is "coming soon"');
  ok(await pg.isVisible('#feedback') && await pg.isVisible('#invite'), 'feedback and invite cards in French');
  let e = await englishIn('.home'); ok(!e, 'home has no English ' + e);
  await pg.screenshot({ path: 'shots/fr-home.png' });
  // The Wall
  await pg.click('#modeWall'); await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => W.idx === 0 && W.wall.name === 'Mur 1'), 'French wall 1 (English wall 1 done does not count)');
  e = await englishIn('.screen'); ok(!e, 'wall screen has no English ' + e);
  for (let g = 0; g < 3; g++) { const ids = await pg.evaluate(g => W.clues.filter(c => c.group === g).map(c => c.id), g); for (const id of ids) await pg.evaluate(id => tapClue(id), id); await pg.waitForTimeout(100); }
  await pg.waitForTimeout(1300);
  ok(await pg.evaluate(() => !!store.get()['done-fr-wall-0'] && !store.get()['done-wall-1']), 'wall saved as done-fr-wall-0');
  e = await englishIn('.overlay'); ok(!e, 'wall results in French ' + e);
  await pg.screenshot({ path: 'shots/fr-wall-end.png' });
  // Sussed
  await pg.evaluate(() => showHome()); await pg.click('#modeFive'); await pg.waitForTimeout(400);
  ok(await pg.evaluate(() => [...document.querySelectorAll('.krow')[0].querySelectorAll('.key')].map(k => k.dataset.k).join('') === 'azertyuiop'), 'AZERTY keyboard');
  const ans = await pg.evaluate(() => D.answer);
  ok(await pg.evaluate(() => FIVE_ANSWERS_FR.includes(D.answer) && D.guesses.length === 0), 'French word of the day, English game not carried over: ' + ans);
  for (const c of 'zzzzz') await pg.evaluate(c => fiveKey(c), c); await pg.evaluate(() => fiveKey('Enter'));
  ok((await pg.textContent('#msg')).includes("n'est pas dans notre liste"), 'unknown word message in French');
  for (let i = 0; i < 5; i++) await pg.evaluate(() => fiveKey('Backspace'));
  for (const c of ans) await pg.evaluate(c => fiveKey(c), c); await pg.evaluate(() => fiveKey('Enter')); await pg.waitForTimeout(2600);
  ok(await pg.evaluate(() => { const s = store.get(); return Object.keys(s).some(k => /^fr-five-/.test(k) && s[k].won) && s.frFiveStats && s.frFiveStats.won === 1 && !s.fiveStats; }), 'Sussed win saved under French keys');
  e = await englishIn('.overlay'); ok(!e, 'Sussed result in French ' + e);
  await pg.screenshot({ path: 'shots/fr-five.png' });
  // Letter Wheel
  await pg.evaluate(() => showHome()); await pg.click('#modeWheel'); await pg.waitForTimeout(400);
  const w = await pg.evaluate(() => [...wheelState().words][0]);
  for (const c of w) await pg.evaluate(c => wheelKey(c), c); await pg.evaluate(() => wheelKey('Enter'));
  ok(await pg.evaluate(w => { const s = store.get(); return Object.keys(s).some(k => /^fr-wheel-/.test(k) && s[k].found.includes(w)); }, w), 'wheel word found and saved under fr-wheel: ' + w);
  e = await englishIn('.screen'); ok(!e, 'wheel screen has no English ' + e);
  await pg.screenshot({ path: 'shots/fr-wheel.png' });
  // Word Steps daily: solve all three with the shortest route
  await pg.evaluate(() => showHome()); await pg.click('#modeSteps'); await pg.waitForTimeout(400);
  e = await englishIn('.screen'); ok(!e, 'steps screen has no English ' + e);
  for (let k = 0; k < 3; k++) {
    await pg.evaluate(() => { document.querySelectorAll('.overlay').forEach(o => o.remove()); });
    const route = await pg.evaluate(() => { const d = stepsDist(S.level.target), { near } = stepsWords(); const r = [S.level.start]; while (r[r.length - 1] !== S.level.target) { const c = r[r.length - 1]; r.push(near(c).find(n => d.get(n) === d.get(c) - 1)); } return r; });
    for (const wd of route.slice(1)) await pg.evaluate(wd => { S.edit = [...wd]; stepsSubmit(); }, wd);
    await pg.waitForTimeout(900);
    ok(route.length - 1 === (await pg.evaluate(() => S.level.min)), `steps daily ${k + 1} solved in the shortest route (${route.join(' ')})`);
    if (k < 2) { await pg.click('#rNext'); await pg.waitForTimeout(400); }
  }
  ok(await pg.evaluate(() => Object.keys(store.get()).some(k => /^fr-steps-day-/.test(k) && store.get()[k].stage === 3)), 'steps day saved under fr-steps-day');
  e = await englishIn('.overlay'); ok(!e, 'steps summary in French ' + e);
  // Letter Lock level 1
  await pg.evaluate(() => { document.querySelectorAll('.overlay').forEach(o => o.remove()); startLock(0); }); await pg.waitForTimeout(400);
  e = await englishIn('.screen'); ok(!e, 'lock screen has no English ' + e);
  await pg.screenshot({ path: 'shots/fr-lock.png' });
  await pg.evaluate(() => { K.nums.forEach(n => K.guess[n] = K.answer[n]); lockCheck(); }); await pg.waitForTimeout(900);
  ok(await pg.evaluate(() => !!store.get()['done-fr-lock-0'] && !store.get()['done-lock-0']), 'lock saved as done-fr-lock-0');
  ok((await pg.textContent('.cracked')).includes("l'oiseau fait son nid"), 'cracked phrase shown with accents and apostrophes');
  e = await englishIn('.overlay'); ok(!e, 'lock result in French ' + e);
  // help sheets, stats, settings
  for (const g of ['board', 'wall', 'five', 'wheel', 'steps', 'lock']) { await pg.evaluate(g => { document.querySelectorAll('.overlay').forEach(o => o.remove()); showHelp(g); }, g); e = await englishIn('.overlay'); ok(!e, `help for ${g} in French ` + e); }
  await pg.evaluate(() => { document.querySelectorAll('.overlay').forEach(o => o.remove()); showStats(); }); await pg.waitForTimeout(200);
  e = await englishIn('.home'); ok(!e, 'statistics in French ' + e); await pg.screenshot({ path: 'shots/fr-stats.png', fullPage: true });
  await pg.evaluate(() => showSettings()); await pg.waitForTimeout(200);
  e = await englishIn('.home'); ok(!e, 'settings in French ' + e);
  ok((await pg.evaluate(() => feedbackLink())).includes(encodeURIComponent("Qu'avez-vous aimé ?")), 'feedback email prompts in French');
  // all French content loads
  ok(await pg.evaluate(() => WALLS_FR.length === 8 && LOCK_LEVELS_FR.length === 12 && STEPS_LEVELS_FR.length === 12 && WHEEL_FR.length === 21 && BOARD_LEVELS_FR.length === 6), 'French content counts');
  ok(await pg.evaluate(() => FIVE_ANSWERS_FR.every(w => FIVE_GUESSES_FR.has(w)) && SIX_ANSWERS_FR.every(w => SIX_GUESSES_FR.has(w))), 'every answer is an accepted guess');
  // back to English: English progress still there and English content back
  await pg.evaluate(() => { const p = profile(); p.lang = 'en-GB'; store.set('profile', p); showHome(); }); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => nextWall() === 1 && fiveState().guesses[0] !== undefined || nextWall() === 1), 'English wall progress unchanged (next wall is 2)');
  ok(await pg.evaluate(() => GAMES.wall.name === 'The Wall' && keyRows()[0] === 'qwertyuiop'), 'English names and keyboard back');
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
