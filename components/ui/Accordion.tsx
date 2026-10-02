'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useId, useState } from 'react';
import { EASE_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/hooks';

export type AccordionEntry = {
  id: string;
  question: string;
  answer: string[];
};

type AccordionProps = {
  items: AccordionEntry[];
  /** Index ouvert au premier rendu (aucun par défaut). */
  defaultOpen?: number | null;
  className?: string;
};

export function Accordion({ items, defaultOpen = null, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const reduceMotion = usePrefersReducedMotion();
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-[var(--border)] border-y border-[var(--border)]', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-300 hover:text-brand-600 md:py-6"
              >
                <span className="font-display text-[1.0625rem] font-semibold leading-snug text-navy-800 transition-colors duration-300 group-hover:text-brand-700 md:text-[1.15rem]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-brand-600 transition-all duration-400 ease-[var(--ease-out-soft)]',
                    isOpen
                      ? 'rotate-45 border-brand-300 bg-brand-tint'
                      : 'group-hover:border-brand-line-strong group-hover:bg-brand-tint',
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="max-w-2xl space-y-3 pb-6 pr-10 text-[0.975rem] leading-relaxed text-ink-soft">
                    {item.answer.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
