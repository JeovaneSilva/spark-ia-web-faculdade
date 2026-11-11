import { useEffect, useRef, useState } from 'react';

/** Segundos decorridos desde o início (nunca negativo). */
export function elapsedSeconds(startedAt: number, now: number): number {
  return Math.max(0, Math.floor((now - startedAt) / 1000));
}

/** Segundos que faltam; null quando não há limite. Nunca negativo. */
export function remainingSeconds(startedAt: number, now: number, limitSeconds: number | null): number | null {
  if (limitSeconds == null) return null;
  return Math.max(0, limitSeconds - elapsedSeconds(startedAt, now));
}

interface ExamClockOptions {
  startedAt: number;
  limitSeconds: number | null;
  /** Para de contar (ex.: prova já enviada). */
  paused?: boolean;
  /** Chamado uma única vez quando o tempo acaba. */
  onExpire?: () => void;
}

// Relógio baseado em timestamp (e não em contagem de ticks): continua certo se
// a aba ficar em segundo plano ou a página for recarregada.
export function useExamClock({ startedAt, limitSeconds, paused = false, onExpire }: ExamClockOptions) {
  const [now, setNow] = useState(() => Date.now());
  const expired = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const elapsed = elapsedSeconds(startedAt, now);
  const remaining = remainingSeconds(startedAt, now, limitSeconds);

  useEffect(() => {
    if (!paused && remaining === 0 && !expired.current) {
      expired.current = true;
      onExpireRef.current?.();
    }
  }, [remaining, paused]);

  return { elapsed: limitSeconds == null ? elapsed : Math.min(elapsed, limitSeconds), remaining };
}
