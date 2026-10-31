'use client';

import { usePathname } from 'next/navigation';
import {
  langues,
  libelleChoixLangue,
  libellesLangues,
  lienVersLangue,
  type Langue,
} from '@/config/i18n';
import { Drapeau } from '@/components/ui/Drapeau';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  courante: Langue;
  /** `court` : les drapeaux seuls (en-tête) ; `complet` : drapeau et nom de la langue. */
  variante?: 'court' | 'complet';
  className?: string;
};

/**
 * Sélecteur de langue par drapeaux : France (français), Maroc (arabe),
 * Royaume-Uni (anglais).
 *
 * Chaque drapeau mène à la même page dans l'autre langue quand elle est
 * traduite, sinon à l'accueil de cette langue. Ce sont de vrais liens, sans
 * navigation côté client : la page se recharge, ce qui garantit que la langue
 * et le sens de lecture (gauche-droite ou droite-gauche) du document suivent.
 */
export function LanguageSwitcher({ courante, variante = 'court', className }: LanguageSwitcherProps) {
  const chemin = usePathname() ?? '/';

  return (
    <nav aria-label={libelleChoixLangue[courante]} className={cn('flex items-center', className)}>
      <ul
        className={cn(
          'flex items-center gap-0.5 border border-[var(--border)] bg-surface/70 p-1',
          // Version longue (menu mobile) : elle passe à la ligne sur petit écran.
          variante === 'complet' ? 'flex-wrap rounded-[1.4rem]' : 'rounded-full',
        )}
      >
        {langues.map((langue) => {
          const { complet } = libellesLangues[langue];
          const classes = cn(
            'inline-flex h-9 items-center justify-center gap-2 rounded-full transition-colors duration-300',
            variante === 'complet' ? 'px-2.5 text-[0.85rem] font-medium' : 'w-9',
          );
          const contenu = (
            <>
              <Drapeau langue={langue} />
              {/* En-tête : le nom reste lisible par les lecteurs d'écran. */}
              <span className={variante === 'complet' ? undefined : 'sr-only'}>{complet}</span>
            </>
          );

          return (
            // Sur mobile, la place manque dans l'en-tête : seules les autres
            // langues y sont proposées, la langue courante étant évidente.
            <li
              key={langue}
              className={cn(langue === courante && variante === 'court' && 'max-sm:hidden')}
            >
              {langue === courante ? (
                <span
                  aria-current="true"
                  lang={langue}
                  title={complet}
                  className={cn(classes, 'bg-brand-tint text-brand-700')}
                >
                  {contenu}
                </span>
              ) : (
                // Lien classique (pas <Link>) : rechargement voulu au changement de langue.
                <a
                  href={lienVersLangue(langue, chemin)}
                  hrefLang={langue}
                  lang={langue}
                  title={complet}
                  className={cn(
                    classes,
                    'text-navy-800/80 hover:bg-brand-tint/60 hover:text-brand-700',
                  )}
                >
                  {contenu}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
