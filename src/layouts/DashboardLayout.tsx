import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, BookOpen, BrainCircuit, Home, Menu } from 'lucide-react';

const navItems = [
  { to: '/app', label: 'Início', icon: <Home size={20} /> },
  { to: '/app/chatbot', label: 'ChatBot', icon: <BrainCircuit size={20} /> },
  { to: '/app/flashcards', label: 'Flashcards', icon: <BookOpen size={20} /> },
  { to: '/app/questoes', label: 'Banco de Questões', icon: <LayoutGrid size={20} /> },
];

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-background">
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
      </aside>

      <header className="md:hidden p-4 bg-brand-sidebar flex justify-between items-center">
        <span className="text-brand-orange font-bold text-xl">Spark.ia</span>
        <Menu className="text-white cursor-pointer" />
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
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
