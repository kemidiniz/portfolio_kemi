import React, { useState, useEffect } from 'react';
import { X, Printer, Copy, Check, Download, Mail, Linkedin, Phone, MapPin } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';

interface ResumeModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ data, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { personal, experiences, education, techImmersions, projects, certifications, skills } = data;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textResume = `
KEMILY DINIZ (KEMI)
Estratégia e Comunicação com Dados & IA
São Paulo, SP · ${personal.email} · ${personal.linkedinDisplay}
"${personal.motto}"

RESUMO PROFISSIONAL
${personal.bioParagraphs.join('\n\n')}

EXPERIÊNCIA PROFISSIONAL
${experiences
  .map(
    (e) => `• ${e.role} — ${e.company} (${e.period})
  ${e.summary}
  Principais entregas:
  ${e.achievements.map((a) => `  - ${a}`).join('\n')}
  Competências: ${e.skills.join(', ')}`
  )
  .join('\n\n')}

PUBLICAÇÕES ACADÊMICAS (2 ARTIGOS)
• Metodologias Ágeis e seus impactos nas atividades dos colaboradores em educação corporativa (Autora, 2023)
• Consumo Digital por Jovens: Hábitos, Plataformas e Engajamento (Autora, 2024)

FORMAÇÃO ACADÊMICA
${education.map((ed) => `• ${ed.degree} em ${ed.field} — ${ed.institution} (${ed.period}) · ${ed.status}`).join('\n')}

FORMAÇÃO EM TECNOLOGIA & IA
${techImmersions.map((ti) => `• ${ti.program} — ${ti.organization} (${ti.year}): ${ti.description}`).join('\n')}

CERTIFICAÇÕES EXECUTIVAS
${certifications.map((c) => `• ${c.title} — ${c.institution} (${c.year})`).join('\n')}

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
              Currículo Profissional — Kemily Diniz (Kemi)
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
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
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
              KEMILY DINIZ <span className="text-lg font-bold text-[#C83E62] dark:text-[#E04870]">(Kemi)</span>
            </h1>
            <p className="text-base font-bold text-[#C83E62] dark:text-[#E04870] mt-1">
              Estratégia e Comunicação com Dados & IA
            </p>
            <p className="text-xs italic text-[#4B4B54] dark:text-[#9E9EAA] mt-1">
              "{personal.motto}"
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B4B54] dark:text-[#9E9EAA] mt-3 font-medium">
              <span>São Paulo, SP · Brasil</span>
              <span>•</span>
              <span>{personal.email}</span>
              <span>•</span>
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-[#C83E62] dark:text-[#E04870] font-bold">
                {personal.linkedinDisplay}
              </a>
              <span>•</span>
              <span>23 Anos</span>
            </div>
          </div>

          {/* Section: Resumo Profissional */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
              Resumo Profissional
            </h2>
            <p className="text-xs sm:text-sm text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed">
              Profissional de 23 anos com trajetória no Banco Bradesco e consultorias corporativas, combinando visão analítica de negócios, comunicação orientada a dados e aplicação de inteligência artificial generativa. Experiência como Analista de Estratégia e na Unidade de Finanças em Endomarketing e Comunicação, estruturando relatórios analíticos, dashboards gerenciais no Power BI e narrativas de engajamento. Autora de 2 pesquisas científicas publicadas sobre Metodologias Ágeis e Consumo Digital por Jovens.
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
                    <span>{exp.role} — <span className="font-bold text-[#C83E62] dark:text-[#E04870]">{exp.company}</span></span>
                    <span className="text-xs font-semibold tabular-nums text-[#4B4B54] dark:text-[#9E9EAA]">{exp.period}</span>
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
              Pesquisas & Produção Acadêmica (2 Artigos Publicados)
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-bold text-[#141416] dark:text-[#F4F4F7]">
                  • Metodologias Ágeis e seus impactos nas atividades dos colaboradores em educação corporativa (2023)
                </p>
                <p className="text-[#4B4B54] dark:text-[#9E9EAA] pl-3">
                  Autora Principal. Investigação sobre Scrum e Kanban no aumento de autonomia e eficiência em T&D corporativo.
                </p>
              </div>
              <div>
                <p className="font-bold text-[#141416] dark:text-[#F4F4F7]">
                  • Consumo Digital por Jovens: Comportamento, Plataformas e Hábitos de Engajamento (2024)
                </p>
                <p className="text-[#4B4B54] dark:text-[#9E9EAA] pl-3">
                  Autora Principal. Estudo empírico sobre padrões de engajamento, redes sociais verticais e tomada de decisão da Geração Z.
                </p>
              </div>
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
                      {edu.institution} · <span className="tabular-nums font-semibold">{edu.period}</span> ({edu.status})
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
                <p className="font-bold text-[#141416] dark:text-[#F4F4F7]">
                  Curso de Inteligência Artificial — &#123;reprograma&#125; (2024)
                </p>
                <p className="text-[#4B4B54] dark:text-[#9E9EAA]">
                  Fundamentos de Machine Learning, Ética em Algoritmos e Engenharia de Prompt.
                </p>
                <p className="text-[11px] text-[#C83E62] dark:text-[#E04870] font-semibold">
                  Imersões: PrograMaria Summit · WoMakersCode · IA Week · Summit Bradesco
                </p>
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
                    <span className="font-bold text-[#141416] dark:text-[#F4F4F7]">{c.title}</span> — {c.institution} ({c.year})
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] border-b border-[#DCD9D0] dark:border-[#282832] pb-1 mb-2.5">
                Habilidades & Ferramentas
              </h2>
              <p className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed">
                Power BI, Excel Avançado, PowerPoint Executivo, Modelagem de KPIs, Planejamento Estratégico, Customer Experience (CX), Metodologias Ágeis, Canva Pro, Photoshop, Capcut, Trello, Ecossistema Microsoft 365, IA Generativa.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
