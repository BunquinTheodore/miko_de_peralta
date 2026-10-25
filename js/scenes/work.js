// Scenes 22-26: services-rest, market-qatar, market-chicago, credentials-rest, blast.
import { pad, q, qa, esc, STAGE } from "./util.js";

const PT = STAGE.portrait;   // the page is built for exactly one layout

const ARROW = (px = 34) =>
  `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true"><path d="M5 19L19 5M8 5h11v11"/></svg>`;

// shared inline styles (all classes prefixed wk-)
const CSS = `<style>
.wk-eb{position:absolute;display:flex;align-items:center;font:700 20px/1 var(--mono);letter-spacing:.34em;text-transform:uppercase;color:var(--sage);white-space:nowrap}
.sage .wk-eb{color:var(--ink)}
.wk-acc{color:var(--sage)} .sage .wk-acc{color:var(--ink)}
.wk-lab{position:absolute;font:700 20px/1 var(--mono);letter-spacing:.3em;text-transform:uppercase;white-space:nowrap}
.wk-live{display:inline-block;width:14px;height:14px;border-radius:50%;background:currentColor;margin-right:14px;vertical-align:1px}

/* services */
.wk-n{display:inline-grid} .wk-n i{grid-area:1/1;font-style:normal}
.wk-rule{position:absolute;height:3px;background:var(--ink);transform-origin:0 50%}
.wk-rule i{position:absolute;top:-9px;width:3px;height:21px;background:var(--ink)}
.wk-card{position:absolute;display:flex;flex-direction:column;justify-content:space-between;padding:28px 30px;border:3px solid var(--ink)}
.wk-card.f-ink{background:var(--ink);color:var(--bone)}
.wk-card.f-bone{background:var(--bone);color:var(--ink)}
.wk-card.f-sage{color:var(--ink);background:var(--sage) repeating-linear-gradient(135deg,rgba(13, 13, 13,.085) 0 2px,transparent 2px 15px);
  box-shadow:inset 0 0 0 9px var(--sage),inset 0 0 0 11px var(--ink)}
.wk-card .wk-top{display:flex;justify-content:space-between;align-items:center;font:700 18px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase}
.wk-card .wk-no{font:900 30px/1 var(--mono);letter-spacing:.02em}
.wk-card .wk-top span:last-child{opacity:.6}
.wk-card .wk-nm{font:900 42px/.95 var(--sans);letter-spacing:-.03em;text-transform:uppercase}
.wk-card .wk-tx{margin-top:12px;font:500 21px/1.35 var(--sans);opacity:.86}

/* markets */
.wk-ghost{position:absolute;font:900 1100px/.8 var(--sans);opacity:.12;white-space:nowrap}
.wk-ttl{position:absolute;margin:0;font:900 170px/.88 var(--sans);letter-spacing:-.045em;text-transform:uppercase;white-space:nowrap}
.wk-pitch{position:absolute;font:600 32px/1.25 var(--sans);letter-spacing:-.01em}
.wk-steps{position:absolute;display:flex;gap:40px}
.wk-step{display:flex;align-items:center;gap:16px;font:900 48px/1 var(--sans);letter-spacing:-.03em;text-transform:uppercase;white-space:nowrap}
.wk-step svg{width:44px;height:44px;flex:none}
.wk-stack{position:absolute;font:700 22px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
.wk-links{position:absolute;display:flex;gap:58px}
.wk-links a{display:inline-flex;align-items:center;gap:14px;transition:color .2s}
.wk-links a:hover{color:var(--sage)}

/* drawing sheet */
.wk-sw{position:absolute;width:700px;height:820px;transform-origin:0 0}
.wk-sheet{position:absolute;left:0;top:0;width:700px;height:820px;border:3px solid currentColor;background:var(--paper)}
.bone .wk-sheet{--paper:#f7f6f2;box-shadow:18px 18px 0 rgba(13, 13, 13,.1)}
.ink .wk-sheet{--paper:#0d0d0d;box-shadow:0 40px 90px rgba(85, 115, 115,.12)}
.wk-sheet svg.wk-plan{position:absolute;left:0;top:0;width:694px;height:595px;overflow:visible}
.wk-plan text{font-family:var(--mono);font-weight:700;letter-spacing:.12em;fill:currentColor}
.wk-plan .wk-or{stroke:var(--sage)} .wk-plan text.wk-or{fill:var(--sage);stroke:none}
.wk-tb{position:absolute;left:18px;right:18px;bottom:18px;height:186px;border:2px solid currentColor;display:grid;
  grid-template-columns:2fr 2fr 1fr 1fr;grid-template-rows:1fr 1fr}
.wk-tb div{padding:12px 14px;border-left:2px solid currentColor;border-top:2px solid currentColor;display:flex;flex-direction:column;gap:8px;min-width:0}
.wk-tb div:nth-child(4n+1){border-left:0} .wk-tb div:nth-child(-n+4){border-top:0}
.wk-tb small{font:700 11px/1 var(--mono);letter-spacing:.24em;text-transform:uppercase;opacity:.55}
.wk-tb b{font:700 16px/1.25 var(--mono);letter-spacing:.08em;text-transform:uppercase}
.wk-tb div:first-child b{color:var(--sage)}
.wk-stamp{position:absolute;top:462px;padding:10px 16px;border:4px solid var(--sage);color:var(--sage);
  font:900 22px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;background:var(--paper)}

/* badge star */
.wk-badge{position:absolute;color:var(--ink);z-index:3}
.wk-badge svg{position:absolute;inset:0;width:100%;height:100%;fill:var(--sage)}
.wk-badge .wk-bt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.wk-badge b{font:900 72px/.9 var(--sans);letter-spacing:-.04em;text-transform:uppercase}
.wk-badge small{margin-top:8px;max-width:150px;font:700 16px/1.2 var(--mono);letter-spacing:.14em;text-transform:uppercase}

/* credentials */
.wk-cert{transition:border-color .2s,box-shadow .2s,background-color .2s}
a.wk-cert:hover,a.wk-cert:focus-visible{border-color:var(--sage);background:#272401;box-shadow:0 0 0 2px var(--sage),0 24px 60px rgba(85, 115, 115,.28)}
.wk-cert .wk-ct{display:flex;justify-content:space-between;gap:14px;font:700 17px/1.2 var(--mono);letter-spacing:.18em;text-transform:uppercase;padding-left:10px}
.wk-cert .wk-ct span:first-child{color:var(--sage)}
.wk-cert .wk-ct span:last-child{flex:none;opacity:.6}
.wk-cert .wk-cn{font:900 38px/.98 var(--sans);letter-spacing:-.03em;text-transform:uppercase;padding-left:10px}
.wk-cert .wk-cv{display:flex;align-items:center;gap:10px;margin-top:14px;padding-left:10px;font:700 17px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--sage)}

/* blast */
.wk-blast .wk-eb{color:inherit}
.wk-row{display:grid;grid-template-columns:300px 1fr 70px;align-items:center;height:84px;padding:0 24px;color:inherit;text-decoration:none;
  border-top:2px solid currentColor;transition:background-color .2s,color .2s,padding .25s}
.wk-row:last-child{border-bottom:2px solid currentColor}
a.wk-row:hover,a.wk-row:focus-visible{background:var(--ink);color:var(--bone);padding-left:46px}
.wk-row .wk-rl{font:700 20px/1 var(--mono);letter-spacing:.24em;text-transform:uppercase;opacity:.75}
.wk-row .wk-rv{font:900 44px/1 var(--sans);letter-spacing:-.03em;text-transform:uppercase;white-space:nowrap}
.wk-row svg{justify-self:end;transition:transform .25s,color .2s}
a.wk-row:hover svg,a.wk-row:focus-visible svg{transform:translate(6px,-6px);color:var(--sage)}
.wk-foot a.lnk{border-color:currentColor}
.wk-foot a.lnk:hover{color:var(--bone)}
</style>${PT ? `<style>
.wk-eb,.wk-lab{font-size:28px;letter-spacing:.2em}
.wk-card{padding:22px 28px;justify-content:flex-start;gap:12px}
.wk-card .wk-top{justify-content:flex-start;gap:26px}
.wk-card .wk-top span.wk-nm{opacity:1}
.wk-card .wk-no{font-size:36px}
.wk-card .wk-tx{margin-top:0;font-size:40px;line-height:1.2;opacity:.9}
.wk-pitch{font-size:40px;line-height:1.25}
.wk-stack{font-size:28px;letter-spacing:.14em;line-height:1.4;white-space:normal;width:900px}
.wk-links a{font-size:28px;letter-spacing:.16em}
.wk-badge small{font-size:26px;letter-spacing:.1em;max-width:210px}
.wk-cert{width:420px;height:440px;padding:30px}
.wk-cert .wk-ct{flex-direction:column;gap:12px;font-size:28px;letter-spacing:.14em}
.wk-cert .wk-cn{font-size:46px}
.wk-cert .wk-cv{font-size:28px}
.wk-row{grid-template-columns:1fr 60px;grid-template-rows:auto auto;align-content:center;row-gap:18px;height:150px;padding:0 20px}
.wk-row .wk-rl,.wk-row .wk-rv{grid-column:1}
.wk-row > :last-child{grid-column:2;grid-row:1/3}
.wk-row .wk-rl{font-size:28px;letter-spacing:.2em}
.wk-foot{flex-direction:column;align-items:flex-start!important;gap:30px}
.wk-foot a.lnk{font-size:28px;letter-spacing:.16em}
</style>` : ""}`;

// 22-point seal star as an SVG polygon
function starSvg() {
  const n = 22, pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? 83 : 98, a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true"><polygon points="${pts.join(" ")}"/></svg>`;
}
const badgeHtml = (big, small, left, top, size) =>
  `<div class="wk-badge" style="left:${left}px;top:${top}px;width:${size}px;height:${size}px">${starSvg()}<div class="wk-bt"><b>${esc(big)}</b><small>${esc(small)}</small></div></div>`;

const linkAttrs = (url) => (/^mailto:/.test(url) ? `href="${esc(url)}"` : `href="${esc(url)}" target="_blank" rel="noopener"`);
const maskLine = (inner, cls = "") => `<span class="mask"><span class="${cls}">${inner}</span></span>`;
const fadeIn = (tl, els, at, extra = {}) =>
  tl.from(els, { opacity: 0, duration: 0.5, ease: "power2.out", ...extra }, at);
// draw a pathLength=1 stroke from nothing (scrub-safe)
const draw = (tl, els, at, dur = 0.6, stagger = 0) =>
  tl.fromTo(els, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut", stagger }, at);

/* ---------------- scene 22: services-rest ---------------- */
function services(C) {
  const list = C.services, n = list.length;
  // portrait: one full-width column (two columns would push the 40px copy to 5+ lines)
  const L = PT
    ? { cols: 1, gap: 16, x0: 90, w: 900, y0: 384, yend: 1770, eb: [90, 160], head: [214, 112], rule: 346 }
    : { cols: 3, gap: 36, x0: 100, w: 1720, y0: 380, yend: 980, eb: [100, 96], head: [146, 136], rule: 328 };
  const COLS = L.cols, GAP = L.gap;
  const W = Math.floor((L.w - GAP * (COLS - 1)) / COLS);
  const rows = Math.ceil(n / COLS), H = Math.floor((L.yend - L.y0 - GAP * (rows - 1)) / rows);
  const field = (f) => (["ink", "bone", "sage"].includes(f) ? f : "ink");
  const cards = list.map((s, i) => {
    const l = L.x0 + (i % COLS) * (W + GAP), t = L.y0 + Math.floor(i / COLS) * (H + GAP);
    const body = PT
      ? `<div class="wk-top"><span class="wk-no">${pad(i + 1)}</span><span class="wk-nm">${esc(s.name)}</span></div><div class="wk-tx">${esc(s.text)}</div>`
      : `<div class="wk-top"><span class="wk-no">${pad(i + 1)}</span><span>Service</span></div>
      <div><div class="wk-nm">${esc(s.name)}</div><div class="wk-tx">${esc(s.text)}</div></div>`;
    return `<div class="wk-card f-${field(s.field)}" style="left:${l}px;top:${t}px;width:${W}px;height:${H}px">${body}</div>`;
  }).join("");
  const ticks = Array.from({ length: COLS + 1 }, (_, k) =>
    `<i style="left:${Math.min(L.w - 3, k * (W + GAP) - (k ? GAP / 2 : 0))}px"></i>`).join("");
  return {
    slug: "services-rest", name: "Services", act: "05 · Services", field: "sage", dur: 6.0, stars: false, ammo: 3,
    turn: null, rest: "scroll to continue", restAt: 4.8, model: false,
    html: `${CSS}
      <div class="wk-eb" style="left:${L.eb[0]}px;top:${L.eb[1]}px">05 · Services</div>
      <div class="wk-lab wk-count" style="right:${L.eb[0]}px;top:${L.eb[1] + 4}px"><span class="wk-n">${Array.from({ length: n + 1 }, (_, k) => `<i>${pad(k)}</i>`).join("")}</span> / ${pad(n)}</div>
      <h2 class="big wk-head abs" style="left:${L.x0}px;top:${L.head[0]}px;font-size:${L.head[1]}px;white-space:nowrap">${maskLine(`How I can <span class="ol">help</span>`)}</h2>
      <div class="wk-rule" style="left:${L.x0}px;top:${L.rule}px;width:${L.w}px">${ticks}</div>
      ${cards}`,
    anim(root, tl) {
      const digits = qa(root, ".wk-n i");
      tl.from(q(root, ".wk-eb"), { opacity: 0, x: -40, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(q(root, ".wk-head .mask > span"), { yPercent: 110, duration: 0.9, ease: "expo.out" }, 0.1);
      tl.from(q(root, ".wk-count"), { opacity: 0, x: 30, duration: 0.6, ease: "power3.out" }, 0.4);
      tl.from(q(root, ".wk-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, 0.3);
      fadeIn(tl, qa(root, ".wk-rule i"), 0.9, { scaleY: 0, stagger: 0.08 });
      qa(root, ".wk-card").forEach((c, i) => {
        const up = i % 2 === 0;
        const off = PT ? { x: up ? -160 : 160, rotationX: up ? -60 : 60 } : { y: up ? 170 : -170, rotationY: up ? -75 : 75 };
        tl.from(c, { opacity: 0, ...off, transformPerspective: 1100,
          duration: 0.95, ease: "power3.out" }, 0.5 + i * 0.55);
      });
      // counter as stacked digits switched by tl.set (no onUpdate callbacks, so a reset/re-entry can't leave it stale)
      tl.set(digits, { opacity: 0 }, 0);
      tl.set(digits[0], { opacity: 1 }, 0);
      for (let k = 1; k <= n; k++) {
        const at = 0.5 + (k - 1) * 0.55 + 0.001;
        tl.set(digits[k - 1], { opacity: 0 }, at);
        tl.set(digits[k], { opacity: 1 }, at);
      }
    },
  };
}

/* ---------------- drawing sheet (procedural plan) ---------------- */
const fx = (v) => v.toFixed(1);
const mm = (px) => {
  const v = Math.round((px * 25) / 50) * 50;
  return `${Math.floor(v / 1000)} ${String(v % 1000).padStart(3, "0")}`;
};

function planSvg(i, steps) {
  const m = i % 2 === 1, mx = (x) => (m ? 700 - x : x);
  const P = (pts) => pts.map(([c, x, y]) => `${c}${fx(mx(x))},${fx(y)}`).join(" ");
  const A = (r, sweep, x, y) => `A${r},${r} 0 0 ${m ? 1 - sweep : sweep} ${fx(mx(x))},${fx(y)}`;
  const anchor = m ? "end" : "start";
  const X0 = 110, X1 = 590, Y0 = 110, Y1 = 500, W = X1 - X0, H = Y1 - Y0;
  const a = m ? 0.5 : 0.56;
  const xa = X0 + W * a, yb = Y0 + H * 0.55, yc = Y0 + H * 0.34, yd = Y0 + H * 0.4, hx = X0 + W * 0.3;
  const gid = `wk-g${i}`, hid = `wk-h${i}`;

  const walls = [
    P([["M", hx, Y1], ["L", X0, Y1], ["L", X0, Y0], ["L", X1, Y0], ["L", X1, Y1], ["L", hx + 56, Y1]]),
    P([["M", xa, Y0], ["L", xa, yd], ["M", xa, yd + 52], ["L", xa, Y1]]),
    P([["M", xa + 62, yb], ["L", X1, yb]]),
    P([["M", X0, yc], ["L", xa - 72, yc]]),
  ].map((d) => `<path class="wk-wall" d="${d}" pathLength="1" stroke-dasharray="1" fill="none" stroke="currentColor" stroke-width="7" stroke-linejoin="miter"/>`).join("");

  const doors = [
    `${P([["M", hx, Y1], ["L", hx, Y1 - 56]])} ${A(56, 1, hx + 56, Y1)}`,
    `${P([["M", xa, yd], ["L", xa + 52, yd]])} ${A(52, 1, xa, yd + 52)}`,
    `${P([["M", xa + 62, yb], ["L", xa + 62, yb - 60]])} ${A(60, 0, xa + 2, yb)}`,
  ].map((d) => `<path class="wk-door" d="${d}" fill="none" stroke="currentColor" stroke-width="2" opacity=".75"/>`).join("");

  // windows: cut the wall with paper, then two thin glazing lines
  const winH = [[X0 + 40, X0 + 150], [xa + 40, X1 - 40]], winV = [[X0, Y0 + H * 0.6, Y0 + H * 0.86], [X1, Y0 + 50, yb - 40]];
  let cuts = "", glaze = "";
  for (const [x1, x2] of winH) {
    const l = Math.min(mx(x1), mx(x2));
    cuts += `<rect x="${fx(l)}" y="${Y0 - 5}" width="${x2 - x1}" height="10" style="fill:var(--paper)"/>`;
    glaze += `${P([["M", x1, Y0 - 3.5], ["L", x2, Y0 - 3.5], ["M", x1, Y0 + 3.5], ["L", x2, Y0 + 3.5]])} `;
  }
  for (const [x, y1, y2] of winV) {
    cuts += `<rect x="${fx(mx(x) - 5)}" y="${fx(y1)}" width="10" height="${fx(y2 - y1)}" style="fill:var(--paper)"/>`;
    glaze += `${P([["M", x - 3.5, y1], ["L", x - 3.5, y2], ["M", x + 3.5, y1], ["L", x + 3.5, y2]])} `;
  }

  const treads = Array.from({ length: 9 }, (_, k) => P([["M", X0 + 26, yc + 26 + k * 14], ["L", X0 + 112, yc + 26 + k * 14]])).join(" ");
  const stairs = `<path class="wk-fx" d="${treads} ${P([["M", X0 + 69, yc + 140], ["L", X0 + 69, yc + 30], ["M", X0 + 62, yc + 40], ["L", X0 + 69, yc + 30], ["L", X0 + 76, yc + 40]])}" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".6"/>`;
  const tx1 = Math.min(mx(xa + 34), mx(X1 - 34));
  const terrace = `<rect class="wk-fx wk-or" x="${fx(tx1)}" y="${fx(yb + 34)}" width="${fx(X1 - xa - 68)}" height="${fx(Y1 - yb - 68)}" fill="url(#${hid})" stroke-width="2" stroke-dasharray="8 6"/>`;

  // structural grid lines + bubbles
  const xs = [X0, xa, X1], ys = [Y0, yb, Y1];
  const letters = xs.map(mx).sort((p, r) => p - r);
  let grid = "", bubbles = "";
  xs.forEach((x) => {
    const X = mx(x);
    grid += `M${fx(X)},46 L${fx(X)},${Y1 + 22} `;
    bubbles += `<circle cx="${fx(X)}" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="2"/><text x="${fx(X)}" y="37" font-size="14" text-anchor="middle">${"ABC"[letters.indexOf(X)]}</text>`;
  });
  ys.forEach((y, k) => {
    grid += `${P([["M", 58, y], ["L", X1 + 22, y]])} `;
    bubbles += `<circle cx="${fx(mx(44))}" cy="${fx(y)}" r="14" fill="none" stroke="currentColor" stroke-width="2"/><text x="${fx(mx(44))}" y="${fx(y + 5)}" font-size="14" text-anchor="middle">${k + 1}</text>`;
  });

  // dimension strings (sage)
  const tick = (x, y) => `M${fx(x - 6)},${fx(y + 6)} L${fx(x + 6)},${fx(y - 6)}`;
  const dy = 78, dx = mx(638);
  let dims = `M${fx(mx(X0))},${dy} L${fx(mx(X1))},${dy} M${fx(dx)},${Y0} L${fx(dx)},${Y1} `;
  xs.forEach((x) => { dims += `${tick(mx(x), dy)} `; });
  ys.forEach((y) => { dims += `${tick(dx, y)} `; });
  let dimTxt = "";
  [[X0, xa], [xa, X1]].forEach(([p, r]) => {
    dimTxt += `<text class="wk-or" x="${fx(mx((p + r) / 2))}" y="${dy - 9}" font-size="13" text-anchor="middle">${mm(r - p)}</text>`;
  });
  [[Y0, yb], [yb, Y1]].forEach(([p, r]) => {
    const cy = (p + r) / 2, tx = dx + (m ? -10 : 10);
    dimTxt += `<text class="wk-or" x="${fx(tx)}" y="${fx(cy)}" font-size="13" text-anchor="middle" transform="rotate(${m ? -90 : 90} ${fx(tx)} ${fx(cy)})">${mm(r - p)}</text>`;
  });

  const rooms = [["Kitchen", X0 + 16, Y0 + 28], ["Living", X0 + 16, Y1 - 18], ["Suite", xa + 18, Y0 + 28], ["Terrace", xa + 34, yb + 24]]
    .map(([t, x, y]) => `<text class="wk-room" x="${fx(mx(x))}" y="${fx(y)}" font-size="12" text-anchor="${anchor}" opacity=".6">${t.toUpperCase()}</text>`).join("");

  // callout tags, one per step
  const pts = [[X0 + W * a * 0.5, yc + (Y1 - yc) * 0.62], [xa + (X1 - xa) * 0.5, Y0 + (yb - Y0) * 0.55],
    [X0 + W * a * 0.5, Y0 + (yc - Y0) * 0.5], [xa + (X1 - xa) * 0.5, yb + (Y1 - yb) * 0.5]];
  const tags = steps.slice(0, pts.length).map((_, k) => {
    const [px, py] = pts[k], tX = mx(px + 50), tY = py - 44;
    return `<g class="wk-tag"><path class="wk-ld wk-or" d="M${fx(mx(px))},${fx(py)} L${fx(tX)},${fx(tY)}" pathLength="1" stroke-dasharray="1" stroke-width="2" fill="none"/>
      <circle cx="${fx(mx(px))}" cy="${fx(py)}" r="4" fill="var(--sage)" style="fill:var(--sage)"/>
      <g class="wk-tc"><circle cx="${fx(tX)}" cy="${fx(tY)}" r="16" style="fill:var(--sage)"/><text x="${fx(tX)}" y="${fx(tY + 5)}" font-size="13" text-anchor="middle" style="fill:var(--ink)">${pad(k + 1)}</text></g></g>`;
  }).join("");

  // scale bar + north arrow
  const sb0 = X0, bars = [0, 1, 2, 3].map((k) => {
    const x1 = mx(sb0 + k * 30), x2 = mx(sb0 + (k + 1) * 30);
    return `<rect x="${fx(Math.min(x1, x2))}" y="546" width="30" height="8" ${k % 2 ? 'fill="none"' : 'fill="currentColor"'} stroke="currentColor" stroke-width="1.5"/>`;
  }).join("");
  const scale = `<g class="wk-fx">${bars}<text x="${fx(mx(sb0 + 136))}" y="555" font-size="12" text-anchor="${anchor}">SCALE 1:100</text></g>`;
  const nx = mx(X1 - 10);
  const north = `<g class="wk-fx"><circle cx="${fx(nx)}" cy="556" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M${fx(nx)},540 L${fx(nx + 7)},566 L${fx(nx)},560 L${fx(nx - 7)},566 Z" fill="currentColor"/><text x="${fx(nx)}" y="531" font-size="12" text-anchor="middle">N</text></g>`;

  return `<svg class="wk-plan" viewBox="0 0 700 600" aria-hidden="true">
    <defs><pattern id="${gid}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width="1"/></pattern>
      <pattern id="${hid}" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V12" stroke="var(--sage)" style="stroke:var(--sage)" stroke-width="1.5" opacity=".55"/></pattern></defs>
    <rect class="wk-paper" x="14" y="14" width="672" height="570" fill="url(#${gid})" opacity=".07"/>
    <path class="wk-grid" d="${grid}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="14 5 3 5" opacity=".35"/>
    <g class="wk-bub">${bubbles}</g>
    ${terrace}${stairs}${walls}${cuts}
    <path class="wk-glz" d="${glaze}" fill="none" stroke="currentColor" stroke-width="1.5"/>
    ${doors}${rooms}
    <path class="wk-dim wk-or" d="${dims}" pathLength="1" stroke-dasharray="1" fill="none" stroke-width="2"/>
    <g class="wk-dimt">${dimTxt}</g>
    ${tags}${scale}${north}
  </svg>`;
}

function sheetHtml(C, s, i, left, top, scale = 1) {
  const m = i % 2 === 1;
  const cells = [["Project", "Luxury Residential"], ["Location", s.title.join(" ")], ["Sheet", `A-10${i + 1}`], ["Scale", "1:100"],
    ["Stage", "Pre-construction"], ["Scope", s.steps.join(" · ")], ["Drawn", C.person.initials], ["Rev", "02"]];
  const tb = cells.map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join("");
  // the sheet is an illustration (its title block repeats the scene copy), so it is hidden from assistive tech
  return `<div class="wk-sw" aria-hidden="true" style="left:${left}px;top:${top}px${scale !== 1 ? `;transform:scale(${scale})` : ""}"><div class="wk-sheet">
    ${planSvg(i, s.steps)}
    <div class="wk-stamp" style="${m ? "left" : "right"}:44px">For estimate</div>
    <div class="wk-tb">${tb}</div></div></div>`;
}

/* ---------------- scenes 23/24: market showcases ---------------- */
function tickBox() {
  return `<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="40" height="40" fill="none" stroke="currentColor" stroke-width="3"/>
    <path class="wk-tk" d="M10 23 L19 32 L35 12" pathLength="1" stroke-dasharray="1" fill="none" stroke="var(--sage)" style="stroke:var(--sage)" stroke-width="5" stroke-linecap="square"/></svg>`;
}

function market(C, i) {
  const s = C.showcases[i], n = C.showcases.length;
  const slug = i === 0 ? "market-qatar" : i === 1 ? "market-chicago" : `market-${i + 1}`;
  const name = s.title.join(" ");
  const m = i % 2 === 1;
  // layout table: text column, sheet (+scale), badge on the sheet's outer top corner, ghost
  const L = PT
    ? { tx: 90, top: [160, 220, 560, 700, 745, 830, 950], pw: 900, sx: 232, sy: 1045, ss: 0.88, bx: m ? 90 : 780, by: 1000, gx: -40, gy: 240 }
    : { tx: m ? 920 : 110, top: [110, 196, 540, 664, 706, 810, 880], pw: 880, sx: m ? 110 : 1110, sy: 140, ss: 1, bx: m ? 90 : 1620, by: 90, gx: m ? 640 : 330, gy: 120 };
  const TX = L.tx, [tEb, tTtl, tPitch, tScope, tSteps, tStack, tLink] = L.top, BS = 210;
  const accentOf = (line) => (s.accent && line.replace(/[^\w]/g, "").toLowerCase() === String(s.accent).toLowerCase() ? "wk-acc" : "");
  const titleHtml = s.title.map((l) => maskLine(esc(l), accentOf(l))).join("");
  const steps = s.steps.map((w) => `<span class="wk-step">${tickBox()}<span>${esc(w)}</span></span>`).join("");
  const mail = C.contact.links.find((l) => /^mailto:/.test(l.url || "")) || C.contact.links.find((l) => l.url);
  const link = mail ? `<a ${linkAttrs(mail.url)}>Discuss a project ${ARROW(PT ? 26 : 20)}</a>` : "";
  const badge = s.badge || { big: s.ghost || "", small: "" };
  const field = ["ink", "sage", "bone"].includes(s.field) ? s.field : "ink";
  return {
    slug, name: `Market · ${name}`, act: "06 · Markets", field, dur: 4.0, stars: false, ammo: i === 0 ? 2 : 3,
    turn: null, rest: link ? "discuss a project" : "scroll to continue", restAt: 2.8, model: false,
    html: `${CSS}
      <div class="wk-ghost ol" aria-hidden="true" style="left:${L.gx}px;top:${L.gy}px">${esc(s.ghost || "")}</div>
      <div class="wk-eb" style="left:${TX}px;top:${tEb}px">06 · Markets · ${pad(i + 1)}/${pad(n)}</div>
      <h2 class="wk-ttl" style="left:${TX}px;top:${tTtl}px">${titleHtml}</h2>
      <div class="wk-pitch" style="left:${TX}px;top:${tPitch}px;width:${L.pw}px">${maskLine(esc(s.pitch))}</div>
      <div class="wk-lab dim wk-sl" style="left:${TX}px;top:${tScope}px">Scope</div>
      <div class="wk-steps" style="left:${TX}px;top:${tSteps}px">${steps}</div>
      <div class="wk-stack" style="left:${TX}px;top:${tStack}px"><span class="dim">Tools / </span>${esc(s.stack)}</div>
      <div class="links wk-links" style="left:${TX}px;top:${tLink}px">${link}</div>
      ${sheetHtml(C, s, i, L.sx, L.sy, L.ss)}
      ${badgeHtml(badge.big, badge.small, L.bx, L.by, BS)}`,
    anim(root, tl) {
      const sheet = q(root, ".wk-sheet");
      tl.from(q(root, ".wk-ghost"), { opacity: 0, yPercent: 14, duration: 1.2, ease: "power3.out" }, 0);
      tl.fromTo(q(root, ".wk-ghost"), { scale: 1 }, { scale: 1.07, duration: 4, ease: "none", immediateRender: false }, 0);
      tl.from(q(root, ".wk-eb"), { opacity: 0, x: m && !PT ? 40 : -40, duration: 0.6, ease: "power3.out" }, 0.1);
      tl.from(qa(root, ".wk-ttl .mask > span"), { yPercent: 112, duration: 0.85, ease: "expo.out", stagger: 0.12 }, 0.2);
      tl.fromTo(sheet, { y: 980, rotation: m ? -9 : 9 }, { y: 0, rotation: 0, duration: 1.1, ease: "power3.out" }, 0.15);
      tl.fromTo(sheet, { rotation: 0 }, { rotation: m ? 1.4 : -1.4, duration: 2.7, ease: "none", immediateRender: false }, 1.25);
      fadeIn(tl, q(root, ".wk-paper"), 0.6, { duration: 0.6 });
      fadeIn(tl, [q(root, ".wk-grid"), q(root, ".wk-bub")], 0.75);
      draw(tl, qa(root, ".wk-wall"), 0.8, 0.7, 0.12);
      fadeIn(tl, [q(root, ".wk-glz"), ...qa(root, ".wk-door")], 1.35, { stagger: 0.08 });
      fadeIn(tl, qa(root, ".wk-fx"), 1.4, { stagger: 0.1 });
      fadeIn(tl, qa(root, ".wk-room"), 1.5, { stagger: 0.06 });
      draw(tl, q(root, ".wk-dim"), 1.2, 0.8);
      fadeIn(tl, q(root, ".wk-dimt"), 1.75);
      fadeIn(tl, qa(root, ".wk-tb div"), 1.0, { y: 14, stagger: 0.06, duration: 0.4 });
      tl.fromTo(q(root, ".wk-stamp"), { scale: 2.4, opacity: 0, rotation: -26 },
        { scale: 1, opacity: 1, rotation: -8, duration: 0.35, ease: "back.out(2)" }, 2.35);
      tl.from(q(root, ".wk-badge"), { scale: 0, rotation: -140, duration: 0.8, ease: "back.out(1.7)" }, 0.75);
      tl.fromTo(q(root, ".wk-badge svg"), { rotation: 0 }, { rotation: 300, duration: 4, ease: "none", immediateRender: false }, 0);
      tl.from(q(root, ".wk-pitch .mask > span"), { yPercent: 110, duration: 0.7, ease: "expo.out" }, 0.95);
      fadeIn(tl, q(root, ".wk-sl"), 1.2);
      const tags = qa(root, ".wk-tag");
      qa(root, ".wk-step").forEach((el, k) => {
        const at = 1.3 + k * 0.3;
        tl.from(el, { yPercent: 100, opacity: 0, duration: 0.5, ease: "power3.out" }, at);
        draw(tl, q(el, ".wk-tk"), at + 0.35, 0.35);
        const tg = tags[k];
        if (tg) {
          draw(tl, q(tg, ".wk-ld"), at + 0.35, 0.3);
          tl.from(qa(tg, ":scope > circle, .wk-tc"), { scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)" }, at + 0.45);
        }
      });
      tl.from(q(root, ".wk-stack"), { opacity: 0, x: m && !PT ? 30 : -30, duration: 0.6, ease: "power3.out" }, 1.9);
      tl.from(qa(root, ".wk-links a"), { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, 2.1);
    },
  };
}

/* ---------------- scene 25: credentials-rest ---------------- */
function credentials(C) {
  const certs = C.certs, n = certs.length;
  // portrait: 2x2 grid under the headline; landscape: a fanned row
  const L = PT
    ? { left: [90, 570, 90, 570], top: [690, 720, 1200, 1230], rot: [-2, 1.5, 1.5, -2], cx: 330, eb: [90, 160], head: [210, 130], hint: 386, badge: [720, 356, 270] }
    : { left: [130, 560, 990, 1420], top: [510, 570, 490, 550], rot: [-5, 3, -3, 5], cx: 770, eb: [100, 100], head: [160, 160], hint: 360, badge: [1530, 96, 270] };
  const LEFT = (k) => L.left[k % 4], TOP = L.top, ROT = L.rot;
  const anyLink = certs.some((c) => c.url);
  const cards = certs.slice(0, 4).map((c, k) => {
    const inner = `<div class="wk-ct"><span>${esc(c.issuer)}</span><span>${pad(k + 1)}/${pad(n)}</span></div>
      <div><div class="wk-cn">${esc(c.title)}</div>${c.url ? `<div class="wk-cv">Verify ${ARROW(20)}</div>` : ""}</div>`;
    const style = `style="left:${LEFT(k)}px;top:${TOP[k % 4]}px"`;
    return c.url ? `<a class="cert wk-cert" ${linkAttrs(c.url)} ${style}>${inner}</a>` : `<div class="cert wk-cert" ${style}>${inner}</div>`;
  }).join("");
  return {
    slug: "credentials-rest", name: "Credentials", act: "07 · Credentials", field: "ink", dur: 4.6, stars: true, ammo: 3,
    turn: null, rest: anyLink ? "click a card to verify" : "scroll to continue", restAt: 3.0, model: false,
    html: `${CSS}
      <div class="wk-eb" style="left:${L.eb[0]}px;top:${L.eb[1]}px">07 · Credentials</div>
      <h2 class="big wk-head abs" style="left:${L.eb[0]}px;top:${L.head[0]}px;font-size:${L.head[1]}px;white-space:nowrap">${maskLine(`Credentials<span class="wk-acc">.</span>`)}</h2>
      <div class="wk-lab dim wk-hint" style="left:${L.eb[0]}px;top:${L.hint}px"><span class="wk-live" style="background:var(--sage)"></span>Certifications · Education</div>
      ${badgeHtml(pad(n), "Credentials", ...L.badge)}
      ${cards}`,
    anim(root, tl) {
      tl.from(q(root, ".wk-eb"), { opacity: 0, x: -40, duration: 0.6, ease: "power3.out" }, 0.05);
      tl.from(q(root, ".wk-head .mask > span"), { yPercent: 110, duration: 0.9, ease: "expo.out" }, 0.15);
      fadeIn(tl, q(root, ".wk-hint"), 1.6, { duration: 0.6 });
      tl.from(q(root, ".wk-badge"), { scale: 0, rotation: -140, duration: 0.8, ease: "back.out(1.7)" }, 0.5);
      tl.fromTo(q(root, ".wk-badge svg"), { rotation: 0 }, { rotation: 260, duration: 4.6, ease: "none", immediateRender: false }, 0);
      qa(root, ".wk-cert").forEach((el, k) => {
        tl.fromTo(el, { x: L.cx - LEFT(k), y: 90, rotation: 0, opacity: 0, transformPerspective: 1000 },
          { x: 0, y: 0, rotation: ROT[k % 4], opacity: 1, duration: 1.0, ease: "power3.out" }, 0.6 + k * 0.2);
      });
    },
  };
}

/* ---------------- scene 26: blast ---------------- */
function blast(C) {
  const ct = C.contact;
  const words = String(ct.headline).split(" ");
  const last = words.pop();
  const lead = words.length ? esc(words.join(" ")) : "";
  // portrait: two lines ("LET'S" / "CONNECT") fitted to the 900px column
  const headline = PT
    ? `${lead ? maskLine(lead) : ""}${maskLine(esc(last), "ol")}`
    : maskLine(`${lead ? `${lead} ` : ""}<span class="ol">${esc(last)}</span>`);
  const L = PT
    ? { x: 90, w: 900, eb: 160, mega: [210, 185], pitch: 560, rows: 790, foot: 1560 }
    : { x: 100, w: 1720, eb: 92, mega: [140, 220], pitch: 372, rows: 510, foot: 920 };
  const rows = ct.links.map((l) => {
    const inner = `<span class="wk-rl">${esc(l.label)}</span><span class="wk-rv">${esc(l.value)}</span>`;
    return l.url ? `<a class="wk-row" ${linkAttrs(l.url)}>${inner}${ARROW(PT ? 44 : 34)}</a>` : `<div class="wk-row">${inner}<span></span></div>`;
  }).join("");
  const FX = STAGE.w / 2, FY = STAGE.h / 2, FR = Math.ceil(Math.hypot(FX, FY)) + 4;
  const li = ct.links.find((l) => /linkedin/i.test(`${l.label} ${l.url || ""}`) && l.url);
  return {
    slug: "blast", name: "Contact", act: "08 · Contact", field: "ink", dur: 5.0, stars: false, ammo: 3,
    turn: [0.2, "sage"], rest: null, restAt: null, model: false,
    html: `${CSS}
      <div class="wk-flood" style="position:absolute;inset:0;background:var(--sage-field);z-index:0;clip-path:circle(0px at ${FX}px ${FY}px)"></div>
      <div class="wk-blast wk-wrap" style="position:absolute;inset:0;z-index:2;color:#f2efea">
        <div class="wk-eb" style="left:${L.x}px;top:${L.eb}px"><span class="wk-live"></span>08 · Contact · ${esc(C.location.note)}</div>
        <h2 class="mega wk-mega abs" style="left:${L.x - 6}px;top:${L.mega[0]}px;font-size:${L.mega[1]}px;white-space:nowrap;--paper:var(--sage)">${headline}</h2>
        <p class="wk-pitch wk-cp" style="left:${L.x}px;top:${L.pitch}px;width:${PT ? 900 : 1300}px;margin:0">${maskLine(esc(ct.pitch))}</p>
        <div class="wk-rows abs" style="left:${L.x}px;top:${L.rows}px;width:${L.w}px">${rows}</div>
        <div class="wk-foot wk-lab" style="left:${L.x}px;right:${L.x}px;top:${L.foot}px;display:flex;justify-content:space-between;align-items:center">
          <span>&copy; 2026 ${esc(C.person.first)} ${esc(C.person.last)}</span>
          <span style="opacity:.7">${esc(C.person.title)}</span>
          ${li ? `<a class="lnk" ${linkAttrs(li.url)}>${esc(li.label)} ${ARROW(PT ? 24 : 16)}</a>` : "<span></span>"}
        </div>
      </div>`,
    anim(root, tl) {
      const wrap = q(root, ".wk-wrap");
      // flood: a clip-path circle on a full-stage plane (no giant scaled disc)
      tl.fromTo(q(root, ".wk-flood"), { clipPath: `circle(0px at ${FX}px ${FY}px)` },
        { clipPath: `circle(${FR}px at ${FX}px ${FY}px)`, duration: 0.5, ease: "power3.out" }, 0);
      tl.set(wrap, { color: "#f2efea" }, 0);
      tl.set(wrap, { color: "#0d0d0d" }, 0.2);
      tl.from(q(root, ".wk-eb"), { opacity: 0, x: -40, duration: 0.6, ease: "power3.out" }, 0.45);
      tl.from(qa(root, ".wk-mega .mask > span"), { yPercent: 115, duration: 0.95, ease: "expo.out", stagger: 0.1 }, 0.4);
      tl.from(q(root, ".wk-cp .mask > span"), { yPercent: 110, duration: 0.7, ease: "expo.out" }, 0.75);
      qa(root, ".wk-row").forEach((el, k) =>
        tl.from(el, { opacity: 0, x: -70, duration: 0.6, ease: "power3.out" }, 1.0 + k * 0.12));
      tl.from(q(root, ".wk-foot"), { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, 1.7);
    },
  };
}

export function scenes(C, P) {
  return [services(C), market(C, 0), market(C, 1), credentials(C), blast(C)];
}
