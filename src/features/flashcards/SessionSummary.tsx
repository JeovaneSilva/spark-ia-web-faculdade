import { RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Flashcard, ReviewDifficulty } from './flashcardsApi';

export interface SessionStats {
  correct: number;
  incorrect: number;
  byDifficulty: Record<ReviewDifficulty, number>;
}

interface SessionSummaryProps {
  stats: SessionStats;
  missed: Flashcard[];
  hasCards: boolean;
  onRestartAll: () => void;
  onRestartMissed: () => void;
  onChooseSubjects: () => void;
  onBack: () => void;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AccuracyRing = ({ percent }: { percent: number }) => (
  <div className="relative h-32 w-32 sm:h-36 sm:w-36">
    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`${percent}% de acerto`}>
      <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="9" className="stroke-white/10" />
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
        className="stroke-status-success"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-3xl font-bold">{percent}%</span>
      <span className="text-xs text-content-secondary">de acerto</span>
    </div>
  </div>
);

export const SessionSummary = ({
  stats,
  missed,
  hasCards,
  onRestartAll,
  onRestartMissed,
  onChooseSubjects,
  onBack,
}: SessionSummaryProps) => {
  const total = stats.correct + stats.incorrect;
  const percent = total === 0 ? 0 : Math.round((stats.correct / total) * 100);

  return (
    <Card>
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <h2>Sessão concluída!</h2>
          <p className="text-content-secondary">Você revisou {total} {total === 1 ? 'cartão' : 'cartões'}.</p>
        </div>

        <AccuracyRing percent={percent} />

        <div className="flex gap-6 text-lg font-semibold">
          <span className="text-status-success">Acertos: {stats.correct}</span>
          <span className="text-status-error">Erros: {stats.incorrect}</span>
        </div>

        {stats.correct > 0 && (
          <div className="flex gap-6 text-sm text-content-secondary">
            <span>Fácil: {stats.byDifficulty.EASY}</span>
            <span>Médio: {stats.byDifficulty.MEDIUM}</span>
            <span>Difícil: {stats.byDifficulty.HARD}</span>
          </div>
        )}

        {missed.length > 0 && (
          <div className="w-full max-w-xl text-left">
            <h3 className="mb-2 text-base">Para revisar ({missed.length})</h3>
            <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1">
              {missed.map((card) => (
                <li key={card.id_flashcard} className="rounded-input bg-brand-background/60 px-3 py-2 text-sm">
                  <p className="line-clamp-2 break-words">{card.question || 'Cartão com imagem'}</p>
                  <p className="line-clamp-1 break-words text-content-secondary">→ {card.answer || 'Resposta em imagem'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          {missed.length > 0 && (
            <Button variant="primary" onClick={onRestartMissed}>
              <RotateCcw size={16} />
              Revisar só os que errei
            </Button>
          )}
          {hasCards && (
            <Button variant={missed.length > 0 ? 'outline' : 'primary'} onClick={onRestartAll}>
              <RotateCcw size={16} />
              Estudar tudo de novo
            </Button>
          )}
          <Button variant="outline" onClick={onChooseSubjects}>
            Escolher outras disciplinas
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar para disciplinas
          </Button>
        </div>
      </div>
    </Card>
  );
};
