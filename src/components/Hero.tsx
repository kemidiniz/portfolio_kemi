import React from 'react';
import { ArrowRight, Download, Linkedin, Mail, MessageSquare, Sparkles, BookOpen } from 'lucide-react';
import { PortfolioData } from '../data/portfolioData';
import { TabType } from './Header';

interface HeroProps {
  data: PortfolioData;
  onOpenResume: () => void;
  onNavigateToTab: (tab: TabType) => void;
}

export const Hero: React.FC<HeroProps> = ({ data, onOpenResume, onNavigateToTab }) => {
  const { personal } = data;

  return (
    <section className="relative pt-6 pb-12 md:pt-10 md:pb-16">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        
        {/* Split-Screen Hero Grid with expansive desktop proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left Column: Typographic Hierarchy & Clear Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Clean Status Kicker (without duplicate Kemi subtitle) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C83E62]/10 dark:bg-[#E04870]/15 border border-[#C83E62]/30 dark:border-[#E04870]/30 text-[#C83E62] dark:text-[#E04870] text-xs font-bold w-fit mb-5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C83E62] dark:bg-[#E04870]" />
              <span>{personal.statusBadge}</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="text-[#141416] dark:text-[#F4F4F7] font-medium">{personal.location}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] leading-[1.12] mb-5 text-balance">
              Estratégia e Comunicação com <span className="text-[#C83E62] dark:text-[#E04870]">Dados & IA</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4B4B54] dark:text-[#9E9EAA] leading-relaxed mb-8 max-w-3xl font-normal">
              {personal.subtitle}
            </p>

            {/* Primary Action Buttons: Ver Projetos + Baixar Currículo em PDF side-by-side */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => onNavigateToTab('projetos')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C83E62] hover:bg-[#A82447] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 group whitespace-nowrap cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Projetos</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white dark:bg-[#141419] hover:bg-[#F2EFE9] dark:hover:bg-[#1D1D24] text-[#141416] dark:text-[#F4F4F7] text-sm font-semibold border-2 border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62] transition-all shadow-xs whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#C83E62] dark:text-[#E04870]" />
                <span>Baixar Currículo em PDF</span>
              </button>
            </div>

            {/* Direct Social Shortcuts */}
            <div className="flex items-center gap-5 text-xs font-semibold text-[#4B4B54] dark:text-[#9E9EAA]">
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#C83E62] dark:hover:text-[#E04870] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <span aria-hidden="true" className="text-[#DCD9D0] dark:text-[#282832]">|</span>
              <a
                href={`mailto:${personal.email}`}
                className="inline-flex items-center gap-1.5 hover:text-[#C83E62] dark:hover:text-[#E04870] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{personal.email}</span>
              </a>
              <span aria-hidden="true" className="text-[#DCD9D0] dark:text-[#282832]">|</span>
              <a
                href={personal.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#C83E62] dark:hover:text-[#E04870] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Column: Kemily Official Photo Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#E2DFD8] to-white dark:from-[#1D1D24] dark:to-[#141419] border-2 border-[#DCD9D0] dark:border-[#282832] shadow-xl group">
              
              <img
                src={personal.avatarUrl}
                alt="Foto oficial de Kemily Diniz (Kemi)"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              
              {/* Vibrant Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6" />

              {/* Photo Overlay Badge */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-white block">
                        Kemily Diniz
                      </span>
                      <span className="text-xs text-white/80">
                        Analista de Estratégia · Banco Bradesco
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#C83E62] text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Authority & Metric Strip - Fluid 4-Column Grid Filling Screen */}
        <div className="mt-12 pt-8 border-t border-[#DCD9D0] dark:border-[#282832]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {personal.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62]/40 transition-all shadow-2xs"
              >
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] tabular-nums block">
                  {metric.value}
                </span>
                <span className="text-xs font-bold text-[#C83E62] dark:text-[#E04870] mt-1.5 block">
                  {metric.label}
                </span>
                <span className="text-xs text-[#4B4B54] dark:text-[#9E9EAA] mt-0.5 block">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
