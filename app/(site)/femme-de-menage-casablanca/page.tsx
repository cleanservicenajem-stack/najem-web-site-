import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
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
import { createMetadata } from '@/lib/seo';
import { formaterDh, getGrilleTarifaire, montant, type CategorieAffichee } from '@/lib/tarifs';
import { formuleParId, fourchette, formulesTriees, quartiersCasablanca } from '@/lib/landing';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * Page d'atterrissage « Femme de ménage à Casablanca ».
 *
 * C'est la recherche la plus tapée du secteur. La page ne crée aucune
 * information nouvelle : prix et durées viennent de la grille de /tarifs,
 * le contenu des prestations de `config/services.ts`, et la couverture de
 * Casablanca de `config/site.ts`.
 */

const CHEMIN = '/femme-de-menage-casablanca';

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Femme de ménage à Casablanca', path: CHEMIN },
];

export async function generateMetadata(): Promise<Metadata> {
  const prix = fourchette(await getGrilleTarifaire());
  const depart = prix ? ` dès ${formaterDh(prix.min)}` : '';

  return createMetadata({
    title: `Femme de ménage à Casablanca${depart} | Najem`,
    titreComplet: true,
    description: `Réservez une femme de ménage à Casablanca en quelques minutes : ménage express${depart}, complet, grand ménage ou abonnement, depuis l’application Najem.`,
    path: CHEMIN,
  });
}

/** Réponses construites uniquement à partir des prix réellement affichés. */
const questions = (grille: CategorieAffichee[]): FaqItem[] => {
  const items: FaqItem[] = [];

  const express = formuleParId(grille, 'studio-express');
  const complet = formuleParId(grille, 'studio-complet');
  const grand = formuleParId(grille, 'grand-menage');
  const prestige = formuleParId(grille, 'tres-grand-prestige');

  if (express) {
    const suite = [
      complet ? `le ménage complet ${complet.formule.prix} (${complet.formule.duree})` : null,
      grand ? `le grand ménage ${grand.formule.prix} (${grand.formule.duree})` : null,
      prestige ? `le ménage prestige ${prestige.formule.prix} (${prestige.formule.duree})` : null,
    ].filter((morceau): morceau is string => morceau !== null);

    items.push({
      id: 'femme-menage-prix',
      category: 'pratique',
      question: 'Combien coûte une femme de ménage à Casablanca ?',
      answer: [
        `Chez ${siteConfig.name}, un ménage express commence à ${express.formule.prix} pour ${express.formule.duree} dans un studio ou un petit appartement.${suite.length > 0 ? ` Comptez ensuite ${suite.join(', ')}.` : ''}`,
        'Le prix exact de votre ménage et des options choisies s’affiche dans l’application avant que vous confirmiez la réservation.',
      ],
    });
  }

  const abonnements = grille.filter((categorie) => categorie.abonnement !== null);
  if (abonnements.length > 0) {
    items.push({
      id: 'femme-menage-reguliere',
      category: 'pratique',
      question: 'Puis-je avoir une femme de ménage chaque semaine ?',
      answer: [
        'Oui, avec l’abonnement mensuel, qui regroupe plusieurs ménages chaque mois à un prix inférieur aux mêmes ménages réservés un par un.',
        ...abonnements.map(
          (categorie) =>
            `${categorie.titre} : ${categorie.abonnement?.prix} par mois, pour ${categorie.abonnement?.contenu}.`,
        ),
      ],
    });
  }

  items.push(
    {
      id: 'femme-menage-quartiers',
      category: 'pratique',
      question: 'Intervenez-vous dans tout Casablanca ?',
      answer: [
        `Oui, ${siteConfig.name} intervient dans l’ensemble de Casablanca. La disponibilité d’un créneau à votre adresse est confirmée dans l’application, au moment de la réservation.`,
      ],
    },
    {
      id: 'femme-menage-reserver',
      category: 'pratique',
      question: 'Comment réserver une femme de ménage ?',
      answer: [
        'Téléchargez l’application Najem Clean Service sur iPhone ou Android, choisissez votre formule, la date et le créneau, puis confirmez. Vous réservez et réglez votre ménage dans l’application, et vous suivez votre demande depuis votre compte.',
      ],
    },
    {
      id: 'femme-menage-express-complet',
      category: 'pratique',
      question: 'Quelle différence entre le ménage express et le ménage complet ?',
      answer: [
        'Le ménage express est un entretien rapide pour garder un intérieur propre. Le ménage complet, le grand ménage et le ménage prestige vont plus en profondeur et durent plus longtemps : la durée de chaque formule est indiquée avec son prix.',
      ],
    },
  );

  return items;
};

/** Le service, avec la fourchette de prix réellement affichée. */
const serviceFemmeDeMenage = (grille: CategorieAffichee[]): JsonLd => {
  const prix = fourchette(grille);
  const nombre = formulesTriees(grille).length;

  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(CHEMIN)}#service`,
    name: 'Femme de ménage à domicile à Casablanca',
    serviceType: 'Femme de ménage',
    url: absoluteUrl(CHEMIN),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: siteConfig.serviceAreas.map((area) => ({ '@type': 'City', name: area.name })),
    ...(prix
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'MAD',
            lowPrice: String(prix.min),
            highPrice: String(prix.max),
            offerCount: String(nombre),
            url: absoluteUrl('/tarifs'),
          },
        }
      : {}),
  };
};

const etapes = [
  'Téléchargez l’application Najem Clean Service sur iPhone ou Android.',
  'Choisissez la taille de votre logement et la formule : express, complet, grand ménage ou prestige.',
  'Indiquez votre adresse, la date, le créneau et vos consignes éventuelles.',
  'Confirmez : le prix s’affiche avant la validation, et vous suivez votre demande depuis votre compte.',
];

/** Prestations vers lesquelles la page renvoie, dans cet ordre. */
const liensPrestations = [
  { slug: 'nettoyage-ponctuel', texte: 'Pour un besoin précis, sans engagement.' },
  { slug: 'nettoyage-regulier', texte: 'Un passage planifié, au rythme que vous fixez.' },
  { slug: 'grand-nettoyage', texte: 'Une remise à niveau complète du logement.' },
  { slug: 'nettoyage-apres-demenagement', texte: 'À l’entrée ou à la sortie d’un logement.' },
] as const;

export default async function FemmeDeMenageCasablancaPage() {
  const grille = await getGrilleTarifaire();
  const prix = fourchette(grille);
  const faq = questions(grille);
  const regulier = getServiceBySlug('nettoyage-regulier');

  const prestations = liensPrestations.flatMap((lien) => {
    const service = getServiceBySlug(lien.slug);
    return service ? [{ ...lien, titre: service.title }] : [];
  });

  return (
    <>
      <PageHero
        eyebrow="Ménage à domicile à Casablanca"
        title="Femme de ménage à domicile à Casablanca"
        crumbs={crumbs}
        lead={
          <p>
            Réservez votre femme de ménage en quelques minutes depuis l’application{' '}
            {siteConfig.name}
            {prix ? ` : ménage express dès ${formaterDh(prix.min)}` : ''}, ponctuel ou en
            abonnement, partout à Casablanca.
          </p>
        }
      >
        <StoreButtons />
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
                  Une femme de ménage réservée depuis votre téléphone
                </h2>
                <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                  <p>
                    Trouver une femme de ménage de confiance à Casablanca passe souvent par le
                    bouche-à-oreille, des annonces et plusieurs essais. Avec {siteConfig.name}, vous
                    réservez directement depuis l’application un professionnel sélectionné, au
                    créneau qui vous arrange.
                  </p>
                  <p>
                    Le prix dépend de la taille de votre logement et de la formule choisie. Il
                    s’affiche avant la réservation : pas de devis à attendre ni de négociation à
                    l’arrivée. Vous réglez dans l’application et vous suivez votre demande depuis
                    votre compte.
                  </p>
                </div>
              </Reveal>

              {regulier ? (
                <div className="mt-14">
                  <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                    Ce que fait votre femme de ménage
                  </h2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {regulier.includes.map((item) => (
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
                    En option : repassage, terrasse ou balcon, four et frigo très sales,
                    shampouineuse pour canapé et tapis, heure supplémentaire. Le détail exact est
                    confirmé au moment de la réservation, selon votre logement et vos consignes.
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-7 shadow-[var(--shadow-soft)]">
                <h2 className="font-display text-[1.15rem] font-semibold text-navy-800">
                  Réserver depuis l’application
                </h2>
                <p className="mt-3 text-[0.925rem] leading-relaxed text-ink-soft">
                  Formule, créneau, consignes et paiement : tout se fait au même endroit.
                </p>
                <StoreButtons className="mt-6" />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {grille.length > 0 ? (
        <section className="bg-paper py-16 md:py-24" aria-labelledby="femme-menage-prix">
          <Container>
            <Reveal>
              <h2
                id="femme-menage-prix"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                Combien coûte une femme de ménage à Casablanca ?
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
                Les prix de l’application, selon la taille du logement. Les options s’ajoutent au
                prix de la formule.
              </p>
            </Reveal>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--border)] bg-surface">
              <table className="w-full min-w-[34rem] text-left text-[0.95rem]">
                <caption className="sr-only">Prix du ménage à domicile à Casablanca</caption>
                <thead>
                  <tr className="border-b border-[var(--border)] text-[0.8rem] uppercase tracking-[0.1em] text-navy-800">
                    <th scope="col" className="px-6 py-4 font-semibold">Logement</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Formule</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Détail</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">Prix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-ink">
                  {grille.flatMap((categorie) => [
                    ...categorie.formules
                      .filter((formule) => montant(formule.prix) !== null)
                      .map((formule) => (
                        <tr key={formule.id}>
                          <td className="px-6 py-4 text-ink-soft">{categorie.titre}</td>
                          <td className="px-6 py-4 font-medium text-navy-800">{formule.nom}</td>
                          <td className="px-6 py-4 text-ink-soft">{formule.duree}</td>
                          <td className="px-6 py-4 text-right font-semibold text-brand-600">
                            {formule.prix}
                          </td>
                        </tr>
                      )),
                    ...(categorie.abonnement && montant(categorie.abonnement.prix) !== null
                      ? [
                          <tr key={categorie.abonnement.id}>
                            <td className="px-6 py-4 text-ink-soft">{categorie.titre}</td>
                            <td className="px-6 py-4 font-medium text-navy-800">
                              Abonnement mensuel
                            </td>
                            <td className="px-6 py-4 text-ink-soft">
                              {categorie.abonnement.contenu}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-brand-600">
                              {categorie.abonnement.prix} / mois
                            </td>
                          </tr>,
                        ]
                      : []),
                  ])}
                </tbody>
              </table>
            </div>

            <div className="mt-7">
              <ArrowLink href="/tarifs">Voir le détail des tarifs et des options</ArrowLink>
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
              Ponctuelle ou régulière : à vous de choisir
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
              Un coup de main avant de recevoir, un rythme fixe chaque semaine, ou une remise à
              niveau complète : chaque besoin a sa prestation.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {prestations.map((prestation) => (
              <li key={prestation.slug}>
                <Link
                  href={`/services/${prestation.slug}`}
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
                    className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-300 group-hover:translate-x-1"
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
                Partout à Casablanca
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                {siteConfig.name} intervient dans l’ensemble de Casablanca, du centre-ville aux
                quartiers résidentiels : {quartiersCasablanca.join(', ')} et tous les autres
                quartiers de la ville. La disponibilité d’un créneau à votre adresse est confirmée
                dans l’application, au moment de la réservation.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                Comment réserver votre femme de ménage
              </h2>
              <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
                {etapes.map((etape, index) => (
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
                Questions fréquentes
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
            <div className="mt-8 flex flex-wrap gap-6">
              <ArrowLink href="/nettoyage-canape-tapis-casablanca">
                Nettoyage canapé et tapis
              </ArrowLink>
              <ArrowLink href="/faq">Toutes les questions</ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="femme-menage-schema"
        data={[
          webPageSchema({
            path: CHEMIN,
            name: 'Femme de ménage à domicile à Casablanca — Najem Clean Service',
            description:
              'Réserver une femme de ménage à Casablanca depuis l’application Najem Clean Service : formules, prix, zones desservies et questions fréquentes.',
          }),
          breadcrumbSchema(crumbs),
          serviceFemmeDeMenage(grille),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
