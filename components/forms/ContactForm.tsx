'use client';

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { submitContactForm } from '@/app/(site)/contact/actions';
import { initialContactState, type ContactFormState } from '@/lib/contact';
import { subjectLabels, validateContact } from '@/lib/validation';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks';

const fieldClass = (hasError: boolean) =>
  cn(
    // En thème sombre le champ est légèrement creusé par rapport à la carte.
    'w-full rounded-xl border bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 placeholder:text-ink-soft/70 dark:bg-paper',
    'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line',
    hasError ? 'border-danger-ink/60 bg-danger-surface' : 'border-[var(--border)]',
  );

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.8rem] text-danger-ink">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

type ObjetContact = keyof typeof subjectLabels;

type ChampContact = 'firstName' | 'lastName' | 'email' | 'phone' | 'subject' | 'message' | 'consent';

/**
 * Messages des pages traduites (/ar, /en). La validation et l'action serveur
 * répondent en français : ces textes les remplacent à l'affichage, choisis
 * d'après le champ en erreur et l'état renvoyé par l'action.
 */
export type MessagesFormulaireContact = {
  /** Langue des messages (« ar », « en »), pour les règles de pluriel. */
  langue: string;
  succes: string;
  champsACorriger: string;
  /**
   * Trop de demandes : une phrase par catégorie de pluriel
   * (Intl.PluralRules) ; `{minutes}` y est remplacé par le délai d'attente.
   */
  tropDeDemandes: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
  /** Tout autre refus du serveur (envoi impossible). */
  envoiImpossible: string;
  /** Un message par champ, valable quelle que soit la règle non respectée. */
  champs: Record<ChampContact, string>;
};

/**
 * Textes du formulaire. Le français est la valeur par défaut ; les pages
 * traduites passent les leurs. Rien que des données (pas de fonction) : la
 * page, composant serveur, les transmet à ce composant client.
 */
export type TextesFormulaireContact = {
  /** Libellé du champ piège, invisible. */
  champPiege: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  /** « (facultatif) », après « Téléphone ». */
  facultatif: string;
  objet: string;
  choisirObjet: string;
  /** Libellés de la liste « Objet » ; les valeurs envoyées ne changent pas. */
  objets: Record<ObjetContact, string>;
  message: string;
  aideMessage: string;
  consentement: string;
  envoiEnCours: string;
  envoyer: string;
  /** « Les champs marqués d’un * sont obligatoires. », de part et d'autre de l'astérisque. */
  obligatoires: { avant: string; apres: string };
  /** Texte sous le message de confirmation. */
  apresEnvoi: string;
  /** Absents en français : les messages d'origine s'affichent tels quels. */
  messages?: MessagesFormulaireContact;
};

const textesFrancais: TextesFormulaireContact = {
  champPiege: 'Laissez ce champ vide',
  prenom: 'Prénom',
  nom: 'Nom',
  email: 'E-mail',
  telephone: 'Téléphone',
  facultatif: '(facultatif)',
  objet: 'Objet',
  choisirObjet: 'Choisissez un objet',
  objets: subjectLabels,
  message: 'Message',
  aideMessage: 'Précisez votre besoin : type de logement, prestation envisagée, disponibilités.',
  consentement: 'J’accepte que ces informations soient utilisées pour traiter ma demande.',
  envoiEnCours: 'Envoi en cours…',
  envoyer: 'Envoyer le message',
  obligatoires: { avant: 'Les champs marqués d’un ', apres: ' sont obligatoires.' },
  apresEnvoi:
    'Nous revenons vers vous à l’adresse indiquée. Pour une demande liée à une réservation en cours, l’application reste le canal le plus direct.',
};

export function ContactForm({ textes = textesFrancais }: { textes?: TextesFormulaireContact }) {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    initialContactState,
  );
  const reduceMotion = usePrefersReducedMotion();
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus();
  }, [state]);

  // Validation immédiate avant tout aller-retour réseau. Le serveur rejoue le
  // même schéma : ce contrôle est un confort, jamais une garantie.
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validateBeforeSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const found = validateContact(Object.fromEntries(new FormData(form).entries()));

    if (Object.keys(found).length === 0) {
      setClientErrors({});
      return;
    }

    event.preventDefault();
    setClientErrors(found);

    const firstInvalid = form.querySelector<HTMLElement>(
      Object.keys(found)
        .map((key) => `[name="${key}"]`)
        .join(', '),
    );
    firstInvalid?.focus();
  };

  /** L'erreur d'un champ disparaît dès que l'utilisateur le corrige. */
  const clearFieldError = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement | null)?.name;
    if (!name) return;

    setClientErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const errors = { ...(state.fieldErrors ?? {}), ...clientErrors };
  // React réinitialise le formulaire après l'action : les champs repartent de
  // ces valeurs, renvoyées par le serveur en cas de refus.
  const values = state.values;
  const { messages } = textes;

  /** Erreur d'un champ ; dans une page traduite, le message prévu pour ce champ. */
  const erreurDe = (champ: ChampContact): string | undefined => {
    const message = errors[champ];
    return message && messages ? messages.champs[champ] : message;
  };

  /** Message renvoyé par l'action ; dans une page traduite, celui du cas reconnu. */
  const messageServeur = (): string | undefined => {
    if (!messages) return state.message;
    if (state.status === 'success') return messages.succes;
    if (state.fieldErrors) return messages.champsACorriger;

    const attente = /(\d+)\s*minute/.exec(state.message ?? '');
    if (!attente) return messages.envoiImpossible;

    const minutes = Number(attente[1]);
    const phrase =
      messages.tropDeDemandes[new Intl.PluralRules(messages.langue).select(minutes)] ??
      messages.tropDeDemandes.other;
    return phrase.replace('{minutes}', String(minutes));
  };

  if (state.status === 'success') {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="rounded-3xl border border-teal-brand/30 bg-[image:var(--gradient-success-soft)] p-8 text-center outline-none"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface text-teal-brand shadow-[var(--shadow-soft)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-[1.2rem] font-semibold text-navy-800">
          {messageServeur()}
        </p>
        <p className="mx-auto mt-2.5 max-w-md text-[0.925rem] leading-relaxed text-ink-soft">
          {textes.apresEnvoi}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={validateBeforeSubmit}
      onInput={clearFieldError}
      noValidate
      className="space-y-5"
    >
      {/* Champ piège — masqué visuellement et au lecteur d'écran.
          Son nom et son libellé sont volontairement neutres : un champ nommé
          « société » est reconnu par le remplissage automatique de Chrome, qui
          le complète tout seul et fait écarter une demande bien réelle. */}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="reference">{textes.champPiege}</label>
        <input
          id="reference"
          name="reference"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
            {`${textes.prenom} `}<span className="text-brand-600">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            defaultValue={values?.firstName ?? ''}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className={fieldClass(Boolean(errors.firstName))}
          />
          <FieldError id="firstName-error" message={erreurDe('firstName')} />
        </div>

        <div>
          <label htmlFor="lastName" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
            {`${textes.nom} `}<span className="text-brand-600">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            defaultValue={values?.lastName ?? ''}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className={fieldClass(Boolean(errors.lastName))}
          />
          <FieldError id="lastName-error" message={erreurDe('lastName')} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
            {`${textes.email} `}<span className="text-brand-600">*</span>
          </label>
          {/* `dir="auto"` : une adresse ou un numéro reste lisible dans une page en arabe. */}
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="auto"
            required
            defaultValue={values?.email ?? ''}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
          <FieldError id="email-error" message={erreurDe('email')} />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
            {`${textes.telephone} `}<span className="text-ink-soft">{textes.facultatif}</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="auto"
            defaultValue={values?.phone ?? ''}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={fieldClass(Boolean(errors.phone))}
          />
          <FieldError id="phone-error" message={erreurDe('phone')} />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
          {`${textes.objet} `}<span className="text-brand-600">*</span>
        </label>
        <select
          key={state.token ?? 'initial'}
          id="subject"
          name="subject"
          required
          defaultValue={values?.subject ?? ''}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          className={cn(fieldClass(Boolean(errors.subject)), 'appearance-none pe-10')}
        >
          <option value="" disabled>
            {textes.choisirObjet}
          </option>
          {Object.entries(subjectLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {textes.objets[value as ObjetContact] ?? label}
            </option>
          ))}
        </select>
        <FieldError id="subject-error" message={erreurDe('subject')} />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-[0.875rem] font-medium text-navy-800">
          {`${textes.message} `}<span className="text-brand-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={values?.message ?? ''}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : 'message-hint'}
          className={cn(fieldClass(Boolean(errors.message)), 'resize-y')}
        />
        {errors.message ? (
          <FieldError id="message-error" message={erreurDe('message')} />
        ) : (
          <p id="message-hint" className="mt-1.5 text-[0.8rem] text-ink-soft">
            {textes.aideMessage}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="consent" className="flex items-start gap-3 text-[0.875rem] text-ink-soft">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            defaultChecked={values?.consent ?? false}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-brand-600 focus:ring-brand-300"
          />
          <span>
            {textes.consentement}{' '}
            <span className="text-brand-600">*</span>
          </span>
        </label>
        <FieldError id="consent-error" message={erreurDe('consent')} />
      </div>

      <AnimatePresence>
        {state.status === 'error' && state.message ? (
          <motion.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="flex items-start gap-3 rounded-xl border border-danger-line bg-danger-surface p-4 text-[0.9rem] text-danger-ink outline-none"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {messageServeur()}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="group relative inline-flex h-13 items-center justify-center gap-2 overflow-hidden rounded-full bg-[image:var(--gradient-brand)] px-7 py-3.5 text-[0.95rem] font-medium text-white shadow-[0_10px_30px_-14px_rgba(10,111,207,0.85)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {textes.envoiEnCours}
            </>
          ) : (
            <>
              {textes.envoyer}
              <Send
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        <p className="text-[0.8rem] text-ink-soft">
          {textes.obligatoires.avant}<span className="text-brand-600">*</span>{textes.obligatoires.apres}
        </p>
      </div>
    </form>
  );
}
