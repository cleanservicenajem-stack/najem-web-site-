import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PillProps = {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
  /** Petit point coloré en tête de pastille. */
  dot?: boolean;
};

export function Pill({ children, className, tone = 'light', dot = true }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full py-1.5 pl-3 pr-4 text-[0.8rem] font-medium',
        tone === 'light'
          ? 'border border-brand-line bg-brand-tint text-navy-600'
          : 'border border-white/15 bg-white/10 text-brand-50 backdrop-blur-sm',
        className,
      )}
    >
      {dot ? (
        <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-brand opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-brand" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
