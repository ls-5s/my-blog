import {
  ui,
  profile,
  metrics,
  skillGroups,
  projects,
  noteFilters,
  posts,
  timeline,
  contacts,
} from "./data.js";
import { createBootSequence } from "./boot.js";

const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let bootFinished = false;

const state = {
  locale: root.lang.startsWith("zh") ? "zh" : "en",
  theme: root.dataset.theme === "light" ? "light" : "dark",
  filter: "all",
  query: "",
  activeDetail: null,
  lastFocused: null,
  pointer: { x: 0, y: 0 },
  scene: null,
  bootSequence: null,
};

const elements = {
  boot: document.querySelector("#boot-screen"),
  bootCanvas: document.querySelector("#boot-canvas"),
  bootDetail: document.querySelector("#boot-detail"),
  header: document.querySelector("#site-header"),
  themeButton: document.querySelector("#theme-button"),
  languageButton: document.querySelector("#language-button"),
  languageLabel: document.querySelector("#language-label"),
  menuButton: document.querySelector("#menu-button"),
  mobileMenu: document.querySelector("#mobile-menu"),
  main: document.querySelector("#main"),
  siteFooter: document.querySelector(".site-footer"),
  featuredGrid: document.querySelector("#featured-grid"),
  projectGrid: document.querySelector("#project-grid"),
  filterList: document.querySelector("#filter-list"),
  articleGrid: document.querySelector("#article-grid"),
  emptyState: document.querySelector("#empty-state"),
  emptyMessage: document.querySelector("#empty-message"),
  clearFilters: document.querySelector("#clear-filters"),
  visibleCount: document.querySelector("#visible-count"),
  articleStatus: document.querySelector("#article-status"),
  articleSearch: document.querySelector("#article-search"),
  articlesTitle: document.querySelector("#articles-title"),
  categoryGrid: document.querySelector("#category-grid"),
  metricsGrid: document.querySelector("#metrics-grid"),
  skillsOrbit: document.querySelector("#skills-orbit"),
  timeline: document.querySelector("#timeline"),
  contactList: document.querySelector("#contact-list"),
  scrollBar: document.querySelector("#scroll-progress-bar"),
  cursorAura: document.querySelector("#cursor-aura"),
  dialog: document.querySelector("#reading-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  dialogClose: document.querySelector("#dialog-close"),
  dialogShell: document.querySelector(".reading-dialog__shell"),
  dialogProgress: document.querySelector("#dialog-progress"),
  toast: document.querySelector("#toast"),
  copyEmail: document.querySelector("#copy-email"),
  backToTop: document.querySelector("#back-to-top"),
  contactTitle: document.querySelector("#contact-title"),
};

let dateFormatter = createDateFormatter(state.locale);
let lastArticleStatus = "";

function createDateFormatter(locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function text(value) {
  return value?.[state.locale] ?? value?.zh ?? "";
}

function translate(key) {
  if (!key) return "";
  const segments = key.split(".");
  const dictionary = segments[0] === "profile" ? profile : ui;
  const lookupSegments = segments[0] === "profile" ? segments.slice(1) : segments;
  let value = lookupSegments.reduce((result, segment) => result?.[segment], dictionary);
  if (value && typeof value === "object" && ("zh" in value || "en" in value)) {
    return text(value);
  }
  return typeof value === "string" ? value : key;
}

function categoryFor(id) {
  return noteFilters.find((filter) => filter.id === id) ?? noteFilters[0];
}

function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

function tagMarkup(tags) {
  return `<ul class="tag-list">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;
}

function arrowMarkup() {
  return `
    <span class="card-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"></path></svg>
    </span>
  `;
}

function noteCardMarkup(post, index, featured = false) {
  const category = categoryFor(post.category);
  return `
    <article
      class="note-card${featured ? " note-card--compact" : ""}"
      data-note-id="${escapeHtml(post.id)}"
      role="button"
      tabindex="0"
      aria-label="${escapeHtml(`${text(post.title)} — ${translate("readArticle")}`)}"
    >
      <div class="note-card__top">
        <span class="note-card__index">${String(index + 1).padStart(2, "0")} / ORBIT</span>
        <span>${escapeHtml(formatDate(post.date))} · ${post.readTime} ${escapeHtml(translate("minutes"))}</span>
      </div>
      <div class="note-card__body">
        <span class="note-card__category">${escapeHtml(text(category.label))}</span>
        <h3>${escapeHtml(text(post.title))}</h3>
        <p class="note-card__excerpt">${escapeHtml(text(post.excerpt))}</p>
      </div>
      <div class="note-card__footer">
        ${tagMarkup(post.tags.slice(0, featured ? 3 : 2))}
        ${arrowMarkup()}
      </div>
    </article>
  `;
}

function renderFeatured() {
  elements.featuredGrid.innerHTML = posts
    .slice(0, 2)
    .map((post, index) => noteCardMarkup(post, index, true))
    .join("");
}

function renderProjects() {
  elements.projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article
          class="project-card"
          data-project-id="${escapeHtml(project.id)}"
          role="button"
          tabindex="0"
          aria-label="${escapeHtml(`${text(project.title)} — ${translate("viewProject")}`)}"
        >
          <div class="project-art" data-art="${escapeHtml(project.art)}">
            <span class="project-art__grid"></span>
            <span class="project-art__orbit"></span>
            <span class="project-art__code">CASE / ${escapeHtml(project.index)}</span>
            <span class="project-art__type">${escapeHtml(text(project.type))}</span>
          </div>
          <div class="project-card__content">
            <div class="project-card__meta">
              <span>${escapeHtml(text(project.type))}</span>
              <span>${escapeHtml(project.year)}</span>
            </div>
            <h3>${escapeHtml(text(project.title))}</h3>
            <p>${escapeHtml(text(project.summary))}</p>
            <div class="project-card__bottom">
              <span class="project-card__stack">${project.stack.map(escapeHtml).join(" / ")}</span>
              ${arrowMarkup()}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderFilters() {
  elements.filterList.innerHTML = noteFilters
    .map(
      (filter) => `
        <button
          class="filter-button${state.filter === filter.id ? " is-active" : ""}"
          type="button"
          data-filter="${escapeHtml(filter.id)}"
          aria-pressed="${state.filter === filter.id}"
        >
          ${escapeHtml(text(filter.label))}
        </button>
      `
    )
    .join("");
}

function getFilteredPosts() {
  const query = state.query.trim().toLocaleLowerCase(state.locale === "zh" ? "zh-CN" : "en-US");
  return posts.filter((post) => {
    const matchesCategory = state.filter === "all" || post.category === state.filter;
    if (!matchesCategory) return false;
    if (!query) return true;
    const searchable = [
      text(post.title),
      text(post.excerpt),
      text(categoryFor(post.category).label),
      ...post.tags,
    ]
      .join(" ")
      .toLocaleLowerCase(state.locale === "zh" ? "zh-CN" : "en-US");
    return searchable.includes(query);
  });
}

function formatTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function syncFilterState() {
  elements.filterList.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.categoryGrid.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateArticleFeedback(filteredPosts) {
  const count = filteredPosts.length;
  const query = state.query.trim();
  const hasQuery = query.length > 0;
  const hasCategory = state.filter !== "all";
  const category = text(categoryFor(state.filter).label);
  let message = translate("noResults");
  let action = translate("clearFilters");

  if (count === 0 && hasQuery && hasCategory) {
    message = formatTemplate(translate("noFilteredResults"), { query, category });
  } else if (count === 0 && hasQuery) {
    message = formatTemplate(translate("noSearchResults"), { query });
    action = translate("clearSearch");
  } else if (count === 0 && hasCategory) {
    message = formatTemplate(translate("noCategoryResults"), { category });
    action = translate("viewAllArticles");
  }

  elements.emptyMessage.textContent = message;
  elements.clearFilters.textContent = action;

  const status = count > 0 ? formatTemplate(translate("resultStatus"), { count }) : message;
  if (status !== lastArticleStatus) {
    lastArticleStatus = status;
    elements.articleStatus.textContent = status;
  }
}

function renderArticles() {
  const filteredPosts = getFilteredPosts();
  elements.articleGrid.innerHTML = filteredPosts
    .map((post, index) => noteCardMarkup(post, index))
    .join("");
  elements.emptyState.hidden = filteredPosts.length > 0;
  elements.articleGrid.hidden = filteredPosts.length === 0;
  elements.visibleCount.textContent = String(filteredPosts.length).padStart(2, "0");
  updateArticleFeedback(filteredPosts);
  syncFilterState();
}

function renderCategories() {
  elements.categoryGrid.innerHTML = noteFilters
    .filter((filter) => filter.id !== "all")
    .map((filter) => {
      const count = posts.filter((post) => post.category === filter.id).length;
      return `
        <button
          class="category-card${state.filter === filter.id ? " is-active" : ""}"
          type="button"
          data-category="${escapeHtml(filter.id)}"
          aria-pressed="${state.filter === filter.id}"
        >
          <span class="category-card__index">${escapeHtml(filter.code)} / FIELD</span>
          <h3>${escapeHtml(text(filter.label))}</h3>
          <p>${escapeHtml(text(filter.description))}</p>
          <span class="category-card__footer">
            <span>${String(count).padStart(2, "0")} ${escapeHtml(translate("categoryLabel"))}</span>
            <strong aria-hidden="true">↗</strong>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderMetrics() {
  elements.metricsGrid.innerHTML = metrics
    .map(
      (metric) => `
        <div class="metric">
          <span class="metric__value">${escapeHtml(metric.value)}<small class="metric__suffix">${escapeHtml(metric.suffix)}</small></span>
          <span class="metric__label">${escapeHtml(text(metric.label))}</span>
        </div>
      `
    )
    .join("");
}

function renderSkills() {
  const core = elements.skillsOrbit.querySelector(".skills-orbit__core");
  elements.skillsOrbit.innerHTML = "";
  if (core) elements.skillsOrbit.append(core);
  const markup = skillGroups
    .map(
      (group) => `
        <article class="skill-group skill-group--${escapeHtml(group.position)}">
          <span class="skill-group__code">${escapeHtml(group.code)} / CAPABILITY</span>
          <h4>${escapeHtml(text(group.title))}</h4>
          <p>${escapeHtml(text(group.description))}</p>
          <div class="skill-tags">
            ${group.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
  elements.skillsOrbit.insertAdjacentHTML("beforeend", markup);
}

function renderTimeline() {
  elements.timeline.innerHTML = timeline
    .map(
      (item) => `
        <article class="timeline-item">
          <span class="timeline-item__year">${escapeHtml(item.year)}</span>
          <h4>${escapeHtml(text(item.title))}</h4>
          <span class="timeline-item__company">${escapeHtml(text(item.company))}</span>
          <p>${escapeHtml(text(item.description))}</p>
        </article>
      `
    )
    .join("");
}

function renderContacts() {
  elements.contactList.innerHTML = contacts
    .map((contact) => {
      const value = typeof contact.value === "string" ? contact.value : text(contact.value);
      if (contact.action === "copy") {
        return `
          <button class="contact-list__item" type="button" data-copy="${escapeHtml(value)}">
            <span>${escapeHtml(text(contact.label))}</span>
            <strong>${escapeHtml(value)}</strong>
          </button>
        `;
      }
      return `
        <div class="contact-list__item">
          <span>${escapeHtml(text(contact.label))}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = translate(node.dataset.i18n);
  });
  elements.articleSearch.placeholder =
    state.locale === "zh" ? "搜索标题、标签…" : "Search titles, tags…";
  elements.articleSearch.setAttribute(
    "aria-label",
    state.locale === "zh" ? "搜索文章" : "Search articles"
  );
  elements.menuButton.setAttribute(
    "aria-label",
    translate(elements.menuButton.getAttribute("aria-expanded") === "true" ? "menuClose" : "menuOpen")
  );
  elements.languageButton.setAttribute("aria-label", translate("switchLanguage"));
  elements.languageLabel.textContent = state.locale === "zh" ? "EN" : "中";
  updateThemeButtonLabel();
  elements.dialogClose.setAttribute("aria-label", translate("close"));
}

function renderAll() {
  renderStaticTranslations();
  renderFeatured();
  renderProjects();
  renderFilters();
  renderArticles();
  renderCategories();
  renderMetrics();
  renderSkills();
  renderTimeline();
  renderContacts();
  if (state.activeDetail) renderActiveDetail();
}

function updateThemeButtonLabel() {
  const nextTheme = state.theme === "dark" ? "light" : "dark";
  elements.themeButton.setAttribute(
    "aria-label",
    translate(nextTheme === "light" ? "themeToLight" : "themeToDark")
  );
}

function setTheme(theme, animate = true) {
  state.theme = theme === "light" ? "light" : "dark";
  root.dataset.theme = state.theme;
  try {
    localStorage.setItem("orbit-notes-theme", state.theme);
  } catch {
    // Storage is optional; the visual state still changes.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", state.theme === "dark" ? "#05070d" : "#edf4f7");
  updateThemeButtonLabel();
  state.scene?.setTheme(state.theme);
  if (animate) {
    elements.themeButton.animate(
      [
        { transform: "scale(1) rotate(0)" },
        { transform: "scale(0.82) rotate(-28deg)" },
        { transform: "scale(1) rotate(0)" },
      ],
      { duration: reduceMotion ? 1 : 520, easing: "cubic-bezier(.2,.9,.2,1.1)" }
    );
  }
}

function setLocale(locale) {
  state.locale = locale === "en" ? "en" : "zh";
  dateFormatter = createDateFormatter(state.locale);
  root.lang = state.locale === "zh" ? "zh-CN" : "en";
  try {
    localStorage.setItem("orbit-notes-locale", state.locale);
  } catch {
    // The language change does not depend on storage.
  }
  document.title =
    state.locale === "zh"
      ? "星轨手记 · 林澈的创意开发博客"
      : "Orbit Notes · Lin Che's Creative Development Journal";
  renderAll();
}

function closeMobileMenu({ restoreFocus = false } = {}) {
  if (elements.menuButton.getAttribute("aria-expanded") !== "true") return;
  elements.menuButton.setAttribute("aria-expanded", "false");
  elements.menuButton.setAttribute("aria-label", translate("menuOpen"));
  elements.mobileMenu.classList.remove("is-open");
  elements.mobileMenu.setAttribute("aria-hidden", "true");
  body.classList.remove("menu-open");
  elements.main.inert = false;
  elements.siteFooter.inert = false;
  if (restoreFocus) elements.menuButton.focus();
}

function openMobileMenu() {
  elements.menuButton.setAttribute("aria-expanded", "true");
  elements.menuButton.setAttribute("aria-label", translate("menuClose"));
  elements.mobileMenu.classList.add("is-open");
  elements.mobileMenu.setAttribute("aria-hidden", "false");
  body.classList.add("menu-open");
  elements.main.inert = true;
  elements.siteFooter.inert = true;
  window.setTimeout(() => elements.mobileMenu.querySelector("a")?.focus(), 180);
}

function openDetail(type, id, trigger) {
  state.activeDetail = { type, id };
  state.lastFocused = trigger ?? document.activeElement;
  renderActiveDetail();
  if (!elements.dialog.open) {
    elements.dialog.showModal();
    body.classList.add("dialog-open");
  }
  elements.dialogShell.scrollTop = 0;
  elements.dialogProgress.style.transform = "scaleX(0)";
  window.requestAnimationFrame(() => elements.dialogClose.focus());
}

function detailHeaderMarkup({ eyebrow, title, excerpt, meta }) {
  return `
    <header class="dialog-hero">
      <div class="dialog-hero__meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <h2 id="dialog-title">${escapeHtml(title)}</h2>
      <p class="dialog-hero__excerpt">${escapeHtml(excerpt)}</p>
      <span class="eyebrow" hidden>${escapeHtml(eyebrow)}</span>
    </header>
  `;
}

function renderArticleDetail(post) {
  const category = categoryFor(post.category);
  elements.dialogContent.innerHTML = `
    ${detailHeaderMarkup({
      eyebrow: text(category.label),
      title: text(post.title),
      excerpt: text(post.excerpt),
      meta: [
        text(category.label),
        formatDate(post.date),
        `${post.readTime} ${translate("minutes")}`,
      ],
    })}
    <div class="dialog-body">
      <aside class="dialog-aside">
        <span class="dialog-aside__label">${state.locale === "zh" ? "标签" : "Tags"}</span>
        ${tagMarkup(post.tags)}
      </aside>
      <article class="dialog-story">
        ${post.sections
          .map(
            (section) => `
              <section class="dialog-story__section">
                <h3>${escapeHtml(text(section.heading))}</h3>
                ${section.paragraphs
                  .map((paragraph) => `<p>${escapeHtml(text(paragraph))}</p>`)
                  .join("")}
              </section>
            `
          )
          .join("")}
        <button class="button button--ghost" type="button" data-detail-action="discuss">
          <span>${escapeHtml(translate("discussProject"))}</span>
        </button>
      </article>
    </div>
  `;
}

function renderProjectDetail(project) {
  elements.dialogContent.innerHTML = `
    ${detailHeaderMarkup({
      eyebrow: text(project.type),
      title: text(project.title),
      excerpt: text(project.summary),
      meta: [text(project.type), project.year, text(project.role)],
    })}
    <div class="dialog-body">
      <aside class="dialog-aside">
        <span class="dialog-aside__label">${escapeHtml(translate("stack"))}</span>
        ${tagMarkup(project.stack)}
        <p hidden>${escapeHtml(translate("demoNote"))}</p>
      </aside>
      <article class="dialog-story">
        ${[
          ["projectOverview", project.overview],
          ["challenge", project.challenge],
          ["solution", project.solution],
          ["outcome", project.outcome],
        ]
          .map(
            ([label, body]) => `
              <section class="dialog-story__section">
                <h3>${escapeHtml(translate(label))}</h3>
                <p>${escapeHtml(text(body))}</p>
              </section>
            `
          )
          .join("")}
        <div class="dialog-metrics">
          ${project.metrics
            .map(
              (metric) => `
                <div>
                  <strong>${escapeHtml(metric.value)}</strong>
                  <span>${escapeHtml(text(metric.label))}</span>
                </div>
              `
            )
            .join("")}
        </div>
        <button class="button button--ghost" type="button" data-detail-action="discuss">
          <span>${escapeHtml(translate("discussProject"))}</span>
        </button>
      </article>
    </div>
  `;
}

function renderActiveDetail() {
  if (!state.activeDetail) return;
  if (state.activeDetail.type === "post") {
    const post = posts.find((item) => item.id === state.activeDetail.id);
    if (post) renderArticleDetail(post);
  } else {
    const project = projects.find((item) => item.id === state.activeDetail.id);
    if (project) renderProjectDetail(project);
  }
}

function closeDetail() {
  if (!elements.dialog.open) return;
  elements.dialog.close();
}

function clearFilters() {
  state.filter = "all";
  state.query = "";
  elements.articleSearch.value = "";
  renderArticles();
  window.requestAnimationFrame(() => elements.articleSearch.focus({ preventScroll: true }));
}

function filterByCategory(category, scrollToArticles = false) {
  state.filter = category;
  renderArticles();
  if (scrollToArticles) {
    document.querySelector("#articles")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    elements.articlesTitle.focus({ preventScroll: true });
  }
}

let toastTimer = 0;
function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(translate("copied"));
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const succeeded = document.execCommand("copy");
    input.remove();
    showToast(succeedingMessage(succeeded));
  }
}

function succeedingMessage(succeeded) {
  return translate(succeeded ? "copied" : "copyFailed");
}

function setupCardInteractions() {
  document.addEventListener("pointermove", (event) => {
    const card = event.target.closest(".note-card, .project-card, .category-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  });

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!finePointer) return;
      const card = event.target.closest(".project-card");
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${(-y * 4.5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      state.scene?.setEnergy(0.32 + Math.max(Math.abs(x), Math.abs(y)));
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      const card = event.target.closest(".project-card");
      if (!card || card.contains(event.relatedTarget)) return;
      card.style.transform = "";
      state.scene?.setEnergy(0);
    },
    { passive: true }
  );
}

function setupMagneticButtons() {
  if (!finePointer) return;
  document.querySelectorAll("[data-magnetic]").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      button.style.transform = `translate(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function setupReveal() {
  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    return;
  }
  body.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupNavigationObserver() {
  const navMap = {
    home: "home",
    featured: "home",
    work: "home",
    articles: "articles",
    categories: "categories",
    about: "about",
  };
  const visibleSections = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibleSections.set(entry.target.id, entry.intersectionRatio);
      });
      const current = [...visibleSections.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      if (!current) return;
      const navSection = navMap[current];
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.section === navSection);
      });
    },
    { threshold: [0.08, 0.2, 0.45, 0.7], rootMargin: "-18% 0px -48% 0px" }
  );
  document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
}

function setupScrollEffects() {
  let scheduled = false;
  const update = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? scrollTop / scrollable : 0;
    elements.scrollBar.style.transform = `scaleX(${progress})`;
    elements.header.classList.toggle("is-scrolled", scrollTop > 26);
    state.scene?.setScroll(progress);
    scheduled = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

function setupPointerEffects() {
  if (!finePointer) return;
  let scheduled = false;
  let targetX = 0;
  let targetY = 0;
  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      body.classList.add("pointer-active");
      state.scene?.setPointer((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(() => {
          elements.cursorAura.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
          scheduled = false;
        });
      }
    },
    { passive: true }
  );
}

function setupDialog() {
  elements.dialogClose.addEventListener("click", closeDetail);
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeDetail();
  });
  elements.dialog.addEventListener("close", () => {
    body.classList.remove("dialog-open");
    state.activeDetail = null;
    state.lastFocused?.focus?.();
  });
  elements.dialog.addEventListener("cancel", () => {
    body.classList.remove("dialog-open");
  });
  elements.dialogShell.addEventListener(
    "scroll",
    () => {
      const maxScroll = elements.dialogShell.scrollHeight - elements.dialogShell.clientHeight;
      const progress = maxScroll > 0 ? elements.dialogShell.scrollTop / maxScroll : 0;
      elements.dialogProgress.style.transform = `scaleX(${progress})`;
    },
    { passive: true }
  );
  elements.dialog.addEventListener("click", (event) => {
    const discuss = event.target.closest('[data-detail-action="discuss"]');
    if (!discuss) return;
    closeDetail();
    window.setTimeout(() => {
      document.querySelector(".contact-panel")?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      elements.contactTitle.focus({ preventScroll: true });
    }, 180);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.menuButton.getAttribute("aria-expanded") === "true") {
      closeMobileMenu({ restoreFocus: true });
    }
    if (event.key !== "Tab" || elements.menuButton.getAttribute("aria-expanded") !== "true") {
      return;
    }
    const focusable = [
      ...document.querySelectorAll(
        '.site-header a, .site-header button, #mobile-menu a'
      ),
    ].filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function setupEventHandlers() {
  elements.themeButton.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });
  elements.languageButton.addEventListener("click", () => {
    setLocale(state.locale === "zh" ? "en" : "zh");
  });
  elements.menuButton.addEventListener("click", () => {
    if (elements.menuButton.getAttribute("aria-expanded") === "true") {
      closeMobileMenu({ restoreFocus: true });
    } else {
      openMobileMenu();
    }
  });
  elements.mobileMenu.querySelector(".mobile-menu__backdrop").addEventListener("click", () => {
    closeMobileMenu({ restoreFocus: true });
  });
  elements.mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
      window.requestAnimationFrame(() => elements.menuButton.focus({ preventScroll: true }));
    });
  });
  window.matchMedia("(min-width: 881px)").addEventListener("change", (event) => {
    if (event.matches) closeMobileMenu();
  });

  document.addEventListener("click", (event) => {
    const noteCard = event.target.closest("[data-note-id]");
    const projectCard = event.target.closest("[data-project-id]");
    const filterButton = event.target.closest("[data-filter]");
    const categoryCard = event.target.closest("[data-category]");
    const copyButton = event.target.closest("[data-copy]");

    if (noteCard) {
      openDetail("post", noteCard.dataset.noteId, noteCard);
      return;
    }
    if (projectCard) {
      openDetail("project", projectCard.dataset.projectId, projectCard);
      return;
    }
    if (filterButton) {
      filterByCategory(filterButton.dataset.filter);
      return;
    }
    if (categoryCard && !copyButton) {
      filterByCategory(categoryCard.dataset.category, true);
      return;
    }
    if (copyButton) {
      copyText(copyButton.dataset.copy);
    }
  });

  document.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-note-id], [data-project-id]");
    if (!card || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    if (card.dataset.noteId) {
      openDetail("post", card.dataset.noteId, card);
    } else {
      openDetail("project", card.dataset.projectId, card);
    }
  });

  elements.articleSearch.addEventListener("input", () => {
    state.query = elements.articleSearch.value;
    renderArticles();
  });
  elements.clearFilters.addEventListener("click", clearFilters);
  elements.copyEmail.addEventListener("click", () => copyText(elements.copyEmail.dataset.copy));
  elements.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  document.querySelector(".brand").addEventListener("click", () => closeMobileMenu());
}

async function finishBoot(message = null) {
  if (bootFinished) return;
  bootFinished = true;
  if (message) elements.bootDetail.textContent = message;

  await state.bootSequence?.enter();
  elements.boot.classList.add("is-complete");
  body.classList.remove("is-loading");
  body.classList.add("is-ready");
  setupReveal();

  window.setTimeout(() => {
    state.bootSequence?.destroy();
    elements.boot.remove();
  }, reduceMotion ? 80 : 520);
}

async function initializeScene() {
  state.bootSequence?.setProgress(0.24);
  try {
    const sceneTimeout = new Promise((_, reject) => {
      window.setTimeout(
        () => reject(new Error("Three.js did not load within the visual boot budget.")),
        6500
      );
    });
    const { createNebulaScene } = await Promise.race([import("./scene.js"), sceneTimeout]);
    state.bootSequence?.setProgress(0.74);
    state.scene = createNebulaScene({
      canvas: document.querySelector("#nebula-canvas"),
      initialTheme: state.theme,
      reducedMotion: reduceMotion,
    });
    state.bootSequence?.setProgress(0.94);
    finishBoot();
  } catch (error) {
    console.warn("Three.js scene unavailable; continuing with the CSS scene fallback.", error);
    body.classList.remove("has-webgl");
    finishBoot(
      state.locale === "zh"
        ? "3D 资源暂不可用，已启用轻量星云模式"
        : "3D assets unavailable — lightweight nebula enabled"
    );
  }
}

function initialize() {
  document.querySelector("#copyright-year").textContent = String(new Date().getFullYear());
  renderAll();
  setupCardInteractions();
  setupMagneticButtons();
  setupNavigationObserver();
  setupScrollEffects();
  setupPointerEffects();
  setupDialog();
  setupEventHandlers();
  setTheme(state.theme, false);
  state.bootSequence = createBootSequence({
    canvas: elements.bootCanvas,
    reducedMotion: reduceMotion,
  });
  state.bootSequence.setProgress(0.08);
  state.bootSequence.start();
  initializeScene();
}

initialize();
