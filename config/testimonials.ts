/**
 * Témoignages clients.
 *
 * Le tableau est volontairement vide : aucun avis n'est inventé. Tant qu'il
 * l'est, la section n'est pas rendue et aucune donnée structurée `Review` ou
 * `aggregateRating` n'est émise.
 *
 * Pour activer la section, ajouter des témoignages réels et vérifiables.
 */

export type Testimonial = {
  id: string;
  /** Nom tel que le client accepte qu'il soit publié. */
  author: string;
  /** Ville ou contexte, optionnel. */
  context?: string;
  quote: string;
  /** Date de recueil au format ISO (YYYY-MM-DD). */
  collectedAt: string;
  /** Prestation concernée, si connue (slug de `config/services.ts`). */
  serviceSlug?: string;
};

export const testimonials: Testimonial[] = [];

export const hasTestimonials = testimonials.length > 0;
