import Link from 'next/link';
import { ArrowUpRight, LogOut } from 'lucide-react';
import { seDeconnecter } from '@/app/admin/actions';
import { groupesEditables } from '@/config/editable';
import { administrateurCourant } from '@/lib/admin/auth';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

/**
 * Barre latérale de l'administration. Elle reste une colonne simple : un menu
 * déployable serait du décor pour une poignée de sections.
 *
 * `nonLus` affiche la pastille des messages en attente ; il reste indéfini
 * tant que la base n'est pas branchée.
 */
export async function AdminNav({ actif, nonLus }: { actif?: string; nonLus?: number }) {
  const compte = await administrateurCourant();

  return (
    <aside className="border-b border-[var(--border)] bg-surface lg:min-h-dvh lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-8 p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="rounded-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line">
            <Logo variant="lockup" tone="auto" size={34} />
            <span className="sr-only">Tableau de bord</span>
          </Link>
          <ThemeToggle />
        </div>

        <nav aria-label="Sections modifiables" className="flex-1">
          <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Contenu
          </p>
          <ul className="mt-4 space-y-1">
            {groupesEditables.map((groupe) => (
              <li key={groupe.slug}>
                <Link
                  href={`/admin/${groupe.slug}`}
                  aria-current={actif === groupe.slug ? 'page' : undefined}
                  className={cn(
                    'block rounded-xl px-4 py-2.5 text-[0.95rem] transition-colors duration-300',
                    actif === groupe.slug
                      ? 'bg-brand-tint font-semibold text-brand-700'
                      : 'text-ink hover:bg-paper',
                  )}
                >
                  {groupe.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            Formulaire
          </p>
          <ul className="mt-4 space-y-1">
            <li>
              <Link
                href="/admin/messages"
                aria-current={actif === 'messages' ? 'page' : undefined}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-[0.95rem] transition-colors duration-300',
                  actif === 'messages'
                    ? 'bg-brand-tint font-semibold text-brand-700'
                    : 'text-ink hover:bg-paper',
                )}
              >
                Messages reçus
                {nonLus ? (
                  <span className="inline-flex min-w-6 justify-center rounded-full bg-brand-600 px-2 py-0.5 text-[0.7rem] font-semibold text-white">
                    {nonLus}
                    <span className="sr-only"> non lus</span>
                  </span>
                ) : null}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3 border-t border-[var(--border)] pt-6">
          {compte ? (
            <p className="truncate text-[0.85rem] text-ink-soft" title={compte.email}>
              Connecté en tant que{' '}
              <span className="font-semibold text-ink">{compte.email}</span>
            </p>
          ) : null}

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.9rem] text-ink-soft transition-colors duration-300 hover:text-brand-600"
          >
            Voir le site
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <form action={seDeconnecter}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-sm text-[0.9rem] text-ink-soft transition-colors duration-300 hover:text-danger-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
