import { useLayoutEffect, useRef } from "react";
import { ArrowUp, Linkedin, Mail, MessageCircle } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import { contactLinks } from "../lib/contactLinks";

export function Footer({ personal }: {
  personal: PortfolioData["personal"];
}) {
  const footerRef = useRef<HTMLElement>(null);
  const links = contactLinks(personal);
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const site = footer?.closest<HTMLElement>(".portfolio-site");
    if (!footer || !site) return;
    const measure = () => site.style.setProperty("--contact-footer-height", `${footer.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    return () => { observer.disconnect(); site.style.removeProperty("--contact-footer-height"); };
  }, []);
  return (
    <footer className="site-footer" ref={footerRef} aria-label="Contatos permanentes">
      <div className="site-footer-inner">
        <div className="footer-brand"><strong>{personal.name}</strong></div>
        <nav className="footer-links" aria-label="Contatos do rodapé">
          <a href={links.email} aria-label={`E-mail: ${personal.email}`}>
            <Mail size={16} /><span className="footer-email-address">{personal.email}</span><span className="footer-short-label">E-mail</span>
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn</a>
          <a href={links.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp</a>
          <button className="footer-top" aria-label="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp size={16} /></button>
        </nav>
      </div>
    </footer>
  );
}
