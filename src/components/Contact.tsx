import React, { useState } from "react";
import {
  Mail,
  Linkedin,
  MessageSquare,
  Copy,
  Check,
  ArrowUpRight,
  FileText,
  Download,
} from "lucide-react";
import { PortfolioData } from "../data/portfolioData";

interface ContactProps {
  data: PortfolioData;
  onOpenResume: () => void;
}

export const Contact: React.FC<ContactProps> = ({ data, onOpenResume }) => {
  const { personal } = data;
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contato" className="py-8 md:py-12">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine)] mb-2">
            <span>Conexões Diretas</span>
            <span aria-hidden="true">·</span>
            <span>Vamos Conversar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)] text-balance">
            Canais de Contato
          </h2>
          <p className="mt-2 text-base text-[var(--muted)] leading-relaxed font-normal">
            Entre em contato diretamente comigo pelos canais oficiais para
            oportunidades, consultorias, trocas sobre estratégias de dados ou
            projetos de inteligência artificial.
          </p>
        </div>

        {/* High-Impact Direct Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* E-mail Card */}
          <div className="p-7 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-xl bg-[var(--button-bg)]/10 dark:bg-[var(--button-bg)]/20 text-[var(--wine)] group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--rule)] text-[var(--muted)] hover:text-[var(--wine)] dark:hover:text-[var(--wine)] transition-colors cursor-pointer"
                  title="Copiar e-mail"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedEmail ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[var(--wine)] block mb-1">
                E-mail Profissional
              </span>
              <h3 className="text-lg font-bold text-[var(--ink)] break-all">
                {personal.email}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-2 font-normal">
                Canal principal para convites, propostas formais e parcerias
                corporativas.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--rule)]">
              <a
                href={`mailto:${personal.email}?subject=${encodeURIComponent(`Contato via ${personal.brandTitle}`)}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--wine)] hover:underline"
              >
                <span>Escrever e-mail agora</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="p-7 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-xl bg-[var(--button-bg)]/10 dark:bg-[var(--button-bg)]/20 text-[var(--wine)] group-hover:scale-105 transition-transform">
                  <Linkedin className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--surface-hover)] text-[var(--muted)]">
                  Perfil Verificado
                </span>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[var(--wine)] block mb-1">
                Rede Profissional
              </span>
              <h3 className="text-lg font-bold text-[var(--ink)]">LinkedIn</h3>
              <p className="text-xs text-[var(--muted)] mt-2 font-normal">
                {personal.linkedinDisplay}
              </p>
              <p className="text-xs text-[var(--muted)] mt-1 font-normal">
                Acompanhe meus artigos, posts sobre tendências de dados e
                conexões.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--rule)]">
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--wine)] hover:underline"
              >
                <span>Conectar no LinkedIn</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="p-7 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)] dark:hover:border-[var(--wine)] transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-xl bg-[var(--button-bg)]/10 dark:bg-[var(--button-bg)]/20 text-[var(--wine)] group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--surface-hover)] text-[var(--muted)]">
                  Contato Direto
                </span>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[var(--wine)] block mb-1">
                Mensagem Instantânea
              </span>
              <h3 className="text-lg font-bold text-[var(--ink)]">WhatsApp</h3>
              <p className="text-xs text-[var(--muted)] mt-2 font-normal">
                Comunicação rápida para recrutadores e alinhamentos pontuais.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--rule)]">
              <a
                href={personal.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--wine)] hover:underline"
              >
                <span>Abrir conversa no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Curriculum Callout Banner */}
        <div className="p-7 sm:p-8 rounded-2xl bg-gradient-to-r from-[var(--wine)]/12 via-[var(--wine)]/5 to-transparent border-2 border-[var(--wine)]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-[var(--button-bg)] text-white shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--ink)]">
                Currículo Profissional Completo
              </h4>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-0.5 font-normal">
                Visualização formatada para recrutadores, disponível para
                download direto em PDF ou impressão.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenResume}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Visualizar e Baixar Currículo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
