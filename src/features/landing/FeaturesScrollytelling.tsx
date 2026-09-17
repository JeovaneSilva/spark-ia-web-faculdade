import { CircleCheck } from 'lucide-react';
import { useActiveStep } from '../../hooks/useActiveStep';

interface Feature {
  img: string;
  title: string;
  text: string;
  highlights: string[];
}

interface FeaturesScrollytellingProps {
  features: Feature[];
}

export const FeaturesScrollytelling = ({ features }: FeaturesScrollytellingProps) => {
  const { activeIndex, setRef } = useActiveStep<HTMLDivElement>(features.length);

  return (
    <div className="mx-auto grid max-w-7xl md:grid-cols-2 md:gap-12 lg:gap-20">
      <div className="hidden md:block">
        <div className="sticky top-24 flex h-[calc(100vh-6rem)] flex-col items-center justify-center gap-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-[clamp(20rem,38vw,32rem)] w-[clamp(20rem,38vw,32rem)] animate-[spin-slow_22s_linear_infinite] rounded-full border border-dashed border-brand-cyan/15" />
            <div className="absolute h-[clamp(17rem,32vw,27rem)] w-[clamp(17rem,32vw,27rem)] rounded-full border border-brand-orange/15" />

            <div className="relative flex h-[clamp(18rem,34vw,29rem)] w-[clamp(18rem,34vw,29rem)] items-center justify-center rounded-card bg-gradient-to-br from-brand-cyan/6 via-brand-card to-brand-orange/6 shadow-glow">
              <div className="absolute inset-0 rounded-card border border-white/5" />
              {features.map((feature, index) => (
                <img
                  key={feature.title}
                  src={feature.img}
                  alt={feature.title}
                  className={`absolute h-[68%] w-[68%] object-contain transition-all duration-500 ease-out ${
                    activeIndex === index ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-content-secondary">
              0{activeIndex + 1} / 0{features.length}
            </span>
            <div className="flex items-center gap-2">
              {features.map((feature, index) => (
                <span
                  key={feature.title}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'w-10 bg-brand-orange' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            ref={setRef(index)}
            className="flex min-h-[90vh] flex-col items-center justify-center gap-4 text-center transition-opacity duration-500 md:max-w-lg md:items-start md:text-left"
            style={{ opacity: activeIndex === index ? 1 : 0.35 }}
          >
            <img src={feature.img} alt={feature.title} className="h-36 w-36 object-contain md:hidden" />
            <span className="text-base font-semibold tracking-[0.2em] text-brand-orange">
              0{index + 1}
            </span>
            <h3 className="text-3xl font-semibold md:text-4xl lg:text-5xl">{feature.title}</h3>
            <p className="text-lg text-content-secondary lg:text-xl">{feature.text}</p>

            <ul className="mt-2 flex flex-col gap-3">
              {feature.highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-2 text-base text-content-secondary">
                  <CircleCheck size={20} className="shrink-0 text-brand-cyan" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
