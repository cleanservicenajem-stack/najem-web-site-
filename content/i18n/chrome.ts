import type { Langue } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import type { TextesBoutiques } from '@/components/ui/StoreButtons';
import { communs } from '@/content/i18n/commun';

/**
 * Textes de l'habillage (en-tête, menus, pied de page, barre de rappel), dans
 * chaque langue. Le français reprend mot pour mot les textes d'origine.
 */
export type TextesChrome = {
  allerAuContenu: string;
  retourAccueil: string;
  navigationPrincipale: string;
  menuPrincipal: string;
  navigationMobile: string;
  ouvrirMenu: string;
  fermerMenu: string;
  telechargerApplication: string;
  langueDuSite: string;
  theme: { activerClair: string; activerSombre: string; themeSombre: string };
  pied: { presentation: string; telecharger: string; droits: string; zonesDesservies: string };
  barreApp: {
    aussiSur: string;
    installer: string;
    obtenir: string;
    telechargerSur: (boutique: string) => string;
    masquer: string;
  };
  /** Absents en français : les badges gardent leurs libellés d'origine. */
  boutiques?: TextesBoutiques;
  /** Nom affiché de chaque ville desservie, par slug. */
  villes?: Record<string, string>;
};

export const textesChrome: Record<Langue, TextesChrome> = {
  fr: {
    allerAuContenu: 'Aller au contenu principal',
    retourAccueil: `${siteConfig.name} — retour à l'accueil`,
    navigationPrincipale: 'Navigation principale',
    menuPrincipal: 'Menu principal',
    navigationMobile: 'Navigation mobile',
    ouvrirMenu: 'Ouvrir le menu',
    fermerMenu: 'Fermer le menu',
    telechargerApplication: 'Télécharger l’application',
    langueDuSite: 'Langue du site',
    theme: {
      activerClair: 'Activer le thème clair',
      activerSombre: 'Activer le thème sombre',
      themeSombre: 'Thème sombre',
    },
    pied: {
      presentation: `${siteConfig.positioning} Choisissez votre prestation, sélectionnez un créneau, et suivez votre demande depuis votre compte.`,
      telecharger: 'Télécharger',
      droits: 'Tous droits réservés.',
      zonesDesservies: 'Zones desservies',
    },
    barreApp: {
      aussiSur: 'Aussi sur',
      installer: 'Installer',
      obtenir: 'Obtenir',
      telechargerSur: (boutique) => `Télécharger l’application sur ${boutique} (nouvelle fenêtre)`,
      masquer: 'Masquer ce rappel',
    },
  },

  ar: {
    allerAuContenu: 'الانتقال إلى المحتوى الرئيسي',
    retourAccueil: `${siteConfig.name} — العودة إلى الصفحة الرئيسية`,
    navigationPrincipale: 'القائمة الرئيسية',
    menuPrincipal: 'القائمة الرئيسية',
    navigationMobile: 'التنقل في الموقع',
    ouvrirMenu: 'فتح القائمة',
    fermerMenu: 'إغلاق القائمة',
    telechargerApplication: 'حمّل التطبيق',
    langueDuSite: 'لغة الموقع',
    theme: {
      activerClair: 'تفعيل الوضع الفاتح',
      activerSombre: 'تفعيل الوضع الداكن',
      themeSombre: 'الوضع الداكن',
    },
    pied: {
      presentation:
        'خدمات التنظيف المنزلي في الدار البيضاء ونواحيها، تُحجز عبر تطبيق على الهاتف. اختر الخدمة، وحدد الموعد، وتابع طلبك من حسابك.',
      telecharger: 'حمّل التطبيق',
      droits: 'جميع الحقوق محفوظة.',
      zonesDesservies: 'المناطق المخدومة',
    },
    barreApp: {
      aussiSur: 'متوفر أيضا على',
      installer: 'تثبيت',
      obtenir: 'تحميل',
      telechargerSur: (boutique) => `حمّل التطبيق من ${boutique} (يفتح في نافذة جديدة)`,
      masquer: 'إخفاء هذا التذكير',
    },
    boutiques: communs.ar.boutiques,
    villes: communs.ar.villes,
  },

  en: {
    allerAuContenu: 'Skip to main content',
    retourAccueil: `${siteConfig.name} — back to home`,
    navigationPrincipale: 'Main navigation',
    menuPrincipal: 'Main menu',
    navigationMobile: 'Mobile navigation',
    ouvrirMenu: 'Open menu',
    fermerMenu: 'Close menu',
    telechargerApplication: 'Get the app',
    langueDuSite: 'Site language',
    theme: {
      activerClair: 'Switch to light theme',
      activerSombre: 'Switch to dark theme',
      themeSombre: 'Dark theme',
    },
    pied: {
      presentation:
        'Home cleaning services in Casablanca and the surrounding area, booked through a mobile app. Choose your service, pick a time slot and follow your request from your account.',
      telecharger: 'Download',
      droits: 'All rights reserved.',
      zonesDesservies: 'Areas served',
    },
    barreApp: {
      aussiSur: 'Also on',
      installer: 'Install',
      obtenir: 'Get',
      telechargerSur: (boutique) => `Download the app on ${boutique} (opens in a new window)`,
      masquer: 'Hide this reminder',
    },
    boutiques: communs.en.boutiques,
    villes: communs.en.villes,
  },
};
