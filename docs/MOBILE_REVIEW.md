# Impeccable mobile and UI review — 28 October 2026

**Verdict:** preserve the existing visual world. Its painted laboratory, warm
clipboard paper, plum outlines and native controls belong together. This pass
removes the unsuccessful failure effects and improves how that same interface
works on phones and tablets.

The Impeccable launcher and detector are unavailable in this environment. This
review applies the skill's audit/adapt guidance through source inspection,
Chromium screenshots, computed layout measurements and contrast calculations.
It is not a detector report, WCAG certification or a real-device test.

## Review scorecard

These are contextual manual ratings after the fixes, not measured compliance.

| Dimension | Score | Finding |
| --- | --- | --- |
| Accessibility | 2/4 | Native experiment controls and notes focus work; canvas-only desk interactions still need keyboard equivalents |
| Performance | 3/4 | No runtime dependencies; cached backgrounds; no mobile performance benchmark performed |
| Responsive design | 3/4 | Phone, tablet and short-landscape checks pass; physical iOS/Android validation remains |
| Theming | 3/4 | Approved single art direction preserved; colours remain largely literal values |
| Implementation integrity | 3/4 | Existing canvas art and semantic controls retained; no detector available |
| Total | 14/20 | Good, with accessibility follow-up still warranted |

A separate dark mode or a new design system is not a requirement for this fixed
pixel-art game. Neither is proposed as part of this review.

## Findings and changes

| Priority | Finding before this pass | Impact | Resolution |
| --- | --- | --- | --- |
| P1 | Run button text contrast was 3.10:1 | Small text failed WCAG 1.4.3 AA contrast | Mobile primary buttons use an existing plum shade for 5.04:1; feedback text also darkened |
| P2 | Variable controls used 11px text; prediction input used 13px | Hard to read; small form text can trigger Safari focus zoom | Mobile form controls use 16px text and 48px heights |
| P2 | Nav targets were 35–40px; back link was 21px | Small and closely spaced touch controls | Navigation and back targets are at least 44px |
| P2 | Landscape clipboard clipped controls in a short nested scrolling region | Running/resetting could require discovering a hidden inner scroll area | Full-height page flow; short landscape uses scene and clipboard side by side |
| P2 | Graph labels scaled to roughly 6px on phones | Axes and measurements became unreadable | Graph retains a readable width in a keyboard-focusable horizontal scroll region; a scroll hint explains access |
| P2 | Notes close control scrolled out of view | Leaving a long notebook required scrolling back | Paper header and close control stay pinned; notebook reopens at the top |
| P2 | Experiment name appeared only as tiny canvas lettering | Hard to identify the active experiment on a phone | Clipboard includes a readable experiment heading |

Related implementation: `style.css` mobile rules, `index.html` wall-note label,
`js/game.js` notebook rendering and focus handling.

Positive features retained: actual pixel-painted room artwork, native labelled
selects, keyboard-accessible room/station cards, notes focus containment, scoped
run history, printable graphs, offline operation and reduced-motion playback.

## Removal of failure effects

All five experiments now finish normally at every offered setting. Trolley
falling, cushion damage, stumbling, froth spills, flask overflow, failure
thresholds, alerts and new failure annotations were removed. Timing, masses,
heights, travel, climbing geometry, clouding and poured volume still respond to
variables. Numerical calculations are unchanged.

Existing saved measurements are not deleted. Old failure-annotation fields are
ignored in the displayed/printed notes; their scientific results remain usable.
The redundant observation column was removed from comparison tables.

## Validation

`node tests/gameplay.cjs` checks all five default and extreme scientific outputs,
quizzes, predictions, run-scoped tables and graphs, persistence, legacy journal
compatibility, CSV downloads, print invocation/PDF generation and standalone HTTP
operation. Mobile checks cover 320×740, 360×800, 390×844, 768×1024 and 844×390:

- No horizontal page overflow or clipped notebook content.
- Navigation, variables, prediction, back/run/reset targets meet 44px minimum.
- Form text is at least 16px; Run text contrast is at least 4.5:1.
- Clipboard has no hidden inner scroll area.
- Graphs retain readable width and scroll inside their own region.
- Close remains visible after scrolling a long notebook.
- Old annotations do not reappear and saved run counts remain intact.

Desktop was checked at 1440×1080. Browser captures use Chromium emulation; native
pickers, iOS keyboard behaviour, physical printing and real touch hardware still
need device testing. No full performance or whole-palette contrast audit was run.

## Remaining follow-ups

- **P1, accessibility:** cup/notebook canvas interactions have no complete keyboard
  equivalent. Location: `js/game.js`, canvas pointer/keyboard handlers. Native
  buttons for those actions would address keyboard access without altering art.
- **P2, accessibility:** the personal-note dialog does not yet share the journal's
  complete background-inert/focus-containment behaviour. Location: `openNote()`.
- **P2, validation:** test a real iPhone and Android device, including landscape,
  native selects, numeric keyboard and print/share flows.

If requested, use Impeccable harden for the remaining keyboard/dialog work,
adapt for device-specific issues, then polish for a final bounded visual check.
These can be taken separately or together; a later audit can reassess the score.
