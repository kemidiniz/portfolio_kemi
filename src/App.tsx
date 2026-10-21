/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialPortfolioData, PortfolioData, ProjectItem } from './data/portfolioData';
import { Header, TabType } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { EducationAndAI } from './components/EducationAndAI';
import { Projects } from './components/Projects';
import { CertificationsAndSkills } from './components/CertificationsAndSkills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { CmsDrawer } from './components/CmsDrawer';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('kemily_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabType>('sobre');

  const [data, setData] = useState<PortfolioData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('kemily_portfolio_data');
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch {
          return initialPortfolioData;
        }
      }
    }
    return initialPortfolioData;
  });

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Sync dark class on documentElement and html
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('kemily_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('kemily_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleUpdateData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('kemily_portfolio_data', JSON.stringify(newData));
  };

  const handleResetData = () => {
    setData(initialPortfolioData);
    localStorage.removeItem('kemily_portfolio_data');
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-[#F8F7F4] dark:bg-[#0B0B0E] text-[#141416] dark:text-[#F4F4F7] transition-colors duration-200 flex flex-col font-sans selection:bg-[#C83E62]/20 selection:text-[#C83E62] ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Header with Portfólio Kemily Diniz brand & Tab Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenCms={() => setIsCmsOpen(true)}
      />

      {/* Main Blocked View Container with expansive desktop width */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-4">
        
        {/* Block 1: Sobre mim (Hero + Quem Sou Eu) */}
        {activeTab === 'sobre' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Hero
              data={data}
              onOpenResume={() => setIsResumeOpen(true)}
              onNavigateToTab={handleSelectTab}
            />
            <About data={data} />
            
            {/* Direct jump to next block */}
            <div className="pt-8 pb-4 flex justify-end">
              <button
                onClick={() => handleSelectTab('experiencia')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C83E62] hover:bg-[#A82447] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Avançar para Experiência Corporativa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Block 2: Experiência Profissional */}
        {activeTab === 'experiencia' && (
          <div className="animate-in fade-in-50 duration-200">
            <Experience
              experiences={data.experiences}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

        {/* Block 3: Formação Acadêmica & Imersão em IA */}
        {activeTab === 'formacao-ia' && (
          <div className="animate-in fade-in-50 duration-200">
            <EducationAndAI
              education={data.education}
              techImmersions={data.techImmersions}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

        {/* Block 4: Projetos */}
        {activeTab === 'projetos' && (
          <div className="animate-in fade-in-50 duration-200">
            <Projects
              projects={data.projects}
              onSelectProject={(project) => setSelectedProject(project)}
            />
            
            {/* Block Navigation Helper */}
            <div className="flex items-center justify-between pt-8 border-t border-[#DCD9D0] dark:border-[#282832]">
              <button
                onClick={() => handleSelectTab('formacao-ia')}
                className="text-xs font-bold text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#C83E62] transition-colors cursor-pointer"
              >
                ← Voltar para Formação & IA
              </button>
              <button
                onClick={() => handleSelectTab('certificacoes')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83E62] dark:text-[#E04870] hover:underline cursor-pointer"
              >
                <span>Avançar para Certificações</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Block 5: Certificações & Habilidades */}
        {activeTab === 'certificacoes' && (
          <div className="animate-in fade-in-50 duration-200">
            <CertificationsAndSkills
              certifications={data.certifications}
              skills={data.skills}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

        {/* Block 6: Contato Direto & Conexões */}
        {activeTab === 'contato' && (
          <div className="animate-in fade-in-50 duration-200">
            <Contact
              data={data}
              onOpenResume={() => setIsResumeOpen(true)}
            />
            
            {/* Block Navigation Helper */}
            <div className="flex items-center justify-between pt-8 border-t border-[#DCD9D0] dark:border-[#282832]">
              <button
                onClick={() => handleSelectTab('certificacoes')}
                className="text-xs font-bold text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#C83E62] transition-colors cursor-pointer"
              >
                ← Voltar para Certificações
              </button>
              <button
                onClick={() => handleSelectTab('sobre')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C83E62] dark:text-[#E04870] hover:underline cursor-pointer"
              >
                <span>Voltar ao Início (Sobre mim)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Clean Editorial Footer */}
      <Footer />

      {/* Case Study Lightbox / Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Recruiter-Ready Printable CV Modal */}
      <ResumeModal
        data={data}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* CMS Headless / Comprehensive Content Manager Drawer */}
      <CmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        data={data}
        onUpdateData={handleUpdateData}
        onResetData={handleResetData}
      />

    </div>
  );
}
