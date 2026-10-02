'use client';

import { useEffect, useRef } from 'react';

/**
 * Curseur secondaire : un anneau fin qui suit le pointeur avec un léger retard
 * et s'élargit au survol des éléments interactifs.
 *
 * Garde-fous :
 *  - le curseur natif n'est jamais masqué ;
 *  - désactivé sur les pointeurs grossiers (tactile) et si `prefers-reduced-motion` ;
 *  - `pointer-events: none`, donc aucun impact sur les clics ou le clavier.
 */
export function CursorHalo() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let frame = 0;

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, summary';

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      targetOpacity = 1;
      const target = event.target as HTMLElement | null;
      targetScale = target?.closest(interactiveSelector) ? 1.9 : 1;
    };

    const onLeave = () => {
      targetOpacity = 0;
    };

    const render = () => {
      ringX += (pointerX - ringX) * 0.18;
      ringY += (pointerY - ringY) * 0.18;
      scale += (targetScale - scale) * 0.12;
      opacity += (targetOpacity - opacity) * 0.1;
      ring.style.transform = `translate3d(${ringX - 14}px, ${ringY - 14}px, 0) scale(${scale.toFixed(3)})`;
      ring.style.opacity = opacity.toFixed(3);
      frame = window.requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      // Rendu uniquement sur grand écran, et neutralisé en mouvement réduit.
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-7 w-7 rounded-full border border-brand-500/45 opacity-0 lg:block motion-reduce:lg:hidden"
      style={{ willChange: 'transform, opacity' }}
    />
  );
}
