import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { enabledServices } from '@/config/services';
import { getServicesAffiches, getSeo } from '@/lib/content';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { FinalCta } from '@/components/home/FinalCta';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('services')), path: '/services' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Services', path: '/services' },
];

export default async function ServicesPage() {
  const services = await getServicesAffiches(enabledServices);
  const { description } = await getSeo('services');

  return (
    <>
      <PageHero
        eyebrow="Prestations"
        title="Les services de nettoyage Najem Clean Service à Casablanca"
        lead="De l’entretien courant à l’intervention plus complète, pour les particuliers comme pour les professionnels. Toutes les prestations sont disponibles dans l’ensemble de Casablanca et se réservent depuis l’application."
        crumbs={crumbs}
      >
        <StoreButtons />
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-label="Liste des prestations">
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.07}>
            {services.map((service) => (
              <StaggerItem key={service.slug} className="h-full">
                <article className="group relative flex h-full flex-col rounded-3xl border border-[var(--border)] bg-surface p-8 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-line hover:shadow-[var(--shadow-card)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-brand-600 transition-colors duration-400 group-hover:bg-brand-tint">
                      <service.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="mt-6 font-display text-[1.25rem] font-semibold text-navy-800">
                    <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0">
                      <span className="relative">{service.title}</span>
                    </Link>
                  </h2>
                  <p className="mt-1.5 text-[0.9rem] font-medium text-brand-600">{service.benefit}</p>
                  {service.pitch ? (
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                      {service.pitch}
                    </p>
                  ) : null}

                  <ul className="mt-6 flex-1 space-y-2 border-t border-[var(--border)] pt-5 text-[0.875rem] text-ink-soft">
                    {service.includes.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-14">
            <div className="rounded-3xl border border-[var(--border)] bg-paper p-8 md:p-10">
              <h2 className="font-display text-[1.35rem] font-semibold text-navy-800">
                Une demande qui ne rentre dans aucune case ?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-ink-soft">
                Décrivez votre besoin au moment de la réservation dans l’application, ou
                écrivez-nous depuis la page contact. La faisabilité est confirmée en fonction de la
                demande et des professionnels disponibles.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <StoreButtons />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="services-schema"
        data={[
          webPageSchema({
            path: '/services',
            name: 'Services de nettoyage à domicile à Casablanca — Najem Clean Service',
            description,
          }),
          breadcrumbSchema(crumbs),
          ...services.map((service) => serviceSchema(service)),
        ]}
      />
    </>
  );
}
