import type { MetadataRoute } from 'next';
import { cheminEn, estTraduit, languesTraduites } from '@/config/i18n';
import { enabledServices } from '@/config/services';
import { absoluteUrl } from '@/config/site';
import { publishedPosts } from '@/lib/blog';

/**
 * Sitemap dynamique.
 * N'y figurent que des URLs indexables : les brouillons du blog et les
 * prestations désactivées en sont automatiquement exclus.
 *
 * Chaque page traduite figure dans ses trois langues (/…, /ar/…, /en/…), et
 * chaque version déclare les deux autres.
 */
type Entree = Omit<MetadataRoute.Sitemap[number], 'url' | 'lastModified'> & { chemin: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pagesFrancaises: Entree[] = [
    { chemin: '/', changeFrequency: 'weekly', priority: 1 },
    { chemin: '/services', changeFrequency: 'monthly', priority: 0.9 },
    { chemin: '/tarifs', changeFrequency: 'monthly', priority: 0.9 },
    { chemin: '/femme-de-menage-casablanca', changeFrequency: 'monthly', priority: 0.9 },
    { chemin: '/nettoyage-canape-tapis-casablanca', changeFrequency: 'monthly', priority: 0.8 },
    { chemin: '/application', changeFrequency: 'monthly', priority: 0.9 },
    { chemin: '/a-propos', changeFrequency: 'yearly', priority: 0.6 },
    { chemin: '/faq', changeFrequency: 'monthly', priority: 0.7 },
    { chemin: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    ...enabledServices.map(
      (service): Entree => ({
        chemin: `/services/${service.slug}`,
        changeFrequency: 'monthly',
        priority: 0.8,
      }),
    ),
    { chemin: '/blog', changeFrequency: 'weekly', priority: 0.6 },
    { chemin: '/mentions-legales', changeFrequency: 'yearly', priority: 0.2 },
    { chemin: '/confidentialite', changeFrequency: 'yearly', priority: 0.2 },
    { chemin: '/conditions-utilisation', changeFrequency: 'yearly', priority: 0.2 },
    { chemin: '/cookies', changeFrequency: 'yearly', priority: 0.2 },
  ];

  const entrees: MetadataRoute.Sitemap = pagesFrancaises.flatMap(({ chemin, ...reste }) => {
    if (!estTraduit(chemin)) {
      return [{ ...reste, url: absoluteUrl(chemin), lastModified: now }];
    }

    const alternates = {
      languages: {
        fr: absoluteUrl(chemin),
        ar: absoluteUrl(cheminEn('ar', chemin)),
        en: absoluteUrl(cheminEn('en', chemin)),
      },
    };
    // Les versions traduites passent après l'original français.
    const prioriteTraduite = Math.round(Math.max(0.3, (reste.priority ?? 0.5) - 0.2) * 10) / 10;

    return [
      { ...reste, url: absoluteUrl(chemin), lastModified: now, alternates },
      ...languesTraduites.map((langue) => ({
        ...reste,
        priority: prioriteTraduite,
        url: absoluteUrl(cheminEn(langue, chemin)),
        lastModified: now,
        alternates,
      })),
    ];
  });

  const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.dateModified ?? post.datePublished),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...entrees, ...postEntries];
}
