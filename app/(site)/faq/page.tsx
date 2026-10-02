import type { Metadata } from 'next';
import { faqItems, type FaqCategory } from '@/config/faq';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { getSeo } from '@/lib/content';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('faq')), path: '/faq' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'FAQ', path: '/faq' },
];

const groups: { id: FaqCategory; title: string; intro: string }[] = [
  {
    id: 'general',
    title: 'Le service en général',
    intro: 'Comment fonctionne Najem Clean Service et comment réserver une intervention.',
  },
  {
    id: 'application',
    title: 'L’application mobile',
    intro: 'Disponibilité sur iPhone et Android, et gestion depuis votre compte.',
  },
  {
    id: 'pratique',
    title: 'Réservation et paiement',
    intro: 'Modification, annulation et modalités de règlement.',
  },
  {
    id: 'service',
    title: 'Intervention',
    intro: 'Qui intervient et dans quelles conditions.',
  },
];

export default async function FaqPage() {
  const { description } = await getSeo('faq');

  return (
    <>
      <PageHero
        eyebrow="Aide"
        title="Questions fréquentes"
        lead="Les réponses ci-dessous couvrent l’essentiel du service. Lorsqu’une modalité dépend de conditions affichées dans l’application, c’est précisé explicitement."
        crumbs={crumbs}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <nav aria-label="Sections de la FAQ">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Sommaire
                </p>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <a
                        href={`#${group.id}`}
                        className="text-navy-800 transition-colors duration-300 hover:text-brand-600"
                      >
                        {group.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-10 rounded-3xl border border-[var(--border)] bg-paper/70 p-6">
                <p className="font-display text-[1rem] font-semibold text-navy-800">
                  Vous ne trouvez pas votre réponse&nbsp;?
                </p>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                  Écrivez-nous depuis la page contact, ou passez par l’application si votre question
                  concerne une réservation en cours.
                </p>
                <div className="mt-5">
                  <ArrowLink href="/contact">Aller au formulaire de contact</ArrowLink>
                </div>
              </div>
            </aside>

            <div className="space-y-14">
              {groups.map((group) => {
                const items = faqItems.filter((item) => item.category === group.id);
                if (items.length === 0) return null;

                return (
                  <div key={group.id} id={group.id} className="scroll-mt-32">
                    <Reveal>
                      <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
                        {group.title}
                      </h2>
                      <p className="mt-2 text-[0.95rem] text-ink-soft">{group.intro}</p>
                    </Reveal>
                    <Accordion className="mt-6" items={items} />
                  </div>
                );
              })}

              <Reveal>
                <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-8">
                  <h2 className="font-display text-[1.2rem] font-semibold text-navy-800">
                    Tout commence par l’application
                  </h2>
                  <p className="mt-2.5 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft">
                    La réservation, la modification d’un rendez-vous et le paiement se gèrent depuis
                    l’application Najem Clean Service.
                  </p>
                  <StoreButtons className="mt-6" />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="faq-schema"
        data={[
          webPageSchema({ path: '/faq', name: 'Questions fréquentes — Najem Clean Service', description }),
          breadcrumbSchema(crumbs),
          faqSchema(faqItems),
        ]}
      />
    </>
  );
}
