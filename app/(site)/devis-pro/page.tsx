import type { Metadata } from 'next';
import { Mail, MessageCircle } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { whatsappHref } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

/**
 * Page « Demande de devis pro ».
 *
 * Volontairement réduite à la demande elle-même (décision du 25 novembre
 * 2026) : elle ne décrit aucune offre absente de l'application et ne précise
 * pas ce qui est fait ou non.
 */

const CHEMIN = '/devis-pro';

const DESCRIPTION =
  'Professionnels à Casablanca : faites votre demande de devis à Najem Clean Service, sur WhatsApp ou depuis la page contact.';

const MESSAGE_DEVIS = 'Bonjour, je souhaite faire une demande de devis pro.';

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
  const whatsapp = await whatsappHref(MESSAGE_DEVIS);

  return (
    <>
      <PageHero
        eyebrow="Professionnels"
        title="Faire une demande de devis pro"
        crumbs={crumbs}
        lead={<p>Envoyez-nous votre demande sur WhatsApp ou depuis la page contact.</p>}
      >
        <div className="flex flex-wrap gap-3">
          {whatsapp ? (
            <Button
              href={whatsapp}
              external
              icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
            >
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
      </PageHero>

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
