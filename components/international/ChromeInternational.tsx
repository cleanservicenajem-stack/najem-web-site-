import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { accueilParLangue, directionParLangue } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import type { DictionnaireAccueil } from '@/content/i18n/types';
import { Logo } from '@/components/ui/Logo';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { StructuredData } from '@/components/seo/StructuredData';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

/**
 * Habillage des pages traduites (/ar, /en) : en-tête, pied de page et
 * données structurées de l'entreprise.
 *
 * Il est distinct de celui du site français, dont les menus pointent vers des
 * pages qui n'existent qu'en français. Ici, le menu ne renvoie qu'à des
 * sections de la page, et les liens vers le site français le disent.
 */

const lienSection = 'text-[0.9rem] font-medium text-navy-800/85 transition-colors duration-300 hover:text-brand-700';

function EnTete({ dico }: { dico: DictionnaireAccueil }) {
  const accueil = accueilParLangue[dico.langue];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/85 shadow-[var(--shadow-header)] backdrop-blur-xl">
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href={accueil}
          aria-label={dico.entete.accueil}
          className="inline-flex shrink-0 rounded-lg transition-opacity duration-300 hover:opacity-85"
        >
          <Logo size={34} priority tone="auto" className="lg:hidden" />
          <Logo size={42} priority tone="auto" className="hidden lg:inline-flex" />
        </Link>

        <nav aria-label={dico.entete.navigation} className="hidden lg:block">
          <ul className="flex items-center gap-6">
            <li>
              <a href="#services" className={lienSection}>
                {dico.entete.menu.services}
              </a>
            </li>
            <li>
              <a href="#tarifs" className={lienSection}>
                {dico.entete.menu.tarifs}
              </a>
            </li>
            <li>
              <a href="#questions" className={lienSection}>
                {dico.entete.menu.questions}
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher courante={dico.langue} />
          <a
            href="#telecharger"
            className="hidden h-10 items-center gap-2 rounded-full bg-[image:var(--gradient-brand)] px-4 text-sm font-medium text-white shadow-[0_10px_30px_-14px_rgba(10,111,207,0.85)] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
          >
            {dico.entete.telecharger}
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Pied({ dico }: { dico: DictionnaireAccueil }) {
  const annee = new Date().getFullYear();
  const lien = 'inline-block transition-colors duration-300 hover:text-white';

  return (
    <footer className="relative overflow-hidden bg-night-deep text-brand-100/75">
      <div aria-hidden="true" className="grid-veil absolute inset-0 opacity-60" />
      <Container className="relative">
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
          <div>
            <Logo variant="stacked" tone="dark" size={112} />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{dico.pied.description}</p>
            <StoreButtons tone="light" className="mt-8" textes={dico.boutiques} />
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p
                className={cn(
                  'font-display font-semibold text-white',
                  // Pas d'espacement des lettres en arabe : il casse leur liaison.
                  dico.langue === 'ar'
                    ? 'text-[0.95rem]'
                    : 'text-[0.8rem] uppercase tracking-[0.16em]',
                )}
              >
                {dico.pied.langueChoix}
              </p>
              <LanguageSwitcher
                courante={dico.langue}
                variante="complet"
                ton="sombre"
                className="mt-4"
              />
            </div>

            <ul className="space-y-3 text-[0.925rem]">
              <li>
                {/* Changement de langue : rechargement complet voulu. */}
                <a href="/" hrefLang="fr" lang="fr" className={lien}>
                  {dico.pied.siteFrancais}
                </a>
              </li>
              <li>
                <a href="/mentions-legales" hrefLang="fr" className={lien}>
                  {dico.pied.mentions}
                </a>
              </li>
              <li>
                <a href="/confidentialite" hrefLang="fr" className={lien}>
                  {dico.pied.confidentialite}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pb-6 pt-8 text-[0.85rem]">
          <p>
            © {annee} {siteConfig.name}. {dico.pied.droits}
          </p>
        </div>
      </Container>
    </footer>
  );
}

/**
 * La langue et le sens de lecture sont portés par l'enveloppe de la page. Le
 * petit script les reporte aussi sur l'élément <html>, que la mise en page
 * racine déclare en français, pour les lecteurs d'écran et les navigateurs.
 */
export async function ChromeInternational({
  dico,
  children,
}: {
  dico: DictionnaireAccueil;
  children: React.ReactNode;
}) {
  const organisation = await organizationSchema();
  const direction = directionParLangue[dico.langue];

  return (
    <div lang={dico.langue} dir={direction}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(dico.langue)};document.documentElement.dir=${JSON.stringify(direction)};`,
        }}
      />
      <EnTete dico={dico} />
      <main id="contenu" className="pt-[var(--header-height)]">
        {children}
      </main>
      <Pied dico={dico} />
      <StructuredData id="site-schema" data={[organisation, websiteSchema()]} />
    </div>
  );
}
