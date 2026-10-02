import { blogCategories, blogPosts } from '@/content/blog/posts';
import type { BlogPost } from '@/content/blog/types';
import { slugify } from '@/lib/utils';

export const allPosts = [...blogPosts].sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished),
);

/** Articles réellement publiés : seuls ceux-là sont indexables et dans le sitemap. */
export const publishedPosts = allPosts.filter((post) => post.status === 'publie');

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  allPosts.find((post) => post.slug === slug);

export const getCategory = (slug: string) => blogCategories.find((c) => c.slug === slug);

export const getRelatedPosts = (post: BlogPost): BlogPost[] =>
  post.related
    .map((slug) => getPostBySlug(slug))
    .filter((related): related is BlogPost => Boolean(related) && related!.slug !== post.slug)
    .slice(0, 2);

/** Sommaire construit à partir des titres de niveau 2. */
export const getTableOfContents = (post: BlogPost): { id: string; label: string }[] =>
  post.blocks
    .filter((block): block is { type: 'h2'; text: string } => block.type === 'h2')
    .map((block) => ({ id: slugify(block.text), label: block.text }));
