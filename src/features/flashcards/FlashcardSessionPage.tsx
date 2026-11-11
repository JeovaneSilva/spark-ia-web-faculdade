import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { Card } from '../../components/ui/Card';
import { StudyCard } from './StudyCard';
import { SessionSummary, type SessionStats } from './SessionSummary';
import { findSubjectBySlug, findSubjectByValue } from '../../lib/subjects';
import {
  deleteFlashcard,
  isCardDue,
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

// Revisão espaçada: os pendentes vêm primeiro (embaralhados entre si), depois
// os que ainda não venceram.
function orderForStudy(cards: Flashcard[]): Flashcard[] {
  return [...shuffle(cards.filter(isCardDue)), ...shuffle(cards.filter((card) => !isCardDue(card)))];
}

const EMPTY_STATS: SessionStats = { correct: 0, incorrect: 0, byDifficulty: { EASY: 0, MEDIUM: 0, HARD: 0 } };

export const FlashcardSessionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const materiasParam = searchParams.get('materias') ?? '';
  const onlyDue = searchParams.get('pendentes') === '1';

  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  // Todos os cartões das disciplinas escolhidas (a fila pode ser só os errados).
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [missed, setMissed] = useState<Flashcard[]>([]);
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
        const selected = all.filter(
          (card) => values.has(card.subject) && (!onlyDue || isCardDue(card)),
        );
        setAllCards(selected);
        setQueue(orderForStudy(selected));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os flashcards.');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materiasParam, onlyDue]);

  const card = queue?.[currentIndex];

  const restart = (cards: Flashcard[]) => {
    setQueue(shuffle(cards));
    setCurrentIndex(0);
    setShowAnswer(false);
    setStats(EMPTY_STATS);
    setMissed([]);
    setFinished(false);
  };

  const handleReview = async (difficulty: ReviewDifficulty, isCorrect: boolean) => {
    if (!card) return;
    setIsBusy(true);
    setError(null);
    try {
      await reviewFlashcard(card.id_flashcard, difficulty, isCorrect);
      if (!isCorrect) setMissed((prev) => [...prev, card]);
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
      setAllCards((prev) => prev.filter((item) => item.id_flashcard !== card.id_flashcard));
      setMissed((prev) => prev.filter((item) => item.id_flashcard !== card.id_flashcard));
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

      {!error && !queue && <ListSkeleton rows={3} />}

      {queue && queue.length === 0 && !finished && (
        <Card>
          <p className="text-content-secondary">
            {onlyDue
              ? 'Nenhum cartão pendente de revisão nas disciplinas selecionadas. Volte mais tarde ou estude tudo.'
              : 'Nenhum flashcard encontrado nas disciplinas selecionadas.'}
          </p>
          <Button variant="primary" className="mt-4 w-fit" onClick={() => navigate('/app/flashcards/iniciar')}>
            Escolher outras disciplinas
          </Button>
        </Card>
      )}

      {finished && (
        <SessionSummary
          stats={stats}
          missed={missed}
          hasCards={allCards.length > 0}
          onRestartAll={() => restart(allCards)}
          onRestartMissed={() => restart(missed)}
          onChooseSubjects={() => navigate('/app/flashcards/iniciar')}
          onBack={() => navigate('/app/flashcards')}
        />
      )}

      {!finished && card && (
        <StudyCard
          key={card.id_flashcard}
          card={card}
          subjectLabel={showSubjectBadge ? findSubjectByValue(card.subject)?.label : undefined}
          showAnswer={showAnswer}
          isBusy={isBusy}
          onToggleAnswer={() => setShowAnswer((value) => !value)}
          onReview={handleReview}
          onEdit={() => navigate(`/app/flashcards/${card.id_flashcard}/editar`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
