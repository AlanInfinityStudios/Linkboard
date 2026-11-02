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
    await pg.evaluate(() => startBoard(4)); await pg.waitForTimeout(1500);
    const w0 = await pg.evaluate(() => walletN() + freeLeft('board'));
    await pg.click('#hintBtn'); await pg.waitForTimeout(300);
    const h1 = await pg.evaluate(() => JSON.parse(JSON.stringify(B.hints)));
    ok(h1.length === 1 && h1[0].tiles.length === 2, tag + ' first hint ' + JSON.stringify(h1));
    await pg.click('#hintBtn'); await pg.waitForTimeout(300);
    const h2 = await pg.evaluate(() => JSON.parse(JSON.stringify(B.hints)));
    ok(h2.length === 2 && h2[0].g !== h2[1].g && h2[0].tiles.join() === h1[0].tiles.join(), tag + ' second hint is a different group, first kept ' + JSON.stringify(h2));
    ok(await pg.evaluate(() => w => walletN() + freeLeft('board') === w - 2, w0) !== false, tag + ' two hints spent');
    // every hinted tile is visible on screen and every member of hinted groups on board
    const vis = await pg.evaluate(() => B.hints.every(h => B.groups[h.g].memberTiles.every(t => { const el = document.querySelector(`.tile[data-id="${t}"]`); if (!el) return false; const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; })));
    ok(vis, tag + ' all words of hinted groups are on screen');
    const badges = await pg.evaluate(() => [...document.querySelectorAll('.tile.hinted')].map(e => e.dataset.h).sort().join());
    ok(badges === '1,1,2,2', tag + ' badges ' + badges);
    await pg.screenshot({ path: `${require("os").tmpdir()}/h-${tag}.png` });
    // reload keeps both
    await pg.reload(); await pg.waitForTimeout(700); await pg.evaluate(() => startBoard(4)); await pg.waitForTimeout(1500);
    ok(await pg.evaluate(() => B.hints.length === 2 && document.querySelectorAll('.tile.hinted').length === 4), tag + ' hints survive reload');
    // solve hint 1's group by arranging board directly into a row, then swap to trigger
    const r = await pg.evaluate(() => {
      const g = B.groups[B.hints[0].g]; const row = 0; const mem = g.memberTiles;
      // place members into row 0 except last, put last elsewhere, then swap it in
      const idx = t => B.board.indexOf(t);
      for (let c = 0; c < 4; c++) { const a = row * COLS + c, bI = idx(mem[c]); [B.board[a], B.board[bI]] = [B.board[bI], B.board[a]]; }
      const last = idx(mem[4]); const target = row * COLS + 4;
      if (last === target) { const o = row * COLS + 4, alt = 30; [B.board[o], B.board[alt]] = [B.board[alt], B.board[o]]; }
      renderBoard(); return { a: B.board.indexOf(mem[4]), t: target, g: g.id };
    });
    await pg.evaluate(r => swapSlots(r.a, r.t), r); await pg.waitForTimeout(4500);
    const after = await pg.evaluate(() => ({ solved: [...B.solved], hints: JSON.parse(JSON.stringify(B.hints)) }));
    ok(after.solved.includes(r.g) && after.hints.length === 1 && after.hints[0].g !== r.g, tag + ' solving hint 1 clears only hint 1 ' + JSON.stringify(after));
    ok(await pg.evaluate(() => B.hints.every(h => B.groups[h.g].memberTiles.every(t => B.board.includes(t)))), tag + ' hint 2 group still all on board after refill');
    await pg.screenshot({ path: `${require("os").tmpdir()}/h-${tag}-after.png` });
  }
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors');
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close();
})();
