import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Plus, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StudyCard } from './StudyCard';
import { findSubjectBySlug, findSubjectByValue } from './subjects';
import {
  deleteFlashcard,
  listFlashcards,
  reviewFlashcard,
  type Flashcard,
  type ReviewDifficulty,
} from './flashcardsApi';
import { ApiError } from '../../lib/httpClient';

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface SessionStats {
  correct: number;
  incorrect: number;
  byDifficulty: Record<ReviewDifficulty, number>;
}

const EMPTY_STATS: SessionStats = { correct: 0, incorrect: 0, byDifficulty: { EASY: 0, MEDIUM: 0, HARD: 0 } };

export const FlashcardSessionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const materiasParam = searchParams.get('materias') ?? '';

  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [finished, setFinished] = useState(false);

  const selectedSlugs = materiasParam.split(',').filter(Boolean);

  useEffect(() => {
    let cancelled = false;

    listFlashcards()
      .then((all) => {
        if (cancelled) return;
        const values = new Set(
          selectedSlugs.map((slug) => findSubjectBySlug(slug)?.value).filter((v): v is string => Boolean(v)),
        );
        setQueue(shuffle(all.filter((card) => values.has(card.subject))));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os flashcards.');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiasParam]);

  const card = queue?.[currentIndex];

  const restart = () => {
    setQueue((prev) => (prev ? shuffle(prev) : prev));
    setCurrentIndex(0);
    setShowAnswer(false);
    setStats(EMPTY_STATS);
    setFinished(false);
  };

  const handleReview = async (difficulty: ReviewDifficulty, isCorrect: boolean) => {
    if (!card) return;
    setIsBusy(true);
    setError(null);
    try {
      await reviewFlashcard(card.id_flashcard, difficulty, isCorrect);
      setStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        byDifficulty: { ...prev.byDifficulty, [difficulty]: prev.byDifficulty[difficulty] + 1 },
      }));
      if (queue && currentIndex + 1 < queue.length) {
        setCurrentIndex((i) => i + 1);
        setShowAnswer(false);
      } else {
        setFinished(true);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar sua revisão.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!card || !queue) return;
    setIsBusy(true);
    setError(null);
    try {
      await deleteFlashcard(card.id_flashcard);
      const remaining = queue.filter((item) => item.id_flashcard !== card.id_flashcard);
      setQueue(remaining);
      setShowAnswer(false);
      if (remaining.length === 0) {
        setFinished(true);
      } else if (currentIndex >= remaining.length) {
        setCurrentIndex(remaining.length - 1);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível apagar o flashcard.');
    } finally {
      setIsBusy(false);
    }
  };

  const totalReviewed = stats.correct + stats.incorrect;
  const showSubjectBadge = selectedSlugs.length > 1;

  return (
    <div className="flex flex-col gap-6 pb-16">
      <Link
        to="/app/flashcards"
        className="flex w-fit items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft size={16} />
        Voltar para disciplinas
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Sessão de estudo</h1>
          {queue && queue.length > 0 && !finished && (
            <p className="text-content-secondary">
              Cartão {currentIndex + 1} de {queue.length}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/app/flashcards/novo${card ? `?materia=${findSubjectByValue(card.subject)?.slug}` : ''}`)}
        >
          <Plus size={16} />
          Novo cartão
        </Button>
      </header>

      {error && <p className="text-status-error">{error}</p>}

      {!error && !queue && <p className="text-content-secondary">Carregando...</p>}

      {queue && queue.length === 0 && !finished && (
        <Card>
          <p className="text-content-secondary">Nenhum flashcard encontrado nas disciplinas selecionadas.</p>
          <Button variant="primary" className="mt-4 w-fit" onClick={() => navigate('/app/flashcards/iniciar')}>
            Escolher outras disciplinas
          </Button>
        </Card>
      )}

      {finished && (
        <Card>
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 size={40} className="text-status-success" />
            <div>
              <h2>Sessão concluída!</h2>
              <p className="text-content-secondary">Você revisou {totalReviewed} cartões.</p>
            </div>
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
            <div className="flex flex-wrap justify-center gap-3">
              {queue && queue.length > 0 && (
                <Button variant="outline" onClick={restart}>
                  <RotateCcw size={16} />
                  Estudar de novo
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/app/flashcards/iniciar')}>
                Escolher outras disciplinas
              </Button>
              <Button variant="primary" onClick={() => navigate('/app/flashcards')}>
                Voltar para disciplinas
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!finished && card && (
        <StudyCard
          key={card.id_flashcard}
          card={card}
          subjectLabel={showSubjectBadge ? findSubjectByValue(card.subject)?.label : undefined}
          showAnswer={showAnswer}
          isBusy={isBusy}
          onShowAnswer={() => setShowAnswer(true)}
          onReview={handleReview}
          onEdit={() => navigate(`/app/flashcards/${card.id_flashcard}/editar`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
