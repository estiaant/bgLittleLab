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
