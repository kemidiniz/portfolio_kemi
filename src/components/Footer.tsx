import { ArrowUpRight, LockKeyhole } from "lucide-react";
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
      <div>
        <p className="editorial-kicker">
          SEMPRE EM CONSTRUÇÃO, SEMPRE EM MOVIMENTO.
        </p>
        <strong>{personal.brandTitle}</strong>
        <p>“{personal.motto}”</p>
      </div>
      <div className="footer-links">
        <span>{personal.location}</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Voltar ao início <ArrowUpRight size={15} />
        </button>
        <button onClick={onOpenAdmin}>
          <LockKeyhole size={13} />
          Área administrativa
        </button>
      </div>
    </footer>
  );
}
