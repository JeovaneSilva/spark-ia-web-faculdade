import type { ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, BookOpen, BrainCircuit, Home, LogOut, Menu, User } from 'lucide-react';
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-brand-background md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-70 bg-brand-sidebar flex-col border-r border-white/5 p-4 gap-8">
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

      <header className="md:hidden p-4 bg-brand-sidebar flex justify-between items-center">
        <span className="text-brand-orange font-bold text-xl">Spark.ia</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-content-secondary">
            <User size={16} />
            {user?.name ?? 'Você'}
          </span>
          <button onClick={handleLogout} aria-label="Sair" className="text-white">
            <LogOut size={20} />
          </button>
          <Menu className="text-white cursor-pointer" />
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 overflow-hidden p-4 md:p-8">
        <Outlet />
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
