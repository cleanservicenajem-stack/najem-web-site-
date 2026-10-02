/**
 * Liste des adresses autorisées à ouvrir l'administration.
 *
 * Ce module est volontairement isolé et sans dépendance : il est importé aussi
 * bien par le proxy, qui ne peut pas utiliser `next/headers`, que par les
 * pages et les actions.
 */

/**
 * Adresses habilitées, séparées par des virgules dans `ADMIN_EMAILS`.
 * Une liste vide ne laisse entrer personne : en cas d'oubli, l'administration
 * se ferme au lieu de s'ouvrir.
 */
export const adressesAutorisees = (): string[] =>
  (process.env.ADMIN_EMAILS ?? '')
    .split(/[,;\s]+/)
    .map((adresse) => adresse.trim().toLowerCase())
    .filter(Boolean);

export const estAdministrateur = (email: string): boolean =>
  adressesAutorisees().includes(email.trim().toLowerCase());
