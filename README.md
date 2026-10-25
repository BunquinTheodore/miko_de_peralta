# Miko De Peralta · Construction Estimator

Portfolio site for Miko De Peralta, pre-construction estimator for luxury residential projects (Qatar, Chicago).
A scroll-driven "film": 26 scenes scrubbed by scroll, a procedural three.js house that splits into the six layers of
his toolkit, and architectural-drawing styling in ink, safety orange and bone.

## Run

No build step. Serve the folder statically and open it:

```sh
python -m http.server 8000
# http://localhost:8000
```

## Edit content

All copy lives in `js/content.js` (name, experience, process, skills per house layer, services, markets, credentials,
contact). The photo is `img/miko.jpg`. A few values are still `null`/TODO (graduation years, role years, home city);
the scenes hide anything that is `null`.

## Layouts

- Landscape screens get a 1920x1080 stage, portrait screens (phones) a 1080x1920 stage with its own layout per scene.
  Rotating across orientations reloads the page.
- `?layout=portrait` or `?layout=landscape` forces one, for testing on a desktop.

## Structure

- `js/main.js`: engine. Builds scenes, fits the stage, maps scroll to film time, draws stars, grain, cursor and HUD.
- `js/house.js`: the procedural 3D house (parts: foundation, slab, walls, windows, door, roof).
- `js/scenes/*.js`: the scenes, in film order (`boot`, `about`, `experience`, `toolkit`, `work`).
- `CONTRACT.md` and `PORTRAIT.md`: the scene interface and the layout and performance rules.
- `tools/audit.js`: dev-only checker. Load it in the console on a running page and call `__audit()` to list any
  overlapping or off-frame text across all scenes.
