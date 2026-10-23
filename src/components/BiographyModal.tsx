import { useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { About } from "./About";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { PortfolioData } from "../data/portfolioData";

export function BiographyModal({ data, onClose }: { data: PortfolioData; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useDialogFocus(dialog, true, onClose);
  return (
    <motion.div className="biography-backdrop" data-modal-layer initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialog} className="biography-dialog" role="dialog" aria-modal="true" aria-labelledby="biography-title" tabIndex={-1} initial={{ y: reduced ? 0 : 12 }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.2 }}>
        <header className="biography-dialog-header"><h2 id="biography-title">Minha história</h2><button onClick={onClose} aria-label="Fechar minha história"><X size={20} aria-hidden="true" /></button></header>
        <div className="biography-dialog-body" role="region" aria-label="Conteúdo da minha história" tabIndex={0}>
          <About data={data} onBack={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
}
