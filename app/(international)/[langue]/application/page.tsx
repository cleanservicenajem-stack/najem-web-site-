import type { Metadata } from 'next';
import {
  Bell,
  CalendarClock,
  CreditCard,
  MessageSquareText,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { appFaqItems } from '@/config/faq';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
import { absoluteUrl, siteConfig } from '@/config/site';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { AppleGlyph, GooglePlayGlyph, StoreButtons } from '@/components/ui/StoreButtons';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FaqSection } from '@/components/home/FaqSection';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { FloatingPhone } from '@/components/animations/FloatingPhone';
import { StructuredData } from '@/components/seo/StructuredData';
import { communs } from '@/content/i18n/commun';
import { faqTraduite } from '@/content/i18n/faq';
import {
  clesEtapes,
  clesFonctionnalites,
  textesApplication,
  type CleFonctionnalite,
} from '@/content/i18n/pages/application';
import { createMetadata } from '@/lib/seo';
import { lireLangue } from '@/lib/i18n';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * Page Application en arabe et en anglais : mêmes sections que la page
 * française. Les captures d'écran restent celles de l'application réelle, en
 * français.
 */

type Props = { params: Promise<{ langue: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { seo } = textesApplication[langue];
  return createMetadata({
    title: seo.titre,
    description: seo.description,
    path: cheminEn(langue, '/application'),
  });
}

const icones: Record<CleFonctionnalite, LucideIcon> = {
  reserver: Smartphone,
  rendezVous: CalendarClock,
  echanges: MessageSquareText,
  paiement: CreditCard,
  suivi: Bell,
};

/** Mêmes questions que la page française (appFaqItems), dans le même ordre. */
const idsFaqApplication = appFaqItems.map((item) => item.id);

/**
 * L'application elle-même, comme sur la page française (mobileApplicationSchema),
 * avec la description et l'adresse de la page traduites. Sa langue reste le
 * français : c'est celle de l'application.
 */
const applicationSchema = (langue: LangueTraduite): JsonLd => {
  const url = absoluteUrl(cheminEn(langue, '/application'));
  return {
    '@type': 'MobileApplication',
    '@id': `${url}#app`,
    name: siteConfig.apps.ios.appName,
    operatingSystem: 'iOS, Android',
    applicationCategory: 'LifestyleApplication',
    description: textesApplication[langue].schema.descriptionApplication,
    url,
    installUrl: [siteConfig.apps.ios.url, siteConfig.apps.android.url],
    downloadUrl: [siteConfig.apps.ios.url, siteConfig.apps.android.url],
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'fr',
  };
};

export default async function ApplicationTraduite({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesApplication[langue];
  const commun = communs[langue];
  const chemin = cheminEn(langue, '/application');
  const faq = faqTraduite(langue, idsFaqApplication);

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.page, path: chemin },
  ];

  const plateformes = [
    {
      icon: AppleGlyph,
      label: t.plateformes.ios.nom,
      detail: t.plateformes.ios.detail,
      href: siteConfig.apps.ios.url,
    },
    {
      icon: GooglePlayGlyph,
      label: t.plateformes.android.nom,
      detail: t.plateformes.android.detail,
      href: siteConfig.apps.android.url,
    },
  ];

  const fonctionnalites = clesFonctionnalites.map((cle) => ({
    cle,
    icon: icones[cle],
    ...t.fonctionnalites.liste[cle],
  }));

  const etapes = clesEtapes.map((cle, index) => ({
    step: String(index + 1).padStart(2, '0'),
    ...t.demarrer.etapes[cle],
  }));

  return (
    <>
      <PageHero
        eyebrow={t.hero.surtitre}
        title={t.hero.titre}
        lead={t.hero.introduction}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
      >
        <StoreButtons textes={commun.boutiques} />
      </PageHero>

      {/* Réponse directe — bloc facilement extractible */}
      <section
        className="border-b border-[var(--border)] bg-surface py-16 md:py-20"
        aria-labelledby="a-quoi-sert"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <h2
                id="a-quoi-sert"
                className="font-display text-[1.6rem] font-bold leading-tight text-navy-900 md:text-[2rem]"
              >
                {t.aQuoiSert.titre}
              </h2>
            </Reveal>

            <div>
              <Reveal delay={0.08}>
                <p className="text-[1.05rem] leading-relaxed text-ink md:text-[1.12rem]">
                  {t.aQuoiSert.texte}
                </p>
              </Reveal>

              <Stagger className="mt-9 grid gap-4 sm:grid-cols-2" stagger={0.07}>
                {plateformes.map((platform) => (
                  <StaggerItem key={platform.href}>
                    <a
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-paper/60 p-5 transition-all duration-400 hover:-translate-y-0.5 hover:border-brand-line-strong hover:bg-surface"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-brand-600 shadow-[var(--shadow-soft)]">
                        <platform.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-display text-[1rem] font-semibold text-navy-800">
                          {platform.label}
                        </span>
                        <span className="text-[0.875rem] text-ink-soft">{platform.detail}</span>
                      </span>
                    </a>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28" aria-labelledby="fonctionnalites-titre">
        <Container>
          <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <SectionHeading
                id="fonctionnalites-titre"
                eyebrow={t.fonctionnalites.surtitre}
                title={t.fonctionnalites.titre}
              />

              <Stagger
                className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]"
                as="ul"
              >
                {fonctionnalites.map((capability) => (
                  <StaggerItem as="li" key={capability.cle}>
                    <div className="group flex items-start gap-5 py-6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand-600 shadow-[var(--shadow-soft)] transition-transform duration-400 group-hover:-translate-y-0.5">
                        <capability.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-[1.05rem] font-semibold text-navy-800">
                          {capability.titre}
                        </h3>
                        <p className="mt-2 text-[0.925rem] leading-relaxed text-ink-soft">
                          {capability.texte}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <Reveal y={26} className="relative flex justify-center lg:justify-end lg:pt-10">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.22),transparent_70%)] blur-2xl"
              />
              {/* Captures de l'application réelle, en français : seuls les textes alternatifs sont traduits. */}
              <div className="relative flex items-end justify-center">
                <div className="hidden translate-y-8 -rotate-6 opacity-95 sm:block rtl:rotate-6">
                  <PhoneFrame
                    src="/images/app/ecran-2026-10-2.png"
                    alt={t.ecrans.reservation}
                    width={196}
                    sizes="196px"
                  />
                </div>
                <FloatingPhone amplitude={7} duration={9} className="-ms-10 sm:-ms-14">
                  <PhoneFrame
                    src="/images/app/ecran-2026-10-3.png"
                    alt={t.ecrans.mesReservations}
                    width={242}
                    sizes="(max-width: 640px) 58vw, 242px"
                  />
                </FloatingPhone>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 md:py-24" aria-labelledby="demarrer-titre">
        <Container>
          <SectionHeading
            id="demarrer-titre"
            eyebrow={t.demarrer.surtitre}
            title={t.demarrer.titre}
            lead={t.demarrer.introduction}
          />

          <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.08}>
            {etapes.map((item) => (
              <StaggerItem key={item.step}>
                <div className="h-full rounded-3xl border border-[var(--border)] bg-paper/60 p-7">
                  <p className="font-display text-[0.75rem] font-bold tracking-[0.18em] text-brand-600">
                    {item.step}
                  </p>
                  <h3 className="mt-3 font-display text-[1.05rem] font-semibold text-navy-800">
                    {item.titre}
                  </h3>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-ink-soft">
                    {item.texte}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <StoreButtons textes={commun.boutiques} />
          </Reveal>
        </Container>
      </section>

      <FaqSection
        id="faq-application"
        items={faq}
        eyebrow={t.faq.surtitre}
        title={t.faq.titre}
        tone="paper"
        link={{ label: t.faq.lien, href: cheminEn(langue, '/faq') }}
      />

      <FinalCta langue={langue} />

      <StructuredData
        id="application-schema"
        data={[
          webPageSchema({
            path: chemin,
            name: t.schema.nomPage,
            description: t.seo.description,
            langue,
          }),
          breadcrumbSchema(crumbs),
          applicationSchema(langue),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
