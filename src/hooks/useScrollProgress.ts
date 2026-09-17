import { useEffect, useRef, useState } from 'react';

/**
 * Retorna o progresso (0 a 1) de um elemento cruzando a viewport,
 * atualizado no scroll com throttle via requestAnimationFrame.
 * Usado para efeitos "scrubbed", como uma linha que se desenha no scroll.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = rect.height - viewportHeight * 0.4;
      const scrolled = viewportHeight * 0.75 - rect.top;
      const value = total <= 0 ? 1 : Math.min(1, Math.max(0, scrolled / total));
      setProgress(value);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}
