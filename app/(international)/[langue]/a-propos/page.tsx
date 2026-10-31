import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, HandHeart, ShieldCheck, Wand2, type LucideIcon } from 'lucide-react';
import { cheminEn } from '@/config/i18n';
import { siteConfig } from '@/config/site';
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
import { communs } from '@/content/i18n/commun';
import { clesValeurs, textesAPropos, type CleValeur } from '@/content/i18n/pages/a-propos';
import { lireLangue } from '@/lib/i18n';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

/** Page À propos en arabe et en anglais : mêmes sections que la page française. */

type Props = { params: Promise<{ langue: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { seo } = textesAPropos[langue];
  return createMetadata({
    title: seo.titre,
    description: seo.description,
    path: cheminEn(langue, '/a-propos'),
  });
}

const icones: Record<CleValeur, LucideIcon> = {
  confiance: ShieldCheck,
  simplicite: Wand2,
  qualite: HandHeart,
  temps: Clock,
};

export default async function AProposTraduit({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesAPropos[langue];
  const chemin = cheminEn(langue, '/a-propos');

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.page, path: chemin },
  ];

  const fiche = [
    t.fiche.activite,
    t.fiche.canal,
    t.fiche.langue,
    { libelle: t.fiche.site, valeur: siteConfig.url.replace(/^https?:\/\//, '') },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.hero.surtitre}
        title={t.hero.titre}
        lead={t.hero.introduction}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
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
                  {t.mission.titre}
                </h2>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  {t.mission.paragraphes.map((paragraphe) => (
                    <p key={paragraphe}>{paragraphe}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mt-14 font-display text-[clamp(1.6rem,1.1rem+2vw,2.35rem)] font-bold leading-tight text-navy-900">
                  {t.vision.titre}
                </h2>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  {t.vision.paragraphes.map((paragraphe) => (
                    <p key={paragraphe}>{paragraphe}</p>
                  ))}
                </div>
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl border border-[var(--border)] bg-paper/70 p-7">
                <Logo variant="lockup" tone="auto" size={40} />
                <dl className="mt-7 divide-y divide-[var(--border)] border-t border-[var(--border)] text-[0.925rem]">
                  {fiche.map((ligne) => (
                    <div key={ligne.libelle} className="py-3.5">
                      <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                        {ligne.libelle}
                      </dt>
                      <dd className="mt-1 text-ink">{ligne.valeur}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[0.85rem] leading-relaxed text-ink-soft">
                  {t.fiche.boutiques}
                </p>
                <StoreButtons className="mt-6" textes={communs[langue].boutiques} />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28" aria-labelledby="valeurs-titre">
        <Container>
          <SectionHeading
            id="valeurs-titre"
            eyebrow={t.valeurs.surtitre}
            title={t.valeurs.titre}
            lead={t.valeurs.introduction}
          />

          <Stagger className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.07}>
            {clesValeurs.map((cle) => {
              const valeur = t.valeurs.liste[cle];
              const Icone = icones[cle];
              return (
                <StaggerItem key={cle}>
                  <article className="group h-full rounded-3xl border border-[var(--border)] bg-surface p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-tint text-brand-600">
                      <Icone className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-[1.1rem] font-semibold text-navy-800">
                      {valeur.titre}
                    </h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                      {valeur.texte}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-20" aria-labelledby="aller-plus-loin">
        <Container>
          <Reveal>
            <h2 id="aller-plus-loin" className="font-display text-[1.5rem] font-semibold text-navy-900">
              {t.plusLoin.titre}
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            <ArrowLink href={cheminEn(langue, '/services')}>{t.plusLoin.liens.services}</ArrowLink>
            <ArrowLink href={cheminEn(langue, '/application')}>
              {t.plusLoin.liens.application}
            </ArrowLink>
            <ArrowLink href={cheminEn(langue, '/faq')}>{t.plusLoin.liens.faq}</ArrowLink>
            <ArrowLink href={cheminEn(langue, '/contact')}>{t.plusLoin.liens.contact}</ArrowLink>
          </div>
          <p className="mt-8 max-w-2xl text-[0.925rem] leading-relaxed text-ink-soft">
            {t.plusLoin.manque.avant}{' '}
            <Link
              href={cheminEn(langue, '/contact')}
              className="text-brand-600 underline underline-offset-4"
            >
              {t.plusLoin.manque.lien}
            </Link>
            {t.plusLoin.manque.apres}
          </p>
        </Container>
      </section>

      <FinalCta langue={langue} />

      <StructuredData
        id="about-schema"
        data={[
          webPageSchema({
            path: chemin,
            name: t.hero.titre,
            description: t.seo.description,
            langue,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
