'use client';

import { useActionState, useState } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { enregistrerGroupe } from '@/app/admin/actions';
import type { ChampEditable, GroupeEditable } from '@/config/editable';
import { etatEnregistrementInitial } from '@/lib/admin/etats';
import { cn } from '@/lib/utils';

type ChampsFormProps = {
  groupe: GroupeEditable;
  /** Valeur actuellement affichée sur le site, champ par champ. */
  valeurs: Record<string, string>;
};

const classeChamp = (enErreur: boolean) =>
  cn(
    'w-full rounded-xl border bg-surface px-4 py-3 text-[0.95rem] text-ink transition-colors duration-300 placeholder:text-ink-soft/70 dark:bg-paper',
    'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-line',
    enErreur ? 'border-danger-ink/60 bg-danger-surface' : 'border-[var(--border)]',
  );

function Champ({
  champ,
  valeur,
  erreur,
}: {
  champ: ChampEditable;
  valeur: string;
  erreur?: string;
}) {
  const [longueur, setLongueur] = useState(valeur.length);

  const idErreur = `${champ.cle}-erreur`;
  const idAide = `${champ.cle}-aide`;
  const decrit = [champ.aide ? idAide : null, erreur ? idErreur : null].filter(Boolean).join(' ');

  // Le compteur n'apparaît qu'en approche du seuil : affiché en permanence,
  // il attirerait l'œil sur une contrainte sans importance.
  const seuil = champ.longueurConseillee ?? champ.longueurMax;
  const proche = longueur >= seuil * 0.8;
  const depasse = longueur > seuil;

  return (
    <div>
      <label htmlFor={champ.cle} className="block font-display text-[0.9rem] font-semibold text-navy-800">
        {champ.label}
        {champ.facultatif ? (
          <span className="ml-2 font-sans text-[0.78rem] font-normal text-ink-soft">facultatif</span>
        ) : null}
      </label>

      {champ.aide ? (
        <p id={idAide} className="mt-1 text-[0.85rem] leading-relaxed text-ink-soft">
          {champ.aide}
        </p>
      ) : null}

      <div className="mt-2.5">
        {champ.type === 'paragraphe' ? (
          <textarea
            id={champ.cle}
            name={champ.cle}
            rows={3}
            defaultValue={valeur}
            maxLength={champ.longueurMax}
            onChange={(event) => setLongueur(event.target.value.length)}
            aria-describedby={decrit || undefined}
            aria-invalid={erreur ? true : undefined}
            className={cn(classeChamp(Boolean(erreur)), 'resize-y')}
          />
        ) : (
          <input
            id={champ.cle}
            name={champ.cle}
            type={champ.type === 'email' ? 'email' : champ.type === 'telephone' ? 'tel' : 'text'}
            defaultValue={valeur}
            maxLength={champ.longueurMax}
            onChange={(event) => setLongueur(event.target.value.length)}
            aria-describedby={decrit || undefined}
            aria-invalid={erreur ? true : undefined}
            className={classeChamp(Boolean(erreur))}
          />
        )}
      </div>

      {proche ? (
        <p
          aria-hidden="true"
          className={cn(
            'mt-2 text-right text-[0.78rem] tabular-nums',
            depasse ? 'font-medium text-warn-ink' : 'text-ink-soft',
          )}
        >
          {longueur} / {seuil}
          {depasse && champ.longueurConseillee ? ' — la fin sera coupée par Google' : null}
        </p>
      ) : null}

      {erreur ? (
        <p id={idErreur} className="mt-2 text-[0.85rem] font-medium text-danger-ink">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}

export function ChampsForm({ groupe, valeurs }: ChampsFormProps) {
  const [etat, action, enCours] = useActionState(enregistrerGroupe, etatEnregistrementInitial);

  return (
    <form action={action} noValidate>
      <input type="hidden" name="groupe" value={groupe.slug} />

      {etat.status !== 'idle' && etat.message ? (
        <p
          role="status"
          className={cn(
            'mb-8 flex items-start gap-3 rounded-2xl border px-5 py-4 text-[0.92rem]',
            etat.status === 'success'
              ? 'border-brand-line bg-brand-tint text-navy-800'
              : 'border-danger-line bg-danger-surface text-danger-ink',
          )}
        >
          {etat.status === 'success' ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          {etat.message}
        </p>
      ) : null}

      <div className="space-y-7">
        {groupe.champs.map((champ) => (
          <Champ
            key={champ.cle}
            champ={champ}
            valeur={valeurs[champ.cle] ?? ''}
            erreur={etat.erreurs?.[champ.cle]}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4 border-t border-[var(--border)] pt-7">
        <button
          type="submit"
          disabled={enCours}
          className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enCours ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {enCours ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <p className="text-[0.85rem] text-ink-soft">
          Les modifications sont visibles sur le site dès l’enregistrement.
        </p>
      </div>
    </form>
  );
}
