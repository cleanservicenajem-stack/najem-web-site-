import { notFound } from 'next/navigation';
import { categoriesTarifs } from '@/config/tarifs';
import { estLangueTraduite, type LangueTraduite } from '@/config/i18n';
import type { TextesCommuns } from '@/content/i18n/commun';
import { montant, type CategorieAffichee } from '@/lib/tarifs';

/**
 * Langue d'une page traduite, lue dans l'adresse (/ar/…, /en/…). Toute autre
 * valeur aboutit à une page introuvable.
 */
export const lireLangue = async (params: Promise<{ langue: string }>): Promise<LangueTraduite> => {
  const { langue } = await params;
  if (estLangueTraduite(langue)) return langue;
  return notFound();
};

/** Remplace les repères `{cle}` d'un texte traduit. */
export const remplacer = (texte: string, valeurs: Record<string, string>): string =>
  texte.replace(/\{(\w+)\}/g, (repere, cle: string) => valeurs[cle] ?? repere);

/** « 1 h 30 » → { heures: 1, minutes: 30 } ; `null` si la durée est illisible. */
export const lireDuree = (texte: string): { heures: number; minutes: number } | null => {
  const trouve = /(\d+)\s*h\s*(\d+)?/i.exec(texte);
  if (!trouve) return null;
  return { heures: Number(trouve[1]), minutes: trouve[2] ? Number(trouve[2]) : 0 };
};

/** Durée de l'administration (« 1 h 30 ») traduite ; vide si elle est illisible. */
export const traduireDuree = (texte: string, commun: TextesCommuns): string => {
  const duree = lireDuree(texte);
  return duree ? commun.duree(duree.heures, duree.minutes) : '';
};

/** Libellé d'option traduit ; le libellé français s'il n'a pas de traduction. */
export const traduireOption = (libelle: string, commun: TextesCommuns): string => {
  const traduit = commun.options[libelle.trim()];
  // L'application est en français : son libellé reste visible pour la retrouver.
  return traduit ? `${traduit} (${libelle.trim()})` : libelle;
};

/** « +150 DH » → « +150 درهم » ; le texte d'origine s'il est illisible. */
export const traduirePrixOption = (prix: string, commun: TextesCommuns): string => {
  const valeur = montant(prix);
  return valeur === null ? prix : `+${commun.prix(valeur)}`;
};

export type LigneTraduite = {
  id: string;
  /** Identifiant de la catégorie (config/tarifs.ts). */
  categorieId: string;
  categorie: string;
  formule: string;
  detail: string;
  prix: string;
  /** Montant en dirhams, pour les calculs et les données structurées. */
  valeur: number;
  abonnement: boolean;
};

export type GrilleTraduite = {
  lignes: LigneTraduite[];
  /** Prix des formules (hors abonnements), en dirhams. */
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
  commun: TextesCommuns,
): GrilleTraduite => {
  const lignes: LigneTraduite[] = [];
  const abonnements: string[] = [];
  const prix: number[] = [];

  for (const categorie of grille) {
    const nomCategorie = commun.grille.categories[categorie.id]?.titre;
    if (!nomCategorie) continue;

    for (const formule of categorie.formules) {
      const valeur = montant(formule.prix);
      const nom = commun.grille.formules[formule.id];
      if (valeur === null || !nom) continue;

      prix.push(valeur);
      lignes.push({
        id: formule.id,
        categorieId: categorie.id,
        categorie: nomCategorie,
        // Nom de la formule dans l'application (en français), pour la retrouver.
        formule: `${nom} (${formule.nom})`,
        detail: traduireDuree(formule.duree, commun),
        prix: commun.prix(valeur),
        valeur,
        abonnement: false,
      });
    }

    const abonnement = categorie.abonnement;
    const prixMensuel = abonnement ? montant(abonnement.prix) : null;
    const inclus = categoriesTarifs.find((item) => item.id === categorie.id)?.abonnement?.inclus;

    if (abonnement && prixMensuel !== null && inclus) {
      const elements = inclus.flatMap(({ formule, quantite }) => {
        const nom = commun.grille.formules[formule];
        return nom ? [commun.quantite(quantite, nom)] : [];
      });

      if (elements.length === inclus.length) {
        const contenu = commun.abonnementContenu(elements);
        lignes.push({
          id: abonnement.id,
          categorieId: categorie.id,
          categorie: nomCategorie,
          formule: `${commun.abonnement} (Abonnement mensuel)`,
          detail: contenu,
          prix: `${commun.prix(prixMensuel)} ${commun.parMois}`,
          valeur: prixMensuel,
          abonnement: true,
        });
        abonnements.push(
          `${nomCategorie}: ${commun.prix(prixMensuel)} ${commun.parMois} (${contenu}).`,
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
