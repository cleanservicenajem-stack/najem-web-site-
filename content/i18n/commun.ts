import type { LangueTraduite } from '@/config/i18n';
import type { TextesBoutiques } from '@/components/ui/StoreButtons';

/**
 * Vocabulaire commun des pages traduites (/ar, /en).
 *
 * Un seul endroit pour les noms qui reviennent d'une page à l'autre (formules,
 * prestations, quartiers, villes) : la même formule porte le même nom partout.
 * Chaque terme traduit un terme déjà publié en français ; rien n'est ajouté.
 */
export type TextesCommuns = {
  /** Séparateur des listes en ligne (« , » ou « ، »). */
  separateur: string;
  /** « A, B et C » dans la langue de la page. */
  liste: (elements: string[]) => string;
  /** Prix lisible : « 200 DH », « 200 درهم ». */
  prix: (montant: number) => string;
  /** Durée lisible à partir d'heures et de minutes. */
  duree: (heures: number, minutes: number) => string;
  /** « 3 × ménage express ». */
  quantite: (nombre: number, nom: string) => string;
  /** Contenu d'un abonnement : « 3 × … + 1 × … chaque mois ». */
  abonnementContenu: (elements: string[]) => string;
  /** « Abonnement mensuel ». */
  abonnement: string;
  /** « / mois ». */
  parMois: string;
  /** Suffixe d'un lien vers une page restée en français : « (in French) ». */
  enFrancais: string;
  /** Libellés des badges App Store / Google Play. */
  boutiques: TextesBoutiques;
  /** Noms de la grille tarifaire, par identifiant (config/tarifs.ts). */
  grille: {
    categories: Record<string, { titre: string; precision: string }>;
    formules: Record<string, string>;
  };
  /**
   * Options de la grille, par libellé français exact (config/tarifs.ts et
   * administration). Une option ajoutée plus tard sans traduction garde son
   * libellé français.
   */
  options: Record<string, string>;
  /** Nom de chaque prestation, par slug (config/services.ts). */
  services: Record<string, { titre: string; titreCourt: string }>;
  /** Villes desservies, par slug (config/site.ts → serviceAreas). */
  villes: Record<string, string>;
  /** Quartiers de Casablanca cités dans les pages (lib/landing.ts, même ordre). */
  quartiers: string[];
  /** « Casablanca et ses alentours ». */
  zone: string;
};

const listeAvec = (et: string, separateur: string) => (elements: string[]) =>
  elements.length <= 1
    ? (elements[0] ?? '')
    : `${elements.slice(0, -1).join(separateur)}${et}${elements[elements.length - 1]}`;

const anglais: TextesCommuns = {
  separateur: ', ',
  liste: listeAvec(' and ', ', '),
  prix: (montant) => `${new Intl.NumberFormat('en-US').format(montant)} DH`,
  duree: (heures, minutes) => `${heures} h${minutes > 0 ? ` ${minutes} min` : ''}`,
  quantite: (nombre, nom) => `${nombre} × ${nom.toLowerCase()}`,
  abonnementContenu: (elements) => `${elements.join(' + ')} each month`,
  abonnement: 'Monthly plan',
  parMois: '/ month',
  enFrancais: ' (in French)',
  boutiques: {
    ios: { haut: 'Download on the', bas: 'App Store', aria: 'Download on the App Store' },
    android: { haut: 'Get it on', bas: 'Google Play', aria: 'Get it on Google Play' },
    nouvelleFenetre: 'opens in a new window',
  },
  grille: {
    categories: {
      studio: { titre: 'Studio and small apartment', precision: 'Up to 2 rooms' },
      grand: { titre: 'Large apartment and villa', precision: 'Up to 5 bedrooms' },
      'tres-grand': { titre: 'Very large home', precision: 'Large villas and high-end homes' },
    },
    formules: {
      'studio-express': 'Express cleaning',
      'studio-complet': 'Full cleaning',
      'grand-express': 'Express cleaning',
      'grand-menage': 'Deep cleaning',
      'tres-grand-express': 'Express cleaning',
      'tres-grand-prestige': 'Prestige cleaning',
    },
  },
  options: {
    'Repassage express (30 min)': 'Express ironing (30 min)',
    'Repassage complet (1 h)': 'Full ironing (1 h)',
    'Four et frigo très sales': 'Very dirty oven and fridge',
    'Terrasse ou balcon': 'Terrace or balcony',
    'Heure supplémentaire': 'Extra hour',
    'Shampouineuse canapé et tapis': 'Sofa and carpet shampooing',
    Repassage: 'Ironing',
    'Petit repassage': 'Small ironing load',
    'Grand repassage': 'Large ironing load',
  },
  services: {
    'nettoyage-regulier': { titre: 'Regular cleaning', titreCourt: 'Regular' },
    'nettoyage-ponctuel': { titre: 'One-off cleaning', titreCourt: 'One-off' },
    'nettoyage-apres-demenagement': { titre: 'Move-in and move-out cleaning', titreCourt: 'Moving' },
    'grand-nettoyage': { titre: 'Deep cleaning', titreCourt: 'Deep cleaning' },
    'entretien-specialise': { titre: 'Specialised cleaning', titreCourt: 'Specialised' },
    professionnels: { titre: 'Airbnb and business cleaning', titreCourt: 'Airbnb and pros' },
  },
  villes: {
    casablanca: 'Casablanca',
    bouskoura: 'Bouskoura',
    'dar-bouazza': 'Dar Bouazza',
    'ain-harrouda': 'Ain Harrouda',
    'tit-mellil': 'Tit Mellil',
  },
  quartiers: [
    'Maarif',
    'Gauthier',
    'Racine',
    'Bourgogne',
    'Anfa',
    'Ain Diab',
    'Californie',
    'Oasis',
    'Sidi Maarouf',
    'Hay Hassani',
    'Ain Sebaa',
    'Belvédère',
  ],
  zone: 'Casablanca and the surrounding area',
};

const dureeArabe = (heures: number, minutes: number): string => {
  const base =
    heures === 1
      ? 'ساعة'
      : heures === 2
        ? 'ساعتان'
        : heures <= 10
          ? `${heures} ساعات`
          : `${heures} ساعة`;
  if (minutes === 0) return base;
  if (minutes === 30) return `${base} ونصف`;
  return `${base} و${minutes} دقيقة`;
};

const arabe: TextesCommuns = {
  separateur: '، ',
  liste: listeAvec(' و', '، '),
  prix: (montant) => `${montant} درهم`,
  duree: dureeArabe,
  quantite: (nombre, nom) => `${nombre} × ${nom}`,
  abonnementContenu: (elements) => `${elements.join(' + ')} كل شهر`,
  abonnement: 'اشتراك شهري',
  parMois: 'في الشهر',
  enFrancais: ' (بالفرنسية)',
  boutiques: {
    ios: { haut: 'حمّله من', bas: 'App Store', aria: 'حمّل التطبيق من App Store' },
    android: { haut: 'متوفر على', bas: 'Google Play', aria: 'حمّل التطبيق من Google Play' },
    nouvelleFenetre: 'يفتح في نافذة جديدة',
  },
  grille: {
    categories: {
      studio: { titre: 'استوديو وشقة صغيرة', precision: 'حتى غرفتين' },
      grand: { titre: 'شقة كبيرة وفيلا', precision: 'حتى 5 غرف نوم' },
      'tres-grand': { titre: 'مسكن كبير جدا', precision: 'الفيلات الكبيرة والمساكن الراقية' },
    },
    formules: {
      'studio-express': 'تنظيف سريع',
      'studio-complet': 'تنظيف شامل',
      'grand-express': 'تنظيف سريع',
      'grand-menage': 'تنظيف عميق',
      'tres-grand-express': 'تنظيف سريع',
      'tres-grand-prestige': 'تنظيف فاخر',
    },
  },
  options: {
    'Repassage express (30 min)': 'كي سريع (30 دقيقة)',
    'Repassage complet (1 h)': 'كي كامل (ساعة)',
    'Four et frigo très sales': 'فرن وثلاجة متسخان جدا',
    'Terrasse ou balcon': 'تراس أو شرفة',
    'Heure supplémentaire': 'ساعة إضافية',
    'Shampouineuse canapé et tapis': 'غسل الأرائك والزرابي بالآلة',
    Repassage: 'الكي',
    'Petit repassage': 'كي كمية صغيرة',
    'Grand repassage': 'كي كمية كبيرة',
  },
  services: {
    'nettoyage-regulier': { titre: 'التنظيف المنتظم', titreCourt: 'منتظم' },
    'nettoyage-ponctuel': { titre: 'التنظيف لمرة واحدة', titreCourt: 'لمرة واحدة' },
    'nettoyage-apres-demenagement': { titre: 'التنظيف عند الانتقال', titreCourt: 'الانتقال' },
    'grand-nettoyage': { titre: 'التنظيف العميق', titreCourt: 'التنظيف العميق' },
    'entretien-specialise': { titre: 'التنظيف المتخصص', titreCourt: 'متخصص' },
    professionnels: { titre: 'تنظيف شقق Airbnb والمهنيين', titreCourt: 'Airbnb والمهنيون' },
  },
  villes: {
    casablanca: 'الدار البيضاء',
    bouskoura: 'بوسكورة',
    'dar-bouazza': 'دار بوعزة',
    'ain-harrouda': 'عين حرودة',
    'tit-mellil': 'تيط مليل',
  },
  quartiers: [
    'المعاريف',
    'غوتييه',
    'راسين',
    'بوركون',
    'أنفا',
    'عين الذئاب',
    'كاليفورنيا',
    'الواحة',
    'سيدي معروف',
    'الحي الحسني',
    'عين السبع',
    'بلفدير',
  ],
  zone: 'الدار البيضاء ونواحيها',
};

export const communs: Record<LangueTraduite, TextesCommuns> = { ar: arabe, en: anglais };
