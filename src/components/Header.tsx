import React from 'react';
import { Sun, Moon, Sparkles, User, Briefcase, GraduationCap, FolderKanban, Award, Mail } from 'lucide-react';

export type TabType = 'sobre' | 'experiencia' | 'formacao-ia' | 'projetos' | 'certificacoes' | 'contato';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCms: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  onOpenCms
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'sobre', label: 'Sobre mim', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'experiencia', label: 'Experiência', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'formacao-ia', label: 'Formação & IA', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'projetos', label: 'Projetos', icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { id: 'certificacoes', label: 'Certificações', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'contato', label: 'Contato', icon: <Mail className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F8F7F4]/90 dark:bg-[#0B0B0E]/90 border-b border-[#DCD9D0] dark:border-[#282832] transition-colors duration-200">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Portfólio Kemily Diniz + Subtitle: Comunicação, Estratégia, Dados & IA */}
        <button
          onClick={() => onSelectTab('sobre')}
          className="text-left group flex items-center gap-3 cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C83E62] to-[#B82A4B] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
            KD
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#141416] dark:text-[#F4F4F7] group-hover:text-[#C83E62] dark:group-hover:text-[#E04870] transition-colors whitespace-nowrap">
              Portfólio Kemily Diniz
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#C83E62] dark:text-[#E04870] tracking-tight">
              Comunicação, Estratégia, Dados & IA
            </span>
          </div>
        </button>

        {/* Zone 2: Section Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-[#EBE8E0]/70 dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C83E62] dark:bg-[#E04870] text-white shadow-xs'
                    : 'text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#141416] dark:hover:text-[#F4F4F7] hover:bg-[#DCD9D0]/50 dark:hover:bg-[#202027]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Dark Mode Toggle (No CV button here, kept exclusively beside Ver Projetos) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            type="button"
            aria-label={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
            className="p-2.5 rounded-xl border border-[#DCD9D0] dark:border-[#282832] bg-white dark:bg-[#141419] text-[#141416] dark:text-[#F4F4F7] hover:border-[#C83E62] dark:hover:border-[#E04870] transition-all shadow-2xs cursor-pointer"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
            ) : (
              <Moon className="w-4 h-4 text-[#141416] stroke-[2.2]" />
            )}
          </button>

          {/* Quick Contact Tab Trigger */}
          <button
            onClick={() => onSelectTab('contato')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer ${
              activeTab === 'contato'
                ? 'bg-[#141416] dark:bg-white text-white dark:text-[#141416]'
                : 'bg-[#C83E62] hover:bg-[#A82447] text-white'
            }`}
          >
            Contatos
          </button>

          {/* CMS Admin Trigger with label */}
          <button
            onClick={onOpenCms}
            aria-label="Modo Edição"
            title="Abrir Modo Edição para editar todo o conteúdo"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#C83E62] dark:text-[#E04870] bg-[#C83E62]/10 dark:bg-[#E04870]/15 border border-[#C83E62]/30 dark:border-[#E04870]/30 hover:bg-[#C83E62]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modo Edição</span>
          </button>

        </div>

      </div>

      {/* Mobile / Tablet Tab Strip */}
      <div className="lg:hidden border-t border-[#DCD9D0] dark:border-[#282832] bg-[#F8F7F4] dark:bg-[#0B0B0E] px-4 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#C83E62] dark:bg-[#E04870] text-white shadow-xs'
                  : 'text-[#4B4B54] dark:text-[#9E9EAA] bg-white/70 dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
