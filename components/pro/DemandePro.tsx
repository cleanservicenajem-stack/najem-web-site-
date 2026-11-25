import { FormulaireDevisPro } from '@/components/forms/FormulaireDevisPro';
import { Container } from '@/components/ui/Container';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { whatsappHref } from '@/lib/content';

/** Parcours du compte professionnel, tel qu'il se présente dans l'application. */
const etapes = [
  'Téléchargez l’application Najem Clean Service et créez votre compte.',
  'Ouvrez « Compte », puis « Type de compte », et cliquez sur « Professionnel ».',
  'Indiquez le nom de votre entreprise et votre ICE (15 chiffres), puis enregistrez.',
];

/** Compte pro dans l'application et formulaire de demande de devis. */
export async function DemandePro() {
  const whatsapp = await whatsappHref();

  return (
    <section className="bg-surface py-12 md:py-20" aria-label="Compte professionnel et demande de devis">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-[1.4rem] font-semibold text-navy-900">
              Passez en compte pro dans l’application
            </h2>
            <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
              {etapes.map((etape, index) => (
                <li key={etape} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-semibold text-brand-700">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{etape}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">
              Le catalogue et les tarifs professionnels s’affichent alors. Vous n’avez pas
              d’ICE ? Envoyez-nous votre demande avec le formulaire.
            </p>
            <StoreButtons className="mt-6" />
          </div>

          <div>
            <h2 className="mb-6 font-display text-[1.4rem] font-semibold text-navy-900">
              Faire une demande de devis
            </h2>
            {whatsapp ? <FormulaireDevisPro lienWhatsapp={whatsapp} /> : null}
            <div className="mt-8">
              <ArrowLink href="/contact">Nous écrire depuis la page contact</ArrowLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
