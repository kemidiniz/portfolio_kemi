import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../data/portfolioData";

export function Projects({ projects, onSelectProject }: {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const categories = [
    { id: "todos", label: "Todos os Projetos" },
    { id: "pesquisa", label: "Artigos Publicados" },
    { id: "estrategia", label: "Estratégia & CX" },
    { id: "comunicacao", label: "Comunicação & Design" },
    { id: "dados-ia", label: "Dados & IA" },
  ];
  const filtered = activeCategory === "todos" ? projects : projects.filter(project => project.category === activeCategory);
  return (
    <section aria-label="Projetos" id="projetos" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="projects-filters" role="group" aria-label="Filtrar projetos">
          {categories.map(category => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>
              {category.label}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {filtered.map(project => (
            <button className="project-card" key={project.id} onClick={() => onSelectProject(project)} aria-label={`Abrir projeto: ${project.title}`}>
              <div className="project-thumbnail">
                <img src={project.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
                {project.year && <span>{project.year}</span>}
              </div>
              <div className="project-card-content">
                <span className="project-category">{project.categoryLabel}</span>
                <h3>{project.title}</h3>
                <p>{project.tagline}</p>
                <div className="project-card-bottom"><span>{project.tools.slice(0, 2).join(" · ")}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="py-6 text-sm text-[var(--muted)]">Novos projetos em breve.</p>}
      </div>
    </section>
  );
}
