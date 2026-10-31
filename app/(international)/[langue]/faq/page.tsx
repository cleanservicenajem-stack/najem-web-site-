import type { Metadata } from 'next';
import { cheminEn } from '@/config/i18n';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { communs } from '@/content/i18n/commun';
import { faqTraduite } from '@/content/i18n/faq';
import { ordreGroupesFaq, textesPageFaq } from '@/content/i18n/pages/faq';
import { createMetadata } from '@/lib/seo';
import { lireLangue } from '@/lib/i18n';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema';

/**
 * Page FAQ en arabe et en anglais : mêmes groupes, mêmes questions (traduites)
 * et même ordre que la page française.
 */

type Props = { params: Promise<{ langue: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { seo } = textesPageFaq[langue];
  return createMetadata({
    title: seo.titre,
    description: seo.description,
    path: cheminEn(langue, '/faq'),
  });
}

export default async function PageFaqTraduite({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesPageFaq[langue];
  const questions = faqTraduite(langue);
  const chemin = cheminEn(langue, '/faq');

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.page, path: chemin },
  ];

  const groupes = ordreGroupesFaq.map((id) => ({ id, ...t.groupes[id] }));

  return (
    <>
      <PageHero
        eyebrow={t.hero.surtitre}
        title={t.hero.titre}
        lead={t.hero.introduction}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <nav aria-label={t.sommaire.navigation}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {t.sommaire.titre}
                </p>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {groupes.map((group) => (
                    <li key={group.id}>
                      <a
                        href={`#${group.id}`}
                        className="text-navy-800 transition-colors duration-300 hover:text-brand-600"
                      >
                        {group.titre}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-10 rounded-3xl border border-[var(--border)] bg-paper/70 p-6">
                <p className="font-display text-[1rem] font-semibold text-navy-800">
                  {t.aide.titre}
                </p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">{t.aide.texte}</p>
                <div className="mt-5">
                  <ArrowLink href={cheminEn(langue, '/contact')}>{t.aide.lien}</ArrowLink>
                </div>
              </div>
            </aside>

            <div className="space-y-14">
              {groupes.map((group) => {
                const items = questions.filter((item) => item.category === group.id);
                if (items.length === 0) return null;

                return (
                  <div key={group.id} id={group.id} className="scroll-mt-32">
                    <Reveal>
                      <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
                        {group.titre}
                      </h2>
                      <p className="mt-2 text-[0.95rem] text-ink-soft">{group.introduction}</p>
                    </Reveal>
                    <Accordion className="mt-6" items={items} />
                  </div>
                );
              })}

              <Reveal>
                <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-8">
                  <h2 className="font-display text-[1.2rem] font-semibold text-navy-800">
                    {t.application.titre}
                  </h2>
                  <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
                    {t.application.texte}
                  </p>
                  <StoreButtons className="mt-6" textes={communs[langue].boutiques} />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta langue={langue} />

      <StructuredData
        id="faq-schema"
        data={[
          webPageSchema({ path: chemin, name: t.nomPage, description: t.seo.description, langue }),
          breadcrumbSchema(crumbs),
          faqSchema(questions),
        ]}
      />
    </>
  );
}
