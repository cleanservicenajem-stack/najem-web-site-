import { faqItems, type FaqItem } from '@/config/faq';
import type { LangueTraduite } from '@/config/i18n';

/**
 * Questions fréquentes de config/faq.ts, traduites mot à mot (mêmes
 * identifiants, mêmes catégories, même ordre). Une question sans traduction
 * n'est pas affichée dans les pages traduites.
 */
type QuestionTraduite = Pick<FaqItem, 'question' | 'answer'>;

const anglais: Record<string, QuestionTraduite> = {
  reserver: {
    question: 'How do I book a cleaning service?',
    answer: [
      'Bookings are made in the Najem Clean Service app, available on iPhone and Android. Download the app, create your account, choose the service you want, then pick a time slot that suits you.',
      'When you place your request, you can add any useful information for the visit: type of home, rooms concerned, access instructions.',
    ],
  },
  fonctionnement: {
    question: 'How does Najem Clean Service work?',
    answer: [
      'Najem Clean Service connects households with home cleaning professionals through a mobile app. It takes four steps: download the app, choose a service, pick a time slot, then follow the visit from your account.',
      'Everything is handled in one place: your request, your appointments and the messages about your service.',
    ],
  },
  'gestion-reservations': {
    question: 'Can I manage my bookings in the app?',
    answer: [
      'Yes. Your bookings are available in your account in the app: you can see your upcoming appointments and the history of your requests.',
    ],
  },
  android: {
    question: 'Is the app available on Android?',
    answer: [
      'Yes. Najem Clean Service is available on Google Play. Download it with the “Google Play” button on this site, or search for “Najem Clean Service” in the Play Store.',
    ],
  },
  ios: {
    question: 'Is the app available on iPhone?',
    answer: [
      'Yes. Najem Clean Service is available on the App Store for iPhone. You can reach it with the “App Store” button on this site.',
    ],
  },
  'modifier-annuler': {
    question: 'Can I change or cancel a booking?',
    answer: [
      'Changes and cancellations are handled from your account in the app, in your bookings section.',
      'The applicable conditions, including the notice periods to respect, are those shown in the app when you book. They are the reference.',
    ],
  },
  paiement: {
    question: 'How does payment work?',
    answer: [
      'The available payment methods are shown in the app when you book, before you confirm anything.',
      'This site never asks for payment: booking and payment happen only in the Najem Clean Service app.',
    ],
  },
  professionnels: {
    question: 'Who comes to my home?',
    answer: [
      'Visits are carried out by cleaning professionals registered with Najem Clean Service. The details of your visit are shown in the app.',
    ],
  },
  contact: {
    question: 'How do I contact Najem Clean Service?',
    answer: [
      'For a general question, use the form on the Contact page of this site. For a request about an ongoing booking, use the app: the details of your appointment are already attached there.',
    ],
  },
  zones: {
    question: 'Which areas do you cover?',
    answer: [
      'Najem Clean Service works in Casablanca and the surrounding area: Bouskoura, Dar Bouazza, Ain Harrouda and Tit Mellil.',
      'Availability depends on your address and on the professionals available for the time slot you request. The app shows whether a visit is possible at your address when you book.',
    ],
  },
};

const arabe: Record<string, QuestionTraduite> = {
  reserver: {
    question: 'كيف أحجز خدمة تنظيف؟',
    answer: [
      'يتم الحجز من تطبيق Najem Clean Service المتوفر على الآيفون والأندرويد. حمّل التطبيق، وأنشئ حسابك، واختر الخدمة التي تريدها، ثم اختر موعدا يناسبك.',
      'يمكنك عند تقديم الطلب إضافة المعلومات المفيدة للتدخل: نوع المسكن، والغرف المعنية، وتعليمات الدخول.',
    ],
  },
  fonctionnement: {
    question: 'كيف تعمل Najem Clean Service؟',
    answer: [
      'تربط Najem Clean Service الأسر بمحترفي التنظيف المنزلي عبر تطبيق على الهاتف. يتم ذلك في أربع خطوات: تحميل التطبيق، واختيار الخدمة، وتحديد الموعد، ثم متابعة التدخل من حسابك.',
      'كل شيء يُدار في مكان واحد: الطلب، والمواعيد، والرسائل المتعلقة بالخدمة.',
    ],
  },
  'gestion-reservations': {
    question: 'هل يمكنني إدارة حجوزاتي من التطبيق؟',
    answer: [
      'نعم. حجوزاتك متاحة في حسابك داخل التطبيق: تطّلع فيه على مواعيدك القادمة وعلى سجلّ طلباتك.',
    ],
  },
  android: {
    question: 'هل التطبيق متوفر على أندرويد؟',
    answer: [
      'نعم. Najem Clean Service متوفر على Google Play. يمكنك تحميله من زر « Google Play » في هذا الموقع، أو بالبحث عن « Najem Clean Service » في متجر Play.',
    ],
  },
  ios: {
    question: 'هل التطبيق متوفر على الآيفون؟',
    answer: [
      'نعم. Najem Clean Service متوفر على App Store للآيفون. يمكنك الوصول إليه من زر « App Store » في هذا الموقع.',
    ],
  },
  'modifier-annuler': {
    question: 'هل يمكنني تعديل الحجز أو إلغاؤه؟',
    answer: [
      'يتم التعديل والإلغاء من حسابك داخل التطبيق، في قسم حجوزاتك.',
      'الشروط المطبقة، ولا سيما الآجال الواجب احترامها، هي المعروضة في التطبيق عند الحجز، وهي المرجع.',
    ],
  },
  paiement: {
    question: 'كيف يتم الدفع؟',
    answer: [
      'تُعرض طرق الدفع المتاحة في التطبيق عند الحجز، قبل أي تأكيد.',
      'لا يطلب هذا الموقع أي دفع: الحجز والدفع يتمان فقط داخل تطبيق Najem Clean Service.',
    ],
  },
  professionnels: {
    question: 'من سيأتي إلى منزلي؟',
    answer: [
      'يقوم بالتدخلات محترفو تنظيف مسجلون لدى Najem Clean Service. تظهر المعلومات الخاصة بتدخلك في التطبيق.',
    ],
  },
  contact: {
    question: 'كيف أتواصل مع Najem Clean Service؟',
    answer: [
      'لسؤال عام، استعمل الاستمارة في صفحة « اتصل بنا » في هذا الموقع. ولطلب يتعلق بحجز جارٍ، استعمل التطبيق: تفاصيل موعدك مرتبطة به هناك.',
    ],
  },
  zones: {
    question: 'ما هي المناطق التي تغطونها؟',
    answer: [
      'تعمل Najem Clean Service في الدار البيضاء ونواحيها: بوسكورة، ودار بوعزة، وعين حرودة، وتيط مليل.',
      'يتوقف التوفر على عنوانك وعلى المحترفين المتاحين في الموعد المطلوب. يبيّن التطبيق عند الحجز إن كان التدخل ممكنا في عنوانك.',
    ],
  },
};

const traductions: Record<LangueTraduite, Record<string, QuestionTraduite>> = { ar: arabe, en: anglais };

/**
 * Questions traduites, dans l'ordre d'origine. `ids` restreint la liste (par
 * exemple `homeFaqIds` pour l'accueil), sans changer l'ordre.
 */
export const faqTraduite = (langue: LangueTraduite, ids?: readonly string[]): FaqItem[] =>
  faqItems.flatMap((item) => {
    if (ids && !ids.includes(item.id)) return [];
    const traduite = traductions[langue][item.id];
    return traduite ? [{ ...item, ...traduite }] : [];
  });
