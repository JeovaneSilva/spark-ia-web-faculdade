import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { subjects } from './subjects';

export const FlashcardSubjectPage = () => {
  const { materia, pergunta } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);

  const subject = subjects.find((item) => item.slug === materia);
  const index = Number(pergunta) || 1;

  const goToNext = () => {
    setShowAnswer(false);
    navigate(`/app/flashcards/${materia}/${index + 1}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/app/flashcards"
        className="flex w-fit items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft size={16} />
        Voltar para disciplinas
      </Link>

      <header>
        <h1>{subject?.label ?? 'Flashcard'}</h1>
        <p className="text-content-secondary">Cartão {index}</p>
      </header>

      <Card>
        <p className="text-lg font-medium">
          Pergunta {index} de {subject?.label ?? 'flashcards'}: este é um cartão de exemplo, o
          conteúdo real ainda será conectado.
        </p>

        {showAnswer && (
          <p className="mt-4 text-content-secondary">
            Resposta de exemplo — aqui entrará a explicação gerada para este cartão.
          </p>
        )}

        <div className="mt-6 flex justify-center">
          {!showAnswer ? (
            <Button variant="primary" onClick={() => setShowAnswer(true)}>
              Mostrar resposta
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={goToNext}>
                Errei
              </Button>
              <Button variant="primary" onClick={goToNext}>
                Acertei
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
