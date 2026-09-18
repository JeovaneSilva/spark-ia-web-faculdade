import { useState } from 'react';
import { CheckCircle2, Pencil, Trash2, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Flashcard, ReviewDifficulty } from './flashcardsApi';

interface StudyCardProps {
  card: Flashcard;
  subjectLabel?: string;
  showAnswer: boolean;
  isBusy: boolean;
  onShowAnswer: () => void;
  onReview: (difficulty: ReviewDifficulty, isCorrect: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Fluxo em duas etapas: primeiro acertou/errou (o que alimenta a priorização
// futura de cards mais errados), e só se acertou pergunta o quão fácil foi
// -- errar já é sinal suficiente de que precisa revisar de novo, então pula
// direto pra próxima em vez de pedir mais um clique.
export const StudyCard = ({
  card,
  subjectLabel,
  showAnswer,
  isBusy,
  onShowAnswer,
  onReview,
  onEdit,
  onDelete,
}: StudyCardProps) => {
  const [awaitingDifficulty, setAwaitingDifficulty] = useState(false);

  const handleWrong = () => onReview('HARD', false);
  const handleDifficulty = (difficulty: ReviewDifficulty) => onReview(difficulty, true);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          {subjectLabel && (
            <span className="w-fit rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
              {subjectLabel}
            </span>
          )}
          {card.question && <p className="text-lg font-medium">{card.question}</p>}
          {card.questionImage && (
            <img src={card.questionImage} alt="Imagem da pergunta" className="max-w-full rounded-input sm:max-w-sm" />
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onEdit}
            aria-label="Editar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-white/5 hover:text-white"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            disabled={isBusy}
            aria-label="Apagar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-status-error/10 hover:text-status-error"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showAnswer && (
        <div className="mt-4 flex flex-col gap-3">
          {card.answer && <p className="text-content-secondary">{card.answer}</p>}
          {card.answerImage && (
            <img src={card.answerImage} alt="Imagem da resposta" className="max-w-full rounded-input sm:max-w-sm" />
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        {!showAnswer ? (
          <Button variant="primary" onClick={onShowAnswer}>
            Mostrar resposta
          </Button>
        ) : !awaitingDifficulty ? (
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" disabled={isBusy} onClick={handleWrong}>
              <XCircle size={16} />
              Errei
            </Button>
            <Button variant="primary" disabled={isBusy} onClick={() => setAwaitingDifficulty(true)}>
              <CheckCircle2 size={16} />
              Acertei
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-content-secondary">Quão fácil foi lembrar?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" disabled={isBusy} onClick={() => handleDifficulty('HARD')}>
                Difícil
              </Button>
              <Button variant="outline" disabled={isBusy} onClick={() => handleDifficulty('MEDIUM')}>
                Médio
              </Button>
              <Button variant="primary" disabled={isBusy} onClick={() => handleDifficulty('EASY')}>
                Fácil
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
