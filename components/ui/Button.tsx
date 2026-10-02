import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-[transform,box-shadow,background-color,color] duration-300 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-55 active:translate-y-px';

const variants: Record<Variant, string> = {
  primary:
    'text-white shadow-[0_10px_30px_-14px_rgba(10,111,207,0.85)] hover:shadow-[0_18px_40px_-16px_rgba(10,111,207,0.9)] hover:-translate-y-0.5 bg-[image:var(--gradient-brand)]',
  secondary:
    'border border-brand-line-strong bg-surface text-navy-600 hover:border-brand-400 hover:text-navy-700 hover:-translate-y-0.5 shadow-[0_6px_20px_-16px_rgba(6,36,66,0.5)]',
  ghost: 'text-navy-600 hover:bg-brand-tint',
  // Posé sur un aplat sombre dans les deux thèmes : ses couleurs sont fixes.
  onDark:
    'bg-white text-night hover:bg-brand-50 hover:-translate-y-0.5 shadow-[0_14px_36px_-18px_rgba(0,0,0,0.8)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Icône affichée après le libellé. */
  icon?: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  type?: never;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>;

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never;
    external?: never;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Reflet qui balaie le bouton au survol — uniquement sur la variante primaire. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
    />
  );
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, icon } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {variant === 'primary' ? <Sheen /> : null}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon ? (
          <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">
            {icon}
          </span>
        ) : null}
      </span>
    </>
  );

  if ('href' in props && props.href) {
    const { href, external, children: _children, variant: _v, size: _s, className: _c, icon: _i, ...rest } = props;

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const {
    children: _children,
    variant: _v,
    size: _s,
    className: _c,
    icon: _i,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
