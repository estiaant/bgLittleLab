# Working on Little Lab

## Preserve the game

The current visual style is approved. Preserve its pixel art, warm wood and cream,
plum outlines, muted rose/sage/teal palette, monospace typography, chunky borders,
hard shadows, room compositions, gentle motion, and original synthesised music.
Use existing screenshots and the running game as the visual baseline. Do not
redesign, swap fonts, smooth the canvas, replace artwork, or introduce a UI kit.

## Keep changes simple

Use Ponytail for implementation and Impeccable for UI review when available.
Prefer plain JavaScript, CSS, browser APIs and Python's standard library. No npm
installation, framework, bundler, backend, or new dependency is needed.
Make focused changes; do not rewrite the canvas renderer or split files merely
for architecture. Keep scientific assumptions and units explicit and correct.
Preserve offline operation, local notes, journal persistence and CSV export.

## Files and workflow

- `index.html`: development entry point and static page structure.
- `style.css`: responsive layout and visual treatment.
- `js/resource-data.js`: four original experiments and teaching content.
- `js/game.js`: canvas art, scenes, fifth experiment, calculations and interactions.
- `build_standalone.py`: generates `play-offline.html`; edit sources, then rebuild.
- `PROJECT_OVERVIEW.md`: project map, setup and next steps.
- `LittleLab_Cozy_Pixel_Adventure.zip`: original starter archive; preserve it.

Work in the existing `/workspace/littlelab` checkout. Cloud tasks are already
isolated; do not create a worktree unless explicitly requested.

Run from the project root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

After source changes:

```sh
node --check js/game.js
node --check js/resource-data.js
python build_standalone.py
```

For gameplay changes, exercise the affected experiment, quiz and journal in a
browser. For UI changes, inspect desktop and 390px mobile, including overflow and
keyboard focus. Verify both entry points. Do not replace meaningful gameplay
checks with syntax checks alone. Do not claim the historical test report is a
current test run. Keep generated standalone output in sync with source.
