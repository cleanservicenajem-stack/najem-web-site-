import { z } from 'zod';

/** Retire les caractères de contrôle et normalise les espaces. */
export const sanitize = (value: string): string =>
  value
    .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const name = z
  .string()
  .trim()
  .min(2, 'Au moins 2 caractères.')
  .max(60, 'Ce champ est trop long.')
  .transform(sanitize);

export const contactSchema = z.object({
  firstName: name,
  lastName: name,
  email: z
    .string()
    .trim()
    .min(1, 'L’adresse e-mail est requise.')
    .max(160, 'Adresse trop longue.')
    .pipe(z.email('Format d’adresse e-mail invalide.')),
  phone: z
    .string()
    .trim()
    .max(30, 'Numéro trop long.')
    .regex(/^[+0-9 ().-]*$/, 'Numéro de téléphone invalide.')
    .optional()
    .or(z.literal('')),
  subject: z.enum(['reservation', 'application', 'prestation', 'autre'], {
    message: 'Choisissez un objet.',
  }),
  message: z
    .string()
    .trim()
    .min(20, 'Merci de détailler votre demande (20 caractères minimum).')
    .max(2000, 'Message trop long (2000 caractères maximum).')
    .transform((value) => sanitize(value).slice(0, 2000)),
  consent: z.literal('on', { message: 'Votre accord est nécessaire pour traiter la demande.' }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Validation partagée entre le client et le serveur.
 *
 * Le navigateur l'exécute avant l'envoi pour un retour immédiat ; le serveur la
 * rejoue systématiquement, car un contrôle côté client n'est jamais une
 * garantie.
 */
export const validateContact = (data: Record<string, unknown>): Record<string, string> => {
  const parsed = contactSchema.safeParse(data);
  if (parsed.success) return {};

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? 'form');
    if (!errors[key]) errors[key] = issue.message;
  }

  return errors;
};

export const subjectLabels: Record<ContactInput['subject'], string> = {
  reservation: 'Une réservation',
  application: 'L’application mobile',
  prestation: 'Une prestation de nettoyage',
  autre: 'Autre sujet',
};
