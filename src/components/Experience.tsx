import React, { useState } from 'react';
import { Briefcase, ChevronDown, ChevronUp, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { ExperienceItem } from '../data/portfolioData';
import { TabType } from './Header';

interface ExperienceProps {
  experiences: ExperienceItem[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ experiences, onNavigateToTab }) => {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="experiencia" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] mb-2">
            <span>Trajetória Profissional</span>
            <span aria-hidden="true">·</span>
            <span>Comunicação, CX & Estratégia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] text-balance">
            Experiência Corporativa
          </h2>
          <p className="text-xs sm:text-sm text-[#4B4B54] dark:text-[#9E9EAA] mt-2 max-w-2xl font-normal">
            Atuação consolidada no Banco Bradesco e empresas de serviços, unindo liderança analítica, inteligência de negócios e comunicação com dados.
          </p>
        </div>

        {/* Experience List / Chronological Grid */}
        <div className="space-y-6 mb-10">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const isFirst = index === 0;

            return (
              <div
                key={exp.id}
                className={`rounded-2xl transition-all border-2 ${
                  isFirst
                    ? 'bg-white dark:bg-[#141419] border-[#C83E62] dark:border-[#E04870] shadow-md'
                    : 'bg-white dark:bg-[#141419] border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62]/50'
                } p-6 sm:p-8`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    
                    {/* Unboxed Metadata: Period · Location · Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
                      <span className="font-bold text-sm text-[#C83E62] dark:text-[#E04870]">{exp.company}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{exp.period}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </span>
                      {exp.badge && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-[#C83E62]/10 dark:bg-[#E04870]/20 text-[#C83E62] dark:text-[#E04870] font-bold text-[11px]">
                            {exp.badge}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7]">
                      {exp.role}
                    </h3>

                  </div>

                  {/* Toggle Accordion / Expansion Button */}
                  <button
                    onClick={() => toggleExpand(exp.id)}
                    className="self-start md:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-[#C83E62] dark:text-[#E04870] hover:text-[#A82447] py-2 px-3.5 rounded-xl border border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>{isExpanded ? 'Recolher Detalhes' : 'Ver Conquistas & Escopo'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Summary */}
                <p className="mt-3.5 text-sm sm:text-base text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed font-normal">
                  {exp.summary}
                </p>

                {/* Expandable Achievements & Scope */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-[#DCD9D0] dark:border-[#282832] space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#141416] dark:text-[#F4F4F7]">
                      Principais Impactos & Entregas
                    </h4>
                    
                    <ul className="space-y-2.5">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-3 text-sm text-[#4B4B54] dark:text-[#9E9EAA] font-normal">
                          <CheckCircle2 className="w-4 h-4 text-[#C83E62] dark:text-[#E04870] shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skills Used */}
                    <div className="pt-3">
                      <span className="text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mr-2">
                        Competências Mobilizadas:
                      </span>
                      <span className="text-xs font-medium text-[#C83E62] dark:text-[#E04870]">
                        {exp.skills.join(' · ')}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[#DCD9D0] dark:border-[#282832]">
            <button
              onClick={() => onNavigateToTab('sobre')}
              className="text-xs font-bold text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#C83E62] transition-colors cursor-pointer"
            >
              ← Voltar para Sobre mim
            </button>
            <button
              onClick={() => onNavigateToTab('formacao-ia')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83E62] dark:text-[#E04870] hover:underline cursor-pointer"
            >
              <span>Avançar para Formação & IA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
