import { Bell, CalendarClock, CreditCard, MessageSquareText, Smartphone } from 'lucide-react';
import ShinyText from '@/components/reactbits/ShinyText';
import { Container } from '@/components/ui/Container';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Reveal } from '@/components/animations/Reveal';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { FloatingPhone } from '@/components/animations/FloatingPhone';

const features = [
  { icon: Smartphone, title: 'Réservation', text: 'Un parcours court, du choix du service à la confirmation.' },
  { icon: CalendarClock, title: 'Rendez-vous', text: 'Vos interventions à venir et passées, réunies dans votre compte.' },
  { icon: MessageSquareText, title: 'Communication', text: 'Les échanges liés à votre demande restent au même endroit.' },
  { icon: CreditCard, title: 'Paiement', text: 'Les modalités disponibles sont présentées avant validation.' },
  { icon: Bell, title: 'Suivi', text: 'Vous gardez la visibilité sur l’avancement de votre demande.' },
];

export function AppSpotlight() {
  return (
    <section
      id="application"
      className="relative overflow-hidden bg-night-deep py-20 text-white md:py-28"
      aria-labelledby="application-titre"
    >
      <div aria-hidden="true" className="grid-veil absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -right-20 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(23,168,238,0.22),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(33,195,182,0.16),transparent_70%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <Reveal y={10}>
              <p className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                <span aria-hidden="true" className="h-px w-6 bg-brand-300/60" />
                <ShinyText text="Application mobile" />
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="application-titre"
                className="mt-5 font-display text-[clamp(1.85rem,1.2rem+2.6vw,3rem)] font-bold leading-[1.08] text-white"
              >
                Tout votre service de nettoyage dans votre poche.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-brand-100/80">
                L’application réunit ce dont vous avez besoin avant, pendant et après une
                intervention. Pas de va-et-vient entre plusieurs canaux : votre demande, vos
                rendez-vous et vos échanges sont regroupés.
              </p>
            </Reveal>

            <Stagger className="mt-10 divide-y divide-white/10 border-y border-white/10" as="ul">
              {features.map((feature) => (
                <StaggerItem as="li" key={feature.title}>
                  <div className="group flex items-start gap-4 py-4 transition-colors duration-400 hover:bg-white/[0.03]">
                    <feature.icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand-300 transition-transform duration-400 group-hover:scale-110"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-display text-[1rem] font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-[0.9rem] leading-relaxed text-brand-100/70">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1} className="mt-10">
              <StoreButtons tone="light" />
            </Reveal>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <Reveal y={28} className="relative">
              <div className="relative flex items-end justify-center">
                <div className="hidden translate-y-6 -rotate-6 opacity-90 sm:block">
                  <PhoneFrame
                    src="/images/app/app-screen-3.png"
                    alt="Écran « Mes réservations » de l’application Najem Clean Service"
                    width={210}
                    sizes="210px"
                  />
                </div>

                <FloatingPhone amplitude={8} duration={9} className="-ml-8 sm:-ml-10">
                  <PhoneFrame
                    src="/images/app/app-screen-2.png"
                    alt="Écran de réservation de l’application Najem Clean Service : choix de la prestation"
                    width={252}
                    sizes="(max-width: 640px) 60vw, 252px"
                  />
                </FloatingPhone>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
