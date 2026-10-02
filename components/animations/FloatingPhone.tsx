'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

type FloatingPhoneProps = {
  children: ReactNode;
  className?: string;
  /** Amplitude verticale en pixels. Volontairement faible. */
  amplitude?: number;
  duration?: number;
  delay?: number;
};

/**
 * Flottement continu très léger (transform uniquement, aucun layout shift).
 * Désactivé si l'utilisateur réduit les animations.
 */
export function FloatingPhone({
  children,
  className,
  amplitude = 10,
  duration = 7,
  delay = 0,
}: FloatingPhoneProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
