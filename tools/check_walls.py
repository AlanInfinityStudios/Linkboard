"""Checks that every wall in puzzles.js has exactly one correct solution.

The WALLS list below mirrors puzzles.js, plus "herrings": other clues on the same
wall that could also fit that category. Add a new wall here with its herrings,
then run:  python3 tools/check_walls.py
Anything other than "solutions: 1" means the wall is ambiguous.
"""
# Each wall: list of (name, tiles, herrings) where herrings are other tiles on the wall that also fit the category.
WALLS = [
 ("Wall 1", [("Oranges",["Seville","Navel","Jaffa","Blood"],[]),
   ("___ moon",["Harvest","New","Honey","Blue"],["Blood"]),
   ("Shades of blue",["Navy","Cobalt","Cyan","Azure"],["Blue"]),
   ("___ bee",["Queen","Busy","Spelling","Bumble"],["Honey"])]),
 ("Wall 2", [("TV detectives",["Morse","Poirot","Marple","Rebus"],["Frost"]),
   ("Jack ___",["Frost","Sprat","Daw","Pot"],[]),
   ("Snooker terms",["Cushion","Baulk","Plant","Kiss"],["Pot"]),
   ("Puzzles",["Sudoku","Crossword","Jigsaw","Wordsearch"],["Rebus"])]),
 ("Wall 3", [("Names for grandma",["Nan","Nana","Gran","Granny"],[]),
   ("Knots",["Bowline","Sheepshank","Reef","Hitch"],["Granny"]),
   ("Apple varieties",["Braeburn","Gala","Cox","Jazz"],["Fuji"]),
   ("Volcanoes",["Etna","Vesuvius","Krakatoa","Fuji"],[])]),
 ("Wall 4", [("Famous Davids",["Beckham","Attenborough","Bowie","Tennant"],[]),
   ("Doctor Who actors",["Smith","Capaldi","Baker","Whittaker"],["Tennant"]),
   ("Surnames from old jobs",["Fletcher","Cooper","Taylor","Thatcher"],["Smith","Baker"]),
   ("Prime ministers",["Major","Blair","Brown","May"],["Thatcher"])]),
 ("Wall 5", [("___fly",["Butter","Fire","House","Horse"],["Dragon"]),
   ("Welsh symbols",["Dragon","Daffodil","Leek","Lovespoon"],[]),
   ("Lake District lakes",["Windermere","Coniston","Ullswater","Grasmere"],[]),
   ("Beatrix Potter characters",["Peter","Jemima","Tiggy-Winkle","Nutkin"],[])]),
 ("Wall 6", [("Jewellery materials",["Amber","Coral","Pearl","Jet"],[]),
   ("Shades of pink",["Salmon","Fuchsia","Rose","Blush"],["Coral"]),
   ("Freshwater fish",["Pike","Perch","Carp","Roach"],["Salmon"]),
   ("Aircraft",["Glider","Drone","Blimp","Biplane"],["Jet"])]),
 ("Wall 7", [("Bond actors",["Connery","Dalton","Brosnan","Lazenby"],["Moore","Craig"]),
   ("Famous Daniels",["Radcliffe","Kaluuya","Day-Lewis","Craig"],[]),
   ("Famous Patricks",["Swayze","Moore","Kielty","Vieira"],["Stewart"]),
   ("Famous Rods",["Laver","Hull","Steiger","Stewart"],[])]),
 ("Wall 8", [("Knitwear patterns",["Arran","Fair Isle","Cable","Argyle"],[]),
   ("Scottish islands",["Skye","Mull","Islay","Iona"],["Arran"]),
   ("Think deeply",["Muse","Ponder","Brood","Reflect"],["Mull"]),
   ("Parts of a church",["Nave","Aisle","Transept","Crypt"],[])]),
 ("Wall 9", [("London ___gates",["Southgate","Highgate","Moorgate","Aldgate"],[]),
   ("Famous Glenns",["Close","Miller","McGrath","Hoddle"],[]),
   ("Famous Bobbys",["Moore","Charlton","Davro","Robson"],[]),
   ("England managers",["Capello","Venables","Ramsey","Eriksson"],["Southgate","Hoddle","Robson"])]),
 ("Wall 10", [("Pastry",["Filo","Choux","Shortcrust","Suet"],["Puff"]),
   ("Famous dragons",["Smaug","Toothless","Norbert","Puff"],[]),
   ("Bread rolls",["Bun","Bap","Cob","Barm"],[]),
   ("Hairstyles",["Bob","Mullet","Quiff","Beehive"],["Bun"])]),
 ("Wall 11", [("Famous Freds",["Astaire","Flintstone","Dibnah","Perry"],[]),
   ("British tennis players",["Murray","Henman","Raducanu","Wade"],["Perry"]),
   ("Racecourses",["Aintree","Ascot","Goodwood","Cheltenham"],["Epsom"]),
   ("___ salt",["Epsom","Rock","Sea","Table"],[])]),
 ("Wall 12", [("Ford cars",["Fiesta","Focus","Mondeo","Capri"],["Puma"]),
   ("Wild cats",["Puma","Lynx","Ocelot","Cheetah"],["Jaguar"]),
   ("Car makers",["Lotus","Mini","Bentley","Jaguar"],[]),
   ("Yoga poses",["Cobra","Tree","Warrior","Bridge"],["Lotus"])]),
 ("Wall 13", [("Fawlty Towers characters",["Sybil","Manuel","Polly","Basil"],[]),
   ("Herbs",["Sage","Thyme","Mint","Dill"],["Basil"]),
   ("Mojito ingredients",["Rum","Soda","Sugar","Lime"],["Mint"]),
   ("Shades of green",["Olive","Emerald","Jade","Bottle"],["Lime","Sage","Mint"])]),
]
from itertools import combinations
for name, gs in WALLS:
    tiles=[t for g in gs for t in g[1]]
    assert len(tiles)==16 and len(set(tiles))==16, (name, tiles)
    for g in gs:
        for h in g[2]: assert h in tiles, (name,h)
    cands=[set(g[1])|set(g[2]) for g in gs]
    sols=[]
    def rec(i, used, pick):
        if i==4: sols.append(pick); return
        for c in combinations(sorted(cands[i]-used),4): rec(i+1, used|set(c), pick+[c])
    rec(0,set(),[])
    print(name, "solutions:", len(sols))
