import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MistakeExplainer } from '../questions/MistakeExplainer';
import { scoreByArea } from './simuladoAreas';
import { formatTime, optionsOf } from './simuladoUtils';
import type { SimuladoConfig } from './simuladoConfig';
import type { SimuladoQuestion, SimuladoResult } from './simuladoApi';

interface SimuladoResultViewProps {
  config: SimuladoConfig;
  questions: SimuladoQuestion[];
  result: SimuladoResult;
  seconds: number;
  exitCount: number;
  /** Prova enviada sozinha (tempo esgotado ou excesso de saídas). */
  autoReason: 'time' | 'exits' | null;
}

export const SimuladoResultView = ({ config, questions, result, seconds, exitCount, autoReason }: SimuladoResultViewProps) => {
  const navigate = useNavigate();
  const byId = new Map(result.results.map((item) => [item.id_question, item]));
  const percent = Math.round((result.correct / questions.length) * 100);
  const blank = questions.length - result.total;
  const areas =
    config.mode === 'enem'
      ? scoreByArea(
          questions,
          new Set(result.results.filter((item) => item.isCorrect).map((item) => item.id_question)),
        )
      : [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-3 pb-16 sm:p-6">
      <Card>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1>{config.mode === 'enem' ? `ENEM ${config.year} concluído` : 'Simulado concluído'}</h1>
          {autoReason && (
            <p className="rounded-input bg-status-warning/15 px-3 py-2 text-sm text-content-secondary">
              {autoReason === 'time'
                ? 'O tempo acabou e a prova foi enviada automaticamente.'
                : 'A prova foi enviada automaticamente porque você saiu da tela cheia 3 vezes.'}
            </p>
          )}
          <p className="text-5xl font-bold">{percent}%</p>
          <p className="text-content-secondary">
            {result.correct} acertos em {questions.length} questões · {formatTime(seconds)}
            {blank > 0 ? ` · ${blank} em branco` : ''}
          </p>
          {exitCount > 0 && (
            <p className="text-sm text-content-secondary">
              Saídas da tela cheia: {exitCount}
            </p>
          )}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={() => navigate('/app/simulado')}>
              Novo simulado
            </Button>
            <Button variant="outline" onClick={() => navigate('/app')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </Card>

      {areas.length > 0 && (
        <Card title="Acertos por área">
          <ul className="flex flex-col gap-3">
            {areas.map((area) => {
              const areaPercent = Math.round((area.correct / area.total) * 100);
              return (
                <li key={area.area} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{area.label}</span>
                    <span className="shrink-0 text-content-secondary">
                      {area.correct}/{area.total} · {areaPercent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-brand-orange" style={{ width: `${areaPercent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-content-secondary">
            É a contagem de acertos, não a nota do ENEM: a nota oficial usa a Teoria de Resposta ao Item (TRI), que
            considera o peso de cada questão e não pode ser reproduzida aqui.
          </p>
        </Card>
      )}

      <h2>Correção</h2>
      <ul className="flex flex-col gap-4">
        {questions.map((question, position) => {
          const item = byId.get(question.id_question);
          const options = optionsOf(question);
          return (
            <li key={question.id_question}>
              <Card variant={item ? (item.isCorrect ? 'correct' : 'incorrect') : 'default'}>
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  {item?.isCorrect ? (
                    <CheckCircle2 size={18} className="text-status-success" />
                  ) : item ? (
                    <XCircle size={18} className="text-status-error" />
                  ) : null}
                  Questão {question.examNumber ?? position + 1}
                  {question.examYear ? ` · ENEM ${question.examYear}` : ''}
                </div>
                <p className="line-clamp-3 text-sm break-words text-content-secondary">{question.statement}</p>

                <div className="mt-3 flex flex-col gap-1 text-sm">
                  {item ? (
                    <>
                      <p>
                        Sua resposta: <span className="font-semibold">{item.userAnswer}</span>
                        {!item.isCorrect && (
                          <>
                            {' '}
                            · Gabarito: <span className="font-semibold text-status-success">{item.correctOption}</span>
                          </>
                        )}
                      </p>
                      {!item.isCorrect && (
                        <p className="break-words text-content-secondary">
                          {item.correctOption}) {options[item.correctOption]}
                        </p>
                      )}
                      {item.explanation && <p className="break-words text-content-secondary">{item.explanation}</p>}
                    </>
                  ) : (
                    <p className="text-content-secondary">Em branco.</p>
                  )}
                </div>

                {item && !item.isCorrect && (
                  <div className="mt-3">
                    <MistakeExplainer questionId={question.id_question} />
                  </div>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
