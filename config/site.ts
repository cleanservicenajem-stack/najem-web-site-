/**
 * Source unique de vérité pour toutes les informations de l'entreprise.
 *
 * RÈGLE : aucune donnée n'est inventée. Les champs dont la valeur réelle n'a
 * pas été communiquée valent `null` ; l'interface les masque automatiquement et
 * les données structurées ne les déclarent pas. Il suffit de renseigner la
 * valeur ici pour qu'elle apparaisse partout (header, footer, contact, JSON-LD).
 */

export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok';

export type SocialLink = {
  network: SocialNetwork;
  /** Nom lu par les lecteurs d'écran, l'icône seule ne disant rien. */
  label: string;
  href: string;
};

export type ServiceArea = {
  /** Nom de la ville / zone tel qu'il sera affiché. */
  name: string;
  /** Slug utilisé si des pages locales sont activées plus tard. */
  slug: string;
  region?: string;
};

export type PostalAddress = {
  street: string;
  city: string;
  postalCode: string;
  region?: string;
  country: string;
  countryCode: string;
};

export type OpeningHours = {
  days: string;
  hours: string;
};

/**
 * Domaine de production. Il sert aux URL canoniques, au sitemap, au robots.txt,
 * aux balises Open Graph et au JSON-LD.
 *
 * La forme avec `www` est la bonne : le domaine nu redirige vers elle. Déclarer
 * le domaine nu ferait passer chaque URL annoncée par une redirection.
 *
 * `NEXT_PUBLIC_SITE_URL` reste prioritaire, pour les environnements de recette.
 */
const DOMAINE_PRODUCTION = 'https://www.najemcleanservice.ma';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? DOMAINE_PRODUCTION).replace(/\/$/, '');

export const siteConfig = {
  name: 'Najem Clean Service',
  shortName: 'Najem',
  /** Baseline officielle présente dans le logo. */
  tagline: 'A Cleaner Brighter Tomorrow',
  /** Phrase de positionnement en français utilisée dans l'interface. */
  positioning: 'Services de nettoyage à domicile, réservables depuis une application mobile.',
  description:
    "Najem Clean Service est un service de nettoyage à domicile qui se réserve depuis une application mobile disponible sur iPhone et Android. Vous choisissez votre prestation, vos disponibilités, et un professionnel se déplace chez vous.",
  url: siteUrl,

  locale: {
    default: 'fr',
    /** Locales prévues par l'architecture i18n (traductions à venir). */
    supported: ['fr', 'ar', 'en'] as const,
    htmlLang: 'fr',
    /** `ar` sera rendu en RTL lorsque la traduction sera activée. */
    rtl: ['ar'] as const,
    ogLocale: 'fr_FR',
  },

  /**
   * Coordonnées — À COMPLÉTER avec les informations réelles.
   * Tant qu'un champ vaut `null`, il n'est affiché nulle part sur le site.
   */
  contact: {
    phone: null as string | null,
    /** Format international sans espaces, ex. "212600000000". */
    whatsapp: null as string | null,
    email: null as string | null,
    address: null as PostalAddress | null,
    openingHours: null as OpeningHours[] | null,
    /** Délai de réponse annoncé sur la page contact (null = non annoncé). */
    responseTime: null as string | null,
  },

  /**
   * Réseaux sociaux — n'ajouter que des comptes réellement existants.
   *
   * Chaque lien apparaît dans le pied de page et est déclaré dans les données
   * structurées (`sameAs`), ce qui aide Google à rattacher ces comptes à
   * l'entreprise. Un lien mort y ferait donc plus de mal que de bien.
   *
   * À COMPLÉTER : les trois adresses ci-dessous attendent les URL réelles.
   * Exemple de forme attendue :
   *   { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/<compte>/' }
   */
  social: [] as SocialLink[],

  /**
   * Zones desservies — laisser vide tant que les villes ne sont pas confirmées.
   * Aucune page locale n'est générée tant que ce tableau est vide (voir
   * `config/local-seo.ts`).
   */
  serviceAreas: [] as ServiceArea[],

  /** Zone d'activité déclarée par défaut dans les données structurées. */
  primaryMarket: {
    country: 'Maroc',
    countryCode: 'MA',
  },

  apps: {
    ios: {
      label: 'App Store',
      url: 'https://apps.apple.com/ma/app/najem-clean-service/id6763940227?l=fr-FR',
      appId: '6763940227',
      appName: 'Najem Clean Service',
    },
    android: {
      label: 'Google Play',
      url: 'https://play.google.com/store/apps/details?id=com.elamranihaytam.najemcleanservice&pcampaignid=web_share',
      packageName: 'com.elamranihaytam.najemcleanservice',
      appName: 'Najem Clean Service',
    },
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? null,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? null,
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? null,
  },

  /** Métriques publiques : à ne remplir qu'avec des chiffres vérifiables. */
  publicMetrics: null as { label: string; value: string }[] | null,
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Les coordonnées effectives se lisent via `lib/content.ts` :
 * `getContact`, `hasContactChannel` et `whatsappHref` y tiennent compte de ce
 * qui a été saisi dans l'administration. Ce fichier ne porte que les valeurs
 * par défaut.
 */

export const absoluteUrl = (path = '/'): string =>
  `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
