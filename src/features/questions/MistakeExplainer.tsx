import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { requestMistakeExplanation } from '../chatbot/chatbotApi';
import { ApiError } from '../../lib/httpClient';

// Botão "Explique por que errei": o tutor (IA) analisa a alternativa marcada
// e o gabarito. Só deve ser renderizado depois de uma resposta errada.
export const MistakeExplainer = ({ questionId }: { questionId: string }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await requestMistakeExplanation(questionId);
      setExplanation(result.explanation);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível gerar a explicação agora.');
    } finally {
      setIsLoading(false);
    }
  };

  if (explanation) {
    return (
      <div className="flex flex-col gap-1 rounded-input border border-brand-cyan/30 bg-brand-cyan/5 p-3 text-sm">
        <span className="flex items-center gap-2 font-semibold text-brand-cyan">
          <GraduationCap size={16} />
          Por que você errou
        </span>
        <p className="whitespace-pre-wrap break-words leading-relaxed text-content-secondary">{explanation}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="w-fit px-4 py-2 text-sm" disabled={isLoading} onClick={handleExplain}>
        <GraduationCap size={16} />
        {isLoading ? 'Analisando sua resposta...' : 'Explique por que errei'}
      </Button>
      {error && <p className="text-sm text-status-error">{error}</p>}
    </div>
  );
};
