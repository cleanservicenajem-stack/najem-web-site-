import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, PenLine } from 'lucide-react';
import { blogCategories } from '@/content/blog/posts';
import { allPosts, getCategory } from '@/lib/blog';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { FinalCta } from '@/components/home/FinalCta';
import { Stagger, StaggerItem } from '@/components/animations/Stagger';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { getSeo } from '@/lib/content';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';
import { formatDateFr } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ ...(await getSeo('blog')), path: '/blog' });
}

const crumbs = [
  { name: 'Accueil', path: '/' },
  { name: 'Conseils', path: '/blog' },
];

export default async function BlogPage() {
  const { description } = await getSeo('blog');

  return (
    <>
      <PageHero
        eyebrow="Conseils"
        title="Entretien, organisation et bonnes pratiques"
        lead="Des articles courts et concrets sur l’entretien du logement : ce qui fait réellement gagner du temps, et ce qui n’en fait pas gagner."
        crumbs={crumbs}
      >
        <ul className="flex flex-wrap gap-2.5">
          {blogCategories.map((category) => (
            <li
              key={category.slug}
              className="rounded-full border border-brand-line bg-surface/70 px-4 py-1.5 text-[0.8rem] font-medium text-navy-700"
            >
              {category.name}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="bg-surface py-16 md:py-24" aria-label="Articles">
        <Container>
          <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {allPosts.map((post) => {
              const category = getCategory(post.category);

              return (
                <StaggerItem key={post.slug} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-surface transition-all duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                    <div className="relative aspect-[16/9] overflow-hidden bg-paper">
                      <Image
                        src={post.cover.src}
                        alt={post.cover.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                      />
                      {post.status === 'brouillon' ? (
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-navy-700 shadow-sm">
                          <PenLine className="h-3 w-3" aria-hidden="true" />
                          Brouillon
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.12em] text-brand-600">
                        {category?.name}
                        <span aria-hidden="true" className="h-px w-4 bg-brand-200" />
                        <span className="text-ink-soft">{post.readingMinutes} min</span>
                      </p>

                      <h2 className="mt-3 font-display text-[1.15rem] font-semibold leading-snug text-navy-800 transition-colors duration-300 group-hover:text-brand-700">
                        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                          {post.title}
                        </Link>
                      </h2>

                      <p className="mt-3 flex-1 text-[0.925rem] leading-relaxed text-ink-soft">
                        {post.description}
                      </p>

                      <p className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-[0.8rem] text-ink-soft">
                        <time dateTime={post.datePublished}>{formatDateFr(post.datePublished)}</time>
                        <ArrowUpRight
                          className="h-4 w-4 text-brand-400 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>

          <p className="mt-12 max-w-2xl text-[0.875rem] leading-relaxed text-ink-soft">
            Les articles signalés «&nbsp;brouillon&nbsp;» sont des contenus d’exemple qui servent à
            valider la structure éditoriale du blog. Ils ne sont pas indexés par les moteurs de
            recherche tant qu’ils n’ont pas été relus et validés.
          </p>
        </Container>
      </section>

      <FinalCta />

      <StructuredData
        id="blog-schema"
        data={[
          webPageSchema({ path: '/blog', name: 'Conseils — Najem Clean Service', description }),
          breadcrumbSchema(crumbs),
        ]}
      />
    </>
  );
}
