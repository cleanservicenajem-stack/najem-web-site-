import type { LangueTraduite } from '@/config/i18n';

/**
 * Textes de la page Application traduite (/ar/application, /en/application).
 *
 * Chaque texte traduit celui de app/(site)/application/page.tsx. Les captures
 * d'écran restent celles de l'application, qui est en français : seuls leurs
 * textes alternatifs sont traduits.
 */

/** Fonctionnalités, dans l'ordre de la page française. */
export const clesFonctionnalites = [
  'reserver',
  'rendezVous',
  'echanges',
  'paiement',
  'suivi',
] as const;

export type CleFonctionnalite = (typeof clesFonctionnalites)[number];

/** Étapes « Premiers pas », dans l'ordre de la page française. */
export const clesEtapes = ['installer', 'compte', 'reserver'] as const;

export type CleEtape = (typeof clesEtapes)[number];

type TitreTexte = { titre: string; texte: string };

export type TextesApplication = {
  seo: { titre: string; description: string };
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; introduction: string };
  aQuoiSert: { titre: string; texte: string };
  plateformes: {
    ios: { nom: string; detail: string };
    android: { nom: string; detail: string };
  };
  fonctionnalites: {
    surtitre: string;
    titre: string;
    liste: Record<CleFonctionnalite, TitreTexte>;
  };
  /** Textes alternatifs des deux captures d'écran. */
  ecrans: { reservation: string; mesReservations: string };
  demarrer: {
    surtitre: string;
    titre: string;
    introduction: string;
    etapes: Record<CleEtape, TitreTexte>;
  };
  faq: { surtitre: string; titre: string; lien: string };
  schema: { nomPage: string; descriptionApplication: string };
};

const anglais: TextesApplication = {
  seo: {
    titre: 'Home cleaning app in Casablanca',
    description:
      'Download the Najem Clean Service app on iPhone and Android: choose your time slot, then book and track your home cleaning in Casablanca.',
  },
  fil: { accueil: 'Home', page: 'App', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'iOS and Android',
    titre: 'The Najem Clean Service app',
    introduction:
      'The whole service fits in one app: booking, appointments, messages and tracking. It is free to download from the App Store and Google Play.',
  },
  aQuoiSert: {
    titre: 'What is the app for?',
    texte:
      'The Najem Clean Service app lets you book a home cleaning service in a few steps, then follow your request right up to the visit. It keeps your appointments, your messages and the history of your bookings. It is available on iPhone from the App Store and on Android from Google Play.',
  },
  plateformes: {
    ios: { nom: 'iPhone', detail: 'Available on the App Store' },
    android: { nom: 'Android', detail: 'Available on Google Play' },
  },
  fonctionnalites: {
    surtitre: 'Features',
    titre: 'What you can do from your phone.',
    liste: {
      reserver: {
        titre: 'Book a service',
        texte:
          'Choose the service, tell us which home it is for and when you are available, then send your request.',
      },
      rendezVous: {
        titre: 'Manage your appointments',
        texte: 'Your upcoming visits and your history remain available in your account.',
      },
      echanges: {
        titre: 'Keep in touch easily',
        texte: 'Messages about a visit go through the app, with no need to switch channels.',
      },
      paiement: {
        titre: 'Pay for your service',
        texte: 'The available payment methods are shown before you confirm your request.',
      },
      suivi: {
        titre: 'Track your request',
        texte: 'You can always see how your booking is progressing.',
      },
    },
  },
  ecrans: {
    reservation: 'Booking screen of the Najem Clean Service app: choosing the service',
    mesReservations: '“Mes réservations” (My bookings) screen of the Najem Clean Service app',
  },
  demarrer: {
    surtitre: 'First steps',
    titre: 'Getting started takes less than five minutes.',
    introduction:
      'Your account is created directly in the app. There is nothing to do on this site beforehand.',
    etapes: {
      installer: {
        titre: 'Install the app',
        texte: 'From the App Store on iPhone, or Google Play on Android.',
      },
      compte: {
        titre: 'Create your account',
        texte: 'The information we ask for is used to organise your visit.',
      },
      reserver: {
        titre: 'Book a service',
        texte: 'Choose the service and the time slot, then confirm your request.',
      },
    },
  },
  faq: {
    surtitre: 'App FAQ',
    titre: 'Frequently asked questions about the app.',
    lien: 'See all questions',
  },
  schema: {
    nomPage: 'Najem Clean Service mobile app — iOS and Android',
    descriptionApplication:
      'Najem Clean Service mobile app: booking a home cleaning service, managing appointments, messages about the visit and tracking requests.',
  },
};

const arabe: TextesApplication = {
  seo: {
    titre: 'تطبيق تنظيف المنازل بالدار البيضاء',
    description:
      'حمّل تطبيق Najem Clean Service على الآيفون والأندرويد: اختر موعدك، ثم احجز تنظيف منزلك بالدار البيضاء وتابعه.',
  },
  fil: { accueil: 'الرئيسية', page: 'التطبيق', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'iOS وAndroid',
    titre: 'تطبيق Najem Clean Service',
    introduction:
      'الخدمة كلها في تطبيق واحد: الحجز، والمواعيد، والمراسلات، والمتابعة. ويمكن تحميله مجانا من App Store وGoogle Play.',
  },
  aQuoiSert: {
    titre: 'ما فائدة التطبيق؟',
    texte:
      'يتيح لك تطبيق Najem Clean Service حجز خدمة تنظيف منزلي في بضع خطوات، ثم متابعة طلبك حتى موعد التدخل. تجد فيه مواعيدك ومراسلاتك وسجلّ حجوزاتك. وهو متوفر على الآيفون عبر App Store وعلى الأندرويد عبر Google Play.',
  },
  plateformes: {
    ios: { nom: 'آيفون', detail: 'متوفر على App Store' },
    android: { nom: 'أندرويد', detail: 'متوفر على Google Play' },
  },
  fonctionnalites: {
    surtitre: 'المزايا',
    titre: 'ما يمكنك القيام به من هاتفك.',
    liste: {
      reserver: {
        titre: 'حجز خدمة',
        texte: 'اختر الخدمة، وحدّد المسكن المعني والأوقات التي تناسبك، ثم أرسل طلبك.',
      },
      rendezVous: {
        titre: 'إدارة المواعيد',
        texte: 'تبقى تدخلاتك القادمة وسجلّك متاحة من حسابك.',
      },
      echanges: {
        titre: 'التواصل بسهولة',
        texte: 'تتم المراسلات المتعلقة بالتدخل من داخل التطبيق، دون الحاجة إلى تغيير وسيلة التواصل.',
      },
      paiement: {
        titre: 'دفع ثمن الخدمة',
        texte: 'تُعرض طرق الدفع المتاحة قبل تأكيد الطلب.',
      },
      suivi: {
        titre: 'متابعة الطلب',
        texte: 'تبقى على اطلاع على مدى تقدّم حجزك.',
      },
    },
  },
  ecrans: {
    reservation: 'شاشة الحجز في تطبيق Najem Clean Service: اختيار الخدمة',
    mesReservations: 'شاشة « Mes réservations » (حجوزاتي) في تطبيق Najem Clean Service',
  },
  demarrer: {
    surtitre: 'الخطوات الأولى',
    titre: 'البدء يستغرق أقل من خمس دقائق.',
    introduction: 'يُنشأ الحساب مباشرة داخل التطبيق، ولا يلزم أي إجراء مسبق على هذا الموقع.',
    etapes: {
      installer: {
        titre: 'تثبيت التطبيق',
        texte: 'من App Store على الآيفون، أو من Google Play على الأندرويد.',
      },
      compte: {
        titre: 'إنشاء حسابك',
        texte: 'تُستعمل المعلومات المطلوبة لتنظيم التدخل.',
      },
      reserver: {
        titre: 'حجز خدمة',
        texte: 'اختر الخدمة والموعد، ثم أكّد طلبك.',
      },
    },
  },
  faq: {
    surtitre: 'أسئلة حول التطبيق',
    titre: 'الأسئلة الشائعة حول التطبيق.',
    lien: 'عرض جميع الأسئلة',
  },
  schema: {
    nomPage: 'تطبيق Najem Clean Service للهاتف — iOS وAndroid',
    descriptionApplication:
      'تطبيق Najem Clean Service للهاتف: حجز خدمة تنظيف منزلي، وإدارة المواعيد، والمراسلات المتعلقة بالتدخل، ومتابعة الطلبات.',
  },
};

export const textesApplication: Record<LangueTraduite, TextesApplication> = {
  ar: arabe,
  en: anglais,
};
