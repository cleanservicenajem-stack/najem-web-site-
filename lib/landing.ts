/**
 * Lecture de la grille tarifaire pour les pages d'atterrissage
 * (« Femme de ménage à Casablanca », « Nettoyage canapé et tapis »…).
 *
 * Aucun prix n'est écrit en dur dans ces pages : tout est relu dans la grille
 * de `/tarifs` (et donc dans l'administration). Si un prix devient illisible,
 * la phrase qui l'utilise disparaît plutôt que d'annoncer un chiffre faux.
 */

import {
  montant,
  type CategorieAffichee,
  type FormuleAffichee,
} from '@/lib/tarifs';

/** Quartiers cités en exemple : Casablanca est couverte dans son ensemble. */
export const quartiersCasablanca = [
  'Maarif',
  'Gauthier',
  'Racine',
  'Bourgogne',
  'Anfa',
  'Ain Diab',
  'Californie',
  'Oasis',
  'Sidi Maarouf',
  'Hay Hassani',
  'Ain Sebaa',
  'Belvédère',
] as const;

export type FormuleSituee = {
  formule: FormuleAffichee;
  categorie: CategorieAffichee;
  prix: number;
};

/** Toutes les formules dont le prix est lisible, de la moins chère à la plus chère. */
export const formulesTriees = (grille: CategorieAffichee[]): FormuleSituee[] =>
  grille
    .flatMap((categorie) =>
      categorie.formules.map((formule) => ({ formule, categorie, prix: montant(formule.prix) })),
    )
    .filter((item): item is FormuleSituee => item.prix !== null)
    .sort((a, b) => a.prix - b.prix);

/** Prix le plus bas et le plus haut de la grille, en dirhams. */
export const fourchette = (grille: CategorieAffichee[]): { min: number; max: number } | null => {
  const triees = formulesTriees(grille);
  if (triees.length === 0) return null;
  return { min: triees[0]!.prix, max: triees[triees.length - 1]!.prix };
};

/** Formule retrouvée par son identifiant (« studio-complet », « grand-menage »…). */
export const formuleParId = (
  grille: CategorieAffichee[],
  id: string,
): FormuleSituee | null => {
  for (const categorie of grille) {
    const formule = categorie.formules.find((item) => item.id === id);
    const prix = formule ? montant(formule.prix) : null;
    if (formule && prix !== null) return { formule, categorie, prix };
  }
  return null;
};

export type OptionSituee = {
  formule: FormuleAffichee;
  categorie: CategorieAffichee;
  libelle: string;
  prix: number;
};

/**
 * Options dont le libellé contient l'un des mots donnés, par exemple
 * « canapé » pour la shampouineuse canapé et tapis.
 */
export const optionsContenant = (
  grille: CategorieAffichee[],
  mots: string[],
): OptionSituee[] => {
  const cibles = mots.map((mot) => mot.toLocaleLowerCase('fr'));
  const resultat: OptionSituee[] = [];

  for (const categorie of grille) {
    for (const formule of categorie.formules) {
      for (const option of formule.options) {
        const libelle = option.libelle.toLocaleLowerCase('fr');
        const prix = montant(option.prix);
        if (prix !== null && cibles.some((cible) => libelle.includes(cible))) {
          resultat.push({ formule, categorie, libelle: option.libelle, prix });
        }
      }
    }
  }

  return resultat;
};
