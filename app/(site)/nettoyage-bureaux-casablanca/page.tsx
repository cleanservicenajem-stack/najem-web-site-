import type { Metadata } from 'next';
import { Check, Mail, MessageCircle } from 'lucide-react';
import type { FaqItem } from '@/config/faq';
import { absoluteUrl, siteConfig } from '@/config/site';
import { alentoursTexte } from '@/config/local-seo';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Accordion } from '@/components/ui/Accordion';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { whatsappHref } from '@/lib/content';
import {
  ORGANIZATION_ID,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  type JsonLd,
} from '@/lib/schema';

/**
 * Page « Nettoyage de bureaux à Casablanca ».
 *
 * Service hors application, sur devis : aucun prix n'est affiché. Un devis
 * n'est donné qu'après une visite gratuite de 15 minutes ou des photos. La
 * page ne promet ni horaires élargis, ni remplacement, ni assurance, ni
 * consommables : ces points ne sont pas arrêtés.
 */

const CHEMIN = '/nettoyage-bureaux-casablanca';

const DESCRIPTION =
  'Nettoyage de bureaux à Casablanca : agences, cabinets, startups et showrooms de 50 à 400 m². Devis après une visite gratuite de 15 minutes ou des photos.';

const MESSAGE_DEVIS = 'Bonjour, je souhaite un devis pour le nettoyage de nos bureaux.';

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Nettoyage de bureaux', path: CHEMIN },
];

export const metadata: Metadata = createMetadata({
  title: 'Nettoyage de bureaux à Casablanca, sur devis | Najem',
  titreComplet: true,
  description: DESCRIPTION,
  path: CHEMIN,
});

const etapes = [
  {
    titre: 'Décrivez vos locaux',
    texte: 'Indiquez la surface, le quartier et la fréquence souhaitée, sur WhatsApp ou depuis la page contact.',
  },
  {
    titre: 'Visite ou photos',
    texte: 'Une visite gratuite de 15 minutes, ou des photos et une vidéo des locaux.',
  },
  {
    titre: 'Recevez votre devis',
    texte: 'Le prix et les conditions sont écrits dans le devis, avant tout engagement.',
  },
];

const taches = [
  'Sols et surfaces de travail',
  'Sanitaires',
  'Cuisine ou coin pause',
  'Vidage des corbeilles',
  'Vitres intérieures accessibles',
  'Vos consignes et vos priorités',
];

const reperes = [
  'Bureaux de 50 à 400 m² ; au-delà, la demande est étudiée après visite.',
  'Un, deux, trois ou cinq passages par semaine, ou une intervention ponctuelle.',
  'Produits et matériel de nettoyage inclus.',
  'Prestataires sélectionnés et vérifiés.',
  'Facture émise par NAJEM CLEAN SERVICE SARL, avec son ICE.',
];

const questions: FaqItem[] = [
  {
    id: 'bureaux-prix',
    category: 'pratique',
    question: 'Combien coûte le nettoyage de bureaux à Casablanca ?',
    answer: [
      'Le prix dépend de la surface, de la fréquence et des tâches demandées. Il est confirmé par un devis, après une visite gratuite de 15 minutes ou l’envoi de photos et d’une vidéo.',
    ],
  },
  {
    id: 'bureaux-reserver',
    category: 'pratique',
    question: 'Peut-on réserver le nettoyage de bureaux dans l’application ?',
    answer: [
      'Non : les bureaux sont traités sur devis. Écrivez-nous sur WhatsApp ou depuis la page contact.',
    ],
  },
  {
    id: 'bureaux-zones',
    category: 'pratique',
    question: 'Dans quelles zones intervenez-vous ?',
    answer: [
      `À Casablanca, notamment Maârif, Gauthier, Racine, Anfa, CFC et Sidi Maârouf, et dans ses alentours : ${alentoursTexte()}. En périphérie, les conditions sont confirmées à partir de votre adresse.`,
    ],
  },
];

const serviceBureaux: JsonLd = {
  '@type': 'Service',
  '@id': `${absoluteUrl(CHEMIN)}#service`,
  name: 'Nettoyage de bureaux à Casablanca',
  serviceType: 'Nettoyage de bureaux',
  url: absoluteUrl(CHEMIN),
  provider: { '@id': ORGANIZATION_ID },
  areaServed: siteConfig.serviceAreas.map((area) => ({ '@type': 'City', name: area.name })),
};

const titreSection =
  'font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900';

export default async function NettoyageBureauxPage() {
  const whatsapp = await whatsappHref(MESSAGE_DEVIS);

  const actions = (
    <div className="flex flex-wrap gap-3">
      {whatsapp ? (
        <Button href={whatsapp} external icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}>
          Demander un devis sur WhatsApp
        </Button>
      ) : null}
      <Button
        href="/contact"
        variant={whatsapp ? 'secondary' : 'primary'}
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
      >
        Nous écrire
      </Button>
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow="Professionnels à Casablanca"
        title="Nettoyage de bureaux à Casablanca"
        crumbs={crumbs}
        lead={
          <p>
            Agences, cabinets, startups et showrooms de 50 à 400 m² : un nettoyage régulier ou
            ponctuel de vos locaux, sur devis après une visite gratuite de 15 minutes ou l’envoi
            de photos.
          </p>
        }
      >
        {actions}
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="bureaux-devis">
        <Container>
          <Reveal>
            <h2 id="bureaux-devis" className={titreSection}>
              Obtenir votre devis en trois étapes
            </h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {etapes.map((etape, index) => (
              <li
                key={etape.titre}
                className="rounded-3xl border border-[var(--border)] bg-paper/60 p-7"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tint text-[0.85rem] font-semibold text-brand-700">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-[1.15rem] font-semibold text-navy-900">
                  {etape.titre}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-24" aria-labelledby="bureaux-prestation">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2 id="bureaux-prestation" className={titreSection}>
                Ce que nous pouvons prendre en charge
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                La liste exacte est fixée avec vous dans le devis, selon vos locaux.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {taches.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-surface px-4 py-3.5 text-[0.925rem] text-ink"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className={titreSection}>Les repères</h2>
              <ul className="mt-6 space-y-3">
                {reperes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-surface px-4 py-3.5 text-[0.925rem] text-ink"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-6">
                <ArrowLink href="/services/professionnels">Location courte durée</ArrowLink>
                <ArrowLink href="/femme-de-menage-casablanca">Ménage à domicile</ArrowLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 md:py-24" aria-labelledby="bureaux-questions">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 id="bureaux-questions" className={titreSection}>
                Questions fréquentes
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={questions} />
            <div className="mt-10">{actions}</div>
          </div>
        </Container>
      </section>

      <StructuredData
        id="bureaux-schema"
        data={[
          webPageSchema({
            path: CHEMIN,
            name: 'Nettoyage de bureaux à Casablanca — Najem Clean Service',
            description: DESCRIPTION,
          }),
          breadcrumbSchema(crumbs),
          serviceBureaux,
          faqSchema(questions),
        ]}
      />
    </>
  );
}
