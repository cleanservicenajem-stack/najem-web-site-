import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { SiteChrome } from '@/components/layout/SiteChrome';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

const suggestions = [
  { label: 'Les services de nettoyage', href: '/services' },
  { label: 'L’application mobile', href: '/application' },
  { label: 'Questions fréquentes', href: '/faq' },
  { label: 'Nous contacter', href: '/contact' },
];

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="relative -mt-[var(--header-height)] flex min-h-[85vh] items-center overflow-hidden bg-[image:var(--gradient-brand-soft)] pt-[var(--header-height)]">
        <div
          aria-hidden="true"
          className="absolute -right-20 top-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.16),transparent_70%)]"
        />
        <div aria-hidden="true" className="dot-veil absolute bottom-0 left-0 h-64 w-64 opacity-50" />

        <Container className="relative">
          <div className="max-w-2xl">
            <Logo variant="lockup" tone="auto" size={44} />

            <p className="mt-10 font-display text-[0.8rem] font-bold tracking-[0.24em] text-brand-600">
              ERREUR 404
            </p>

            <h1 className="mt-4 font-display text-[clamp(2rem,1.4rem+2.6vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-navy-900">
              Cette page semble avoir besoin d’un petit nettoyage.
            </h1>

            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink-soft">
              L’adresse demandée n’existe pas ou a été déplacée. Voici par où continuer.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/" size="lg">
                Retour à l’accueil
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Signaler un lien cassé
              </Button>
            </div>

            <nav aria-label="Pages suggérées" className="mt-12 border-t border-[var(--border)] pt-8">
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem]">
                {suggestions.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-navy-700 underline decoration-brand-200 underline-offset-4 transition-colors duration-300 hover:text-brand-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
