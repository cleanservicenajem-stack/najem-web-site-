import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone, Smartphone } from 'lucide-react';
import { getContact, hasContactChannel, whatsappHref, getSeo } from '@/lib/content';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('contact')), path: '/contact' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Contact', path: '/contact' },
];

export default async function ContactPage() {
  const { description } = await getSeo('contact');
  const contact = await getContact();
  const joignable = await hasContactChannel();
  const whatsapp = await whatsappHref('Bonjour, je souhaite un renseignement sur vos services.');

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Une question ? Écrivez-nous."
        lead="Ce formulaire est destiné aux demandes de renseignements. Pour une demande liée à une réservation en cours, l’application reste le canal le plus direct : le contexte de votre rendez-vous y est déjà rattaché."
        crumbs={crumbs}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
                Formulaire de contact
              </h2>
              <p className="mt-2.5 max-w-xl text-[0.95rem] text-ink-soft">
                Décrivez votre besoin en quelques lignes. Plus votre message est précis, plus la
                réponse le sera.
              </p>

              <div className="mt-9">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand-600 shadow-[var(--shadow-soft)]">
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-[1.1rem] font-semibold text-navy-800">
                    Pour une réservation
                  </h2>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-ink-soft">
                    Réserver, modifier un rendez-vous ou suivre une demande se fait depuis
                    l’application Najem Clean Service.
                  </p>
                  <StoreButtons className="mt-6" />
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="rounded-3xl border border-[var(--border)] bg-surface p-7">
                  <h2 className="font-display text-[1.1rem] font-semibold text-navy-800">
                    Coordonnées
                  </h2>

                  {joignable || contact.address || contact.openingHours ? (
                    <ul className="mt-5 space-y-4 text-[0.925rem]">
                      {contact.phone ? (
                        <li className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, '')}`}
                            className="text-ink transition-colors hover:text-brand-600"
                          >
                            {contact.phone}
                          </a>
                        </li>
                      ) : null}

                      {whatsapp ? (
                        <li className="flex items-start gap-3">
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <a
                            href={whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink transition-colors hover:text-brand-600"
                          >
                            Écrire sur WhatsApp
                          </a>
                        </li>
                      ) : null}

                      {contact.email ? (
                        <li className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="break-all text-ink transition-colors hover:text-brand-600"
                          >
                            {contact.email}
                          </a>
                        </li>
                      ) : null}

                      {contact.address ? (
                        <li className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <address className="not-italic text-ink">
                            {contact.address.street}
                            <br />
                            {contact.address.postalCode} {contact.address.city}
                            <br />
                            {contact.address.country}
                          </address>
                        </li>
                      ) : null}

                      {contact.openingHours ? (
                        <li className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <div className="text-ink">
                            {contact.openingHours.map((slot) => (
                              <p key={slot.days}>
                                <span className="text-ink-soft">{slot.days}</span> — {slot.hours}
                              </p>
                            ))}
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[0.925rem] leading-relaxed text-ink-soft">
                      Les coordonnées directes ne sont pas encore publiées sur le site. En
                      attendant, le formulaire ci-contre et l’application sont les deux moyens de
                      nous joindre.
                    </p>
                  )}

                  {contact.responseTime ? (
                    <p className="mt-5 border-t border-[var(--border)] pt-4 text-[0.85rem] text-ink-soft">
                      Délai de réponse habituel : {contact.responseTime}.
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>

      <StructuredData
        id="contact-schema"
        data={[
          webPageSchema({ path: '/contact', name: 'Contact — Najem Clean Service', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
