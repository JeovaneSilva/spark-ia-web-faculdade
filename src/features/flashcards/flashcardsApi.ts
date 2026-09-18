import { apiRequest } from '../../lib/httpClient';
import { getToken } from '../../lib/tokenStorage';

export type ReviewDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Flashcard {
  id_flashcard: string;
  id_user: string;
  question: string;
  questionImage: string | null;
  answer: string;
  answerImage: string | null;
  subject: string;
  topic: string | null;
  createdAt: string;
  updatedAt: string;
  lastReviewedAt: string | null;
}

export interface FlashcardInput {
  question?: string;
  questionImage?: string | null;
  answer?: string;
  answerImage?: string | null;
  subject: string;
  topic?: string;
}

function authHeaders() {
  return { token: getToken() ?? undefined };
}

export async function listFlashcards(subject?: string): Promise<Flashcard[]> {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return apiRequest<Flashcard[]>(`/flashcards${query}`, {
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível carregar os flashcards.',
  });
}

export async function getFlashcard(id: string): Promise<Flashcard> {
  return apiRequest<Flashcard>(`/flashcards/${id}`, {
    ...authHeaders(),
    errorMessages: { 404: 'Flashcard não encontrado.' },
    fallbackErrorMessage: 'Não foi possível carregar o flashcard.',
  });
}

export async function createFlashcard(data: FlashcardInput): Promise<Flashcard> {
  return apiRequest<Flashcard>('/flashcards', {
    method: 'POST',
    body: data,
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível criar o flashcard.',
  });
}

export async function updateFlashcard(id: string, data: Partial<FlashcardInput>): Promise<Flashcard> {
  return apiRequest<Flashcard>(`/flashcards/${id}`, {
    method: 'PATCH',
    body: data,
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível salvar o flashcard.',
  });
}

export async function deleteFlashcard(id: string): Promise<void> {
  await apiRequest<void>(`/flashcards/${id}`, {
    method: 'DELETE',
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível apagar o flashcard.',
  });
}

export async function reviewFlashcard(id: string, difficulty: ReviewDifficulty, isCorrect: boolean): Promise<void> {
  await apiRequest<void>(`/flashcards/${id}/review`, {
    method: 'POST',
    body: { difficulty, isCorrect },
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível registrar sua revisão.',
  });
}

export async function uploadFlashcardImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { url } = await apiRequest<{ url: string }>('/uploads/image', {
    method: 'POST',
    formData,
    ...authHeaders(),
    fallbackErrorMessage: 'Não foi possível enviar a imagem.',
  });
  return url;
}
