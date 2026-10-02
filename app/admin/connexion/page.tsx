import type { Metadata } from 'next';
import { ShieldAlert } from 'lucide-react';
import { ConnexionForm } from '@/components/admin/ConnexionForm';
import { Logo } from '@/components/ui/Logo';
import { authConfiguree } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Connexion' };
export const dynamic = 'force-dynamic';

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ suivant?: string }>;
}) {
  const { suivant } = await searchParams;
  const configure = authConfiguree();

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Logo variant="lockup" tone="auto" size={40} />

        <h1 className="mt-10 font-display text-[1.6rem] font-bold leading-tight text-navy-900">
          Administration du site
        </h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          Cet espace permet de modifier les textes et les coordonnées affichés sur le site public.
        </p>

        {configure ? (
          <ConnexionForm suivant={suivant ?? '/admin'} />
        ) : (
          <div className="mt-8 rounded-2xl border border-warn-line bg-warn-surface p-5 text-[0.9rem] leading-relaxed text-warn-ink">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            <p className="mt-3 font-semibold">Administration non configurée</p>
            <p className="mt-2">
              Il manque une variable d’environnement sur ce serveur :{' '}
              <code className="font-mono text-[0.85em]">SUPABASE_URL</code>,{' '}
              <code className="font-mono text-[0.85em]">SUPABASE_ANON_KEY</code> ou{' '}
              <code className="font-mono text-[0.85em]">ADMIN_EMAILS</code>. En local, elles se
              renseignent dans <code className="font-mono text-[0.85em]">.env.local</code> ; en
              ligne, dans les réglages de l’hébergeur. Un redéploiement est nécessaire pour
              qu’elles soient prises en compte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
