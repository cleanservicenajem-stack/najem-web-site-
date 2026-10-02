'use client';

import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';
import BlurText from '@/components/reactbits/BlurText';
import Magnet from '@/components/reactbits/Magnet';
import { FloatingPhone } from '@/components/animations/FloatingPhone';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { Pill } from '@/components/ui/Pill';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { EASE_OUT } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

/** Arcs concentriques repris du swoosh du logo. */
function HeroArcs() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 720"
      className="absolute inset-x-0 top-0 h-full w-full text-brand-400/25"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-120 620C220 380 620 300 1020 360c220 33 380 110 560 220" />
        <path d="M-120 690C240 430 660 350 1080 415c210 32 360 105 520 205" opacity="0.7" />
        <path d="M-80 540C260 320 640 250 1010 300c240 32 400 110 590 230" opacity="0.45" />
      </g>
    </svg>
  );
}

/** Petites bulles : trois éléments seulement, très lents. */
function Bubbles() {
  const reduceMotion = usePrefersReducedMotion();
  const bubbles = [
    { size: 10, left: '4%', top: '26%', delay: 0, duration: 11 },
    { size: 6, left: '78%', top: '16%', delay: 1.6, duration: 13 },
    { size: 14, left: '88%', top: '70%', delay: 0.8, duration: 15 },
  ];

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {bubbles.map((bubble) => (
        <motion.span
          key={bubble.left}
          className="absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(35,196,232,0.35))] ring-1 ring-cyan-brand/25"
          style={{ width: bubble.size, height: bubble.size, left: bubble.left, top: bubble.top }}
          animate={{ y: [0, -26, 0], opacity: [0.4, 0.85, 0.4] }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

type HeroProps = {
  /** Textes pilotés depuis l'administration du site. */
  badge: string;
  titre: string;
  accroche: string;
};

export function Hero({ badge, titre, accroche }: HeroProps) {
  const reduceMotion = usePrefersReducedMotion();

  // Les cibles d'animation restent identiques quelle que soit la préférence :
  // seule la durée tombe à zéro. Retirer les props après l'hydratation
  // figerait les éléments sur leur style intermédiaire (opacité nulle).
  const fade = (delay: number) => ({
    'data-reveal': '',
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.7, delay, ease: EASE_OUT },
  });

  return (
    <section
      className="relative -mt-[var(--header-height)] overflow-hidden bg-[image:var(--gradient-brand-soft)] pb-16 pt-[calc(var(--header-height)+2.5rem)] md:pb-24 md:pt-[calc(var(--header-height)+4rem)]"
      aria-labelledby="hero-titre"
    >
      <HeroArcs />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.18),transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="dot-veil absolute -bottom-10 left-0 h-72 w-72 opacity-60"
      />
      <Bubbles />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="max-w-2xl">
            <motion.div {...fade(0.05)}>
              <Pill>{badge}</Pill>
            </motion.div>

            <BlurText
              as="h1"
              text={titre}
              delay={55}
              className="mt-6 font-display text-[clamp(2.15rem,1.2rem+4vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-navy-900"
            />

            <motion.p
              {...fade(0.45)}
              className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft md:text-[1.15rem]"
            >
              {accroche}
            </motion.p>

            <motion.div {...fade(0.58)} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnet>
                <Button href="/application" size="lg">
                  Télécharger l’application
                </Button>
              </Magnet>
              <Button
                href="#services"
                variant="secondary"
                size="lg"
                icon={<ArrowDown className="h-4 w-4" aria-hidden="true" />}
              >
                Découvrir nos services
              </Button>
            </motion.div>

            <motion.div {...fade(0.7)} className="mt-10">
              <StoreButtons />
              <p className="mt-4 flex items-center gap-2 text-[0.85rem] text-ink-soft">
                <Sparkles className="h-4 w-4 text-teal-brand" aria-hidden="true" />
                Application disponible sur iPhone et Android.
              </p>
            </motion.div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {/* Panneau en forme de goutte, dérivé de la silhouette du logo */}
            <div
              aria-hidden="true"
              className="droplet-mask absolute right-2 top-1/2 h-[26rem] w-[23rem] -translate-y-1/2 rotate-6 bg-[linear-gradient(150deg,#0a6fcf_0%,#17a8ee_45%,#21c3b6_100%)] opacity-[0.14] md:h-[34rem] md:w-[30rem] lg:right-6"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.35),transparent_70%)] blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 30, scale: reduceMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.25, ease: EASE_OUT }
              }
              className="relative"
            >
              <FloatingPhone amplitude={9} duration={8}>
                <PhoneFrame
                  src="/images/app/app-screen-1.png"
                  alt="Écran d’accueil de l’application Najem Clean Service"
                  width={286}
                  priority
                  sizes="(max-width: 768px) 62vw, 286px"
                  className="mx-auto"
                />
              </FloatingPhone>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
