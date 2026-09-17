import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import whiteLogo from '../../assets/images/whiteLogo.png';

const navLinks = [
  { href: '#inicio', label: 'Início' },
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#comoFunciona', label: 'Como funciona' },
  { href: '#sobreNos', label: 'Sobre nós' },
];

export const Footer = () => (
  <footer className="relative w-full overflow-hidden bg-brand-sidebar px-6 pb-8 pt-16 md:px-12">
    <ScrollReveal className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src={whiteLogo} alt="logo Spark.ia" className="w-10" />
          <span className="text-2xl font-bold text-content-primary">Spark.ia</span>
        </div>
        <p className="max-w-xs text-sm text-content-secondary">
          Seu assistente inteligente para preparação no ENEM — questões, chatbot e flashcards em
          um só lugar.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <a
            href="mailto:spark-ia@gmail.com"
            aria-label="Enviar email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-content-secondary transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
          >
            <Mail size={18} />
          </a>
          <a
            href="https://instagram.com/spark.ia"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram da Spark.ia"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-content-secondary transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <Instagram size={18} />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold tracking-[0.2em] text-brand-orange">NAVEGAÇÃO</span>
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-block text-content-secondary transition-all hover:translate-x-1 hover:text-brand-orange"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold tracking-[0.2em] text-brand-orange">COMECE AGORA</span>
        <p className="text-xl font-bold text-content-primary">
          Transforme seus estudos com Spark.ia
        </p>
        <Link to="/signup" className="w-fit">
          <Button variant="primary">Cadastre-se agora!</Button>
        </Link>
      </div>
    </ScrollReveal>

    <div className="relative mx-auto mt-12 flex max-w-6xl flex-col items-center justify-center gap-2 border-t border-white/5 pt-6 text-sm text-content-disabled md:flex-row">
      <p>&copy; Spark.ia - 2026</p>
    </div>
  </footer>
);
