import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
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
Power BI, Excel Avançado, Gestão de KPIs, Comunicação Estratégica, Endomarketing, Canva Pro, Photoshop, Capcut, Engenharia de Prompts com IA.
    `.trim();

    navigator.clipboard.writeText(textResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Outer Modal Container */}
      <div
        className="relative w-full max-w-4xl my-6 bg-white dark:bg-[#141419] rounded-3xl border-2 border-[#DCD9D0] dark:border-[#282832] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 sm:p-5 bg-[#F8F7F4] dark:bg-[#0B0B0E] border-b border-[#DCD9D0] dark:border-[#282832] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#141416] dark:text-[#F4F4F7]">
              Currículo Profissional — {personal.name} ({personal.nickname})
            </span>
            <span className="text-xs text-[#C83E62] dark:text-[#E04870] font-semibold hidden sm:inline">
              (Formato A4 Otimizado para Recrutadores)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] hover:border-[#C83E62] transition-colors cursor-pointer"
              title="Copiar texto simples para colar no LinkedIn ou ATS"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copiado!" : "Copiar Texto"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-[#C83E62] hover:bg-[#A82447] text-white transition-all shadow-xs cursor-pointer"
              title="Salvar como arquivo PDF ou imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Salvar em PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 rounded-lg text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#141416] dark:hover:text-[#F4F4F7] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Curriculum Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-white dark:bg-[#141419] text-[#141416] dark:text-[#F4F4F7] print-page">
          {/* CV Header */}
          <div className="border-b-2 border-[#141416] dark:border-[#F4F4F7] pb-6 mb-6">
            <h1 className="text-3xl font-black tracking-tight">
              {personal.name.toUpperCase()}{" "}
              <span className="text-lg font-bold text-[#C83E62] dark:text-[#E04870]">
                ({personal.nickname})
              </span>
            </h1>
            <p className="text-base font-bold text-[#C83E62] dark:text-[#E04870] mt-1">
              {personal.headline}
            </p>
            <p className="text-xs italic text-[#4B4B54] dark:text-[#9E9EAA] mt-1">
              "{personal.motto}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B4B54] dark:text-[#9E9EAA] mt-3 font-medium">
              <span>{personal.location}</span>
              <span>•</span>
              <span>{personal.email}</span>
              <span>•</span>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-[#C83E62] dark:text-[#E04870] font-bold"
              >
                {personal.linkedinDisplay}
              </a>
              <span>•</span>
              <span>{personal.age} anos</span>
            </div>
          </div>

          {/* Section: Resumo Profissional */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
              Resumo Profissional
            </h2>
            <p className="text-xs sm:text-sm text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed">
              {personal.bioParagraphs.join(" ")}
            </p>
          </div>

          {/* Section: Experiência Profissional */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-3">
              Experiência Profissional
            </h2>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 font-black text-[#141416] dark:text-[#F4F4F7]">
                    <span>
                      {exp.role} —{" "}
                      <span className="font-bold text-[#C83E62] dark:text-[#E04870]">
                        {exp.company}
                      </span>
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-[#4B4B54] dark:text-[#9E9EAA]">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] mt-1 mb-1.5">
                    {exp.summary}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
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
            <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
                Formação Acadêmica
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-[#141416] dark:text-[#F4F4F7]">
                      {edu.field} ({edu.degree})
                    </p>
                    <p className="text-[#4B4B54] dark:text-[#9E9EAA]">
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
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
              <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
                Certificações Principais
              </h2>
              <ul className="space-y-1.5 text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <span className="font-bold text-[#141416] dark:text-[#F4F4F7]">
                      {c.title}
                    </span>{" "}
                    — {c.institution} ({c.year})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
                Habilidades & Ferramentas
              </h2>
              <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed">
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
