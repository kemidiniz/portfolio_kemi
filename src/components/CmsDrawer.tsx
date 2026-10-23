import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  FolderKanban,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import {
  initialPortfolioData,
  type PortfolioData,
} from "../data/portfolioData";
import { supabase } from "../lib/supabase";
import { ImageFraming } from "./ImageFraming";

const UploadActivity = React.createContext<(active: boolean) => void>(() => {});
import { validatePortfolio } from "../lib/portfolio";

const labels: Record<string, string> = {
  personal: "Perfil e contatos",
  experiences: "Experiências",
  education: "Formação acadêmica",
  techImmersions: "Cursos e imersões",
  projects: "Projetos",
  certifications: "Certificações",
  skills: "Habilidades",
  name: "Nome",
  nickname: "Como prefere ser chamada",
  brandTitle: "Nome do portfólio",
  headline: "Título principal",
  subtitle: "Apresentação",
  age: "Idade",
  location: "Localização",
  email: "E-mail",
  linkedin: "Link do LinkedIn",
  linkedinDisplay: "LinkedIn exibido",
  whatsapp: "Link do WhatsApp",
  whatsappDisplay: "Telefone exibido",
  avatarUrl: "Foto de perfil",
  statusBadge: "Disponibilidade",
  motto: "Frase pessoal",
  bioParagraphs: "Parágrafos da biografia",
  coreValues: "Pilares de atuação",
  metrics: "Indicadores de destaque",
  title: "Título",
  desc: "Descrição",
  value: "Valor",
  label: "Rótulo",
  detail: "Detalhe",
  role: "Cargo ou papel",
  company: "Empresa",
  period: "Período",
  badge: "Destaque",
  summary: "Resumo",
  achievements: "Conquistas",
  institution: "Instituição",
  degree: "Grau acadêmico",
  field: "Área de formação",
  status: "Situação",
  details: "Detalhes",
  program: "Programa",
  organization: "Organização",
  type: "Tipo",
  year: "Ano",
  description: "Descrição",
  focus: "Temas",
  category: "Categoria",
  categoryLabel: "Nome da categoria",
  tagline: "Descrição curta",
  image: "Imagem de capa",
  clientOrContext: "Cliente ou contexto",
  overview: "Visão geral",
  challenge: "Desafio",
  solution: "Solução",
  results: "Resultados",
  tools: "Ferramentas",
  featured: "Projeto em destaque",
  skillsAcquired: "Competências desenvolvidas",
  items: "Competências",
  level: "Nível",
};
const choices: Record<string, string[]> = {
  type: ["course", "summit", "community"],
  level: ["Avançado", "Intermediário", "Especialista"],
};
const titles: Record<string, string> = {
  course: "Curso",
  summit: "Evento",
  community: "Comunidade",
  pesquisa: "Pesquisa",
  estrategia: "Estratégia",
  comunicacao: "Comunicação",
  "dados-ia": "Dados e IA",
};
type Json = string | number | boolean | Json[] | { [key: string]: Json };

function emptyLike(value: Json): Json {
  if (Array.isArray(value)) return [];
  if (typeof value === "object" && value)
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [
        key,
        key === "id"
          ? crypto.randomUUID()
          : key === "type"
            ? "course"
            : key === "category"
              ? "estrategia"
              : key === "level"
                ? "Intermediário"
                : emptyLike(v),
      ]),
    );
  return typeof value === "number"
    ? 0
    : typeof value === "boolean"
      ? false
      : "";
}

function Editor({
  value,
  template,
  field,
  path,
  onChange,
}: {
  value: Json;
  template: Json;
  field: string;
  path: string;
  onChange: (value: Json) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const setUploadActivity = React.useContext(UploadActivity);
  useEffect(
    () => () => {
      if (cropSource?.startsWith("blob:")) URL.revokeObjectURL(cropSource);
    },
    [cropSource],
  );
  const [uploadError, setUploadError] = useState("");
  const latestChange = useRef(onChange);
  latestChange.current = onChange;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const id = `field-${path}`;
  if (Array.isArray(value)) {
    const sample =
      (Array.isArray(template) ? template[0] : undefined) ?? value[0] ?? "";
    const move = (from: number, to: number) => {
      const copy = [...value];
      [copy[from], copy[to]] = [copy[to], copy[from]];
      onChange(copy);
    };
    return (
      <div className="editor-list">
        <div className="flex items-center justify-between gap-3">
          <h3>
            {labels[field] || field}{" "}
            <span className="admin-count">{value.length}</span>
          </h3>
          <button
            className="admin-button subtle"
            onClick={() => onChange([...value, emptyLike(sample)])}
          >
            <Plus size={15} />
            Adicionar
          </button>
        </div>
        {!value.length && (
          <p className="admin-muted">Nenhum item ainda. Adicione o primeiro.</p>
        )}
        {value.map((item, index) => (
          <div
            className="editor-item"
            key={
              typeof item === "object" &&
              item &&
              !Array.isArray(item) &&
              typeof item.id === "string"
                ? item.id
                : index
            }
          >
            <div className="editor-item-tools">
              <span className="admin-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-1">
                <button
                  className="admin-icon"
                  aria-label={`Mover item ${index + 1} para cima`}
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  className="admin-icon"
                  aria-label={`Mover item ${index + 1} para baixo`}
                  disabled={index === value.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  className="admin-icon danger"
                  aria-label={`Excluir item ${index + 1}`}
                  onClick={() => {
                    if (
                      confirm(
                        "Remover este item do rascunho? A exclusão só será publicada ao salvar.",
                      )
                    )
                      onChange(value.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            {typeof item === "object" && !Array.isArray(item) ? (
              <details open={value.length === 1}>
                <summary>
                  {String(
                    item.title ||
                      item.role ||
                      item.institution ||
                      item.program ||
                      (Array.isArray(item.items) ? item.category : "") ||
                      item.name ||
                      `Novo item ${index + 1}`,
                  )}
                </summary>
                <Editor
                  value={item}
                  template={sample}
                  field={field}
                  path={`${path}-${index}`}
                  onChange={(next) =>
                    onChange(value.map((v, i) => (i === index ? next : v)))
                  }
                />
              </details>
            ) : (
              <Editor
                value={item}
                template={sample}
                field={field}
                path={`${path}-${index}`}
                onChange={(next) =>
                  onChange(value.map((v, i) => (i === index ? next : v)))
                }
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object" && value)
    return (
      <div className="editor-grid">
        {Object.entries({
          ...value,
          ...("company" in value && !("badge" in value) ? { badge: "" } : {}),
        })
          .filter(([key]) => key !== "id")
          .map(([key, v]) => (
            <div
              className={
                Array.isArray(v) ||
                typeof v === "object" ||
                [
                  "subtitle",
                  "headline",
                  "summary",
                  "description",
                  "overview",
                  "challenge",
                  "solution",
                  "details",
                ].includes(key)
                  ? "editor-wide"
                  : ""
              }
              key={key}
            >
              <Editor
                value={v}
                template={
                  typeof template === "object" &&
                  template &&
                  !Array.isArray(template)
                    ? (template[key] ?? v)
                    : v
                }
                field={key}
                path={`${path}-${key}`}
                onChange={(next) => onChange({ ...value, [key]: next })}
              />
            </div>
          ))}
      </div>
    );
  const options =
    field === "category" &&
    path.startsWith("projects-") &&
    typeof value === "string" &&
    ["pesquisa", "estrategia", "comunicacao", "dados-ia"].includes(value)
      ? ["pesquisa", "estrategia", "comunicacao", "dados-ia"]
      : choices[field];
  const image = ["image", "avatarUrl"].includes(field);
  const long = [
    "subtitle",
    "headline",
    "summary",
    "desc",
    "description",
    "overview",
    "challenge",
    "solution",
    "details",
    "bioParagraphs",
    "achievements",
    "results",
  ].includes(field);
  function frameFile(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setUploadError("Escolha uma imagem JPG, PNG ou WebP de até 5 MB.");
      return;
    }
    setUploadError("");
    setCropSource(URL.createObjectURL(file));
  }
  async function upload(file?: File) {
    if (!file || !supabase) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setUploadError("Escolha uma imagem JPG, PNG ou WebP de até 5 MB.");
      return;
    }
    setUploading(true);
    setUploadActivity(true);
    setUploadError("");
    try {
      const ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      }[file.type];
      const key = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("portfolio-media")
        .upload(key, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      if (mounted.current)
        latestChange.current(
          supabase.storage.from("portfolio-media").getPublicUrl(key).data
            .publicUrl,
        );
    } catch {
      setUploadError(
        "Não foi possível enviar a imagem. Verifique a permissão e o bucket portfolio-media.",
      );
      throw new Error("Falha no envio da imagem.");
    } finally {
      setUploading(false);
      setUploadActivity(false);
    }
  }
  return (
    <div className="admin-field">
      <label htmlFor={id}>{labels[field] || field}</label>
      {typeof value === "boolean" ? (
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      ) : options ? (
        <select
          id={id}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {titles[option] || option}
            </option>
          ))}
        </select>
      ) : long ? (
        <textarea
          id={id}
          rows={3}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={
            typeof value === "number"
              ? "number"
              : field === "email"
                ? "email"
                : "text"
          }
          value={String(value)}
          onChange={(e) =>
            onChange(
              typeof value === "number"
                ? Number(e.target.value)
                : e.target.value,
            )
          }
        />
      )}
      {image && (
        <>
          <label className="admin-upload">
            {uploading ? "Enviando imagem…" : "Enviar imagem do dispositivo"}
            <input
              aria-label={`Enviar ${labels[field]}`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => {
                frameFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <span className="admin-muted">
            JPG, PNG ou WebP, até 5 MB. Você também pode colar a URL acima.
          </span>
          {value && (
            <div className="image-field-preview">
              <img src={String(value)} alt={`Prévia: ${labels[field]}`} />
              <button
                type="button"
                className="admin-button subtle"
                disabled={uploading}
                onClick={() => {
                  setUploadError("");
                  setCropSource(String(value));
                }}
              >
                Ajustar enquadramento
              </button>
            </div>
          )}
          {cropSource && (
            <ImageFraming
              source={cropSource}
              profile={field === "avatarUrl"}
              onCancel={() => setCropSource(null)}
              onApply={async (file) => {
                await upload(file);
                setCropSource(null);
              }}
            />
          )}
          {uploadError && (
            <p role="alert" className="admin-error">
              {uploadError}
            </p>
          )}
        </>
      )}
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onUpdateData: (data: PortfolioData) => Promise<void>;
  session: Session | null;
  isAdmin: boolean;
  checking: boolean;
  authError: string;
  canPublish: boolean;
}
export function CmsDrawer({
  isOpen,
  onClose,
  data,
  onUpdateData,
  session,
  isAdmin,
  checking,
  authError,
  canPublish,
}: Props) {
  const [tab, setTab] = useState<keyof PortfolioData>("personal");
  const [draft, setDraft] = useState(data);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [working, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const busy = working || uploads > 0;
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data);
  const close = () => {
    if (
      !busy &&
      (!isAdmin ||
        !dirty ||
        confirm("Sair sem publicar as alterações deste rascunho?"))
    )
      onClose();
  };
  useEffect(() => {
    if (isOpen) {
      setDraft(structuredClone(data));
      setError("");
      setSaved(false);
    }
  }, [isOpen]);
  useEffect(() => {
    if (!isAdmin) setPassword("");
  }, [isAdmin]);
  useEffect(() => {
    if (!isOpen) return;
    const before = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      before?.focus();
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || !dirty || !isAdmin) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isOpen, dirty, isAdmin]);
  if (!isOpen) return null;
  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error)
        setError(
          "Não foi possível entrar. Verifique seu e-mail, senha e a confirmação da conta.",
        );
      else setPassword("");
    } catch {
      setError("Sem conexão com o Supabase. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const valid = validatePortfolio(draft);
      await onUpdateData(valid);
      setDraft(valid);
      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Não foi possível publicar.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (dirty && !confirm("Sair e descartar o rascunho não publicado?")) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      setDraft(data);
    } catch {
      setError("Não foi possível sair. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-rascunho.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  const sections = Object.keys(initialPortfolioData) as (keyof PortfolioData)[];
  return (
    <div
      className="admin-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`admin-shell ${!isAdmin ? "admin-auth-shell" : ""}`}
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
          if (e.key === "Tab") {
            const nodes = dialog.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, a[href]",
            );
            const visible = Array.from(nodes || []).filter(
              (n) => n.getClientRects().length,
            );
            const first = visible[0],
              last = visible.at(-1);
            if (
              e.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === dialog.current)
            ) {
              e.preventDefault();
              last?.focus();
            } else if (
              !e.shiftKey &&
              (document.activeElement === last ||
                document.activeElement === dialog.current)
            ) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <header className="admin-header">
          <div className="flex items-center gap-3">
            <span className="admin-logo">
              <FolderKanban size={21} />
            </span>
            <div>
              <p className="admin-eyebrow">SEU CONTEÚDO, SUA HISTÓRIA</p>
              <h2 id="admin-title">Estúdio do portfólio</h2>
            </div>
          </div>
          <button
            aria-label="Fechar área administrativa"
            className="admin-icon"
            onClick={close}
            disabled={busy}
          >
            <X size={21} />
          </button>
        </header>
        {checking ? (
          <div className="admin-login">
            <LoaderCircle className="animate-spin" />
            <p>Verificando acesso…</p>
          </div>
        ) : !isAdmin ? (
          <div className="admin-login">
            <span className="admin-login-icon">
              <LockKeyhole size={28} />
            </span>
            <h3>Um espaço para a sua próxima versão.</h3>
            <p className="admin-muted">
              Entre com sua conta autorizada para atualizar e publicar as
              informações do portfólio.
            </p>
            {!supabase ? (
              <div className="admin-notice">
                A conexão com o Supabase ainda não foi configurada. O portfólio
                continua disponível para leitura.
              </div>
            ) : session ? (
              <>
                <p className="admin-notice">
                  {authError ||
                    "Esta conta não tem permissão de administradora. Peça acesso à responsável pelo projeto."}
                </p>
                <button
                  className="admin-button"
                  onClick={() => void logout()}
                  disabled={busy}
                >
                  Sair e usar outra conta
                </button>
              </>
            ) : (
              <form onSubmit={login} className="space-y-5">
                <div className="admin-field">
                  <label htmlFor="admin-email">E-mail</label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="admin-password">Senha</label>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="admin-button primary w-full" disabled={busy}>
                  {busy ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <LockKeyhole size={16} />
                  )}
                  Entrar na área administrativa
                </button>
              </form>
            )}
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <p className="admin-security">
              <ShieldCheck size={15} />
              Acesso restrito a contas autorizadas.
            </p>
          </div>
        ) : (
          <>
            <div className="admin-workspace">
              <aside className="admin-sidebar">
                <p className="admin-eyebrow">CONTEÚDO DO SITE</p>
                <nav aria-label="Seções do editor">
                  {sections.map((key, index) => (
                    <button
                      key={key}
                      className={tab === key ? "selected" : ""}
                      aria-current={tab === key ? "page" : undefined}
                      disabled={busy}
                      onClick={() => setTab(key)}
                    >
                      <span className="admin-section-number">0{index + 1}</span>
                      {labels[key]}
                      {Array.isArray(draft[key]) && (
                        <span className="admin-count">{draft[key].length}</span>
                      )}
                    </button>
                  ))}
                </nav>
                <div className="admin-account">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Administradora</strong>
                    <span>{session?.user.email}</span>
                  </div>
                  <button
                    className="admin-icon"
                    aria-label="Sair da conta"
                    onClick={() => void logout()}
                    disabled={busy}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </aside>
              <div className="admin-content">
                <div className="admin-section-heading">
                  <div>
                    <p className="admin-eyebrow">EDITAR E PUBLICAR</p>
                    <h3>{labels[tab]}</h3>
                    <p className="admin-muted">
                      As alterações ficam no rascunho até você publicar.
                    </p>
                  </div>
                  <span className="admin-status">
                    {saved && !dirty
                      ? "Publicado"
                      : dirty
                        ? "Alterações pendentes"
                        : "Sem alterações"}
                  </span>
                </div>
                {!canPublish && (
                  <p className="admin-notice">
                    O conteúdo publicado não pôde ser carregado. Recarregue a
                    página antes de editar para evitar sobrescrever informações.
                  </p>
                )}
                <fieldset disabled={busy || !canPublish} className="min-w-0">
                  <UploadActivity.Provider
                    value={(active) =>
                      setUploads((count) =>
                        Math.max(0, count + (active ? 1 : -1)),
                      )
                    }
                  >
                    <Editor
                      key={tab}
                      value={draft[tab] as unknown as Json}
                      template={initialPortfolioData[tab] as unknown as Json}
                      field={tab}
                      path={tab}
                      onChange={(next) => {
                        setDraft((current) => ({ ...current, [tab]: next }));
                        setSaved(false);
                      }}
                    />
                  </UploadActivity.Provider>
                </fieldset>
              </div>
            </div>
            <footer className="admin-toolbar">
              <div className="admin-publication-feedback" aria-live="polite">
                {error ? (
                  <div className="publication-error">
                    <p role="alert" className="admin-error">
                      {error}
                    </p>
                    <button
                      type="button"
                      className="admin-button subtle"
                      onClick={() => void navigator.clipboard.writeText(error)}
                    >
                      Copiar erro
                    </button>
                  </div>
                ) : saved ? (
                  <span className="admin-success">
                    <Check size={16} />
                    Conteúdo publicado no site.
                  </span>
                ) : (
                  <span className="admin-muted">
                    Publique para atualizar o site para todos.
                  </span>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="admin-button subtle" onClick={download}>
                  <Download size={16} />
                  <span className="hidden sm:inline">Exportar rascunho</span>
                </button>
                <button
                  className="admin-button primary"
                  disabled={busy || !canPublish}
                  onClick={() => void publish()}
                >
                  {busy ? (
                    <LoaderCircle className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}{" "}
                  {uploads > 0
                    ? "Enviando imagem…"
                    : busy
                      ? "Publicando…"
                      : "Publicar alterações"}
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
