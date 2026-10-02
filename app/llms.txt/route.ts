import { enabledServices } from '@/config/services';
import { faqItems } from '@/config/faq';
import { absoluteUrl, siteConfig } from '@/config/site';
import { publishedPosts } from '@/lib/blog';
import { getServicesAffiches, getTexte } from '@/lib/content';

/**
 * /llms.txt — complément expérimental destiné aux agents et moteurs
 * génératifs. Il résume l'entité et pointe vers les pages canoniques.
 *
 * Ce fichier ne remplace ni le sitemap, ni les données structurées, ni le
 * contenu des pages : il ne fait que les refléter.
 */
export const dynamic = 'force-static';

export async function GET() {
  const [resume, activite, zones, precisionTarifs, precisionAvis, precisionReservation] =
    await Promise.all([
      getTexte('geo.resume'),
      getTexte('geo.activite'),
      getTexte('geo.zones'),
      getTexte('geo.precision.tarifs'),
      getTexte('geo.precision.avis'),
      getTexte('geo.precision.reservation'),
    ]);

  const services = (await getServicesAffiches(enabledServices))
    .map((service) => `- [${service.title}](${absoluteUrl(`/services/${service.slug}`)}) : ${service.benefit}.`)
    .join('\n');

  const faq = faqItems
    .slice(0, 6)
    .map((item) => `- ${item.question} ${item.answer[0]}`)
    .join('\n');

  const posts = publishedPosts.length
    ? publishedPosts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)})`).join('\n')
    : '- Aucun article publié pour le moment.';

  const body = `# ${siteConfig.name}

> ${resume}

## En bref

- Activité : ${activite}
- Canal de réservation : application mobile ${siteConfig.name}, disponible sur iOS et Android.
- Site officiel : ${siteConfig.url}
- Application iOS (App Store) : ${siteConfig.apps.ios.url}
- Application Android (Google Play) : ${siteConfig.apps.android.url}
- Langue du site : français.
- Zones desservies : ${zones}

## Comment fonctionne le service

1. Télécharger l'application ${siteConfig.name} sur l'App Store ou Google Play.
2. Choisir la prestation de nettoyage souhaitée.
3. Sélectionner une date et un créneau.
4. Suivre la demande et les échanges depuis son compte.

## Prestations

${services}

## Pages principales

- [Accueil](${absoluteUrl('/')})
- [Services](${absoluteUrl('/services')})
- [Application mobile](${absoluteUrl('/application')})
- [À propos](${absoluteUrl('/a-propos')})
- [FAQ](${absoluteUrl('/faq')})
- [Contact](${absoluteUrl('/contact')})
- [Conseils](${absoluteUrl('/blog')})

## Questions fréquentes

${faq}

## Articles publiés

${posts}

## Précisions importantes

- ${precisionTarifs}
- ${precisionAvis}
- ${precisionReservation}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
