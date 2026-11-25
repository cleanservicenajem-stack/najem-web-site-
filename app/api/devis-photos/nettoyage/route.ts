import { NextResponse } from 'next/server';
import { supprimerPhotosExpirees } from '@/lib/devis-photos';

/**
 * Appelée une fois par jour (voir vercel.json). Elle ne supprime que les photos
 * dont le délai de conservation est dépassé : l'appeler en plus est sans effet.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ supprimees: await supprimerPhotosExpirees() });
  } catch (erreur) {
    console.error('[devis] Nettoyage impossible :', erreur instanceof Error ? erreur.message : erreur);
    return NextResponse.json({ erreur: 'Nettoyage impossible.' }, { status: 503 });
  }
}
