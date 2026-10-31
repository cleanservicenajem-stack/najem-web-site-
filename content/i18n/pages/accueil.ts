import type { LangueTraduite } from '@/config/i18n';
import type { TextesAppSpotlight } from '@/components/home/AppSpotlight';
import type { TextesPresentation } from '@/components/home/BrandStatement';
import type { TextesHero } from '@/components/home/Hero';
import type { TextesServices } from '@/components/home/ServicesEditorial';
import type { TextesTemoignages } from '@/components/home/Testimonials';
import type { TextesConfiance } from '@/components/home/TrustSection';
import type { TextesPourquoi } from '@/components/home/WhyNajem';

/**
 * Textes de l'accueil traduit (/ar, /en).
 *
 * Chaque texte traduit celui de l'accueil français (app/(site)/page.tsx et les
 * sections de components/home). Le titre, l'accroche et le texte de
 * présentation traduisent les valeurs de l'administration. N'y figurent pas :
 * les prestations de la liste (content/i18n/services.ts, comme sur /services),
 * le prix de départ (grille tarifaire), les questions (content/i18n/faq.ts).
 */

/** Reçoit le prix de départ formaté (« 200 DH »), ou `null` s'il est illisible : la mention disparaît. */
type AvecPrix = (prix: string | null) => string;

export type TextesAccueil = {
  seo: { titre: string; description: AvecPrix };
  hero: {
    badge: string;
    /** Le seul titre de niveau 1 de la page. */
    titre: string;
    accroche: AvecPrix;
    textes: TextesHero;
  };
  presentation: TextesPresentation;
  services: TextesServices;
  pourquoi: TextesPourquoi;
  application: TextesAppSpotlight;
  confiance: TextesConfiance;
  temoignages: TextesTemoignages;
  faq: { surtitre: string; titre: string; introduction: string; lien: string };
  /** Nom et description de la page dans les données structurées. */
  schema: { nomPage: string; description: string };
};

const anglais: TextesAccueil = {
  seo: {
    titre: 'Home Cleaning & Maid Service in Casablanca | Najem',
    description: (prix) =>
      `A vetted cleaner in Casablanca${prix ? ` from ${prix}` : ''}, booked in 2 minutes: one-off cleaning, monthly plan or deep cleaning. iPhone and Android app.`,
  },
  hero: {
    badge: 'Your clean home, made simple.',
    titre: 'Home cleaning in Casablanca, simple and trustworthy.',
    accroche: (prix) =>
      `Book a vetted cleaner${prix ? ` from ${prix}` : ''} in three clicks on the Najem Clean Service app. Enjoy your time, we’ll take care of the rest.`,
    textes: {
      telecharger: 'Download the app',
      decouvrir: 'Explore our services',
      disponibilite: 'App available on iPhone and Android.',
      ecran: 'Home screen of the Najem Clean Service app',
    },
  },
  presentation: {
    titre: 'Who are we?',
    texte:
      'Najem Clean Service is a home cleaning team in Casablanca, for regular or one-off cleaning, deep cleaning, or move-in and move-out cleaning. Book and pay for your services, then receive your invoice directly in the app.',
    reperes: [
      { titre: 'A mobile app', texte: 'Available on iPhone and Android.' },
      { titre: 'Guided booking', texte: 'Service chosen, time slot selected, request sent.' },
      { titre: 'Home cleaning', texte: 'From routine upkeep to more thorough cleans.' },
    ],
  },
  services: {
    surtitre: 'Services',
    titre: 'A service for every situation.',
    introduction:
      'Every service is booked the same way in the app. The difference lies in the scope of the work and when you need it.',
    lien: 'See our services in detail',
  },
  pourquoi: {
    surtitre: 'Why Najem',
    titre: 'What actually changes for you.',
    introduction:
      'The aim isn’t to add yet another app to your phone, but to take one hassle out of your week.',
    atout: {
      titre: 'Simple booking',
      texte:
        'Schedule your cleaning service in a few steps in the app: the service, the date, the time slot. Nothing else to organise.',
    },
    etapes: ['Choose the service', 'Give your availability', 'Confirm the request'],
    avantages: [
      {
        titre: 'Trusted professionals',
        texte: 'Providers selected to offer a dependable, professional service.',
      },
      {
        titre: 'Simplified management',
        texte: 'View and manage your bookings directly from your account.',
      },
      {
        titre: 'Easy communication',
        texte: 'Get in touch more easily with your provider or customer service.',
      },
      {
        titre: 'Payment made simple',
        texte: 'A payment experience designed to stay clear and secure.',
      },
    ],
  },
  application: {
    surtitre: 'Mobile app',
    titre: 'Your whole cleaning service in your pocket.',
    introduction:
      'The app brings together everything you need before, during and after a visit. No back-and-forth between different channels: your request, your appointments and your messages are all in one place.',
    fonctionnalites: [
      { titre: 'Booking', texte: 'A short process, from choosing the service to confirmation.' },
      { titre: 'Appointments', texte: 'Your upcoming and past visits, together in your account.' },
      { titre: 'Communication', texte: 'Messages about your request stay in one place.' },
      { titre: 'Payment', texte: 'The available payment methods are shown before you confirm.' },
      { titre: 'Tracking', texte: 'You can always see how your request is progressing.' },
    ],
    ecrans: {
      mesReservations: 'Services and monthly plan screen of the Najem Clean Service app',
      reservation: 'Booking screen of the Najem Clean Service app: choosing the service',
    },
  },
  confiance: {
    titre: 'Letting someone into your home takes trust.',
    introduction:
      'That’s where the service begins. Everything that follows — the booking process, appointment tracking, messages — is designed so that you always know where your request stands.',
    piliers: [
      {
        titre: 'Carefully selected professionals',
        texte: 'Visits are entrusted to providers registered with Najem Clean Service.',
      },
      {
        titre: 'Simple, quick booking',
        texte: 'The process sticks to the essentials: the service, the date, the confirmation.',
      },
      {
        titre: 'An experience designed for your peace of mind',
        texte: 'Your requests, appointments and messages stay together in your account.',
      },
      {
        titre: 'Your time is precious',
        texte: 'The time you don’t spend organising the cleaning, you spend elsewhere.',
      },
    ],
  },
  temoignages: {
    surtitre: 'Customer feedback',
    titre: 'What people who use the service say.',
    // Aucun avis publié en français pour l'instant (config/testimonials.ts).
    avis: {},
  },
  faq: {
    surtitre: 'Frequently asked questions',
    titre: 'Answers to the questions we’re asked most.',
    introduction:
      'If you can’t find your answer here, the full FAQ and the contact form will take it from there.',
    lien: 'Read the full FAQ',
  },
  schema: {
    nomPage: 'Najem Clean Service — home cleaning services',
    description:
      'Overview of the Najem Clean Service home cleaning service and its iOS and Android mobile app.',
  },
};

const arabe: TextesAccueil = {
  seo: {
    titre: 'تنظيف المنازل وعاملة نظافة بالدار البيضاء | Najem',
    description: (prix) =>
      `عاملة نظافة تم التحقق منها بالدار البيضاء${prix ? ` ابتداءً من ${prix}` : ''}، تحجزها في دقيقتين: تنظيف لمرة واحدة أو اشتراك شهري أو تنظيف عميق. تطبيق للآيفون والأندرويد.`,
  },
  hero: {
    badge: 'منزلك نظيف، ببساطة.',
    titre: 'تنظيف المنازل بالدار البيضاء، خدمة بسيطة وموثوقة.',
    accroche: (prix) =>
      `احجز عاملة نظافة تم التحقق منها${prix ? ` ابتداءً من ${prix}` : ''}، بثلاث نقرات من تطبيق Najem Clean Service. استمتع بوقتك، ونحن نتكفّل بالباقي.`,
    textes: {
      telecharger: 'حمّل التطبيق',
      decouvrir: 'اكتشف خدماتنا',
      disponibilite: 'التطبيق متوفر على الآيفون والأندرويد.',
      ecran: 'الشاشة الرئيسية لتطبيق Najem Clean Service',
    },
  },
  presentation: {
    titre: 'من نحن؟',
    texte:
      'Najem Clean Service فريق للتنظيف المنزلي بالدار البيضاء، للتنظيف المنتظم أو لمرة واحدة، أو للتنظيف العميق، أو للتنظيف عند الانتقال. احجز خدماتك وادفع ثمنها، ثم استلم فاتورتك مباشرة في التطبيق.',
    reperes: [
      { titre: 'تطبيق على الهاتف', texte: 'متوفر على الآيفون والأندرويد.' },
      { titre: 'حجز موجَّه خطوة بخطوة', texte: 'تختار الخدمة، وتحدد الموعد، وترسل طلبك.' },
      { titre: 'تنظيف منزلي', texte: 'من التنظيف الاعتيادي إلى التدخلات الأشمل.' },
    ],
  },
  services: {
    surtitre: 'الخدمات',
    titre: 'خدمة لكل حاجة.',
    introduction:
      'تُحجز جميع الخدمات بالطريقة نفسها من التطبيق. ويكمن الفرق في حجم التدخل وفي الوقت الذي تحتاجه فيه.',
    lien: 'عرض تفاصيل الخدمات',
  },
  pourquoi: {
    surtitre: 'لماذا Najem',
    titre: 'ما يتغيّر فعلا بالنسبة إليك.',
    introduction: 'الهدف ليس إضافة تطبيق آخر إلى هاتفك، بل رفع عبء عن أسبوعك.',
    atout: {
      titre: 'حجز بسيط',
      texte:
        'خطّط لخدمة التنظيف في بضع خطوات من التطبيق: الخدمة، والتاريخ، والموعد. لا شيء آخر عليك تنظيمه.',
    },
    etapes: ['اختيار الخدمة', 'تحديد الأوقات التي تناسبك', 'تأكيد الطلب'],
    avantages: [
      {
        titre: 'محترفون موثوقون',
        texte: 'مقدّمو خدمات تم اختيارهم ليقدّموا عملا جادا واحترافيا.',
      },
      {
        titre: 'إدارة مبسّطة',
        texte: 'اطّلع على حجوزاتك وأدِرها مباشرة من حسابك.',
      },
      {
        titre: 'تواصل سهل',
        texte: 'تواصل بسهولة أكبر مع مقدّم الخدمة أو مع خدمة العملاء.',
      },
      {
        titre: 'دفع مصمَّم ليكون بسيطا',
        texte: 'تجربة دفع مصمَّمة لتبقى واضحة وآمنة.',
      },
    ],
  },
  application: {
    surtitre: 'تطبيق الهاتف',
    titre: 'خدمة التنظيف كلها في جيبك.',
    introduction:
      'يجمع التطبيق كل ما تحتاجه قبل التدخل وأثناءه وبعده. لا داعي للتنقل بين قنوات متعددة: طلبك ومواعيدك ومراسلاتك مجتمعة في مكان واحد.',
    fonctionnalites: [
      { titre: 'الحجز', texte: 'مسار قصير، من اختيار الخدمة إلى التأكيد.' },
      { titre: 'المواعيد', texte: 'تدخلاتك القادمة والسابقة، مجتمعة في حسابك.' },
      { titre: 'التواصل', texte: 'تبقى المراسلات المتعلقة بطلبك في مكان واحد.' },
      { titre: 'الدفع', texte: 'تُعرض طرق الدفع المتاحة قبل التأكيد.' },
      { titre: 'المتابعة', texte: 'تبقى على اطلاع دائم بتقدّم طلبك.' },
    ],
    ecrans: {
      mesReservations: 'شاشة الخدمات والاشتراك الشهري في تطبيق Najem Clean Service',
      reservation: 'شاشة الحجز في تطبيق Najem Clean Service: اختيار الخدمة',
    },
  },
  confiance: {
    titre: 'أن تفتح باب بيتك لشخص ما أمرٌ يتطلب الثقة.',
    introduction:
      'هذه نقطة انطلاق الخدمة. وكل ما يليها — مسار الحجز، ومتابعة المواعيد، والمراسلات — صُمّم لتعرف في كل لحظة أين وصل طلبك.',
    piliers: [
      {
        titre: 'محترفون مختارون بعناية',
        texte: 'تُسند التدخلات إلى مقدّمي خدمات مسجلين لدى Najem Clean Service.',
      },
      {
        titre: 'حجز بسيط وسريع',
        texte: 'يقتصر المسار على الأساسي: الخدمة، والتاريخ، والتأكيد.',
      },
      {
        titre: 'تجربة مصمَّمة لراحة بالك',
        texte: 'تبقى طلباتك ومواعيدك ومراسلاتك مجتمعة في حسابك.',
      },
      {
        titre: 'وقتك ثمين',
        texte: 'الوقت الذي لا تقضيه في تدبير شؤون التنظيف، تقضيه في أمور أخرى.',
      },
    ],
  },
  temoignages: {
    surtitre: 'آراء العملاء',
    titre: 'ما يقوله مستخدمو الخدمة.',
    // Aucun avis publié en français pour l'instant (config/testimonials.ts).
    avis: {},
  },
  faq: {
    surtitre: 'الأسئلة الشائعة',
    titre: 'أجوبة عن الأسئلة الأكثر طرحا.',
    introduction:
      'إذا لم تجد جوابك هنا، يمكنك الرجوع إلى الأسئلة الشائعة كاملة أو إلى استمارة الاتصال.',
    lien: 'عرض الأسئلة الشائعة كاملة',
  },
  schema: {
    nomPage: 'Najem Clean Service — خدمات التنظيف المنزلي',
    description:
      'تقديم خدمة التنظيف المنزلي Najem Clean Service وتطبيقها على الهاتف لنظامي iOS وAndroid.',
  },
};

export const textesAccueil: Record<LangueTraduite, TextesAccueil> = { ar: arabe, en: anglais };
