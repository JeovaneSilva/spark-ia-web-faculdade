import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import imgChatbot from '../../assets/imgs/svg/imgs/imgChatbot.svg';
import imgFlashcards from '../../assets/imgs/svg/imgs/imgFlashcards.svg';
import imgQuestoes from '../../assets/imgs/svg/imgs/imgQuestoes.svg';

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

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.to} className="flex flex-col items-center gap-3 text-center">
            <img src={item.img} alt={item.title} className="h-32 w-32 object-contain" />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <div className="h-px w-16 bg-brand-orange" />
            <p className="text-sm text-content-secondary">{item.text}</p>
            <Button variant="primary" className="mt-2" onClick={() => navigate(item.to)}>
              Estudar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
