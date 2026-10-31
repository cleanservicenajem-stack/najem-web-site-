import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Logo officiel Najem Clean Service (version d'octobre 2026).
 *
 * Les fichiers proviennent du logo fourni par l'entreprise : le fond blanc a
 * été détouré et l'artwork découpé par `scripts/prepare-logo-2026.py`. Aucune
 * forme ni typographie n'a été redessinée. La variante « dark » passe le bleu
 * marine au blanc ; les bleus vifs (maison, balayage, étoiles, « CLEAN
 * SERVICE ») restent identiques.
 *
 * - `lockup` : symbole + bloc « NAJEM / CLEAN SERVICE » côte à côte (header,
 *   en-têtes compacts).
 * - `stacked` : logo complet d'origine, symbole au-dessus du nom (footer).
 *
 * `tone: 'auto'` affiche les deux masters et laisse le CSS choisir selon le
 * thème. Le choix ne peut pas dépendre du JavaScript : le logo serait alors
 * faux pendant l'hydratation, ou déclencherait un écart serveur / client.
 */

/** Ratios réels des fichiers (identiques entre variantes claire et sombre). */
const symbolRatio = 610 / 448;
const wordmarkRatio = 924 / 263;
const stackedRatio = 924 / 749;

type Tone = 'light' | 'dark' | 'auto';

type LogoProps = {
  variant?: 'lockup' | 'stacked';
  tone?: Tone;
  /** Hauteur du symbole en pixels (le bloc typo suit proportionnellement). */
  size?: number;
  className?: string;
  priority?: boolean;
};

const sources = {
  light: {
    stacked: '/images/logo/najem-logo.png',
    symbol: '/images/logo/najem-symbol.png',
    wordmark: '/images/logo/najem-wordmark-compact.png',
  },
  dark: {
    stacked: '/images/logo/najem-logo-dark.png',
    symbol: '/images/logo/najem-symbol-dark.png',
    wordmark: '/images/logo/najem-wordmark-compact-dark.png',
  },
} as const;

/**
 * En mode `auto`, les deux masters sont dans le DOM et l'un des deux est en
 * `display: none`. Le chargement doit donc rester explicitement immédiat :
 * une image masquée n'est jamais « visible » pour le chargement différé.
 */
const toneVisibility = {
  stacked: { light: 'dark:hidden', dark: 'hidden dark:block' },
  lockup: { light: 'dark:hidden', dark: 'hidden dark:inline-flex' },
} as const;

function StackedLogo({
  tone,
  size,
  priority,
  className,
  hiddenClass,
}: {
  tone: 'light' | 'dark';
  size: number;
  priority: boolean;
  className?: string;
  hiddenClass?: string;
}) {
  return (
    <Image
      src={sources[tone].stacked}
      alt={`${siteConfig.name} — logo`}
      width={924}
      height={749}
      // Dimensions intrinsèques du fichier + mise à l'échelle en CSS : le ratio
      // d'origine est conservé quelle que soit la taille demandée.
      {...(priority ? { priority: true } : { loading: 'eager' as const })}
      className={cn('w-auto', hiddenClass, className)}
      style={{ height: size }}
      sizes={`${Math.round(size * stackedRatio)}px`}
    />
  );
}

function LockupLogo({
  tone,
  size,
  priority,
  hiddenClass,
}: {
  tone: 'light' | 'dark';
  size: number;
  priority: boolean;
  hiddenClass?: string;
}) {
  const symbolWidth = Math.round(size * symbolRatio);
  const wordmarkHeight = Math.round(size * 0.72);
  const wordmarkWidth = Math.round(wordmarkHeight * wordmarkRatio);
  const loading = priority ? { priority: true } : { loading: 'eager' as const };

  return (
    <span className={cn('inline-flex items-center gap-2.5', hiddenClass)}>
      <Image
        src={sources[tone].symbol}
        alt=""
        aria-hidden="true"
        width={symbolWidth}
        height={size}
        {...loading}
        sizes={`${symbolWidth}px`}
      />
      <Image
        src={sources[tone].wordmark}
        alt={siteConfig.name}
        width={wordmarkWidth}
        height={wordmarkHeight}
        {...loading}
        sizes={`${wordmarkWidth}px`}
      />
    </span>
  );
}

export function Logo({
  variant = 'lockup',
  tone = 'light',
  size = 40,
  className,
  priority = false,
}: LogoProps) {
  const tones: ('light' | 'dark')[] = tone === 'auto' ? ['light', 'dark'] : [tone];

  if (variant === 'stacked') {
    return (
      <>
        {tones.map((current) => (
          <StackedLogo
            key={current}
            tone={current}
            size={size}
            // Une seule des deux variantes est préchargée : la seconde est
            // chargée immédiatement mais sans concurrencer le LCP.
            priority={priority && current === 'light'}
            className={className}
            hiddenClass={tone === 'auto' ? toneVisibility.stacked[current] : undefined}
          />
        ))}
      </>
    );
  }

  return (
    <span className={cn('inline-flex items-center', className)}>
      {tones.map((current) => (
        <LockupLogo
          key={current}
          tone={current}
          size={size}
          priority={priority && current === 'light'}
          hiddenClass={tone === 'auto' ? toneVisibility.lockup[current] : undefined}
        />
      ))}
    </span>
  );
}

type LogoLinkProps = LogoProps & { href?: string; onClick?: () => void };

export function LogoLink({ href = '/', className, onClick, ...props }: LogoLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={`${siteConfig.name} — retour à l'accueil`}
      className={cn(
        'inline-flex shrink-0 rounded-lg transition-opacity duration-300 hover:opacity-85',
        className,
      )}
    >
      <Logo {...props} />
    </Link>
  );
}
