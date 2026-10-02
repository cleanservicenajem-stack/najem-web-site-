'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getGroupeEditable, type ChampEditable } from '@/config/editable';
import { administrateurCourant, authConfiguree, clientRequete, estAdministrateur } from '@/lib/admin/auth';
import { marquerLu, supprimerMessage } from '@/lib/admin/messages';
import { ecrireGroupe } from '@/lib/admin/store';
import type { EtatConnexion, EtatEnregistrement } from '@/lib/admin/etats';
import { rateLimit } from '@/lib/rate-limit';

const adresseClient = async (): Promise<string> => {
  const entetes = await headers();
  const transmise = entetes.get('x-forwarded-for');
  if (transmise) return transmise.split(',')[0]?.trim() ?? 'inconnu';
  return entetes.get('x-real-ip') ?? 'inconnu';
};

/** Les actions d'écriture revérifient la session : le proxy garde l'accès, pas l'écriture. */
const sessionOuverte = async (): Promise<boolean> => Boolean(await administrateurCourant());

export async function seConnecter(
  _etat: EtatConnexion,
  donnees: FormData,
): Promise<EtatConnexion> {
  if (!authConfiguree()) {
    return {
      status: 'error',
      message:
        'L’administration n’est pas configurée sur ce serveur : les clés Supabase sont absentes.',
    };
  }

  // Limite stricte : une page de connexion est la cible la plus évidente.
  const limite = rateLimit(`admin:${await adresseClient()}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limite.success) {
    return {
      status: 'error',
      message: `Trop de tentatives. Réessayez dans ${Math.ceil(limite.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const email = String(donnees.get('email') ?? '').trim().toLowerCase();
  const motDePasse = String(donnees.get('motDePasse') ?? '');

  // Un message unique pour tous les échecs : préciser lequel des deux champs
  // est faux revient à confirmer l'existence d'un compte.
  const refus = { status: 'error' as const, message: 'Adresse e-mail ou mot de passe incorrect.' };

  if (!email || !motDePasse || email.length > 200 || motDePasse.length > 200) return refus;

  const supabase = await clientRequete();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });

  if (error || !data.user?.email) return refus;

  if (!estAdministrateur(data.user.email)) {
    // Le compte existe mais n'est pas habilité : la session est refermée
    // aussitôt, pour ne pas laisser traîner un jeton valide.
    await supabase.auth.signOut();
    return {
      status: 'error',
      message: 'Ce compte n’a pas accès à l’administration.',
    };
  }

  const suivant = String(donnees.get('suivant') ?? '');
  // Seules les destinations internes à l'administration sont acceptées :
  // sinon la page de connexion deviendrait une redirection ouverte.
  redirect(suivant.startsWith('/admin') && !suivant.startsWith('/admin/connexion') ? suivant : '/admin');
}

export async function seDeconnecter(): Promise<void> {
  const supabase = await clientRequete();
  await supabase.auth.signOut();
  redirect('/admin/connexion');
}

const valider = (champ: ChampEditable, valeur: string): string | null => {
  if (valeur.length === 0) {
    return champ.facultatif ? null : 'Ce champ ne peut pas rester vide.';
  }

  if (valeur.length > champ.longueurMax) {
    return `${valeur.length} caractères pour un maximum de ${champ.longueurMax}.`;
  }

  if (champ.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur)) {
    return 'Adresse e-mail invalide.';
  }

  if (champ.type === 'telephone' && !/^[+()\d\s.-]{6,}$/.test(valeur)) {
    return 'Numéro invalide : chiffres, espaces et signe + uniquement.';
  }

  return null;
};

export async function enregistrerGroupe(
  _etat: EtatEnregistrement,
  donnees: FormData,
): Promise<EtatEnregistrement> {
  if (!(await sessionOuverte())) {
    return { status: 'error', message: 'Session expirée. Reconnectez-vous pour enregistrer.' };
  }

  const groupe = getGroupeEditable(String(donnees.get('groupe') ?? ''));
  if (!groupe) {
    return { status: 'error', message: 'Section inconnue.' };
  }

  const erreurs: Record<string, string> = {};
  const saisies: Record<string, string> = {};

  for (const champ of groupe.champs) {
    // Les sauts de ligne sont normalisés : les champs sont du texte simple.
    const valeur = String(donnees.get(champ.cle) ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    const erreur = valider(champ, valeur);
    if (erreur) erreurs[champ.cle] = erreur;
    saisies[champ.cle] = valeur;
  }

  if (Object.keys(erreurs).length > 0) {
    return { status: 'error', message: 'Certains champs doivent être corrigés.', erreurs };
  }

  const aEnregistrer: Record<string, string> = {};

  for (const champ of groupe.champs) {
    const valeur = saisies[champ.cle] ?? '';
    // Une valeur identique au texte du code n'est pas stockée : la base ne
    // conserve que ce qui a réellement été modifié.
    if (valeur !== champ.repli) aEnregistrer[champ.cle] = valeur;
  }

  try {
    await ecrireGroupe(
      groupe.champs.map((champ) => champ.cle),
      aEnregistrer,
    );
  } catch (error) {
    console.error('[admin] Enregistrement impossible :', error);
    return {
      status: 'error',
      message:
        'Le contenu n’a pas pu être enregistré : la base de données n’a pas répondu. Réessayez dans un instant.',
    };
  }

  // Les coordonnées apparaissent dans le pied de page, donc sur toutes les
  // pages : on régénère l'ensemble du site plutôt que des routes choisies.
  revalidatePath('/', 'layout');

  return { status: 'success', message: 'Modifications enregistrées et publiées sur le site.' };
}

/**
 * Marque un message comme lu ou non lu.
 *
 * Les actions ci-dessous revérifient la session puis se contentent de
 * rafraîchir `/admin/messages` : aucune page publique ne dépend des messages.
 */
export async function basculerLecture(donnees: FormData): Promise<void> {
  if (!(await sessionOuverte())) return;

  const id = String(donnees.get('id') ?? '');
  if (!id) return;

  await marquerLu(id, donnees.get('lu') === '1');
  revalidatePath('/admin/messages');
}

export async function effacerMessage(donnees: FormData): Promise<void> {
  if (!(await sessionOuverte())) return;

  const id = String(donnees.get('id') ?? '');
  if (!id) return;

  await supprimerMessage(id);
  revalidatePath('/admin/messages');
}
