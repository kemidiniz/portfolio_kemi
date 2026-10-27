import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import { initialPortfolioData } from "../src/data/portfolioData";
import { validatePortfolio } from "../src/lib/portfolio";

const photo = "/assets/current-admin-photo.jpeg";

test("first photo is the published photo, without a template swap or hover zoom", async ({ page }) => {
  const content = structuredClone(initialPortfolioData);
  content.personal.avatarUrl = photo;
  content.personal.nickname = "Apelido publicado";
  content.personal.subtitle = "Texto atualizado na conta administrativa, preservado integralmente.";
  content.personal.metrics[1] = { value: "Banco Bradesco", label: "Texto escolhido no admin", detail: "Detalhe atualizado" };
  content.personal.bioParagraphs = ["Meu texto — mas pode me chamar carinhosamente de Kemi! — publicado no admin."];
  let release!: () => void;
  const pending = new Promise<void>(resolve => release = resolve);
  await page.route("**/rest/v1/rpc/read_portfolio", async route => { await pending; return route.fulfill({ json: { content, revision: 17 } }); });
  await page.route("**/rest/v1/rpc/is_portfolio_admin", route => route.fulfill({ json: false }));
  await page.route(`**${photo}`, async route => route.fulfill({ contentType: "image/jpeg", body: await fs.readFile("public/assets/aistudio/IMG_1992_c0be0322.jpeg") }));
  await page.addInitScript(() => {
    (window as any).portraitSources = [];
    new MutationObserver(() => {
      const src = document.querySelector(".profile-portrait img")?.getAttribute("src");
      if (src && !(window as any).portraitSources.includes(src)) (window as any).portraitSources.push(src);
    }).observe(document, { subtree: true, childList: true, attributes: true });
  });
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Carregando portfólio");
  await expect(page.locator(".profile-portrait img")).toHaveCount(0);
  release();
  const image = page.locator(".profile-portrait img");
  await expect(image).toHaveAttribute("src", photo);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Oie, sou a Apelido publicado!");
  await expect(page.locator(".profile-description")).toHaveText(content.personal.subtitle);
  await expect(page.locator(".metric-card").nth(1)).toContainText(content.personal.metrics[1].label);
  await expect(page.locator(".metric-card").nth(1)).toContainText("Banco Bradesco");
  await image.evaluate((element: HTMLImageElement) => element.decode());
  const before = (await image.boundingBox())!;
  await image.hover();
  await expect(image).toHaveCSS("transform", "none");
  expect((await image.boundingBox())!.width).toBeCloseTo(before.width, 1);
  expect(await page.evaluate(() => (window as any).portraitSources)).toEqual([photo]);
  await page.getByRole("button", { name: "Conheça minha história" }).click();
  await expect(page.getByRole("dialog")).toContainText(content.personal.bioParagraphs[0]);
});

test("filters include only populated categories and discover new names without content edits", async ({ page }) => {
  const content = structuredClone(initialPortfolioData);
  content.projects = content.projects.filter(project => project.category === "pesquisa");
  const custom = { ...initialPortfolioData.projects[0], id: "admin-custom-project", title: "Projeto cadastrado no admin", category: "automacoes", categoryLabel: "Automações" };
  content.projects.push(custom);
  expect(validatePortfolio(content)).toEqual(content);
  await page.route("**/rest/v1/rpc/read_portfolio", route => route.fulfill({ json: { content, revision: 17 } }));
  await page.goto("/");
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.getByRole("button", { name: "Projetos", exact: true }).click();
  const filters = page.getByRole("group", { name: "Filtrar projetos", exact: true });
  await expect(filters.getByRole("button")).toHaveText(["Todos os Projetos", "Artigos Publicados", "Automações"]);
  await filters.getByRole("button", { name: "Automações", exact: true }).click();
  await expect(page.locator(".carousel-originals .project-card")).toHaveCount(1);
  await expect(page.locator(".carousel-originals .project-card")).toContainText(custom.title);
  await page.setViewportSize({ width: 390, height: 844 });
  const select = page.getByRole("combobox", { name: "Filtrar projetos", exact: true });
  await expect(select).toHaveValue("automacoes");
  await expect(select.locator("option")).toHaveText(["Todos os Projetos", "Artigos Publicados", "Automações"]);
  await select.selectOption("");
  await expect(page.locator(".carousel-originals .project-card")).toHaveCount(content.projects.length);
});

test("share metadata uses a versioned 1200 by 630 image with no contact number", async ({ request, page }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('property="og:image" content="https://portfoliokemi-public.vercel.app/assets/social/portfolio-kemi-20261027.png"');
  expect(html).toContain('name="twitter:image" content="https://portfoliokemi-public.vercel.app/assets/social/portfolio-kemi-20261027.png"');
  const image = await request.get("/assets/social/portfolio-kemi-20261027.png");
  expect(image.status()).toBe(200);
  const data = await image.body(); expect(data.readUInt32BE(16)).toBe(1200); expect(data.readUInt32BE(20)).toBe(630);
  await page.route("**/rest/v1/rpc/read_portfolio", route => route.fulfill({ json: { content: initialPortfolioData, revision: 17 } }));
  await page.goto("/");
  await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp"], a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator(".site-footer a")).toHaveCount(2);
});
