import { ChromeInternational } from '@/components/international/ChromeInternational';
import { accueilAr } from '@/content/i18n/ar';

/** Habillage de la version arabe : lecture de droite à gauche. */
export default function LayoutArabe({ children }: { children: React.ReactNode }) {
  return <ChromeInternational dico={accueilAr}>{children}</ChromeInternational>;
}
