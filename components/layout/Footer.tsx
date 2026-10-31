import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { navigationPied } from '@/config/navigation';
import type { Langue } from '@/config/i18n';
import { siteConfig } from '@/config/site';
import { textesChrome } from '@/content/i18n/chrome';
import { getContact, whatsappHref } from '@/lib/content';
import { Logo } from '@/components/ui/Logo';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Container } from '@/components/ui/Container';
import { SocialIcon } from '@/components/ui/SocialIcon';

export async function Footer({ langue = 'fr' }: { langue?: Langue }) {
  const t = textesChrome[langue];
  const year = new Date().getFullYear();
  // L'espacement des lettres casse la liaison des lettres arabes.
  const latin = langue !== 'ar';
  const { social, serviceAreas } = siteConfig;
  const contact = await getContact();
  const whatsapp = await whatsappHref();

  return (
    <footer className="relative overflow-hidden bg-night-deep text-brand-100/75">
      <div aria-hidden="true" className="grid-veil absolute inset-0 opacity-60" />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-brand-500/12 blur-3xl"
      />

      <Container className="relative">
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo variant="stacked" tone="dark" size={112} />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">{t.pied.presentation}</p>

            <div className="mt-8">
              <p
                className={
                  latin
                    ? 'text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-200'
                    : 'text-[0.85rem] font-semibold text-brand-200'
                }
              >
                {t.pied.telecharger}
              </p>
              <StoreButtons tone="light" className="mt-4" textes={t.boutiques} />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
            {navigationPied[langue].map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p
                  className={
                    latin
                      ? 'font-display text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-white'
                      : 'font-display text-[0.95rem] font-semibold text-white'
                  }
                >
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3 text-[0.925rem]">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-block transition-colors duration-300 hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {(contact.phone || contact.email || whatsapp || contact.address) && (
          <div className="grid gap-6 border-t border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {contact.phone ? (
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-[0.925rem] transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-brand-300" aria-hidden="true" />
                {contact.phone}
              </a>
            ) : null}
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[0.925rem] transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-brand-300" aria-hidden="true" />
                WhatsApp
              </a>
            ) : null}
            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-[0.925rem] transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-brand-300" aria-hidden="true" />
                {contact.email}
              </a>
            ) : null}
            {contact.address ? (
              <p className="flex items-start gap-3 text-[0.925rem]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                <span>
                  {contact.address.street}, {contact.address.postalCode} {contact.address.city}
                </span>
              </p>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/10 pb-6 pt-8 text-[0.85rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. {t.pied.droits}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {serviceAreas.length > 0 ? (
              <p className="text-brand-100/60">
                {t.pied.zonesDesservies} :{' '}
                {serviceAreas
                  .map((area) => t.villes?.[area.slug] ?? area.name)
                  .join(langue === 'ar' ? '، ' : ', ')}
              </p>
            ) : null}

            {social.length > 0 ? (
              <ul className="flex items-center gap-2">
                {social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-100/70 transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <SocialIcon network={item.network} className="h-[1.15rem] w-[1.15rem]" />
                      <span className="sr-only">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

      </Container>
    </footer>
  );
}
