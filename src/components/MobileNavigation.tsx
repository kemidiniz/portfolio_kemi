import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useDialogFocus } from "../hooks/useDialogFocus";
import { useMediaQuery } from "../hooks/useMediaQuery";

export function MobileNavigation({ children, onClose, onAfterClose }: { children: ReactNode; onClose: () => void; onAfterClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  useDialogFocus(dialog, true, onClose);
  const afterClose = useRef(onAfterClose);
  afterClose.current = onAfterClose;
  // Navigate only after the dialog hook has restored focus and removed background inertness.
  useEffect(() => () => afterClose.current(), []);
  return (
    <motion.div data-modal-layer className="mobile-menu-backdrop" initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.18 }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" tabIndex={-1} className="mobile-menu-dialog" initial={{ y: reduced ? 0 : 12, scale: reduced ? 1 : 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: reduced ? 0 : 8, scale: reduced ? 1 : 0.98 }} transition={{ duration: reduced ? 0 : 0.22 }}>
        <div className="mobile-menu-heading"><h2 id="mobile-menu-title">Navegação</h2><button type="button" aria-label="Fechar navegação" onClick={onClose}><X size={20} aria-hidden="true" /></button></div>
        {children}
      </motion.div>
    </motion.div>
  );
}
