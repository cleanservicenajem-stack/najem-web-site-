'use client';

/**
 * Base : React Bits — « ShinyText » (registre officiel reactbits.dev).
 * Adaptations Najem Clean Service :
 *  - version allégée : les options yoyo / direction / pause au survol, inutiles
 *    ici, ont été retirées ;
 *  - couleurs par défaut alignées sur la charte (cyan sur bleu profond) ;
 *  - cycle ralenti (2s → 5s) avec temporisation, pour un reflet occasionnel
 *    plutôt qu'un scintillement permanent ;
 *  - rendu statique si `prefers-reduced-motion` est actif.
 */

import { motion, useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

type ShinyTextProps = {
  text: string;
  className?: string;
  /** Durée d'un passage de reflet, en secondes. */
  speed?: number;
  /** Pause entre deux passages, en secondes. */
  delay?: number;
  color?: string;
  shineColor?: string;
  spread?: number;
};

export default function ShinyText({
  text,
  className = '',
  speed = 5,
  delay = 3.5,
  color = 'rgba(176, 219, 255, 0.85)',
  shineColor = '#ffffff',
  spread = 110,
}: ShinyTextProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = useMotionValue(0);
  const elapsed = useRef(0);
  const lastTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (reduceMotion) return;
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }
    elapsed.current += time - lastTime.current;
    lastTime.current = time;

    const cycle = (speed + delay) * 1000;
    const position = elapsed.current % cycle;
    progress.set(position < speed * 1000 ? (position / (speed * 1000)) * 100 : 100);
  });

  const backgroundPosition = useTransform(progress, (value) => `${150 - value * 2}% center`);

  if (reduceMotion) {
    return <span className={className} style={{ color }}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 38%, ${shineColor} 50%, ${color} 62%, ${color} 100%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundPosition,
      }}
    >
      {text}
    </motion.span>
  );
}
