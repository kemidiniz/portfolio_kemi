import React from "react";
import { Moon, Sun, LockKeyhole, ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
export type TabType =
  | "sobre"
  | "experiencia"
  | "formacao-ia"
  | "projetos"
  | "certificacoes"
  | "contato";
interface Props {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCms: () => void;
  personal: PortfolioData["personal"];
  isAdmin: boolean;
}
export function Header({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onOpenCms,
  personal,
  isAdmin,
}: Props) {
  const items: { id: TabType; label: string }[] = [
    { id: "sobre", label: "Sobre mim" },
    { id: "experiencia", label: "Trajetória" },
    { id: "formacao-ia", label: "Formação & IA" },
    { id: "projetos", label: "Projetos" },
    { id: "certificacoes", label: "Repertório" },
    { id: "contato", label: "Contato" },
  ];
  return (
    <header className="site-header">
      <div className="site-header-top">
        <button className="site-brand" onClick={() => onSelectTab("sobre")}>
          <span className="brand-monogram">
            {personal.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>
            <strong>{personal.brandTitle}</strong>
            <small>ideias, percurso & possibilidades</small>
          </span>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="theme-switch"
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            onClick={onToggleTheme}
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="admin-entry"
            aria-label={isAdmin ? "Meu estúdio" : "Área admin"}
            onClick={onOpenCms}
          >
            <LockKeyhole size={14} />
            <span>{isAdmin ? "Meu estúdio" : "Área admin"}</span>
          </button>
          <button
            className="header-contact"
            onClick={() => onSelectTab("contato")}
          >
            Vamos conversar <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
      <nav className="site-navigation" aria-label="Navegação principal">
        {items.map((item, index) => (
          <button
            key={item.id}
            aria-current={activeTab === item.id ? "page" : undefined}
            className={activeTab === item.id ? "active" : ""}
            onClick={() => onSelectTab(item.id)}
          >
            <span>0{index + 1}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
