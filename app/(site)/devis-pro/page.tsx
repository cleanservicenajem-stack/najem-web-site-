import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { FormulaireDevisPro } from '@/components/forms/FormulaireDevisPro';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { whatsappHref } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

/**
 * Page « Demande de devis pro ».
 *
 * Volontairement réduite à la demande elle-même (décision du 25 novembre
 * 2026) : un formulaire très court qui part sur WhatsApp. Elle ne décrit aucune
 * offre absente de l'application et ne précise pas ce qui est fait ou non.
 */

const CHEMIN = '/devis-pro';

const DESCRIPTION =
  'Professionnels à Casablanca : demandez un devis à Najem Clean Service avec un court formulaire, envoyé sur WhatsApp.';

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Demande de devis pro', path: CHEMIN },
];

export const metadata: Metadata = createMetadata({
  title: 'Demande de devis pro à Casablanca | Najem',
  titreComplet: true,
  description: DESCRIPTION,
  path: CHEMIN,
});

export default async function DevisProPage() {
  const whatsapp = await whatsappHref();

  return (
    <>
      <PageHero
        eyebrow="Professionnels"
        title="Faire une demande de devis pro"
        crumbs={crumbs}
        lead={<p>Deux champs à remplir, et votre demande part sur WhatsApp.</p>}
      />

      <section className="bg-surface py-12 md:py-20" aria-label="Formulaire de demande de devis">
        <Container>
          <div className="mx-auto max-w-xl">
            {whatsapp ? <FormulaireDevisPro lienWhatsapp={whatsapp} /> : null}
            <div className="mt-8">
              <ArrowLink href="/contact">Nous écrire depuis la page contact</ArrowLink>
            </div>
          </div>
        </Container>
      </section>

      <StructuredData
        id="devis-pro-schema"
        data={[
          webPageSchema({
            path: CHEMIN,
            name: 'Demande de devis pro — Najem Clean Service',
            description: DESCRIPTION,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
