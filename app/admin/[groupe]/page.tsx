import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { exigerAdministrateur } from '@/lib/admin/auth';
import { AlerteStockage } from '@/components/admin/AlerteStockage';
import { ChampsForm } from '@/components/admin/ChampsForm';
import { getGroupeEditable } from '@/config/editable';
import { getTexte } from '@/lib/content';
import { compterNonLus } from '@/lib/admin/messages';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ groupe: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { groupe } = await params;
  return { title: getGroupeEditable(groupe)?.label ?? 'Section inconnue' };
}

export default async function GroupePage({ params }: PageProps) {
  await exigerAdministrateur();
  const { groupe: slug } = await params;
  const groupe = getGroupeEditable(slug);

  if (!groupe) notFound();

  const nonLus = await compterNonLus();

  // Les valeurs pré-remplies sont celles réellement affichées sur le site :
  // texte enregistré s'il existe, texte du code sinon.
  const valeurs = Object.fromEntries(
    await Promise.all(
      groupe.champs.map(async (champ) => [champ.cle, await getTexte(champ.cle)] as const),
    ),
  );

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminNav actif={groupe.slug} nonLus={nonLus} />

      <main className="px-6 py-10 lg:px-12 lg:py-14">
        <div className="max-w-2xl">
          <AlerteStockage />

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-sm text-[0.9rem] text-ink-soft transition-colors duration-300 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-line"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Tableau de bord
          </Link>

          <h1 className="mt-6 font-display text-[1.9rem] font-bold leading-tight text-navy-900 md:text-[2.3rem]">
            {groupe.label}
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{groupe.description}</p>

          <div className="mt-10">
            <ChampsForm groupe={groupe} valeurs={valeurs} />
          </div>
        </div>
      </main>
    </div>
  );
}
