import type { FaqCategory } from '@/config/faq';
import type { LangueTraduite } from '@/config/i18n';

/**
 * Textes de la page FAQ traduite (/ar/faq, /en/faq) : titres des groupes,
 * chapeaux, encadrés. Les questions elles-mêmes viennent de
 * content/i18n/faq.ts (`faqTraduite`).
 */

/** Groupes de questions, dans l'ordre de la page française. */
export const ordreGroupesFaq: readonly FaqCategory[] = [
  'general',
  'application',
  'pratique',
  'service',
];

export type TextesPageFaq = {
  seo: { titre: string; description: string };
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; introduction: string };
  sommaire: { navigation: string; titre: string };
  groupes: Record<FaqCategory, { titre: string; introduction: string }>;
  aide: { titre: string; texte: string; lien: string };
  application: { titre: string; texte: string };
  /** Nom de la page dans les données structurées. */
  nomPage: string;
};

const anglais: TextesPageFaq = {
  seo: {
    titre: 'Home cleaning in Casablanca: FAQ',
    description:
      'Booking, payment, cancellation, changing your time slot, monthly plans: all the answers about home cleaning with Najem Clean Service.',
  },
  fil: { accueil: 'Home', page: 'FAQ', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Help',
    titre: 'Frequently asked questions',
    introduction:
      'The answers below cover the essentials of the service. Where something depends on conditions shown in the app, we say so explicitly.',
  },
  sommaire: { navigation: 'FAQ sections', titre: 'Contents' },
  groupes: {
    general: {
      titre: 'The service in general',
      introduction: 'How Najem Clean Service works and how to book a visit.',
    },
    application: {
      titre: 'The mobile app',
      introduction: 'Availability on iPhone and Android, and managing things from your account.',
    },
    pratique: {
      titre: 'Booking and payment',
      introduction: 'Changes, cancellations and payment terms.',
    },
    service: {
      titre: 'The visit',
      introduction: 'Who carries out the visit and under what conditions.',
    },
  },
  aide: {
    titre: 'Can’t find your answer?',
    texte:
      'Write to us from the contact page, or use the app if your question is about an ongoing booking.',
    lien: 'Go to the contact form',
  },
  application: {
    titre: 'It all starts with the app',
    texte:
      'Booking, changing an appointment and payment are all handled in the Najem Clean Service app.',
  },
  nomPage: 'Frequently asked questions — Najem Clean Service',
};

const arabe: TextesPageFaq = {
  seo: {
    titre: 'أسئلة حول تنظيف المنازل بالدار البيضاء',
    description:
      'الحجز، والدفع، والإلغاء، وتغيير الموعد، والاشتراك: كل الأجوبة حول خدمة تنظيف المنازل من Najem Clean Service.',
  },
  fil: { accueil: 'الرئيسية', page: 'الأسئلة الشائعة', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'مساعدة',
    titre: 'الأسئلة الشائعة',
    introduction:
      'تغطي الأجوبة التالية أهم ما يتعلق بالخدمة. وحين يتوقف أمر ما على شروط معروضة في التطبيق، نشير إلى ذلك صراحة.',
  },
  sommaire: { navigation: 'أقسام الأسئلة الشائعة', titre: 'المحتويات' },
  groupes: {
    general: {
      titre: 'الخدمة بشكل عام',
      introduction: 'كيف تعمل Najem Clean Service وكيف تحجز تدخلا.',
    },
    application: {
      titre: 'تطبيق الهاتف',
      introduction: 'التوفر على الآيفون والأندرويد، والإدارة من حسابك.',
    },
    pratique: {
      titre: 'الحجز والدفع',
      introduction: 'التعديل والإلغاء وطرق الدفع.',
    },
    service: {
      titre: 'التدخل',
      introduction: 'من يقوم بالتدخل وبأي شروط.',
    },
  },
  aide: {
    titre: 'لم تجد جوابك؟',
    texte: 'راسلنا من صفحة « اتصل بنا »، أو استعمل التطبيق إذا كان سؤالك يتعلق بحجز جارٍ.',
    lien: 'الانتقال إلى استمارة الاتصال',
  },
  application: {
    titre: 'كل شيء يبدأ من التطبيق',
    texte: 'الحجز، وتعديل الموعد، والدفع: كلها تتم من تطبيق Najem Clean Service.',
  },
  nomPage: 'الأسئلة الشائعة — Najem Clean Service',
};

export const textesPageFaq: Record<LangueTraduite, TextesPageFaq> = { ar: arabe, en: anglais };
