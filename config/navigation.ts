export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

/** Navigation principale (header desktop + menu mobile). */
export const mainNav: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Services', href: '/services', description: 'Les prestations de nettoyage' },
  { label: 'Tarifs', href: '/tarifs', description: 'Prix des formules et abonnements' },
  { label: 'Application', href: '/application', description: 'iOS et Android' },
  { label: 'À propos', href: '/a-propos', description: "L'entreprise et sa mission" },
  { label: 'FAQ', href: '/faq', description: 'Questions fréquentes' },
  { label: 'Contact', href: '/contact', description: 'Nous écrire' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    // Liens présents sur toutes les pages vers les pages qui répondent aux
    // recherches les plus fréquentes : c'est aussi ce qui les fait découvrir
    // et peser auprès de Google.
    title: 'Ménage à Casablanca',
    items: [
      { label: 'Femme de ménage à Casablanca', href: '/femme-de-menage-casablanca' },
      { label: 'Grand ménage', href: '/services/grand-nettoyage' },
      { label: 'Ménage Airbnb', href: '/services/professionnels' },
      { label: 'Canapé et tapis', href: '/nettoyage-canape-tapis-casablanca' },
      { label: 'Après déménagement', href: '/services/nettoyage-apres-demenagement' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'Tarifs', href: '/tarifs' },
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

/*
 * Versions traduites (/ar, /en) de la navigation. Les pages restées en
 * français (blog, pages légales) gardent leur adresse française et le disent.
 */

const navigationAnglaise: NavItem[] = [
  { label: 'Home', href: '/en' },
  { label: 'Services', href: '/en/services', description: 'Our cleaning services' },
  { label: 'Prices', href: '/en/tarifs', description: 'Packages and monthly plans' },
  { label: 'App', href: '/en/application', description: 'iOS and Android' },
  { label: 'About', href: '/en/a-propos', description: 'The company and its mission' },
  { label: 'FAQ', href: '/en/faq', description: 'Frequently asked questions' },
  { label: 'Contact', href: '/en/contact', description: 'Write to us' },
];

const navigationArabe: NavItem[] = [
  { label: 'الرئيسية', href: '/ar' },
  { label: 'الخدمات', href: '/ar/services', description: 'خدمات التنظيف' },
  { label: 'الأسعار', href: '/ar/tarifs', description: 'الباقات والاشتراكات الشهرية' },
  { label: 'التطبيق', href: '/ar/application', description: 'iOS وAndroid' },
  { label: 'من نحن', href: '/ar/a-propos', description: 'الشركة ورسالتها' },
  { label: 'الأسئلة الشائعة', href: '/ar/faq', description: 'أجوبة عن أسئلتكم' },
  { label: 'اتصل بنا', href: '/ar/contact', description: 'راسلنا' },
];

export const navigationPrincipale: Record<'fr' | 'ar' | 'en', NavItem[]> = {
  fr: mainNav,
  ar: navigationArabe,
  en: navigationAnglaise,
};

export const navigationPied: Record<'fr' | 'ar' | 'en', { title: string; items: NavItem[] }[]> = {
  fr: footerNav,
  en: [
    {
      title: 'Cleaning in Casablanca',
      items: [
        { label: 'Cleaner in Casablanca', href: '/en/femme-de-menage-casablanca' },
        { label: 'Deep cleaning', href: '/en/services/grand-nettoyage' },
        { label: 'Airbnb cleaning', href: '/en/services/professionnels' },
        { label: 'Sofa and carpet', href: '/en/nettoyage-canape-tapis-casablanca' },
        { label: 'After moving', href: '/en/services/nettoyage-apres-demenagement' },
      ],
    },
    {
      title: 'Navigation',
      items: [
        { label: 'Home', href: '/en' },
        { label: 'Services', href: '/en/services' },
        { label: 'Prices', href: '/en/tarifs' },
        { label: 'App', href: '/en/application' },
        { label: 'About', href: '/en/a-propos' },
        { label: 'Tips (in French)', href: '/blog' },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: 'FAQ', href: '/en/faq' },
        { label: 'Contact', href: '/en/contact' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Legal notice (in French)', href: '/mentions-legales' },
        { label: 'Privacy policy (in French)', href: '/confidentialite' },
        { label: 'Terms of use (in French)', href: '/conditions-utilisation' },
        { label: 'Cookies (in French)', href: '/cookies' },
      ],
    },
  ],
  ar: [
    {
      title: 'التنظيف في الدار البيضاء',
      items: [
        { label: 'عاملة نظافة في الدار البيضاء', href: '/ar/femme-de-menage-casablanca' },
        { label: 'التنظيف العميق', href: '/ar/services/grand-nettoyage' },
        { label: 'تنظيف شقق Airbnb', href: '/ar/services/professionnels' },
        { label: 'الأرائك والزرابي', href: '/ar/nettoyage-canape-tapis-casablanca' },
        { label: 'التنظيف عند الانتقال', href: '/ar/services/nettoyage-apres-demenagement' },
      ],
    },
    {
      title: 'التنقل',
      items: [
        { label: 'الرئيسية', href: '/ar' },
        { label: 'الخدمات', href: '/ar/services' },
        { label: 'الأسعار', href: '/ar/tarifs' },
        { label: 'التطبيق', href: '/ar/application' },
        { label: 'من نحن', href: '/ar/a-propos' },
        { label: 'نصائح (بالفرنسية)', href: '/blog' },
      ],
    },
    {
      title: 'مساعدة',
      items: [
        { label: 'الأسئلة الشائعة', href: '/ar/faq' },
        { label: 'اتصل بنا', href: '/ar/contact' },
      ],
    },
    {
      title: 'معلومات قانونية',
      items: [
        { label: 'الإشعار القانوني (بالفرنسية)', href: '/mentions-legales' },
        { label: 'سياسة الخصوصية (بالفرنسية)', href: '/confidentialite' },
        { label: 'شروط الاستخدام (بالفرنسية)', href: '/conditions-utilisation' },
        { label: 'ملفات تعريف الارتباط (بالفرنسية)', href: '/cookies' },
      ],
    },
  ],
};
