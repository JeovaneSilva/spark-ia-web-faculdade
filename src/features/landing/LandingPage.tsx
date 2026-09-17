import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionFade } from '../../components/ui/SectionFade';
import { Header } from './Header';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { FeaturesScrollytelling } from './FeaturesScrollytelling';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutSection } from './AboutSection';
import { useWindowScrollY } from '../../hooks/useWindowScrollY';
import imgChatbot from '../../assets/illustrations/imgChatbot.svg';
import imgFlashcards from '../../assets/illustrations/imgFlashcards.svg';
import imgQuestoes from '../../assets/illustrations/imgQuestoes.svg';

const features = [
  {
    img: imgQuestoes,
    title: 'Banco de questões',
    text: 'O Spark.ia oferece um amplo banco de questões do ENEM, cobrindo todas as áreas do exame. Responda, confira o gabarito e entenda a justificativa de cada item.',
    highlights: ['Todas as áreas do ENEM', 'Gabarito comentado'],
  },
  {
    img: imgChatbot,
    title: 'Chatbot',
    text: 'Gere questões a partir de textos e links enviados por você. O chatbot analisa o conteúdo, extrai os tópicos principais e cria perguntas de múltipla escolha, verdadeiro/falso e dissertativas.',
    highlights: ['A partir de texto ou link', 'Múltipla escolha, V/F e dissertativas'],
  },
  {
    img: imgFlashcards,
    title: 'Flashcards',
    text: 'Crie cartões manualmente ou receba sugestões baseadas no que você estuda. A revisão usa repetição espaçada e gamificação para incentivar o uso regular.',
    highlights: ['Repetição espaçada', 'Gamificação do estudo'],
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const scrollY = useWindowScrollY();

  const goToChatbot = () => navigate('/app/chatbot');
  const scrollToFeatures = () =>
    document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen w-full bg-brand-background text-content-primary">
      <Header />

      <main className="w-full pt-20 md:pt-24">
        <Hero scrollY={scrollY} onPrimaryCta={goToChatbot} onSecondaryCta={scrollToFeatures} />

        <section id="funcionalidades" className="relative w-full bg-brand-sidebar px-6 py-16 md:px-12">
          <SectionFade fromClass="from-brand-background" />

          <div className="relative z-10">
            <ScrollReveal>
              <h2 className="text-center text-3xl font-bold text-content-primary md:text-4xl">
                Funcionalidades
              </h2>
              <hr className="mx-auto mb-10 mt-3 w-48 rounded-lg border-t-2 border-brand-orange" />
            </ScrollReveal>

            <FeaturesScrollytelling features={features} />

            <ScrollReveal className="mt-16 text-center" delay={100}>
              <h3 className="mb-4 text-xl font-bold">
                Experimente o Spark.ia e transforme seus estudos!
              </h3>
              <Button variant="primary" className="mx-auto" onClick={goToChatbot}>Começar agora mesmo!</Button>
            </ScrollReveal>
          </div>
        </section>

        <HowItWorksSection />

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
};
