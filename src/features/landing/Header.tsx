import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const navItems = [
  { href: '#inicio', label: 'Início' },
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#comoFunciona', label: 'Como funciona' },
  { href: '#sobreNos', label: 'Sobre nós' },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideLinks = location.pathname !== '/';

  const toggleMenu = () => setMenuOpen((value) => !value);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-brand-sidebar px-6 py-3 md:px-10">
      <nav className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="w-9" />
          <span className="text-xl font-bold text-content-primary md:text-2xl">Spark.ia</span>
        </Link>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-content-primary transition-colors hover:bg-white/5"
          >
            {!menuOpen && <Menu size={24} />}
          </button>
        </div>

        <ul
          className={`fixed left-0 right-0 top-0 transform border-b border-white/5 bg-brand-sidebar text-lg text-content-primary shadow-2xl transition-transform duration-300 ease-in-out md:static md:flex md:translate-y-0 md:items-center md:gap-8 md:border-none md:bg-transparent md:text-sm md:shadow-none ${
            menuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <li className="flex w-full justify-end border-b border-white/5 p-3 px-5 md:hidden md:border-none">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-content-primary hover:bg-white/5"
              onClick={toggleMenu}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </li>

          {!hideLinks &&
            navItems.map((item) => (
              <li key={item.href} className="w-full border-b border-white/5 md:w-auto md:border-none">
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="block w-full px-5 py-3 text-center text-content-secondary transition-colors hover:text-brand-orange md:inline-block md:w-auto md:px-0 md:py-1"
                >
                  {item.label}
                </a>
              </li>
            ))}

          {isAuthenticated && (
            <li className="flex w-full flex-col items-center gap-3 p-5 md:hidden">
              <div className="flex items-center gap-2 text-content-secondary">
                <User size={16} />
                {user?.name ?? 'Você'}
              </div>
              <Button variant="primary" className="w-full" onClick={handleLogout}>
                Sair
              </Button>
            </li>
          )}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-content-secondary">
                <User size={16} />
                {user?.name ?? 'Você'}
              </span>
              <Button variant="primary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
