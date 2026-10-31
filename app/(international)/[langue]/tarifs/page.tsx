import type { Metadata } from 'next';
import { Clock, Sparkles } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
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
import { communs } from '@/content/i18n/commun';
import { textesTarifs } from '@/content/i18n/pages/tarifs';
import { createMetadata } from '@/lib/seo';
import {
  lireLangue,
  traduireGrille,
  traduireOption,
  traduirePrixOption,
  type GrilleTraduite,
} from '@/lib/i18n';
import { getGrilleTarifaire, type CategorieAffichee } from '@/lib/tarifs';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * Page Tarifs en arabe et en anglais : même grille que la page française
 * (prix, durées, options et économie des abonnements lus dans
 * l'administration), seuls les noms et les textes sont traduits.
 */

type Props = { params: Promise<{ langue: string }> };

type OptionTraduite = { libelle: string; prix: string };

type FormuleTraduite = {
  id: string;
  nom: string;
  description: string;
  /** Prix formaté dans la langue de la page. */
  prix: string;
  /** Montant en dirhams. */
  valeur: number;
  /** Durée traduite ; vide si elle est illisible. */
  duree: string;
  options: OptionTraduite[];
};

type AbonnementTraduit = {
  contenu: string;
  /** Prix mensuel formaté, sans « / mois ». */
  prix: string;
  valeur: number;
  economie: number | null;
};

type CategorieTraduite = {
  id: string;
  titre: string;
  precision: string;
  formules: FormuleTraduite[];
  abonnement: AbonnementTraduit | null;
};

/**
 * La grille de la page française, traduite. Comme dans `traduireGrille`, une
 * formule ou un abonnement dont le prix est illisible ou dont le nom n'a pas
 * de traduction n'est pas affiché ; une option sans traduction garde son
 * libellé français.
 */
const traduireCategories = (
  grille: CategorieAffichee[],
  grilleTraduite: GrilleTraduite,
  langue: LangueTraduite,
): CategorieTraduite[] => {
  const commun = communs[langue];
  const { descriptions } = textesTarifs[langue];

  return grille.flatMap((categorie): CategorieTraduite[] => {
    const noms = commun.grille.categories[categorie.id];
    if (!noms) return [];

    const lignes = grilleTraduite.lignes.filter((ligne) => ligne.categorieId === categorie.id);

    const formules = categorie.formules.flatMap((formule): FormuleTraduite[] => {
      const ligne = lignes.find((item) => !item.abonnement && item.id === formule.id);
      if (!ligne) return [];
      return [
        {
          id: formule.id,
          nom: ligne.formule,
          description: descriptions[formule.id] ?? '',
          prix: ligne.prix,
          valeur: ligne.valeur,
          duree: ligne.detail,
          options: formule.options.map((option) => ({
            libelle: traduireOption(option.libelle, commun),
            prix: option.prix ? traduirePrixOption(option.prix, commun) : '',
          })),
        },
      ];
    });

    const ligneAbonnement = lignes.find((item) => item.abonnement);
    const abonnement: AbonnementTraduit | null =
      categorie.abonnement && ligneAbonnement
        ? {
            contenu: ligneAbonnement.detail,
            prix: commun.prix(ligneAbonnement.valeur),
            valeur: ligneAbonnement.valeur,
            economie: categorie.abonnement.economie,
          }
        : null;

    if (formules.length === 0 && abonnement === null) return [];

    return [
      { id: categorie.id, titre: noms.titre, precision: noms.precision, formules, abonnement },
    ];
  });
};

/** Description de la page : prix de départ des formules et des abonnements. */
const descriptionPage = (grilleTraduite: GrilleTraduite, langue: LangueTraduite): string => {
  const commun = communs[langue];
  const abonnements = grilleTraduite.lignes
    .filter((ligne) => ligne.abonnement)
    .map((ligne) => ligne.valeur);

  return textesTarifs[langue].seo.description({
    formule: grilleTraduite.prixMin === null ? null : commun.prix(grilleTraduite.prixMin),
    abonnement: abonnements.length > 0 ? commun.prix(Math.min(...abonnements)) : null,
  });
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const grilleTraduite = traduireGrille(await getGrilleTarifaire(), communs[langue]);

  return createMetadata({
    title: textesTarifs[langue].seo.titre,
    description: descriptionPage(grilleTraduite, langue),
    path: cheminEn(langue, '/tarifs'),
  });
}

/** Formule la moins chère, pour répondre à « combien coûte un ménage ? ». */
const formuleDeDepart = (
  categories: CategorieTraduite[],
): { formule: FormuleTraduite; categorie: CategorieTraduite } | null => {
  let meilleure: { formule: FormuleTraduite; categorie: CategorieTraduite } | null = null;
  for (const categorie of categories) {
    for (const formule of categorie.formules) {
      if (meilleure === null || formule.valeur < meilleure.formule.valeur) {
        meilleure = { formule, categorie };
      }
    }
  }
  return meilleure;
};

const questionsTarifs = (
  categories: CategorieTraduite[],
  grilleTraduite: GrilleTraduite,
  langue: LangueTraduite,
): FaqItem[] => {
  const t = textesTarifs[langue].questions;
  const depart = formuleDeDepart(categories);

  const items: FaqItem[] = [];

  if (depart) {
    items.push({
      id: 'tarifs-prix-menage',
      category: 'pratique',
      question: t.prixMenage.question,
      answer: [
        t.prixMenage.reponse({
          prix: depart.formule.prix,
          formule: depart.formule.nom,
          duree: depart.formule.duree,
          categorie: depart.categorie.titre,
        }),
      ],
    });
  }

  items.push({
    id: 'tarifs-express-complet',
    category: 'pratique',
    question: t.expressComplet.question,
    answer: [t.expressComplet.reponse],
  });

  if (grilleTraduite.abonnements.length > 0) {
    items.push({
      id: 'tarifs-abonnement',
      category: 'pratique',
      question: t.abonnement.question,
      answer: grilleTraduite.abonnements,
    });
  }

  items.push(
    {
      id: 'tarifs-options',
      category: 'pratique',
      question: t.options.question,
      answer: [t.options.reponse],
    },
    {
      id: 'tarifs-reservation',
      category: 'pratique',
      question: t.reservation.question,
      answer: [t.reservation.reponse],
    },
  );

  return items;
};

/** Offres déclarées aux moteurs de recherche : seules celles qui sont affichées. */
const catalogueSchema = (categories: CategorieTraduite[], langue: LangueTraduite): JsonLd => {
  const commun = communs[langue];
  const t = textesTarifs[langue].schema;
  const url = absoluteUrl(cheminEn(langue, '/tarifs'));
  const offres: JsonLd[] = [];

  for (const categorie of categories) {
    for (const formule of categorie.formules) {
      offres.push({
        '@type': 'Offer',
        name: `${formule.nom} — ${categorie.titre}`,
        ...(formule.description ? { description: formule.description } : {}),
        price: String(formule.valeur),
        priceCurrency: 'MAD',
      });
    }

    if (categorie.abonnement) {
      offres.push({
        '@type': 'Offer',
        name: `${commun.abonnement} — ${categorie.titre}`,
        description: categorie.abonnement.contenu,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(categorie.abonnement.valeur),
          priceCurrency: 'MAD',
          unitText: t.uniteMois,
        },
      });
    }
  }

  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: t.nomService,
    serviceType: t.typeService,
    url,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      '@type': 'City',
      name: commun.villes[area.slug] ?? area.name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.nomCatalogue,
      itemListElement: offres,
    },
  };
};

function CarteFormule({
  formule,
  textes,
}: {
  formule: FormuleTraduite;
  textes: { options: string; aucuneOption: string };
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-surface p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:border-brand-line hover:shadow-[var(--shadow-card)] md:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-[1.25rem] font-semibold text-navy-800">{formule.nom}</h3>
        <div className="shrink-0 text-end">
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

      {formule.description ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{formule.description}</p>
      ) : null}

      <div className="mt-6 flex-1 border-t border-[var(--border)] pt-5">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-navy-800">
          {textes.options}
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
          <p className="mt-3 text-[0.9rem] text-ink-soft">{textes.aucuneOption}</p>
        )}
      </div>
    </article>
  );
}

export default async function TarifsTraduits({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesTarifs[langue];
  const commun = communs[langue];

  const grille = await getGrilleTarifaire();
  const grilleTraduite = traduireGrille(grille, commun);
  const categories = traduireCategories(grille, grilleTraduite, langue);
  const faq = questionsTarifs(categories, grilleTraduite, langue);
  const chemin = cheminEn(langue, '/tarifs');

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.page, path: chemin },
  ];

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

      {categories.map((categorie, index) => (
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
                  <CarteFormule formule={formule} textes={t.carte} />
                </StaggerItem>
              ))}
            </Stagger>

            {categorie.abonnement ? (
              <Reveal className="mt-6">
                <div className="flex flex-col gap-5 rounded-3xl border border-brand-line bg-[image:var(--gradient-brand-soft)] p-7 md:flex-row md:items-center md:justify-between md:p-8">
                  <div>
                    <p className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      {commun.abonnement}
                    </p>
                    <p className="mt-2 text-[1.05rem] font-medium text-navy-800">
                      {categorie.abonnement.contenu}
                    </p>
                    {categorie.abonnement.economie ? (
                      <p className="mt-1.5 text-[0.95rem] text-ink-soft">
                        {t.economie(commun.prix(categorie.abonnement.economie))}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0">
                    <span className="font-display text-[2rem] font-bold leading-none text-navy-900">
                      {categorie.abonnement.prix}
                    </span>
                    <span className="ms-1.5 text-ink-soft">{commun.parMois}</span>
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
                {t.autres.titre}
              </h2>
              <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-ink-soft">
                {t.autres.texte}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <StoreButtons textes={commun.boutiques} />
                <ArrowLink href={cheminEn(langue, '/contact')}>{t.autres.lien}</ArrowLink>
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
                {t.questions.titre}
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
          </div>
        </Container>
      </section>

      <FinalCta langue={langue} />

      <StructuredData
        id="tarifs-schema"
        data={[
          webPageSchema({
            path: chemin,
            name: t.nomPage,
            description: descriptionPage(grilleTraduite, langue),
            langue,
          }),
          breadcrumbSchema(crumbs),
          catalogueSchema(categories, langue),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
