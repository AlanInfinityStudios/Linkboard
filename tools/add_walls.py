"""Checks tools/walls_more.txt (walls 101 onwards) and appends any new walls to puzzles.js and check_walls.py.
Run from the repo root: python3 tools/add_walls.py   (walls already in puzzles.js are skipped)."""
import re, sys
from itertools import combinations
walls, cur = {}, None
for line in open("tools/walls_more.txt", encoding="utf-8"):
    line = line.strip()
    if not line or line.startswith("#"): continue
    m = re.match(r"W (\d+)$", line)
    if m: cur = int(m.group(1)); walls[cur] = []; continue
    name, tiles, herr = [p.strip() for p in line.split("|")]
    walls[cur].append((name, [t.strip() for t in tiles.split(",")], [h.strip() for h in herr.split(",") if h.strip()]))
bad = 0
for n, gs in walls.items():
    tiles = [t for g in gs for t in g[1]]
    if len(gs) != 4 or len(tiles) != 16 or len(set(t.lower() for t in tiles)) != 16:
        print("Wall", n, "needs 4 groups of 4 different tiles", [t for t in tiles if [x.lower() for x in tiles].count(t.lower()) > 1]); bad += 1; continue
    for g in gs:
        for h in g[2]:
            if h not in tiles: print("Wall", n, g[0], "herring not on wall:", h); bad += 1
            if h in g[1]: print("Wall", n, g[0], "herring is already in the group:", h); bad += 1
    cands = [set(g[1]) | set(g[2]) for g in gs]
    sols = []
    def rec(i, used, pick):
        if i == 4: sols.append(pick); return
        for c in combinations(sorted(cands[i] - used), 4): rec(i + 1, used | set(c), pick + [c])
    rec(0, set(), [])
    if len(sols) != 1: print("Wall", n, "solutions:", len(sols)); bad += 1
if bad: print(bad, "problems, nothing written"); sys.exit(1)
pz = open("puzzles.js", encoding="utf-8").read()
have = set(int(x) for x in re.findall(r'name: "Wall (\d+)"', pz))
new = [n for n in sorted(walls) if n not in have]
if new != list(range(max(have) + 1, max(have) + 1 + len(new))): print("walls must follow on from", max(have)); sys.exit(1)
q = lambda t: '"' + t.replace('"', '\\"') + '"'
js = "".join(f'  {{ name: "Wall {n}", groups: [\n' + "".join(f'    {{ name: {q(g[0])}, tiles: [{", ".join(q(t) for t in g[1])}] }},\n' for g in walls[n]) + "  ]},\n" for n in new)
start = pz.index("const WALLS = [")
end = pz.index("\n];", start)
pz = pz[:end + 1] + js + pz[end + 1:]
open("puzzles.js", "w", encoding="utf-8").write(pz)
cw = open("tools/check_walls.py", encoding="utf-8").read()
py = "".join(f' ("Wall {n}", [' + ",\n   ".join(f'({q(g[0])},[{", ".join(q(t) for t in g[1])}],[{", ".join(q(h) for h in g[2])}])' for g in walls[n]) + "]),\n" for n in new)
i = cw.index("]\nfrom itertools")
open("tools/check_walls.py", "w", encoding="utf-8").write(cw[:i] + py + cw[i:])
print("added walls", new[0] if new else "-", "to", new[-1] if new else "-")
