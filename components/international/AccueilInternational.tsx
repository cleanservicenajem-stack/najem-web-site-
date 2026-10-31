import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { accueilParLangue, ogLocaleParLangue, versionsAccueil } from '@/config/i18n';
import { absoluteUrl, siteConfig } from '@/config/site';
import type { DictionnaireAccueil } from '@/content/i18n/types';
import { Container } from '@/components/ui/Container';
import { Accordion, type AccordionEntry } from '@/components/ui/Accordion';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { getGrilleTarifaire, type CategorieAffichee } from '@/lib/tarifs';
import { lireDuree, remplacer, traduireGrille, type GrilleTraduite } from '@/lib/i18n';
import { ORGANIZATION_ID, faqSchema, webPageSchema, type JsonLd } from '@/lib/schema';
import { cn } from '@/lib/utils';

/**
 * Accueil traduit (/ar, /en) : une seule page complète par langue, plutôt
 * que des pages minces. Elle reprend, traduits, les contenus déjà publiés en
 * français : services, prix de la grille, réservation, zones, questions.
 * Les prix viennent de l'administration, comme sur /tarifs.
 */

export async function metadataAccueilInternational(dico: DictionnaireAccueil): Promise<Metadata> {
  const grille = traduireGrille(await getGrilleTarifaire(), dico);
  const prix = grille.prixMin !== null ? dico.prix(grille.prixMin) : null;

  return createMetadata({
    title: prix ? remplacer(dico.meta.titre, { prix }) : dico.meta.titreSansPrix,
    titreComplet: true,
    description: prix
      ? remplacer(dico.meta.description, { prix })
      : dico.meta.descriptionSansPrix,
    path: accueilParLangue[dico.langue],
    langues: versionsAccueil,
    ogLocale: ogLocaleParLangue[dico.langue],
  });
}

const titreSection =
  'font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.1rem)] font-bold leading-tight text-navy-900';

/**
 * Questions fréquentes, construites avec les prix réellement affichés : une
 * question dont un prix manque n'est pas publiée.
 */
const questions = (
  dico: DictionnaireAccueil,
  grille: GrilleTraduite,
  brute: CategorieAffichee[],
): AccordionEntry[] => {
  const prixDe = (id: string) => grille.lignes.find((ligne) => ligne.id === id)?.prix ?? null;
  const express = prixDe('studio-express');
  const dureeTexte = brute
    .flatMap((categorie) => categorie.formules)
    .find((formule) => formule.id === 'studio-express')?.duree;
  const duree = dureeTexte ? lireDuree(dureeTexte) : null;
  const complet = prixDe('studio-complet');
  const grand = prixDe('grand-menage');
  const prestige = prixDe('tres-grand-prestige');

  const items: AccordionEntry[] = [];

  if (express && duree) {
    const reponse = [
      remplacer(dico.questions.prix.reponse, {
        express,
        duree: dico.duree(duree.heures, duree.minutes),
      }),
    ];
    if (complet && grand && prestige) {
      reponse.push(remplacer(dico.questions.prix.suite, { complet, grand, prestige }));
    }
    items.push({ id: 'prix', question: dico.questions.prix.question, answer: reponse });
  }

  if (grille.abonnements.length > 0) {
    items.push({
      id: 'abonnement',
      question: dico.questions.abonnement.question,
      answer: [dico.questions.abonnement.reponse, ...grille.abonnements],
    });
  }

  items.push(
    { id: 'zones', question: dico.questions.zones.question, answer: [dico.questions.zones.reponse] },
    {
      id: 'reserver',
      question: dico.questions.reserver.question,
      answer: [dico.questions.reserver.reponse],
    },
    {
      id: 'contenu',
      question: dico.questions.contenu.question,
      answer: [dico.questions.contenu.reponse],
    },
  );

  return items;
};

const serviceSchema = (dico: DictionnaireAccueil, grille: GrilleTraduite): JsonLd => {
  const chemin = accueilParLangue[dico.langue];
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(chemin)}#service`,
    name: dico.hero.titre,
    serviceType: dico.hero.titre,
    url: absoluteUrl(chemin),
    provider: { '@id': ORGANIZATION_ID },
    areaServed: siteConfig.serviceAreas.map((area) => ({ '@type': 'City', name: area.name })),
    ...(grille.prixMin !== null && grille.prixMax !== null
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'MAD',
            lowPrice: String(grille.prixMin),
            highPrice: String(grille.prixMax),
          },
        }
      : {}),
  };
};

export async function AccueilInternational({ dico }: { dico: DictionnaireAccueil }) {
  const brute = await getGrilleTarifaire();
  const grille = traduireGrille(brute, dico);
  const faq = questions(dico, grille, brute);
  const prixDepart = grille.prixMin !== null ? dico.prix(grille.prixMin) : null;
  const description = prixDepart
    ? remplacer(dico.meta.description, { prix: prixDepart })
    : dico.meta.descriptionSansPrix;

  // L'espacement des lettres casse la liaison des lettres arabes : les
  // petits titres en capitales espacées restent réservés à l'anglais.
  const latin = dico.langue !== 'ar';

  return (
    <>
      <section className="relative -mt-[var(--header-height)] overflow-hidden border-b border-[var(--border)] bg-[image:var(--gradient-brand-soft)] pb-16 pt-[calc(var(--header-height)+3rem)] md:pb-24 md:pt-[calc(var(--header-height)+5rem)]">
        <Container className="relative">
          <div className="max-w-3xl">
            <Reveal y={10}>
              <p
                className={cn(
                  'flex items-center gap-2.5 font-semibold text-brand-600',
                  latin ? 'text-[0.75rem] uppercase tracking-[0.18em]' : 'text-[0.95rem]',
                )}
              >
                <span aria-hidden="true" className="h-px w-6 bg-brand-400/70" />
                {dico.hero.surtitre}
              </p>
            </Reveal>
            <Reveal y={16} delay={0.05}>
              <h1
                className={cn(
                  'mt-4 font-display text-[clamp(2.2rem,1.4rem+3.4vw,3.8rem)] font-extrabold text-navy-900',
                  latin ? 'leading-[1.08] tracking-[-0.03em]' : 'leading-[1.3]',
                )}
              >
                {dico.hero.titre}
              </h1>
            </Reveal>
            <Reveal y={16} delay={0.11}>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.2rem]">
                {prixDepart
                  ? remplacer(dico.hero.accroche, { prix: prixDepart })
                  : dico.hero.accrocheSansPrix}
              </p>
            </Reveal>
            <Reveal y={16} delay={0.16}>
              <StoreButtons className="mt-9" textes={dico.boutiques} />
            </Reveal>
          </div>
        </Container>
      </section>

      <section
        id="services"
        className="scroll-mt-24 bg-surface py-16 md:py-24"
        aria-labelledby="titre-services"
      >
        <Container>
          <Reveal>
            <h2 id="titre-services" className={titreSection}>
              {dico.services.titre}
            </h2>
            <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
              {dico.services.intro}
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dico.services.liste.map((service) => (
              <li key={service.nom} className="rounded-3xl border border-[var(--border)] bg-paper/60 p-6">
                <h3 className="font-display text-[1.1rem] font-semibold text-navy-800">
                  {service.nom}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{service.texte}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {grille.lignes.length > 0 ? (
        <section
          id="tarifs"
          className="scroll-mt-24 bg-paper py-16 md:py-24"
          aria-labelledby="titre-tarifs"
        >
          <Container>
            <Reveal>
              <h2 id="titre-tarifs" className={titreSection}>
                {dico.tarifs.titre}
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-soft">
                {dico.tarifs.intro}
              </p>
            </Reveal>

            <div className="mt-8 overflow-x-auto rounded-3xl border border-[var(--border)] bg-surface">
              <table className="w-full min-w-[34rem] text-start text-[0.95rem]">
                <caption className="sr-only">{dico.tarifs.titre}</caption>
                <thead>
                  <tr
                    className={cn(
                      'border-b border-[var(--border)] text-navy-800',
                      latin ? 'text-[0.8rem] uppercase tracking-[0.1em]' : 'text-[0.9rem]',
                    )}
                  >
                    <th scope="col" className="px-6 py-4 text-start font-semibold">
                      {dico.tarifs.colonnes.logement}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start font-semibold">
                      {dico.tarifs.colonnes.formule}
                    </th>
                    <th scope="col" className="px-6 py-4 text-start font-semibold">
                      {dico.tarifs.colonnes.detail}
                    </th>
                    <th scope="col" className="px-6 py-4 text-end font-semibold">
                      {dico.tarifs.colonnes.prix}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-ink">
                  {grille.lignes.map((ligne) => (
                    <tr key={ligne.id}>
                      <td className="px-6 py-4 text-ink-soft">{ligne.categorie}</td>
                      <td className="px-6 py-4 font-medium text-navy-800">{ligne.formule}</td>
                      <td className="px-6 py-4 text-ink-soft">{ligne.detail}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-end font-semibold text-brand-600">
                        {ligne.prix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 max-w-3xl text-[0.95rem] leading-relaxed text-ink-soft">
              {dico.tarifs.options}
            </p>
            <p className="mt-4">
              {/* Lien vers la page française : rechargement complet voulu. */}
              <a
                href="/tarifs"
                hrefLang="fr"
                className="text-[0.95rem] font-medium text-navy-600 underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
              >
                {dico.tarifs.lienDetail}
              </a>
            </p>
          </Container>
        </section>
      ) : null}

      <section className="bg-surface py-16 md:py-24" aria-labelledby="titre-reservation">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <h2
                id="titre-reservation"
                className="font-display text-[1.5rem] font-semibold text-navy-900"
              >
                {dico.fonctionnement.titre}
              </h2>
              <ol className="mt-6 space-y-4 text-[0.975rem] text-ink-soft">
                {dico.fonctionnement.etapes.map((etape, index) => (
                  <li key={etape} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-semibold text-brand-700">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{etape}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <h2 className="flex items-center gap-3 font-display text-[1.5rem] font-semibold text-navy-900">
                <MapPin className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                {dico.zones.titre}
              </h2>
              <p className="mt-6 text-[1rem] leading-relaxed text-ink-soft">
                {remplacer(dico.zones.texte, {
                  quartiers: dico.zones.quartiers.join(dico.separateur),
                })}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section
        id="questions"
        className="scroll-mt-24 bg-paper py-16 md:py-24"
        aria-labelledby="titre-questions"
      >
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 id="titre-questions" className={titreSection}>
                {dico.questions.titre}
              </h2>
            </Reveal>
            <Accordion className="mt-6" items={faq} />
          </div>
        </Container>
      </section>

      <section
        id="telecharger"
        className="scroll-mt-24 bg-surface pb-20 pt-4 md:pb-28"
        aria-labelledby="titre-appel"
      >
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(125deg,#04182c_0%,#04448a_45%,#0a6fcf_100%)] px-7 py-14 md:rounded-[2.5rem] md:px-16 md:py-20">
            <div aria-hidden="true" className="grid-veil absolute inset-0" />
            <div className="relative max-w-2xl">
              <h2
                id="titre-appel"
                className="font-display text-[clamp(1.9rem,1.2rem+2.8vw,3.1rem)] font-bold leading-[1.15] text-white"
              >
                {dico.appel.titre}
              </h2>
              <p className="mt-5 text-[1.05rem] leading-relaxed text-brand-100/85">
                {dico.appel.texte}
              </p>
              <StoreButtons tone="light" className="mt-9" textes={dico.boutiques} />
            </div>
          </div>
        </Container>
      </section>

      <StructuredData
        id="accueil-traduit-schema"
        data={[
          webPageSchema({
            path: accueilParLangue[dico.langue],
            name: `${dico.hero.titre} — ${siteConfig.name}`,
            description,
            langue: dico.langue,
          }),
          serviceSchema(dico, grille),
          faqSchema(faq.map((item) => ({ ...item, category: 'general' as const }))),
        ]}
      />
    </>
  );
}
