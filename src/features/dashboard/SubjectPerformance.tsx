import { Card } from '../../components/ui/Card';
import { findSubjectByValue } from '../../lib/subjects';
import type { SubjectPerformanceItem } from './statsApi';

// Abaixo disso (com amostra mínima) a disciplina entra como "ponto fraco".
const WEAK_ACCURACY = 60;
const MIN_ATTEMPTS_FOR_WEAK = 3;
const MAX_ROWS = 6;

const barColor = (percent: number) =>
  percent >= 75 ? 'bg-status-success' : percent >= WEAK_ACCURACY ? 'bg-status-warning' : 'bg-status-error';

export const SubjectPerformance = ({ items }: { items: SubjectPerformanceItem[] }) => {
  const rows = items.slice(0, MAX_ROWS).map((item) => ({
    ...item,
    label: findSubjectByValue(item.subject)?.label ?? item.subject,
    percent: Math.round((item.correct / item.total) * 100),
  }));

  const weakest = rows
    .filter((row) => row.total >= MIN_ATTEMPTS_FOR_WEAK && row.percent < WEAK_ACCURACY)
    .sort((a, b) => a.percent - b.percent)[0];

  return (
    <Card title="Desempenho por disciplina">
      {rows.length === 0 ? (
        <p className="text-sm text-content-secondary">
          Responda questões ou revise flashcards para acompanhar seu desempenho por disciplina.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {rows.map((row) => (
              <li key={row.subject} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">{row.label}</span>
                  <span className="shrink-0 text-content-secondary">
                    {row.correct}/{row.total} acertos · {row.percent}%
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuenow={row.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Acertos em ${row.label}`}
                >
                  <div className={`h-full rounded-full ${barColor(row.percent)}`} style={{ width: `${row.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>

          {weakest && (
            <p className="rounded-input bg-status-error/10 px-3 py-2 text-sm text-content-secondary">
              Ponto fraco: <span className="font-semibold text-content-primary">{weakest.label}</span> ({weakest.percent}% de
              acerto). Vale revisar essa disciplina.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
