/**
 * Grille tarifaire affichée sur /tarifs.
 *
 * Source : l'application Najem Clean Service, écrans « Gestion Services » et
 * « Abonnements », relevés le 30 octobre 2026. Seules les formules actives
 * dans l'application figurent ici : « Intervention urgente » y est désactivée,
 * elle n'est donc pas affichée. Les trois abonnements sont actifs.
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
        options:
          'Repassage express (30 min) : +80 DH ; Repassage complet (1 h) : +150 DH ; Four et frigo très sales : +80 DH ; Terrasse ou balcon : +80 DH ; Heure supplémentaire : +150 DH ; Shampouineuse canapé et tapis : +150 DH',
      },
      {
        id: 'studio-complet',
        nom: 'Ménage complet',
        description:
          'Un ménage en profondeur pour les studios et les petits appartements, pour un intérieur impeccable.',
        prix: '350 DH',
        duree: '2 h',
        options:
          'Shampouineuse canapé et tapis : +150 DH ; Repassage : +80 DH ; Terrasse ou balcon : +80 DH ; Heure supplémentaire : +120 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-studio',
      prix: '890 DH',
      contenu: '3 ménages express et 1 ménage complet chaque mois',
      inclus: [
        { formule: 'studio-express', quantite: 3 },
        { formule: 'studio-complet', quantite: 1 },
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
          'Shampouineuse canapé et tapis : +150 DH ; Repassage : +80 DH ; Heure supplémentaire : +150 DH ; Terrasse ou balcon : +80 DH ; Four et frigo très sales : +50 DH',
      },
      {
        id: 'grand-menage',
        nom: 'Grand ménage',
        description:
          'Un ménage complet pour les grands appartements et les villas jusqu’à 5 chambres.',
        prix: '450 DH',
        duree: '3 h',
        options:
          'Heure supplémentaire : +150 DH ; Shampouineuse canapé et tapis : +150 DH ; Petit repassage : +80 DH ; Grand repassage : +150 DH ; Terrasse ou balcon : +80 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-grand',
      prix: '1 090 DH',
      contenu: '3 ménages express et 1 grand ménage chaque mois',
      inclus: [
        { formule: 'grand-express', quantite: 3 },
        { formule: 'grand-menage', quantite: 1 },
      ],
    },
  },
  {
    id: 'tres-grand',
    titre: 'Très grand logement',
    precision: 'Grandes villas et logements haut standing',
    formules: [
      {
        id: 'tres-grand-express',
        nom: 'Ménage express',
        description: 'Un entretien rapide pour les très grandes propriétés.',
        prix: '350 DH',
        duree: '2 h',
        options: '',
      },
      {
        id: 'tres-grand-prestige',
        nom: 'Ménage prestige',
        description:
          'Notre formule la plus complète, pensée pour les grandes villas et les logements haut standing.',
        prix: '700 DH',
        duree: '4 h 30',
        options:
          'Shampouineuse canapé et tapis : +200 DH ; Repassage : +150 DH ; Terrasse ou balcon : +150 DH ; Heure supplémentaire : +150 DH',
      },
    ],
    abonnement: {
      id: 'abonnement-tres-grand',
      prix: '1 490 DH',
      contenu: '3 ménages express et 1 ménage prestige chaque mois',
      inclus: [
        { formule: 'tres-grand-express', quantite: 3 },
        { formule: 'tres-grand-prestige', quantite: 1 },
      ],
    },
  },
];
