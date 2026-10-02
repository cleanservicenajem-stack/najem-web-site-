import Image from 'next/image';
import { cn } from '@/lib/utils';

type PhoneFrameProps = {
  src: string;
  alt: string;
  /** Largeur de l'appareil en pixels (le ratio écran est fixe). */
  width?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * Cadre d'appareil dessiné en CSS (aucune image de mockup à charger).
 * L'écran affiche les captures réelles de l'application, préparées par
 * `scripts/prepare-app-screens.py` dans `/public/images/app/`.
 */
export function PhoneFrame({
  src,
  alt,
  width = 268,
  priority = false,
  className,
  sizes = '(max-width: 768px) 60vw, 280px',
}: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative aspect-[1170/2532] rounded-[2.75rem] bg-[linear-gradient(160deg,#1b2b3d,#06182c_55%,#0f2233)] p-[0.3rem]',
        'shadow-[0_2px_2px_rgba(255,255,255,0.28)_inset,0_40px_80px_-40px_rgba(6,36,66,0.65)]',
        className,
      )}
      style={{ width }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        {/* Îlot de caméra */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-2.5 h-[1.1rem] w-[28%] -translate-x-1/2 rounded-full bg-night-deep/90"
        />
        {/* Reflet vitre, très léger */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_38%,rgba(255,255,255,0)_60%,rgba(255,255,255,0.14)_100%)]"
        />
      </div>
    </div>
  );
}
