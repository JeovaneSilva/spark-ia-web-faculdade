import { apiRequest } from '../../lib/httpClient';
import { getToken } from '../../lib/tokenStorage';
import type { AnswerOption } from '../questions/questionsApi';

export interface GeneratedQuestion {
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
  // Classificada pelo backend a partir do conteúdo enviado -- o usuário não escolhe mais.
  subject: string;
}

export interface GenerateQuestionsResult {
  session: { id_chatbot_session: string; requestedTopic: string };
  questions: GeneratedQuestion[];
}

export interface ChatbotSessionSummary {
  id_chatbot_session: string;
  requestedTopic: string;
  createdAt: string;
  questionsCount: number;
}

export async function listChatbotSessions(): Promise<ChatbotSessionSummary[]> {
  return apiRequest<ChatbotSessionSummary[]>('/chatbot/sessions', {
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível carregar as conversas salvas.',
  });
}

export async function renameChatbotSession(id: string, requestedTopic: string): Promise<ChatbotSessionSummary> {
  return apiRequest<ChatbotSessionSummary>(`/chatbot/sessions/${id}`, {
    method: 'PATCH',
    body: { requestedTopic },
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível salvar o nome da conversa.',
  });
}

export async function generateQuestions(content: string, quantity: number): Promise<GenerateQuestionsResult> {
  return apiRequest<GenerateQuestionsResult>('/chatbot/generate', {
    method: 'POST',
    body: { content, quantity },
    token: getToken() ?? undefined,
    errorMessages: {
      400: 'Não consegui usar esse conteúdo — confira se o link está certo ou tente colar o texto direto.',
      503: 'O gerador de questões está sobrecarregado no momento. Tente novamente em instantes.',
    },
    fallbackErrorMessage: 'Não foi possível gerar as questões agora. Tente novamente.',
  });
}
