import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Layers, ListChecks, type LucideIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import imgChatbot from '../../assets/illustrations/imgChatbot.svg';
import imgFlashcards from '../../assets/illustrations/imgFlashcards.svg';
import imgQuestoes from '../../assets/illustrations/imgQuestoes.svg';
import { listFlashcards } from '../flashcards/flashcardsApi';
import { getEnemProgress, listEnemYears } from '../questions/questionsApi';

const defaultStats: { icon: LucideIcon; label: string; value: number }[] = [
  { icon: Flame, label: 'Dias seguidos estudando', value: 0 },
  { icon: Layers, label: 'Flashcards revisados hoje', value: 0 },
  { icon: ListChecks, label: 'Questões respondidas', value: 0 },
];

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const getStreakDays = (dates: Date[]) => {
  const uniqueDays = new Set(dates.map((date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`));

  if (uniqueDays.size === 0) return 0;

  const sortedDays = Array.from(uniqueDays)
    .map((value) => new Date(`${value}T12:00:00`))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let cursor = new Date();

  for (const day of sortedDays) {
    if (isSameDay(day, cursor)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    break;
  }

  return streak;
};

const items = [
  {
    to: '/app/chatbot',
    img: imgChatbot,
    title: 'Chatbot',
    text: 'Gere questões a partir de textos e links enviados por você, criando perguntas de múltipla escolha, verdadeiro ou falso e dissertativas.',
  },
  {
    to: '/app/flashcards',
    img: imgFlashcards,
    title: 'Flashcards',
    text: 'Crie ou receba sugestões de cartões para revisão, usando repetição espaçada para incentivar o estudo contínuo.',
  },
  {
    to: '/app/questoes',
    img: imgQuestoes,
    title: 'Banco de Questões',
    text: 'Responda questões do ENEM e confira as justificativas das respostas, ajudando no entendimento dos temas.',
  },
];

export const DashboardHomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [flashcards, years] = await Promise.all([
          listFlashcards(),
          listEnemYears().catch(() => []),
        ]);

        const reviewedDates = flashcards
          .map((flashcard) => flashcard.lastReviewedAt ? new Date(flashcard.lastReviewedAt) : null)
          .filter((date): date is Date => date instanceof Date && !Number.isNaN(date.getTime()));

        const reviewedToday = reviewedDates.filter((date) => isSameDay(date, new Date())).length;
        const streakDays = getStreakDays(reviewedDates);

        let answeredQuestions = 0;

        if (years.length > 0) {
          const progressByYear = await Promise.all(
            years.map(async (year) => {
              try {
                return await getEnemProgress(year);
              } catch {
                return [];
              }
            }),
          );

          answeredQuestions = progressByYear
            .flat()
            .filter((progress) => progress.answered)
            .length;
        }

        if (!active) return;

        setStats([
          { icon: Flame, label: 'Dias seguidos estudando', value: streakDays },
          { icon: Layers, label: 'Flashcards revisados hoje', value: reviewedToday },
          { icon: ListChecks, label: 'Questões respondidas', value: answeredQuestions },
        ]);
      } catch {
        if (!active) return;
        setStats(defaultStats);
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>Bem-vindo de volta</h1>
        <p className="text-content-secondary">Escolha por onde quer continuar seus estudos hoje.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <ScrollReveal key={item.to} delay={index * 100}>
            <Card className="flex h-full flex-col items-center gap-3 text-center">
              <img src={item.img} alt={item.title} className="h-32 w-32 object-contain" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <div className="h-px w-16 bg-brand-orange" />
              <p className="text-sm text-content-secondary">{item.text}</p>
              <Button variant="primary" className="mt-2" onClick={() => navigate(item.to)}>
                Estudar
              </Button>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ stat }: { stat: { icon: LucideIcon; label: string; value: number } }) => {
  const Icon = stat.icon;
  const value = useCountUp(stat.value);

  return (
    <Card className="flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-2xl font-bold text-content-primary">{value}</p>
        <p className="text-sm text-content-secondary">{stat.label}</p>
      </div>
    </Card>
  );
};
