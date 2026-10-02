import type { FaqItem } from '@/config/faq';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { ArrowLink } from '@/components/ui/ArrowLink';

type FaqSectionProps = {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Lien affiché sous le titre (vers la FAQ complète par exemple). */
  link?: { label: string; href: string };
  tone?: 'white' | 'paper';
  id?: string;
};

export function FaqSection({
  items,
  eyebrow = 'Questions fréquentes',
  title = 'Les réponses aux questions les plus posées.',
  lead,
  link,
  tone = 'white',
  id = 'faq',
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      id={id}
      className={tone === 'white' ? 'bg-surface py-20 md:py-28' : 'bg-paper py-20 md:py-28'}
      aria-labelledby={`${id}-titre`}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading id={`${id}-titre`} eyebrow={eyebrow} title={title} lead={lead} />
            {link ? (
              <div className="mt-8">
                <ArrowLink href={link.href}>{link.label}</ArrowLink>
              </div>
            ) : null}
          </div>

          <Accordion
            items={items.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
