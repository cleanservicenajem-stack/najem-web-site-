import type { LangueTraduite } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import { communs } from '@/content/i18n/commun';

/**
 * Page « Nettoyage canapé et tapis à Casablanca » en arabe et en anglais
 * (/ar/nettoyage-canape-tapis-casablanca, /en/nettoyage-canape-tapis-casablanca).
 *
 * Traduction de app/(site)/nettoyage-canape-tapis-casablanca/page.tsx : mêmes
 * sections, mêmes informations. Les prix ne sont jamais écrits ici : la page
 * les lit dans la grille de /tarifs (option « Shampouineuse canapé et tapis »)
 * et dans `shampouineuseSeule` (prestation réservée seule), puis les passe en
 * paramètres : `seul` (un élément), `supplement`, `option` (en option d'un ménage).
 */
export type TextesCanapeTapis = {
  meta: {
    titre: (seul: string) => string;
    /** `option` : prix le plus bas de l'option, formaté ; `null` s'il est illisible. */
    description: (seul: string, option: string | null) => string;
  };
  /** Fil d'Ariane : noms des deux pages et nom accessible du fil. */
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; chapo: (seul: string, option: string | null) => string };
  fonctionnement: { titre: string; paragraphes: (seul: string) => string[] };
  prix: {
    titre: string;
    texte: (seul: string) => string;
    legende: string;
    colonnes: { logement: string; formule: string; menage: string; option: string };
    lien: string;
  };
  consignes: { titre: string; liste: string[] };
  specialise: { titre: string; texte: string; lienFemmeDeMenage: string };
  questions: {
    titre: string;
    prix: {
      question: string;
      /**
       * `min` vaut `null` si l'option est illisible ; `max` vaut `null` quand
       * elle a le même prix pour toutes les formules.
       */
      reponse: (seul: string, min: string | null, max: string | null) => string;
    };
    seul: { question: string; reponse: (seul: string, supplement: string) => string };
    /** `option` : nom traduit de l'option dans la grille. */
    reserver: { question: string; reponse: (option: string) => string };
    zones: { question: string; reponse: (alentours: string) => string };
  };
  schema: { nomPage: string; descriptionPage: string; nomService: string; typeService: string };
};

const NOM = siteConfig.name;

const anglais: TextesCanapeTapis = {
  meta: {
    titre: (seul) => `Sofa and carpet cleaning in Casablanca from ${seul} | Najem`,
    description: (seul, option) =>
      `Sofa, carpet or mattress shampooing in Casablanca: ${seul} per item${option ? `, or ${option} as a home cleaning option` : ''}. Book in the Najem app.`,
  },
  fil: { accueil: 'Home', page: 'Sofa and carpet cleaning', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Specialised cleaning in Casablanca',
    titre: 'Sofa and carpet cleaning at home in Casablanca',
    chapo: (seul, option) =>
      `Have a sofa, a carpet or a mattress shampooed: ${seul} per item${option ? `, or ${option} per item as an option with your home cleaning` : ''}. Book it in the ${NOM} app.`,
  },
  fonctionnement: {
    titre: 'How it works',
    paragraphes: (seul) => [
      `Sofas, carpets and mattresses collect the dust, smells and stains of everyday life. At ${NOM}, you can book shampooing on its own, with the “Nettoyage shampouineuse pro” service at ${seul} per item. Sofas and carpets can also be added to your cleaning as an option: a single visit for your home and your soft furnishings.`,
      'The price is shown in the app before you confirm. For a special request or another textile, write to us via the Contact page: whether it can be done is confirmed before the visit.',
    ],
  },
  prix: {
    titre: 'Sofa and carpet cleaning prices',
    texte: (seul) =>
      `Booked on its own, the service costs ${seul} per item. The table shows the price of the option for each cleaning package.`,
    legende: 'Price of the sofa and carpet shampooing option by cleaning package',
    colonnes: {
      logement: 'Home',
      formule: 'Cleaning package',
      menage: 'Cleaning',
      option: 'Sofa and carpet',
    },
    lien: 'See all prices',
  },
  consignes: {
    titre: 'What to mention when you book',
    liste: [
      'The type of material, if you know it: fabric, velvet, microfibre, wool…',
      'The number of seats on the sofa and the approximate size of the carpets.',
      'The stains to treat first and their cause, if you know it.',
      'How much drying time you have before using the room again.',
    ],
  },
  specialise: {
    titre: 'Carpets, sofas, windows, ironing',
    texte: `Sofas and carpets are part of ${NOM}’s specialised cleaning, along with windows, ironing and disinfection: dedicated care, to be specified in your request, anywhere in ${communs.en.zone}.`,
    lienFemmeDeMenage: 'Maid in Casablanca',
  },
  questions: {
    titre: 'Frequently asked questions',
    prix: {
      question: 'How much does sofa cleaning cost in Casablanca?',
      reponse: (seul, min, max) =>
        `At ${NOM}, shampooing booked on its own costs ${seul} for one item (sofa, carpet or mattress) and takes about 1 hour.${
          min
            ? max
              ? ` Added to a cleaning, the option costs from ${min} to ${max} per item depending on the package, on top of its price.`
              : ` Added to a cleaning, the option costs ${min} per item, on top of the package price.`
            : ''
        }`,
    },
    seul: {
      question: 'Can I book cleaning for just a sofa or a carpet?',
      reponse: (seul, supplement) =>
        `Yes. In the app, choose the “Nettoyage shampouineuse pro” service: ${seul} for one item (1 hour), then ${supplement} and 1 more hour for each extra item.`,
    },
    reserver: {
      question: 'How do I add sofa and carpet cleaning?',
      reponse: (option) =>
        `In the ${NOM} app, choose your cleaning package, then add the “${option}” option. Its price is added to that of the package and shown before you confirm.`,
    },
    zones: {
      question: `Do you cover all of ${communs.en.zone}?`,
      reponse: (alentours) =>
        `Yes, ${NOM} works throughout Casablanca and in the surrounding area: ${alentours}. Availability of a time slot at your address is confirmed in the app when you book.`,
    },
  },
  schema: {
    nomPage: `Sofa and carpet cleaning in Casablanca — ${NOM}`,
    descriptionPage: `Sofa, carpet and mattress shampooing in Casablanca, on its own or as an option with ${NOM} home cleaning: prices, how it works and booking.`,
    nomService: 'Sofa and carpet cleaning at home in Casablanca',
    typeService: 'Sofa and carpet cleaning',
  },
};

const arabe: TextesCanapeTapis = {
  meta: {
    titre: (seul) => `تنظيف الأرائك والزرابي بالدار البيضاء من ${seul} | Najem`,
    description: (seul, option) =>
      `غسل أريكة أو زربية أو مرتبة بالآلة في الدار البيضاء: ${seul} للقطعة${option ? `، أو ${option} كخيار مع تنظيف المنزل` : ''}. احجز من تطبيق ${NOM}.`,
  },
  fil: { accueil: 'الرئيسية', page: 'تنظيف الأرائك والزرابي', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'التنظيف المتخصص بالدار البيضاء',
    titre: 'تنظيف الأرائك والزرابي في منزلك بالدار البيضاء',
    chapo: (seul, option) =>
      `اغسل أريكة أو زربية أو مرتبة بالآلة: ${seul} للقطعة${option ? `، أو ${option} للقطعة كخيار مع تنظيف منزلك` : ''}. الحجز من تطبيق ${NOM}.`,
  },
  fonctionnement: {
    titre: 'طريقة العمل',
    paragraphes: (seul) => [
      `تحتفظ الأريكة والزرابي والمرتبة بغبار الحياة اليومية وروائحها وبقعها. لدى ${NOM}، يمكنك حجز غسلها بالآلة وحده، عبر خدمة « Nettoyage shampouineuse pro » بسعر ${seul} للقطعة. ويمكن أيضا إضافة الأريكة والزرابي كخيار إلى تنظيف منزلك: زيارة واحدة للمسكن والمفروشات معا.`,
      'يظهر السعر في التطبيق قبل التأكيد. ولأي طلب خاص أو قطعة نسيج أخرى، راسلنا عبر صفحة « اتصل بنا »: يُؤكَّد إمكان تنفيذه قبل الزيارة.',
    ],
  },
  prix: {
    titre: 'أسعار تنظيف الأرائك والزرابي',
    texte: (seul) =>
      `عند حجزها وحدها، تكلف الخدمة ${seul} للقطعة. ويبين الجدول سعر الخيار حسب باقة التنظيف.`,
    legende: 'سعر خيار غسل الأرائك والزرابي بالآلة حسب باقة التنظيف',
    colonnes: {
      logement: 'المسكن',
      formule: 'باقة التنظيف',
      menage: 'التنظيف',
      option: 'الأرائك والزرابي',
    },
    lien: 'اطّلع على كل الأسعار',
  },
  consignes: {
    titre: 'ما يفيد ذكره عند الحجز',
    liste: [
      'نوع النسيج إن كنت تعرفه: قماش، مخمل، ميكروفايبر، صوف…',
      'عدد مقاعد الأريكة والمقاس التقريبي للزرابي.',
      'البقع التي يجب معالجتها أولا ومصدرها إن كنت تعرفه.',
      'مدة التجفيف المتاحة لك قبل استعمال الغرفة من جديد.',
    ],
  },
  specialise: {
    titre: 'الزرابي والأرائك والزجاج والكي',
    texte: `تندرج الأرائك والزرابي ضمن التنظيف المتخصص لدى ${NOM}، إلى جانب الزجاج والكي والتعقيم: عناية مخصصة تحددها في طلبك، في كل أنحاء ${communs.ar.zone}.`,
    lienFemmeDeMenage: 'عاملة نظافة بالدار البيضاء',
  },
  questions: {
    titre: 'الأسئلة الشائعة',
    prix: {
      question: 'كم يكلّف تنظيف الأريكة بالدار البيضاء؟',
      reponse: (seul, min, max) =>
        `لدى ${NOM}، يكلّف الغسل بالآلة المحجوز وحده ${seul} لقطعة واحدة (أريكة أو زربية أو مرتبة)، ويستغرق حوالي ساعة.${
          min
            ? max
              ? ` وعند إضافته إلى التنظيف، يكلّف الخيار من ${min} إلى ${max} للقطعة حسب الباقة، إضافة إلى سعرها.`
              : ` وعند إضافته إلى التنظيف، يكلّف الخيار ${min} للقطعة، إضافة إلى سعر الباقة.`
            : ''
        }`,
    },
    seul: {
      question: 'هل يمكن حجز تنظيف أريكة أو زربية فقط؟',
      reponse: (seul, supplement) =>
        `نعم. في التطبيق، اختر خدمة « Nettoyage shampouineuse pro »: ${seul} لقطعة واحدة (ساعة)، ثم ${supplement} وساعة إضافية عن كل قطعة أخرى.`,
    },
    reserver: {
      question: 'كيف أضيف تنظيف الأريكة والزرابي؟',
      reponse: (option) =>
        `في تطبيق ${NOM}، اختر باقة التنظيف، ثم أضف خيار « ${option} ». يُضاف سعره إلى سعر الباقة ويظهر قبل أن تؤكد.`,
    },
    zones: {
      question: `هل تعملون في كل أنحاء ${communs.ar.zone}؟`,
      reponse: (alentours) =>
        `نعم، تعمل ${NOM} في جميع أنحاء الدار البيضاء وفي نواحيها: ${alentours}. يُؤكَّد توفر موعد في عنوانك داخل التطبيق عند الحجز.`,
    },
  },
  schema: {
    nomPage: `تنظيف الأرائك والزرابي بالدار البيضاء — ${NOM}`,
    descriptionPage: `غسل الأرائك والزرابي والمرتبات بالآلة في الدار البيضاء، وحده أو كخيار مع التنظيف المنزلي من ${NOM}: الأسعار وطريقة العمل والحجز.`,
    nomService: 'تنظيف الأرائك والزرابي في منزلك بالدار البيضاء',
    typeService: 'تنظيف الأرائك والزرابي',
  },
};

export const textesCanapeTapis: Record<LangueTraduite, TextesCanapeTapis> = {
  ar: arabe,
  en: anglais,
};
