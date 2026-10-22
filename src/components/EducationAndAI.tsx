import React from "react";
import {
  GraduationCap,
  Sparkles,
  Calendar,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import { EducationItem, TechImmersionItem } from "../data/portfolioData";
import { TabType } from "./Header";

interface EducationAndAIProps {
  education: EducationItem[];
  techImmersions: TechImmersionItem[];
  onNavigateToTab?: (tab: TabType) => void;
}

export const EducationAndAI: React.FC<EducationAndAIProps> = ({
  education,
  techImmersions,
  onNavigateToTab,
}) => {
  const aiCourse = techImmersions.find((item) => item.id === "reprograma-ia");
  const summits = techImmersions.filter((item) => item.id !== "reprograma-ia");

  return (
    <section id="formacao-ia" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-2">
            <span>Repertório & Aprendizado Contínuo</span>
            <span aria-hidden="true">·</span>
            <span>Academia & Tecnologia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] text-balance">
            Formação Acadêmica & Imersão em IA
          </h2>
        </div>

        {/* Top Grid: Academic Degrees */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[var(--wine)]" />
            <span>Graduação & Ensino Superior</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-7 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)]/60 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)] mb-3">
                  <span className="font-bold text-sm text-[var(--wine)]">
                    {edu.institution}
                  </span>
                  <span className="tabular-nums font-semibold px-2.5 py-0.5 rounded-md bg-[var(--surface-hover)] text-[11px]">
                    {edu.period} · {edu.status}
                  </span>
                </div>

                <h4 className="text-xl font-bold tracking-tight text-[var(--ink)] mb-1.5">
                  {edu.field}
                </h4>

                <p className="text-xs text-[var(--wine)] font-bold mb-3">
                  {edu.degree}
                </p>

                <p className="text-sm text-[var(--muted)] leading-relaxed font-normal">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight: Reprograma AI Formation */}
        {aiCourse && (
          <div className="mb-10 p-7 sm:p-9 rounded-2xl bg-gradient-to-r from-[var(--wine)]/15 via-[var(--wine)]/5 to-transparent border-2 border-[var(--wine)] relative overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--wine)]">
                  <Sparkles className="w-4 h-4" />
                  <span>Destaque em Capacitação Tecnológica</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{aiCourse.year}</span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
                  {aiCourse.program} —{" "}
                  <span className="text-[var(--wine)]">
                    {aiCourse.organization}
                  </span>
                </h4>

                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed font-normal">
                  {aiCourse.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ink)] pt-2">
                  <span className="font-bold text-[var(--wine)]">
                    Pilares Dominados:
                  </span>
                  {aiCourse.focus.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-medium">{item}</span>
                      {idx < aiCourse.focus.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="text-[var(--muted)]"
                        >
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center justify-center p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] text-center min-w-[180px] shadow-sm">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--muted)]">
                  Comunidade Tech
                </span>
                <span className="text-xl font-black text-[var(--wine)] mt-1">
                  &#123;reprograma&#125;
                </span>
                <span className="text-[11px] font-semibold text-[var(--muted)] mt-1">
                  Diversidade & Inteligência Artificial
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section: Tech Summits & Immersions */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--wine)]" />
            <span>Eventos, Summits & Imersões Tech</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {summits.map((event) => (
              <div
                key={event.id}
                className="p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)]/50 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                    <span className="font-bold text-sm text-[var(--wine)]">
                      {event.organization}
                    </span>
                    <span className="tabular-nums font-semibold">
                      {event.year}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--ink)] mb-2 leading-snug">
                    {event.program}
                  </h4>

                  <p className="text-xs text-[var(--muted)] leading-relaxed mb-4 font-normal">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--rule)] text-[11px] font-medium text-[var(--wine)]">
                  {event.focus.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block Navigation Helper */}
        {onNavigateToTab && (
          <div className="flex items-center justify-between pt-6 border-t border-[var(--rule)]">
            <button
              onClick={() => onNavigateToTab("experiencia")}
              className="text-xs font-bold text-[var(--muted)] hover:text-[var(--wine)] transition-colors cursor-pointer"
            >
              ← Voltar para Experiência
            </button>
            <button
              onClick={() => onNavigateToTab("projetos")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--wine)] hover:underline cursor-pointer"
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
