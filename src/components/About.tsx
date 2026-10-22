import React from "react";
import { Target, MessageCircle, Cpu, Sparkles } from "lucide-react";
import { PortfolioData } from "../data/portfolioData";

interface AboutProps {
  data: PortfolioData;
}

export const About: React.FC<AboutProps> = ({ data }) => {
  const { personal } = data;

  const valueIcons = [
    <Target
      className="w-5 h-5 text-[#C83E62] dark:text-[#E04870]"
      key="target"
    />,
    <MessageCircle
      className="w-5 h-5 text-[#C83E62] dark:text-[#E04870]"
      key="message"
    />,
    <Cpu className="w-5 h-5 text-[#C83E62] dark:text-[#E04870]" key="cpu" />,
  ];

  return (
    <section id="sobre" className="py-10 md:py-14">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C83E62] dark:text-[#E04870] mb-2">
            <span>Trajetória & Essência</span>
            <span aria-hidden="true">·</span>
            <span>{personal.age} anos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] text-balance">
            Quem Sou Eu
          </h2>
        </div>

        {/* Narrative & Strategic Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-start">
          {/* Main Story Paragraphs */}
          <div className="lg:col-span-7 space-y-5 text-[#4B4B54] dark:text-[#9E9EAA] text-base sm:text-lg leading-relaxed font-normal">
            {personal.bioParagraphs.map((para, index) => (
              <p key={index} className="text-balance">
                {para}
              </p>
            ))}

            {/* High-Impact Motto Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#C83E62]/10 via-transparent to-[#B82A4B]/10 border-2 border-[#C83E62]/30 dark:border-[#E04870]/30 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#C83E62] text-white shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#C83E62] dark:text-[#E04870] block">
                    Diretriz Pessoal & Profissional
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-[#141416] dark:text-[#F4F4F7] tracking-tight">
                    "{personal.motto}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Three Structural Pillars */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {personal.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62]/50 transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2.5 rounded-xl bg-[#C83E62]/10 dark:bg-[#E04870]/20 shrink-0">
                    {valueIcons[idx % valueIcons.length]}
                  </div>
                  <h3 className="text-base font-bold text-[#141416] dark:text-[#F4F4F7] tracking-tight">
                    0{idx + 1}. {val.title}
                  </h3>
                </div>
                <p className="text-sm text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed font-normal">
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
