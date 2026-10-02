import { AlertTriangle } from 'lucide-react';
import { ecritureConfiguree } from '@/lib/admin/store';

/**
 * Avertissement affiché tant que Supabase n'est pas branché.
 *
 * Sans lui, l'administration aurait l'air de fonctionner : les formulaires
 * s'affichent, et l'échec n'apparaîtrait qu'au moment d'enregistrer.
 */
export function AlerteStockage() {
  if (ecritureConfiguree()) return null;

  return (
    <div
      role="status"
      className="mb-8 flex gap-3.5 rounded-2xl border border-warn-line bg-warn-surface p-5"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn-ink" aria-hidden="true" />
      <div className="text-[0.92rem] leading-relaxed text-warn-ink">
        <p className="font-semibold">Base de données non connectée</p>
        <p className="mt-1.5">
          Les modifications ne pourront pas être enregistrées. Renseignez{' '}
          <code className="rounded bg-warn-ink/10 px-1.5 py-0.5 text-[0.85em]">SUPABASE_URL</code>,{' '}
          <code className="rounded bg-warn-ink/10 px-1.5 py-0.5 text-[0.85em]">SUPABASE_ANON_KEY</code>{' '}
          et{' '}
          <code className="rounded bg-warn-ink/10 px-1.5 py-0.5 text-[0.85em]">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{' '}
          dans le fichier <code className="rounded bg-warn-ink/10 px-1.5 py-0.5 text-[0.85em]">
            .env.local
          </code>, puis redémarrez le serveur.
        </p>
      </div>
    </div>
  );
}
