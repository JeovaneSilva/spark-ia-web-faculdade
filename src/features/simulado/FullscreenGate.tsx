import { Maximize } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface FullscreenGateProps {
  exitCount: number;
  limit: number;
  onReenter: () => void;
}

// Cobre a prova enquanto o aluno está fora da tela cheia. O tempo continua
// correndo; a contagem de saídas fica visível.
export const FullscreenGate = ({ exitCount, limit, onReenter }: FullscreenGateProps) => (
  <div
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="fullscreen-gate-title"
    className="fixed inset-0 z-[2000] flex items-center justify-center bg-brand-background p-6"
  >
    <div className="flex max-w-md flex-col items-center gap-4 text-center">
      <Maximize size={40} className="text-brand-orange" />
      <h2 id="fullscreen-gate-title">Volte para a tela cheia</h2>
      <p className="text-content-secondary">
        A prova só continua em tela cheia, e o tempo não para. Saídas registradas:{' '}
        <span className="font-semibold text-content-primary">
          {exitCount} de {limit}
        </span>
        . Na {limit}ª saída a prova é enviada automaticamente.
      </p>
      <Button variant="primary" onClick={onReenter}>
        <Maximize size={16} />
        Voltar à prova
      </Button>
    </div>
  </div>
);
