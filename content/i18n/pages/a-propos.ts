import type { LangueTraduite } from '@/config/i18n';

/**
 * Textes de la page À propos traduite (/ar/a-propos, /en/a-propos).
 *
 * Chaque texte traduit celui de app/(site)/a-propos/page.tsx ; la description
 * traduit celle de l'administration (seo.a-propos). Les identifiants légaux
 * (SARL, RC, ICE) restent tels quels.
 */

/** Valeurs, dans l'ordre de la page française. */
export const clesValeurs = ['confiance', 'simplicite', 'qualite', 'temps'] as const;

export type CleValeur = (typeof clesValeurs)[number];

type LibelleValeur = { libelle: string; valeur: string };

export type TextesAPropos = {
  seo: { titre: string; description: string };
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; introduction: string };
  mission: { titre: string; paragraphes: string[] };
  vision: { titre: string; paragraphes: string[] };
  /** Fiche d'identité à côté du texte ; l'adresse du site se calcule. */
  fiche: {
    activite: LibelleValeur;
    canal: LibelleValeur;
    langue: LibelleValeur;
    site: string;
    boutiques: string;
  };
  valeurs: {
    surtitre: string;
    titre: string;
    introduction: string;
    liste: Record<CleValeur, { titre: string; texte: string }>;
  };
  plusLoin: {
    titre: string;
    liens: { services: string; application: string; faq: string; contact: string };
    /** Phrase finale : texte, lien vers la page Contact, suite (ponctuation comprise). */
    manque: { avant: string; lien: string; apres: string };
  };
};

const anglais: TextesAPropos = {
  seo: {
    titre: 'About us: home cleaning in Casablanca',
    description:
      'Home cleaning service in Casablanca for households and businesses. Najem Clean Service, a registered SARL (RC 712433, ICE 003894123000083).',
  },
  fil: { accueil: 'Home', page: 'About', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'About us',
    titre: 'About Najem Clean Service',
    introduction:
      'Najem Clean Service connects households with home cleaning professionals through a mobile app designed to make booking simple and clear.',
  },
  mission: {
    titre: 'Our mission',
    paragraphes: [
      'Finding someone reliable to look after your home often takes more energy than the cleaning itself: phone calls, schedules that don’t match, back-and-forth to agree on a time slot. The mission of Najem Clean Service is to reduce this process to a few clear steps.',
      'The app was created for this very reason: to bring the request, the appointment and the follow-up together in one place, so that getting organised no longer depends on anyone’s memory or availability.',
    ],
  },
  vision: {
    titre: 'Our vision',
    paragraphes: [
      'Booking a cleaning service should be as simple as booking a ride or a table: you choose, you confirm, you keep track. That is the direction the service is taking, one job at a time.',
      'This simplicity must take nothing away from the quality of the visit. The digital process is there to free up time, not to replace the work of a professional.',
    ],
  },
  fiche: {
    activite: { libelle: 'Business activity', valeur: 'Home cleaning services' },
    canal: { libelle: 'Booking channel', valeur: 'Mobile app for iOS and Android' },
    langue: { libelle: 'Service language', valeur: 'French' },
    site: 'Official website',
    boutiques: 'The app is listed on the App Store and Google Play under the name “Najem Clean Service”.',
  },
  valeurs: {
    surtitre: 'Values',
    titre: 'Four principles that guide the service.',
    introduction:
      'They translate into concrete choices: how the booking process is built, what is announced, and what is not announced until it has been verified.',
    liste: {
      confiance: {
        titre: 'Trust',
        texte:
          'Letting someone work in your home is no small thing. The service is built around that responsibility.',
      },
      simplicite: {
        titre: 'Simplicity',
        texte:
          'A short process, clear information, no unnecessary step between the need and the booking.',
      },
      qualite: {
        titre: 'Quality of service',
        texte: 'A useful visit is judged on its result and on how the request was handled.',
      },
      temps: {
        titre: 'Respect for your time',
        texte:
          'Booking should not become one more chore. The time you save is at the heart of the service.',
      },
    },
  },
  plusLoin: {
    titre: 'Find out more',
    liens: {
      services: 'Discover our services',
      application: 'See the app in detail',
      faq: 'Read the FAQ',
      contact: 'Write to us',
    },
    manque: {
      avant: 'Does any information seem to be missing from this page?',
      lien: 'Let us know',
      apres: ': information is only added here once it has been confirmed.',
    },
  },
};

const arabe: TextesAPropos = {
  seo: {
    titre: 'من نحن: تنظيف المنازل بالدار البيضاء',
    description:
      'خدمة تنظيف المنازل بالدار البيضاء للأفراد والمهنيين. Najem Clean Service، شركة SARL مسجلة (RC 712433، ICE 003894123000083).',
  },
  fil: { accueil: 'الرئيسية', page: 'من نحن', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'من نحن',
    titre: 'نبذة عن Najem Clean Service',
    introduction:
      'تربط Najem Clean Service الأسر بمحترفي التنظيف المنزلي عبر تطبيق على الهاتف، صُمّم ليجعل الحجز بسيطا وواضحا.',
  },
  mission: {
    titre: 'رسالتنا',
    paragraphes: [
      'كثيرا ما يتطلب العثور على شخص موثوق للعناية بمسكنك جهدا أكبر من التنظيف نفسه: مكالمات، وأوقات لا تتوافق، وأخذ ورد للاتفاق على موعد. ورسالة Najem Clean Service هي اختصار هذا المسار في بضع خطوات واضحة.',
      'ولهذا السبب تحديدا أُنشئ التطبيق: ليجمع في مكان واحد الطلب والموعد والمتابعة، حتى لا يبقى التنظيم متوقفا على ذاكرة كل طرف أو على مدى تفرّغه.',
    ],
  },
  vision: {
    titre: 'رؤيتنا',
    paragraphes: [
      'ينبغي أن يكون حجز خدمة تنظيف بسيطا كحجز رحلة أو طاولة في مطعم: تختار، ثم تؤكد، ثم تتابع. وهذا هو الاتجاه الذي تسير فيه الخدمة، خدمةً تلو الأخرى.',
      'ولا ينبغي لهذه البساطة أن تنقص شيئا من جودة التدخل. فالمسار الرقمي وُجد لتوفير الوقت، لا ليحل محل عمل المحترف.',
    ],
  },
  fiche: {
    activite: { libelle: 'النشاط', valeur: 'خدمات التنظيف المنزلي' },
    canal: { libelle: 'قناة الحجز', valeur: 'تطبيق للهاتف على الآيفون والأندرويد' },
    langue: { libelle: 'لغة الخدمة', valeur: 'الفرنسية' },
    site: 'الموقع الرسمي',
    boutiques: 'التطبيق مُدرج في App Store وGoogle Play باسم « Najem Clean Service ».',
  },
  valeurs: {
    surtitre: 'قيمنا',
    titre: 'أربعة مبادئ توجّه الخدمة.',
    introduction:
      'تتجلى هذه المبادئ في اختيارات ملموسة: طريقة بناء مسار الحجز، وما يُعلَن عنه، وما لا يُعلَن عنه ما دام لم يُتحقَّق منه.',
    liste: {
      confiance: {
        titre: 'الثقة',
        texte: 'استقبال شخص للعمل في بيتك ليس بالأمر الهيّن. وقد بُنيت الخدمة حول هذه المسؤولية.',
      },
      simplicite: {
        titre: 'البساطة',
        texte: 'مسار قصير، ومعلومات واضحة، ولا خطوة زائدة بين الحاجة والحجز.',
      },
      qualite: {
        titre: 'جودة الخدمة',
        texte: 'يُقاس التدخل المفيد بنتيجته وبطريقة التكفّل بالطلب.',
      },
      temps: {
        titre: 'احترام وقتك',
        texte: 'لا ينبغي أن يتحول الحجز إلى عبء إضافي. فالوقت الذي توفّره هو جوهر الخدمة.',
      },
    },
  },
  plusLoin: {
    titre: 'لمعرفة المزيد',
    liens: {
      services: 'اكتشف خدماتنا',
      application: 'تعرّف على التطبيق بالتفصيل',
      faq: 'اطّلع على الأسئلة الشائعة',
      contact: 'راسلنا',
    },
    manque: {
      avant: 'هل تبدو لك معلومة ناقصة في هذه الصفحة؟',
      lien: 'أخبرنا بذلك',
      apres: ': لا تُضاف المعلومات المنشورة هنا إلا بعد التأكد منها.',
    },
  },
};

export const textesAPropos: Record<LangueTraduite, TextesAPropos> = { ar: arabe, en: anglais };
