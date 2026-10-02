'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/hooks';
import { setThemePreference } from '@/lib/theme';
import { cn } from '@/lib/utils';

/**
 * Bascule clair / sombre.
 *
 * Tant que le visiteur n'a pas cliqué, le site suit les réglages de son
 * système ; le clic enregistre un choix explicite qui prend le dessus.
 *
 * `variant` :
 *  - `icon`   : bouton rond du header ;
 *  - `switch` : ligne libellée du menu mobile, où l'icône seule serait
 *    ambiguë au milieu d'une liste de liens.
 */
type ThemeToggleProps = {
  variant?: 'icon' | 'switch';
  className?: string;
};

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const isDark = useTheme() === 'dark';
  const action = isDark ? 'Activer le thème clair' : 'Activer le thème sombre';

  const toggle = () => setThemePreference(isDark ? 'light' : 'dark');

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={action}
        onClick={toggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-surface px-4 py-3.5 text-left transition-colors duration-300 hover:border-brand-line-strong',
          className,
        )}
      >
        <span className="flex items-center gap-3">
          <SwapIcons isDark={isDark} className="h-5 w-5 text-brand-600" />
          <span className="font-display text-[0.95rem] font-semibold text-navy-800">
            Thème sombre
          </span>
        </span>

        <span
          aria-hidden="true"
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300',
            isDark ? 'bg-brand-600' : 'bg-paper-deep',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(6,36,66,0.35)] transition-transform duration-300 ease-[var(--ease-out-soft)] motion-reduce:transition-none',
              isDark ? 'translate-x-[1.375rem]' : 'translate-x-0.5',
            )}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isDark}
      aria-label={action}
      title={action}
      onClick={toggle}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-surface/70 text-navy-800 transition-colors duration-300 hover:bg-surface hover:text-brand-600',
        className,
      )}
    >
      <SwapIcons isDark={isDark} className="h-[1.15rem] w-[1.15rem]" />
    </button>
  );
}

/**
 * Les deux icônes sont superposées et permutent par rotation : un simple
 * remplacement conditionnel provoquerait un saut visuel.
 */
function SwapIcons({ isDark, className }: { isDark: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('relative block h-[1.15rem] w-[1.15rem]', className)}>
      <Sun
        className={cn(
          'absolute inset-0 h-full w-full transition-all duration-400 ease-[var(--ease-out-soft)] motion-reduce:transition-none',
          isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
      <Moon
        className={cn(
          'absolute inset-0 h-full w-full transition-all duration-400 ease-[var(--ease-out-soft)] motion-reduce:transition-none',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
        )}
      />
    </span>
  );
}
