/**
 * Grille tarifaire affichée sur /tarifs.
 *
 * Source : l'application Najem Clean Service, grille unifiée du 20 novembre 2026
 * (4 catégories comptées en chambres), prix validés par Houssam le 22 novembre
 * 2026. Seules les formules actives dans l'application figurent ici :
 * « Intervention urgente » y est désactivée, elle n'est donc pas affichée.
 * Chaque catégorie affiche l'abonnement de 4 passages ; l'abonnement de
 * 8 passages est indiqué dans son texte (sauf « Plus de 5 chambres », dont
 * l'abonnement de 8 passages est désactivé).
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
  abonnement?: Abonnement;
};

export const categoriesTarifs: CategorieTarif[] = [
  {
    id: 'studio',
    titre: 'Studio',
    precision: 'Studio et petit logement',
    formules: [
      {
        id: 'studio-express',
        nom: 'Ménage express',
        description:
          'Un coup de fraîcheur rapide et efficace pour les studios et les petits logements.',
        prix: '200 DH',
        duree: '1 h',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Terrasse ou balcon : +80 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +80 DH',
      },
      {
        id: 'studio-complet',
        nom: 'Ménage complet',
        description:
          'Un ménage en profondeur pour les studios et les petits logements, pour un intérieur impeccable.',
        prix: '300 DH',
        duree: '2 h',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Terrasse ou balcon : +80 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +80 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-studio',
      prix: '810 DH',
      contenu:
        '3 ménages express et 1 ménage complet chaque mois. Formule 8 passages (6 express et 2 complets) : 1 590 DH par mois',
      inclus: [
        { formule: 'studio-express', quantite: 3 },
        { formule: 'studio-complet', quantite: 1 },
      ],
    },
  },
  {
    id: 'appartement',
    titre: 'Appartement',
    precision: 'Jusqu’à 3 chambres',
    formules: [
      {
        id: 'appartement-express',
        nom: 'Ménage express',
        description:
          'Un coup de fraîcheur rapide et efficace pour les appartements jusqu’à 3 chambres.',
        prix: '250 DH',
        duree: '1 h 15',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +150 DH',
      },
      {
        id: 'appartement-complet',
        nom: 'Ménage complet',
        description: 'Un ménage en profondeur pour les appartements jusqu’à 3 chambres.',
        prix: '380 DH',
        duree: '2 h 30',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +150 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-appartement',
      prix: '990 DH',
      contenu:
        '3 ménages express et 1 ménage complet chaque mois. Formule 8 passages (6 express et 2 complets) : 1 990 DH par mois',
      inclus: [
        { formule: 'appartement-express', quantite: 3 },
        { formule: 'appartement-complet', quantite: 1 },
      ],
    },
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
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +200 DH',
      },
      {
        id: 'grand-menage',
        nom: 'Ménage complet',
        description:
          'Un ménage complet pour les grands appartements et les villas jusqu’à 5 chambres.',
        prix: '450 DH',
        duree: '3 h',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +200 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-grand',
      prix: '1 190 DH',
      contenu:
        '3 ménages express et 1 ménage complet chaque mois. Formule 8 passages (6 express et 2 complets) : 2 390 DH par mois',
      inclus: [
        { formule: 'grand-express', quantite: 3 },
        { formule: 'grand-menage', quantite: 1 },
      ],
    },
  },
  {
    id: 'tres-grand',
    titre: 'Plus de 5 chambres',
    precision: 'Grandes villas et logements haut standing',
    formules: [
      {
        id: 'tres-grand-express',
        nom: 'Ménage express',
        description: 'Un entretien rapide pour les très grandes propriétés.',
        prix: '350 DH',
        duree: '2 h',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +200 DH',
      },
      {
        id: 'tres-grand-complet',
        nom: 'Ménage complet',
        description: 'Un ménage en profondeur pour les très grandes propriétés.',
        prix: '600 DH',
        duree: '4 h',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +200 DH',
      },
      {
        id: 'tres-grand-prestige',
        nom: 'Ménage prestige',
        description:
          'Notre formule la plus complète, pensée pour les grandes villas et les logements haut standing.',
        prix: '700 DH',
        duree: '4 h 30',
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Petite terrasse (moins de 10 m²) : +80 DH ; Grande terrasse : +150 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé ou tapis (1 élément) : +190 DH ; Lavage de linge : +200 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-tres-grand',
      prix: '1 590 DH',
      contenu: '3 ménages express et 1 ménage prestige chaque mois',
      inclus: [
        { formule: 'tres-grand-express', quantite: 3 },
        { formule: 'tres-grand-prestige', quantite: 1 },
      ],
    },
  },
];
