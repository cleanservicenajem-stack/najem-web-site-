/**
 * Lecture de la grille tarifaire affichée sur /tarifs.
 *
 * Chaque valeur vient de l'administration si elle y a été enregistrée, sinon
 * de `config/tarifs.ts`. Aucun prix n'est calculé ni deviné : seule l'économie
 * des abonnements est déduite des prix affichés, et elle disparaît dès qu'un
 * montant n'est pas lisible.
 */

import { categoriesTarifs, type CategorieTarif } from '@/config/tarifs';
import { getContenu, getTexte } from '@/lib/content';

export type LigneOption = { libelle: string; prix: string };

export type FormuleAffichee = {
  id: string;
  nom: string;
  description: string;
  prix: string;
  duree: string;
  options: LigneOption[];
};

export type AbonnementAffiche = {
  id: string;
  prix: string;
  contenu: string;
  /** Économie mensuelle par rapport aux mêmes formules réservées à l'unité. */
  economie: number | null;
};

export type CategorieAffichee = Pick<CategorieTarif, 'id' | 'titre' | 'precision'> & {
  formules: FormuleAffichee[];
  abonnement: AbonnementAffiche | null;
};

/** « 1 490 DH » → 1490 ; `null` si aucun montant n'est lisible. */
export const montant = (texte: string): number | null => {
  const chiffres = texte.replace(/[^\d]/g, '');
  if (!chiffres) return null;
  const valeur = Number(chiffres);
  return Number.isFinite(valeur) && valeur > 0 ? valeur : null;
};

/** 1490 → « 1 490 DH ». */
export const formaterDh = (valeur: number): string =>
  `${new Intl.NumberFormat('fr-FR').format(valeur)} DH`;

/** « Repassage : +80 DH ; Terrasse ou balcon : +80 DH » → lignes d'options. */
export const lireOptions = (brut: string): LigneOption[] =>
  brut
    .split(';')
    .map((morceau) => morceau.trim())
    .filter((morceau) => morceau.length > 0)
    .map((morceau) => {
      const separateur = morceau.lastIndexOf(':');
      if (separateur <= 0) return { libelle: morceau, prix: '' };
      return {
        libelle: morceau.slice(0, separateur).trim(),
        prix: morceau.slice(separateur + 1).trim(),
      };
    });

/**
 * Options d'une formule. Contrairement aux autres textes, une liste vidée dans
 * l'administration doit rester vide : elle ne revient pas à la valeur du code.
 */
const lireOptionsEnregistrees = async (cle: string, repli: string): Promise<string> => {
  const contenu = await getContenu();
  const enregistre = contenu[cle];
  return typeof enregistre === 'string' ? enregistre.trim() : repli;
};

export const getGrilleTarifaire = async (): Promise<CategorieAffichee[]> =>
  Promise.all(
    categoriesTarifs.map(async (categorie) => {
      const formules: FormuleAffichee[] = await Promise.all(
        categorie.formules.map(async (formule) => {
          const [prix, duree, options] = await Promise.all([
            getTexte(`tarifs.${formule.id}.prix`),
            getTexte(`tarifs.${formule.id}.duree`),
            lireOptionsEnregistrees(`tarifs.${formule.id}.options`, formule.options),
          ]);
          return {
            id: formule.id,
            nom: formule.nom,
            description: formule.description,
            prix,
            duree,
            options: lireOptions(options),
          };
        }),
      );

      let abonnement: AbonnementAffiche | null = null;

      if (categorie.abonnement) {
        const { id, inclus } = categorie.abonnement;
        const [prix, contenu] = await Promise.all([
          getTexte(`tarifs.${id}.prix`),
          getTexte(`tarifs.${id}.contenu`),
        ]);

        const prixMensuel = montant(prix);
        const prixAlUnite = inclus.reduce<number | null>((total, { formule, quantite }) => {
          if (total === null) return null;
          const prixFormule = montant(formules.find((item) => item.id === formule)?.prix ?? '');
          return prixFormule === null ? null : total + prixFormule * quantite;
        }, 0);

        const economie =
          prixMensuel !== null && prixAlUnite !== null && prixAlUnite > prixMensuel
            ? prixAlUnite - prixMensuel
            : null;

        abonnement = { id, prix, contenu, economie };
      }

      return {
        id: categorie.id,
        titre: categorie.titre,
        precision: categorie.precision,
        formules,
        abonnement,
      };
    }),
  );
