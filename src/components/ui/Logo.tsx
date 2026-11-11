import whiteLogo from '../../assets/images/whiteLogo.png';
import blackLogo from '../../assets/images/blackLogo.png';

interface LogoProps {
  className?: string;
}

// Mascote do Spark.ia. Renderiza as duas versões e o CSS (index.css) mostra a
// clara no tema escuro e a escura no tema claro. O tamanho vem do className
// (ex.: "h-8" ou "w-9"); o outro lado acompanha a proporção da imagem.
export const Logo = ({ className = 'h-8' }: LogoProps) => (
  <>
    <img src={whiteLogo} alt="Spark.ia" className={`logo-dark-theme object-contain ${className}`} />
    <img src={blackLogo} alt="" aria-hidden="true" className={`logo-light-theme object-contain ${className}`} />
  </>
);
