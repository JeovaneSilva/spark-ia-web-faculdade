import { describe, expect, it } from 'vitest';
import { exportFlashcardsCsv, parseFlashcardsCsv } from './flashcardsCsv';
import type { Flashcard } from './flashcardsApi';

const card = (overrides: Partial<Flashcard>): Flashcard => ({
  id_flashcard: '1',
  id_user: 'u',
  question: 'Pergunta',
  questionImage: null,
  answer: 'Resposta',
  answerImage: null,
  subject: 'MATEMATICA',
  topic: null,
  createdAt: '',
  updatedAt: '',
  lastReviewedAt: null,
  ...overrides,
});

describe('flashcardsCsv', () => {
  it('exporta e importa de volta sem perder nada (aspas, ; e quebra de linha)', () => {
    const original = [
      card({ question: 'Quem disse "penso, logo existo"?', answer: 'Descartes;\nem 1637', subject: 'FILOSOFIA', topic: 'Racionalismo' }),
      card({ question: 'Área do círculo?', answer: 'π · r²', subject: 'MATEMATICA' }),
    ];

    const { cards, errors } = parseFlashcardsCsv(exportFlashcardsCsv(original));

    expect(errors).toEqual([]);
    expect(cards).toEqual([
      { question: 'Quem disse "penso, logo existo"?', answer: 'Descartes;\nem 1637', subject: 'FILOSOFIA', topic: 'Racionalismo' },
      { question: 'Área do círculo?', answer: 'π · r²', subject: 'MATEMATICA' },
    ]);
  });

  it('aceita vírgula como separador e disciplina sem acento/maiúscula', () => {
    const { cards, errors } = parseFlashcardsCsv('pergunta,resposta,disciplina\nQ1,R1,matematica\nQ2,R2,FÍSICA');
    expect(errors).toEqual([]);
    expect(cards.map((c) => c.subject)).toEqual(['MATEMATICA', 'FISICA']);
  });

  it('ignora linhas inválidas e informa o número da linha', () => {
    const { cards, errors } = parseFlashcardsCsv(
      'pergunta;resposta;disciplina\nQ1;R1;Matemática\nQ2;;Matemática\nQ3;R3;Culinária',
    );
    expect(cards).toHaveLength(1);
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('Linha 3');
    expect(errors[1]).toContain('Linha 4');
  });

  it('rejeita arquivo sem as colunas obrigatórias', () => {
    const { cards, errors } = parseFlashcardsCsv('a;b;c\n1;2;3');
    expect(cards).toEqual([]);
    expect(errors[0]).toContain('pergunta');
  });

  it('arquivo vazio vira erro, não exceção', () => {
    expect(parseFlashcardsCsv('').errors).toEqual(['O arquivo está vazio.']);
  });
});
