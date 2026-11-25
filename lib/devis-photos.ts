import 'server-only';
import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PHOTOS_CONSERVATION_JOURS } from '@/lib/devis-config';

/**
 * Photos jointes aux demandes de devis : espace de stockage privé
 * `devis-photos` (voir /supabase/schema.sql), accessible au serveur seulement.
 * Les noms sont aléatoires et la liste n'est jamais exposée.
 */

const ESPACE = 'devis-photos';

/** Au-delà, plus aucun dépôt : garde-fou contre un remplissage abusif. */
const FICHIERS_MAX = 800;

export const NOM_PHOTO = /^[a-f0-9]{32}\.jpg$/;

const url = process.env.SUPABASE_URL;
const cleSecrete = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

const espace = () => {
  if (!url || !cleSecrete) return null;
  client ??= createClient(url, cleSecrete, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client.storage.from(ESPACE);
};

const lister = async () => {
  const stockage = espace();
  if (!stockage) throw new Error('Stockage des photos non configuré.');
  const { data, error } = await stockage.list('', {
    limit: 1000,
    sortBy: { column: 'created_at', order: 'asc' },
  });
  if (error) throw new Error(error.message);
  return data ?? [];
};

/** Supprime les photos plus anciennes que le délai de conservation. */
export const supprimerPhotosExpirees = async (): Promise<number> => {
  const limite = Date.now() - PHOTOS_CONSERVATION_JOURS * 24 * 60 * 60 * 1000;
  const noms = (await lister())
    .filter((fichier) => fichier.created_at && Date.parse(fichier.created_at) < limite)
    .map((fichier) => fichier.name);
  if (noms.length === 0) return 0;

  const { error } = await espace()!.remove(noms);
  if (error) throw new Error(error.message);
  return noms.length;
};

/** Enregistre une photo JPEG et renvoie son nom. */
export const enregistrerPhoto = async (contenu: ArrayBuffer): Promise<string> => {
  if ((await lister()).length >= FICHIERS_MAX) throw new Error('Espace des photos plein.');

  const nom = `${randomUUID().replaceAll('-', '')}.jpg`;
  const { error } = await espace()!.upload(nom, contenu, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return nom;
};

export const lirePhoto = async (nom: string): Promise<Blob | null> => {
  const stockage = espace();
  if (!stockage || !NOM_PHOTO.test(nom)) return null;
  const { data, error } = await stockage.download(nom);
  return error ? null : data;
};
