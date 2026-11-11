import { useState } from 'react';
import { CheckCircle2, Layers, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/useToast';
import { createFlashcard } from '../flashcards/flashcardsApi';
import { MistakeExplainer } from '../questions/MistakeExplainer';
import { submitAnswer, type AnswerOption, type AnswerResult } from '../questions/questionsApi';
import { requestFlashcardDraft, type FlashcardDraft, type GeneratedQuestion } from './chatbotApi';
import { findSubjectByValue } from '../../lib/subjects';
import { ApiError } from '../../lib/httpClient';

const OPTION_LETTERS: AnswerOption[] = ['A', 'B', 'C', 'D', 'E'];

export const ChatQuestionCard = ({ question }: { question: GeneratedQuestion }) => {
  const [selected, setSelected] = useState<AnswerOption | null>(question.myAttempt?.userAnswer ?? null);
  const [result, setResult] = useState<AnswerResult | null>(
    question.myAttempt
      ? {
          isCorrect: question.myAttempt.isCorrect,
          userAnswer: question.myAttempt.userAnswer,
          correctOption: question.correctOption,
          explanation: question.explanation,
        }
      : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [savedCard, setSavedCard] = useState<FlashcardDraft | null>(null);

  const alternatives: Record<AnswerOption, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
    E: question.optionE,
  };

  // A IA condensa a questão em pergunta curta + resposta objetiva (o enunciado
  // e as alternativas não viram flashcard).
  const handleSaveFlashcard = async () => {
    if (!result) return;
    setIsSavingCard(true);
    setError(null);
    try {
      const draft = await requestFlashcardDraft(question.id_question);
      await createFlashcard(draft);
      setSavedCard(draft);
      toast.success('Flashcard criado a partir da questão.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o flashcard.');
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await submitAnswer(question.id_question, selected);
      setResult(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar sua resposta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectLabel = question.subject ? findSubjectByValue(question.subject)?.label ?? question.subject : 'Questão gerada';

  return (
    <div className="flex flex-col gap-3 rounded-card border border-white/10 bg-brand-background/60 p-4">
      <span className="w-fit rounded-full bg-brand-cyan/10 px-3 py-1 text-xs font-semibold text-brand-cyan">
        {subjectLabel}
      </span>
      <p className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed text-content-primary">
        {question.statement}
      </p>
      {question.statementImage && (
        <img src={question.statementImage} alt="Imagem da questão" className="max-w-full rounded-input" />
      )}

      <ol className="flex flex-col gap-2">
        {OPTION_LETTERS.map((letter) => {
          const isCorrectOption = result?.correctOption === letter;
          const isWrongPick = result != null && selected === letter && !isCorrectOption;

          return (
            <li key={letter}>
              <button
                type="button"
                disabled={!!result}
                onClick={() => setSelected(letter)}
                className={`flex w-full items-start gap-2 rounded-input border p-2.5 text-left text-sm text-content-secondary transition-colors ${
                  result
                    ? isCorrectOption
                      ? 'border-status-success bg-status-success/10'
                      : isWrongPick
                        ? 'border-status-error bg-status-error/10'
                        : 'border-transparent'
                    : selected === letter
                      ? 'border-brand-orange bg-brand-orange/10'
                      : 'border-white/10 hover:border-white/30'
                } ${result ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className="shrink-0 font-semibold">{letter})</span>
                <span className="min-w-0 break-words">{alternatives[letter]}</span>
                {result && isCorrectOption && <CheckCircle2 size={16} className="ml-auto shrink-0 text-status-success" />}
                {result && isWrongPick && <XCircle size={16} className="ml-auto shrink-0 text-status-error" />}
              </button>
            </li>
          );
        })}
      </ol>

      {error && <p className="text-sm text-status-error">{error}</p>}

      {!result ? (
        <Button
          variant="primary"
          className="w-fit"
          disabled={!selected || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Enviando...' : 'Responder'}
        </Button>
      ) : (
        <div className="flex flex-col gap-1">
          <p className={`text-sm font-semibold ${result.isCorrect ? 'text-status-success' : 'text-status-error'}`}>
            {result.isCorrect ? 'Você acertou!' : 'Você errou.'} Resposta correta: alternativa {result.correctOption}
          </p>
          {result.explanation && (
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-content-secondary">
              {result.explanation}
            </p>
          )}
          {!result.isCorrect && <MistakeExplainer questionId={question.id_question} />}
          {question.subject && !savedCard && (
            <Button
              variant="outline"
              className="mt-2 w-fit px-4 py-2 text-sm"
              disabled={isSavingCard}
              onClick={handleSaveFlashcard}
            >
              <Layers size={16} />
              {isSavingCard ? 'Criando flashcard...' : 'Criar flashcard'}
            </Button>
          )}
          {savedCard && (
            <div className="mt-2 flex flex-col gap-1 rounded-input border border-status-success/40 bg-status-success/10 p-3 text-sm">
              <span className="flex items-center gap-2 font-semibold text-status-success">
                <CheckCircle2 size={16} />
                Flashcard criado
              </span>
              <p className="break-words font-medium">{savedCard.question}</p>
              <p className="break-words text-content-secondary">{savedCard.answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
