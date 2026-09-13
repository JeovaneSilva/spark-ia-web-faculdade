import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { exams } from './exams';

export const QuestionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>Banco de Questões</h1>
        <p className="text-content-secondary">Escolha uma aplicação do ENEM para começar.</p>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {exams.map((exam) => (
          <li key={exam} className="flex items-center justify-between rounded-card bg-brand-card p-4">
            <span className="font-semibold">{exam}</span>
            <Button variant="primary" onClick={() => navigate(`/app/questoes/${encodeURIComponent(exam)}/1`)}>
              Ver questões
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
