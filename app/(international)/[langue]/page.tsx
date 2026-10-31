import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { BrandStatement } from '@/components/home/BrandStatement';
import { ServicesEditorial } from '@/components/home/ServicesEditorial';
import { WhyNajem } from '@/components/home/WhyNajem';
import { AppSpotlight } from '@/components/home/AppSpotlight';
import { TrustSection } from '@/components/home/TrustSection';
import { Testimonials } from '@/components/home/Testimonials';
import { FaqSection } from '@/components/home/FaqSection';
import { FinalCta } from '@/components/home/FinalCta';
import { StructuredData } from '@/components/seo/StructuredData';
import { homeFaqIds } from '@/config/faq';
import { cheminEn, type LangueTraduite } from '@/config/i18n';
import { enabledServices } from '@/config/services';
import { communs } from '@/content/i18n/commun';
import { faqTraduite } from '@/content/i18n/faq';
import { textesAccueil } from '@/content/i18n/pages/accueil';
import { servicesTraduits } from '@/content/i18n/services';
import { lireLangue, traduireGrille } from '@/lib/i18n';
import { webPageSchema } from '@/lib/schema';
import { createMetadata } from '@/lib/seo';
import { getGrilleTarifaire } from '@/lib/tarifs';

/**
 * Accueil traduit (/ar, /en) : les sections de l'accueil français
 * (app/(site)/page.tsx), dans le même ordre et avec la même mise en page, et
 * les textes de content/i18n/pages/accueil.ts.
 */

type Props = { params: Promise<{ langue: string }> };

/**
 * Prix de départ cité par l'accroche et la description (« 200 DH ») : le prix
 * le plus bas de la grille tarifaire de l'administration, formaté dans la
 * langue de la page. `null` s'il est illisible : la mention disparaît.
 */
const prixDeDepart = async (langue: LangueTraduite): Promise<string | null> => {
  const { prixMin } = traduireGrille(await getGrilleTarifaire(), communs[langue]);
  return prixMin === null ? null : communs[langue].prix(prixMin);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { seo } = textesAccueil[langue];
  return createMetadata({
    title: seo.titre,
    description: seo.description(await prixDeDepart(langue)),
    path: cheminEn(langue, '/'),
    titreComplet: true,
  });
}

export default async function AccueilTraduit({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesAccueil[langue];
  const { boutiques } = communs[langue];
  const prix = await prixDeDepart(langue);

  return (
    <>
      <Hero
        badge={t.hero.badge}
        titre={t.hero.titre}
        accroche={t.hero.accroche(prix)}
        textes={t.hero.textes}
        lienApplication={cheminEn(langue, '/application')}
        boutiques={boutiques}
      />
      <BrandStatement textes={t.presentation} />
      {/* Mêmes prestations traduites que la page /services. */}
      <ServicesEditorial
        langue={langue}
        textes={t.services}
        prestations={servicesTraduits(langue, enabledServices)}
      />
      <WhyNajem textes={t.pourquoi} />
      <AppSpotlight textes={t.application} boutiques={boutiques} />
      <TrustSection textes={t.confiance} />
      <Testimonials langue={langue} textes={t.temoignages} />
      <FaqSection
        items={faqTraduite(langue, homeFaqIds)}
        eyebrow={t.faq.surtitre}
        title={t.faq.titre}
        lead={t.faq.introduction}
        link={{ label: t.faq.lien, href: cheminEn(langue, '/faq') }}
        tone="paper"
      />
      <FinalCta langue={langue} />

      <StructuredData
        id="home-schema"
        data={[
          webPageSchema({
            path: cheminEn(langue, '/'),
            name: t.schema.nomPage,
            description: t.schema.description,
            primaryImage: '/images/og/og-default.png',
            langue,
          }),
        ]}
      />
    </>
  );
}
