'use client';

/**
 * Base : React Bits — « SpotlightCard » (registre officiel reactbits.dev).
 * Adaptations Najem Clean Service :
 *  - carte claire (fond blanc, filet `--border`, rayon du design system) au
 *    lieu du thème sombre d'origine ;
 *  - halo bleu de marque, opacité abaissée de 0.6 à 0.35 pour rester discret ;
 *  - effet neutralisé sur pointeur grossier (tactile) et en mouvement réduit ;
 *  - le halo n'est plus rendu tant que la souris n'est pas entrée dans la carte.
 */

import { useRef, useState, type PropsWithChildren, type MouseEventHandler } from 'react';

import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks';

type SpotlightCardProps = PropsWithChildren<{
  className?: string;
  /** Couleur du halo. Par défaut : bleu de marque très dilué. */
  spotlightColor?: string;
  intensity?: number;
}>;

export default function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(23, 168, 238, 0.22)',
  intensity = 0.35,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    const rect = node.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reduceMotion && setOpacity(intensity)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-[var(--border)] bg-surface',
        className,
      )}
    >
      {opacity > 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            opacity,
            background: `radial-gradient(420px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
