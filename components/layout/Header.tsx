'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useScrolledPast } from '@/lib/hooks';
import { mainNav } from '@/config/navigation';
import { LogoLink } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { cn } from '@/lib/utils';

/** Navigation desktop : l'accueil est porté par le logo. */
const desktopNav = mainNav.filter((item) => item.href !== '/');

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(12);
  // Le menu mémorise la page depuis laquelle il a été ouvert : dès que la
  // navigation aboutit sur une autre page, il se referme de lui-même.
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;

  const isActive = (href: string) => {
    // Une ancre de la page d'accueil n'est jamais marquée comme page courante.
    if (href.includes('#')) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-out-soft)]',
          scrolled
            ? 'bg-surface/85 shadow-[var(--shadow-header)] backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-6">
          <LogoLink size={38} priority tone="auto" className="lg:hidden" />
          <LogoLink size={44} priority tone="auto" className="hidden lg:inline-flex" />

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {desktopNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.9rem] font-medium transition-colors duration-300',
                        active ? 'text-brand-700' : 'text-navy-800/85 hover:text-brand-700',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute bottom-1.5 left-3.5 right-3.5 h-px origin-left bg-brand-500 transition-transform duration-400 ease-[var(--ease-out-soft)]',
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              href="/application"
              size="sm"
              className="hidden sm:inline-flex"
              icon={<Smartphone className="h-4 w-4" aria-hidden="true" />}
            >
              Télécharger l’application
            </Button>

            <button
              type="button"
              onClick={() => setMenu({ open: true, path: pathname })}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-surface/70 text-navy-800 transition-colors duration-300 hover:bg-surface lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            'hairline-accent transition-opacity duration-500',
            scrolled ? 'opacity-40' : 'opacity-0',
          )}
        />
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenu({ open: false, path: pathname })}
        pathname={pathname}
      />
    </>
  );
}
