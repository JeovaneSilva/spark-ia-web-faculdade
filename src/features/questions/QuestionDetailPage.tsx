import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const alternatives = [
  'Alternativa de exemplo A',
  'Alternativa de exemplo B',
  'Alternativa de exemplo C',
  'Alternativa de exemplo D',
  'Alternativa de exemplo E',
];

export const QuestionDetailPage = () => {
  const { prova, questao } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);

  const index = Number(questao) || 1;

  const goTo = (next: number) => {
    setShowAnswer(false);
    navigate(`/app/questoes/${prova}/${next}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <Link
        to="/app/questoes"
        className="flex w-fit items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft size={16} />
        Voltar para provas
      </Link>

      <header>
        <h1>
          {index}ª questão do {prova}
        </h1>
      </header>

      <Card>
        <p className="text-content-secondary">
          Este é um enunciado de exemplo. Em breve o conteúdo real das provas será conectado aqui.
        </p>

        <ol className="mt-4 flex flex-col gap-2">
          {alternatives.map((alt, ind) => (
            <li key={alt} className="text-content-secondary">
              {'ABCDE'[ind]}) {alt}
            </li>
          ))}
        </ol>

        <div className="mt-6">
          {!showAnswer ? (
            <Button variant="primary" onClick={() => setShowAnswer(true)}>
              Exibir resposta
            </Button>
          ) : (
            <p className="font-semibold text-brand-orange">Resposta: alternativa A (exemplo)</p>
          )}
        </div>
      </Card>

      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button variant="primary" disabled={index <= 1} onClick={() => goTo(index - 1)}>
          <ArrowLeft size={18} />
        </Button>
        <Button variant="primary" onClick={() => goTo(index + 1)}>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
