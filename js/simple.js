// Simple 2D portfolio. All copy comes from CONTENT; DOM is built with textContent only.
import { CONTENT as C } from "./content.js";

/** Split text so anything inside parentheses becomes an <em> (still text nodes only, never parsed as HTML). */
function withItalicParens(text) {
  return text.split(/(\([^)]*\))/).filter(Boolean)
    .map((part) => {
      if (!/^\(.*\)$/.test(part)) return document.createTextNode(part);
      const em = document.createElement("em");
      em.textContent = part;
      return em;
    });
}

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
    node.append(...(kid instanceof Node ? [kid] : withItalicParens(String(kid))));
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
  const { person } = C;
  fill("name", person.first, " ", person.last);
  fill("titles", person.titles.map((t) => el("li", null, t)));
  fill("summary", el("span", { class: "stretch" }, person.tagline.replace(/[.\s]+$/, "")));

  const email = contactLink("Email");
  const linkedin = contactLink("LinkedIn");
  fill("actions",
    email && link("btn btn-solid", email.url, "Email me"),
    linkedin && link("btn btn-line", linkedin.url, "LinkedIn"),
  );
}

/** Text with the given phrases wrapped in <strong>. Built from text nodes only, so content is never parsed as HTML. */
function emphasize(text, phrases) {
  const list = phrases.filter(Boolean);
  if (!list.length) return [text];
  // split on the phrases without building a regex from content: walk the text and cut at each phrase hit
  const parts = [];
  let rest = text;
  while (rest) {
    const hits = list.map((p) => ({ p, at: rest.indexOf(p) })).filter((h) => h.at >= 0).sort((a, b) => a.at - b.at || b.p.length - a.p.length);
    if (!hits.length) { parts.push(rest); break; }
    const { p, at } = hits[0];
    if (at > 0) parts.push(rest.slice(0, at));
    parts.push(p);
    rest = rest.slice(at + p.length);
  }
  return parts.map((part) => {
    if (!list.includes(part)) return document.createTextNode(part);
    const strong = document.createElement("strong");
    strong.textContent = part;
    return strong;
  });
}

function renderAbout() {
  fill("about-text", emphasize(C.person.summary, C.person.summaryEmphasis || []));
  fill("facts", (C.record.facts || []).map(({ value, label }) =>
    el("div", { class: "fact" }, el("dt", null, value), el("dd", null, label))));
}

function renderRoles() {
  fill("roles", C.roles.map((r) =>
    el("article", { class: "role" },
      el("p", { class: "role-period" }, r.period),
      el("h3", null, r.title),
      el("figure", { class: "role-side" },
        r.photo && el("img", { class: "role-photo", src: r.photo, alt: r.photoAlt || "", width: r.photoW || 480, height: r.photoH || 853, loading: "lazy", decoding: "async" }),
        el("figcaption", null,
          el("p", { class: "role-line" },
            el("span", { class: "role-org" }, r.org),
            el("span", { class: "role-sep", "aria-hidden": "true" }, "|"),
            el("span", { class: "role-place" }, r.place)))),
      el("ul", { class: "bullets" }, r.highlights.map((h) => el("li", null, h))))));
}

// Tool marks: only real brand glyphs (Simple Icons, self-hosted in img/logos). Anything without a real logo shows no mark.
const LOGO_FILES = {
  "AutoCAD": "autocad", "Google Sheets": "googlesheets", "Google Docs": "googledocs", "Slack": "slack",
  "WhatsApp": "whatsapp", "Viber": "viber", "Google Meet": "googlemeet", "Zoom": "zoom",
};

function logoMark(file) {
  return file ? el("img", { class: "mark", src: `img/logos/${file}.svg`, alt: "", width: 18, height: 18, decoding: "async" }) : null;
}

function renderSkills() {
  fill("skills", C.scopes.map((g) =>
    el("div", { class: "skill-group" },
      el("h3", null, g.group),
      el("ul", { class: "tags" }, g.items.map((i) => el("li", null, el("span", null, i), logoMark(LOGO_FILES[i])))))));
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

  fill("certs", [...C.certs, ...(C.certsMore || [])].map((c) => {
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
  const bar = document.querySelector(".bar-inner");
  const brand = document.querySelector(".brand");
  if (!bar || !brand) return;

  // One line under the current item. It slides from item to item (CSS transition on transform and width).
  const line = document.createElement("span");
  line.className = "nav-line";
  line.setAttribute("aria-hidden", "true");
  bar.append(line);
  let target = brand;
  const placeLine = () => {
    const b = bar.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    line.style.width = `${r.width}px`;
    line.style.transform = `translate(${r.left - b.left}px, ${r.bottom - b.top - 1}px)`;
  };
  const nav = document.querySelector(".nav");

  const setCurrent = (a) => {
    links.forEach((l) => l.removeAttribute("aria-current"));
    if (a) a.setAttribute("aria-current", "true");
    target = a || brand;
    if (a && nav.scrollWidth > nav.clientWidth) {
      const left = a.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft - 16;
      nav.scrollTo({ left, behavior: "smooth" });
    }
    placeLine();
  };

  placeLine();
  addEventListener("resize", placeLine);
  nav.addEventListener("scroll", placeLine, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeLine);

  // Which section is current: the last one whose top has passed 45% of the viewport height.
  // At the very bottom of the page the last section (the footer) is current, even though it is short.
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  let shown;
  let frame = 0;
  const update = () => {
    frame = 0;
    const probe = innerHeight * 0.45;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= probe) current = s;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
    if (current !== shown) { shown = current; setCurrent(current ? byId.get(current.id) : null); }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
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

/**
 * Hero lockup: the name and the tagline start and end on exactly the same left and right lines.
 * Glyphs have built-in side space, so alignment is done on the visible letter shapes (ink), not the text boxes:
 * the name's size is solved so its ink spans the content width, and the tagline is tracked out to the same ink width.
 */
const inkCanvas = document.createElement("canvas").getContext("2d");

function inkBearings(text, font) {
  inkCanvas.font = font;
  const first = inkCanvas.measureText(text[0]);
  const last = inkCanvas.measureText(text[text.length - 1]);
  return { left: -first.actualBoundingBoxLeft, right: last.width - last.actualBoundingBoxRight };
}

function textBoxWidth(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getBoundingClientRect().width;
}

/** Name and tagline lockup: ink-aligned to the container width. Used by the hero and by the splash screen. */
function fitLockup(lead, nameEl, tag) {
  if (!lead || !nameEl || !tag) return;
  const W = lead.clientWidth;

  // name: solve the font size so the ink width equals W
  const cs = getComputedStyle(nameEl);
  const nameText = nameEl.textContent.toUpperCase();
  const REF = 100;
  nameEl.style.fontSize = `${REF}px`; nameEl.style.marginLeft = "0px";
  const refFont = `${cs.fontWeight} ${REF}px ${cs.fontFamily}`;
  const trailing = parseFloat(getComputedStyle(nameEl).letterSpacing) || 0;
  const refBearings = inkBearings(nameText, refFont);
  const refInk = textBoxWidth(nameEl) - trailing - refBearings.left - refBearings.right;
  const k = W / refInk;
  nameEl.style.fontSize = `${REF * k}px`;
  nameEl.style.marginLeft = `${-refBearings.left * k}px`;

  // tagline: track out so its ink width equals W, and pull its ink to the same left edge
  const tcs = getComputedStyle(tag);
  const tagText = tag.textContent.toUpperCase();
  tag.style.letterSpacing = "0px"; tag.style.marginLeft = "0px";
  const tb = inkBearings(tagText, `${tcs.fontWeight} ${tcs.fontSize} ${tcs.fontFamily}`);
  const natural = tag.getBoundingClientRect().width - tb.left - tb.right;
  const gaps = Math.max(1, tagText.length - 1);
  tag.style.letterSpacing = `${Math.max(0, (W - natural) / gaps)}px`;
  tag.style.marginLeft = `${-tb.left}px`;
}

function fitHero() {
  const lead = document.querySelector(".hero-lead");
  fitLockup(lead, lead && lead.querySelector("h1"), lead && lead.querySelector(".stretch"));
}

/**
 * Splash screen: the name and tagline on white, a thin line sweeps across once, then the splash fades out
 * and the hero settles in underneath. Click or any key skips it. The page stays usable if this never runs
 * (a CSS timeout hides the splash after 4s).
 */
function runSplash() {
  const splash = document.querySelector(".splash");
  const root = document.documentElement;
  if (!splash) return;
  const finish = () => { splash.remove(); root.classList.remove("splash-on"); };
  if (!root.classList.contains("splash-on")) { splash.remove(); return; }

  const lead = splash.querySelector(".splash-lead");
  const name = splash.querySelector(".splash-name");
  const tag = splash.querySelector(".stretch");
  name.textContent = `${C.person.first} ${C.person.last}`;
  tag.textContent = C.person.tagline.replace(/[.\s]+$/, "");

  let done = false;
  const out = (fadeMs) => {
    if (done) return;
    done = true;
    splash.classList.add("out");
    setTimeout(finish, fadeMs);
  };
  splash.addEventListener("click", () => out(350));
  addEventListener("keydown", () => out(350), { once: true });

  const ready = (document.fonts && document.fonts.load)
    ? Promise.race([
      Promise.all([document.fonts.load('700 100px "Josefin Sans"'), document.fonts.load('500 16px "Manrope"')]),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
    : Promise.resolve();
  ready.then(() => {
    fitLockup(lead, name, tag);
    addEventListener("resize", () => fitLockup(lead, name, tag));
    splash.classList.add("go");
    setTimeout(() => out(700), 2000);
  });
}

/** About heading: tracked out with letter spacing so its letters span exactly the width of the facts table below it. */
function fitAboutHeading() {
  const left = document.querySelector(".about-left");
  const h2 = left && left.querySelector("h2");
  if (!h2) return;
  const W = left.clientWidth;
  const cs = getComputedStyle(h2);
  const text = h2.textContent.toUpperCase();
  h2.style.letterSpacing = "0px"; h2.style.marginLeft = "0px";
  const b = inkBearings(text, `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
  const natural = textBoxWidth(h2) - b.left - b.right;
  h2.style.letterSpacing = `${Math.max(0, (W - natural) / Math.max(1, text.length - 1))}px`;
  h2.style.marginLeft = `${-b.left}px`;
}

/** "Get in touch" heading: tracked out so its letters span exactly the width of the paragraph under it. */
function fitContactHeading() {
  const col = document.querySelector(".contact-grid > div:first-child");
  const h2 = col && col.querySelector("h2");
  const p = col && col.querySelector("p");
  if (!h2 || !p) return;
  const W = p.getBoundingClientRect().width;
  const cs = getComputedStyle(h2);
  const text = h2.textContent.toUpperCase();
  h2.style.letterSpacing = "0px"; h2.style.marginLeft = "0px";
  const b = inkBearings(text, `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`);
  const natural = textBoxWidth(h2) - b.left - b.right;
  h2.style.letterSpacing = `${Math.max(0, (W - natural) / Math.max(1, text.length - 1))}px`;
  h2.style.marginLeft = `${-b.left}px`;
}

function watchTagline() {
  const lead = document.querySelector(".hero-lead");
  if (!lead) return;
  fitHero();
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('700 100px "Josefin Sans"'), document.fonts.load('500 16px "Manrope"')])
      .then(() => document.fonts.ready).then(fitHero).catch(() => {});
  }
  if ("ResizeObserver" in window) new ResizeObserver(fitHero).observe(lead);
  const contactCol = document.querySelector(".contact-grid > div:first-child");
  if (contactCol) {
    fitContactHeading();
    if (document.fonts && document.fonts.load) document.fonts.load('300 20px "Josefin Sans"').then(() => document.fonts.ready).then(fitContactHeading).catch(() => {});
    if ("ResizeObserver" in window) new ResizeObserver(fitContactHeading).observe(contactCol);
  }
  const aboutLeft = document.querySelector(".about-left");
  if (aboutLeft) {
    fitAboutHeading();
    if (document.fonts && document.fonts.load) document.fonts.load('300 40px "Josefin Sans"').then(() => document.fonts.ready).then(fitAboutHeading).catch(() => {});
    if ("ResizeObserver" in window) new ResizeObserver(fitAboutHeading).observe(aboutLeft);
  }
}

// one failing section must not blank the rest of the page
for (const step of [runSplash, renderHero, renderAbout, renderRoles, renderSkills, renderFeedback, renderCredentials, renderContact,
  watchActiveNav, watchReveals, watchTagline]) {
  try { step(); } catch (err) { console.error(`simple.js: ${step.name} failed`, err); }
}
