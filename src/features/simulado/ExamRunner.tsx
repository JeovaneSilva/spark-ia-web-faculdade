import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { ArrowLeft, ArrowRight, Flag, Timer } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/useToast';
import { exitFullscreenSafe, useFullscreenLock } from '../../hooks/useFullscreenLock';
import { ApiError } from '../../lib/httpClient';
import { findSubjectByValue } from '../../lib/subjects';
import type { AnswerOption } from '../questions/questionsApi';
import { useExamClock } from './examClock';
import { FullscreenGate } from './FullscreenGate';
import { submitSimulado, type SimuladoResult } from './simuladoApi';
import { MAX_FULLSCREEN_EXITS } from './simuladoConfig';
import { formatTime, optionsOf } from './simuladoUtils';
import { clearSimulado, saveSimulado, type SavedSimulado } from './simuladoStorage';

const LETTERS: AnswerOption[] = ['A', 'B', 'C', 'D', 'E'];
// Abaixo disso o cronômetro regressivo fica vermelho.
const LOW_TIME_SECONDS = 5 * 60;

export type AutoReason = 'time' | 'exits' | null;

export interface FinishedExam {
  result: SimuladoResult;
  seconds: number;
  exitCount: number;
  auto: AutoReason;
}

interface ExamRunnerProps {
  initial: SavedSimulado;
  onFinished: (finished: FinishedExam) => void;
  /** Prova encerrada sem nenhuma resposta (nada a corrigir). */
  onAbandoned: () => void;
}

const blockEvent = (event: SyntheticEvent) => event.preventDefault();

export const ExamRunner = ({ initial, onFinished, onAbandoned }: ExamRunnerProps) => {
  const { config, questions, startedAt, limitSeconds } = initial;
  const toast = useToast();

  const [answers, setAnswers] = useState(initial.answers);
  const [index, setIndex] = useState(Math.min(initial.index, questions.length - 1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);

  // Envia a prova. `auto` = disparo sem confirmação (tempo esgotado ou excesso de saídas).
  const finish = async (auto: AutoReason, exitCount: number, seconds: number) => {
    if (submitting.current) return;
    const entries = Object.entries(answers).map(([id_question, answer]) => ({ id_question, answer }));

    if (entries.length === 0) {
      if (!auto) {
        setError('Responda pelo menos uma questão para finalizar.');
        return;
      }
      clearSimulado();
      exitFullscreenSafe();
      toast.error('Prova encerrada sem respostas.');
      onAbandoned();
      return;
    }

    const unanswered = questions.length - entries.length;
    if (!auto && unanswered > 0 && !window.confirm(`Você deixou ${unanswered} questão(ões) em branco. Finalizar mesmo assim?`)) {
      return;
    }

    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitSimulado(entries, seconds, config.mode === 'enem' ? config.year : undefined);
      clearSimulado();
      exitFullscreenSafe();
      onFinished({ result, seconds, exitCount, auto });
    } catch (err) {
      submitting.current = false;
      setError(
        `${err instanceof ApiError ? err.message : 'Não foi possível corrigir a prova.'} Suas respostas continuam salvas: tente finalizar de novo.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const lock = useFullscreenLock({
    enabled: true,
    initialExits: initial.exitCount,
    limit: MAX_FULLSCREEN_EXITS,
    onLimit: () => void finish('exits', MAX_FULLSCREEN_EXITS, clock.elapsed),
  });

  const clock = useExamClock({
    startedAt,
    limitSeconds,
    onExpire: () => void finish('time', lock.exitCount, limitSeconds ?? clock.elapsed),
  });

  // Guarda o progresso: recarregar a página retoma de onde parou.
  useEffect(() => {
    saveSimulado({ ...initial, answers, index, exitCount: lock.exitCount });
  }, [initial, answers, index, lock.exitCount]);

  // Aviso do navegador ao tentar fechar/recarregar durante a prova.
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const question = questions[index];
  const options = optionsOf(question);
  const selected = answers[question.id_question];
  const answeredCount = Object.keys(answers).length;
  const labelOf = (position: number) => questions[position].examNumber ?? position + 1;
  const lowTime = clock.remaining != null && clock.remaining <= LOW_TIME_SECONDS;

  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-3 pb-28 select-none sm:p-6 sm:pb-28"
      onCopy={blockEvent}
      onCut={blockEvent}
      onPaste={blockEvent}
      onContextMenu={blockEvent}
    >
      {lock.isAway && (
        <FullscreenGate
          exitCount={lock.exitCount}
          limit={MAX_FULLSCREEN_EXITS}
          onReenter={() => void lock.reenter()}
        />
      )}

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>{config.mode === 'enem' ? `ENEM ${config.year}` : 'Simulado'}</h1>
          <p className="text-content-secondary">
            Questão {labelOf(index)} · {answeredCount} de {questions.length} respondida(s)
            {lock.exitCount > 0 ? ` · ${lock.exitCount}/${MAX_FULLSCREEN_EXITS} saídas` : ''}
          </p>
        </div>
        <span
          className={`flex items-center gap-2 rounded-full bg-brand-card px-4 py-2 font-mono text-lg ${
            lowTime ? 'text-status-error' : ''
          }`}
          aria-label={clock.remaining != null ? 'Tempo restante' : 'Tempo decorrido'}
        >
          <Timer size={18} className="text-brand-orange" />
          {formatTime(clock.remaining ?? clock.elapsed)}
        </span>
      </header>

      <div className="grid grid-cols-6 gap-2 min-[400px]:grid-cols-8 sm:grid-cols-10 md:grid-cols-[repeat(15,minmax(0,1fr))]">
        {questions.map((item, position) => (
          <button
            key={item.id_question}
            type="button"
            onClick={() => setIndex(position)}
            aria-label={`Ir para a questão ${labelOf(position)}`}
            aria-current={position === index}
            className={`h-10 w-full rounded-button text-sm font-semibold transition-colors ${
              position === index
                ? 'bg-brand-orange text-white'
                : answers[item.id_question]
                  ? 'bg-status-success/20 text-status-success'
                  : 'bg-brand-card text-content-secondary hover:bg-white/10'
            }`}
          >
            {labelOf(position)}
          </button>
        ))}
      </div>

      <Card>
        {question.subject && (
          <span className="mb-3 inline-block rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange">
            {findSubjectByValue(question.subject)?.label ?? question.subject}
          </span>
        )}
        <div className="flex flex-col gap-3 text-content-secondary">
          {question.statement.split('\n').map((paragraph, position) => (
            <p key={position} className="text-left sm:text-justify">
              {paragraph}
            </p>
          ))}
        </div>
        {question.statementImage && (
          <img src={question.statementImage} alt="Imagem do enunciado" className="mt-4 max-w-full" draggable={false} />
        )}

        <ol className="mt-6 flex flex-col gap-2">
          {LETTERS.map((letter) => {
            const content = options[letter];
            const isImage = content.startsWith('http');
            return (
              <li key={letter}>
                <button
                  type="button"
                  aria-pressed={selected === letter}
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id_question]: letter }))}
                  className={`flex w-full items-start gap-2 rounded-button border p-3 text-left text-content-secondary transition-colors ${
                    selected === letter ? 'border-brand-orange bg-brand-orange/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="font-semibold">{letter})</span>
                  {isImage ? (
                    <img src={content} alt={`Alternativa ${letter}`} className="max-w-full" draggable={false} />
                  ) : (
                    <span className="min-w-0 break-words">{content}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </Card>

      {error && (
        <p role="alert" className="text-status-error">
          {error}
        </p>
      )}

      <div className="fixed inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2 rounded-card bg-brand-sidebar p-3 shadow-card sm:inset-x-auto sm:right-8 sm:bottom-8 sm:gap-3">
        <Button variant="outline" className="px-3 sm:px-5" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        {index < questions.length - 1 && (
          <Button variant="outline" className="px-3 sm:px-5" onClick={() => setIndex(index + 1)}>
            <span className="hidden sm:inline">Próxima</span>
            <ArrowRight size={16} />
          </Button>
        )}
        <Button
          variant="primary"
          className="px-4 sm:px-6"
          disabled={isSubmitting}
          onClick={() => void finish(null, lock.exitCount, clock.elapsed)}
        >
          <Flag size={16} />
          {isSubmitting ? 'Corrigindo...' : 'Finalizar'}
        </Button>
      </div>
    </div>
  );
};
