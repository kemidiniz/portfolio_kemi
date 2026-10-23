import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import { contactLinks } from "../lib/contactLinks";
import type { TabType } from "./Header";
export function Hero({
  data,
  onOpenResume,
  onNavigateToTab,
  onOpenAbout,
}: {
  data: PortfolioData;
  onOpenResume: () => void;
  onNavigateToTab: (tab: TabType) => void;
  onOpenAbout: () => void;
}) {
  const { personal } = data;
  const links = contactLinks(personal);
  const highlight = personal.headline.lastIndexOf("Dados");
  const currentExperience = data.experiences[0];
  return (
    <section className="profile-hero" aria-label="Apresentação">
      <div className="profile-grid">
        <div className="profile-heading">
          <p className="profile-greeting">Oie, sou a {personal.nickname}!</p>
          <h1>
            {highlight > 0 ? (
              <>
                {personal.headline.slice(0, highlight)}
                <span>{personal.headline.slice(highlight)}</span>
              </>
            ) : (
              personal.headline
            )}
          </h1>
          <p className="profile-description">{personal.subtitle}</p>
        </div>
        <div className="profile-copy">
          <div className="profile-actions">
            <button
              className="primary-button"
              onClick={() => onNavigateToTab("projetos")}
            >
              Ver projetos <ArrowUpRight size={18} />
            </button>
            <button className="secondary-button" onClick={onOpenResume}>
              <Download size={16} />
              Baixar currículo
            </button>
          </div>
          <div className="profile-links">
            <a href={links.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a href={links.email}>
              <Mail size={15} />
              E-mail
            </a>
            <a href={links.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
          <button className="profile-about-link" onClick={onOpenAbout}>
            Conheça minha história <ArrowRight size={15} />
          </button>
        </div>
        <div className="profile-metrics" aria-label="Destaques da trajetória">
          {personal.metrics.map((metric, index) => (
            <div className="metric-card" key={index}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <small>{metric.detail}</small>
            </div>
          ))}
        </div>
        <figure className="profile-portrait">
          <img
            src={personal.avatarUrl}
            alt={`Retrato de ${personal.name}`}
            fetchPriority="high"
          />
          <figcaption>
            <span className="portrait-location">
              <MapPin size={13} />
              {personal.location}
            </span>
            <strong>{personal.name}</strong>
            {currentExperience && (
              <span>
                {currentExperience.role} · {currentExperience.company}
              </span>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
