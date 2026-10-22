import {
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
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
  const items = [
    { id: "sobre", label: "Sobre mim", icon: UserRound },
    { id: "experiencia", label: "Experiência", icon: BriefcaseBusiness },
    { id: "formacao-ia", label: "Formação & IA", icon: GraduationCap },
    { id: "projetos", label: "Projetos", icon: FolderKanban },
    { id: "certificacoes", label: "Certificações", icon: Award },
    { id: "contato", label: "Contato", icon: Mail },
  ] as const;
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          className="site-brand"
          onClick={() => onSelectTab("sobre")}
          aria-label={`${personal.brandTitle} — início`}
        >
          <span className="brand-monogram" aria-hidden="true">
            {personal.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>
            <strong>{personal.brandTitle}</strong>
            <small>Comunicação, estratégia, dados & IA</small>
          </span>
        </button>
        <nav className="site-navigation" aria-label="Navegação principal">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={activeTab === id ? "page" : undefined}
              className={activeTab === id ? "active" : ""}
              onClick={() => onSelectTab(id)}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-switch"
            type="button"
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            aria-pressed={isDarkMode}
            onClick={onToggleTheme}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="admin-entry"
            aria-label={isAdmin ? "Meu estúdio" : "Área admin"}
            onClick={onOpenCms}
          >
            <LockKeyhole size={15} />
            <span>{isAdmin ? "Meu estúdio" : "Área admin"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
