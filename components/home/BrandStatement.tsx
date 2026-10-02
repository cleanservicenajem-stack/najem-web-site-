import { CalendarClock, Smartphone, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { getTexte } from '@/lib/content';

/**
 * Bloc de présentation placé immédiatement sous le hero.
 * Il répond directement à « Qui est Najem Clean Service ? » : c'est le passage
 * le plus facilement extractible par les moteurs de recherche et les
 * assistants génératifs.
 */

const facts = [
  {
    icon: Smartphone,
    label: 'Une application mobile',
    text: 'Disponible sur iPhone et sur Android.',
  },
  {
    icon: CalendarClock,
    label: 'Une réservation guidée',
    text: 'Service choisi, créneau sélectionné, demande envoyée.',
  },
  {
    icon: Sparkles,
    label: 'Du nettoyage à domicile',
    text: 'Entretien courant comme interventions plus complètes.',
  },
];

export async function BrandStatement() {
  const [titre, texte] = await Promise.all([
    getTexte('accueil.presentation.titre'),
    getTexte('accueil.presentation.texte'),
  ]);

  return (
    <section className="border-b border-[var(--border)] bg-surface py-16 md:py-20" aria-labelledby="qui-nous-sommes">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <h2
              id="qui-nous-sommes"
              className="font-display text-[1.6rem] font-bold leading-tight text-navy-900 md:text-[2rem]"
            >
              {titre}
            </h2>
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <p className="text-[1.05rem] leading-relaxed text-ink md:text-[1.15rem]">
                {texte}
              </p>
            </Reveal>

            <Stagger className="mt-10 grid gap-6 sm:grid-cols-3" stagger={0.07}>
              {facts.map((fact) => (
                <StaggerItem key={fact.label}>
                  <div className="border-t border-[var(--border)] pt-5">
                    <fact.icon className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    <p className="mt-3 font-display text-[0.95rem] font-semibold text-navy-800">
                      {fact.label}
                    </p>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{fact.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
