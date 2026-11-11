import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Mudar para o tema escuro' : 'Mudar para o tema claro'}
      title={isLight ? 'Tema escuro' : 'Tema claro'}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-white/5 hover:text-content-primary ${className}`}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};
