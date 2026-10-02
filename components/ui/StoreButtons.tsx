import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function GooglePlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M3.609 1.814 13.792 12 3.609 22.186A1.51 1.51 0 0 1 3 20.986V3.014c0-.484.243-.917.609-1.2z"
        fill="#2196F3"
      />
      <path d="M17.033 8.757 5.115 1.771C4.494 1.417 3.943 1.46 3.609 1.814L13.792 12l3.241-3.243z" fill="#00C853" />
      <path
        d="M16.797 15.205 13.792 12l3.241-3.243 3.564 2.09c1.017.578 1.017 1.524 0 2.102l-3.8 2.256z"
        fill="#FFC107"
      />
      <path d="M13.792 12 3.609 22.186c.334.354.885.397 1.506.043l11.918-6.986L13.792 12z" fill="#F44336" />
    </svg>
  );
}

type StoreButtonProps = {
  store: 'ios' | 'android';
  tone?: 'dark' | 'light';
  className?: string;
};

const labels = {
  ios: {
    top: 'Télécharger dans l’',
    bottom: 'App Store',
    aria: 'Télécharger dans l’App Store',
  },
  android: {
    top: 'Disponible sur',
    bottom: 'Google Play',
    aria: 'Télécharger sur Google Play',
  },
} as const;

export function StoreButton({ store, tone = 'dark', className }: StoreButtonProps) {
  const app = store === 'ios' ? siteConfig.apps.ios : siteConfig.apps.android;
  const label = labels[store];

  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      data-store={store}
      aria-label={`${label.aria} — application ${siteConfig.name} (nouvelle fenêtre)`}
      className={cn(
        'group inline-flex h-[3.25rem] items-center gap-3 rounded-xl px-4 transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5',
        // Le badge se pose toujours en contraste de son fond : pastille sombre
        // sur une page claire, pastille claire sur une page sombre.
        tone === 'dark'
          ? 'bg-night text-white shadow-[0_14px_32px_-20px_rgba(6,36,66,0.9)] hover:bg-night-deep dark:bg-white dark:text-night dark:shadow-none dark:hover:bg-brand-50'
          : 'border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/15',
        className,
      )}
    >
      {store === 'ios' ? (
        <AppleGlyph className="h-6 w-6 shrink-0" />
      ) : (
        <GooglePlayGlyph className="h-[1.35rem] w-[1.35rem] shrink-0" />
      )}
      <span className="flex flex-col items-start leading-none">
        <span
          className={cn(
            'text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/80',
            tone === 'dark' && 'dark:text-night/70',
          )}
        >
          {label.top}
        </span>
        <span className="mt-1 font-display text-[0.95rem] font-semibold tracking-[-0.01em]">
          {label.bottom}
        </span>
      </span>
    </a>
  );
}

export function StoreButtons({
  tone = 'dark',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <StoreButton store="ios" tone={tone} />
      <StoreButton store="android" tone={tone} />
    </div>
  );
}
