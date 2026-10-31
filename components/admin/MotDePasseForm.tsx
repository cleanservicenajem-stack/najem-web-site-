'use client';

import { useActionState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { changerMotDePasse } from '@/app/admin/actions';
import { etatEnregistrementInitial } from '@/lib/admin/etats';

const champ =
  'mt-2.5 w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line dark:bg-paper';

const champs = [
  { nom: 'actuel', label: 'Mot de passe actuel', autoComplete: 'current-password' },
  { nom: 'nouveau', label: 'Nouveau mot de passe', autoComplete: 'new-password' },
  { nom: 'confirmation', label: 'Nouveau mot de passe, une seconde fois', autoComplete: 'new-password' },
] as const;

export function MotDePasseForm() {
  const [etat, action, enCours] = useActionState(changerMotDePasse, etatEnregistrementInitial);

  if (etat.status === 'success') {
    return (
      <p
        role="status"
        className="mt-8 flex items-start gap-2.5 rounded-xl border border-brand-line bg-brand-tint px-4 py-3 text-[0.95rem] text-brand-700"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {etat.message}
      </p>
    );
  }

  return (
    <form action={action} className="mt-8">
      {champs.map(({ nom, label, autoComplete }, index) => {
        const erreur = etat.erreurs?.[nom];
        return (
          <div key={nom} className={index > 0 ? 'mt-5' : undefined}>
            <label htmlFor={nom} className="block font-display text-[0.9rem] font-semibold text-navy-800">
              {label}
            </label>
            <input
              id={nom}
              name={nom}
              type="password"
              autoComplete={autoComplete}
              required
              maxLength={200}
              aria-invalid={erreur ? true : undefined}
              aria-describedby={erreur ? `${nom}-erreur` : undefined}
              className={champ}
            />
            {erreur ? (
              <p id={`${nom}-erreur`} className="mt-2 text-[0.85rem] text-danger-ink">
                {erreur}
              </p>
            ) : null}
          </div>
        );
      })}

      {etat.status === 'error' && etat.message && !etat.erreurs ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-danger-line bg-danger-surface px-4 py-3 text-[0.9rem] text-danger-ink"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {etat.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enCours}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enCours ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {enCours ? 'Enregistrement…' : 'Changer le mot de passe'}
      </button>
    </form>
  );
}
