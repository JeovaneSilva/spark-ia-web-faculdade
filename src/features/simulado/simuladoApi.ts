import { apiRequest } from '../../lib/httpClient';
import { getToken } from '../../lib/tokenStorage';
import type { AnswerOption } from '../questions/questionsApi';

// A API sorteia as questões SEM gabarito; a correção só vem no envio.
export interface SimuladoQuestion {
  id_question: string;
  statement: string;
  statementImage: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  subject: string | null;
  examYear: number | null;
  examNumber: number | null;
}

export interface SimuladoResultItem {
  id_question: string;
  userAnswer: AnswerOption;
  isCorrect: boolean;
  correctOption: AnswerOption;
  explanation: string | null;
}

export interface SimuladoResult {
  total: number;
  correct: number;
  results: SimuladoResultItem[];
}

export async function fetchSimulado(count: number, subjects: string[]): Promise<SimuladoQuestion[]> {
  const params = new URLSearchParams({ count: String(count) });
  if (subjects.length > 0) params.set('subjects', subjects.join(','));
  return apiRequest<SimuladoQuestion[]>(`/questions/simulado?${params}`, {
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível montar o simulado.',
  });
}

// Prova oficial do ano, na ordem original e sem gabarito.
export async function fetchEnemExam(year: number, day: '1' | '2' | 'completa'): Promise<SimuladoQuestion[]> {
  return apiRequest<SimuladoQuestion[]>(`/questions/simulado/enem?ano=${year}&dia=${day}`, {
    token: getToken() ?? undefined,
    errorMessages: { 404: 'Não há questões cadastradas para essa prova.' },
    fallbackErrorMessage: 'Não foi possível carregar a prova.',
  });
}

export async function submitSimulado(
  answers: { id_question: string; answer: AnswerOption }[],
  durationSeconds: number,
  examYear?: number,
): Promise<SimuladoResult> {
  return apiRequest<SimuladoResult>('/questions/simulado/submit', {
    method: 'POST',
    body: { answers, durationSeconds, ...(examYear ? { examYear } : {}) },
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível corrigir o simulado.',
  });
}
