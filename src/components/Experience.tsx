import React, { useState } from "react";
import { motion } from "motion/react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ExperienceItem } from "../data/portfolioData";
import { TabType } from "./Header";

interface ExperienceProps {
  experiences: ExperienceItem[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const Experience: React.FC<ExperienceProps> = ({
  experiences,
  onNavigateToTab,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="experiencia" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="page-introduction">
          <h2 className="section-label experience-title"><Briefcase size={16} aria-hidden="true" />Trajetória Profissional</h2>
          <p>
            Experiências, desafios e aprendizados que constroem meu percurso
            profissional.
          </p>
        </div>

        {/* Experience List / Chronological Grid */}
        <div className="space-y-6 mb-6">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const isFirst = index === 0;

            return (
              <motion.div
                key={exp.id}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : Math.min(index, 3) * 0.12, ease: "easeOut" }}
                className={`experience-card rounded-2xl border-2 ${
                  isFirst
                    ? "bg-[var(--paper-light)] border-[var(--wine)] shadow-md"
                    : "bg-[var(--paper-light)] border-[var(--rule)] hover:border-[var(--wine)]/50"
                } p-5 sm:p-6`}
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    {/* Unboxed Metadata: Period · Location · Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      <span className="font-bold text-sm text-[var(--wine)]">
                        {exp.company}
                      </span>
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
                          <span className="px-2.5 py-0.5 rounded-md bg-[var(--button-bg)]/10 dark:bg-[var(--button-bg)]/20 text-[var(--wine)] font-bold text-xs">
                            {exp.badge}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Role Title */}
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)]">
                      {exp.role}
                    </h3>
                  </div>

                  {/* Toggle Accordion / Expansion Button */}
                  <button
                    aria-expanded={isExpanded}
                    aria-controls={`experience-${exp.id}`}
                    onClick={() => toggleExpand(exp.id)}
                    className="self-start md:self-center inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--wine)] hover:text-[var(--wine-hover)] py-2 px-3.5 rounded-xl border border-[var(--rule)] hover:border-[var(--wine)] transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? "Recolher Detalhes"
                        : "Ver Conquistas & Escopo"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                  {exp.summary}
                </p>
                {/* Expandable Achievements & Scope */}
                {isExpanded && (
                  <div
                    id={`experience-${exp.id}`}
                    className="mt-5 pt-5 border-t border-[var(--rule)] space-y-4"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                      Principais Impactos & Entregas
                    </h4>

                    <ul className="space-y-2.5">
                      {exp.achievements.map((ach, aIdx) => (
                        <li
                          key={aIdx}
                          className="flex items-start gap-3 text-sm text-[var(--muted)] font-normal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[var(--wine)] shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skills Used */}
                    <div className="pt-3">
                      <span className="text-xs font-bold text-[var(--ink)] mr-2">
                        Competências Mobilizadas:
                      </span>
                      <span className="text-xs font-medium text-[var(--wine)]">
                        {exp.skills.join(" · ")}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[var(--rule)]">
            <button
              onClick={() => onNavigateToTab("sobre")}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--wine)] transition-colors cursor-pointer"
            >
              ← Voltar para Sobre mim
            </button>
            <button
              onClick={() => onNavigateToTab("formacao-ia")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--wine)] hover:underline cursor-pointer"
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
