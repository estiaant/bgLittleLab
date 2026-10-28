# Little Lab

A small, entirely offline science adventure built with HTML, CSS and vanilla
JavaScript. Players explore a cosy pixel-art desk, physics lab and chemistry lab,
run idealised experiments, answer questions and keep a local field journal.
The current art direction is approved and should remain intact.

## Start and build

Requires a current browser. Python 3 serves development files and rebuilds the
standalone page; Node is useful for JavaScript syntax checks. There are no package
installs, lockfiles, external assets, accounts, secrets or backend services.

From `/workspace/littlelab`:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open the served `index.html` in your browser. For a downloadable single-file
edition, use `play-offline.html`. After editing source, run:

```sh
python build_standalone.py
```

See README.md for the play loop and scientific assumptions, AGENTS.md for change
constraints, and docs/STARTER_REVIEW.md for the initial review and current checks.

## Implementation map

| File | Responsibility |
| --- | --- |
| `index.html` | Canvas, navigation, sidebar and dialogs |
| `style.css` | Approved palette, borders, type and responsive layout |
| `js/resource-data.js` | Momentum, free fall, stairs and reaction-rate content |
| `js/game.js` | Titration data, state, canvas rendering, models, UI, storage, audio |
| `build_standalone.py` | Inlines CSS and JavaScript into `play-offline.html` |
| `screenshots/`, `preview.png` | Original visual references |
| `docs/` | Science references and validation notes |

Rendering uses a 640×400 canvas with pixel smoothing disabled. Static backgrounds
are cached; animated scenes use requestAnimationFrame. Room and experiment state
live in one closure. Notes, the latest 200 trials and the music preference use
`littlelab_v2_` localStorage keys with storage errors handled gracefully. Music
uses Web Audio oscillators, not downloaded tracks. No data is sent to a server.

## Development baseline

The original ZIP has been unpacked into this repository root, preserving the
archive and its source content. The standalone page was regenerated successfully.
No gameplay or visual refactor was needed for environment preparation. Keep the
small native stack until a concrete feature or measured problem warrants more.
Next: playtest this baseline, then make focused changes based on that feedback.

## Interactive experiment update

Experiment controls are a clipboard prop alongside the enlarged scene (stacked
below the scene on narrow screens). The painted Field Notes board is a keyboard
accessible button. It opens recorded runs for the current experiment, a scatter
plot using the experiment's declared axes, scientific notes and a printable
cream-and-plum report. Printing uses the browser's native dialog and works offline.
CSV export and clearing are scoped to the active experiment; the desk journal
still shows all experiments. Existing saved runs remain readable.

Animation time is compressed to 0.65–1.7 seconds and responds to the selected
variables. High incoming trolley momentum, heavy/high ball drops, tall sprints,
hot concentrated mixtures and high titration volumes trigger deterministic,
fictional mishaps. The ideal scientific result is kept separate from those effects.
Reduced-motion mode shortens playback and suppresses added rotations and bounces.

With the local server running, `node tests/gameplay.cjs` runs the browser smoke
check. It needs Playwright and Chromium (available in this cloud environment);
it adds no runtime dependency to the game. `BASE_URL` and `CHROMIUM_PATH` can
select another server or Chromium installation. Screenshots, a print PDF and CSV
are saved to a temporary directory reported by the check.

## Cloudflare deployment

The existing `littlelab` Worker deploys from GitHub `main` with
`npx wrangler deploy`. `wrangler.jsonc` configures static assets only; no Worker
script, backend, bindings or secrets are needed. `.assetsignore` publishes only
`index.html`, `play-offline.html`, `style.css` and `js/`, excluding the ZIP,
Git metadata, tests and documentation. Rebuild `play-offline.html` before pushing.

Deployment configuration was validated with Wrangler 4.154.0 in dry-run mode and
a local Worker. Local requests confirmed that game assets return 200 while the
archive, Git configuration, docs, tests and Wrangler configuration return 404.
A GitHub push triggers the connected build; confirming that the public deployment
finished is a separate check.
