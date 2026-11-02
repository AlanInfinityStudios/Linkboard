/* Builds six.js for Daily Five's hard mode (six letters, seven tries) from SCOWL (wordlist-english on npm, MIT licence).
   Run: NODE_PATH=<folder with node_modules> node tools/build_six.js
   SIX_ANSWERS: familiar six-letter words, one per day in a fixed shuffled order (no plurals or simple word forms).
   SIX_GUESSES: every six-letter word accepted as a guess. */
const fs = require("fs"), path = require("path");
const L = n => { try { return require("wordlist-english/" + n + ".json"); } catch { return []; } };
const up = (pre, max) => [10, 20, 35, 40, 50, 55, 60, 70].filter(s => s <= max).flatMap(s => L(pre + "-words-" + s));
const BLOCK = new Set(fs.readFileSync(path.join(__dirname, "blocklist.txt"), "utf8").split(/\s+/).filter(Boolean)
  .concat("bitch whore sluts faggot penis vagina rapist porno pussy bastard hooker heroin cocaine orgasm dildo semen sperm wanker retard spastic queers killer murder slaves gonads nigger negroes".split(" ")));
const ok = w => /^[a-z]+$/.test(w) && !BLOCK.has(w);
const common = new Set([...up("english", 20), ...up("british", 20)].filter(ok));
const all = new Set([...up("english", 35), ...up("british", 35)]);
const isInflect = w => (w.endsWith("s") && (all.has(w.slice(0, -1)) || all.has(w.slice(0, -2)))) || (w.endsWith("ed") && (all.has(w.slice(0, -2)) || all.has(w.slice(0, -1)))) ||
  w.endsWith("ing") || (w.endsWith("er") && (all.has(w.slice(0, -1)) || all.has(w.slice(0, -2)))) || (w.endsWith("est") && (all.has(w.slice(0, -2)) || all.has(w.slice(0, -3)))) || (w.endsWith("ly") && all.has(w.slice(0, -2)));
// Answers: the most familiar list (size 10 and 20), not American-only spellings, so UK and US players can both get them.
const us = new Set([...up("american", 20)]), uk = new Set([...up("british", 20)]);
// Words that are fine as guesses but make poor or unsuitable answers (word forms, Americanisms, rude or grim words).
const SKIP = new Set(("sexual bugger buggers corpse faucet kidnap insane french should bitten copied fitted taught sought sprang drivel smelly " +
  "chosen frozen spoken stolen broken fallen beaten hidden ridden shaken woken thrown grown flown drawn sworn torn forgot forbid arisen " +
  "brought thought bought caught fought fourth myself itself unless whilst within almost anyway twelve thirty eighty ninety " +
  "abuser addict murder raping racist sadism sadist suicide slaughter terror cancer tumour tumor stroke bomber pistol rifles weapon assault " +
  "bigger logged driven misled though cannot subset cursor toward bogged whence bitmap unread jewish muslim christ hindus catholic israel german french arabic yankee").split(" "));
const answers = [...new Set([...L("english-words-10"), ...L("english-words-20")])].filter(w => w.length === 6 && ok(w) && !isInflect(w) && !SKIP.has(w) && !w.endsWith("ied") && !w.endsWith("ies") && !w.endsWith("ier"));
const guesses = new Set([...up("english", 70), ...up("british", 70), ...up("american", 70)].filter(w => w.length === 6 && ok(w)));
answers.forEach(w => guesses.add(w));
let seed = 20261104; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
for (let i = answers.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [answers[i], answers[j]] = [answers[j], answers[i]]; }
const out = `/* Daily Five hard mode word lists. Built by tools/build_six.js from SCOWL (wordlist-english, MIT licence). Do not edit by hand. */
const SIX_ANSWERS = "${answers.join(" ")}".split(" ");
const SIX_GUESSES = new Set("${[...guesses].sort().join(" ")}".split(" "));
`;
fs.writeFileSync(path.join(__dirname, "..", "six.js"), out);
console.log("answers", answers.length, "guesses", guesses.size, "bytes", out.length);
console.log(answers.slice(0, 80).join(" "));
