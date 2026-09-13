import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../auth/useAuth';
import whiteLogo from '../../assets/imgs/png/whiteLogo.png';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hideLinks = location.pathname !== '/';

  const toggleMenu = () => setMenuOpen((value) => !value);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#011F3B] px-10 py-3 shadow-xl">
      <nav className="flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-3">
            <img src={whiteLogo} alt="logo spark.ia" className="w-10" />
            <h1 className="text-2xl text-white">Spark.ia</h1>
          </div>
        </Link>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-4xl text-white hover:text-[#fa7807] active:text-[#FDAD0B]"
          >
            {!menuOpen && <Menu size={32} />}
          </button>
        </div>

        <ul
          className={`fixed left-0 right-0 top-0 transform bg-[#011F3B] text-xl text-white transition-transform duration-300 ease-in-out md:static md:flex md:translate-y-0 md:items-center md:gap-6 md:bg-transparent md:text-base ${
            menuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <li className="flex w-full justify-end border-y-[1px] border-slate-700 p-2 px-5 md:hidden md:border-none">
            <button className="text-4xl hover:text-[#fa7807]" onClick={toggleMenu}>
              <X size={32} />
            </button>
          </li>

          {!hideLinks && (
            <>
              <li className="block w-full border-y-[1px] border-slate-700 p-2 text-center hover:text-[#fa7807] active:text-[#FDAD0B] md:w-auto md:border-none">
                <a href="#inicio">Início</a>
              </li>
              <li className="block w-full border-y-[1px] border-slate-700 p-2 text-center hover:text-[#fa7807] active:text-[#FDAD0B] md:w-auto md:border-none">
                <a href="#funcionalidades">Funcionalidades</a>
              </li>
              <li className="block w-full border-y-[1px] border-slate-700 p-2 text-center hover:text-[#fa7807] active:text-[#FDAD0B] md:w-auto md:border-none">
                <a href="#sobreNos">Sobre nós</a>
              </li>
            </>
          )}

          {isAuthenticated && (
            <li className="flex w-full flex-col items-center justify-between gap-2 border-y-[1px] border-slate-700 p-2 px-5 text-center md:hidden">
              <div className="flex items-center gap-2">
                <User size={16} />
                Você
              </div>
              <Button variant="primary" className="w-[120px]" onClick={handleLogout}>
                Sair
              </Button>
            </li>
          )}
        </ul>

        <div className="hidden gap-2 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 text-white">
              <p className="flex cursor-pointer items-center gap-1 hover:text-[#FA7807] md:text-base">
                <User size={16} />
                Você
              </p>
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
