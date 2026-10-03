import { absoluteUrl, siteConfig } from '@/config/site';
import { getContact, getTexte } from '@/lib/content';
import type { Service } from '@/config/services';
import type { FaqItem } from '@/config/faq';

/**
 * Construction des données structurées.
 *
 * Principe : ne déclarer que des propriétés dont la valeur est réellement
 * connue. Aucune note, aucun avis, aucun prix, aucune adresse n'est émis tant
 * que l'information n'a pas été renseignée dans `config/site.ts`.
 */

export type JsonLd = Record<string, unknown>;

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

const cleanUndefined = (input: JsonLd): JsonLd =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== null),
  );

/**
 * Zone couverte, déclarée au plus précis que l'on sache réellement.
 *
 * Chaque ville confirmée est rattachée à son pays : un moteur qui ne situe pas
 * « Casablanca » comprend au moins le marché. Sans ville confirmée, seul le
 * pays est annoncé — jamais une couverture plus large que la réalité.
 */
const areaServed = (): JsonLd | JsonLd[] => {
  const pays: JsonLd = { '@type': 'Country', name: siteConfig.primaryMarket.country };
  const villes = siteConfig.serviceAreas.map((area) => ({
    '@type': 'City',
    name: area.name,
    containedInPlace: pays,
  }));
  return villes.length > 0 ? villes : pays;
};

export const organizationSchema = async (): Promise<JsonLd> => {
  const { social } = siteConfig;
  const [contact, resume] = await Promise.all([getContact(), getTexte('geo.resume')]);

  const contactPoint =
    contact.email || contact.phone
      ? [
          cleanUndefined({
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email ?? undefined,
            telephone: contact.phone ?? undefined,
            availableLanguage: ['fr'],
          }),
        ]
      : undefined;

  const address = contact.address
    ? {
        '@type': 'PostalAddress',
        streetAddress: contact.address.street,
        addressLocality: contact.address.city,
        postalCode: contact.address.postalCode,
        addressRegion: contact.address.region,
        addressCountry: contact.address.countryCode,
      }
    : undefined;

  return cleanUndefined({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: resume,
    slogan: siteConfig.tagline,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/logo/najem-logo.png'),
      caption: `Logo ${siteConfig.name}`,
    },
    image: absoluteUrl('/images/og/og-default.png'),
    knowsLanguage: ['fr'],
    address,
    contactPoint,
    sameAs: [
      siteConfig.apps.ios.url,
      siteConfig.apps.android.url,
      ...social.map((item) => item.href),
    ],
    areaServed: areaServed(),
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Services de nettoyage à domicile',
        serviceType: 'Nettoyage à domicile',
      },
    },
  });
};

export const websiteSchema = (): JsonLd => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: 'fr',
  publisher: { '@id': ORGANIZATION_ID },
});

export const webPageSchema = ({
  path,
  name,
  description,
  primaryImage,
}: {
  path: string;
  name: string;
  description: string;
  primaryImage?: string;
}): JsonLd =>
  cleanUndefined({
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: 'fr',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    primaryImageOfPage: primaryImage ? absoluteUrl(primaryImage) : undefined,
  });

export const breadcrumbSchema = (items: { name: string; path: string }[]): JsonLd => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const serviceSchema = (service: Service): JsonLd =>
  cleanUndefined({
    '@type': 'Service',
    '@id': `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: areaServed(),
    availableChannel: {
      '@type': 'ServiceChannel',
      name: `Application ${siteConfig.name}`,
      serviceUrl: siteConfig.apps.ios.url,
      availableLanguage: ['fr'],
    },
  });

export const faqSchema = (items: FaqItem[]): JsonLd => ({
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer.join(' '),
    },
  })),
});

export const mobileApplicationSchema = (): JsonLd => ({
  '@type': 'MobileApplication',
  '@id': `${siteConfig.url}/application#app`,
  name: siteConfig.apps.ios.appName,
  operatingSystem: 'iOS, Android',
  applicationCategory: 'LifestyleApplication',
  description:
    "Application mobile Najem Clean Service : réservation d'un service de nettoyage à domicile, gestion des rendez-vous, échanges liés à l'intervention et suivi des demandes.",
  url: absoluteUrl('/application'),
  installUrl: [siteConfig.apps.ios.url, siteConfig.apps.android.url],
  downloadUrl: [siteConfig.apps.ios.url, siteConfig.apps.android.url],
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'fr',
});

export const articleSchema = ({
  title,
  description,
  path,
  datePublished,
  dateModified,
  image,
  author,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author: string;
}): JsonLd =>
  cleanUndefined({
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: 'fr',
    mainEntityOfPage: { '@id': `${absoluteUrl(path)}#webpage` },
    image: image ? absoluteUrl(image) : absoluteUrl('/images/og/og-default.png'),
    author: { '@type': 'Organization', name: author, '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
  });

/** Assemble plusieurs entités dans un unique bloc `@graph`. */
export const buildGraph = (entities: JsonLd[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@graph': entities,
});
