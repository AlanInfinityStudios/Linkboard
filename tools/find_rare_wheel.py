"""Letter Wheel rule (Alan, 2026-11-06): words that are real but too obscure for the main answer list
(for example VERIER, PRIVIER, WATERIER) are only bonus words. They still score, but players never
need them to finish a wheel.

The test is everyday use: a word whose Zipf frequency in English (wordfreq, MIT/CC licence) is below
RARE_ZIPF is rare. Words listed in wheel_rare_manual.txt are always rare; words in wheel_keep.txt
always stay in the main list.

Run:  pip install wordfreq && python3 tools/find_rare_wheel.py
Then: NODE_PATH=<folder with wordlist-english> node tools/build_words.js
It reads the current words.js, so run build_words.js first if the SCOWL lists change, then this, then
build_words.js again. Writes tools/wheel_rare.txt (one word per line)."""
import os, re
from wordfreq import zipf_frequency

RARE_ZIPF = 1.5
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, "..", "words.js"), encoding="utf8").read()

def lst(name):
    m = re.search(r'^const %s = "([^"]*)"' % name, src, re.M)
    return m.group(1).split() if m else []

def words_file(name):
    p = os.path.join(here, name)
    if not os.path.exists(p): return set()
    return {w.strip().lower() for w in open(p, encoding="utf8") if w.strip() and not w.startswith("#")}

rare_file = words_file("wheel_rare.txt")
main = set(lst("WHEEL_WORDS") + lst("WHEEL_UK") + lst("WHEEL_US")) | rare_file
keep = words_file("wheel_keep.txt")
rare = {w for w in main if zipf_frequency(w, "en") < RARE_ZIPF} | words_file("wheel_rare_manual.txt")
rare -= keep
with open(os.path.join(here, "wheel_rare.txt"), "w", encoding="utf8") as f:
    f.write("\n".join(sorted(rare)) + "\n")
print(len(rare), "rare words of", len(main))
