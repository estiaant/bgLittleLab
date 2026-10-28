# Science models and discrete animation bands

## Design principle

This is not a rigid four-video branching game. Each changeable variable has **four preset selectable values**. The **animation family** is one of roughly four behaviours per experiment and the displayed instrument results are computed deterministically from the selected values. This preserves accurate trends without a continuous rigid-body, molecular-dynamics or human-biomechanics solver.

The models are reproducible: choose the same settings and receive the same outputs. All display animation uses accelerated **wall-clock playback**, while timers on screen show scientific **simulated time**.

## Station 1 — Conservation of momentum

Inputs:
- Red trolley mass `m1`: 0.5, 1.0, 1.5, 2.0 kg.
- Blue trolley mass `m2`: 0.5, 1.0, 1.5, 2.0 kg.
- Red initial velocity `u1`: 1, 2, 3, 4 m/s.
- Blue initial velocity `u2`: 0 m/s, always.

Model: trolleys stick together after collision (perfectly inelastic). External horizontal forces negligible.

- `p_before = m1 * u1`
- `v = (m1 * u1) / (m1 + m2)`
- `p_after = (m1 + m2) * v` (must equal `p_before`).
- `KE_before = 0.5 * m1 * u1²`
- `KE_after = 0.5 * (m1 + m2) * v²`
- `KE_lost = KE_before − KE_after`

The red trolley moves across the screen and both carts stick and move together. The selected launch-speed band controls arrow length and perceived movement. Mass band changes visible weights. The post-impact speed and kinetic energies remain calculated, not invented. The animation is illustrative; pixel distance per display second is not a calibrated metre scale.

Recommended controlled-variable investigation: fix red mass and speed, vary blue mass; compare common velocity. Physics language should state the *system* (two trolleys) is approximately isolated.

## Station 2 — Free fall

Inputs:
- Drop height `h`: 0.5, 1.0, 2.0, 4.0 m.
- Ball mass `m`: 0.1, 0.2, 0.5, 1.0 kg.

Constants: `g = 9.8 m/s²`, initial vertical velocity = 0, negligible air resistance.

- `t = sqrt(2h / g)`
- `t² = 2h / g`
- `g = 2h / t²`
- `impact speed = gt`

Animation length on screen is chosen for visibility, while the displayed scientific time is the calculated `t`. Drop-distance motion uses `progress²` to illustrate constant downward acceleration from rest. Different ball masses produce different sprite sizes but **not** different fall times.

Suggested graph: drop height versus time squared. The theoretical slope is approximately 4.9 m/s², because `slope = g/2`.

## Station 3 — Stair sprint

Inputs:
- Character mass `m`: 40, 55, 70, 85 kg.
- Vertical height `h`: 1.5, 2.0, 3.0, 4.0 m.
- Vertical ascent speed: walk 0.50, jog 0.75, run 1.00, sprint 1.50 m/s.

This last input is *vertical* speed for the simplified model, not travel speed along the steps.

- `g = 9.8 m/s²`
- `work = mgh` joules, against gravity.
- `time = h / vertical_ascent_speed` seconds.
- `average power = work / time` watts.

The user sees a pixel character climb different numbers of steps. Animation timing is adjusted for accessibility rather than being an accurate representation of human gait. In a same-mass/same-height trial, increased climbing speed reduces time and increases power; work does not change.

The power figure is useful mechanical average power **against gravity**, not total metabolic power; the body requires additional energy in reality.

## Station 7 — Reaction rate, disappearing cross

Inputs:
- Sodium thiosulphate concentration: 0.10, 0.15, 0.20, 0.30 mol/dm³.
- Temperature: 20, 25, 30, 35 °C.

Controlled: total mixture volume; hydrochloric acid concentration and volume; identical viewing geometry and endpoint threshold.

Chemical equation:

`Na₂S₂O₃(aq) + 2 HCl(aq) → 2 NaCl(aq) + SO₂(g) + S(s) + H₂O(l)`

The solid sulphur particles make the liquid cloudy. The game models time to a *fixed* cloudiness endpoint using a deliberately simplified response surface:

`t_seconds = (6 / c) / [1.45 ^ ((T − 20)/10)]`

where `c` is the displayed thiosulphate concentration in mol/dm³ and `T` is temperature in °C. Examples for 20°C: 0.10 → 60 s, 0.20 → 30 s, 0.30 → 20 s. This is an **illustrative algorithm**, not a measured rate law and **not** a claim that temperature universally changes rates by this precise factor. The 1.45 factor is a game tuning choice.

`relative_rate = 1 / t_seconds` with units s⁻¹. This is a relative-rate proxy because the same opacity endpoint is used in every trial, not an absolute reaction rate expressed as mol·dm⁻³·s⁻¹.

The game draws a transparent flask over an X, then gradually overlays opaque yellow pixels as sulphur forms. Higher concentration and temperature shorten the *reported scientific time*, and visual playback runs somewhat faster for faster reactions, but a 60-second result does not require a 60-second real-time wait.

**Safety:** Actual thiosulphate–hydrochloric acid reactions can liberate irritating SO₂. This game includes no instructions to reproduce them unsupervised.

## What is and is not simulated

**Simulated:** variable relationships, ideal values, event phases, a visible endpoint, scientific timer, momentum and energy totals, graphing and predictions.

**Not simulated:** microscopic collision dynamics, wheel friction, instrument calibration, stochastic measurement noise, camera/parallax effects or sophisticated chemistry kinetics.

## Future realism

Add an optional `realistic measurement` mode later, with small bounded, seeded noise and explicit instrument resolution. Avoid changing the theoretical relationships. Also add learner-built tables, graph-fit gradients, validity evaluation and controlled-variable prompts.
