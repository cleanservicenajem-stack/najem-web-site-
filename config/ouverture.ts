/**
 * Ouverture des réservations (décision du 26 novembre 2026).
 *
 * Tant que les créneaux sont fermés dans l'application, le site annonce
 * l'ouverture au lieu d'inviter à réserver. À l'ouverture : passer
 * `reservationsOuvertes` à `true` et annuler la modification des textes qui
 * accompagne ce fichier (même commit).
 */
export const reservationsOuvertes: boolean = false;

export const mentionOuverture = {
  fr: 'Ouverture des réservations bientôt annoncée.',
  en: 'Booking opening date to be announced soon.',
  ar: 'سيتم الإعلان قريبا عن موعد فتح الحجز.',
} as const;
