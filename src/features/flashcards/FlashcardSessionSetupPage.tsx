import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SubjectGridSkeleton } from '../../components/ui/Skeleton';
import { Card } from '../../components/ui/Card';
import { Switch } from '../../components/ui/Switch';
import { subjects } from '../../lib/subjects';
import { isCardDue, listFlashcards, type Flashcard } from './flashcardsApi';
import { ApiError } from '../../lib/httpClient';

export const FlashcardSessionSetupPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Revisão espaçada: por padrão estuda só o que está pendente hoje.
  const [onlyDue, setOnlyDue] = useState(true);

  useEffect(() => {
    listFlashcards()
      .then((all) => {
        setCards(all);
        if (!all.some(isCardDue)) setOnlyDue(false);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar seus flashcards.');
      });
  }, []);

  const countBySubject = (value: string) =>
    cards?.filter((card) => card.subject === value && (!onlyDue || isCardDue(card))).length ?? 0;
  const availableSubjects = subjects.filter((subject) =>
    cards?.some((card) => card.subject === subject.value),
  );
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
    if (totalSelected === 0) return;
    navigate(`/app/flashcards/sessao?materias=${[...selected].join(',')}${onlyDue ? '&pendentes=1' : ''}`);
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
      {!error && !cards && <SubjectGridSkeleton />}

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" className="w-fit" onClick={toggleAll}>
              {allSelected ? 'Limpar seleção' : 'Selecionar todas'}
            </Button>
            <div className="sm:max-w-xs">
              <Switch checked={onlyDue} onChange={setOnlyDue} label="Apenas cartões pendentes de revisão" />
            </div>
          </div>

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
                      {onlyDue ? ' pendentes' : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="fixed inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-card bg-brand-sidebar p-3 shadow-card sm:inset-x-auto sm:bottom-8 sm:right-8 sm:gap-4 sm:p-4">
            <span className="min-w-0 text-xs text-content-secondary sm:text-sm">
              {totalSelected === 0
                ? onlyDue && selected.size > 0
                  ? 'Nada pendente nas disciplinas escolhidas'
                  : 'Nenhum cartão selecionado'
                : totalSelected === 1
                  ? '1 cartão selecionado'
                  : `${totalSelected} cartões selecionados`}
            </span>
            <Button variant="primary" className="shrink-0 px-4 sm:px-6" disabled={totalSelected === 0} onClick={handleStart}>
              <Play size={16} />
              Começar
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
