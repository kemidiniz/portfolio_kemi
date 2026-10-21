import React, { useEffect } from 'react';
import { X, CheckCircle2, Calendar, UserCheck, Wrench, Building2, Sparkles } from 'lucide-react';
import { ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-3xl my-8 bg-white dark:bg-[#1C1C20] rounded-3xl border border-[#E6E4DF] dark:border-[#2A2A30] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Cover Banner */}
        <div className="relative aspect-video w-full max-h-72 overflow-hidden bg-[#18181B]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F9F8F6] dark:bg-[#121214] border border-[#E6E4DF] dark:border-[#2A2A30] text-xs">
            <div>
              <span className="font-semibold text-[#52525B] dark:text-[#A1A1AA] block mb-0.5">
                Papel & Atuação
              </span>
              <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {project.role}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#52525B] dark:text-[#A1A1AA] block mb-0.5">
                Contexto / Instituição
              </span>
              <span className="font-bold text-[#18181B] dark:text-[#F4F4F5]">
                {project.clientOrContext}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C83E62] mb-2">
              Visão Geral
            </h4>
            <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-[#E6E4DF] dark:border-[#2A2A30]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] mb-2">
                O Desafio
              </h5>
              <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-[#E6E4DF] dark:border-[#2A2A30]">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#18181B] dark:text-[#F4F4F5] mb-2">
                A Solução Desenvolvida
              </h5>
              <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Measurable Results */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C83E62] mb-3">
              Resultados & Evidências de Sucesso
            </h4>
            <ul className="space-y-2.5">
              {project.results.map((res, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA]">
                  <CheckCircle2 className="w-4 h-4 text-[#C83E62] shrink-0 mt-0.5" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Methods */}
          <div className="pt-4 border-t border-[#E6E4DF] dark:border-[#2A2A30]">
            <span className="text-xs font-bold text-[#18181B] dark:text-[#F4F4F5] block mb-2">
              Ferramentas & Metodologias Mobilizadas:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-[#A1A1AA]">
              {project.tools.map((tool, idx) => (
                <React.Fragment key={idx}>
                  <span className="py-1 px-2.5 rounded-lg bg-[#F9F8F6] dark:bg-[#121214] border border-[#E6E4DF] dark:border-[#2A2A30] font-medium">
                    {tool}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#F9F8F6] dark:bg-[#121214] border-t border-[#E6E4DF] dark:border-[#2A2A30] flex items-center justify-between">
          <span className="text-xs text-[#52525B] dark:text-[#A1A1AA]">
            Case study documentado para avaliação profissional.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#C83E62] hover:bg-[#B82A4B] rounded-xl transition-colors"
          >
            Fechar Visualização
          </button>
        </div>

      </div>
    </div>
  );
};
