import React from "react";
import { Target, MessageCircle, Cpu, Sparkles, ArrowLeft } from "lucide-react";
import { PortfolioData } from "../data/portfolioData";

interface AboutProps {
  data: PortfolioData;
  onBack: () => void;
}

export const About: React.FC<AboutProps> = ({ data, onBack }) => {
  const { personal } = data;

  const valueIcons = [
    <Target className="w-5 h-5 text-[var(--wine)]" key="target" />,
    <MessageCircle className="w-5 h-5 text-[var(--wine)]" key="message" />,
    <Cpu className="w-5 h-5 text-[var(--wine)]" key="cpu" />,
  ];

  return (
    <section id="sobre" aria-label="Biografia" className="biography-section py-6 md:py-7">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Narrative & Strategic Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-start">
          {/* Main Story Paragraphs */}
          <div className="biography-copy lg:col-span-7 space-y-5 text-[var(--muted)] text-[15px] leading-relaxed font-normal">
            {/* High-Impact Motto Card */}
            <div className="purpose-card p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[var(--wine)]/10 via-transparent to-[var(--wine-hover)]/10 border-2 border-[var(--wine)]/30 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--button-bg)] text-white shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[var(--wine)] block">
                    Propósito Pessoal & Profissional
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-[var(--ink)] tracking-tight">
                    "{personal.motto}"
                  </p>
                </div>
              </div>
            </div>
            {personal.bioParagraphs.map((para, index) => (
              <p key={index} className="text-balance">
                {para}
              </p>
            ))}
            <button className="biography-return" aria-label="Voltar à apresentação" title="Voltar à apresentação" onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Three Structural Pillars */}
          <div className="biography-values lg:col-span-5 flex flex-col gap-4">
            {personal.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 surface-card rounded-2xl bg-[var(--paper-light)] border border-[var(--rule)] hover:border-[var(--wine)]/50 transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2.5 rounded-xl bg-[var(--button-bg)]/10 dark:bg-[var(--button-bg)]/20 shrink-0">
                    {valueIcons[idx % valueIcons.length]}
                  </div>
                  <h3 className="text-base font-bold text-[var(--ink)] tracking-tight">
                    0{idx + 1}. {val.title}
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed font-normal">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
