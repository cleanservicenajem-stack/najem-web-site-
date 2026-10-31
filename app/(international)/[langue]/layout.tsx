import { SiteChrome } from '@/components/layout/SiteChrome';
import { directionParLangue, languesTraduites } from '@/config/i18n';
import { lireLangue } from '@/lib/i18n';

/**
 * Pages traduites : /ar (de droite à gauche) et /en. Seules ces deux langues
 * existent ; toute autre adresse de ce niveau aboutit à une page introuvable.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return languesTraduites.map((langue) => ({ langue }));
}

export default async function LayoutTraduit({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ langue: string }>;
}) {
  const langue = await lireLangue(params);
  const direction = directionParLangue[langue];

  // La langue et le sens de lecture sont portés par l'enveloppe de la page. Le
  // petit script les reporte aussi sur l'élément <html>, que la mise en page
  // racine déclare en français, pour les lecteurs d'écran et les navigateurs.
  return (
    <div lang={langue} dir={direction}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(langue)};document.documentElement.dir=${JSON.stringify(direction)};`,
        }}
      />
      <SiteChrome langue={langue}>{children}</SiteChrome>
    </div>
  );
}
