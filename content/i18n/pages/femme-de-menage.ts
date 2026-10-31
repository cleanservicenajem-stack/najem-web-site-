import type { LangueTraduite } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import { communs } from '@/content/i18n/commun';

/**
 * Page « Femme de ménage à Casablanca » en arabe et en anglais
 * (/ar/femme-de-menage-casablanca, /en/femme-de-menage-casablanca).
 *
 * Traduction de app/(site)/femme-de-menage-casablanca/page.tsx : mêmes
 * sections, mêmes informations. Les prix et les durées ne sont jamais écrits
 * ici : la page les lit dans la grille de /tarifs et les passe en paramètres.
 */

/** Formule citée dans une réponse : nom traduit, prix formaté, durée traduite (vide si illisible). */
export type PrixFormule = { nom: string; prix: string; duree: string };

/** Prestations vers lesquelles la page renvoie (config/services.ts). */
export type SlugPrestation =
  | 'nettoyage-ponctuel'
  | 'nettoyage-regulier'
  | 'grand-nettoyage'
  | 'nettoyage-apres-demenagement';

export type TextesFemmeDeMenage = {
  meta: {
    /** `prixMin` : prix le plus bas de la grille, formaté ; `null` s'il est illisible. */
    titre: (prixMin: string | null) => string;
    description: (prixMin: string | null) => string;
  };
  /** Fil d'Ariane : noms des deux pages et nom accessible du fil. */
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; chapo: (prixMin: string | null) => string };
  intro: { titre: string; paragraphes: string[] };
  inclus: {
    titre: string;
    /** Ce que comprend le ménage régulier, par texte français exact (config/services.ts). */
    elements: Record<string, string>;
    options: string;
  };
  reserver: { titre: string; texte: string };
  prix: {
    titre: string;
    texte: string;
    legende: string;
    colonnes: { logement: string; formule: string; detail: string; prix: string };
    lien: string;
  };
  formules: { titre: string; texte: string; prestations: Record<SlugPrestation, string> };
  zones: { titre: string; texte: (quartiers: string, alentours: string) => string };
  etapes: { titre: string; liste: string[] };
  questions: {
    titre: string;
    lienCanape: string;
    lienToutes: string;
    prix: {
      question: string;
      /** Une autre formule dans la phrase « Comptez ensuite… ». */
      element: (formule: PrixFormule) => string;
      /** `suite` : autres formules déjà réunies en liste, `null` s'il n'y en a aucune. */
      reponse: (express: PrixFormule, suite: string | null) => string;
      complement: string;
    };
    reguliere: { question: string; reponse: string };
    quartiers: { question: string; reponse: (alentours: string) => string };
    reserver: { question: string; reponse: string };
    expressComplet: { question: string; reponse: string };
  };
  schema: { nomPage: string; descriptionPage: string; nomService: string; typeService: string };
};

const NOM = siteConfig.name;

const anglais: TextesFemmeDeMenage = {
  meta: {
    titre: (prixMin) =>
      `Maid and house cleaner in Casablanca${prixMin ? ` from ${prixMin}` : ''} | Najem`,
    description: (prixMin) =>
      `Book a maid or house cleaner in Casablanca in minutes: express cleaning${prixMin ? ` from ${prixMin}` : ''}, full or deep cleaning, or a monthly plan, in the Najem app.`,
  },
  fil: { accueil: 'Home', page: 'Maid in Casablanca', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Home cleaning in Casablanca',
    titre: 'Maid and house cleaner in Casablanca',
    chapo: (prixMin) =>
      `Book your cleaner in a few minutes with the ${NOM} app${prixMin ? `: express cleaning from ${prixMin}` : ''}, one-off or on a monthly plan, anywhere in ${communs.en.zone}.`,
  },
  intro: {
    titre: 'Your cleaner, booked from your phone',
    paragraphes: [
      `Finding a cleaner you can trust in Casablanca often means relying on word of mouth, classified ads and trying out several people. With ${NOM}, you book a selected professional directly in the app, at a time that suits you.`,
      'The price depends on the size of your home and the package you choose. It is shown before you book: no quote to wait for and no negotiating on arrival. You pay in the app and follow your request from your account.',
    ],
  },
  inclus: {
    titre: 'What your cleaner does',
    elements: {
      'Entretien des pièces de vie et des chambres': 'Living areas and bedrooms',
      'Cuisine : plans de travail, extérieur des équipements, évier':
        'Kitchen: worktops, outside of appliances, sink',
      'Salle de bain et sanitaires': 'Bathroom and toilets',
      'Sols aspirés et lavés': 'Floors vacuumed and mopped',
      'Poussières sur les surfaces accessibles': 'Dusting of accessible surfaces',
    },
    options:
      'Available as options: ironing, terrace or balcony, very dirty oven and fridge, sofa and carpet shampooing, extra hour. The exact details are confirmed when you book, depending on your home and your instructions.',
  },
  reserver: {
    titre: 'Book in the app',
    texte: 'Package, time slot, instructions and payment: everything happens in one place.',
  },
  prix: {
    titre: 'How much does a maid cost in Casablanca?',
    texte: 'The prices in the app, by size of home. Options are added to the price of the package.',
    legende: 'Home cleaning prices in Casablanca',
    colonnes: { logement: 'Home', formule: 'Package', detail: 'Details', prix: 'Price' },
    lien: 'See detailed prices and options',
  },
  formules: {
    titre: 'One-off or regular: your choice',
    texte:
      'A helping hand before you have guests, a fixed routine every week or a complete refresh of your home: every need has its service.',
    prestations: {
      'nettoyage-ponctuel': 'For a specific need, with no commitment.',
      'nettoyage-regulier': 'A scheduled visit, at the frequency you set.',
      'grand-nettoyage': 'A complete refresh of your home.',
      'nettoyage-apres-demenagement': 'When moving in or moving out.',
    },
  },
  zones: {
    titre: `Across ${communs.en.zone}`,
    texte: (quartiers, alentours) =>
      `${NOM} works throughout Casablanca, from the city centre to residential neighbourhoods: ${quartiers} and every other neighbourhood in the city, as well as in the surrounding area: ${alentours}. Availability of a time slot at your address is confirmed in the app when you book.`,
  },
  etapes: {
    titre: 'How to book your cleaner',
    liste: [
      `Download the ${NOM} app on iPhone or Android.`,
      'Choose the size of your home and the package: express, full, deep or prestige cleaning.',
      'Enter your address, the date, the time slot and any instructions.',
      'Confirm: the price is shown before you finalise the booking, and you follow your request from your account.',
    ],
  },
  questions: {
    titre: 'Frequently asked questions',
    lienCanape: 'Sofa and carpet cleaning',
    lienToutes: 'All questions',
    prix: {
      question: 'How much does a maid cost in Casablanca?',
      element: ({ nom, prix, duree }) =>
        `${prix} for ${nom.toLowerCase()}${duree ? ` (${duree})` : ''}`,
      reponse: (express, suite) =>
        `At ${NOM}, express cleaning starts at ${express.prix}${express.duree ? ` for ${express.duree}` : ''} in a studio or small apartment.${suite ? ` After that, allow ${suite}.` : ''}`,
      complement:
        'The exact price of your cleaning and of the options you choose is shown in the app before you confirm the booking.',
    },
    reguliere: {
      question: 'Can I have a cleaner every week?',
      reponse:
        'Yes, with the monthly plan, which groups several cleanings each month at a lower price than the same cleanings booked one by one.',
    },
    quartiers: {
      question: `Do you cover all of ${communs.en.zone}?`,
      reponse: (alentours) =>
        `Yes, ${NOM} works throughout Casablanca and in the surrounding area: ${alentours}. Availability of a time slot at your address is confirmed in the app when you book.`,
    },
    reserver: {
      question: 'How do I book a maid?',
      reponse: `Download the ${NOM} app on iPhone or Android, choose your package, the date and the time slot, then confirm. You book and pay for your cleaning in the app, and follow your request from your account.`,
    },
    expressComplet: {
      question: 'What is the difference between express and full cleaning?',
      reponse:
        'Express cleaning is a quick maintenance clean to keep your home tidy. Full, deep and prestige cleaning are more thorough and take longer: the duration of each package is shown with its price.',
    },
  },
  schema: {
    nomPage: `Maid and house cleaner in Casablanca — ${NOM}`,
    descriptionPage: `Book a maid in Casablanca in the ${NOM} app: packages, prices, areas covered and frequently asked questions.`,
    nomService: 'Maid and house cleaner in Casablanca',
    typeService: 'Maid service',
  },
};

const arabe: TextesFemmeDeMenage = {
  meta: {
    titre: (prixMin) =>
      `عاملة نظافة بالدار البيضاء${prixMin ? ` ابتداءً من ${prixMin}` : ''} | Najem`,
    description: (prixMin) =>
      `احجز عاملة نظافة بالدار البيضاء في دقائق: تنظيف سريع${prixMin ? ` ابتداءً من ${prixMin}` : ''}، أو تنظيف شامل أو عميق، أو اشتراك شهري، من تطبيق Najem.`,
  },
  fil: { accueil: 'الرئيسية', page: 'عاملة نظافة بالدار البيضاء', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'تنظيف المنازل بالدار البيضاء',
    titre: 'عاملة نظافة في منزلك بالدار البيضاء',
    chapo: (prixMin) =>
      `احجز عاملة النظافة في دقائق من تطبيق ${NOM}${prixMin ? `: تنظيف سريع ابتداءً من ${prixMin}` : ''}، لمرة واحدة أو باشتراك شهري، في كل أنحاء ${communs.ar.zone}.`,
  },
  intro: {
    titre: 'عاملة نظافة تحجزها من هاتفك',
    paragraphes: [
      `غالبا ما يتطلب العثور على عاملة نظافة تثق بها في الدار البيضاء الاعتماد على توصيات المعارف، وتصفح الإعلانات، وتجربة أكثر من شخص. مع ${NOM}، تحجز مباشرة من التطبيق محترفا مختارا، في الموعد الذي يناسبك.`,
      'يتوقف السعر على حجم مسكنك والباقة التي تختارها، ويظهر قبل الحجز: لا انتظار لعرض سعر، ولا تفاوض عند الوصول. تدفع داخل التطبيق وتتابع طلبك من حسابك.',
    ],
  },
  inclus: {
    titre: 'ما تقوم به عاملة النظافة',
    elements: {
      'Entretien des pièces de vie et des chambres': 'تنظيف غرف المعيشة وغرف النوم',
      'Cuisine : plans de travail, extérieur des équipements, évier':
        'المطبخ: أسطح العمل، والجهة الخارجية للأجهزة، والمغسلة',
      'Salle de bain et sanitaires': 'الحمّام والمراحيض',
      'Sols aspirés et lavés': 'شفط الأرضيات ومسحها',
      'Poussières sur les surfaces accessibles': 'إزالة الغبار عن الأسطح التي يمكن الوصول إليها',
    },
    options:
      'خيارات إضافية: الكي، التراس أو الشرفة، الفرن والثلاجة المتسخان جدا، غسل الأرائك والزرابي بالآلة، ساعة إضافية. تُؤكَّد التفاصيل الدقيقة عند الحجز، حسب مسكنك وتعليماتك.',
  },
  reserver: {
    titre: 'احجز من التطبيق',
    texte: 'الباقة، والموعد، والتعليمات، والدفع: كل شيء يتم في مكان واحد.',
  },
  prix: {
    titre: 'كم تكلّف عاملة النظافة بالدار البيضاء؟',
    texte: 'أسعار التطبيق حسب حجم المسكن. تُضاف الخيارات إلى سعر الباقة.',
    legende: 'أسعار تنظيف المنازل بالدار البيضاء',
    colonnes: { logement: 'المسكن', formule: 'الباقة', detail: 'التفاصيل', prix: 'السعر' },
    lien: 'اطّلع على تفاصيل الأسعار والخيارات',
  },
  formules: {
    titre: 'لمرة واحدة أو بانتظام: الاختيار لك',
    texte:
      'مساعدة قبل استقبال الضيوف، أو وتيرة ثابتة كل أسبوع، أو تجديد شامل لنظافة مسكنك: لكل حاجة خدمتها.',
    prestations: {
      'nettoyage-ponctuel': 'لحاجة محددة، دون أي التزام.',
      'nettoyage-regulier': 'زيارة مبرمجة، بالوتيرة التي تحددها.',
      'grand-nettoyage': 'تجديد شامل لنظافة المسكن.',
      'nettoyage-apres-demenagement': 'عند دخول المسكن أو مغادرته.',
    },
  },
  zones: {
    titre: `في كل أنحاء ${communs.ar.zone}`,
    texte: (quartiers, alentours) =>
      `تعمل ${NOM} في جميع أنحاء الدار البيضاء، من وسط المدينة إلى الأحياء السكنية: ${quartiers} وباقي أحياء المدينة، وكذلك في نواحيها: ${alentours}. يُؤكَّد توفر موعد في عنوانك داخل التطبيق عند الحجز.`,
  },
  etapes: {
    titre: 'كيف تحجز عاملة النظافة',
    liste: [
      `حمّل تطبيق ${NOM} على الآيفون أو الأندرويد.`,
      'اختر حجم مسكنك والباقة: تنظيف سريع، أو شامل، أو عميق، أو فاخر.',
      'أدخل عنوانك والتاريخ والموعد وتعليماتك إن وُجدت.',
      'أكّد: يظهر السعر قبل تأكيد الحجز، وتتابع طلبك من حسابك.',
    ],
  },
  questions: {
    titre: 'الأسئلة الشائعة',
    lienCanape: 'تنظيف الأرائك والزرابي',
    lienToutes: 'كل الأسئلة',
    prix: {
      question: 'كم تكلّف عاملة النظافة بالدار البيضاء؟',
      element: ({ nom, prix, duree }) => `${nom} بـ${prix}${duree ? ` (${duree})` : ''}`,
      reponse: (express, suite) =>
        `لدى ${NOM}، يبدأ التنظيف السريع في استوديو أو شقة صغيرة من ${express.prix}${express.duree ? `، ومدته ${express.duree}` : ''}.${suite ? ` وبعده تأتي الباقات الأخرى: ${suite}.` : ''}`,
      complement: 'يظهر السعر الدقيق للتنظيف وللخيارات التي تختارها في التطبيق قبل أن تؤكد الحجز.',
    },
    reguliere: {
      question: 'هل يمكنني الحصول على عاملة نظافة كل أسبوع؟',
      reponse:
        'نعم، مع الاشتراك الشهري الذي يجمع عدة حصص تنظيف كل شهر، بسعر أقل من سعر الحصص نفسها عند حجزها واحدة تلو الأخرى.',
    },
    quartiers: {
      question: `هل تعملون في كل أنحاء ${communs.ar.zone}؟`,
      reponse: (alentours) =>
        `نعم، تعمل ${NOM} في جميع أنحاء الدار البيضاء وفي نواحيها: ${alentours}. يُؤكَّد توفر موعد في عنوانك داخل التطبيق عند الحجز.`,
    },
    reserver: {
      question: 'كيف أحجز عاملة نظافة؟',
      reponse: `حمّل تطبيق ${NOM} على الآيفون أو الأندرويد، واختر الباقة والتاريخ والموعد، ثم أكّد. تحجز التنظيف وتدفع ثمنه داخل التطبيق، وتتابع طلبك من حسابك.`,
    },
    expressComplet: {
      question: 'ما الفرق بين التنظيف السريع والتنظيف الشامل؟',
      reponse:
        'التنظيف السريع عناية سريعة للحفاظ على نظافة المسكن. أما التنظيف الشامل والتنظيف العميق والتنظيف الفاخر فهي أعمق وتستغرق وقتا أطول: مدة كل باقة مذكورة مع سعرها.',
    },
  },
  schema: {
    nomPage: `عاملة نظافة في منزلك بالدار البيضاء — ${NOM}`,
    descriptionPage: `احجز عاملة نظافة بالدار البيضاء من تطبيق ${NOM}: الباقات، والأسعار، والمناطق المخدومة، والأسئلة الشائعة.`,
    nomService: 'عاملة نظافة في منزلك بالدار البيضاء',
    typeService: 'خدمة عاملة النظافة',
  },
};

export const textesFemmeDeMenage: Record<LangueTraduite, TextesFemmeDeMenage> = {
  ar: arabe,
  en: anglais,
};
