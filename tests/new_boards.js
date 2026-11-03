// New Linkology levels 26-50: load in UK and US, unique labels, then auto-solve UK levels to the end.
const { chromium } = require('playwright');
const FROM = +(process.argv[2] || 25), TO = +(process.argv[3] || 49), WAIT = +(process.argv[4] || 2200);
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => { const b = await chromium.launch(); const errs = [];
  const pg = await (await b.newContext({ viewport: { width: 1194, height: 834 } })).newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.addInitScript(() => { if (!localStorage.getItem('linkboard-v3')) localStorage.setItem('linkboard-v3', JSON.stringify({ profile: { name: 'A', lang: 'en-GB' }, updatedAt: 1 })); });
  await pg.goto('http://localhost:8765/index.html'); await pg.waitForTimeout(700);
  ok(await pg.evaluate(() => BOARD_LEVELS.length === 50), '50 levels'); if (process.env.DBG) await pg.exposeFunction('dbg', x => console.log('DBG', x));
  for (const lang of ['en-US', 'en-GB']) {
    await pg.evaluate(l => { const p = profile(); p.lang = l; store.set('profile', p); }, lang);
    for (let i = FROM; i <= TO; i++) {
      await pg.evaluate(i => startBoard(i), i); await pg.waitForTimeout(500);
      const lab = await pg.evaluate(() => B.tiles.map(t => t.label));
      const bad = lab.filter((x, k) => lab.indexOf(x) !== k || /»|undefined/.test(x));
      ok(!bad.length, `${lang} level ${i + 1} loads, labels fine ${bad.join(',')}`);
      if (lang === 'en-US') continue;
      let steps = 0;
      while (steps++ < 40) {
        const r = await pg.evaluate(() => {
          if (B.solved.size === B.groups.length) return { end: true };
          const g = B.groups.find(g => !B.solved.has(g.id) && g.memberTiles.every(t => B.board.includes(t)));
          if (!g) return { stuck: true, solved: B.solved.size, of: B.groups.length, left: B.groups.filter(g => !B.solved.has(g.id)).map(g => g.name + ':' + g.memberTiles.map(t => (B.board.includes(t) ? '' : '!') + B.tiles[t]?.label).join('/')), pool: (B.pool||[]).length };
          const mem = g.memberTiles, idx = t => B.board.indexOf(t);
          for (let c = 0; c < 4; c++) { const a = c, bI = idx(mem[c]); [B.board[a], B.board[bI]] = [B.board[bI], B.board[a]]; }
          if (idx(mem[4]) === 4) { [B.board[4], B.board[5]] = [B.board[5], B.board[4]]; }  // a free slot in row 2 (row 7 may be a locked group)
          renderBoard(); return { a: B.board.indexOf(mem[4]), t: 4 };
        });
        if (r.end || r.stuck) { ok(!r.stuck || r.solved === r.of, `level ${i + 1} solved to the end ${JSON.stringify(r)} after ${steps - 1}`); break; }
        await pg.evaluate(r => swapSlots(r.a, r.t), r); await pg.waitForTimeout(WAIT);
      }
      if (i === FROM) await pg.screenshot({ path: `shots/new-board-${i + 1}.png` });
    }
  }
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no page errors'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close(); })();
