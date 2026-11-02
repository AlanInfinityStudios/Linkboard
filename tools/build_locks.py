"""Builds locks.js for Letter Lock. Each phrase gets a fixed, shuffled number key (never A=1, B=2),
so a level always shows the same code. Run: python3 tools/build_locks.py
Phrases are original, or traditional sayings in the public domain (marked "traditional")."""
import json, random, re, string
P = [
 # (phrase, clue, difficulty, source)
 ("Every cloud has a silver lining, even on a grey day.", "Looking on the bright side", "Easy", "traditional"),
 ("The early bird catches the worm, but the second mouse gets the cheese.", "Getting up first pays off", "Easy", "traditional"),
 ("Too many cooks spoil the broth, so wait outside the kitchen.", "Kitchen trouble", "Easy", "traditional"),
 ("Actions speak louder than words, so roll up your sleeves.", "Doing, not saying", "Easy", "traditional"),
 ("There is no place like home, sweet home.", "Where the heart is", "Easy", "traditional"),
 ("An apple a day keeps the doctor away, or so they say.", "Fruit and good health", "Easy", "traditional"),
 ("Practice makes perfect, so keep on trying.", "Getting better at something", "Easy", "original"),
 ("Do not count your chickens before they hatch.", "Farmyard advice", "Easy", "traditional"),
 ("Always look before you leap into the pond.", "Think first", "Easy", "original"),
 ("A watched pot never boils, so go and read a book.", "Waiting in the kitchen", "Easy", "original"),
 ("Many hands make light work in the garden.", "Sharing the jobs", "Easy", "original"),
 ("Better late than never, as my granny always says.", "Arriving after time", "Easy", "original"),
 ("A cup of tea fixes almost everything on a rainy afternoon.", "A hot drink", "Medium", "original"),
 ("The cat sat on the warm windowsill and watched the birds.", "A pet at home", "Medium", "original"),
 ("Fresh bread on a Sunday morning makes the whole house smell lovely.", "Baking", "Medium", "original"),
 ("Ducks on the pond were quacking loudly at the passing dog.", "In the park", "Medium", "original"),
 ("Pack your umbrella, because the forecast says heavy showers.", "Weather", "Medium", "original"),
 ("Our neighbour grows enormous pumpkins every autumn.", "Gardening", "Medium", "original"),
 ("The train was late again, so we shared a bag of crisps.", "A journey", "Medium", "original"),
 ("Penguins cannot fly, but they are brilliant swimmers.", "Birds", "Medium", "original"),
 ("A good book and a comfy chair make the perfect evening.", "A night in", "Medium", "original"),
 ("The seaside is best when the chips are hot and the sun is out.", "Holidays", "Medium", "original"),
 ("Owls hunt at night and sleep through most of the day.", "Birds", "Medium", "original"),
 ("Never trust a seagull near your ice cream cone.", "At the seaside", "Medium", "original"),
 ("The kettle is on, so pull up a chair and tell me everything.", "A chat", "Medium", "original"),
 ("Snails carry their homes with them wherever they wander.", "Garden creatures", "Medium", "original"),
 ("Thunder rumbled across the valley as the sheep huddled together.", "Weather on the farm", "Hard", "original"),
 ("Grandad keeps a jar of buttons that nobody is allowed to touch.", "Family", "Hard", "original"),
 ("A hedgehog wandered through the garden looking for juicy beetles.", "Garden creatures", "Hard", "original"),
 ("The quickest way to find a lost sock is to buy a new pair.", "Laundry", "Hard", "original"),
 ("Octopuses have three hearts and blue blood.", "Sea creatures", "Hard", "original"),
 ("Jigsaw puzzles always seem to have one piece missing.", "Games", "Hard", "original"),
 ("Lightning is hotter than the surface of the sun.", "Weather facts", "Hard", "original"),
 ("The library smelled of old paper, polish and quiet adventures.", "Books", "Hard", "original"),
 ("Bananas are berries, but strawberries are not, oddly enough.", "Fruit facts", "Hard", "original"),
 ("Every snowflake has six sides, yet no two look exactly alike.", "Winter", "Hard", "original"),
 ("My sat nav sent us down a muddy farm track for twenty minutes.", "Getting lost", "Hard", "original"),
 ("Sleepy kittens curl up in the sunniest spot they can find.", "Pets", "Hard", "original"),
 ("Wet dogs always shake themselves dry right next to you.", "Pets", "Hard", "original"),
 ("Bumblebees hum lazily between the lavender and the foxgloves.", "Summer garden", "Hard", "original"),
 ("Zebras rarely queue patiently, which explains a great deal about zoos.", "Animals, with a joke", "Expert", "original"),
 ("Quiet foxes jumped lazily over the sleeping, grumpy wolfhound.", "Animals at night", "Expert", "original"),
 ("Fog crept over the quayside while fishermen mended their nets.", "A harbour", "Expert", "original"),
 ("A jazz quartet played wonky rhythms beneath the flickering lights.", "Music", "Expert", "original"),
 ("Puffins nest in burrows on windswept cliffs above the Atlantic.", "Seabirds", "Expert", "original"),
 ("Knitting a scarf takes patience, wool and a forgiving cat.", "A hobby", "Expert", "original"),
 ("Whisking egg whites by hand builds surprisingly strong forearms.", "Baking", "Expert", "original"),
 ("Glow worms twinkle in damp caves like tiny emerald lanterns.", "Underground", "Expert", "original"),
 ("The vicar's bicycle squeaked loudly on every bumpy cobbled lane.", "A village", "Expert", "original"),
 ("Hiking boots, waterproofs and flapjacks: the essentials of a long walk.", "Walking", "Expert", "original"),
]
REVEAL = {"Easy": 3, "Medium": 2, "Hard": 1, "Expert": 1}
rnd = random.Random(20261102)
out = []
for i, (text, clue, diff, src) in enumerate(P):
    letters = [c for c in text.upper() if c in string.ascii_uppercase]
    assert 30 <= len(letters) <= 90, (text, len(letters))
    nums = list(range(1, 27)); rnd.shuffle(nums)
    while any(nums[k] == k + 1 for k in range(26)):  # never a letter's own alphabet position
        rnd.shuffle(nums)
    key = dict(zip(string.ascii_uppercase, nums))
    assert len(set(key.values())) == 26
    freq = sorted(set(letters), key=lambda c: (-letters.count(c), c))
    n = REVEAL[diff]
    # Easy: the most common letters. Harder levels: a middling letter, so it helps less.
    start = freq[:n] if diff == "Easy" else freq[len(freq) // 3: len(freq) // 3 + n]
    out.append({"id": f"lock-{i+1:03d}", "text": text, "clue": clue, "difficulty": diff, "source": src,
                "key": "".join(chr(64 + key[c]) for c in string.ascii_uppercase), "reveal": "".join(start), "v": 1})
js = "/* Letter Lock levels. Built by tools/build_locks.py. key: the number for each letter A to Z, written as a letter (A=1 ... Z=26).\n   reveal: letters shown from the start. Phrases are original, or traditional sayings. */\nconst LOCK_LEVELS = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n"
open("locks.js", "w").write(js)
print(len(out), "levels;", min(len([c for c in p[0] if c.isalpha()]) for p in P), "to", max(len([c for c in p[0] if c.isalpha()]) for p in P), "letters")
