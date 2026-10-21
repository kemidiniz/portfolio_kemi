import React from 'react';
import { GraduationCap, Sparkles, Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';
import { EducationItem, TechImmersionItem } from '../data/portfolioData';
import { TabType } from './Header';

interface EducationAndAIProps {
  education: EducationItem[];
  techImmersions: TechImmersionItem[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const EducationAndAI: React.FC<EducationAndAIProps> = ({
  education,
  techImmersions,
  onNavigateToTab
}) => {
  const aiCourse = techImmersions.find(item => item.id === 'reprograma-ia');
  const summits = techImmersions.filter(item => item.id !== 'reprograma-ia');

  return (
    <section id="formacao-ia" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] mb-2">
            <span>Repertório & Aprendizado Contínuo</span>
            <span aria-hidden="true">·</span>
            <span>Academia & Tecnologia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] text-balance">
            Formação Acadêmica & Imersão em IA
          </h2>
        </div>

        {/* Top Grid: Academic Degrees */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4B4B54] dark:text-[#9E9EAA] mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#C83E62] dark:text-[#E04870]" />
            <span>Graduação & Ensino Superior</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-7 rounded-2xl bg-white dark:bg-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62]/60 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#4B4B54] dark:text-[#9E9EAA] mb-3">
                  <span className="font-bold text-sm text-[#C83E62] dark:text-[#E04870]">{edu.institution}</span>
                  <span className="tabular-nums font-semibold px-2.5 py-0.5 rounded-md bg-[#F2EFE9] dark:bg-[#1D1D24] text-[11px]">
                    {edu.period} · {edu.status}
                  </span>
                </div>

                <h4 className="text-xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] mb-1.5">
                  {edu.field}
                </h4>

                <p className="text-xs text-[#C83E62] dark:text-[#E04870] font-bold mb-3">
                  {edu.degree}
                </p>

                <p className="text-sm text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed font-normal">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight: Reprograma AI Formation */}
        {aiCourse && (
          <div className="mb-10 p-7 sm:p-9 rounded-2xl bg-gradient-to-r from-[#C83E62]/15 via-[#C83E62]/5 to-transparent border-2 border-[#C83E62] dark:border-[#E04870] relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C83E62] dark:text-[#E04870]">
                  <Sparkles className="w-4 h-4" />
                  <span>Destaque em Capacitação Tecnológica</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{aiCourse.year}</span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7]">
                  {aiCourse.program} — <span className="text-[#C83E62] dark:text-[#E04870]">{aiCourse.organization}</span>
                </h4>

                <p className="text-sm sm:text-base text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed font-normal">
                  {aiCourse.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#141416] dark:text-[#F4F4F7] pt-2">
                  <span className="font-bold text-[#C83E62] dark:text-[#E04870]">Pilares Dominados:</span>
                  {aiCourse.focus.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-medium">{item}</span>
                      {idx < aiCourse.focus.length - 1 && <span aria-hidden="true" className="text-[#4B4B54] dark:text-[#9E9EAA]">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] text-center min-w-[180px] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#4B4B54] dark:text-[#9E9EAA]">Comunidade Tech</span>
                <span className="text-xl font-black text-[#C83E62] dark:text-[#E04870] mt-1">&#123;reprograma&#125;</span>
                <span className="text-[11px] font-semibold text-[#4B4B54] dark:text-[#9E9EAA] mt-1">Diversidade & Inteligência Artificial</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section: Tech Summits & Immersions */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4B4B54] dark:text-[#9E9EAA] mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C83E62] dark:text-[#E04870]" />
            <span>Eventos, Summits & Imersões Tech</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {summits.map((event) => (
              <div
                key={event.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62]/50 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4B4B54] dark:text-[#9E9EAA] mb-2">
                    <span className="font-bold text-sm text-[#C83E62] dark:text-[#E04870]">{event.organization}</span>
                    <span className="tabular-nums font-semibold">{event.year}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#141416] dark:text-[#F4F4F7] mb-2 leading-snug">
                    {event.program}
                  </h4>

                  <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed mb-4 font-normal">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DCD9D0] dark:border-[#282832] text-[11px] font-medium text-[#C83E62] dark:text-[#E04870]">
                  {event.focus.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[#DCD9D0] dark:border-[#282832]">
            <button
              onClick={() => onNavigateToTab('experiencia')}
              className="text-xs font-bold text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#C83E62] transition-colors cursor-pointer"
            >
              ← Voltar para Experiência
            </button>
            <button
              onClick={() => onNavigateToTab('projetos')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83E62] dark:text-[#E04870] hover:underline cursor-pointer"
            >
              <span>Avançar para Projetos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
