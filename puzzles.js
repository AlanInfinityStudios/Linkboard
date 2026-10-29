/* =====================================================================
   LINKBOARD PUZZLES. Add your own here.

   BOARD LEVELS
   Every group has a name and exactly 5 tiles. A tile is either:
     - a word, e.g. "Milk"
     - a smaller group, written { name, pic, tiles: [...] }. When the player
       finds it, its five tiles shrink into one picture tile (pic), and that
       picture becomes one of the five tiles of the group above it.
   The groups at the top level never shrink. When found, they stay on the
   board as a full-colour row. Keep it to 5 top-level groups or fewer so
   there is still room to play.
   Set time (in seconds) for a countdown, or time: null for relaxed play.

   WALLS
   Exactly 4 groups of 4. Good walls have red herrings: clues that seem to
   fit more than one group, but only one way works. Add new walls to
   tools/check_walls.py as well to prove there is only one solution.
   ===================================================================== */
const sub = (name, pic, tiles) => ({ name, pic, tiles });

const BOARD_LEVELS = [
  { name: "Down on the farm", difficulty: "Easy", time: null, groups: [
    { name: "On the farm", tiles: [
      sub("Cow", "🐄", ["Milk", "Dairy", "Udder", "Moo", "Calf"]),
      sub("Pig", "🐖", ["Trough", "Wallow", "Oink", "Piglet", "Bacon"]),
      sub("Sheep", "🐑", ["Wool", "Flock", "Lamb", "Shorn", "Baa"]),
      sub("Hen", "🐔", ["Egg", "Cluck", "Coop", "Chick", "Feathers"]),
      "Tractor",
    ]},
    { name: "Sports", tiles: [
      sub("Football", "⚽", ["Goal", "Penalty", "Offside", "Striker", "Referee"]),
      sub("Tennis", "🎾", ["Racket", "Deuce", "Love", "Wimbledon", "Serve"]),
      sub("Cricket", "🏏", ["Wicket", "Bowler", "Innings", "Stumps", "Umpire"]),
      sub("Golf", "⛳", ["Caddie", "Birdie", "Tee", "Fairway", "Bunker"]),
      "Rugby",
    ]},
  ]},
  { name: "Home and away", difficulty: "Easy", time: null, groups: [
    { name: "Around the house", tiles: [
      sub("Bathroom", "🛁", ["Towel", "Sink", "Shower", "Plunger", "Bath mat"]),
      sub("Bedroom", "🛏️", ["Pillow", "Duvet", "Wardrobe", "Alarm clock", "Slippers"]),
      sub("Kitchen", "🍳", ["Kettle", "Toaster", "Fridge", "Oven", "Whisk"]),
      sub("Garden", "🌳", ["Shed", "Lawn", "Hose", "Patio", "Wheelbarrow"]),
      "Loft",
    ]},
    { name: "Weather", tiles: [
      sub("Sun", "☀️", ["Sun cream", "Heatwave", "Tan", "Shades", "Sunburn"]),
      sub("Rain", "🌧️", ["Puddle", "Umbrella", "Drizzle", "Wellies", "Downpour"]),
      sub("Snow", "❄️", ["Sledge", "Snowball", "Blizzard", "Igloo", "Snowflake"]),
      sub("Wind", "🌬️", ["Gust", "Gale", "Breeze", "Kite", "Windmill"]),
      "Fog",
    ]},
  ]},
  { name: "Out and about", difficulty: "Medium", time: 14 * 60, groups: [
    { name: "Transport", tiles: [
      sub("Train", "🚂", ["Platform", "Ticket", "Carriage", "Signal", "Guard"]),
      sub("Plane", "✈️", ["Runway", "Cockpit", "Boarding pass", "Pilot", "Departures"]),
      sub("Bus", "🚌", ["Double decker", "Bus stop", "Fare", "Route", "Conductor"]),
      sub("Ferry", "⛴️", ["Port", "Deck", "Crossing", "Ramp", "Seasick"]),
      "Bicycle",
    ]},
    { name: "At the seaside", tiles: [
      sub("Beach", "🏖️", ["Sand", "Pebbles", "Deckchair", "Windbreak", "Lilo"]),
      sub("Ice cream", "🍦", ["Cone", "Ninety-nine", "Flake", "Sprinkles", "Wafer"]),
      sub("Rock pool", "🦀", ["Crab", "Starfish", "Limpet", "Seaweed", "Shrimp"]),
      sub("Pier", "🎡", ["Arcade", "Fairground", "Candyfloss", "Slot machine", "Big wheel"]),
      "Lighthouse",
    ]},
    { name: "Music", tiles: [
      sub("Guitar", "🎸", ["Strings", "Frets", "Plectrum", "Amp", "Capo"]),
      sub("Drums", "🥁", ["Snare", "Cymbal", "Sticks", "Hi-hat", "Kick"]),
      sub("Piano", "🎹", ["Keys", "Pedal", "Grand", "Upright", "Scales"]),
      sub("Violin", "🎻", ["Bow", "Chin rest", "Fiddle", "Rosin", "Orchestra"]),
      "Choir",
    ]},
  ]},
  { name: "Food and drink", difficulty: "Medium", time: null, groups: [
    { name: "Breakfast", tiles: [
      sub("Fry-up", "🍳", ["Bacon", "Sausage", "Beans", "Black pudding", "Hash brown"]),
      sub("Cereal", "🥣", ["Cornflakes", "Muesli", "Granola", "Bran", "Porridge"]),
      sub("Toast", "🍞", ["Butter", "Marmalade", "Toaster", "Crust", "Soldiers"]),
      sub("Tea", "☕", ["Teabag", "Kettle", "Teapot", "Biscuit", "Cuppa"]),
      "Orange juice",
    ]},
    { name: "Italian food", tiles: [
      sub("Pizza", "🍕", ["Margherita", "Pepperoni", "Dough", "Mozzarella", "Calzone"]),
      sub("Pasta", "🍝", ["Spaghetti", "Penne", "Lasagne", "Ravioli", "Fusilli"]),
      sub("Wine", "🍷", ["Chianti", "Prosecco", "Cork", "Vineyard", "Corkscrew"]),
      sub("Cheese", "🧀", ["Parmesan", "Gorgonzola", "Ricotta", "Mascarpone", "Pecorino"]),
      "Tiramisu",
    ]},
    { name: "Puddings", tiles: [
      sub("Cake", "🍰", ["Sponge", "Icing", "Candles", "Slice", "Bake Off"]),
      sub("Chocolate", "🍫", ["Cocoa", "Truffle", "Praline", "Dark", "Easter egg"]),
      sub("Strawberries", "🍓", ["Cream", "Punnet", "Pick your own", "Jam", "Summer"]),
      sub("Apple", "🍎", ["Crumble", "Pie", "Cox", "Core", "Orchard"]),
      "Trifle",
    ]},
  ]},
  { name: "Wordplay", difficulty: "Hard", time: 15 * 60, groups: [
    { name: "In the sky", tiles: [
      sub("Sun___", "☀️", ["Flower", "Day", "Burn", "Glasses", "Dial"]),
      sub("Moon___", "🌙", ["Beam", "Walk", "Shine", "Stone", "Lit"]),
      sub("Star___", "⭐", ["Fish", "Gazer", "Dust", "Struck", "Light"]),
      sub("Cloud___", "☁️", ["Burst", "Nine", "Cover", "Less", "Computing"]),
      "Kite",
    ]},
    { name: "Body parts", tiles: [
      sub("Hand___", "✋", ["Bag", "Shake", "Cuff", "Writing", "Book"]),
      sub("Foot___", "🦶", ["Ball", "Print", "Path", "Note", "Step"]),
      sub("Eye___", "👁️", ["Brow", "Lash", "Lid", "Sight", "Witness"]),
      sub("Ear___", "👂", ["Ring", "Wig", "Mark", "Drum", "Shot"]),
      "Knee",
    ]},
    { name: "Colours", tiles: [
      sub("Black___", "⚫", ["Board", "Bird", "Pool", "Smith", "Mail"]),
      sub("White___", "⚪", ["Wash", "Hall", "Water", "Collar", "Bait"]),
      sub("Green___", "🟢", ["House", "Grocer", "Finch", "Belt", "Wich"]),
      sub("Red___", "🔴", ["Head", "Wood", "Neck", "Brick", "Carpet"]),
      "Blue",
    ]},
  ]},
  { name: "Great British", difficulty: "Hard", time: 15 * 60, groups: [
    { name: "Christmas", tiles: [
      sub("Christmas tree", "🎄", ["Tinsel", "Baubles", "Fairy lights", "Pine needles", "Star"]),
      sub("Santa", "🎅", ["Sleigh", "Reindeer", "Chimney", "Grotto", "Ho ho ho"]),
      sub("Christmas dinner", "🦃", ["Turkey", "Sprouts", "Stuffing", "Gravy", "Pigs in blankets"]),
      sub("Presents", "🎁", ["Wrapping paper", "Stocking", "Bow", "Gift tag", "Sellotape"]),
      "Crackers",
    ]},
    { name: "Down the pub", tiles: [
      sub("Beer", "🍺", ["Pint", "Ale", "Lager", "Bitter", "Stout"]),
      sub("Darts", "🎯", ["Bullseye", "Oche", "One hundred and eighty", "Double top", "Flights"]),
      sub("Pub quiz", "❓", ["Quizmaster", "Picture round", "Answer sheet", "Tie-breaker", "Team name"]),
      sub("Pool", "🎱", ["Cue", "Chalk", "Pocket", "Rack", "Break"]),
      "Crisps",
    ]},
    { name: "Royalty", tiles: [
      sub("Crown", "👑", ["Jewels", "Sceptre", "Orb", "Tiara", "Throne"]),
      sub("Castle", "🏰", ["Moat", "Drawbridge", "Turret", "Keep", "Battlements"]),
      sub("Royal guard", "💂", ["Bearskin", "Sentry", "Changing", "Red tunic", "March"]),
      sub("Royal Ascot", "🏇", ["Racing", "Hats", "Royal box", "Enclosure", "Horses"]),
      "Palace",
    ]},
  ]},
];

const WALLS = [
  { name: "Wall 1", groups: [
    { name: "Oranges", tiles: ["Seville", "Navel", "Jaffa", "Blood"] },
    { name: "___ moon", tiles: ["Harvest", "New", "Honey", "Blue"] },
    { name: "Shades of blue", tiles: ["Navy", "Cobalt", "Cyan", "Azure"] },
    { name: "___ bee", tiles: ["Queen", "Busy", "Spelling", "Bumble"] },
  ]},
  { name: "Wall 2", groups: [
    { name: "TV detectives", tiles: ["Morse", "Poirot", "Marple", "Rebus"] },
    { name: "Jack ___", tiles: ["Frost", "Sprat", "Daw", "Pot"] },
    { name: "Snooker terms", tiles: ["Cushion", "Baulk", "Plant", "Kiss"] },
    { name: "Puzzles", tiles: ["Sudoku", "Crossword", "Jigsaw", "Wordsearch"] },
  ]},
  { name: "Wall 3", groups: [
    { name: "Names for grandma", tiles: ["Nan", "Nana", "Gran", "Granny"] },
    { name: "Knots", tiles: ["Bowline", "Sheepshank", "Reef", "Hitch"] },
    { name: "Apple varieties", tiles: ["Braeburn", "Gala", "Cox", "Jazz"] },
    { name: "Volcanoes", tiles: ["Etna", "Vesuvius", "Krakatoa", "Fuji"] },
  ]},
  { name: "Wall 4", groups: [
    { name: "Famous Davids", tiles: ["Beckham", "Attenborough", "Bowie", "Tennant"] },
    { name: "Doctor Who actors", tiles: ["Smith", "Capaldi", "Baker", "Whittaker"] },
    { name: "Surnames from old jobs", tiles: ["Fletcher", "Cooper", "Taylor", "Thatcher"] },
    { name: "Prime ministers", tiles: ["Major", "Blair", "Brown", "May"] },
  ]},
  { name: "Wall 5", groups: [
    { name: "___fly", tiles: ["Butter", "Fire", "House", "Horse"] },
    { name: "Welsh symbols", tiles: ["Dragon", "Daffodil", "Leek", "Lovespoon"] },
    { name: "Lake District lakes", tiles: ["Windermere", "Coniston", "Ullswater", "Grasmere"] },
    { name: "Beatrix Potter characters", tiles: ["Peter", "Jemima", "Tiggy-Winkle", "Nutkin"] },
  ]},
  { name: "Wall 6", groups: [
    { name: "Jewellery materials", tiles: ["Amber", "Coral", "Pearl", "Jet"] },
    { name: "Shades of pink", tiles: ["Salmon", "Fuchsia", "Rose", "Blush"] },
    { name: "Freshwater fish", tiles: ["Pike", "Perch", "Carp", "Roach"] },
    { name: "Aircraft", tiles: ["Glider", "Drone", "Blimp", "Biplane"] },
  ]},
  { name: "Wall 7", groups: [
    { name: "Bond actors", tiles: ["Connery", "Dalton", "Brosnan", "Lazenby"] },
    { name: "Famous Daniels", tiles: ["Radcliffe", "Kaluuya", "Day-Lewis", "Craig"] },
    { name: "Famous Patricks", tiles: ["Swayze", "Moore", "Kielty", "Vieira"] },
    { name: "Famous Rods", tiles: ["Laver", "Hull", "Steiger", "Stewart"] },
  ]},
  { name: "Wall 8", groups: [
    { name: "Knitwear patterns", tiles: ["Arran", "Fair Isle", "Cable", "Argyle"] },
    { name: "Scottish islands", tiles: ["Skye", "Mull", "Islay", "Iona"] },
    { name: "Think deeply", tiles: ["Muse", "Ponder", "Brood", "Reflect"] },
    { name: "Parts of a church", tiles: ["Nave", "Aisle", "Transept", "Crypt"] },
  ]},
  { name: "Wall 9", groups: [
    { name: "London ___gates", tiles: ["Southgate", "Highgate", "Moorgate", "Aldgate"] },
    { name: "Famous Glenns", tiles: ["Close", "Miller", "McGrath", "Hoddle"] },
    { name: "Famous Bobbys", tiles: ["Moore", "Charlton", "Davro", "Robson"] },
    { name: "England managers", tiles: ["Capello", "Venables", "Ramsey", "Eriksson"] },
  ]},
  { name: "Wall 10", groups: [
    { name: "Pastry", tiles: ["Filo", "Choux", "Shortcrust", "Suet"] },
    { name: "Famous dragons", tiles: ["Smaug", "Toothless", "Norbert", "Puff"] },
    { name: "Bread rolls", tiles: ["Bun", "Bap", "Cob", "Barm"] },
    { name: "Hairstyles", tiles: ["Bob", "Mullet", "Quiff", "Beehive"] },
  ]},
  { name: "Wall 11", groups: [
    { name: "Famous Freds", tiles: ["Astaire", "Flintstone", "Dibnah", "Perry"] },
    { name: "British tennis players", tiles: ["Murray", "Henman", "Raducanu", "Wade"] },
    { name: "Racecourses", tiles: ["Aintree", "Ascot", "Goodwood", "Cheltenham"] },
    { name: "___ salt", tiles: ["Epsom", "Rock", "Sea", "Table"] },
  ]},
  { name: "Wall 12", groups: [
    { name: "Ford cars", tiles: ["Fiesta", "Focus", "Mondeo", "Capri"] },
    { name: "Wild cats", tiles: ["Puma", "Lynx", "Ocelot", "Cheetah"] },
    { name: "Car makers", tiles: ["Lotus", "Mini", "Bentley", "Jaguar"] },
    { name: "Yoga poses", tiles: ["Cobra", "Tree", "Warrior", "Bridge"] },
  ]},
  { name: "Wall 13", groups: [
    { name: "Fawlty Towers characters", tiles: ["Sybil", "Manuel", "Polly", "Basil"] },
    { name: "Herbs", tiles: ["Sage", "Thyme", "Mint", "Dill"] },
    { name: "Mojito ingredients", tiles: ["Rum", "Soda", "Sugar", "Lime"] },
    { name: "Shades of green", tiles: ["Olive", "Emerald", "Jade", "Bottle"] },
  ]},
];
