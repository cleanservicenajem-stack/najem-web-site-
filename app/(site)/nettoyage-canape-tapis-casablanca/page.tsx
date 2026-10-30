import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
import { absoluteUrl, siteConfig } from '@/config/site';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { formaterDh, getGrilleTarifaire, type CategorieAffichee } from '@/lib/tarifs';
import { optionsContenant, type OptionSituee } from '@/lib/landing';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * Page d'atterrissage « Nettoyage canapé et tapis à Casablanca ».
 *
 * Dans l'application, le canapé et les tapis se traitent avec l'option
 * « Shampouineuse canapé et tapis », ajoutée à une formule de ménage. Les prix
 * affichés ici sont relus dans la grille de /tarifs : la page n'annonce aucun
 * tarif qui n'y figure pas.
 */

const CHEMIN = '/nettoyage-canape-tapis-casablanca';

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Nettoyage canapé et tapis', path: CHEMIN },
];

const MOTS_OPTION = ['canapé', 'tapis'];

const prixOption = (options: OptionSituee[]): { min: number; max: number } | null => {
  if (options.length === 0) return null;
  const prix = options.map((option) => option.prix);
  return { min: Math.min(...prix), max: Math.max(...prix) };
};

export async function generateMetadata(): Promise<Metadata> {
  const prix = prixOption(optionsContenant(await getGrilleTarifaire(), MOTS_OPTION));
  const depart = prix ? ` dès ${formaterDh(prix.min)}` : '';

  return createMetadata({
    title: `Nettoyage canapé et tapis à Casablanca${depart} | Najem`,
    titreComplet: true,
    description: `Nettoyage de canapé et de tapis à la shampouineuse à Casablanca${depart}, en option de votre ménage à domicile. Réservez dans l’application Najem Clean Service.`,
    path: CHEMIN,
  });
}

const questions = (options: OptionSituee[]): FaqItem[] => {
  const prix = prixOption(options);
  const items: FaqItem[] = [];

  if (prix) {
    items.push({
      id: 'canape-prix',
      category: 'pratique',
      question: 'Combien coûte le nettoyage d’un canapé à Casablanca ?',
      answer: [
        prix.min === prix.max
          ? `Chez ${siteConfig.name}, l’option shampouineuse canapé et tapis coûte ${formaterDh(prix.min)}, en plus de la formule de ménage choisie.`
          : `Chez ${siteConfig.name}, l’option shampouineuse canapé et tapis coûte de ${formaterDh(prix.min)} à ${formaterDh(prix.max)} selon la formule, en plus du prix du ménage.`,
      ],
    });
  }

  items.push(
    {
      id: 'canape-seul',
      category: 'pratique',
      question: 'Peut-on réserver uniquement le nettoyage d’un canapé ou d’un tapis ?',
      answer: [
        'Décrivez votre demande au moment de la réservation dans l’application, ou écrivez-nous depuis la page contact. La faisabilité est confirmée en fonction de la demande et des professionnels disponibles.',
      ],
    },
    {
      id: 'canape-reserver',
      category: 'pratique',
      question: 'Comment ajouter le nettoyage du canapé et des tapis ?',
      answer: [
        'Dans l’application Najem Clean Service, choisissez votre formule de ménage, puis ajoutez l’option « Shampouineuse canapé et tapis ». Son prix s’ajoute à celui de la formule et s’affiche avant que vous confirmiez.',
      ],
    },
    {
      id: 'canape-zones',
      category: 'pratique',
      question: 'Intervenez-vous dans tout Casablanca ?',
      answer: [
        `Oui, ${siteConfig.name} intervient dans l’ensemble de Casablanca. La disponibilité d’un créneau à votre adresse est confirmée dans l’application, au moment de la réservation.`,
      ],
    },
  );

  return items;
};

const serviceCanapeTapis = (options: OptionSituee[]): JsonLd => {
  const prix = prixOption(options);

  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(CHEMIN)}#service`,
    name: 'Nettoyage de canapé et de tapis à domicile à Casablanca',
    serviceType: 'Nettoyage de canapé et de tapis',
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
            offerCount: String(options.length),
          },
        }
      : {}),
  };
};

const consignes = [
  'Le type de textile, si vous le connaissez : tissu, velours, microfibre, laine…',
  'Le nombre de places du canapé et la taille approximative des tapis.',
  'Les taches à traiter en priorité et leur origine, si vous la connaissez.',
  'Le délai de séchage dont vous disposez avant de réutiliser la pièce.',
];

export default async function NettoyageCanapeTapisPage() {
  const grille: CategorieAffichee[] = await getGrilleTarifaire();
  const options = optionsContenant(grille, MOTS_OPTION);
  const prix = prixOption(options);
  const faq = questions(options);

  return (
    <>
      <PageHero
        eyebrow="Entretien spécialisé à Casablanca"
        title="Nettoyage de canapé et de tapis à domicile à Casablanca"
        crumbs={crumbs}
        lead={
          <p>
            Ajoutez le nettoyage à la shampouineuse de votre canapé et de vos tapis à votre
            ménage
            {prix ? `, dès ${formaterDh(prix.min)}` : ''}, directement depuis l’application{' '}
            {siteConfig.name}.
          </p>
        }
      >
        <StoreButtons />
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="canape-fonctionnement">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2
                id="canape-fonctionnement"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                Comment ça marche
              </h2>
              <div className="mt-6 space-y-5 text-[1.02rem] leading-relaxed text-ink">
                <p>
                  Le canapé et les tapis concentrent la poussière, les odeurs et les taches du
                  quotidien. Chez {siteConfig.name}, leur nettoyage à la shampouineuse est une
                  option que vous ajoutez à votre ménage au moment de la réservation : un seul
                  passage pour le logement et les textiles.
                </p>
                <p>
                  Le prix de l’option s’ajoute à celui de la formule choisie et s’affiche avant
                  la confirmation. Pour une demande qui concerne uniquement un canapé, un tapis
                  ou un autre textile, décrivez-la dans l’application ou depuis la page contact :
                  la faisabilité est confirmée en fonction de la demande et des professionnels
                  disponibles.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {options.length > 0 ? (
        <section className="bg-paper py-16 md:py-24" aria-labelledby="canape-prix">
          <Container>
            <Reveal>
              <h2
                id="canape-prix"
                className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
              >
                Prix du nettoyage de canapé et de tapis
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
                Le prix de l’option selon la formule de ménage à laquelle vous l’ajoutez.
              </p>
            </Reveal>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--border)] bg-surface">
              <table className="w-full min-w-[34rem] text-left text-[0.95rem]">
                <caption className="sr-only">
                  Prix de l’option shampouineuse canapé et tapis selon la formule de ménage
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border)] text-[0.8rem] uppercase tracking-[0.1em] text-navy-800">
                    <th scope="col" className="px-6 py-4 font-semibold">Logement</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Formule de ménage</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">Ménage</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">
                      Canapé et tapis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-ink">
                  {options.map((option) => (
                    <tr key={`${option.formule.id}-${option.libelle}`}>
                      <td className="px-6 py-4 text-ink-soft">{option.categorie.titre}</td>
                      <td className="px-6 py-4 font-medium text-navy-800">{option.formule.nom}</td>
                      <td className="px-6 py-4 text-right text-ink-soft">{option.formule.prix}</td>
                      <td className="px-6 py-4 text-right font-semibold text-brand-600">
                        + {formaterDh(option.prix)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7">
              <ArrowLink href="/tarifs">Voir tous les tarifs</ArrowLink>
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
                Ce qu’il est utile de préciser à la réservation
              </h2>
              <ul className="mt-6 space-y-3">
                {consignes.map((item) => (
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
                Tapis, canapés, vitres, repassage
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                Le canapé et les tapis font partie de l’entretien spécialisé de {siteConfig.name},
                avec les vitres, le repassage et la désinfection : des soins dédiés, à préciser
                dans votre demande, partout à Casablanca.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <ArrowLink href="/services/entretien-specialise">L’entretien spécialisé</ArrowLink>
                <ArrowLink href="/femme-de-menage-casablanca">Femme de ménage à Casablanca</ArrowLink>
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
                Questions fréquentes
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
          </div>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="canape-tapis-schema"
        data={[
          webPageSchema({
            path: CHEMIN,
            name: 'Nettoyage de canapé et de tapis à Casablanca — Najem Clean Service',
            description:
              'Nettoyage de canapé et de tapis à la shampouineuse à Casablanca, en option du ménage à domicile Najem Clean Service : prix, fonctionnement et réservation.',
          }),
          breadcrumbSchema(crumbs),
          serviceCanapeTapis(options),
          faqSchema(faq),
        ]}
      />
    </>
  );
}
