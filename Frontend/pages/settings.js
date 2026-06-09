const settingsSections = [
  { id: "account", label: "Account", icon: "user" },
  { id: "appearance", label: "Appearance", icon: "sparkles" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "privacy", label: "Privacy", icon: "shield" },
  { id: "gaming", label: "Gaming", icon: "gamepad" },
  { id: "connections", label: "Connections", icon: "link" },
  { id: "danger", label: "Danger Zone", icon: "alert" },
];

let settingsInitialized = false;

function ensureSettingsStylesheet() {
  if (typeof document === "undefined") return;

  const existingLink = document.querySelector("[data-jgamerz-settings-styles]");
  if (existingLink) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "styles/settings.css";
  stylesheet.dataset.jgamerzSettingsStyles = "true";
  document.head.appendChild(stylesheet);
}

function icon(name) {
  const icons = {
    user: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Zm0 2.2c-4.17 0-7.4 2.22-7.4 5.08 0 .84.68 1.52 1.52 1.52h11.76c.84 0 1.52-.68 1.52-1.52 0-2.86-3.23-5.08-7.4-5.08Z"/></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.2 5.08L18 9l-4.8 1.92L12 16l-1.2-5.08L6 9l4.8-1.92L12 2Zm6.6 11.1.74 3.16 2.96 1.24-2.96 1.24-.74 3.16-.74-3.16-2.96-1.24 2.96-1.24.74-3.16ZM5.4 13.1l.62 2.64 2.48 1.06-2.48 1.06-.62 2.64-.62-2.64L2.3 16.8l2.48-1.06.62-2.64Z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a2.8 2.8 0 0 0 2.65-1.9h-5.3A2.8 2.8 0 0 0 12 22Zm7.15-5.35-1.5-1.82V10a5.66 5.66 0 0 0-4.5-5.54V3.7a1.15 1.15 0 0 0-2.3 0v.76A5.66 5.66 0 0 0 6.35 10v4.83l-1.5 1.82a1 1 0 0 0 .77 1.64h12.76a1 1 0 0 0 .77-1.64Z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2 4.5 5.35v5.7c0 4.8 3.15 9.25 7.5 10.75 4.35-1.5 7.5-5.95 7.5-10.75v-5.7L12 2.2Zm3.9 7.7-4.55 4.55a1 1 0 0 1-1.42 0L8.1 12.62l1.42-1.42 1.12 1.12 3.84-3.84L15.9 9.9Z"/></svg>`,
    gamepad: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 8.1h9.8a5.25 5.25 0 0 1 5.18 4.42l.52 3.3a3 3 0 0 1-5.02 2.62l-1.8-1.67H8.22l-1.8 1.67a3 3 0 0 1-5.02-2.62l.52-3.3A5.25 5.25 0 0 1 7.1 8.1Zm.15 2.78v1.57H5.68v1.9h1.57v1.57h1.9v-1.57h1.57v-1.9H9.15v-1.57h-1.9Zm8.05 1.12a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Zm3.05 2.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z"/></svg>`,
    link: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.7 17.2a1 1 0 0 1-1.42 0 5.1 5.1 0 0 1 0-7.2l2.6-2.6a5.1 5.1 0 0 1 7.2 0 1 1 0 0 1-1.42 1.42 3.08 3.08 0 0 0-4.36 0l-2.6 2.6a3.08 3.08 0 0 0 0 4.36 1 1 0 0 1 0 1.42Zm6.6-10.4a1 1 0 0 1 1.42 0 5.1 5.1 0 0 1 0 7.2l-2.6 2.6a5.1 5.1 0 0 1-7.2 0 1 1 0 0 1 1.42-1.42 3.08 3.08 0 0 0 4.36 0l2.6-2.6a3.08 3.08 0 0 0 0-4.36 1 1 0 0 1 0-1.42Zm-6 7.9 5.4-5.4 1.42 1.42-5.4 5.4L9.3 14.7Z"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 1.9 20h20.2L12 2.5Zm1.1 14.9h-2.2v-2.1h2.2v2.1Zm0-3.8h-2.2V8.25h2.2v5.35Z"/></svg>`,
  };

  return icons[name] || icons.user;
}

function renderSidebar() {
  return settingsSections
    .map(
      (section, index) => `
        <button
          class="settings-nav__item${index === 0 ? " is-active" : ""}${section.id === "danger" ? " is-danger" : ""}"
          type="button"
          data-settings-tab="${section.id}"
          aria-selected="${index === 0 ? "true" : "false"}"
          role="tab"
        >
          <span class="settings-nav__icon">${icon(section.icon)}</span>
          <span>${section.label}</span>
        </button>
      `
    )
    .join("");
}

function renderField(label, control) {
  return `
    <label class="settings-field">
      <span>${label}</span>
      ${control}
    </label>
  `;
}

function renderToggle(label, description, checked = true) {
  return `
    <li class="settings-toggle-row">
      <span>
        <strong>${label}</strong>
        <small>${description}</small>
      </span>
      <button class="settings-toggle${checked ? " is-on" : ""}" type="button" role="switch" aria-checked="${checked}">
        <span></span>
      </button>
    </li>
  `;
}

function renderPills(items, activeItems = []) {
  return items
    .map(
      (item) => `
        <button class="settings-pill${activeItems.includes(item) ? " is-selected" : ""}" type="button" data-selectable-pill>
          ${item}
        </button>
      `
    )
    .join("");
}

function renderAccountPanel() {
  return `
    <section class="settings-panel is-active" data-settings-panel="account" role="tabpanel">
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Player Identity</p>
            <h2>Account Settings</h2>
          </div>
          <span class="settings-badge">Front-end only</span>
        </div>

        <div class="settings-form-grid">
          ${renderField("Username", `<input type="text" value="JGamerzPlayer" autocomplete="username">`)}
          ${renderField("Email", `<input type="email" value="player@jgamerz.com" autocomplete="email">`)}
          ${renderField("Country", `
            <select>
              <option>Jordan</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>Japan</option>
            </select>
          `)}
          ${renderField("Favorite Game", `
            <select>
              <option>Valorant</option>
              <option>Fortnite</option>
              <option>EA Sports FC</option>
              <option>Minecraft</option>
              <option>Call of Duty</option>
            </select>
          `)}
          ${renderField("Bio", `<textarea rows="5">Squad up, trade smart, and chase the next win.</textarea>`)}
        </div>

        <button class="settings-primary-btn" type="button" data-save-settings>Save Changes</button>
      </div>
    </section>
  `;
}

function renderAppearancePanel() {
  return `
    <section class="settings-panel" data-settings-panel="appearance" role="tabpanel" hidden>
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Visual Loadout</p>
            <h2>Appearance</h2>
          </div>
        </div>

        <div class="settings-theme-grid">
          <button class="settings-theme-card is-selected" type="button" data-selectable-card>
            <span class="settings-theme-card__preview is-midnight"></span>
            <strong>Midnight Arena</strong>
            <small>Dark navy with orange glow</small>
          </button>
          <button class="settings-theme-card" type="button" data-selectable-card>
            <span class="settings-theme-card__preview is-ember"></span>
            <strong>Ember Core</strong>
            <small>High contrast gaming UI</small>
          </button>
          <button class="settings-theme-card" type="button" data-selectable-card>
            <span class="settings-theme-card__preview is-carbon"></span>
            <strong>Carbon HUD</strong>
            <small>Muted tactical interface</small>
          </button>
        </div>

        <div class="settings-subsection">
          <h3>Accent Color</h3>
          <div class="settings-color-row" aria-label="Accent color previews">
            <button class="settings-color is-orange is-selected" type="button" data-selectable-card aria-label="Orange"></button>
            <button class="settings-color is-cyan" type="button" data-selectable-card aria-label="Cyan"></button>
            <button class="settings-color is-lime" type="button" data-selectable-card aria-label="Lime"></button>
            <button class="settings-color is-red" type="button" data-selectable-card aria-label="Red"></button>
          </div>
        </div>

        <ul class="settings-toggle-list">
          ${renderToggle("Compact Mode", "Reduce spacing for dense dashboard views.", false)}
          ${renderToggle("Interface Animations", "Enable smooth motion and glow transitions.", true)}
        </ul>
      </div>
    </section>
  `;
}

function renderNotificationsPanel() {
  return `
    <section class="settings-panel" data-settings-panel="notifications" role="tabpanel" hidden>
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Signal Control</p>
            <h2>Notifications</h2>
          </div>
        </div>
        <ul class="settings-toggle-list">
          ${renderToggle("Friend Requests", "Get notified when players want to squad up.", true)}
          ${renderToggle("New Comments", "Alerts for replies and reactions on your posts.", true)}
          ${renderToggle("Marketplace Updates", "Track listings, trades, and price drops.", false)}
          ${renderToggle("Community Announcements", "Stay synced with platform events.", true)}
          ${renderToggle("News Notifications", "Receive gaming news and featured drops.", false)}
        </ul>
      </div>
    </section>
  `;
}

function renderPrivacyPanel() {
  return `
    <section class="settings-panel" data-settings-panel="privacy" role="tabpanel" hidden>
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Visibility</p>
            <h2>Privacy Settings</h2>
          </div>
        </div>
        <ul class="settings-toggle-list">
          ${renderToggle("Public Profile", "Let other players view your profile.", true)}
          ${renderToggle("Show Online Status", "Display when you are active on JGamerz.", true)}
          ${renderToggle("Allow Friend Requests", "Let players send connection requests.", true)}
          ${renderToggle("Show Gaming Activity", "Share your recent gaming activity.", false)}
        </ul>
      </div>
    </section>
  `;
}

function renderGamingPanel() {
  return `
    <section class="settings-panel" data-settings-panel="gaming" role="tabpanel" hidden>
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Matchmaking Profile</p>
            <h2>Gaming Preferences</h2>
          </div>
        </div>

        <div class="settings-choice-block">
          <h3>Favorite Genres</h3>
          <div class="settings-pill-row">${renderPills(["FPS", "RPG", "Open World", "Horror", "Sports"], ["FPS", "Open World"])}</div>
        </div>

        <div class="settings-choice-block">
          <h3>Gaming Platform</h3>
          <div class="settings-pill-row">${renderPills(["PC", "PlayStation", "Xbox", "Mobile"], ["PC"])}</div>
        </div>

        <div class="settings-choice-block">
          <h3>Play Style</h3>
          <div class="settings-pill-row">${renderPills(["Casual", "Competitive"], ["Competitive"])}</div>
        </div>
      </div>
    </section>
  `;
}

function renderConnectionsPanel() {
  const connections = [
    {
      name: "Discord",
      description: "Connect your Discord account to sync squads and community identity.",
      mark: "DC",
    },
    {
      name: "Facebook",
      description: "Find friends, share gaming highlights, and grow your JGamerz network.",
      mark: "FB",
    },
  ];

  return `
    <section class="settings-panel" data-settings-panel="connections" role="tabpanel" hidden>
      <div class="settings-card">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Linked Networks</p>
            <h2>Connected Accounts</h2>
          </div>
        </div>
        <div class="settings-connection-grid">
          ${connections
      .map(
        (connection) => `
                <article class="settings-connection-card">
                  <span class="settings-connection-card__icon">${connection.mark}</span>
                  <div>
                    <h3>${connection.name}</h3>
                    <p>${connection.description}</p>
                  </div>
                  <button class="settings-secondary-btn" type="button" data-connect-account>Connect</button>
                </article>
              `
      )
      .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderDangerPanel() {
  return `
    <section class="settings-panel" data-settings-panel="danger" role="tabpanel" hidden>
      <div class="settings-card settings-card--danger">
        <div class="settings-card__header">
          <div>
            <p class="settings-kicker">Critical Actions</p>
            <h2>Danger Zone</h2>
          </div>
        </div>
        <p class="settings-danger-copy">
          These actions are visual only in this front-end build, but they are styled as high-risk account controls.
        </p>
        <div class="settings-danger-actions">
          <button class="settings-danger-btn" type="button" data-fake-action>Logout</button>
          <button class="settings-danger-btn" type="button" data-fake-action>Reset Settings</button>
          <button class="settings-danger-btn is-destructive" type="button" data-fake-action>Delete Account</button>
        </div>
      </div>
    </section>
  `;
}

function renderPanels() {
  return [
    renderAccountPanel(),
    renderAppearancePanel(),
    renderNotificationsPanel(),
    renderPrivacyPanel(),
    renderGamingPanel(),
    renderConnectionsPanel(),
    renderDangerPanel(),
  ].join("");
}

function showSettingsToast(message) {
  const page = document.querySelector("[data-settings-page]");
  if (!page) return;

  const existingToast = page.querySelector(".settings-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "settings-toast";
  toast.textContent = message;
  page.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add("is-hiding");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 1800);
}

function setActivePanel(page, sectionId) {
  page.querySelectorAll("[data-settings-tab]").forEach((tab) => {
    const isActive = tab.dataset.settingsTab === sectionId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  page.querySelectorAll("[data-settings-panel]").forEach((panel) => {
    const isActive = panel.dataset.settingsPanel === sectionId;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

export function initSettings() {
  if (typeof document === "undefined") return;

  ensureSettingsStylesheet();

  const page = document.querySelector("[data-settings-page]");
  if (!page || page.dataset.settingsInitialized === "true") return;

  page.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-settings-tab]");
    if (tab) {
      setActivePanel(page, tab.dataset.settingsTab);
      return;
    }

    const toggle = event.target.closest(".settings-toggle");
    if (toggle) {
      const isOn = !toggle.classList.contains("is-on");
      toggle.classList.toggle("is-on", isOn);
      toggle.setAttribute("aria-checked", String(isOn));
      return;
    }

    const pill = event.target.closest("[data-selectable-pill]");
    if (pill) {
      pill.classList.toggle("is-selected");
      return;
    }

    const selectableCard = event.target.closest("[data-selectable-card]");
    if (selectableCard) {
      const group = selectableCard.parentElement;
      group.querySelectorAll("[data-selectable-card]").forEach((card) => card.classList.remove("is-selected"));
      selectableCard.classList.add("is-selected");
      return;
    }

    if (event.target.closest("[data-save-settings]")) {
      showSettingsToast("Settings saved locally.");
      return;
    }

    const connectButton = event.target.closest("[data-connect-account]");
    if (connectButton) {
      connectButton.classList.toggle("is-connected");
      connectButton.textContent = connectButton.classList.contains("is-connected") ? "Connected" : "Connect";
      showSettingsToast(connectButton.classList.contains("is-connected") ? "Account connected visually." : "Connection removed visually.");
      return;
    }

    if (event.target.closest("[data-fake-action]")) {
      showSettingsToast("Demo action only. No account changes made.");
    }
  });

  page.dataset.settingsInitialized = "true";
  settingsInitialized = true;
}

export function Settings() {
  ensureSettingsStylesheet();

  if (typeof window !== "undefined") {
    window.requestAnimationFrame(initSettings);
  }

  return `
    <main class="settings-page" data-settings-page>
      <header class="settings-hero">
        <div>
          <p class="settings-kicker">JGamerz Control Center</p>
          <h1>Settings</h1>
          <p>Tune your profile, privacy, notifications, and gaming identity from one polished dashboard.</p>
        </div>
      </header>

      <div class="settings-shell">
        <aside class="settings-sidebar" aria-label="Settings navigation">
          <nav class="settings-nav" role="tablist" aria-orientation="vertical">
            ${renderSidebar()}
          </nav>
        </aside>

        <div class="settings-content">
          ${renderPanels()}
        </div>
      </div>
    </main>
  `;
}
