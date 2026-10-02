'use client';

import { useSyncExternalStore } from 'react';

import { getThemeSnapshot, subscribeToTheme, type ResolvedTheme } from '@/lib/theme';

const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

/**
 * Indique si la page a dépassé un seuil de défilement.
 * `useSyncExternalStore` évite un état local et ne redéclenche un rendu que
 * lorsque le booléen change réellement.
 */
export const useScrolledPast = (threshold: number): boolean =>
  useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * Préférence « mouvement réduit » du système.
 *
 * Contrairement au hook de la librairie d'animation, la valeur du premier
 * rendu client est identique à celle du serveur (`false`) : le HTML hydraté
 * correspond, et la préférence n'est appliquée qu'ensuite. Sans cela, React
 * abandonne l'hydratation et des sections entières restent invisibles.
 * Un garde-fou CSS (`globals.css`) couvre le court instant avant hydratation.
 */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

/**
 * Thème actuellement affiché.
 *
 * Le rendu serveur ne peut pas connaître la préférence du visiteur : il
 * renvoie toujours `light`, puis React ré-évalue après hydratation. Toutes les
 * bascules de la page partagent le même abonnement et restent donc synchrones.
 */
export const useTheme = (): ResolvedTheme =>
  useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'light');

/** Lecture sûre du stockage de session (peut être bloqué par le navigateur). */
export const readSessionFlag = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
};

export const writeSessionFlag = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {
    /* stockage indisponible : le rappel réapparaîtra, sans conséquence */
  }
};
