import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../assets/css/Swiper.css';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Header } from './Header';
import { Footer } from './Footer';
import { members } from './members';
import imgLandingPage from '../../assets/imgs/svg/imgs/imgLandingPage.svg';
import imgChatbot from '../../assets/imgs/svg/imgs/imgChatbot.svg';
import imgFlashcards from '../../assets/imgs/svg/imgs/imgFlashcards.svg';
import imgQuestoes from '../../assets/imgs/svg/imgs/imgQuestoes.svg';

const features = [
  {
    img: imgQuestoes,
    title: 'Banco de questões',
    text: 'O Spark.ia oferece um amplo banco de questões do ENEM, cobrindo todas as áreas do exame. Responda, confira o gabarito e entenda a justificativa de cada item.',
  },
  {
    img: imgChatbot,
    title: 'Chatbot',
    text: 'Gere questões a partir de textos e links enviados por você. O chatbot analisa o conteúdo, extrai os tópicos principais e cria perguntas de múltipla escolha, verdadeiro/falso e dissertativas.',
  },
  {
    img: imgFlashcards,
    title: 'Flashcards',
    text: 'Crie cartões manualmente ou receba sugestões baseadas no que você estuda. A revisão usa repetição espaçada e gamificação para incentivar o uso regular.',
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  const goToChatbot = () => navigate('/app/chatbot');

  return (
    <div className="min-h-screen w-full bg-brand-background text-content-primary">
      <Header />

      <main className="w-full pt-20 md:pt-24">
        <section
          id="inicio"
          className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 px-6 py-16 md:flex-row md:px-12 md:py-24"
        >
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-brand-orange md:text-5xl">Spark.ia</h1>
            <h2 className="mt-2 text-2xl font-bold md:text-4xl">
              Seu Assistente Inteligente para Preparação no ENEM
            </h2>
            <p className="mt-4 mb-6 text-lg text-content-secondary">
              Transforme Textos e Links em Questões de Prova em Segundos
            </p>
            <Button variant="primary" className="px-10" onClick={goToChatbot}>
              Experimentar agora!
            </Button>
          </div>

          <div className="flex items-center justify-center md:w-2/5">
            <img src={imgLandingPage} alt="Ilustração do chatbot Spark.ia" className="w-full max-w-sm" />
          </div>
        </section>

        <section id="funcionalidades" className="w-full bg-brand-sidebar px-6 py-16 md:px-12">
          <h2 className="text-center text-3xl font-bold text-content-primary md:text-4xl">
            Funcionalidades
          </h2>
          <hr className="mx-auto mb-10 mt-3 w-48 rounded-lg border-t-2 border-brand-orange" />

          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <div className="flex flex-col items-center gap-4 text-center">
                  <img src={feature.img} alt={feature.title} className="h-28 w-28 object-contain" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-content-secondary">{feature.text}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="mb-4 text-xl font-bold">
              Experimente o Spark.ia e transforme seus estudos!
            </h3>
            <Button variant="primary" className="mx-auto" onClick={goToChatbot}>Começar agora mesmo!</Button>
          </div>
        </section>

        <section id="sobreNos" className="p-6 md:w-full">
          <h2 className="text-center text-[40px] font-bold text-content-primary">Sobre nós</h2>
          <hr className="mx-auto mb-5 w-48 rounded-lg border-t-2 border-[#fa7807]" />
          <p className="text-justify text-xl text-content-secondary">
            A Spark.ia é um projeto desenvolvido por alunos do ensino médio da escola EEEP Edson
            Queiroz, sabendo do quão difícil e requisitada é a vaga na universidade, pensamos em
            realizar um projeto que atendesse essas necessidades.
          </p>
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{ 768: { slidesPerView: 3 } }}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
          >
            {members.map((item) => (
              <SwiperSlide key={item.id}>
                <img
                  className="mx-auto mt-10 w-[200px] rounded-full"
                  src={item.image}
                  alt="Imagem de um integrante do grupo"
                />
                <h2 className="mt-2 text-center text-3xl font-semibold">{item.name}</h2>
                <p className="mb-12 text-center text-xl text-content-secondary">{item.position}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>

      <Footer />
    </div>
  );
};
