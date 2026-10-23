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
    <section
      aria-label="Certificações e habilidades"
      id="certificacoes"
      className="py-6 md:py-7"
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Certifications Grid */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--wine)]" />
            <span>Certificações Executivas & Especiais</span>
          </h3>

          <div className="certification-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="certification-card p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
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

          <div className="skills-matrix">
            {skills.map((group, index) => (
              <article className="skill-group" key={index} style={{ gridRow: `span ${Math.max(0, ...skills.map(item => item.items.length)) + 2}` }}>
                <header className="skill-group-heading">
                  <h4>{group.category}</h4>
                  <p>{group.description}</p>
                </header>
                {Array.from({ length: Math.max(0, ...skills.map(item => item.items.length)) }, (_, row) => (
                  <div className="skill-row" key={row} aria-hidden={!group.items[row] || undefined}>
                    <span>{group.items[row]?.name}</span>
                    <span>{group.items[row]?.level}</span>
                  </div>
                ))}
                <footer>{onNavigateToTab ? <button className="text-link" onClick={() => onNavigateToTab("projetos")}>Ver projetos na prática <ArrowRight size={14} aria-hidden="true" /></button> : "Aplicação prática em rotinas de estratégia e dados"}</footer>
              </article>
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

          </div>
        )}
      </div>
    </section>
  );
};
