import { ArrowUp, LockKeyhole } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
export function Footer({
  personal,
  onOpenAdmin,
}: {
  personal: PortfolioData["personal"];
  onOpenAdmin: () => void;
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <strong>{personal.brandTitle}</strong>
          <span>{personal.motto}</span>
        </div>
        <div className="footer-links">
          <span>{personal.location}</span>
          <button onClick={onOpenAdmin}>
            <LockKeyhole size={13} />
            Área administrativa
          </button>
          <button
            className="footer-top"
            aria-label="Voltar ao topo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
