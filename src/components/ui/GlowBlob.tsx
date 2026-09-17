import type { CSSProperties } from 'react';

interface GlowBlobProps {
  color: 'cyan' | 'orange';
  className?: string;
  style?: CSSProperties;
}

const gradients: Record<GlowBlobProps['color'], string> = {
  cyan: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(34,211,238,0.07) 35%, rgba(34,211,238,0) 70%)',
  orange: 'radial-gradient(circle, rgba(255,122,0,0.16) 0%, rgba(255,122,0,0.07) 35%, rgba(255,122,0,0) 70%)',
};

/**
 * Brilho ambiente circular. Usa radial-gradient nativo em vez de
 * filter:blur() sobre uma cor sólida — o navegador aplica dithering em
 * gradientes nativos, o que evita o "banding" (contorno visível) que
 * blur() sobre cores quase planas costuma deixar em fundos escuros.
 */
export const GlowBlob = ({ color, className = '', style }: GlowBlobProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute rounded-full ${className}`}
    style={{ backgroundImage: gradients[color], ...style }}
  />
);
