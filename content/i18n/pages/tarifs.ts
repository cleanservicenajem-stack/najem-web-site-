import type { LangueTraduite } from '@/config/i18n';

/**
 * Textes de la page Tarifs traduite (/ar/tarifs, /en/tarifs).
 *
 * Chaque texte traduit celui de app/(site)/tarifs/page.tsx. Les noms des
 * catégories, des formules et des options, les prix et les durées n'y figurent
 * pas : ils viennent de la grille de l'administration et de
 * content/i18n/commun.ts, comme sur la page française.
 */

/** Valeurs de la réponse « Combien coûte un ménage ? », déjà traduites et formatées. */
export type FormuleDeDepart = {
  prix: string;
  formule: string;
  /** Vide si la durée de l'administration est illisible. */
  duree: string;
  categorie: string;
};

export type TextesTarifs = {
  seo: {
    titre: string;
    /**
     * Prix de la formule la moins chère et du premier abonnement, formatés ;
     * `null` quand le montant est illisible (la mention disparaît alors).
     */
    description: (prix: { formule: string | null; abonnement: string | null }) => string;
  };
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; introduction: string };
  /** Nom de la page dans les données structurées. */
  nomPage: string;
  carte: { options: string; aucuneOption: string };
  /** Description de chaque formule, par identifiant (config/tarifs.ts). */
  descriptions: Record<string, string>;
  /** « Soit 60 DH d’économie par mois… » ; reçoit le montant formaté. */
  economie: (montant: string) => string;
  /** Prestation seule, recharges et fidélité ; reçoit des montants formatés. */
  complements: {
    titre: string;
    shampouineuse: { titre: string; seule: (prix: string) => string; supplement: (prix: string) => string };
    recharges: {
      titre: string;
      ligne: (recharge: { paye: string; credit: string; bonus: string }) => string;
    };
    fidelite: { titre: string; texte: (prestations: number) => string };
  };
  autres: { titre: string; texte: string; lien: string };
  questions: {
    titre: string;
    prixMenage: { question: string; reponse: (depart: FormuleDeDepart) => string };
    expressComplet: { question: string; reponse: string };
    abonnement: { question: string };
    options: { question: string; reponse: string };
    reservation: { question: string; reponse: string };
  };
  schema: { nomService: string; typeService: string; nomCatalogue: string; uniteMois: string };
};

const anglais: TextesTarifs = {
  seo: {
    titre: 'Home cleaning prices in Casablanca',
    description: ({ formule, abonnement }) =>
      `Home cleaning in Casablanca${formule ? ` from ${formule}` : ''}: express, full, deep or prestige cleaning, plus monthly plans${abonnement ? ` from ${abonnement}` : ''}. See all our prices.`,
  },
  fil: { accueil: 'Home', page: 'Prices', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Prices',
    titre: 'Home cleaning prices in Casablanca',
    introduction:
      'The price depends on the size of your home and the package you choose. These are the prices in the Najem Clean Service app, where you book and pay for your cleaning.',
  },
  nomPage: 'Home cleaning prices in Casablanca — Najem Clean Service',
  carte: { options: 'Options', aucuneOption: 'No options' },
  descriptions: {
    'studio-express': 'A quick, efficient freshen-up for studios and small apartments.',
    'studio-complet': 'A thorough clean for studios and small apartments, for a spotless home.',
    'appartement-express': 'A quick, efficient freshen-up for apartments with up to 3 bedrooms.',
    'appartement-complet': 'A thorough clean for apartments with up to 3 bedrooms.',
    'grand-express': 'A quick, efficient clean for large spaces, ideal between two bookings.',
    'grand-menage': 'A complete clean for large apartments and villas with up to 5 bedrooms.',
    'tres-grand-complet': 'A thorough clean for very large properties.',
    'tres-grand-express': 'A quick maintenance clean for very large properties.',
    'tres-grand-prestige':
      'Our most complete package, designed for large villas and high-end homes.',
  },
  economie: (montant) =>
    `That’s ${montant} saved each month compared with booking the same cleanings one by one.`,
  complements: {
    titre: 'Single service, wallet top-ups and loyalty',
    shampouineuse: {
      titre: 'Shampooing on its own',
      seule: (prix) => `Sofa, carpet or mattress: ${prix} per item (1 h).`,
      supplement: (prix) => `Each extra item: ${prix} (1 h).`,
    },
    recharges: {
      titre: 'Wallet top-ups',
      ligne: ({ paye, credit, bonus }) => `Pay ${paye}, get ${credit} of credit (+${bonus}).`,
    },
    fidelite: {
      titre: 'Loyalty card',
      texte: (prestations) => `After ${prestations} cleanings, the next one is free.`,
    },
  },
  autres: {
    titre: 'Another need?',
    texte:
      'For a request that is not in the app, ask us for a quote. Businesses can switch to a professional account in the app.',
    lien: 'Request a quote',
  },
  questions: {
    titre: 'Questions about prices',
    prixMenage: {
      question: 'How much does home cleaning cost in Casablanca?',
      reponse: ({ prix, formule, duree, categorie }) =>
        `From ${prix}: that’s the price of ${formule.toLowerCase()}${duree ? ` (${duree})` : ''} in the “${categorie}” category. Beyond that, the price depends on the size of your home and the package you choose.`,
    },
    expressComplet: {
      question: 'What’s the difference between express cleaning and the other packages?',
      reponse:
        'Express cleaning is a quick clean to keep your home tidy. Full cleaning, deep cleaning and prestige cleaning go further and take longer: the duration of each package is shown with its price.',
    },
    abonnement: { question: 'How much does the monthly plan cost?' },
    options: {
      question: 'Are options included in the price?',
      reponse:
        'No, they are added to the price of the package: ironing, terrace or balcony, very dirty oven and fridge, sofa and carpet shampooing, extra hour. Their price is shown under each package.',
    },
    reservation: {
      question: 'Where do I book and pay?',
      reponse:
        'In the Najem Clean Service app, on iPhone and Android. The price of your cleaning and of the options you choose is shown before you confirm your booking.',
    },
  },
  schema: {
    nomService: 'Home cleaning in Casablanca',
    typeService: 'Home cleaning',
    nomCatalogue: 'Najem Clean Service prices',
    uniteMois: 'month',
  },
};

const arabe: TextesTarifs = {
  seo: {
    titre: 'أسعار تنظيف المنازل بالدار البيضاء',
    description: ({ formule, abonnement }) =>
      `تنظيف المنازل بالدار البيضاء${formule ? ` ابتداءً من ${formule}` : ''}: تنظيف سريع أو شامل أو عميق أو فاخر، واشتراك شهري${abonnement ? ` ابتداءً من ${abonnement}` : ''}. اطّلع على جميع أسعارنا.`,
  },
  fil: { accueil: 'الرئيسية', page: 'الأسعار', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'الأسعار',
    titre: 'أسعار تنظيف المنازل في الدار البيضاء',
    introduction:
      'يتوقف السعر على حجم مسكنك والباقة التي تختارها. هذه هي الأسعار المعتمدة في تطبيق Najem Clean Service، حيث تحجز خدمة التنظيف وتدفع ثمنها.',
  },
  nomPage: 'أسعار تنظيف المنازل في الدار البيضاء — Najem Clean Service',
  carte: { options: 'الخيارات الإضافية', aucuneOption: 'لا توجد خيارات إضافية' },
  descriptions: {
    'studio-express': 'تجديد سريع وفعّال لنظافة الاستوديوهات والشقق الصغيرة.',
    'studio-complet': 'تنظيف دقيق للاستوديوهات والشقق الصغيرة، من أجل مسكن نظيف تماما.',
    'appartement-express': 'تجديد سريع وفعّال لنظافة الشقق حتى 3 غرف نوم.',
    'appartement-complet': 'تنظيف دقيق للشقق حتى 3 غرف نوم.',
    'grand-express': 'تنظيف سريع وفعّال للمساحات الكبيرة، مثالي بين حجزين.',
    'grand-menage': 'تنظيف كامل للشقق الكبيرة والفيلات حتى 5 غرف نوم.',
    'tres-grand-complet': 'تنظيف دقيق للعقارات الكبيرة جدا.',
    'tres-grand-express': 'تنظيف روتيني سريع للعقارات الكبيرة جدا.',
    'tres-grand-prestige': 'باقتنا الأشمل، مصممة للفيلات الكبيرة والمساكن الراقية.',
  },
  economie: (montant) =>
    `أي توفير ${montant} في الشهر مقارنة بحجز عمليات التنظيف نفسها كلٌّ على حدة.`,
  complements: {
    titre: 'خدمة مستقلة، وشحن المحفظة، وبطاقة الوفاء',
    shampouineuse: {
      titre: 'الغسل بالآلة وحده',
      seule: (prix) => `أريكة أو زربية أو مرتبة: ${prix} للقطعة (ساعة واحدة).`,
      supplement: (prix) => `كل قطعة إضافية: ${prix} (ساعة واحدة).`,
    },
    recharges: {
      titre: 'شحن المحفظة',
      ligne: ({ paye, credit, bonus }) => `ادفع ${paye} واحصل على رصيد ${credit} (+${bonus}).`,
    },
    fidelite: {
      titre: 'بطاقة الوفاء',
      texte: (prestations) => `بعد ${prestations} خدمات، تكون الخدمة التالية مجانية.`,
    },
  },
  autres: {
    titre: 'حاجة أخرى؟',
    texte:
      'إذا كان طلبك غير موجود في التطبيق، اطلب منا عرض سعر. ويمكن للمهنيين التحويل إلى حساب مهني داخل التطبيق.',
    lien: 'طلب عرض سعر',
  },
  questions: {
    titre: 'أسئلة حول الأسعار',
    prixMenage: {
      question: 'كم يكلف تنظيف المنزل في الدار البيضاء؟',
      reponse: ({ prix, formule, duree, categorie }) =>
        `ابتداءً من ${prix}: هذا هو سعر « ${formule} »${duree ? ` (${duree})` : ''} في فئة « ${categorie} ». بعد ذلك، يتوقف السعر على حجم المسكن والباقة المختارة.`,
    },
    expressComplet: {
      question: 'ما الفرق بين التنظيف السريع والباقات الأخرى؟',
      reponse:
        'التنظيف السريع عناية سريعة للحفاظ على نظافة المسكن. أما التنظيف الشامل والتنظيف العميق والتنظيف الفاخر فهي أكثر تعمقا وتستغرق وقتا أطول: مدة كل باقة مبيّنة مع سعرها.',
    },
    abonnement: { question: 'كم يكلف الاشتراك الشهري؟' },
    options: {
      question: 'هل الخيارات الإضافية مشمولة في السعر؟',
      reponse:
        'لا، فهي تُضاف إلى سعر الباقة: الكي، والتراس أو الشرفة، والفرن والثلاجة المتسخان جدا، وغسل الأرائك والزرابي بالآلة، والساعة الإضافية. وسعرها مبيّن تحت كل باقة.',
    },
    reservation: {
      question: 'أين أحجز وأدفع؟',
      reponse:
        'في تطبيق Najem Clean Service، على الآيفون والأندرويد. يظهر سعر التنظيف والخيارات التي اخترتها قبل أن تؤكد الحجز.',
    },
  },
  schema: {
    nomService: 'تنظيف المنازل في الدار البيضاء',
    typeService: 'تنظيف المنازل',
    nomCatalogue: 'أسعار Najem Clean Service',
    uniteMois: 'شهر',
  },
};

export const textesTarifs: Record<LangueTraduite, TextesTarifs> = { ar: arabe, en: anglais };
