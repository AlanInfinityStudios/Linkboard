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

# Daily challenge phrases: one Easy, one Medium and one Hard a day, in order. Kept apart from the levels above,
# and built after them, so the level keys never change. Add more to the end of each list to lengthen the cycle.
D_EASY = [
 ("A good friend is like a warm coat on a cold day.", "Someone you can count on", "original"),
 ("The sun came out and the whole street went outside.", "A nice day", "original"),
 ("Bake the cake, then lick the spoon when nobody looks.", "Kitchen treat", "original"),
 ("Slow and steady wins the race, said the tortoise.", "A famous fable", "traditional"),
 ("Fish and chips by the sea taste better than anywhere.", "Seaside supper", "original"),
 ("Every dog has its day, and today belongs to my dog.", "A pet's big moment", "traditional"),
 ("The best things in life are free, like a good laugh.", "Not about money", "traditional"),
 ("Put the kettle on and tell me all about your day.", "A chat over a drink", "original"),
 ("Rome was not built in a day, and neither was my shed.", "Big jobs take time", "traditional"),
 ("Home is where the heart is, and where the biscuits are.", "Where you live", "traditional"),
 ("If at first you do not succeed, try and try again.", "Keep going", "traditional"),
 ("Two heads are better than one when doing a crossword.", "Teamwork", "traditional"),
 ("Laughter is the best medicine, so tell me a joke.", "Feeling better", "traditional"),
 ("The grass is always greener on the other side.", "Wanting what others have", "traditional"),
 ("Where there is a will, there is always a way.", "Determination", "traditional"),
 ("A picture is worth a thousand words, or so they say.", "Images", "traditional"),
 ("Time flies when you are having fun at the fair.", "A good day out", "traditional"),
 ("Do not put all of your eggs in one basket.", "Spread the risk", "traditional"),
 ("The children built a sandcastle with a moat around it.", "Beach day", "original"),
 ("Bring an umbrella, because the clouds look rather grey.", "Weather warning", "original"),
 ("Old friends are the best friends, and new ones are fun too.", "Friendship", "original"),
 ("Grandad grows the biggest tomatoes on the whole street.", "Gardening", "original"),
 ("The library is quiet, warm and full of good stories.", "Books", "original"),
 ("We took the dog for a long walk across the fields.", "A stroll", "original"),
 ("Pancakes with lemon and sugar are the best on a Tuesday.", "A special day for food", "original"),
 ("All good things must come to an end, even holidays.", "Endings", "traditional"),
 ("A rolling stone gathers no moss, so keep on moving.", "Staying busy", "traditional"),
 ("Look on the bright side and the day will feel better.", "Being cheerful", "original"),
 ("The train was late again, so we shared a bag of sweets.", "A journey", "original"),
 ("Strike while the iron is hot and the chance is there.", "Act quickly", "traditional"),
]
D_MEDIUM = [
 ("The postman whistled a cheerful tune as he walked up the hill.", "Morning delivery", "original"),
 ("Snow fell all night, and by morning the whole village was white.", "Winter", "original"),
 ("My sister always finds the last chocolate hidden in the tin.", "A sweet search", "original"),
 ("The owl hooted twice from the oak tree at the end of the lane.", "A night bird", "original"),
 ("Our team scored in the final minute and the crowd went wild.", "A football match", "original"),
 ("A robin perched on the spade while I dug the vegetable patch.", "Garden visitor", "original"),
 ("We packed sandwiches, a flask of tea and a tartan blanket.", "A picnic", "original"),
 ("The lighthouse keeper polished the great lamp every evening.", "By the sea", "original"),
 ("Thunder rumbled over the hills, and the sheep huddled together.", "A storm", "original"),
 ("The baker opens his shop at six with warm loaves on the shelf.", "Early start", "original"),
 ("Fireworks burst over the river and lit up every face below.", "A celebration", "original"),
 ("The museum has a dinosaur skeleton taller than a double decker.", "A day out", "original"),
 ("Grandma knitted a scarf so long that it reached the floor.", "Wool", "original"),
 ("The ferry rocked gently as gulls circled above the harbour.", "A crossing", "original"),
 ("Autumn leaves crunched under our wellies on the woodland path.", "A season", "original"),
 ("He practised the piano every evening until the tune was perfect.", "Music", "original"),
 ("The garden centre cafe sells the best scones in the county.", "A treat", "original"),
 ("A hedgehog shuffled across the lawn looking for slugs to eat.", "Night visitor", "original"),
 ("The quiz team knew every answer except the one about rivers.", "Pub night", "original"),
 ("We watched the swans glide past the boathouse at sunset.", "On the river", "original"),
 ("The school play ended with a song, and everyone stood to clap.", "On stage", "original"),
 ("Our caravan holiday was wet, windy and absolutely wonderful.", "Holiday", "original"),
 ("She planted tulips in October and waited patiently for spring.", "Bulbs", "original"),
 ("The village fete had a tombola, a cake stall and a dog show.", "Summer event", "original"),
 ("Steam rose from the old train as it pulled into the station.", "A railway", "original"),
 ("The kitten chased a ball of string under the kitchen table.", "Playtime", "original"),
 ("A rainbow appeared over the valley just after the shower.", "Colours in the sky", "original"),
 ("The allotment gave us more courgettes than we could eat.", "Too much veg", "original"),
 ("Every Sunday we walk to the bakery for warm croissants.", "Weekend habit", "original"),
 ("The tide went out and left little pools full of tiny crabs.", "Rock pools", "original"),
]
D_HARD = [
 ("Zebras, giraffes and wildebeest gathered quietly by the waterhole.", "Safari", "original"),
 ("The jazz quartet played until midnight in the smoky cellar bar.", "Live music", "original"),
 ("Quickly fetch the bucket, the boat is taking on water again.", "Trouble afloat", "original"),
 ("Juggling flaming torches requires very steady hands and nerves.", "Circus skill", "original"),
 ("The wizard waved his crooked staff and the jars began to glow.", "Magic", "original"),
 ("A frosty morning, a crackling fire and a big mug of cocoa.", "Cosy winter", "original"),
 ("Kayaking through the gorge was exhausting, but quite exhilarating.", "On the water", "original"),
 ("The squirrel buried acorns everywhere and forgot nearly all of them.", "Busy animal", "original"),
 ("Bumblebees zigzagged lazily between the foxgloves and the lavender.", "Summer garden", "original"),
 ("My nephew's homework volcano exploded all over the kitchen ceiling.", "Science project", "original"),
 ("The explorer packed a compass, a jackknife and a waxed jacket.", "Adventure kit", "original"),
 ("Puffins nest in burrows on rocky islands far out in the sea.", "Seabirds", "original"),
 ("A gust of wind whisked my hat away across the frozen boating lake.", "Blustery day", "original"),
 ("The knight's squire polished his armour by flickering candlelight.", "Medieval", "original"),
 ("Hazelnut, toffee and vanilla: the three best flavours of ice cream.", "A cool dessert", "original"),
 ("The clockmaker fixed every cuckoo clock in the shop by Friday.", "A craft", "original"),
 ("Wobbly jelly and squashed sandwiches: a proper birthday picnic.", "A party", "original"),
 ("The orchestra tuned up while the conductor tapped his baton.", "Concert", "original"),
 ("Jackdaws squabbled noisily on the chimney pots above the square.", "Town birds", "original"),
 ("The submarine dived deep beneath the waves without a sound.", "Under the sea", "original"),
 ("Grizzly bears wade into icy rivers to catch leaping salmon.", "Wildlife", "original"),
 ("A mysterious parcel, wrapped in brown paper, arrived on Tuesday.", "A delivery", "original"),
 ("The blacksmith hammered the glowing horseshoe into shape.", "Old trade", "original"),
 ("Fizzy lemonade, crispy chips and a gentle breeze off the bay.", "Seaside lunch", "original"),
 ("The judge awarded first prize to an enormous knobbly marrow.", "Village show", "original"),
 ("Twelve exhausted cyclists queued for coffee at the hilltop cafe.", "A long ride", "original"),
 ("Velvet curtains swept open and the magician vanished in a puff.", "A show", "original"),
 ("The goalkeeper leapt sideways and tipped the volley over the bar.", "A save", "original"),
 ("Fog crept across the marshes, hiding the ruined abbey from view.", "Spooky scene", "original"),
 ("Wax crayons, glitter glue and paper plates: a rainy day craft box.", "Indoor fun", "original"),
]
REVEAL = {"Easy": 3, "Medium": 2, "Hard": 1, "Expert": 1}
rnd = random.Random(20261102)
out = []
def make(id_, text, clue, diff, src):
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
    return {"id": id_, "text": text, "clue": clue, "difficulty": diff, "source": src,
            "key": "".join(chr(64 + key[c]) for c in string.ascii_uppercase), "reveal": "".join(start), "v": 1}
for i, (text, clue, diff, src) in enumerate(P):
    out.append(make(f"lock-{i+1:03d}", text, clue, diff, src))
daily = []
for day, trio in enumerate(zip(D_EASY, D_MEDIUM, D_HARD)):
    for diff, (text, clue, src) in zip(("Easy", "Medium", "Hard"), trio):
        daily.append(make(f"daily-{day+1:03d}-{diff[0].lower()}", text, clue, diff, src))
js = "/* Letter Lock levels. Built by tools/build_locks.py. key: the number for each letter A to Z, written as a letter (A=1 ... Z=26).\n   reveal: letters shown from the start. Phrases are original, or traditional sayings. */\nconst LOCK_LEVELS = " + json.dumps(out, ensure_ascii=False, indent=0) + ";\n// Daily challenge: three puzzles a day (Easy, Medium, Hard), cycling through this list.\nconst LOCK_DAILY = " + json.dumps(daily, ensure_ascii=False, indent=0) + ";\n"
open("locks.js", "w").write(js)
print(len(out), "levels;", min(len([c for c in p[0] if c.isalpha()]) for p in P), "to", max(len([c for c in p[0] if c.isalpha()]) for p in P), "letters")
