// Scenes 06-09: location, timezone, education, values. Landscape (1920x1080) and portrait (1080x1920) layouts.
import { pad, q, qa, esc, clamp, STAGE } from "./util.js";

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
const BONE = "#f2efea";
const INK = "#0d0d0d";
const SAGE = "#557373";
const MONO = "Geist Mono, ui-monospace, monospace";
const ACT = "02 · About";
const PORT = STAGE.portrait;

// font-size that keeps `text` inside `width` px (approximate Geist 900 uppercase advance)
const fit = (text, max, width, k = 0.62) =>
  Math.max(30, Math.min(max, Math.floor(width / (Math.max(1, String(text).length) * k))));
const mask = (inner, cls = "", style = "") => `<div class="mask ${cls}" style="${style}"><span>${inner}</span></div>`;
// eyebrow label; portrait needs a larger mono size
const eyebrow = (text, cls = "") =>
  mask(`<span class="eyebrow ${cls}"${PORT ? ' style="font-size:28px;letter-spacing:.2em"' : ""}>${esc(text)}</span>`);
const fmtLat = (v) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? "N" : "S"}`;
const fmtLon = (v) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? "E" : "W"}`;
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const has = (v) => v !== null && v !== undefined && String(v).trim() !== "";

// split words into at most two balanced lines
function twoLines(text) {
  const w = String(text).split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(" ")];
  let best = null;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" "), b = w.slice(i).join(" ");
    const score = Math.max(a.length, b.length);
    if (!best || score < best.score) best = { score, lines: [a, b] };
  }
  return best.lines;
}

/* ---------------------------------------------------------------- sphere helpers (no d3 needed) */
const RAD = Math.PI / 180;
const toVec = ([lon, lat]) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const toLonLat = (a) => [Math.atan2(a[1], a[0]) / RAD, Math.asin(clamp(a[2], -1, 1)) / RAD];
function framingCentre(points) {
  const s = [0, 0, 0];
  for (const [p, w] of points) { const v = toVec(p); s[0] += v[0] * w; s[1] += v[1] * w; s[2] += v[2] * w; }
  return toLonLat(norm(s));
}
// bring `lam` within 180 degrees of `ref` so the rotation tween takes the short way round
const nearLam = (lam, ref) => ref + ((((lam - ref) % 360) + 540) % 360) - 180;

/* ------------------------------------------------------------------ 06 location */
const LOC = PORT
  ? { globe: [160, 210], text: 90, w: 900, eye: 1040, country: 1084, cMax: 150, note: 30, mh: 28, row: 92, ri: 28, rc: 46,
      lab: 28, val: 34, ft: 28, fs: 26, ls: 3 }
  : { globe: [1060, 160], text: 110, w: 800, eye: 196, country: 250, cMax: 160, note: 22, mh: 16, row: 92, ri: 16, rc: 46,
      lab: 15, val: 28, ft: 20, fs: 15, ls: 3.5 };

function locationScene(C) {
  const L = C.location;
  const markets = (L.markets || []).slice(0, 2);
  const R = 330, MID = 380;
  const home = [L.lon, L.lat];
  const country = String(L.country).toUpperCase();
  const countryPx = fit(country, LOC.cMax, LOC.w - 40);
  const noteTop = LOC.country + Math.round(countryPx * 0.9) + 38;
  const mhTop = noteTop + LOC.note + 70;
  const rowsTop = mhTop + LOC.mh + 30;
  const ruleTop = rowsTop + markets.length * LOC.row;
  const readTop = ruleTop + 44;
  const mids = markets.map((m) => toLonLat(norm(toVec(home).map((x, i) => x + toVec([m.lon, m.lat])[i]))));
  const centre = framingCentre([[home, 1], ...markets.map((m) => [[m.lon, m.lat], 1.6]), ...mids.map((p) => [p, 1])]);
  const homeView = { lam: -L.lon, phi: -L.lat };
  const allView = { lam: nearLam(-centre[0], homeView.lam), phi: -centre[1] };
  const start = { lam: homeView.lam - 140, phi: -L.lat * 0.4 - 14 };
  const view = { lam: start.lam, phi: start.phi, pin: 0, arc: 0, lab: 0 };

  const hasGeo = typeof d3 !== "undefined" && !!d3.geoOrthographic && !!d3.geoPath;
  const proj = hasGeo ? d3.geoOrthographic().scale(R).translate([MID, MID]).clipAngle(90).precision(0.6) : null;
  const path = hasGeo ? d3.geoPath(proj) : null;
  const graticule = hasGeo && d3.geoGraticule10 ? d3.geoGraticule10() : null;
  const interps = hasGeo && d3.geoInterpolate ? markets.map((m) => d3.geoInterpolate(home, [m.lon, m.lat])) : [];
  let land = null, landDrawn = false, refs = null, requested = false, dirty = true;
  const cache = {};
  const mark = () => { dirty = true; };

  // label: up = text above the point (markets), down = text below it (home), so neighbouring labels never meet
  const labelSvg = (cls, title, sub, dot) => `
    <g class="${cls}" opacity="0" transform="translate(${MID} ${MID})">
      <path class="lc-lead" pathLength="1" fill="none" stroke="${BONE}" stroke-width="2" stroke-dasharray="1" stroke-dashoffset="1"/>
      <text class="lc-t" stroke="${INK}" stroke-width="5" paint-order="stroke" fill="${BONE}" font-family="${MONO}" font-weight="700" font-size="${LOC.ft}" letter-spacing="${LOC.ls}">${esc(title)}</text>
      <text class="lc-s" stroke="${INK}" stroke-width="5" paint-order="stroke" fill="${SAGE}" font-family="${MONO}" font-weight="600" font-size="${LOC.fs}" letter-spacing="${LOC.ls}">${esc(sub)}</text>
      ${dot}
    </g>`;
  const marketRows = markets.map((m, i) => `
    <div class="lc-row" style="top:${i * LOC.row}px">
      <span class="mono lc-ri">${pad(i + 1)}</span>
      <span class="lc-rc">${esc(String(m.city).toUpperCase())}<i>, ${esc(m.country)}</i></span>
      <span class="mono lc-rz">${esc(m.tzLabel)}</span>
    </div>`).join("");

  const LEAD = LOC.fs + 30;
  function placeLabel(g, lonlat, k, down, key) {
    if (cache[g.dataset.i] === key) return;
    cache[g.dataset.i] = key;
    const xy = proj(lonlat);
    const vis = d3.geoDistance ? d3.geoDistance(lonlat, [-view.lam, -view.phi]) < 1.5 : true;
    if (!xy || !vis || k <= 0.001) { g.setAttribute("opacity", "0"); return; }
    const dir = xy[0] > MID + 40 ? -1 : 1, y = down ? LEAD : -LEAD;
    g.setAttribute("transform", `translate(${xy[0].toFixed(1)} ${xy[1].toFixed(1)})`);
    g.setAttribute("opacity", clamp(k).toFixed(3));
    const [lead, t, s] = [g.querySelector(".lc-lead"), g.querySelector(".lc-t"), g.querySelector(".lc-s")];
    lead.setAttribute("d", `M0 0 L${dir * 44} ${y} L${dir * 220} ${y}`);
    lead.setAttribute("stroke-dashoffset", (1 - clamp(k)).toFixed(3));
    const ty = down ? LEAD + LOC.ft + 8 : -LEAD - 12, sy = down ? LEAD - 10 : -LEAD + LOC.fs + 8;
    for (const [el, yy] of [[t, ty], [s, sy]]) {
      el.setAttribute("x", String(dir * 54));
      el.setAttribute("y", String(yy));
      el.setAttribute("text-anchor", dir > 0 ? "start" : "end");
    }
  }

  // repaints only what changed since the last call (driven from tick, at most once per frame)
  function redraw() {
    if (!refs || !proj) return;
    const rot = `${view.lam.toFixed(3)},${view.phi.toFixed(3)}`;
    const turned = rot !== cache.rot;
    if (turned) {
      cache.rot = rot;
      proj.rotate([view.lam, view.phi, 0]);
      if (graticule) refs.grat.setAttribute("d", path(graticule) || "");
    }
    if (land && (turned || !landDrawn)) { refs.land.setAttribute("d", path(land) || ""); landDrawn = true; }
    placeLabel(refs.pin, home, view.pin, true, `${rot}|${view.pin.toFixed(3)}`);
    interps.forEach((ip, i) => {
      const k = clamp(view.arc * 1.25 - i * 0.25);
      const akey = `${rot}|${k.toFixed(4)}`;
      if (cache["a" + i] !== akey) {
        cache["a" + i] = akey;
        const n = Math.max(2, Math.ceil(48 * k));
        const coords = Array.from({ length: n + 1 }, (_, j) => ip((j / n) * k));
        refs.arcs[i].setAttribute("d", k > 0.001 ? path({ type: "LineString", coordinates: coords }) || "" : "");
        const p = ip(k), tip = proj(p);
        const tipVis = d3.geoDistance ? d3.geoDistance(p, [-view.lam, -view.phi]) < Math.PI / 2 : true;
        if (tip) refs.tips[i].setAttribute("transform", `translate(${tip[0].toFixed(1)} ${tip[1].toFixed(1)})`);
        refs.tips[i].setAttribute("opacity", tip && k > 0.001 && k < 0.999 && tipVis ? "1" : "0");
      }
      const lk = k >= 0.999 ? view.lab : 0;
      placeLabel(refs.marks[i], [markets[i].lon, markets[i].lat], lk, false, `${rot}|${lk.toFixed(3)}`);
    });
  }

  function loadWorld() {
    if (requested || typeof fetch !== "function" || typeof topojson === "undefined") return;
    requested = true;
    fetch(WORLD_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("world-atlas " + r.status))))
      .then((data) => { land = topojson.feature(data, data.objects.countries); redraw(); })
      .catch((e) => console.warn("globe: land outlines unavailable", e.message)); // graticule + pins still work
  }

  const [gx, gy] = LOC.globe;
  return {
    slug: "location", name: "Location", act: ACT, field: "ink", dur: 3.6,
    stars: true, ammo: 0, turn: null, rest: null, restAt: null, model: false,
    html: `
      <style>
        .lc-rows{position:absolute;left:${LOC.text}px;top:${rowsTop}px;width:${LOC.w}px;height:${markets.length * LOC.row}px}
        .lc-row{position:absolute;left:0;width:${LOC.w}px;height:${LOC.row}px;display:grid;grid-template-columns:${PORT ? 90 : 70}px 1fr auto;
          align-items:center;border-top:2px solid rgba(242, 239, 234,.28)}
        .lc-ri{font-size:${LOC.ri}px;color:var(--sage)}
        .lc-rz{font-size:${PORT ? 28 : 18}px;color:var(--bone);letter-spacing:.16em}
        .lc-rc{font:900 ${LOC.rc}px/1 var(--sans);letter-spacing:-.03em;white-space:nowrap;text-transform:uppercase}
        .lc-rc i{font-style:normal;color:var(--ash)}
        .lc-read .mono{letter-spacing:.08em}
      </style>
      <div class="abs" style="left:${LOC.text}px;top:${LOC.eye}px">${eyebrow("Based in")}</div>
      ${mask(esc(country), "big", `position:absolute;left:${LOC.text - 6}px;top:${LOC.country}px;font-size:${countryPx}px;white-space:nowrap`)}
      <div class="abs mono lc-note" style="left:${LOC.text}px;top:${noteTop}px;font-size:${LOC.note}px;letter-spacing:.18em">
        <span class="live"></span>${esc(L.note)}</div>
      <div class="abs mono dim lc-mh" style="left:${LOC.text}px;top:${mhTop}px;font-size:${LOC.mh}px;letter-spacing:.2em">Markets</div>
      <div class="lc-rows">${marketRows}</div>
      <div class="abs lc-rule" style="left:${LOC.text}px;top:${ruleTop}px;width:${LOC.w}px;height:2px;background:var(--bone);opacity:.28;transform-origin:0 50%"></div>
      <div class="abs lc-read" style="left:${LOC.text}px;top:${readTop}px;width:${LOC.w}px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px">
        <div><div class="mono dim" style="font-size:${LOC.lab}px">Latitude</div>
          <div class="mono" id="lc-lat" style="font-size:${LOC.val}px;margin-top:14px">${fmtLat(L.lat)}</div></div>
        <div><div class="mono dim" style="font-size:${LOC.lab}px">Longitude</div>
          <div class="mono" id="lc-lon" style="font-size:${LOC.val}px;margin-top:14px">${fmtLon(L.lon)}</div></div>
        <div><div class="mono dim" style="font-size:${LOC.lab}px">Zone</div>
          <div class="mono" style="font-size:${LOC.val}px;margin-top:14px">${esc(L.tzLabel)}</div></div>
      </div>
      <div class="abs lc-wrap" style="left:${gx}px;top:${gy}px;width:760px;height:760px">
        <svg viewBox="0 0 760 760" width="760" height="760" style="overflow:visible">
          <circle cx="${MID}" cy="${MID}" r="${R + 22}" fill="none" stroke="${SAGE}" stroke-width="1.5" stroke-opacity=".45" stroke-dasharray="3 9"/>
          <circle cx="${MID}" cy="${MID}" r="${R}" fill="rgba(13, 13, 13,.9)" stroke="${BONE}" stroke-opacity=".5" stroke-width="2"/>
          <path class="lc-grat" fill="none" stroke="${BONE}" stroke-opacity=".16" stroke-width="1"/>
          <path class="lc-land" fill="rgba(242, 239, 234,.1)" stroke="${BONE}" stroke-opacity=".5" stroke-width="1" stroke-linejoin="round"/>
          ${markets.map(() => `<path class="lc-arc" fill="none" stroke="${SAGE}" stroke-width="3" stroke-linecap="round"/>`).join("")}
          ${markets.map(() => `<g class="lc-tip" opacity="0"><circle r="13" fill="${SAGE}" fill-opacity=".25"/><circle r="6" fill="${SAGE}"/></g>`).join("")}
          ${markets.map((m) => labelSvg("lc-mk", String(m.city).toUpperCase(), `${m.country} · ${m.tzLabel}`.toUpperCase(),
            `<circle r="11" fill="none" stroke="${SAGE}" stroke-width="2"/><circle r="5" fill="${SAGE}"/>`)).join("")}
          ${labelSvg("lc-pin", String(L.city).toUpperCase(), "HOME",
            `<circle class="lc-ring" r="10" fill="none" stroke="${SAGE}" stroke-width="3"/><circle r="9" fill="${SAGE}"/>`)}
          <text aria-hidden="true" x="${MID}" y="${MID + R + 64}" fill="${BONE}" fill-opacity=".5" font-family="${MONO}" font-size="${PORT ? 22 : 14}"
            letter-spacing="4" text-anchor="middle">ORTHOGRAPHIC · GREAT-CIRCLE ROUTES</text>
        </svg>
      </div>`,
    anim(root, tl) {
      refs = {
        grat: q(root, ".lc-grat"), land: q(root, ".lc-land"), pin: q(root, ".lc-pin"), ring: q(root, ".lc-ring"),
        arcs: qa(root, ".lc-arc"), tips: qa(root, ".lc-tip"), marks: qa(root, ".lc-mk"), lat: q(root, "#lc-lat"), lon: q(root, "#lc-lon"),
      };
      refs.pin.dataset.i = "p";
      refs.marks.forEach((g, i) => { g.dataset.i = "m" + i; });
      loadWorld();
      redraw();
      tl.from(qa(root, ".mask > span"), { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.1 }, 0.1);
      tl.from(q(root, ".lc-note"), { opacity: 0, x: -24, duration: 0.6, ease: "power3.out" }, 0.5);
      tl.from(q(root, ".lc-mh"), { opacity: 0, duration: 0.5 }, 0.7);
      tl.from(qa(root, ".lc-row"), { opacity: 0, y: 26, duration: 0.6, ease: "power3.out", stagger: 0.12 }, 0.8);
      tl.from(q(root, ".lc-rule"), { scaleX: 0, duration: 0.8, ease: "power3.inOut" }, 0.9);
      tl.from(q(root, ".lc-read"), { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" }, 1.1);
      tl.from(q(root, ".lc-wrap"), { opacity: 0, scale: 0.82, duration: 1.1, ease: "power3.out" }, 0);
      // spin to home, pin it, pull back to frame all three cities, draw the routes, label the markets
      const go = (from, to, dur, ease, at) => tl.fromTo(view, from, { ...to, duration: dur, ease, immediateRender: false, onUpdate: mark }, at);
      go({ lam: start.lam, phi: start.phi }, { lam: homeView.lam, phi: homeView.phi }, 1.5, "power3.out", 0.1);
      go({ pin: 0 }, { pin: 1 }, 0.5, "power2.out", 1.3);
      go({ lam: homeView.lam, phi: homeView.phi }, { lam: allView.lam, phi: allView.phi }, 1.0, "power2.inOut", 1.75);
      go({ arc: 0 }, { arc: 1 }, 0.95, "power1.inOut", 1.95);
      go({ lab: 0 }, { lab: 1 }, 0.35, "power2.out", 2.65);
      const o = { la: 0, lo: 0 };
      tl.fromTo(o, { la: 0, lo: 0 }, {
        la: L.lat, lo: L.lon, duration: 1.4, ease: "power3.out", immediateRender: false,
        onUpdate() { refs.lat.textContent = fmtLat(o.la); refs.lon.textContent = fmtLon(o.lo); },
      }, 0.3);
    },
    tick(root, st, env) {
      if (!refs) return;
      if (dirty) { dirty = false; redraw(); }
      const k = Math.round(((env.clock * 0.55) % 1) * 60) / 60; // 60 steps per pulse is plenty
      if (k !== cache.ring) {
        cache.ring = k;
        refs.ring.setAttribute("r", (10 + 52 * k).toFixed(1));
        refs.ring.setAttribute("stroke-opacity", ((1 - k) * 0.9).toFixed(3));
      }
    },
  };
}

/* ------------------------------------------------------------------ 07 timezone */
function makeFormatter(tz) {
  const opts = { hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", day: "2-digit", month: "short" };
  try { return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz }); } catch (e) {
    console.warn("timezone: unknown zone", tz);
    return new Intl.DateTimeFormat("en-GB", opts);
  }
}

// decorative dial (aria-hidden); hands are the .tz-h/.tz-m/.tz-s groups
function clockFace(CX, FACE) {
  const k = FACE / 180;
  let ticks = "";
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0;
    ticks += `<line x1="${CX}" y1="${CX - FACE + 12 * k}" x2="${CX}" y2="${CX - FACE + (major ? 40 : 24) * k}" stroke="${BONE}"
      stroke-width="${major ? 4 : 1.5}" stroke-opacity="${major ? 1 : 0.5}" transform="rotate(${i * 6} ${CX} ${CX})"/>`;
  }
  let nums = "";
  for (let i = 3; i <= 12; i += 3) {
    const a = i * 30 * RAD, r = FACE - 70 * k;
    nums += `<text x="${(CX + Math.sin(a) * r).toFixed(1)}" y="${(CX - Math.cos(a) * r).toFixed(1)}" fill="${BONE}" font-family="${MONO}"
      font-weight="700" font-size="${PORT ? 28 : 24}" text-anchor="middle" dominant-baseline="central">${i}</text>`;
  }
  const hand = (cls, back, len, w, col) =>
    `<g class="${cls}"><line x1="${CX}" y1="${CX + back * k}" x2="${CX}" y2="${CX - FACE * len}" stroke="${col}" stroke-width="${w * k}" stroke-linecap="round"/></g>`;
  return `
    <svg aria-hidden="true" viewBox="0 0 ${CX * 2} ${CX * 2}" width="${CX * 2}" height="${CX * 2}">
      <circle cx="${CX}" cy="${CX}" r="${FACE + 14}" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="2 8"/>
      <circle cx="${CX}" cy="${CX}" r="${FACE}" fill="${INK}"/>
      <g class="tz-ticks">${ticks}</g>${nums}
      ${hand("tz-h", 24, 0.5, 12, BONE)}${hand("tz-m", 24, 0.76, 7, BONE)}${hand("tz-s", 38, 0.88, 3, SAGE)}
      <circle cx="${CX}" cy="${CX}" r="${11 * k}" fill="${SAGE}"/><circle cx="${CX}" cy="${CX}" r="${4 * k}" fill="${INK}"/>
    </svg>`;
}

// one zone block: landscape = a centred column, portrait = a row (dial left, big time right)
function zoneBlock(z, i, n) {
  if (!PORT) {
    const COL = 1740 / n, left = 90 + i * COL, CX = 200;
    const cityPx = fit(String(z.city).toUpperCase(), 72, COL - 80, 0.64);
    const c = `left:0;width:${COL}px;text-align:center`;
    return `
      <div class="abs tz-col" style="left:${left}px;top:300px;width:${COL}px;height:690px">
        <div class="abs tz-clock" style="left:${COL / 2 - CX}px;top:0;width:${CX * 2}px;height:${CX * 2}px">${clockFace(CX, 180)}</div>
        <div class="abs mono tz-tag" style="${c};top:440px;font-size:15px">${esc(z.tag)}</div>
        ${mask(esc(String(z.city).toUpperCase()), "mid", `position:absolute;${c};top:474px;font-size:${cityPx}px;white-space:nowrap`)}
        <div class="abs mono tz-dig" style="${c};top:${474 + Math.round(cityPx * 0.95) + 28}px;font-size:38px">00:00:00</div>
        <div class="abs mono dim tz-meta" style="${c};top:${474 + Math.round(cityPx * 0.95) + 88}px;font-size:16px">
          ${esc(z.tzLabel)} · <span class="tz-date">---</span></div>
      </div>`;
  }
  const ROW = 390, top = 560 + i * ROW, CX = 150, tx = 340;
  const cityPx = fit(String(z.city).toUpperCase(), 76, 900 - tx, 0.66);
  return `
    <div class="abs tz-col" style="left:90px;top:${top}px;width:900px;height:${ROW}px">
      <div class="abs tz-clock" style="left:0;top:24px;width:${CX * 2}px;height:${CX * 2}px">${clockFace(CX, 134)}</div>
      <div class="abs mono tz-tag" style="left:${tx}px;top:20px;font-size:28px">${esc(z.tag)}</div>
      ${mask(esc(String(z.city).toUpperCase()), "mid", `position:absolute;left:${tx}px;top:66px;font-size:${cityPx}px;white-space:nowrap`)}
      <div class="abs mono tz-dig" style="left:${tx}px;top:${66 + Math.round(cityPx * 0.95) + 30}px;font-size:72px;letter-spacing:.04em">00:00:00</div>
      <div class="abs mono dim tz-meta" style="left:${tx}px;top:${66 + Math.round(cityPx * 0.95) + 130}px;font-size:28px">
        ${esc(z.tzLabel)} · <span class="tz-date">---</span></div>
    </div>`;
}

function timezoneScene(C) {
  const L = C.location;
  const zones = [
    { city: L.city, country: L.country, tz: L.tz, tzLabel: L.tzLabel, tag: "Home" },
    ...(L.markets || []).slice(0, 2).map((m, i) => ({ ...m, tag: `Market ${pad(i + 1)}` })),
  ];
  const fmts = zones.map((z) => makeFormatter(z.tz));
  const CX = PORT ? 150 : 200;
  let clocks = null;
  const head = "THREE TIME ZONES";
  const headLines = PORT ? twoLines(head) : [head];
  const headPx = PORT ? Math.min(...headLines.map((l) => fit(l, 140, 880, 0.66))) : 132;
  const headHtml = headLines.map((l, i) => mask(`${esc(l)}${i === headLines.length - 1 ? '<span class="period"></span>' : ""}`, "big",
    `position:absolute;left:90px;top:${(PORT ? 210 : 140) + Math.round(i * headPx * 0.92)}px;font-size:${headPx}px;white-space:nowrap`)).join("");
  const noteStyle = PORT
    ? `left:90px;top:${210 + Math.round(headLines.length * headPx * 0.92) + 30}px;font-size:28px;letter-spacing:.2em`
    : "right:90px;top:104px;font-size:16px";
  const seps = zones.slice(1).map((_, i) => PORT
    ? `<div class="abs tz-sep" style="left:90px;top:${560 + (i + 1) * 390}px;width:900px;height:2px;background:var(--ink);opacity:.22;transform-origin:0 50%"></div>`
    : `<div class="abs tz-sep" style="left:${90 + ((i + 1) * 1740) / zones.length}px;top:330px;width:2px;height:620px;background:var(--ink);opacity:.22;transform-origin:50% 0"></div>`).join("");

  return {
    slug: "timezone", name: "Timezone", act: ACT, field: "sage", dur: 3.0,
    stars: false, ammo: 1, turn: null, rest: null, restAt: null, model: false,
    html: `
      <style>.tz-dig{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";letter-spacing:.1em;white-space:nowrap}
        .tz-tag{color:var(--ink);letter-spacing:${PORT ? ".2em" : ".34em"}}</style>
      <div class="abs" style="left:96px;top:${PORT ? 160 : 96}px">${eyebrow("Working hours")}</div>
      ${headHtml}
      <div class="abs mono dim tz-note" style="${noteStyle}">Live · local time</div>
      ${seps}${zones.map((z, i) => zoneBlock(z, i, zones.length)).join("")}`,
    anim(root, tl) {
      clocks = qa(root, ".tz-col").map((col) => ({
        h: q(col, ".tz-h"), m: q(col, ".tz-m"), s: q(col, ".tz-s"), dig: q(col, ".tz-dig"), date: q(col, ".tz-date"), last: "", day: "",
      }));
      tl.from(qa(root, ".mask > span"), { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.08 }, 0.05);
      tl.from(qa(root, ".tz-clock"), { scale: 0.6, rotation: -60, opacity: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 }, 0);
      tl.from(qa(root, ".tz-ticks"), { opacity: 0, duration: 0.5, stagger: 0.12 }, 0.2);
      tl.from(qa(root, ".tz-sep"), PORT ? { scaleX: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.1 }
        : { scaleY: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.1 }, 0.3);
      tl.from(qa(root, ".tz-tag, .tz-dig, .tz-meta"), { opacity: 0, y: 18, duration: 0.6, ease: "power3.out", stagger: 0.04 }, 0.6);
      tl.from(q(root, ".tz-note"), { opacity: 0, duration: 0.5 }, 0.8);
    },
    // live: real wall time per zone; the sweep (midnight -> now) is driven by st so it scrubs both ways
    tick(root, st) {
      if (!clocks) return;
      const now = new Date();
      const k = easeOutCubic(clamp((st - 0.2) / 1.8));
      const rot = (a) => `rotate(${a.toFixed(2)} ${CX} ${CX})`;
      clocks.forEach((c, i) => {
        const p = {};
        for (const part of fmts[i].formatToParts(now)) p[part.type] = part.value;
        const nowSec = (+p.hour % 24) * 3600 + (+p.minute) * 60 + (+p.second) + now.getMilliseconds() / 1000;
        const disp = nowSec * k;
        const hh = Math.floor(disp / 3600) % 24, mm = Math.floor(disp / 60) % 60, ss = Math.floor(disp) % 60;
        const key = `${hh}:${mm}:${ss}`;
        if (key !== c.last) {
          c.last = key;
          c.dig.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
          const day = `${p.weekday || ""} ${p.day || ""} ${p.month || ""}`.trim().toUpperCase();
          if (day !== c.day) { c.day = day; c.date.textContent = day; }
        }
        if (k < 1 || c.lastMs !== Math.floor(nowSec * 10)) { // hands: 10 updates a second once settled
          c.lastMs = Math.floor(nowSec * 10);
          c.h.setAttribute("transform", rot(((disp / 43200) % 1) * 360));
          c.m.setAttribute("transform", rot(((disp / 3600) % 1) * 360));
          c.s.setAttribute("transform", rot(((nowSec % 60) + 60) * 6 * k)); // one extra turn, lands on the live second
        }
      });
    },
  };
}

/* ------------------------------------------------------------------ 08 education */
const EDU = PORT
  ? { frame: [270, 270, 540, 560], cap: 862, text: 130, w: 850, bar: 90, eye: 960, top: 1012, topPx: 56, main: 1100, mainMax: 120,
      school: 76, place: 28, years: 28 }
  : { frame: [1330, 180, 500, 620], cap: 830, text: 140, w: 1100, bar: 90, eye: 176, top: 226, topPx: 52, main: 300, mainMax: 150,
      school: 76, place: 20, years: 18 };

function photoFrame(P) {
  const [x, y, w, h] = EDU.frame;
  const corner = (pos) => `<i class="ed-c ed-c-${pos}"></i>`;
  const inner = has(P.photo)
    ? `<img class="ed-img" src="${esc(P.photo)}" alt="${esc(P.full)}" decoding="async"><div class="ed-grade"></div>`
    : `<div class="ed-ph"><div class="ed-hatch"></div><div class="mask ed-ini"><span class="ol">${esc(P.initials)}</span></div></div>`;
  const lab = PORT ? 28 : 14;
  return `
    <div class="abs ed-frame" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
      <div class="ed-box">${inner}<div class="ed-cover"></div></div>
      ${corner("tl")}${corner("tr")}${corner("bl")}${corner("br")}
      <div class="abs mono ed-lab" style="left:20px;top:20px;font-size:${lab}px">Photo</div>
      <div class="abs mono ed-lab" style="right:20px;top:20px;font-size:${lab}px">Fig. 01</div>
    </div>
    <div class="abs mono dim ed-cap" style="left:${x}px;top:${EDU.cap}px;width:${w}px;font-size:${PORT ? 28 : 15}px;letter-spacing:.2em;
      ${PORT ? "text-align:center" : ""}">${esc(P.full)}</div>`;
}

function educationScene(C) {
  const E = C.education;
  const parts = String(E.degree).split(/\s+in\s+/i);
  const top = parts.length > 1 ? parts[0] : "";
  const main = (parts.length > 1 ? parts.slice(1).join(" in ") : parts[0]).toUpperCase();
  const lines = twoLines(main);
  const W = EDU.w;
  const mainPx = Math.min(...lines.map((l) => fit(l, EDU.mainMax, W, 0.7)));
  const topPx = Math.min(EDU.topPx, fit(top.toUpperCase(), EDU.topPx, W, 0.66));
  const mainTop = top ? EDU.main : EDU.top;
  const ruleTop = mainTop + Math.round(mainPx * 0.92 * lines.length) + 44;
  const schoolPx = fit(E.school.toUpperCase(), EDU.school, W, 0.64);
  const placeTop = ruleTop + 40 + schoolPx + 26;
  const showYears = has(E.years);
  const yearsStyle = PORT
    ? `left:${EDU.text}px;top:${placeTop + 60}px;font-size:${EDU.years}px`
    : `left:${EDU.text + W - 300}px;width:300px;text-align:right;top:180px;font-size:${EDU.years}px`;
  return {
    slug: "education", name: "Education", act: ACT, field: "bone", dur: 3.4,
    stars: false, ammo: 2, turn: null, rest: null, restAt: null, model: false,
    html: `
      <style>
        .ed-box{position:absolute;inset:0;border:2px solid var(--ink);overflow:hidden;background:#d9d6d3}
        .ed-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%;display:block}
        .ed-grade{position:absolute;inset:0;background:linear-gradient(to top,rgba(85, 115, 115,.10),rgba(85, 115, 115,0) 40%),
          linear-gradient(to bottom,rgba(13, 13, 13,.14),rgba(13, 13, 13,0) 30%)}
        .ed-ph{position:absolute;inset:0;display:grid;place-items:center}
        .ed-hatch{position:absolute;inset:0;opacity:.12;background:repeating-linear-gradient(135deg,var(--ink) 0 1.5px,transparent 1.5px 22px)}
        .ed-ini{position:relative;--paper:#d9d6d3}
        .ed-ini span{font:900 170px/1 var(--sans);letter-spacing:-.05em;color:var(--ink)}
        .ed-c{position:absolute;width:40px;height:40px;border:0 solid var(--sage)}
        .ed-c-tl{left:-16px;top:-16px;border-width:4px 0 0 4px}.ed-c-tr{right:-16px;top:-16px;border-width:4px 4px 0 0}
        .ed-c-bl{left:-16px;bottom:-16px;border-width:0 0 4px 4px}.ed-c-br{right:-16px;bottom:-16px;border-width:0 4px 4px 0}
        .ed-cover{position:absolute;inset:-2px;background:var(--bone)}
        .ed-lab{color:var(--ink);background:var(--bone);padding:6px 8px;letter-spacing:.2em}
      </style>
      <div class="abs ed-bar" style="left:${EDU.bar}px;top:${EDU.eye}px;width:12px;height:${ruleTop - EDU.eye}px;background:var(--sage);transform-origin:50% 0"></div>
      <div class="abs" style="left:${EDU.text}px;top:${EDU.eye}px">${eyebrow("Education", "ink")}</div>
      ${showYears ? `<div class="abs mono dim ed-years" style="${yearsStyle}">${esc(E.years)}</div>` : ""}
      ${top ? mask(esc(top.toUpperCase()), "mid", `position:absolute;left:${EDU.text - 4}px;top:${EDU.top}px;font-size:${topPx}px;white-space:nowrap`) : ""}
      ${lines.map((l, i) => mask(esc(l), "big ol", `position:absolute;left:${EDU.text - 10}px;top:${mainTop + Math.round(i * mainPx * 0.92)}px;font-size:${mainPx}px;white-space:nowrap`)).join("")}
      <div class="abs ed-rule" style="left:${EDU.text}px;top:${ruleTop}px;width:${W}px;height:3px;background:var(--ink);transform-origin:0 50%"></div>
      ${mask(esc(E.school.toUpperCase()), "mid", `position:absolute;left:${EDU.text - 4}px;top:${ruleTop + 40}px;font-size:${schoolPx}px;white-space:nowrap`)}
      <div class="abs mono dim ed-place" style="left:${EDU.text}px;top:${placeTop}px;font-size:${EDU.place}px;letter-spacing:.2em">${esc(E.place)}</div>
      ${photoFrame(C.person)}`,
    anim(root, tl) {
      tl.from(q(root, ".ed-bar"), { scaleY: 0, duration: 1.0, ease: "power4.inOut" }, 0);
      tl.from(qa(root, ".mask:not(.ed-ini) > span"), { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.12 }, 0.2);
      tl.from(q(root, ".ed-rule"), { scaleX: 0, duration: 1.0, ease: "power3.inOut" }, 0.7);
      tl.from(q(root, ".ed-place"), { opacity: 0, x: -30, duration: 0.7, ease: "power3.out" }, 1.3);
      if (showYears) tl.from(q(root, ".ed-years"), { opacity: 0, duration: 0.6 }, 1.2);
      // the photo wipes open top to bottom: a bone cover slides down out of the frame (transform only)
      tl.fromTo(q(root, ".ed-cover"), { yPercent: 0 }, { yPercent: 102, duration: 1.0, ease: "power3.inOut", immediateRender: true }, 0.4);
      tl.from(qa(root, ".ed-c"), { opacity: 0, scale: 1.6, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.3);
      tl.from(qa(root, ".ed-lab, .ed-cap"), { opacity: 0, duration: 0.5, stagger: 0.08 }, 1.2);
      const ini = q(root, ".ed-ini > span");
      if (ini) tl.from(ini, { yPercent: 115, duration: 1.0, ease: "power4.out" }, 1.0);
      const img = q(root, ".ed-img");
      if (img) tl.from(img, { scale: 1.15, duration: 2.4, ease: "power2.out" }, 0.4);
    },
  };
}

/* ------------------------------------------------------------------ 09 values */
const VAL = PORT
  ? { eye: 160, word: 204, wordMax: 180, w: 900, cols: [[90, 630], [90, 1170]], pillW: 900, row: 104, numW: 64, padL: 28, padR: 24,
      icon: 44, maxPx: 38, head: 28, tag: [90, 400, 900, 30] }
  : { eye: 110, word: 160, wordMax: 220, w: 1740, cols: [[90, 560], [1010, 560]], pillW: 820, row: 104, numW: 64, padL: 30, padR: 26,
      icon: 44, maxPx: 36, head: 18, tag: [1250, 250, 580, 18] };
const PILL_K = 0.78; // conservative Geist 900 uppercase advance (em per char), so text + icon always fit

function valuesScene(C) {
  const cols = [
    { title: "What I value", items: (C.values || []).slice(0, 4), kind: "v" },
    { title: "Where I'm going", items: (C.goals || []).slice(0, 4), kind: "g" },
  ];
  const inner = VAL.pillW - VAL.padL - VAL.padR - VAL.numW - VAL.icon - 16;
  const arrow = `<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M4 16 H26 M18 8 L26 16 L18 24"/></svg>`;
  const check = `<svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square"><path d="M6 17 L13 24 L26 9"/></svg>`;
  const col = (c, ci) => {
    const [left, top] = VAL.cols[ci];
    const longest = Math.max(1, ...c.items.map((it) => String(it).length));
    const px = Math.min(VAL.maxPx, Math.floor(inner / (longest * PILL_K))); // one size for the whole column
    const rows = c.items.map((it, i) => `
        <div class="va-pill va-${c.kind}" style="top:${i * VAL.row}px">
          <span class="mono va-i">${pad(i + 1)}</span>
          <span class="va-t" style="font-size:${px}px">${esc(it)}</span>
          <span class="va-ic">${c.kind === "v" ? check : arrow}</span>
        </div>`).join("");
    return `
      <div class="abs va-h" style="left:${left}px;top:${top - 40 - VAL.head}px;width:${VAL.pillW}px">
        <span class="mono" style="font-size:${VAL.head}px">${pad(ci + 1)} · ${esc(c.title)}</span></div>
      <div class="abs va-col" style="left:${left}px;top:${top}px;width:${VAL.pillW}px;height:${VAL.row * c.items.length}px">${rows}</div>`;
  };
  const wordPx = Math.min(VAL.wordMax, fit("PRECISE.", VAL.wordMax, VAL.w, 0.68));
  const [tx, ty, tw, tf] = VAL.tag;
  return {
    slug: "values", name: "Values", act: ACT, field: "ink", dur: 3.2,
    stars: true, ammo: 3, turn: null, rest: "scroll to continue", restAt: 2.0, model: false,
    html: `
      <style>
        .va-h span{color:var(--sage);letter-spacing:${PORT ? ".2em" : ".3em"}}
        .va-pill{position:absolute;left:0;width:${VAL.pillW}px;height:82px;border:2px solid rgba(242, 239, 234,.42);border-radius:999px;
          display:grid;grid-template-columns:${VAL.numW}px minmax(0,1fr) ${VAL.icon}px;column-gap:8px;align-items:center;
          padding:0 ${VAL.padR}px 0 ${VAL.padL}px;background:rgba(13, 13, 13,.6);overflow:hidden}
        .va-i{font-size:${PORT ? 28 : 15}px;color:var(--ash);letter-spacing:.16em}
        .va-t{font-weight:900;letter-spacing:-.02em;text-transform:uppercase;white-space:nowrap;line-height:1;overflow:hidden}
        .va-ic{display:grid;place-items:center;color:var(--sage)}
        .va-g{border-style:dashed}
        .va-word .period{background:var(--sage)}
      </style>
      <div class="abs" style="left:96px;top:${VAL.eye}px">${eyebrow("Values · Direction")}</div>
      ${mask(`PRECISE<span class="period"></span>`, "mega va-word", `position:absolute;left:84px;top:${VAL.word}px;font-size:${wordPx}px;white-space:nowrap`)}
      <div class="abs mono dim va-tag" style="left:${tx}px;top:${ty}px;width:${tw}px;${PORT ? "" : "text-align:right;"}font-size:${tf}px;
        line-height:1.6;letter-spacing:${PORT ? ".12em" : ".22em"}">${esc(C.person.tagline)}</div>
      <div class="abs va-rule" style="left:90px;top:${PORT ? 530 : 440}px;width:${PORT ? 900 : 1740}px;height:2px;background:var(--bone);opacity:.28;transform-origin:0 50%"></div>
      ${cols.map(col).join("")}`,
    anim(root, tl) {
      tl.from(qa(root, ".mask > span"), { yPercent: 115, duration: 0.85, ease: "power4.out", stagger: 0.1 }, 0.05);
      tl.from(q(root, ".va-tag"), { opacity: 0, x: PORT ? -30 : 30, duration: 0.6, ease: "power3.out" }, 0.4);
      tl.from(q(root, ".va-rule"), { scaleX: 0, duration: 0.8, ease: "power3.inOut" }, 0.35);
      tl.from(qa(root, ".va-h"), { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", stagger: 0.1 }, 0.55);
      // landscape: row by row across both columns; portrait: down the stacked list
      const pills = qa(root, ".va-pill");
      const order = PORT ? pills : [...pills].sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top));
      const gap = PORT ? 0.07 : 0.09;
      tl.from(order, { opacity: 0, x: -40, duration: 0.5, ease: "power3.out", stagger: gap }, 0.7);
      tl.from(order.map((p) => q(p, ".va-ic")), { scale: 0, rotation: -90, duration: 0.4, ease: "back.out(2)", stagger: gap }, 0.95);
    },
  };
}

export function scenes(C, P) {
  return [locationScene(C), timezoneScene(C), educationScene(C), valuesScene(C)];
}
