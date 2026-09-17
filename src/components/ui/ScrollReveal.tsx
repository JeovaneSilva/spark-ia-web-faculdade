import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

const hiddenOffset = {
  up: 'translate-y-6',
  left: '-translate-x-6',
  right: 'translate-x-6',
  none: '',
};

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) => {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isInView ? 'translate-x-0 translate-y-0 opacity-100' : `${hiddenOffset[direction]} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
};
