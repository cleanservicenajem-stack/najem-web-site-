/**
 * Thème clair / sombre.
 *
 * Le thème actif est porté par la classe `dark` sur <html>. La source de
 * vérité est donc le DOM lui-même : un script exécuté avant le premier rendu
 * (voir `themeInitScript`) la pose, ce qui évite l'éclair blanc au chargement.
 *
 * Ce module reste volontairement sans dépendance à React : il est importé
 * aussi bien par le layout serveur (pour le script) que par les composants
 * clients (pour la bascule).
 */

export const THEME_STORAGE_KEY = 'najem-theme';

/** Ce que l'utilisateur a choisi ; `system` = pas de choix explicite. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Ce qui est réellement affiché. */
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Couleur de l'interface du navigateur (barre d'adresse mobile). */
export const themeColors: Record<ResolvedTheme, string> = {
  light: '#ffffff',
  dark: '#091b2c',
};

/**
 * Script d'initialisation, injecté tel quel dans le <head>.
 *
 * Il doit s'exécuter avant la peinture : sans lui, un visiteur en thème sombre
 * verrait la page s'afficher en clair pendant une fraction de seconde. Écrit
 * en ES5 compact et entièrement protégé, car un stockage inaccessible (mode
 * privé, cookies bloqués) ne doit jamais empêcher la page de s'afficher.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var d=p==='dark'||(p!=='light'&&window.matchMedia('${DARK_QUERY}').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const listeners = new Set<() => void>();

const notify = () => {
  for (const listener of listeners) listener();
};

const readStoredPreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : 'system';
  } catch {
    return 'system';
  }
};

const systemTheme = (): ResolvedTheme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

/**
 * Aligne la couleur de l'interface du navigateur sur le thème réellement
 * affiché. Les balises `theme-color` du document sont conditionnées à
 * `prefers-color-scheme` : elles seraient fausses dès que le visiteur choisit
 * un thème différent de celui de son système. Cette balise-ci, sans média,
 * prime sur les autres et suit toujours l'affichage.
 */
const syncBrowserThemeColor = (theme: ResolvedTheme) => {
  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-managed]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.dataset.managed = '';
    document.head.prepend(meta);
  }
  meta.content = themeColors[theme];
};

/** Applique le thème au document, sans toucher au stockage. */
const paint = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  syncBrowserThemeColor(theme);
  if (root.classList.contains('dark') === (theme === 'dark')) return;
  root.classList.toggle('dark', theme === 'dark');
  notify();
};

let transitionTimer: number | undefined;

/**
 * Enrobe le changement d'une courte transition de couleurs. La classe est
 * retirée aussitôt après : une transition permanente sur toute la page
 * ralentirait chaque survol.
 */
const withTransition = (apply: () => void) => {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  apply();
  window.clearTimeout(transitionTimer);
  transitionTimer = window.setTimeout(() => root.classList.remove('theme-switching'), 260);
};

/** Enregistre le choix de l'utilisateur et l'applique. */
export const setThemePreference = (preference: ThemePreference) => {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    /* stockage indisponible : le choix ne survivra pas au rechargement */
  }

  withTransition(() => paint(preference === 'system' ? systemTheme() : preference));
};

export const getThemeSnapshot = (): ResolvedTheme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

/**
 * Le thème peut changer depuis un autre onglet, depuis les réglages du
 * système (tant qu'aucun choix explicite n'a été fait) ou depuis une autre
 * instance du bouton. Les trois sources sont écoutées ici pour que toutes les
 * bascules de la page restent synchronisées.
 */
export const subscribeToTheme = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY);

  const onSystemChange = () => {
    if (readStoredPreference() === 'system') paint(systemTheme());
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
    const preference = readStoredPreference();
    paint(preference === 'system' ? systemTheme() : preference);
  };

  listeners.add(onChange);
  media.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  syncBrowserThemeColor(getThemeSnapshot());

  return () => {
    listeners.delete(onChange);
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
};
