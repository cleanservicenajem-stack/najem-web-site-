import type { Transition, Variants } from 'motion/react';

/** Courbe d'accélération unique du site : sortie douce, jamais rebondissante. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const transition = (duration = 0.6, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_OUT,
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: transition(0.65) },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition(0.7) },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: transition(0.65) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: transition(0.7) },
};

export const staggerParent = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Marge d'entrée dans le viewport, commune à toutes les révélations au scroll. */
export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' } as const;
