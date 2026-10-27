import type { ProjectItem } from "../data/portfolioData";

export const projectCategoryLabels: Record<string, string> = {
  pesquisa: "Artigos Publicados",
  estrategia: "Estratégia & CX",
  comunicacao: "Comunicação & Design",
  "dados-ia": "Dados & IA",
};

/** Filters come from published projects, never from a separate editable copy. */
export function projectCategories(projects: ProjectItem[]) {
  const present = new Map<string, string>();
  for (const project of projects) {
    if (!present.has(project.category)) present.set(project.category,
      projectCategoryLabels[project.category] || project.categoryLabel.trim() || project.category);
  }
  return [...present].map(([id, label]) => ({ id, label }));
}
