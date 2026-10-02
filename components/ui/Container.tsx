import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Largeur réduite pour les contenus de lecture. */
  size?: 'default' | 'narrow' | 'wide';
};

const sizes = {
  default: 'max-w-[82.5rem]',
  narrow: 'max-w-4xl',
  wide: 'max-w-[92rem]',
} as const;

export function Container({ children, className, as: Component = 'div', size = 'default' }: ContainerProps) {
  return (
    <Component className={cn('container-page', sizes[size], className)}>{children}</Component>
  );
}
