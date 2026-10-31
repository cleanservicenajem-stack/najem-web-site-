import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { MobileAppBar } from '@/components/layout/MobileAppBar';
import { CursorHalo } from '@/components/animations/CursorHalo';
import { StructuredData } from '@/components/seo/StructuredData';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import type { Langue } from '@/config/i18n';

/**
 * Habillage du site public : en-tête, pied de page et données structurées.
 *
 * Il est extrait de la mise en page racine pour que l'administration, qui vit
 * dans un autre groupe de routes, n'en hérite pas.
 */
export async function SiteChrome({
  children,
  langue = 'fr',
}: {
  children: React.ReactNode;
  /** Langue de l'habillage : le français par défaut, l'arabe ou l'anglais sous /ar et /en. */
  langue?: Langue;
}) {
  const organisation = await organizationSchema();

  return (
    <>
      <SkipLink langue={langue} />
      <CursorHalo />
      <Header langue={langue} />
      <main id="contenu" className="pt-[var(--header-height)]">
        {children}
      </main>
      <Footer langue={langue} />
      <MobileAppBar langue={langue} />
      <StructuredData id="site-schema" data={[organisation, websiteSchema()]} />
    </>
  );
}
