import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, PenLine } from 'lucide-react';
import { allPosts, getCategory, getPostBySlug, getRelatedPosts, getTableOfContents } from '@/lib/blog';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { StoreButtons } from '@/components/ui/StoreButtons';
import { Accordion } from '@/components/ui/Accordion';
import { PostBody } from '@/components/blog/PostBody';
import { FinalCta } from '@/components/home/FinalCta';
import { Reveal } from '@/components/animations/Reveal';
import { StructuredData } from '@/components/seo/StructuredData';
import { createMetadata } from '@/lib/seo';
import { articleSchema, breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema';
import { formatDateFr } from '@/lib/utils';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return createMetadata({
      title: 'Article introuvable',
      description: 'Cet article n’existe pas.',
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover.src,
    type: 'article',
    publishedTime: post.datePublished,
    modifiedTime: post.dateModified ?? post.datePublished,
    // Les brouillons ne doivent jamais être indexés.
    noindex: post.status === 'brouillon',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const category = getCategory(post.category);
  const toc = getTableOfContents(post);
  const related = getRelatedPosts(post);
  const crumbs = [
    { name: 'Accueil', path: '/' },
    { name: 'Conseils', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <article>
        <header className="relative -mt-[var(--header-height)] overflow-hidden border-b border-[var(--border)] bg-[image:var(--gradient-brand-soft)] pb-14 pt-[calc(var(--header-height)+2.5rem)] md:pb-16">
          <Container>
            <Breadcrumbs items={crumbs} />

            <div className="mt-8 max-w-3xl">
              <p className="flex flex-wrap items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-brand-600">
                {category?.name}
                <span aria-hidden="true" className="h-px w-5 bg-brand-300" />
                <span className="font-medium normal-case tracking-normal text-ink-soft">
                  {post.readingMinutes} min de lecture
                </span>
              </p>

              <h1 className="mt-5 font-display text-[clamp(1.9rem,1.3rem+2.6vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-navy-900">
                {post.title}
              </h1>

              <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft md:text-[1.12rem]">
                {post.description}
              </p>

              <p className="mt-6 text-[0.875rem] text-ink-soft">
                Publié le <time dateTime={post.datePublished}>{formatDateFr(post.datePublished)}</time>{' '}
                · {post.author}
              </p>

              {post.status === 'brouillon' ? (
                <p className="mt-6 inline-flex items-start gap-2.5 rounded-2xl border border-warn-line bg-warn-surface px-4 py-3 text-[0.85rem] leading-relaxed text-warn-ink">
                  <PenLine className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    Article d’exemple, en attente de relecture et de validation. Il n’est pas
                    indexé par les moteurs de recherche.
                  </span>
                </p>
              ) : null}
            </div>
          </Container>
        </header>

        <div className="bg-surface py-14 md:py-20">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-20">
              <aside className="lg:sticky lg:top-32 lg:order-1 lg:self-start">
                {toc.length > 2 ? (
                  <nav aria-label="Sommaire de l’article">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                      Sommaire
                    </p>
                    <ol className="mt-5 space-y-3 border-l border-[var(--border)] pl-4 text-[0.9rem]">
                      {toc.map((entry) => (
                        <li key={entry.id}>
                          <a
                            href={`#${entry.id}`}
                            className="text-ink-soft transition-colors duration-300 hover:text-brand-600"
                          >
                            {entry.label}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                <div className="mt-10 rounded-3xl border border-[var(--border)] bg-paper/70 p-6">
                  <p className="font-display text-[1rem] font-semibold text-navy-800">
                    Déléguer l’entretien
                  </p>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-soft">
                    Les prestations Najem Clean Service se réservent depuis l’application.
                  </p>
                  <StoreButtons className="mt-5" />
                </div>
              </aside>

              <div className="lg:order-2">
                <Reveal>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-[var(--border)]">
                    <Image
                      src={post.cover.src}
                      alt={post.cover.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <div className="mt-10 rounded-2xl border-l-2 border-brand-400 bg-paper/60 px-6 py-5">
                  <p className="text-[1.02rem] font-medium leading-relaxed text-navy-800">
                    {post.keyAnswer}
                  </p>
                </div>

                <div className="mt-10">
                  <PostBody blocks={post.blocks} />
                </div>

                {post.faq && post.faq.length > 0 ? (
                  <section className="mt-16" aria-labelledby="article-faq">
                    <h2 id="article-faq" className="font-display text-[1.5rem] font-bold text-navy-900">
                      Questions fréquentes
                    </h2>
                    <Accordion
                      className="mt-6"
                      items={post.faq.map((entry, index) => ({
                        id: `faq-${index}`,
                        question: entry.question,
                        answer: [entry.answer],
                      }))}
                    />
                  </section>
                ) : null}

                {related.length > 0 ? (
                  <section className="mt-16 border-t border-[var(--border)] pt-10" aria-labelledby="articles-lies">
                    <h2 id="articles-lies" className="font-display text-[1.25rem] font-semibold text-navy-900">
                      À lire ensuite
                    </h2>
                    <ul className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                      {related.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/blog/${item.slug}`}
                            className="group flex items-center justify-between gap-6 py-5"
                          >
                            <span>
                              <span className="block font-display text-[1.02rem] font-semibold text-navy-800 transition-colors duration-300 group-hover:text-brand-700">
                                {item.title}
                              </span>
                              <span className="mt-1 block text-[0.875rem] text-ink-soft">
                                {item.readingMinutes} min de lecture
                              </span>
                            </span>
                            <ArrowRight
                              className="h-4 w-4 shrink-0 text-brand-400 transition-transform duration-300 group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
            </div>
          </Container>
        </div>
      </article>

      <FinalCta />

      <StructuredData
        id="post-schema"
        data={[
          webPageSchema({
            path: `/blog/${post.slug}`,
            name: post.title,
            description: post.description,
            primaryImage: post.cover.src,
          }),
          breadcrumbSchema(crumbs),
          // Aucune donnée structurée d'article pour un brouillon en noindex.
          ...(post.status === 'publie'
            ? [
                articleSchema({
                  title: post.title,
                  description: post.description,
                  path: `/blog/${post.slug}`,
                  datePublished: post.datePublished,
                  dateModified: post.dateModified,
                  image: post.cover.src,
                  author: post.author,
                }),
              ]
            : []),
          ...(post.status === 'publie' && post.faq && post.faq.length > 0
            ? [
                faqSchema(
                  post.faq.map((entry, index) => ({
                    id: `faq-${index}`,
                    question: entry.question,
                    answer: [entry.answer],
                    category: 'general' as const,
                  })),
                ),
              ]
            : []),
        ]}
      />
    </>
  );
}
