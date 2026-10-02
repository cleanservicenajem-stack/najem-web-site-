/**
 * Informations légales.
 *
 * Ces champs doivent être renseignés par l'entreprise avant la mise en ligne.
 * Tant qu'une valeur vaut `null`, la page affiche un marqueur « à compléter »
 * plutôt qu'une information inventée.
 */

export type LegalEntity = {
  /** Raison sociale exacte. */
  legalName: string | null;
  /** Forme juridique (SARL, SAS, auto-entrepreneur…). */
  legalForm: string | null;
  /** Capital social, si applicable. */
  shareCapital: string | null;
  /** Identifiant d'entreprise (ICE / RC / SIREN selon le pays). */
  registrationNumber: string | null;
  /** Identifiant fiscal, si applicable. */
  taxId: string | null;
  /** Adresse du siège. */
  headOffice: string | null;
  /** Directeur ou directrice de la publication. */
  publicationDirector: string | null;
  /** Adresse e-mail de contact légal. */
  legalEmail: string | null;
  /** Hébergeur du site : nom, adresse, contact. */
  host: { name: string; address: string | null; url: string | null } | null;
  /** Date de dernière mise à jour des documents (format ISO). */
  updatedAt: string | null;
};

export const legalEntity: LegalEntity = {
  legalName: null,
  legalForm: null,
  shareCapital: null,
  registrationNumber: null,
  taxId: null,
  headOffice: null,
  publicationDirector: null,
  legalEmail: null,
  host: null,
  updatedAt: null,
};

export const legalIsComplete = Object.entries(legalEntity)
  .filter(([key]) => !['shareCapital', 'taxId', 'updatedAt'].includes(key))
  .every(([, value]) => value !== null);
