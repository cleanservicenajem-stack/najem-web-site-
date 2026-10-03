import {
  Boxes,
  Building2,
  CalendarCheck,
  Clock4,
  Sparkles,
  SprayCan,
  type LucideIcon,
} from 'lucide-react';

/**
 * Catalogue des prestations.
 *
 * `enabled: false` retire complètement une prestation du site : elle disparaît
 * de la navigation, du sitemap et sa page n'est plus générée.
 *
 * `status` sert de rappel interne : tant qu'une prestation est marquée
 * `a-confirmer`, son contenu reste volontairement générique (aucun tarif,
 * aucune durée, aucune garantie annoncée).
 */
export type ServiceStatus = 'confirme' | 'a-confirmer';

export type Service = {
  slug: string;
  title: string;
  /** Version courte pour les listes compactes et les fils d'Ariane. */
  shortTitle: string;
  /**
   * Titre de la balise `<title>`, hors « | Najem Clean Service » ajouté
   * automatiquement. Viser 38 caractères pour que l'ensemble tienne sous les
   * 60 que Google affiche.
   */
  metaTitle: string;
  /**
   * Description de la balise meta, rédigée à la main.
   *
   * Elle l'était auparavant par troncature du résumé, ce qui coupait la phrase
   * en plein mot dans les résultats de recherche. Viser 140 à 155 caractères :
   * au-delà, Google coupe à son tour.
   */
  metaDescription: string;
  /** Bénéfice principal, une ligne, affiché sous le titre. */
  benefit: string;
  /**
   * Seconde ligne d'accroche affichée dans les listes, sous le bénéfice.
   * Optionnelle : les prestations sans accroche n'affichent que leur bénéfice.
   */
  pitch?: string;
  /**
   * Réponse directe et factuelle (2 à 4 phrases). Réservée à la page dédiée,
   * aux métadonnées et aux données structurées : les listes affichent
   * `benefit` et `pitch`.
   */
  summary: string;
  /** Paragraphes de la page dédiée. */
  body: string[];
  /** Ce que la prestation recouvre généralement. */
  includes: string[];
  /** Situations dans lesquelles la prestation est pertinente. */
  goodFor: string[];
  icon: LucideIcon;
  enabled: boolean;
  status: ServiceStatus;
};

export const services: Service[] = [
  {
    slug: 'nettoyage-regulier',
    title: 'Nettoyage régulier',
    shortTitle: 'Régulier',
    metaTitle: 'Nettoyage régulier à Casablanca',
    metaDescription:
      "Nettoyage régulier à domicile à Casablanca : un passage planifié au rythme que vous fixez. Réservez depuis l'application Najem Clean Service.",
    benefit: 'Un intérieur propre sans y penser',
    pitch: 'Un abonnement disponible en 3 clics, sur mesure et sans engagement.',
    summary:
      "Le nettoyage régulier est un passage planifié à intervalle fixe pour entretenir votre logement. Vous définissez le rythme qui vous convient depuis l'application et vous retrouvez un intérieur propre sans avoir à réorganiser vos journées.",
    // TODO (client) : préciser ici la durée indicative d'un passage et les
    // formules de fréquence réellement proposées, une fois arbitrées.
    body: [
      "L'entretien courant est ce qui demande le plus de constance : c'est aussi ce qui se reporte le plus facilement. Le nettoyage régulier existe pour retirer cette charge de votre organisation hebdomadaire. Il est disponible partout à Casablanca, au rythme que vous fixez.",
      "Vous indiquez votre logement et vos disponibilités dans l'application, puis vous reprogrammez les passages suivants en quelques secondes depuis votre compte. Les demandes particulières — pièce à traiter en priorité, produits à éviter, accès au logement — se transmettent au moment de la réservation.",
    ],
    includes: [
      'Entretien des pièces de vie et des chambres',
      'Cuisine : plans de travail, extérieur des équipements, évier',
      'Salle de bain et sanitaires',
      'Sols aspirés et lavés',
      'Poussières sur les surfaces accessibles',
    ],
    goodFor: [
      'Logements occupés au quotidien',
      'Emplois du temps chargés',
      'Familles qui veulent un rythme fixe',
    ],
    icon: CalendarCheck,
    enabled: true,
    status: 'a-confirmer',
  },
  {
    slug: 'nettoyage-ponctuel',
    title: 'Nettoyage ponctuel',
    shortTitle: 'Ponctuel',
    metaTitle: 'Nettoyage ponctuel à Casablanca',
    metaDescription:
      "Nettoyage ponctuel à domicile à Casablanca : une intervention unique, sans engagement de suivi. Réservez un créneau depuis l'application Najem.",
    benefit: 'Une intervention unique, disponible à tout moment depuis votre téléphone',
    summary:
      "Le nettoyage ponctuel est une intervention unique, sans engagement de suivi. Il répond à un besoin précis : avant de recevoir, après un événement, ou simplement pour reprendre la main sur un logement.",
    // TODO (client) : préciser la durée indicative de l'intervention et le
    // délai de réservation minimum.
    body: [
      "Tout le monde n'a pas besoin d'un passage hebdomadaire. Certaines semaines demandent seulement un coup de propre au bon moment, et c'est exactement ce que couvre le nettoyage ponctuel. Cette intervention se réserve dans toute la ville de Casablanca.",
      "La réservation suit le même parcours que les autres prestations : vous choisissez le service, vous sélectionnez un créneau, vous validez. Rien ne se reconduit automatiquement.",
    ],
    includes: [
      'Nettoyage des pièces indiquées à la réservation',
      'Sols, surfaces et sanitaires',
      'Remise en ordre visible des espaces traités',
    ],
    goodFor: [
      'Avant ou après avoir reçu du monde',
      'Retour de vacances',
      'Besoin ponctuel sans suivi régulier',
    ],
    icon: Clock4,
    enabled: true,
    status: 'a-confirmer',
  },
  {
    slug: 'nettoyage-apres-demenagement',
    title: 'Nettoyage après déménagement',
    shortTitle: 'Déménagement',
    metaTitle: 'Nettoyage déménagement à Casablanca',
    metaDescription:
      "Nettoyage après déménagement à Casablanca : un logement vide remis au propre, à l'entrée comme à la sortie. Réservez depuis l'application Najem.",
    benefit: 'Un logement vide remis au propre, entrée ou sortie',
    summary:
      "Le nettoyage après déménagement s'effectue dans un logement vide ou en cours de libération. Il permet de rendre un bien dans un état correct, ou d'emménager dans un intérieur déjà nettoyé.",
    // TODO (client) : préciser la durée indicative selon la surface, et si la
    // prestation couvre l'intérieur des placards fixes et les vitres.
    body: [
      "Un logement vide se nettoie différemment d'un logement habité : les surfaces sont entièrement accessibles, et ce sont souvent les zones habituellement masquées par les meubles qui demandent le plus d'attention. La prestation couvre l'ensemble de Casablanca, à l'entrée comme à la sortie d'un logement.",
      "Cette prestation se réserve depuis l'application en précisant s'il s'agit d'une sortie ou d'une entrée dans les lieux, ainsi que les particularités du logement.",
    ],
    includes: [
      'Sols et plinthes',
      'Intérieur des placards vides',
      'Cuisine et salle de bain',
      'Traces et poussières liées au déménagement',
    ],
    goodFor: ['Fin de bail', 'Entrée dans un nouveau logement', 'Remise des clés'],
    icon: Boxes,
    enabled: true,
    status: 'a-confirmer',
  },
  {
    slug: 'grand-nettoyage',
    title: 'Grand nettoyage',
    shortTitle: 'Grand nettoyage',
    metaTitle: 'Grand nettoyage à Casablanca',
    metaDescription:
      "Grand nettoyage à domicile à Casablanca : une remise à niveau complète, au-delà de l'entretien courant. Réservez depuis l'application Najem.",
    benefit: 'Une remise à niveau complète du logement',
    summary:
      "Le grand nettoyage est une intervention plus complète que l'entretien courant. Il cible les zones qui ne sont pas traitées à chaque passage et sert souvent de point de départ avant de mettre en place un rythme régulier.",
    // TODO (client) : préciser la durée indicative et ce qui distingue
    // concrètement un grand nettoyage d'un passage régulier.
    body: [
      "Il arrive qu'un logement demande plus qu'un entretien de surface : changement de saison, période chargée, ou simplement l'envie de repartir sur une base propre. Le grand nettoyage se réserve partout à Casablanca, pour un appartement comme pour une maison.",
      "Le grand nettoyage se concentre sur les détails habituellement laissés de côté. Précisez à la réservation les zones qui comptent le plus pour vous, elles seront traitées en priorité.",
    ],
    includes: [
      'Entretien approfondi des pièces',
      'Zones peu accessibles au quotidien',
      'Surfaces vitrées intérieures accessibles',
      'Détails : interrupteurs, poignées, plinthes',
    ],
    goodFor: ['Changement de saison', 'Avant un événement familial', 'Reprise en main du logement'],
    icon: Sparkles,
    enabled: true,
    status: 'a-confirmer',
  },
  {
    slug: 'entretien-specialise',
    title: 'Entretien spécialisé',
    shortTitle: 'Spécialisé',
    metaTitle: 'Entretien spécialisé à Casablanca',
    metaDescription:
      "Entretien spécialisé à Casablanca : les demandes qui sortent du nettoyage courant, traitées à part. Décrivez votre besoin dans l'application Najem.",
    benefit: 'Une demande particulière, traitée à part',
    summary:
      "L'entretien spécialisé regroupe les demandes qui sortent du nettoyage courant et nécessitent un traitement adapté. La faisabilité est confirmée en fonction de la demande et du professionnel disponible.",
    // TODO (client) : lister les types de surfaces et de traitements
    // réellement couverts, aucun ne pouvant être annoncé sans validation.
    body: [
      "Certaines surfaces et certains besoins demandent une approche spécifique. Plutôt que de les traiter comme du nettoyage classique, ces demandes sont identifiées dès la réservation. L'entretien spécialisé est proposé à Casablanca, la faisabilité étant confirmée au cas par cas.",
      "Décrivez précisément votre besoin dans l'application : cela permet d'orienter la demande vers un professionnel en mesure d'y répondre.",
    ],
    includes: [
      'Demandes décrites au moment de la réservation',
      'Adaptation au type de surface concerné',
      'Confirmation de faisabilité avant intervention',
    ],
    goodFor: ['Besoin qui sort du nettoyage courant', 'Surface ou matériau particulier'],
    icon: SprayCan,
    enabled: true,
    status: 'a-confirmer',
  },
  {
    slug: 'professionnels',
    title: 'Pour les professionnels',
    shortTitle: 'Professionnels',
    metaTitle: 'Nettoyage professionnels à Casablanca',
    metaDescription:
      "Nettoyage pour professionnels à Casablanca : conciergeries et location courte durée. Réservez chaque intervention depuis l'application Najem.",
    benefit: 'Prestation sur mesure pour les conciergeries et la location courte durée',
    pitch: 'Intervention rapide pour que votre bien soit toujours opérationnel.',
    summary:
      "Cette prestation s'adresse aux conciergeries et aux propriétaires de location courte durée. L'intervention est définie en fonction du bien concerné et se réserve depuis l'application, comme les autres prestations.",
    // TODO (client) : préciser le délai d'intervention entre deux occupations
    // et les conditions pour un volume récurrent (plusieurs biens).
    body: [
      "Un bien loué à la nuitée ne s'entretient pas comme un logement occupé à l'année : la contrainte n'est pas seulement la propreté, c'est le délai entre deux occupations. Najem Clean Service intervient à Casablanca, dans toute la ville.",
      "Décrivez le bien et son rythme au moment de la réservation. Les passages suivants se reprogramment depuis votre compte, et chaque intervention reste suivie au même endroit.",
    ],
    includes: [
      'Prestation définie selon le bien concerné',
      'Remise en état entre deux occupations',
      'Réservation et suivi depuis l’application',
    ],
    goodFor: [
      'Conciergeries',
      'Propriétaires de location courte durée',
      'Rotation fréquente entre deux séjours',
    ],
    icon: Building2,
    enabled: true,
    status: 'a-confirmer',
  },
];

export const enabledServices = services.filter((service) => service.enabled);

export const getServiceBySlug = (slug: string): Service | undefined =>
  enabledServices.find((service) => service.slug === slug);
