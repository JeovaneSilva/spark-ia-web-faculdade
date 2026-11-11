import { useEffect, useState } from 'react';
import { Clock, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { ApiError } from '../../lib/httpClient';
import { listEnemYears } from '../questions/questionsApi';
import { ENEM_DAYS, type EnemDay, type SimuladoConfig } from './simuladoConfig';

const DAYS: EnemDay[] = ['1', '2', 'completa'];

const formatLimit = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, '0')}`;
};

export const EnemExamForm = ({ onStart }: { onStart: (config: SimuladoConfig) => void }) => {
  const [years, setYears] = useState<number[] | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [day, setDay] = useState<EnemDay>('1');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listEnemYears()
      .then((list) => {
        setYears(list);
        setYear(list[0] ?? null);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Não foi possível carregar as provas.'));
  }, []);

  if (error) return <p className="text-status-error">{error}</p>;
  if (!years) return <ListSkeleton rows={3} />;

  return (
    <div className="flex flex-col gap-6">
      <Card title="Qual prova?">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-content-secondary">Aplicação do ENEM</span>
          <select
            value={year ?? ''}
            onChange={(event) => setYear(Number(event.target.value))}
            className="w-full max-w-48 rounded-input border border-white/10 bg-brand-sidebar px-4 py-3 text-content-primary focus:border-brand-orange focus:outline-none"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                ENEM {item}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <Card title="Qual parte?">
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Parte da prova">
          {DAYS.map((option) => {
            const info = ENEM_DAYS[option];
            const isOn = day === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isOn}
                onClick={() => setDay(option)}
                className={`flex flex-col gap-1 rounded-card border p-4 text-left transition-colors ${
                  isOn ? 'border-brand-orange bg-brand-orange/10' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <span className="font-semibold">{info.label}</span>
                <span className="text-sm text-content-secondary">{info.areas}</span>
                <span className="mt-1 flex items-center gap-1.5 text-sm">
                  <Clock size={14} className="text-brand-orange" />
                  {info.questions} questões · {formatLimit(info.limitMinutes)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-content-secondary">
          Questões na ordem oficial, com cronômetro regressivo: ao zerar, a prova é enviada sozinha. A redação não está
          incluída, e questões anuladas podem não estar no banco (a prova pode ter algumas a menos).
        </p>
      </Card>

      <div>
        <Button variant="primary" disabled={year == null} onClick={() => year != null && onStart({ mode: 'enem', year, day })}>
          <Play size={16} />
          Começar {ENEM_DAYS[day].label.toLowerCase()}
        </Button>
      </div>
    </div>
  );
};
