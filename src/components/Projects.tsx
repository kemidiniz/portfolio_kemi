import React, { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Layers,
  Sparkles,
  BarChart3,
  FileCheck2,
} from "lucide-react";
import { ProjectItem } from "../data/portfolioData";

interface ProjectsProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  onSelectProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const categories = [
    { id: "todos", label: "Todos os Projetos" },
    { id: "pesquisa", label: "Artigos Publicados" },
    { id: "estrategia", label: "Estratégia & CX" },
    { id: "comunicacao", label: "Comunicação & Design" },
    { id: "dados-ia", label: "Dados & IA" },
  ];

  const filteredProjects =
    activeCategory === "todos"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projetos" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-2">
              <span>Produção Intelectual & Entregas</span>
              <span aria-hidden="true">·</span>
              <span>Casos Reais & Artigos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] text-balance">
              Projetos
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 max-w-xl font-normal">
              Clique em qualquer card para abrir o estudo de caso detalhado com
              desafios, metodologia e dados de impacto.
            </p>
          </div>

          {/* Interactive Filter Pills/Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[var(--surface-hover)]/70 dark:bg-[var(--paper-light)] rounded-2xl border border-[var(--rule)]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[var(--button-bg)] text-white shadow-xs font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] dark:hover:text-[var(--ink)] hover:bg-[var(--rule)]/50 dark:hover:bg-[var(--surface-hover)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Projects Showcase - Generous Card Sizing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1"
            >
              {/* Media Thumbnail Container with Scrim & Zero-Broken-Image fallback */}
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--ink)]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle top/bottom gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                {/* Top overlay unboxed info */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-bold tracking-wide bg-[var(--button-bg)] text-white px-3 py-1 rounded-lg shadow-sm">
                    {project.categoryLabel}
                  </span>
                  <span className="tabular-nums font-semibold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    {project.year}
                  </span>
                </div>

                {/* Bottom title preview */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-white/90 font-semibold block">
                    {project.role}
                  </span>
                  <span className="text-sm font-bold text-white truncate block">
                    {project.clientOrContext}
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--wine)] dark:group-hover:text-[var(--wine)] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="p-2.5 rounded-xl bg-[var(--surface-hover)] text-[var(--muted)] group-hover:text-white group-hover:bg-[var(--button-bg)] transition-all shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-[var(--wine)] mb-2.5">
                    {project.clientOrContext}
                  </p>

                  <p className="text-sm text-[var(--muted)] leading-relaxed mb-6 font-normal">
                    {project.tagline}
                  </p>
                </div>

                {/* Tools & CTA */}
                <div className="pt-4 border-t border-[var(--rule)] flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)] truncate max-w-[65%] font-medium">
                    {project.tools.slice(0, 3).join(" · ")}
                  </span>
                  <span className="font-bold text-[var(--wine)] group-hover:underline whitespace-nowrap">
                    Ver Estudo Completo →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
