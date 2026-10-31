import type { Langue } from '@/config/i18n';
import { cn } from '@/lib/utils';

/**
 * Petit drapeau de langue : France pour le français, Maroc pour l'arabe,
 * Royaume-Uni pour l'anglais.
 *
 * Dessiné en SVG plutôt qu'en émoji : Windows n'affiche pas les émojis de
 * drapeaux (il montre « FR », « MA », « GB » à la place). Purement décoratif :
 * le nom de la langue est toujours donné à côté ou en libellé accessible.
 */
export function Drapeau({ langue, className }: { langue: Langue; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-[0.875rem] w-5 shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(6,36,66,0.14)]',
        className,
      )}
    >
      {langue === 'fr' ? <France /> : langue === 'ar' ? <Maroc /> : <RoyaumeUni />}
    </span>
  );
}

const svg = 'block h-full w-full';

function France() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" className={svg} focusable="false">
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  );
}

function Maroc() {
  // Étoile verte à cinq branches, tracée en contour, sur fond rouge.
  return (
    <svg viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice" className={svg} focusable="false">
      <rect width="900" height="600" fill="#C1272D" />
      <path
        d="M450 190 L514.7 389.1 L345.4 266 L554.6 266 L385.3 389.1 Z"
        fill="none"
        stroke="#006233"
        strokeWidth="34"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function RoyaumeUni() {
  // Version simplifiée de l'Union Jack, lisible à petite taille.
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className={svg} focusable="false">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0 V30 M0 15 H60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
