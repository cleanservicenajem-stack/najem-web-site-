/**
 * État partagé du formulaire de contact.
 *
 * Il vit en dehors de `app/contact/actions.ts` : un fichier « use server » ne
 * peut exporter que des fonctions asynchrones.
 */

/**
 * Valeurs renvoyées au client après une soumission refusée.
 *
 * React réinitialise le formulaire une fois l'action terminée : ces valeurs
 * sont réinjectées en `defaultValue` pour que l'utilisateur ne resaisisse rien.
 */
export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

export type ContactFormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: ContactValues;
  /**
   * Identifiant unique de la tentative. Il sert de `key` au menu déroulant :
   * React n'applique `defaultValue` sur un `select` qu'au montage, un remontage
   * est donc nécessaire pour lui rendre la valeur saisie.
   */
  token?: string;
};

export const initialContactState: ContactFormState = { status: 'idle' };
