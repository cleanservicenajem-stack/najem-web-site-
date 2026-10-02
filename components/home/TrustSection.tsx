import { Clock, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { Parallax } from '@/components/animations/Parallax';

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Des professionnels sélectionnés avec soin',
    text: 'Les interventions sont confiées à des prestataires référencés par Najem Clean Service.',
  },
  {
    icon: Sparkles,
    title: 'Une réservation simple et rapide',
    text: 'Le parcours se limite à l’essentiel : le service, la date, la confirmation.',
  },
  {
    icon: HeartHandshake,
    title: 'Une expérience pensée pour votre tranquillité',
    text: 'Vos demandes, vos rendez-vous et vos échanges restent réunis dans votre compte.',
  },
  {
    icon: Clock,
    title: 'Votre temps est précieux',
    text: 'Ce que vous ne passez pas à organiser le ménage, vous le passez ailleurs.',
  },
];

export function TrustSection() {
  return (
    <section className="bg-surface py-20 md:py-28" aria-labelledby="confiance-titre">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-24">
          <div className="relative">
            <Parallax distance={26}>
              <div
                aria-hidden="true"
                className="droplet-mask absolute -left-14 -top-16 h-32 w-24 bg-[linear-gradient(160deg,#0a6fcf,#21c3b6)] opacity-[0.07]"
              />
            </Parallax>

            <Reveal>
              <h2
                id="confiance-titre"
                className="relative font-display text-[clamp(1.7rem,1.15rem+2.2vw,2.6rem)] font-bold leading-[1.12] text-navy-900"
              >
                Faire entrer quelqu’un chez soi demande de la confiance.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
                C’est le point de départ du service. Tout ce qui suit — le parcours de réservation,
                le suivi des rendez-vous, les échanges — a été pensé pour que vous sachiez à tout
                moment où en est votre demande.
              </p>
            </Reveal>
          </div>

          <Stagger className="divide-y divide-[var(--border)] border-y border-[var(--border)]" as="ul">
            {pillars.map((pillar) => (
              <StaggerItem as="li" key={pillar.title}>
                <div className="group flex items-start gap-5 py-7">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-brand-600 transition-colors duration-400 group-hover:bg-brand-tint">
                    <pillar.icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.05rem] font-semibold text-navy-800">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-[0.925rem] leading-relaxed text-ink-soft">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
