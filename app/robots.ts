import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/config/site';

const isIndexable =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true' || process.env.NODE_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  };
}
