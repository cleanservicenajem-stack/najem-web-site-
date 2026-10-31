import { enabledServices } from '@/config/services';

/**
 * Langues du site.
 *
 * Le français reste la langue principale et garde toutes ses adresses
 * actuelles. L'arabe et l'anglais reprennent les mêmes adresses, préfixées
 * (/ar/tarifs, /en/tarifs) : aucune redirection automatique selon la langue du
 * navigateur, que Google déconseille, puisqu'elle l'empêcherait d'explorer
 * chaque version.
 *
 * Seules les pages réellement traduites existent dans les autres langues (ni
 * le blog, ni les pages légales). Le sélecteur garde la même page quand elle
 * est traduite, sinon il renvoie vers l'accueil de la langue choisie ; les
 * balises hreflang ne relient que des pages équivalentes.
 */

export const langues = ['fr', 'ar', 'en'] as const;

export type Langue = (typeof langues)[number];

/** Langues des pages traduites (le français est la version d'origine). */
export type LangueTraduite = Exclude<Langue, 'fr'>;

export const languesTraduites: readonly LangueTraduite[] = ['ar', 'en'];

export const estLangueTraduite = (valeur: string): valeur is LangueTraduite =>
  (languesTraduites as readonly string[]).includes(valeur);

export const libellesLangues: Record<Langue, { court: string; complet: string }> = {
  fr: { court: 'FR', complet: 'Français' },
  ar: { court: 'ع', complet: 'العربية' },
  en: { court: 'EN', complet: 'English' },
};

/** Nom du choix de langue, dans chaque langue (lecteurs d'écran, infobulles). */
export const libelleChoixLangue: Record<Langue, string> = {
  fr: 'Langue du site',
  ar: 'لغة الموقع',
  en: 'Site language',
};

/** Accueil de chaque langue. */
export const accueilParLangue: Record<Langue, string> = {
  fr: '/',
  ar: '/ar',
  en: '/en',
};

export const directionParLangue: Record<Langue, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  ar: 'rtl',
  en: 'ltr',
};

export const ogLocaleParLangue: Record<Langue, string> = {
  fr: 'fr_FR',
  ar: 'ar_MA',
  en: 'en_US',
};

/** Les trois versions de l'accueil, reliées entre elles par hreflang. */
export const versionsAccueil: Record<Langue, string> = accueilParLangue;

/** Chemins français des pages qui existent aussi en arabe et en anglais. */
export const cheminsTraduits: readonly string[] = [
  '/',
  '/services',
  ...enabledServices.map((service) => `/services/${service.slug}`),
  '/tarifs',
  '/application',
  '/a-propos',
  '/faq',
  '/contact',
  '/femme-de-menage-casablanca',
  '/nettoyage-canape-tapis-casablanca',
];

export const estTraduit = (cheminFr: string): boolean => cheminsTraduits.includes(cheminFr);

/** Adresse d'une page française dans une langue : « /tarifs » → « /en/tarifs ». */
export const cheminEn = (langue: Langue, cheminFr: string): string => {
  if (langue === 'fr') return cheminFr;
  return cheminFr === '/' ? `/${langue}` : `/${langue}${cheminFr}`;
};

/** Langue d'une adresse, et adresse française correspondante. */
export const analyserChemin = (chemin: string): { langue: Langue; cheminFr: string } => {
  const trouve = /^\/(ar|en)(\/.*)?$/.exec(chemin);
  if (!trouve) return { langue: 'fr', cheminFr: chemin || '/' };
  return { langue: trouve[1] as LangueTraduite, cheminFr: trouve[2] || '/' };
};

/**
 * Versions d'une page dans chaque langue, pour les balises hreflang : les
 * trois si la page est traduite, sinon la seule version française.
 */
export const versionsDe = (chemin: string): Partial<Record<Langue, string>> => {
  const { cheminFr } = analyserChemin(chemin);
  if (!estTraduit(cheminFr)) return { fr: cheminFr };
  return { fr: cheminFr, ar: cheminEn('ar', cheminFr), en: cheminEn('en', cheminFr) };
};

/** Lien du sélecteur : la même page dans la langue choisie, sinon son accueil. */
export const lienVersLangue = (langue: Langue, cheminActuel: string): string => {
  const { cheminFr } = analyserChemin(cheminActuel);
  return estTraduit(cheminFr) ? cheminEn(langue, cheminFr) : accueilParLangue[langue];
};
