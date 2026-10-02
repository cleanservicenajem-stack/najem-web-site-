'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { readSessionFlag, usePrefersReducedMotion, useScrolledPast, writeSessionFlag } from '@/lib/hooks';
import { EASE_OUT } from '@/lib/motion';

const DISMISS_KEY = 'najem:app-bar-dismissed';

type Platform = 'ios' | 'android' | 'other';

const detectPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
};

/**
 * Barre de rappel mobile, volontairement discrète : elle n'apparaît qu'après
 * le premier écran, se referme définitivement pour la session, et laisse
 * toujours l'accès aux deux stores.
 */
export function MobileAppBar() {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const visible = useScrolledPast(720);
  const [dismissed, setDismissed] = useState(() => readSessionFlag(DISMISS_KEY));
  const [platform] = useState<Platform>(detectPlatform);

  const close = () => {
    setDismissed(true);
    writeSessionFlag(DISMISS_KEY);
  };

  const onAppPage = pathname === '/application';
  const show = visible && !dismissed && !onAppPage;

  const primary = platform === 'android' ? siteConfig.apps.android : siteConfig.apps.ios;
  const secondary = platform === 'android' ? siteConfig.apps.ios : siteConfig.apps.android;
  // Verbe court : la barre doit rester lisible dès 320px de large.
  const primaryLabel = platform === 'android' ? 'Installer' : 'Obtenir';

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-surface/95 p-2 pl-3.5 shadow-[0_20px_50px_-24px_rgba(6,36,66,0.55)] backdrop-blur-lg">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[0.82rem] font-semibold leading-tight text-navy-800">
                {siteConfig.name}
              </p>
              <a
                href={secondary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.7rem] text-ink-soft underline decoration-hairline underline-offset-2"
              >
                Aussi sur {secondary.label}
              </a>
            </div>

            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Télécharger l’application sur ${primary.label} (nouvelle fenêtre)`}
              className="shrink-0 rounded-xl bg-[image:var(--gradient-brand)] px-3.5 py-2 text-[0.8rem] font-semibold text-white"
            >
              {primaryLabel}
            </a>

            <button
              type="button"
              onClick={close}
              aria-label="Masquer ce rappel"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
