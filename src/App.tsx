/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  initialPortfolioData,
  PortfolioData,
  ProjectItem,
} from "./data/portfolioData";
import { Header, TabType } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { EducationAndAI } from "./components/EducationAndAI";
import { Projects } from "./components/Projects";
import { CertificationsAndSkills } from "./components/CertificationsAndSkills";
import { Footer } from "./components/Footer";
import { ProjectModal } from "./components/ProjectModal";
import { ResumeModal } from "./components/ResumeModal";
const CmsDrawer = lazy(() =>
  import("./components/CmsDrawer").then((module) => ({
    default: module.CmsDrawer,
  })),
);
import { ArrowRight } from "lucide-react";
import { readPortfolio, writePortfolio } from "./lib/portfolio";
import { useAdmin } from "./hooks/useAdmin";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("kemily_theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<TabType>("sobre");
  const [showBiography, setShowBiography] = useState(false);

  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [revision, setRevision] = useState(0);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [contentError, setContentError] = useState("");
  const admin = useAdmin();
  useEffect(() => {
    let active = true;
    readPortfolio()
      .then((result) => {
        if (!active) return;
        if (result) {
          if (result.data) setData(result.data);
          setRevision(result.revision);
          setContentLoaded(true);
        }
      })
      .catch((error) => {
        if (active) setContentError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const personal = data.personal;
    document.title = `${personal.brandTitle} — ${personal.headline}`;
    const tags: Record<string, string> = {
      "name:description": personal.subtitle,
      "name:author": personal.name,
      "property:og:title": document.title,
      "property:og:description": personal.subtitle,
      "property:og:site_name": personal.brandTitle,
      "name:twitter:title": document.title,
      "name:twitter:description": personal.subtitle,
    };
    for (const [key, content] of Object.entries(tags)) {
      const [attribute, value] = key.split(":");
      document
        .querySelector(`meta[${attribute}="${value}"]`)
        ?.setAttribute("content", content);
    }
    const structured = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (structured)
      structured.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: personal.name,
        description: personal.headline,
        image: personal.avatarUrl,
        email: personal.email,
        sameAs: [personal.linkedin].filter(Boolean),
      });
  }, [data.personal]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Sync dark class on documentElement and html
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      localStorage.setItem("kemily_theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      localStorage.setItem("kemily_theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleUpdateData = async (newData: PortfolioData) => {
    if (!admin.isAdmin || !contentLoaded)
      throw new Error(
        "Entre com uma conta autorizada e carregue o conteúdo antes de publicar.",
      );
    const nextRevision = await writePortfolio(newData, revision);
    setData(newData);
    setRevision(nextRevision);
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setShowBiography(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div
      className={`min-h-screen portfolio-site bg-[var(--paper)] text-[var(--ink)] transition-colors duration-200 flex flex-col font-sans selection:bg-[var(--button-bg)]/20 selection:text-[var(--wine)] ${isDarkMode ? "dark" : ""}`}
    >
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      {/* Header with Portfólio Kemily Diniz brand & Tab Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenCms={() => setIsCmsOpen(true)}
        personal={data.personal}
        isAdmin={admin.isAdmin}
      />

      {contentError && (
        <div role="status" className="site-content-notice">
          O conteúdo atualizado está indisponível no momento. Exibindo a versão
          de apresentação.
        </div>
      )}
      {/* Main Blocked View Container with expansive desktop width */}
      <main id="conteudo" className="site-main">
        {/* Block 1: Sobre mim (Hero + Quem Sou Eu) */}
        {activeTab === "sobre" && (
          <div
            className="section-view"
            key={showBiography ? "biography" : "presentation"}
          >
            {showBiography ? (
              <About data={data} onBack={() => {
                setShowBiography(false);
                window.scrollTo({ top: 0, behavior: "instant" });
              }} />
            ) : (
              <Hero
                data={data}
                onOpenResume={() => setIsResumeOpen(true)}
                onNavigateToTab={handleSelectTab}
                onOpenAbout={() => {
                  setShowBiography(true);
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              />
            )}
          </div>
        )}

        {/* Block 2: Experiência Profissional */}
        {activeTab === "experiencia" && (
          <div className="section-view">
            <Experience
              experiences={data.experiences}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

        {/* Block 3: Formação Acadêmica & Imersão em IA */}
        {activeTab === "formacao-ia" && (
          <div className="section-view">
            <EducationAndAI
              education={data.education}
              techImmersions={data.techImmersions}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

        {/* Block 4: Projetos */}
        {activeTab === "projetos" && (
          <div className="section-view">
            <Projects
              projects={data.projects}
              onSelectProject={(project) => setSelectedProject(project)}
            />

            {/* Block Navigation Helper */}
            <div className="flex items-center justify-between pt-8 border-t border-[var(--rule)]">
              <button
                onClick={() => handleSelectTab("formacao-ia")}
                className="text-xs font-bold text-[var(--muted)] hover:text-[var(--wine)] transition-colors cursor-pointer"
              >
                ← Voltar para Formação & IA
              </button>
              <button
                onClick={() => handleSelectTab("certificacoes")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--wine)] hover:underline cursor-pointer"
              >
                <span>Avançar para Certificações</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Block 5: Certificações & Habilidades */}
        {activeTab === "certificacoes" && (
          <div className="section-view">
            <CertificationsAndSkills
              certifications={data.certifications}
              skills={data.skills}
              onNavigateToTab={handleSelectTab}
            />
          </div>
        )}

      </main>

      {/* Clean Editorial Footer */}
      <Footer personal={data.personal} />

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
      {isCmsOpen && (
        <Suspense
          fallback={
            <div role="status" className="site-content-notice">
              Abrindo o estúdio…
            </div>
          }
        >
          <CmsDrawer
            isOpen={isCmsOpen}
            onClose={() => setIsCmsOpen(false)}
            data={data}
            onUpdateData={handleUpdateData}
            session={admin.session}
            isAdmin={admin.isAdmin}
            checking={admin.checking}
            authError={admin.authError}
            canPublish={contentLoaded}
          />
        </Suspense>
      )}
    </div>
  );
}
