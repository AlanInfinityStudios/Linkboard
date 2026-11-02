"""Builds walls_us.js from walls_us.txt and checks every American wall has exactly one solution.
Run from the repo root: python3 tools/build_walls_us.py"""
import json, re, sys
from itertools import combinations
walls, cur = {}, None
for line in open("tools/walls_us.txt", encoding="utf-8"):
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
    cands = [set(g[1]) | set(h for h in g[2] if h in tiles) for g in gs]
    sols = []
    def rec(i, used, pick):
        if i == 4: sols.append(pick); return
        for c in combinations(sorted(cands[i] - used), 4): rec(i + 1, used | set(c), pick + [c])
    rec(0, set(), [])
    if len(sols) != 1: print("Wall", n, "solutions:", len(sols)); bad += 1
out = {n - 1: {"name": f"Wall {n}", "groups": [{"name": g[0], "tiles": g[1]} for g in gs]} for n, gs in sorted(walls.items())}
open("walls_us.js", "w", encoding="utf-8").write("// American walls, built by tools/build_walls_us.py from tools/walls_us.txt. Keyed by wall index; any wall not listed is shared.\nconst WALLS_US = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n")
print(len(walls), "American walls,", bad, "problems")
sys.exit(1 if bad else 0)
