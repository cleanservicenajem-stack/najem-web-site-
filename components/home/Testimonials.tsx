import { Quote } from 'lucide-react';
import type { Langue } from '@/config/i18n';
import { testimonials, type Testimonial } from '@/config/testimonials';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { formatDateFr } from '@/lib/utils';

/** Textes de la section pour les pages traduites (le français par défaut). */
export type TextesTemoignages = {
  surtitre: string;
  titre: string;
  /**
   * Traduction fidèle de chaque avis, par identifiant (config/testimonials.ts).
   * Un avis sans traduction n'est pas affiché ; le nom du client reste tel quel.
   */
  avis: Record<string, { citation: string; contexte?: string }>;
};

const localesDates: Record<Langue, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-GB' };

/** Date de recueil dans la langue de la page. */
const formaterDate = (iso: string, langue: Langue): string =>
  langue === 'fr'
    ? formatDateFr(iso)
    : new Intl.DateTimeFormat(localesDates[langue], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${iso}T12:00:00Z`));

type TestimonialsProps = {
  /** Langue de la page, pour la date des avis. */
  langue?: Langue;
  textes?: TextesTemoignages;
};

/**
 * Section témoignages.
 * Ne rend rien tant que `config/testimonials.ts` est vide : aucun avis n'est
 * inventé, et aucune donnée structurée d'avis n'est émise.
 */
export function Testimonials({ langue = 'fr', textes }: TestimonialsProps) {
  const avis: Testimonial[] = textes
    ? testimonials.flatMap((testimonial) => {
        const traduction = textes.avis[testimonial.id];
        return traduction
          ? [{ ...testimonial, quote: traduction.citation, context: traduction.contexte }]
          : [];
      })
    : testimonials;

  if (avis.length === 0) return null;

  return (
    <section className="bg-paper py-20 md:py-28" aria-labelledby="temoignages-titre">
      <Container>
        <SectionHeading
          id="temoignages-titre"
          eyebrow={textes?.surtitre ?? 'Retours clients'}
          title={textes?.titre ?? 'Ce que disent les personnes qui utilisent le service.'}
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {avis.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <figure className="flex h-full flex-col justify-between rounded-3xl border border-[var(--border)] bg-surface p-7 shadow-[var(--shadow-soft)]">
                <Quote className="h-5 w-5 text-brand-300" aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-[0.975rem] leading-relaxed text-ink">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--border)] pt-4 text-[0.85rem] text-ink-soft">
                  <span className="font-medium text-navy-800">{testimonial.author}</span>
                  {testimonial.context ? <span> — {testimonial.context}</span> : null}
                  <span className="mt-1 block text-[0.75rem] text-ink-soft">
                    {formaterDate(testimonial.collectedAt, langue)}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
