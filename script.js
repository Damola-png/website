// Adedamola Olayefun — site interactions (plain JS)
// Projects + filters + search + theme toggle + mobile nav + placeholder photo gallery

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const projects = [
  {
    title: "CryptoApp",
    tag: "java",
    blurb: "Command-line encryption/decryption app with multiple encoder types (classic ciphers + clean CLI structure).",
    tech: ["Java", "OOP", "CLI"],
    links: [
      { label: "GitHub", url: "https://github.com/Damola-png/damo" }
    ]
  },
  {
    title: "ImageMatcher",
    tag: "systems",
    blurb: "Image/grid matching with performance-minded data access (a playground for optimization and cache behavior).",
    tech: ["C/C++", "Optimization", "Profiling"],
    links: [
      { label: "GitHub", url: "https://github.com/Damola-png/damo" }
    ]
  },
  {
    title: "Event Manager Web App",
    tag: "web",
    blurb: "Web app for managing events and signups. (Swap in your real link + screenshots when ready.)",
    tech: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "GitHub", url: "https://github.com/Damola-png/damo" }
    ]
  },
  {
    title: "Don’t DUI Campaign Site",
    tag: "web",
    blurb: "Campaign microsite built for a PSA project — clear message, strong layout, and real-world intent.",
    tech: ["HTML", "CSS", "Netlify"],
    links: [
      { label: "Live", url: "https://dontduicampaign.netlify.app/" }
    ]
  }
];

// Replace these with your real photos in /assets/photos and update the list.
const photos = [
  { alt: "Placeholder photo 1", src: "assets/photos/placeholder-1.svg" },
  { alt: "Placeholder photo 2", src: "assets/photos/placeholder-2.svg" },
  { alt: "Placeholder photo 3", src: "assets/photos/placeholder-3.svg" },
  { alt: "Placeholder photo 4", src: "assets/photos/placeholder-4.svg" },
  { alt: "Placeholder photo 5", src: "assets/photos/placeholder-5.svg" },
  { alt: "Placeholder photo 6", src: "assets/photos/placeholder-6.svg" }
];

function setYear() {
  const y = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = String(y);
}

function cardTemplate(p) {
  const tech = (p.tech || []).map(t => `<span class="pill pill--tech">${escapeHtml(t)}</span>`).join("");
  const links = (p.links || []).map(l => `<a class="miniLink" href="${l.url}" target="_blank" rel="noreferrer">${escapeHtml(l.label)} ↗</a>`).join("");
  return `
    <article class="card project" data-tag="${p.tag}">
      <div class="project__top">
        <h3 class="card__title">${escapeHtml(p.title)}</h3>
        <span class="pill">${escapeHtml(p.tag.toUpperCase())}</span>
      </div>
      <p>${escapeHtml(p.blurb)}</p>
      <div class="project__meta">
        <div class="pillRow">${tech}</div>
        <div class="linkRow">${links}</div>
      </div>
    </article>
  `;
}

function renderProjects() {
  const grid = $("#projectGrid");
  if (!grid) return;
  grid.innerHTML = projects.map(cardTemplate).join("");
}

function renderPhotos() {
  const grid = $("#photoGrid");
  if (!grid) return;
  grid.innerHTML = photos.map(p => `
    <figure class="photo">
      <img src="${p.src}" alt="${escapeHtml(p.alt)}" loading="lazy" />
    </figure>
  `).join("");
}

function applyFilter(tag) {
  $$(".filters .chip").forEach(btn => {
    const is = btn.dataset.filter === tag;
    btn.classList.toggle("isActive", is);
    btn.setAttribute("aria-selected", is ? "true" : "false");
  });

  const q = ($("#projectSearch")?.value ?? "").trim().toLowerCase();
  $$("#projectGrid .project").forEach(card => {
    const matchesTag = (tag === "all") || (card.dataset.tag === tag);
    const text = (card.textContent || "").toLowerCase();
    const matchesSearch = !q || text.includes(q);
    card.style.display = (matchesTag && matchesSearch) ? "" : "none";
  });
}

function setupFiltering() {
  $$(".filters [data-filter]").forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  const search = $("#projectSearch");
  if (search) {
    search.addEventListener("input", () => {
      const active = $(".filters .chip.isActive")?.dataset.filter ?? "all";
      applyFilter(active);
    });
  }
}

function setupThemeToggle() {
  const key = "ao-theme";
  const root = document.documentElement;

  const saved = localStorage.getItem(key);
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  else root.dataset.theme = "dark";

  const btn = $("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem(key, next);
  });
}

function setupMobileNav() {
  const toggle = $("[data-menu]");
  const panel = $("[data-menu-panel]");
  if (!toggle || !panel) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.classList.remove("isOpen");
    document.body.classList.remove("noScroll");
  };

  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.classList.add("isOpen");
    document.body.classList.add("noScroll");
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  $$("#[data-menu-panel] a").forEach(a => a.addEventListener("click", close));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

setYear();
renderProjects();
renderPhotos();
setupFiltering();
setupThemeToggle();
setupMobileNav();
applyFilter("all");
