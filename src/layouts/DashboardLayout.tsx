import { useState, type ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, BookOpen, BrainCircuit, Home, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../features/auth/useAuth';

const navItems = [
  { to: '/app', label: 'Início', icon: <Home size={20} /> },
  { to: '/app/chatbot', label: 'ChatBot', icon: <BrainCircuit size={20} /> },
  { to: '/app/flashcards', label: 'Flashcards', icon: <BookOpen size={20} /> },
  { to: '/app/questoes', label: 'Banco de Questões', icon: <LayoutGrid size={20} /> },
];

export const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-brand-background md:h-screen md:flex-row md:overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col gap-8 border-r border-white/5 bg-brand-sidebar p-4 md:flex">
        <div className="text-brand-orange font-bold text-2xl px-2">Spark.ia</div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={
                item.to === '/app'
                  ? location.pathname === '/app'
                  : location.pathname.startsWith(item.to)
              }
            />
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-2 rounded-button px-2 py-2 text-content-secondary">
          <span className="flex items-center gap-2 truncate text-sm">
            <User size={16} />
            <span className="truncate">{user?.name ?? 'Você'}</span>
          </span>
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <header className="relative flex items-center justify-between bg-brand-sidebar p-4 md:hidden">
        <span className="text-brand-orange font-bold text-xl">Spark.ia</span>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-sm text-content-secondary sm:flex">
            <User size={16} />
            {user?.name ?? 'Você'}
          </span>
          <button onClick={handleLogout} aria-label="Sair" className="text-white">
            <LogOut size={20} />
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="absolute inset-x-0 top-full z-30 flex flex-col gap-1 border-t border-white/5 bg-brand-sidebar p-3 shadow-xl">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={item.to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.to)}
              />
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-8">
        <div className="w-full min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Sub-componente interno para os itens da Sidebar
const NavItem = ({ to, icon, label, active = false }: { to: string, icon: ReactNode, label: string, active?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-button cursor-pointer transition-colors ${
      active ? 'bg-brand-orange text-white' : 'text-content-secondary hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);
