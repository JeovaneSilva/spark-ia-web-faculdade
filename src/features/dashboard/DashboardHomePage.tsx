import { useNavigate } from 'react-router-dom';
import { Flame, Layers, ListChecks, type LucideIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import imgChatbot from '../../assets/illustrations/imgChatbot.svg';
import imgFlashcards from '../../assets/illustrations/imgFlashcards.svg';
import imgQuestoes from '../../assets/illustrations/imgQuestoes.svg';

const stats: { icon: LucideIcon; label: string; value: number }[] = [
  { icon: Flame, label: 'Dias seguidos estudando', value: 4 },
  { icon: Layers, label: 'Flashcards revisados hoje', value: 12 },
  { icon: ListChecks, label: 'Questões respondidas na semana', value: 27 },
];

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
