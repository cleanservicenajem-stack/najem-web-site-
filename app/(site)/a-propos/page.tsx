import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, HandHeart, ShieldCheck, Wand2 } from 'lucide-react';
import { siteConfig, siteUrlIsConfirmed } from '@/config/site';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Logo } from '@/components/ui/Logo';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { getSeo } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('a-propos')), path: '/a-propos' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'À propos', path: '/a-propos' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Confiance',
    text: 'Faire intervenir quelqu’un chez soi engage. Le service est construit autour de cette responsabilité.',
  },
  {
    icon: Wand2,
    title: 'Simplicité',
    text: 'Un parcours court, des informations claires, aucune étape inutile entre le besoin et la réservation.',
  },
  {
    icon: HandHeart,
    title: 'Qualité de service',
    text: 'Une intervention utile se juge sur le résultat et sur la façon dont la demande a été prise en charge.',
  },
  {
    icon: Clock,
    title: 'Respect de votre temps',
    text: 'Réserver ne doit pas devenir une corvée supplémentaire. Le temps gagné est le cœur du service.',
  },
];

const facts = [
  { label: 'Activité', value: 'Services de nettoyage à domicile' },
  { label: 'Canal de réservation', value: 'Application mobile iOS et Android' },
  { label: 'Langue du service', value: 'Français' },
  // Le domaine n'est annoncé que lorsqu'il a été confirmé.
  ...(siteUrlIsConfirmed
    ? [{ label: 'Site officiel', value: siteConfig.url.replace(/^https?:\/\//, '') }]
    : []),
];

export default async function AboutPage() {
  const { description } = await getSeo('a-propos');

  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="À propos de Najem Clean Service"
        lead="Najem Clean Service met en relation des particuliers et des professionnels du nettoyage à domicile, à travers une application mobile pensée pour rendre la réservation simple et lisible."
        crumbs={crumbs}
      />

      <section className="bg-surface py-16 md:py-24" aria-labelledby="mission-titre">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-20">
            <div>
              <Reveal>
                <h2
                  id="mission-titre"
                  className="font-display text-[clamp(1.6rem,1.1rem+2vw,2.35rem)] font-bold leading-tight text-navy-900"
                >
                  Notre mission
                </h2>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  <p>
                    Trouver quelqu’un de fiable pour entretenir son logement demande souvent plus
                    d’énergie que le ménage lui-même : appels, disponibilités qui ne coïncident
                    pas, allers-retours pour convenir d’un créneau. La mission de Najem Clean
                    Service est de réduire ce parcours à quelques étapes claires.
                  </p>
                  <p>
                    L’application a été créée pour cette raison précise : réunir au même endroit la
                    demande, le rendez-vous et le suivi, de façon à ce que l’organisation ne repose
                    plus sur la mémoire ou la disponibilité de chacun.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mt-14 font-display text-[clamp(1.6rem,1.1rem+2vw,2.35rem)] font-bold leading-tight text-navy-900">
                  Notre vision
                </h2>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  <p>
                    Réserver un service de nettoyage devrait être aussi simple que réserver un
                    trajet ou une table : on choisit, on confirme, on suit. C’est la direction que
                    prend le service, prestation après prestation.
                  </p>
                  <p>
                    Cette simplicité ne doit rien enlever à la qualité de l’intervention. Le
                    parcours numérique existe pour libérer du temps, pas pour remplacer le travail
                    d’un professionnel.
                  </p>
                </div>
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl border border-[var(--border)] bg-paper/70 p-7">
                <Logo variant="lockup" tone="auto" size={40} />
                <dl className="mt-7 divide-y divide-[var(--border)] border-t border-[var(--border)] text-[0.925rem]">
                  {facts.map((fact) => (
                    <div key={fact.label} className="py-3.5">
                      <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[0.85rem] leading-relaxed text-ink-soft">
                  L’application est référencée sur l’App Store et sur Google Play sous le nom
                  «&nbsp;Najem Clean Service&nbsp;».
                </p>
                <StoreButtons className="mt-6" />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28" aria-labelledby="valeurs-titre">
        <Container>
          <SectionHeading
            id="valeurs-titre"
            eyebrow="Valeurs"
            title="Quatre repères qui guident le service."
            lead="Ils se traduisent dans des choix concrets : la façon dont le parcours est construit, ce qui est annoncé, et ce qui ne l’est pas tant que ce n’est pas vérifié."
          />

          <Stagger className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.07}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <article className="group h-full rounded-3xl border border-[var(--border)] bg-surface p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-tint text-brand-600">
                    <value.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.1rem] font-semibold text-navy-800">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{value.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-20" aria-labelledby="aller-plus-loin">
        <Container>
          <Reveal>
            <h2 id="aller-plus-loin" className="font-display text-[1.5rem] font-semibold text-navy-900">
              Aller plus loin
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            <ArrowLink href="/services">Découvrir les prestations</ArrowLink>
            <ArrowLink href="/application">Voir l’application en détail</ArrowLink>
            <ArrowLink href="/faq">Consulter la FAQ</ArrowLink>
            <ArrowLink href="/contact">Nous écrire</ArrowLink>
          </div>
          <p className="mt-8 max-w-2xl text-[0.925rem] leading-relaxed text-ink-soft">
            Une information vous semble manquante sur cette page ?{' '}
            <Link href="/contact" className="text-brand-600 underline underline-offset-4">
              Signalez-le nous
            </Link>{' '}
            : les informations publiées ici ne sont ajoutées qu’une fois confirmées.
          </p>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="about-schema"
        data={[
          webPageSchema({
            path: '/a-propos',
            name: 'À propos de Najem Clean Service',
            description,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
