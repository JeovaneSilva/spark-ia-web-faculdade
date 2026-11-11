import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Layers, ListChecks, type LucideIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import imgChatbot from '../../assets/illustrations/imgChatbot.svg';
import imgFlashcards from '../../assets/illustrations/imgFlashcards.svg';
import imgQuestoes from '../../assets/illustrations/imgQuestoes.svg';
import { getStatsSummary, type StatsSummary } from './statsApi';
import { SubjectPerformance } from './SubjectPerformance';

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
  const [summary, setSummary] = useState<StatsSummary | null>(null);

  useEffect(() => {
    let active = true;
    // Sem estatísticas a tela continua útil: os cartões mostram zero.
    getStatsSummary()
      .then((data) => active && setSummary(data))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const stats: { icon: LucideIcon; label: string; value: number }[] = [
    { icon: Flame, label: 'Dias seguidos estudando', value: summary?.streakDays ?? 0 },
    { icon: Layers, label: 'Flashcards revisados hoje', value: summary?.reviewedToday ?? 0 },
    { icon: ListChecks, label: 'Questões respondidas', value: summary?.answeredQuestions ?? 0 },
  ];

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

      {summary && <SubjectPerformance items={summary.bySubject} />}

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.to} className="flex h-full flex-col items-center gap-3 text-center">
            <img src={item.img} alt={item.title} className="h-24 w-24 object-contain sm:h-32 sm:w-32" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="h-px w-16 bg-brand-orange" />
            <p className="text-sm text-content-secondary">{item.text}</p>
            <Button variant="primary" className="mt-auto" onClick={() => navigate(item.to)}>
              Estudar
            </Button>
          </Card>
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
