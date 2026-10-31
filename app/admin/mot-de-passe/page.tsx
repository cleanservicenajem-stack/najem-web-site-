import type { Metadata } from 'next';
import { AdminNav } from '@/components/admin/AdminNav';
import { MotDePasseForm } from '@/components/admin/MotDePasseForm';
import { exigerAdministrateur } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Mot de passe' };

export default async function MotDePassePage() {
  const compte = await exigerAdministrateur();

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminNav actif="mot-de-passe" />

      <main className="px-6 py-10 lg:px-12 lg:py-14">
        <div className="max-w-xl">
          <h1 className="font-display text-[1.9rem] font-bold leading-tight text-navy-900 md:text-[2.3rem]">
            Changer le mot de passe
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
            Compte : <span className="font-semibold text-ink">{compte.email}</span>. Choisissez au
            moins 12 caractères, que vous n’utilisez nulle part ailleurs.
          </p>

          <MotDePasseForm />
        </div>
      </main>
    </div>
  );
}
