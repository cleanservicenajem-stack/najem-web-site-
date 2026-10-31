import { siteConfig, type ServiceArea } from '@/config/site';

/**
 * SEO local — garde-fou volontaire.
 *
 * Aucune page « Nettoyage <ville> » n'est générée tant que deux conditions ne
 * sont pas réunies :
 *   1. `siteConfig.serviceAreas` contient des villes réellement desservies ;
 *   2. `localPagesEnabled` est passé à `true` après validation du contenu.
 *
 * Objectif : éviter les doorway pages, qui sont une violation explicite des
 * consignes Google sur le spam.
 */
export const localPagesEnabled = false;

export const hasServiceAreas = siteConfig.serviceAreas.length > 0;

export const shouldRenderLocalPages = localPagesEnabled && hasServiceAreas;

export const getServiceAreas = (): readonly ServiceArea[] =>
  shouldRenderLocalPages ? siteConfig.serviceAreas : [];

/**
 * Fragment de zone géographique réutilisé dans les textes : « à Casablanca »,
 * ou « à Casablanca et ses alentours » quand d'autres villes sont desservies.
 * Retourne une chaîne vide tant qu'aucune ville n'est confirmée, ce qui évite
 * d'annoncer une couverture qui n'a pas été validée.
 */
export const serviceAreaSuffix = (): string => {
  const [principale, ...autres] = siteConfig.serviceAreas;
  if (!principale) return '';
  return autres.length === 0 ? ` à ${principale.name}` : ` à ${principale.name} et ses alentours`;
};

/** « A, B et C ». */
const listeFr = (elements: string[]): string =>
  elements.length <= 1
    ? (elements[0] ?? '')
    : `${elements.slice(0, -1).join(', ')} et ${elements[elements.length - 1]}`;

/**
 * Villes desservies autour de Casablanca, en toutes lettres : « Bouskoura,
 * Dar Bouazza, Aïn Harrouda et Tit Mellil ». Vide s'il n'y en a pas.
 */
export const alentoursTexte = (): string =>
  listeFr(siteConfig.serviceAreas.slice(1).map((area) => area.name));
