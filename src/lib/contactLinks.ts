import type { PortfolioData } from "../data/portfolioData";

export function contactLinks(personal: PortfolioData["personal"]) {
  const email = `mailto:${personal.email.trim()}`;
  const configuredLinkedin = personal.linkedin.trim();
  // Correct the previous profile slug without overriding later admin edits.
  const legacyLinkedin = /^https?:\/\/(?:www\.|br\.)?linkedin\.com\/in\/kemily-diniz\/?$/i.test(configuredLinkedin);
  const linkedin = legacyLinkedin
    ? "https://br.linkedin.com/in/kemilydiniz"
    : configuredLinkedin;
  const linkedinDisplay = legacyLinkedin && /^(?:https?:\/\/)?(?:www\.|br\.)?linkedin\.com\/in\/kemily-diniz\/?$/i.test(personal.linkedinDisplay.trim())
    ? "linkedin.com/in/kemilydiniz"
    : personal.linkedinDisplay;
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
  return { email, linkedin, linkedinDisplay, whatsapp };
}
