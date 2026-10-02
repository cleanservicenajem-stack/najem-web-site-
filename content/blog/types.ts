export type BlogCategory = {
  slug: string;
  name: string;
  description: string;
};

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; title?: string; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description + résumé de la carte. */
  description: string;
  /** Réponse directe placée en tête d'article (utile SEO et GEO). */
  keyAnswer: string;
  category: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  readingMinutes: number;
  cover: { src: string; alt: string };
  /**
   * `brouillon` : contenu d'exemple non validé par l'entreprise.
   * Ces articles sont en `noindex`, exclus du sitemap et signalés dans l'UI.
   */
  status: 'brouillon' | 'publie';
  blocks: ContentBlock[];
  faq?: { question: string; answer: string }[];
  related: string[];
};
