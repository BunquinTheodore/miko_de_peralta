// Scenes 01-05: plan-scan, take-off-complete, collapse-to-the-dot, name, word-burst.
// Each scene is built once for the current layout (STAGE.portrait); positions come from small layout tables.
import { pad, q, qa, esc, STAGE } from "./util.js";

// Scrub-safe counter and decode. They write through a setter (not onUpdate), so they also render when the engine
// re-renders a timeline with events suppressed (scene entry resets the playhead to 0).
const driver = (fn, v0) => { let cur = v0; return { get v() { return cur; }, set v(x) { cur = x; fn(x); } }; };
function count(tl, fn, from, to, at, dur, ease = "none") {
  tl.fromTo(driver(fn, from), { v: from }, { v: to, duration: dur, ease, immediateRender: false }, at);
}
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&/<>+=";
function decode(tl, el, text, at = 0, dur = 0.6) {
  const n = text.length;
  count(tl, (p) => {
    const step = Math.floor(p * 24);
    let out = "";
    for (let i = 0; i < n; i++) out += text[i] === " " || p >= (i + 1) / n ? text[i] : GLYPHS[Math.floor(hash(i * 7 + step) * GLYPHS.length)];
    el.textContent = out;
  }, 0, 1, at, dur);
}

const PORTRAIT = STAGE.portrait;
const GLOW = (a) => `rgba(255,95,0,${a})`;
const MONO_FS = PORTRAIT ? 28 : 20;      // side labels
const MONO_LS = PORTRAIT ? ".2em" : ".22em";
const EYE = PORTRAIT ? "font-size:28px;letter-spacing:.2em;" : "";

// ---------- 01 floor-plan scan ----------
// Plan coordinates live in a viewBox of -40 -40 800 700; the drawing itself spans 60..660 x 60..580.
const VB = { x: -40, y: -40, w: 800, h: 700 };
const PS = PORTRAIT ? {
  plan: { left: 130, top: 420, w: 820, h: 718 },
  rails: { left: 98, right: 956, top: 480, h: 598 },
  eye: "left:90px;top:170px", l1: "left:90px;top:220px", r1: "right:90px;top:170px;text-align:right",
  num: "left:90px;top:1310px", numFs: 220, pctFs: 88, capTop: -62, capFs: 28,
  r2: "left:90px;top:1540px;text-align:left", stSide: "left",
  roomFs: 26, dimFs: 24, roomGap: 30,
} : {
  plan: { left: 600, top: 200, w: 720, h: 630 },
  rails: { left: 520, right: 1374, top: 200, h: 630 },
  eye: "left:130px;top:128px", l1: "left:130px;top:186px", r1: "right:130px;top:128px;text-align:right",
  num: "left:130px;top:770px", numFs: 150, pctFs: 60, capTop: -42, capFs: 18,
  r2: "right:130px;top:700px;text-align:right", stSide: "right",
  roomFs: 17, dimFs: 13, roomGap: 24,
};
const PLAN = PS.plan;
const WT = 6, WI = 4; // half wall thickness: exterior / interior

const line = (x1, y1, x2, y2) => `M${x1} ${y1}L${x2} ${y2}`;
const path = (d, cls) => `<path class="${cls}" d="${d}" pathLength="1" stroke-dasharray="1"/>`;

// a wall is drawn as its two faces (double line), offset from the centreline
function wall(x1, y1, x2, y2, t = WT) {
  const v = x1 === x2;
  const a = v ? line(x1 - t, y1, x2 - t, y2) : line(x1, y1 - t, x2, y2 - t);
  const b = v ? line(x1 + t, y1, x2 + t, y2) : line(x1, y1 + t, x2, y2 + t);
  return path(a, "pw") + path(b, "pw");
}

// window mark across a wall opening: both faces, the glass line, and the two jambs
function windowMark(x1, y1, x2, y2) {
  const v = x1 === x2;
  const off = (o) => (v ? line(x1 + o, y1, x2 + o, y2) : line(x1, y1 + o, x2, y2 + o));
  const jamb = (x, y) => (v ? line(x - WT, y, x + WT, y) : line(x, y - WT, x, y + WT));
  return [off(-WT), off(0), off(WT), jamb(x1, y1), jamb(x2, y2)].map((d) => path(d, "pn")).join("");
}

// door: leaf from the hinge, then the swing arc back to the far jamb
function door(hx, hy, lx, ly, ex, ey, sweep) {
  const r = Math.hypot(lx - hx, ly - hy);
  return path(line(hx, hy, lx, ly), "pd") + path(`M${lx} ${ly}A${r} ${r} 0 0 ${sweep} ${ex} ${ey}`, "pd");
}

const WALLS = [
  [54, 60, 140, 60], [260, 60, 420, 60], [560, 60, 666, 60],      // north
  [60, 54, 60, 220], [60, 300, 60, 586],                           // west
  [660, 54, 660, 420], [660, 500, 660, 586],                       // east
  [54, 580, 200, 580], [290, 580, 666, 580],                       // south (entry gap)
];
const INNER = [
  [340, 66, 340, 250], [340, 320, 340, 356],
  [66, 360, 150, 360], [220, 360, 540, 360], [610, 360, 654, 360],
  [480, 364, 480, 440], [480, 510, 480, 574],
];
const WINDOWS = [[140, 60, 260, 60], [420, 60, 560, 60], [60, 220, 60, 300], [660, 420, 660, 500]];
const DOORS = [
  [200, 580, 200, 490, 290, 580, 1],   // entry
  [340, 250, 410, 250, 340, 320, 1],
  [220, 360, 220, 290, 150, 360, 0],
  [540, 360, 540, 430, 610, 360, 0],
  [480, 510, 410, 510, 480, 440, 1],
];
const OPENINGS = WINDOWS.length + DOORS.length;
const ROOMS = [["Living", "R-01", 200, 200], ["Kitchen", "R-02", 500, 190], ["Bed 01", "R-03", 300, 440], ["Bath", "R-04", 570, 480]];

// dimension chain: line, extension lines and 45-degree ticks at each stop, values in mm (1 unit = 10 mm)
function dimChain(axis, at, stops, extFrom, extTo, labelOff) {
  let out = "", txt = "";
  const a = stops[0], b = stops[stops.length - 1];
  out += path(axis === "x" ? line(a, at, b, at) : line(at, a, at, b), "pm");
  for (const s of stops) {
    out += path(axis === "x" ? line(s, extFrom, s, extTo) : line(extFrom, s, extTo, s), "pm");
    out += path(axis === "x" ? line(s - 7, at + 7, s + 7, at - 7) : line(at - 7, s + 7, at + 7, s - 7), "pm");
  }
  for (let i = 1; i < stops.length; i++) {
    const m = (stops[i - 1] + stops[i]) / 2, v = String((stops[i] - stops[i - 1]) * 10);
    txt += axis === "x"
      ? `<text class="pt pdim" x="${m}" y="${at + labelOff}">${v}</text>`
      : `<text class="pt pdim" x="${at + labelOff}" y="${m}" transform="rotate(-90 ${at + labelOff} ${m})">${v}</text>`;
  }
  return { out, txt };
}

function planDrawing() {
  const walls = WALLS.map((w) => wall(...w)).join("") + INNER.map((w) => wall(...w, WI)).join("");
  const opens = WINDOWS.map((w) => windowMark(...w)).join("") + DOORS.map((d) => door(...d)).join("");
  const dims = [
    dimChain("x", 20, [60, 340, 660], 12, 46, -9),
    dimChain("y", 20, [60, 360, 580], 12, 46, -9),
    dimChain("x", 620, [60, 200, 290, 480, 660], 594, 628, PORTRAIT ? 30 : 24),
  ];
  // section mark on the east side
  const sr = PORTRAIT ? 24 : 18;
  const sec = path(`M712 ${300 - sr}A${sr} ${sr} 0 1 1 711.9 ${300 - sr}`, "pm") + path(line(712 - sr, 300, 712 + sr, 300), "pm") +
    path(line(712, 236, 712, 300 - sr), "pm");
  const rooms = ROOMS.map(([n, r, x, y]) =>
    `<text class="pt proom" x="${x}" y="${y}">${esc(n)}</text><text class="pt pdim" x="${x}" y="${y + PS.roomGap}">${r}</text>`).join("");
  return {
    walls, opens,
    dims: dims.map((d) => d.out).join("") + sec,
    text: dims.map((d) => d.txt).join("") + rooms +
      `<text class="pt pdim" x="712" y="296">A</text><text class="pt pdim" x="712" y="${PORTRAIT ? 352 : 326}">S-01</text>`,
  };
}

function planHtml() {
  const d = planDrawing();
  const layer = (cls, stroke, fill) =>
    `<g class="${cls}" stroke="${stroke}" fill="${fill}"><g class="lw">${d.walls}</g><g class="lo">${d.opens}</g><g class="lm">${d.dims}</g><g class="lt">${d.text}</g></g>`;
  // glow: a wide, faint duplicate of the walls and openings (cheap; no CSS filter)
  const glow = `<g class="pg" stroke="${GLOW(0.2)}"><g class="lw">${d.walls}</g><g class="lo">${d.opens}</g></g>`;
  const brk = (l, t, bw) => `<i class="ps-br" style="left:${l}px;top:${t}px;border-width:${bw}"></i>`;
  const bx0 = PLAN.left - 40, by0 = PLAN.top - 40, bx1 = PLAN.left + PLAN.w + 40 - 64, by1 = PLAN.top + PLAN.h + 40 - 64;
  const R = PS.rails;
  return `
<style>
  .ps-br { position:absolute; width:64px; height:64px; border:0 solid var(--bone); opacity:.75; }
  .ps-mono { position:absolute; font:600 ${MONO_FS}px/1.5 var(--mono); letter-spacing:${MONO_LS}; text-transform:uppercase; color:var(--ash); white-space:nowrap; }
  .ps-mono b { color:var(--bone); font-weight:700; }
  .ps-ticks { position:absolute; width:26px; height:${R.h}px; top:${R.top}px;
    background:repeating-linear-gradient(to bottom, rgba(237,237,237,.38) 0 2px, transparent 2px 14px); transform-origin:50% 0; }
  .ps-fp path { fill:none; stroke-width:1.3; stroke-linecap:square; }
  .ps-fp path.pw { stroke-width:2.6; }
  .ps-fp .pg path { stroke-width:7; }
  .ps-fp text { stroke:none; font-family:var(--mono); font-weight:600; text-anchor:middle; text-transform:uppercase; }
  .ps-fp .proom { font-size:${PS.roomFs}px; letter-spacing:.2em; }
  .ps-fp .pdim { font-size:${PS.dimFs}px; letter-spacing:.12em; }
  .ps-st { position:absolute; top:0; ${PS.stSide}:0; white-space:nowrap; }
  .ps-scan { left:${PLAN.left}px; right:auto; width:${PLAN.w}px; }
</style>
<div class="eyebrow abs ps-eye" style="${PS.eye};${EYE}">Reading drawings</div>
<div class="ps-mono abs ps-l1" style="${PS.l1}">Sheet <b>A-101</b><br>Ground floor plan<br>Scale <b>1:100</b></div>
<div class="ps-mono abs ps-r1" style="${PS.r1}">Take-off <b>in progress</b><br>Units <b>mm</b><br>Rev <b>02</b></div>

<div class="ps-ticks ps-t" style="left:${R.left}px"></div>
<div class="ps-ticks ps-t" style="left:${R.right}px"></div>
${brk(bx0, by0, "3px 0 0 3px")}${brk(bx1, by0, "3px 3px 0 0")}${brk(bx0, by1, "0 0 3px 3px")}${brk(bx1, by1, "0 3px 3px 0")}

<svg class="abs ps-fp" style="left:${PLAN.left}px;top:${PLAN.top}px;overflow:visible" width="${PLAN.w}" height="${PLAN.h}" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}">
  <defs><clipPath id="psClip"><rect class="ps-clip" x="${VB.x}" y="${VB.y}" width="${VB.w}" height="${VB.h}"/></clipPath></defs>
  ${layer("pb", "rgba(237,237,237,.34)", "rgba(237,237,237,.5)")}
  <g clip-path="url(#psClip)">${glow}${layer("pr", "#ff5f00", "#ff5f00")}</g>
</svg>
<div class="scanline ps-scan" style="top:${PLAN.top}px"></div>

<div class="abs ps-num" style="${PS.num};display:flex;align-items:flex-end;gap:12px">
  <div class="mono" style="position:absolute;left:0;top:${PS.capTop}px;font-size:${PS.capFs}px;letter-spacing:${MONO_LS};color:var(--ash);white-space:nowrap">Measured</div>
  <span class="ps-val" style="font:900 ${PS.numFs}px/.82 var(--sans);letter-spacing:-.05em">00</span>
  <span style="font:900 ${PS.pctFs}px/.9 var(--sans);color:var(--orange)">%</span>
</div>

<div class="ps-mono abs ps-r2" style="${PS.r2};line-height:1.9">
  Walls <b>traced</b><br>
  Openings <b class="ps-open">00</b><br>
  <span style="position:relative;display:inline-block;min-width:${PORTRAIT ? 440 : 330}px;height:${PORTRAIT ? 53 : 38}px">
    <span class="ps-st ps-s1">Status <b style="color:var(--orange)">measuring</b></span>
    <span class="ps-st ps-s2">Status <b style="color:var(--orange)">measured</b></span>
  </span>
</div>`;
}

function planAnim(root, tl) {
  const val = q(root, ".ps-val"), open = q(root, ".ps-open");

  tl.from(qa(root, ".ps-eye, .ps-l1, .ps-r1"), { opacity: 0, x: -24, duration: 0.5, ease: "power3.out", stagger: 0.08 }, 0.05);
  tl.from(qa(root, ".ps-br"), { opacity: 0, scale: 1.4, duration: 0.5, ease: "power3.out", stagger: 0.05 }, 0.05);
  tl.from(qa(root, ".ps-t"), { scaleY: 0, duration: 0.7, ease: "power3.out" }, 0.15);

  // every layer draws in step: walls, then openings, then dimensions; labels fade in last
  for (const g of [".pb", ".pg", ".pr"]) {
    tl.from(qa(root, `${g} .lw path`), { strokeDashoffset: 1, duration: 0.45, ease: "power2.out", stagger: { amount: 0.5 } }, 0.08);
    tl.from(qa(root, `${g} .lo path`), { strokeDashoffset: 1, duration: 0.4, ease: "power2.out", stagger: { amount: 0.45 } }, 0.45);
    if (g === ".pg") continue;
    tl.from(qa(root, `${g} .lm path`), { strokeDashoffset: 1, duration: 0.4, ease: "power2.out", stagger: { amount: 0.5 } }, 0.7);
    tl.from(qa(root, `${g} .lt text`), { opacity: 0, duration: 0.3, ease: "power1.out", stagger: { amount: 0.4 } }, 0.95);
  }

  // scan sweep: the orange reveal clip (a transform on the clip rect) and the scanline travel together
  tl.fromTo(q(root, ".ps-clip"), { scaleY: 0, svgOrigin: `0 ${VB.y}` },
    { scaleY: 1, svgOrigin: `0 ${VB.y}`, duration: 2, ease: "power1.inOut", immediateRender: false }, 0.3);
  tl.set(q(root, ".ps-clip"), { scaleY: 0, svgOrigin: `0 ${VB.y}` }, 0);
  const scan = q(root, ".ps-scan");
  tl.fromTo(scan, { y: 0 }, { y: PLAN.h, duration: 2, ease: "power1.inOut" }, 0.3);
  tl.fromTo(scan, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, 0.3);

  tl.from(q(root, ".ps-num"), { opacity: 0, y: 30, duration: 0.5, ease: "power3.out" }, 0.1);
  count(tl, (v) => { val.textContent = pad(Math.round(v)); }, 0, 97, 0.15, 2.15, "power2.out");
  count(tl, (v) => { val.textContent = v >= 99.5 ? "100" : pad(Math.round(v)); }, 97, 100, 2.3, 0.1);

  tl.from(q(root, ".ps-r2"), { opacity: 0, x: 24, duration: 0.5, ease: "power3.out" }, 0.5);
  count(tl, (v) => { open.textContent = pad(Math.round(v)); }, 0, OPENINGS, 0.5, 1.4, "power1.out");
  tl.fromTo(q(root, ".ps-s2"), { opacity: 0 }, { opacity: 1, duration: 0.01 }, 2.0);
  tl.fromTo(q(root, ".ps-s1"), { opacity: 1 }, { opacity: 0, duration: 0.01, immediateRender: false }, 2.0);
}

// ---------- 02 / 03 shared "TAKE-OFF COMPLETE" block ----------
const TC = PORTRAIT ? {
  cx: 540, cy: 960, br: [[90, 560], [926, 560], [90, 1296], [926, 1296]],
  eyeTop: 640, l1Top: 700, l2Top: 866, fs: 164, bar: [240, 600, 1082], footTop: 1122, footFs: 28,
  stamp: { left: 360, top: 380, w: 360, big: 60, small: 26 }, line: [90, 900],
  capTop: 1060, capFs: 28,
} : {
  cx: 960, cy: 540, br: [[200, 220], [1656, 220], [200, 836], [1656, 836]],
  eyeTop: 262, l1Top: 330, l2Top: 538, fs: 236, bar: [660, 600, 800], footTop: 836, footFs: 18,
  stamp: { left: 1350, top: 140, w: 260, big: 48, small: 14 }, line: [160, 1600],
  capTop: 630, capFs: 18,
};

function completeBlock(p) {
  const bws = ["4px 0 0 4px", "4px 4px 0 0", "0 0 4px 4px", "0 4px 4px 0"];
  const br = TC.br.map(([l, t], i) =>
    `<i class="${p}br" style="position:absolute;left:${l}px;top:${t}px;width:64px;height:64px;border:0 solid var(--orange);border-width:${bws[i]}"></i>`).join("");
  const cw = `position:absolute;left:0;width:${STAGE.w}px;text-align:center`;
  const st = TC.stamp, [bl, bw, bt] = TC.bar;
  return `
<div class="${p}grp" style="position:absolute;inset:0;transform-origin:${TC.cx}px ${TC.cy}px">
  ${br}
  <div class="eyebrow ${p}eye" style="${cw};justify-content:center;top:${TC.eyeTop}px;${EYE}">Quantities measured</div>
  <div class="mega ${p}l1" style="${cw};top:${TC.l1Top}px;font-size:${TC.fs}px">TAKE-OFF</div>
  <div class="mega ${p}l2" style="${cw};top:${TC.l2Top}px;font-size:${TC.fs}px;color:var(--orange)">COMPLETE</div>
  <div class="${p}bar" style="position:absolute;left:${bl}px;width:${bw}px;top:${bt}px;height:4px;background:var(--orange);box-shadow:0 0 18px var(--orange);transform-origin:0 50%"></div>
  <div class="mono ${p}foot" style="${cw};top:${TC.footTop}px;font-size:${TC.footFs}px;letter-spacing:${MONO_LS};color:var(--ash)">Sheet A-101 &nbsp;·&nbsp; quantities checked</div>
  <div class="${p}stamp" style="position:absolute;left:${st.left}px;top:${st.top}px;width:${st.w}px;padding:14px 0 12px;border:4px solid var(--orange);color:var(--orange);text-align:center;transform:rotate(-8deg);box-shadow:0 0 22px ${GLOW(0.35)}, inset 0 0 14px ${GLOW(0.25)}">
    <div style="font:900 ${st.big}px/1 var(--sans);letter-spacing:.02em">CHECKED</div>
    <div class="mono" style="font-size:${st.small}px;letter-spacing:${MONO_LS};margin-top:8px">Qty &nbsp;·&nbsp; A-101</div>
  </div>
  <i class="${p}line" style="position:absolute;left:${TC.line[0]}px;width:${TC.line[1]}px;top:${TC.cy - 1}px;height:3px;background:var(--orange);box-shadow:0 0 22px var(--orange),0 0 50px var(--orange);opacity:0"></i>
</div>`;
}

function completeHtml() {
  return completeBlock("tc-") + `<div class="tc-flash" style="position:absolute;inset:0;background:var(--orange);opacity:0;z-index:9"></div>`;
}

function completeAnim(root, tl) {
  tl.fromTo(q(root, ".tc-flash"), { opacity: 0.5 }, { opacity: 0, duration: 0.35, ease: "power2.out" }, 0);
  tl.from(qa(root, ".tc-br"), { opacity: 0, scale: 1.8, duration: 0.45, ease: "power4.out", transformOrigin: "50% 50%" }, 0);
  const eye = q(root, ".tc-eye"), l1 = q(root, ".tc-l1"), l2 = q(root, ".tc-l2");
  for (const [el, t, at, dur] of [[eye, "QUANTITIES MEASURED", 0.05, 0.45], [l1, "TAKE-OFF", 0.1, 0.45], [l2, "COMPLETE", 0.3, 0.5]]) {
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
    decode(tl, el, t, at, dur);
  }
  tl.from(q(root, ".tc-bar"), { scaleX: 0, duration: 0.6, ease: "power3.out" }, 0.4);
  tl.from(q(root, ".tc-foot"), { opacity: 0, y: 14, duration: 0.4, ease: "power3.out" }, 0.7);
  // the stamp thumps down, with a second short flash
  tl.fromTo(q(root, ".tc-stamp"), { opacity: 0, scale: 2.4, rotation: -8 },
    { opacity: 1, scale: 1, rotation: -8, duration: 0.28, ease: "power4.in" }, 0.5);
  tl.fromTo(q(root, ".tc-flash"), { opacity: 0 }, { opacity: 0.18, duration: 0.04, ease: "none", immediateRender: false }, 0.78);
  tl.fromTo(q(root, ".tc-flash"), { opacity: 0.18 }, { opacity: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, 0.82);
}

// ---------- 03 collapse ----------
function collapseHtml() {
  const { cx, cy } = TC;
  const ring = (cls, c) => `<i class="${cls}" style="position:absolute;left:${cx - 42}px;top:${cy - 42}px;width:84px;height:84px;border-radius:50%;border:2px solid ${c}"></i>`;
  return completeBlock("cd-") + `
${ring("cd-r1", "var(--orange)")}${ring("cd-r2", "var(--bone)")}
<i class="cd-hx" style="position:absolute;left:${cx - 200}px;width:400px;top:${cy - 1}px;height:1px;background:rgba(237,237,237,.45)"></i>
<i class="cd-vx" style="position:absolute;top:${cy - 200}px;height:400px;left:${cx - 1}px;width:1px;background:rgba(237,237,237,.45)"></i>
<i class="cd-dot" style="position:absolute;left:${cx - 12}px;top:${cy - 12}px;width:24px;height:24px;border-radius:50%;background:var(--orange);box-shadow:0 0 27px var(--orange),0 0 70px ${GLOW(0.65)};z-index:12"></i>
<div class="mono cd-cap" style="position:absolute;left:0;width:${STAGE.w}px;text-align:center;top:${TC.capTop}px;font-size:${TC.capFs}px;letter-spacing:${MONO_LS};color:var(--ash)">Datum &nbsp;·&nbsp; &plusmn;0.00</div>`;
}

function collapseAnim(root, tl) {
  const grp = q(root, ".cd-grp");
  // squash to a line, then the line to a point
  tl.fromTo(q(root, ".cd-line"), { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0.3);
  tl.fromTo(grp, { scaleY: 1 }, { scaleY: 0.012, duration: 0.5, ease: "power3.in" }, 0);
  tl.fromTo(grp, { scaleX: 1 }, { scaleX: 0, duration: 0.42, ease: "power3.in", immediateRender: false }, 0.5);
  tl.fromTo(grp, { opacity: 1 }, { opacity: 0, duration: 0.05, immediateRender: false }, 0.9);

  const dot = q(root, ".cd-dot");
  tl.fromTo(dot, { scale: 0 }, { scale: 1.9, duration: 0.14, ease: "power2.out" }, 0.84);
  tl.fromTo(dot, { scale: 1.9 }, { scale: 1, duration: 0.3, ease: "power2.inOut", immediateRender: false }, 0.98);
  tl.fromTo(q(root, ".cd-r1"), { scale: 0.1, opacity: 0.9 }, { scale: 9, opacity: 0, duration: 0.8, ease: "power2.out" }, 0.9);
  tl.fromTo(q(root, ".cd-r2"), { scale: 0.1, opacity: 0.6 }, { scale: 6, opacity: 0, duration: 0.7, ease: "power2.out" }, 1.1);
  tl.from(q(root, ".cd-hx"), { scaleX: 0, duration: 0.5, ease: "power3.out" }, 1.1);
  tl.from(q(root, ".cd-vx"), { scaleY: 0, duration: 0.5, ease: "power3.out" }, 1.1);
  tl.from(q(root, ".cd-cap"), { opacity: 0, y: 12, duration: 0.4, ease: "power3.out" }, 1.25);
}

// ---------- 04 name ----------
const NM = PORTRAIT ? {
  fs: 194, left: 90, width: 900, top: 500, metaTop: 170, ruleTop: 272, dimTop: 1360,
  titleTop: 1080, tagFs: 44,
} : {
  fs: 290, left: 130, width: 1660, top: 196, metaTop: 104, ruleTop: 150, dimTop: 962,
  titleTop: null, tagFs: 34,
};

function nameHtml(C) {
  const p = C.person, L = p.lines || [p.first, p.last];
  const fs = `font-size:${NM.fs}px`;
  const line = (s) => `<div class="mega nm-l" style="${fs};line-height:.84"><span class="mask nm-m"><span>${esc(s)}</span></span></div>`;
  const loc = [C.location?.country && `Based in ${C.location.country}`, C.location?.tzLabel].filter(Boolean).map(esc).join(" &nbsp;·&nbsp; ");
  const title = (style) => `<div class="nm-title" style="${style}">
      <div class="eyebrow" style="${EYE}">${esc(p.title)}</div>
      <p style="margin:26px 0 0;font:600 ${NM.tagFs}px/1.3 var(--sans);max-width:${PORTRAIT ? 900 : 860}px;color:var(--ink)">${esc(p.tagline)}</p>
    </div>`;
  // landscape: the middle line carries the title block; the last line always carries the full stop
  const last = L.length - 1;
  const rows = L.map((s, i) => {
    if (i === last) return `<div class="nm-row">${line(s)}<span class="nm-pw"><i class="nm-dot"></i></span></div>`;
    if (!PORTRAIT && (i === 1 || (L.length < 3 && i === 0))) {
      return `<div class="nm-row" style="align-items:center;gap:76px">${line(s)}${title("margin-top:6px")}</div>`;
    }
    return line(s);
  }).join("");
  const meta = PORTRAIT
    ? `<div class="nm-meta nm-top" style="left:90px;top:${NM.metaTop}px">Portfolio &nbsp;/&nbsp; Sheet A-000<br>${loc}</div>`
    : `<div class="nm-meta nm-top" style="left:130px;top:${NM.metaTop}px">Portfolio &nbsp;/&nbsp; Sheet A-000</div>
<div class="nm-meta nm-top" style="right:130px;top:${NM.metaTop}px;text-align:right">${loc}</div>`;
  return `
<style>
  .nm-meta { position:absolute; font:600 ${MONO_FS}px/1.6 var(--mono); letter-spacing:${MONO_LS}; text-transform:uppercase; color:var(--ink); white-space:nowrap; }
  .nm-row { display:flex; }
  .nm-pw { position:relative; display:inline-block; width:.16em; height:.16em; margin-left:.05em; margin-bottom:.07em; align-self:flex-end; font-size:${NM.fs}px; }
  .nm-dot { position:absolute; inset:0; border-radius:50%; background:var(--ink); }
  .nm-flood { position:absolute; inset:0; background:var(--ink); z-index:30; clip-path:circle(0px at 50% 50%); }
  .nm-dim { position:absolute; left:${NM.left}px; width:${NM.width}px; top:${NM.dimTop}px; height:2px; background:var(--ink); transform-origin:0 50%; }
  .nm-dim::before, .nm-dim::after { content:""; position:absolute; top:-9px; width:2px; height:20px; background:var(--ink); transform:rotate(45deg); }
  .nm-dim::before { left:0; } .nm-dim::after { right:0; }
</style>
${meta}
<i class="nm-rule" style="position:absolute;left:${NM.left}px;width:${NM.width}px;top:${NM.ruleTop}px;height:3px;background:var(--ink);transform-origin:0 50%"></i>

<div class="nm-block" style="position:absolute;left:${NM.left}px;top:${NM.top}px;z-index:5;transform-origin:0 100%">${rows}</div>
${PORTRAIT ? title(`position:absolute;left:${NM.left}px;top:${NM.titleTop}px`) : ""}
<i class="nm-dim"></i>
<div class="nm-flood"></div>`;
}

// centre of the full stop in stage px (offsets ignore transforms, so apply the block's swell by hand)
function periodCentre(root, swell) {
  const blk = q(root, ".nm-block"), pw = q(root, ".nm-pw");
  const px = pw.offsetLeft + pw.offsetWidth / 2, py = pw.offsetTop + pw.offsetHeight / 2, bh = blk.offsetHeight;
  return [blk.offsetLeft + px * swell, blk.offsetTop + bh + (py - bh) * swell];
}

const NM_SWELL = 1.035;

function nameAnim(root, tl) {
  const dot = q(root, ".nm-dot"), flood = q(root, ".nm-flood");
  tl.from(q(root, ".nm-rule"), { scaleX: 0, duration: 0.8, ease: "power4.out" }, 0.1);
  tl.from(qa(root, ".nm-top"), { opacity: 0, y: -14, duration: 0.5, ease: "power3.out", stagger: 0.08 }, 0.15);
  tl.from(qa(root, ".nm-m > span"), { yPercent: 118, duration: 0.8, ease: "power4.out", stagger: 0.14 }, 0.0);
  tl.from(q(root, ".nm-title"), PORTRAIT ? { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" } : { opacity: 0, x: 40, duration: 0.6, ease: "power3.out" }, 0.55);
  tl.from(q(root, ".nm-dim"), { scaleX: 0, duration: 0.7, ease: "power3.out" }, 0.75);
  // full stop pops in, then (after the rest) an ink plane opens from it as a clip-path circle
  tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, 0.9);
  tl.fromTo(q(root, ".nm-block"), { scale: 1 }, { scale: NM_SWELL, duration: 1.0, ease: "sine.inOut", immediateRender: false }, 1.55);
  // the circle is measured when the tween first renders (fonts are loaded by then)
  let c = null;
  const at = (r) => () => {
    c = c || periodCentre(root, NM_SWELL);
    const R = r ? Math.hypot(Math.max(c[0], STAGE.w - c[0]), Math.max(c[1], STAGE.h - c[1])) + 4 : 0;
    return `circle(${R.toFixed(1)}px at ${c[0].toFixed(1)}px ${c[1].toFixed(1)}px)`;
  };
  tl.fromTo(flood, { clipPath: at(0) }, { clipPath: at(1), duration: 0.85, ease: "power3.in", immediateRender: false }, 2.5);
}

// ---------- 05 word burst ----------
const GRID_PAPER = "background-image:linear-gradient(rgba(237,237,237,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(237,237,237,.06) 1px,transparent 1px);background-size:48px 48px;";
const CELL_LOOK = [
  { bg: "#0b0b0b", fg: "var(--bone)", dot: "var(--orange)", extra: "box-shadow:inset 0 0 0 4px var(--orange);" },
  { bg: "var(--orange)", fg: "var(--ink)", dot: "var(--ink)", extra: "" },
  { bg: "var(--bone)", fg: "var(--ink)", dot: "var(--orange)", extra: "" },
  { bg: "var(--ink)", fg: "var(--bone)", dot: "var(--orange)", extra: GRID_PAPER },
];
// landscape: 2x2 quadrants; portrait: four stacked bands. Each cell shrinks toward the stage centre.
const CELL_BOX = PORTRAIT
  ? [0, 1, 2, 3].map((i) => ({ x: 0, y: i * 480, w: 1080, h: 480, org: `50% ${200 - i * 100}%`,
    labTop: i === 0 ? 160 : 60, wordBot: i === 3 ? 150 : 64 }))
  : [[0, 0, "100% 100%"], [960, 0, "0% 100%"], [0, 540, "100% 0%"], [960, 540, "0% 0%"]]
    .map(([x, y, org]) => ({ x, y, w: 960, h: 540, org, labTop: 90, wordBot: 86 }));
const WB = PORTRAIT ? { labFs: 28, ghostFs: 160, ghostTop: 40, fit: 880 } : { labFs: 20, ghostFs: 220, ghostTop: 70, fit: 700 };
const wordSize = (w) => Math.min(172, Math.floor(WB.fit / (w.length * 0.7 + 0.2)));

function burstHtml(C) {
  const words = (C.words || []).slice(0, 4);
  return words.map((w, i) => {
    const c = CELL_LOOK[i], b = CELL_BOX[i];
    return `
<div class="wb-cell" style="position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;overflow:hidden;background:${c.bg};color:${c.fg};--paper:${c.bg};transform-origin:${b.org};${c.extra}">
  <div class="mono" style="position:absolute;left:90px;top:${b.labTop}px;font-size:${WB.labFs}px;letter-spacing:${MONO_LS};opacity:.75">${pad(i + 1)} / ${pad(words.length)}</div>
  <div class="ol" aria-hidden="true" style="position:absolute;right:90px;top:${WB.ghostTop}px;font:900 ${WB.ghostFs}px/.8 var(--sans);letter-spacing:-.05em;opacity:.22">${pad(i + 1)}</div>
  <div class="wb-word" style="position:absolute;left:90px;bottom:${b.wordBot}px;font:900 ${wordSize(w)}px/.9 var(--sans);letter-spacing:-.045em;text-transform:uppercase;white-space:nowrap;transform-origin:0 100%">${esc(w)}<i style="display:inline-block;width:.15em;height:.15em;border-radius:50%;background:${c.dot};margin-left:.05em"></i></div>
</div>`;
  }).join("");
}

function burstAnim(root, tl) {
  const cells = qa(root, ".wb-cell"), words = qa(root, ".wb-word");
  if (!cells.length) return;
  cells.forEach((cell, i) => {
    const at = i * 0.3;
    tl.from(cell, { scale: 0, duration: 0.4, ease: "power3.out" }, at);
    tl.from(words[i], { scale: 1.9, opacity: 0, duration: 0.4, ease: "power4.out" }, at + 0.16);
  });
  // everything pulls back to the centre point, leaving ink
  tl.fromTo(cells, { scale: 1 }, { scale: 0, duration: 0.32, ease: "power3.in", stagger: 0.04, immediateRender: false }, 1.5);
}

// ---------- export ----------
export function scenes(C, P) {
  const base = { stars: false, ammo: 0, turn: null, rest: null, restAt: null, model: false };
  return [
    { ...base, slug: "plan-scan", name: "Plan scan", act: "00 · Boot", field: "ink", dur: 2.4, html: planHtml(), anim: planAnim },
    { ...base, slug: "take-off-complete", name: "Take-off complete", act: "00 · Boot", field: "ink", dur: 1.2, html: completeHtml(), anim: completeAnim },
    { ...base, slug: "collapse-to-the-dot", name: "Collapse to the dot", act: "00 · Boot", field: "ink", dur: 1.8, stars: true, html: collapseHtml(), anim: collapseAnim },
    {
      ...base, slug: "name", name: `${C.person.first} ${C.person.last}`, act: "01 · Hero", field: "orange", dur: 3.4,
      turn: [3.1, "ink"], rest: "scroll", restAt: 1.5, html: nameHtml(C), anim: nameAnim,
    },
    { ...base, slug: "word-burst", name: "Word burst", act: "01 · Hero", field: "quad", dur: 2.0, html: burstHtml(C), anim: burstAnim },
  ];
}
