import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
import { enabledServices, type Service } from '@/config/services';
import { absoluteUrl, siteConfig } from '@/config/site';
import { communs } from '@/content/i18n/commun';
import { servicesTraduits } from '@/content/i18n/services';
import { textesPagesServices } from '@/content/i18n/pages/services';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { FinalCta } from '@/components/home/FinalCta';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { lireLangue } from '@/lib/i18n';
import { createMetadata } from '@/lib/seo';
import { ORGANIZATION_ID, breadcrumbSchema, webPageSchema, type JsonLd } from '@/lib/schema';

/**
 * Liste des prestations en arabe et en anglais : la page française
 * (app/(site)/services/page.tsx), traduite section par section.
 */

type Props = { params: Promise<{ langue: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { meta } = textesPagesServices[langue].liste;
  return createMetadata({
    title: meta.titre,
    description: meta.description,
    path: cheminEn(langue, '/services'),
  });
}

/**
 * Équivalent traduit de `serviceSchema` (lib/schema.ts) : noms et description
 * traduits, adresse de la page traduite, villes et pays dans la langue de la
 * page.
 */
const serviceSchemaTraduit = (langue: LangueTraduite, service: Service): JsonLd => {
  const { schema } = textesPagesServices[langue];
  const url = absoluteUrl(cheminEn(langue, `/services/${service.slug}`));
  const pays: JsonLd = { '@type': 'Country', name: schema.pays };
  const villes = siteConfig.serviceAreas.map((area) => ({
    '@type': 'City',
    name: communs[langue].villes[area.slug] ?? area.name,
    containedInPlace: pays,
  }));

  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url,
    inLanguage: langue,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: villes.length > 0 ? villes : pays,
    availableChannel: {
      '@type': 'ServiceChannel',
      name: schema.application,
      serviceUrl: siteConfig.apps.ios.url,
      availableLanguage: ['fr'],
    },
  };
};

export default async function ServicesTraduitsPage({ params }: Props) {
  const langue = await lireLangue(params);
  const commun = communs[langue];
  const t = textesPagesServices[langue];
  const services = servicesTraduits(langue, enabledServices);

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.services, path: cheminEn(langue, '/services') },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.liste.surtitre}
        title={t.liste.titre}
        lead={t.liste.chapo}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
      >
        <StoreButtons textes={commun.boutiques} />
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-label={t.liste.libelleListe}>
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
                      className="h-4 w-4 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="mt-6 font-display text-[1.25rem] font-semibold text-navy-800">
                    <Link
                      href={cheminEn(langue, `/services/${service.slug}`)}
                      className="after:absolute after:inset-0"
                    >
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
                {t.liste.horsCase.titre}
              </h2>
              <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-ink-soft">
                {t.liste.horsCase.texte}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <StoreButtons textes={commun.boutiques} />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <FinalCta langue={langue} />

      <StructuredData
        id="services-schema"
        data={[
          webPageSchema({
            path: cheminEn(langue, '/services'),
            name: t.liste.nomPage,
            description: t.liste.meta.description,
            langue,
          }),
          breadcrumbSchema(crumbs),
          ...services.map((service) => serviceSchemaTraduit(langue, service)),
        ]}
      />
    </>
  );
}
