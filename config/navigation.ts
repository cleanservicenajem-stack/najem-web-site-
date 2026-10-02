export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/** Navigation principale (header desktop + menu mobile). */
export const mainNav: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services', description: 'Les prestations de nettoyage' },
  { label: 'Application', href: '/application', description: 'iOS et Android' },
  { label: 'À propos', href: '/a-propos', description: "L'entreprise et sa mission" },
  { label: 'FAQ', href: '/faq', description: 'Questions fréquentes' },
  { label: 'Contact', href: '/contact', description: 'Nous écrire' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Navigation',
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Application', href: '/application' },
      { label: 'À propos', href: '/a-propos' },
      { label: 'Conseils', href: '/blog' },
    ],
  },
  {
    title: 'Aide',
    items: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Informations',
    items: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: "Conditions d'utilisation", href: '/conditions-utilisation' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
];
