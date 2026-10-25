// Scenes 13-21: the Toolkit. House scenes: toolkit, exploded, six layer push-ins, built rest.
// No static import of house.js (it pulls in three.js); framing uses its geometry copied below and labels are
// pinned with env.model.project() at runtime. Landscape (1920x1080) and portrait (1080x1920) share one builder;
// the layout table `L` holds everything that differs.
import { esc, pad, q, qa, STAGE } from "./util.js";

const IN = "power3.out", OUT = "power3.in";
const ORDER = ["roof", "walls", "windows", "door", "slab", "foundation"]; // layer-scene order (top -> bottom)
const CAM_Z = 14;
const PT = STAGE.portrait;

// EXPLODED (ex = 1) part centres [x, y, z] in model units at s = 1, as house.js computes them for project():
// anchorCentre(part, 1) + EXPLODE[part] (front: +z toward camera). Used only to aim the push-in poses.
const EXPLODED = {
  roof: [-0.475, 3.585, 0.1],
  walls: [-0.1, 0.525, 0.1],
  windows: [-0.025, 0.44, 2.965],
  door: [1.775, -0.985, 3.665],
  slab: [0, -2.425, 0],
  foundation: [0, -3.2, 0.25],
};

// ---------- layout tables ----------
// Push-in framings: sx/sy = where the exploded part centre lands (stage units from the frame centre).
// Landscape `side` "R": part right, copy left; "L": the reverse. ry > 0 swings +z (windows/door) right.
// Portrait `copy` "top": copy column on top, part below (the rest of the stack runs off the bottom);
// "bot": part on top (the stack runs off the top), copy below. Checked against house.js boxes so the model
// never reaches the copy.
const LAND = {
  view: {
    roof: { side: "R", sx: 3.6, sy: 0.9, s: 1.15, rx: 0.42, ry: 0.42 },
    walls: { side: "L", sx: -3.2, sy: 0.05, s: 1.0, rx: 0.12, ry: -0.5 },
    windows: { side: "R", sx: 2.7, sy: 0.0, s: 1.0, rx: 0.1, ry: -0.5 },
    door: { side: "L", sx: -2.2, sy: -0.1, s: 1.9, rx: 0.08, ry: 0.45 },
    slab: { side: "R", sx: 3.0, sy: -1.0, s: 1.05, rx: 0.38, ry: 0.5 },
    foundation: { side: "L", sx: -3.3, sy: -0.55, s: 1.05, rx: 0.36, ry: -0.55 },
  },
  col: (v) => (v.side === "R" ? { x: 110, w: 640, top: null } : { x: 1110, w: 700, top: null }),
  titleMax: 128,
  toolkitPose: { px: 2.85, py: 1.0, pz: 0, s: 0.74, rx: 0.32, ry: -0.62, rz: 0, ex: 0 },
  explodedPose: { px: 0.25, py: 0.15, pz: 0, s: 0.66, rx: 0.2, ry: -0.5, rz: 0, ex: 1 },
  builtPose: { px: 0.55, py: 0.95, pz: 0, s: 0.72, rx: 0.32, ry: -0.62, rz: 0, ex: 0 },
  flood: [1370, 420],
};
const PORT = {
  view: {
    roof: { copy: "top", sx: 0.05, sy: -1.2, s: 0.55, rx: 0.42, ry: 0.42 },
    walls: { copy: "top", sx: 0.1, sy: -1.85, s: 0.52, rx: 0.12, ry: -0.5 },
    windows: { copy: "top", sx: 0.1, sy: -2.0, s: 0.52, rx: 0.1, ry: -0.5 },
    door: { copy: "bot", sx: 0.4, sy: 1.8, s: 0.64, rx: 0.08, ry: 0.45 },
    slab: { copy: "bot", sx: 0, sy: 1.05, s: 0.54, rx: 0.38, ry: 0.5 },
    foundation: { copy: "bot", sx: 0, sy: 0.9, s: 0.58, rx: 0.36, ry: -0.55 },
  },
  col: (v) => ({ x: 90, w: 900, top: v.copy === "top" ? 150 : 1010 }),
  titleMax: 140,
  toolkitPose: { px: 0.05, py: 1.45, pz: 0, s: 0.46, rx: 0.32, ry: -0.62, rz: 0, ex: 0 },
  explodedPose: { px: 0.1, py: 0.55, pz: 0, s: 0.4, rx: 0.2, ry: -0.5, rz: 0, ex: 1 },
  builtPose: { px: 0.05, py: 1.45, pz: 0, s: 0.46, rx: 0.32, ry: -0.62, rz: 0, ex: 0 },
  flood: [540, 600],
};
const L = PT ? PORT : LAND;

// exploded callouts. Landscape: two columns beside the model, y follows the part (spread apart).
// Portrait: two short fixed columns below the model; only the leaders follow the parts.
const TAG_SIDE = { roof: "r", walls: "r", slab: "r", windows: "l", door: "l", foundation: "l" };
const TAG = PT
  ? { l: 470, r: 610, half: 22, slots: { windows: 1320, door: 1460, foundation: 1600, roof: 1320, walls: 1460, slab: 1600 } }
  : { l: 470, r: 1490, half: 16, gap: 62, top: 330, bot: 990 };

const CSS_LAND = `
.tk-col{position:absolute;top:540px;transform:translateY(-50%);display:flex;flex-direction:column;align-items:flex-start}
.tk-col .eyebrow{margin-bottom:30px}
.tk-nm{font-size:96px;white-space:nowrap}
.tk-sk{margin:34px 0 0;padding:0;list-style:none;display:grid;grid-auto-rows:46px}
.tk-sk li{display:flex;align-items:center;font:700 22px/1 var(--mono);letter-spacing:.12em;
  text-transform:uppercase;color:var(--bone);white-space:nowrap}
.tk-meta{margin-top:30px;font-size:14px;color:var(--ash)}
.scene .tk-tag{font:700 18px/1 var(--mono);letter-spacing:.18em}
.scene .tk-tag b{padding:8px 10px;margin-right:12px}
.scene .tk-tag small{margin-top:8px;font:600 13px/1 var(--mono);letter-spacing:.2em}
.scene .tk-chip{width:250px;height:52px;padding:0 18px;font:700 16px/1 var(--mono);letter-spacing:.18em}`;
const CSS_PORT = `
.tk-col{position:absolute;display:flex;flex-direction:column;align-items:flex-start}
.tk-col .eyebrow{margin-bottom:24px}
.tk-eb,.tk-a-eb,.tk-x-eb,.tk-b-eb{font-size:28px;letter-spacing:.2em}
.tk-nm{font-size:128px;white-space:nowrap}
.tk-sk{margin:30px 0 0;padding:0;list-style:none;display:grid;grid-auto-rows:52px}
.tk-sk li{display:flex;align-items:center;font:700 30px/1 var(--mono);letter-spacing:.1em;
  text-transform:uppercase;color:var(--bone);white-space:nowrap}
.tk-meta{margin-top:28px;font-size:28px;letter-spacing:.16em;color:var(--ash)}
.scene .tk-tag{font:700 28px/1 var(--mono);letter-spacing:.14em}
.scene .tk-tag b{padding:8px 12px;margin-right:14px}
.scene .tk-tag small{margin-top:10px;font:600 26px/1 var(--mono);letter-spacing:.12em}
.scene .tk-chip{width:435px;height:88px;padding:0 26px;font:700 28px/1 var(--mono);letter-spacing:.14em}`;
const CSS = `<style>${PT ? CSS_PORT : CSS_LAND}
.tk-gp{white-space:nowrap}
.tk-sk li.p{color:var(--orange);text-shadow:0 0 14px rgba(255,95,0,.45)}
.tk-lead{position:absolute;left:0;top:0;width:${STAGE.w}px;height:${STAGE.h}px;overflow:visible;z-index:19}
.tk-lead polyline{fill:none;stroke:var(--ink);stroke-width:2}
.tk-lead circle{fill:var(--orange)}
.scene .tk-tag{position:absolute;left:0;top:0;z-index:20;text-transform:uppercase;color:var(--ink);white-space:nowrap;will-change:transform}
.scene .tk-tag b{display:inline-block;background:var(--ink);color:var(--bone)}
.scene .tk-tag small{display:block;color:#6a6565}
.scene .tk-tag.lt{text-align:right}
.scene .tk-chip{position:absolute;display:flex;align-items:center;justify-content:space-between;
  border:2px solid rgba(237,237,237,.55);background:rgba(5,5,5,.72);color:var(--bone);text-transform:uppercase}
.scene .tk-chip span:first-child{color:var(--orange);transition:color .2s}
.scene .tk-chip.on span:first-child{color:var(--bone)}
.tk-rule{position:absolute;height:16px;border-left:2px solid currentColor;border-right:2px solid currentColor;
  background:linear-gradient(currentColor,currentColor) center/100% 2px no-repeat}
</style>`;

// ---------- framing math ----------
// rotate v by Euler XYZ (three.js default: R = Rx * Ry * Rz, rz assumed 0)
function rotate([x, y, z], rx, ry) {
  const x1 = x * Math.cos(ry) + z * Math.sin(ry);
  const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
  const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
  return [x1, y2, z2];
}
// pose that lands the exploded part centre at screen (sx, sy) stage units, perspective-corrected
function framePart(name, v) {
  const [x, y, z] = rotate(EXPLODED[name], v.rx, v.ry);
  const k = (CAM_Z - v.s * z) / CAM_Z; // world offset per screen unit at that depth
  return { px: v.sx * k - v.s * x, py: v.sy * k - v.s * y, pz: 0, s: v.s, rx: v.rx, ry: v.ry, rz: 0, ex: 1 };
}

const rise = (tl, el, at, dur = 0.6) => tl.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: dur, ease: "power4.out" }, at);
const drop = (tl, el, at, dur = 0.3) =>
  tl.fromTo(el, { yPercent: 0 }, { yPercent: -110, duration: dur, ease: OUT, immediateRender: false }, at);
const fadeIn = (tl, el, at, dur = 0.4, from = { x: -24 }) =>
  tl.fromTo(el, { opacity: 0, ...from }, { opacity: 1, x: 0, y: 0, duration: dur, ease: IN }, at);
const fadeOut = (tl, el, at, dur = 0.25) =>
  tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: dur, immediateRender: false }, at);

// split a group title into at most two balanced lines and size it to the column width
function titleLines(text, width) {
  const words = text.split(" ");
  let lines = [text];
  if (text.length > 10 && words.length > 1) {
    let best = null;
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
      const m = Math.max(a.length, b.length);
      if (!best || m < best.m) best = { m, l: [a, b] };
    }
    lines = best.l;
  }
  const longest = Math.max(...lines.map((l) => l.length));
  const fs = Math.max(60, Math.min(L.titleMax, Math.floor(width / (longest * 0.7))));
  return { lines, fs };
}

function skillRows(C, part) {
  const s = C.skills[part];
  return s.items.map((t, i) => `<li class="${s.primary.includes(i) ? "p" : ""}"><span>${esc(t)}</span></li>`).join("");
}

// ---------- 15-20 layer push-ins ----------
function layerScene(C, P, part, idx) {
  const s = C.skills[part], v = L.view[part], col = L.col(v), dur = 2.5;
  const { lines, fs } = titleLines(s.group, col.w);
  const pos = `left:${col.x}px;width:${col.w}px${col.top == null ? "" : `;top:${col.top}px`}`;
  const sec = String.fromCharCode(65 + idx);
  const html = `${CSS}
    <div class="tk-col" style="${pos}">
      <div class="eyebrow tk-eb">Layer ${pad(idx + 1)} / ${pad(ORDER.length)}</div>
      <div class="mask"><span class="big ol tk-nm">${esc(s.part)}</span></div>
      ${lines.map((l) => `<div class="mask"><span class="big tk-gp" style="font-size:${fs}px">${esc(l)}</span></div>`).join("")}
      <ul class="tk-sk">${skillRows(C, part)}</ul>
      <div class="mono tk-meta">Sheet T-${pad(idx + 1, 3)} · Section ${sec}-${sec}</div>
    </div>`;
  const drift = PT ? Math.sign(v.ry) * 0.06 : v.side === "R" ? 0.06 : -0.06;
  return {
    slug: `layer-${part}`, name: `${s.part} · ${s.group}`, act: "04 · Toolkit", field: "ink", dur,
    stars: true, ammo: [2, 2, 2, 3, 3, 3][idx], turn: null, rest: null, restAt: null, model: true, html,
    anim(root, tl) {
      root.classList.add("starry");
      P.pose(tl, 0, 0.95, framePart(part, v), "power3.inOut");
      P.pose(tl, 0.95, dur - 0.95, { ry: v.ry + drift }, "sine.inOut");
      const eb = q(root, ".tk-eb"), nm = q(root, ".tk-nm"), gps = qa(root, ".tk-gp"), lis = qa(root, ".tk-sk li");
      const meta = q(root, ".tk-meta");
      fadeIn(tl, eb, 0.2);
      rise(tl, nm, 0.3, 0.6);
      gps.forEach((g, i) => rise(tl, g, 0.42 + i * 0.08, 0.6));
      tl.fromTo(lis, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.35, ease: IN, stagger: 0.07 }, 0.75);
      fadeIn(tl, meta, 1.1, 0.4, { y: 10 });
      // exit
      fadeOut(tl, eb, dur - 0.3);
      drop(tl, nm, dur - 0.35);
      gps.forEach((g) => drop(tl, g, dur - 0.3));
      fadeOut(tl, lis, dur - 0.3);
      fadeOut(tl, meta, dur - 0.3);
    },
    tick(root, st, env) {
      env?.model?.highlight?.(part);
    },
  };
}

// ---------- 14 exploded: callout placement ----------
function spread(items) {
  // landscape: keep labels on one side at least TAG.gap apart, inside [TAG.top, TAG.bot]
  items.sort((a, b) => a.y - b.y);
  for (let i = 0; i < items.length; i++) {
    const min = i ? items[i - 1].ly + TAG.gap : TAG.top;
    items[i].ly = Math.max(items[i].y, min);
  }
  for (let i = items.length - 1; i >= 0; i--) {
    const max = i < items.length - 1 ? items[i + 1].ly - TAG.gap : TAG.bot;
    items[i].ly = Math.min(items[i].ly, max);
  }
}
const f1 = (n) => n.toFixed(1);
function placeTag(t) {
  const left = t.side === "l";
  // left labels are right-aligned to TAG.l via translateX(-100%), so no layout read is needed
  const tf = `translate(${f1(left ? TAG.l : TAG.r)}px,${f1(t.ly - TAG.half)}px)${left ? " translateX(-100%)" : ""}`;
  if (tf !== t.tf) { t.el.style.transform = tf; t.tf = tf; }
  const ax = left ? TAG.l + 14 : TAG.r - 14, elbow = left ? ax + 30 : ax - 30;
  const pts = `${f1(ax)},${f1(t.ly)} ${f1(elbow)},${f1(t.ly)} ${f1(t.x)},${f1(t.y)}`;
  if (pts !== t.pts) {
    t.line.setAttribute("points", pts);
    t.dot.setAttribute("cx", f1(t.x)); t.dot.setAttribute("cy", f1(t.y));
    t.pts = pts;
  }
}

export function scenes(C, P) {
  const total = ORDER.reduce((n, k) => n + C.skills[k].items.length, 0);
  const W = STAGE.w, H = STAGE.h;

  // ---- 13 toolkit ----
  // flood: a full-stage bone plane revealed by a growing clip-path circle centred on the house
  const FL = L.flood;
  const FR = Math.ceil(Math.max(Math.hypot(FL[0], FL[1]), Math.hypot(W - FL[0], FL[1]), Math.hypot(FL[0], H - FL[1]), Math.hypot(W - FL[0], H - FL[1]))) + 4;
  const clip = (r) => `circle(${r}px at ${FL[0]}px ${FL[1]}px)`;
  const tkHtml = PT
    ? `<div class="eyebrow abs tk-a-eb" style="z-index:2;left:90px;top:160px">The toolkit</div>
      <div class="mask abs" style="z-index:2;left:86px;top:1040px"><h1 class="mega tk-a-title" style="color:var(--bone);font-size:170px"><span>TOOLKIT.</span></h1></div>
      <div class="abs mono tk-a-sub" style="z-index:2;left:90px;top:1260px;font-size:32px;letter-spacing:.18em;line-height:1.5">
        ${pad(ORDER.length)} layers<br>${pad(total)} skills</div>
      <div class="abs tk-rule tk-a-rule" style="z-index:2;left:90px;top:1400px;width:400px"></div>
      <div class="abs mono tk-a-scale" style="z-index:2;left:90px;top:1446px;font-size:28px;letter-spacing:.16em">Scale 1:100 · Rev 02</div>`
    : `<div class="eyebrow abs tk-a-eb" style="z-index:2;left:110px;top:100px">The toolkit</div>
      <div class="abs mono tk-a-sub" style="z-index:2;left:110px;top:160px;font-size:20px;line-height:1.7">
        ${pad(ORDER.length)} layers<br>${pad(total)} skills</div>
      <div class="abs tk-rule tk-a-rule" style="z-index:2;left:110px;top:255px;width:300px"></div>
      <div class="abs mono tk-a-scale" style="z-index:2;left:110px;top:284px;font-size:13px">Scale 1:100 · Rev 02</div>
      <div class="mask abs" style="z-index:2;left:104px;top:780px"><h1 class="mega tk-a-title" style="color:var(--bone)"><span>TOOLKIT.</span></h1></div>`;
  const toolkit = {
    slug: "toolkit", name: "Toolkit", act: "04 · Toolkit", field: "orange", dur: 2.0, stars: false, ammo: 1,
    turn: [1.75, "bone"], rest: null, restAt: null, model: true,
    html: `${CSS}
      <div class="abs tk-flood" style="inset:0;z-index:1;background:var(--bone);clip-path:${clip(0)}"></div>
      ${tkHtml}`,
    anim(root, tl) {
      P.pose(tl, 0, 0.001, {});
      P.pose(tl, 0.1, 1.6, L.toolkitPose, "power3.out");
      const title = q(root, ".tk-a-title"), span = q(root, ".tk-a-title > span");
      fadeIn(tl, q(root, ".tk-a-eb"), 0.15);
      rise(tl, span, 0.2, 0.7);
      fadeIn(tl, q(root, ".tk-a-sub"), 0.5, 0.45, { y: 14 });
      tl.fromTo(q(root, ".tk-a-rule"), { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: 0.5, ease: IN }, 0.6);
      fadeIn(tl, q(root, ".tk-a-scale"), 0.75, 0.4, { y: 8 });
      // flood: bone circle swells from the house, copy flips to ink once covered
      tl.fromTo(q(root, ".tk-flood"), { clipPath: clip(0) }, { clipPath: clip(FR), duration: 0.25, ease: "power2.in" }, 1.75);
      tl.set(title, { color: "#050505" }, 1.9);
    },
    tick(root, st, env) {
      env?.model?.highlight?.(null);
    },
  };

  // ---- 14 exploded ----
  let tagCache = null;
  const xHead = PT
    ? `<div class="eyebrow ink abs tk-x-eb" style="left:90px;top:160px">Exploded axonometric</div>
      <div class="mask abs" style="left:90px;top:214px"><span class="mid tk-x-l1" style="font-size:80px">Six layers.</span></div>
      <div class="mask abs" style="left:90px;top:300px"><span class="mid ol tk-x-l2" style="font-size:80px">One house.</span></div>
      <div class="abs mono tk-x-meta" style="left:90px;top:1720px;font-size:28px;letter-spacing:.16em;color:#6a6565">Sheet T-100 · Not to scale</div>`
    : `<div class="eyebrow ink abs tk-x-eb" style="left:110px;top:100px">Exploded axonometric</div>
      <div class="mask abs" style="left:110px;top:150px"><span class="mid tk-x-l1" style="font-size:64px">Six layers.</span></div>
      <div class="mask abs" style="left:110px;top:218px"><span class="mid ol tk-x-l2" style="font-size:64px">One house.</span></div>
      <div class="abs mono tk-x-meta" style="right:110px;top:100px;font-size:14px;color:#6a6565;text-align:right">Sheet T-100 · Not to scale</div>`;
  const exploded = {
    slug: "exploded", name: "Exploded", act: "04 · Toolkit", field: "bone", dur: 3.0, stars: false, ammo: 1,
    turn: null, rest: null, restAt: null, model: true,
    html: `${CSS}
      ${xHead}
      <svg class="tk-lead" viewBox="0 0 ${W} ${H}" aria-hidden="true">
        ${ORDER.map((p) => `<g data-part="${p}" style="visibility:hidden"><polyline points=""/><circle r="6" cx="0" cy="0"/></g>`).join("")}
      </svg>
      ${ORDER.map((p, i) => `<div class="tk-tag${TAG_SIDE[p] === "l" ? " lt" : ""}" data-part="${p}" data-side="${TAG_SIDE[p]}" style="visibility:hidden">` +
        `<b>${pad(i + 1)}</b>${esc(C.skills[p].part)}<small>${esc(C.skills[p].group)}</small></div>`).join("")}`,
    anim(root, tl) {
      P.pose(tl, 0, 0.001, {});
      P.pose(tl, 0.05, 1.3, L.explodedPose, "power3.inOut");
      P.pose(tl, 1.4, 1.5, { rx: 0.14, ry: -0.36 }, "sine.inOut");
      fadeIn(tl, q(root, ".tk-x-eb"), 0.1);
      rise(tl, q(root, ".tk-x-l1"), 0.15, 0.6);
      rise(tl, q(root, ".tk-x-l2"), 0.28, 0.6);
      fadeIn(tl, q(root, ".tk-x-meta"), 0.3, 0.4, { y: -8 });
      const tags = qa(root, ".tk-tag"), leads = qa(root, ".tk-lead g");
      tl.fromTo(tags, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: IN, stagger: 0.09 }, 1.1);
      tl.fromTo(leads, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: IN, stagger: 0.09 }, 1.1);
      fadeOut(tl, tags, 2.7);
      fadeOut(tl, leads, 2.7);
      fadeOut(tl, q(root, ".tk-x-eb"), 2.7);
      fadeOut(tl, q(root, ".tk-x-meta"), 2.7);
      drop(tl, q(root, ".tk-x-l1"), 2.65);
      drop(tl, q(root, ".tk-x-l2"), 2.7);
    },
    tick(root, st, env) {
      const m = env && env.model;
      if (!m) return;
      m.highlight?.(null);
      if (!tagCache) {
        tagCache = qa(root, ".tk-tag").map((el) => {
          const g = q(root, `.tk-lead g[data-part="${el.dataset.part}"]`);
          return { el, g, line: g.firstElementChild, dot: g.lastElementChild, part: el.dataset.part, side: el.dataset.side, vis: "hidden" };
        });
      }
      const live = { l: [], r: [] };
      for (const t of tagCache) {
        const pt = m.project ? m.project(t.part) : null;
        const ok = pt && pt[0] > 40 && pt[0] < W - 40 && pt[1] > 40 && pt[1] < H - 40;
        const vis = ok ? "" : "hidden";
        if (t.vis !== vis) { t.el.style.visibility = vis; t.g.style.visibility = vis; t.vis = vis; }
        if (!ok) continue;
        t.x = pt[0]; t.y = pt[1];
        if (PT) t.ly = TAG.slots[t.part];
        live[t.side].push(t);
      }
      if (!PT) { spread(live.l); spread(live.r); }
      for (const t of live.l) placeTag(t);
      for (const t of live.r) placeTag(t);
    },
  };

  // ---- 15-20 layer push-ins ----
  const layers = ORDER.map((p, i) => layerScene(C, P, p, i));

  // ---- 21 built-rest ----
  const chips = ORDER.map((p, i) => {
    const x = PT ? 90 + (i % 2) * 465 : 1310 + (i % 2) * 264;
    const y = PT ? 1330 + Math.floor(i / 2) * 112 : 812 + Math.floor(i / 2) * 60;
    return `<div class="chip tk-chip" role="button" tabindex="0" data-part="${p}" aria-label="${esc(`${C.skills[p].part}: ${C.skills[p].group}`)}" style="left:${x}px;top:${y}px">` +
      `<span>${pad(i + 1)}</span><span>${esc(C.skills[p].part)}</span></div>`;
  }).join("");
  const title = `<span>BUILT<span style="color:var(--orange)">.</span></span>`;
  const bHtml = PT
    ? `<div class="eyebrow abs tk-b-eb" style="left:90px;top:160px">Assembled · ${pad(ORDER.length)} / ${pad(ORDER.length)} layers</div>
      <div class="mask abs" style="left:86px;top:1000px"><h2 class="mega tk-b-title" style="font-size:210px">${title}</h2></div>
      <div class="abs mono tk-b-hint" style="left:90px;top:1252px;font-size:28px;letter-spacing:.14em;color:var(--ash)"><span class="live"></span>Tap or hover a layer to see its skills</div>
      <div class="abs mono tk-b-meta" style="left:90px;top:1720px;font-size:28px;letter-spacing:.16em;color:var(--ash)">Sheet T-200 · Issued for review</div>`
    : `<div class="eyebrow abs tk-b-eb" style="left:110px;top:100px">Assembled · ${pad(ORDER.length)} / ${pad(ORDER.length)} layers</div>
      <div class="abs mono tk-b-meta" style="right:110px;top:100px;font-size:14px;color:var(--ash);text-align:right">Sheet T-200 · Issued for review</div>
      <div class="mask abs" style="left:104px;top:780px"><h2 class="mega tk-b-title" style="font-size:230px">${title}</h2></div>
      <div class="abs mono tk-b-hint" style="left:1310px;top:772px;font-size:16px;color:var(--ash)"><span class="live"></span>Hover a layer to see its skills</div>`;
  const built = {
    slug: "built-rest", name: "Built", act: "04 · Toolkit", field: "ink", dur: 4.0, stars: true, ammo: 3,
    turn: null, rest: "hover a layer to see its skills", restAt: 1.15, model: true,
    html: `${CSS}
      ${bHtml}
      ${chips}`,
    anim(root, tl) {
      root.classList.add("starry");
      P.pose(tl, 0, 1.0, L.builtPose, "power3.inOut");
      P.pose(tl, 1.0, 2.3, { rx: 0.28, ry: -0.44 }, "sine.inOut");
      P.pose(tl, 3.3, 0.65, { px: 16, ry: -0.2 }, OUT);
      const span = q(root, ".tk-b-title > span"), cs = qa(root, ".chip");
      fadeIn(tl, q(root, ".tk-b-eb"), 0.3);
      fadeIn(tl, q(root, ".tk-b-meta"), 0.35, 0.4, { y: -8 });
      rise(tl, span, 0.35, 0.7);
      tl.fromTo(cs, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: IN, stagger: 0.07 }, 0.6);
      tl.fromTo(q(root, ".tk-b-hint"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: IN }, 0.9);
      // exit with the house
      drop(tl, span, 3.35, 0.35);
      fadeOut(tl, cs, 3.4, 0.3);
      fadeOut(tl, q(root, ".tk-b-hint"), 3.35);
      fadeOut(tl, q(root, ".tk-b-eb"), 3.4);
      fadeOut(tl, q(root, ".tk-b-meta"), 3.4);
    },
    tick(root, st, env) {
      // clear the last push-in's glow on arrival; after that hover highlighting belongs to main.js
      if (st < 0.5) env?.model?.highlight?.(null);
    },
  };

  return [toolkit, exploded, ...layers, built];
}
