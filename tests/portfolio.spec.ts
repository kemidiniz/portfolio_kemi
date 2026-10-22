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
    initialPortfolioData.personal.headline,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Projetos", exact: false })
    .filter({ hasText: "04" })
    .click();
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
  await expect(
    page.getByText("Olá, eu sou Kemily — nova versão.", { exact: true }),
  ).toBeVisible();
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
    initialPortfolioData.personal.headline,
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
  await page.getByText("Novo item 6", { exact: true }).click();
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
