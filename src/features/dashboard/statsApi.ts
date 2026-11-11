import { apiRequest } from '../../lib/httpClient';
import { getToken } from '../../lib/tokenStorage';

export interface SubjectPerformanceItem {
  subject: string;
  correct: number;
  total: number;
}

export interface StatsSummary {
  streakDays: number;
  reviewedToday: number;
  answeredQuestions: number;
  bySubject: SubjectPerformanceItem[];
}

// tzOffset: a API usa o fuso do navegador para decidir o que é "hoje".
export async function getStatsSummary(): Promise<StatsSummary> {
  return apiRequest<StatsSummary>(`/stats/summary?tzOffset=${new Date().getTimezoneOffset()}`, {
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível carregar suas estatísticas.',
  });
}
