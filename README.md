# Linkboard

An ad-free word connection game, built to play on an iPad.

**Play it:** https://alaninfinitystudios.github.io/linkboard/

## Modes

- **Board**: a 5 by 7 grid of word and picture tiles. Drag a tile onto another to swap them (or tap one, then the other). Five tiles from the same group in one row lock into a category, clear away, and hidden tiles drop in from the stack. Includes a timer, hints, clock freezes and shuffle.
- **Wall**: inspired by Only Connect. Sixteen clues, four groups of four, three minutes. Once two groups are found you have three lives. Afterwards, reveal the connections and score yourself out of 10.

## Install on iPad

Open the link above in Safari, tap the Share button, then **Add to Home Screen**. It opens full screen and works offline after the first visit.

## Adding puzzles

All puzzles live in [`puzzles.js`](puzzles.js).

- Board levels need groups of exactly 5 tiles. Write a picture tile as `"emoji|Name"`, for example `"🐔|Hen"`.
- Walls need exactly 4 groups of 4. Add the new wall to `tools/check_walls.py` too, with its red herrings, and run `python3 tools/check_walls.py` to make sure there is only one way to solve it.

## Files

- `index.html`: the game
- `puzzles.js`: all the levels and walls
- `sw.js` and `manifest.webmanifest`: make it installable and work offline
