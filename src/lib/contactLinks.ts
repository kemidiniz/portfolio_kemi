import type { PortfolioData } from "../data/portfolioData";

export function contactLinks(personal: PortfolioData["personal"]) {
  const email = `mailto:${personal.email.trim()}`;
  const linkedin = personal.linkedin.trim();
  let whatsapp = personal.whatsapp.trim();
  // Older published content contains a sample URL but an already updated phone label.
  // Preserve explicitly configured real links, including their conversation message.
  try {
    const url = new URL(whatsapp);
    if (url.hostname === "wa.me" && url.pathname === "/5511999999999") {
      const phone = personal.whatsappDisplay.replace(/\D/g, "");
      const international = phone.length === 11 ? `55${phone}` : phone;
      if (/^55\d{10,11}$/.test(international) && international !== "5511999999999") {
        url.pathname = `/${international}`;
        whatsapp = url.href;
      }
    }
  } catch {
    // Invalid URLs are rejected by the admin form's existing schema validation.
  }
  return { email, linkedin, whatsapp };
}
