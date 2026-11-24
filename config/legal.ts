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
  legalName: 'NAJEM CLEAN SERVICE SARL',
  legalForm: 'Société à responsabilité limitée (SARL), au capital de 10 000 DH',
  shareCapital: '10 000 DH',
  registrationNumber:
    'RC n° 712433 (Tribunal de commerce de Casablanca) · ICE 003894123000083 · IF 71778005',
  taxId: 'IF 71778005',
  headOffice:
    'Domiciliée chez MyLegal Offices, Oasis Offices Latitudes, Route de l’Oasis, Bureau 304, Maârif, Casablanca, Maroc',
  // Décision de Houssam (24/11/2026) : directeur de la publication = Ilyas EL KANOUANI.
  publicationDirector: 'Ilyas EL KANOUANI, cogérant',
  legalEmail: 'najemcleanservice@gmail.com',
  // À VÉRIFIER avant mise en ligne : adresse postale officielle de l’hébergeur.
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis',
    url: 'https://vercel.com',
  },
  updatedAt: '2026-11-22',
};

export const legalIsComplete = Object.entries(legalEntity)
  .filter(([key]) => !['shareCapital', 'taxId', 'updatedAt'].includes(key))
  .every(([, value]) => value !== null);
