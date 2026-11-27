import { NextResponse, type NextRequest } from 'next/server';
import { PHOTO_POIDS_MAX } from '@/lib/devis-config';
import { enregistrerPhoto, LimiteDepot } from '@/lib/devis-photos';
import { rateLimit } from '@/lib/rate-limit';

/** Marge pour l'enveloppe du formulaire autour de la photo. */
const ENVELOPPE_MAX = 50 * 1024;

const hoteDe = (adresse: string): string | null => {
  try {
    return new URL(adresse).host;
  } catch {
    return null;
  }
};

/** Dépôt d'une photo jointe à une demande de devis (une photo par appel). */
export async function POST(requete: NextRequest) {
  // Seul le formulaire du site peut déposer : l'origine doit être la nôtre.
  const origine = requete.headers.get('origin');
  const hote = requete.headers.get('x-forwarded-host') ?? requete.headers.get('host');
  if (!origine || !hote || hoteDe(origine) !== hote) {
    return NextResponse.json({ erreur: 'Demande refusée.' }, { status: 403 });
  }

  const ip = requete.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
  if (!rateLimit(`devis-photo:${ip}`, { limit: 15, windowMs: 10 * 60 * 1000 }).success) {
    return NextResponse.json({ erreur: 'Trop de photos envoyées.' }, { status: 429 });
  }

  // Une requête trop lourde est écartée avant d'être lue.
  if (Number(requete.headers.get('content-length') ?? 0) > PHOTO_POIDS_MAX + ENVELOPPE_MAX) {
    return NextResponse.json({ erreur: 'Photo absente ou trop lourde.' }, { status: 413 });
  }

  const donnees = await requete.formData().catch(() => null);
  const photo = donnees?.get('photo');
  if (!(photo instanceof Blob) || photo.size === 0 || photo.size > PHOTO_POIDS_MAX) {
    return NextResponse.json({ erreur: 'Photo absente ou trop lourde.' }, { status: 400 });
  }

  const contenu = await photo.arrayBuffer();
  const debut = new Uint8Array(contenu.slice(0, 3));
  if (debut[0] !== 0xff || debut[1] !== 0xd8 || debut[2] !== 0xff) {
    return NextResponse.json({ erreur: 'Format non pris en charge.' }, { status: 415 });
  }

  try {
    const nom = await enregistrerPhoto(contenu);
    return NextResponse.json({ chemin: `/devis-photos/${nom}` });
  } catch (erreur) {
    console.error('[devis] Photo non enregistrée :', erreur instanceof Error ? erreur.message : erreur);
    if (erreur instanceof LimiteDepot) {
      return NextResponse.json({ erreur: 'Trop de photos envoyées.' }, { status: 429 });
    }
    return NextResponse.json({ erreur: 'Enregistrement impossible.' }, { status: 503 });
  }
}
