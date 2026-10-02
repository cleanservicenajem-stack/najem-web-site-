/**
 * Contenu modifiable depuis l'administration.
 *
 * Ce fichier décrit *ce qui* est modifiable ; `lib/content.ts` décrit *comment*
 * la valeur enregistrée vient recouvrir celle du code. Les valeurs de repli
 * restent donc la référence : si l'administration n'a jamais été utilisée, ou
 * si le fichier de contenu est vide, le site affiche exactement ce qu'il
 * affiche aujourd'hui.
 *
 * Ajouter un champ ici suffit à le faire apparaître dans l'administration :
 * le formulaire est généré à partir de cette description.
 */

import { services } from '@/config/services';

export type ChampType = 'texte' | 'paragraphe' | 'telephone' | 'email';

export type ChampEditable = {
  cle: string;
  label: string;
  aide?: string;
  type: ChampType;
  /** Valeur affichée tant que rien n'a été enregistré. */
  repli: string;
  /** Plafond technique : la saisie est refusée au-delà. */
  longueurMax: number;
  /**
   * Longueur au-delà de laquelle le compteur passe en alerte, sans bloquer.
   * Sert pour le référencement, où Google coupe l'affichage bien avant la
   * limite technique.
   */
  longueurConseillee?: number;
  /**
   * Un champ marqué facultatif et laissé vide reste masqué sur le site :
   * c'est la règle appliquée aux coordonnées non communiquées.
   */
  facultatif?: boolean;
};

export type GroupeEditable = {
  slug: string;
  label: string;
  description: string;
  champs: ChampEditable[];
};

const coordonnees: GroupeEditable = {
  slug: 'coordonnees',
  label: 'Coordonnées',
  description:
    'Ces informations n’ont jamais été communiquées : elles sont pour l’instant masquées partout sur le site. Dès qu’un champ est renseigné, il apparaît dans le pied de page, sur la page Contact et dans les données transmises à Google.',
  champs: [
    {
      cle: 'contact.telephone',
      label: 'Téléphone',
      aide: 'Tel qu’il doit s’afficher, par exemple +212 6 00 00 00 00.',
      type: 'telephone',
      repli: '',
      longueurMax: 30,
      facultatif: true,
    },
    {
      cle: 'contact.whatsapp',
      label: 'Numéro WhatsApp',
      aide: 'Format international sans espaces ni signe +, par exemple 212600000000.',
      type: 'texte',
      repli: '',
      longueurMax: 20,
      facultatif: true,
    },
    {
      cle: 'contact.email',
      label: 'Adresse e-mail publique',
      type: 'email',
      repli: '',
      longueurMax: 120,
      facultatif: true,
    },
    {
      cle: 'contact.adresse.rue',
      label: 'Adresse — rue',
      aide: 'L’adresse n’apparaît que si la rue, la ville et le code postal sont tous les trois renseignés.',
      type: 'texte',
      repli: '',
      longueurMax: 120,
      facultatif: true,
    },
    {
      cle: 'contact.adresse.codePostal',
      label: 'Adresse — code postal',
      type: 'texte',
      repli: '',
      longueurMax: 12,
      facultatif: true,
    },
    {
      cle: 'contact.adresse.ville',
      label: 'Adresse — ville',
      type: 'texte',
      repli: '',
      longueurMax: 80,
      facultatif: true,
    },
    {
      cle: 'contact.delaiReponse',
      label: 'Délai de réponse annoncé',
      aide: 'Affiché sur la page Contact. Laisser vide pour ne rien annoncer.',
      type: 'texte',
      repli: '',
      longueurMax: 80,
      facultatif: true,
    },
  ],
};

const accueil: GroupeEditable = {
  slug: 'accueil',
  label: 'Page d’accueil',
  description:
    'Les textes de la première section et du bloc de présentation. Ce sont les phrases les plus visibles du site.',
  champs: [
    {
      cle: 'accueil.badge',
      label: 'Pastille au-dessus du titre',
      type: 'texte',
      repli: 'Votre maison propre, simplement.',
      longueurMax: 70,
    },
    {
      cle: 'accueil.titre',
      label: 'Titre principal',
      aide: 'Le seul titre de niveau 1 de la page : il pèse lourd pour le référencement.',
      type: 'paragraphe',
      repli: 'Votre maison mérite un service de nettoyage de confiance.',
      longueurMax: 120,
    },
    {
      cle: 'accueil.accroche',
      label: 'Phrase d’accroche',
      type: 'paragraphe',
      repli:
        'Votre maison propre en trois clics depuis l’application Najem Clean Service. Profitez de votre temps, on s’occupe du reste.',
      longueurMax: 300,
    },
    {
      cle: 'accueil.presentation.titre',
      label: 'Titre du bloc de présentation',
      type: 'texte',
      repli: 'Qui nous sommes ?',
      longueurMax: 80,
    },
    {
      cle: 'accueil.presentation.texte',
      label: 'Texte de présentation',
      aide: 'C’est le passage que les moteurs de recherche reprennent le plus volontiers pour répondre à « qui est Najem Clean Service ».',
      type: 'paragraphe',
      repli:
        'Najem Clean Service, c’est une équipe à votre disposition pour toutes les prestations, ménage régulier ou occasionnel. Réservez et réglez vos prestations, puis recevez votre facture directement sur l’application.',
      longueurMax: 600,
    },
  ],
};

/**
 * Un bloc de trois champs par prestation. Les paragraphes longs des pages
 * dédiées ne sont volontairement pas modifiables ici : ils servent aussi aux
 * métadonnées et aux données structurées, et demandent plus de précautions.
 */
const prestations: GroupeEditable = {
  slug: 'prestations',
  label: 'Prestations',
  description:
    'Le titre et les deux lignes affichées dans les listes de services, sur l’accueil comme sur la page Services.',
  champs: services.flatMap((service) => [
    {
      cle: `service.${service.slug}.titre`,
      label: `${service.title} — titre`,
      type: 'texte' as const,
      repli: service.title,
      longueurMax: 60,
    },
    {
      cle: `service.${service.slug}.accroche`,
      label: `${service.title} — première ligne`,
      type: 'texte' as const,
      repli: service.benefit,
      longueurMax: 120,
    },
    {
      cle: `service.${service.slug}.complement`,
      label: `${service.title} — seconde ligne`,
      aide: 'Facultative. Laisser vide pour n’afficher que la première ligne.',
      type: 'paragraphe' as const,
      repli: service.pitch ?? '',
      longueurMax: 220,
      facultatif: true,
    },
  ]),
};

/**
 * Titres et descriptions des pages principales.
 *
 * Le titre est complété automatiquement par « | Najem Clean Service », sauf
 * sur l'accueil où le nom figure déjà. Les pages de prestations et les
 * articles ne sont pas listés ici : leur titre suit celui de la prestation ou
 * de l'article, et serait donc modifiable à deux endroits.
 */
const pagesReferencees: { chemin: string; label: string; titre: string; description: string }[] = [
  {
    chemin: 'accueil',
    label: 'Accueil',
    titre: 'Najem Clean Service | Services de nettoyage à domicile',
    description:
      'Réservez facilement un service de nettoyage professionnel avec Najem Clean Service. Téléchargez l’application sur iPhone ou Android et planifiez votre prochain nettoyage.',
  },
  {
    chemin: 'services',
    label: 'Services',
    titre: 'Services de nettoyage à domicile',
    description:
      'Nettoyage régulier, ponctuel, après déménagement, grand nettoyage, entretien spécialisé et prestations pour les professionnels : toutes les prestations Najem Clean Service se réservent depuis l’application mobile.',
  },
  {
    chemin: 'application',
    label: 'Application',
    titre: 'Application mobile iOS et Android',
    description:
      'L’application Najem Clean Service est disponible sur iPhone et Android. Réservez un service de nettoyage à domicile, gérez vos rendez-vous et suivez vos demandes depuis votre compte.',
  },
  {
    chemin: 'a-propos',
    label: 'À propos',
    titre: 'À propos',
    description:
      'Najem Clean Service est un service de nettoyage à domicile réservable depuis une application mobile iOS et Android. Découvrez sa mission, sa vision et ses valeurs.',
  },
  {
    chemin: 'faq',
    label: 'FAQ',
    titre: 'Questions fréquentes',
    description:
      'Réservation, application iOS et Android, gestion des rendez-vous, modification, paiement : les réponses aux questions les plus fréquentes sur Najem Clean Service.',
  },
  {
    chemin: 'contact',
    label: 'Contact',
    titre: 'Contact',
    description:
      'Une question sur les services de nettoyage Najem Clean Service ou sur l’application ? Écrivez-nous depuis le formulaire de contact, nous vous répondons par e-mail.',
  },
  {
    chemin: 'blog',
    label: 'Conseils',
    titre: 'Conseils entretien et organisation',
    description:
      'Conseils d’entretien, organisation et bonnes pratiques pour garder un logement propre sans y passer ses soirées.',
  },
];

const referencement: GroupeEditable = {
  slug: 'referencement',
  label: 'Référencement (SEO)',
  description:
    'Ce que Google affiche dans ses résultats : le titre cliquable et les deux lignes en dessous. Le compteur passe en alerte au-delà de 60 caractères pour un titre et 155 pour une description — c’est à peu près là que Google coupe. Rien n’est bloqué pour autant : une description plus longue reste lisible sur la page, seule sa fin disparaît du résultat de recherche.',
  champs: pagesReferencees.flatMap((page) => [
    {
      cle: `seo.${page.chemin}.titre`,
      label: `${page.label} — titre`,
      type: 'texte' as const,
      repli: page.titre,
      longueurMax: 110,
      longueurConseillee: 60,
    },
    {
      cle: `seo.${page.chemin}.description`,
      label: `${page.label} — description`,
      type: 'paragraphe' as const,
      repli: page.description,
      longueurMax: 320,
      longueurConseillee: 155,
    },
  ]),
};

/**
 * Énoncés factuels repris par les moteurs génératifs.
 *
 * ChatGPT, Gemini ou Perplexity citent plus volontiers des phrases courtes et
 * vérifiables que du discours commercial. Ces champs alimentent /llms.txt et
 * les données structurées : ils doivent rester exacts, et n'avancer aucun
 * chiffre ni aucune zone qui ne soit réellement couverte.
 */
const moteursGeneratifs: GroupeEditable = {
  slug: 'moteurs-generatifs',
  label: 'Moteurs génératifs (GEO)',
  description:
    'Ce que ChatGPT, Gemini ou Perplexity retiendront de Najem Clean Service. Écrivez des phrases courtes, factuelles et vérifiables : une affirmation invérifiable vous dessert ici plus qu’ailleurs.',
  champs: [
    {
      cle: 'geo.resume',
      label: 'Le service en une phrase',
      aide: 'La toute première ligne lue par un moteur génératif. Elle sert aussi de description par défaut du site.',
      type: 'paragraphe',
      repli:
        'Service de nettoyage à domicile réservable depuis une application mobile iOS et Android.',
      longueurMax: 200,
    },
    {
      cle: 'geo.activite',
      label: 'Activité',
      type: 'texte',
      repli: 'Services de nettoyage à domicile.',
      longueurMax: 120,
    },
    {
      cle: 'geo.zones',
      label: 'Zones desservies',
      aide: 'N’annoncez une ville que si elle est réellement couverte : une zone inexacte se retourne contre vous.',
      type: 'paragraphe',
      repli:
        'Non publiées à ce jour ; la disponibilité est confirmée dans l’application au moment de la réservation.',
      longueurMax: 250,
    },
    {
      cle: 'geo.precision.tarifs',
      label: 'Précision — tarifs et conditions',
      type: 'paragraphe',
      repli:
        'Les tarifs, durées d’intervention et conditions d’annulation ne sont pas publiés sur le site : ils sont présentés dans l’application au moment de la réservation.',
      longueurMax: 300,
    },
    {
      cle: 'geo.precision.avis',
      label: 'Précision — avis et statistiques',
      type: 'paragraphe',
      repli:
        'Aucune note moyenne, aucun avis client et aucune statistique d’activité ne sont publiés tant qu’ils ne sont pas vérifiables.',
      longueurMax: 300,
    },
    {
      cle: 'geo.precision.reservation',
      label: 'Précision — ce que le site ne fait pas',
      type: 'paragraphe',
      repli:
        'Le site ne permet pas de réserver ni de payer : ces opérations se font uniquement dans l’application.',
      longueurMax: 300,
    },
  ],
};

export const groupesEditables: GroupeEditable[] = [
  coordonnees,
  accueil,
  prestations,
  referencement,
  moteursGeneratifs,
];

/** Pages dont le titre et la description sont modifiables. */
export const cheminsReferences = pagesReferencees.map((page) => page.chemin);

export const getGroupeEditable = (slug: string): GroupeEditable | undefined =>
  groupesEditables.find((groupe) => groupe.slug === slug);

export const champsEditables: ChampEditable[] = groupesEditables.flatMap((groupe) => groupe.champs);

export const getChampEditable = (cle: string): ChampEditable | undefined =>
  champsEditables.find((champ) => champ.cle === cle);
