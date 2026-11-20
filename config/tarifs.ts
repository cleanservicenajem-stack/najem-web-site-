/**
 * Grille tarifaire affichée sur /tarifs.
 *
 * Source : grille unifiée de l'application Najem Clean Service du 20 novembre
 * 2026 (RECAP-PRIX-2026-11-20, l'application fait foi). Seules les formules
 * actives dans l'application figurent ici : « Intervention urgente » et
 * l'abonnement 8 passages des très grands logements y sont désactivés, ils ne
 * sont donc pas affichés.
 *
 * Ces valeurs ne servent que de repli : chaque prix, durée et liste d'options
 * reste modifiable depuis l'administration (groupe « Tarifs »).
 *
 * Format des options : une seule ligne, chaque option séparée par un
 * point-virgule, au format « Libellé : prix ». L'administration ne conserve pas
 * les retours à la ligne, d'où ce séparateur.
 */

export type Formule = {
  id: string;
  nom: string;
  description: string;
  /** Repli du prix, par exemple « 200 DH ». */
  prix: string;
  /** Repli de la durée, par exemple « 1 h ». */
  duree: string;
  /** Repli des options, « Libellé : +prix ; Libellé : +prix ». Vide = aucune option. */
  options: string;
};

export type Abonnement = {
  id: string;
  /** Nombre d'interventions comprises chaque mois (4 ou 8). */
  passages: number;
  /** Repli du prix mensuel, par exemple « 890 DH ». */
  prix: string;
  /** Repli du contenu, par exemple « 3 ménages express + 1 ménage complet par mois ». */
  contenu: string;
  /** Formules comprises, pour calculer l'économie par rapport à la réservation à l'unité. */
  inclus: { formule: string; quantite: number }[];
};

export type CategorieTarif = {
  id: string;
  titre: string;
  precision: string;
  formules: Formule[];
  /** Abonnements mensuels de la catégorie, du plus petit au plus grand. */
  abonnements: Abonnement[];
};

const OPTIONS_STUDIO =
  'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Terrasse ou balcon : +80 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +80 DH';

/** Options des logements de plus d'une chambre ; seul le lavage de linge change de prix. */
const optionsLogement = (lavageLinge: string) =>
  `Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : ${lavageLinge}`;

export const categoriesTarifs: CategorieTarif[] = [
  {
    id: 'studio',
    titre: 'Studio et petit appartement',
    precision: 'Jusqu’à 2 pièces',
    formules: [
      {
        id: 'studio-express',
        nom: 'Ménage express',
        description:
          'Un coup de fraîcheur rapide et efficace pour les studios et les petits appartements.',
        prix: '200 DH',
        duree: '1 h',
        options: OPTIONS_STUDIO,
      },
      {
        id: 'studio-complet',
        nom: 'Ménage complet',
        description:
          'Un ménage en profondeur pour les studios et les petits appartements, pour un intérieur impeccable.',
        prix: '300 DH',
        duree: '2 h',
        options: OPTIONS_STUDIO,
      },
    ],
    abonnements: [
      {
        id: 'abonnement-studio-4',
        passages: 4,
        prix: '810 DH',
        contenu: '3 ménages express et 1 ménage complet chaque mois',
        inclus: [
          { formule: 'studio-express', quantite: 3 },
          { formule: 'studio-complet', quantite: 1 },
        ],
      },
      {
        id: 'abonnement-studio-8',
        passages: 8,
        prix: '1 590 DH',
        contenu: '6 ménages express et 2 ménages complets chaque mois',
        inclus: [
          { formule: 'studio-express', quantite: 6 },
          { formule: 'studio-complet', quantite: 2 },
        ],
      },
    ],
  },
  {
    id: 'appartement',
    titre: 'Appartement',
    precision: 'Jusqu’à 3 chambres',
    formules: [
      {
        id: 'appartement-express',
        nom: 'Ménage express',
        description: 'Un entretien rapide et efficace pour les appartements jusqu’à 3 chambres.',
        prix: '250 DH',
        duree: '1 h 15',
        options: optionsLogement('+150 DH'),
      },
      {
        id: 'appartement-complet',
        nom: 'Ménage complet',
        description:
          'Un ménage en profondeur pour les appartements jusqu’à 3 chambres, pour un intérieur impeccable.',
        prix: '380 DH',
        duree: '2 h 30',
        options: optionsLogement('+150 DH'),
      },
    ],
    abonnements: [
      {
        id: 'abonnement-appartement-4',
        passages: 4,
        prix: '990 DH',
        contenu: '3 ménages express et 1 ménage complet chaque mois',
        inclus: [
          { formule: 'appartement-express', quantite: 3 },
          { formule: 'appartement-complet', quantite: 1 },
        ],
      },
      {
        id: 'abonnement-appartement-8',
        passages: 8,
        prix: '1 990 DH',
        contenu: '6 ménages express et 2 ménages complets chaque mois',
        inclus: [
          { formule: 'appartement-express', quantite: 6 },
          { formule: 'appartement-complet', quantite: 2 },
        ],
      },
    ],
  },
  {
    id: 'grand',
    titre: 'Grand appartement et villa',
    precision: 'Jusqu’à 5 chambres',
    formules: [
      {
        id: 'grand-express',
        nom: 'Ménage express',
        description:
          'Un ménage rapide et efficace pour les grands espaces, idéal entre deux réservations.',
        prix: '300 DH',
        duree: '1 h 30',
        options: optionsLogement('+200 DH'),
      },
      {
        id: 'grand-menage',
        nom: 'Ménage complet',
        description:
          'Un ménage complet pour les grands appartements et les villas jusqu’à 5 chambres.',
        prix: '450 DH',
        duree: '3 h',
        options: optionsLogement('+200 DH'),
      },
    ],
    abonnements: [
      {
        id: 'abonnement-grand-4',
        passages: 4,
        prix: '1 190 DH',
        contenu: '3 ménages express et 1 ménage complet chaque mois',
        inclus: [
          { formule: 'grand-express', quantite: 3 },
          { formule: 'grand-menage', quantite: 1 },
        ],
      },
      {
        id: 'abonnement-grand-8',
        passages: 8,
        prix: '2 390 DH',
        contenu: '6 ménages express et 2 ménages complets chaque mois',
        inclus: [
          { formule: 'grand-express', quantite: 6 },
          { formule: 'grand-menage', quantite: 2 },
        ],
      },
    ],
  },
  {
    id: 'tres-grand',
    titre: 'Très grand logement',
    precision: 'Plus de 5 chambres',
    formules: [
      {
        id: 'tres-grand-express',
        nom: 'Ménage express',
        description: 'Un entretien rapide pour les très grandes propriétés.',
        prix: '350 DH',
        duree: '2 h',
        options: optionsLogement('+200 DH'),
      },
      {
        id: 'tres-grand-complet',
        nom: 'Ménage complet',
        description: 'Un ménage en profondeur pour les villas de plus de 5 chambres.',
        prix: '600 DH',
        duree: '4 h',
        options: optionsLogement('+200 DH'),
      },
      {
        id: 'tres-grand-prestige',
        nom: 'Ménage prestige',
        description:
          'Notre formule la plus complète, pensée pour les grandes villas et les logements haut standing.',
        prix: '700 DH',
        duree: '4 h 30',
        options: optionsLogement('+200 DH'),
      },
    ],
    abonnements: [
      {
        id: 'abonnement-tres-grand-4',
        passages: 4,
        prix: '1 590 DH',
        contenu: '3 ménages express et 1 ménage prestige chaque mois',
        inclus: [
          { formule: 'tres-grand-express', quantite: 3 },
          { formule: 'tres-grand-prestige', quantite: 1 },
        ],
      },
    ],
  },
];
