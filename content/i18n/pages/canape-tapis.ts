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
 * et les passe en paramètres.
 */
export type TextesCanapeTapis = {
  meta: {
    /** `prixMin` : prix le plus bas de l'option, formaté ; `null` s'il est illisible. */
    titre: (prixMin: string | null) => string;
    description: (prixMin: string | null) => string;
  };
  /** Fil d'Ariane : noms des deux pages et nom accessible du fil. */
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; chapo: (prixMin: string | null) => string };
  fonctionnement: { titre: string; paragraphes: string[] };
  prix: {
    titre: string;
    texte: string;
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
      /** `max` vaut `null` quand l'option a le même prix pour toutes les formules. */
      reponse: (min: string, max: string | null) => string;
    };
    seul: { question: string; reponse: string };
    /** `option` : nom traduit de l'option dans la grille. */
    reserver: { question: string; reponse: (option: string) => string };
    zones: { question: string; reponse: (alentours: string) => string };
  };
  schema: { nomPage: string; descriptionPage: string; nomService: string; typeService: string };
};

const NOM = siteConfig.name;

const anglais: TextesCanapeTapis = {
  meta: {
    titre: (prixMin) =>
      `Sofa and carpet cleaning in Casablanca${prixMin ? ` from ${prixMin}` : ''} | Najem`,
    description: (prixMin) =>
      `Sofa and carpet cleaning with a shampooer in Casablanca${prixMin ? ` from ${prixMin}` : ''}, as an option with your home cleaning. Book it in the ${NOM} app.`,
  },
  fil: { accueil: 'Home', page: 'Sofa and carpet cleaning', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Specialised cleaning in Casablanca',
    titre: 'Sofa and carpet cleaning at home in Casablanca',
    chapo: (prixMin) =>
      `Add shampooing for your sofa and carpets to your home cleaning${prixMin ? `, from ${prixMin}` : ''}, directly in the ${NOM} app.`,
  },
  fonctionnement: {
    titre: 'How it works',
    paragraphes: [
      `Sofas and carpets collect the dust, smells and stains of everyday life. At ${NOM}, cleaning them with a shampooer is an option you add to your cleaning when you book: a single visit for your home and your soft furnishings.`,
      'The price of the option is added to that of the package you choose and is shown before you confirm. For a request that only concerns a sofa, a carpet or another textile, describe it in the app or via the Contact page: whether it can be done is confirmed according to the request and the professionals available.',
    ],
  },
  prix: {
    titre: 'Sofa and carpet cleaning prices',
    texte: 'The price of the option depends on the cleaning package you add it to.',
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
      reponse: (min, max) =>
        max
          ? `At ${NOM}, the sofa and carpet shampooing option costs from ${min} to ${max} depending on the package, on top of the price of the cleaning.`
          : `At ${NOM}, the sofa and carpet shampooing option costs ${min}, on top of the cleaning package you choose.`,
    },
    seul: {
      question: 'Can I book cleaning for just a sofa or a carpet?',
      reponse:
        'Describe your request when you book in the app, or write to us via the Contact page. Whether it can be done is confirmed according to the request and the professionals available.',
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
    descriptionPage: `Sofa and carpet cleaning with a shampooer in Casablanca, as an option with ${NOM} home cleaning: prices, how it works and booking.`,
    nomService: 'Sofa and carpet cleaning at home in Casablanca',
    typeService: 'Sofa and carpet cleaning',
  },
};

const arabe: TextesCanapeTapis = {
  meta: {
    titre: (prixMin) =>
      `تنظيف الأرائك والزرابي بالدار البيضاء${prixMin ? ` من ${prixMin}` : ''} | Najem`,
    description: (prixMin) =>
      `تنظيف الأرائك والزرابي بالآلة في الدار البيضاء${prixMin ? ` ابتداءً من ${prixMin}` : ''}، كخيار يُضاف إلى تنظيف منزلك. احجز من تطبيق ${NOM}.`,
  },
  fil: { accueil: 'الرئيسية', page: 'تنظيف الأرائك والزرابي', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'التنظيف المتخصص بالدار البيضاء',
    titre: 'تنظيف الأرائك والزرابي في منزلك بالدار البيضاء',
    chapo: (prixMin) =>
      `أضف غسل أريكتك وزرابيك بالآلة إلى تنظيف منزلك${prixMin ? `، ابتداءً من ${prixMin}` : ''}، مباشرة من تطبيق ${NOM}.`,
  },
  fonctionnement: {
    titre: 'طريقة العمل',
    paragraphes: [
      `تحتفظ الأريكة والزرابي بغبار الحياة اليومية وروائحها وبقعها. لدى ${NOM}، غسلها بالآلة خيار تضيفه إلى تنظيف منزلك عند الحجز: زيارة واحدة للمسكن والمفروشات معا.`,
      'يُضاف سعر هذا الخيار إلى سعر الباقة المختارة ويظهر قبل التأكيد. وإذا كان طلبك يخص أريكة أو زربية أو قطعة نسيج أخرى فقط، فصِفه في التطبيق أو عبر صفحة « اتصل بنا »: يُؤكَّد إمكان تنفيذه حسب الطلب والمحترفين المتاحين.',
    ],
  },
  prix: {
    titre: 'أسعار تنظيف الأرائك والزرابي',
    texte: 'سعر هذا الخيار حسب باقة التنظيف التي تضيفه إليها.',
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
      reponse: (min, max) =>
        max
          ? `لدى ${NOM}، يكلّف خيار غسل الأرائك والزرابي بالآلة من ${min} إلى ${max} حسب الباقة، إضافة إلى سعر التنظيف.`
          : `لدى ${NOM}، يكلّف خيار غسل الأرائك والزرابي بالآلة ${min}، إضافة إلى باقة التنظيف المختارة.`,
    },
    seul: {
      question: 'هل يمكن حجز تنظيف أريكة أو زربية فقط؟',
      reponse:
        'صِف طلبك عند الحجز في التطبيق، أو راسلنا عبر صفحة « اتصل بنا ». يُؤكَّد إمكان تنفيذه حسب الطلب والمحترفين المتاحين.',
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
    descriptionPage: `غسل الأرائك والزرابي بالآلة في الدار البيضاء، كخيار يُضاف إلى التنظيف المنزلي من ${NOM}: الأسعار وطريقة العمل والحجز.`,
    nomService: 'تنظيف الأرائك والزرابي في منزلك بالدار البيضاء',
    typeService: 'تنظيف الأرائك والزرابي',
  },
};

export const textesCanapeTapis: Record<LangueTraduite, TextesCanapeTapis> = {
  ar: arabe,
  en: anglais,
};
