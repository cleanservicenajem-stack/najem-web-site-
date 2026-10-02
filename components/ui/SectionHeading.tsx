import type { ReactNode } from 'react';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  /** Niveau de titre — h2 par défaut, h1 sur les en-têtes de page. */
  as?: 'h1' | 'h2';
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = 'left',
  tone = 'light',
  className,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <Reveal y={10}>
          <p
            className={cn(
              'flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em]',
              align === 'center' && 'justify-center',
              tone === 'dark' ? 'text-brand-200' : 'text-brand-600',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'h-px w-6',
                tone === 'dark' ? 'bg-brand-300/60' : 'bg-brand-400/70',
              )}
            />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}

      <Reveal y={16} delay={0.06}>
        <Heading
          id={id}
          className={cn(
            'mt-4 font-display text-[clamp(1.75rem,1.15rem+2.4vw,2.9rem)] font-bold leading-[1.1]',
            Heading === 'h1' && 'text-[clamp(2rem,1.3rem+3vw,3.4rem)]',
            tone === 'dark' && 'text-white',
          )}
        >
          {title}
        </Heading>
      </Reveal>

      {lead ? (
        <Reveal y={16} delay={0.12}>
          <div
            className={cn(
              'mt-5 text-[1.0625rem] leading-relaxed',
              tone === 'dark' ? 'text-brand-100/80' : 'text-ink-soft',
            )}
          >
            {lead}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
