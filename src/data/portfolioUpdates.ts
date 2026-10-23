import type { PortfolioData, ProjectItem } from "./portfolioData";

export const personalProjects: ProjectItem[] = [
  {
    id: "portfolio-kemi", featured: true, title: "Meu portfólio",
    category: "dados-ia", categoryLabel: "Produto digital & IA", year: "2026",
    tagline: "Minha primeira experiência com vibe coding, conectando front-end, back-end, banco de dados e integrações.",
    image: "/assets/projects/portfolio-kemi.jpg", role: "Concepção do produto & construção com IA",
    clientOrContext: "Projeto pessoal",
    overview: "Este portfólio foi minha primeira experiência com vibe coding. Pensei o front-end, o back-end, o banco de dados e os conectores para reunir minha trajetória, formações e projetos em um produto que posso atualizar.",
    challenge: "Apresentar informações profissionais com clareza e permitir a atualização contínua do conteúdo.",
    solution: "Concepção das conexões entre interface, back-end e banco de dados, com construção apoiada por IA. O resultado é uma interface responsiva, com navegação por seções, modo noturno e área administrativa conectada ao Supabase.",
    results: ["Portfólio publicado na Vercel.", "Conteúdo editável por uma conta administradora.", "Navegação responsiva e modo noturno."],
    tools: ["Vibe coding", "IA generativa", "React", "Supabase", "Vercel"],
  },
  {
    id: "agente-gi", title: "Agente Gi: inglês com IA",
    category: "dados-ia", categoryLabel: "IA & Aprendizagem", year: "2026",
    tagline: "Agente de IA criado no Gemini para apoiar meus estudos de inglês.",
    image: "/assets/projects/agente-gi.webp", role: "Criadora", clientOrContext: "Projeto pessoal de aprendizagem",
    overview: "Agente de IA chamado Gi, criado no Gemini para apoiar meus estudos de inglês.",
    challenge: "Usar inteligência artificial como apoio à minha rotina de estudos de inglês.",
    solution: "Criação de um agente no Gemini voltado ao estudo de inglês. Acesse: https://gemini.google.com/gem/1LbceA06YOwXQ-_ZtgwmIqwKuNAQifuko?usp=sharing",
    results: ["Agente Gi criado no Gemini para apoiar meus estudos de inglês."],
    tools: ["Gemini", "IA generativa"],
  },
];

// Upgrade the original publication without replacing custom fields or projects.
// Only seed new projects for the original revision; later admin deletions stay deleted.
export function applyPortfolioUpdates(input: PortfolioData, seedProjects = false): PortfolioData {
  const data = structuredClone(input);
  data.personal.metrics = data.personal.metrics.map(metric => metric.value === "Banco Bradesco"
    ? { value: "2 formações", label: "RH & Marketing", detail: "Pessoas, negócios e estratégia" } : metric);
  data.personal.bioParagraphs = data.personal.bioParagraphs.map(paragraph => paragraph
    .replace("ferramentas analíticas como Power BI, inteligência artificial generativa", "dashboards criados com apoio de IA, inteligência artificial generativa"));
  data.experiences = data.experiences.map(experience => ({ ...experience,
    skills: experience.skills.map(skill => skill === "Power BI" ? "Dashboards com IA" : skill),
  }));
  const removed = new Set(["Análise de Indicadores (KPIs/OKRs)", "Adobe Photoshop & Illustrator", "Miro & Facilitação de Ideação"]);
  data.skills = data.skills.map(group => ({ ...group,
    items: group.items.filter(skill => !removed.has(skill.name)).map(skill => ({ ...skill,
      name: skill.name === "Power BI & Dashboards" ? "Dashboards com apoio de IA" : skill.name,
    })),
  }));
  data.projects = data.projects.map(project => project.id === "portfolio-kemi" && project.featured === undefined ? { ...project, featured: true } : project);
  data.projects = data.projects.map(project => {
    if (project.id === "portfolio-kemi") return { ...project,
      title: project.title === "Meu portfólio: primeira experiência com vibe coding" ? "Meu portfólio" : project.title,
      image: project.image === "/assets/projects/portfolio-kemi.svg" ? "/assets/projects/portfolio-kemi.jpg" : project.image,
    };
    if (project.id === "agente-gi") return { ...project,
      year: project.year || "2026",
      image: project.image === "/assets/projects/agente-gi.svg" ? "/assets/projects/agente-gi.webp" : project.image,
    };
    return project;
  });
  data.projects = data.projects.map(project => project.id === "dados-automacao-ia" ? {
    ...project,
    tagline: project.tagline.replace("Painéis de acompanhamento em Power BI", "Dashboards criados com apoio de IA"),
    solution: project.solution.replace("Desenvolvimento de dashboards interativos no Power BI conectados a fontes de dados consolidadas", "Criação de dashboards com apoio de IA para visualizar dados consolidados"),
    tools: project.tools.filter(tool => !["Power BI", "DAX"].includes(tool)),
  } : project);
  if (seedProjects) {
    for (const project of personalProjects) {
      if (!data.projects.some(existing => existing.id === project.id)) data.projects.push(structuredClone(project));
    }
  }
  return data;
}
