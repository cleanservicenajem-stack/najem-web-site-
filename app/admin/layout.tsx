import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Administration',
    template: '%s | Administration',
  },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * L'administration n'affiche ni l'en-tête ni le pied de page du site : elle
 * vit hors du groupe `(site)` et pose son propre fond.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-paper text-ink">{children}</div>;
}
