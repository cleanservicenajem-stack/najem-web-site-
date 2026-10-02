'use client';

import { motion } from 'motion/react';
import type { ElementType, ReactNode } from 'react';
import { EASE_OUT, staggerParent, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

type Tag = 'div' | 'ul' | 'ol' | 'li' | 'section';

const motionTags: Record<Tag, ElementType> = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  section: motion.section,
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  as?: Tag;
};

/** Conteneur qui décale l'apparition de ses `StaggerItem` enfants. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  as = 'div',
}: StaggerProps) {
  const reduceMotion = usePrefersReducedMotion();
  const Plain = as as ElementType;

  if (reduceMotion) {
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motionTags[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={staggerParent(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Component>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: Tag;
};

export function StaggerItem({ children, className, y = 16, as = 'div' }: StaggerItemProps) {
  const reduceMotion = usePrefersReducedMotion();
  const Plain = as as ElementType;

  if (reduceMotion) {
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motionTags[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
      }}
    >
      {children}
    </Component>
  );
}
