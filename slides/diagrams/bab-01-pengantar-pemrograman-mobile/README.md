# Chapter 1 diagram specs

`slide-diagrams` kit specs for `slides/bab-01-pengantar-pemrograman-mobile.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so that
flat folder is shared by all 15 chapters — the moment one deck puts specs there, every
deck loads every other deck's specs and the builds fail with "names slide … but no ##
heading matches" and "duplicate id". Chapter 1 specs therefore live here and are always
built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-01-pengantar-pemrograman-mobile.md

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-01-pengantar-pemrograman-mobile --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-01-pengantar-pemrograman-mobile

# facts table for the whole deck (read-only)
node $SKILL/scripts/build.mjs $DECK --audit

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-01-pengantar-pemrograman-mobile --png 04
```

Output: `slides/assets/diagrams/bab-01-pengantar-pemrograman-mobile-NN.svg`, placed on the
slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `beforeAfter` | When to Choose Which? | four priorities ↔ the approach each one favors |
| 03 | `flow` | The Evolution of Mobile Technology | feature phones → iPhone → app stores → mobile web → cross-platform |
| 04 | `tree` | React Native: Core Concepts | JavaScript/JSX → React Native → ViewGroup on Android / UIView on iOS |
| 05 | `layers` | How React Native Works | JavaScript on top, bridge in the middle, native at the bottom |
| 06 | `flow` | General Architecture of a Mobile App | presentation → business → data → server over HTTP + JSON |
| 07 | `tree` | What Is a Mobile App? | the definition with its two facets, and the five bullets under them |
| 08 | `beforeAfter` | Four Approaches (1): Native & Web Mobile | made with ↔ costs to ship, two paired rows |
| 09 | `layers` | Four Approaches (2): Hybrid & Cross-platform | interface (HTML/CSS/JS) inside WebView inside native container |
| 10 | `beforeAfter` | Fragmentation vs Consistency | consequences for Android ↔ consequences for iOS, three paired rows |
| 11 | `beforeAfter` | What React Native Is Not | not native: the JavaScript code; native: the interface it displays |
| 12 | `flow` | Expo: Three Main Components | Expo SDK 57 → Expo Go → EAS, joined by `expo start` and publish |
| 13 | `beforeAfter` | Expo: The Price You Pay | three costs ↔ the verdict: not blockers, or the trade-off |
| 14 | `beforeAfter` | When Is React Native the Right Fit? | right fit ↔ better written natively, two matched rows |
| 15 | `beforeAfter` | Case Study: Campus Needs | the three problems ↔ the two requirements formulated |
| 16 | `layers` | Competencies and the Map of 15 Chapters | Chapters 2–7 at the base, 8–11, 12–15, Final Project on top |

Ids 02–06 reuse the file names of the old Mermaid charts (the `.mmd` files stay in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output
and the deck's image lines did not move. Ids 07–11 are new pictures from the
text-density pass: five prose slides, each given one diagram, with the bullets the picture
repeats moved verbatim into that slide's presenter notes under "Trimmed to the picture
(the diagram says this)". No slide was added, none removed, and no bullet was deleted.

Pattern mix after that pass: `beforeAfter` 4, `flow` 2, `tree` 2, `layers` 2 — no pattern
holds more than half of the chapter's ten diagrams.

Ids 12–16 are the second density-first pass, on the five remaining prose slides of the
chapter's second half (21, 22, 24, 29, 32). Ten bullets and one closing sentence moved
verbatim into the presenter notes; `trim_check.py` reports "bullets lost: 0". No slide was
added or removed (39 before, 39 after).

Pattern mix after both passes: `beforeAfter` 7, `flow` 3, `layers` 3, `tree` 2 — 15
diagrams, and `beforeAfter` at 7 is just under half, which is the edge this chapter can
reach: four of its slides are laid out as two columns, and this chapter's own README
already argued that two columns are the shape `beforeAfter` renders.

## Decisions worth knowing before editing 12–16

- **12 is `flow`, not `tree`.** The heading says the three are components *of* Expo, so
  containment was the first reading, but `tree` renders `label` only — every job description
  would have been lost — and a two-level tree is left-packed at a fixed width, leaving half
  the canvas empty (the same argument as spec 04). The chain is the chapter's own: `npx expo
  start` is practiced in Chapter 2, publishing is explained in Chapter 15.
- **13's rows are not paired one to one, and two of its rows repeat the two bullets that
  stay on the slide.** Rule: a slide that had bullets keeps at least two, and this slide has
  three, so only one could leave. The left panel is the price list, the right panel is the
  verdict the blockquote states; the build's badges must not be read as pairs (Chapter 2's
  spec 09 carries the same warning). The alternative — a picture of the verdict only — was
  rejected as too thin for a slide whose subject is the price list.
- **29 was drawn twice.** `tree` with the university at the root and both branches whole
  (8 nodes) was built first and is 358 canvas units ≈ 346px on the slide; with five bullets
  below it the render clipped at the footer. `beforeAfter` at three rows is 270px and fits.
  The bold sub-heading "The requirements formulated" left the slide in the same edit because
  the panel header now carries it — the build reports that label as not on the slide, the
  same way it reports `NOT NATIVE` for spec 11.
- **16's closing sentence moved into the notes.** Four `layers` bands are 354 units ≈ 342px;
  heading + picture + label + two bullets + "The peak: the Final Project …" overflowed the
  604px content box (measured: slide 32 clipped below y=700 in the Marp render). The sentence
  is the accent band, word for word, so the prose could go.
- **29 and 32 lost their `grid2` wrapper.** With one column's bullets in the notes, a
  half-empty two-column grid reads as a mistake; both slides are now a single column under
  the picture. Slide 29's closing line became a blockquote, the way this deck already marks
  a one-sentence takeaway under a picture (slides 8, 9, 15, 20); slide 32's closing sentence
  moved into the notes instead, because the bands left no room for it.

## What this chapter deliberately does not draw

- **Every table slide** (characteristics 1–4 and 5–7, the design-decision map, Table 1.1 in
  two halves, the Android/iOS comparison, the advantages table, the three client layers,
  the real-world app examples, the architecture decision, the references). A spec sheet is
  already in its clearest form.
- **Lists of peers** (the practicum steps), the quiz and its answers, the summary, and the
  code slide. Three of the lists this section used to name — Expo's three components, the
  three prices of Expo, and the map of the fifteen chapters — now carry pictures 12, 13 and
  16, because the second pass is density-first by instruction and each of those lists turned
  out to have a shape (a chain, a ledger, a stack).
- **Metro** in diagram 05: the old chart drew the bundler feeding the JavaScript side.
  `layers` cannot show a feeder beside a stack, and putting Metro above JavaScript would
  say it sits between the code and the runtime.

Two slides this README used to list as deliberately undrawn — "Four Approaches (1) and (2)"
and "Fragmentation vs Consistency" — now carry diagrams 08, 09 and 10. That earlier decision
("two columns already read as parallel columns") is exactly the shape `beforeAfter` renders
with paired rows, and the pass that produced 07–11 is density-first by instruction.

## Two decisions worth knowing before editing 07–11

- **Diagrams 08 and 10 do not mirror their slides.** A three-row mirror of the slide's two
  columns was built for diagram 08 first and read as the same sentences printed twice, so
  each picture keeps the rows whose bullets leave the slide and the prose keeps the row the
  picture omits. Diagram 10 could not do that (its iOS column covers every fact with two
  bullets, and a slide must keep at least two), so it does mirror, and the iOS column below
  it repeats the picture's right panel on purpose.
- **"NOT NATIVE" in diagram 11 is not a substring of the slide text.** The slide says the
  same thing in the other order ("the interface it displays, not the JavaScript code"), and
  a panel header has to name its side before the row is read. The build reports it.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
