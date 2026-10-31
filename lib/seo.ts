import type { Metadata } from 'next';
import { analyserChemin, ogLocaleParLangue, versionsDe, type Langue } from '@/config/i18n';
import { absoluteUrl, siteConfig } from '@/config/site';

const isIndexable =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' || process.env.NODE_ENV === 'production';

export const defaultOgImage = {
  url: '/images/og/og-default.png',
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.positioning}`,
};

type CreateMetadataInput = {
  title: string;
  description: string;
  /** Chemin absolu depuis la racine, ex. "/services". */
  path: string;
  /** Image relative au domaine. */
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  /**
   * À utiliser pour une page dont le titre contient déjà le nom du site :
   * il court-circuite le gabarit `%s | Najem Clean Service`.
   */
  titreComplet?: boolean;
  /**
   * Versions de la page dans chaque langue (chemins), pour les balises
   * hreflang. Par défaut, elles sont déduites du chemin : les trois langues
   * pour une page traduite (config/i18n.ts), sinon le seul français.
   */
  langues?: Partial<Record<Langue, string>>;
  /** Locale Open Graph ; par défaut, celle de la langue du chemin. */
  ogLocale?: string;
};

export const createMetadata = ({
  title,
  description,
  path,
  image,
  noindex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  titreComplet = false,
  langues,
  ogLocale,
}: CreateMetadataInput): Metadata => {
  const url = absoluteUrl(path);
  const ogImage = image
    ? { url: image, width: 1200, height: 630, alt: title }
    : defaultOgImage;

  // `x-default` désigne la version française, langue principale du site.
  const versions = langues ?? versionsDe(path);
  const localeOg = ogLocale ?? ogLocaleParLangue[analyserChemin(path).langue];
  const versionFrancaise = versions.fr ? absoluteUrl(versions.fr) : url;
  const languages: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(versions)
        .filter((entree): entree is [string, string] => typeof entree[1] === 'string')
        .map(([langue, chemin]) => [langue, absoluteUrl(chemin)]),
    ),
    'x-default': versionFrancaise,
  };

  return {
    title: titreComplet ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages,
    },
    robots:
      noindex || !isIndexable
        ? { index: false, follow: false, nocache: true }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: localeOg,
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
};
