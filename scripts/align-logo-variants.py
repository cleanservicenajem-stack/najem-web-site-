"""Aligne les dimensions des variantes sombres du logo sur les variantes claires.

Le détourage automatique produit des boîtes englobantes qui diffèrent de
quelques pixels entre la version claire et la version sombre du même artwork.
Next/Image compare alors deux ratios différents et émet un avertissement.

Ce script se contente d'ajouter des pixels transparents autour de l'artwork
sombre pour retrouver exactement la toile de la version claire : aucune
couleur, aucune forme, aucune proportion n'est modifiée.
"""

from pathlib import Path

from PIL import Image

LOGO_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "logo"

PAIRS = [
    ("najem-logo.png", "najem-logo-dark.png"),
    ("najem-symbol.png", "najem-symbol-dark.png"),
    ("najem-wordmark.png", "najem-wordmark-dark.png"),
    ("najem-wordmark-compact.png", "najem-wordmark-compact-dark.png"),
]


def pad_to(path: Path, size: tuple[int, int]) -> None:
    image = Image.open(path).convert("RGBA")
    if image.size == size:
        print(f"{path.name}: déjà aligné ({size[0]}x{size[1]})")
        return

    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
    canvas.save(path, optimize=True)
    print(f"{path.name}: {image.width}x{image.height} -> {size[0]}x{size[1]}")


def align(light: Path, dark: Path) -> None:
    with Image.open(light) as a, Image.open(dark) as b:
        size = (max(a.width, b.width), max(a.height, b.height))

    pad_to(light, size)
    pad_to(dark, size)


if __name__ == "__main__":
    for light_name, dark_name in PAIRS:
        align(LOGO_DIR / light_name, LOGO_DIR / dark_name)
