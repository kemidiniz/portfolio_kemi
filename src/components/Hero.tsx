import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  MapPin,
} from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import { ResponsiveImage } from "./ResponsiveImage";
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
  const currentExperience = data.experiences[0];
  return (
    <section className="profile-hero" aria-label="Apresentação">
      <div className="profile-grid">
        <div className="profile-heading">
          <p className="profile-greeting">{personal.headline}</p>
          <h1>Oie, sou a <span>{personal.nickname}!</span></h1>
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
              <FileText size={16} />
              Ver currículo
            </button>
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
          <ResponsiveImage
            src={personal.avatarUrl}
            alt={`Retrato de ${personal.name}`}
            fetchPriority="high"
            sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1179px) 42vw, 500px"
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
