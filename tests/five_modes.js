const { chromium } = require('playwright');
const save = { profile: { name: 'Alan', lang: 'en-GB' }, updatedAt: 1 };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[1194, 834, 'ipad'], [390, 844, 'phone']]) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })).newPage();
    pg.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await pg.addInitScript(s => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', s); }, JSON.stringify(save));
    await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
    const solve = async () => { const a = await pg.evaluate(() => D.answer); for (const c of a) await pg.keyboard.press(c); await pg.keyboard.press('Enter'); await pg.waitForTimeout(3000); };
    // Play Hard first, without Classic
    await pg.click('#modeFive'); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => D.mode === 'classic'), tag + ' opens classic first time');
    await pg.click('.fmode button[data-mode="hard"]'); await pg.waitForTimeout(300);
    await solve();
    ok(await pg.isVisible('.sheet'), tag + ' result sheet after hard win');
    ok((await pg.textContent('#tryHard')) === 'Play Classic', tag + ' sheet offers Play Classic: ' + await pg.textContent('#tryHard'));
    await pg.click('#fClose'); await pg.waitForTimeout(200);
    ok(await pg.isVisible('.fend') && !(await pg.isVisible('.overlay')), tag + ' See board shows end panel');
    ok(await pg.evaluate(() => document.querySelectorAll('.fm-tick').length === 1), tag + ' tick on hard tab');
    if (tag === 'phone') await pg.screenshot({ path: require('os').tmpdir() + '/l-hard-end-phone.png' });
    await pg.click('#back'); await pg.waitForTimeout(300);
    const card = await pg.evaluate(() => document.querySelector('#modeFive').innerText);
    ok(/Classic\s*to play/.test(card) && /Hard\s*1\/7/.test(card) && /Play Classic/.test(card), tag + ' home card ' + JSON.stringify(card));
    ok(await pg.evaluate(() => /1 \/ 4/.test(document.body.innerText)), tag + ' hard alone completes the daily');
    // Opening from home goes to Classic (still to play)
    await pg.click('#modeFive'); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => D.mode === 'classic' && !document.querySelector('.overlay')), tag + ' opens Classic, no popup');
    await solve();
    ok((await pg.textContent('#tryHard')) === 'See Hard result', tag + ' sheet offers See Hard result');
    await pg.click('#tryHard'); await pg.waitForTimeout(500);
    ok(await pg.evaluate(() => D.mode === 'hard') && await pg.isVisible('.sheet'), tag + ' shows Hard result');
    await pg.click('#menu'); await pg.waitForTimeout(300);
    if (tag === 'ipad') await pg.screenshot({ path: require('os').tmpdir() + '/l-home-ipad.png' });
    const card2 = await pg.evaluate(() => document.querySelector('#modeFive').innerText);
    ok(/See results/.test(card2), tag + ' both done: See results');
    // reopen: no popup over toggle, toggle still switches
    await pg.click('#modeFive'); await pg.waitForTimeout(600);
    ok(!(await pg.isVisible('.overlay')) && await pg.isVisible('.fend'), tag + ' reopen shows board + end panel, not a popup');
    await pg.click('.fmode button[data-mode="classic"]'); await pg.waitForTimeout(300);
    ok(await pg.evaluate(() => D.mode === 'classic') && await pg.isVisible('.fend'), tag + ' can switch to classic result');
    await pg.click('#fSee'); await pg.waitForTimeout(300);
    ok(await pg.isVisible('.sheet'), tag + ' See result opens sheet');
    if (tag === 'phone') await pg.screenshot({ path: require('os').tmpdir() + '/l-sheet-phone.png' });
  }
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors');
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
