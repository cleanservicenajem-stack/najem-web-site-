import { CalendarCheck, CreditCard, MessagesSquare, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';

const highlight = {
  icon: CalendarCheck,
  title: 'Réservation simple',
  text: "Planifiez votre service de nettoyage en quelques étapes depuis l’application : le service, la date, le créneau. Rien d’autre à organiser.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Professionnels de confiance',
    text: 'Des prestataires sélectionnés pour offrir un service sérieux et professionnel.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Gestion simplifiée',
    text: 'Consultez et gérez vos réservations directement depuis votre compte.',
  },
  {
    icon: MessagesSquare,
    title: 'Communication facile',
    text: 'Échangez plus facilement avec votre prestataire ou le service client.',
  },
  {
    icon: CreditCard,
    title: 'Paiement pensé simple',
    text: 'Une expérience de paiement conçue pour rester claire et sécurisée.',
  },
];

export function WhyNajem() {
  return (
    <section
      id="pourquoi-najem"
      className="bg-surface py-20 md:py-28"
      aria-labelledby="pourquoi-titre"
    >
      <Container>
        <SectionHeading
          id="pourquoi-titre"
          eyebrow="Pourquoi Najem"
          title="Ce qui change concrètement pour vous."
          lead="L’objectif n’est pas d’ajouter une application de plus à votre téléphone, mais de retirer une contrainte de votre semaine."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <Reveal>
            <SpotlightCard className="flex h-full flex-col justify-between p-8 shadow-[var(--shadow-card)]">
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] text-white shadow-[0_12px_28px_-16px_rgba(10,111,207,0.9)]">
                  <highlight.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-navy-800">
                  {highlight.title}
                </h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-soft">{highlight.text}</p>
              </div>

              <ol className="mt-10 space-y-3 border-t border-[var(--border)] pt-6 text-[0.9rem] text-ink-soft">
                {['Choisir la prestation', 'Indiquer ses disponibilités', 'Confirmer la demande'].map(
                  (step, index) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint text-[0.7rem] font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ),
                )}
              </ol>
            </SpotlightCard>
          </Reveal>

          <Stagger className="grid gap-6 sm:grid-cols-2" stagger={0.07}>
            {benefits.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <article className="group h-full rounded-3xl border border-[var(--border)] bg-paper/60 p-7 transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-brand-line hover:bg-surface hover:shadow-[var(--shadow-card)]">
                  <benefit.icon
                    className="h-5 w-5 text-brand-500 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <h3 className="mt-5 font-display text-[1.05rem] font-semibold text-navy-800">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-ink-soft">
                    {benefit.text}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
