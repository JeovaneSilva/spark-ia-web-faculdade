import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ToastContext, type ToastApi } from './toastContext';

type ToastKind = 'success' | 'error';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const DURATION_MS = 3500;
const MAX_VISIBLE = 3;

// Avisos curtos de confirmação ("Flashcard criado") e erro. A região é
// aria-live, então leitores de tela anunciam sem tirar o foco do usuário.
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, kind, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), DURATION_MS);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[1000] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.kind === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-input border px-4 py-3 text-sm shadow-card bg-brand-sidebar ${
              toast.kind === 'success' ? 'border-status-success/50' : 'border-status-error/50'
            }`}
          >
            {toast.kind === 'success' ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-status-success" />
            ) : (
              <XCircle size={18} className="mt-0.5 shrink-0 text-status-error" />
            )}
            <span className="break-words">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
