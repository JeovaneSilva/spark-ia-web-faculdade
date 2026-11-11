import type { AnswerOption } from '../questions/questionsApi';
import type { SimuladoQuestion } from './simuladoApi';

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const optionsOf = (question: SimuladoQuestion): Record<AnswerOption, string> => ({
  A: question.optionA,
  B: question.optionB,
  C: question.optionC,
  D: question.optionD,
  E: question.optionE,
});
