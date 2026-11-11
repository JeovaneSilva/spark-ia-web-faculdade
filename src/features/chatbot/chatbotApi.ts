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
  subject: string | null;
  myAttempt?: { userAnswer: AnswerOption; isCorrect: boolean } | null;
}

export interface GenerateQuestionsResult {
  session: { id_chatbot_session: string; requestedTopic: string };
  questions: GeneratedQuestion[];
}

export interface ChatbotSessionSummary {
  id_chatbot_session: string;
  requestedTopic: string;
  inputContent: string | null;
  createdAt: string;
  questions: GeneratedQuestion[];
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

export async function deleteChatbotSession(id: string): Promise<void> {
  return apiRequest<void>(`/chatbot/sessions/${id}`, {
    method: 'DELETE',
    token: getToken() ?? undefined,
    fallbackErrorMessage: 'Não foi possível excluir a conversa.',
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

export interface FlashcardDraft {
  question: string;
  answer: string;
  subject: string;
}

// A IA condensa a questão em um cartão curto; quem salva é createFlashcard.
export async function requestFlashcardDraft(id_question: string): Promise<FlashcardDraft> {
  return apiRequest<FlashcardDraft>(`/chatbot/questions/${id_question}/flashcard`, {
    method: 'POST',
    token: getToken() ?? undefined,
    errorMessages: {
      503: 'O gerador está sobrecarregado no momento. Tente novamente em instantes.',
    },
    fallbackErrorMessage: 'Não foi possível criar o flashcard agora.',
  });
}

// Tutor: explica por que a última resposta do aluno nessa questão está errada.
export async function requestMistakeExplanation(id_question: string): Promise<{ explanation: string }> {
  return apiRequest<{ explanation: string }>(`/chatbot/questions/${id_question}/explain`, {
    method: 'POST',
    token: getToken() ?? undefined,
    errorMessages: {
      503: 'O tutor está sobrecarregado no momento. Tente novamente em instantes.',
    },
    fallbackErrorMessage: 'Não foi possível gerar a explicação agora.',
  });
}
