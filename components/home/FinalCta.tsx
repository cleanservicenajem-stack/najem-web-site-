import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Reveal } from '@/components/animations/Reveal';

/** Grand bloc d'appel à l'action, dernière section avant le footer. */
export function FinalCta() {
  return (
    <section className="bg-surface pb-20 pt-4 md:pb-28" aria-labelledby="cta-titre">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#04182c_0%,#04448a_45%,#0a6fcf_100%)] px-7 py-14 md:rounded-[2.5rem] md:px-16 md:py-20">
            <div aria-hidden="true" className="grid-veil absolute inset-0" />

            <svg
              aria-hidden="true"
              viewBox="0 0 1200 400"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-0 h-56 w-full text-white/10"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M-40 330C180 210 460 170 760 210c180 24 300 70 500 150" />
                <path d="M-40 390C200 250 520 210 840 260c150 23 250 62 400 130" opacity="0.6" />
              </g>
            </svg>

            <div
              aria-hidden="true"
              className="droplet-mask absolute -right-10 -top-16 h-72 w-56 rotate-12 bg-[linear-gradient(160deg,#17a8ee,#21c3b6)] opacity-20"
            />

            <div className="relative max-w-2xl">
              <h2
                id="cta-titre"
                className="font-display text-[clamp(1.9rem,1.2rem+2.8vw,3.1rem)] font-bold leading-[1.08] text-white"
              >
                Votre maison propre commence ici.
              </h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-brand-100/85">
                Téléchargez Najem Clean Service et réservez votre prochain service de nettoyage en
                quelques minutes.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <StoreButtons tone="light" />
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-[0.95rem] font-medium text-white/85 transition-colors hover:text-white"
                >
                  Une question ? Écrivez-nous
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
