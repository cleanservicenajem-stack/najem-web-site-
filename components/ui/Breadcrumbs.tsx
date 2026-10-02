import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Crumb = { name: string; path: string };

/** Fil d'Ariane visible — doublé par un `BreadcrumbList` en JSON-LD. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d’Ariane" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-navy-700">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="transition-colors duration-200 hover:text-brand-600"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-hairline" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
