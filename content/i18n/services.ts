import type { LangueTraduite } from '@/config/i18n';
import type { Service } from '@/config/services';
import { communs } from '@/content/i18n/commun';

/**
 * Prestations de config/services.ts, en arabe et en anglais (/ar, /en).
 *
 * Chaque texte traduit ce que la page française affiche aujourd'hui :
 * - le titre et le titre court viennent du vocabulaire commun
 *   (`communs[langue].services`) : une prestation porte le même nom sur toutes
 *   les pages ;
 * - `benefit` et `pitch` traduisent la première et la seconde ligne
 *   enregistrées dans l'administration (`service.<slug>.accroche` et
 *   `service.<slug>.complement`) quand elles existent, sinon celles de
 *   config/services.ts (voir `getServiceAffiche`, lib/content.ts) ;
 * - tout le reste traduit config/services.ts.
 *
 * Ces traductions ne suivent pas l'administration : une ligne réécrite en
 * français dans l'administration est à retraduire ici.
 */
export type TexteService = Pick<
  Service,
  'metaTitle' | 'metaDescription' | 'benefit' | 'pitch' | 'summary' | 'body' | 'includes' | 'goodFor'
>;

const anglais: Record<string, TexteService> = {
  'nettoyage-regulier': {
    metaTitle: 'Regular Home Cleaning in Casablanca',
    metaDescription:
      'Regular home cleaning in Casablanca: scheduled visits at the pace you choose, or a monthly plan. Book in the Najem Clean Service app.',
    benefit: 'A clean home without having to think about it',
    // Seconde ligne de l'administration.
    pitch:
      '3 standard cleanings and 1 deep cleaning every month. Booked in 3 clicks, renewed month by month as you choose, with no fixed-term commitment.',
    summary:
      'Regular cleaning means visits scheduled at fixed intervals to keep your home clean. You set the frequency that suits you in the app, and come home to a clean space without having to reorganise your days.',
    body: [
      'Routine cleaning is what takes the most consistency, and it is also the easiest thing to put off. Regular cleaning exists to take that weight off your weekly schedule. It is available anywhere in Casablanca and the surrounding area, at the pace you set.',
      'You enter your home details and availability in the app, then reschedule the following visits in a few seconds from your account. Special requests — a room to prioritise, products to avoid, access to your home — are passed on when you book.',
    ],
    includes: [
      'Living areas and bedrooms',
      'Kitchen: worktops, outside of appliances, sink',
      'Bathroom and toilets',
      'Floors vacuumed and mopped',
      'Dusting of accessible surfaces',
    ],
    goodFor: ['Homes lived in every day', 'Busy schedules', 'Families who want a fixed routine'],
  },
  'nettoyage-ponctuel': {
    metaTitle: 'One-Off Home Cleaning in Casablanca',
    metaDescription:
      'One-off home cleaning in Casablanca: a single visit with no commitment, before having guests or after a holiday. Book in the Najem Clean Service app.',
    benefit: 'A single visit, available any time from your phone',
    // Seconde ligne de l'administration.
    pitch: 'Express or full cleaning, in the time slot of your choice, with the options you need.',
    summary:
      'One-off cleaning is a single visit, with no commitment to further visits. It meets a specific need: before having guests, after an event, or simply to get your home back on track.',
    body: [
      'Not everyone needs a weekly visit. Some weeks just call for a good clean at the right moment, and that is exactly what one-off cleaning covers. It can be booked anywhere in Casablanca and the surrounding area.',
      'Booking works just like the other services: you choose the service, select a time slot and confirm. Nothing renews automatically.',
    ],
    includes: [
      'Cleaning of the rooms specified when booking',
      'Floors, surfaces and bathrooms',
      'Cleaned areas left visibly tidy',
    ],
    goodFor: [
      'Before or after having guests',
      'Back from holiday',
      'A one-off need with no regular follow-up',
    ],
  },
  'nettoyage-apres-demenagement': {
    metaTitle: 'Move-In/Out Cleaning in Casablanca',
    metaDescription:
      'Move-in and move-out cleaning in Casablanca: an empty home cleaned before you move in or after you move out. Book in the Najem Clean Service app.',
    // Première et seconde lignes de l'administration.
    benefit: 'Your empty home cleaned, whether you are moving in or moving out',
    pitch:
      'Floors, kitchen, bathrooms and surfaces cleaned, so you can hand over the keys with peace of mind.',
    summary:
      'Move-in and move-out cleaning takes place in a home that is empty or being vacated. It lets you hand a property back in good condition, or move into a home that has already been cleaned.',
    body: [
      'An empty home is cleaned differently from one that is lived in: every surface can be reached, and the areas usually hidden by furniture are often the ones that need the most attention. The service covers Casablanca and the surrounding area, whether you are moving in or moving out.',
      'Book this service in the app, stating whether you are moving out or moving in, along with any particular features of the home.',
    ],
    includes: [
      'Floors and skirting boards',
      'Inside empty cupboards',
      'Kitchen and bathroom',
      'Marks and dust left by the move',
    ],
    goodFor: ['End of tenancy', 'Moving into a new home', 'Handing over the keys'],
  },
  'grand-nettoyage': {
    metaTitle: 'Deep Home Cleaning in Casablanca',
    metaDescription:
      'Deep home cleaning in Casablanca: a complete refresh that goes beyond routine cleaning, for an apartment or a villa. Book in the Najem Clean Service app.',
    // Première et seconde lignes de l'administration.
    benefit: 'A complete refresh of your home, room by room',
    pitch:
      'From a studio to a large villa, with a duration and budget suited to the size of your home.',
    summary:
      'Deep cleaning is a more thorough visit than routine cleaning. It targets the areas that are not covered on every visit, and often serves as a starting point before setting up a regular schedule.',
    body: [
      'Sometimes a home needs more than a surface clean: a change of season, a busy period, or simply the wish to start afresh. Deep cleaning can be booked anywhere in Casablanca and the surrounding area, for an apartment or a house.',
      'Deep cleaning focuses on the details that usually get overlooked. When you book, specify the areas that matter most to you: they will be given priority.',
    ],
    includes: [
      'Thorough cleaning of the rooms',
      'Areas that are hard to reach day to day',
      'Accessible indoor glass surfaces',
      'Details: switches, handles, skirting boards',
    ],
    goodFor: ['Change of season', 'Before a family event', 'Getting your home back on track'],
  },
  'entretien-specialise': {
    metaTitle: 'Carpets, Sofas, Windows in Casablanca',
    metaDescription:
      'Specialised cleaning in Casablanca: carpets, sofas, windows, ironing and disinfection, each given dedicated care. Describe your needs in the Najem app.',
    // Première et seconde lignes de l'administration.
    benefit: 'Carpets, sofas, windows, ironing: dedicated care, handled separately',
    pitch: 'Post-event clean-up, disinfection: tell us what you need.',
    summary:
      'Specialised cleaning covers requests that go beyond routine cleaning and need suitable treatment. Feasibility is confirmed based on the request and the professional available.',
    body: [
      'Some surfaces and some needs call for a specific approach. Rather than being handled like standard cleaning, these requests are identified as soon as you book. Specialised cleaning is offered in Casablanca, with feasibility confirmed case by case.',
      'Describe exactly what you need in the app: this helps direct your request to a professional who can handle it.',
    ],
    includes: [
      'Requests described when you book',
      'Adapted to the type of surface involved',
      'Feasibility confirmed before the visit',
    ],
    goodFor: ['A need beyond routine cleaning', 'A particular surface or material'],
  },
  professionnels: {
    metaTitle: 'Airbnb Cleaning in Casablanca',
    metaDescription:
      'Airbnb and short-term rental cleaning in Casablanca: turnover cleaning between guests, for concierge companies and owners. Book in the Najem app.',
    benefit: 'A tailored service for concierge companies and short-term rentals',
    // Seconde ligne de l'administration.
    pitch: 'Time slots that fit your turnovers, so every property is always ready.',
    summary:
      'This service is designed for concierge companies and short-term rental owners. The visit is defined according to the property concerned and is booked through the app, like the other services.',
    body: [
      'A property let by the night is not looked after like a home lived in all year round: the challenge is not just cleanliness, it is the turnaround time between two stays. Najem Clean Service works throughout Casablanca and the surrounding area.',
      'When you book, describe the property and how often guests come and go. The following visits can be rescheduled from your account, and every visit is tracked in the same place.',
    ],
    includes: [
      'Service defined according to the property',
      'Turnover cleaning between two stays',
      'Booking and tracking in the app',
    ],
    goodFor: [
      'Concierge companies',
      'Short-term rental owners',
      'Frequent turnovers between stays',
    ],
  },
};

const arabe: Record<string, TexteService> = {
  'nettoyage-regulier': {
    metaTitle: 'تنظيف منزلي منتظم بالدار البيضاء',
    metaDescription:
      'تنظيف منزلي منتظم بالدار البيضاء: زيارات مبرمجة بالوتيرة التي تختارها، أو اشتراك شهري. احجز من تطبيق Najem Clean Service.',
    benefit: 'منزل نظيف دون أن تشغل بالك به',
    // Seconde ligne de l'administration.
    pitch:
      '3 عمليات تنظيف عادية وتنظيف عميق واحد كل شهر. يُحجز في 3 نقرات، ويتجدد كل شهر حسب رغبتك، دون أي التزام بمدة محددة.',
    summary:
      'التنظيف المنتظم زيارة مبرمجة على فترات ثابتة للعناية بمسكنك. تحدد من التطبيق الوتيرة التي تناسبك، فتجد منزلك نظيفا دون أن تعيد تنظيم أيامك.',
    body: [
      'التنظيف المعتاد هو أكثر ما يحتاج إلى المواظبة، وهو أيضا أسهل ما يُؤجَّل. وقد وُجد التنظيف المنتظم ليرفع عنك هذا العبء من تنظيم أسبوعك. وهو متوفر في كل أنحاء الدار البيضاء ونواحيها، بالوتيرة التي تحددها.',
      'تُدخل في التطبيق معلومات مسكنك والأوقات التي تناسبك، ثم تعيد برمجة الزيارات التالية في ثوانٍ من حسابك. أما الطلبات الخاصة — غرفة تُنظَّف أولا، أو منتجات يجب تجنبها، أو طريقة الدخول إلى المسكن — فتُبلَّغ عند الحجز.',
    ],
    includes: [
      'تنظيف غرف المعيشة وغرف النوم',
      'المطبخ: أسطح العمل، والجهة الخارجية للأجهزة، والمغسلة',
      'الحمّام والمراحيض',
      'شفط الأرضيات ومسحها',
      'إزالة الغبار عن الأسطح التي يمكن الوصول إليها',
    ],
    goodFor: ['مساكن مأهولة يوميا', 'جداول زمنية مزدحمة', 'أسر تريد وتيرة ثابتة'],
  },
  'nettoyage-ponctuel': {
    metaTitle: 'تنظيف منزلي لمرة واحدة بالدار البيضاء',
    metaDescription:
      'تنظيف منزلي لمرة واحدة بالدار البيضاء: تدخل واحد دون التزام، قبل استقبال الضيوف أو عند العودة من العطلة. احجز من تطبيق Najem Clean Service.',
    benefit: 'تدخل واحد، متاح في أي وقت من هاتفك',
    // Seconde ligne de l'administration.
    pitch: 'تنظيف سريع أو شامل، في الموعد الذي تختاره، مع الخيارات التي تحتاجها.',
    summary:
      'التنظيف لمرة واحدة تدخل واحد دون أي التزام بزيارات لاحقة. وهو يلبي حاجة محددة: قبل استقبال الضيوف، أو بعد مناسبة، أو ببساطة لإعادة الأمور إلى نصابها في المسكن.',
    body: [
      'لا يحتاج الجميع إلى زيارة أسبوعية. فبعض الأسابيع لا تتطلب سوى تنظيف جيد في الوقت المناسب، وهذا بالضبط ما يغطيه التنظيف لمرة واحدة. ويمكن حجزه في كل أنحاء الدار البيضاء ونواحيها.',
      'يتم الحجز بالطريقة نفسها المتبعة في باقي الخدمات: تختار الخدمة، وتحدد موعدا، ثم تؤكد. ولا يتجدد أي شيء تلقائيا.',
    ],
    includes: [
      'تنظيف الغرف المحددة عند الحجز',
      'الأرضيات والأسطح والمرافق الصحية',
      'ترتيب واضح للأماكن التي تم تنظيفها',
    ],
    goodFor: ['قبل استقبال الضيوف أو بعده', 'العودة من العطلة', 'حاجة عابرة دون متابعة منتظمة'],
  },
  'nettoyage-apres-demenagement': {
    metaTitle: 'التنظيف عند الانتقال بالدار البيضاء',
    metaDescription:
      'التنظيف عند الانتقال بالدار البيضاء: مسكن فارغ يعود نظيفا، عند الدخول إليه كما عند مغادرته. احجز من تطبيق Najem Clean Service.',
    // Première et seconde lignes de l'administration.
    benefit: 'مسكنك الفارغ نظيف من جديد، عند الدخول إليه كما عند مغادرته',
    pitch: 'الأرضيات والمطبخ والمرافق الصحية والأسطح نظيفة، لتسليم المفاتيح براحة بال.',
    summary:
      'يتم التنظيف عند الانتقال في مسكن فارغ أو في طور الإخلاء. وهو يتيح لك تسليم العقار في حالة لائقة، أو الانتقال إلى مسكن تم تنظيفه مسبقا.',
    body: [
      'يختلف تنظيف المسكن الفارغ عن تنظيف المسكن المأهول: فجميع الأسطح يمكن الوصول إليها، وغالبا ما تكون المناطق التي يحجبها الأثاث عادة هي الأكثر حاجة إلى العناية. وتغطي الخدمة الدار البيضاء ونواحيها، عند الدخول إلى المسكن كما عند مغادرته.',
      'تُحجز هذه الخدمة من التطبيق، مع تحديد ما إذا كان الأمر يتعلق بمغادرة المسكن أو بالدخول إليه، وكذلك خصوصيات المسكن.',
    ],
    includes: [
      'الأرضيات والحواف السفلية للجدران',
      'داخل الخزائن الفارغة',
      'المطبخ والحمّام',
      'الآثار والغبار المرتبطة بالانتقال',
    ],
    goodFor: ['نهاية عقد الكراء', 'الانتقال إلى مسكن جديد', 'تسليم المفاتيح'],
  },
  'grand-nettoyage': {
    metaTitle: 'تنظيف عميق للمنازل بالدار البيضاء',
    metaDescription:
      'تنظيف عميق للمنازل بالدار البيضاء: تجديد شامل يتجاوز التنظيف المعتاد، لشقة أو فيلا. احجز من تطبيق Najem Clean Service.',
    // Première et seconde lignes de l'administration.
    benefit: 'تجديد شامل لنظافة مسكنك، غرفة بغرفة',
    pitch: 'من الاستوديو إلى الفيلا الكبيرة، بمدة وميزانية تناسبان مساحة مسكنك.',
    summary:
      'التنظيف العميق تدخل أشمل من التنظيف المعتاد. فهو يستهدف المناطق التي لا تُنظَّف في كل زيارة، وكثيرا ما يكون نقطة انطلاق قبل اعتماد وتيرة منتظمة.',
    body: [
      'قد يحتاج المسكن أحيانا إلى أكثر من تنظيف سطحي: تغيّر الفصل، أو فترة مزدحمة، أو ببساطة الرغبة في بداية جديدة على أساس نظيف. ويمكن حجز التنظيف العميق في كل أنحاء الدار البيضاء ونواحيها، لشقة أو لمنزل.',
      'يركز التنظيف العميق على التفاصيل التي تُهمَل عادة. حدّد عند الحجز المناطق التي تهمك أكثر، وستحظى بالأولوية.',
    ],
    includes: [
      'تنظيف معمّق للغرف',
      'المناطق التي يصعب الوصول إليها في الحياة اليومية',
      'الأسطح الزجاجية الداخلية التي يمكن الوصول إليها',
      'التفاصيل: مفاتيح الإنارة، والمقابض، والحواف السفلية للجدران',
    ],
    goodFor: ['تغيّر الفصل', 'قبل مناسبة عائلية', 'استعادة نظافة المسكن'],
  },
  'entretien-specialise': {
    metaTitle: 'زرابي وأرائك وزجاج بالدار البيضاء',
    metaDescription:
      'التنظيف المتخصص بالدار البيضاء: الزرابي والأرائك والزجاج والكي والتعقيم، بعناية مخصصة لكل منها. صِف حاجتك في تطبيق Najem Clean Service.',
    // Première et seconde lignes de l'administration.
    benefit: 'الزرابي والأرائك والزجاج والكي: عناية مخصصة تُقدَّم على حدة',
    pitch: 'التنظيف وإعادة الترتيب بعد الحفلات، والتعقيم: صِف لنا حاجتك.',
    summary:
      'يضم التنظيف المتخصص الطلبات التي تخرج عن التنظيف المعتاد وتتطلب معالجة ملائمة. ويتم تأكيد إمكانية التنفيذ حسب الطلب والمحترف المتاح.',
    body: [
      'تتطلب بعض الأسطح وبعض الحاجات مقاربة خاصة. فبدلا من معاملتها كتنظيف عادي، تُحدَّد هذه الطلبات منذ الحجز. ويُقدَّم التنظيف المتخصص في الدار البيضاء، مع تأكيد إمكانية التنفيذ حالة بحالة.',
      'صِف حاجتك بدقة في التطبيق: يساعد ذلك على توجيه طلبك إلى محترف قادر على تلبيته.',
    ],
    includes: [
      'طلبات تُوصف عند الحجز',
      'معالجة تلائم نوع السطح المعني',
      'تأكيد إمكانية التنفيذ قبل التدخل',
    ],
    goodFor: ['حاجة تتجاوز التنظيف المعتاد', 'سطح أو مادة خاصة'],
  },
  professionnels: {
    metaTitle: 'تنظيف شقق Airbnb بالدار البيضاء',
    metaDescription:
      'تنظيف شقق Airbnb والكراء قصير المدة بالدار البيضاء: تجهيز العقار بين ضيف وآخر، لشركات الكونسيرج والملاك. احجز من تطبيق Najem Clean Service.',
    benefit: 'خدمة على المقاس لشركات الكونسيرج والكراء قصير المدة',
    // Seconde ligne de l'administration.
    pitch: 'مواعيد تتلاءم مع تعاقب ضيوفك، ليبقى كل عقار جاهزا دائما.',
    summary:
      'تتوجه هذه الخدمة إلى شركات الكونسيرج وملاك شقق الكراء قصير المدة. ويُحدَّد التدخل حسب العقار المعني، ويُحجز من التطبيق مثل باقي الخدمات.',
    body: [
      'لا يُعتنى بعقار مؤجَّر بالليلة كما يُعتنى بمسكن مأهول طوال السنة: فالتحدي ليس النظافة وحدها، بل المهلة الفاصلة بين إقامتين. وتتدخل Najem Clean Service في كل أنحاء الدار البيضاء ونواحيها.',
      'صِف العقار ووتيرة الإقامات فيه عند الحجز. يمكن إعادة برمجة الزيارات التالية من حسابك، وتبقى متابعة كل تدخل في المكان نفسه.',
    ],
    includes: [
      'خدمة تُحدَّد حسب العقار المعني',
      'إعادة تهيئة العقار بين إقامتين',
      'الحجز والمتابعة من التطبيق',
    ],
    goodFor: ['شركات الكونسيرج', 'ملاك شقق الكراء قصير المدة', 'تعاقب متكرر للضيوف بين الإقامات'],
  },
};

export const textesServices: Record<LangueTraduite, Record<string, TexteService>> = {
  ar: arabe,
  en: anglais,
};

/**
 * Prestation dans la langue de la page : textes traduits, icône et réglages
 * de config/services.ts. `null` si un texte traduit manque : la prestation
 * n'est alors pas affichée, plutôt que de mélanger les langues.
 */
export const serviceTraduit = (langue: LangueTraduite, service: Service): Service | null => {
  const nom = communs[langue].services[service.slug];
  const textes = textesServices[langue][service.slug];
  if (!nom || !textes) return null;

  return {
    ...service,
    ...textes,
    title: nom.titre,
    shortTitle: nom.titreCourt,
    // Jamais la seconde ligne française, même quand la traduction n'en a pas.
    pitch: textes.pitch,
  };
};

/** Équivalent traduit de `getServicesAffiches` : même ordre, sans les prestations non traduites. */
export const servicesTraduits = (langue: LangueTraduite, liste: readonly Service[]): Service[] =>
  liste.flatMap((service) => {
    const traduit = serviceTraduit(langue, service);
    return traduit ? [traduit] : [];
  });
