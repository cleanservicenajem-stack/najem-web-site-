'use client';

import { useActionState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { seConnecter } from '@/app/admin/actions';
import { etatConnexionInitial } from '@/lib/admin/etats';

const champ =
  'mt-2.5 w-full rounded-xl border border-[var(--border)] bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line dark:bg-paper';

export function ConnexionForm({ suivant }: { suivant: string }) {
  const [etat, action, enCours] = useActionState(seConnecter, etatConnexionInitial);
  const enErreur = etat.status === 'error';

  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="suivant" value={suivant} />

      <label htmlFor="email" className="block font-display text-[0.9rem] font-semibold text-navy-800">
        Adresse e-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        maxLength={200}
        aria-describedby={enErreur ? 'connexion-erreur' : undefined}
        aria-invalid={enErreur ? true : undefined}
        className={champ}
      />

      <label
        htmlFor="motDePasse"
        className="mt-5 block font-display text-[0.9rem] font-semibold text-navy-800"
      >
        Mot de passe
      </label>
      <input
        id="motDePasse"
        name="motDePasse"
        type="password"
        autoComplete="current-password"
        required
        maxLength={200}
        aria-describedby={enErreur ? 'connexion-erreur' : undefined}
        aria-invalid={enErreur ? true : undefined}
        className={champ}
      />

      {enErreur && etat.message ? (
        <p
          id="connexion-erreur"
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger-line bg-danger-surface px-4 py-3 text-[0.9rem] text-danger-ink"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {etat.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enCours}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enCours ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {enCours ? 'Vérification…' : 'Se connecter'}
      </button>
    </form>
  );
}
