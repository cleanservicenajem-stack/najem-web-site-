'use server';

import { headers } from 'next/headers';
import { siteConfig } from '@/config/site';
import { enregistrerMessage } from '@/lib/admin/messages';
import type { ContactFormState, ContactValues } from '@/lib/contact';
import { rateLimit } from '@/lib/rate-limit';
import { contactSchema, subjectLabels, validateContact } from '@/lib/validation';

const clientIp = async (): Promise<string> => {
  const store = await headers();
  const forwarded = store.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'inconnu';
  return store.get('x-real-ip') ?? 'inconnu';
};

/**
 * Envoi du message par e-mail.
 *
 * Aucun secret n'est exposé côté client : la clé API et l'adresse de réception
 * sont lues uniquement ici, côté serveur. Tant que `RESEND_API_KEY` et
 * `CONTACT_INBOX_EMAIL` ne sont pas renseignés, l'envoi échoue — le message
 * reste alors consultable dans l'administration, qui est l'autre canal.
 */
const deliver = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.CONTACT_INBOX_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !inbox || !from) {
    console.error(
      '[contact] Envoi impossible : RESEND_API_KEY, CONTACT_FROM_EMAIL et CONTACT_INBOX_EMAIL doivent être renseignés.',
    );
    return false;
  }

  const lines = [
    `Nom : ${payload.lastName}`,
    `Prénom : ${payload.firstName}`,
    `E-mail : ${payload.email}`,
    payload.phone ? `Téléphone : ${payload.phone}` : null,
    `Objet : ${payload.subject}`,
    '',
    payload.message,
  ].filter(Boolean);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [inbox],
        reply_to: payload.email,
        subject: `[${siteConfig.name}] ${payload.subject} — ${payload.firstName} ${payload.lastName}`,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      console.error('[contact] Réponse du fournisseur e-mail :', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[contact] Erreur réseau lors de l’envoi :', error);
    return false;
  }
};

/** Valeurs à réafficher lorsqu'une soumission est refusée. */
const echoValues = (formData: FormData): ContactValues => {
  const read = (key: string) => String(formData.get(key) ?? '').slice(0, 4000);

  return {
    firstName: read('firstName'),
    lastName: read('lastName'),
    email: read('email'),
    phone: read('phone'),
    subject: read('subject'),
    message: read('message'),
    consent: formData.get('consent') === 'on',
  };
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData.entries());
  const values = echoValues(formData);
  const token = crypto.randomUUID();

  // Champ piège, vérifié avant tout le reste : un robot le remplit, un humain
  // ne le voit pas. Son nom n'évoque rien pour le remplissage automatique des
  // navigateurs, sans quoi une vraie demande serait écartée ici.
  if (String(formData.get('reference') ?? '').length > 0) {
    console.warn('[contact] Soumission écartée : champ piège rempli.');
    return { status: 'success', message: 'Merci. Votre message a bien été envoyé.' };
  }

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Certains champs doivent être corrigés.',
      fieldErrors: validateContact(raw),
      values,
      token,
    };
  }

  const data = parsed.data;
  const ip = await clientIp();
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });

  if (!limit.success) {
    return {
      status: 'error',
      message: `Trop de demandes envoyées. Merci de réessayer dans ${Math.ceil(
        limit.retryAfterSeconds / 60,
      )} minutes.`,
      values,
      token,
    };
  }

  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || undefined,
    subject: subjectLabels[data.subject],
    message: data.message,
  };

  // Les deux canaux sont tentés en parallèle. Le message est considéré comme
  // reçu dès que l'un des deux aboutit : un e-mail en échec ne doit pas faire
  // perdre une demande déjà enregistrée en base, et inversement.
  const [enregistre, sent] = await Promise.all([
    enregistrerMessage({
      prenom: payload.firstName,
      nom: payload.lastName,
      email: payload.email,
      telephone: payload.phone,
      objet: payload.subject,
      message: payload.message,
    }),
    deliver(payload),
  ]);

  if (!enregistre && !sent) {
    return {
      status: 'error',
      message:
        'L’envoi n’a pas pu aboutir. Merci de réessayer dans quelques minutes, ou de passer par l’application pour une demande liée à une réservation.',
      values,
      token,
    };
  }

  return { status: 'success', message: 'Merci. Votre message a bien été envoyé.' };
}
