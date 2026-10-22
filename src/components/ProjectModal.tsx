import React, { useEffect } from "react";
import {
  X,
  CheckCircle2,
  Calendar,
  UserCheck,
  Wrench,
  Building2,
  Sparkles,
} from "lucide-react";
import { ProjectItem } from "../data/portfolioData";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-3xl my-8 bg-[var(--paper-light)] rounded-3xl border border-[var(--rule)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="relative aspect-video w-full max-h-72 overflow-hidden bg-[var(--ink)]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Fechar detalhes do case"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Meta Title */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/80 mb-2">
              <span>{project.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.clientOrContext}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-hover)] border border-[var(--rule)] text-xs">
            <div>
              <span className="font-semibold text-[var(--muted)] block mb-0.5">
                Papel & Atuação
              </span>
              <span className="font-bold text-[var(--ink)]">
                {project.role}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[var(--muted)] block mb-0.5">
                Contexto / Instituição
              </span>
              <span className="font-bold text-[var(--ink)]">
                {project.clientOrContext}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-2">
              Visão Geral
            </h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 surface-card rounded-2xl bg-[var(--paper-light)] dark:bg-[var(--surface-hover)] border border-[var(--rule)]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
                O Desafio
              </h5>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 surface-card rounded-2xl bg-[var(--paper-light)] dark:bg-[var(--surface-hover)] border border-[var(--rule)]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-2">
                A Solução Desenvolvida
              </h5>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Measurable Results */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-3">
              Resultados & Evidências de Sucesso
            </h4>
            <ul className="space-y-2.5">
              {project.results.map((res, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--muted)]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[var(--wine)] shrink-0 mt-0.5" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Methods */}
          <div className="pt-4 border-t border-[var(--rule)]">
            <span className="text-xs font-bold text-[var(--ink)] block mb-2">
              Ferramentas & Metodologias Mobilizadas:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
              {project.tools.map((tool, idx) => (
                <React.Fragment key={idx}>
                  <span className="py-1 px-2.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--rule)] font-medium">
                    {tool}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[var(--surface-hover)] border-t border-[var(--rule)] flex items-center justify-between">
          <span className="text-xs text-[var(--muted)]">
            Case study documentado para avaliação profissional.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[var(--button-bg)] hover:bg-[var(--button-hover)] rounded-xl transition-colors"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
