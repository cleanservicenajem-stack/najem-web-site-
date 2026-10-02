import type { Metadata } from 'next';
import { Bell, CalendarClock, CreditCard, MessageSquareText, Smartphone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { appFaqItems } from '@/config/faq';
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
import { createMetadata } from '@/lib/seo';
import { getSeo } from '@/lib/content';
import {
  breadcrumbSchema,
  faqSchema,
  mobileApplicationSchema,
  webPageSchema,
} from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('application')), path: '/application' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Application', path: '/application' },
];

const capabilities = [
  {
    icon: Smartphone,
    title: 'Réserver un service',
    text: 'Choisissez la prestation, indiquez le logement concerné et vos disponibilités, puis envoyez votre demande.',
  },
  {
    icon: CalendarClock,
    title: 'Gérer ses rendez-vous',
    text: 'Vos interventions à venir et votre historique restent accessibles depuis votre compte.',
  },
  {
    icon: MessageSquareText,
    title: 'Échanger simplement',
    text: 'Les échanges liés à une intervention se font depuis l’application, sans changer de canal.',
  },
  {
    icon: CreditCard,
    title: 'Payer sa prestation',
    text: 'Les modalités de paiement disponibles sont présentées avant la validation de la demande.',
  },
  {
    icon: Bell,
    title: 'Suivre sa demande',
    text: 'Vous gardez la visibilité sur l’état d’avancement de votre réservation.',
  },
];

const platforms = [
  {
    icon: AppleGlyph,
    label: 'iPhone',
    detail: 'Disponible sur l’App Store',
    href: siteConfig.apps.ios.url,
  },
  {
    icon: GooglePlayGlyph,
    label: 'Android',
    detail: 'Disponible sur Google Play',
    href: siteConfig.apps.android.url,
  },
];

export default async function ApplicationPage() {
  const { description } = await getSeo('application');

  return (
    <>
      <PageHero
        eyebrow="iOS et Android"
        title="L’application Najem Clean Service"
        lead="Tout le service tient dans une application : la réservation, les rendez-vous, les échanges et le suivi. Elle se télécharge gratuitement depuis l’App Store et Google Play."
        crumbs={crumbs}
      >
        <StoreButtons />
      </PageHero>

      {/* Réponse directe — bloc facilement extractible */}
      <section className="border-b border-[var(--border)] bg-surface py-16 md:py-20" aria-labelledby="a-quoi-sert">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <Reveal>
              <h2
                id="a-quoi-sert"
                className="font-display text-[1.6rem] font-bold leading-tight text-navy-900 md:text-[2rem]"
              >
                À quoi sert l’application&nbsp;?
              </h2>
            </Reveal>

            <div>
              <Reveal delay={0.08}>
                <p className="text-[1.05rem] leading-relaxed text-ink md:text-[1.12rem]">
                  L’application Najem Clean Service permet de réserver un service de nettoyage à
                  domicile en quelques étapes, puis de suivre la demande jusqu’à l’intervention.
                  Vous y retrouvez vos rendez-vous, vos échanges et l’historique de vos
                  réservations. Elle est disponible sur iPhone via l’App Store et sur Android via
                  Google Play.
                </p>
              </Reveal>

              <Stagger className="mt-9 grid gap-4 sm:grid-cols-2" stagger={0.07}>
                {platforms.map((platform) => (
                  <StaggerItem key={platform.label}>
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
                eyebrow="Fonctionnalités"
                title="Ce que vous pouvez faire depuis votre téléphone."
              />

              <Stagger
                className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]"
                as="ul"
              >
                {capabilities.map((capability) => (
                  <StaggerItem as="li" key={capability.title}>
                    <div className="group flex items-start gap-5 py-6">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-brand-600 shadow-[var(--shadow-soft)] transition-transform duration-400 group-hover:-translate-y-0.5">
                        <capability.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-[1.05rem] font-semibold text-navy-800">
                          {capability.title}
                        </h3>
                        <p className="mt-2 text-[0.925rem] leading-relaxed text-ink-soft">
                          {capability.text}
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
              <div className="relative flex items-end justify-center">
                <div className="hidden translate-y-8 -rotate-6 opacity-95 sm:block">
                  <PhoneFrame
                    src="/images/app/app-screen-2.png"
                    alt="Écran de réservation de l’application Najem Clean Service : choix de la prestation"
                    width={196}
                    sizes="196px"
                  />
                </div>
                <FloatingPhone amplitude={7} duration={9} className="-ml-10 sm:-ml-14">
                  <PhoneFrame
                    src="/images/app/app-screen-3.png"
                    alt="Écran « Mes réservations » de l’application Najem Clean Service"
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
            eyebrow="Premiers pas"
            title="Démarrer prend moins de cinq minutes."
            lead="Le compte se crée directement dans l’application. Aucune démarche préalable n’est nécessaire sur ce site."
          />

          <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.08}>
            {[
              {
                step: '01',
                title: 'Installer l’application',
                text: 'Depuis l’App Store sur iPhone, ou Google Play sur Android.',
              },
              {
                step: '02',
                title: 'Créer votre compte',
                text: 'Les informations demandées servent à organiser l’intervention.',
              },
              {
                step: '03',
                title: 'Réserver un service',
                text: 'Choisissez la prestation et le créneau, puis validez la demande.',
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="h-full rounded-3xl border border-[var(--border)] bg-paper/60 p-7">
                  <p className="font-display text-[0.75rem] font-bold tracking-[0.18em] text-brand-600">
                    {item.step}
                  </p>
                  <h3 className="mt-3 font-display text-[1.05rem] font-semibold text-navy-800">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <StoreButtons />
          </Reveal>
        </Container>
      </section>

      <FaqSection
        id="faq-application"
        items={appFaqItems}
        eyebrow="FAQ application"
        title="Questions fréquentes sur l’application."
        tone="paper"
        link={{ label: 'Voir toutes les questions', href: '/faq' }}
      />

      <FinalCta />

      <StructuredData
        id="application-schema"
        data={[
          webPageSchema({
            path: '/application',
            name: 'Application mobile Najem Clean Service — iOS et Android',
            description,
          }),
          breadcrumbSchema(crumbs),
          mobileApplicationSchema(),
          faqSchema(appFaqItems),
        ]}
      />
    </>
  );
}
