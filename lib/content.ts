/**
 * Lecture du contenu affiché par le site public.
 *
 * Chaque valeur vient de l'administration si elle y a été enregistrée, sinon
 * du code (`config/editable.ts` pour les textes, `config/site.ts` et
 * `config/services.ts` pour le reste). Le site fonctionne donc à l'identique
 * tant que personne n'a ouvert l'administration, et même si Supabase est
 * injoignable.
 *
 * `cache` dédoublonne l'appel à Supabase à l'échelle d'un rendu : une page qui
 * lit trente champs ne fait qu'une seule requête.
 */

import { cache } from 'react';
import { getChampEditable } from '@/config/editable';
import type { Service } from '@/config/services';
import { siteConfig, type PostalAddress } from '@/config/site';
import { lireContenu, type ContenuEnregistre } from '@/lib/admin/store';

export const getContenu = cache(lireContenu);

/** Valeur enregistrée, nettoyée ; `null` si rien n'a été saisi. */
const valeurEnregistree = (contenu: ContenuEnregistre, cle: string): string | null => {
  const brut = contenu[cle];
  if (typeof brut !== 'string') return null;
  const propre = brut.trim();
  return propre.length > 0 ? propre : null;
};

/** Valeur par défaut déclarée dans le registre ; `null` si elle est vide. */
const repli = (cle: string): string | null => {
  const valeur = getChampEditable(cle)?.repli?.trim();
  return valeur ? valeur : null;
};

/**
 * Texte éditorial. Le repli provient de la description du champ, ce qui évite
 * d'avoir la même phrase écrite à deux endroits.
 */
export const getTexte = async (cle: string): Promise<string> =>
  valeurEnregistree(await getContenu(), cle) ?? repli(cle) ?? '';

/** Variante pour les champs facultatifs : `null` plutôt qu'une chaîne vide. */
export const getTexteFacultatif = async (cle: string): Promise<string | null> => {
  const valeur = await getTexte(cle);
  return valeur.length > 0 ? valeur : null;
};

/**
 * Titre et description d'une page, tels qu'ils doivent partir dans les
 * métadonnées. `chemin` est la clé déclarée dans `config/editable.ts`
 * (« accueil », « services », « contact »…).
 */
export const getSeo = async (
  chemin: string,
): Promise<{ title: string; description: string }> => {
  const [title, description] = await Promise.all([
    getTexte(`seo.${chemin}.titre`),
    getTexte(`seo.${chemin}.description`),
  ]);
  return { title, description };
};

export type ContactResolu = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: PostalAddress | null;
  openingHours: typeof siteConfig.contact.openingHours;
  responseTime: string | null;
};

/**
 * Coordonnées effectives. L'adresse n'est constituée que si ses trois parties
 * sont renseignées : une adresse incomplète serait pire qu'absente, aussi bien
 * pour le visiteur que pour les données structurées.
 */
export const getContact = async (): Promise<ContactResolu> => {
  const contenu = await getContenu();
  const valeur = (cle: string) => valeurEnregistree(contenu, cle);

  const rue = valeur('contact.adresse.rue');
  const ville = valeur('contact.adresse.ville');
  const codePostal = valeur('contact.adresse.codePostal');

  const adresse: PostalAddress | null =
    rue && ville && codePostal
      ? {
          street: rue,
          city: ville,
          postalCode: codePostal,
          country: siteConfig.primaryMarket.country,
          countryCode: siteConfig.primaryMarket.countryCode,
        }
      : siteConfig.contact.address;

  return {
    phone: valeur('contact.telephone') ?? siteConfig.contact.phone,
    whatsapp: valeur('contact.whatsapp') ?? siteConfig.contact.whatsapp,
    email: valeur('contact.email') ?? siteConfig.contact.email,
    address: adresse,
    openingHours: siteConfig.contact.openingHours,
    responseTime: valeur('contact.delaiReponse') ?? siteConfig.contact.responseTime,
  };
};

export const hasContactChannel = async (): Promise<boolean> => {
  const contact = await getContact();
  return Boolean(contact.phone || contact.email || contact.whatsapp);
};

export const whatsappHref = async (message?: string): Promise<string | null> => {
  const { whatsapp } = await getContact();
  if (!whatsapp) return null;
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

/**
 * Prestation telle qu'elle doit être affichée dans les listes : le titre et
 * les deux lignes peuvent avoir été réécrits depuis l'administration.
 */
export const getServiceAffiche = async (service: Service): Promise<Service> => {
  const contenu = await getContenu();
  const valeur = (suffixe: string) =>
    valeurEnregistree(contenu, `service.${service.slug}.${suffixe}`);

  return {
    ...service,
    title: valeur('titre') ?? service.title,
    benefit: valeur('accroche') ?? service.benefit,
    pitch: valeur('complement') ?? service.pitch,
  };
};

export const getServicesAffiches = async (liste: Service[]): Promise<Service[]> =>
  Promise.all(liste.map(getServiceAffiche));
