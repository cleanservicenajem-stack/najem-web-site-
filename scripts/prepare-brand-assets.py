"""
Prepare the official Najem Clean Service brand assets.

The official logo is supplied as a flattened PNG (white background version and
black background version). This script only removes the flat background and
crops the artwork — colours, shapes, typography and proportions are untouched.

Run: python3 scripts/prepare-brand-assets.py
"""

from __future__ import annotations

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images", "logo")
SRC_LIGHT = os.path.expanduser("~/Desktop/logo1.png")
SRC_DARK = os.path.expanduser("~/Desktop/83e9c5f6-ba3b-4592-855d-163223e184b6.png")

os.makedirs(OUT, exist_ok=True)


def key_out_white(img: Image.Image) -> Image.Image:
    """Turn a flat white background into transparency (un-multiplied over white)."""
    img = img.convert("RGB")
    px = img.load()
    w, h = img.size
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            m = min(r, g, b)
            a = 255 - m
            if a <= 6:
                op[x, y] = (0, 0, 0, 0)
                continue
            af = a / 255.0
            nr = int(round(max(0, min(255, (r - (255 - a)) / af))))
            ng = int(round(max(0, min(255, (g - (255 - a)) / af))))
            nb = int(round(max(0, min(255, (b - (255 - a)) / af))))
            op[x, y] = (nr, ng, nb, a)
    return out


def key_out_black(img: Image.Image) -> Image.Image:
    """Turn a flat black background into transparency (un-multiplied over black)."""
    img = img.convert("RGB")
    px = img.load()
    w, h = img.size
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            a = max(r, g, b)
            if a <= 6:
                op[x, y] = (0, 0, 0, 0)
                continue
            af = a / 255.0
            op[x, y] = (
                int(round(min(255, r / af))),
                int(round(min(255, g / af))),
                int(round(min(255, b / af))),
                a,
            )
    return out


def row_profile(img: Image.Image) -> list[int]:
    a = img.split()[3]
    w, h = img.size
    data = a.load()
    return [sum(1 for x in range(w) if data[x, y] > 24) for y in range(h)]


def trim(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.split()[3].getbbox()
    if not bbox:
        return img
    l, t, r, b = bbox
    w, h = img.size
    return img.crop((max(0, l - pad), max(0, t - pad), min(w, r + pad), min(h, b + pad)))


def split_mark_and_wordmark(img: Image.Image):
    """Find the horizontal gutter between the droplet symbol and the wordmark."""
    prof = row_profile(img)
    h = len(prof)
    # search the empty band in the middle third of the artwork
    start, end = int(h * 0.45), int(h * 0.72)
    best = None
    run_start = None
    for y in range(start, end):
        if prof[y] == 0:
            if run_start is None:
                run_start = y
        else:
            if run_start is not None:
                run = (run_start, y)
                if best is None or (run[1] - run[0]) > (best[1] - best[0]):
                    best = run
                run_start = None
    if run_start is not None:
        run = (run_start, end)
        if best is None or (run[1] - run[0]) > (best[1] - best[0]):
            best = run
    if best is None:
        raise SystemExit("Could not locate the gutter between symbol and wordmark")
    cut = (best[0] + best[1]) // 2
    w = img.size[0]
    return trim(img.crop((0, 0, w, cut))), trim(img.crop((0, cut, w, img.size[1])))


def drop_baseline(img: Image.Image):
    """Return the wordmark without its baseline (the small tagline line).

    Used only for the compact header lockup, where the tagline would render
    below 5px and become illegible. The full lockup keeps the baseline.
    """
    prof = row_profile(img)
    h = len(prof)
    gutters = []
    run_start = None
    for y in range(int(h * 0.5), h):
        if prof[y] == 0:
            if run_start is None:
                run_start = y
        elif run_start is not None:
            gutters.append((run_start, y))
            run_start = None
    if not gutters:
        return img
    last = gutters[-1]
    cut = (last[0] + last[1]) // 2
    return trim(img.crop((0, 0, img.size[0], cut)))


def save(img: Image.Image, name: str, width: int | None = None) -> None:
    out = img
    if width and img.size[0] != width:
        ratio = width / img.size[0]
        out = img.resize((width, max(1, int(round(img.size[1] * ratio)))), Image.LANCZOS)
    path = os.path.join(OUT, name)
    out.save(path, optimize=True)
    print(f"  {name}  {out.size[0]}x{out.size[1]}")


print("Light-surface artwork (from white background master)")
light = key_out_white(Image.open(SRC_LIGHT))
light_full = trim(light, 10)
save(light_full, "najem-logo.png", 900)
mark, wordmark = split_mark_and_wordmark(light)
save(mark, "najem-symbol.png", 512)
save(wordmark, "najem-wordmark.png", 900)
save(drop_baseline(wordmark), "najem-wordmark-compact.png", 760)

print("Dark-surface artwork (from black background master)")
dark = key_out_black(Image.open(SRC_DARK))
dark_full = trim(dark, 10)
save(dark_full, "najem-logo-dark.png", 900)
dmark, dwordmark = split_mark_and_wordmark(dark)
save(dmark, "najem-symbol-dark.png", 512)
save(dwordmark, "najem-wordmark-dark.png", 900)
save(drop_baseline(dwordmark), "najem-wordmark-compact-dark.png", 760)

print("Done.")
