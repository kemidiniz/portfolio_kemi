import React, { useState } from 'react';
import { X, Save, Download, RotateCcw, Plus, Trash2, Check, FileJson, User, Briefcase, GraduationCap, FolderKanban, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { PortfolioData, initialPortfolioData, ProjectItem, ExperienceItem, EducationItem, CertificationItem } from '../data/portfolioData';

interface CmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onUpdateData: (newData: PortfolioData) => void;
  onResetData: () => void;
}

type CmsTab = 'personal' | 'experiences' | 'education' | 'projects' | 'certifications' | 'json';

export const CmsDrawer: React.FC<CmsDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<CmsTab>('personal');
  const [formData, setFormData] = useState<PortfolioData>(data);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Sync state whenever drawer is opened
  React.useEffect(() => {
    if (isOpen) {
      setFormData(data);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateData(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'portfolioData.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Add handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Novo Cargo',
      company: 'Nome da Empresa',
      period: '2026 – Atualidade',
      location: 'São Paulo, SP',
      summary: 'Resumo das responsabilidades e escopo de atuação.',
      achievements: ['Primeiro impacto relevante entregue.'],
      skills: ['Estratégia', 'Comunicação']
    };
    setFormData({ ...formData, experiences: [newExp, ...formData.experiences] });
    setExpandedSection(newExp.id);
  };

  const handleDeleteExperience = (id: string) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((e) => e.id !== id)
    });
  };

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Novo Projeto ou Artigo',
      category: 'estrategia',
      categoryLabel: 'Estratégia & Dados',
      year: '2026',
      tagline: 'Descrição curta e objetiva do impacto deste projeto.',
      image: '/src/assets/images/cx_consultancy_cover_1792537284268.jpg',
      role: 'Responsável',
      clientOrContext: 'Instituição ou Empresa',
      overview: 'Visão geral do projeto.',
      challenge: 'Desafio enfrentado.',
      solution: 'Solução desenvolvida.',
      results: ['Resultado quantitativo ou qualitativo alcançado.'],
      tools: ['Power BI', 'Estratégia']
    };
    setFormData({ ...formData, projects: [newProj, ...formData.projects] });
    setExpandedSection(newProj.id);
  };

  const handleDeleteProject = (id: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((p) => p.id !== id)
    });
  };

  const handleAddCertification = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: 'Nova Certificação',
      institution: 'Nome da Instituição',
      year: '2026',
      skillsAcquired: ['Competência 1', 'Competência 2']
    };
    setFormData({
      ...formData,
      certifications: [...formData.certifications, newCert]
    });
  };

  const handleDeleteCertification = (id: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white dark:bg-[#141419] h-full shadow-2xl flex flex-col border-l border-[#DCD9D0] dark:border-[#282832] animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#DCD9D0] dark:border-[#282832] flex items-center justify-between bg-[#F8F7F4] dark:bg-[#0B0B0E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C83E62] dark:text-[#E04870]">
              <span>Modo Edição Completo</span>
              <span aria-hidden="true">·</span>
              <span>Personalize Todo o Conteúdo</span>
            </div>
            <h3 className="text-lg font-bold text-[#141416] dark:text-[#F4F4F7]">
              Painel de Gestão do Portfólio
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#141416] dark:hover:text-[#F4F4F7] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-[#DCD9D0] dark:border-[#282832] flex gap-2 sm:gap-3 text-xs font-bold overflow-x-auto scrollbar-none bg-[#F8F7F4]/50 dark:bg-[#0B0B0E]/50">
          {[
            { id: 'personal', label: 'Perfil & Textos', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'experiences', label: `Experiências (${formData.experiences.length})`, icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'education', label: 'Formação & IA', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { id: 'projects', label: `Projetos (${formData.projects.length})`, icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { id: 'certifications', label: `Certificações (${formData.certifications.length})`, icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'json', label: 'Exportar JSON', icon: <FileJson className="w-3.5 h-3.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CmsTab)}
              className={`flex items-center gap-1.5 pb-2.5 transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#C83E62] dark:border-[#E04870] text-[#C83E62] dark:text-[#E04870]'
                  : 'border-transparent text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#141416] dark:hover:text-[#F4F4F7]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          
          {/* TAB 1: PERFIL & TEXTOS */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Título da Marca (Cabeçalho)
                </label>
                <input
                  type="text"
                  value={formData.personal.brandTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, brandTitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Headline Principal (Hero)
                </label>
                <input
                  type="text"
                  value={formData.personal.headline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, headline: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Subtítulo / Declaração de Posicionamento
                </label>
                <textarea
                  rows={2}
                  value={formData.personal.subtitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, subtitle: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Frase de Diretriz / Lema Pessoal
                </label>
                <input
                  type="text"
                  value={formData.personal.motto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, motto: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Status de Disponibilidade
                </label>
                <input
                  type="text"
                  value={formData.personal.statusBadge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, statusBadge: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, email: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.personal.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, linkedin: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141416] dark:text-[#F4F4F7] mb-1">
                  Parágrafos da Biografia (Sobre mim)
                </label>
                {formData.personal.bioParagraphs.map((para, pIdx) => (
                  <textarea
                    key={pIdx}
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...formData.personal.bioParagraphs];
                      updated[pIdx] = e.target.value;
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, bioParagraphs: updated }
                      });
                    }}
                    className="w-full mb-2 px-3 py-2 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] text-[#141416] dark:text-[#F4F4F7] text-xs font-medium resize-none"
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIÊNCIAS */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
                  Gerencie todas as experiências da sua trajetória corporativa.
                </span>
                <button
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C83E62] text-white text-xs font-bold hover:bg-[#A82447] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Cargo</span>
                </button>
              </div>

              {formData.experiences.map((exp, idx) => {
                const isExpanded = expandedSection === exp.id;
                return (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : exp.id)}
                        className="flex items-center gap-2 text-left font-bold text-xs text-[#141416] dark:text-[#F4F4F7] cursor-pointer"
                      >
                        <span className="text-[#C83E62] dark:text-[#E04870]">#{idx + 1}</span>
                        <span>{exp.role}</span>
                        <span className="text-[#4B4B54] dark:text-[#9E9EAA]">({exp.company})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Excluir este cargo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-[#DCD9D0] dark:border-[#282832]">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Cargo</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...formData.experiences];
                                updated[idx].role = e.target.value;
                                setFormData({ ...formData, experiences: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Empresa</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...formData.experiences];
                                updated[idx].company = e.target.value;
                                setFormData({ ...formData, experiences: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Período</label>
                            <input
                              type="text"
                              value={exp.period}
                              onChange={(e) => {
                                const updated = [...formData.experiences];
                                updated[idx].period = e.target.value;
                                setFormData({ ...formData, experiences: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Localização</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => {
                                const updated = [...formData.experiences];
                                updated[idx].location = e.target.value;
                                setFormData({ ...formData, experiences: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Resumo das Atividades</label>
                          <textarea
                            rows={2}
                            value={exp.summary}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[idx].summary = e.target.value;
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Entregas e Conquistas (separadas por ponto e vírgula)</label>
                          <textarea
                            rows={2}
                            value={exp.achievements.join('; ')}
                            onChange={(e) => {
                              const updated = [...formData.experiences];
                              updated[idx].achievements = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                              setFormData({ ...formData, experiences: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: FORMAÇÃO & IA */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#C83E62] uppercase tracking-wider mb-3">
                  Graduações & Ensino Superior
                </h4>
                {formData.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] mb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Curso / Área</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[idx].field = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Instituição</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[idx].institution = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Detalhes da Formação</label>
                      <textarea
                        rows={2}
                        value={edu.details}
                        onChange={(e) => {
                          const updated = [...formData.education];
                          updated[idx].details = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#C83E62] uppercase tracking-wider mb-3">
                  Imersões em Tecnologia & IA
                </h4>
                {formData.techImmersions.map((imm, idx) => (
                  <div key={imm.id} className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] mb-3 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Programa</label>
                        <input
                          type="text"
                          value={imm.program}
                          onChange={(e) => {
                            const updated = [...formData.techImmersions];
                            updated[idx].program = e.target.value;
                            setFormData({ ...formData, techImmersions: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Organização</label>
                        <input
                          type="text"
                          value={imm.organization}
                          onChange={(e) => {
                            const updated = [...formData.techImmersions];
                            updated[idx].organization = e.target.value;
                            setFormData({ ...formData, techImmersions: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block">Descrição</label>
                      <textarea
                        rows={2}
                        value={imm.description}
                        onChange={(e) => {
                          const updated = [...formData.techImmersions];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, techImmersions: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJETOS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
                  Gerencie todos os projetos e artigos científicos.
                </span>
                <button
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C83E62] text-white text-xs font-bold hover:bg-[#A82447] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Projeto</span>
                </button>
              </div>

              {formData.projects.map((proj, idx) => {
                const isExpanded = expandedSection === proj.id;
                return (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : proj.id)}
                        className="flex items-center gap-2 text-left font-bold text-xs text-[#141416] dark:text-[#F4F4F7] cursor-pointer"
                      >
                        <span className="text-[#C83E62] dark:text-[#E04870]">#{idx + 1}</span>
                        <span>{proj.title}</span>
                        <span className="text-[#4B4B54] dark:text-[#9E9EAA]">[{proj.categoryLabel}]</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Excluir este projeto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-[#DCD9D0] dark:border-[#282832]">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Título</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Rótulo da Categoria</label>
                            <input
                              type="text"
                              value={proj.categoryLabel}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].categoryLabel = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Tagline / Subtítulo Curto</label>
                          <input
                            type="text"
                            value={proj.tagline}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].tagline = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Visão Geral (Overview)</label>
                          <textarea
                            rows={2}
                            value={proj.overview}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].overview = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">O Desafio</label>
                            <textarea
                              rows={2}
                              value={proj.challenge}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].challenge = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">A Solução</label>
                            <textarea
                              rows={2}
                              value={proj.solution}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].solution = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#4B4B54] dark:text-[#9E9EAA] block mb-1">Resultados (separados por ponto e vírgula)</label>
                          <textarea
                            rows={2}
                            value={proj.results.join('; ')}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].results = e.target.value.split(';').map(s => s.trim()).filter(Boolean);
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: CERTIFICAÇÕES */}
          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4B4B54] dark:text-[#9E9EAA]">
                  Gerencie certificações executivas.
                </span>
                <button
                  onClick={handleAddCertification}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C83E62] text-white text-xs font-bold hover:bg-[#A82447] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Certificação</span>
                </button>
              </div>

              {formData.certifications.map((cert, idx) => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#F8F7F4] dark:bg-[#0B0B0E] border border-[#DCD9D0] dark:border-[#282832] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141416] dark:text-[#F4F4F7]">
                      {cert.title}
                    </span>
                    <button
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cert.title}
                      placeholder="Nome do Curso / Certificado"
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={cert.institution}
                      placeholder="Instituição Emissora"
                      onChange={(e) => {
                        const updated = [...formData.certifications];
                        updated[idx].institution = e.target.value;
                        setFormData({ ...formData, certifications: updated });
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#141419] border border-[#DCD9D0] dark:border-[#282832] text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#141416] dark:text-[#F4F4F7]">
                  Estrutura Completa de Dados JSON
                </span>
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C83E62] text-white text-xs font-bold hover:bg-[#A82447] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar portfolioData.json</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0B0B0E] text-[#9E9EAA] text-xs font-mono overflow-x-auto max-h-[420px] border border-[#282832]">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#DCD9D0] dark:border-[#282832] bg-[#F8F7F4] dark:bg-[#0B0B0E] flex items-center justify-between">
          <button
            onClick={() => {
              setFormData(initialPortfolioData);
              onResetData();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#4B4B54] dark:text-[#9E9EAA] hover:text-[#141416] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão Original</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C83E62] hover:bg-[#A82447] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Atualizado com Sucesso!' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
