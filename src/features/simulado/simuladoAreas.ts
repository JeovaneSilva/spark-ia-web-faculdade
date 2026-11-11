export type EnemArea = 'LINGUAGENS' | 'HUMANAS' | 'NATUREZA' | 'MATEMATICA';

// Numeração oficial: 1–45 Linguagens, 46–90 Humanas (dia 1);
// 91–135 Natureza, 136–180 Matemática (dia 2).
export function enemAreaOf(examNumber: number): EnemArea | null {
  if (!Number.isInteger(examNumber) || examNumber < 1 || examNumber > 180) return null;
  if (examNumber <= 45) return 'LINGUAGENS';
  if (examNumber <= 90) return 'HUMANAS';
  if (examNumber <= 135) return 'NATUREZA';
  return 'MATEMATICA';
}

export const AREA_LABELS: Record<EnemArea, string> = {
  LINGUAGENS: 'Linguagens e Códigos',
  HUMANAS: 'Ciências Humanas',
  NATUREZA: 'Ciências da Natureza',
  MATEMATICA: 'Matemática',
};

const AREA_ORDER: EnemArea[] = ['LINGUAGENS', 'HUMANAS', 'NATUREZA', 'MATEMATICA'];

export interface AreaScore {
  area: EnemArea;
  label: string;
  correct: number;
  total: number;
}

/**
 * Acertos por área. `total` conta as questões da prova naquela área (inclusive
 * as em branco); áreas sem questões na prova ficam de fora.
 */
export function scoreByArea(
  questions: { id_question: string; examNumber: number | null }[],
  correctIds: Set<string>,
): AreaScore[] {
  const scores = new Map<EnemArea, AreaScore>();
  for (const question of questions) {
    const area = question.examNumber == null ? null : enemAreaOf(question.examNumber);
    if (!area) continue;
    const score = scores.get(area) ?? { area, label: AREA_LABELS[area], correct: 0, total: 0 };
    score.total += 1;
    if (correctIds.has(question.id_question)) score.correct += 1;
    scores.set(area, score);
  }
  return AREA_ORDER.flatMap((area) => scores.get(area) ?? []);
}
