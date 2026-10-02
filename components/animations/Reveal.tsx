'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_OUT, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance de translation. 0 = simple fondu. */
  y?: number;
  x?: number;
  duration?: number;
};

/**
 * Révélation au scroll. Si l'utilisateur a demandé une réduction des
 * animations, le contenu est rendu immédiatement, sans transformation.
 */
export function Reveal({ children, className, delay = 0, y = 18, x = 0, duration = 0.65 }: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-reveal=""
      className={cn(className)}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
