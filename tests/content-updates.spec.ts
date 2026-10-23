import { test, expect } from "@playwright/test";
import { initialPortfolioData } from "../src/data/portfolioData";
import { applyPortfolioUpdates } from "../src/data/portfolioUpdates";
import { validatePortfolio } from "../src/lib/portfolio";

test("legacy content is corrected without replacing custom edits or reseeding deleted projects", () => {
  const legacy = structuredClone(initialPortfolioData);
  legacy.personal.metrics[1] = { value: "Banco Bradesco", label: "Setor Bancário & Estratégia", detail: "Analista" };
  legacy.skills[0].items[1].name = "Power BI & Dashboards";
  legacy.skills[0].items.push({ name: "Análise de Indicadores (KPIs/OKRs)", level: "Avançado" });
  legacy.projects = legacy.projects.filter(project => !["portfolio-kemi", "agente-gi"].includes(project.id));
  legacy.projects[0].overview = "Texto personalizado que deve ser preservado.";
  const updated = applyPortfolioUpdates(legacy, true);
  expect(updated.personal.metrics[1].value).toBe("2 formações");
  expect(updated.skills.every(group => group.items.length === 5)).toBe(true);
  expect(JSON.stringify(updated)).not.toContain("Power BI");
  expect(updated.projects[0].overview).toBe(legacy.projects[0].overview);
  expect(updated.projects.filter(project => project.id === "agente-gi")).toHaveLength(1);
  expect(applyPortfolioUpdates(updated, true)).toEqual(updated);
  expect(validatePortfolio(updated)).toEqual(updated);
  updated.projects = updated.projects.filter(project => project.id !== "agente-gi");
  expect(applyPortfolioUpdates(updated, false).projects.some(project => project.id === "agente-gi")).toBe(false);
  updated.personal.metrics[1] = { value: "3 formações", label: "Minha edição", detail: "Nova formação" };
  expect(applyPortfolioUpdates(updated).personal.metrics[1]).toEqual(updated.personal.metrics[1]);
});
