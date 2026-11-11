import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { listEnemYears } from './questionsApi';
import { ApiError } from '../../lib/httpClient';

export const QuestionsPage = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listEnemYears()
      .then(setYears)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as provas do ENEM.');
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>Banco de Questões</h1>
        <p className="text-content-secondary">Escolha uma aplicação do ENEM para começar.</p>
      </header>

      {error && <p className="text-status-error">{error}</p>}
      {!error && !years && <ListSkeleton rows={3} />}

      {years && (
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {years.map((year) => (
            <li key={year} className="flex items-center justify-between rounded-card bg-brand-card p-4">
              <span className="font-semibold">ENEM {year}</span>
              <Button variant="primary" onClick={() => navigate(`/app/questoes/${year}/1`)}>
                Ver questões
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
