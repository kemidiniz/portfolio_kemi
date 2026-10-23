import { useEffect, useRef, useState } from "react";
import { LoaderCircle, RotateCcw, X } from "lucide-react";

// Cropping produces a new image file. Existing portfolio records keep their
// current URL-only format, so publishing needs no schema changes.
export function ImageFraming({
  source,
  profile,
  onCancel,
  onApply,
}: {
  source: string;
  profile: boolean;
  onCancel: () => void;
  onApply: (file: File) => Promise<void>;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1),
    [x, setX] = useState(0),
    [y, setY] = useState(0);
  const [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null),
    dialog = useRef<HTMLDivElement>(null);
  const width = profile ? 900 : 1440,
    height = profile ? 1200 : 810;
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (alive) setImage(img);
    };
    img.onerror = () => {
      if (alive)
        setError(
          "Não foi possível abrir esta imagem para ajuste. Envie uma imagem do dispositivo.",
        );
    };
    img.src = source;
    const before = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      alive = false;
      before?.focus();
    };
  }, [source]);
  useEffect(() => {
    if (!image || !canvas.current) return;
    const context = canvas.current.getContext("2d");
    if (!context) return;
    const scale =
      Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
    const w = image.naturalWidth * scale,
      h = image.naturalHeight * scale;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(
      image,
      (width - w) / 2 + ((x / 100) * (w - width)) / 2,
      (height - h) / 2 + ((y / 100) * (h - height)) / 2,
      w,
      h,
    );
  }, [image, zoom, x, y, width, height]);
  async function apply() {
    if (!canvas.current || !image) return;
    setSaving(true);
    setError("");
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        try {
          canvas.current!.toBlob(
            (value) => (value ? resolve(value) : reject(new Error())),
            "image/jpeg",
            0.92,
          );
        } catch (e) {
          reject(e);
        }
      });
      await onApply(
        new File([blob], `portfolio-${crypto.randomUUID()}.jpg`, {
          type: "image/jpeg",
        }),
      );
    } catch {
      setError(
        "Não foi possível salvar o enquadramento. Confira a conexão e tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="crop-backdrop">
      <div
        className="crop-dialog"
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape" && !saving) onCancel();
          if (e.key === "Tab") {
            const nodes = Array.from(
              dialog.current?.querySelectorAll<HTMLElement>(
                "button:not(:disabled),input:not(:disabled)",
              ) || [],
            );
            const first = nodes[0],
              last = nodes.at(-1);
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <header>
          <h3 id="crop-title">
            {profile
              ? "Enquadrar foto de perfil"
              : "Enquadrar imagem do projeto"}
          </h3>
          <button
            className="admin-icon"
            aria-label="Cancelar enquadramento"
            disabled={saving}
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </header>
        <div className="crop-content">
          <div className={`crop-preview ${profile ? "is-profile" : ""}`}>
            <canvas ref={canvas} width={width} height={height} />
            {!image && !error && <LoaderCircle className="animate-spin" />}
          </div>
          <div className="crop-controls">
            <p>
              Ajuste a aproximação e a posição. A prévia mostra o recorte que
              será salvo.
            </p>
            <label>
              Zoom
              <input
                aria-label="Zoom da imagem"
                type="range"
                min="1"
                max="3"
                step=".02"
                value={zoom}
                disabled={!image || saving}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
            <label>
              Posição horizontal
              <input
                aria-label="Posição horizontal da imagem"
                type="range"
                min="-100"
                max="100"
                value={x}
                disabled={!image || saving}
                onChange={(e) => setX(Number(e.target.value))}
              />
            </label>
            <label>
              Posição vertical
              <input
                aria-label="Posição vertical da imagem"
                type="range"
                min="-100"
                max="100"
                value={y}
                disabled={!image || saving}
                onChange={(e) => setY(Number(e.target.value))}
              />
            </label>
            <button
              className="admin-button subtle"
              disabled={saving}
              onClick={() => {
                setZoom(1);
                setX(0);
                setY(0);
              }}
            >
              <RotateCcw size={15} />
              Centralizar
            </button>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
          </div>
        </div>
        <footer>
          <button
            className="admin-button subtle"
            disabled={saving}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="admin-button primary"
            disabled={!image || saving}
            onClick={() => void apply()}
          >
            {saving ? (
              <>
                <LoaderCircle className="animate-spin" size={16} />
                Enviando…
              </>
            ) : (
              "Usar enquadramento"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
