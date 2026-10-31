import type { Langue } from '@/config/i18n';

/**
 * Textes d'une page d'accueil traduite (/ar, /en).
 *
 * Chaque phrase est la traduction d'un contenu déjà publié en français : la
 * traduction n'ajoute ni promesse, ni chiffre, ni service. Les prix ne sont
 * pas écrits ici : ils sont relus dans la grille de /tarifs.
 */
export type DictionnaireAccueil = {
  langue: Exclude<Langue, 'fr'>;
  /** Séparateur des listes en ligne (« , » ou « ، »). */
  separateur: string;

  meta: {
    /** `{prix}` est remplacé par le prix de départ, ex. « 200 DH ». */
    titre: string;
    titreSansPrix: string;
    description: string;
    descriptionSansPrix: string;
  };

  entete: {
    accueil: string;
    /** Nom du menu de l'en-tête, lu par les lecteurs d'écran. */
    navigation: string;
    telecharger: string;
    menu: { tarifs: string; services: string; questions: string };
  };

  hero: {
    surtitre: string;
    titre: string;
    /** `{prix}` est remplacé par le prix de départ. */
    accroche: string;
    accrocheSansPrix: string;
  };

  services: {
    titre: string;
    intro: string;
    liste: { nom: string; texte: string }[];
  };

  tarifs: {
    titre: string;
    intro: string;
    colonnes: { logement: string; formule: string; detail: string; prix: string };
    abonnement: string;
    parMois: string;
    options: string;
    lienDetail: string;
  };

  fonctionnement: {
    titre: string;
    etapes: string[];
  };

  zones: {
    titre: string;
    /** `{quartiers}` est remplacé par la liste des quartiers. */
    texte: string;
    quartiers: string[];
  };

  questions: {
    titre: string;
    prix: {
      question: string;
      /** `{express}`, `{duree}`, `{complet}`, `{grand}`, `{prestige}`. */
      reponse: string;
      suite: string;
    };
    abonnement: { question: string; reponse: string };
    zones: { question: string; reponse: string };
    reserver: { question: string; reponse: string };
    contenu: { question: string; reponse: string };
  };

  appel: {
    titre: string;
    texte: string;
  };

  pied: {
    description: string;
    siteFrancais: string;
    mentions: string;
    confidentialite: string;
    droits: string;
    langueChoix: string;
  };

  boutiques: {
    ios: { haut: string; bas: string; aria: string };
    android: { haut: string; bas: string; aria: string };
    nouvelleFenetre: string;
  };

  /** Noms des formules et des catégories de la grille, par identifiant. */
  grille: {
    categories: Record<string, { titre: string; precision: string }>;
    formules: Record<string, string>;
  };

  /** Mise en forme des durées (« 1 h 30 ») et des prix (200). */
  duree: (heures: number, minutes: number) => string;
  prix: (montant: number) => string;
  /** « 3 × Ménage express » dans le contenu d'un abonnement. */
  quantite: (nombre: number, nom: string) => string;
  /** Assemble les éléments d'un abonnement. */
  abonnementContenu: (elements: string[]) => string;
};
