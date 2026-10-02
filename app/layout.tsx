import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { siteConfig } from '@/config/site';
import { themeColors, themeInitScript } from '@/lib/theme';
import { defaultOgImage } from '@/lib/seo';
import { Analytics } from '@/components/analytics/Analytics';

/**
 * Polices servies depuis le site, et non depuis Google.
 *
 * Trois raisons : le visiteur n'ouvre pas de connexion vers un domaine tiers,
 * aucune requête vers Google n'est faite à son insu, et la compilation ne
 * dépend plus d'un téléchargement au moment du build.
 *
 * Ce sont les fichiers variables officiels, sous-ensemble latin, qui couvre le
 * français y compris « œ ». Un seul fichier par famille suffit pour toute la
 * plage de graisses.
 */
const inter = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '400 600',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
});

const jakarta = localFont({
  src: './fonts/plus-jakarta-sans-latin.woff2',
  weight: '600 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-jakarta',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Services de nettoyage à domicile`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Réservez facilement un service de nettoyage professionnel avec Najem Clean Service. Téléchargez l’application sur iPhone ou Android et planifiez votre prochain nettoyage.",
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'Services de nettoyage à domicile',
  formatDetection: { telephone: false, address: false, email: false },
  alternates: {
    canonical: siteConfig.url,
    languages: { 'fr-FR': siteConfig.url, 'x-default': siteConfig.url },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale.ogLocale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Services de nettoyage à domicile`,
    description: siteConfig.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Services de nettoyage à domicile`,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
  /** Smart App Banner iOS → balise `apple-itunes-app`. */
  itunes: {
    appId: siteConfig.apps.ios.appId,
  },
  appleWebApp: {
    capable: false,
    title: siteConfig.name,
  },
  ...(siteConfig.analytics.googleSiteVerification
    ? { verification: { google: siteConfig.analytics.googleSiteVerification } }
    : {}),
};

export const viewport: Viewport = {
  // Valeurs par défaut avant l'exécution du JavaScript ; une fois la page
  // interactive, le thème réellement affiché prend le relais (`lib/theme.ts`).
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeColors.light },
    { media: '(prefers-color-scheme: dark)', color: themeColors.dark },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteConfig.locale.htmlLang}
      dir="ltr"
      className={`${inter.variable} ${jakarta.variable}`}
      // La classe `dark` est posée par le script ci-dessous, avant l'hydratation.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        {/* L'habillage public vit dans `app/(site)/layout.tsx` : l'administration
            n'en hérite pas. */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
