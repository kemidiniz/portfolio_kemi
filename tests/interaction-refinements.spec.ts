import { test, expect, type Page } from "@playwright/test";
import { initialPortfolioData } from "../src/data/portfolioData";

async function open(page: Page) {
  await page.route("https://exlthhgqgbxlngpnxrqs.supabase.co/**", route => route.fulfill({ json: route.request().url().endsWith("/read_portfolio") ? { content: initialPortfolioData, revision: 2 } : false }));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}
async function navigate(page: Page, name: string) {
  const menu = page.getByRole("button", { name: "Abrir navegação", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name, exact: true }).click();
  await expect(page.locator(".mobile-menu-dialog")).toHaveCount(0);
}

test("phone popup fills available width, traps focus and restores it on dismiss", async ({ page }) => {
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 }); await open(page);
    const trigger = page.getByRole("button", { name: "Abrir navegação", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navegação", exact: true });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole("button", { name: "Fechar navegação", exact: true });
    await expect(close).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await expect(page.locator("#root")).toHaveAttribute("inert", "");
    await expect.poll(async () => (await dialog.boundingBox())!.width).toBeGreaterThan(width - 44);
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(12); expect(box.x + box.width).toBeLessThanOrEqual(width - 12);
    expect((await dialog.getByRole("button", { name: "Sobre mim", exact: true }).boundingBox())!.width).toBeGreaterThan(box.width - 40);
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Certificações", exact: true })).toBeFocused();
    await page.keyboard.press("Tab"); await expect(close).toBeFocused();
    await page.keyboard.press("Escape"); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    await trigger.click(); await page.locator(".mobile-menu-backdrop").click({ position: { x: 2, y: 2 } });
    await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
    await navigate(page, "Projetos");
    await expect(page.locator("main")).toHaveAttribute("aria-label", "Projetos");
    await expect(page.locator("main")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("tablet keeps the dropdown and near-white palette reaches all page surfaces", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 844 }); await open(page);
  await expect(page.locator(".portfolio-site")).toHaveCSS("background-color", "rgb(255, 253, 250)");
  await page.getByRole("button", { name: "Abrir navegação", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Navegação", exact: true })).toHaveCount(0);
  await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Ativar modo escuro", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Abrir navegação", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Navegação", exact: true })).toBeVisible();
  await page.getByRole("dialog", { name: "Navegação", exact: true }).getByRole("button", { name: "Fechar navegação", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("every page enters smoothly and project labels stay off the visual layout", async ({ page }) => {
  await open(page);
  for (const name of ["Sobre mim", "Experiência", "Formação & Eventos", "Projetos", "Certificações"]) {
    await navigate(page, name);
    const view = page.locator(".section-view");
    await expect(view).toHaveCSS("animation-name", "section-appear");
    await expect(view).toHaveCSS("animation-duration", "0.46s");
  }
  await navigate(page, "Projetos");
  await expect(page.locator(".catalogue-heading, .carousel-toolbar")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveClass("sr-only");
  await expect(page.getByText("Explore os projetos. Deslize ou use as setas.", { exact: true })).toHaveClass("sr-only");
  const controls = (await page.locator(".carousel-controls").boundingBox())!;
  const cards = (await page.locator(".carousel-viewport").boundingBox())!;
  expect(controls.y).toBeGreaterThanOrEqual(cards.y + cards.height);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await navigate(page, "Sobre mim");
  expect(await page.locator(".section-view").evaluate(el => parseFloat(getComputedStyle(el).animationDuration))).toBeLessThan(0.01);
});

for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  test(`glass cards, carousel and biography fit ${width}px without page overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.setViewportSize({ width, height: 844 }); await open(page);
    const cards = await page.locator(".metric-card").evaluateAll(elements => elements.map(el => {
      const rect = el.getBoundingClientRect(); const style = getComputedStyle(el);
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, overflow: el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight, blur: style.backdropFilter };
    }));
    expect(cards).toHaveLength(4);
    expect(cards.every(card => !card.overflow && card.blur === "blur(12px)")).toBe(true);
    expect(Math.max(...cards.map(card => card.width)) - Math.min(...cards.map(card => card.width))).toBeLessThan(1);
    expect(Math.abs(cards[0].y - cards[1].y)).toBeLessThan(1);
    expect(width >= 1280 ? Math.abs(cards[3].y - cards[0].y) : cards[2].y - cards[0].y).toBeGreaterThanOrEqual(0);
    if (width >= 1280) expect(Math.abs(cards[3].y - cards[0].y)).toBeLessThan(1);
    else expect(cards[2].y).toBeGreaterThan(cards[0].y + cards[0].height);
    const trigger = page.getByRole("button", { name: "Conheça minha história" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Minha história" });
    await expect(dialog).toBeVisible();
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(12); expect(box.x + box.width).toBeLessThanOrEqual(width - 12);
    expect(box.y + box.height).toBeLessThanOrEqual(844 - 12);
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    for (const paragraph of initialPortfolioData.personal.bioParagraphs) await expect(dialog).toContainText(paragraph);
    await page.keyboard.press("Escape"); await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
    await navigate(page, "Projetos");
    await expect(page.locator(".featured-project")).toHaveCount(0);
    await expect(page.locator(".carousel-originals .project-card")).toHaveCount(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Meu portfólio", exact: true }).click();
    await expect(page.getByRole("dialog")).toContainText("Minha primeira experiência com vibe coding");
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("autoplay is slow, pauses on hover, focus, explicit pause and modal, and wraps continuously", async ({ page }) => {
  await open(page); await navigate(page, "Projetos"); await page.mouse.move(0, 0);
  const viewport = page.locator(".carousel-viewport");
  const position = () => viewport.evaluate(el => el.scrollLeft);
  const start = await position();
  await expect.poll(position).toBeGreaterThan(start + 4);
  const card = page.locator(".carousel-originals .project-card").first();
  await card.hover(); const hovered = await position();
  await page.waitForTimeout(250); expect(Math.abs(await position() - hovered)).toBeLessThanOrEqual(1);
  await page.mouse.move(0, 0); await expect.poll(position).toBeGreaterThan(hovered + 3);
  await page.getByRole("button", { name: "Pausar movimento dos projetos" }).click();
  await page.locator("main").focus(); await page.mouse.move(0, 0);
  const paused = await position(); await page.waitForTimeout(250); expect(await position()).toBe(paused);
  await page.getByRole("button", { name: "Dados & IA", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retomar movimento dos projetos" })).toBeVisible();
  await page.getByRole("button", { name: "Todos os Projetos", exact: true }).click();
  await expect(page.getByRole("button", { name: "Retomar movimento dos projetos" })).toBeVisible();
  await page.getByRole("button", { name: "Retomar movimento dos projetos" }).click();
  await page.locator("main").focus(); await page.mouse.move(0, 0);
  const resumed = await position();
  await expect.poll(position).toBeGreaterThan(resumed + 3);
  await viewport.focus(); const focused = await position(); await page.waitForTimeout(250); expect(await position()).toBe(focused);
  await viewport.evaluate(el => { const cycle = el.querySelector(".carousel-originals")!.getBoundingClientRect().width; el.scrollLeft = cycle * 2 - 3; });
  await page.locator("main").focus(); await page.mouse.move(0, 0);
  await expect.poll(async () => viewport.evaluate(el => el.scrollLeft < el.querySelector(".carousel-originals")!.getBoundingClientRect().width * 1.1)).toBe(true);
  await page.getByRole("button", { name: "Meu portfólio", exact: true }).click();
  const inModal = await position(); await page.waitForTimeout(250); expect(await position()).toBe(inModal);
  await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Meu portfólio", exact: true })).toBeFocused();
});

test("carousel keys and reduced motion leave all projects operable without automatic movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await open(page); await navigate(page, "Projetos");
  const viewport = page.locator(".carousel-viewport");
  await expect(page.getByRole("button", { name: "Sem animação: movimento automático desativado" })).toBeDisabled();
  const before = await viewport.evaluate(el => el.scrollLeft);
  await page.waitForTimeout(250); expect(await viewport.evaluate(el => el.scrollLeft)).toBe(before);
  await viewport.focus(); await page.keyboard.press("ArrowRight");
  expect(await viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(before + 100);
  await page.keyboard.press("Tab");
  await expect(page.locator(".carousel-originals button").first()).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(page.locator(".carousel-originals button").first()).toBeFocused();
});

test("biography preserves page position, contains focus and closes through all three routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await open(page);
  await page.evaluate(() => window.scrollTo({ top: 100, behavior: "instant" }));
  const trigger = page.getByRole("button", { name: "Conheça minha história" });
  await trigger.click(); const scroll = await page.evaluate(() => scrollY);
  const dialog = page.getByRole("dialog", { name: "Minha história" });
  await expect(page.getByRole("button", { name: "Fechar minha história" })).toBeFocused();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Shift+Tab"); await expect(page.getByRole("button", { name: "Voltar à apresentação" })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(page.getByRole("button", { name: "Fechar minha história" })).toBeFocused();
  await page.locator(".biography-dialog-body").evaluate(el => el.scrollTop = el.scrollHeight);
  await expect(page.getByRole("button", { name: "Fechar minha história" })).toBeInViewport();
  await page.keyboard.press("Escape"); await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => scrollY)).toBe(scroll); await expect(trigger).toBeFocused();
  await trigger.click(); await page.getByRole("button", { name: "Fechar minha história" }).click(); await expect(dialog).toHaveCount(0);
  await trigger.click(); await page.locator(".biography-backdrop").click({ position: { x: 2, y: 2 } }); await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("experience cards reveal once on intersection and are immediately readable with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 }); await open(page); await navigate(page, "Experiência");
  await expect(page.locator(".experience-title svg")).toBeVisible();
  const cards = page.locator(".experience-card");
  await expect(cards.first()).toHaveCSS("opacity", "1");
  expect(await cards.last().evaluate(el => Number(getComputedStyle(el).opacity))).toBe(0);
  await cards.last().scrollIntoViewIfNeeded(); await expect(cards.last()).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await cards.last().scrollIntoViewIfNeeded(); await expect(cards.last()).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await navigate(page, "Sobre mim"); await navigate(page, "Experiência");
  expect(await cards.evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1" && getComputedStyle(el).transform === "none"))).toBe(true);
});

test("Reprograma shares the elevation, border and transition of equivalent cards", async ({ page }) => {
  await open(page); await navigate(page, "Formação & Eventos");
  const peer = page.locator("#formacao-ia .surface-card").first();
  const reprograma = page.locator(".reprograma-card");
  const styles = async (selector: typeof peer) => selector.evaluate(el => { const css = getComputedStyle(el); return { transform: css.transform, border: css.borderTopColor, shadow: css.boxShadow, duration: css.transitionDuration }; });
  await peer.hover(); await expect.poll(async () => (await styles(peer)).transform).not.toBe("none"); await page.waitForTimeout(200); const equivalent = await styles(peer);
  await reprograma.hover({ position: { x: 12, y: 12 } }); await page.waitForTimeout(200);
  expect(await styles(reprograma)).toEqual(equivalent);
});

test.describe("touch carousel", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test("native swipe moves cards and pauses automatic movement during the gesture", async ({ page, context }) => {
    await open(page); await navigate(page, "Projetos");
    const viewport = page.locator(".carousel-viewport"); const before = await viewport.evaluate(el => el.scrollLeft);
    const box = (await viewport.boundingBox())!; const y = box.y + 60;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y }] });
    for (const x of [260, 210, 150, 80]) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] }); await page.waitForTimeout(40); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(before + 100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Meu portfólio", exact: true }).click(); await expect(page.getByRole("dialog")).toBeVisible();
  });
});
