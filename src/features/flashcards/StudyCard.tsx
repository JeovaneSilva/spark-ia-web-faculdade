import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import { CheckCircle2, Pencil, RotateCw, Trash2, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { Flashcard, ReviewDifficulty } from './flashcardsApi';

interface StudyCardProps {
  card: Flashcard;
  subjectLabel?: string;
  showAnswer: boolean;
  isBusy: boolean;
  onToggleAnswer: () => void;
  onReview: (difficulty: ReviewDifficulty, isCorrect: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface FaceProps {
  label: string;
  text: string;
  image: string | null;
  imageAlt: string;
  hint: ReactNode;
  className: string;
  hidden: boolean;
}

// Dica visual do atalho; só em telas com teclado provável (sm+).
const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="hidden rounded border border-current/30 px-1.5 text-xs font-normal opacity-70 sm:inline">{children}</kbd>
);

// Uma face do cartão. As duas ficam na mesma célula do grid (a altura é a da
// maior), e backface-visibility esconde a que está de costas.
const CardFace = ({ label, text, image, imageAlt, hint, className, hidden }: FaceProps) => (
  <div
    aria-hidden={hidden}
    className={`flip-face flex min-h-72 flex-col justify-between gap-4 rounded-2xl border p-5 [grid-area:1/1] sm:min-h-80 sm:p-8 ${className}`}
  >
    <span className="text-xs font-semibold tracking-[0.2em] uppercase opacity-70">{label}</span>
    <div className="flex flex-col items-center gap-4 text-center">
      {text && <p className="text-xl font-medium break-words sm:text-2xl">{text}</p>}
      {image && <img src={image} alt={imageAlt} className="max-h-48 max-w-full rounded-input object-contain sm:max-h-64" />}
    </div>
    <span className="flex items-center justify-center gap-2 text-xs text-content-secondary">{hint}</span>
  </div>
);

// Fluxo em duas etapas: primeiro acertou/errou (o que alimenta a priorização
// futura de cards mais errados), e só se acertou pergunta o quão fácil foi
// -- errar já é sinal suficiente de que precisa revisar de novo, então pula
// direto pra próxima em vez de pedir mais um clique.
export const StudyCard = ({
  card,
  subjectLabel,
  showAnswer,
  isBusy,
  onToggleAnswer,
  onReview,
  onEdit,
  onDelete,
}: StudyCardProps) => {
  const [awaitingDifficulty, setAwaitingDifficulty] = useState(false);

  const handleWrong = () => onReview('HARD', false);
  const handleDifficulty = (difficulty: ReviewDifficulty) => onReview(difficulty, true);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleAnswer();
    }
  };

  // Atalhos globais: Espaço/Enter vira o cartão; 1/2 = Errei/Acertei; depois de
  // "Acertei", 1/2/3 = Difícil/Médio/Fácil. Ignora campos de texto e teclas
  // modificadoras.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      if (event.key === ' ' || event.key === 'Enter') {
        // em botões/links o próprio elemento já trata Espaço/Enter
        if (target?.closest('button, [role="button"], a')) return;
        event.preventDefault();
        onToggleAnswer();
        return;
      }
      if (!showAnswer || isBusy) return;

      if (awaitingDifficulty) {
        if (event.key === '1') handleDifficulty('HARD');
        else if (event.key === '2') handleDifficulty('MEDIUM');
        else if (event.key === '3') handleDifficulty('EASY');
      } else if (event.key === '1') {
        handleWrong();
      } else if (event.key === '2') {
        setAwaitingDifficulty(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // handlers recriados a cada render; reanexar mantém o estado atual
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        {subjectLabel ? (
          <span className="w-fit rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
            {subjectLabel}
          </span>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 gap-1">
          <button
            onClick={onEdit}
            aria-label="Editar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-white/5 hover:text-white"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            disabled={isBusy}
            aria-label="Apagar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-status-error/10 hover:text-status-error disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flip-scene">
        <div
          role="button"
          tabIndex={0}
          aria-label={showAnswer ? 'Virar para a pergunta' : 'Virar para a resposta'}
          onClick={onToggleAnswer}
          onKeyDown={handleKeyDown}
          data-flipped={showAnswer}
          className="flip-inner grid cursor-pointer rounded-2xl shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
        >
          <CardFace
            label="Pergunta"
            text={card.question}
            image={card.questionImage}
            imageAlt="Imagem da pergunta"
            hidden={showAnswer}
            className="border-brand-cyan/30 bg-gradient-to-br from-brand-card via-brand-card to-brand-sidebar text-content-primary"
            hint={
              <>
                <RotateCw size={14} />
                Toque ou pressione Espaço para ver a resposta
              </>
            }
          />
          <CardFace
            label="Resposta"
            text={card.answer}
            image={card.answerImage}
            imageAlt="Imagem da resposta"
            hidden={!showAnswer}
            className="flip-back border-brand-orange/40 bg-gradient-to-br from-brand-sidebar via-brand-card to-brand-card text-content-primary"
            hint={
              <>
                <RotateCw size={14} />
                Toque para voltar à pergunta
              </>
            }
          />
        </div>
      </div>

      <div className="flex min-h-24 flex-col items-center justify-center gap-3">
        {!showAnswer ? (
          <Button variant="primary" onClick={onToggleAnswer}>
            Mostrar resposta
          </Button>
        ) : !awaitingDifficulty ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
            <Button variant="outline" disabled={isBusy} onClick={handleWrong}>
              <XCircle size={16} />
              Errei
              <Kbd>1</Kbd>
            </Button>
            <Button variant="primary" disabled={isBusy} onClick={() => setAwaitingDifficulty(true)}>
              <CheckCircle2 size={16} />
              Acertei
              <Kbd>2</Kbd>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-content-secondary">Quão fácil foi lembrar?</p>
            <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:justify-center sm:gap-3">
              <Button variant="outline" className="px-3 sm:px-6" disabled={isBusy} onClick={() => handleDifficulty('HARD')}>
                Difícil
                <Kbd>1</Kbd>
              </Button>
              <Button variant="outline" className="px-3 sm:px-6" disabled={isBusy} onClick={() => handleDifficulty('MEDIUM')}>
                Médio
                <Kbd>2</Kbd>
              </Button>
              <Button variant="primary" className="px-3 sm:px-6" disabled={isBusy} onClick={() => handleDifficulty('EASY')}>
                Fácil
                <Kbd>3</Kbd>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
