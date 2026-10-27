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
  return { email, linkedin, linkedinDisplay };
}
