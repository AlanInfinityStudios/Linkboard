# Linkboard

An ad-free word connection game, built to play on an iPad.

**Play it:** https://alaninfinitystudios.github.io/Linkboard/

## Modes

- **Board**: a 5 by 7 grid of words. Drag a tile onto another to swap them (or tap one, then the other). Put five connected tiles in one row and they shrink into a single picture tile, and hidden words drop in from the stack. The pictures connect too: five of them in a row complete a top group, which stays on the board as a full-colour row. A group only shrinks into a picture when it is part of a bigger answer; groups with nothing above them stay as full-colour rows. There is one path of 25 levels: Easy first, then Medium, then Hard. About 1 in 5 levels has a countdown (never Easy); if time runs out you restart the level, with no answers shown. Some levels are anagram rounds, where one word in a group is scrambled until you find the group. Groups that shrink into pictures come first and plain rows later. Hints light up two tiles that connect: you have up to 3, and 6 hours after using one you are back to 3 (they never stack up). Progress is saved so you can leave and carry on later; inside Claude it is also saved to the player's own private Claude storage.
- On first launch the game asks your name and language: British English, American English or French (3 trial levels); the flag on the home screen changes either.
- **Daily Five**: guess the day's five-letter word in six tries.
- **Letter Wheel**: make words of 4+ letters from the day's seven letters, always using the middle one; using all seven scores a bonus.
- Daily word lists come from SCOWL via `tools/build_words.js`, which writes `words.js`.
- **The Wall**: inspired by Only Connect. Sixteen clues, four groups of four, three minutes. Once two groups are found you have three lives. Afterwards, reveal the connections and score yourself out of 10.

## Install on iPad

Open the link above in Safari, tap the Share button, then **Add to Home Screen**. It opens full screen and works offline after the first visit.

## Adding puzzles

All puzzles live in [`puzzles.js`](puzzles.js).

- Board levels: every level needs exactly 7 top-level groups, which keeps the board full from start to finish. Every group has exactly 5 tiles. A tile is a word, or a smaller group written `sub("Cow", "🐄", [five words])` that shrinks into that picture when found. Top-level groups stay on the board, so keep to 5 or fewer per level. Use `time: 14 * 60` for a countdown or `time: null` for relaxed play, and `anagrams: true` for an anagram round. Write words in British English; `US_WORDS` swaps them for American players, or write both in one tile as `"Porridge»Oatmeal"`.
- Walls need exactly 4 groups of 4. Add the new wall to `tools/check_walls.py` too, with its red herrings, and run `python3 tools/check_walls.py` to make sure there is only one way to solve it.

## Files

- `index.html`: the game
- `puzzles.js`: all the levels and walls
- `sw.js` and `manifest.webmanifest`: make it installable and work offline
