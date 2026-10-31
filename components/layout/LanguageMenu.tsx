'use client';

import { Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import {
  langues,
  libelleChoixLangue,
  libellesLangues,
  lienVersLangue,
  type Langue,
} from '@/config/i18n';
import { Drapeau } from '@/components/ui/Drapeau';
import { cn } from '@/lib/utils';

/**
 * Choix de la langue en menu compact (le drapeau de la langue courante), pour
 * l'en-tête des écrans où la navigation complète laisse peu de place.
 *
 * Les liens restent de vrais liens, présents dans la page même menu fermé :
 * un changement de langue recharge la page, comme avec `LanguageSwitcher`.
 */
export function LanguageMenu({ courante, className }: { courante: Langue; className?: string }) {
  const [ouvert, setOuvert] = useState(false);
  const racine = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const panneau = useId();
  const chemin = usePathname() ?? '/';

  useEffect(() => {
    if (!ouvert) return;

    const clicDehors = (event: PointerEvent) => {
      if (racine.current && !racine.current.contains(event.target as Node)) setOuvert(false);
    };
    const echap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOuvert(false);
        bouton.current?.focus();
      }
    };

    document.addEventListener('pointerdown', clicDehors);
    document.addEventListener('keydown', echap);
    return () => {
      document.removeEventListener('pointerdown', clicDehors);
      document.removeEventListener('keydown', echap);
    };
  }, [ouvert]);

  const libelle = `${libelleChoixLangue[courante]} : ${libellesLangues[courante].complet}`;
  const ligne =
    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9rem] font-medium transition-colors duration-300';

  return (
    <div
      ref={racine}
      className={cn('relative', className)}
      onBlur={(event) => {
        // Le menu se referme quand la navigation au clavier le quitte.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOuvert(false);
      }}
    >
      <button
        ref={bouton}
        type="button"
        aria-expanded={ouvert}
        aria-controls={panneau}
        aria-label={libelle}
        title={libelle}
        onClick={() => setOuvert((valeur) => !valeur)}
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-surface/70 transition-colors duration-300 hover:bg-surface',
          ouvert && 'bg-surface',
        )}
      >
        <Drapeau langue={courante} className="h-4 w-[1.375rem]" />
      </button>

      <div
        id={panneau}
        hidden={!ouvert}
        className="absolute end-0 top-full z-10 mt-2 min-w-44 rounded-2xl border border-[var(--border)] bg-surface p-1.5 shadow-[0_20px_50px_-24px_rgba(6,36,66,0.55)]"
      >
        <ul>
          {langues.map((langue) => {
            const { complet } = libellesLangues[langue];
            // L'arabe paraît plus petit à taille égale : on le grossit un peu.
            const taille = langue === 'ar' ? 'text-[1rem]' : undefined;
            return (
              <li key={langue}>
                {langue === courante ? (
                  <span aria-current="true" lang={langue} className={cn(ligne, taille, 'text-brand-700')}>
                    <Drapeau langue={langue} />
                    <span className="flex-1">{complet}</span>
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : (
                  <a
                    href={lienVersLangue(langue, chemin)}
                    hrefLang={langue}
                    lang={langue}
                    className={cn(ligne, taille, 'text-navy-800 hover:bg-brand-tint hover:text-brand-700')}
                  >
                    <Drapeau langue={langue} />
                    <span className="flex-1">{complet}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
