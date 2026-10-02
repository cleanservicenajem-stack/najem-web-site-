/**
 * Stockage du contenu modifié depuis l'administration (table Supabase
 * `contenu_site`, voir /supabase/schema.sql).
 *
 * C'est le seul fichier du projet qui sait où le contenu est rangé : tout le
 * reste passe par `lib/content.ts`. Changer de base de données ne demanderait
 * que de réécrire `lireContenu` et `ecrireContenu`.
 *
 * Deux clés distinctes sont utilisées, et jamais côté navigateur :
 * — la clé publique pour lire, car le contenu est de toute façon affiché ;
 * — la clé secrète pour écrire, car la table n'autorise aucune écriture par
 *   la clé publique (voir les politiques RLS du script SQL).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const TABLE = 'contenu_site';

const url = process.env.SUPABASE_URL;
const clePublique = process.env.SUPABASE_ANON_KEY;
const cleSecrete = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Le site doit rester affichable tant que Supabase n'est pas branché. */
export const stockageConfigure = (): boolean => Boolean(url && clePublique);

/** L'administration ne peut enregistrer que si la clé secrète est fournie. */
export const ecritureConfiguree = (): boolean => Boolean(url && cleSecrete);

const clientSansSession = (cle: string): SupabaseClient =>
  createClient(url as string, cle, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

let lecteur: SupabaseClient | null = null;
let redacteur: SupabaseClient | null = null;

const clientLecture = (): SupabaseClient => {
  lecteur ??= clientSansSession(clePublique as string);
  return lecteur;
};

const clientEcriture = (): SupabaseClient => {
  redacteur ??= clientSansSession(cleSecrete as string);
  return redacteur;
};

export type ContenuEnregistre = Record<string, string>;

export const lireContenu = async (): Promise<ContenuEnregistre> => {
  if (!stockageConfigure()) return {};

  const { data, error } = await clientLecture().from(TABLE).select('cle, valeur');

  if (error) {
    // Une base injoignable ne doit jamais faire tomber le site public :
    // on retombe sur les valeurs du code.
    console.error('[admin] Lecture du contenu impossible, repli sur les valeurs par défaut :', error.message);
    return {};
  }

  const valeurs: ContenuEnregistre = {};
  for (const ligne of data ?? []) {
    if (typeof ligne.cle === 'string' && typeof ligne.valeur === 'string') {
      valeurs[ligne.cle] = ligne.valeur;
    }
  }
  return valeurs;
};

/**
 * Enregistre les champs d'un groupe. Les clés absentes de `valeurs` sont
 * supprimées : « vider un champ » doit faire revenir la valeur par défaut, pas
 * laisser une chaîne vide en base.
 */
export const ecrireGroupe = async (
  clesDuGroupe: string[],
  valeurs: ContenuEnregistre,
): Promise<void> => {
  if (!ecritureConfiguree()) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY absente : enregistrement impossible.');
  }

  const client = clientEcriture();
  const aEnregistrer = Object.entries(valeurs).map(([cle, valeur]) => ({ cle, valeur }));
  const aSupprimer = clesDuGroupe.filter((cle) => !(cle in valeurs));

  if (aEnregistrer.length > 0) {
    const { error } = await client.from(TABLE).upsert(aEnregistrer, { onConflict: 'cle' });
    if (error) throw new Error(error.message);
  }

  if (aSupprimer.length > 0) {
    const { error } = await client.from(TABLE).delete().in('cle', aSupprimer);
    if (error) throw new Error(error.message);
  }
};
