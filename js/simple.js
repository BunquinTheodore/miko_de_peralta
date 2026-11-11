// Simple 2D portfolio. All copy comes from CONTENT; DOM is built with textContent only.
import { CONTENT as C } from "./content.js";

/** Build an element. Text children are appended as text nodes, never parsed as HTML. */
function el(tag, attrs, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

const slot = (name) => document.querySelector(`[data-slot="${name}"]`);
const fill = (name, ...kids) => {
  const target = slot(name);
  if (target) target.replaceChildren(...kids.flat());
};
const tidy = (s) => String(s).replace(/ · /g, ", ");
const link = (cls, href, label) => {
  const external = /^https?:/.test(href);
  return el("a", { class: cls, href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }, label);
};
const contactLink = (label) => C.contact.links.find((l) => l.label === label);

function renderHero() {
  const { person, location } = C;
  fill("place", `${location.city}, ${location.country}`);
  fill("name", person.first, " ", person.last);
  fill("titles", person.titles.map((t) => el("li", null, t)));
  fill("summary", person.tagline);

  const email = contactLink("Email");
  const linkedin = contactLink("LinkedIn");
  const phone = contactLink("Phone");
  fill("actions",
    email && link("btn btn-solid", email.url, "Email me"),
    linkedin && link("btn btn-line", linkedin.url, "LinkedIn"),
    phone && link("btn btn-line", phone.url, `Call ${phone.value}`),
    link("btn btn-text", "animated.html", "View animated version"),
  );

  const frame = slot("portrait");
  const fallback = () => frame.replaceChildren(el("div", { class: "portrait-fallback", role: "img", "aria-label": `${person.full}, portrait unavailable` }, person.initials));
  if (!person.photo) return fallback();
  const img = el("img", { src: person.photo, alt: `Portrait of ${person.full}`, width: 480, height: 480, decoding: "async", fetchpriority: "high" });
  img.addEventListener("error", fallback, { once: true });
  frame.replaceChildren(img);
}

function renderAbout() {
  fill("about-text", C.person.summary);
  fill("facts", (C.record.facts || []).map(({ value, label }) =>
    el("div", { class: "fact" }, el("dt", null, value), el("dd", null, label))));
}

function renderRoles() {
  fill("roles", C.roles.map((r) =>
    el("article", { class: "role" },
      el("header", { class: "role-meta" },
        el("p", { class: "role-period" }, r.period),
        el("p", { class: "role-org" }, r.org),
        el("p", { class: "role-place" }, r.place)),
      el("div", { class: "role-body" },
        el("h3", null, r.title),
        el("ul", { class: "bullets" }, r.highlights.map((h) => el("li", null, h)))))));
}

function renderSkills() {
  fill("skills", C.scopes.map((g) =>
    el("div", { class: "skill-group" },
      el("h3", null, g.group),
      el("ul", { class: "tags" }, g.items.map((i) => el("li", null, i))))));
}

function renderFeedback() {
  fill("feedback", C.feedback.map((f) =>
    el("figure", { class: "quote" },
      el("blockquote", null, el("p", null, f.quote)),
      el("figcaption", null, el("span", { class: "who" }, f.role), el("span", { class: "when" }, f.date)))));
}

function renderCredentials() {
  const e = C.education;
  const entry = (title, school, place, years) =>
    el("article", { class: "edu-item" },
      el("p", { class: "edu-years" }, years),
      el("h3", null, title),
      el("p", { class: "edu-school" }, [school, place].filter(Boolean).join(", ")));
  fill("education",
    entry(e.short, e.school, e.place, e.years),
    e.certificate && entry(e.certificate.title, e.certificate.school, null, e.certificate.years));

  fill("certs", C.certs.map((c) => {
    const inProgress = /in progress/i.test(c.issuer);
    const issuer = tidy(c.issuer).replace(/,?\s*in progress/i, "");
    return el("li", { class: "cert" },
      el("span", { class: "cert-title" }, c.title),
      el("span", { class: "cert-issuer" }, issuer),
      inProgress && el("span", { class: "pill" }, "In progress"));
  }));
}

function renderContact() {
  fill("pitch", C.contact.pitch);
  fill("contact", C.contact.links.map((l) =>
    el("li", null,
      el("span", { class: "c-label" }, l.label),
      l.url ? link("c-value", l.url, l.value) : el("span", { class: "c-value" }, l.value))));
}

/** Highlight the nav link of the section currently in view. */
function watchActiveNav() {
  const links = [...document.querySelectorAll(".nav a")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  if (!("IntersectionObserver" in window)) return;
  const setCurrent = (a) => {
    links.forEach((l) => l.removeAttribute("aria-current"));
    if (!a) return;
    a.setAttribute("aria-current", "true");
    const nav = a.parentElement;
    if (nav.scrollWidth > nav.clientWidth) {
      const left = a.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft - 16;
      nav.scrollTo({ left, behavior: "smooth" });
    }
  };
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) setCurrent(byId.get(entry.target.id));
  }, { rootMargin: "-45% 0px -50% 0px" });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  // above the first section (hero) nothing should look current
  const hero = document.querySelector("header.hero, .hero");
  if (hero) new IntersectionObserver((e) => { if (e[0].isIntersecting) setCurrent(null); },
    { rootMargin: "-45% 0px -50% 0px" }).observe(hero);
}

/** Soft fade in on scroll. Content stays visible if JS or IO is unavailable. */
function watchReveals() {
  const targets = document.querySelectorAll(".role, .quote, .skill-group, .edu-item, .cert, .fact");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  targets.forEach((t) => io.observe(t));
}

// one failing section must not blank the rest of the page
for (const step of [renderHero, renderAbout, renderRoles, renderSkills, renderFeedback, renderCredentials, renderContact,
  watchActiveNav, watchReveals]) {
  try { step(); } catch (err) { console.error(`simple.js: ${step.name} failed`, err); }
}
