/**
 * Langues du site.
 *
 * Le français reste la langue principale et garde toutes ses adresses
 * actuelles. L'arabe et l'anglais ont leurs propres adresses (/ar, /en) : aucune
 * redirection automatique selon la langue du navigateur, que Google
 * déconseille, puisqu'elle l'empêcherait d'explorer chaque version.
 *
 * Seules les pages réellement traduites existent dans une autre langue. Le
 * sélecteur renvoie donc vers l'accueil de chaque langue, et les balises
 * hreflang ne relient que des pages équivalentes.
 */

export const langues = ['fr', 'ar', 'en'] as const;

export type Langue = (typeof langues)[number];

export const libellesLangues: Record<Langue, { court: string; complet: string }> = {
  fr: { court: 'FR', complet: 'Français' },
  ar: { court: 'ع', complet: 'العربية' },
  en: { court: 'EN', complet: 'English' },
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
