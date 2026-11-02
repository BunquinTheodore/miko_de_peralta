# Miko De Peralta · Construction Estimator

Portfolio site for Miko De Peralta, pre-construction estimator for luxury residential projects (Qatar, Chicago).
A scroll-driven "film": 31 scenes scrubbed by scroll (the original 26, plus five from the résumé: a "By the numbers" scene, three role scenes and a technical skills scene), a procedural three.js house that splits into the six layers of
his toolkit, and architectural-drawing styling in ink, sage and bone.

## Run

No build step. Serve the folder statically and open it:

```sh
python -m http.server 8000
# http://localhost:8000
```

## Edit content

All copy lives in `js/content.js` (name, experience, process, skills per house layer, services, markets, credentials,
contact). The photo is `img/miko.jpg`. Résumé details live under these keys:

- `person.titles` and `person.summary`: the résumé headline titles and professional summary.
- `record`: the "By the numbers" heading and its stats (`value`, `unit`, `label`, `note`).
- `roles`: the full résumé roles, newest first (`title`, `subtitle`, `org`, `place`, `period`, `highlights`).
  The shorter `work` rows stay as the summary used by the experience scene.
- `scopes`: the résumé technical skill groups (`group`, `items`), shown after the toolkit.
- `education.years`: graduation years, now set.

The graduation years TODO is resolved, and role years now live in `roles[].period`. The home city is still a TODO;
the scenes hide anything that is `null`.

## Layouts

- Landscape screens get a 1920x1080 stage, portrait screens (phones) a 1080x1920 stage with its own layout per scene.
  Rotating across orientations reloads the page.
- `?layout=portrait` or `?layout=landscape` forces one, for testing on a desktop.

## Structure

- `js/main.js`: engine. Builds scenes, fits the stage, maps scroll to film time, draws stars, grain, cursor and HUD.
- `js/house.js`: the procedural 3D house (parts: foundation, slab, walls, windows, door, roof).
- `js/scenes/*.js`: the scenes, in film order (`boot`, `about`, `experience`, `record`, `toolkit`, `scope`, `work`).
  - `js/scenes/record.js`: the résumé "By the numbers" stats and roles, after the experience scenes.
  - `js/scenes/scope.js`: the résumé technical skill groups, after the toolkit house.
- `CONTRACT.md` and `PORTRAIT.md`: the scene interface and the layout and performance rules.
- `tools/audit.js`: dev-only checker. Load it in the console on a running page and call `__audit()` to list any
  overlapping or off-frame text across all scenes.
