import { Info } from 'lucide-react';
import type { ContentBlock } from '@/content/blog/types';
import { slugify } from '@/lib/utils';

/** Rendu typé du contenu d'article : pas de HTML brut, donc pas d'injection. */
export function PostBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={`${block.text}-${index}`}
                id={slugify(block.text)}
                className="scroll-mt-32 pt-6 font-display text-[1.55rem] font-bold leading-snug text-navy-900 md:text-[1.75rem]"
              >
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3
                key={`${block.text}-${index}`}
                className="pt-2 font-display text-[1.2rem] font-semibold text-navy-800"
              >
                {block.text}
              </h3>
            );
          case 'ul':
            return (
              <ul key={`ul-${index}`} className="space-y-2.5 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.02rem] leading-relaxed text-ink">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={`ol-${index}`} className="space-y-3">
                {block.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4 text-[1.02rem] leading-relaxed text-ink">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-[0.75rem] font-semibold text-brand-700">
                      {itemIndex + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            );
          case 'note':
            return (
              <aside
                key={`note-${index}`}
                className="rounded-2xl border border-brand-line bg-brand-tint p-5"
              >
                <p className="flex items-center gap-2 font-display text-[0.9rem] font-semibold text-navy-800">
                  <Info className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {block.title ?? 'À noter'}
                </p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{block.text}</p>
              </aside>
            );
          default:
            return (
              <p key={`p-${index}`} className="text-[1.02rem] leading-[1.75] text-ink">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
