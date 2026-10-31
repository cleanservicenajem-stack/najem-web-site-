import type { Metadata } from 'next';
import { Check } from 'lucide-react';
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
import { StructuredData } from '@/components/seo/StructuredData';
import { communs, type TextesCommuns } from '@/content/i18n/commun';
import { textesCanapeTapis } from '@/content/i18n/pages/canape-tapis';
import { createMetadata } from '@/lib/seo';
import { lireLangue, traduireOption } from '@/lib/i18n';
import { getGrilleTarifaire, montant, type CategorieAffichee } from '@/lib/tarifs';
import { optionsContenant, type OptionSituee } from '@/lib/landing';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * « Nettoyage canapé et tapis à Casablanca » en arabe et en anglais :
 * traduction de app/(site)/nettoyage-canape-tapis-casablanca/page.tsx.
 *
 * Comme en français, les prix sont relus dans la grille de /tarifs (option
 * « Shampouineuse canapé et tapis », trouvée par ses mots français) ; seuls
 * les noms sont traduits, par `communs`.
 */

type Props = { params: Promise<{ langue: string }> };

const CHEMIN = '/nettoyage-canape-tapis-casablanca';

/** Mots cherchés dans les libellés français des options, comme la page française. */
const MOTS_OPTION = ['canapé', 'tapis'];

/** Libellé français de l'option dans la grille (config/tarifs.ts), traduit par `communs`. */
const OPTION = 'Shampouineuse canapé et tapis';

const prixOption = (options: OptionSituee[]): { min: number; max: number } | null => {
  if (options.length === 0) return null;
  const prix = options.map((option) => option.prix);
  return { min: Math.min(...prix), max: Math.max(...prix) };
};

const filDAriane = (langue: LangueTraduite) => {
  const { fil } = textesCanapeTapis[langue];
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
  const t = textesCanapeTapis[langue];
  const prix = prixOption(optionsContenant(await getGrilleTarifaire(), MOTS_OPTION));
  const depart = prix ? communs[langue].prix(prix.min) : null;

  return createMetadata({
    title: t.meta.titre(depart),
    titreComplet: true,
    description: t.meta.description(depart),
    path: cheminEn(langue, CHEMIN),
  });
}

const questions = (langue: LangueTraduite, options: OptionSituee[]): FaqItem[] => {
  const commun = communs[langue];
  const t = textesCanapeTapis[langue].questions;
  const prix = prixOption(options);
  const items: FaqItem[] = [];

  if (prix) {
    items.push({
      id: 'canape-prix',
      category: 'pratique',
      question: t.prix.question,
      answer: [
        t.prix.reponse(
          commun.prix(prix.min),
          prix.min === prix.max ? null : commun.prix(prix.max),
        ),
      ],
    });
  }

  items.push(
    {
      id: 'canape-seul',
      category: 'pratique',
      question: t.seul.question,
      answer: [t.seul.reponse],
    },
    {
      id: 'canape-reserver',
      category: 'pratique',
      question: t.reserver.question,
      answer: [t.reserver.reponse(traduireOption(OPTION, commun))],
    },
    {
      id: 'canape-zones',
      category: 'pratique',
      question: t.zones.question,
      answer: [t.zones.reponse(alentours(commun))],
    },
  );

  return items;
};

const serviceCanapeTapis = (langue: LangueTraduite, options: OptionSituee[]): JsonLd => {
  const commun = communs[langue];
  const { schema } = textesCanapeTapis[langue];
  const prix = prixOption(options);
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
            offerCount: String(options.length),
          },
        }
      : {}),
  };
};

export default async function NettoyageCanapeTapisTraduite({ params }: Props) {
  const langue = await lireLangue(params);
  const commun = communs[langue];
  const t = textesCanapeTapis[langue];

  const grille: CategorieAffichee[] = await getGrilleTarifaire();
  const options = optionsContenant(grille, MOTS_OPTION);
  const prix = prixOption(options);
  const depart = prix ? commun.prix(prix.min) : null;
  const faq = questions(langue, options);
  const crumbs = filDAriane(langue);
  const specialise = commun.services['entretien-specialise']?.titre;

  // Lignes du tableau : une ligne dont le logement ou la formule n'a pas de nom traduit n'est pas affichée.
  const lignes = options.flatMap((option) => {
    const logement = commun.grille.categories[option.categorie.id]?.titre;
    const formule = commun.grille.formules[option.formule.id];
    if (!logement || !formule) return [];
    const prixMenage = montant(option.formule.prix);
    return [
      {
        cle: `${option.formule.id}-${option.libelle}`,
        logement,
        formule,
        menage: prixMenage === null ? '' : commun.prix(prixMenage),
        option: `+ ${commun.prix(option.prix)}`,
      },
    ];
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

      <section className="bg-surface py-16 md:py-24" aria-labelledby="canape-fonctionnement">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                id="canape-fonctionnement"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                {t.fonctionnement.titre}
              </h2>
              <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                {t.fonctionnement.paragraphes.map((paragraphe) => (
                  <p key={paragraphe}>{paragraphe}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {lignes.length > 0 ? (
        <section className="bg-paper py-16 md:py-24" aria-labelledby="canape-prix">
          <Container>
            <Reveal>
              <h2
                id="canape-prix"
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
                    <th scope="col" className="px-6 py-4 text-end font-semibold">
                      {t.prix.colonnes.menage}
                    </th>
                    <th scope="col" className="px-6 py-4 text-end font-semibold">
                      {t.prix.colonnes.option}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-ink">
                  {lignes.map((ligne) => (
                    <tr key={ligne.cle}>
                      <td className="px-6 py-4 text-ink-soft">{ligne.logement}</td>
                      <td className="px-6 py-4 font-medium text-navy-800">{ligne.formule}</td>
                      <td className="px-6 py-4 text-end text-ink-soft">{ligne.menage}</td>
                      <td className="px-6 py-4 text-end font-semibold text-brand-600">
                        {ligne.option}
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

      <section className="bg-surface py-16 md:py-24" aria-labelledby="canape-consignes">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2
                id="canape-consignes"
                className="font-display text-[1.4rem] font-semibold text-navy-900"
              >
                {t.consignes.titre}
              </h2>
              <ul className="mt-6 space-y-3">
                {t.consignes.liste.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-paper/60 px-4 py-3.5 text-[0.925rem] text-ink"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
                {t.specialise.titre}
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{t.specialise.texte}</p>
              <div className="mt-6 flex flex-wrap gap-6">
                {specialise ? (
                  <ArrowLink href={cheminEn(langue, '/services/entretien-specialise')}>
                    {specialise}
                  </ArrowLink>
                ) : null}
                <ArrowLink href={cheminEn(langue, '/femme-de-menage-casablanca')}>
                  {t.specialise.lienFemmeDeMenage}
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-24" aria-labelledby="canape-questions">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                id="canape-questions"
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
        id="canape-tapis-schema"
        data={[
          webPageSchema({
            path: cheminEn(langue, CHEMIN),
            name: t.schema.nomPage,
            description: t.schema.descriptionPage,
            langue,
          }),
          breadcrumbSchema(crumbs),
          serviceCanapeTapis(langue, options),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
