import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { exitFullscreenSafe } from '../../hooks/useFullscreenLock';
import { ApiError } from '../../lib/httpClient';
import { ExamRunner, type FinishedExam } from './ExamRunner';
import { fetchEnemExam, fetchSimulado } from './simuladoApi';
import { limitSecondsFor, parseConfig } from './simuladoConfig';
import { SimuladoResultView } from './SimuladoResultView';
import { loadSimulado, saveSimulado, type SavedSimulado } from './simuladoStorage';

// Fora do layout do painel (ver App.tsx): na tela cheia não há menu nem links.
// Esta página só carrega (ou retoma) a prova e, no fim, mostra o resultado;
// a prova em si roda no ExamRunner.
export const SimuladoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Prova em andamento (recarregou a página): retoma com as mesmas questões.
  const [initial, setInitial] = useState<SavedSimulado | null>(() => loadSimulado());
  const [finished, setFinished] = useState<FinishedExam | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;

    const config = parseConfig(searchParams);
    if (!config) {
      navigate('/app/simulado', { replace: true });
      return;
    }

    const request =
      config.mode === 'enem' ? fetchEnemExam(config.year, config.day) : fetchSimulado(config.count, config.subjects);

    request
      .then((questions) => {
        if (cancelled) return;
        if (questions.length === 0) {
          setEmpty(true);
          return;
        }
        const fresh: SavedSimulado = {
          config,
          questions,
          answers: {},
          startedAt: Date.now(),
          limitSeconds: limitSecondsFor(config),
          exitCount: 0,
          index: 0,
        };
        saveSimulado(fresh);
        setInitial(fresh);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Não foi possível montar o simulado.');
      });

    return () => {
      cancelled = true;
    };
  }, [initial, searchParams, navigate]);

  const backToSetup = () => {
    exitFullscreenSafe();
    navigate('/app/simulado');
  };

  if (error || empty) {
    return (
      <div className="mx-auto w-full max-w-4xl p-3 sm:p-6">
        <Card>
          <p className={error ? 'text-status-error' : 'text-content-secondary'}>
            {error ?? 'Nenhuma questão encontrada para essa combinação. Tente menos filtros.'}
          </p>
          <Button variant="primary" className="mt-4" onClick={backToSetup}>
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="mx-auto w-full max-w-4xl p-3 sm:p-6">
        <ListSkeleton rows={4} />
      </div>
    );
  }

  if (finished) {
    return (
      <SimuladoResultView
        config={initial.config}
        questions={initial.questions}
        result={finished.result}
        seconds={finished.seconds}
        exitCount={finished.exitCount}
        autoReason={finished.auto}
      />
    );
  }

  return <ExamRunner initial={initial} onFinished={setFinished} onAbandoned={backToSetup} />;
};
