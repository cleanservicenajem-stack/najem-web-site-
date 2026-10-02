import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { enabledServices } from '@/config/services';
import { getServicesAffiches } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';

/**
 * Liste éditoriale des prestations : des lignes larges plutôt qu'une grille de
 * cartes identiques. Le survol révèle le détail sans déplacer la mise en page.
 */
export async function ServicesEditorial() {
  const services = await getServicesAffiches(enabledServices);

  return (
    <section id="services" className="bg-paper py-20 md:py-28" aria-labelledby="services-titre">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="services-titre"
              eyebrow="Prestations"
              title="Un service pour chaque situation."
              lead="Toutes les prestations se réservent de la même manière depuis l’application. La différence tient à l’étendue de l’intervention et au moment où vous en avez besoin."
            />
            <div className="mt-8">
              <ArrowLink href="/services">Voir le détail des prestations</ArrowLink>
            </div>
          </div>

          <Stagger className="border-t border-[var(--border)]" as="ul" stagger={0.06}>
            {services.map((service, index) => (
              <StaggerItem as="li" key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative flex items-start gap-5 border-b border-[var(--border)] py-7 transition-colors duration-400 hover:bg-surface md:gap-8 md:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 top-0 w-px origin-bottom scale-y-0 bg-[linear-gradient(180deg,#17a8ee,#21c3b6)] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-y-100"
                  />

                  <span className="mt-1 font-display text-[0.75rem] font-semibold tabular-nums text-brand-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-surface text-brand-600 transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:border-brand-line-strong group-hover:bg-brand-tint group-hover:text-brand-700">
                    <service.icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-[1.15rem] font-semibold text-navy-800 transition-colors duration-300 group-hover:text-brand-700 md:text-[1.3rem]">
                        {service.title}
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1.5 block text-[0.95rem] text-ink-soft">{service.benefit}</span>
                    {service.pitch ? (
                      <span className="mt-2 block max-w-xl text-[0.9rem] leading-relaxed text-ink-soft">
                        {service.pitch}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
