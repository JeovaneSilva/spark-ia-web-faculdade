import { Layers, ListChecks, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { useMagnetic } from "../../hooks/useMagnetic";
import imgLandingPage from "../../assets/illustrations/imgLandingPage.svg";

interface HeroProps {
  scrollY: number;
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

const highlights = [
  { icon: ListChecks, label: "Banco de questões do ENEM" },
  { icon: MessageCircle, label: "Chatbot gerador de questões" },
  { icon: Layers, label: "Flashcards com repetição espaçada" },
];

export const Hero = ({ scrollY, onPrimaryCta, onSecondaryCta }: HeroProps) => {
  const {
    ref: magneticRef,
    onMouseMove: onMagneticMove,
    onMouseLeave: onMagneticLeave,
  } = useMagnetic<HTMLDivElement>(0.25);

  return (
    <section
      id="inicio"
      className="relative -mt-16 flex min-h-[calc(100dvh-1rem)] w-full items-center overflow-hidden pt-16 md:-mt-24 md:min-h-screen md:pt-24"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-brand-background" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 px-4 py-12 sm:px-6 md:flex-row md:gap-14 md:px-12 md:py-16">
        <ScrollReveal className="w-full md:w-1/2" direction="left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-cyan">
            <Sparkles size={14} className="animate-pulse" />
            IA para sua aprovação no ENEM
          </span>

          <h1 className="mt-5 text-4xl font-bold text-brand-orange sm:text-5xl md:text-6xl">
            Spark.ia
          </h1>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:text-5xl">
            Sua preparação para o ENEM, mais inteligente e mais eficaz
          </h2>
          <p className="mb-8 mt-5 max-w-lg text-base text-content-secondary sm:text-lg md:text-xl">
            Transforme textos, links e materiais que você já estuda em questões personalizadas,
            flashcards inteligentes e uma rotina de revisão mais focada no que realmente importa para a sua aprovação.
          </p>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <div
              ref={magneticRef}
              onMouseMove={onMagneticMove}
              onMouseLeave={onMagneticLeave}
              className="inline-block transition-transform duration-200 ease-out"
            >
              <Button
                variant="primary"
                className="w-full px-6 py-3 text-base shadow-[0_10px_24px_-8px_rgba(255,122,0,0.45)] sm:w-auto sm:px-10 sm:py-4"
                onClick={onPrimaryCta}
              >
                Experimentar agora!
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full px-6 py-3 text-base sm:w-auto sm:px-8 sm:py-4"
              onClick={onSecondaryCta}
            >
              Ver funcionalidades
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.label} delay={150 + index * 100}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-brand-card/60 px-3 py-2 text-xs text-content-secondary sm:px-4 sm:text-sm">
                    <Icon size={16} className="text-brand-cyan" />
                    {item.label}
                  </span>
                </ScrollReveal>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="relative flex w-full items-center justify-center md:w-2/5">
          <div
            className="relative flex items-center justify-center"
            style={{
              transform: `translateY(${Math.min(scrollY * 0.12, 60)}px)`,
            }}
          >
            <div className="absolute h-72 w-72 rounded-full border border-brand-cyan/20 md:h-80 md:w-80" />
            <div className="absolute h-56 w-56 animate-[spin-slow_18s_linear_infinite] rounded-full border border-dashed border-brand-orange/20 md:h-64 md:w-64" />

            <img
              src={imgLandingPage}
              alt="Ilustração do chatbot Spark.ia"
              className="relative w-full max-w-[19rem] animate-[float-slow_7s_ease-in-out_infinite] sm:max-w-md md:max-w-lg"
            />

            <span className="absolute -left-4 top-8 hidden animate-[float-fast_5s_ease-in-out_infinite] items-center gap-2 rounded-card border border-white/10 bg-brand-sidebar/90 px-3 py-2 text-xs font-semibold text-content-primary shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur sm:flex">
              <MessageCircle size={14} className="text-brand-cyan" />
              Gerando questões...
            </span>

            <span className="absolute -right-6 bottom-12 hidden animate-[float-fast_6s_ease-in-out_infinite] items-center gap-2 rounded-card border border-white/10 bg-brand-sidebar/90 px-3 py-2 text-xs font-semibold text-content-primary shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur sm:flex">
              <Layers size={14} className="text-brand-orange" />
              Flashcard revisado
            </span>

            <span className="absolute right-4 top-4 h-2.5 w-2.5 animate-ping rounded-full bg-brand-cyan" />
            <span className="absolute bottom-6 left-10 h-2 w-2 animate-ping rounded-full bg-brand-orange" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-content-disabled md:flex">
        <span className="text-xs tracking-[0.2em] uppercase">
          Role para explorar
        </span>
        <span className="h-8 w-5 rounded-full border border-content-disabled/40 p-1">
          <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-brand-orange" />
        </span>
      </div>
    </section>
  );
};
