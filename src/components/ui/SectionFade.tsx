interface SectionFadeProps {
  fromClass: string;
}

/**
 * Máscara de gradiente colocada no topo de uma seção pra dissolver a cor de
 * fundo da seção anterior nela, em vez de um corte seco entre as duas.
 */
export const SectionFade = ({ fromClass }: SectionFadeProps) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b to-transparent md:h-44 ${fromClass}`}
  />
);
