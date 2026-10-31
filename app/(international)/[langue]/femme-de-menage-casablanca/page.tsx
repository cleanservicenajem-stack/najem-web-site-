import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
import { absoluteUrl, siteConfig } from '@/config/site';
import { getServiceBySlug } from '@/config/services';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { communs, type TextesCommuns } from '@/content/i18n/commun';
import {
  textesFemmeDeMenage,
  type PrixFormule,
  type SlugPrestation,
} from '@/content/i18n/pages/femme-de-menage';
import { createMetadata } from '@/lib/seo';
import { lireLangue, traduireDuree, traduireGrille, type GrilleTraduite } from '@/lib/i18n';
import { getGrilleTarifaire, type CategorieAffichee } from '@/lib/tarifs';
import { formuleParId, fourchette, formulesTriees } from '@/lib/landing';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * « Femme de ménage à Casablanca » en arabe et en anglais : traduction de
 * app/(site)/femme-de-menage-casablanca/page.tsx, section par section.
 *
 * Comme en français, la page ne crée aucune information : prix et durées
 * viennent de la grille de /tarifs (noms traduits par `communs`), le contenu
 * des prestations de `config/services.ts`, la zone de `config/site.ts`.
 */

type Props = { params: Promise<{ langue: string }> };

const CHEMIN = '/femme-de-menage-casablanca';

/** Prestations vers lesquelles la page renvoie, dans l'ordre de la page française. */
const PRESTATIONS: readonly SlugPrestation[] = [
  'nettoyage-ponctuel',
  'nettoyage-regulier',
  'grand-nettoyage',
  'nettoyage-apres-demenagement',
];

const filDAriane = (langue: LangueTraduite) => {
  const { fil } = textesFemmeDeMenage[langue];
  return [
    { name: fil.accueil, path: cheminEn(langue, '/') },
    { name: fil.page, path: cheminEn(langue, CHEMIN) },
  ];
};

/** Villes desservies autour de Casablanca : « Bouskoura, Dar Bouazza… ». */
const alentours = (commun: TextesCommuns): string =>
  commun.liste(
    siteConfig.serviceAreas.slice(1).map((area) => commun.villes[area.slug] ?? area.name),
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const t = textesFemmeDeMenage[langue];
  const prix = fourchette(await getGrilleTarifaire());
  const depart = prix ? communs[langue].prix(prix.min) : null;

  return createMetadata({
    title: t.meta.titre(depart),
    titreComplet: true,
    description: t.meta.description(depart),
    path: cheminEn(langue, CHEMIN),
  });
}

/** Réponses construites uniquement à partir des prix réellement affichés. */
const questions = (
  langue: LangueTraduite,
  grille: CategorieAffichee[],
  grilleTraduite: GrilleTraduite,
): FaqItem[] => {
  const commun = communs[langue];
  const t = textesFemmeDeMenage[langue].questions;
  const items: FaqItem[] = [];

  const situer = (id: string): PrixFormule | null => {
    const trouvee = formuleParId(grille, id);
    const nom = commun.grille.formules[id];
    if (!trouvee || !nom) return null;
    return {
      nom,
      prix: commun.prix(trouvee.prix),
      duree: traduireDuree(trouvee.formule.duree, commun),
    };
  };

  const express = situer('studio-express');

  if (express) {
    const suite = ['studio-complet', 'grand-menage', 'tres-grand-prestige']
      .map((id) => situer(id))
      .filter((formule): formule is PrixFormule => formule !== null)
      .map((formule) => t.prix.element(formule));

    items.push({
      id: 'femme-menage-prix',
      category: 'pratique',
      question: t.prix.question,
      answer: [
        t.prix.reponse(express, suite.length > 0 ? commun.liste(suite) : null),
        t.prix.complement,
      ],
    });
  }

  if (grilleTraduite.abonnements.length > 0) {
    items.push({
      id: 'femme-menage-reguliere',
      category: 'pratique',
      question: t.reguliere.question,
      answer: [t.reguliere.reponse, ...grilleTraduite.abonnements],
    });
  }

  items.push(
    {
      id: 'femme-menage-quartiers',
      category: 'pratique',
      question: t.quartiers.question,
      answer: [t.quartiers.reponse(alentours(commun))],
    },
    {
      id: 'femme-menage-reserver',
      category: 'pratique',
      question: t.reserver.question,
      answer: [t.reserver.reponse],
    },
    {
      id: 'femme-menage-express-complet',
      category: 'pratique',
      question: t.expressComplet.question,
      answer: [t.expressComplet.reponse],
    },
  );

  return items;
};

/** Le service, avec la fourchette de prix réellement affichée. */
const serviceFemmeDeMenage = (langue: LangueTraduite, grille: CategorieAffichee[]): JsonLd => {
  const commun = communs[langue];
  const { schema } = textesFemmeDeMenage[langue];
  const prix = fourchette(grille);
  const nombre = formulesTriees(grille).length;
  const url = absoluteUrl(cheminEn(langue, CHEMIN));

  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: schema.nomService,
    serviceType: schema.typeService,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      '@type': 'City',
      name: commun.villes[area.slug] ?? area.name,
    })),
    ...(prix
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'MAD',
            lowPrice: String(prix.min),
            highPrice: String(prix.max),
            offerCount: String(nombre),
            url: absoluteUrl(cheminEn(langue, '/tarifs')),
          },
        }
      : {}),
  };
};

export default async function FemmeDeMenageCasablancaTraduite({ params }: Props) {
  const langue = await lireLangue(params);
  const commun = communs[langue];
  const t = textesFemmeDeMenage[langue];

  const grille = await getGrilleTarifaire();
  const grilleTraduite = traduireGrille(grille, commun);
  const prix = fourchette(grille);
  const depart = prix ? commun.prix(prix.min) : null;
  const faq = questions(langue, grille, grilleTraduite);
  const crumbs = filDAriane(langue);

  // Ce que comprend le ménage régulier : un élément sans traduction n'est pas affiché.
  const regulier = getServiceBySlug('nettoyage-regulier');
  const inclus = regulier
    ? regulier.includes.flatMap((item) => {
        const traduit = t.inclus.elements[item];
        return traduit ? [traduit] : [];
      })
    : [];

  const prestations = PRESTATIONS.flatMap((slug) => {
    const titre = commun.services[slug]?.titre;
    return getServiceBySlug(slug) && titre
      ? [{ slug, titre, texte: t.formules.prestations[slug] }]
      : [];
  });

  return (
    <>
      <PageHero
        eyebrow={t.hero.surtitre}
        title={t.hero.titre}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
        lead={<p>{t.hero.chapo(depart)}</p>}
      >
        <StoreButtons textes={commun.boutiques} />
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="femme-menage-intro">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <Reveal>
                <h2
                  id="femme-menage-intro"
                  className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
                >
                  {t.intro.titre}
                </h2>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  {t.intro.paragraphes.map((paragraphe) => (
                    <p key={paragraphe}>{paragraphe}</p>
                  ))}
                </div>
              </Reveal>

              {inclus.length > 0 ? (
                <div className="mt-14">
                  <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                    {t.inclus.titre}
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {inclus.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-paper/60 px-4 py-3.5 text-[0.925rem] text-ink"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-ink-soft">
                    {t.inclus.options}
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-7 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-[1.15rem] font-semibold text-navy-800">
                  {t.reserver.titre}
                </h2>
                <p className="mt-3 text-[0.925rem] leading-relaxed text-ink-soft">
                  {t.reserver.texte}
                </p>
                <StoreButtons className="mt-6" textes={commun.boutiques} />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {grilleTraduite.lignes.length > 0 ? (
        <section className="bg-paper py-16 md:py-24" aria-labelledby="femme-menage-prix">
          <Container>
            <Reveal>
              <h2
                id="femme-menage-prix"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                {t.prix.titre}
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
                {t.prix.texte}
              </p>
            </Reveal>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--border)] bg-surface">
              <table className="w-full min-w-[34rem] text-start text-[0.95rem]">
                <caption className="sr-only">{t.prix.legende}</caption>
                <thead>
                  <tr className="border-b border-[var(--border)] text-[0.8rem] uppercase tracking-[0.1em] text-navy-800">
                    <th scope="col" className="px-6 py-4 font-semibold">
                      {t.prix.colonnes.logement}
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      {t.prix.colonnes.formule}
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      {t.prix.colonnes.detail}
                    </th>
                    <th scope="col" className="px-6 py-4 text-end font-semibold">
                      {t.prix.colonnes.prix}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-ink">
                  {grilleTraduite.lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td className="px-6 py-4 text-ink-soft">{ligne.categorie}</td>
                      <td className="px-6 py-4 font-medium text-navy-800">{ligne.formule}</td>
                      <td className="px-6 py-4 text-ink-soft">{ligne.detail}</td>
                      <td className="px-6 py-4 text-end font-semibold text-brand-600">
                        {ligne.prix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7">
              <ArrowLink href={cheminEn(langue, '/tarifs')}>{t.prix.lien}</ArrowLink>
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-surface py-16 md:py-24" aria-labelledby="femme-menage-formules">
        <Container>
          <Reveal>
            <h2
              id="femme-menage-formules"
              className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
            >
              {t.formules.titre}
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
              {t.formules.texte}
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {prestations.map((prestation) => (
              <li key={prestation.slug}>
                <Link
                  href={cheminEn(langue, `/services/${prestation.slug}`)}
                  className="group flex h-full items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-paper/60 p-6 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-brand-line hover:shadow-[var(--shadow-card)]"
                >
                  <span>
                    <span className="block font-display text-[1.1rem] font-semibold text-navy-800 group-hover:text-brand-700">
                      {prestation.titre}
                    </span>
                    <span className="mt-1 block text-[0.925rem] text-ink-soft">
                      {prestation.texte}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-24" aria-labelledby="femme-menage-zones">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2
                id="femme-menage-zones"
                className="flex items-center gap-3 font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                <MapPin className="h-6 w-6 shrink-0 text-brand-500" aria-hidden="true" />
                {t.zones.titre}
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                {t.zones.texte(commun.quartiers.join(commun.separateur), alentours(commun))}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                {t.etapes.titre}
              </h2>
              <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
                {t.etapes.liste.map((etape, index) => (
                  <li key={etape} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-semibold text-brand-700">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{etape}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="femme-menage-questions">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                id="femme-menage-questions"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                {t.questions.titre}
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href={cheminEn(langue, '/nettoyage-canape-tapis-casablanca')}>
                {t.questions.lienCanape}
              </ArrowLink>
              <ArrowLink href={cheminEn(langue, '/faq')}>{t.questions.lienToutes}</ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta langue={langue} />

      <StructuredData
        id="femme-menage-schema"
        data={[
          webPageSchema({
            path: cheminEn(langue, CHEMIN),
            name: t.schema.nomPage,
            description: t.schema.descriptionPage,
            langue,
          }),
          breadcrumbSchema(crumbs),
          serviceFemmeDeMenage(langue, grille),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
