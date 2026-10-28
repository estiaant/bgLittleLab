# Little Lab — browser test report

Tested with headless Chromium 144 using Playwright after creating the embedded standalone HTML. The same scene and science code is used in the multi-file edition.

## Confirmed

- Main menu opens desk; desktop and mobile render at expected widths; no horizontal overflow at 390 px.
- Desk coffee and notebook can be picked up; left-hand notebook expands; paper editor opens and enforces a 160-character limit; notes remain when put down and picked up again.
- Room navigation works from top bar and in-world lab entry cards.
- All five experiments open, accept variable-band selections, run animated visual sequences, and show mathematically calculated outputs.
- Momentum model: total before/after momentum equal in ideal inelastic collision.
- Gravity model: `t = sqrt(2h/g)`, independent of ball mass.
- Stair model: `P = mgh/t`, with vertical pace treated explicitly.
- Disappearing X: cross starts visible, fades during cloudiness, and ends hidden.
- Titration: 1:1 mole relationship correctly yields endpoint alkali volume.
- All five experiments produce a quick question with checked feedback.
- Journal saves completed trials, loads them in a table, and exports a `little-lab-field-notes.csv` download.
- Artwork continues showing the end-state of an experiment after the run finishes.
- Room-specific original Web Audio arrangements synthesize after a user gesture; music toggle switches on/off.
- No uncaught page errors occurred in the scripted desktop/mobile passes.

## Sample ideal outputs at default controls

- Momentum: 0.5 kg × 2 m/s into a stationary 0.5 kg trolley → **1 m/s** common velocity.
- Free fall: 2 m drop → **~0.639 s**.
- Stair sprint: 55 kg, 3 m, 0.5 m/s upward → **269.5 W** (6 s, 1,617 J).
- Disappearing X: 0.1 mol/dm³ and 20 °C → **60 s** to virtual cloudiness threshold.
- Titration: 0.1 mol/dm³ HCl, 25 mL; 0.2 mol/dm³ NaOH → **12.5 mL**.

These are idealised teaching models and deliberately compressed animation timings, not measured field data.
