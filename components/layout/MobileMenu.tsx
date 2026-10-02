'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { mainNav } from '@/config/navigation';
import { EASE_OUT } from '@/lib/motion';
import { LogoLink } from '@/components/ui/Logo';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  const reduceMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      // Le focus reste à l'intérieur du panneau tant qu'il est ouvert.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="fixed inset-0 z-[55] flex flex-col bg-surface lg:hidden"
        >
          <div className="flex h-[var(--header-height)] items-center justify-between px-5">
            <LogoLink size={36} tone="auto" onClick={onClose} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-navy-700 transition-colors duration-300 hover:bg-paper"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-6 pb-8">
            <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {mainNav.map((item, index) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href.split('#')[0] ?? '');

                return (
                  <motion.li
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.045, ease: EASE_OUT }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex flex-col gap-1 py-4',
                        isActive ? 'text-brand-600' : 'text-navy-800',
                      )}
                    >
                      <span className="font-display text-xl font-semibold">{item.label}</span>
                      {item.description ? (
                        <span className="text-[0.8rem] text-ink-soft">{item.description}</span>
                      ) : null}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-10">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                Télécharger l’application
              </p>
              <StoreButtons className="mt-4" />
            </div>

            <ThemeToggle variant="switch" className="mt-8" />
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
