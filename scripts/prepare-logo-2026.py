"""
Préparer les fichiers du logo Najem Clean Service (version d'octobre 2026).

Source : le logo fourni par l'entreprise, un PNG carré sur fond blanc uni
(symbole « N » avec maison, balayage et étoiles, puis « NAJEM » et
« CLEAN SERVICE »).

Ce script :
1. détoure le fond blanc (alpha calculé à partir du blanc, couleurs
   « dé-multipliées » pour des bords nets sur n'importe quel fond) ;
2. supprime le bruit très pâle isolé autour du dessin ;
3. découpe le symbole, le bloc typographique et le logo complet ;
4. crée la variante pour fond sombre : le bleu marine passe au blanc, les
   bleus vifs (maison, balayage, étoiles, « CLEAN SERVICE ») restent tels
   quels. Aucune forme ni typographie n'est redessinée.

Les noms de fichiers sont ceux qu'attend `components/ui/Logo.tsx`.

Run: python3 scripts/prepare-logo-2026.py <chemin/du/logo.png>
Puis : python3 scripts/generate-derived-images.py (favicons, carte sociale).
"""

from __future__ import annotations

import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images", "logo")

# Couleurs relevées dans le fichier source.
MARINE = np.array([14.0, 34.0, 61.0])
BLEU = np.array([5.0, 154.0, 240.0])
BLANC = np.array([255.0, 255.0, 255.0])

MARGE = 8  # pixels transparents autour de chaque découpe


def detourer(source: Image.Image) -> np.ndarray:
    """Fond blanc → transparence. Retourne un tableau RGBA en float (0–255)."""
    rgb = np.asarray(source.convert("RGB")).astype(np.float64)
    alpha = 255.0 - rgb.min(axis=2)

    # Le fond n'est pas parfaitement blanc (254, avec un léger bruit) : tout ce
    # qui est très pâle devient transparent, le reste est réétalé sur 0–255.
    seuil = 10.0
    alpha = np.clip((alpha - seuil) * 255.0 / (255.0 - seuil), 0, 255)

    # Bruit isolé : on ne garde l'alpha qu'au voisinage du dessin réel.
    dessin = Image.fromarray(((alpha > 60) * 255).astype(np.uint8))
    voisinage = np.asarray(dessin.filter(ImageFilter.MaxFilter(7))) > 0
    alpha[~voisinage] = 0

    # Couleur d'origine retrouvée sous l'alpha (composition inverse sur blanc).
    a = (alpha / 255.0)[..., None]
    with np.errstate(divide="ignore", invalid="ignore"):
        couleur = np.where(a > 0, (rgb - (1 - a) * 255.0) / a, 0)
    couleur = np.clip(couleur, 0, 255)

    return np.dstack([couleur, alpha])


def version_sombre(rgba: np.ndarray) -> np.ndarray:
    """Le bleu marine devient blanc, proportionnellement ; les bleus vifs restent."""
    couleur = rgba[..., :3]
    axe = BLEU - MARINE
    t = ((couleur - MARINE) @ axe) / (axe @ axe)
    t = np.clip(t, 0, 1)[..., None]
    # t = 0 : bleu marine pur → blanc ; t = 1 : bleu vif, inchangé.
    nouvelle = (1 - t) * BLANC + t * couleur
    nouvelle = np.clip(nouvelle, 0, 255)
    return np.dstack([nouvelle, rgba[..., 3]])


def boite(rgba: np.ndarray, y0: int, y1: int) -> tuple[int, int, int, int]:
    """Cadre serré du dessin entre deux lignes, marge comprise."""
    bande = rgba[y0 : y1 + 1, :, 3] > 0
    ys, xs = np.where(bande)
    h, w = rgba.shape[:2]
    return (
        max(0, xs.min() - MARGE),
        max(0, y0 + ys.min() - MARGE),
        min(w, xs.max() + 1 + MARGE),
        min(h, y0 + ys.max() + 1 + MARGE),
    )


def bandes(rgba: np.ndarray) -> list[tuple[int, int]]:
    """Suites de lignes contenant du dessin, de haut en bas."""
    lignes = (rgba[..., 3] > 0).any(axis=1)
    resultat, debut = [], None
    for y, plein in enumerate(lignes):
        if plein and debut is None:
            debut = y
        if not plein and debut is not None:
            resultat.append((debut, y - 1))
            debut = None
    if debut is not None:
        resultat.append((debut, len(lignes) - 1))
    return resultat


def enregistrer(rgba: np.ndarray, cadre: tuple[int, int, int, int], nom: str) -> None:
    x0, y0, x1, y1 = cadre
    image = Image.fromarray(np.round(rgba[y0:y1, x0:x1]).astype(np.uint8), "RGBA")
    chemin = os.path.join(OUT, nom)
    image.save(chemin, optimize=True)
    print(f"  {os.path.relpath(chemin, ROOT)}  {image.size[0]}x{image.size[1]}")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Usage : python3 scripts/prepare-logo-2026.py <logo.png>")

    clair = detourer(Image.open(sys.argv[1]))
    sombre = version_sombre(clair)

    # Trois bandes attendues : le symbole, « NAJEM », « CLEAN SERVICE ».
    groupes = bandes(clair)
    if len(groupes) < 3:
        sys.exit(f"Découpage inattendu : {groupes}")
    symbole = (groupes[0][0], groupes[0][1])
    typo = (groupes[1][0], groupes[-1][1])
    complet = (groupes[0][0], groupes[-1][1])

    os.makedirs(OUT, exist_ok=True)
    for rgba, suffixe in ((clair, ""), (sombre, "-dark")):
        enregistrer(rgba, boite(rgba, *complet), f"najem-logo{suffixe}.png")
        enregistrer(rgba, boite(rgba, *symbole), f"najem-symbol{suffixe}.png")
        enregistrer(rgba, boite(rgba, *typo), f"najem-wordmark{suffixe}.png")
        enregistrer(rgba, boite(rgba, *typo), f"najem-wordmark-compact{suffixe}.png")


if __name__ == "__main__":
    main()
