# Little Lab ♡ — a tiny science adventure

A **cute, hand-drawn pixel-art, entirely offline** science game, based on the familiar Little Wooden Desk aesthetic. Explore three places: the desk, the physics lab, and the chemistry lab. Each room has its own pixel worktop, equipment, and original low-volume chiptune arrangement.

## Start here

**Easiest:** open `play-offline.html` in a current browser. Everything is bundled into that one file, including the artwork and music engine. No installation, internet, account, dependencies, or network requests.

**For development:** open `index.html` instead. Its source lives in `style.css`, `js/resource-data.js`, and `js/game.js`. Put the folder on a static host or launch directly from local storage. Run `python build_standalone.py` to update the single-file edition after editing the source.

### Play loop

1. Select **START EXPLORING** from the cosy desk.
2. Pick up the coffee cup or notepad; click an empty part of the table to place it somewhere new. With the notepad held, click the large page and write up to 160 characters. Personal notes are saved locally where browser storage allows.
3. Use the two cute postcards on the table or the room bar to go to the **Physics Lab** or **Chemistry Lab**.
4. Tap equipment or its station card. A dedicated **front-facing pixel-art close-up** opens, retaining the same colour palette, outline style, and visual language.
5. Select variable bands, optionally predict a result, click **RUN EXPERIMENT**, and observe the animation.
6. Review the numerical result, model equation, and a short knowledge question. All completed experiments go into the **Journal**, with CSV export.
7. Toggle the **♫ MUSIC** button at any time. The three original synthesis tracks adapt to the room; audio starts only on a user gesture.

## Five interactive experiments

| Room | Experiment | Variables | Main output |
| --- | --- | --- | --- |
| Physics | Momentum trolley collision | Red and blue mass, red initial speed | Final common velocity; before/after momentum and kinetic energy lost |
| Physics | Free fall | Release height, ball mass | Fall time, g, impact speed, t² |
| Physics | Stair sprint | Character mass, vertical height, vertical ascent pace | Work against gravity, time, average power |
| Chemistry | Disappearing X | Sodium thiosulphate concentration, temperature | Time to cloudiness endpoint; 1/time rate proxy |
| Chemistry | **Titration Tea (added)** | HCl concentration and volume, NaOH concentration | NaOH volume to equivalence |

The original resource packet has **three physics experiments and one chemistry experiment**, so this version preserves all four and **adds a second chemistry experiment**. The new titration model is a simple ideal 1:1 stoichiometric HCl/NaOH demonstration.

## Important modelling notes

- **Idealised, deterministic** outcomes: this is not a full physics/chemistry engine, nor a substitute for supervised real-world practical assessments.
- Trolley: perfectly inelastic collision with negligible horizontal external forces; the trolleys stick together.
- Gravity: 9.8 m/s², released from rest, no air resistance. Mass should **not** change the fall time.
- Stair climb: `mgh` and `mgh/time` model external mechanical work/power against gravity, not total metabolic energy.
- Disappearing X: illustrative time model `t = (6/c) / (1.45^((T-20)/10))`; **not** a measured or universal chemical rate law. Real thiosulphate + acid can release irritating SO₂. No unsupervised experimentation instructions are provided.
- Titration: `C_acid × V_acid = C_base × V_base` assumes strong monoprotic acid/base, 1:1 stoichiometry, with the indicator visually changing near ideal equivalence. It is not a detailed pH curve or instrument-resolution simulator.
- On-screen animations are compressed to a few seconds; numbers represent **simulated scientific time**, not actual wall-clock animation duration.

Additional source science notes and public references are in `docs/`. The base idea and four models came from the user's supplied resource pack; the desk aesthetics and game implementation were rebuilt. All artwork is drawn locally at runtime on a canvas. Music is original Web Audio synthesis, not sampled from existing games.

## Files

- `play-offline.html` — self-contained one-file game, best for sharing
- `index.html` — developer-friendly entry point
- `style.css` — pixel-themed styling and responsive layout
- `js/resource-data.js` — four packet experiments, questions, and variable bands
- `js/game.js` — scenes, animation, fifth experiment, science formulas, controls, journal, sounds
- `docs/ORIGINAL_POC_SCIENCE_MODELS.md` — underlying four models as supplied
- `docs/REFERENCES.md` — curricular resource links included in packet
- `build_standalone.py` — regenerates play-offline.html

## Browser compatibility

Modern Chrome, Edge, Firefox and Safari. CSV export requires Blob downloads. Local persistence may be disabled in private browsing or restricted `file://` contexts, but play works without storage. Intended for a computer, tablet or phone; on mobile the pixel scene sits above the experiment controls.
