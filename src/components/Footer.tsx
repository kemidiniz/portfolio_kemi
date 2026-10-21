import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-10 bg-white dark:bg-[#0B0B0E] border-t border-[#DCD9D0] dark:border-[#282832] text-xs text-[#4B4B54] dark:text-[#9E9EAA] transition-colors">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-5">
        
        {/* Left: Brand & Motto */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-bold text-sm text-[#141416] dark:text-[#F4F4F7]">
            Portfólio Kemily Diniz
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-[#DCD9D0] dark:text-[#282832]">·</span>
          <span className="italic">"Buscando sempre repertório e conexões."</span>
          <span aria-hidden="true" className="hidden sm:inline text-[#DCD9D0] dark:text-[#282832]">·</span>
          <span>São Paulo, Brasil</span>
        </div>

        {/* Right: Back to top action */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-bold hover:text-[#C83E62] dark:hover:text-[#E04870] transition-colors py-1.5 px-3 rounded-xl border border-[#DCD9D0] dark:border-[#282832] hover:border-[#C83E62] bg-[#F8F7F4] dark:bg-[#141419] cursor-pointer"
          >
            <span>Voltar ao Topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
