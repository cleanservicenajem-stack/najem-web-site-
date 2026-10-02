import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

const description =
  'Conditions d’utilisation du site Najem Clean Service : objet, accès, contenus, liens externes et limites de responsabilité.';

export const metadata: Metadata = createMetadata({
  title: 'Conditions d’utilisation',
  description,
  path: '/conditions-utilisation',
});

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Conditions d’utilisation', path: '/conditions-utilisation' },
];

export default function TermsPage() {
  return (
    <>
      <LegalPage
        title="Conditions d’utilisation du site"
        lead="Ces conditions encadrent l’usage du site vitrine. Elles ne remplacent pas les conditions applicables aux réservations, qui sont présentées dans l’application."
        crumbs={crumbs}
      >
        <LegalSection title="Objet">
          <p>
            Le présent site a une vocation informative : présenter {siteConfig.name}, ses
            prestations de nettoyage à domicile et son application mobile. Il ne permet ni de
            réserver une intervention, ni d’effectuer un paiement.
          </p>
        </LegalSection>

        <LegalSection title="Accès au site">
          <p>
            L’accès est libre et gratuit. L’éditeur s’efforce d’assurer la disponibilité du site,
            sans garantie d’absence d’interruption, notamment pour des raisons de maintenance ou
            de mise à jour.
          </p>
        </LegalSection>

        <LegalSection title="Réservations et prestations">
          <p>
            Les réservations s’effectuent uniquement depuis l’application {siteConfig.apps.ios.appName}.
            Les conditions applicables — modalités de réservation, de modification, d’annulation et
            de paiement — sont celles présentées dans l’application au moment de la commande. En
            cas de divergence, ce sont ces dernières qui prévalent sur les informations de ce site.
          </p>
        </LegalSection>

        <LegalSection title="Contenus du site">
          <p>
            Les descriptions de prestations et les contenus éditoriaux sont fournis à titre
            indicatif et peuvent évoluer. Les articles de conseils n’ont pas valeur de garantie de
            résultat.
          </p>
          <p>
            Toute reproduction, même partielle, des contenus, de la charte graphique ou du logo est
            interdite sans autorisation écrite préalable.
          </p>
        </LegalSection>

        <LegalSection title="Formulaire de contact">
          <p>
            Le formulaire est réservé aux demandes de renseignements. Tout usage abusif — envois
            automatisés, contenus illicites, sollicitations commerciales non désirées — peut
            entraîner un blocage technique.
          </p>
        </LegalSection>

        <LegalSection title="Liens externes">
          <p>
            Le site renvoie vers les fiches de l’application sur l’App Store et Google Play.
            L’éditeur n’exerce aucun contrôle sur ces plateformes et décline toute responsabilité
            quant à leur contenu et à leurs conditions.
          </p>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <p>
            Le traitement des données transmises via le site est décrit dans la{' '}
            <Link href="/confidentialite" className="text-brand-600 underline underline-offset-4">
              politique de confidentialité
            </Link>
            .
          </p>
        </LegalSection>
      </LegalPage>

      <StructuredData
        id="terms-schema"
        data={[
          webPageSchema({ path: '/conditions-utilisation', name: 'Conditions d’utilisation', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
