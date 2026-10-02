import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { legalEntity, legalIsComplete } from '@/config/legal';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import { formatDateFr } from '@/lib/utils';

/** Valeur légale : affiche un marqueur explicite tant qu'elle n'est pas fournie. */
export function LegalValue({ value, label }: { value: string | null; label: string }) {
  if (value) return <span>{value}</span>;
  return (
    <span className="inline-flex items-center rounded-md bg-warn-surface px-2 py-0.5 text-[0.85em] font-medium text-warn-ink ring-1 ring-warn-line">
      {label} — à compléter
    </span>
  );
}

type LegalPageProps = {
  title: string;
  lead: string;
  crumbs: Crumb[];
  children: ReactNode;
};

export function LegalPage({ title, lead, crumbs, children }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow="Informations légales" title={title} lead={lead} crumbs={crumbs} />

      <section className="bg-surface py-14 md:py-20">
        <Container size="narrow">
          {!legalIsComplete ? (
            <div className="mb-10 flex items-start gap-3 rounded-2xl border border-warn-line bg-warn-surface p-5 text-[0.9rem] leading-relaxed text-warn-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                Ce document doit être complété avec les informations légales de l’entreprise avant
                la mise en ligne. Les éléments manquants sont signalés ci-dessous.
              </p>
            </div>
          ) : null}

          <div className="legal-prose space-y-8">{children}</div>

          {legalEntity.updatedAt ? (
            <p className="mt-14 border-t border-[var(--border)] pt-6 text-[0.85rem] text-ink-soft">
              Dernière mise à jour : {formatDateFr(legalEntity.updatedAt)}.
            </p>
          ) : null}
        </Container>
      </section>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-[1.3rem] font-bold text-navy-900">{title}</h2>
      <div className="mt-4 space-y-4 text-[1rem] leading-[1.75] text-ink">{children}</div>
    </section>
  );
}
