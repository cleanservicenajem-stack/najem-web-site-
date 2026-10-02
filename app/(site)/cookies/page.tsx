import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { LegalPage, LegalSection } from '@/components/legal/LegalPage';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

const description =
  'Gestion des cookies sur le site Najem Clean Service : ce qui est déposé sur votre appareil, pourquoi, et comment le supprimer.';

export const metadata: Metadata = createMetadata({
  title: 'Cookies',
  description,
  path: '/cookies',
});

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Cookies', path: '/cookies' },
];

const analyticsEnabled = Boolean(siteConfig.analytics.gaId || siteConfig.analytics.gtmId);

export default function CookiesPage() {
  return (
    <>
      <LegalPage
        title="Cookies et stockage local"
        lead="Cette page décrit précisément ce que le site dépose sur votre appareil. Elle est mise à jour dès qu’un nouvel outil est ajouté."
        crumbs={crumbs}
      >
        <LegalSection title="Ce que le site utilise aujourd’hui">
          {analyticsEnabled ? (
            <p>
              Un outil de mesure d’audience est actuellement actif sur le site. Il dépose des
              cookies permettant de compter les visites et de comprendre les parcours. Vous pouvez
              vous y opposer via les réglages de votre navigateur.
            </p>
          ) : (
            <p>
              Aucun cookie de mesure d’audience, de publicité ou de réseau social n’est déposé sur
              ce site. Aucun traceur tiers n’est chargé.
            </p>
          )}

          <p>
            Le site utilise en revanche un élément de stockage local strictement technique :
          </p>
          <ul className="space-y-2">
            <li>
              <strong className="font-medium text-navy-800">
                najem:app-bar-dismissed
              </strong>{' '}
              — enregistré dans le stockage de session de votre navigateur lorsque vous fermez le
              rappel « Réservez depuis l’application ». Il évite que ce rappel réapparaisse pendant
              votre visite, et disparaît à la fermeture de l’onglet.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Polices et images">
          <p>
            Les polices de caractères et les images sont servies depuis ce site, sans appel à un
            service tiers. Aucune requête vers un domaine externe n’est effectuée lors de la
            consultation des pages.
          </p>
        </LegalSection>

        <LegalSection title="Liens vers l’App Store et Google Play">
          <p>
            Les boutons de téléchargement ouvrent les fiches de l’application sur l’App Store et
            sur Google Play. Une fois sur ces plateformes, les politiques de confidentialité et de
            cookies d’Apple et de Google s’appliquent.
          </p>
        </LegalSection>

        <LegalSection title="Supprimer ces données">
          <p>
            Vider les données de site dans les réglages de votre navigateur supprime l’élément
            mentionné ci-dessus. Aucune fonctionnalité du site n’en dépend.
          </p>
          <p>
            Pour toute question, consultez la{' '}
            <Link href="/confidentialite" className="text-brand-600 underline underline-offset-4">
              politique de confidentialité
            </Link>{' '}
            ou{' '}
            <Link href="/contact" className="text-brand-600 underline underline-offset-4">
              écrivez-nous
            </Link>
            .
          </p>
        </LegalSection>
      </LegalPage>

      <StructuredData
        id="cookies-schema"
        data={[
          webPageSchema({ path: '/cookies', name: 'Cookies', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
