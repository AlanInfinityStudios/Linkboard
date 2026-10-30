const L=n=>{try{return require("wordlist-english/"+n+".json")}catch{return []}};
const up=(pre,max)=>[10,20,35,40,50].filter(s=>s<=max).flatMap(s=>L(pre+"-words-"+s));
const BLOCK=new Set("bitch bitches whore whores slut sluts nigger nigga faggot fag fags cunt cunts dick dicks cock cocks penis penises vagina vaginas rape raped rapes rapist porn porno pussy pussies bastard bastards crap shit shits fuck fucks fucked damn damned hooker pimp pimps nazi nazis bigot bigots kill killer kills murder slave slaves heroin cocaine gonad gonads anal anus enema dildo semen sperm orgasm sexy sex horny boob boobs tits tit butt butts arse arses wank wanker twat piss pissed homo homos dyke dykes negro negroes retard retards spastic queer queers".split(" "));
const ok=w=>/^[a-z]+$/.test(w)&&!BLOCK.has(w);
// ---- five
const common=new Set(up("english",20).filter(ok));
const f5=[...common].filter(w=>w.length===5);
const isInflect=w=>(w.endsWith("s")&&(common.has(w.slice(0,-1))||common.has(w.slice(0,-2))&&w.endsWith("es")))||(w.endsWith("ed")&&(common.has(w.slice(0,-2))||common.has(w.slice(0,-1))))||(w.endsWith("er")&&common.has(w.slice(0,-2)));
const answers=f5.filter(w=>!isInflect(w));
const guessAll=new Set([...up("english",70),...up("british",70),...up("american",70)].filter(w=>ok(w)&&w.length===5));
answers.forEach(w=>guessAll.add(w));
// seeded shuffle
let seed=20261101; const rnd=()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
sh(answers);
// ---- wheel
const distinct=w=>new Set(w).size;
const base=up("english",35).filter(ok), uk=up("british",35).filter(ok), us=up("american",35).filter(ok);
const wf=w=>w.length>=4&&distinct(w)<=7&&!w.includes("s");
const B=base.filter(wf), UK=uk.filter(wf), US=us.filter(wf);
const pang=[...new Set(up("english",20).filter(w=>ok(w)&&!w.includes("s")&&distinct(w)===7))];
const dict=(letters,centre,extra)=>B.concat(extra).filter(w=>w.includes(centre)&&[...w].every(c=>letters.includes(c)));
const puzzles=[]; const usedSets=new Set();
for (const p of sh(pang)) {
  const letters=[...new Set(p)].sort().join(""); if (usedSets.has(letters)) continue;
  const opts=[...letters].filter(c=>{const a=dict(letters,c,UK).length,b=dict(letters,c,US).length;return a>=18&&a<=45&&b>=18&&b<=45;});
  if(!opts.length) continue;
  usedSets.add(letters); puzzles.push(opts[Math.floor(rnd()*opts.length)]+letters);
  if(puzzles.length>=500) break;
}
console.log("answers",answers.length,"guesses",guessAll.size,"wheel base",B.length,UK.length,US.length,"pangrams",pang.length,"puzzles",puzzles.length);
console.log(answers.slice(0,60).join(" "));
const out=`/* Word lists for the daily games. Built from SCOWL (wordlist-english on npm, MIT licence) by tools/build_words.js.
   FIVE_ANSWERS: one answer per day, in a fixed shuffled order. FIVE_GUESSES: every word accepted as a guess.
   WHEEL_*: words of 4+ letters, no S, at most 7 different letters. WHEEL_PUZZLES: centre letter first, then the 7 letters. */
const FIVE_ANSWERS = "${answers.join(" ")}".split(" ");
const FIVE_GUESSES = new Set("${[...guessAll].sort().join(" ")}".split(" "));
const WHEEL_WORDS = "${B.join(" ")}".split(" ");
const WHEEL_UK = "${UK.join(" ")}".split(" ");
const WHEEL_US = "${US.join(" ")}".split(" ");
const WHEEL_PUZZLES = "${puzzles.join(" ")}".split(" ");
`;
require("fs").writeFileSync(require("path").join(__dirname, "..", "words.js"),out);
console.log("bytes",out.length);
console.log(puzzles.slice(0,5).map(p=>p+":"+dict(p.slice(1),p[0],UK).join(",")).join("\n"));
