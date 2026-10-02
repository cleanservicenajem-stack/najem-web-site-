import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
};

/** Lien texte avec flèche : soulignement qui se déploie au survol. */
export function ArrowLink({ href, children, className, tone = 'light' }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 text-[0.95rem] font-medium transition-colors duration-300',
        tone === 'light' ? 'text-navy-600 hover:text-brand-600' : 'text-brand-100 hover:text-white',
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            'absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:w-full',
            tone === 'light' ? 'bg-brand-500' : 'bg-white/70',
          )}
        />
      </span>
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
