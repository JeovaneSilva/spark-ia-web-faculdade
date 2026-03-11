import type { ReactNode } from 'react';
import { LayoutGrid, BookOpen, BrainCircuit, Menu } from 'lucide-react';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-70 bg-brand-sidebar flex-col border-r border-white/5 p-4 gap-8">
        <div className="text-brand-orange font-bold text-2xl px-2">Spark.ia</div>
        
        <nav className="flex flex-col gap-2">
          <NavItem icon={<BrainCircuit size={20}/>} label="ChatBot" active />
          <NavItem icon={<BookOpen size={20}/>} label="Flashcards" />
          <NavItem icon={<LayoutGrid size={20}/>} label="Banco de Questões" />
        </nav>
      </aside>

      <header className="md:hidden p-4 bg-brand-sidebar flex justify-between items-center">
        <span className="text-brand-orange font-bold text-xl">Spark.ia</span>
        <Menu className="text-white cursor-pointer" />
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

// Sub-componente interno para os itens da Sidebar
const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-button cursor-pointer transition-colors ${
    active ? 'bg-brand-orange text-white' : 'text-content-secondary hover:bg-white/5 hover:text-white'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);