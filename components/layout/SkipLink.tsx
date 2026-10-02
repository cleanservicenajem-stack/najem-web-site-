export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only z-[70] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-night focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-brand-600 dark:focus:text-night"
    >
      Aller au contenu principal
    </a>
  );
}
