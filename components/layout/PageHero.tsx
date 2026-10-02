import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs';
import { Reveal } from '@/components/animations/Reveal';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
  className?: string;
};

/**
 * En-tête commun aux pages intérieures : le fond remonte derrière le header
 * transparent, ce qui évite toute rupture visuelle en haut de page.
 */
export function PageHero({ eyebrow, title, lead, crumbs, children, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative -mt-[var(--header-height)] overflow-hidden border-b border-[var(--border)] bg-[image:var(--gradient-brand-soft)] pb-14 pt-[calc(var(--header-height)+2.5rem)] md:pb-20 md:pt-[calc(var(--header-height)+4rem)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.16),transparent_70%)]"
      />

      <Container className="relative">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 max-w-3xl">
          {eyebrow ? (
            <Reveal y={10}>
              <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                <span aria-hidden="true" className="h-px w-6 bg-brand-400/70" />
                {eyebrow}
              </p>
            </Reveal>
          ) : null}

          <Reveal y={16} delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2rem,1.3rem+3vw,3.35rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-navy-900">
              {title}
            </h1>
          </Reveal>

          {lead ? (
            <Reveal y={16} delay={0.11}>
              <div className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.15rem]">
                {lead}
              </div>
            </Reveal>
          ) : null}
        </div>

        {children ? (
          <Reveal y={16} delay={0.16}>
            <div className="mt-9">{children}</div>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
