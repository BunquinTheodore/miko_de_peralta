// Résumé scenes after the process sheet: record-rest ("By the numbers": the five résumé figures plus the three
// titles) and three role sheets (one per C.roles entry, all eight highlights each).
// Each builder branches on STAGE.portrait (1080x1920 stage) vs landscape (1920x1080).
import { pad, q, qa, esc, count, STAGE } from "./util.js";

const ACT = "03 · Experience";
const PORTRAIT = STAGE.portrait;
const W = STAGE.w, H = STAGE.h;
const MX = 90; // side margin, stage px
const CW = W - 2 * MX; // content width
// portrait vertical safe band (HUD corners, pips and act label live outside it)
const PT = 150, PB = H - 150;

// font-size that keeps `text` inside `width` px (approximate Geist 900 uppercase advance)
const fit = (text, max, width, k = 0.62) =>
  Math.max(40, Math.min(max, Math.floor(width / (Math.max(1, String(text).length) * k))));
const mask = (inner, cls = "", style = "") => `<div class="mask ${cls}" style="${style}"><span>${inner}</span></div>`;
// portrait mono label style: >= 28px, tracking <= .2em
const PM = "font-size:28px;letter-spacing:.18em";

// per-field colours (text, muted, rule lines, grid paper)
const TONE = {
  ink: { fg: "var(--bone)", mut: "var(--ash)", rule: "rgba(242, 239, 234,.26)", grid: "rgba(242, 239, 234,.045)" },
  bone: { fg: "var(--ink)", mut: "#6a6565", rule: "rgba(13, 13, 13,.24)", grid: "rgba(13, 13, 13,.055)" },
  sage: { fg: "var(--ink)", mut: "rgba(13, 13, 13,.7)", rule: "rgba(13, 13, 13,.3)", grid: "rgba(13, 13, 13,.06)" },
};
const toneVars = (f) => { const t = TONE[f] || TONE.ink; return `--fg:${t.fg};--mut:${t.mut};--rule:${t.rule};--grid:${t.grid}`; };

// grid paper backdrop (shared by every scene in this file)
const GRID_CSS = `.rc-grid { position:absolute; inset:0; background-image:
    linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size:40px 40px; background-position:-1px -1px; }`;

// Count every number in `s` up from 0 by progress p (keeps thousands separators). p = 1 returns `s` exactly.
const rollText = (s, p) => String(s).replace(/\d[\d,]*/g, (m) => {
  const v = Math.round(Number(m.replace(/,/g, "")) * p);
  return m.includes(",") ? v.toLocaleString("en-US") : String(v);
});

// split a title into two lines with the shortest longest line
function split2(text) {
  const words = String(text).split(/\s+/).filter(Boolean);
  if (words.length < 2) return [words.join(" ")];
  let best = null;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(" "), b = words.slice(k).join(" ");
    const worst = Math.max(a.length, b.length);
    if (!best || worst < best.worst) best = { worst, lines: [a, b] };
  }
  return best.lines;
}

/* ------------------------------------------------------------------ record-rest */
function recordScene(C) {
  const rec = C.record || {};
  const head = String(rec.head || "");
  const stats = (rec.stats || []).slice(0, 5);
  const titles = (C.person && C.person.titles) || [];
  const L = PORTRAIT ? recordPortrait(head, stats, titles) : recordLandscape(head, stats, titles);

  return {
    slug: "record-rest", name: "By the numbers", act: ACT, field: "ink", dur: 3.6,
    stars: true, ammo: 3, turn: null, rest: "scroll to continue", restAt: 2.2, model: false,
    html: `
      <style>
        ${GRID_CSS}
        .nb { position:absolute; inset:0; color:var(--fg); }
        .nb .nb-unit { color:var(--sage); }
        .nb .nb-label { color:var(--fg); }
        .nb .nb-note { color:var(--mut); }
        .nb .nb-i { color:var(--sage); }
        .nb .nb-titles { color:var(--sage); }
        .nb .nb-rule { position:absolute; height:2px; background:var(--rule); transform-origin:0 50%; }
        .nb .nb-val { font-family:var(--sans); font-weight:900; line-height:1; letter-spacing:-.04em; white-space:nowrap; }
        ${L.css}
      </style>
      <div class="nb" style="${toneVars("ink")}">
        <div class="rc-grid nb-grid"></div>
        ${L.body}
      </div>`,
    anim(root, tl) {
      tl.from(q(root, ".nb-grid"), { opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
      tl.from(q(root, ".nb-eye"), { opacity: 0, x: -30, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(qa(root, ".nb-sheet"), { opacity: 0, duration: 0.6 }, 0.2);
      tl.from(qa(root, ".nb-head > span"), { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.1 }, 0.1);
      tl.from(qa(root, ".nb-titles"), { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", stagger: 0.08 }, 0.4);
      tl.from(qa(root, ".nb-rule"), { scaleX: 0, duration: 0.7, ease: "power3.inOut", stagger: 0.07 }, 0.45);
      tl.from(q(root, ".nb-tick"), { scaleY: 0, duration: 0.9, ease: "power3.inOut" }, 0.5);
      // each figure: mask reveal + scrub-safe count-up, then its label and note
      const vals = qa(root, ".nb-num");
      qa(root, ".nb-row").forEach((row, i) => {
        const at = 0.6 + i * 0.16;
        const el = vals[i], target = stats[i].value;
        tl.from(q(row, ".nb-vm > span"), { yPercent: 115, opacity: 0, duration: 0.6, ease: "power4.out" }, at);
        count(tl, (p) => { el.textContent = p >= 1 ? String(target) : rollText(target, p); }, 0, 1, at, 0.8, "power2.out");
        tl.from(qa(row, ".nb-i, .nb-unit"), { opacity: 0, duration: 0.4 }, at + 0.2);
        tl.from(qa(row, ".nb-label, .nb-note"), { opacity: 0, y: 14, duration: 0.45, ease: "power3.out", stagger: 0.06 }, at + 0.25);
      });
    },
  };
}

function statRow(s, i, cls = "", rule = false) {
  return `
      <div class="nb-row ${cls}">${rule ? `<i class="nb-rule"></i>` : ""}
        <span class="mono nb-i">${pad(i + 1)}</span>
        <span class="nb-vline">
          ${mask(`<span class="nb-num">${esc(s.value)}</span>`, "nb-vm nb-val")}
          ${s.unit ? `<span class="mono nb-unit">${esc(s.unit)}</span>` : ""}
        </span>
        <span class="nb-txt">
          <span class="nb-label">${esc(s.label)}</span>
          ${s.note ? `<span class="mono nb-note">${esc(s.note)}</span>` : ""}
        </span>
      </div>`;
}

// landscape: header block, then the five figures as rows of a schedule (index | figure | label + note)
function recordLandscape(head, stats, titles) {
  const TOP = 352, ROW = Math.floor((972 - TOP) / Math.max(1, stats.length));
  const headPx = fit(head, 124, 1200, 0.6);
  const valPx = Math.min(...stats.map((s) => fit(s.value, 96, 520, 0.62)), 96);
  const rules = Array.from({ length: stats.length + 1 }, (_, i) =>
    `<i class="nb-rule" style="left:${MX}px;top:${TOP + i * ROW}px;width:${CW}px"></i>`).join("");
  const rows = stats.map((s, i) => statRow(s, i)).join("");
  return {
    css: `.nb-rows { position:absolute; left:${MX}px; top:${TOP}px; width:${CW}px; display:grid;
          grid-template-rows:repeat(${stats.length}, ${ROW}px); }
        .nb-row { display:grid; grid-template-columns:96px 640px 1fr; align-items:center; column-gap:24px; padding-left:34px; }
        .nb-row .nb-i { font-size:18px; letter-spacing:.2em; }
        .nb-vline { display:flex; align-items:baseline; gap:18px; min-width:0; }
        .nb-val { font-size:${valPx}px; }
        .nb-unit { font-size:22px; letter-spacing:.2em; }
        .nb-txt { display:grid; gap:10px; }
        .nb-label { font:500 32px/1.15 var(--sans); letter-spacing:-.01em; }
        .nb-note { font-size:16px; letter-spacing:.2em; }
        .nb-tick { position:absolute; left:${MX}px; top:${TOP}px; width:3px; height:${ROW * stats.length}px;
          background:var(--sage); transform-origin:50% 0; }`,
    body: `
        <div class="abs nb-eye" style="left:100px;top:112px"><span class="eyebrow">Experience</span></div>
        <div class="abs mono nb-sheet" style="right:100px;top:116px;font-size:20px;color:var(--mut)">Sheet E-203 · Rev 03</div>
        ${mask(esc(head), "mid nb-head", `position:absolute;left:${MX + 4}px;top:164px;font-size:${headPx}px;white-space:nowrap`)}
        <div class="abs mono nb-titles" style="left:${MX + 6}px;top:${164 + headPx + 26}px;font-size:20px;letter-spacing:.2em">${titles.map(esc).join(" · ")}</div>
        <div class="abs mono nb-sheet" style="right:100px;top:${164 + headPx + 26}px;font-size:18px;color:var(--mut)">${pad(stats.length)} figures · Scale 1:1</div>
        ${rules}
        <i class="nb-tick"></i>
        <div class="nb-rows">${rows}</div>`,
  };
}

// portrait: header lines, the three titles stacked, then five stacked figures filling the safe band
function recordPortrait(head, stats, titles) {
  const lines = split2(head);
  const headPx = Math.min(...lines.map((l) => fit(l, 128, CW, 0.64)), 128);
  const valPx = Math.min(...stats.map((s) => fit(s.value, 92, 640, 0.62)), 92);
  return {
    css: `.nb-col { position:absolute; left:${MX}px; top:${PT}px; width:${CW}px; height:${PB - PT}px; display:flex; flex-direction:column; }
        .nb-top { display:flex; justify-content:space-between; align-items:center; }
        .nb-heads { margin-top:34px; display:grid; gap:${Math.round(headPx * 0.02)}px; }
        .nb-tl { margin-top:30px; display:grid; gap:12px; }
        .nb-tl .nb-titles { ${PM}; }
        .nb-list { position:relative; margin-top:34px; flex:1; display:grid; grid-template-rows:repeat(${stats.length}, 1fr); padding-left:30px; }
        .nb-list .nb-tick { position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--sage); transform-origin:50% 0; }
        .nb-prow { position:relative; display:grid; grid-template-columns:1fr auto; grid-template-rows:auto auto auto;
          column-gap:20px; align-content:center; }
        .nb-prow .nb-rule { left:0; right:0; top:0; }
        .nb-prow .nb-i { grid-column:2; grid-row:1; align-self:start; padding-top:8px; ${PM}; }
        .nb-prow .nb-vline { grid-column:1; grid-row:1; display:flex; align-items:baseline; gap:16px; }
        .nb-prow .nb-txt { grid-column:1 / 3; grid-row:2; display:grid; gap:6px; margin-top:10px; padding-bottom:6px; }
        .nb-val { font-size:${valPx}px; }
        .nb-unit { ${PM}; }
        .nb-label { font:500 40px/1.15 var(--sans); letter-spacing:-.01em; }
        .nb-note { font-size:28px; letter-spacing:.1em; }`,
    body: `
        <div class="nb-col">
          <div class="nb-top">
            <span class="nb-eye"><span class="eyebrow" style="${PM}">Experience</span></span>
            <span class="mono nb-sheet" style="${PM};color:var(--mut)">E-203 · Rev 03</span>
          </div>
          <div class="nb-heads">${lines.map((l) => mask(esc(l), "mid nb-head", `font-size:${headPx}px;white-space:nowrap`)).join("")}</div>
          <div class="nb-tl">${titles.map((t) => `<span class="mono nb-titles">${esc(t)}</span>`).join("")}</div>
          <div class="nb-list"><i class="nb-tick"></i>${stats.map((s, i) => statRow(s, i, "nb-prow", true)).join("")}</div>
        </div>`,
  };
}

/* ------------------------------------------------------------------ role-* */
const ROLE_SLUGS = ["role-estimator", "role-coordinator", "role-operations"];
const ROLE_FIELDS = ["bone", "ink", "bone"];
const ROLE_REST = 2.4;
const SPLIT = 4; // portrait: highlights shown in phase A; the rest follow in phase B

const roleCss = (extra) => `
        ${GRID_CSS}
        .rl { position:absolute; inset:0; color:var(--fg); }
        .rl .rl-idx { color:var(--sage); }
        .rl .rl-sheet, .rl .rl-mut { color:var(--mut); }
        .rl .rl-sub { color:var(--sage); }
        .rl .rl-title { font-family:var(--sans); font-weight:900; text-transform:uppercase; line-height:1;
          letter-spacing:-.04em; white-space:nowrap; }
        .rl .rl-dim { position:relative; height:40px; }
        .rl .rl-dim .rl-l { position:absolute; left:0; right:0; top:19px; height:2px; background:currentColor; transform-origin:0 50%; }
        .rl .rl-dim .rl-e { position:absolute; top:0; width:2px; height:40px; background:currentColor; }
        .rl .rl-item { display:grid; align-items:start; border-top:1px dashed var(--rule); }
        .rl .rl-n { color:var(--sage); }
        .rl .rl-t { color:var(--fg); }
        ${extra}`;

const itemHtml = (t, i) => `<div class="rl-item"><span class="mono rl-n">${pad(i + 1)}</span><span class="rl-t">${esc(t)}</span></div>`;
const dimHtml = () => `<div class="rl-dim" aria-hidden="true"><i class="rl-e" style="left:0"></i><i class="rl-e" style="right:0"></i><i class="rl-l"></i></div>`;

function roleScene(r, i, n) {
  const field = ROLE_FIELDS[i % ROLE_FIELDS.length];
  const slug = ROLE_SLUGS[i] || `role-${pad(i + 1)}`;
  const label = `Role ${pad(i + 1)} / ${pad(n)}`;
  const hl = (r.highlights || []).slice();
  const metaLeft = [r.org, r.place].filter(Boolean).join(" · ");
  const L = PORTRAIT ? rolePortrait(r, i, label, hl, metaLeft) : roleLandscape(r, i, label, hl, metaLeft);
  return {
    slug, name: `Role · ${r.title}`, act: ACT, field, dur: 3.8,
    stars: field === "ink", ammo: 3, turn: null, rest: "scroll to continue", restAt: ROLE_REST, model: false,
    html: `
      <style>${roleCss(L.css)}</style>
      <div class="rl" style="${toneVars(field)}">
        <div class="rc-grid rl-grid"></div>
        ${L.body}
      </div>`,
    anim: L.anim,
  };
}

// shared header entrance (both layouts)
function headerIn(root, tl, t0 = 0) {
  tl.from(q(root, ".rl-grid"), { opacity: 0, duration: 0.8, ease: "power2.out" }, t0);
  tl.from(q(root, ".rl-idx"), { opacity: 0, x: -30, duration: 0.5, ease: "power3.out" }, t0 + 0.05);
  tl.from(q(root, ".rl-sheet"), { opacity: 0, duration: 0.5 }, t0 + 0.15);
  tl.from(qa(root, ".rl-head > span"), { yPercent: 115, duration: 0.75, ease: "power4.out", stagger: 0.08 }, t0 + 0.1);
  tl.from(qa(root, ".rl-sub, .rl-meta"), { opacity: 0, y: 16, duration: 0.45, ease: "power3.out", stagger: 0.06 }, t0 + 0.35);
  tl.from(q(root, ".rl-l"), { scaleX: 0, duration: 0.7, ease: "power3.inOut" }, t0 + 0.35);
  tl.from(qa(root, ".rl-e"), { scaleY: 0, duration: 0.35, ease: "power3.out", stagger: 0.1 }, t0 + 0.45);
}

// landscape: header stack (index, title, subtitle, org/place + period over a dimension line), then all eight
// highlights in two columns of four
function roleLandscape(r, i, label, hl, metaLeft) {
  const title = String(r.title).toUpperCase();
  const tp = fit(title, 128, CW, 0.62);
  const rows = Math.ceil(hl.length / 2) || 1;
  return {
    css: `.rl-col { position:absolute; left:${MX}px; top:108px; width:${CW}px; height:${990 - 108}px; display:flex; flex-direction:column; }
        .rl-top { display:flex; justify-content:space-between; align-items:center; padding:0 10px; }
        .rl-idx { font-size:20px; letter-spacing:.3em; font-weight:700; }
        .rl-sheet { font-size:20px; }
        .rl-head { margin-top:40px; }
        .rl-sub { margin-top:26px; font-size:22px; letter-spacing:.2em; padding-left:6px; }
        .rl-metas { margin-top:24px; display:flex; justify-content:space-between; padding:0 6px; }
        .rl-meta { font-size:20px; letter-spacing:.2em; }
        .rl-dim { margin-top:12px; }
        .rl-list { margin-top:28px; flex:1; display:grid; grid-auto-flow:column; grid-template-columns:1fr 1fr;
          grid-template-rows:repeat(${rows}, 1fr); column-gap:64px; }
        .rl-item { grid-template-columns:64px 1fr; padding-top:16px; }
        .rl-n { font-size:18px; letter-spacing:.2em; padding-top:4px; }
        .rl-t { font:400 24px/1.36 var(--sans); }`,
    body: `
        <div class="rl-col">
          <div class="rl-top"><span class="mono rl-idx">${esc(label)}</span><span class="mono rl-sheet">Sheet E-3${pad(i + 1)} · Rev 03</span></div>
          ${mask(esc(title), "rl-head rl-title", `font-size:${tp}px`)}
          ${r.subtitle ? `<span class="mono rl-sub">${esc(r.subtitle)}</span>` : ""}
          <div class="rl-metas"><span class="mono rl-meta">${esc(metaLeft)}</span><span class="mono rl-meta rl-mut">${esc(r.period || "")}</span></div>
          ${dimHtml()}
          <div class="rl-list">${hl.map(itemHtml).join("")}</div>
        </div>`,
    anim(root, tl) {
      headerIn(root, tl, 0);
      tl.from(qa(root, ".rl-item"), { opacity: 0, x: 40, duration: 0.5, ease: "power3.out", stagger: 0.1 }, 0.7);
    },
  };
}

// portrait: too much copy for one frame at phone sizes, so it plays in two phases. Phase A (0 - 1.35s): header
// and the first highlights. Phase B: a compact header recap and the remaining highlights, settled by the rest.
function rolePortrait(r, i, label, hl, metaLeft) {
  const lines = split2(String(r.title).toUpperCase());
  const tp = Math.min(...lines.map((l) => fit(l, 124, CW, 0.64)), 124);
  const a = hl.slice(0, SPLIT), b = hl.slice(SPLIT);
  const meta = [r.org, r.place].filter(Boolean).map((m) => `<span class="mono rl-meta">${esc(m)}</span>`).join("");
  return {
    css: `.rl-col { position:absolute; left:${MX}px; top:${PT}px; width:${CW}px; display:flex; flex-direction:column; }
        .rl-top { display:flex; justify-content:space-between; align-items:center; }
        .rl-idx { ${PM}; font-weight:700; }
        .rl-sheet { ${PM}; }
        .rl-heads { margin-top:36px; display:grid; }
        .rl-sub { margin-top:24px; ${PM}; }
        .rl-metas { margin-top:20px; display:grid; gap:10px; }
        .rl-meta { ${PM}; }
        .rl-dim { margin-top:18px; }
        .rl-list { margin-top:22px; display:grid; }
        .rl-item { grid-template-columns:76px 1fr; padding:20px 0 22px; }
        .rl-n { ${PM}; padding-top:8px; }
        .rl-t { font:400 40px/1.22 var(--sans); }
        .rl-b { height:${PB - PT}px; justify-content:center; }
        .rl-recap { display:grid; gap:12px; padding-bottom:28px; }
        .rl-rc { font:900 64px/1 var(--sans); letter-spacing:-.04em; text-transform:uppercase; }`,
    body: `
        <div class="rl-col rl-a">
          <div class="rl-top"><span class="mono rl-idx">${esc(label)}</span><span class="mono rl-sheet">E-3${pad(i + 1)} · Rev 03</span></div>
          <div class="rl-heads">${lines.map((l) => mask(esc(l), "rl-head rl-title", `font-size:${tp}px`)).join("")}</div>
          ${r.subtitle ? `<span class="mono rl-sub">${esc(r.subtitle)}</span>` : ""}
          <div class="rl-metas">${meta}<span class="mono rl-meta rl-mut">${esc(r.period || "")}</span></div>
          ${dimHtml()}
          <div class="rl-list">${a.map(itemHtml).join("")}</div>
        </div>
        <div class="rl-col rl-b">
          <div class="rl-recap">
            <span class="mono rl-rq rl-mut" style="${PM}">${esc(label)} · ${esc(r.period || "")}</span>
            <span class="rl-rq rl-rc" style="font-size:${fit(r.title, 64, CW, 0.66)}px;white-space:nowrap">${esc(r.title)}</span>
          </div>
          ${dimHtml().replace('class="rl-dim"', 'class="rl-dim rl-dimb"')}
          <div class="rl-list">${b.map((t, k) => itemHtml(t, k + SPLIT)).join("")}</div>
        </div>`,
    anim(root, tl) {
      const A = q(root, ".rl-a"), B = q(root, ".rl-b");
      // phase A
      headerIn(root, tl, 0);
      tl.from(qa(A, ".rl-item"), { opacity: 0, x: 40, duration: 0.4, ease: "power3.out", stagger: 0.09 }, 0.6);
      tl.fromTo(A, { opacity: 1, y: 0 }, { opacity: 0, y: -90, duration: 0.3, ease: "power2.in", immediateRender: true }, 1.35);
      // phase B
      tl.fromTo(B, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: true }, 1.6);
      tl.from(qa(B, ".rl-rq"), { opacity: 0, y: 16, duration: 0.3, ease: "power3.out", stagger: 0.06 }, 1.6);
      tl.from(qa(B, ".rl-dimb .rl-l"), { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, 1.62);
      tl.from(qa(B, ".rl-item"), { opacity: 0, x: 40, duration: 0.3, ease: "power3.out", stagger: 0.08 }, 1.68);
    },
  };
}

export function scenes(C, P) {
  const roles = C.roles || [];
  return [recordScene(C), ...roles.map((r, i) => roleScene(r, i, roles.length))];
}
