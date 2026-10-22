import { ArrowUpRight, Download, Linkedin, Mail } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import type { TabType } from "./Header";
export function Hero({
  data,
  onOpenResume,
  onNavigateToTab,
}: {
  data: PortfolioData;
  onOpenResume: () => void;
  onNavigateToTab: (tab: TabType) => void;
}) {
  const { personal } = data;
  return (
    <section className="editorial-hero">
      <div className="hero-intro">
        <div className="editorial-kicker">
          <span className="kicker-line" />
          PORTFÓLIO PROFISSIONAL ·{" "}
          {personal.nickname.toLocaleUpperCase("pt-BR")}
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-hello">Olá, eu sou {personal.name}.</p>
            <h1>
              {personal.headline}
              <span className="headline-period">.</span>
            </h1>
            <p className="hero-description">{personal.subtitle}</p>
            <div className="hero-actions">
              <button
                className="editorial-primary"
                onClick={() => onNavigateToTab("projetos")}
              >
                Explore meus projetos <ArrowUpRight size={19} />
              </button>
              <button className="editorial-secondary" onClick={onOpenResume}>
                <Download size={16} />
                Meu currículo
              </button>
            </div>
            <div className="hero-links">
              <a href={personal.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={15} />
                LinkedIn
              </a>
              <a href={`mailto:${personal.email}`}>
                <Mail size={15} />
                <span>Entre em contato</span>
              </a>
            </div>
          </div>
          <div className="hero-collage">
            <div className="collage-outline" />
            <span className="collage-note">um pouco de quem sou</span>
            <figure className="portrait-paper">
              <span className="paper-tape" aria-hidden="true" />
              <img
                src={personal.avatarUrl}
                alt={`Retrato de ${personal.name}`}
              />
              <figcaption>
                <span>{personal.nickname}, em constante movimento.</span>
                <span aria-hidden="true">✳︎</span>
              </figcaption>
            </figure>
            <div className="availability-note">
              <span className="availability-dot" />
              {personal.statusBadge}
            </div>
            <span className="collage-index">01 / SOBRE MIM</span>
          </div>
        </div>
        <div className="hero-bottom-line">
          <span>{personal.location}</span>
          <span>
            Conectando pessoas, ideias e possibilidades{" "}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
      <div className="editorial-metrics">
        {personal.metrics.map((metric, index) => (
          <div key={index}>
            <span className="metric-index">/ 0{index + 1}</span>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>{metric.detail}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
