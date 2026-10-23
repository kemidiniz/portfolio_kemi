import { useId, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ProjectItem } from "../data/portfolioData";
import { ResponsiveImage } from "./ResponsiveImage";

function ProjectCard({ project, onOpen }: { project: ProjectItem; onOpen: () => void }) {
  const id = useId();
  return (
    <article className="project-card" data-project-id={project.id}>
      <div className="project-thumbnail" aria-hidden="true">
        <ResponsiveImage src={project.image} alt="" loading="lazy" sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 46vw, (min-width: 1440px) 310px, 30vw" />
        {project.year && <span>{project.year}</span>}
      </div>
      <div className="project-card-content">
        <span className="project-category">{project.categoryLabel}</span>
        <h3><button className="project-open" onClick={onOpen} aria-haspopup="dialog" aria-describedby={`${id}-description`}>{project.title}</button></h3>
        <p id={`${id}-description`}>{project.tagline}</p>
        <div className="project-card-bottom"><span>{project.tools.slice(0, 2).join(" · ")}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      </div>
    </article>
  );
}

export function Projects({ projects, onSelectProject }: {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const categories = [
    { id: "todos", label: "Todos os Projetos" }, { id: "pesquisa", label: "Artigos Publicados" },
    { id: "estrategia", label: "Estratégia & CX" }, { id: "comunicacao", label: "Comunicação & Design" }, { id: "dados-ia", label: "Dados & IA" },
  ];
  const filtered = activeCategory === "todos" ? projects : projects.filter(project => project.category === activeCategory);
  const featured = activeCategory === "todos" ? projects.find(project => project.id === "portfolio-kemi" && project.featured) ?? projects.find(project => project.featured) : undefined;
  const catalogue = filtered.filter(project => project.id !== featured?.id);
  return (
    <section aria-label="Projetos" id="projetos" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="projects-filters" role="group" aria-label="Filtrar projetos">
          {categories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>{category.label}</button>)}
        </div>
        {featured && <article className="featured-project" data-project-id={featured.id}>
          <div className="featured-project-copy">
            <span className="eyebrow">Em destaque · {featured.categoryLabel}</span>
            <h2><button className="project-open" onClick={() => onSelectProject(featured)} aria-haspopup="dialog">{featured.title}</button></h2>
            <p>{featured.tagline}</p>
            <div className="featured-tools">{featured.tools.slice(0, 4).map(tool => <span key={tool}>{tool}</span>)}</div>
            <span className="featured-link" aria-hidden="true">Conheça as decisões por trás do projeto <ArrowRight size={17} /></span>
          </div>
          <div className={featured.id === "portfolio-kemi" ? "portfolio-preview" : "featured-image"}>
            <ResponsiveImage src={featured.image} alt={featured.id === "portfolio-kemi" ? "Captura real da página de apresentação do portfólio" : ""} sizes="(max-width: 760px) 90vw, 600px" loading="lazy" />
          </div>
        </article>}
        <div className="catalogue-heading"><span className="eyebrow">{featured ? "Explore também" : "Projetos selecionados"}</span><p role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "projeto" : "projetos"}</p></div>
        <div className="projects-grid">
          {catalogue.map(project => <ProjectCard key={project.id} project={project} onOpen={() => onSelectProject(project)} />)}
        </div>
        {filtered.length === 0 && <p className="py-6 text-sm text-[var(--muted)]">Novos projetos em breve.</p>}
      </div>
    </section>
  );
}
