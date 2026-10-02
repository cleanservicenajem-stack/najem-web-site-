import type { Metadata } from 'next';
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
}: CreateMetadataInput): Metadata => {
  const url = absoluteUrl(path);
  const ogImage = image
    ? { url: image, width: 1200, height: 630, alt: title }
    : defaultOgImage;

  return {
    title: titreComplet ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        'fr-FR': url,
        'x-default': url,
      },
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
      locale: siteConfig.locale.ogLocale,
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
