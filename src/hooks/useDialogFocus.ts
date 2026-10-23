import { useEffect, useRef, type RefObject } from "react";

const focusable = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/** Shared keyboard and background handling for public dialogs. */
export function useDialogFocus(ref: RefObject<HTMLDivElement | null>, enabled: boolean, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!enabled || !dialog) return;
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const layer = dialog.closest<HTMLElement>("[data-modal-layer]");
    const siblings = [...(layer?.parentElement?.children ?? [])]
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== layer)
      .map(node => ({ node, inert: node.inert }));
    siblings.forEach(({ node }) => { node.inert = true; });
    document.body.style.overflow = "hidden";
    const nodes = () => [...dialog.querySelectorAll<HTMLElement>(focusable)].filter(node => node.getClientRects().length > 0);
    (nodes()[0] ?? dialog).focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      }
      if (event.key === "Tab") {
        const items = nodes();
        const first = items[0], last = items.at(-1);
        if (!first) { event.preventDefault(); dialog.focus(); }
        else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    dialog.addEventListener("keydown", keydown);
    return () => {
      dialog.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      siblings.forEach(({ node, inert }) => { node.inert = inert; });
      if (before?.isConnected && !before.closest("[inert]")) before.focus({ preventScroll: true });
    };
  }, [enabled, ref]);
}
