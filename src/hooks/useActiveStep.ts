import { useEffect, useRef, useState } from 'react';

/**
 * Observa uma lista de elementos e reporta qual deles está mais próximo
 * do centro da viewport — usado para painéis "pinned" (scrollytelling)
 * onde um elemento fixo reage ao passo ativo da rolagem.
 */
export function useActiveStep<T extends HTMLElement>(count: number) {
  const refs = useRef<(T | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = refs.current.findIndex((node) => node === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    refs.current.slice(0, count).forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [count]);

  const setRef = (index: number) => (node: T | null) => {
    refs.current[index] = node;
  };

  return { activeIndex, setRef };
}
