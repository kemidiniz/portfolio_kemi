import { useState, type ImgHTMLAttributes } from "react";

const images: Record<string, { name: string; width: number; height: number }> = {
  "/assets/aistudio/IMG_1992_c0be0322.jpeg": { name: "portrait", width: 900, height: 1200 },
  "/assets/projects/agile_research_cover_1792537283675.jpg": { name: "agile", width: 1376, height: 768 },
  "/assets/projects/consumo_digital_jovens_1792541175385.jpg": { name: "digital", width: 1376, height: 768 },
  "/assets/projects/cx_consultancy_cover_1792537284268.jpg": { name: "cx", width: 1376, height: 768 },
  "/assets/projects/comms_design_cover_1792537285242.jpg": { name: "communication", width: 1376, height: 768 },
};

export function ResponsiveImage({ src = "", alt, sizes = "100vw", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState("");
  const image = images[src];
  if (!src.trim() || failedSource === src) {
    return <span className="image-placeholder" role={alt ? "img" : undefined} aria-label={alt ? `Imagem indisponível: ${alt}` : undefined} aria-hidden={alt ? undefined : true}><svg viewBox="0 0 64 48" fill="none" aria-hidden="true"><rect x="1" y="1" width="62" height="46" rx="6" /><circle cx="44" cy="15" r="5" /><path d="m6 40 15-17 12 12 8-8 17 13" /></svg></span>;
  }
  return (
    <picture className="responsive-picture">
      {image && <source type="image/webp" srcSet={`/assets/optimized/${image.name}-480.webp 480w, /assets/optimized/${image.name}-960.webp ${Math.min(960, image.width)}w`} sizes={sizes} />}
      <img src={src} alt={alt} width={image?.width} height={image?.height} {...props} onError={event => { setFailedSource(src); props.onError?.(event); }} />
    </picture>
  );
}
