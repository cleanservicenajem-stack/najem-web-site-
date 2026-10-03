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
  'Politique de confidentialité Najem Clean Service : données collectées via le formulaire de contact, finalités, conservation et exercice de vos droits.';

export const metadata: Metadata = createMetadata({
  title: 'Politique de confidentialité',
  description,
  path: '/confidentialite',
});

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Politique de confidentialité', path: '/confidentialite' },
];

export default async function PrivacyPage() {
  const contact = await getContact();

  return (
    <>
      <LegalPage
        title="Politique de confidentialité"
        lead="Cette politique concerne le site najemcleanservice. Le traitement des données réalisé au sein de l’application mobile est décrit dans les documents propres à l’application."
        crumbs={crumbs}
      >
        <LegalSection title="Responsable du traitement">
          <p>
            <LegalValue value={legalEntity.legalName} label="Raison sociale" />, éditeur du site{' '}
            {siteConfig.name}.
          </p>
          <p>
            Contact : <LegalValue value={legalEntity.legalEmail ?? contact.email} label="E-mail de contact" />
          </p>
        </LegalSection>

        <LegalSection title="Données collectées sur ce site">
          <p>
            Le site ne crée pas de compte utilisateur et ne demande aucune donnée en dehors du
            formulaire de contact. Lorsqu’un formulaire est envoyé, les données suivantes sont
            traitées :
          </p>
          <ul className="space-y-2">
            <li>nom et prénom ;</li>
            <li>adresse e-mail ;</li>
            <li>numéro de téléphone, si vous choisissez de le renseigner ;</li>
            <li>objet et contenu du message ;</li>
            <li>
              adresse IP, utilisée uniquement de façon temporaire pour limiter les envois abusifs.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Finalités">
          <p>
            Ces données servent exclusivement à traiter votre demande et à y répondre. Elles ne
            sont ni revendues, ni utilisées à des fins de prospection sans votre accord.
          </p>
        </LegalSection>

        <LegalSection title="Base légale">
          <p>
            Le traitement repose sur votre consentement, recueilli au moment de l’envoi du
            formulaire, ainsi que sur l’intérêt légitime de l’éditeur à répondre aux demandes qui
            lui sont adressées et à protéger le site contre les envois automatisés.
          </p>
        </LegalSection>

        <LegalSection title="Destinataires">
          <p>
            Les messages sont adressés aux personnes en charge de la relation client chez{' '}
            <LegalValue value={legalEntity.legalName} label="Raison sociale" />. Ils transitent par
            le prestataire technique d’envoi d’e-mails utilisé par le site, à seule fin
            d’acheminement, et sont enregistrés chez l’hébergeur de la base de données du site afin
            d’être consultés depuis son espace d’administration. Ils ne sont ni cédés, ni vendus, ni
            utilisés à des fins publicitaires.
          </p>
        </LegalSection>

        <LegalSection title="Durée de conservation">
          <p>
            Les messages envoyés depuis le formulaire de contact sont conservés douze mois à
            compter de leur réception, puis supprimés automatiquement. Ils peuvent être supprimés
            avant ce terme, soit à votre demande, soit une fois la demande traitée. Les données
            techniques utilisées pour la limitation des envois sont conservées quelques minutes
            seulement, en mémoire, et ne sont jamais enregistrées.
          </p>
        </LegalSection>

        <LegalSection title="Vos droits">
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de
            limitation du traitement de vos données, ainsi que du droit de retirer votre
            consentement à tout moment.
          </p>
          <p>
            Pour exercer ces droits, écrivez à{' '}
            <LegalValue value={legalEntity.legalEmail ?? contact.email} label="E-mail de contact" />{' '}
            ou utilisez le{' '}
            <Link href="/contact" className="text-brand-600 underline underline-offset-4">
              formulaire de contact
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="Cookies et stockage local">
          <p>
            Le site n’utilise pas de cookie publicitaire. Le détail de ce qui est déposé sur votre
            appareil est décrit sur la page{' '}
            <Link href="/cookies" className="text-brand-600 underline underline-offset-4">
              gestion des cookies
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="Application mobile">
          <p>
            Les données traitées dans le cadre d’une réservation sont collectées via l’application{' '}
            {siteConfig.apps.ios.appName}, et non par ce site. Les informations correspondantes
            sont présentées dans l’application et sur ses fiches App Store et Google Play.
          </p>
        </LegalSection>
      </LegalPage>

      <StructuredData
        id="privacy-schema"
        data={[
          webPageSchema({ path: '/confidentialite', name: 'Politique de confidentialité', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
