const { chromium } = require('playwright');
const out = require('os').tmpdir() + '/';
const save = { profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[1194, 834, 'ipad'], [390, 844, 'phone'], [320, 640, 'small']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify(save));
    await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
    await pg.evaluate(() => startFive('classic')); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => document.querySelectorAll('.frow').length === 6 && document.querySelectorAll('.frow')[0].children.length === 5), tag + ' classic 6x5');
    if (tag === 'ipad') {
      // classic: one wrong guess then type
      const wrong = await pg.evaluate(() => [...FIVE_GUESSES].find(x => x !== D.answer));
      for (const c of wrong) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1700);
      for (const c of 'cr') await pg.keyboard.press(c);
      await pg.screenshot({ path: out + 'f-classic-ipad.png' });
    }
    await pg.click('.fmode button[data-mode="hard"]'); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => D.mode === 'hard' && document.querySelectorAll('.frow').length === 7 && document.querySelectorAll('.frow')[0].children.length === 6), tag + ' hard 7x6');
    const fit = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth && [...document.querySelectorAll('.ft,.key')].every(t => t.getBoundingClientRect().right <= innerWidth + 0.5));
    ok(fit, tag + ' hard fits width');
    const bottom = await pg.evaluate(() => Math.round(document.querySelector('#keys').getBoundingClientRect().bottom));
    console.log(tag, 'keys bottom', bottom, 'of', h);
    if (tag === 'ipad') {
      const st = await pg.evaluate(() => ({ a: D.answer, inA: SIX_ANSWERS.includes(D.answer), n: SIX_ANSWERS.length }));
      ok(st.a.length === 6 && st.inA, 'hard answer is 6 letters ' + st.a);
      for (const c of 'abcde') await pg.keyboard.press(c); await pg.keyboard.press('Enter');
      ok((await pg.textContent('#msg')) === 'Six letters, please.', 'short guess rejected');
      await pg.keyboard.press('f'); await pg.keyboard.press('Enter');
      ok((await pg.textContent('#msg')).includes("isn't in our word list"), 'non-word rejected');
      for (let i = 0; i < 6; i++) await pg.keyboard.press('Backspace');
      const wrong = await pg.evaluate(() => [...SIX_GUESSES].find(x => x !== D.answer && x.length === 6));
      for (const c of wrong) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1700);
      ok((await pg.textContent('#msg')).includes('6 tries left'), 'wrong guess counts: ' + await pg.textContent('#msg'));
      await pg.screenshot({ path: out + 'f-hard-ipad.png' });
      // reload restores hard mode
      await pg.reload(); await pg.waitForTimeout(600); await pg.evaluate(() => startFive()); await pg.waitForTimeout(300);
      ok(await pg.evaluate(() => D.mode === 'hard' && D.guesses.length === 1), 'hard progress and mode restored');
      const ans = await pg.evaluate(() => D.answer);
      for (const c of ans) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(3000);
      ok(await pg.isVisible('.sheet'), 'result sheet');
      const s = await pg.evaluate(() => { const g = store.get(); return { six: g['six-' + todayKey()], st: g.sixStats, five: g['five-' + todayKey()], fs: g.fiveStats }; });
      ok(s.six.won && s.six.guesses.length === 2, 'six-date saved');
      ok(s.st.played === 1 && s.st.won === 1 && s.st.streak === 1 && s.st.dist.length === 7 && s.st.dist[1] === 1, 'sixStats ' + JSON.stringify(s.st));
      ok(s.five && !s.five.over && s.five.guesses.length === 1 && !s.fs, 'classic untouched ' + JSON.stringify(s.five));
      ok((await pg.textContent('#tryHard')).includes('Classic'), 'after hard: offers Classic');
      await pg.screenshot({ path: out + 'f-hard-done.png' });
      const txt = await pg.evaluate(async () => { document.querySelector('#share').click(); await new Promise(r => setTimeout(r, 50)); const t = document.querySelector('.share-preview').textContent; document.querySelector('.share-ov').remove(); return t; });
      ok(/Sussed Hard, .*: 2\/7\n.*🟢🟢🟢🟢🟢🟢/s.test(txt), 'share text ' + JSON.stringify(txt));
      await pg.click('#menu'); await pg.waitForTimeout(300);
      // finish classic -> Try Hard should not appear (hard done)
      await pg.evaluate(() => startFive('classic')); await pg.waitForTimeout(300);
      const a5 = await pg.evaluate(() => D.answer);
      for (const c of a5) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(3000);
      ok((await pg.textContent('#tryHard')) === 'See Hard result', 'classic done, hard done: See Hard result');
      const fs = await pg.evaluate(() => store.get().fiveStats);
      ok(fs.played === 1 && fs.dist.length === 6 && fs.dist[1] === 1, 'fiveStats ' + JSON.stringify(fs));
      await pg.click('#menu'); await pg.waitForTimeout(300);
      await pg.screenshot({ path: out + 'f-home.png' });
      const card = await pg.evaluate(() => document.body.innerText.match(/Sussed[\s\S]{0,140}/)[0]);
      console.log('home card:', JSON.stringify(card));
    }
    if (tag === 'phone') await pg.screenshot({ path: out + 'f-hard-phone.png' });
    if (tag === 'small') await pg.screenshot({ path: out + 'f-hard-320.png' });
    await ctx.close();
  }
  // Try Hard button after classic when hard not played
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const pg = await ctx.newPage();
  await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify(save));
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(600);
  await pg.evaluate(() => startFive('classic')); await pg.waitForTimeout(200);
  const a = await pg.evaluate(() => D.answer); for (const c of a) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(3000);
  ok((await pg.textContent('#tryHard')) === 'Try Hard mode', 'Try Hard offered after classic');
  await pg.screenshot({ path: out + 'f-classic-done-phone.png' });
  await pg.click('#tryHard'); await pg.waitForTimeout(300);
  ok(await pg.evaluate(() => D.mode === 'hard' && !document.querySelector('.overlay')), 'Try Hard opens hard mode');
  await ctx.close();
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors');
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
