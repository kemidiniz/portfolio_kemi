import { useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
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
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!project) return;
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      before?.focus();
    };
  }, [project?.id]);
  if (!project) return null;
  return (
    <div
      className="project-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close.current();
      }}
    >
      <div
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialog}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close.current();
          }
          if (e.key === "Tab") {
            const nodes =
              dialog.current?.querySelectorAll<HTMLElement>("button,a[href]");
            const first = nodes?.[0],
              last = nodes?.[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
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
        <div className="project-dialog-body">
          <div className="project-cover">
            <img src={project.image} alt="" />
            <div>
              <p>
                {project.categoryLabel} · {project.year}
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
