import { useCallback, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'spark-theme';

// O tema inicial é aplicado por um script no index.html (evita piscar).
// Aqui só lemos o que já está no <html> e persistimos a troca.
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // armazenamento bloqueado: o tema vale só nesta sessão
    }
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
}
