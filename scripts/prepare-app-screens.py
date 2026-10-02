"""Prépare les captures réelles de l'application pour le site.

Les captures fournies sont des captures d'écran iPhone brutes : elles portent
la barre d'état du système (heure, réseau, batterie) et le lien « ◀ App Store »
laissé par le retour depuis l'App Store. Ces éléments n'ont rien à faire dans
un mockup de site vitrine, et ils entrent en collision avec l'îlot de caméra
que `PhoneFrame` dessine au même endroit.

Le script retire cette bande puis restitue la hauteur d'origine en prolongeant
la première ligne de contenu vers le haut. Le format de l'image est donc
strictement conservé (aucune déformation), et la zone rendue sous l'îlot de
caméra prend la couleur du haut de l'écran de l'application.

Aucun retraitement colorimétrique : les couleurs de l'application sont
laissées telles quelles.

Lancer : python3 scripts/prepare-app-screens.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "app"
SRC = Path.home() / ".cursor/projects/Users-user-Desktop-Najem-clean-service/assets"

# Hauteur de la barre d'état, mesurée sur les captures : le contenu de
# l'application commence en dessous sur les trois écrans.
STATUS_BAR_HEIGHT = 66

# Zones à anonymiser : l'écran de suivi affiche l'adresse d'une réservation
# cliente, lisible à taille réelle sur un fichier public. Coordonnées en pixels
# de la capture (la préparation ne décale pas le contenu).
BLUR_ZONES = {
    "app-screen-3.png": [(116, 532, 412, 558), (116, 700, 412, 726)],
}

# L'ordre suit l'usage dans les pages : accueil (héros), réservation, suivi.
SCREENS = [
    ("WhatsApp_Image_2026-09-10_at_19.46.56-a731cae2-3d2c-4b2c-b477-607605c6c46d.jpg", "app-screen-1.png"),
    ("WhatsApp_Image_2026-09-10_at_19.47.29__1_-4d768290-6b21-4fc2-b9f7-719b78781c0b.jpg", "app-screen-2.png"),
    ("WhatsApp_Image_2026-09-10_at_19.47.29-b56a9b16-2adc-4420-86be-de90859ccfdb.jpg", "app-screen-3.png"),
]


def strip_status_bar(image: Image.Image, height: int) -> Image.Image:
    """Retire la bande du haut et prolonge la première ligne conservée."""
    width, full_height = image.size
    content = image.crop((0, height, width, full_height))

    canvas = Image.new("RGB", (width, full_height))
    # La première ligne de contenu est étirée pour combler la bande retirée.
    canvas.paste(content.crop((0, 0, width, 1)).resize((width, height)), (0, 0))
    canvas.paste(content, (0, height))
    return canvas


def anonymise(image: Image.Image, zones: list[tuple[int, int, int, int]]) -> Image.Image:
    """Rend illisibles les zones portant une donnée client."""
    for zone in zones:
        image.paste(image.crop(zone).filter(ImageFilter.GaussianBlur(7)), zone)
    return image


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)

    for source_name, target_name in SCREENS:
        source = SRC / source_name
        if not source.exists():
            raise SystemExit(f"Capture introuvable : {source}")

        with Image.open(source) as raw:
            prepared = strip_status_bar(raw.convert("RGB"), STATUS_BAR_HEIGHT)

        prepared = anonymise(prepared, BLUR_ZONES.get(target_name, []))

        target = OUT / target_name
        prepared.save(target, optimize=True)
        size_ko = target.stat().st_size // 1024
        print(f"  {target_name}  {prepared.width}x{prepared.height}  {size_ko} Ko")

    print("Terminé.")
