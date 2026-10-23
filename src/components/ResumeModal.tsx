import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  Mail,
  Linkedin,
  Phone,
  MapPin,
} from "lucide-react";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { PortfolioData } from "../data/portfolioData";

interface ResumeModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const {
    personal,
    experiences,
    education,
    techImmersions,
    projects,
    certifications,
    skills,
  } = data;

  const dialog = useRef<HTMLDivElement>(null);
  const [copyError, setCopyError] = useState("");
  useDialogFocus(dialog, isOpen, onClose);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    const textResume = `
${personal.name.toUpperCase()} (${personal.nickname})
${personal.headline}
${personal.location} · ${personal.email} · ${personal.linkedinDisplay}
"${personal.motto}"

RESUMO PROFISSIONAL
${personal.bioParagraphs.join("\n\n")}

EXPERIÊNCIA PROFISSIONAL
${experiences
  .map(
    (e) => `• ${e.role} — ${e.company} (${e.period})
  ${e.summary}
  Principais entregas:
  ${e.achievements.map((a) => `  - ${a}`).join("\n")}
  Competências: ${e.skills.join(", ")}`,
  )
  .join("\n\n")}

PROJETOS E PUBLICAÇÕES
${data.projects.map((p) => `• ${p.title} (${p.year}) — ${p.tagline}`).join("\n")}

FORMAÇÃO ACADÊMICA
${education.map((ed) => `• ${ed.degree} em ${ed.field} — ${ed.institution} (${ed.period}) · ${ed.status}`).join("\n")}

FORMAÇÃO EM TECNOLOGIA & IA
${techImmersions.map((ti) => `• ${ti.program} — ${ti.organization} (${ti.year}): ${ti.description}`).join("\n")}

CERTIFICAÇÕES EXECUTIVAS
${certifications.map((c) => `• ${c.title} — ${c.institution} (${c.year})`).join("\n")}

COMPETÊNCIAS & FERRAMENTAS
${skills.map(group => `${group.category}: ${group.items.map(item => item.name).join(", ")}`).join("\n")}
    `.trim();

    setCopyError("");
    setCopied(false);
    try {
      await navigator.clipboard.writeText(textResume);
      setCopied(true);
    } catch {
      setCopyError("Não foi possível copiar. Selecione o texto do currículo ou tente novamente.");
    }
  };

  return (
    <div data-modal-layer className="resume-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[var(--palette-dark)]/80 backdrop-blur-md overflow-y-auto">
      {/* Outer Modal Container */}
      <div
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
        className="resume-dialog relative w-full max-w-4xl my-6 bg-[var(--paper-light)] rounded-3xl border border-[var(--rule)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="resume-toolbar no-print p-4 sm:p-5 bg-[var(--paper)] border-b border-[var(--rule)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span id="resume-title" className="font-extrabold text-sm text-[var(--ink)]">
              Currículo Profissional — {personal.name} ({personal.nickname})
            </span>
            <span className="text-xs text-[var(--wine)] font-semibold hidden sm:inline">
              (Formato A4 Otimizado para Recrutadores)
            </span>
          </div>

          <div className="resume-actions flex items-center gap-2.5">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--wine)] transition-colors cursor-pointer"
              title="Copiar texto simples para colar no LinkedIn ou ATS"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[var(--wine)]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--palette-light)] transition-all shadow-xs cursor-pointer"
              title="Salvar como arquivo PDF ou imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Salvar em PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] dark:hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p role="status" className={copyError ? "copy-feedback" : "sr-only"}>{copyError || (copied ? "Texto do currículo copiado." : "")}</p>
        {/* Printable Curriculum Sheet */}
        <div tabIndex={0} role="region" aria-label="Conteúdo do currículo" className="p-6 sm:p-10 overflow-y-auto bg-[var(--paper-light)] text-[var(--ink)] print-page">
          {/* CV Header */}
          <div className="border-b-2 border-[var(--ink)] pb-6 mb-6">
            <h1 className="text-3xl font-black tracking-tight">
              {personal.name.toUpperCase()}{" "}
              <span className="text-lg font-bold text-[var(--wine)]">
                ({personal.nickname})
              </span>
            </h1>
            <p className="text-base font-bold text-[var(--wine)] mt-1">
              {personal.headline}
            </p>
            <p className="text-xs italic text-[var(--muted)] mt-1">
              "{personal.motto}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] mt-3 font-medium">
              <span>{personal.location}</span>
              <span>•</span>
              <span>{personal.email}</span>
              <span>•</span>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-[var(--wine)] font-bold"
              >
                {personal.linkedinDisplay}
              </a>
              <span>•</span>
              <span>{personal.age} anos</span>
            </div>
          </div>

          {/* Section: Resumo Profissional */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
              Resumo Profissional
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              {personal.bioParagraphs.join(" ")}
            </p>
          </div>

          {/* Section: Experiência Profissional */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-3">
              Experiência Profissional
            </h2>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 font-black text-[var(--ink)]">
                    <span>
                      {exp.role} —{" "}
                      <span className="font-bold text-[var(--wine)]">
                        {exp.company}
                      </span>
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-[var(--muted)]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1 mb-1.5">
                    {exp.summary}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)]">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="leading-snug">
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Artigos Acadêmicos Publicados */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
              Projetos & Publicações
            </h2>
            <div className="space-y-3 text-xs">
              {projects.map((project) => (
                <div key={project.id}>
                  <p className="font-bold">
                    {project.title} ({project.year})
                  </p>
                  <p>{project.tagline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Formação Acadêmica & IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
                Formação Acadêmica
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-[var(--ink)]">
                      {edu.field} ({edu.degree})
                    </p>
                    <p className="text-[var(--muted)]">
                      {edu.institution} ·{" "}
                      <span className="tabular-nums font-semibold">
                        {edu.period}
                      </span>{" "}
                      ({edu.status})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
                Formação em Tecnologia & IA
              </h2>
              <div className="space-y-3 text-xs">
                {techImmersions.map((item) => (
                  <div key={item.id}>
                    <p className="font-bold">
                      {item.program} — {item.organization} ({item.year})
                    </p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Certificações & Hard Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
                Certificações Principais
              </h2>
              <ul className="space-y-1.5 text-xs text-[var(--muted)]">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <span className="font-bold text-[var(--ink)]">
                      {c.title}
                    </span>{" "}
                    — {c.institution} ({c.year})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[var(--wine)] border-b border-[var(--rule)] pb-1 mb-2.5">
                Habilidades & Ferramentas
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {skills
                  .flatMap((group) => group.items.map((item) => item.name))
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
