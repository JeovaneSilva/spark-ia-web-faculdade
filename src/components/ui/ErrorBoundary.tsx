import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';
import { Logo } from './Logo';

interface ErrorBoundaryState {
  error: Error | null;
}

// Rede de segurança: se uma tela lançar erro ao renderizar, o React desmonta o
// app inteiro e sobra uma tela em branco. Aqui mostramos o motivo e um botão
// para recarregar (o erro completo continua no console).
export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro de renderização:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center bg-brand-background p-6">
        <div role="alert" className="flex max-w-lg flex-col items-center gap-4 text-center">
          <Logo className="h-16" />
          <h1 className="text-2xl">Algo deu errado nesta tela</h1>
          <p className="text-content-secondary">
            Ocorreu um erro inesperado. Recarregar costuma resolver; se continuar, avise o time com a mensagem abaixo.
          </p>
          <pre className="max-w-full overflow-x-auto rounded-input bg-brand-sidebar p-3 text-left text-xs text-status-error">
            {this.state.error.message}
          </pre>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Recarregar
            </Button>
            <Button variant="outline" onClick={() => window.location.assign('/app')}>
              Ir para o início
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
