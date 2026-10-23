import { useEffect, useRef, useState } from "react";
import { Award, BriefcaseBusiness, FolderKanban, GraduationCap, LockKeyhole, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import { useMediaQuery } from "../hooks/useMediaQuery";

export type TabType = "sobre" | "experiencia" | "formacao-ia" | "projetos" | "certificacoes";
export const sectionNames: Record<TabType, string> = {
  sobre: "Sobre mim", experiencia: "Experiência", "formacao-ia": "Formação & IA", projetos: "Projetos", certificacoes: "Certificações",
};
interface Props {
  activeTab: TabType; onSelectTab: (tab: TabType) => void; isDarkMode: boolean;
  onToggleTheme: () => void; onOpenCms: () => void; personal: PortfolioData["personal"]; isAdmin: boolean;
}
export function Header({ activeTab, onSelectTab, isDarkMode, onToggleTheme, onOpenCms, personal, isAdmin }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const compact = useMediaQuery("(max-width: 1179px)");
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const node = header.current;
    if (!node) return;
    const measure = () => document.documentElement.style.setProperty("--header-height", `${node.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--header-height"); };
  }, []);
  useEffect(() => { setMenuOpen(false); }, [compact]);
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);
  function select(tab: TabType) { setMenuOpen(false); onSelectTab(tab); }
  const items = [
    { id: "sobre", icon: UserRound }, { id: "experiencia", icon: BriefcaseBusiness },
    { id: "formacao-ia", icon: GraduationCap }, { id: "projetos", icon: FolderKanban }, { id: "certificacoes", icon: Award },
  ] as const;
  const navigation = (
    <nav id="site-navigation" className={`site-navigation ${menuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
      {items.map(({ id, icon: Icon }) => (
        <button key={id} type="button" aria-current={activeTab === id ? "page" : undefined} className={activeTab === id ? "active" : ""} onClick={() => select(id)}>
          <Icon size={15} aria-hidden="true" /><span>{sectionNames[id]}</span>
        </button>
      ))}
    </nav>
  );
  return (
    <header className="site-header" ref={header}>
      <div className="site-header-inner site-container">
        <button className="site-brand" onClick={() => select("sobre")}>
          <span className="brand-monogram" aria-hidden="true">{personal.name.split(" ").filter(Boolean).map(name => name[0]).slice(0, 2).join("")}</span>
          <span><strong>{personal.name}</strong><small>Estratégia e Comunicação</small></span>
        </button>
        {!compact && navigation}
        <div className="header-actions">
          <button className="theme-switch" type="button" aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"} title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={isDarkMode} onClick={onToggleTheme}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="admin-entry" aria-label={isAdmin ? "Meu estúdio" : "Área admin"} title={isAdmin ? "Meu estúdio" : "Área admin"} onClick={() => { setMenuOpen(false); onOpenCms(); }}>
            <LockKeyhole size={15} /><span>{isAdmin ? "Meu estúdio" : "Área admin"}</span>
          </button>
          {compact && <button ref={menuButton} className="navigation-toggle" type="button" aria-label={menuOpen ? "Fechar navegação" : "Abrir navegação"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(open => !open)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>}
        </div>
        {compact && navigation}
      </div>
    </header>
  );
}
