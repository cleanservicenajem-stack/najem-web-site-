/**
 * États partagés des formulaires d'administration.
 *
 * Ils vivent hors des fichiers « use server », qui ne peuvent exporter que des
 * fonctions asynchrones.
 */

export type EtatConnexion = {
  status: 'idle' | 'error';
  message?: string;
};

export const etatConnexionInitial: EtatConnexion = { status: 'idle' };

export type EtatEnregistrement = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Erreurs par clé de champ, pour un affichage au bon endroit. */
  erreurs?: Record<string, string>;
};

export const etatEnregistrementInitial: EtatEnregistrement = { status: 'idle' };
