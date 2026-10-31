import { categoriesTarifs } from '@/config/tarifs';
import type { DictionnaireAccueil } from '@/content/i18n/types';
import { montant, type CategorieAffichee } from '@/lib/tarifs';

/** Remplace les repères `{cle}` d'un texte traduit. */
export const remplacer = (texte: string, valeurs: Record<string, string>): string =>
  texte.replace(/\{(\w+)\}/g, (repere, cle: string) => valeurs[cle] ?? repere);

/** « 1 h 30 » → { heures: 1, minutes: 30 } ; `null` si la durée est illisible. */
export const lireDuree = (texte: string): { heures: number; minutes: number } | null => {
  const trouve = /(\d+)\s*h\s*(\d+)?/i.exec(texte);
  if (!trouve) return null;
  return { heures: Number(trouve[1]), minutes: trouve[2] ? Number(trouve[2]) : 0 };
};

export type LigneTraduite = {
  id: string;
  categorie: string;
  formule: string;
  detail: string;
  prix: string;
};

export type GrilleTraduite = {
  lignes: LigneTraduite[];
  /** Prix lisibles, en dirhams. */
  prixMin: number | null;
  prixMax: number | null;
  /** Une phrase par abonnement : « Studio… : 890 DH / mois (3 × … + 1 × …) ». */
  abonnements: string[];
};

/**
 * La grille de /tarifs, traduite : seuls les noms changent. Les prix et les
 * durées viennent de l'administration, comme sur la page française ; une
 * ligne dont le prix ou le nom traduit manque n'est pas affichée.
 */
export const traduireGrille = (
  grille: CategorieAffichee[],
  dico: DictionnaireAccueil,
): GrilleTraduite => {
  const lignes: LigneTraduite[] = [];
  const abonnements: string[] = [];
  const prix: number[] = [];

  for (const categorie of grille) {
    const nomCategorie = dico.grille.categories[categorie.id]?.titre;
    if (!nomCategorie) continue;

    for (const formule of categorie.formules) {
      const valeur = montant(formule.prix);
      const nom = dico.grille.formules[formule.id];
      if (valeur === null || !nom) continue;

      const duree = lireDuree(formule.duree);
      prix.push(valeur);
      lignes.push({
        id: formule.id,
        categorie: nomCategorie,
        formule: nom,
        detail: duree ? dico.duree(duree.heures, duree.minutes) : '',
        prix: dico.prix(valeur),
      });
    }

    const abonnement = categorie.abonnement;
    const prixMensuel = abonnement ? montant(abonnement.prix) : null;
    const inclus = categoriesTarifs.find((item) => item.id === categorie.id)?.abonnement?.inclus;

    if (abonnement && prixMensuel !== null && inclus) {
      const elements = inclus.flatMap(({ formule, quantite }) => {
        const nom = dico.grille.formules[formule];
        return nom ? [dico.quantite(quantite, nom)] : [];
      });

      if (elements.length === inclus.length) {
        const contenu = dico.abonnementContenu(elements);
        lignes.push({
          id: abonnement.id,
          categorie: nomCategorie,
          formule: dico.tarifs.abonnement,
          detail: contenu,
          prix: `${dico.prix(prixMensuel)} ${dico.tarifs.parMois}`,
        });
        abonnements.push(
          `${nomCategorie}: ${dico.prix(prixMensuel)} ${dico.tarifs.parMois} (${contenu}).`,
        );
      }
    }
  }

  return {
    lignes,
    prixMin: prix.length > 0 ? Math.min(...prix) : null,
    prixMax: prix.length > 0 ? Math.max(...prix) : null,
    abonnements,
  };
};
