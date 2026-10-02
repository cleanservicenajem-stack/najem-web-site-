'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Décalage total en pixels sur la traversée complète du viewport. */
  distance?: number;
};

/** Parallaxe très léger : quelques dizaines de pixels au maximum. */
export function Parallax({ children, className, distance = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y, willChange: 'transform' }}>
      {children}
    </motion.div>
  );
}
