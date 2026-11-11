import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionFade } from "../../components/ui/SectionFade";
import whiteLogo from "../../assets/images/whiteLogo.png";
import { Logo } from "../../components/ui/Logo";
import uninassaulogo from "../../assets/images/uninassaulogo.svg";

type IdentityCard = {
  title: string;
  subtitle: string;
  image?: string;
  imageClassName?: string;
  tone: string;
  isImageCard: boolean;
  hideTitle?: boolean;
};

const identityCards: IdentityCard[] = [
  {
    title: "",
    subtitle: "Spark.ia",
    image: whiteLogo,
    imageClassName: "h-12 w-auto object-contain",
    tone: "from-brand-orange/25 via-brand-orange/10 to-transparent",
    isImageCard: true,
    hideTitle: false,
  },
  {
    title: "Centro Universitário",
    subtitle: "Centro Universitário",
    image: uninassaulogo,
    imageClassName: "h-20 w-auto max-w-[260px] object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.16)]",
    tone: "from-brand-cyan/20 via-transparent to-transparent",
    isImageCard: true,
    hideTitle: true,
  },
  {
    title: "ADS",
    subtitle: "Análise e Desenvolvimento de Sistemas",
    image: undefined,
    imageClassName: "",
    tone: "from-brand-orange/20 via-transparent to-transparent",
    isImageCard: false,
    hideTitle: false,
  },
];

export const AboutSection = () => {
  return (
    <section
      id="sobreNos"
      className="relative flex w-full flex-col justify-center overflow-hidden bg-brand-sidebar px-4 py-20 sm:px-6 sm:py-24 md:min-h-[85vh] md:px-12 md:py-32"
    >
      <SectionFade fromClass="from-brand-background" />

      <div className="relative mx-auto w-full max-w-6xl">
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-cyan">
            Quem somos
          </span>
          <h2 className="mt-5 text-3xl font-bold text-content-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Sobre nós
          </h2>
          <hr className="mx-auto mb-8 mt-4 w-48 rounded-lg border-t-2 border-brand-orange" />
          <p className="text-base text-content-secondary sm:text-lg md:text-xl lg:text-2xl">
            O Spark.ia nasceu para tornar a preparação para o ENEM mais
            acessível, inteligente e motivadora. Desenvolvido por alunos de
            Análise e Desenvolvimento de Sistemas da UNINASSAU, o projeto
            combina tecnologia e educação para criar uma experiência de estudo
            mais prática, personalizada e eficiente. Acreditamos que aprender
            melhor é também revisar melhor, praticar com foco e entender cada
            conteúdo com mais clareza. Por isso, criamos uma ferramenta que
            ajuda estudantes a transformar material de estudo em exercícios,
            revisões estratégicas e conhecimento mais consolidado.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {identityCards.map((card) => (
            <ScrollReveal key={card.title || card.subtitle} delay={120} className="h-full">
              <div
                className={`flex h-full min-h-[180px] flex-col items-center rounded-2xl border border-white/10 bg-linear-to-br ${card.tone} p-6 text-center shadow-[0_18px_45px_-28px_rgba(0,0,0,0.75)] backdrop-blur-sm`}
              >
                {card.isImageCard ? (
                  <div className="flex h-20 w-full flex-col items-center justify-center gap-2">
                    {card.image === whiteLogo ? (
                      <Logo className="h-12" />
                    ) : card.image ? (
                      <img
                        src={card.image}
                        alt={card.title || card.subtitle}
                        className={card.imageClassName ?? "h-16 w-auto object-contain"}
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-brand-card/80 text-lg font-black text-brand-orange">
                        {card.title.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                    {!card.hideTitle && card.title && (
                      <h3 className="text-2xl font-bold text-content-primary">
                        {card.title}
                      </h3>
                    )}
                  </div>
                ) : (
                  <div className="flex h-20 w-full items-center justify-center">
                    <h3 className="text-3xl font-black text-content-primary">
                      {card.title}
                    </h3>
                  </div>
                )}

                <span className="mt-3 flex min-h-8 max-w-[18rem] items-center justify-center text-xs uppercase leading-relaxed tracking-[0.14em] text-content-disabled">
                  {card.subtitle}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
