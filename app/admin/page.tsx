import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MessageSquare } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { exigerAdministrateur } from '@/lib/admin/auth';
import { AlerteStockage } from '@/components/admin/AlerteStockage';
import { groupesEditables, type GroupeEditable } from '@/config/editable';
import { getTexte } from '@/lib/content';
import { compterNonLus } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

/** Nombre de champs facultatifs encore vides : c'est ce qui reste à renseigner. */
const champsAComplete = async (groupe: GroupeEditable): Promise<number> => {
  const etats = await Promise.all(
    groupe.champs.map(async (champ) =>
      Boolean(champ.facultatif) && (await getTexte(champ.cle)).length === 0,
    ),
  );
  return etats.filter(Boolean).length;
};

export default async function AdminPage() {
  await exigerAdministrateur();
  const nonLus = await compterNonLus();
  const manquants = new Map(
    await Promise.all(
      groupesEditables.map(
        async (groupe) => [groupe.slug, await champsAComplete(groupe)] as const,
      ),
    ),
  );

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminNav nonLus={nonLus} />

      <main className="px-6 py-10 lg:px-12 lg:py-14">
        <div className="max-w-3xl">
          <AlerteStockage />

          <h1 className="font-display text-[1.9rem] font-bold leading-tight text-navy-900 md:text-[2.3rem]">
            Tableau de bord
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
            Modifiez les textes du site sans passer par le code. Chaque enregistrement est publié
            immédiatement.
          </p>

          <ul className="mt-10 space-y-4">
            {groupesEditables.map((groupe) => {
              const restants = manquants.get(groupe.slug) ?? 0;

              return (
                <li key={groupe.slug}>
                  <Link
                    href={`/admin/${groupe.slug}`}
                    className="group block rounded-2xl border border-[var(--border)] bg-surface p-6 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-line hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="font-display text-[1.15rem] font-semibold text-navy-800 transition-colors duration-300 group-hover:text-brand-700">
                          {groupe.label}
                        </p>
                        <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-ink-soft">
                          {groupe.description}
                        </p>
                      </div>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>

                    {restants > 0 ? (
                      <p className="mt-4 inline-flex rounded-full border border-warn-line bg-warn-surface px-3 py-1 text-[0.8rem] font-medium text-warn-ink">
                        {restants === 1
                          ? '1 information encore absente du site'
                          : `${restants} informations encore absentes du site`}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}

            <li>
              <Link
                href="/admin/messages"
                className="group block rounded-2xl border border-[var(--border)] bg-surface p-6 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-brand-line hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="flex items-center gap-2.5 font-display text-[1.15rem] font-semibold text-navy-800 transition-colors duration-300 group-hover:text-brand-700">
                      <MessageSquare className="h-4 w-4 text-brand-500" aria-hidden="true" />
                      Messages reçus
                    </p>
                    <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-ink-soft">
                      Les demandes envoyées depuis le formulaire de contact, conservées douze mois.
                    </p>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-brand-400 transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>

                {nonLus > 0 ? (
                  <p className="mt-4 inline-flex rounded-full bg-brand-tint px-3 py-1 text-[0.8rem] font-semibold text-brand-700">
                    {nonLus === 1 ? '1 message non lu' : `${nonLus} messages non lus`}
                  </p>
                ) : null}
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
