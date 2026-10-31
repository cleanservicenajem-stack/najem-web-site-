import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
import { enabledServices, getServiceBySlug, type Service } from '@/config/services';
import { absoluteUrl, siteConfig, type ServiceArea } from '@/config/site';
import { communs, type TextesCommuns } from '@/content/i18n/commun';
import { serviceTraduit, servicesTraduits } from '@/content/i18n/services';
import { textesPagesServices } from '@/content/i18n/pages/services';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Pill } from '@/components/ui/Pill';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { StructuredData } from '@/components/seo/StructuredData';
import { lireLangue } from '@/lib/i18n';
import { createMetadata } from '@/lib/seo';
import { ORGANIZATION_ID, breadcrumbSchema, webPageSchema, type JsonLd } from '@/lib/schema';

/**
 * Page d'une prestation en arabe et en anglais : la page française
 * (app/(site)/services/[slug]/page.tsx), traduite section par section.
 */

type Props = { params: Promise<{ langue: string; slug: string }> };

// Les langues viennent du segment parent ([langue]/layout.tsx).
export const dynamicParams = false;

export function generateStaticParams() {
  return enabledServices.map((service) => ({ slug: service.slug }));
}

/** Prestation de l'adresse, traduite ; `null` si elle n'existe pas ou n'est pas traduite. */
const lireService = async (
  langue: LangueTraduite,
  params: Props['params'],
): Promise<{ slug: string; service: Service | null }> => {
  const { slug } = await params;
  const base = getServiceBySlug(slug);
  return { slug, service: base ? serviceTraduit(langue, base) : null };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { slug, service } = await lireService(langue, params);

  if (!service) {
    const { introuvable } = textesPagesServices[langue].prestation;
    return createMetadata({
      title: introuvable.titre,
      description: introuvable.description,
      path: cheminEn(langue, `/services/${slug}`),
      noindex: true,
    });
  }

  return createMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: cheminEn(langue, `/services/${service.slug}`),
  });
}

/**
 * Zone de la page française (« à Casablanca et ses alentours (Bouskoura, Dar
 * Bouazza, Aïn Harrouda et Tit Mellil) »), dans la langue de la page. `null`
 * tant qu'aucune ville n'est confirmée : la section disparaît alors, comme en
 * français (config/local-seo.ts).
 */
const zoneTraduite = (commun: TextesCommuns): { zone: string; alentours: string } | null => {
  const [principale, ...autres] = siteConfig.serviceAreas;
  if (!principale) return null;
  const nom = (area: ServiceArea) => commun.villes[area.slug] ?? area.name;
  return {
    zone: autres.length === 0 ? nom(principale) : commun.zone,
    alentours: commun.liste(autres.map(nom)),
  };
};

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

export default async function ServiceTraduitPage({ params }: Props) {
  const langue = await lireLangue(params);
  const { service } = await lireService(langue, params);

  if (!service) return notFound();

  const commun = communs[langue];
  const t = textesPagesServices[langue];
  const p = t.prestation;
  const zone = zoneTraduite(commun);
  const others = servicesTraduits(
    langue,
    enabledServices.filter((item) => item.slug !== service.slug),
  ).slice(0, 4);
  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.services, path: cheminEn(langue, '/services') },
    { name: service.shortTitle, path: cheminEn(langue, `/services/${service.slug}`) },
  ];

  return (
    <>
      <PageHero
        eyebrow={service.benefit}
        title={service.title}
        lead={service.summary}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
      >
        <StoreButtons textes={commun.boutiques} />
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

              {zone ? (
                <Reveal className="mt-12">
                  <div className="rounded-3xl border border-[var(--border)] bg-paper/60 p-7">
                    <h2 className="flex items-center gap-3 font-display text-[1.4rem] font-semibold text-navy-900">
                      <MapPin className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                      {p.zones.titre}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                      {p.zones.texte(zone.zone, zone.alentours)}
                    </p>
                  </div>
                </Reveal>
              ) : null}

              <div className="mt-14">
                <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                  {p.contenu.titre}
                </h2>
                <p className="mt-3 max-w-2xl text-[0.95rem] text-ink-soft">{p.contenu.texte}</p>

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
                  {p.situations}
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
                  {p.reservation.titre}
                </h2>
                <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
                  {p.reservation.etapes(service.title).map((step, index) => (
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
                  {p.encart.titre}
                </h2>
                <p className="mt-3 text-[0.925rem] leading-relaxed text-ink-soft">{p.encart.texte}</p>
                <StoreButtons className="mt-6" textes={commun.boutiques} />
                <div className="mt-6 flex flex-col items-start gap-3">
                  <ArrowLink href={cheminEn(langue, '/tarifs')}>{p.encart.tarifs}</ArrowLink>
                  <ArrowLink href={cheminEn(langue, '/femme-de-menage-casablanca')}>
                    {p.encart.femmeDeMenage}
                  </ArrowLink>
                </div>
              </div>

              <nav aria-label={p.autres} className="mt-8">
                {/* L'espacement des lettres et les capitales ne valent que pour l'alphabet latin. */}
                <p
                  className={
                    langue === 'ar'
                      ? 'text-[0.85rem] font-semibold text-brand-600'
                      : 'text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600'
                  }
                >
                  {p.autres}
                </p>
                <ul className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={cheminEn(langue, `/services/${item.slug}`)}
                        className="group flex items-center justify-between gap-4 py-3.5 text-[0.95rem] text-navy-800 transition-colors duration-300 hover:text-brand-600"
                      >
                        {item.title}
                        <ArrowRight
                          className="h-4 w-4 text-brand-400 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
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

      {/* Pas de questions fréquentes propres à chaque prestation, comme en
          français : elles doivent d'abord être fournies par l'entreprise. */}

      <FinalCta langue={langue} />

      <StructuredData
        id="service-schema"
        data={[
          webPageSchema({
            path: cheminEn(langue, `/services/${service.slug}`),
            name: `${service.title} — ${siteConfig.name}`,
            description: service.summary,
            langue,
          }),
          breadcrumbSchema(crumbs),
          serviceSchemaTraduit(langue, service),
        ]}
      />
    </>
  );
}
