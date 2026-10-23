import { test, expect, type Page } from "@playwright/test";
import { initialPortfolioData } from "../src/data/portfolioData";

async function open(page: Page) {
  await page.route("https://exlthhgqgbxlngpnxrqs.supabase.co/**", route => {
    if (route.request().url().endsWith("/read_portfolio")) return route.fulfill({ json: { content: initialPortfolioData, revision: 1 } });
    if (route.request().url().endsWith("/is_portfolio_admin")) return route.fulfill({ json: false });
    return route.fulfill({ status: 403, json: { message: "Public preview test" } });
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}
async function navigate(page: Page, name: string) {
  const menu = page.getByRole("button", { name: "Abrir navegação", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name, exact: true }).click();
  await expect(page.locator("main")).toBeFocused();
}

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`editorial preview reflows, aligns containers and keeps indicators readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await open(page);
    const geometry = await page.evaluate(() => {
      const main = document.querySelector("main")!, footer = document.querySelector(".site-footer-inner")!;
      const left = (element: Element) => element.getBoundingClientRect().left + parseFloat(getComputedStyle(element).paddingLeft);
      const strong = document.querySelectorAll(".metric-card strong")[1];
      const range = document.createRange(); range.selectNodeContents(strong);
      return { difference: Math.abs(left(main) - left(footer)), valueWidth: strong.getBoundingClientRect().width, textWidth: Math.max(...[...range.getClientRects()].map(rect => rect.width)), loadedFont: [...document.fonts].some(font => font.family.includes("Plus Jakarta Sans") && font.status === "loaded") };
    });
    expect(geometry.loadedFont).toBe(true);
    expect(geometry.difference).toBeLessThan(1);
    expect(geometry.textWidth).toBeLessThanOrEqual(geometry.valueWidth + 1);
    await expect(page.locator(".profile-links")).toHaveCount(0);
    await expect(page.locator(".site-footer a")).toHaveCount(3);
    for (const name of ["Sobre mim", "Experiência", "Formação & IA", "Projetos", "Certificações"]) {
      await navigate(page, name);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width <= 760) {
        await page.getByRole("button", { name: "Abrir navegação", exact: true }).click();
        await expect(page.locator("#site-navigation [aria-current=page]")).toHaveText(name);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
      } else await expect(page.locator("#site-navigation [aria-current=page]")).toHaveText(name);
    }
  });
}

test("hamburger supports forward Tab, Escape and focus transfer after selection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const toggle = page.locator(".navigation-toggle");
  await toggle.focus(); await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name: "Sobre mim", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  for (let count = 0; count < 4; count++) await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator("main")).toHaveAttribute("aria-label", "Projetos");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("personal introduction leads the desktop cover and project covers load without mockups", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(`Oie, sou a ${initialPortfolioData.personal.nickname}!`);
  await expect(page.locator(".profile-greeting")).toHaveText(initialPortfolioData.personal.headline);
  const heading = (await page.locator(".profile-heading").boundingBox())!;
  const portrait = (await page.locator(".profile-portrait").boundingBox())!;
  expect(Math.abs(heading.y - portrait.y)).toBeLessThan(2);
  expect(portrait.height).toBeGreaterThanOrEqual(420);
  expect(portrait.width).toBeLessThanOrEqual(390);
  await navigate(page, "Experiência");
  const experienceFont = await page.getByRole("heading", { name: "Trajetória Profissional" }).evaluate(el => getComputedStyle(el).fontSize);
  await navigate(page, "Formação & IA");
  expect(await page.locator("h3").first().evaluate(el => getComputedStyle(el).fontSize)).toBe(experienceFont);
  await navigate(page, "Projetos");
  await expect(page.locator(".featured-project")).toHaveCount(0);
  await expect(page.locator('.carousel-originals [data-project-id="portfolio-kemi"] img')).toHaveAttribute("src", "/assets/projects/portfolio-kemi.jpg");
  const gi = page.locator('.carousel-originals [data-project-id="agente-gi"]');
  await expect(gi).toContainText("2026");
  await expect(gi.locator("img")).toHaveAttribute("src", "/assets/projects/agente-gi.webp");
  await gi.scrollIntoViewIfNeeded();
  await gi.locator("img").evaluate((img: HTMLImageElement) => img.decode());
  await page.locator('.carousel-originals [data-project-id="portfolio-kemi"]').scrollIntoViewIfNeeded();
  await page.locator('.carousel-originals [data-project-id="portfolio-kemi"] img').evaluate((img: HTMLImageElement) => img.decode());
});

test("skip link focuses content below the sticky header", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await open(page);
  await page.locator(".skip-link").focus(); await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const positions = await page.evaluate(() => ({ content: document.querySelector(".profile-greeting")!.getBoundingClientRect().top, header: document.querySelector(".site-header")!.getBoundingClientRect().bottom }));
  expect(positions.content).toBeGreaterThanOrEqual(positions.header);
});

test("curriculum is a focused dialog, copies current skills and restores focus", async ({ page }) => {
  await open(page);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } } }));
  const opener = page.getByRole("button", { name: "Ver currículo", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(page.getByRole("button", { name: "Copiar Texto", exact: true })).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await dialog.getByRole("button", { name: "Copiar Texto", exact: true }).click();
  await expect(dialog.getByRole("button", { name: "Copiado!", exact: true })).toBeVisible();
  const text = await page.locator("html").getAttribute("data-copied");
  expect(text).toContain("Dashboards com apoio de IA");
  expect(text).not.toContain("Power BI");
  expect(text).not.toContain("Gestão de KPIs");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0); await expect(opener).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
});

test("failed clipboard operation keeps the curriculum available and reports the error", async ({ page }) => {
  await open(page);
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard denied"); } } }));
  await page.getByRole("button", { name: "Ver currículo", exact: true }).click();
  await page.getByRole("button", { name: "Copiar Texto", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Não foi possível copiar");
  await expect(page.getByRole("button", { name: "Copiado!", exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("balanced carousel preserves the portfolio process and all catalogue filters", async ({ page }) => {
  await open(page); await navigate(page, "Projetos");
  await expect(page.locator(".featured-project")).toHaveCount(0);
  await expect(page.locator(".carousel-originals .project-card")).toHaveCount(7);
  await expect(page.getByRole("status")).toHaveText("7 projetos");
  const opener = page.getByRole("button", { name: "Meu portfólio", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: /Dados/ }).click();
  await expect(dialog.getByRole("status")).toContainText("Organizar a informação viva");
  await dialog.getByRole("button", { name: /Integrações/ }).click();
  await expect(dialog.getByRole("status")).toContainText("front-end, back-end e banco de dados");
  await dialog.getByRole("button", { name: "Fechar projeto", exact: true }).click();
  await expect(opener).toBeFocused();
  await page.getByRole("button", { name: "Dados & IA", exact: true }).click();
  await expect(page.locator(".featured-project")).toHaveCount(0);
  await expect(page.locator(".carousel-originals .project-card")).toHaveCount(3);
  await expect(page.getByRole("status")).toHaveText("3 projetos");
  await page.getByRole("button", { name: "Agente Gi: inglês com IA", exact: true }).click();
  await expect(page.getByRole("link", { name: "Abrir Agente Gi no Gemini" })).toHaveAttribute("href", /gemini.google.com\/gem\//);
});

for (const viewport of [{ width: 320, height: 844 }, { width: 768, height: 320 }, { width: 720, height: 450 }]) {
  test(`narrow, landscape and 200% equivalent viewports preserve navigation at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport); await open(page);
    for (const name of ["Formação & IA", "Projetos", "Certificações", "Sobre mim"]) {
      await navigate(page, name);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.getByRole("button", { name: "Ver currículo", exact: true }).click();
    expect(await page.locator(".resume-dialog").evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    const close = page.getByRole("button", { name: "Fechar", exact: true });
    await expect(close).toBeVisible(); const box = (await close.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  });
}

test("back to top respects reduced motion and crawler metadata matches professional content", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 700 }); await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page); await navigate(page, "Projetos");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Voltar ao topo", exact: true }).click();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  const html = await (await request.get("/")).text();
  expect(html).not.toContain("Power BI"); expect(html).toContain('rel="canonical"'); expect(html).toContain('property="og:image"');
  expect((await request.get("/assets/social/portfolio-kemi.png")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  expect(await (await request.get("/sitemap.xml")).text()).toContain("<urlset");
});

test("printing the curriculum excludes the site behind it and preserves readable content", async ({ page }) => {
  await open(page); await page.getByRole("button", { name: "Ver currículo", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("main")).toBeHidden();
  await expect(page.locator(".site-footer")).toBeHidden();
  await expect(page.locator(".print-page")).toBeVisible();
  expect(await page.locator(".print-page").evaluate(el => getComputedStyle(el).color)).toBe("rgb(24, 1, 1)");
  await expect(page.locator(".print-page")).not.toContainText("Power BI");
});
