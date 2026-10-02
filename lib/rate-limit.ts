/**
 * Limitation de débit en mémoire.
 *
 * Suffisant pour un formulaire de contact sur une instance unique. En cas de
 * déploiement multi-instances, remplacer l'implémentation par un stockage
 * partagé (Redis, Upstash, KV) en conservant la même signature.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Nettoyage opportuniste pour éviter que la Map ne grossisse indéfiniment. */
const sweep = (now: number) => {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export const rateLimit = (
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 } = {},
): RateLimitResult => {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
};
