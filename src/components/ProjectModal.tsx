import { useRef } from "react";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { ResponsiveImage } from "./ResponsiveImage";
import { ProjectProcess } from "./ProjectProcess";
import type { ProjectItem } from "../data/portfolioData";

function ProjectText({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
    /^https?:\/\//.test(part)
      ? <a key={index} href={part} target="_blank" rel="noreferrer" className="project-external-link">{part.includes("gemini.google.com") ? "Abrir Agente Gi no Gemini ↗" : "Abrir link do projeto ↗"}</a>
      : part,
  )}</>;
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectItem | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  useDialogFocus(dialog, !!project, onClose);
  if (!project) return null;
  return (
    <div
      className="project-backdrop"
      data-modal-layer
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialog}
        tabIndex={-1}
      >
        <header className="project-dialog-header">
          <span>Detalhes do projeto</span>
          <button
            className="project-close"
            aria-label="Fechar projeto"
            onClick={onClose}
          >
            Fechar <X size={18} />
          </button>
        </header>
        <div className="project-dialog-body" tabIndex={0} role="region" aria-label="Conteúdo do estudo de caso">
          <div className="project-cover">
            <ResponsiveImage src={project.image} alt="" sizes="(max-width: 900px) 95vw, 900px" />
            <div>
              <p>
                {project.categoryLabel}{project.year ? ` · ${project.year}` : ""}
              </p>
              <h2 id="project-modal-title">{project.title}</h2>
            </div>
          </div>
          <div className="project-details">
            <div className="project-context">
              <div>
                <span>Papel e atuação</span>
                <strong>{project.role}</strong>
              </div>
              <div>
                <span>Contexto</span>
                <strong>{project.clientOrContext}</strong>
              </div>
            </div>
            <section>
              <h3>Visão geral</h3>
              <p>{project.overview}</p>
            </section>
            {project.id === "portfolio-kemi" && <ProjectProcess />}
            <div className="project-detail-grid">
              <section>
                <h3>O desafio</h3>
                <p>{project.challenge}</p>
              </section>
              <section>
                <h3>A solução</h3>
                <p><ProjectText text={project.solution} /></p>
              </section>
            </div>
            <section>
              <h3>Resultados</h3>
              <ul>
                {project.results.map((result, i) => (
                  <li key={i}>
                    <CheckCircle2 size={17} />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Ferramentas e metodologias</h3>
              <div className="project-tools">
                {project.tools.map((tool, i) => (
                  <span key={i}>{tool}</span>
                ))}
              </div>
            </section>
          </div>
        </div>
        <footer className="project-dialog-footer">
          <button className="secondary-button" onClick={onClose}>
            <ArrowLeft size={16} />
            Voltar aos projetos
          </button>
        </footer>
      </div>
    </div>
  );
}
