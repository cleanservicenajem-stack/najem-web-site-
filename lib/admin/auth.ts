/**
 * Authentification de l'administration, adossée à Supabase Auth.
 *
 * Deux conditions doivent être réunies pour entrer :
 *
 * 1. une session Supabase valide — le jeton est vérifié à chaque appel par
 *    `getClaims()`, jamais simplement lu dans le cookie, qui est falsifiable ;
 * 2. l'adresse de l'utilisateur doit figurer dans `ADMIN_EMAILS`.
 *
 * La seconde condition est volontairement redondante avec la désactivation des
 * inscriptions publiques dans Supabase : si cette option était réactivée par
 * mégarde, n'importe qui pourrait créer un compte, mais personne n'entrerait
 * pour autant dans l'administration.
 */

import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adressesAutorisees, estAdministrateur } from '@/lib/admin/habilitations';

export { estAdministrateur };

const url = process.env.SUPABASE_URL;
const clePublique = process.env.SUPABASE_ANON_KEY;

/** Sans ces valeurs, l'administration refuse toute connexion. */
export const authConfiguree = (): boolean =>
  Boolean(url && clePublique) && adressesAutorisees().length > 0;

/**
 * Client lié aux cookies de la requête. À recréer à chaque requête : il porte
 * la session de l'appelant.
 */
export const clientRequete = async () => {
  const boite = await cookies();

  return createServerClient(url as string, clePublique as string, {
    cookies: {
      getAll: () => boite.getAll(),
      setAll: (aPoser) => {
        try {
          for (const { name, value, options } of aPoser) boite.set(name, value, options);
        } catch {
          // Un composant serveur ne peut pas écrire de cookie : le proxy s'en
          // charge à chaque requête, l'échec est donc sans conséquence.
        }
      },
    },
  });
};

export type Administrateur = { email: string };

/**
 * Utilisateur connecté et autorisé, ou `null`. C'est le seul point d'entrée
 * utilisé par les pages et les actions.
 */
export const administrateurCourant = cache(async (): Promise<Administrateur | null> => {
  if (!authConfiguree()) return null;

  const supabase = await clientRequete();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email;

  if (error || typeof email !== 'string') return null;
  if (!estAdministrateur(email)) return null;

  return { email };
});

/**
 * À appeler en tête de chaque page d'administration. Le proxy filtre déjà les
 * requêtes, mais une page ne doit pas dépendre d'un fichier qu'on peut
 * reconfigurer ailleurs : elle vérifie elle-même avant d'afficher quoi que ce
 * soit.
 */
export const exigerAdministrateur = async (): Promise<Administrateur> => {
  const compte = await administrateurCourant();
  if (!compte) redirect('/admin/connexion');
  return compte;
};
