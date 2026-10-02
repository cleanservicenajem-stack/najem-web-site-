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
import { homeFaqItems } from '@/config/faq';
import { createMetadata } from '@/lib/seo';
import { webPageSchema } from '@/lib/schema';
import { getSeo, getTexte } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('accueil')), path: '/', titreComplet: true });
}

export default async function HomePage() {
  const [badge, titre, accroche] = await Promise.all([
    getTexte('accueil.badge'),
    getTexte('accueil.titre'),
    getTexte('accueil.accroche'),
  ]);

  return (
    <>
      <Hero badge={badge} titre={titre} accroche={accroche} />
      <BrandStatement />
      <ServicesEditorial />
      <WhyNajem />
      <AppSpotlight />
      <TrustSection />
      <Testimonials />
      <FaqSection
        items={homeFaqItems}
        lead="Si vous ne trouvez pas votre réponse ici, la FAQ complète et le formulaire de contact prennent le relais."
        link={{ label: 'Consulter la FAQ complète', href: '/faq' }}
        tone="paper"
      />
      <FinalCta />

      <StructuredData
        id="home-schema"
        data={[
          webPageSchema({
            path: '/',
            name: 'Najem Clean Service — services de nettoyage à domicile',
            description:
              'Présentation du service de nettoyage à domicile Najem Clean Service et de son application mobile iOS et Android.',
            primaryImage: '/images/og/og-default.png',
          }),
        ]}
      />
    </>
  );
}
