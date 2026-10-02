'use client';

/**
 * Base : React Bits — « BlurText » (registre officiel reactbits.dev).
 * Adaptations Najem Clean Service :
 *  - directive `use client` et rendu polymorphe (h1/h2/p/span) pour conserver
 *    une structure de titres correcte ;
 *  - respect de `prefers-reduced-motion` (rendu instantané, sans flou) ;
 *  - timings ralentis et flou réduit (10px → 6px) pour rester sobre ;
 *  - suppression de la classe utilitaire d'origine au profit du design system.
 */

import { motion, type Easing, type Transition } from 'motion/react';
import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import { EASE_OUT } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

type BlurTextProps = {
  text: string;
  className?: string;
  /** Délai entre deux segments, en millisecondes. */
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  as?: Extract<ElementType, 'h1' | 'h2' | 'h3' | 'p' | 'span'>;
  threshold?: number;
  rootMargin?: string;
  stepDuration?: number;
  onAnimationComplete?: () => void;
};

export default function BlurText({
  text,
  className = '',
  delay = 70,
  animateBy = 'words',
  direction = 'bottom',
  as = 'p',
  threshold = 0.15,
  rootMargin = '0px',
  stepDuration = 0.42,
  onAnimationComplete,
}: BlurTextProps) {
  const Tag = as;
  const reduceMotion = usePrefersReducedMotion();
  const segments = useMemo(
    () => (animateBy === 'words' ? text.split(' ') : Array.from(text)),
    [animateBy, text],
  );
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const from = useMemo(
    () => ({ filter: 'blur(6px)', opacity: 0, y: direction === 'top' ? -14 : 14 }),
    [direction],
  );

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const easing: Easing = EASE_OUT;

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className}>
      {segments.map((segment, index) => {
        const spanTransition: Transition = {
          duration: stepDuration * 2,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={`${segment}-${index}`}
            data-reveal=""
            initial={from}
            animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : from}
            transition={spanTransition}
            onAnimationComplete={
              index === segments.length - 1 ? onAnimationComplete : undefined
            }
            style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < segments.length - 1 ? '\u00A0' : null}
          </motion.span>
        );
      })}
    </Tag>
  );
}
