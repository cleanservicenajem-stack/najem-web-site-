import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { MobileAppBar } from '@/components/layout/MobileAppBar';
import { CursorHalo } from '@/components/animations/CursorHalo';
import { StructuredData } from '@/components/seo/StructuredData';
import { organizationSchema, websiteSchema } from '@/lib/schema';

/**
 * Habillage du site public : en-tête, pied de page et données structurées.
 *
 * Il est extrait de la mise en page racine pour que l'administration, qui vit
 * dans un autre groupe de routes, n'en hérite pas.
 */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const organisation = await organizationSchema();

  return (
    <>
      <SkipLink />
      <CursorHalo />
      <Header />
      <main id="contenu" className="pt-[var(--header-height)]">
        {children}
      </main>
      <Footer />
      <MobileAppBar />
      <StructuredData id="site-schema" data={[organisation, websiteSchema()]} />
    </>
  );
}
