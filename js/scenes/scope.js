// Scene after the toolkit: scope-rest, the full résumé skill schedule (C.scopes) drawn as a schedule of items
// on grid paper. Landscape shows all five groups as five columns; portrait plays in two phases (groups 1-2,
// then groups 3-5) because all items at phone-legible sizes do not fit one 1080x1920 frame.
import { pad, q, qa, esc, STAGE } from "./util.js";

const ACT = "04 · Toolkit";
const PORTRAIT = STAGE.portrait;
const W = STAGE.w, H = STAGE.h;
const MX = 90; // side margin, stage px
const PM = "font-size:28px;letter-spacing:.18em"; // portrait mono label
const HEAD = "FULL SCOPE";
const SPLIT = 2; // portrait: groups shown in phase A

const mask = (inner, cls = "", style = "") => `<div class="mask ${cls}" style="${style}"><span>${inner}</span></div>`;
const fit = (text, max, width, k = 0.62) =>
  Math.max(40, Math.min(max, Math.floor(width / (Math.max(1, String(text).length) * k))));
const code = (i) => `S${pad(i + 1)}`;
// group title: keep hyphenated words (e.g. "Pre-Construction") from breaking at the hyphen
const title = (t) => esc(t).replace(/(\S*-\S*)/g, '<span style="white-space:nowrap">$1</span>');
const headline = () => `${esc(HEAD)}<span style="color:var(--sage)">.</span>`;

const GRID_CSS = `.sc-grid { position:absolute; inset:0; background-image:
    linear-gradient(rgba(13, 13, 13,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(13, 13, 13,.055) 1px, transparent 1px);
    background-size:40px 40px; background-position:-1px -1px; }`;

/* ------------------------------------------------------------------ landscape */
function landscape(groups, total) {
  const TOP = 352, COLW = 324, GAP = 30;
  const cols = groups.map((g, i) => {
    const items = (g.items || []).map((t, k) => `
          <li class="sc-it"><span class="mono sc-n">${pad(k + 1)}</span><span class="sc-t">${esc(t)}</span></li>`).join("");
    return `
      <div class="sc-col" style="left:${MX + i * (COLW + GAP)}px">
        ${i > 0 ? `<i class="sc-vr"></i>` : ""}
        <div class="sc-hd">
          <span class="mono sc-code">${code(i)} · ${pad((g.items || []).length)} items</span>
          <span class="sc-gt">${title(g.group)}</span>
        </div>
        <ul class="sc-list">${items}</ul>
      </div>`;
  }).join("");
  const headPx = 150;
  return {
    css: `
        .sc-col { position:absolute; top:${TOP}px; width:${COLW}px; }
        .sc-vr { position:absolute; left:${-GAP / 2}px; top:0; width:1px; height:570px; background:rgba(13, 13, 13,.28); transform-origin:50% 0; }
        .sc-hd { display:grid; gap:12px; padding:18px 0 14px; min-height:118px; align-content:start; }
        .sc-code { font-size:16px; letter-spacing:.2em; color:var(--sage); }
        .sc-gt { font:900 22px/1.12 var(--sans); letter-spacing:-.01em; text-transform:uppercase; color:var(--ink); }
        .sc-list { list-style:none; margin:0; padding:0; }
        .sc-it { display:grid; grid-template-columns:40px 1fr; align-items:baseline; padding:9px 0;
          border-top:1px dashed rgba(13, 13, 13,.28); }
        .sc-n { font-size:15px; letter-spacing:.12em; color:#6a6565; }
        .sc-t { font:400 21px/1.28 var(--sans); color:#2a2727; }
        .sc-rule { position:absolute; left:${MX}px; top:${TOP}px; width:${W - 2 * MX}px; height:2px; background:var(--ink); transform-origin:0 50%; }`,
    html: `
      <div class="abs" style="left:100px;top:110px">${mask(`<span class="eyebrow">Scope</span>`)}</div>
      <div class="abs mono sc-sheet" style="right:100px;top:112px;font-size:18px;color:#6a6565">Sheet A-601 · Rev 03</div>
      ${mask(headline(), "big sc-head", `position:absolute;left:96px;top:158px;font-size:${headPx}px;white-space:nowrap;color:var(--ink)`)}
      <div class="abs sc-tot" style="right:100px;top:214px;text-align:right">
        <div class="mono" style="font-size:18px;color:#6a6565">Schedule of items</div>
        <div class="mono" style="font-size:24px;margin-top:14px;color:var(--ink)">${pad(groups.length)} groups · ${pad(total)} items</div>
      </div>
      <i class="sc-rule"></i>
      ${cols}
      <div class="abs mono sc-foot" style="left:100px;top:956px;font-size:16px;color:#6a6565">Schedule 01 · Technical skills</div>
      <div class="abs mono sc-foot" style="right:100px;top:956px;font-size:16px;color:#6a6565">Scale 1:100</div>`,
    anim(root, tl) {
      tl.from(q(root, ".sc-grid"), { opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(qa(root, ".sc-sheet, .sc-tot"), { opacity: 0, duration: 0.6 }, 0.2);
      tl.from(q(root, ".sc-head > span"), { yPercent: 115, duration: 0.85, ease: "power4.out" }, 0.1);
      tl.from(q(root, ".sc-rule"), { scaleX: 0, duration: 0.8, ease: "power3.inOut" }, 0.3);
      tl.from(qa(root, ".sc-vr"), { scaleY: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.08 }, 0.45);
      qa(root, ".sc-col").forEach((col, i) => {
        const at = 0.55 + i * 0.14;
        tl.from(q(col, ".sc-hd"), { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, at);
        tl.from(qa(col, ".sc-it"), { opacity: 0, y: 14, duration: 0.4, ease: "power3.out", stagger: 0.05 }, at + 0.15);
      });
      tl.from(qa(root, ".sc-foot"), { opacity: 0, duration: 0.5 }, 1.6);
    },
  };
}

/* ------------------------------------------------------------------ portrait */
function portrait(groups, total) {
  const CW = W - 2 * MX;
  const headPx = fit(HEAD + ".", 150, CW, 0.64);
  const block = (g, i) => `
        <div class="sc-grp">
          <div class="sc-hd">
            <span class="mono sc-code">${code(i)} · ${pad((g.items || []).length)} items</span>
            <span class="sc-gt">${title(g.group)}</span>
          </div>
          <div class="sc-pills">${(g.items || []).map((t) => `<span class="mono sc-pill">${esc(t)}</span>`).join("")}</div>
        </div>`;
  const a = groups.slice(0, SPLIT), b = groups.slice(SPLIT);
  const part = (n) => `<span class="mono sc-part" style="${PM};color:#6a6565">Part ${n} of 2</span>`;
  return {
    css: `
        .sc-phase { position:absolute; left:${MX}px; top:440px; width:${CW}px; display:grid; gap:56px; }
        .sc-grp { display:grid; gap:24px; }
        .sc-hd { display:grid; gap:14px; padding-top:22px; border-top:2px solid var(--ink); }
        .sc-code { ${PM}; color:var(--sage); }
        .sc-gt { font:900 44px/1.06 var(--sans); letter-spacing:-.02em; text-transform:uppercase; color:var(--ink); }
        .sc-pills { display:flex; flex-wrap:wrap; gap:14px 14px; }
        .sc-pill { font-size:28px; letter-spacing:.06em; line-height:1.15; padding:12px 18px; border:2px solid rgba(13, 13, 13,.7);
          color:var(--ink); background:var(--bone); }`,
    html: `
      <div class="abs" style="left:${MX}px;top:150px">${mask(`<span class="eyebrow" style="${PM}">Scope</span>`)}</div>
      <div class="abs mono sc-sheet" style="right:${MX}px;top:150px;${PM};color:#6a6565">A-601 · Rev 03</div>
      ${mask(headline(), "big sc-head", `position:absolute;left:${MX - 4}px;top:226px;font-size:${headPx}px;white-space:nowrap;color:var(--ink)`)}
      <div class="abs mono sc-tot" style="left:${MX}px;top:${226 + Math.round(headPx * 0.95) + 26}px;${PM};color:var(--ink)">${pad(groups.length)} groups · ${pad(total)} items</div>
      <div class="sc-phase sc-a">${a.map((g, i) => block(g, i)).join("")}</div>
      <div class="sc-phase sc-b">${b.map((g, i) => block(g, i + SPLIT)).join("")}</div>
      <div class="abs sc-parts" style="right:${MX}px;top:${226 + Math.round(headPx * 0.95) + 26}px">
        <div class="abs sc-pa" style="right:0;top:0;white-space:nowrap">${part(1)}</div>
        <div class="abs sc-pb" style="right:0;top:0;white-space:nowrap">${part(2)}</div>
      </div>
      <div class="abs mono sc-foot" style="left:${MX}px;top:1740px;${PM};color:#6a6565">Schedule 01</div>
      <div class="abs mono sc-foot" style="right:${MX}px;top:1740px;${PM};color:#6a6565">Scale 1:100</div>`,
    anim(root, tl) {
      tl.from(q(root, ".sc-grid"), { opacity: 0, duration: 0.7, ease: "power2.out" }, 0);
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.5, ease: "power3.out" }, 0.05);
      tl.from(q(root, ".sc-sheet"), { opacity: 0, duration: 0.5 }, 0.15);
      tl.from(q(root, ".sc-head > span"), { yPercent: 115, duration: 0.7, ease: "power4.out" }, 0.08);
      tl.from(q(root, ".sc-tot"), { opacity: 0, y: 16, duration: 0.45, ease: "power3.out" }, 0.3);
      tl.from(qa(root, ".sc-foot"), { opacity: 0, duration: 0.45 }, 0.4);
      // phase A: first groups
      const pa = q(root, ".sc-a"), pb = q(root, ".sc-b");
      tl.from(q(root, ".sc-pa"), { opacity: 0, duration: 0.3 }, 0.3);
      qa(pa, ".sc-grp").forEach((g, i) => {
        const at = 0.2 + i * 0.22;
        tl.from(q(g, ".sc-hd"), { opacity: 0, y: 20, duration: 0.4, ease: "power3.out" }, at);
        tl.from(qa(g, ".sc-pill"), { opacity: 0, y: 14, duration: 0.3, ease: "power3.out", stagger: 0.035 }, at + 0.1);
      });
      tl.fromTo(pa, { opacity: 1, y: 0 }, { opacity: 0, y: -90, duration: 0.3, ease: "power2.in", immediateRender: true }, 1.3);
      tl.fromTo(q(root, ".sc-pa"), { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, 1.3);
      // phase B: remaining groups
      tl.fromTo(q(root, ".sc-pb"), { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: true }, 1.55);
      qa(pb, ".sc-grp").forEach((g, i) => {
        const at = 1.5 + i * 0.18;
        tl.fromTo(q(g, ".sc-hd"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: true }, at);
        tl.fromTo(qa(g, ".sc-pill"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.28, ease: "power3.out", stagger: 0.03, immediateRender: true }, at + 0.08);
      });
    },
  };
}

/* ------------------------------------------------------------------ square (1080x1080) */
function square(groups, total) {
  const SM = 70, TOP = 262, GAP = 34, COLW = Math.floor((W - 2 * SM - 2 * GAP) / 3);
  const LAYOUT = [[0, 3], [1, 4], [2]]; // group indexes per column
  const block = (g, i) => `
        <div class="sc-grp">
          <div class="sc-hd">
            <span class="mono sc-code">${code(i)} · ${pad((g.items || []).length)} items</span>
            <span class="sc-gt">${title(g.group)}</span>
          </div>
          <ul class="sc-list">${(g.items || []).map((t, k) => `
            <li class="sc-it"><span class="mono sc-n">${pad(k + 1)}</span><span class="sc-t">${esc(t)}</span></li>`).join("")}</ul>
        </div>`;
  const cols = LAYOUT.map((idx, c) => `
      <div class="sc-col" style="left:${SM + c * (COLW + GAP)}px">
        ${c > 0 ? `<i class="sc-vr"></i>` : ""}
        ${idx.map((i) => groups[i] ? block(groups[i], i) : "").join("")}
        ${c === 2 ? `<div class="sc-stat"><span class="mono sc-sl">Schedule of items</span>
          <span class="sc-big">${pad(total)}</span><span class="mono sc-sl">${pad(groups.length)} groups · ${pad(total)} items</span></div>` : ""}
      </div>`).join("");
  return {
    css: `
        .sc-col { position:absolute; top:${TOP}px; width:${COLW}px; display:grid; gap:22px; align-content:start; }
        .sc-vr { position:absolute; left:${-GAP / 2}px; top:0; width:1px; height:740px; background:rgba(13, 13, 13,.28); transform-origin:50% 0; }
        .sc-hd { display:grid; gap:8px; padding:14px 0 10px; }
        .sc-code { font-size:14px; letter-spacing:.18em; color:var(--sage); }
        .sc-gt { font:900 20px/1.12 var(--sans); letter-spacing:-.01em; text-transform:uppercase; color:var(--ink); }
        .sc-list { list-style:none; margin:0; padding:0; }
        .sc-it { display:grid; grid-template-columns:34px 1fr; align-items:baseline; padding:7px 0;
          border-top:1px dashed rgba(13, 13, 13,.28); }
        .sc-n { font-size:13px; letter-spacing:.1em; color:#6a6565; }
        .sc-t { font:400 19px/1.25 var(--sans); color:#2a2727; }
        .sc-stat { display:grid; gap:8px; padding-top:30px; border-top:2px solid var(--ink); margin-top:14px; }
        .sc-sl { font-size:14px; letter-spacing:.18em; color:#6a6565; }
        .sc-big { font:900 170px/.9 var(--sans); letter-spacing:-.04em; color:var(--ink); }
        .sc-rule { position:absolute; left:${SM}px; top:${TOP - 14}px; width:${W - 2 * SM}px; height:2px; background:var(--ink); transform-origin:0 50%; }`,
    html: `
      <div class="abs" style="left:${SM + 4}px;top:64px">${mask(`<span class="eyebrow">Scope</span>`)}</div>
      <div class="abs mono sc-sheet" style="right:${SM}px;top:66px;font-size:16px;color:#6a6565">Sheet A-601 · Rev 03</div>
      ${mask(headline(), "big sc-head", `position:absolute;left:${SM - 2}px;top:100px;font-size:132px;white-space:nowrap;color:var(--ink)`)}
      <i class="sc-rule"></i>
      ${cols}`,
    anim(root, tl) {
      tl.from(q(root, ".sc-grid"), { opacity: 0, duration: 0.8, ease: "power2.out" }, 0);
      tl.from(q(root, ".eyebrow"), { opacity: 0, x: -30, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(q(root, ".sc-sheet"), { opacity: 0, duration: 0.6 }, 0.2);
      tl.from(q(root, ".sc-head > span"), { yPercent: 115, duration: 0.85, ease: "power4.out" }, 0.1);
      tl.from(q(root, ".sc-rule"), { scaleX: 0, duration: 0.8, ease: "power3.inOut" }, 0.3);
      tl.from(qa(root, ".sc-vr"), { scaleY: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.08 }, 0.45);
      qa(root, ".sc-col").forEach((col, i) => {
        const at = 0.55 + i * 0.14;
        tl.from(qa(col, ".sc-hd"), { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, at);
        tl.from(qa(col, ".sc-it"), { opacity: 0, y: 14, duration: 0.4, ease: "power3.out", stagger: 0.04 }, at + 0.15);
        tl.from(qa(col, ".sc-stat"), { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, at + 0.5);
      });
    },
  };
}

/* ------------------------------------------------------------------ scene */
function scopeScene(C) {
  const groups = (C.scopes || []).filter((g) => g && g.group);
  const total = groups.reduce((n, g) => n + (g.items || []).length, 0);
  const L = STAGE.square ? square(groups, total) : PORTRAIT ? portrait(groups, total) : landscape(groups, total);
  return {
    slug: "scope-rest", name: "Scope", act: ACT, field: "bone", dur: 4.0,
    stars: false, ammo: 3, turn: null, rest: "scroll to continue", restAt: PORTRAIT ? 2.7 : 2.4, model: false,
    html: `
      <style>
        ${GRID_CSS}
        ${L.css}
      </style>
      <div class="sc-grid"></div>
      ${L.html}`,
    anim(root, tl) { L.anim(root, tl); },
  };
}

export function scenes(C, P) {
  return [scopeScene(C)];
}
