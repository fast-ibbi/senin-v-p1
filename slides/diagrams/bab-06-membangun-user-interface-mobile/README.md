# Chapter 6 diagram specs

`slide-diagrams` kit specs for `slides/bab-06-membangun-user-interface-mobile.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so
that flat folder is shared with Chapter 5 — the moment Chapter 6 put its specs there,
each deck loaded the other's specs and both builds failed with "names slide … but no
## heading matches" and "duplicate id". Chapter 6 specs therefore live here and are
always built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-06-membangun-user-interface-mobile.md

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-06-membangun-user-interface-mobile --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-06-membangun-user-interface-mobile

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-06-membangun-user-interface-mobile --png 04
```

Output: `slides/assets/diagrams/bab-06-membangun-user-interface-mobile-NN.svg`, placed on
the slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `beforeAfter` | Four Principles Working Together | four principles ↔ their technical form |
| 03 | `flow` | The UI-First Approach | wireframe → static screen → Ch. 7 → Ch. 8 → Ch. 10 |
| 04 | `sequence` | Data Flow: Data Down, Events Up | data travels down, events travel up |
| 05 | `layers` | Principle 4 — Thumb-friendly | thumb-reach zones |

Ids 02–04 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output.
Id 05 is a new picture.

### Second half of the deck (density pass)

| id | pattern | slide | content | width |
|---|---|---|---|---|
| 12 | `beforeAfter` | List: Item Consistency | one-line item shape vs two-line, and which one this app uses | `w:1120` |
| 13 | `tree` | Header and Bottom Navigation | screen → its two regions → the elements each region holds | `w:1000` |
| 15 | `beforeAfter` | Responsive Design: Five Tools | `flexWrap` when narrow, `maxWidth` when large | `w:1120` |
| 16 | `beforeAfter` | Accessibility: Four Basic Practices | screen-reader props vs the size of the touch target | `w:1120` |

Id 13 is the only picture in the deck that is not `w:1120`. Five leaves make a 358-unit
canvas, which pushed the two-column grid under it onto the footer; the header's two action
slots now share one chip (296 units), and `w:1000` keeps the 16px node labels at 13.8px
effective — above the 13px floor. Raising the width back toward 1120 re-opens the collision.

Ids 11 and 14 existed briefly during this pass and were deleted: the same measurement showed
that two slides in this range cannot hold a legible picture without deleting content.

- **Button: Four Variants** — a four-row spec table (variant / appearance / purpose) plus the
  lead line fills the slide; what is left over is ~120px, less than a single before/after row.
  The pass may not trim bullets below two, and this slide has exactly two. A spec sheet is
  already its own clearest form.
- **Color: Layered Palette and Contrast** — an eight-row palette table plus two bullets leaves
  ~80px; the smallest honest palette picture (three bands) needs 255px.

Both were skipped rather than drawn small: a picture whose labels fall under 13px effective
is worse than no picture.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
