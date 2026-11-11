import { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { subjects } from '../../lib/subjects';
import { clampQuestionCount, DEFAULT_QUESTIONS, MAX_QUESTIONS, type SimuladoConfig } from './simuladoConfig';

const SHORTCUTS = [5, 10, 20, 30, 60, 90];

export const SimuladoCustomForm = ({ onStart }: { onStart: (config: SimuladoConfig) => void }) => {
  // Texto, não número: permite apagar o campo e digitar sem o valor "pular".
  const [countText, setCountText] = useState(String(DEFAULT_QUESTIONS));
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const count = clampQuestionCount(Number(countText));

  const toggle = (value: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      <Card title="Quantas questões?">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-content-secondary">Digite um valor de 1 a {MAX_QUESTIONS}</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QUESTIONS}
              value={countText}
              onChange={(event) => setCountText(event.target.value)}
              onBlur={() => setCountText(String(count))}
              className="w-full max-w-40 rounded-input border border-white/10 bg-brand-sidebar px-4 py-3 text-lg text-content-primary focus:border-brand-orange focus:outline-none"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Atalhos de quantidade">
            {SHORTCUTS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={count === option}
                onClick={() => setCountText(String(option))}
                className={`h-10 min-w-12 rounded-button border px-3 text-sm font-semibold transition-colors ${
                  count === option
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-white/10 text-content-secondary hover:border-white/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Disciplinas (opcional)">
        <p className="mb-3 text-sm text-content-secondary">
          Sem escolher nenhuma, o simulado mistura todas. Nem todas as provas têm as questões classificadas por
          disciplina; com filtro, o simulado pode ter menos questões do que o pedido.
        </p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => {
            const isOn = selected.has(subject.value);
            return (
              <button
                key={subject.value}
                type="button"
                aria-pressed={isOn}
                onClick={() => toggle(subject.value)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isOn
                    ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                    : 'border-white/10 text-content-secondary hover:border-white/30'
                }`}
              >
                {subject.label}
              </button>
            );
          })}
        </div>
      </Card>

      <div>
        <Button variant="primary" onClick={() => onStart({ mode: 'custom', count, subjects: [...selected] })}>
          <Play size={16} />
          Começar simulado ({count})
        </Button>
      </div>
    </div>
  );
};
