import type { AnswerOption } from '../questions/questionsApi';
import type { SimuladoConfig } from './simuladoConfig';
import type { SimuladoQuestion } from './simuladoApi';

const STORAGE_KEY = 'spark-simulado-em-andamento';
// Prova abandonada há mais que isso (a mais longa dura 10h30) não é retomada.
const MAX_AGE_MS = 14 * 60 * 60 * 1000;

export interface SavedSimulado {
  config: SimuladoConfig;
  questions: SimuladoQuestion[];
  answers: Record<string, AnswerOption>;
  startedAt: number;
  limitSeconds: number | null;
  exitCount: number;
  index: number;
}

// Guarda a prova em andamento para sobreviver a recarregar a página (e para o
// simulado aleatório não sortear outras questões). Tudo em try/catch: com o
// armazenamento bloqueado ou cheio a prova segue, só não é retomável.
export function loadSimulado(): SavedSimulado | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SavedSimulado;
    if (!Array.isArray(saved.questions) || Date.now() - saved.startedAt > MAX_AGE_MS) {
      clearSimulado();
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

export function saveSimulado(state: SavedSimulado): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sem espaço ou bloqueado: segue sem retomada
  }
}

export function clearSimulado(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // nada a limpar
  }
}
