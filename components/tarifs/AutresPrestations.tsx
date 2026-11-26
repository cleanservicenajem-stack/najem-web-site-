import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';

export type BlocTarif = { titre: string; lignes: string[] };

/** Prestation seule, recharges et fidélité : trois encadrés sous la grille. */
export function AutresPrestations({ titre, blocs }: { titre: string; blocs: BlocTarif[] }) {
  return (
    <section className="bg-paper py-14 md:py-20" aria-labelledby="tarifs-complements">
      <Container>
        <Reveal>
          <h2
            id="tarifs-complements"
            className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900"
          >
            {titre}
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {blocs.map((bloc) => (
            <div
              key={bloc.titre}
              className="rounded-3xl border border-[var(--border)] bg-surface p-7"
            >
              <h3 className="font-display text-[1.15rem] font-semibold text-navy-900">
                {bloc.titre}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed text-ink">
                {bloc.lignes.map((ligne) => (
                  <li key={ligne}>{ligne}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
