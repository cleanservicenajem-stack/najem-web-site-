import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Rythme vertical commun à toutes les sections. */
  spacing?: 'sm' | 'md' | 'lg';
  tone?: 'white' | 'paper' | 'navy';
  'aria-labelledby'?: string;
};

const spacings = {
  sm: 'py-14 md:py-20',
  md: 'py-20 md:py-28',
  lg: 'py-24 md:py-36',
} as const;

const tones = {
  white: 'bg-surface',
  paper: 'bg-paper',
  navy: 'bg-night text-white',
} as const;

export function Section({
  children,
  id,
  className,
  spacing = 'md',
  tone = 'white',
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative', spacings[spacing], tones[tone], className)}
      aria-labelledby={rest['aria-labelledby']}
    >
      {children}
    </section>
  );
}
