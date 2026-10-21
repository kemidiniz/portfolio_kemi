import React from 'react';
import { Award, Check, ExternalLink, Wrench, ArrowRight } from 'lucide-react';
import { CertificationItem, SkillCategory } from '../data/portfolioData';
import { TabType } from './Header';

interface CertificationsAndSkillsProps {
  certifications: CertificationItem[];
  skills: SkillCategory[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const CertificationsAndSkills: React.FC<CertificationsAndSkillsProps> = ({
  certifications,
  skills,
  onNavigateToTab
}) => {
  return (
    <section id="certificacoes" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] mb-2">
            <span>Validação de Competências</span>
            <span aria-hidden="true">·</span>
            <span>Credenciais & Ferramentas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] text-balance">
            Certificações & Habilidades Técnicas
          </h2>
        </div>

        {/* Certifications Grid */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4B4B54] dark:text-[#9E9EAA] mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C83E62] dark:text-[#E04870]" />
            <span>Certificações Executivas & Especiais</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62] dark:hover:border-[#E04870] transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#4B4B54] dark:text-[#9E9EAA] mb-3">
                    <span className="font-bold text-sm text-[#C83E62] dark:text-[#E04870]">{cert.institution}</span>
                    <span className="tabular-nums font-semibold px-2 py-0.5 rounded-md bg-[#F2EFE9] dark:bg-[#1D1D24] text-[11px]">{cert.year}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#141416] dark:text-[#F4F4F7] mb-3 leading-snug">
                    {cert.title}
                  </h4>
                </div>

                <div className="pt-4 border-t border-[#DCD9D0] dark:border-[#282832]">
                  <span className="text-[11px] font-bold text-[#141416] dark:text-[#F4F4F7] block mb-1">
                    Tópicos de Domínio:
                  </span>
                  <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed font-normal">
                    {cert.skillsAcquired.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hard Skills & Tools Matrix */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4B4B54] dark:text-[#9E9EAA] mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#C83E62] dark:text-[#E04870]" />
            <span>Matriz de Ferramentas & Hard Skills</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skillGroup, sIdx) => (
              <div
                key={sIdx}
                className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <h4 className="text-base font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                    {skillGroup.category}
                  </h4>
                  <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] mb-5 font-normal">
                    {skillGroup.description}
                  </p>

                  <div className="space-y-3">
                    {skillGroup.items.map((skill, kIdx) => (
                      <div
                        key={kIdx}
                        className="flex items-center justify-between py-1.5 border-b border-[#DCD9D0]/60 dark:border-[#282832]/80 last:border-b-0 text-sm"
                      >
                        <span className="font-semibold text-[#141416] dark:text-[#F4F4F7]">
                          {skill.name}
                        </span>
                        <span className="text-xs text-[#C83E62] dark:text-[#E04870] font-bold tabular-nums">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#DCD9D0] dark:border-[#282832] text-[11px] text-[#4B4B54] dark:text-[#9E9EAA]">
                  Aplicação prática em rotinas de estratégia e dados
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[#DCD9D0] dark:border-[#282832]">
            <button
              onClick={() => onNavigateToTab('projetos')}
              className="text-xs font-bold text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#C83E62] transition-colors cursor-pointer"
            >
              ← Voltar para Projetos
            </button>
            <button
              onClick={() => onNavigateToTab('contato')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83E62] dark:text-[#E04870] hover:underline cursor-pointer"
            >
              <span>Avançar para Canais de Contato</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
