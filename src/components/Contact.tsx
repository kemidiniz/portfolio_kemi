import { useState } from "react";
import { Mail, Linkedin, MessageSquare, Copy, Check, ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "../data/portfolioData";
import { contactLinks } from "../lib/contactLinks";

export function Contact({ data }: { data: PortfolioData }) {
  const { personal } = data;
  const links = contactLinks(personal);
  const [copyStatus, setCopyStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(personal.email.trim());
      setCopyStatus("Copiado!");
    } catch {
      setCopyStatus("Não foi possível copiar");
    }
  }

  const channels = [
    { title: "E-mail", value: personal.email, href: links.email, action: "Escrever e-mail", Icon: Mail },
    { title: "LinkedIn", value: personal.linkedinDisplay, href: links.linkedin, action: "Conectar no LinkedIn", Icon: Linkedin },
    { title: "WhatsApp", value: personal.whatsappDisplay, href: links.whatsapp, action: "Abrir conversa no WhatsApp", Icon: MessageSquare },
  ];

  return (
    <section id="contato" className="py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <h2 className="contact-heading">Conexões Diretas <span aria-hidden="true">·</span> Vamos Conversar</h2>
        <div className="contact-grid">
          {channels.map(({ title, value, href, action, Icon }) => (
            <article className="contact-card" key={title}>
              <header>
                <Icon size={24} aria-hidden="true" />
                {title === "E-mail" && (
                  <button onClick={copyEmail} aria-label="Copiar e-mail">
                    {copyStatus === "Copiado!" ? <Check size={14} /> : <Copy size={14} />}
                    <span aria-live="polite">{copyStatus || "Copiar"}</span>
                  </button>
                )}
              </header>
              <h3>{title}</h3>
              <p>{value}</p>
              <a href={href} {...(title !== "E-mail" ? { target: "_blank", rel: "noreferrer" } : {})}>
                {action} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
