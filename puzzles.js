/* =====================================================================
   LINKBOARD PUZZLES. Add your own here.

   BOARD LEVELS
   Every group has a name and exactly 5 tiles. A tile is either:
     - a word, e.g. "Milk"
     - a smaller group, written { name, pic, tiles: [...] }. When the player
       finds it, its five tiles shrink into one picture tile (pic), and that
       picture becomes one of the five tiles of the group above it.
   Groups at the top level never shrink, because they are not part of a
   bigger answer. When found, they stay on the board as a full-colour row.
   A top-level group can be plain words (it just becomes a coloured row) or
   be built from smaller groups.
   Every level needs EXACTLY 7 top-level groups. That keeps the board full
   from start to finish (the hidden words run out at just the right moment)
   and the finished board is seven coloured rows.
   Players do not pick levels. They work through one path: every Easy level,
   then every Medium, then every Hard, each in the order listed here. New
   levels can go anywhere in the list; set difficulty to place them.
   Set time (in seconds) for a countdown, or time: null for relaxed play.
   Aim for about 1 in 5 levels timed, never Easy, with Medium given a bit
   more time than Hard.
   anagrams: true makes it an anagram round: about half the groups show one
   of their words scrambled (never more than one per group). It unscrambles
   when the group is found.

   AMERICAN ENGLISH
   Write everything in British English. US_WORDS below swaps whole tiles
   and names for American players. If a word only changes in one place,
   write both in the tile itself, British first: "Porridge»Oatmeal".

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
      "🐔|Hen",
      "Tractor",
    ]},
    { name: "Sports", tiles: ["⚽|Football", "🎾|Tennis", "🏏|Cricket", "⛳|Golf", "Rugby"] },
    { name: "Vegetables", tiles: ["Carrot", "Potato", "Turnip", "Cabbage", "Parsnip"] },
    { name: "Fruit", tiles: ["Apple", "Pear", "Plum", "Cherry", "Banana"] },
    { name: "Birds", tiles: ["Robin", "Owl", "Crow", "Swan", "Wren"] },
    { name: "Colours", tiles: ["Red", "Blue", "Green", "Yellow", "Purple"] },
    { name: "Weather", tiles: ["Rain", "Snow", "Wind", "Hail", "Sleet"] },
  ]},
  { name: "Home and away", difficulty: "Easy", time: null, groups: [
    { name: "Around the house", tiles: [
      sub("Bathroom", "🛁", ["Towel", "Sink", "Shower", "Plunger", "Bath mat"]),
      sub("Bedroom", "🛏️", ["Pillow", "Duvet", "Wardrobe", "Alarm clock", "Slippers"]),
      sub("Kitchen", "🍳", ["Kettle", "Toaster", "Fridge", "Oven", "Whisk"]),
      "🌳|Garden",
      "Loft",
    ]},
    { name: "Weather", tiles: ["☀️|Sun", "🌧️|Rain", "❄️|Snow", "🌬️|Wind", "Fog"] },
    { name: "Colours", tiles: ["Scarlet", "Turquoise", "Magenta", "Ochre", "Lilac"] },
    { name: "Pets", tiles: ["Dog", "Cat", "Hamster", "Goldfish", "Rabbit"] },
    { name: "Fruit", tiles: ["Apple", "Pear", "Plum", "Grape", "Lemon"] },
    { name: "Shapes", tiles: ["Circle", "Square", "Triangle", "Oval", "Star"] },
    { name: "Transport", tiles: ["Car", "Bus", "Train", "Plane", "Boat"] },
  ]},
  { name: "Out and about", difficulty: "Medium", time: null, groups: [
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
    { name: "Music", tiles: ["🎸|Guitar", "🥁|Drums", "🎹|Piano", "🎻|Violin", "Choir"] },
    { name: "Capital cities", tiles: ["Paris", "Madrid", "Oslo", "Lisbon", "Vienna"] },
    { name: "Planets", tiles: ["Mars", "Venus", "Saturn", "Jupiter", "Neptune"] },
    { name: "Dog breeds", tiles: ["Beagle", "Poodle", "Boxer", "Pug", "Labrador"] },
    { name: "Tools", tiles: ["Hammer", "Spanner", "Chisel", "Pliers", "Saw"] },
  ]},
  { name: "Food and drink", difficulty: "Medium", time: null, groups: [
    { name: "Breakfast", tiles: [
      sub("Fry-up", "🍳", ["Bacon", "Sausage", "Beans", "Black pudding", "Hash brown"]),
      sub("Cereal", "🥣", ["Cornflakes", "Muesli", "Granola", "Bran", "Porridge»Oatmeal"]),
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
    { name: "Puddings", tiles: ["🍰|Cake", "🍫|Chocolate", "🍓|Strawberries", "🍎|Apple", "Trifle"] },
    { name: "Spices", tiles: ["Cumin", "Paprika", "Saffron", "Nutmeg", "Cinnamon"] },
    { name: "Herbs", tiles: ["Basil", "Mint", "Thyme", "Sage", "Parsley"] },
    { name: "Nuts", tiles: ["Almond", "Walnut", "Cashew", "Peanut", "Pecan"] },
    { name: "Fruit", tiles: ["Banana", "Mango", "Kiwi", "Peach", "Lime"] },
  ]},
  { name: "Wordplay", difficulty: "Hard", time: null, groups: [
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
    { name: "Colours", tiles: ["⚫|Black___", "⚪|White___", "🟢|Green___", "🔴|Red___", "Blue"] },
    { name: "Hidden numbers", tiles: ["Often", "Weight", "Canine", "Lonely", "Bitten"] },
    { name: "Palindromes", tiles: ["Level", "Radar", "Kayak", "Civic", "Rotor"] },
    { name: "___cake", tiles: ["Cup", "Pan", "Rock", "Fruit", "Carrot"] },
    { name: "___ball", tiles: ["Snow", "Meat", "Hand", "Net", "Base"] },
  ]},
  { name: "Great British", difficulty: "Hard", time: null, groups: [
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
    { name: "Royalty", tiles: ["👑|Crown", "🏰|Castle", "💂|Royal guard", "🏇|Royal Ascot", "Palace"] },
    { name: "Seaside resorts", tiles: ["Blackpool", "Brighton", "Skegness", "Scarborough", "Margate"] },
    { name: "Soaps", tiles: ["EastEnders", "Coronation Street", "Emmerdale", "Hollyoaks", "Neighbours"] },
    { name: "Biscuits", tiles: ["Digestive", "Hobnob", "Custard cream", "Bourbon", "Jammie Dodger"] },
    { name: "Mr Men", tiles: ["Tickle", "Greedy", "Bump", "Happy", "Messy"] },
  ]},
  { name: "Out in nature", difficulty: "Easy", time: null, groups: [
    { name: "Pets", tiles: [
      sub("Dog", "🐶", ["Bark", "Kennel", "Lead", "Fetch", "Puppy"]),
      sub("Cat", "🐱", ["Purr", "Whiskers", "Kitten", "Meow", "Litter tray"]),
      sub("Goldfish", "🐟", ["Bowl", "Fins", "Bubbles", "Gills", "Scales"]),
      "🐇|Rabbit",
      "Hamster",
    ]},
    { name: "The year", tiles: ["🌸|Spring", "🏖️|Summer", "🍂|Autumn", "⛄|Winter", "New Year"] },
    { name: "Flowers", tiles: ["Rose", "Tulip", "Daisy", "Daffodil", "Bluebell"] },
    { name: "Trees", tiles: ["Oak", "Birch", "Willow", "Maple", "Holly"] },
    { name: "Insects", tiles: ["Ant", "Bee", "Wasp", "Beetle", "Ladybird"] },
    { name: "Birds", tiles: ["Robin", "Owl", "Blackbird", "Swan", "Wren"] },
    { name: "Sea creatures", tiles: ["Crab", "Dolphin", "Whale", "Octopus", "Seal"] },
  ]},
  { name: "Night in", difficulty: "Medium", time: 14 * 60, groups: [
    { name: "Film night", tiles: [
      sub("Popcorn", "🍿", ["Kernels", "Salted", "Sweet", "Butter", "Bucket"]),
      sub("Director", "🎬", ["Action", "Cut", "Clapperboard", "Take", "Script"]),
      sub("Superhero", "🦸", ["Cape", "Mask", "Villain", "Secret identity", "Sidekick"]),
      sub("Horror", "👻", ["Scream", "Zombie", "Haunted", "Vampire", "Jump scare"]),
      "Trailer",
    ]},
    { name: "Takeaway", tiles: [
      sub("Curry", "🍛", ["Korma", "Tikka", "Naan", "Poppadom", "Bhaji"]),
      sub("Chinese", "🥡", ["Chow mein", "Spring roll", "Prawn crackers", "Sweet and sour", "Chopsticks"]),
      sub("Chippy", "🐟", ["Cod", "Batter", "Mushy peas", "Vinegar", "Saveloy"]),
      sub("Pizza", "🍕", ["Margherita", "Pepperoni", "Stuffed crust", "Dough", "Deep pan"]),
      "Delivery",
    ]},
    { name: "Board games", tiles: ["Monopoly", "Cluedo", "Scrabble", "Risk", "Chess"] },
    { name: "Card games", tiles: ["Snap", "Poker", "Rummy", "Bridge", "Patience"] },
    { name: "TV quiz shows", tiles: ["Pointless", "Mastermind", "The Chase", "Countdown", "Eggheads"] },
    { name: "Drinks", tiles: ["Tea", "Cocoa", "Wine", "Lemonade", "Cola"] },
    { name: "Snacks", tiles: ["Crisps", "Nachos", "Pretzels", "Peanuts", "Olives"] },
  ]},
  { name: "Hidden words", difficulty: "Hard", time: 12 * 60, groups: [
    { name: "Around the home", tiles: [
      sub("House___", "🏠", ["Boat", "Hold", "Work", "Wife", "Plant"]),
      sub("Door___", "🚪", ["Bell", "Mat", "Step", "Knob", "Way"]),
      sub("Window___", "🪟", ["Sill", "Box", "Pane", "Shopping", "Cleaner"]),
      sub("Bed___", "🛏️", ["Room", "Rock", "Bug", "Time", "Spread"]),
      "Roof",
    ]},
    { name: "Weather", tiles: [
      sub("Rain___", "🌧️", ["Coat", "Drop", "Forest", "Fall", "Check"]),
      sub("Snow___", "❄️", ["Man", "Drift", "Flake", "Board", "Plough"]),
      sub("Thunder___", "⚡", ["Bolt", "Clap", "Storm", "Struck", "Birds"]),
      sub("Wind___", "🌬️", ["Mill", "Screen", "Sock", "Swept", "Breaker"]),
      "Fog",
    ]},
    { name: "Hidden animals", tiles: ["Scatter", "Dogma", "Pirate", "Pigment", "Cowboy"] },
    { name: "Hidden body parts", tiles: ["Fearless", "Hipster", "Elegant", "Chinese", "Charmed"] },
    { name: "Palindromes", tiles: ["Level", "Radar", "Kayak", "Civic", "Rotor"] },
    { name: "Hidden numbers", tiles: ["Often", "Weight", "Canine", "Lonely", "Bitten"] },
    { name: "Anagrams of STOP", tiles: ["Pots", "Tops", "Spot", "Opts", "Post"] },
  ]},
  { name: "Back to school", difficulty: "Easy", time: null, groups: [
    { name: "School lessons", tiles: [
      sub("Science", "🔬", ["Microscope", "Experiment", "Test tube", "Bunsen burner", "Goggles"]),
      sub("Art", "🎨", ["Paintbrush", "Easel", "Canvas", "Sketch", "Palette"]),
      sub("PE", "🤸", ["Gym", "Netball", "Rounders", "Plimsolls", "Climbing ropes"]),
      "🧮|Maths",
      "History",
    ]},
    { name: "Packed lunch", tiles: ["🥪|Sandwich", "🍎|Apple", "🧃|Juice box", "🍫|Treat", "Lunchbox"] },
    { name: "Stationery", tiles: ["Pencil", "Ruler", "Rubber", "Sharpener", "Glue stick"] },
    { name: "In the classroom", tiles: ["Whiteboard", "Desk", "Chair", "Register", "Clock"] },
    { name: "Rainbow colours", tiles: ["Red", "Orange", "Yellow", "Green", "Indigo"] },
    { name: "Numbers", tiles: ["One", "Two", "Three", "Four", "Five"] },
    { name: "Shapes", tiles: ["Circle", "Square", "Triangle", "Hexagon", "Oval"] },
  ]},
  { name: "On holiday", difficulty: "Easy", time: null, anagrams: true, groups: [
    { name: "Packing", tiles: [
      sub("Suitcase", "🧳", ["Wheels", "Zip", "Luggage tag", "Handle", "Padlock"]),
      sub("Passport", "🛂", ["Photo", "Stamp", "Visa", "Expiry date", "Border"]),
      sub("Sun cream", "🧴", ["Factor", "Lotion", "Bottle", "Spray", "After sun"]),
      "🕶️|Sunglasses",
      "Tickets",
    ]},
    { name: "Camping", tiles: ["⛺|Tent", "🔥|Campfire", "🔦|Torch", "🛶|Canoe", "Sleeping bag"] },
    { name: "Holiday countries", tiles: ["France", "Spain", "Italy", "Greece", "Portugal"] },
    { name: "Ice cream flavours", tiles: ["Vanilla", "Mint choc chip", "Strawberry", "Rum and raisin", "Toffee"] },
    { name: "Holiday activities", tiles: ["Snorkelling", "Sightseeing", "Sunbathing", "Hiking", "Shopping"] },
    { name: "At the hotel", tiles: ["Reception", "Lift", "Room key", "Minibar", "Room service"] },
    { name: "Weather", tiles: ["Sunny", "Cloudy", "Windy", "Rainy", "Stormy"] },
  ]},
  { name: "Animal magic", difficulty: "Easy", time: null, groups: [
    { name: "On safari", tiles: [
      sub("Lion", "🦁", ["Mane", "Roar", "Pride", "Cub", "King"]),
      sub("Elephant", "🐘", ["Trunk", "Tusks", "Herd", "Ivory", "Ears"]),
      sub("Giraffe", "🦒", ["Long neck", "Patches", "Tall", "Acacia", "Gentle"]),
      "🦓|Zebra",
      "Jeep",
    ]},
    { name: "Under the sea", tiles: ["🦈|Shark", "🐬|Dolphin", "🐙|Octopus", "🐢|Turtle", "Coral reef"] },
    { name: "Baby animals", tiles: ["Puppy", "Kitten", "Foal", "Joey", "Duckling"] },
    { name: "Animal homes", tiles: ["Nest", "Burrow", "Den", "Hive", "Sty"] },
    { name: "Birds", tiles: ["Eagle", "Parrot", "Penguin", "Flamingo", "Peacock"] },
    { name: "Minibeasts", tiles: ["Butterfly", "Ant", "Beetle", "Moth", "Grasshopper"] },
    { name: "Small pets", tiles: ["Hamster", "Guinea pig", "Goldfish", "Budgie", "Tortoise"] },
  ]},
  { name: "Telly addict", difficulty: "Medium", time: null, groups: [
    { name: "Quiz shows", tiles: [
      sub("Millionaire", "💰", ["Lifeline", "Phone a friend", "Fifty fifty", "Final answer", "Ask the audience"]),
      sub("Mastermind", "🪑", ["Black chair", "Specialist subject", "Pass", "General knowledge", "I've started so I'll finish"]),
      sub("Countdown", "🔤", ["Consonant", "Vowel", "Conundrum", "Numbers round", "Dictionary corner"]),
      sub("The Chase", "🏃", ["Chaser", "Cash builder", "Head to head", "Final chase", "Pushback"]),
      "Bullseye",
    ]},
    { name: "Cooking", tiles: [
      sub("Baking", "🧁", ["Flour", "Whisk", "Oven gloves", "Mixing bowl", "Rolling pin"]),
      sub("Barbecue", "🍖", ["Grill", "Charcoal", "Tongs", "Burgers", "Skewers"]),
      sub("Noodles", "🍜", ["Ramen", "Udon", "Chopsticks", "Slurp", "Wok"]),
      sub("Salad", "🥗", ["Lettuce", "Cucumber", "Dressing", "Rocket", "Croutons"]),
      "Recipe",
    ]},
    { name: "Doctor Who actors", tiles: ["Smith", "Capaldi", "Baker", "Whittaker", "Tennant"] },
    { name: "Sitcoms", tiles: ["Friends", "Frasier", "Seinfeld", "Blackadder", "Porridge"] },
    { name: "Talent shows", tiles: ["X Factor", "Pop Idol", "The Voice", "Britain's Got Talent", "Fame Academy"] },
    { name: "TV detectives", tiles: ["Morse", "Poirot", "Marple", "Rebus", "Columbo"] },
    { name: "On the news", tiles: ["Headline", "Bulletin", "Anchor", "Breaking", "Forecast"] },
  ]},
  { name: "Sporting life", difficulty: "Medium", time: null, anagrams: true, groups: [
    { name: "The Olympics", tiles: [
      sub("Swimming", "🏊", ["Butterfly", "Breaststroke", "Lane", "Goggles", "Backstroke"]),
      sub("Cycling", "🚴", ["Peloton", "Velodrome", "Saddle", "Pedal", "Yellow jersey"]),
      sub("Athletics", "🏃", ["Hurdles", "Relay", "Baton", "Javelin", "Sprint"]),
      sub("Boxing", "🥊", ["Ring", "Gloves", "Uppercut", "Knockout", "Jab"]),
      "Medal",
    ]},
    { name: "Football", tiles: [
      sub("Goal", "🥅", ["Net", "Crossbar", "Post", "Keeper", "Header"]),
      sub("Referee", "🟨", ["Whistle", "Yellow card", "Red card", "Offside", "VAR"]),
      sub("Stadium", "🏟️", ["Terrace", "Turnstile", "Stand", "Pitch", "Floodlights"]),
      sub("Cup", "🏆", ["Trophy", "Final", "Wembley", "Giant killing", "Replay"]),
      "Manager",
    ]},
    { name: "Snooker terms", tiles: ["Cushion", "Baulk", "Break", "Pocket", "Cue"] },
    { name: "Golf terms", tiles: ["Birdie", "Eagle", "Bogey", "Tee", "Fairway"] },
    { name: "Tennis terms", tiles: ["Love", "Deuce", "Ace", "Let", "Rally"] },
    { name: "Cricket terms", tiles: ["Wicket", "Over", "Maiden", "Duck", "Googly"] },
    { name: "Darts terms", tiles: ["Oche", "Bullseye", "Double", "Treble", "Arrows"] },
  ]},
  { name: "Around the world", difficulty: "Medium", time: null, groups: [
    { name: "City breaks", tiles: [
      sub("Paris", "🗼", ["Eiffel Tower", "Louvre", "Seine", "Croissant", "Montmartre"]),
      sub("New York", "🗽", ["Broadway", "Central Park", "Yellow cab", "Times Square", "Brooklyn"]),
      sub("Rome", "🏛️", ["Colosseum", "Vatican", "Trevi Fountain", "Pizza", "Forum"]),
      sub("Egypt", "🐫", ["Pyramids", "Sphinx", "Nile", "Pharaoh", "Camel"]),
      "Passport",
    ]},
    { name: "World food", tiles: [
      sub("Japan", "🍣", ["Sushi", "Sake", "Tempura", "Wasabi", "Bento"]),
      sub("Mexico", "🌮", ["Taco", "Burrito", "Salsa", "Nachos", "Tequila"]),
      sub("India", "🍛", ["Curry", "Naan", "Chai", "Samosa", "Dhal"]),
      sub("America", "🍔", ["Burger", "Hot dog", "Pancakes", "Milkshake", "Fries"]),
      "Menu",
    ]},
    { name: "Capital cities", tiles: ["Berlin", "Madrid", "Oslo", "Dublin", "Athens"] },
    { name: "Rivers", tiles: ["Amazon", "Thames", "Danube", "Ganges", "Mississippi"] },
    { name: "Mountains", tiles: ["Everest", "Kilimanjaro", "Snowdon", "Ben Nevis", "Matterhorn"] },
    { name: "Currencies", tiles: ["Euro", "Dollar", "Yen", "Rupee", "Peso"] },
    { name: "Languages", tiles: ["French", "Spanish", "Mandarin", "Arabic", "Welsh"] },
  ]},
  { name: "Double meanings", difficulty: "Hard", time: null, anagrams: true, groups: [
    { name: "The elements", tiles: [
      sub("Fire___", "🔥", ["Work", "Place", "Man", "Fly", "Wood"]),
      sub("Water___", "💧", ["Fall", "Melon", "Proof", "Colour", "Front"]),
      sub("Air___", "💨", ["Port", "Craft", "Mail", "Ship", "Wave"]),
      sub("Earth___", "🌍", ["Quake", "Worm", "Ling", "Bound", "Works"]),
      "Metal",
    ]},
    { name: "Times of day", tiles: [
      sub("Day___", "🌤️", ["Light", "Break", "Dream", "Time", "Trip"]),
      sub("Night___", "🌙", ["Mare", "Club", "Gown", "Shift", "Owl"]),
      sub("Morning___", "🌅", ["Glory", "Sickness", "Star", "Paper", "Show"]),
      sub("Sun___", "☀️", ["Dial", "Flower", "Burn", "Glasses", "Rise"]),
      "Clock",
    ]},
    { name: "Body parts", tiles: ["💪|Arm___", "🧠|Head___", "👃|Nose___", "🦵|Knee___", "Elbow"] },
    { name: "Palindromes", tiles: ["Noon", "Madam", "Refer", "Stats", "Level"] },
    { name: "Anagrams of LISTEN", tiles: ["Silent", "Enlist", "Tinsel", "Inlets", "Listen"] },
    { name: "Things with keys", tiles: ["Piano", "Map", "Keyboard", "Lock", "Typewriter"] },
    { name: "Things with teeth", tiles: ["Comb", "Saw", "Zip", "Cog", "Shark"] },
  ]},
  { name: "Brain box", difficulty: "Hard", time: null, groups: [
    { name: "Science", tiles: [
      sub("Chemistry", "🧪", ["Element", "Compound", "Acid", "Molecule", "Periodic table"]),
      sub("Biology", "🧬", ["Cell", "DNA", "Photosynthesis", "Organism", "Evolution"]),
      sub("Astronomy", "🔭", ["Telescope", "Galaxy", "Comet", "Nebula", "Orbit"]),
      sub("Physics", "🧲", ["Gravity", "Magnet", "Friction", "Velocity", "Quantum"]),
      "Laboratory",
    ]},
    { name: "Greek myths", tiles: [
      sub("Zeus", "⚡", ["Thunderbolt", "Olympus", "Hera", "King of the gods", "Eagle"]),
      sub("Poseidon", "🔱", ["Trident", "Sea", "Horses", "Earthquakes", "Atlantis"]),
      sub("Medusa", "🐍", ["Snakes", "Stone", "Gorgon", "Perseus", "Mirror"]),
      sub("Athena", "🦉", ["Wisdom", "Owl", "Athens", "Parthenon", "Olive"]),
      "Hercules",
    ]},
    { name: "Classical music", tiles: ["🎹|Beethoven", "🎻|Mozart", "🎭|Opera", "🎷|Jazz", "Orchestra"] },
    { name: "Greek letters", tiles: ["Alpha", "Beta", "Delta", "Sigma", "Omega"] },
    { name: "Bones", tiles: ["Femur", "Tibia", "Ulna", "Radius", "Patella"] },
    { name: "Moons", tiles: ["Titan", "Europa", "Io", "Triton", "Phobos"] },
    { name: "Languages", tiles: ["Latin", "Welsh", "Basque", "Swahili", "Urdu"] },
  ]},
  { name: "Round Britain", difficulty: "Hard", time: null, groups: [
    { name: "London", tiles: [
      sub("The Tube", "🚇", ["Mind the gap", "Oyster", "Escalator", "Platform", "Northern line"]),
      sub("London Eye", "🎡", ["Pod", "South Bank", "Ferris", "View", "Capsule"]),
      sub("Buckingham Palace", "💂", ["Balcony", "Guards", "The Mall", "Flag", "King"]),
      sub("Big Ben", "🕰️", ["Chimes", "Clock tower", "Westminster", "Bong", "Elizabeth Tower"]),
      "Black cab",
    ]},
    { name: "Scotland", tiles: [
      sub("Whisky", "🥃", ["Malt", "Distillery", "Dram", "Cask", "Peat"]),
      sub("Bagpipes", "🎶", ["Drone", "Chanter", "Piper", "Reel", "Lament"]),
      sub("Highlands", "🦌", ["Stag", "Glen", "Munro", "Heather", "Midges"]),
      sub("Loch Ness", "🦕", ["Monster", "Nessie", "Inverness", "Sighting", "Urquhart"]),
      "Haggis",
    ]},
    { name: "At the seaside", tiles: ["🍟|Fish and chips", "🏖️|Beach", "🎠|Funfair", "🦀|Rock pool", "Pier"] },
    { name: "English counties", tiles: ["Kent", "Devon", "Essex", "Norfolk", "Cornwall"] },
    { name: "Scottish cities", tiles: ["Glasgow", "Aberdeen", "Dundee", "Stirling", "Perth"] },
    { name: "Welsh towns", tiles: ["Cardiff", "Swansea", "Wrexham", "Bangor", "Newport"] },
    { name: "Northern Irish places", tiles: ["Belfast", "Derry", "Armagh", "Newry", "Lisburn"] },
  ]},
  { name: "Party time", difficulty: "Medium", time: null, groups: [
    { name: "Celebrations", tiles: [
      sub("Birthday", "🎂", ["Candles", "Balloons", "Party hat", "Cake", "Presents"]),
      sub("Wedding", "💍", ["Bride", "Groom", "Veil", "Bouquet", "Confetti"]),
      sub("Halloween", "🎃", ["Witch", "Costume", "Pumpkin", "Ghost", "Trick or treat"]),
      sub("New Year", "🥂", ["Countdown", "Midnight", "Resolution", "Fireworks", "Auld Lang Syne"]),
      "Anniversary",
    ]},
    { name: "Games", tiles: [
      sub("Chess", "♟️", ["Checkmate", "Pawn", "Bishop", "Rook", "Knight"]),
      sub("Cards", "🃏", ["Deck", "Joker", "Shuffle", "Deal", "Trumps"]),
      sub("Dice", "🎲", ["Roll", "Six", "Snake eyes", "Cube", "Dots"]),
      sub("Jigsaw", "🧩", ["Pieces", "Edge", "Corner", "Box lid", "Picture"]),
      "Charades",
    ]},
    { name: "Party food", tiles: ["Sausage roll", "Crisps", "Dips", "Cupcake", "Jelly»Jello"] },
    { name: "Dances", tiles: ["Conga", "Limbo", "Twist", "Macarena", "Hokey cokey»Hokey pokey"] },
    { name: "Music genres", tiles: ["Pop", "Disco", "Funk", "Reggae", "Soul"] },
    { name: "Party games", tiles: ["Musical chairs", "Pass the parcel", "Sleeping lions", "Pin the tail", "Statues"] },
    { name: "Drinks", tiles: ["Punch", "Lemonade", "Fizz", "Squash", "Cola"] },
  ]},
  { name: "Nine to five", difficulty: "Medium", time: 14 * 60, groups: [
    { name: "Jobs", tiles: [
      sub("Doctor", "🩺", ["Stethoscope", "Surgery", "Patient", "Prescription", "Ward"]),
      sub("Chef", "👨‍🍳", ["Apron", "Saucepan", "Recipe", "Menu", "Whisk"]),
      sub("Firefighter", "🚒", ["Hose", "Ladder", "Siren", "Helmet", "Rescue"]),
      sub("Farmer", "🚜", ["Tractor", "Barn", "Harvest", "Field", "Combine"]),
      "Teacher",
    ]},
    { name: "In the office", tiles: [
      sub("Computer", "💻", ["Mouse", "Keyboard", "Monitor", "Laptop", "Printer"]),
      sub("Phone", "📞", ["Dial", "Ringtone", "Voicemail", "Handset", "Speaker"]),
      sub("Post»Mail", "📮", ["Stamp", "Envelope", "Parcel»Package", "Postcode»Zip code", "Letterbox»Mailbox"]),
      sub("Coffee", "☕", ["Mug", "Espresso", "Latte", "Beans", "Barista"]),
      "Stapler",
    ]},
    { name: "Money", tiles: ["Coin", "Note»Bill", "Wallet", "Purse", "Bank"] },
    { name: "Trees", tiles: ["Oak", "Ash", "Beech", "Willow", "Maple"] },
    { name: "Body parts", tiles: ["Elbow", "Knee", "Ankle", "Wrist", "Shoulder"] },
    { name: "Metals", tiles: ["Iron", "Copper", "Silver", "Tin", "Zinc"] },
    { name: "Weekdays", tiles: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  ]},
  { name: "Toy box", difficulty: "Medium", time: null, groups: [
    { name: "Toys", tiles: [
      sub("Lego", "🧱", ["Bricks", "Minifigure", "Baseplate", "Instructions", "Studs"]),
      sub("Teddy", "🧸", ["Stuffing", "Button eyes", "Cuddle", "Bow tie", "Plush"]),
      sub("Kite", "🪁", ["String", "Tail", "Wind", "Spool", "Diamond"]),
      sub("Train set", "🚂", ["Track", "Engine", "Tunnel", "Station", "Points"]),
      "Yo-yo",
    ]},
    { name: "Fairy tales", tiles: [
      sub("Cinderella", "👠", ["Glass slipper", "Pumpkin", "Midnight", "Ball", "Stepsisters"]),
      sub("Snow White", "🍎", ["Seven dwarfs", "Mirror", "Poisoned apple", "Queen", "Huntsman"]),
      sub("Jack and the Beanstalk", "🌱", ["Giant", "Magic beans", "Golden goose", "Cow", "Fee fi fo fum"]),
      sub("Red Riding Hood", "🐺", ["Wolf", "Basket", "Grandma", "Woodcutter", "Cape"]),
      "Rapunzel",
    ]},
    { name: "Playground", tiles: ["Swings", "Slide", "Seesaw", "Roundabout»Merry-go-round", "Climbing frame»Jungle gym"] },
    { name: "Sweets»Candy", tiles: ["Lollipop", "Gobstopper", "Fudge", "Liquorice»Licorice", "Bonbon"] },
    { name: "Cartoon dogs", tiles: ["Snoopy", "Scooby-Doo", "Pluto", "Gromit", "Odie"] },
    { name: "Nursery rhymes", tiles: ["Humpty Dumpty", "Little Bo Peep", "Jack and Jill", "Old King Cole", "Baa Baa Black Sheep"] },
    { name: "Bath time", tiles: ["Bubbles", "Rubber duck", "Sponge", "Flannel»Washcloth", "Shampoo"] },
  ]},
  { name: "Kitchen cupboard", difficulty: "Medium", time: null, anagrams: true, groups: [
    { name: "Baking", tiles: [
      sub("Bread", "🍞", ["Yeast", "Knead", "Loaf", "Crust", "Flour"]),
      sub("Pie", "🥧", ["Pastry", "Filling", "Crimp", "Lattice", "Pie dish"]),
      sub("Biscuit", "🍪", ["Dough", "Chocolate chip", "Cutter", "Crumbs", "Cooling rack"]),
      sub("Cake", "🎂", ["Sponge", "Icing", "Layers", "Batter", "Cake tin»Cake pan"]),
      "Oven",
    ]},
    { name: "Fruit bowl", tiles: [
      sub("Banana", "🍌", ["Peel", "Split", "Smoothie", "Plantain", "Yellow"]),
      sub("Orange", "🍊", ["Segment", "Zest", "Pith", "Marmalade", "Satsuma"]),
      sub("Grapes", "🍇", ["Vine", "Raisin", "Seedless", "Wine", "Sultana"]),
      sub("Apple", "🍏", ["Core", "Crumble", "Cider", "Orchard", "Pippin"]),
      "Kiwi",
    ]},
    { name: "Herbs", tiles: ["Basil", "Mint", "Thyme", "Sage", "Rosemary"] },
    { name: "Kitchen utensils", tiles: ["Ladle", "Spatula", "Grater", "Tongs", "Colander"] },
    { name: "Nuts", tiles: ["Almond", "Cashew", "Walnut", "Pecan", "Hazelnut"] },
    { name: "Sauces", tiles: ["Ketchup", "Mayonnaise", "Mustard", "Gravy", "Pesto"] },
    { name: "Cheeses", tiles: ["Cheddar", "Brie", "Stilton", "Feta", "Edam"] },
  ]},
  { name: "Silver screen", difficulty: "Hard", time: null, groups: [
    { name: "Film genres", tiles: [
      sub("Western", "🤠", ["Saloon", "Sheriff", "Stagecoach", "Tumbleweed", "Showdown"]),
      sub("Horror", "👻", ["Haunted", "Zombie", "Scream", "Vampire", "Chainsaw"]),
      sub("Sci-fi", "👽", ["Alien", "Laser", "Spaceship", "Robot", "Time travel"]),
      sub("Musical", "🎭", ["Chorus", "Number", "Overture", "Showstopper", "Encore"]),
      "Thriller",
    ]},
    { name: "At the cinema", tiles: [
      sub("Tickets", "🎟️", ["Box office", "Stub", "Seat number", "Usher", "Queue»Line"]),
      sub("Popcorn", "🍿", ["Kernels", "Toffee", "Bucket", "Butter", "Microwave"]),
      sub("Camera", "🎥", ["Lens", "Tripod", "Zoom", "Reel", "Close-up"]),
      sub("Award", "🏆", ["Statuette", "Red carpet", "Nominee", "Speech", "Envelope"]),
      "Trailer",
    ]},
    { name: "Hitchcock films", tiles: ["Psycho", "Vertigo", "Rebecca", "Notorious", "The Birds"] },
    { name: "Bond films", tiles: ["Skyfall", "Goldfinger", "Moonraker", "Octopussy", "Spectre"] },
    { name: "Film directors", tiles: ["Spielberg", "Kubrick", "Scorsese", "Nolan", "Tarantino"] },
    { name: "Best Picture winners", tiles: ["Gladiator", "Titanic", "Rocky", "Casablanca", "Parasite"] },
    { name: "Film studios", tiles: ["Pinewood", "Ealing", "Paramount", "Universal", "Warner"] },
  ]},
  { name: "Lab coat", difficulty: "Hard", time: 12 * 60, groups: [
    { name: "The body", tiles: [
      sub("Heart", "❤️", ["Ventricle", "Pulse", "Valve", "Artery", "Beat"]),
      sub("Brain", "🧠", ["Neuron", "Cortex", "Memory", "Lobe", "Synapse"]),
      sub("Lungs", "🫁", ["Breath", "Oxygen", "Alveoli", "Diaphragm", "Inhale"]),
      sub("Eye", "👁️", ["Retina", "Iris", "Pupil", "Lens", "Cornea"]),
      "Skeleton",
    ]},
    { name: "Wild weather", tiles: [
      sub("Lightning", "⚡", ["Bolt", "Flash", "Fork", "Strike", "Thunder"]),
      sub("Rainbow", "🌈", ["Arc", "Prism", "Spectrum", "Indigo", "Refraction"]),
      sub("Tornado", "🌪️", ["Twister", "Funnel", "Vortex", "Kansas", "Storm chaser"]),
      sub("Snow", "❄️", ["Flurry", "Drift", "Avalanche", "Slush", "Powder"]),
      "Hurricane",
    ]},
    { name: "Noble gases", tiles: ["Helium", "Neon", "Argon", "Krypton", "Xenon"] },
    { name: "Famous scientists", tiles: ["Newton", "Darwin", "Curie", "Einstein", "Faraday"] },
    { name: "Units", tiles: ["Volt", "Watt", "Joule", "Ohm", "Kelvin"] },
    { name: "Bones", tiles: ["Femur", "Tibia", "Ulna", "Radius", "Skull"] },
    { name: "Constellations", tiles: ["Orion", "Pegasus", "Cassiopeia", "Draco", "Lyra"] },
  ]},
  { name: "Showtime", difficulty: "Hard", time: null, groups: [
    { name: "Instruments", tiles: [
      sub("Trumpet", "🎺", ["Valve", "Mouthpiece", "Fanfare", "Brass", "Bugle"]),
      sub("Saxophone", "🎷", ["Reed", "Jazz", "Alto", "Tenor", "Bell"]),
      sub("Accordion", "🪗", ["Bellows", "Squeezebox", "Polka", "Button", "Busker"]),
      sub("Banjo", "🪕", ["Bluegrass", "Pluck", "Twang", "Picking", "Country"]),
      "Triangle",
    ]},
    { name: "On stage", tiles: [
      sub("Ballet", "🩰", ["Tutu", "Pointe", "Pirouette", "Swan Lake", "Nutcracker"]),
      sub("Theatre»Theater", "🎭", ["Curtain", "Stalls", "Interval»Intermission", "Matinee", "Understudy"]),
      sub("Circus", "🎪", ["Clown", "Juggler", "Trapeze", "Ringmaster", "Big top"]),
      sub("Magic show", "🎩", ["Wand", "Rabbit", "Top hat", "Card trick", "Abracadabra"]),
      "Pantomime",
    ]},
    { name: "Composers", tiles: ["Bach", "Handel", "Elgar", "Chopin", "Vivaldi"] },
    { name: "Beatles songs", tiles: ["Yesterday", "Help", "Something", "Michelle", "Yellow Submarine"] },
    { name: "Music terms", tiles: ["Tempo", "Forte", "Allegro", "Crescendo", "Staccato"] },
    { name: "Musicals", tiles: ["Cats", "Oliver", "Grease", "Hair", "Evita"] },
    { name: "Rock bands", tiles: ["Queen", "Oasis", "Blur", "Muse", "Coldplay"] },
  ]},
];

/* French levels (lang "fr"). Same rules as BOARD_LEVELS. A trial of 3 levels for now. */
const BOARD_LEVELS_FR = [
  { name: "À la ferme", difficulty: "Easy", time: null, groups: [
    { name: "À la ferme", tiles: [
      sub("Vache", "🐄", ["Lait", "Pis", "Meuh", "Veau", "Étable"]),
      sub("Cochon", "🐖", ["Groin", "Porcelet", "Boue", "Jambon", "Auge"]),
      sub("Mouton", "🐑", ["Laine", "Troupeau", "Agneau", "Bélier", "Berger"]),
      "🐔|Poule",
      "Tracteur",
    ]},
    { name: "Sports", tiles: ["⚽|Football", "🎾|Tennis", "🚴|Cyclisme", "🏉|Rugby", "Pétanque"] },
    { name: "Légumes", tiles: ["Carotte", "Poireau", "Navet", "Chou", "Courgette"] },
    { name: "Fruits", tiles: ["Pomme", "Poire", "Prune", "Cerise", "Banane"] },
    { name: "Oiseaux", tiles: ["Merle", "Hibou", "Corbeau", "Cygne", "Moineau"] },
    { name: "Couleurs", tiles: ["Rouge", "Bleu", "Vert", "Jaune", "Violet"] },
    { name: "Météo", tiles: ["Pluie", "Neige", "Vent", "Grêle", "Brouillard"] },
  ]},
  { name: "À la maison", difficulty: "Easy", time: null, groups: [
    { name: "Dans la maison", tiles: [
      sub("Cuisine", "🍳", ["Bouilloire", "Grille-pain", "Frigo", "Four", "Fouet"]),
      sub("Chambre", "🛏️", ["Oreiller", "Couette", "Armoire", "Réveil", "Pantoufles"]),
      sub("Salle de bain", "🛁", ["Serviette", "Lavabo", "Douche", "Savon", "Brosse à dents"]),
      "🌳|Jardin",
      "Grenier",
    ]},
    { name: "Transports", tiles: ["🚗|Voiture", "🚌|Bus", "🚆|Train", "✈️|Avion", "Bateau"] },
    { name: "Animaux de compagnie", tiles: ["Chien", "Chat", "Hamster", "Poisson rouge", "Lapin"] },
    { name: "Formes", tiles: ["Cercle", "Carré", "Triangle", "Ovale", "Étoile"] },
    { name: "Boissons", tiles: ["Café", "Thé", "Jus d'orange", "Limonade", "Chocolat chaud"] },
    { name: "Vêtements", tiles: ["Pull", "Chemise", "Jupe", "Manteau", "Chaussettes"] },
    { name: "Fleurs", tiles: ["Rose", "Tulipe", "Marguerite", "Coquelicot", "Lys"] },
  ]},
  { name: "En vacances", difficulty: "Easy", time: null, groups: [
    { name: "En vacances", tiles: [
      sub("Plage", "🏖️", ["Sable", "Parasol", "Crème solaire", "Vagues", "Coquillage"]),
      sub("Camping", "⛺", ["Tente", "Sac de couchage", "Lampe torche", "Feu de camp", "Piquets"]),
      sub("Montagne", "🏔️", ["Ski", "Sommet", "Randonnée", "Téléphérique", "Chalet"]),
      "🧳|Valise",
      "Passeport",
    ]},
    { name: "Pays", tiles: ["🇮🇹|Italie", "🇪🇸|Espagne", "🇬🇷|Grèce", "🇵🇹|Portugal", "Maroc"] },
    { name: "Fromages", tiles: ["Brie", "Camembert", "Comté", "Roquefort", "Reblochon"] },
    { name: "Pâtisseries", tiles: ["Croissant", "Éclair", "Macaron", "Madeleine", "Tarte"] },
    { name: "Villes françaises", tiles: ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux"] },
    { name: "Instruments", tiles: ["Piano", "Guitare", "Violon", "Flûte", "Batterie"] },
    { name: "Le corps", tiles: ["Bras", "Jambe", "Tête", "Main", "Pied"] },
  ]},
];

/* American English: whole tiles, group names and level names swapped for US
   players. Board levels use all of these; walls only use the spelling ones
   (marked *) so that every wall keeps exactly one solution. */
const US_SPELLING = {
  "Colour": "Color", "Colours": "Colors", "Rainbow colours": "Rainbow colors", "Ice cream flavours": "Ice cream flavors",
  "Jewellery materials": "Jewelry materials", "Yoghurt": "Yogurt", "Polarised": "Polarized", "Maths": "Math",
  "Theatre": "Theater", "Grey": "Gray", "Favourite": "Favorite", "Snorkelling": "Snorkeling", "Sceptre": "Scepter",
};
const US_WORDS = {
  ...US_SPELLING,
  "Biscuit": "Cookie", "Biscuits": "Cookies", "Crisps": "Chips", "Candyfloss": "Cotton candy", "Sledge": "Sled",
  "Duvet": "Comforter", "Wardrobe": "Closet", "Lilo": "Pool float", "Sellotape": "Scotch tape", "Wellies": "Rain boots",
  "Plimsolls": "Sneakers", "Takeaway": "Takeout", "Ladybird": "Ladybug", "Budgie": "Parakeet", "Flapjack": "Granola bar",
  "Dodgems": "Bumper cars", "Ice lolly": "Popsicle", "Sun cream": "Sunscreen", "Football": "Soccer", "Torch": "Flashlight",
  "Head torch": "Headlamp", "Rubber": "Eraser", "Holiday": "Vacation", "On holiday": "On vacation", "Holiday activities": "Vacation activities",
  "Holiday countries": "Vacation countries", "Autumn": "Fall", "Telly addict": "TV addict", "Fry-up": "Big breakfast",
  "Oven gloves": "Oven mitts", "Litter tray": "Litter box", "Funfair": "Carnival", "Minibeasts": "Bugs",
};

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
  { name: "Wall 14", groups: [
    { name: "Shades of red", tiles: ["Scarlet", "Crimson", "Vermilion", "Cerise"] },
    { name: "Gemstones", tiles: ["Ruby", "Opal", "Topaz", "Garnet"] },
    { name: "Trees", tiles: ["Oak", "Elm", "Yew", "Cherry"] },
    { name: "___stone", tiles: ["Key", "Mile", "Lime", "Corner"] },
  ]},
  { name: "Wall 15", groups: [
    { name: "Doctor Who companions", tiles: ["Martha", "Donna", "Clara", "Rose"] },
    { name: "March sisters in Little Women", tiles: ["Meg", "Jo", "Beth", "Amy"] },
    { name: "Flowers", tiles: ["Lily", "Iris", "Poppy", "Daisy"] },
    { name: "Pixar films", tiles: ["Up", "Cars", "Coco", "Brave"] },
  ]},
  { name: "Wall 16", groups: [
    { name: "The Beatles", tiles: ["John", "Paul", "George", "Ringo"] },
    { name: "Popes", tiles: ["Francis", "Benedict", "Pius", "Leo"] },
    { name: "Kings of England", tiles: ["Henry", "Edward", "Richard", "Stephen"] },
    { name: "Star signs", tiles: ["Aries", "Virgo", "Libra", "Pisces"] },
  ]},
  { name: "Wall 17", groups: [
    { name: "Card games", tiles: ["Snap", "Rummy", "Whist", "Patience"] },
    { name: "Virtues", tiles: ["Hope", "Faith", "Charity", "Prudence"] },
    { name: "London bridges", tiles: ["Tower", "Albert", "Chelsea", "Waterloo"] },
    { name: "London stations", tiles: ["Victoria", "Euston", "Paddington", "Marylebone"] },
  ]},
  { name: "Wall 18", groups: [
    { name: "Famous bears", tiles: ["Baloo", "Rupert", "Yogi", "Pooh"] },
    { name: "___sticks", tiles: ["Drum", "Chop", "Lip", "Joy"] },
    { name: "Hundred Acre Wood", tiles: ["Eeyore", "Piglet", "Owl", "Kanga"] },
    { name: "Instruments", tiles: ["Harp", "Lute", "Oboe", "Fife"] },
  ]},
  { name: "Wall 19", groups: [
    { name: "Shades of brown", tiles: ["Tan", "Beige", "Taupe", "Sepia"] },
    { name: "Coffees", tiles: ["Latte", "Espresso", "Americano", "Mocha"] },
    { name: "Horse colours", tiles: ["Bay", "Roan", "Piebald", "Palomino"] },
    { name: "Nuts", tiles: ["Walnut", "Pecan", "Cashew", "Chestnut"] },
  ]},
  { name: "Wall 20", groups: [
    { name: "Shakespeare title characters", tiles: ["Romeo", "Juliet", "Macbeth", "Othello"] },
    { name: "NATO alphabet", tiles: ["Victor", "Hotel", "Kilo", "Oscar"] },
    { name: "Awards", tiles: ["Emmy", "Bafta", "Grammy", "Tony"] },
    { name: "Settlements", tiles: ["Village", "Town", "City", "Hamlet"] },
  ]},
  { name: "Wall 21", groups: [
    { name: "Famous Freddies", tiles: ["Flintoff", "Starr", "Krueger", "Mercury"] },
    { name: "Planets", tiles: ["Saturn", "Uranus", "Earth", "Venus"] },
    { name: "Chocolate bars", tiles: ["Twix", "Wispa", "Boost", "Mars"] },
    { name: "Roman gods", tiles: ["Bacchus", "Juno", "Minerva", "Vulcan"] },
  ]},
  { name: "Wall 22", groups: [
    { name: "British islands", tiles: ["Skye", "Man", "Wight", "Mull"] },
    { name: "Knitwear", tiles: ["Jumper", "Sweater", "Fleece", "Cardigan"] },
    { name: "Welsh towns", tiles: ["Bangor", "Rhyl", "Tenby", "Conwy"] },
    { name: "Cattle breeds", tiles: ["Hereford", "Friesian", "Angus", "Jersey"] },
  ]},
  { name: "Wall 23", groups: [
    { name: "The Simpsons", tiles: ["Marge", "Bart", "Maggie", "Lisa"] },
    { name: "Ancient Greeks", tiles: ["Plato", "Socrates", "Aristotle", "Homer"] },
    { name: "Dances", tiles: ["Tango", "Waltz", "Samba", "Salsa"] },
    { name: "Sauces", tiles: ["Pesto", "Gravy", "Ketchup", "Mayo"] },
  ]},
  { name: "Wall 24", groups: [
    { name: "Cluedo weapons", tiles: ["Candlestick", "Revolver", "Lead pipe", "Dagger"] },
    { name: "Tools", tiles: ["Hammer", "Chisel", "Saw", "Spanner"] },
    { name: "Climbing gear", tiles: ["Harness", "Carabiner", "Crampons", "Rope"] },
    { name: "Keyboard symbols", tiles: ["Asterisk", "Hash", "Ampersand", "Tilde"] },
  ]},
  { name: "Wall 25", groups: [
    { name: "English rivers", tiles: ["Severn", "Thames", "Trent", "Tyne"] },
    { name: "Make-up brands", tiles: ["Rimmel", "Maybelline", "Max Factor", "Avon"] },
    { name: "Banks", tiles: ["Barclays", "Halifax", "NatWest", "Santander"] },
    { name: "Chemists", tiles: ["Boots", "Superdrug", "Rowlands", "Lloyds"] },
  ]},
];
