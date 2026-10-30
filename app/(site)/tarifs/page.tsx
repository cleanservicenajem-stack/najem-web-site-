import type { Metadata } from 'next';
import { Clock, Sparkles } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
import { absoluteUrl, siteConfig } from '@/config/site';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { getSeo, getTexte } from '@/lib/content';
import {
  formaterDh,
  getGrilleTarifaire,
  montant,
  type CategorieAffichee,
  type FormuleAffichee,
} from '@/lib/tarifs';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('tarifs')), path: '/tarifs' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Tarifs', path: '/tarifs' },
];

/** Formule la moins chère, pour répondre à « combien coûte un ménage ? ». */
const formuleDeDepart = (
  grille: CategorieAffichee[],
): { formule: FormuleAffichee; categorie: CategorieAffichee } | null => {
  let meilleure: { formule: FormuleAffichee; categorie: CategorieAffichee; prix: number } | null =
    null;
  for (const categorie of grille) {
    for (const formule of categorie.formules) {
      const prix = montant(formule.prix);
      if (prix !== null && (meilleure === null || prix < meilleure.prix)) {
        meilleure = { formule, categorie, prix };
      }
    }
  }
  return meilleure ? { formule: meilleure.formule, categorie: meilleure.categorie } : null;
};

const questionsTarifs = (grille: CategorieAffichee[]): FaqItem[] => {
  const depart = formuleDeDepart(grille);
  const abonnements = grille.filter((categorie) => categorie.abonnement !== null);

  const items: FaqItem[] = [];

  if (depart) {
    items.push({
      id: 'tarifs-prix-menage',
      category: 'pratique',
      question: 'Combien coûte un ménage à domicile à Casablanca ?',
      answer: [
        `À partir de ${depart.formule.prix} : c’est le prix d’un ${depart.formule.nom.toLowerCase()} (${depart.formule.duree}) dans la catégorie « ${depart.categorie.titre} ». Le prix dépend ensuite de la taille du logement et de la formule choisie.`,
      ],
    });
  }

  items.push({
    id: 'tarifs-express-complet',
    category: 'pratique',
    question: 'Quelle différence entre le ménage express et les autres formules ?',
    answer: [
      'Le ménage express est un entretien rapide pour garder un intérieur propre. Le ménage complet, le grand ménage et le ménage prestige vont plus en profondeur et durent plus longtemps : la durée de chaque formule est indiquée avec son prix.',
    ],
  });

  if (abonnements.length > 0) {
    items.push({
      id: 'tarifs-abonnement',
      category: 'pratique',
      question: 'Combien coûte l’abonnement mensuel ?',
      answer: abonnements.map(
        (categorie) =>
          `${categorie.titre} : ${categorie.abonnement?.prix} par mois, pour ${categorie.abonnement?.contenu}.`,
      ),
    });
  }

  items.push(
    {
      id: 'tarifs-options',
      category: 'pratique',
      question: 'Les options sont-elles comprises dans le prix ?',
      answer: [
        'Non, elles s’ajoutent au prix de la formule : repassage, terrasse ou balcon, four et frigo très sales, shampouineuse pour canapé et tapis, heure supplémentaire. Leur prix est indiqué sous chaque formule.',
      ],
    },
    {
      id: 'tarifs-reservation',
      category: 'pratique',
      question: 'Où réserver et payer ?',
      answer: [
        'Dans l’application Najem Clean Service, sur iPhone et Android. Le prix de votre ménage et des options choisies s’affiche avant que vous confirmiez la réservation.',
      ],
    },
  );

  return items;
};

/** Offres déclarées aux moteurs de recherche : seules celles dont le prix est lisible. */
const catalogueSchema = (grille: CategorieAffichee[]): JsonLd => {
  const offres: JsonLd[] = [];

  for (const categorie of grille) {
    for (const formule of categorie.formules) {
      const prix = montant(formule.prix);
      if (prix === null) continue;
      offres.push({
        '@type': 'Offer',
        name: `${formule.nom} — ${categorie.titre}`,
        description: formule.description,
        price: String(prix),
        priceCurrency: 'MAD',
      });
    }

    const abonnement = categorie.abonnement;
    const prixMensuel = abonnement ? montant(abonnement.prix) : null;
    if (abonnement && prixMensuel !== null) {
      offres.push({
        '@type': 'Offer',
        name: `Abonnement mensuel — ${categorie.titre}`,
        description: abonnement.contenu,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(prixMensuel),
          priceCurrency: 'MAD',
          unitText: 'mois',
        },
      });
    }
  }

  return {
    '@type': 'Service',
    '@id': `${absoluteUrl('/tarifs')}#service`,
    name: 'Ménage à domicile à Casablanca',
    serviceType: 'Ménage à domicile',
    url: absoluteUrl('/tarifs'),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: siteConfig.serviceAreas.map((area) => ({ '@type': 'City', name: area.name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Tarifs ${siteConfig.name}`,
      itemListElement: offres,
    },
  };
};

function CarteFormule({ formule }: { formule: FormuleAffichee }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-surface p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-brand-line hover:shadow-[var(--shadow-card)] md:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-[1.25rem] font-semibold text-navy-800">{formule.nom}</h3>
        <div className="shrink-0 text-right">
          <p className="font-display text-[1.6rem] font-bold leading-none text-brand-600">
            {formule.prix}
          </p>
          {formule.duree ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-[0.85rem] text-ink-soft">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formule.duree}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{formule.description}</p>

      <div className="mt-6 flex-1 border-t border-[var(--border)] pt-5">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-navy-800">
          Options
        </p>
        {formule.options.length > 0 ? (
          <ul className="mt-3 space-y-2 text-[0.9rem] text-ink-soft">
            {formule.options.map((option, index) => (
              <li
                key={`${index}-${option.libelle}`}
                className="flex items-baseline justify-between gap-4"
              >
                <span>{option.libelle}</span>
                {option.prix ? (
                  <span className="shrink-0 font-semibold text-navy-800">{option.prix}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[0.9rem] text-ink-soft">Aucune option</p>
        )}
      </div>
    </article>
  );
}

export default async function TarifsPage() {
  const [grille, introduction, { description }] = await Promise.all([
    getGrilleTarifaire(),
    getTexte('tarifs.introduction'),
    getSeo('tarifs'),
  ]);
  const faq = questionsTarifs(grille);

  return (
    <>
      <PageHero
        eyebrow="Tarifs"
        title="Tarifs du ménage à domicile à Casablanca"
        lead={introduction}
        crumbs={crumbs}
      >
        <StoreButtons />
      </PageHero>

      {grille.map((categorie, index) => (
        <section
          key={categorie.id}
          className={`py-14 md:py-20 ${index % 2 === 0 ? 'bg-surface' : 'bg-paper'}`}
          aria-labelledby={`tarifs-${categorie.id}`}
        >
          <Container>
            <Reveal>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                {categorie.precision}
              </p>
              <h2
                id={`tarifs-${categorie.id}`}
                className="mt-2 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                {categorie.titre}
              </h2>
            </Reveal>

            <Stagger className="mt-8 grid gap-6 md:grid-cols-2" stagger={0.07}>
              {categorie.formules.map((formule) => (
                <StaggerItem key={formule.id} className="h-full">
                  <CarteFormule formule={formule} />
                </StaggerItem>
              ))}
            </Stagger>

            {categorie.abonnement ? (
              <Reveal className="mt-6">
                <div className="flex flex-col gap-5 rounded-3xl border border-brand-line bg-[image:var(--gradient-brand-soft)] p-7 md:flex-row md:items-center md:justify-between md:p-8">
                  <div>
                    <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Abonnement mensuel
                    </p>
                    <p className="mt-2 text-[1.05rem] font-medium text-navy-800">
                      {categorie.abonnement.contenu}
                    </p>
                    {categorie.abonnement.economie ? (
                      <p className="mt-1.5 text-[0.95rem] text-ink-soft">
                        Soit {formaterDh(categorie.abonnement.economie)} d’économie par mois par
                        rapport aux mêmes ménages réservés un par un.
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0">
                    <span className="font-display text-[2rem] font-bold leading-none text-navy-900">
                      {categorie.abonnement.prix}
                    </span>
                    <span className="ml-1.5 text-ink-soft">/ mois</span>
                  </p>
                </div>
              </Reveal>
            ) : null}
          </Container>
        </section>
      ))}

      <section className="bg-surface py-14 md:py-20" aria-labelledby="tarifs-autres">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-[var(--border)] bg-paper p-8 md:p-10">
              <h2
                id="tarifs-autres"
                className="font-display text-[1.35rem] font-semibold text-navy-800"
              >
                Après déménagement, conciergerie ou besoin professionnel ?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-ink-soft">
                Décrivez votre demande au moment de la réservation dans l’application, ou
                écrivez-nous depuis la page contact. La faisabilité est confirmée en fonction de la
                demande et des professionnels disponibles.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <StoreButtons />
                <ArrowLink href="/contact">Nous écrire</ArrowLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper py-14 md:py-20" aria-labelledby="tarifs-questions">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                id="tarifs-questions"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                Questions sur les prix
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
          </div>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="tarifs-schema"
        data={[
          webPageSchema({
            path: '/tarifs',
            name: 'Tarifs du ménage à domicile à Casablanca — Najem Clean Service',
            description,
          }),
          breadcrumbSchema(crumbs),
          catalogueSchema(grille),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
