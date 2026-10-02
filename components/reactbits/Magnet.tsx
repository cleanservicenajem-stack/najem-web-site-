'use client';

/**
 * Base : React Bits — « Magnet » (registre officiel reactbits.dev).
 * Adaptations Najem Clean Service :
 *  - attraction fortement réduite (force 2 → 6, rayon 100 → 60px) : le bouton
 *    accompagne le curseur sans « fuir » ;
 *  - réécriture sans état React : la position est appliquée directement sur le
 *    nœud DOM, ce qui supprime tout re-rendu pendant le déplacement du curseur ;
 *  - désactivation automatique sur pointeur grossier et en mouvement réduit ;
 *  - `display: inline-flex` pour ne pas casser l'alignement des CTA.
 */

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';


type MagnetProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Zone d'attraction autour du bouton, en pixels. */
  padding?: number;
  disabled?: boolean;
  /** Plus la valeur est élevée, plus le déplacement est discret. */
  magnetStrength?: number;
  wrapperClassName?: string;
  innerClassName?: string;
};

export default function Magnet({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 6,
  wrapperClassName,
  innerClassName,
  ...props
}: MagnetProps) {
  const reduceMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || reduceMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    let active = false;

    const apply = (x: number, y: number, isActive: boolean) => {
      inner.style.transition = isActive ? 'transform 0.25s ease-out' : 'transform 0.45s ease-out';
      inner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMouseMove = (event: MouseEvent) => {
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const withinX = Math.abs(centerX - event.clientX) < width / 2 + padding;
      const withinY = Math.abs(centerY - event.clientY) < height / 2 + padding;

      if (withinX && withinY) {
        active = true;
        apply(
          (event.clientX - centerX) / magnetStrength,
          (event.clientY - centerY) / magnetStrength,
          true,
        );
      } else if (active) {
        active = false;
        apply(0, 0, false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      inner.style.transform = '';
    };
  }, [disabled, magnetStrength, padding, reduceMotion]);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-flex' }}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{ display: 'inline-flex', willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
}
