import type { Langue } from '@/config/i18n';
import { textesChrome } from '@/content/i18n/chrome';

export function SkipLink({ langue = 'fr' }: { langue?: Langue }) {
  return (
    <a
      href="#contenu"
      className="sr-only z-[70] focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:rounded-full focus:bg-night focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-brand-600 dark:focus:text-night"
    >
      {textesChrome[langue].allerAuContenu}
    </a>
  );
}
