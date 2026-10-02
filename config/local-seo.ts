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
 * Fragment de zone géographique réutilisé dans les titres et descriptions.
 * Retourne une chaîne vide tant qu'aucune ville n'est confirmée, ce qui évite
 * d'annoncer une couverture qui n'a pas été validée.
 */
export const serviceAreaSuffix = (): string => {
  const areas = siteConfig.serviceAreas;
  if (areas.length === 0) return '';
  if (areas.length === 1) return ` à ${areas[0]!.name}`;
  if (areas.length <= 3) return ` à ${areas.map((a) => a.name).join(', ')}`;
  return ` à ${areas
    .slice(0, 2)
    .map((a) => a.name)
    .join(', ')} et alentours`;
};
