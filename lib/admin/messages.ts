/**
 * Messages reçus par le formulaire de contact (table `messages_contact`).
 *
 * Ces lignes contiennent des données personnelles. Trois précautions sont
 * prises ici, et aucune n'est négociable :
 *
 * — la table n'a aucune politique RLS, donc la clé publique n'y accède pas,
 *   même en lecture ; tout passe par la clé secrète, côté serveur uniquement ;
 * — l'adresse IP de l'émetteur n'est pas conservée : elle ne sert qu'à limiter
 *   le débit, en mémoire, le temps de la requête ;
 * — les messages de plus de douze mois sont supprimés, conformément à ce qui
 *   est annoncé dans la politique de confidentialité.
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const TABLE = 'messages_contact';

const url = process.env.SUPABASE_URL;
const cleSecrete = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const messagerieConfiguree = (): boolean => Boolean(url && cleSecrete);

let client: SupabaseClient | null = null;

const connexion = (): SupabaseClient => {
  client ??= createClient(url as string, cleSecrete as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
};

export type MessageContact = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  objet: string;
  message: string;
  lu: boolean;
  recuLe: string;
};

type LigneMessage = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  objet: string;
  message: string;
  lu: boolean;
  recu_le: string;
};

const versMessage = (ligne: LigneMessage): MessageContact => ({
  id: ligne.id,
  prenom: ligne.prenom,
  nom: ligne.nom,
  email: ligne.email,
  telephone: ligne.telephone,
  objet: ligne.objet,
  message: ligne.message,
  lu: ligne.lu,
  recuLe: ligne.recu_le,
});

/**
 * Supprime les messages au-delà de la durée de conservation annoncée.
 *
 * Appelée à la réception d'un message et à l'ouverture de la liste : c'est
 * suffisant sans dépendre d'une extension de la base. L'échec est volontairement
 * silencieux, pour ne jamais faire perdre un message à un visiteur.
 */
const purger = async (): Promise<void> => {
  const { error } = await connexion().rpc('purger_messages_expires');
  if (error) console.error('[messages] Purge impossible :', error.message);
};

export const enregistrerMessage = async (entree: {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  objet: string;
  message: string;
}): Promise<boolean> => {
  if (!messagerieConfiguree()) return false;

  const { error } = await connexion()
    .from(TABLE)
    .insert({
      prenom: entree.prenom,
      nom: entree.nom,
      email: entree.email,
      telephone: entree.telephone ?? null,
      objet: entree.objet,
      message: entree.message,
    });

  if (error) {
    console.error('[messages] Enregistrement impossible :', error.message);
    return false;
  }

  await purger();
  return true;
};

export const listerMessages = async (): Promise<MessageContact[]> => {
  if (!messagerieConfiguree()) return [];

  await purger();

  const { data, error } = await connexion()
    .from(TABLE)
    .select('id, prenom, nom, email, telephone, objet, message, lu, recu_le')
    .order('recu_le', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[messages] Lecture impossible :', error.message);
    return [];
  }

  return (data as LigneMessage[] | null)?.map(versMessage) ?? [];
};

/** Pastille de la barre latérale. La purge n'est pas déclenchée ici : la page
 *  des messages s'en charge, et ce compteur est appelé sur tous les écrans. */
export const compterNonLus = async (): Promise<number> => {
  if (!messagerieConfiguree()) return 0;

  const { count, error } = await connexion()
    .from(TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('lu', false);

  if (error) {
    console.error('[messages] Comptage impossible :', error.message);
    return 0;
  }
  return count ?? 0;
};

export const marquerLu = async (id: string, lu: boolean): Promise<void> => {
  if (!messagerieConfiguree()) return;
  const { error } = await connexion().from(TABLE).update({ lu }).eq('id', id);
  if (error) throw new Error(error.message);
};

export const supprimerMessage = async (id: string): Promise<void> => {
  if (!messagerieConfiguree()) return;
  const { error } = await connexion().from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
};
