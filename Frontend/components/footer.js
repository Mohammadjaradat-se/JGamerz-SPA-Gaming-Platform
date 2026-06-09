import { requireAuth } from "../utils/auth.js";

const quickLinks = [
  { label: "Home", page: "home" },
  { label: "Feed", page: "feed" },
  { label: "Games Store", page: "store" },
  { label: "Marketplace", page: "marketplace" },
  { label: "Community", page: "community" },
  { label: "News", page: "news" },
  { label: "Profile", page: "profile" },
];

const socialLinks = [
  {
    label: "Discord",
    href: "#",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.54 5.34A16.3 16.3 0 0 0 15.6 4l-.19.34c1.4.42 2.06 1.03 2.06 1.03a13.35 13.35 0 0 0-10.86 0s.68-.64 2.17-1.06L8.65 4a16.1 16.1 0 0 0-3.98 1.36C2.15 9.1 1.48 12.74 1.82 16.34A16.02 16.02 0 0 0 6.7 18.8s.6-.73 1.1-1.36a7.16 7.16 0 0 1-1.74-.84l.42-.32c3.36 1.55 7 1.55 10.31 0l.43.32c-.55.36-1.13.64-1.75.84.5.63 1.09 1.36 1.09 1.36a16 16 0 0 0 4.9-2.46c.4-4.17-.67-7.78-1.92-11ZM8.75 14.15c-.95 0-1.72-.88-1.72-1.97 0-1.08.76-1.96 1.72-1.96.96 0 1.74.89 1.72 1.96 0 1.09-.76 1.97-1.72 1.97Zm6.17 0c-.95 0-1.72-.88-1.72-1.97 0-1.08.76-1.96 1.72-1.96.97 0 1.74.89 1.72 1.96 0 1.09-.75 1.97-1.72 1.97Z"/></svg>`,
  },
  {
    label: "Instagram",
    href: "#",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.7 2h8.6A5.71 5.71 0 0 1 22 7.7v8.6a5.71 5.71 0 0 1-5.7 5.7H7.7A5.71 5.71 0 0 1 2 16.3V7.7A5.71 5.71 0 0 1 7.7 2Zm0 2A3.7 3.7 0 0 0 4 7.7v8.6A3.7 3.7 0 0 0 7.7 20h8.6a3.7 3.7 0 0 0 3.7-3.7V7.7A3.7 3.7 0 0 0 16.3 4H7.7Zm9.15 1.85a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z"/></svg>`,
  },
  {
    label: "TikTok",
    href: "#",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3c.32 2.33 1.6 3.72 3.85 3.87v3.1a7.02 7.02 0 0 1-3.85-1.19v5.74c0 4.3-4.66 6.95-8.32 4.84-3.55-2.05-3.42-7.33.22-9.13a6.8 6.8 0 0 1 3.55-.6v3.27a3.17 3.17 0 0 0-1.85.1c-1.82.72-1.98 3.27-.28 4.2 1.6.88 3.56-.25 3.56-2.18V3h3.12Z"/></svg>`,
  },
  {
    label: "YouTube",
    href: "#",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.58 7.2a2.74 2.74 0 0 0-1.93-1.94C17.95 4.8 12 4.8 12 4.8s-5.95 0-7.65.46A2.74 2.74 0 0 0 2.42 7.2 28.56 28.56 0 0 0 2 12a28.56 28.56 0 0 0 .42 4.8 2.74 2.74 0 0 0 1.93 1.94c1.7.46 7.65.46 7.65.46s5.95 0 7.65-.46a2.74 2.74 0 0 0 1.93-1.94A28.56 28.56 0 0 0 22 12a28.56 28.56 0 0 0-.42-4.8ZM10 15.2V8.8l5.23 3.2L10 15.2Z"/></svg>`,
  },
  {
    label: "X / Twitter",
    href: "#",
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.24 10.16 22.06 1h-1.85l-6.79 7.95L7.99 1H1.74l8.2 12.02L1.74 23h1.85l7.17-8.77L16.49 23h6.25l-8.5-12.84Zm-2.54 2.97-.83-1.2L4.26 2.4h2.85l5.34 7.7.83 1.2 6.94 10.02h-2.85l-5.67-8.19Z"/></svg>`,
  },
];

const features = [
  "Share Posts",
  "Discover Games",
  "Chat with your friends",
  "Marketplace Trading",
  "Browse and watch trending news",
  "AI Assistant to help you !"
];

let footerEventsBound = false;

function ensureFooterStylesheet() {
  if (typeof document === "undefined") return;

  const existingLink = document.querySelector("[data-jgamerz-footer-styles]");
  if (existingLink) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "styles/footer.css";
  stylesheet.dataset.jgamerzFooterStyles = "true";
  document.head.appendChild(stylesheet);
}

export function initFooterNavigation() {
  if (footerEventsBound || typeof document === "undefined") return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-footer-page]");
    if (!link) return;

    event.preventDefault();
    const page = link.dataset.footerPage;
    const protectedFooterPages = ["feed", "profile"];

    if (protectedFooterPages.includes(page) && !requireAuth(page)) {
      return;
    }

    if (typeof window.navigate === "function") {
      window.navigate(page);
    }
  });

  footerEventsBound = true;
}

export function Footer() {
  ensureFooterStylesheet();
  initFooterNavigation();

  const quickLinkMarkup = quickLinks
    .map(
      ({ label, page }) => `
        <li>
          <a class="jg-footer__link" href="#" data-footer-page="${page}">
            ${label}
          </a>
        </li>
      `
    )
    .join("");

  const socialMarkup = socialLinks
    .map(
      ({ label, href, icon }) => `
        <a class="jg-footer__social-link" href="${href}" aria-label="${label}" title="${label}">
          ${icon}
        </a>
      `
    )
    .join("");

  const featureMarkup = features
    .map(
      (feature) => `
        <li class="jg-footer__feature">
          <span class="jg-footer__feature-icon" aria-hidden="true"></span>
          <span>${feature}</span>
        </li>
      `
    )
    .join("");

  return `
    <footer class="jg-footer" aria-label="JGamerz footer">
      <div class="jg-footer__glow" aria-hidden="true"></div>

      <div class="jg-footer__inner">
        <section class="jg-footer__brand" aria-label="JGamerz">
          <a class="jg-footer__logo" href="#" data-footer-page="home" aria-label="JGamerz home">
            <img src="./assets/logo.png" alt="JGamerz Logo" class="nav-logo-img">
            <span class="jg-footer__logo-text">JGamerz</span>
          </a>
          <p class="jg-footer__description">
            Connect, play, share, and explore the gaming world.
          </p>
        </section>

        <nav class="jg-footer__section" aria-label="Quick links">
          <h2 class="jg-footer__heading">Quick Links</h2>
          <ul class="jg-footer__links">
            ${quickLinkMarkup}
          </ul>
        </nav>

        <section class="jg-footer__section" aria-labelledby="footer-community-heading">
          <h2 class="jg-footer__heading" id="footer-community-heading">Community</h2>
          <div class="jg-footer__socials">
            ${socialMarkup}
          </div>
        </section>

        <section class="jg-footer__section" aria-labelledby="footer-features-heading">
          <h2 class="jg-footer__heading" id="footer-features-heading">Platform Features</h2>
          <ul class="jg-footer__features">
            ${featureMarkup}
          </ul>
        </section>
      </div>

      <div class="jg-footer__bottom">
        <p>&copy; 2026 JGamerz. All rights reserved.</p>
        <p>Built for gamers <span aria-hidden="true">🎮</span></p>
      </div>
    </footer>
  `;
}
