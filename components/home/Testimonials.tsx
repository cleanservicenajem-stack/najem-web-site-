import { Quote } from 'lucide-react';
import { testimonials } from '@/config/testimonials';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { formatDateFr } from '@/lib/utils';

/**
 * Section témoignages.
 * Ne rend rien tant que `config/testimonials.ts` est vide : aucun avis n'est
 * inventé, et aucune donnée structurée d'avis n'est émise.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-paper py-20 md:py-28" aria-labelledby="temoignages-titre">
      <Container>
        <SectionHeading
          id="temoignages-titre"
          eyebrow="Retours clients"
          title="Ce que disent les personnes qui utilisent le service."
        />

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
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
                    {formatDateFr(testimonial.collectedAt)}
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
