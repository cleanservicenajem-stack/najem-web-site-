"""Sample the dominant colours of the official logo so the design system matches it."""

import os
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def report(path: str, label: str) -> None:
    img = Image.open(os.path.join(ROOT, path)).convert("RGBA")
    img = img.resize((img.size[0] // 2, img.size[1] // 2))
    counter: Counter = Counter()
    for r, g, b, a in img.getdata():
        if a < 220:
            continue
        counter[(r // 8 * 8, g // 8 * 8, b // 8 * 8)] += 1
    print(f"\n{label}")
    for (r, g, b), n in counter.most_common(14):
        print(f"  #{r:02X}{g:02X}{b:02X}  {n}")


report("public/images/logo/najem-symbol.png", "Symbol")
report("public/images/logo/najem-wordmark.png", "Wordmark")
