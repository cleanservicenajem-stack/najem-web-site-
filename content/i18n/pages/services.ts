import type { LangueTraduite } from '@/config/i18n';
import { siteConfig } from '@/config/site';

/**
 * Textes de /ar/services et /en/services, et des parties communes à chaque
 * page de prestation (/ar/services/<slug>, /en/services/<slug>). Ce qui est
 * propre à une prestation (titre, résumé, contenu…) est dans
 * content/i18n/services.ts.
 */
export type TextesPagesServices = {
  /** Fil d'Ariane (visible et données structurées). */
  fil: {
    accueil: string;
    services: string;
    /** Nom du fil d'Ariane pour les lecteurs d'écran. */
    libelle: string;
  };
  /** Page liste (app/(site)/services/page.tsx). */
  liste: {
    /** Traduction du titre et de la description de l'administration (seo.services). */
    meta: { titre: string; description: string };
    surtitre: string;
    titre: string;
    chapo: string;
    /** Nom de la liste des prestations pour les lecteurs d'écran. */
    libelleListe: string;
    /** Encadré « Une demande qui ne rentre dans aucune case ? ». */
    horsCase: { titre: string; texte: string };
    /** Nom de la page dans les données structurées. */
    nomPage: string;
  };
  /** Parties fixes d'une page de prestation (app/(site)/services/[slug]/page.tsx). */
  prestation: {
    /** Métadonnées d'une adresse inconnue. */
    introuvable: { titre: string; description: string };
    /** « Zones d'intervention » : zone (« Casablanca et ses alentours ») et villes autour. */
    zones: { titre: string; texte: (zone: string, alentours: string) => string };
    /** « Ce que couvre la prestation ». */
    contenu: { titre: string; texte: string };
    /** « Dans quelles situations ? ». */
    situations: string;
    /** « Comment réserver cette prestation » : étapes, avec le nom de la prestation. */
    reservation: { titre: string; etapes: (prestation: string) => string[] };
    /** Encadré « Réserver depuis l'application » et ses deux liens. */
    encart: { titre: string; texte: string; tarifs: string; femmeDeMenage: string };
    /** « Autres prestations ». */
    autres: string;
  };
  /** Données structurées des prestations. */
  schema: {
    /** Canal de réservation : « Application Najem Clean Service ». */
    application: string;
    /** Pays des villes desservies (« Maroc »). */
    pays: string;
  };
};

const anglais: TextesPagesServices = {
  fil: { accueil: 'Home', services: 'Services', libelle: 'Breadcrumb' },
  liste: {
    meta: {
      titre: 'Home Cleaning Services in Casablanca',
      description:
        'Home cleaning in Casablanca: express, full and deep cleaning, monthly plans, windows, ironing, carpets and sofas, for households and businesses.',
    },
    surtitre: 'Our services',
    titre: 'Cleaning services in Casablanca by Najem Clean Service',
    chapo:
      'From routine cleaning to more thorough visits, for households and businesses alike. Every service is available in Casablanca and the surrounding area, and is booked through the app.',
    libelleListe: 'List of services',
    horsCase: {
      titre: 'Need something that doesn’t fit any of these?',
      texte:
        'Describe what you need when you book in the app, or write to us from the contact page. Feasibility is confirmed based on the request and the professionals available.',
    },
    nomPage: `Home cleaning services in Casablanca — ${siteConfig.name}`,
  },
  prestation: {
    introuvable: {
      titre: 'Service not found',
      description: 'This service does not exist or is no longer offered.',
    },
    zones: {
      titre: 'Service areas',
      texte: (zone, alentours) =>
        `This service is available in ${zone}${alentours ? ` (${alentours})` : ''}. The availability of a time slot at your address is confirmed in the app when you book.`,
    },
    contenu: {
      titre: 'What the service covers',
      texte:
        'The exact details are confirmed when you book, depending on the property and the instructions you give.',
    },
    situations: 'When is it useful?',
    reservation: {
      titre: 'How to book this service',
      etapes: (prestation) => [
        'Download the Najem Clean Service app on iPhone or Android.',
        `Select the “${prestation}” service.`,
        'Enter your address, your availability and any instructions.',
        'Confirm your request, then track it from your account.',
      ],
    },
    encart: {
      titre: 'Book through the app',
      texte: 'Bookings, appointments and messages are all handled in one place.',
      tarifs: 'See prices',
      femmeDeMenage: 'Cleaner in Casablanca',
    },
    autres: 'Other services',
  },
  schema: {
    application: `${siteConfig.name} app`,
    pays: 'Morocco',
  },
};

const arabe: TextesPagesServices = {
  fil: { accueil: 'الرئيسية', services: 'الخدمات', libelle: 'مسار التنقل' },
  liste: {
    meta: {
      titre: 'خدمات تنظيف المنازل بالدار البيضاء',
      description:
        'تنظيف المنازل بالدار البيضاء: تنظيف سريع وشامل وعميق، واشتراك شهري، والزجاج والكي والزرابي والأرائك، للأفراد والمهنيين.',
    },
    surtitre: 'خدماتنا',
    titre: `خدمات التنظيف التي تقدمها ${siteConfig.name} في الدار البيضاء`,
    chapo:
      'من التنظيف المعتاد إلى التدخلات الأكثر شمولا، للأفراد والمهنيين على حد سواء. جميع الخدمات متوفرة في الدار البيضاء ونواحيها، وتُحجز من التطبيق.',
    libelleListe: 'قائمة الخدمات',
    horsCase: {
      titre: 'لديك طلب لا يندرج ضمن هذه الخدمات؟',
      texte:
        'صِف حاجتك عند الحجز في التطبيق، أو راسلنا من صفحة « اتصل بنا ». يتم تأكيد إمكانية التنفيذ حسب الطلب والمحترفين المتاحين.',
    },
    nomPage: `خدمات تنظيف المنازل في الدار البيضاء — ${siteConfig.name}`,
  },
  prestation: {
    introuvable: {
      titre: 'الخدمة غير موجودة',
      description: 'هذه الخدمة غير موجودة أو لم تعد متوفرة.',
    },
    zones: {
      titre: 'مناطق التدخل',
      texte: (zone, alentours) =>
        `هذه الخدمة متوفرة في ${zone}${alentours ? ` (${alentours})` : ''}. يتم تأكيد توفر موعد في عنوانك داخل التطبيق، عند الحجز.`,
    },
    contenu: {
      titre: 'ما تشمله الخدمة',
      texte: 'تُؤكَّد التفاصيل الدقيقة عند الحجز، حسب المسكن المعني والتعليمات التي تقدمها.',
    },
    situations: 'متى تناسبك هذه الخدمة؟',
    reservation: {
      titre: 'كيف تحجز هذه الخدمة',
      etapes: (prestation) => [
        'حمّل تطبيق Najem Clean Service على الآيفون أو الأندرويد.',
        `اختر خدمة « ${prestation} ».`,
        'أدخل عنوانك والأوقات التي تناسبك وتعليماتك إن وُجدت.',
        'أكّد الطلب، ثم تابعه من حسابك.',
      ],
    },
    encart: {
      titre: 'احجز من التطبيق',
      texte: 'الحجز والمواعيد والتواصل، كل ذلك يُدار في مكان واحد.',
      tarifs: 'اطّلع على الأسعار',
      femmeDeMenage: 'عاملة نظافة في الدار البيضاء',
    },
    autres: 'خدمات أخرى',
  },
  schema: {
    application: `تطبيق ${siteConfig.name}`,
    pays: 'المغرب',
  },
};

export const textesPagesServices: Record<LangueTraduite, TextesPagesServices> = {
  ar: arabe,
  en: anglais,
};
