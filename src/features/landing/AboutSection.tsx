import { Code2, Instagram, Linkedin, Smartphone } from 'lucide-react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { SectionFade } from '../../components/ui/SectionFade';
import { members } from './members';

const roleIcon = (position: string) => (position.toLowerCase().includes('mobile') ? Smartphone : Code2);

export const AboutSection = () => {
  return (
    <section
      id="sobreNos"
      className="relative flex w-full flex-col justify-center overflow-hidden bg-brand-sidebar px-6 py-28 md:min-h-[85vh] md:px-12 md:py-32"
    >
      <SectionFade fromClass="from-brand-background" />

      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-content-primary md:text-5xl lg:text-6xl">Sobre nós</h2>
          <hr className="mx-auto mb-8 mt-4 w-48 rounded-lg border-t-2 border-brand-orange" />
          <p className="text-lg text-content-secondary md:text-xl lg:text-2xl">
            A Spark.ia é um projeto desenvolvido por alunos do ensino médio da escola EEEP Edson
            Queiroz. Sabendo do quão difícil e requisitada é a vaga na universidade, pensamos em
            criar uma ferramenta que atendesse essa necessidade.
          </p>
        </ScrollReveal>
      </div>

      <div className="relative mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-4 md:gap-10">
        {members.map((member, index) => {
          const Icon = roleIcon(member.position);
          return (
            <ScrollReveal key={member.id} delay={index * 100}>
              <div className="group flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full border border-dashed border-brand-cyan/20 transition-transform duration-700 ease-out group-hover:rotate-45" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-32 w-32 rounded-full object-cover shadow-glow ring-2 ring-brand-cyan/40 transition-transform duration-300 group-hover:scale-105 md:h-40 md:w-40"
                  />
                  <span className="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-sidebar bg-brand-orange text-white">
                    <Icon size={18} />
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold md:text-xl">{member.name}</h3>
                  <p className="text-sm text-content-secondary md:text-base">{member.position}</p>
                </div>

                {(member.linkedin || member.instagram) && (
                  <div className="flex items-center gap-2">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-content-secondary transition-colors hover:border-brand-cyan/40 hover:text-brand-cyan"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Instagram de ${member.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-content-secondary transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
