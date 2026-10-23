import { test, expect, type Page } from "@playwright/test";
import { initialPortfolioData } from "../src/data/portfolioData";

async function setup(page: Page, admin = false, conflict = false) {
  let content = structuredClone(initialPortfolioData);
  let revision = 1;
  await page.route(
    "https://exlthhgqgbxlngpnxrqs.supabase.co/**",
    async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith("/read_portfolio"))
        return route.fulfill({ json: { content, revision } });
      if (url.pathname.endsWith("/is_portfolio_admin"))
        return route.fulfill({ json: admin });
      if (url.pathname.endsWith("/save_portfolio")) {
        if (conflict)
          return route.fulfill({
            status: 409,
            json: { code: "40001", message: "Content changed" },
          });
        content = route.request().postDataJSON().content;
        return route.fulfill({ json: ++revision });
      }
      if (url.pathname.endsWith("/token")) {
        const user = {
          id: "00000000-0000-0000-0000-000000000001",
          email: "admin@example.test",
          aud: "authenticated",
          role: "authenticated",
          app_metadata: { provider: "email" },
          user_metadata: {},
          created_at: new Date().toISOString(),
        };
        const token = [
          Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
          Buffer.from(
            JSON.stringify({
              sub: user.id,
              exp: Math.floor(Date.now() / 1000) + 3600,
              aud: "authenticated",
              role: "authenticated",
            }),
          ).toString("base64url"),
          "test-signature",
        ].join(".");
        return route.fulfill({
          json: {
            access_token: token,
            token_type: "bearer",
            refresh_token: "test-refresh",
            expires_in: 3600,
            user,
          },
        });
      }
      if (url.pathname.endsWith("/logout"))
        return route.fulfill({ status: 204 });
      return route.fulfill({ status: 404, json: { message: "Not mocked" } });
    },
  );
}
async function navigate(page: Page, label: string) {
  const opener = page.getByRole("button", {
    name: "Abrir navegação",
    exact: true,
  });
  if (await opener.isVisible()) await opener.click();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("button", { name: label, exact: true })
    .click();
}
async function login(page: Page) {
  await page.getByRole("button", { name: "Área admin", exact: true }).click();
  await page.getByLabel("E-mail", { exact: true }).fill("admin@example.test");
  await page.getByLabel("Senha", { exact: true }).fill("test-password");
  await page
    .getByRole("button", { name: "Entrar na área administrativa" })
    .click();
}

test("public portfolio renders on mobile without overflow and requires login", async ({
  page,
}) => {
  await setup(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    `Oie, sou a ${initialPortfolioData.personal.nickname}!`,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await navigate(page, "Projetos");
  await expect(
    page.getByRole("heading", {
      name: initialPortfolioData.projects[0].title,
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Área admin", exact: true }).click();
  await expect(page.getByLabel("Senha", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Publicar alterações" }),
  ).toHaveCount(0);
});
test("authenticated reader cannot access the editor", async ({ page }) => {
  await setup(page, false);
  await page.goto("/");
  await login(page);
  await expect(
    page.getByText("Esta conta não tem permissão de administradora.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Publicar alterações" }),
  ).toHaveCount(0);
});
test("admin publishes personal info and can manage every content section", async ({
  page,
}) => {
  await setup(page, true);
  await page.goto("/");
  await login(page);
  await expect(
    page.getByRole("button", { name: "Publicar alterações" }),
  ).toBeVisible();
  await page.getByLabel("Nome", { exact: true }).fill("Kemily — nova versão");
  await page.getByRole("button", { name: "Publicar alterações" }).click();
  await expect(
    page.getByText("Conteúdo publicado no site.", { exact: true }),
  ).toBeVisible();
  for (const label of [
    "Experiências",
    "Formação acadêmica",
    "Cursos e imersões",
    "Projetos",
    "Certificações",
    "Habilidades",
  ]) {
    await page
      .getByRole("navigation", { name: "Seções do editor" })
      .getByRole("button", { name: label, exact: false })
      .click();
    await expect(
      page.getByRole("heading", { name: label, exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Adicionar", exact: true }).first(),
    ).toBeVisible();
  }
  await page
    .getByRole("button", { name: "Fechar área administrativa" })
    .click();
  await page.reload();
  await expect(page.locator(".profile-portrait figcaption strong")).toHaveText(
    "Kemily — nova versão",
  );
});
test("conflicting save keeps draft and does not claim success", async ({
  page,
}) => {
  await setup(page, true, true);
  await page.goto("/");
  await login(page);
  await page.getByLabel("Nome", { exact: true }).fill("Rascunho preservado");
  await page.getByRole("button", { name: "Publicar alterações" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Outra sessão publicou alterações",
  );
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue(
    "Rascunho preservado",
  );
  await expect(
    page.getByText("Conteúdo publicado no site.", { exact: true }),
  ).toHaveCount(0);
});
test("unavailable backend blocks publishing but leaves portfolio readable", async ({
  page,
}) => {
  await page.route("**/rest/v1/rpc/**", (route) =>
    route.fulfill({ status: 503, json: { message: "Unavailable" } }),
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "Exibindo a versão de apresentação",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    `Oie, sou a ${initialPortfolioData.personal.nickname}!`,
  );
});

test("admin adds, reorders and removes projects before publishing", async ({
  page,
}) => {
  await setup(page, true);
  await page.goto("/");
  await login(page);
  await page
    .getByRole("navigation", { name: "Seções do editor" })
    .getByRole("button", { name: "Projetos" })
    .click();
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();
  await page.getByText(`Novo item ${initialPortfolioData.projects.length + 1}`, { exact: true }).click();
  const added = page
    .locator(".admin-content > fieldset > .editor-list > .editor-item")
    .last();
  await added
    .getByLabel("Título", { exact: true })
    .fill("Novo projeto editorial");
  await added
    .getByLabel("Descrição curta", { exact: true })
    .fill("Projeto criado pelo painel.");
  await page.getByRole("button", { name: "Mover item 6 para cima" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Excluir item 1", exact: true })
    .click();
  await page.getByRole("button", { name: "Publicar alterações" }).click();
  await expect(
    page.getByText("Conteúdo publicado no site.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Fechar área administrativa" })
    .click();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("button", { name: "Projetos" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Novo projeto editorial", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: initialPortfolioData.projects[0].title,
      exact: true,
    }),
  ).toHaveCount(0);
});

test("invalid links cannot be published and invalid image types are rejected", async ({
  page,
}) => {
  await setup(page, true);
  await page.goto("/");
  await login(page);
  await page
    .getByLabel("Link do LinkedIn", { exact: true })
    .fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Publicar alterações" }).click();
  await expect(page.getByRole("alert")).toContainText("linkedin");
  await page
    .getByLabel("Enviar Foto de perfil", { exact: true })
    .setInputFiles({
      name: "unsafe.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from("<svg/>"),
    });
  await expect(
    page.getByText("Escolha uma imagem JPG, PNG ou WebP de até 5 MB.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("header navigation replaces content and biography opens on demand", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Navegação principal",
  });
  await expect(
    page.getByRole("region", { name: "Biografia", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Conheça minha história" }).click();
  await expect(
    page.getByRole("region", { name: "Biografia", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveClass(/sr-only/);
  await page.getByRole("button", { name: "Voltar à apresentação" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const sections = [
    ["Experiência", "#experiencia"],
    ["Formação & IA", "#formacao-ia"],
    ["Projetos", "#projetos"],
    ["Certificações", "#certificacoes"],
  ];
  for (const [label, heading] of sections) {
    await navigation.getByRole("button", { name: label, exact: true }).click();
    await expect(
      navigation.getByRole("button", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.locator(heading)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveClass(/sr-only/);
  }
  await navigation
    .getByRole("button", { name: "Sobre mim", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Canais de Contato", exact: true }),
  ).toHaveCount(0);
});

test("night mode persists and applies to other sections and admin login", async ({
  page,
}) => {
  await setup(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const light = await page
    .locator(".portfolio-site")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page
    .getByRole("button", { name: "Ativar modo escuro", exact: true })
    .click();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await expect(page.locator(".portfolio-site")).toHaveCSS(
    "background-color",
    "rgb(20, 18, 22)",
  );
  const dark = await page
    .locator(".portfolio-site")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(dark).not.toEqual(light);
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("button", { name: "Projetos", exact: true })
    .click();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await page.getByRole("button", { name: "Área admin", exact: true }).click();
  const shell = await page
    .getByRole("dialog")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(shell).not.toBe("rgb(255, 253, 250)");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Ativar modo claro", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Ativar modo claro", exact: true })
    .click();
  await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
});

test("hover feedback is visible and reduced motion removes transitions", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/");
  await navigate(page, "Projetos");
  const metric = page.locator(".project-card").first();
  await metric.hover();
  await expect
    .poll(() => metric.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await metric.evaluate((el) =>
      parseFloat(getComputedStyle(el).transitionDuration),
    ),
  ).toBeLessThan(0.01);
});

for (const width of [320, 390, 768, 1024]) {
  test(`responsive menu and content work at ${width}px`, async ({ page }) => {
    await setup(page);
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByText("Oie, sou a Kemi!", { exact: true }),
    ).toBeVisible();
    const menu = page.getByRole("button", {
      name: "Abrir navegação",
      exact: true,
    });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(
      page.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    for (const label of [
      "Sobre mim",
      "Experiência",
      "Formação & IA",
      "Projetos",
      "Certificações",
    ]) {
      await navigate(page, label);
      await expect(
        page.getByRole("navigation", { name: "Navegação principal" }),
      ).toBeHidden();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("desktop header stays in one row and key information fits a standard screen", async ({
  page,
}) => {
  await setup(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Abrir navegação" }),
  ).toBeHidden();
  const brand = await page.locator(".site-brand").boundingBox();
  const nav = await page
    .getByRole("navigation", { name: "Navegação principal" })
    .boundingBox();
  const actions = await page.locator(".header-actions").boundingBox();
  expect(
    Math.abs(brand!.y + brand!.height / 2 - (nav!.y + nav!.height / 2)),
  ).toBeLessThan(5);
  expect(
    Math.abs(brand!.y + brand!.height / 2 - (actions!.y + actions!.height / 2)),
  ).toBeLessThan(5);
  const metrics = await page.locator(".profile-metrics").boundingBox();
  expect(metrics!.y + metrics!.height).toBeLessThan(800);
  expect(
    await page
      .locator(".profile-description")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(12);
});

test("experience starts collapsed and page introductions do not repeat navigation titles", async ({
  page,
}) => {
  await setup(page);
  await page.goto("/");
  await navigate(page, "Experiência");
  await expect(
    page.getByRole("heading", { name: "Trajetória Profissional", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Experiência Corporativa", exact: true }),
  ).toHaveCount(0);
  const toggles = page.getByRole("button", {
    name: "Ver Conquistas & Escopo",
    exact: true,
  });
  expect(await toggles.count()).toBe(initialPortfolioData.experiences.length);
  await expect(
    page.getByText(initialPortfolioData.experiences[0].summary, {
      exact: true,
    }),
  ).toBeVisible();
  await toggles.first().click();
  await expect(
    page.getByText(initialPortfolioData.experiences[0].summary, {
      exact: true,
    }),
  ).toBeVisible();
  await navigate(page, "Projetos");
  await expect(page.locator("#projetos h2")).toHaveCount(1);
  await expect(
    page.getByText("Clique em qualquer card", { exact: false }),
  ).toHaveCount(0);
  await navigate(page, "Experiência");
  expect(await toggles.count()).toBe(initialPortfolioData.experiences.length);
  await navigate(page, "Formação & IA");
  await expect(page.locator("#formacao-ia h2")).toHaveCount(0);
  await navigate(page, "Certificações");
  await expect(page.locator("#certificacoes h2")).toHaveCount(0);
});

for (const width of [390, 1280]) {
  test(`project close stays visible after scrolling at ${width}px`, async ({
    page,
  }) => {
    await setup(page);
    await page.setViewportSize({ width, height: 720 });
    await page.goto("/");
    await navigate(page, "Projetos");
    const opener = page.getByRole("button", {
      name: `${initialPortfolioData.projects[0].title}`,
      exact: true,
    });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.locator(".project-dialog-body").evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    const close = dialog.getByRole("button", {
      name: "Fechar projeto",
      exact: true,
    });
    await expect(close).toBeVisible();
    const bounds = await close.boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThan(720);
    await close.click();
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

for (const width of [390, 1280]) {
  test(`publication error does not overlap the account at ${width}px`, async ({
    page,
  }) => {
    await setup(page, true);
    await page.route("**/rest/v1/rpc/save_portfolio", (r) =>
      r.fulfill({
        status: 500,
        json: {
          code: "42702",
          message: "Ambiguous column in database function",
        },
      }),
    );
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/");
    await login(page);
    await page.getByLabel("Nome", { exact: true }).fill("Rascunho preservado");
    await page
      .getByRole("button", { name: "Publicar alterações", exact: true })
      .click();
    await expect(page.getByRole("alert")).toContainText("42702");
    await expect(page.getByLabel("Nome", { exact: true })).toHaveValue(
      "Rascunho preservado",
    );
    const account = await page.locator(".admin-account").boundingBox(),
      toolbar = await page.locator(".admin-toolbar").boundingBox();
    expect(account!.y + account!.height).toBeLessThanOrEqual(toolbar!.y + 1);
    await expect(
      page.getByRole("button", { name: "Sair da conta", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Copiar erro", exact: true }),
    ).toBeVisible();
  });
}

test("photo can be framed and uploaded before publishing without losing other edits", async ({
  page,
}) => {
  await setup(page, true);
  let uploads = 0;
  await page.route("**/storage/v1/object/portfolio-media/**", (route) => {
    if (route.request().method() === "POST") {
      uploads++;
      return route.fulfill({
        json: {
          Key: "portfolio-media/test.jpg",
          Id: "00000000-0000-0000-0000-000000000001",
        },
      });
    }
    return route.fulfill({ status: 404 });
  });
  await page.goto("/");
  await login(page);
  await page
    .getByLabel("Nome", { exact: true })
    .fill("Kemi — retrato atualizado");
  await page
    .getByLabel("Enviar Foto de perfil", { exact: true })
    .setInputFiles("public/assets/aistudio/IMG_1992_c0be0322.jpeg");
  const crop = page.getByRole("dialog", {
    name: "Enquadrar foto de perfil",
    exact: true,
  });
  await expect(crop).toBeVisible();
  await expect(
    crop.getByRole("button", { name: "Usar enquadramento", exact: true }),
  ).toBeEnabled();
  const before = await crop
    .locator("canvas")
    .evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  await crop
    .getByRole("slider", { name: "Zoom da imagem", exact: true })
    .fill("1.6");
  await crop
    .getByRole("slider", { name: "Posição vertical da imagem", exact: true })
    .fill("40");
  await expect
    .poll(() =>
      crop
        .locator("canvas")
        .evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
    )
    .not.toBe(before);
  await crop
    .getByRole("button", { name: "Usar enquadramento", exact: true })
    .click();
  await expect(crop).toHaveCount(0);
  expect(uploads).toBe(1);
  await expect(page.getByLabel("Foto de perfil", { exact: true })).toHaveValue(
    /\/storage\/v1\/object\/public\/portfolio-media\/.+\.jpg$/,
  );
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue(
    "Kemi — retrato atualizado",
  );
  await page
    .getByRole("button", { name: "Publicar alterações", exact: true })
    .click();
  await expect(
    page.getByText("Conteúdo publicado no site.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Fechar área administrativa", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".profile-portrait figcaption strong")).toHaveText(
    "Kemi — retrato atualizado",
  );
});

test("mobile framing preview and controls have separate scrollable space", async ({
  page,
}) => {
  await setup(page, true);
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  await login(page);
  await page
    .getByLabel("Enviar Foto de perfil", { exact: true })
    .setInputFiles("public/assets/aistudio/IMG_1992_c0be0322.jpeg");
  const dialog = page.getByRole("dialog", {
    name: "Enquadrar foto de perfil",
    exact: true,
  });
  await expect(
    dialog.getByRole("button", { name: "Usar enquadramento", exact: true }),
  ).toBeEnabled();
  const preview = await dialog.locator(".crop-preview").boundingBox(),
    controls = await dialog.locator(".crop-controls").boundingBox();
  expect(preview!.y + preview!.height).toBeLessThanOrEqual(controls!.y);
  await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel("Foto de perfil", { exact: true })).toHaveValue(
    initialPortfolioData.personal.avatarUrl,
  );
});

test("compact overview stacks highlights beside portrait and keeps biography return discreet", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await setup(page);
  await page.goto("/");
  await expect(page.locator(".site-brand small")).toHaveText("Estratégia e Comunicação");
  await expect(page.locator(".profile-status")).toHaveCount(0);
  await page.locator(".section-view").evaluate(async element => {
    await Promise.all(element.getAnimations().map(animation => animation.finished));
  });
  await page.evaluate(() => document.fonts.ready);
  const cards = await page.locator(".metric-card").all();
  const portrait = (await page.locator(".profile-portrait").boundingBox())!;
  let bottom = 0;
  for (const card of cards) {
    const box = (await card.boundingBox())!;
    expect(box.x + box.width).toBeLessThan(portrait.x);
    expect(box.y).toBeGreaterThanOrEqual(bottom);
    bottom = box.y + box.height;
  }
  expect(bottom).toBeLessThan(800);
  const metrics = (await page.locator(".profile-metrics").boundingBox())!;
  const intro = (await page.locator(".profile-copy").boundingBox())!;
  expect(Math.abs(metrics.x - intro.x)).toBeLessThan(2);
  expect(metrics.y).toBeGreaterThanOrEqual(intro.y + intro.height);
  expect(Math.abs(bottom - (portrait.y + portrait.height))).toBeLessThan(2);
  await page.getByRole("button", { name: "Conheça minha história" }).click();
  await expect(page.locator("#sobre h2")).toHaveCount(0);
  await expect(page.getByText("Trajetória & Essência", { exact: true })).toHaveCount(0);
  await expect(page.locator("#sobre").getByText(`${initialPortfolioData.personal.age} anos`, { exact: true })).toHaveCount(0);
  const back = page.getByRole("button", { name: "Voltar à apresentação" });
  await expect(back).toBeVisible();
  await expect(back).toHaveText("");
  const backBox = (await back.boundingBox())!;

  const paragraphs = page.locator("#sobre p.text-balance");
  const lastParagraph = (await paragraphs.last().boundingBox())!;
  const purpose = (await page.locator(".purpose-card").boundingBox())!;
  const firstParagraph = (await paragraphs.first().boundingBox())!;
  expect(backBox.y).toBeGreaterThanOrEqual(lastParagraph.y + lastParagraph.height);
  expect(purpose.y + purpose.height).toBeLessThanOrEqual(firstParagraph.y);
  await expect(page.getByText("Propósito Pessoal & Profissional", { exact: true })).toBeVisible();
  await expect(page.locator("#sobre")).not.toContainText("mas pode me chamar carinhosamente de Kemi!");
  await back.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("contact cards use published phone to repair legacy sample WhatsApp links", async ({ page }) => {
  await setup(page);
  const content = structuredClone(initialPortfolioData);
  content.personal.whatsapp = "https://wa.me/5511999999999?text=Oi%20Kemi";
  content.personal.whatsappDisplay = "+55 (11) 95020-1858";
  content.personal.linkedin = "https://www.linkedin.com/in/kemily-diniz/";
  content.personal.linkedinDisplay = "linkedin.com/in/kemily-diniz";
  await page.route("**/rest/v1/rpc/read_portfolio", route => route.fulfill({ json: { content, revision: 1 } }));
  await page.goto("/");
  await expect(page.locator(".profile-links")).toHaveCount(0);
  const contacts = page.getByRole("navigation", { name: "Contatos do rodapé" });
  await expect(contacts.getByRole("link")).toHaveCount(3);
  await expect(contacts.getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute("href", "https://wa.me/5511950201858?text=Oi%20Kemi");
  await expect(contacts.getByRole("link", { name: `E-mail: ${content.personal.email}`, exact: true })).toHaveAttribute("href", `mailto:${content.personal.email}`);
  await expect(contacts.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", "https://br.linkedin.com/in/kemilydiniz");

  await expect(page.getByText("Currículo Profissional Completo", { exact: true })).toHaveCount(0);
});

for (const width of [320, 1280]) {
  test(`persistent contact footer stays visible without covering content at ${width}px`, async ({ page }) => {
    await setup(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const footer = page.getByRole("contentinfo", { name: "Contatos permanentes" });
    await expect(footer.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", "https://br.linkedin.com/in/kemilydiniz");
    await expect(footer.getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute("href", /wa.me\/5511950201858/);
    if (width === 1280) {
      for (const selector of [".profile-heading h1", ".profile-description"]) {
        const lines = await page.locator(selector).evaluate(el => {
          const range = document.createRange(); range.selectNodeContents(el);
          return new Set([...range.getClientRects()].filter(r => r.width > 0).map(r => Math.round(r.y))).size;
        });
        expect(lines).toBe(1);
      }
    }
    await page.getByRole("button", { name: "Conheça minha história" }).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const box = (await footer.boundingBox())!;
    expect(Math.abs(box.y + box.height - 800)).toBeLessThan(2);
    const back = (await page.getByRole("button", { name: "Voltar à apresentação" }).boundingBox())!;
    expect(back.y + back.height).toBeLessThanOrEqual(box.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await navigate(page, "Projetos");
    await expect(footer).toBeVisible();
  });
}

test("compact projects, aligned skills and permanent contacts replace the contact tab", async ({ page }) => {
  await setup(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("button", { name: "Contato", exact: true })).toHaveCount(0);
  await expect(page.locator(".site-footer").getByRole("button", { name: "Área administrativa" })).toHaveCount(0);
  await expect(page.locator(".metric-card").nth(1)).toContainText("2 formações");
  await expect(page.locator(".metric-card").nth(1)).toContainText("RH & Marketing");
  const heading = (await page.locator(".profile-heading").boundingBox())!;
  const photo = (await page.locator(".profile-portrait").boundingBox())!;
  expect(Math.abs(photo.y - heading.y)).toBeLessThan(2);
  await navigate(page, "Certificações");
  await expect(page.locator(".skill-group")).toHaveCount(3);
  const rows = await page.locator(".skill-group").evaluateAll(groups => groups.map(group => [...group.querySelectorAll('.skill-row')].map(row => row.getBoundingClientRect().y)));
  for (let row = 0; row < 5; row++) {
    expect(Math.max(...rows.map(group => group[row])) - Math.min(...rows.map(group => group[row]))).toBeLessThan(2);
  }
  for (const group of await page.locator(".skill-group").all()) await expect(group.locator(".skill-row")).toHaveCount(5);
  await expect(page.locator("#certificacoes")).not.toContainText("Power BI");
  await navigate(page, "Projetos");
  const filters = (await page.locator(".projects-filters").boundingBox())!;
  const grid = (await page.locator(".projects-grid").boundingBox())!;
  expect(Math.abs(filters.width - grid.width)).toBeLessThan(2);
  expect((await page.locator(".project-card").first().boundingBox())!.height).toBeLessThan(350);
  await page.getByRole("button", { name: "Agente Gi: inglês com IA", exact: true }).click();
  await expect(page.getByRole("link", { name: "Abrir Agente Gi no Gemini" })).toHaveAttribute("href", "https://gemini.google.com/gem/1LbceA06YOwXQ-_ZtgwmIqwKuNAQifuko?usp=sharing");
  await page.getByRole("button", { name: "Fechar projeto", exact: true }).click();
  await page.getByRole("button", { name: "Meu portfólio", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Pensei o front-end, o back-end, o banco de dados e os conectores");
});

test("mobile photo fills its column and reprograma community labels do not overlap", async ({ page }) => {
  await setup(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const photo = (await page.locator(".profile-portrait").boundingBox())!;
  const grid = (await page.locator(".profile-grid").boundingBox())!;
  expect(Math.abs(photo.width - grid.width)).toBeLessThan(2);
  await navigate(page, "Formação & IA");
  const labels = await page.locator(".reprograma-community > span").all();
  let bottom = 0;
  for (const label of labels) {
    const box = (await label.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(bottom);
    bottom = box.y + box.height;
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
