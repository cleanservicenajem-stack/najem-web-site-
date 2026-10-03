import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { enabledServices, getServiceBySlug } from '@/config/services';
import { serviceAreaSuffix } from '@/config/local-seo';
import { getServiceAffiche, getServicesAffiches } from '@/lib/content';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Pill } from '@/components/ui/Pill';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, serviceSchema, webPageSchema } from '@/lib/schema';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return enabledServices.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const base = getServiceBySlug(slug);
  const service = base ? await getServiceAffiche(base) : undefined;

  if (!service) {
    return createMetadata({
      title: 'Service introuvable',
      description: 'Cette prestation n’existe pas ou n’est plus proposée.',
      path: `/services/${slug}`,
      noindex: true,
    });
  }

  return createMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const base = getServiceBySlug(slug);

  if (!base) notFound();

  const service = await getServiceAffiche(base);
  // Chaîne vide tant qu'aucune ville n'est confirmée : la section entière
  // disparaît alors, plutôt que d'annoncer une couverture inconnue.
  const zones = serviceAreaSuffix();
  const others = (await getServicesAffiches(
    enabledServices.filter((item) => item.slug !== service.slug),
  )).slice(0, 4);
  const crumbs = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.shortTitle, path: `/services/${service.slug}` },
  ];

  return (
    <>
      <PageHero eyebrow={service.benefit} title={service.title} lead={service.summary} crumbs={crumbs}>
        <StoreButtons />
      </PageHero>

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <Reveal>
                <div className="space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  {service.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 28)}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              {zones ? (
                <Reveal className="mt-12">
                  <div className="rounded-3xl border border-[var(--border)] bg-paper/60 p-7">
                    <h2 className="flex items-center gap-3 font-display text-[1.4rem] font-semibold text-navy-900">
                      <MapPin className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                      Zones d’intervention
                    </h2>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                      Cette prestation est disponible{zones}, dans l’ensemble de la ville. La
                      disponibilité d’un créneau à votre adresse est confirmée dans l’application,
                      au moment de la réservation.
                    </p>
                  </div>
                </Reveal>
              ) : null}

              <div className="mt-14">
                <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                  Ce que couvre la prestation
                </h2>
                <p className="mt-3 max-w-2xl text-[0.95rem] text-ink-soft">
                  Le détail exact est confirmé au moment de la réservation, en fonction du bien
                  concerné et des consignes que vous transmettez.
                </p>

                <Stagger className="mt-7 grid gap-3 sm:grid-cols-2" as="ul" stagger={0.05}>
                  {service.includes.map((item) => (
                    <StaggerItem as="li" key={item}>
                      <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-paper/60 px-4 py-3.5 text-[0.925rem] text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                        {item}
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>

              <div className="mt-14">
                <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                  Dans quelles situations ?
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {service.goodFor.map((item) => (
                    <li key={item}>
                      <Pill dot={false}>{item}</Pill>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-14 border-t border-[var(--border)] pt-10">
                <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                  Comment réserver cette prestation
                </h2>
                <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
                  {[
                    'Téléchargez l’application Najem Clean Service sur iPhone ou Android.',
                    `Sélectionnez la prestation « ${service.title} ».`,
                    'Indiquez votre adresse, vos disponibilités et vos consignes éventuelles.',
                    'Validez la demande, puis suivez-la depuis votre compte.',
                  ].map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-7 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-[1.15rem] font-semibold text-navy-800">
                  Réserver depuis l’application
                </h2>
                <p className="mt-3 text-[0.925rem] leading-relaxed text-ink-soft">
                  La réservation, les rendez-vous et les échanges se gèrent au même endroit.
                </p>
                <StoreButtons className="mt-6" />
              </div>

              <nav aria-label="Autres prestations" className="mt-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Autres prestations
                </p>
                <ul className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/services/${item.slug}`}
                        className="group flex items-center justify-between gap-4 py-3.5 text-[0.95rem] text-navy-800 transition-colors duration-300 hover:text-brand-600"
                      >
                        {item.title}
                        <ArrowRight
                          className="h-4 w-4 text-brand-400 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </Container>
      </section>

      {/* TODO (client) : questions fréquentes propres à chaque prestation.
          Elles doivent venir de l'entreprise : une FAQ inventée serait reprise
          telle quelle par Google et par les moteurs génératifs. Prévoir un
          champ `faq` dans config/services.ts, puis ajouter `faqSchema()` aux
          données structurées ci-dessous. */}

      <FinalCta />

      <StructuredData
        id="service-schema"
        data={[
          webPageSchema({
            path: `/services/${service.slug}`,
            name: `${service.title} — Najem Clean Service`,
            description: service.summary,
          }),
          breadcrumbSchema(crumbs),
          serviceSchema(service),
        ]}
      />
    </>
  );
}
