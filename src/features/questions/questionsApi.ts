import { apiRequest } from '../../lib/httpClient';
import { getToken } from '../../lib/tokenStorage';

export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';

export interface EnemQuestion {
  id_question: string;
  statement: string;
  statementImage: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctOption: AnswerOption;
  explanation: string | null;
  examYear: number;
  examNumber: number;
  myAttempt: { userAnswer: AnswerOption; isCorrect: boolean } | null;
}

export interface EnemProgressItem {
  examNumber: number;
  answered: boolean;
  isCorrect: boolean | null;
}

export interface AnswerResult {
  isCorrect: boolean;
  userAnswer: AnswerOption;
  correctOption: AnswerOption;
  explanation: string | null;
}

export async function listEnemYears(): Promise<number[]> {
  return apiRequest<number[]>('/questions/enem/years', {
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível carregar as provas do ENEM.',
  });
}

export async function getEnemQuestion(examYear: number, examNumber: number): Promise<EnemQuestion> {
  return apiRequest<EnemQuestion>(`/questions/enem/${examYear}/${examNumber}`, {
    token: getToken() ?? undefined,
    errorMessages: { 404: 'Questão não encontrada.' },
    fallbackErrorMessage: 'Não foi possível carregar a questão.',
  });
}

export async function getEnemProgress(examYear: number): Promise<EnemProgressItem[]> {
  return apiRequest<EnemProgressItem[]>(`/questions/enem/${examYear}/progress`, {
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível carregar o progresso da prova.',
  });
}

export async function submitAnswer(id_question: string, answer: AnswerOption): Promise<AnswerResult> {
  return apiRequest<AnswerResult>(`/questions/${id_question}/attempts`, {
    method: 'POST',
    body: { answer },
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível registrar sua resposta.',
  });
}
