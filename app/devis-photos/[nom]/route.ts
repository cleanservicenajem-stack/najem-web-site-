import { lirePhoto } from '@/lib/devis-photos';

/** Affiche une photo à partir du lien reçu dans le message de demande. */
export async function GET(_requete: Request, { params }: { params: Promise<{ nom: string }> }) {
  const { nom } = await params;
  const photo = await lirePhoto(nom);
  if (!photo) return new Response('Photo introuvable ou supprimée.', { status: 404 });

  return new Response(photo, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'inline',
      'Cache-Control': 'private, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
