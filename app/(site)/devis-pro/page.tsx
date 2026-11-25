import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { DemandePro } from '@/components/pro/DemandePro';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

/**
 * Page dédiée aux professionnels (« Conciergeries et propriétaires multi-biens »).
 *
 * Volontairement réduite (décisions du 25 novembre 2026) : le passage en compte
 * pro dans l'application et un formulaire avec choix de catégorie, qui part sur
 * WhatsApp. Elle ne décrit aucune offre absente de l'application et ne précise
 * pas ce qui est fait ou non.
 */

const CHEMIN = '/devis-pro';

const DESCRIPTION =
  'Professionnels, conciergeries et propriétaires multi-biens à Casablanca : demandez votre devis pro, avec photos, sur WhatsApp.';

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Conciergeries et multi-biens', path: CHEMIN },
];

export const metadata: Metadata = createMetadata({
  title: 'Conciergeries et propriétaires multi-biens à Casablanca | Najem',
  titreComplet: true,
  description: DESCRIPTION,
  path: CHEMIN,
});

export default function DevisProPage() {
  return (
    <>
      <PageHero
        eyebrow="Professionnels"
        title="Conciergeries et propriétaires multi-biens"
        crumbs={crumbs}
        lead={
          <p>
            Choisissez votre catégorie, puis envoyez-nous votre demande sur WhatsApp, avec vos
            photos si vous le souhaitez.
          </p>
        }
      />

      <DemandePro />

      <StructuredData
        id="devis-pro-schema"
        data={[
          webPageSchema({
            path: CHEMIN,
            name: 'Conciergeries et propriétaires multi-biens — Najem Clean Service',
            description: DESCRIPTION,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
