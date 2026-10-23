import { z } from "zod";
import type { PortfolioData } from "../data/portfolioData";
import { supabase } from "./supabase";
import { applyPortfolioUpdates } from "../data/portfolioUpdates";
import { contactLinks } from "./contactLinks";

const text = z.string().max(20000);
const list = z.array(text).max(100);
const link = z
  .string()
  .max(2048)
  .refine(
    (value) =>
      !value ||
      (value.startsWith("/") && !value.startsWith("//")) ||
      /^https?:\/\//i.test(value),
    "Use uma URL http(s) ou um caminho local iniciado por /.",
  );
const itemId = z.string().min(1).max(200);
export const portfolioSchema = z
  .object({
    personal: z.object({
      name: text.min(1),
      nickname: text,
      brandTitle: text.min(1),
      headline: text.min(1),
      subtitle: text,
      age: z.number().int().min(0).max(150),
      location: text,
      email: z.email(),
      linkedin: link,
      linkedinDisplay: text,
      whatsapp: link,
      whatsappDisplay: text,
      avatarUrl: link,
      statusBadge: text,
      motto: text,
      bioParagraphs: list,
      coreValues: z.array(z.object({ title: text, desc: text })).max(100),
      metrics: z
        .array(z.object({ value: text, label: text, detail: text }))
        .max(100),
    }),
    experiences: z
      .array(
        z.object({
          id: itemId,
          role: text,
          company: text,
          period: text,
          location: text,
          badge: text.optional(),
          summary: text,
          achievements: list,
          skills: list,
        }),
      )
      .max(200),
    education: z
      .array(
        z.object({
          id: itemId,
          institution: text,
          degree: text,
          field: text,
          status: text,
          period: text,
          details: text,
        }),
      )
      .max(200),
    techImmersions: z
      .array(
        z.object({
          id: itemId,
          program: text,
          organization: text,
          type: z.enum(["course", "summit", "community"]),
          year: text,
          description: text,
          focus: list,
        }),
      )
      .max(200),
    projects: z
      .array(
        z.object({
          id: itemId,
          title: text,
          category: z.enum([
            "pesquisa",
            "estrategia",
            "comunicacao",
            "dados-ia",
          ]),
          categoryLabel: text,
          year: text,
          tagline: text,
          image: link,
          role: text,
          clientOrContext: text,
          overview: text,
          challenge: text,
          solution: text,
          results: list,
          tools: list,
          featured: z.boolean().optional(),
        }),
      )
      .max(200),
    certifications: z
      .array(
        z.object({
          id: itemId,
          title: text,
          institution: text,
          year: text,
          skillsAcquired: list,
        }),
      )
      .max(200),
    skills: z
      .array(
        z.object({
          category: text,
          description: text,
          items: z
            .array(
              z.object({
                name: text,
                level: z.enum(["Avançado", "Intermediário", "Especialista"]),
              }),
            )
            .max(100),
        }),
      )
      .max(100),
  })
  .superRefine((data, ctx) => {
    for (const key of [
      "experiences",
      "education",
      "techImmersions",
      "projects",
      "certifications",
    ] as const) {
      if (new Set(data[key].map((item) => item.id)).size !== data[key].length)
        ctx.addIssue({
          code: "custom",
          message: "Há identificadores repetidos nesta seção.",
          path: [key],
        });
    }
  });

export function validatePortfolio(value: unknown): PortfolioData {
  const result = portfolioSchema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`Revise ${issue.path.join(" → ")}: ${issue.message}`);
  }
  return result.data;
}
export async function readPortfolio() {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("read_portfolio");
  if (error)
    throw new Error(
      "Não foi possível carregar o conteúdo publicado. Verifique a conexão e a configuração do Supabase.",
    );
  const content = data.content ? validatePortfolio(data.content) : null;
  if (content) {
    const { linkedin, linkedinDisplay, whatsapp } = contactLinks(content.personal);
    content.personal = {
      ...content.personal, linkedin, linkedinDisplay, whatsapp,
      bioParagraphs: content.personal.bioParagraphs.map(paragraph =>
        paragraph.replace(" — mas pode me chamar carinhosamente de Kemi! —", "")),
    };
  }
  return {
    data: content ? applyPortfolioUpdates(content, Number(data.revision) <= 1) : null,
    revision: Number(data.revision),
  };
}
export async function writePortfolio(content: PortfolioData, revision: number) {
  if (!supabase) throw new Error("Conecte o Supabase antes de publicar.");
  const validated = validatePortfolio(content);
  const { data, error } = await supabase.rpc("save_portfolio", {
    content: validated,
    expected_revision: revision,
  });
  if (error) {
    if (error.code === "40001")
      throw new Error(
        "Outra sessão publicou alterações. Copie ou exporte seu rascunho e recarregue a página antes de publicar novamente.",
      );
    if (error.code === "42501")
      throw new Error(
        "Sua conta não tem permissão para publicar. Entre novamente ou peça acesso à administradora.",
      );
    if (error.code === "22023")
      throw new Error(
        `O banco recusou o formato do conteúdo (22023): ${error.message}. O rascunho foi mantido.`,
      );
    if (error.code === "23505")
      throw new Error(
        "Há identificadores repetidos no banco (23505). Seu rascunho foi mantido.",
      );
    if (error.code === "PGRST202")
      throw new Error(
        "A função de publicação não está disponível no Supabase (PGRST202). Confira a migração do banco. Seu rascunho foi mantido.",
      );
    if (error.code === "PGRST301" || error.code === "PGRST302")
      throw new Error(
        "Sua sessão expirou. Exporte o rascunho, entre novamente e tente publicar.",
      );
    throw new Error(
      `Não foi possível publicar${error.code ? ` (${error.code})` : ""}: ${error.message || "sem resposta do servidor"}. Seu rascunho foi mantido.`,
    );
  }
  return Number(data);
}
