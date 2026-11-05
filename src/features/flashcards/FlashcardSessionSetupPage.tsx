import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { subjects } from '../../lib/subjects';
import { listFlashcards, type Flashcard } from './flashcardsApi';
import { ApiError } from '../../lib/httpClient';

export const FlashcardSessionSetupPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    listFlashcards()
      .then(setCards)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar seus flashcards.');
      });
  }, []);

  const countBySubject = (value: string) => cards?.filter((card) => card.subject === value).length ?? 0;
  const availableSubjects = subjects.filter((subject) => countBySubject(subject.value) > 0);
  const allSelected = availableSubjects.length > 0 && availableSubjects.every((s) => selected.has(s.slug));
  const totalSelected = subjects
    .filter((subject) => selected.has(subject.slug))
    .reduce((sum, subject) => sum + countBySubject(subject.value), 0);

  const toggleSubject = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(availableSubjects.map((s) => s.slug)));
  };

  const handleStart = () => {
    if (selected.size === 0) return;
    navigate(`/app/flashcards/sessao?materias=${[...selected].join(',')}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <Link
        to="/app/flashcards"
        className="flex w-fit items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft size={16} />
        Voltar para disciplinas
      </Link>

      <header>
        <h1>Iniciar estudo</h1>
        <p className="text-content-secondary">Escolha as disciplinas que quer revisar nessa sessão.</p>
      </header>

      {error && <p className="text-status-error">{error}</p>}
      {!error && !cards && <p className="text-content-secondary">Carregando...</p>}

      {cards && availableSubjects.length === 0 && (
        <Card>
          <p className="text-content-secondary">
            Você ainda não tem nenhum flashcard. Crie o primeiro pra poder iniciar uma sessão de estudo.
          </p>
          <Button variant="primary" className="mt-4 w-fit" onClick={() => navigate('/app/flashcards/novo')}>
            Criar flashcard
          </Button>
        </Card>
      )}

      {cards && availableSubjects.length > 0 && (
        <>
          <Button variant="outline" className="w-fit" onClick={toggleAll}>
            {allSelected ? 'Limpar seleção' : 'Selecionar todas'}
          </Button>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {availableSubjects.map((subject) => {
              const Icon = subject.icon;
              const isChecked = selected.has(subject.slug);
              const count = countBySubject(subject.value);
              return (
                <li key={subject.slug}>
                  <button
                    onClick={() => toggleSubject(subject.slug)}
                    className={`flex w-full flex-col items-center gap-2 rounded-card border p-4 text-center transition-colors ${
                      isChecked
                        ? 'border-brand-orange bg-brand-orange/10'
                        : 'border-transparent bg-brand-card hover:bg-brand-card/70'
                    }`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white">
                      <Icon size={22} />
                    </span>
                    <span className="text-sm font-semibold">{subject.label}</span>
                    <span className="text-xs text-content-secondary">
                      {count === 1 ? '1 cartão' : `${count} cartões`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="fixed bottom-8 right-8 flex items-center gap-4 rounded-card bg-brand-sidebar p-4 shadow-card">
            <span className="text-sm text-content-secondary">
              {totalSelected === 0
                ? 'Nenhum cartão selecionado'
                : totalSelected === 1
                  ? '1 cartão selecionado'
                  : `${totalSelected} cartões selecionados`}
            </span>
            <Button variant="primary" disabled={totalSelected === 0} onClick={handleStart}>
              <Play size={16} />
              Começar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
