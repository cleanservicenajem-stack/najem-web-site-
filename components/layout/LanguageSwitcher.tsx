import {
  accueilParLangue,
  langues,
  libelleChoixLangue,
  libellesLangues,
  type Langue,
} from '@/config/i18n';
import { cn } from '@/lib/utils';

type LanguageSwitcherProps = {
  courante: Langue;
  /** `court` : FR · ع · EN (en-tête) ; `complet` : Français · العربية · English. */
  variante?: 'court' | 'complet';
  /** Sur fond sombre (pied de page). */
  ton?: 'clair' | 'sombre';
  className?: string;
};

/**
 * Sélecteur de langue.
 *
 * Les liens sont de vrais liens, sans navigation côté client : passer d'une
 * langue à l'autre recharge la page, ce qui garantit que la langue et le sens
 * de lecture (gauche-droite ou droite-gauche) du document suivent.
 */
export function LanguageSwitcher({
  courante,
  variante = 'court',
  ton = 'clair',
  className,
}: LanguageSwitcherProps) {
  return (
    <nav aria-label={libelleChoixLangue[courante]} className={cn('flex items-center', className)}>
      <ul
        className={cn(
          'flex items-center gap-0.5 rounded-full border p-1',
          ton === 'clair'
            ? 'border-[var(--border)] bg-surface/70'
            : 'border-white/15 bg-white/5',
        )}
      >
        {langues.map((langue) => {
          const { court, complet } = libellesLangues[langue];
          const texte = variante === 'complet' ? complet : court;
          const classes = cn(
            'inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-[0.8rem] font-semibold transition-colors duration-300',
            langue === 'ar' && 'text-[0.95rem]',
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
                  className={cn(
                    classes,
                    ton === 'clair' ? 'bg-brand-tint text-brand-700' : 'bg-white/15 text-white',
                  )}
                >
                  {texte}
                </span>
              ) : (
                // Lien classique (pas <Link>) : rechargement voulu au changement de langue.
                <a
                  href={accueilParLangue[langue]}
                  hrefLang={langue}
                  lang={langue}
                  title={complet}
                  aria-label={complet}
                  className={cn(
                    classes,
                    ton === 'clair'
                      ? 'text-navy-800/80 hover:text-brand-700'
                      : 'text-brand-100/75 hover:text-white',
                  )}
                >
                  {texte}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
