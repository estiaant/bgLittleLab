# Interactive experiment update — 28 October 2026

The approved pixel art, colours, typography, music and native stack are retained.
The simulation fills the main frame. Variable controls occupy a clipboard prop
at its side; on narrow screens the clipboard stacks beneath the scene to keep
controls usable. The original painted Field Notes board opens a keyboard
accessible notebook for the active experiment.

## Animation choices

Playback is compressed, not a real-time scientific simulation. Normal playback
lasts 0.65–1.7 seconds; reduced-motion playback is 0.35 seconds. Variables affect
travel, release position, object size, climb geometry, pace, clouding time or
poured volume. Extreme combinations trigger deterministic fictional effects:

| Experiment | Trigger | Effect |
| --- | --- | --- |
| Trolley | Ideal common velocity ≥ 2 m/s | Joined trolleys tumble onto a mat |
| Drop | Mass × release height ≥ 2 kg·m | Cushion seams pop |
| Stairs | Sprint ≥ 1.5 m/s upward and rise ≥ 3 m | Wobbly finish |
| Cross | Temperature ≥ 35 °C and concentration ≥ 0.3 mol/dm³ | Frothy spill |
| Titration | Ideal endpoint volume ≥ 40 mL | Flask overflow |

The numerical results remain ideal-model values. Notes explicitly distinguish
these results from fictional mishaps. No real chemistry procedure is added.

## Notes and printing

Recorded runs show named variables and units, results and observations. Graphs
use the source experiment's declared axes, with titration plotting acid
concentration against endpoint alkali volume. Points are recorded runs, not a
fitted curve; a warning explains that other variables can differ. The latest
run's model, equation and quiz remain available after reloading. Old journal
entries remain compatible. CSV export and clear actions are scoped to the
current experiment; the desk journal includes all experiments.

Print Field Notes opens the native print dialog. Print CSS produces a cream
report with plum borders, variable tables and graphs, excluding game controls
and quiz buttons. Long histories can span multiple sheets.

## Validation

`node tests/gameplay.cjs` passed in Chromium: five default outputs, five extreme
mishaps, scoped run tables and graph points, reload persistence, quiz feedback,
CSV download, print invocation and PDF output, dialog focus containment, desktop
and 390px mobile checks, standalone HTTP entry point and no uncaught page errors.
JavaScript syntax checks, standalone generation and Wrangler dry-run also passed.
A local Worker served game assets and excluded the source archive, docs, tests
and Git metadata. Direct file-URL testing and physical printing were not performed.
