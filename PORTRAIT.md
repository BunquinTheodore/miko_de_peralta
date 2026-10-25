# Round 2 brief: phone (portrait) layout, no overlapping text, smooth on phone and desktop

Applies to every scene file. Read this whole file, then re-read `CONTRACT.md` if needed.

## What changed in the engine (already done, don't edit these files)

- `js/scenes/util.js` exports `STAGE` = `{ w:1920, h:1080, portrait:false }` or `{ w:1080, h:1920, portrait:true }`, decided
  once at load (portrait when the window's width/height < 0.9). `?layout=portrait` / `?layout=landscape` forces one.
  Crossing orientations reloads the page, so a scene builds for exactly one layout. `import { STAGE } from "./util.js"`.
- main.js sizes `#stage` and the `#model` canvas to `STAGE.w x STAGE.h`; the generic iris is centred on the stage.
- house.js renders to `STAGE.w x STAGE.h` with the same camera (fov 30 vertical at z 14). In portrait the frame shows
  7.5 units tall x 4.22 wide (256 px per unit); `env.model.project()` returns portrait stage px.
- The photo is in: `C.person.photo = "img/miko.jpg"` (480x480 head-and-shoulders portrait, light grey backdrop, dark suit).
- Outline type: `.ol` / `.ol-sage` now draw `-webkit-text-stroke: 6px` with `paint-order: stroke fill` and fill with
  `var(--paper)` (set per field on `.scene.ink/.sage/.bone/.quad`). This hides the stray lines Geist's overlapping
  contours caused inside letters. If an outline element sits on a backdrop other than its scene field (a card, a cell),
  set `--paper` on it to that backdrop colour. Don't add your own `-webkit-text-stroke` rules; use `.ol`.
- No decorative dash/line before label text anywhere (the user asked for this; `.eyebrow::before` is gone).

## Your job

1. **Portrait layout for every scene in your file**, branching on `STAGE.portrait` (html, anim targets/offsets, tick,
   poses). Same scenes, slugs, fields, durations, `turn`, `rest`/`restAt`, act labels, and the same content: nothing may
   be dropped on phones. Landscape must keep looking as it does now (only apply the fixes listed for you below).
   Prefer one builder with a small layout table over duplicating whole scenes.
2. **Portrait sizing.** On a 390px-wide phone the stage is scaled to ~0.36, so in portrait: running text ≥ 40px,
   mono labels ≥ 28px (letter-spacing ≤ .2em), nothing smaller than 26px; display type sized so the longest line fits
   the content width. Side margins ≥ 90px, top/bottom ≥ 150px (HUD corners, progress pips and act label sit there).
   Stack columns vertically; at most two columns for short items (chips, pills, cards). Put the 3D house in one half
   and text in the other; it must not cover text.
3. **No overlapping text, in both layouts.** Run the audit (below) for each of your slugs in landscape (1440x900) and
   portrait (390x844); it must report zero issues. Mark purely decorative text (ghost letters, background numerals)
   `aria-hidden="true"`. The audit ignores it. Then look at screenshots at the rest/settled frame and mid-animation for
   anything the audit can't see: text over the 3D model, icons spilling out of pills, clipped glyphs.
4. **Performance** (it must not lag on phones):
   - Animate only `transform`/`opacity` (and SVG `stroke-dashoffset`). No tweening of width/height/top/left/font-size.
   - No CSS `filter` (`drop-shadow`, `blur`) or `backdrop-filter` on large or animated elements. Use a static
     `box-shadow` or a duplicate stroke for glow, and no animated box-shadow.
   - Keep `tick` cheap. Cache element refs at first call, write DOM only when a value changed, and never read layout in
     tick except `env.model.project`.
   - Keep SVG node counts modest. Avoid huge offscreen elements and nested `will-change`.

## How to test

A server is already running from `C:\Miko` on port 8791. Don't start or stop servers. Use the Chrome DevTools MCP tools;
other agents share the browser, so open your **own** page with `new_page` and never close or navigate other pages.
- Landscape: `http://localhost:8791/index.html?layout=landscape`, page resized to 1440x900.
- Portrait: `http://localhost:8791/index.html?layout=portrait`, page resized to 390x844.
- Wait ~4s for load, then load the audit and run it:
  `const s=document.createElement("script"); s.src="/tools/audit.js?"+Date.now(); document.head.append(s); await new Promise(r=>s.onload=r);`
  `__audit("slug")` checks one scene at its settled frame; `__audit("slug", sec)` checks a given time.
- `__seek("slug", sec)` freezes the film at a time for screenshots. Scrub back to 0 and forward again to check reversibility.

Touch only your own file. Report the audit results for both layouts, what you changed, and any interface concerns.

## Addendum: smooth scrolling, both directions

- **Floods/irises inside your scenes:** don't scale a huge disc (e.g. 4500px `border-radius:50%` scaled from 0.01).
  On phones that needs an enormous GPU layer and stutters. Use what the engine's wipe now does: a full-stage plane
  (`position:absolute; inset:0`) whose `clip-path: circle(Rpx at Xpx Ypx)` tweens from 0 to the distance to the
  farthest corner. GSAP tweens `clipPath` strings fine. Don't use the `.iris` class for new code (it's legacy).
  The engine's own wipe class is `.wipe`.
- **Scroll back must look identical to scroll forward** at every time. Seek each scene to its end, then step backwards
  (`__seek(slug, t)` for t from dur down to 0 in 0.1s steps) and compare against the forward pass. Watch for elements
  left visible or hidden, counters and decodes showing the wrong value, and model poses. The engine now resets a scene's
  timeline to 0 and re-renders it when the scene becomes active, so poses come from your timeline alone.
- **Big blocks of text** that move every frame: prefer `yPercent` and `opacity` on a few wrappers over staggering
  dozens of tiny elements.
