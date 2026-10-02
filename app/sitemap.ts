import type { MetadataRoute } from 'next';
import { enabledServices } from '@/config/services';
import { absoluteUrl } from '@/config/site';
import { publishedPosts } from '@/lib/blog';

/**
 * Sitemap dynamique.
 * N'y figurent que des URLs indexables : les brouillons du blog et les
 * prestations désactivées en sont automatiquement exclus.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: Omit<MetadataRoute.Sitemap[number], 'lastModified'>[] = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/services'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/application'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/a-propos'), changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/faq'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.6 },
    { url: absoluteUrl('/blog'), changeFrequency: 'weekly', priority: 0.6 },
    { url: absoluteUrl('/mentions-legales'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/confidentialite'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/conditions-utilisation'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/cookies'), changeFrequency: 'yearly', priority: 0.2 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((entry) => ({
    ...entry,
    lastModified: now,
  }));

  const serviceEntries: MetadataRoute.Sitemap = enabledServices.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.dateModified ?? post.datePublished),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticEntries, ...serviceEntries, ...postEntries];
}
