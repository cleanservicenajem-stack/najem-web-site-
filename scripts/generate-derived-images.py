"""
Generate the derived image assets (favicons, social card, app screen placeholders).

Everything is built from the official logo artwork; nothing about the logo itself
is redrawn or recoloured. Re-run after replacing the source logo.

Run: python3 scripts/generate-derived-images.py
"""

from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_DIR = os.path.join(ROOT, "public", "images", "logo")
APP_DIR = os.path.join(ROOT, "public", "images", "app")
APP_ROUTE = os.path.join(ROOT, "app")

NAVY = (4, 68, 138)
BLUE = (10, 111, 207)
SKY = (23, 168, 238)
TEAL = (33, 195, 182)
PAPER = (246, 250, 253)

os.makedirs(APP_DIR, exist_ok=True)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default(size)


def linear_gradient(size, start, end, angle_vertical: bool = True) -> Image.Image:
    w, h = size
    base = Image.new("RGB", (1, h) if angle_vertical else (w, 1))
    d = base.load()
    n = h if angle_vertical else w
    for i in range(n):
        t = i / max(1, n - 1)
        col = tuple(int(round(start[c] + (end[c] - start[c]) * t)) for c in range(3))
        if angle_vertical:
            d[0, i] = col
        else:
            d[i, 0] = col
    return base.resize((w, h), Image.BILINEAR)


def radial_glow(size, colour, centre, radius, strength=0.55) -> Image.Image:
    w, h = size
    layer = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(layer)
    cx, cy = centre
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=int(255 * strength))
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.55))
    glow = Image.new("RGB", (w, h), colour)
    glow.putalpha(layer)
    return glow


def fit(img: Image.Image, box_w: int, box_h: int) -> Image.Image:
    ratio = min(box_w / img.size[0], box_h / img.size[1])
    return img.resize(
        (max(1, int(img.size[0] * ratio)), max(1, int(img.size[1] * ratio))), Image.LANCZOS
    )


def rounded_mask(size, radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


symbol = Image.open(os.path.join(LOGO_DIR, "najem-symbol.png")).convert("RGBA")
full_logo = Image.open(os.path.join(LOGO_DIR, "najem-logo.png")).convert("RGBA")


# --- favicon / app icons -----------------------------------------------------
def build_icon(size: int, radius_ratio: float, background=(255, 255, 255)) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    plate = Image.new("RGBA", (size, size), background + (255,))
    canvas.paste(plate, (0, 0), rounded_mask((size, size), int(size * radius_ratio)))
    art = fit(symbol, int(size * 0.72), int(size * 0.72))
    canvas.alpha_composite(art, ((size - art.size[0]) // 2, (size - art.size[1]) // 2))
    return canvas


def make_icon(size: int, radius_ratio: float, out_path: str, background=(255, 255, 255)) -> None:
    build_icon(size, radius_ratio, background).save(out_path, optimize=True)
    print(f"  {os.path.relpath(out_path, ROOT)}  {size}x{size}")


def make_favicon(out_path: str) -> None:
    """favicon.ico multi-tailles pour les navigateurs qui le demandent encore."""
    build_icon(256, 0.0).save(out_path, sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  {os.path.relpath(out_path, ROOT)}  16/32/48")


make_icon(512, 0.0, os.path.join(APP_ROUTE, "icon.png"))
make_icon(180, 0.0, os.path.join(APP_ROUTE, "apple-icon.png"))
make_icon(512, 0.0, os.path.join(ROOT, "public", "icons", "icon-512.png"))
make_icon(192, 0.0, os.path.join(ROOT, "public", "icons", "icon-192.png"))
make_favicon(os.path.join(APP_ROUTE, "favicon.ico"))


# --- social card -------------------------------------------------------------
def make_og() -> None:
    w, h = 1200, 630
    card = linear_gradient((w, h), (255, 255, 255), PAPER).convert("RGBA")
    card.alpha_composite(radial_glow((w, h), SKY, (140, 90), 420, 0.20))
    card.alpha_composite(radial_glow((w, h), TEAL, (1080, 560), 380, 0.16))

    draw = ImageDraw.Draw(card)
    for i in range(3):
        y = 470 + i * 26
        draw.arc((-240, y - 180, w + 240, y + 320), 200, 340, fill=(SKY[0], SKY[1], SKY[2], 40), width=3)

    art = fit(full_logo, 620, 430)
    card.alpha_composite(art, ((w - art.size[0]) // 2, (h - art.size[1]) // 2 - 26))

    label = "SERVICES DE NETTOYAGE À DOMICILE  ·  iOS & ANDROID"
    f = font(23, bold=True)
    tw = draw.textlength(label, font=f)
    draw.text(((w - tw) / 2, h - 86), label, font=f, fill=NAVY + (210,))
    draw.rounded_rectangle((w / 2 - 60, h - 44, w / 2 + 60, h - 40), 2, fill=BLUE + (255,))

    out = os.path.join(ROOT, "public", "images", "og", "og-default.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    card.convert("RGB").save(out, optimize=True, quality=92)
    print(f"  {os.path.relpath(out, ROOT)}  {w}x{h}")


make_og()


# --- app screen mockups ------------------------------------------------------
# Les visuels d'application sont désormais de vraies captures fournies par le
# client. Elles sont préparées par `scripts/prepare-app-screens.py` et ne
# doivent surtout pas être régénérées ici : ce script les écraserait.


# --- blog covers -------------------------------------------------------------
# Visuels décoratifs (aucune photographie synthétique) aux couleurs de la marque.
def make_blog_cover(name: str, label: str, tint, arc_shift: int) -> None:
    w, h = 1200, 675
    cover = linear_gradient((w, h), (255, 255, 255), PAPER).convert("RGBA")
    cover.alpha_composite(radial_glow((w, h), tint, (int(w * 0.78), int(h * 0.2)), 420, 0.30))
    cover.alpha_composite(radial_glow((w, h), TEAL, (int(w * 0.12), int(h * 0.95)), 380, 0.16))

    draw = ImageDraw.Draw(cover)
    for i in range(5):
        y = 300 + arc_shift + i * 34
        draw.arc(
            (-320, y - 260, w + 320, y + 420),
            200,
            340,
            fill=(BLUE[0], BLUE[1], BLUE[2], 46 - i * 6),
            width=2,
        )

    art = fit(symbol, 210, 210)
    faded = art.copy()
    faded.putalpha(art.split()[3].point(lambda v: int(v * 0.92)))
    cover.alpha_composite(faded, (int(w * 0.72), int(h * 0.28)))

    f = font(26, bold=True)
    draw.text((72, h - 96), label.upper(), font=f, fill=NAVY + (190,))
    draw.rounded_rectangle((72, h - 56, 132, h - 52), 2, fill=BLUE + (255,))

    out = os.path.join(ROOT, "public", "images", "blog", name)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cover.convert("RGB").save(out, optimize=True, quality=90)
    print(f"  {os.path.relpath(out, ROOT)}  {w}x{h}")


make_blog_cover("cover-organisation.png", "Organisation", SKY, 0)
make_blog_cover("cover-entretien.png", "Entretien maison", BLUE, 40)
make_blog_cover("cover-pratique.png", "Conseils pratiques", TEAL, -40)

print("Done.")
