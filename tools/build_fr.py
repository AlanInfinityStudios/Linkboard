"""Builds fr.js: the French content for The Wall, Sussed, Letter Wheel, Word Steps and Letter Lock.
(Linkology's French levels are in puzzles.js, as BOARD_LEVELS_FR.)

Word lists, not committed (put them in tools/fr-data/):
  french-words.json  from the npm package an-array-of-french-words 2.0.0 (MIT licence)
                     https://registry.npmjs.org/an-array-of-french-words/-/an-array-of-french-words-2.0.0.tgz (package/index.json)
  fr_50k.txt         word frequencies from subtitles, hermitdave/FrequencyWords (CC BY-SA 4.0)
                     https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fr/fr_50k.txt
Run: python3 tools/build_fr.py

Accents: the word games use plain letters A to Z (été is typed ETE, cœur is COEUR), as French word games usually do.
Letter Lock keeps the accented phrase to show once it is cracked.
"""
import json, os, random, re, string, unicodedata
from itertools import combinations

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "fr-data")

def norm(w):
    w = w.replace("œ", "oe").replace("Œ", "OE").replace("æ", "ae").replace("Æ", "AE")
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn")

BLOCK = set("""pisse pisser pisses pissat foute foutre fout foutu foutue foutus merde merdes merdique pute putes putain putains
bite bites sexe sexes sexy conne connes connard connards connasse salope salopes salaud salauds salopard chier chie chies chiant
nique niquer niques baise baiser baisee baises baisent seins encule enculer enculee bordel branler branle branlette pede pedes
negre negres negro nazi nazis tuer tueur tueurs tuee tues tue tuent crever creve viol viols violer viole violee zizi zob couille
couilles nichon nichons gouine gouines tapette garce garces poufiasse pouffiasse chiotte chiottes cocu cocus batard batards
enfoire enfoires cons pete peter pets fesse fesses penis vagin vagins anus orgasme sperme porno suicide meurtre cocaine heroine
drogue drogues crack gonzesse bougnoule youpin""".split())

words = json.load(open(os.path.join(DATA, "french-words.json"), encoding="utf-8"))
DICT = {n for n in (norm(w).lower() for w in words) if re.fullmatch("[a-z]+", n) and n not in BLOCK}
freq, seen = [], set()
for line in open(os.path.join(DATA, "fr_50k.txt"), encoding="utf-8"):
    n = norm(line.split()[0]).lower()
    if n in DICT and n not in seen: seen.add(n); freq.append(n)
RANK = {w: i for i, w in enumerate(freq)}

# ---------------------------------------------------------------- The Wall
# Each wall: (name, [(connection, four clues, herrings)]). Herrings are other clues on the wall that also fit,
# and the check below makes sure every wall still has exactly one solution.
WALLS = [
 ("Mur 1", [("Fromages", ["Brie", "Cantal", "Comté", "Morbier"], []),
   ("Fleuves de France", ["Loire", "Seine", "Garonne", "Rhône"], []),
   ("Races de chiens", ["Caniche", "Labrador", "Basset", "Bouledogue"], []),
   ("Danses", ["Valse", "Tango", "Salsa", "Java"], [])]),
 ("Mur 2", [("Peintres impressionnistes", ["Monet", "Manet", "Degas", "Renoir"], []),
   ("Les trois mousquetaires et d'Artagnan", ["Athos", "Porthos", "Aramis", "D'Artagnan"], []),
   ("Planètes", ["Mars", "Vénus", "Saturne", "Mercure"], []),
   ("Pâtes", ["Penne", "Farfalle", "Lasagne", "Tagliatelle"], [])]),
 ("Mur 3", [("Arbres", ["Chêne", "Hêtre", "Bouleau", "Saule"], []),
   ("Oiseaux", ["Merle", "Pie", "Geai", "Rossignol"], []),
   ("Outils", ["Marteau", "Scie", "Tournevis", "Pince"], []),
   ("Pièces d'échecs", ["Fou", "Tour", "Cavalier", "Pion"], [])]),
 ("Mur 4", [("Capitales européennes", ["Rome", "Madrid", "Berlin", "Lisbonne"], []),
   ("Vins", ["Bordeaux", "Chablis", "Beaujolais", "Sancerre"], []),
   ("Personnages de Tintin", ["Milou", "Haddock", "Tournesol", "Castafiore"], []),
   ("Personnages d'Astérix", ["Obélix", "Panoramix", "Idéfix", "Abraracourcix"], [])]),
 ("Mur 5", [("Pâtisseries", ["Éclair", "Macaron", "Mille-feuille", "Profiterole"], []),
   ("Météo", ["Orage", "Grêle", "Brume", "Verglas"], ["Éclair"]),
   ("Instruments", ["Violon", "Harpe", "Trompette", "Hautbois"], []),
   ("Sports", ["Judo", "Escrime", "Aviron", "Voile"], [])]),
 ("Mur 6", [("Couleurs", ["Rouge", "Vert", "Jaune", "Orange"], []),
   ("Fruits", ["Pomme", "Poire", "Prune", "Fraise"], ["Orange"]),
   ("Métiers", ["Boulanger", "Facteur", "Pompier", "Plombier"], []),
   ("Mers", ["Baltique", "Caspienne", "Égée", "Adriatique"], [])]),
 ("Mur 7", [("Chanteurs français", ["Piaf", "Aznavour", "Brassens", "Gainsbourg"], []),
   ("Monuments de Paris", ["Louvre", "Panthéon", "Sacré-Cœur", "Invalides"], []),
   ("___ de mer", ["Mal", "Loup", "Étoile", "Fruits"], []),
   ("Fleurs", ["Rose", "Tulipe", "Lilas", "Muguet"], [])]),
 ("Mur 8", [("Régions", ["Bretagne", "Normandie", "Alsace", "Provence"], []),
   ("Pains", ["Ficelle", "Brioche", "Fougasse", "Baguette"], []),
   ("Vêtements", ["Veste", "Jupe", "Écharpe", "Gilet"], []),
   ("Magie", ["Balai", "Chaudron", "Grimoire", "Potion"], ["Baguette"])]),
]
for name, gs in WALLS:
    tiles = [t for g in gs for t in g[1]]
    assert len(tiles) == 16 and len(set(tiles)) == 16, (name, tiles)
    cands = [set(g[1]) | set(g[2]) for g in gs]
    sols = []
    def rec(i, used, pick):
        if i == 4: sols.append(pick); return
        for c in combinations(sorted(cands[i] - used), 4): rec(i + 1, used | set(c), pick + [c])
    rec(0, set(), [])
    assert len(sols) == 1, (name, len(sols))
walls_out = [{"name": n, "groups": [{"name": g[0], "tiles": g[1]} for g in gs]} for n, gs in WALLS]

# ---------------------------------------------------------------- Sussed (five letters, and six on Hard)
FIVE = """arbre plage fleur pomme livre table neige monde porte froid verre lampe sucre poire herbe nuage ville route train avion
musee ecole heure danse pluie vache lapin tigre zebre singe aigle sable perle fusee stylo carte photo radio piano fruit melon
tarte crepe poule bijou plume ombre tasse sauce olive epice image conte roman titre objet outil jaune rouge blanc calme douce
riche chaud mardi jeudi hiver ocean foret lune""".split()
SIX = """jardin soleil cheval gateau salade mouton etoile fleuve lettre phrase fraise raisin citron cerise banane orange maison
bateau oiseau chemin rideau cadeau voyage nature saison violet bonbon tomate poivre valise papier crayon cahier bureau classe
miroir bougie montre carton """.split()
FIVE = [w for w in FIVE if len(w) == 5]
for w in FIVE + SIX: assert w in DICT, w
rnd = random.Random(20261103)
rnd.shuffle(FIVE); rnd.shuffle(SIX)
GUESS5 = sorted(w for w in DICT if len(w) == 5)
GUESS6 = sorted(w for w in DICT if len(w) == 6)

# ---------------------------------------------------------------- Letter Wheel
# Answers: familiar words (in the 12,000 most used), 4+ letters, no S (so no plurals), at most 7 different letters.
# Bonus words: any other dictionary word that fits. Each puzzle is the centre letter first, then the 7 letters.
wf = lambda w: len(w) >= 4 and "s" not in w and len(set(w)) <= 7
TOP = [w for w in freq[:12000] if wf(w)]
BONUS_POOL = [w for w in DICT if wf(w) and len(w) <= 10]
pangrams = [w for w in freq[:6000] if "s" not in w and len(set(w)) == 7]
wheel, used_sets = [], set()
rnd = random.Random(20261103)
rnd.shuffle(pangrams)
for p in pangrams:
    letters = "".join(sorted(set(p)))
    if letters in used_sets: continue
    fits = lambda w, c: c in w and set(w) <= set(letters)
    opts = [c for c in letters if 16 <= len([w for w in TOP if fits(w, c)]) <= 40]
    if not opts: continue
    c = rnd.choice(opts); used_sets.add(letters)
    ans = sorted(w for w in TOP if fits(w, c))
    bonus = sorted(w for w in BONUS_POOL if fits(w, c) and w not in set(ans))
    wheel.append({"p": c + letters, "w": ans, "b": bonus})
    if len(wheel) >= 21: break

# ---------------------------------------------------------------- Word Steps
STEP_LEN = (4, 5)
COMMON = {w for w in freq[:15000] if len(w) in STEP_LEN}
ACCEPT = {w for w in DICT if len(w) in STEP_LEN} | COMMON
def graph(ws):
    b = {}
    for w in ws:
        for i in range(len(w)): b.setdefault(w[:i] + "_" + w[i + 1:], []).append(w)
    return lambda w: [n for i in range(len(w)) for n in b.get(w[:i] + "_" + w[i + 1:], []) if n != w]
def bfs(nb, a):
    d, q = {a: 0}, [a]
    for x in q:
        for n in nb(x):
            if n not in d: d[n] = d[x] + 1; q.append(n)
    return d
nb_all, nb_common = graph(ACCEPT), graph(COMMON)
def step(a, b, diff):
    m, mc = bfs(nb_all, a).get(b), bfs(nb_common, a).get(b)
    assert m is not None and m == mc, (a, b, m, mc)  # the shortest route must work with familiar words, so hints can follow it
    return {"start": a, "target": b, "min": m, "difficulty": diff}
STEPS = [step(a, b, d) for a, b, d in [
  ("chat", "loup", "Easy"), ("jour", "soir", "Easy"), ("sauce", "soupe", "Easy"), ("bois", "four", "Easy"),
  ("robe", "jupe", "Medium"), ("gris", "noir", "Medium"), ("chat", "doux", "Medium"), ("pomme", "rouge", "Medium"),
  ("chat", "vite", "Hard"), ("lion", "vert", "Hard"), ("neige", "soupe", "Hard"), ("long", "noir", "Hard")]]
STEPS_DAY = [step(a, b, d) for trio in [
  [("pain", "soir"), ("dent", "noir"), ("chat", "haut")], [("page", "rose"), ("main", "tour"), ("loup", "miel")],
  [("dent", "port"), ("four", "pont"), ("dent", "lion")], [("gare", "taxi"), ("jupe", "vent"), ("gros", "vent")],
  [("mots", "note"), ("lait", "note"), ("jour", "lion")], [("lame", "rose"), ("film", "rose"), ("prune", "tasse")],
  [("haut", "vert"), ("noix", "vert"), ("chat", "jupe")]] for (a, b), d in zip(trio, ("Easy", "Medium", "Hard"))]

# ---------------------------------------------------------------- Letter Lock
# (phrase, clue, difficulty). Traditional proverbs, and original sentences.
LOCKS = [
 ("Petit à petit, l'oiseau fait son nid, brindille après brindille.", "Avec patience", "Easy"),
 ("Après la pluie vient le beau temps, alors gardez le sourire.", "Rester optimiste", "Easy"),
 ("L'habit ne fait pas le moine, mais il aide un peu.", "Les apparences", "Easy"),
 ("Il ne faut pas vendre la peau de l'ours avant de l'avoir attrapé.", "Trop tôt", "Easy"),
 ("Le chat dort au soleil pendant que la pluie tombe sur le jardin.", "Un après-midi tranquille", "Medium"),
 ("Mieux vaut tard que jamais, surtout pour un bon café.", "En retard", "Medium"),
 ("Chaque matin, le boulanger prépare des croissants tout chauds.", "À la boulangerie", "Medium"),
 ("La nuit porte conseil, alors dormez bien avant de décider.", "Réfléchir", "Medium"),
 ("Le zèbre et la girafe boivent ensemble au bord du fleuve.", "Safari", "Hard"),
 ("Un vieux marin raconte ses voyages jusqu'au bout du monde.", "Histoires de mer", "Hard"),
 ("Quatre jongleurs lancent des quilles bleues sous le chapiteau.", "Au cirque", "Hard"),
 ("Le kayak glisse doucement entre les rochers de la falaise.", "Sport en plein air", "Hard"),
]
LOCK_DAYS = [
 [("Qui va à la chasse perd sa place, dit le vieux proverbe.", "Partir trop longtemps"),
  ("Le facteur sifflote en montant la colline avec ses lettres.", "La tournée du matin"),
  ("Six hiboux veillent en silence dans la forêt endormie.", "La nuit dans les bois")],
 [("Les bons comptes font les bons amis, comme on dit souvent.", "L'argent et l'amitié"),
  ("Ma grand-mère prépare une tarte aux pommes chaque dimanche.", "Dessert de famille"),
  ("Le pingouin maladroit glisse sur la banquise gelée.", "Grand froid")],
 [("L'appétit vient en mangeant, surtout devant un bon gâteau.", "À table"),
  ("Le petit train traverse la campagne sous un ciel bleu.", "Voyage tranquille"),
  ("Un xylophone joyeux accompagne la fanfare du village.", "Musique de fête")],
 [("Il pleut des cordes ce matin, alors prenez votre parapluie.", "Mauvais temps"),
  ("Les enfants construisent un château de sable au bord de la mer.", "À la plage"),
  ("Le jockey murmure quelques mots à son cheval avant la course.", "Aux courses")],
 [("Rien ne sert de courir, il faut partir à point.", "La tortue et le lièvre"),
  ("Le jardinier arrose ses tomates avant la chaleur de midi.", "Au potager"),
  ("Une baleine majestueuse plonge près du phare breton.", "Au large")],
 [("Loin des yeux, loin du cœur, mais jamais vraiment oublié.", "La distance"),
  ("Nous avons pique-niqué près du lac avec toute la famille.", "Sortie du week-end"),
  ("Le cuisinier flambe les crêpes devant des clients ébahis.", "Spectacle au restaurant")],
 [("Quand le chat n'est pas là, les souris dansent toute la nuit.", "Sans surveillance"),
  ("La bibliothèque du quartier ouvre ses portes le samedi matin.", "Des livres pour tous"),
  ("Le funambule avance lentement au-dessus de la place bondée.", "L'équilibre")],
]
REVEAL = {"Easy": 3, "Medium": 2, "Hard": 1}
rnd = random.Random(20261103)
def lock(id_, shown, clue, diff):
    text = norm(shown)
    letters = [c for c in text.upper() if c in string.ascii_uppercase]
    assert 30 <= len(letters) <= 90, (shown, len(letters))
    assert all(c in string.ascii_letters + " ',.!?-" for c in text), (shown, set(text))
    nums = list(range(1, 27)); rnd.shuffle(nums)
    while any(nums[k] == k + 1 for k in range(26)): rnd.shuffle(nums)
    key = dict(zip(string.ascii_uppercase, nums))
    fq = sorted(set(letters), key=lambda c: (-letters.count(c), c))
    n = REVEAL[diff]
    start = fq[:n] if diff == "Easy" else fq[len(fq) // 3: len(fq) // 3 + n]
    return {"id": id_, "text": text, "show": shown, "clue": clue, "difficulty": diff,
            "key": "".join(chr(64 + key[c]) for c in string.ascii_uppercase), "reveal": "".join(start), "v": 1}
locks_out = [lock(f"fr-lock-{i+1:03d}", *p) for i, p in enumerate(LOCKS)]
locks_day = [lock(f"fr-daily-{d+1:03d}-{diff[0].lower()}", t, c, diff) for d, trio in enumerate(LOCK_DAYS)
             for (t, c), diff in zip(trio, ("Easy", "Medium", "Hard"))]

# ---------------------------------------------------------------- write fr.js
J = lambda x: json.dumps(x, ensure_ascii=False, separators=(",", ":"))
js = f"""/* French content (lang "fr"). Built by tools/build_fr.py from an-array-of-french-words (MIT licence) and
   FrequencyWords (CC BY-SA 4.0). Do not edit by hand. Words are written without accents (été is ETE). */
const WALLS_FR = {json.dumps(walls_out, ensure_ascii=False, indent=0)};
const FIVE_ANSWERS_FR = "{' '.join(FIVE)}".split(" ");
const FIVE_GUESSES_FR = new Set("{' '.join(GUESS5)}".split(" "));
const SIX_ANSWERS_FR = "{' '.join(SIX)}".split(" ");
const SIX_GUESSES_FR = new Set("{' '.join(GUESS6)}".split(" "));
// Letter Wheel: p = centre letter then the 7 letters, w = the answers, b = bonus words.
const WHEEL_FR = {J([{"p": x["p"], "w": " ".join(x["w"]), "b": " ".join(x["b"])} for x in wheel])};
const STEPS_COMMON_FR = "{' '.join(sorted(COMMON))}".split(" ");
const STEPS_EXTRA_FR = "{' '.join(sorted(ACCEPT - COMMON))}".split(" ");
const STEPS_LEVELS_FR = {J(STEPS)};
const STEPS_DAILY_FR = {J(STEPS_DAY)};
const LOCK_LEVELS_FR = {json.dumps(locks_out, ensure_ascii=False, indent=0)};
const LOCK_DAILY_FR = {json.dumps(locks_day, ensure_ascii=False, indent=0)};
"""
open(os.path.join(HERE, "..", "fr.js"), "w", encoding="utf-8").write(js)
print("walls", len(walls_out), "five", len(FIVE), "six", len(SIX), "guesses", len(GUESS5), len(GUESS6), "wheel", len(wheel),
      "steps", len(STEPS), len(STEPS_DAY), "steps words", len(COMMON), len(ACCEPT), "locks", len(locks_out), len(locks_day), "bytes", len(js.encode()))
for x in wheel[:4]: print(x["p"], len(x["w"]), " ".join(x["w"]), "| bonus", len(x["b"]))
for s in STEPS + STEPS_DAY: print(s["start"], s["target"], s["min"], s["difficulty"])
