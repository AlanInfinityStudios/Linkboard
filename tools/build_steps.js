/* Builds steps.js for Word Steps from SCOWL (wordlist-english on npm, MIT licence).
   Run: NODE_PATH=<folder with node_modules> node tools/build_steps.js
   STEPS_COMMON: familiar words (used for puzzles and hints). STEPS_EXTRA: rarer words that are still accepted as steps.
   Every level is checked with a breadth-first search: it must have a route, and its shortest route must be
   possible using familiar words only. The minimum number of moves is stored with the level. */
const L = n => { try { return require("wordlist-english/" + n + ".json"); } catch { return []; } };
const lists = (pres, sizes) => pres.flatMap(p => sizes.flatMap(s => L(p + "-words-" + s)));
const BLOCK = new Set(require("fs").readFileSync(require("path").join(__dirname, "blocklist.txt"), "utf8").split(/\s+/).filter(Boolean));
const ok = w => /^[a-z]+$/.test(w) && w.length >= 4 && w.length <= 6 && !BLOCK.has(w);
const common = new Set(lists(["english", "british"], [10, 20, 35]).filter(ok));
const accept = new Set([...common, ...lists(["english", "british", "american"], [40, 50]).filter(ok), ...lists(["english", "british"], [10, 20, 35, 40, 50]).filter(ok)]);
// Plurals and simple verb forms are fine as steps, but levels start and end on base words.
const all = new Set(lists(["english", "british"], [10, 20, 35]));
const isInflect = w => (w.endsWith("s") && (all.has(w.slice(0, -1)) || all.has(w.slice(0, -2)))) || (w.endsWith("ed") && (all.has(w.slice(0, -2)) || all.has(w.slice(0, -1)))) || w.endsWith("ing") ||
  (w.endsWith("er") && (all.has(w.slice(0, -1)) || all.has(w.slice(0, -2)))) || (w.endsWith("est") && (all.has(w.slice(0, -2)) || all.has(w.slice(0, -3)))) || (w.endsWith("ly") && all.has(w.slice(0, -2)));
function graph(words) {
  const buckets = new Map();
  for (const w of words) for (let i = 0; i < w.length; i++) { const k = w.slice(0, i) + "_" + w.slice(i + 1); if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(w); }
  return w => { const out = []; for (let i = 0; i < w.length; i++) for (const n of buckets.get(w.slice(0, i) + "_" + w.slice(i + 1)) || []) if (n !== w) out.push(n); return out; };
}
function bfs(nb, from) { const d = new Map([[from, 0]]), q = [from]; for (let i = 0; i < q.length; i++) for (const n of nb(q[i])) if (!d.has(n)) { d.set(n, d.get(q[i]) + 1); q.push(n); } return d; }
const nbAll = graph(accept), nbCommon = graph(common);
// Hand-picked pairs first (they make nicer puzzles), then a seeded fill to reach each band.
const PICKS = [["cold", "warm"], ["love", "hate"], ["head", "tail"], ["east", "west"], ["fish", "bird"], ["rain", "snow"], ["hand", "foot"], ["lion", "bear"], ["boat", "ship"], ["milk", "wine"], ["wolf", "lamb"], ["sand", "rock"], ["dark", "glow"], ["poor", "rich"], ["fast", "slow"], ["give", "take"], ["moon", "star"], ["ruby", "gold"], ["hard", "easy"], ["word", "game"], ["black", "white"], ["sleep", "dream"], ["bread", "toast"], ["stone", "money"], ["water", "flame"], ["smile", "laugh"], ["sweet", "sugar"], ["tiger", "horse"], ["lemon", "melon"], ["winter", "summer"], ["silver", "copper"], ["little", "bigger"]];
let seed = 20261102; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const BANDS = [ // [difficulty, count, lengths, min moves, max moves]
  ["Easy", 12, [4], 3, 4], ["Medium", 14, [4, 5], 4, 6], ["Hard", 14, [5, 6], 5, 8], ["Expert", 10, [5, 6], 7, 10]];
const base = lists(["english", "british"], [10, 20]).filter(w => ok(w) && !isInflect(w));
const levels = [], used = new Set();
function tryPair(a, b, band) {
  const [, , lens, lo, hi] = band;
  if (a.length !== b.length || !lens.includes(a.length) || used.has(a) || used.has(b)) return false;
  const dAll = bfs(nbAll, a).get(b), dCom = bfs(nbCommon, a).get(b);
  if (dAll == null || dAll !== dCom || dAll < lo || dAll > hi) return false;
  used.add(a); used.add(b); levels.push({ start: a, target: b, min: dAll, difficulty: band[0] }); return true;
}
for (const band of BANDS) {
  let n = 0;
  for (const [a, b] of PICKS) if (n < band[1] && tryPair(a, b, band)) n++;
  let guard = 0;
  while (n < band[1] && guard++ < 200000) {
    const len = band[2][Math.floor(rnd() * band[2].length)], pool = base.filter(w => w.length === len);
    const a = pool[Math.floor(rnd() * pool.length)], b = pool[Math.floor(rnd() * pool.length)];
    if (a !== b && tryPair(a, b, band)) n++;
  }
}
const extra = [...accept].filter(w => !common.has(w));
const out = `/* Word Steps data. Built by tools/build_steps.js from SCOWL (wordlist-english, MIT licence). Do not edit by hand:
   add or remove words in the build script (or tools/blocklist.txt) and run it again. */
const STEPS_COMMON = "${[...common].sort().join(" ")}".split(" ");
const STEPS_EXTRA = "${extra.sort().join(" ")}".split(" ");
const STEPS_LEVELS = [
${levels.map(l => `  { start: "${l.start}", target: "${l.target}", min: ${l.min}, difficulty: "${l.difficulty}" },`).join("\n")}
];
`;
require("fs").writeFileSync(require("path").join(__dirname, "..", "steps.js"), out);
console.log("common", common.size, "accept", accept.size, "levels", levels.length, "bytes", out.length);
console.log(levels.map(l => `${l.difficulty} ${l.start}->${l.target} ${l.min}`).join("\n"));
