import { useRef, type MouseEvent } from 'react';

/**
 * Efeito "magnético": o elemento se desloca sutilmente em direção ao cursor
 * dentro da sua própria área e volta ao lugar quando o mouse sai.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T | null>(null);

  const onMouseMove = (event: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  };

  return { ref, onMouseMove, onMouseLeave };
}
