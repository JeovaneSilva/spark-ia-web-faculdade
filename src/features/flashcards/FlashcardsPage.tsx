import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { subjects } from './subjects';
import { listFlashcards, type Flashcard } from './flashcardsApi';
import { ApiError } from '../../lib/httpClient';

export const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listFlashcards()
      .then(setCards)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar seus flashcards.');
      });
  }, []);

  const countBySubject = (value: string) => cards?.filter((card) => card.subject === value).length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Escolha uma disciplina</h1>
          <p className="text-content-secondary">Revise seus flashcards ou crie novos.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/app/flashcards/novo')}>
            <Plus size={18} />
            Novo Flashcard
          </Button>
          <Button variant="primary" onClick={() => navigate('/app/flashcards/iniciar')}>
            <Play size={18} />
            Iniciar estudo
          </Button>
        </div>
      </header>

      {error && <p className="text-status-error">{error}</p>}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          const count = countBySubject(subject.value);
          return (
            <li key={subject.slug}>
              <button
                onClick={() => navigate(`/app/flashcards/sessao?materias=${subject.slug}`)}
                disabled={count === 0}
                className="flex w-full flex-col items-center gap-3 rounded-card bg-brand-card p-6 text-center transition-colors hover:bg-brand-card/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-card"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-white">
                  <Icon size={28} />
                </span>
                <span className="font-semibold">{subject.label}</span>
                <span className="text-sm text-content-secondary">
                  {count === 0 ? 'Nenhum cartão' : count === 1 ? '1 cartão' : `${count} cartões`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
