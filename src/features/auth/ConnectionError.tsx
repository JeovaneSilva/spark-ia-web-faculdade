import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

interface ConnectionErrorProps {
  message: string;
  onRetry: () => void;
  onLogout: () => void;
}

// Tela mostrada quando há sessão salva mas não deu para confirmá-la. Antes o
// app ficava em branco para sempre; agora explica o motivo e permite tentar de novo.
export const ConnectionError = ({ message, onRetry, onLogout }: ConnectionErrorProps) => (
  <div className="flex min-h-dvh items-center justify-center bg-brand-background p-6">
    <div role="alert" className="flex max-w-md flex-col items-center gap-4 text-center">
      <Logo className="h-16" />
      <h1 className="text-2xl">Não foi possível conectar</h1>
      <p className="text-content-secondary">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={onRetry}>
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={onLogout}>
          Sair
        </Button>
      </div>
    </div>
  </div>
);
