export const MAX_QUESTIONS = 180;
export const DEFAULT_QUESTIONS = 10;
export const MAX_FULLSCREEN_EXITS = 3;

export type EnemDay = '1' | '2' | 'completa';

// Tempos oficiais do ENEM (INEP): dia 1 = 5h30, dia 2 = 5h; "completa" soma os dois.
export const ENEM_DAYS: Record<EnemDay, { label: string; questions: number; areas: string; limitMinutes: number }> = {
  '1': { label: 'Dia 1', questions: 90, areas: 'Linguagens e Ciências Humanas', limitMinutes: 330 },
  '2': { label: 'Dia 2', questions: 90, areas: 'Ciências da Natureza e Matemática', limitMinutes: 300 },
  completa: { label: 'Prova completa', questions: 180, areas: 'Os dois dias', limitMinutes: 630 },
};

export type SimuladoConfig =
  | { mode: 'custom'; count: number; subjects: string[] }
  | { mode: 'enem'; year: number; day: EnemDay };

/** Mantém o número de questões entre 1 e o máximo; valor inválido vira o padrão. */
export function clampQuestionCount(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_QUESTIONS;
  return Math.min(MAX_QUESTIONS, Math.max(1, Math.trunc(value)));
}

/** Tempo limite em segundos; null = sem limite (simulado personalizado). */
export function limitSecondsFor(config: SimuladoConfig): number | null {
  return config.mode === 'enem' ? ENEM_DAYS[config.day].limitMinutes * 60 : null;
}

export function configToSearch(config: SimuladoConfig): string {
  const params = new URLSearchParams();
  if (config.mode === 'custom') {
    params.set('modo', 'custom');
    params.set('count', String(config.count));
    if (config.subjects.length > 0) params.set('disciplinas', config.subjects.join(','));
  } else {
    params.set('modo', 'enem');
    params.set('ano', String(config.year));
    params.set('dia', config.day);
  }
  return params.toString();
}

/** Lê a configuração da URL; null se estiver incompleta ou inválida. */
export function parseConfig(params: URLSearchParams): SimuladoConfig | null {
  if (params.get('modo') === 'enem') {
    const year = Number(params.get('ano'));
    const day = params.get('dia');
    if (!Number.isInteger(year) || (day !== '1' && day !== '2' && day !== 'completa')) return null;
    return { mode: 'enem', year, day };
  }
  if (params.get('modo') === 'custom') {
    return {
      mode: 'custom',
      count: clampQuestionCount(Number(params.get('count'))),
      subjects: (params.get('disciplinas') ?? '').split(',').filter(Boolean),
    };
  }
  return null;
}
