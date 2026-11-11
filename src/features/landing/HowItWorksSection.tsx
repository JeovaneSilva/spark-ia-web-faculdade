import { FileText, Layers, ListChecks, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionFade } from '../../components/ui/SectionFade';

interface Step {
  icon: LucideIcon;
  title: string;
  text: string;
}

const steps: Step[] = [
  {
    icon: FileText,
    title: 'Envie um texto ou link',
    text: 'Cole um material de estudo, um artigo ou o link de uma aula.',
  },
  {
    icon: ListChecks,
    title: 'A IA extrai os tópicos',
    text: 'O Spark.ia analisa o conteúdo e identifica os pontos principais.',
  },
  {
    icon: Layers,
    title: 'Estude com questões e flashcards',
    text: 'Pratique na hora com questões e flashcards gerados a partir do que você enviou.',
  },
];

const TimelineCard = ({ fromLeft, children }: { fromLeft: boolean; children: ReactNode }) => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const hidden = fromLeft ? '-translate-x-12 -rotate-3' : 'translate-x-12 rotate-3';

  return (
    <div
      ref={ref}
      className={`w-full rounded-card border border-white/5 bg-brand-card/70 p-6 shadow-glow backdrop-blur-sm transition-all duration-700 ease-out md:max-w-md md:p-8 ${
        isInView ? 'translate-x-0 rotate-0 scale-100 opacity-100' : `${hidden} scale-95 opacity-0`
      }`}
    >
      {children}
    </div>
  );
};

const GhostNumber = ({ index }: { index: number }) => (
  <span
    aria-hidden="true"
    className="hidden select-none text-[7rem] font-black leading-none text-white/5 md:block lg:text-[9rem]"
  >
    0{index + 1}
  </span>
);

export const HowItWorksSection = () => {
  const { ref: progressRef, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <section id="comoFunciona" className="relative w-full overflow-x-hidden px-6 py-24 md:px-12">
      <SectionFade fromClass="from-brand-sidebar" />

      <div className="relative z-10">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-bold text-content-primary md:text-4xl lg:text-5xl">
            Como funciona
          </h2>
          <hr className="mx-auto mb-20 mt-3 w-48 rounded-lg border-t-2 border-brand-orange" />
        </ScrollReveal>

        <div ref={progressRef} className="relative mx-auto max-w-6xl">
          <div className="absolute inset-y-6 left-8 w-1 rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <div
              className="w-full origin-top rounded-full bg-gradient-to-b from-brand-orange to-brand-cyan transition-transform duration-150 ease-out"
              style={{ height: '100%', transform: `scaleY(${progress})` }}
            />
            <span
              className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan shadow-[0_0_16px_rgba(34,211,238,0.8)] transition-all duration-150 ease-out"
              style={{ top: `${progress * 100}%`, opacity: progress > 0.02 && progress < 0.99 ? 1 : 0 }}
            />
          </div>

          <div className="flex flex-col gap-20 md:gap-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const threshold = (index + 0.5) / steps.length;
              const active = progress >= threshold;
              const isEven = index % 2 === 0;

              const cardContent = (
                <>
                  <span className="text-sm font-semibold tracking-[0.2em] text-brand-orange">
                    PASSO 0{index + 1}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold md:text-3xl lg:text-4xl">{step.title}</h3>
                  <p className="mt-3 text-content-secondary md:text-lg lg:text-xl">{step.text}</p>
                </>
              );

              return (
                <div
                  key={step.title}
                  className="relative flex min-h-[45vh] items-center pl-20 md:min-h-[55vh] md:pl-0"
                >
                  <span
                    className={`absolute left-8 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 md:left-1/2 md:h-20 md:w-20 lg:h-24 lg:w-24 ${
                      active
                        ? 'border-brand-orange bg-brand-orange text-white shadow-[0_0_30px_rgba(255,122,0,0.5)]'
                        : 'border-white/15 bg-brand-sidebar text-content-disabled'
                    }`}
                  >
                    {active && (
                      <span
                        key="ping"
                        className="absolute inset-0 rounded-full border-2 border-brand-orange animate-[ping_1.4s_ease-out_2]"
                      />
                    )}
                    <Icon size={24} className="md:hidden" />
                    <Icon size={32} className="hidden md:block" />
                  </span>

                  <div className="grid w-full items-center md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-16">
                    <div className="md:flex md:justify-end">
                      {isEven ? <TimelineCard fromLeft>{cardContent}</TimelineCard> : <GhostNumber index={index} />}
                    </div>

                    <div className="hidden md:block md:w-24 lg:w-28" />

                    <div className="md:flex md:justify-start">
                      {isEven ? (
                        <GhostNumber index={index} />
                      ) : (
                        <TimelineCard fromLeft={false}>{cardContent}</TimelineCard>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
