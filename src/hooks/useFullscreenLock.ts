import { useCallback, useEffect, useRef, useState } from 'react';

export const isFullscreenSupported = () =>
  typeof document !== 'undefined' && typeof document.documentElement.requestFullscreen === 'function';

/** Precisa ser chamado dentro de um clique (exigência do navegador). */
export async function enterFullscreen(): Promise<boolean> {
  if (!isFullscreenSupported()) return false;
  try {
    await document.documentElement.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export function exitFullscreenSafe(): void {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
}

interface FullscreenLockOptions {
  /** Só monitora enquanto a prova está em andamento. */
  enabled: boolean;
  /** Saídas já registradas (retomada após recarregar a página). */
  initialExits: number;
  limit: number;
  onExit?: (count: number) => void;
  /** Chamado quando as saídas chegam ao limite. */
  onLimit: () => void;
}

// "Fora" = saiu da tela cheia OU a aba ficou oculta. Cada transição de dentro
// para fora conta uma saída. Onde não há Fullscreen API (iPhone), só a aba
// oculta conta. O navegador não permite IMPEDIR a saída: só detectar e reagir.
export function useFullscreenLock({ enabled, initialExits, limit, onExit, onLimit }: FullscreenLockOptions) {
  const supported = isFullscreenSupported();
  const computeAway = useCallback(
    () => document.hidden || (supported && !document.fullscreenElement),
    [supported],
  );

  const [isAway, setIsAway] = useState(computeAway);
  const [exitCount, setExitCount] = useState(initialExits);
  // Já começa "fora" após recarregar (a tela cheia se perde); isso não é uma saída nova.
  const wasAway = useRef(computeAway());
  const exitsRef = useRef(initialExits);
  const callbacks = useRef({ onExit, onLimit });

  useEffect(() => {
    callbacks.current = { onExit, onLimit };
  });

  useEffect(() => {
    if (!enabled) return;

    const check = () => {
      const away = computeAway();
      setIsAway(away);
      if (away && !wasAway.current) {
        // contador em ref: callbacks fora de updater (o React pode rodá-lo 2x em dev)
        exitsRef.current += 1;
        setExitCount(exitsRef.current);
        callbacks.current.onExit?.(exitsRef.current);
        if (exitsRef.current >= limit) callbacks.current.onLimit();
      }
      wasAway.current = away;
    };

    document.addEventListener('fullscreenchange', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      document.removeEventListener('fullscreenchange', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [enabled, limit, computeAway]);

  const reenter = useCallback(async () => {
    await enterFullscreen();
    setIsAway(computeAway());
    wasAway.current = computeAway();
  }, [computeAway]);

  return { supported, isAway, exitCount, reenter };
}
