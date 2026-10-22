import React from "react";
import { Award, Check, ExternalLink, Wrench, ArrowRight } from "lucide-react";
import { CertificationItem, SkillCategory } from "../data/portfolioData";
import { TabType } from "./Header";

interface CertificationsAndSkillsProps {
  certifications: CertificationItem[];
  skills: SkillCategory[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const CertificationsAndSkills: React.FC<
  CertificationsAndSkillsProps
> = ({ certifications, skills, onNavigateToTab }) => {
  return (
    <section id="certificacoes" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-2">
            <span>Validação de Competências</span>
            <span aria-hidden="true">·</span>
            <span>Credenciais & Ferramentas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] text-balance">
            Certificações & Habilidades Técnicas
          </h2>
        </div>

        {/* Certifications Grid */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--wine)]" />
            <span>Certificações Executivas & Especiais</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                    <span className="font-bold text-sm text-[var(--wine)]">
                      {cert.institution}
                    </span>
                    <span className="tabular-nums font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-hover)] text-xs">
                      {cert.year}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--ink)] mb-3 leading-snug">
                    {cert.title}
                  </h4>
                </div>

                <div className="pt-4 border-t border-[var(--rule)]">
                  <span className="text-xs font-bold text-[var(--ink)] block mb-1">
                    Tópicos de Domínio:
                  </span>
                  <p className="text-xs text-[var(--muted)] leading-relaxed font-normal">
                    {cert.skillsAcquired.join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hard Skills & Tools Matrix */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[var(--wine)]" />
            <span>Matriz de Ferramentas & Hard Skills</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skillGroup, sIdx) => (
              <div
                key={sIdx}
                className="p-5 sm:p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <h4 className="text-base font-bold text-[var(--ink)] mb-1">
                    {skillGroup.category}
                  </h4>
                  <p className="text-xs text-[var(--muted)] mb-5 font-normal">
                    {skillGroup.description}
                  </p>

                  <div className="space-y-3">
                    {skillGroup.items.map((skill, kIdx) => (
                      <div
                        key={kIdx}
                        className="flex items-center justify-between py-1.5 border-b border-[var(--rule)]/60 dark:border-[var(--rule)]/80 last:border-b-0 text-sm"
                      >
                        <span className="font-semibold text-[var(--ink)]">
                          {skill.name}
                        </span>
                        <span className="text-xs text-[var(--wine)] font-bold tabular-nums">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--rule)] text-xs text-[var(--muted)]">
                  Aplicação prática em rotinas de estratégia e dados
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[var(--rule)]">
            <button
              onClick={() => onNavigateToTab("projetos")}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--wine)] transition-colors cursor-pointer"
            >
              ← Voltar para Projetos
            </button>
            <button
              onClick={() => onNavigateToTab("contato")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--wine)] hover:underline cursor-pointer"
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
