import { ChromeInternational } from '@/components/international/ChromeInternational';
import { accueilEn } from '@/content/i18n/en';

/** Habillage de la version anglaise. */
export default function LayoutAnglais({ children }: { children: React.ReactNode }) {
  return <ChromeInternational dico={accueilEn}>{children}</ChromeInternational>;
}
