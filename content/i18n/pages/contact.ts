import type { LangueTraduite } from '@/config/i18n';
import type { TextesFormulaireContact } from '@/components/forms/ContactForm';

/**
 * Textes de la page Contact traduite (/ar/contact, /en/contact).
 *
 * Chaque texte traduit celui de app/(site)/contact/page.tsx et du formulaire
 * (components/forms/ContactForm.tsx) ; la description traduit celle de
 * l'administration (seo.contact). Les coordonnées elles-mêmes (téléphone,
 * e-mail, adresse, horaires, délai de réponse) s'affichent telles qu'elles
 * sont saisies.
 */
export type TextesContact = {
  seo: { titre: string; description: string };
  fil: { accueil: string; page: string; libelle: string };
  hero: { surtitre: string; titre: string; introduction: string };
  formulaire: { titre: string; introduction: string; textes: TextesFormulaireContact };
  reservation: { titre: string; texte: string };
  coordonnees: {
    titre: string;
    whatsapp: string;
    /** Message prérempli dans WhatsApp. */
    messageWhatsapp: string;
    /** Tant qu'aucune coordonnée n'est publiée. */
    absentes: string;
    /** « Délai de réponse habituel : … », de part et d'autre du délai saisi. */
    delai: { avant: string; apres: string };
  };
  schema: { nomPage: string };
};

const anglais: TextesContact = {
  seo: {
    titre: 'Contact: home cleaning in Casablanca',
    description:
      'A question, or a partnership for your concierge business? Contact Najem Clean Service in Casablanca: we reply by email, by phone or via the app.',
  },
  fil: { accueil: 'Home', page: 'Contact', libelle: 'Breadcrumb' },
  hero: {
    surtitre: 'Contact',
    titre: 'A question? Write to us.',
    introduction:
      'This form is for enquiries about our home cleaning services in Casablanca. For a request about an ongoing booking, the app is still the most direct channel: the details of your appointment are already attached there.',
  },
  formulaire: {
    titre: 'Contact form',
    introduction:
      'Describe what you need in a few lines. The more precise your message, the more precise our reply.',
    textes: {
      champPiege: 'Leave this field empty',
      prenom: 'First name',
      nom: 'Last name',
      email: 'Email',
      telephone: 'Phone',
      facultatif: '(optional)',
      objet: 'Subject',
      choisirObjet: 'Choose a subject',
      objets: {
        reservation: 'A booking',
        application: 'The mobile app',
        prestation: 'A cleaning service',
        autre: 'Something else',
      },
      message: 'Message',
      aideMessage: 'Tell us what you need: type of home, the service you have in mind, your availability.',
      consentement: 'I agree to this information being used to process my request.',
      envoiEnCours: 'Sending…',
      envoyer: 'Send message',
      obligatoires: { avant: 'Fields marked with an ', apres: ' are required.' },
      apresEnvoi:
        'We will get back to you at the email address you gave us. For a request about an ongoing booking, the app is still the most direct channel.',
      messages: {
        langue: 'en',
        succes: 'Thank you. Your message has been sent.',
        champsACorriger: 'Some fields need to be corrected.',
        tropDeDemandes: {
          one: 'Too many requests sent. Please try again in 1 minute.',
          other: 'Too many requests sent. Please try again in {minutes} minutes.',
        },
        envoiImpossible:
          'Your message could not be sent. Please try again in a few minutes, or use the app for a request about a booking.',
        champs: {
          firstName: 'Please enter your first name (2 to 60 characters).',
          lastName: 'Please enter your last name (2 to 60 characters).',
          email: 'Please enter a valid email address.',
          phone: 'Please enter a valid phone number.',
          subject: 'Please choose a subject.',
          message: 'Please describe your request (20 to 2,000 characters).',
          consent: 'Your consent is needed to process your request.',
        },
      },
    },
  },
  reservation: {
    titre: 'For a booking',
    texte:
      'Booking, changing an appointment or following a request is done in the Najem Clean Service app.',
  },
  coordonnees: {
    titre: 'Contact details',
    whatsapp: 'Message us on WhatsApp',
    messageWhatsapp: 'Hello, I would like some information about your services.',
    absentes:
      'Our direct contact details are not published on the site yet. In the meantime, the form on this page and the app are the two ways to reach us.',
    delai: { avant: 'Usual response time: ', apres: '.' },
  },
  schema: { nomPage: 'Contact — Najem Clean Service' },
};

const arabe: TextesContact = {
  seo: {
    titre: 'اتصل بنا: تنظيف المنازل بالدار البيضاء',
    description:
      'لديك سؤال أو ترغب في شراكة لخدمة كونسيرج؟ تواصل مع Najem Clean Service بالدار البيضاء، نجيبك عبر البريد الإلكتروني أو الهاتف أو التطبيق.',
  },
  fil: { accueil: 'الرئيسية', page: 'اتصل بنا', libelle: 'مسار التنقل' },
  hero: {
    surtitre: 'اتصل بنا',
    titre: 'لديك سؤال؟ راسلنا.',
    introduction:
      'هذه الاستمارة مخصصة لطلبات الاستفسار عن خدماتنا للتنظيف المنزلي في الدار البيضاء. أما إن كان طلبك يتعلق بحجز جارٍ، فالتطبيق يبقى القناة الأكثر مباشرة: تفاصيل موعدك مرتبطة به هناك.',
  },
  formulaire: {
    titre: 'استمارة الاتصال',
    introduction: 'صف حاجتك في بضعة أسطر. كلما كانت رسالتك أدق، كان ردنا أدق.',
    textes: {
      champPiege: 'اترك هذا الحقل فارغا',
      prenom: 'الاسم الشخصي',
      nom: 'الاسم العائلي',
      email: 'البريد الإلكتروني',
      telephone: 'الهاتف',
      facultatif: '(اختياري)',
      objet: 'الموضوع',
      choisirObjet: 'اختر الموضوع',
      objets: {
        reservation: 'حجز',
        application: 'تطبيق الهاتف',
        prestation: 'خدمة تنظيف',
        autre: 'موضوع آخر',
      },
      message: 'الرسالة',
      aideMessage: 'حدّد حاجتك: نوع المسكن، والخدمة التي تريدها، والأوقات التي تناسبك.',
      consentement: 'أوافق على استعمال هذه المعلومات لمعالجة طلبي.',
      envoiEnCours: 'جارٍ الإرسال…',
      envoyer: 'إرسال الرسالة',
      obligatoires: { avant: 'الحقول التي تحمل علامة ', apres: ' إلزامية.' },
      apresEnvoi:
        'سنرد عليك على البريد الإلكتروني الذي أدخلته. وإن كان طلبك يتعلق بحجز جارٍ، فالتطبيق يبقى القناة الأكثر مباشرة.',
      messages: {
        langue: 'ar',
        succes: 'شكرا لك. تم إرسال رسالتك بنجاح.',
        champsACorriger: 'بعض الحقول تحتاج إلى تصحيح.',
        tropDeDemandes: {
          one: 'تم إرسال عدد كبير جدا من الطلبات. يرجى المحاولة مرة أخرى بعد دقيقة واحدة.',
          two: 'تم إرسال عدد كبير جدا من الطلبات. يرجى المحاولة مرة أخرى بعد دقيقتين.',
          few: 'تم إرسال عدد كبير جدا من الطلبات. يرجى المحاولة مرة أخرى بعد {minutes} دقائق.',
          other: 'تم إرسال عدد كبير جدا من الطلبات. يرجى المحاولة مرة أخرى بعد {minutes} دقيقة.',
        },
        envoiImpossible:
          'تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى بعد بضع دقائق، أو استعمال التطبيق إن كان طلبك يتعلق بحجز.',
        champs: {
          firstName: 'يرجى إدخال اسمك الشخصي (من 2 إلى 60 حرفا).',
          lastName: 'يرجى إدخال اسمك العائلي (من 2 إلى 60 حرفا).',
          email: 'يرجى إدخال بريد إلكتروني صحيح.',
          phone: 'يرجى إدخال رقم هاتف صحيح.',
          subject: 'يرجى اختيار الموضوع.',
          message: 'يرجى توضيح طلبك (من 20 إلى 2000 حرف).',
          consent: 'موافقتك ضرورية لمعالجة طلبك.',
        },
      },
    },
  },
  reservation: {
    titre: 'للحجز',
    texte: 'الحجز وتعديل الموعد ومتابعة الطلب، كل ذلك يتم من تطبيق Najem Clean Service.',
  },
  coordonnees: {
    titre: 'معلومات الاتصال',
    whatsapp: 'راسلنا على واتساب',
    messageWhatsapp: 'مرحبا، أود الاستفسار عن خدماتكم.',
    absentes:
      'لم تُنشر معلومات الاتصال المباشر في الموقع بعد. وإلى ذلك الحين، فإن الاستمارة الموجودة في هذه الصفحة والتطبيق هما الوسيلتان المتاحتان للتواصل معنا.',
    delai: { avant: 'مدة الرد المعتادة: ', apres: '.' },
  },
  schema: { nomPage: 'اتصل بنا — Najem Clean Service' },
};

export const textesContact: Record<LangueTraduite, TextesContact> = { ar: arabe, en: anglais };
