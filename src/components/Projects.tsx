import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { ProjectItem } from "../data/portfolioData";
import { ResponsiveImage } from "./ResponsiveImage";
import { useMediaQuery } from "../hooks/useMediaQuery";

function ProjectCard({ project, onOpen, duplicate = false }: { project: ProjectItem; onOpen: () => void; duplicate?: boolean }) {
  const id = useId();
  return (
    <article className="project-card" data-project-id={project.id}>
      <div className="project-thumbnail" aria-hidden="true">
        <ResponsiveImage src={project.image} alt="" loading="lazy" sizes="(max-width: 600px) 85vw, 320px" />
        {project.year && <span>{project.year}</span>}
      </div>
      <div className="project-card-content">
        <span className="project-category">{project.categoryLabel}</span>
        <h3><button className="project-open" onPointerDown={event => { if (duplicate) event.preventDefault(); }} onClick={onOpen} tabIndex={duplicate ? -1 : undefined} aria-haspopup="dialog" aria-describedby={`${id}-description`}>{project.title}</button></h3>
        <p id={`${id}-description`}>{project.tagline}</p>
        <div className="project-card-bottom"><span>{project.tools.slice(0, 2).join(" · ")}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      </div>
    </article>
  );
}

function ProjectCarousel({ projects, onSelectProject, modalOpen, paused, onTogglePause }: { projects: ProjectItem[]; onSelectProject: (project: ProjectItem) => void; modalOpen: boolean; paused: boolean; onTogglePause: () => void }) {
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const cycle = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [loop, setLoop] = useState(false);
  const id = useId();

  useLayoutEffect(() => {
    const node = viewport.current, items = group.current;
    if (!node || !items) return;
    const measure = () => {
      cycle.current = items.getBoundingClientRect().width;
      const overflowing = cycle.current > node.clientWidth + 1;
      setLoop(overflowing);
      node.scrollLeft = overflowing && loop ? cycle.current : 0;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node); observer.observe(items);
    return () => observer.disconnect();
  }, [projects, loop]);
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(node);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); clearTimeout(timer.current); };
  }, []);
  const moving = loop && !reduced && !paused && !hovered && !focused && !interacting && !modalOpen && visible && pageVisible;
  useEffect(() => {
    if (!moving) return;
    const node = viewport.current!;
    let frame = 0, previous = 0, position = node.scrollLeft;
    const tick = (now: number) => {
      if (previous) position += Math.min(now - previous, 64) * 0.024;
      previous = now;
      if (cycle.current && position >= cycle.current * 2) position -= cycle.current;
      node.scrollLeft = position;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  function pauseForInteraction() {
    clearTimeout(timer.current);
    setInteracting(true);
    timer.current = setTimeout(() => setInteracting(false), 4000);
  }
  function normalizeScroll() {
    const node = viewport.current;
    if (!node || !loop || !cycle.current) return;
    // Identical visual sets on both sides allow native touch scrolling across the seam.
    if (node.scrollLeft >= cycle.current * 2) node.scrollLeft -= cycle.current;
    else if (node.scrollLeft < cycle.current - 1) node.scrollLeft += cycle.current;
  }
  function step(direction: number) {
    pauseForInteraction();
    const node = viewport.current;
    const card = group.current?.firstElementChild as HTMLElement | undefined;
    node?.scrollBy({ left: direction * ((card?.offsetWidth ?? 300) + 18), behavior: reduced ? "instant" : "smooth" });
  }
  function open(project: ProjectItem, duplicate: boolean) {
    if (duplicate) {
      const index = projects.indexOf(project);
      group.current?.children[index]?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }
    onSelectProject(project);
  }
  const cards = (duplicate: boolean) => projects.map(project => <ProjectCard key={project.id} project={project} duplicate={duplicate} onOpen={() => open(project, duplicate)} />);
  return (
    <div className="project-carousel" role="region" aria-roledescription="carrossel" aria-label="Projetos selecionados" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <p id={`${id}-instructions`} className="sr-only">Explore os projetos. Deslize ou use as setas.</p>
      <div ref={viewport} className="carousel-viewport" tabIndex={0} role="group" aria-label="Cards de projetos" aria-describedby={`${id}-instructions`} onScroll={normalizeScroll} onPointerDown={() => { clearTimeout(timer.current); setInteracting(true); }} onPointerUp={pauseForInteraction} onPointerCancel={pauseForInteraction} onWheel={pauseForInteraction} onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
      }}>
        <div className="carousel-track">
          {loop && <div className="carousel-set" aria-hidden="true">{cards(true)}</div>}
          <div ref={group} className="carousel-set carousel-originals">{cards(false)}</div>
          {loop && <div className="carousel-set" aria-hidden="true">{cards(true)}</div>}
        </div>
      </div>
      <div className="carousel-controls">
          <button onClick={onTogglePause} disabled={reduced || !loop} aria-label={reduced ? "Sem animação: movimento automático desativado" : paused ? "Retomar movimento dos projetos" : "Pausar movimento dos projetos"} aria-pressed={paused || reduced} title={reduced ? "Sua preferência de movimento reduzido está ativa" : undefined}>{paused || reduced ? <Play size={16} /> : <Pause size={16} />}<span>{reduced ? "Sem animação" : paused ? "Retomar" : "Pausar"}</span></button>
          <button aria-label="Projetos anteriores" onClick={() => step(-1)} disabled={!loop}><ChevronLeft size={19} /></button>
          <button aria-label="Próximos projetos" onClick={() => step(1)} disabled={!loop}><ChevronRight size={19} /></button>
      </div>
    </div>
  );
}

export function Projects({ projects, onSelectProject, modalOpen }: { projects: ProjectItem[]; onSelectProject: (project: ProjectItem) => void; modalOpen: boolean }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [paused, setPaused] = useState(false);
  const categories = [
    { id: "todos", label: "Todos os Projetos" }, { id: "pesquisa", label: "Artigos Publicados" },
    { id: "estrategia", label: "Estratégia & CX" }, { id: "comunicacao", label: "Comunicação & Design" }, { id: "dados-ia", label: "Dados & IA" },
  ];
  const filtered = useMemo(() => activeCategory === "todos" ? projects : projects.filter(project => project.category === activeCategory), [projects, activeCategory]);
  return (
    <section aria-label="Projetos" id="projetos" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="projects-filters" role="group" aria-label="Filtrar projetos">
          {categories.map(category => <button key={category.id} onClick={() => setActiveCategory(category.id)} aria-pressed={activeCategory === category.id}>{category.label}</button>)}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "projeto" : "projetos"}</p>
        {filtered.length > 0 ? <ProjectCarousel key={activeCategory} projects={filtered} onSelectProject={onSelectProject} modalOpen={modalOpen} paused={paused} onTogglePause={() => setPaused(value => !value)} /> : <p className="py-6 text-sm text-[var(--muted)]">Novos projetos em breve.</p>}
      </div>
    </section>
  );
}
