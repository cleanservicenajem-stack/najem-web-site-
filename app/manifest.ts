import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — services de nettoyage à domicile`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#04448a',
    lang: 'fr',
    dir: 'ltr',
    categories: ['lifestyle', 'business'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
