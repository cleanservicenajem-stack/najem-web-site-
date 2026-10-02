import type { Metadata } from 'next';
import Link from 'next/link';
import { legalEntity } from '@/config/legal';
import { siteConfig } from '@/config/site';
import { getContact } from '@/lib/content';
import { LegalPage, LegalSection, LegalValue } from '@/components/legal/LegalPage';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

const description =
  'Mentions légales du site Najem Clean Service : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.';

export const metadata: Metadata = createMetadata({
  title: 'Mentions légales',
  description,
  path: '/mentions-legales',
});

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Mentions légales', path: '/mentions-legales' },
];

export default async function LegalNoticePage() {
  const contact = await getContact();

  return (
    <>
      <LegalPage
        title="Mentions légales"
        lead="Informations relatives à l’éditeur et à l’hébergement du site najemcleanservice."
        crumbs={crumbs}
      >
        <LegalSection title="Éditeur du site">
          <ul className="space-y-2">
            <li>
              Raison sociale : <LegalValue value={legalEntity.legalName} label="Raison sociale" />
            </li>
            <li>
              Forme juridique : <LegalValue value={legalEntity.legalForm} label="Forme juridique" />
            </li>
            <li>
              Siège social : <LegalValue value={legalEntity.headOffice} label="Adresse du siège" />
            </li>
            <li>
              Identifiant d’entreprise :{' '}
              <LegalValue value={legalEntity.registrationNumber} label="Numéro d’immatriculation" />
            </li>
            <li>
              Contact :{' '}
              <LegalValue value={legalEntity.legalEmail ?? contact.email} label="E-mail" />
            </li>
          </ul>
          <p>
            Nom commercial du service : {siteConfig.name}. Site officiel :{' '}
            <Link href="/" className="text-brand-600 underline underline-offset-4">
              {siteConfig.url.replace(/^https?:\/\//, '')}
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="Directeur de la publication">
          <p>
            <LegalValue
              value={legalEntity.publicationDirector}
              label="Nom du directeur de la publication"
            />
          </p>
        </LegalSection>

        <LegalSection title="Hébergement">
          <p>
            Hébergeur :{' '}
            <LegalValue value={legalEntity.host?.name ?? null} label="Nom de l’hébergeur" />
          </p>
          {legalEntity.host?.address ? <p>Adresse : {legalEntity.host.address}</p> : null}
        </LegalSection>

        <LegalSection title="Propriété intellectuelle">
          <p>
            L’ensemble des éléments composant ce site — structure, textes, mise en page, éléments
            graphiques — est protégé au titre du droit d’auteur. Le logo Najem Clean Service, sa
            typographie et ses couleurs constituent des éléments distinctifs de la marque et ne
            peuvent être reproduits, modifiés ou réutilisés sans autorisation écrite préalable.
          </p>
          <p>
            Les marques et logos App Store et Google Play appartiennent à leurs titulaires
            respectifs et ne sont utilisés que pour indiquer la disponibilité de l’application.
          </p>
        </LegalSection>

        <LegalSection title="Application mobile">
          <p>
            L’application {siteConfig.apps.ios.appName} est distribuée sur l’App Store et sur Google
            Play. Les conditions propres à ces plateformes s’appliquent au téléchargement et aux
            achats éventuels effectués par leur intermédiaire.
          </p>
        </LegalSection>

        <LegalSection title="Données personnelles">
          <p>
            Le traitement des données transmises via le formulaire de contact est décrit dans la{' '}
            <Link href="/confidentialite" className="text-brand-600 underline underline-offset-4">
              politique de confidentialité
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="Responsabilité">
          <p>
            Les informations publiées sur ce site sont fournies à titre indicatif. Les modalités
            applicables à une réservation — disponibilités, conditions de modification, moyens de
            paiement — sont celles affichées dans l’application au moment de la commande.
          </p>
        </LegalSection>
      </LegalPage>

      <StructuredData
        id="legal-schema"
        data={[
          webPageSchema({ path: '/mentions-legales', name: 'Mentions légales', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
