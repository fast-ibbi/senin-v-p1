# Chapter 14 diagram specs

`slide-diagrams` kit specs for `slides/bab-14-debugging-testing-dan-quality-assurance.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively, and every deck lives in `slides/`, so
each deck keeps its specs here and is always built with `--specs`.

## The deck slug is longer than the legacy asset names

This deck's slug is 46 characters. The old Mermaid tooling truncated it to 40
(`bab-14-debugging-testing-dan-quality-ass-02.svg`), while the kit derives the output path
from the full deck slug. Ids 02–04 therefore keep their numbers — and their place on the
same three slides — but the deck's image lines now point at
`bab-14-debugging-testing-dan-quality-assurance-NN.svg`, which is what the kit can write.
The truncated `-ass-NN.svg` / `-ass-NN.mmd` files are left in `slides/assets/diagrams/`
untouched as the provenance trail; nothing references them any more. Chapter 3 went through
the same rename, so the deck now matches the convention in `slides/diagrams/README.md`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-14-debugging-testing-dan-quality-assurance.md
SPECS=slides/diagrams/bab-14-debugging-testing-dan-quality-assurance

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS
```

Output: `slides/assets/diagrams/bab-14-debugging-testing-dan-quality-assurance-NN.svg`,
placed on the slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `tree` | Server or App? Decision Flow | test the endpoint → two branch conditions → app side / server side |
| 03 | `layers` | Testing Pyramid | end-to-end (the fewest) / integration (fewer) / unit (many, accented base) |
| 04 | `stateMachine` | A Living Checklist and Regression Test Cases | bug → permanent guard → checklist rerun → catches regressions |
| 05 | `beforeAfter` | Diagram: Debugging State in Two Layers | logs vs React DevTools, with the two questions as matched rows |
| 06 | `flow` | Why This Chapter Exists | new feature → the part it breaks → regression, a decline in quality |
| 07 | `layers` | Error 3 — undefined is not an object | the three defences at the three depths of one data path: the read (`mahasiswa?.nama`), the state (`[]` or `null` + loading indicator), the response (`{ data: [...] }`) |
| 08 | `beforeAfter` | Case Study: The KRS Online Incident | the three field symptoms beside the two testing gaps the audit found |

Ids 02–04 replace the old Mermaid charts (`-ass-NN.mmd` still on disk). Id 05 is new, and
it is the only picture in this deck that needs a `## Diagram: …` slide: on the prose slide,
Marp pushed the last bullet of the two-column grid into the page number, which is a
collision, not a fit.

Id 06 is new as well, and it is the one picture in this folder that shipped with a trim:
the slide's first two bullets ("every new feature adds the chance that one change breaks
another part" and "that condition is called regression") are drawn in full by the three
chips, so they moved verbatim into that slide's presenter notes under "Trimmed to the
picture (the diagram says this)". Bullets 3 and 4 stay on the slide — the guessing and the
cost comparison are facts the picture does not show.

`Debugging State in Two Layers` (the prose slide itself) deliberately has **no** picture of
its own: spec 05 draws its two layers on the `## Diagram:` slide one page later, and a
second spec would duplicate that picture. Its three duplicated bullets — the two
questions plus "inspect the component tree…" — were trimmed into its notes pointing at the
next slide, leaving the mechanism of each layer on the slide.

## Second half of the deck (density pass)

Ids 07 and 08 add the two slides of this deck that were still pure prose in the second half.

- **07 — `layers`, `w:1120`.** One error, three defences, at three depths of the same data
  path; the array is written in dependency order (read → state → response), not in the
  slide's bullet order, and that reordering is the picture's contribution. The middle band
  carries the accent because the presenter notes tie the fix to Example 1's null state plus
  a loading indicator. Two bullets (the initial value, the response form) moved verbatim
  into the slide's notes, because the picture states them in full; four bullets, the
  blockquote and a 266px picture do not fit above the footer.
- **08 — `beforeAfter`, `w:1120`.** The slide is already a two-column grid, which is why the
  picture carries every bullet's text and three of the five bullets moved into the notes:
  the slide keeps one bullet per column, since a slide that had bullets keeps at least two.
  Panel titles are the slide's own fragments ("IN THE FIELD", "AFTER THE AUDIT") so the
  figure does not repeat the two heading lines verbatim just below itself. The picture sits
  between the lead line and the grid; the kept cause bullet is the shorter of the two, so its
  second line ends well left of the deck's page number.

This pass brings the folder to seven pictures. Counted that way, `layers` and `beforeAfter`
are used twice each — still under half of seven — with `tree`, `stateMachine` and `flow`
once each.

## Pattern mix

Five pictures, five different patterns (tree, layers, stateMachine, beforeAfter, flow) — no
pattern carries more than half the deck. The chapter's other relational-looking slides are
already in their clearest form and were deliberately left as text: five tables (three
console calls, six errors, unit vs integration, three manual-test categories, the QA
checklist), four code slides, a quiz with its answer slide, and a case-study story.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
