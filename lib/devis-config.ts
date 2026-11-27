/** Réglages de la demande de devis, partagés entre le formulaire et le serveur. */

/** Nombre maximal de photos par demande. */
export const PHOTOS_MAX = 5;

/** Les photos sont supprimées automatiquement après ce délai. */
export const PHOTOS_CONSERVATION_JOURS = 90;

/** Poids maximal d'une photo après réduction sur l'appareil (2 Mo). */
export const PHOTO_POIDS_MAX = 2 * 1024 * 1024;

/**
 * Nombre maximal de photos acceptées, tous visiteurs confondus, sur une heure
 * et sur vingt-quatre heures. Au-delà, la demande de devis reste possible sans
 * photo. À relever si les demandes réelles s'en approchent.
 */
export const PHOTOS_PAR_HEURE = 20;
export const PHOTOS_PAR_JOUR = 40;
