import { describe, expect, it } from 'vitest';
import { elapsedSeconds, remainingSeconds } from './examClock';
import { enemAreaOf, scoreByArea } from './simuladoAreas';
import {
  ENEM_DAYS,
  clampQuestionCount,
  configToSearch,
  limitSecondsFor,
  parseConfig,
  type SimuladoConfig,
} from './simuladoConfig';

describe('clampQuestionCount', () => {
  it('mantém valores válidos e trunca decimais', () => {
    expect(clampQuestionCount(45)).toBe(45);
    expect(clampQuestionCount(12.9)).toBe(12);
  });

  it('limita entre 1 e 180', () => {
    expect(clampQuestionCount(0)).toBe(1);
    expect(clampQuestionCount(-5)).toBe(1);
    expect(clampQuestionCount(500)).toBe(180);
  });

  it('valor inválido (campo vazio) vira o padrão', () => {
    expect(clampQuestionCount(Number(''))).toBe(1); // campo vazio → 0 → mínimo
    expect(clampQuestionCount(NaN)).toBe(10);
  });
});

describe('configuração da prova', () => {
  it('ida e volta pela URL (personalizado)', () => {
    const config: SimuladoConfig = { mode: 'custom', count: 45, subjects: ['MATEMATICA', 'FISICA'] };
    expect(parseConfig(new URLSearchParams(configToSearch(config)))).toEqual(config);
  });

  it('ida e volta pela URL (prova oficial)', () => {
    const config: SimuladoConfig = { mode: 'enem', year: 2023, day: '2' };
    expect(parseConfig(new URLSearchParams(configToSearch(config)))).toEqual(config);
  });

  it('URL incompleta ou inválida vira null', () => {
    expect(parseConfig(new URLSearchParams(''))).toBeNull();
    expect(parseConfig(new URLSearchParams('modo=enem&ano=2023&dia=3'))).toBeNull();
    expect(parseConfig(new URLSearchParams('modo=enem&ano=abc&dia=1'))).toBeNull();
  });

  it('tempo oficial: 5h30, 5h e 10h30; personalizado não tem limite', () => {
    expect(limitSecondsFor({ mode: 'enem', year: 2023, day: '1' })).toBe(330 * 60);
    expect(limitSecondsFor({ mode: 'enem', year: 2023, day: '2' })).toBe(300 * 60);
    expect(limitSecondsFor({ mode: 'enem', year: 2023, day: 'completa' })).toBe(630 * 60);
    expect(limitSecondsFor({ mode: 'custom', count: 10, subjects: [] })).toBeNull();
    expect(ENEM_DAYS.completa.limitMinutes).toBe(ENEM_DAYS['1'].limitMinutes + ENEM_DAYS['2'].limitMinutes);
  });
});

describe('áreas do ENEM', () => {
  it.each([
    [1, 'LINGUAGENS'],
    [45, 'LINGUAGENS'],
    [46, 'HUMANAS'],
    [90, 'HUMANAS'],
    [91, 'NATUREZA'],
    [135, 'NATUREZA'],
    [136, 'MATEMATICA'],
    [180, 'MATEMATICA'],
  ] as const)('questão %i é %s', (number, area) => {
    expect(enemAreaOf(number)).toBe(area);
  });

  it('fora do intervalo não tem área', () => {
    expect(enemAreaOf(0)).toBeNull();
    expect(enemAreaOf(181)).toBeNull();
  });

  it('soma acertos por área (em branco conta no total) e omite áreas ausentes', () => {
    const questions = [
      { id_question: 'a', examNumber: 1 },
      { id_question: 'b', examNumber: 2 },
      { id_question: 'c', examNumber: 50 },
    ];
    const scores = scoreByArea(questions, new Set(['a', 'c']));
    expect(scores).toEqual([
      { area: 'LINGUAGENS', label: 'Linguagens e Códigos', correct: 1, total: 2 },
      { area: 'HUMANAS', label: 'Ciências Humanas', correct: 1, total: 1 },
    ]);
  });
});

describe('relógio da prova', () => {
  const start = 1_000_000;

  it('conta segundos decorridos e nunca fica negativo', () => {
    expect(elapsedSeconds(start, start + 65_000)).toBe(65);
    expect(elapsedSeconds(start, start - 5_000)).toBe(0);
  });

  it('tempo restante regressivo, parando em zero; sem limite = null', () => {
    expect(remainingSeconds(start, start + 60_000, 330 * 60)).toBe(330 * 60 - 60);
    expect(remainingSeconds(start, start + 999_999_999, 100)).toBe(0);
    expect(remainingSeconds(start, start + 60_000, null)).toBeNull();
  });
});
