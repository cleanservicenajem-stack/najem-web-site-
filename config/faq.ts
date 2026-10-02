/**
 * Questions fréquentes.
 *
 * Les réponses restent volontairement prudentes sur tout ce qui relève d'une
 * politique commerciale non communiquée (annulation, paiement, délais) : elles
 * renvoient à l'application, qui fait foi. Remplacer le texte ici dès que les
 * règles officielles sont connues.
 */

export type FaqCategory = 'general' | 'application' | 'service' | 'pratique';

export type FaqItem = {
  id: string;
  question: string;
  /** Un tableau = plusieurs paragraphes. Le premier doit répondre directement. */
  answer: string[];
  category: FaqCategory;
};

export const faqItems: FaqItem[] = [
  {
    id: 'reserver',
    question: 'Comment réserver un service de nettoyage ?',
    answer: [
      "La réservation se fait depuis l'application Najem Clean Service, disponible sur iPhone et sur Android. Vous téléchargez l'application, vous créez votre compte, vous choisissez la prestation souhaitée puis un créneau parmi vos disponibilités.",
      "Vous pouvez préciser les informations utiles à l'intervention au moment de la demande : type de logement, pièces concernées, consignes d'accès.",
    ],
    category: 'general',
  },
  {
    id: 'fonctionnement',
    question: 'Comment fonctionne Najem Clean Service ?',
    answer: [
      "Najem Clean Service met en relation des particuliers avec des professionnels du nettoyage à domicile, via une application mobile. Le parcours tient en quatre étapes : télécharger l'application, choisir un service, sélectionner un créneau, puis suivre l'intervention depuis son compte.",
      "Tout se gère au même endroit : la demande, les rendez-vous et les échanges liés à la prestation.",
    ],
    category: 'general',
  },
  {
    id: 'gestion-reservations',
    question: "Puis-je gérer mes réservations depuis l'application ?",
    answer: [
      "Oui. Vos réservations sont accessibles depuis votre compte dans l'application : vous y consultez vos rendez-vous à venir et l'historique de vos demandes.",
    ],
    category: 'application',
  },
  {
    id: 'android',
    question: "L'application est-elle disponible sur Android ?",
    answer: [
      "Oui. Najem Clean Service est disponible sur Google Play. Le téléchargement se fait depuis le bouton « Google Play » présent sur ce site ou directement en recherchant « Najem Clean Service » dans le Play Store.",
    ],
    category: 'application',
  },
  {
    id: 'ios',
    question: "L'application est-elle disponible sur iPhone ?",
    answer: [
      "Oui. Najem Clean Service est disponible sur l'App Store pour iPhone. Vous pouvez y accéder depuis le bouton « App Store » de ce site.",
    ],
    category: 'application',
  },
  {
    id: 'modifier-annuler',
    question: 'Puis-je modifier ou annuler une réservation ?',
    answer: [
      "La modification et l'annulation se gèrent depuis votre compte dans l'application, à la rubrique de vos réservations.",
      "Les conditions applicables — notamment les délais à respecter — sont celles affichées dans l'application au moment de la réservation. Elles font référence.",
    ],
    category: 'pratique',
  },
  {
    id: 'paiement',
    question: 'Comment fonctionne le paiement ?',
    answer: [
      "Les modalités de paiement disponibles sont présentées dans l'application au moment de la réservation, avant toute validation.",
      "Aucun paiement n'est demandé par ce site : la réservation et le règlement se font uniquement dans l'application Najem Clean Service.",
    ],
    category: 'pratique',
  },
  {
    id: 'professionnels',
    question: 'Qui intervient à mon domicile ?',
    answer: [
      "Les interventions sont réalisées par des professionnels du nettoyage référencés par Najem Clean Service. Les informations relatives à votre intervention sont visibles dans l'application.",
    ],
    category: 'service',
  },
  {
    id: 'contact',
    question: 'Comment contacter Najem Clean Service ?',
    answer: [
      "Pour une question générale, utilisez le formulaire de la page Contact de ce site. Pour une demande liée à une réservation en cours, passez par l'application : le contexte de votre rendez-vous y est déjà rattaché.",
    ],
    category: 'general',
  },
  {
    id: 'zones',
    question: 'Quelles sont les zones desservies ?',
    answer: [
      "La disponibilité dépend de votre adresse et des professionnels disponibles sur le créneau demandé. L'application indique si une intervention est possible chez vous au moment de la réservation.",
    ],
    category: 'service',
  },
];

export const faqByCategory = (category: FaqCategory): FaqItem[] =>
  faqItems.filter((item) => item.category === category);

/** Sélection courte affichée sur la page d'accueil. */
export const homeFaqIds = ['reserver', 'fonctionnement', 'ios', 'android', 'paiement', 'zones'];

export const homeFaqItems = faqItems.filter((item) => homeFaqIds.includes(item.id));

/** FAQ spécifique à la page /application. */
export const appFaqItems = faqItems.filter((item) =>
  ['ios', 'android', 'gestion-reservations', 'modifier-annuler', 'paiement'].includes(item.id),
);
