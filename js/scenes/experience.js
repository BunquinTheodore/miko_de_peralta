// Scenes 10-12: experience (title + flood to ink), roles-rest (roles + responsibilities), process (estimate workflow).
// Each builder branches on STAGE.portrait (1080x1920 stage) vs landscape (1920x1080).
import { pad, q, qa, esc, STAGE } from "./util.js";

const ACT = "03 · Experience";
const BONE = "#ededed";
const ORANGE = "#ff5f00";
const PORTRAIT = STAGE.portrait;
const W = STAGE.w, H = STAGE.h;
const MX = 90; // side margin, stage px

// font-size that keeps `text` inside `width` px (approximate Geist 900 uppercase advance)
const fit = (text, max, width, k = 0.62) =>
  Math.max(40, Math.min(max, Math.floor(width / (Math.max(1, String(text).length) * k))));
const mask = (inner, cls = "", style = "") => `<div class="mask ${cls}" style="${style}"><span>${inner}</span></div>`;
const ARROW = `<svg class="rr-arrow" viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="currentColor"
  stroke-width="3" stroke-linecap="square"><path d="M6 26 L26 6 M10 6 H26 V22"/></svg>`;
const isLink = (url) => typeof url === "string" && url.length > 0;
const linkAttrs = (url) => (/^mailto:/i.test(url) ? `href="${esc(url)}"` : `href="${esc(url)}" target="_blank" rel="noopener"`);
// portrait mono label style: >= 28px, tracking <= .2em
const PM = "font-size:28px;letter-spacing:.18em";

/* ------------------------------------------------------------------ 10 experience */
function experienceScene(C) {
  const roles = C.work || [];
  const sub = `${pad(roles.length)} roles`;
  const L = PORTRAIT
    ? { eyeTop: 700, wordTop: 770, wordPx: fit("EXPERIENCE", 250, 860, 0.56), dimTop: 960, subTop: 1030,
        dimL: MX, dimW: W - 2 * MX, lbl: PM, sub: PM, drift: 24 }
    : { eyeTop: 300, wordTop: 376, wordPx: 262, dimTop: 668, subTop: 744,
        dimL: 100, dimW: 1720, lbl: "font-size:18px", sub: "font-size:24px", drift: -50 };
  const eyeStyle = PORTRAIT ? `color:var(--ink);${PM}` : "color:var(--ink)";
  return {
    slug: "experience", name: "Experience", act: ACT, field: "orange", dur: 2.0,
    stars: false, ammo: 1, turn: [1.45, "ink"], rest: null, restAt: null, model: false,
    html: `
      <style>
        .ex-dim { position:absolute; left:${L.dimL}px; top:${L.dimTop}px; width:${L.dimW}px; height:40px; z-index:2; }
        .ex-dim .ex-l { position:absolute; left:0; right:0; top:19px; height:2px; background:currentColor; transform-origin:0 50%; }
        .ex-dim .ex-e { position:absolute; top:0; width:2px; height:40px; background:currentColor; transform-origin:50% 50%; }
        .ex-dim .ex-a { position:absolute; top:13px; width:0; height:0; border-top:7px solid transparent; border-bottom:7px solid transparent; }
        .ex-dim .ex-a.l { left:2px; border-right:22px solid currentColor; }
        .ex-dim .ex-a.r { right:2px; border-left:22px solid currentColor; }
      </style>
      <div class="abs ex-flood" style="inset:0;background:var(--ink);z-index:1;clip-path:circle(0px at ${W / 2}px ${H / 2}px)"></div>
      <div class="abs ex-ink" style="inset:0;z-index:2;color:var(--ink)">
        <div class="abs ex-eye" style="left:${PORTRAIT ? MX : 100}px;top:${L.eyeTop}px">${mask(`<span class="eyebrow ex-eb" style="${eyeStyle}">Experience</span>`)}</div>
        <div class="abs mono ex-sheet" style="right:${PORTRAIT ? MX : 100}px;top:${L.eyeTop}px;${L.lbl};opacity:.7">Sheet E-201 · Rev 02</div>
        <div class="abs" style="left:${MX}px;top:${L.wordTop}px;width:${W - 2 * MX}px;overflow:hidden">
          <h2 class="mega" style="font-size:${L.wordPx}px;white-space:nowrap"><span class="ex-slide" style="display:block">EXPERIENCE</span></h2>
        </div>
        <div class="ex-dim">
          <i class="ex-e" style="left:0"></i><i class="ex-e" style="right:0"></i>
          <i class="ex-l"></i><i class="ex-a l"></i><i class="ex-a r"></i>
        </div>
        <div class="abs mono ex-sub" style="left:${PORTRAIT ? MX : 104}px;top:${L.subTop}px;${L.sub}">${esc(sub)}</div>
        <div class="abs mono ex-scale" style="right:${PORTRAIT ? MX : 100}px;top:${L.subTop}px;${L.lbl};opacity:.7">Scale 1:1</div>
      </div>`,
    anim(root, tl) {
      const slide = q(root, ".ex-slide");
      tl.from(slide, { xPercent: 110, duration: 0.85, ease: "power4.out" }, 0);
      tl.to(slide, { x: L.drift, duration: 1.15, ease: "none" }, 0.85);
      tl.from(q(root, ".ex-eye .mask > span"), { yPercent: 115, duration: 0.6, ease: "power3.out" }, 0.25);
      tl.from(qa(root, ".ex-sheet, .ex-scale"), { opacity: 0, duration: 0.5 }, 0.35);
      tl.from(q(root, ".ex-l"), { scaleX: 0, duration: 0.7, ease: "power3.inOut" }, 0.35);
      tl.from(qa(root, ".ex-e"), { scaleY: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 }, 0.45);
      tl.from(qa(root, ".ex-a"), { opacity: 0, duration: 0.3, stagger: 0.1 }, 0.8);
      tl.from(q(root, ".ex-sub"), { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, 0.5);
      // flood to ink; text flips to bone as the circle passes under it
      const R = Math.ceil(Math.hypot(W / 2, H / 2)) + 4, at = `at ${W / 2}px ${H / 2}px`;
      tl.fromTo(q(root, ".ex-flood"), { clipPath: `circle(0px ${at})` },
        { clipPath: `circle(${R}px ${at})`, duration: 0.55, ease: "power3.inOut", immediateRender: false }, 1.0);
      tl.set(q(root, ".ex-ink"), { color: BONE }, 1.3);
      tl.set(q(root, ".ex-eb"), { color: ORANGE }, 1.3);
    },
  };
}

/* ------------------------------------------------------------------ 11 roles-rest */
const rolesMeta = (C) => ({
  name: "Roles", act: ACT, field: "ink", dur: 3.4, slug: "roles-rest",
  stars: true, ammo: 2, turn: null, rest: "scroll to continue", restAt: 2.0, model: false,
});

function rolesRestLandscape(C) {
  const roles = (C.work || []).slice(0, 2);
  const resp = (C.responsibilities || []).slice(0, 5);
  const ROW = 180, TOP = 176;
  const rolePx = Math.min(...roles.map((r) => fit(String(r.role).toUpperCase(), 84, 870, 0.62)), 84);
  const rows = roles.map((r, i) => {
    const link = isLink(r.url);
    const tag = link ? "a" : "div";
    const attrs = link ? ` ${linkAttrs(r.url)}` : "";
    const since = r.since ? `<span class="mono rr-since">Since ${esc(r.since)}</span>` : "";
    return `
      <${tag} class="rr${link ? " rr-link" : ""}"${attrs} style="top:${TOP + i * ROW}px">
        <span class="mono rr-i">${pad(i + 1)}</span>
        <span class="rr-left">
          <span class="mask rr-role"><span style="font-size:${rolePx}px">${esc(String(r.role).toUpperCase())}</span></span>
          <span class="mono rr-co">${esc(r.company)}</span>
        </span>
        <span class="rr-right">
          <span class="mono rr-place">${esc(r.place || "")}</span>
          <span class="rr-sum">${esc(r.summary || "")}</span>
          ${since}
        </span>
        ${link ? ARROW : "<span></span>"}
      </${tag}>`;
  }).join("");
  const lines = Array.from({ length: roles.length + 1 }, (_, i) =>
    `<div class="abs rr-line" style="left:90px;top:${TOP + i * ROW}px;width:1740px;height:2px;background:var(--bone);opacity:.35;transform-origin:0 50%"></div>`).join("");
  const RTOP = TOP + roles.length * ROW + 64, RITEM = 68;
  const items = resp.map((t, i) => `
      <div class="rs-item" style="top:${RTOP + i * RITEM}px">
        <span class="mono rs-n">${pad(i + 1)}</span>
        <span class="rs-t">${esc(t)}</span>
      </div>`).join("");
  return {
    ...rolesMeta(C),
    html: `
      <style>
        .rr { position:absolute; left:90px; width:1740px; height:${ROW}px; display:grid;
          grid-template-columns:70px 1fr 580px 56px; align-items:center; column-gap:24px; padding:0 22px 0 24px;
          color:var(--bone); text-decoration:none; }
        .rr-link { transition:background-color .25s, color .25s; }
        .rr-link:hover, .rr-link:focus-visible { background:var(--orange); color:var(--ink); }
        .rr .rr-i { font-size:20px; opacity:.7; }
        .rr .rr-left { display:grid; gap:18px; min-width:0; }
        .rr .rr-role span { font:900 84px/1 var(--sans); letter-spacing:-.04em; white-space:nowrap; }
        .rr .rr-co { font-size:20px; letter-spacing:.2em; color:var(--orange); }
        .rr .rr-right { display:grid; gap:14px; }
        .rr .rr-place { font-size:16px; letter-spacing:.24em; color:var(--ash); }
        .rr .rr-sum { font:400 24px/1.35 var(--sans); color:var(--bone); }
        .rr .rr-since { font-size:16px; opacity:.85; }
        .rr .rr-arrow { justify-self:end; transition:transform .25s; }
        .rr-link:hover .rr-arrow { transform:translate(6px,-6px); }
        .rs-head { position:absolute; left:100px; top:${RTOP}px; display:grid; gap:22px; }
        .rs-item { position:absolute; left:500px; width:1330px; height:${RITEM}px; display:grid;
          grid-template-columns:64px 1fr; align-items:center; border-top:1px dashed rgba(237,237,237,.22); }
        .rs-item .rs-n { font-size:16px; color:var(--orange); letter-spacing:.2em; }
        .rs-item .rs-t { font:400 22px/1.3 var(--sans); color:var(--bone); }
        .rs-tick { position:absolute; left:470px; width:2px; height:${RITEM * resp.length}px; top:${RTOP}px;
          background:var(--orange); transform-origin:50% 0; }
      </style>
      <div class="abs" style="left:100px;top:112px">${mask(`<span class="eyebrow">Experience</span>`)}</div>
      <div class="abs mono dim rr-count" style="right:100px;top:116px;font-size:20px">${pad(roles.length)} roles · Sheet E-202</div>
      ${lines}${rows}
      <div class="rs-head">
        <span class="mono rs-label" style="font-size:18px;color:var(--ash)">Responsibilities</span>
        ${mask(pad(resp.length), "big ol rs-count", "font-size:140px;color:var(--bone)")}
      </div>
      <i class="rs-tick"></i>
      ${items}`,
    anim(root, tl) {
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.6, ease: "power3.out" }, 0);
      tl.from(q(root, ".rr-count"), { opacity: 0, duration: 0.6 }, 0.2);
      tl.from(qa(root, ".rr-line"), { scaleX: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.1 }, 0.15);
      tl.from(qa(root, ".rr-role > span"), { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.12 }, 0.3);
      tl.from(qa(root, ".rr-i, .rr-co, .rr-right, .rr-arrow"), { opacity: 0, y: 18, duration: 0.6, ease: "power3.out", stagger: 0.04 }, 0.5);
      tl.from(qa(root, ".rs-label"), { opacity: 0, x: -20, duration: 0.5, ease: "power3.out" }, 0.8);
      tl.from(qa(root, ".rs-count > span"), { yPercent: 115, duration: 0.7, ease: "power4.out" }, 0.85);
      tl.from(q(root, ".rs-tick"), { scaleY: 0, duration: 0.9, ease: "power3.inOut" }, 0.85);
      tl.from(qa(root, ".rs-item"), { opacity: 0, x: 40, duration: 0.5, ease: "power3.out", stagger: 0.12 }, 0.95);
    },
  };
}

// Portrait: too much copy for one 1080x1920 frame at phone-legible sizes, so the scene plays in two phases.
// Phase A (0 - 1.1s) shows the roles in full; phase B replaces them with a compact role recap plus the five
// responsibilities, settled by the rest point (2.0s).
function rolesRestPortrait(C) {
  const roles = (C.work || []).slice(0, 2);
  const resp = (C.responsibilities || []).slice(0, 5);
  const CW = W - 2 * MX;
  const rolePx = Math.min(...roles.map((r) => fit(String(r.role).toUpperCase(), 96, CW, 0.64)), 96);
  const roleRows = roles.map((r, i) => {
    const link = isLink(r.url);
    const tag = link ? "a" : "div";
    const attrs = link ? ` ${linkAttrs(r.url)}` : "";
    const since = r.since ? `<span class="mono rp-meta">Since ${esc(r.since)}</span>` : "";
    return `
      <${tag} class="rp-role${link ? " rr-link" : ""}"${attrs}>
        <i class="rp-line"></i>
        <span class="mono rp-i">${pad(i + 1)}${link ? " ↗" : ""}</span>
        <span class="mask rp-name"><span style="font-size:${rolePx}px">${esc(String(r.role).toUpperCase())}</span></span>
        <span class="mono rp-co">${esc(r.company)}</span>
        ${r.place ? `<span class="mono rp-meta">${esc(r.place)}</span>` : ""}
        ${since}
        <span class="rp-sum">${esc(r.summary || "")}</span>
      </${tag}>`;
  }).join("");
  const recap = roles.map((r, i) => `<span class="mono rq-row">${pad(i + 1)} · ${esc(r.role)}</span>`).join("");
  const items = resp.map((t, i) => `
        <div class="rq-item"><span class="mono rq-n">${pad(i + 1)}</span><span class="rq-t">${esc(t)}</span></div>`).join("");
  return {
    ...rolesMeta(C),
    html: `
      <style>
        .rp-roles { position:absolute; left:${MX}px; top:400px; width:${CW}px; display:grid; gap:72px; }
        .rp-role { position:relative; display:grid; gap:18px; padding-top:40px; color:var(--bone); text-decoration:none; }
        .rp-role .rp-line { position:absolute; left:0; top:0; width:100%; height:2px; background:var(--bone); opacity:.35; transform-origin:0 50%; }
        .rp-role .rp-i { ${PM}; color:var(--orange); }
        .rp-role .rp-name span { font:900 96px/1 var(--sans); letter-spacing:-.04em; white-space:nowrap; }
        .rp-role .rp-co { ${PM}; color:var(--orange); }
        .rp-role .rp-meta { ${PM}; color:var(--ash); }
        .rp-role .rp-sum { font:400 40px/1.3 var(--sans); color:var(--bone); margin-top:6px; }
        .rq { position:absolute; left:${MX}px; top:260px; width:${CW}px; display:grid; gap:0; }
        .rq-recap { display:grid; gap:14px; padding-bottom:36px; }
        .rq-recap .rq-row { ${PM}; color:var(--ash); }
        .rq-head { display:flex; justify-content:space-between; align-items:flex-end; padding:30px 0 26px;
          border-top:2px solid rgba(237,237,237,.35); }
        .rq-head .rq-label { ${PM}; color:var(--ash); }
        .rq-list { position:relative; display:grid; gap:0; padding-left:34px; }
        .rq-list .rq-tick { position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--orange); transform-origin:50% 0; }
        .rq-item { display:grid; grid-template-columns:72px 1fr; align-items:baseline; padding:24px 0;
          border-top:1px dashed rgba(237,237,237,.25); }
        .rq-item .rq-n { ${PM}; color:var(--orange); }
        .rq-item .rq-t { font:400 40px/1.28 var(--sans); color:var(--bone); }
      </style>
      <div class="abs" style="left:${MX}px;top:150px">${mask(`<span class="eyebrow" style="${PM}">Experience</span>`)}</div>
      <div class="abs mono dim rr-count" style="right:${MX}px;top:150px;${PM}">${pad(roles.length)} roles · E-202</div>
      <div class="rp-roles">${roleRows}</div>
      <div class="rq">
        <div class="rq-recap">${recap}</div>
        <div class="rq-head">
          <span class="mono rq-label">Responsibilities</span>
          ${mask(pad(resp.length), "big ol rq-count", "font-size:110px;color:var(--bone)")}
        </div>
        <div class="rq-list"><i class="rq-tick"></i>${items}</div>
      </div>`,
    anim(root, tl) {
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.5, ease: "power3.out" }, 0);
      tl.from(q(root, ".rr-count"), { opacity: 0, duration: 0.5 }, 0.15);
      // phase A: roles
      tl.from(qa(root, ".rp-line"), { scaleX: 0, duration: 0.6, ease: "power3.inOut", stagger: 0.1 }, 0.05);
      tl.from(qa(root, ".rp-name > span"), { yPercent: 115, duration: 0.6, ease: "power4.out", stagger: 0.1 }, 0.12);
      tl.from(qa(root, ".rp-i, .rp-co, .rp-meta, .rp-sum"), { opacity: 0, y: 18, duration: 0.4, ease: "power3.out", stagger: 0.035 }, 0.25);
      tl.fromTo(q(root, ".rp-roles"), { opacity: 1, y: 0 }, { opacity: 0, y: -90, duration: 0.3, ease: "power2.in", immediateRender: true }, 1.1);
      // phase B: recap + responsibilities
      tl.from(qa(root, ".rq-row"), { opacity: 0, y: 16, duration: 0.3, ease: "power3.out", stagger: 0.06 }, 1.3);
      tl.from(q(root, ".rq-head"), { opacity: 0, duration: 0.3 }, 1.3);
      tl.from(q(root, ".rq-count > span"), { yPercent: 115, duration: 0.45, ease: "power4.out" }, 1.32);
      tl.from(q(root, ".rq-tick"), { scaleY: 0, duration: 0.6, ease: "power3.inOut" }, 1.35);
      tl.from(qa(root, ".rq-item"), { opacity: 0, x: 40, duration: 0.3, ease: "power3.out", stagger: 0.075 }, 1.38);
    },
  };
}

/* ------------------------------------------------------------------ 12 process */
function processScene(C) {
  const steps = (C.process || []).slice(0, 5);
  const n = Math.max(1, steps.length);
  const first = steps[0]?.step || "", last = steps[steps.length - 1]?.step || "";
  const overall = steps.length > 1 ? `${first} → ${last}` : first;
  const G = PORTRAIT ? processPortrait(steps, n) : processLandscape(steps, n);

  return {
    slug: "process", name: "Process", act: ACT, field: "bone", dur: 4.0,
    stars: false, ammo: 3, turn: null, rest: "scroll to continue", restAt: 2.75, model: false,
    html: `
      <style>
        .pr-grid { position:absolute; inset:0; background-image:
          linear-gradient(rgba(5,5,5,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(5,5,5,.055) 1px, transparent 1px);
          background-size:40px 40px; background-position:-1px -1px; }
        .pr-svg { position:absolute; left:0; top:0; overflow:visible; }
        .pr-svg path { fill:none; stroke:var(--ink); stroke-width:2; }
        .pr-svg .pr-base, .pr-svg .pr-prog, .pr-svg .pr-oline { stroke-dasharray:1; }
        .pr-svg .pr-prog { stroke:var(--orange); stroke-width:5; }
        .pr-svg .pr-ext, .pr-svg .pr-oext { stroke-width:1.5; opacity:.6; }
        .pr-svg .pr-tick { stroke-width:3; }
        .pr-svg .pr-arr, .pr-svg .pr-oarr { fill:var(--ink); stroke:none; }
        .pr-node { position:absolute; width:${G.node}px; height:${G.node}px; border-radius:50%; border:3px solid var(--ink);
          background:var(--bone); display:grid; place-items:center; z-index:3; }
        .pr-node .pr-fill { position:absolute; inset:5px; border-radius:50%; background:var(--orange); }
        .pr-node b { position:relative; font-size:${G.nodeFont}px; letter-spacing:.08em; color:var(--ink); }
        .pr-tool { color:var(--ink); opacity:.75; white-space:nowrap; }
        .pr-step { font-family:var(--sans); font-weight:900; text-transform:uppercase; line-height:1; letter-spacing:-.03em; color:var(--ink); white-space:nowrap; }
        .pr-text { color:#3a3636; }
        .pr-olabel { position:absolute; top:${G.oy - 14}px; left:0; width:${W}px; text-align:center; }
        .pr-olabel span { background:var(--bone); padding:0 18px; color:var(--ink); }
        ${G.css}
      </style>
      <div class="pr-grid"></div>
      <div class="abs" style="left:${G.mx}px;top:${G.eyeTop}px">${mask(`<span class="eyebrow" style="${G.lbl}">Process</span>`)}</div>
      <div class="abs mono pr-sheet" style="right:${G.mx}px;top:${G.eyeTop}px;${G.lbl};color:#6a6565">Sheet A-501 · ${PORTRAIT ? "Det. 01" : "Detail 01"}</div>
      ${G.head}
      <svg class="pr-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        ${G.svg}
      </svg>
      ${G.nodes}
      <div class="pr-olabel"><span class="mono pr-ol">${esc(overall)}</span></div>
      <div class="abs mono pr-foot" style="left:${G.mx}px;top:${G.footTop}px;${G.foot};color:#6a6565">${PORTRAIT ? "Fig. 01" : "Fig. 01 · How I build an estimate"}</div>
      <div class="abs mono pr-foot" style="right:${G.mx}px;top:${G.footTop}px;${G.foot};color:#6a6565">Not to scale</div>`,
    anim(root, tl) {
      tl.from(q(root, ".pr-grid"), { opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(q(root, ".pr-sheet"), { opacity: 0, duration: 0.6 }, 0.2);
      tl.from(qa(root, ".pr-head > span"), { yPercent: 115, duration: 0.85, ease: "power4.out", stagger: 0.1 }, 0.1);
      // the drawing: base dimension line, extension lines, arrowheads
      tl.fromTo(q(root, ".pr-base"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power3.inOut", immediateRender: true }, 0.3);
      tl.from(qa(root, ".pr-ext"), { opacity: 0, duration: 0.3, stagger: 0.08 }, 0.4);
      tl.from(qa(root, ".pr-arr"), { opacity: 0, duration: 0.25 }, 0.95);
      tl.from(qa(root, ".pr-tick"), { opacity: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.08 }, 0.6);
      // orange progress runs along the line, nodes light as it reaches them
      const T0 = 0.9, STEP = 0.3;
      tl.fromTo(q(root, ".pr-prog"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: STEP * Math.max(1, n - 1), ease: "none", immediateRender: true }, T0);
      const nodesEl = qa(root, ".pr-node"), fills = qa(root, ".pr-fill"), tools = qa(root, ".pr-tool");
      const stepsEl = qa(root, ".pr-step > span"), texts = qa(root, ".pr-text");
      nodesEl.forEach((el, i) => {
        const at = T0 - 0.15 + i * STEP;
        tl.from(el, { scale: 0, duration: 0.45, ease: "back.out(2)" }, at);
        tl.from(fills[i], { scale: 0, duration: 0.35, ease: "power3.out" }, at + 0.15);
        tl.from(tools[i], { opacity: 0, [G.enterAxis]: 14, duration: 0.45, ease: "power3.out" }, at + 0.05);
        tl.from(stepsEl[i], { yPercent: 115, duration: 0.6, ease: "power4.out" }, at + 0.1);
        tl.from(texts[i], { opacity: 0, [G.enterAxis]: 18, duration: 0.5, ease: "power3.out" }, at + 0.2);
      });
      // overall dimension
      tl.fromTo(q(root, ".pr-oline"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power3.inOut", immediateRender: true }, 1.7);
      tl.from(qa(root, ".pr-oext, .pr-oarr"), { opacity: 0, duration: 0.3 }, 2.1);
      tl.from(q(root, ".pr-ol"), { opacity: 0, duration: 0.4 }, 2.2);
      tl.from(qa(root, ".pr-foot"), { opacity: 0, duration: 0.5 }, 2.2);
    },
  };
}

// horizontal overall dimension (both layouts), from x0 to x1 at y
const overallSvg = (x0, x1, y) =>
  `<path class="pr-oext" d="M${x0} ${y - 26} V${y + 26}"/><path class="pr-oext" d="M${x1} ${y - 26} V${y + 26}"/>
   <path class="pr-oline" pathLength="1" d="M${x0} ${y} H${x1}"/>
   <path class="pr-oarr" d="M${x0} ${y} L${x0 + 20} ${y - 6} L${x0 + 20} ${y + 6} Z"/>
   <path class="pr-oarr" d="M${x1} ${y} L${x1 - 20} ${y - 6} L${x1 - 20} ${y + 6} Z"/>`;

// landscape: horizontal dimension line, nodes in a row, labels above/below
function processLandscape(steps, n) {
  const X0 = 90, X1 = 1830, COL = (X1 - X0) / n, LY = 500, OY = 872;
  const cx = (i) => Math.round(X0 + COL * (i + 0.5));
  const bounds = Array.from({ length: n + 1 }, (_, k) => Math.round(X0 + COL * k));
  const head = "HOW I BUILD AN ESTIMATE";
  const headPx = fit(head, 112, 1700, 0.6);
  const stepPx = Math.min(...steps.map((s) => fit(String(s.step).toUpperCase(), 56, COL - 48, 0.62)), 56);
  const BW = Math.round(COL - 40);
  const svg = bounds.map((x) => `<path class="pr-ext" d="M${x} ${LY - 54} V${LY + 46}"/>`).join("") +
    `<path class="pr-base" pathLength="1" d="M${X0} ${LY} H${X1}"/>` +
    `<path class="pr-prog" pathLength="1" d="M${X0} ${LY} H${cx(n - 1)}"/>` +
    bounds.slice(1, -1).map((x) => `<path class="pr-tick" d="M${x - 12} ${LY + 12} L${x + 12} ${LY - 12}"/>`).join("") +
    `<path class="pr-arr" d="M${X0} ${LY} L${X0 + 24} ${LY - 8} L${X0 + 24} ${LY + 8} Z"/>` +
    `<path class="pr-arr" d="M${X1} ${LY} L${X1 - 24} ${LY - 8} L${X1 - 24} ${LY + 8} Z"/>` +
    overallSvg(X0, X1, OY);
  const nodes = steps.map((s, i) => `
      <div class="pr-node" style="left:${cx(i) - 34}px;top:${LY - 34}px"><i class="pr-fill"></i><b class="mono">${pad(i + 1)}</b></div>
      <div class="abs mono pr-tool" style="left:${cx(i) - BW / 2}px;top:${LY - 92}px;width:${BW}px">${esc(s.tool)}</div>
      ${mask(esc(String(s.step).toUpperCase()), "pr-step", `position:absolute;left:${cx(i) - BW / 2}px;top:${LY + 76}px;width:${BW}px;font-size:${stepPx}px`)}
      <div class="abs pr-text" style="left:${cx(i) - BW / 2}px;top:${LY + 92 + stepPx}px;width:${BW}px">${esc(s.text)}</div>`).join("");
  return {
    mx: 100, eyeTop: 110, footTop: 934, oy: OY, node: 68, nodeFont: 19, enterAxis: "y",
    lbl: "font-size:18px", foot: "font-size:16px",
    css: `.pr-tool { font-size:16px; letter-spacing:.16em; text-align:center; }
        .pr-step { text-align:center; }
        .pr-text { font:400 20px/1.4 var(--sans); text-align:center; }
        .pr-olabel span { font-size:16px; letter-spacing:.24em; }`,
    head: mask(esc(head), "mid pr-head", `position:absolute;left:96px;top:162px;font-size:${headPx}px;white-space:nowrap`),
    svg, nodes,
  };
}

// portrait: vertical dimension line down the left, nodes stacked, tool/step/text beside each node
function processPortrait(steps, n) {
  const LX = 170, Y0 = 476, Y1 = 1644, SEG = (Y1 - Y0) / n, OY = 1700;
  const cy = (i) => Math.round(Y0 + SEG * (i + 0.5));
  const bounds = Array.from({ length: n + 1 }, (_, k) => Math.round(Y0 + SEG * k));
  const lines = ["HOW I BUILD", "AN ESTIMATE"];
  const headPx = Math.min(...lines.map((l) => fit(l, 124, W - 2 * MX, 0.64)));
  const BX = 262, BW = W - MX - BX;
  const stepPx = Math.min(...steps.map((s) => fit(String(s.step).toUpperCase(), 60, BW, 0.64)), 60);
  const NODE = 84;
  const svg = bounds.map((y) => `<path class="pr-ext" d="M${LX - 50} ${y} H${LX + 50}"/>`).join("") +
    `<path class="pr-base" pathLength="1" d="M${LX} ${Y0} V${Y1}"/>` +
    `<path class="pr-prog" pathLength="1" d="M${LX} ${Y0} V${cy(n - 1)}"/>` +
    bounds.slice(1, -1).map((y) => `<path class="pr-tick" d="M${LX - 12} ${y + 12} L${LX + 12} ${y - 12}"/>`).join("") +
    `<path class="pr-arr" d="M${LX} ${Y0} L${LX - 8} ${Y0 + 24} L${LX + 8} ${Y0 + 24} Z"/>` +
    `<path class="pr-arr" d="M${LX} ${Y1} L${LX - 8} ${Y1 - 24} L${LX + 8} ${Y1 - 24} Z"/>` +
    overallSvg(MX, W - MX, OY);
  const nodes = steps.map((s, i) => `
      <div class="pr-node" style="left:${LX - NODE / 2}px;top:${cy(i) - NODE / 2}px"><i class="pr-fill"></i><b class="mono">${pad(i + 1)}</b></div>
      <div class="pr-blk" style="left:${BX}px;top:${cy(i)}px;width:${BW}px">
        <div class="mono pr-tool">${esc(s.tool)}</div>
        ${mask(esc(String(s.step).toUpperCase()), "pr-step", `font-size:${stepPx}px`)}
        <div class="pr-text">${esc(s.text)}</div>
      </div>`).join("");
  return {
    mx: MX, eyeTop: 150, footTop: 1740, oy: OY, node: NODE, nodeFont: 28, enterAxis: "x",
    lbl: PM, foot: PM,
    css: `.pr-blk { position:absolute; display:grid; gap:10px; transform:translateY(-50%); }
        .pr-tool { ${PM}; }
        .pr-text { font:400 40px/1.22 var(--sans); }
        .pr-olabel span { ${PM}; }`,
    head: lines.map((l, i) => mask(esc(l), "mid pr-head",
      `position:absolute;left:${MX - 4}px;top:${210 + i * Math.round(headPx * 0.98)}px;font-size:${headPx}px;white-space:nowrap`)).join(""),
    svg, nodes,
  };
}

export function scenes(C, P) {
  return [experienceScene(C), PORTRAIT ? rolesRestPortrait(C) : rolesRestLandscape(C), processScene(C)];
}
