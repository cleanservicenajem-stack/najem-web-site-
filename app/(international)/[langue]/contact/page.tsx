import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone, Smartphone } from 'lucide-react';
import { cheminEn } from '@/config/i18n';
import { getContact, hasContactChannel, whatsappHref } from '@/lib/content';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { communs } from '@/content/i18n/commun';
import { textesContact } from '@/content/i18n/pages/contact';
import { lireLangue } from '@/lib/i18n';
import { createMetadata } from '@/lib/seo';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

/**
 * Page Contact en arabe et en anglais : mêmes sections que la page française.
 * Les coordonnées viennent des mêmes sources (administration, config/site.ts)
 * et s'affichent telles quelles ; `dir` et `<bdi>` gardent un numéro, une
 * adresse ou un texte en caractères latins lisibles dans la page en arabe.
 */

type Props = { params: Promise<{ langue: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const langue = await lireLangue(params);
  const { seo } = textesContact[langue];
  return createMetadata({
    title: seo.titre,
    description: seo.description,
    path: cheminEn(langue, '/contact'),
  });
}

export default async function ContactTraduit({ params }: Props) {
  const langue = await lireLangue(params);
  const t = textesContact[langue];
  const chemin = cheminEn(langue, '/contact');
  const contact = await getContact();
  const joignable = await hasContactChannel();
  const whatsapp = await whatsappHref(t.coordonnees.messageWhatsapp);

  const crumbs = [
    { name: t.fil.accueil, path: cheminEn(langue, '/') },
    { name: t.fil.page, path: chemin },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.hero.surtitre}
        title={t.hero.titre}
        lead={t.hero.introduction}
        crumbs={crumbs}
        libelleFil={t.fil.libelle}
      />

      <section className="bg-surface py-16 md:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-[1.5rem] font-bold text-navy-900">
                {t.formulaire.titre}
              </h2>
              <p className="mt-2.5 max-w-xl text-[0.95rem] text-ink-soft">
                {t.formulaire.introduction}
              </p>

              <div className="mt-9">
                <ContactForm textes={t.formulaire.textes} />
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <div className="rounded-3xl border border-[var(--border)] bg-[image:var(--gradient-brand-soft)] p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-brand-600 shadow-[var(--shadow-soft)]">
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-display text-[1.1rem] font-semibold text-navy-800">
                    {t.reservation.titre}
                  </h2>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-ink-soft">
                    {t.reservation.texte}
                  </p>
                  <StoreButtons className="mt-6" textes={communs[langue].boutiques} />
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="rounded-3xl border border-[var(--border)] bg-surface p-7">
                  <h2 className="font-display text-[1.1rem] font-semibold text-navy-800">
                    {t.coordonnees.titre}
                  </h2>

                  {joignable || contact.address || contact.openingHours ? (
                    <ul className="mt-5 space-y-4 text-[0.925rem]">
                      {contact.phone ? (
                        <li className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <a
                            href={`tel:${contact.phone.replace(/\s/g, '')}`}
                            dir="ltr"
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
                            {t.coordonnees.whatsapp}
                          </a>
                        </li>
                      ) : null}

                      {contact.email ? (
                        <li className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <a
                            href={`mailto:${contact.email}`}
                            dir="ltr"
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
                            <bdi>{contact.address.street}</bdi>
                            <br />
                            <bdi>{`${contact.address.postalCode} ${contact.address.city}`}</bdi>
                            <br />
                            <bdi>{contact.address.country}</bdi>
                          </address>
                        </li>
                      ) : null}

                      {contact.openingHours ? (
                        <li className="flex items-start gap-3">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                          <div className="text-ink">
                            {contact.openingHours.map((slot) => (
                              <p key={slot.days}>
                                <bdi className="text-ink-soft">{slot.days}</bdi> — <bdi>{slot.hours}</bdi>
                              </p>
                            ))}
                          </div>
                        </li>
                      ) : null}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[0.925rem] leading-relaxed text-ink-soft">
                      {t.coordonnees.absentes}
                    </p>
                  )}

                  {contact.responseTime ? (
                    <p className="mt-5 border-t border-[var(--border)] pt-4 text-[0.85rem] text-ink-soft">
                      {t.coordonnees.delai.avant}
                      <bdi>{contact.responseTime}</bdi>
                      {t.coordonnees.delai.apres}
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
          webPageSchema({ path: chemin, name: t.schema.nomPage, description: t.seo.description, langue }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
