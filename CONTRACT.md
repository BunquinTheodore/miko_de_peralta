# Build contract: Miko De Peralta, cinematic scroll-film portfolio

Miko De Peralta is a pre-construction **construction estimator** (luxury residential houses in Qatar and Chicago;
BS Petroleum Engineering, Adamson University; previously Operations Assistant at Porto Petroleum). This site reuses
the engine of `C:\Portfolio` (read its `CONTRACT.md` and `js/scenes/*.js` + `js/gun.js` for the established style and
techniques; reuse/adapt freely, but never import from it). A fixed 1920x1080 "stage" scaled to the window, scenes
("shots") scrubbed by scroll with GSAP, Lenis smooth scroll, HUD corners, film grain, cursor ring, star particles,
a three.js **luxury house** that moves between toolkit scenes (exploded view, one skill group per layer), iris
transitions between colour fields.

Palette: ink `#050505`, **orange `#ff5f00`** (safety orange; CSS `var(--orange)`), bone `#ededed`, ash `#8a8585`,
rust `#4a1a00`. Glow rgba is `rgba(255,95,0,a)`. Never use the old red `#ff0f0f`. Fonts: Geist (900 display,
uppercase, tight tracking) and Geist Mono (labels, wide tracking). Visual language: architectural drawings /
blueprints / dimension lines / measurement ticks / section marks / grid paper / stamps, rendered in the same
premium dark/orange/bone editorial film style. No weapons, no ammo/gun vocabulary in visible copy.

Already written (do not rewrite, read them): `index.html`, `css/style.css`, `js/content.js`, `js/scenes/util.js`,
`js/scenes/index.js`, `js/main.js`. Libraries are globals from CDN script tags: `gsap`, `Lenis`, `d3` (d3-geo only:
`d3.geoOrthographic`, `d3.geoPath`, `d3.geoGraticule10`), `topojson` (topojson-client). three.js is import map
entry `"three"`. No build step; ES modules served statically (`python -m http.server`). Plain JS.

**All copy comes from `CONTENT` (`C`).** Never invent facts (no years, numbers, client names, project counts,
awards). Fields that are `null` (e.g. `C.education.years`, `C.work[i].since`, `C.person.photo`, cert `url`s)
must be handled gracefully: omit the element, or for the photo render a styled placeholder frame (outlined box,
corner marks, initials `C.person.initials`, mono label "Photo"). If `C.person.photo` is a string, render `<img>`.
Escape text with `esc` from util.js. Decorative mono labels (sheet numbers like "A-101", "SCALE 1:100",
"REV 02") are fine as design texture.

Files and owners:
- `js/scenes/boot.js`        scenes 01-05
- `js/scenes/about.js`       scenes 06-09
- `js/scenes/experience.js`  scenes 10-12
- `js/scenes/toolkit.js`     scenes 13-21
- `js/scenes/work.js`        scenes 22-26
- `js/house.js`              three.js house

## Scene module interface

Each scene file: `export function scenes(C, P) { return [ ...sceneObjects ] }` where `C` is `CONTENT` and `P` is the
shared model poser from `makePoser` (util.js). A scene object:

```js
{ slug, name, act, field,      // field: "ink" | "orange" | "bone" | "quad" (quad = ink root with four coloured cells)
  dur,                          // seconds
  stars: bool,                  // star particles behind it (ink scenes only; root then transparent: class "starry" is added by main.js)
  ammo: 0..3,                   // how many progress pips glow in the HUD (bottom-left). Use it as act progress.
  turn: null | [sec, "ink"|"orange"|"bone"],  // field changes mid-scene; the scene animates that itself
  rest: null | "hint text",     // resting frame: the scroll holds here so people can read/click
  restAt: null | seconds,       // where in the scene it holds (default: dur*0.55)
  model: bool,                  // the 3D house canvas is visible in this scene
  html: `...`,                  // inner HTML of the scene root (a 1920x1080 absolute box). position:absolute px layout.
  anim(root, tl, env),          // add tweens to the paused GSAP timeline `tl` (time 0..dur). Must be scrub-safe.
  tick(root, st, env)           // optional, every frame while active; st = seconds into the scene
}
```
`env` = `{ model: modelApi, mouse: {sx, sy}, clock, C }` (`mouse.sx/sy` smoothed -1..1; `clock` = wall seconds).

Rules for `anim`: use `tl.from/fromTo/to/set` only; every tween reversible (the user scrubs both ways); no
`tl.call` for visual state, no timers, no Math.random/Date (deterministic `hash`-style values). Element start states
come from `from`/`fromTo`; don't rely on CSS initial hidden states. Text reveals: wrap lines in `.mask > span`,
animate `yPercent`. For `turn` changes put an iris/flood circle inside the scene (`position:absolute;
border-radius:50%`, scale ~0.01 -> 1 covering the frame) and flip text colours with `tl.set(el,{color},t)`. Only
`<a>` and `.chip` receive pointer events. Do NOT build the generic scene-to-scene iris: main.js appends it at the
end of every scene whose ending field differs from the next scene's starting field (a quad scene ends ink: animate
its cells away). Every link is a real `<a href target="_blank" rel="noopener">` (mailto without target).
Scene-specific CSS goes in a `<style>` block inside `html`, with class names prefixed per scene (see Portfolio's
boot.js). Shared classes in style.css: `.mega .big .mid .mono .eyebrow .ol .ol-orange .mask .dim .live .dot
.period .scanline .links a.lnk .card .rowlink .tag3 .cert .abs .chip(.on)`.

Model scenes: `P.pose(tl, at, dur, {px,py,pz,rx,ry,rz,s,ex}, ease)` tweens the shared house state from the previous
pose. The first P.pose call in each model scene must be at = 0. The first model scene starts it off-screen left
(poser default px = -16). The last model scene must fly it off-screen (px: 16) before it ends. Camera fov 30 at z 14:
the stage shows 13.3 x 7.5 units (144 px per unit at 1080 tall); +x right, +y up; `s` uniform scale, `ex` explode
0..1, radians. Pose `{rx:0, ry:0}` shows the **front elevation** (front door facing camera, +z toward camera).
A pleasing 3/4 hero view is about `{rx: 0.32, ry: -0.62}`. `env.model.project(partName)` -> `[x, y]` stage px of the
part's current centre (or null before load) – use it in `tick` to pin labels/leaders to parts.

Parts (bottom to top): `foundation slab walls windows door roof`; skills for each in `C.skills[part]`.

## house.js interface

```js
export const PARTS = ["foundation", "slab", "walls", "windows", "door", "roof"];
export const PART_CENTER = { ... };   // assembled part centres [x, y] in model units (front view)
export async function mountHouse(canvas, state, opts) // canvas #model (1920x1080 css px); opts {pixelRatio, interactive}
  -> { render({sway:[rx,ry], light:[x,y], t}), pick(clientX, clientY) -> partName|null,
       project(partName) -> [x,y]|null, highlight(partName|null), setVisible(bool), setPixelRatio(n) }
```
`state` = live pose `{px,py,pz,rx,ry,rz,s,ex}` mutated by GSAP; read every render (sway adds to rx/ry). Procedural
low-poly **modern luxury two-storey house** (boxes/extrusions; no external model files): concrete foundation plinth,
ground slab + upper floor slab with a cantilevered overhang, white/bone wall volumes with one dark-timber cladding
volume, large glazed window panes (dark glass, slight emissive orange reflection), a tall pivot front door, a thin flat
roof with overhang/parapet (or low-pitched), maybe a small pool/terrace on the slab. Overall about 6 units wide,
4.5 tall, 4 deep, centred near origin at s=1. Materials MeshStandardMaterial in muted concrete/bone/charcoal tones
plus bone-coloured EdgesGeometry outlines (drawing feel), an orange point light that follows `light`, hemisphere
fill, transparent background. Each part is a Group named by part (picking via raycast, highlight = emissive orange +
orange edges). Explode `ex` 0->1: foundation down, slab slightly down, walls stay, windows and door push forward
(+z) and slightly out, roof lifts high; no overlaps at ex = 1.

## Scene list (slug | field | dur | notes)

Acts: "00 · Boot", "01 · Hero", "02 · About", "03 · Experience", "04 · Toolkit", "05 · Services", "06 · Markets",
"07 · Credentials", "08 · Contact".

boot.js
01 plan-scan | ink | 2.4 | a floor-plan drawing (procedural SVG walls/doors/dimension lines, pathLength-drawn) inside
   corner brackets; orange scanline sweeps it, scanned part turns orange; mono side labels ("Sheet A-101", "Scale
   1:100", "Reading drawings"); big "% measured" counter reaches 97 at 2.3 then 100 (engine holds at 2.3 until 3D loads)
02 take-off-complete | ink | 1.2 | "TAKE-OFF COMPLETE" decode (util `decode`), bracket/stamp flash
03 collapse-to-the-dot | ink | 1.8 | stars on; everything collapses into one orange dot
04 name | orange | 3.4 | huge 3-line name `C.person.lines` + period; mono subline title + tagline; landing rest at 1.5s
   (restAt 1.5, rest "scroll"); the period swells to cover the frame in ink at the end
05 word-burst | quad | 2.0 | four coloured cells (ink/orange/bone/ink), the four `C.words` slam in, cells shrink away to ink

about.js
06 location | ink | 3.6 | stars; rotating orthographic globe (d3-geo + world-atlas countries-110m from jsDelivr,
   fetched async, graceful if offline) turning to the home pin (Philippines), then orange great-circle arcs drawn to
   the two `C.location.markets` (Doha, Chicago) with labels; "Based in Philippines · Open to relocation"
07 timezone | orange | 3.0 | three analog clocks + digital times, live (Intl, tick): home + both markets; the hands
   sweep from midnight to now during anim; headline like "THREE TIME ZONES."
08 education | bone | 3.4 | degree (outline type), school, place; photo placeholder frame (see null rules); years only if set
09 values | ink | 3.2 | rest; stars; two columns "What I value" (`C.values`) / "Where I'm going" (`C.goals`)
   as bordered pill rows ticking in; a big "PRECISE." style word

experience.js
10 experience | orange | 2.0 | turn [1.45,"ink"]; "EXPERIENCE" slides, flood to ink
11 roles-rest | ink | 3.4 | rest; stars; the two `C.work` roles as big rows (role, company, place, summary), plus the
   five `C.responsibilities` as a compact list
12 process | bone | 4.0 | rest; "HOW I BUILD AN ESTIMATE": the 5 `C.process` steps as numbered nodes on a drawn
   line (dimension-line style), each with step, tool and text, entering in turn

toolkit.js
13 toolkit | orange | 2.0 | turn [1.75,"bone"]; house slides in from the left, "TOOLKIT." model scene
14 exploded | bone | 3.0 | house explodes, six labelled layers (tag3 + leader) tracked with env.model.project in tick
15-20 | ink | 2.5 each | one per part, in order roof, walls, windows, door, slab, foundation (slugs `layer-roof` …):
   camera pushes onto that part (house stays exploded), outline part name, group title, skills tick in (primary in
   orange). name = "<Part> · <Group>"
21 built-rest | ink | 4.0 | rest at ~1.15; house reassembled, centre, slow idle; "BUILT." headline; six
   `.chip[data-part]` tabindex=0 chips (main.js wires hover/focus to the skills panel + ring); rest hint
   "hover a layer to see its skills"; house flies off (px 16) at the end

work.js
22 services-rest | orange | 6.0 | rest at ~4.8; "HOW I CAN HELP": the six `C.services` as cards (field colour per
   card) entering in turn on a grid/belt, numbered 01-06
23 market-qatar | C.showcases[0].field | 4.0 | rest; big title, ghost letters, pitch, `steps` struck through/ticked in,
   stack line, rotating badge (big/small); a mock **drawing sheet** (title block, plan lines, dimension callouts) in
   place of a phone; link "Discuss a project" → mailto from C.contact
24 market-chicago | C.showcases[1].field | 4.0 | same layout, mirrored
25 credentials-rest | ink | 4.6 | rest; the four `C.certs` as `.cert` cards (div, not link, when url null), rotating badge
26 blast | ink | 5.0 | turn [0.2,"orange"]; `C.contact.headline` mega; `C.contact.pitch`; contact rows (links with
   arrows; non-link rows plain); footer "© 2026 Miko De Peralta" + LinkedIn

## Quality bar

Premium dark/orange/bone editorial film with an architectural-drawing flavour; everything inside 1920x1080 with
margins ≥ 90px, no overflow or overlapping text; legible when the stage is scaled to ~0.6; no console errors; all
links real. Keep each file under ~700 lines. Do not touch files you do not own; report interface issues instead.
