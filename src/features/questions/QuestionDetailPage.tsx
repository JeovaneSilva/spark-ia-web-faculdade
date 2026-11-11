import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Grid3x3, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { MistakeExplainer } from './MistakeExplainer';
import {
  getEnemProgress,
  getEnemQuestion,
  submitAnswer,
  type AnswerOption,
  type AnswerResult,
  type EnemProgressItem,
  type EnemQuestion,
} from './questionsApi';
import { ApiError } from '../../lib/httpClient';

const OPTION_LETTERS: AnswerOption[] = ['A', 'B', 'C', 'D', 'E'];

interface LoadResult {
  examYear: number;
  examNumber: number;
  question?: EnemQuestion;
  error?: string;
}

export const QuestionDetailPage = () => {
  const { prova, questao } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<LoadResult | null>(null);
  const [progress, setProgress] = useState<EnemProgressItem[] | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  const examYear = Number(prova);
  const examNumber = Number(questao) || 1;

  useEffect(() => {
    let cancelled = false;

    getEnemQuestion(examYear, examNumber)
      .then((question) => {
        if (!cancelled) setResult({ examYear, examNumber, question });
      })
      .catch((err) => {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Não foi possível carregar a questão.';
          setResult({ examYear, examNumber, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [examYear, examNumber]);

  const isCurrent = result?.examYear === examYear && result?.examNumber === examNumber;
  const question = isCurrent ? result?.question : undefined;
  const error = isCurrent ? result?.error : undefined;

  const goTo = (next: number) => {
    setShowGrid(false);
    navigate(`/app/questoes/${prova}/${next}`);
  };

  const toggleGrid = async () => {
    if (showGrid) {
      setShowGrid(false);
      return;
    }
    setShowGrid(true);
    if (!progress) {
      try {
        setProgress(await getEnemProgress(examYear));
      } catch {
        setProgress([]);
      }
    }
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

      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1>
          {examNumber}ª questão do ENEM {prova}
        </h1>
        <Button variant="outline" onClick={toggleGrid}>
          <Grid3x3 size={16} />
          Ir para questão...
        </Button>
      </header>

      {showGrid && (
        <Card>
          {progress === null ? (
            <p className="text-content-secondary">Carregando...</p>
          ) : (
            <div className="grid grid-cols-6 gap-2 min-[400px]:grid-cols-8 sm:grid-cols-12 md:grid-cols-[repeat(15,minmax(0,1fr))]">
              {progress.map((item) => (
                <button
                  key={item.examNumber}
                  onClick={() => goTo(item.examNumber)}
                  className={`flex h-10 w-full items-center justify-center rounded-button text-sm font-semibold transition-colors ${
                    item.examNumber === examNumber
                      ? 'bg-brand-orange text-white'
                      : item.isCorrect === true
                        ? 'bg-status-success/20 text-status-success hover:bg-status-success/30'
                        : item.isCorrect === false
                          ? 'bg-status-error/20 text-status-error hover:bg-status-error/30'
                          : 'bg-brand-background text-content-secondary hover:bg-white/10'
                  }`}
                >
                  {item.examNumber}
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {error && <Card>{error}</Card>}

      {!error && !question && <ListSkeleton rows={3} />}

      {question && (
        <Card>
          <div className="flex flex-col gap-3 text-content-secondary">
            {question.statement.split('\n').map((paragraph, ind) => (
              <p key={ind} className="text-left sm:text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {question.statementImage && (
            <img src={question.statementImage} alt="Imagem do enunciado" className="mt-4 max-w-full" />
          )}

          <AnswerPanel key={`${examYear}-${examNumber}`} question={question} />
        </Card>
      )}

      <div className="fixed bottom-3 right-3 flex gap-2 sm:bottom-8 sm:right-8">
        <Button variant="primary" disabled={examNumber <= 1} onClick={() => goTo(examNumber - 1)}>
          <ArrowLeft size={18} />
        </Button>
        <Button variant="primary" disabled={examNumber >= 180} onClick={() => goTo(examNumber + 1)}>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

const AnswerPanel = ({ question }: { question: EnemQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(question.myAttempt?.userAnswer ?? null);
  const [result, setResult] = useState<AnswerResult | null>(
    question.myAttempt
      ? {
          isCorrect: question.myAttempt.isCorrect,
          userAnswer: question.myAttempt.userAnswer,
          correctOption: question.correctOption,
          explanation: question.explanation,
        }
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alternatives: Record<AnswerOption, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
    E: question.optionE,
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await submitAnswer(question.id_question, selectedAnswer);
      setResult(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar sua resposta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSelectedAnswer(null);
    setError(null);
  };

  return (
    <>
      <ol className="mt-6 flex flex-col gap-2">
        {OPTION_LETTERS.map((letter) => {
          const content = alternatives[letter];
          const isImage = content.startsWith('http');
          const isSelected = selectedAnswer === letter;
          const isCorrectOption = result?.correctOption === letter;
          const isWrongPick = result != null && isSelected && !isCorrectOption;

          return (
            <li key={letter}>
              <button
                type="button"
                disabled={!!result}
                onClick={() => setSelectedAnswer(letter)}
                className={`flex w-full items-start gap-2 rounded-button border p-3 text-left text-content-secondary transition-colors ${
                  result
                    ? isCorrectOption
                      ? 'border-status-success bg-status-success/10'
                      : isWrongPick
                        ? 'border-status-error bg-status-error/10'
                        : 'border-transparent'
                    : isSelected
                      ? 'border-brand-orange bg-brand-orange/10'
                      : 'border-white/10 hover:border-white/30'
                } ${result ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="font-semibold">{letter})</span>
                {isImage ? (
                  <img src={content} alt={`Alternativa ${letter}`} className="max-w-full" />
                ) : (
                  <span>{content}</span>
                )}
                {result && isCorrectOption && <CheckCircle2 size={18} className="ml-auto shrink-0 text-status-success" />}
                {result && isWrongPick && <XCircle size={18} className="ml-auto shrink-0 text-status-error" />}
              </button>
            </li>
          );
        })}
      </ol>

      {error && <p className="mt-4 text-status-error">{error}</p>}

      <div className="mt-6">
        {!result ? (
          <Button variant="primary" disabled={!selectedAnswer || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Enviando...' : 'Responder'}
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className={`font-semibold ${result.isCorrect ? 'text-status-success' : 'text-status-error'}`}>
              {result.isCorrect ? 'Você acertou!' : 'Você errou.'} Resposta correta: alternativa {result.correctOption}
            </p>
            {result.explanation && <p className="text-content-secondary">{result.explanation}</p>}
            {!result.isCorrect && <MistakeExplainer questionId={question.id_question} />}
            <Button variant="outline" className="w-fit" onClick={handleRetry}>
              Responder novamente
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
