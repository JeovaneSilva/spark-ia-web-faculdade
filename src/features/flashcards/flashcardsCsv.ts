import { subjects } from '../../lib/subjects';
import type { Flashcard, FlashcardInput } from './flashcardsApi';

// Separador ";" e BOM UTF-8: é o que o Excel em português abre sem bagunçar
// acentos nem colunas.
const EXPORT_DELIMITER = ';';
const BOM = String.fromCharCode(0xfeff);
export const MAX_IMPORT_ROWS = 200;

export interface CsvImportResult {
  cards: FlashcardInput[];
  /** Linhas ignoradas, com o motivo (número da linha no arquivo). */
  errors: string[];
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

const escapeField = (value: string) =>
  /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export function exportFlashcardsCsv(cards: Flashcard[]): string {
  const lines = [['pergunta', 'resposta', 'disciplina', 'tema']].concat(
    cards.map((card) => [
      card.question,
      card.answer,
      subjects.find((s) => s.value === card.subject)?.label ?? card.subject,
      card.topic ?? '',
    ]),
  );
  return BOM + lines.map((line) => line.map(escapeField).join(EXPORT_DELIMITER)).join('\r\n');
}

function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((line) => line.some((cell) => cell.trim() !== ''));
}

const COLUMN_ALIASES: Record<'question' | 'answer' | 'subject' | 'topic', string[]> = {
  question: ['pergunta', 'frente', 'question'],
  answer: ['resposta', 'verso', 'answer'],
  subject: ['disciplina', 'materia', 'subject'],
  topic: ['tema', 'assunto', 'topic'],
};

function findSubjectValue(raw: string): string | undefined {
  const wanted = normalize(raw);
  return subjects.find(
    (s) => normalize(s.label) === wanted || s.slug === wanted || normalize(s.value) === wanted,
  )?.value;
}

/**
 * Lê um CSV (";" ou ",") com colunas pergunta, resposta, disciplina e,
 * opcionalmente, tema. Linhas inválidas viram erros em vez de derrubar tudo.
 */
export function parseFlashcardsCsv(rawText: string): CsvImportResult {
  const text = rawText.startsWith(BOM) ? rawText.slice(1) : rawText;
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = (firstLine.match(/;/g)?.length ?? 0) >= (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';

  const rows = parseCsv(text, delimiter);
  if (rows.length === 0) return { cards: [], errors: ['O arquivo está vazio.'] };

  const header = rows[0].map(normalize);
  const indexOf = (key: keyof typeof COLUMN_ALIASES) =>
    header.findIndex((name) => COLUMN_ALIASES[key].includes(name));
  const columns = {
    question: indexOf('question'),
    answer: indexOf('answer'),
    subject: indexOf('subject'),
    topic: indexOf('topic'),
  };

  if (columns.question < 0 || columns.answer < 0 || columns.subject < 0) {
    return {
      cards: [],
      errors: ['A primeira linha precisa ter as colunas: pergunta, resposta e disciplina (tema é opcional).'],
    };
  }

  const cards: FlashcardInput[] = [];
  const errors: string[] = [];

  rows.slice(1).forEach((row, index) => {
    const line = index + 2;
    const question = (row[columns.question] ?? '').trim();
    const answer = (row[columns.answer] ?? '').trim();
    const subject = findSubjectValue(row[columns.subject] ?? '');
    const topic = columns.topic >= 0 ? (row[columns.topic] ?? '').trim() : '';

    if (!question || !answer) {
      errors.push(`Linha ${line}: pergunta e resposta são obrigatórias.`);
    } else if (!subject) {
      errors.push(`Linha ${line}: disciplina "${row[columns.subject] ?? ''}" não reconhecida.`);
    } else if (cards.length >= MAX_IMPORT_ROWS) {
      errors.push(`Linha ${line}: limite de ${MAX_IMPORT_ROWS} cartões por importação.`);
    } else {
      cards.push({ question, answer, subject, ...(topic ? { topic } : {}) });
    }
  });

  return { cards, errors };
}
