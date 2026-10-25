# Chapter 4 diagram specs

`slide-diagrams` kit specs for `slides/bab-04-dasar-react.md`. One file = one picture.
A spec carries data only; geometry, text wrapping, and the font-size floor belong to the
kit at `~/.pi/agent/skills/slide-diagrams`.

## What is here

The chapter already carried 20 pictures before this pass. Seventeen of them were drawn by
the old chapter script `scripts/build-diagrams-bab04.mjs` and are left alone — **do not run
that script**, and do not edit it to "fix" these three: it still contains definitions for
ids 02, 03 and 04, so re-running it would overwrite the kit output.

Ids 02, 03 and 04 were legacy Mermaid charts (`bab-04-dasar-react-NN.mmd` is still beside
each SVG as a provenance trail). They are replaced here at the **same id and same path**, so
the deck's image lines never change location. Their widths moved from `w:900` to `w:1120`
because a 14px kit label at `w:900` would render at 10.9px on the projector; at `w:1120` it
renders at 13.5px.

The rest of the chapter is left as text, and every remaining text-only slide is one of the
cases `references/pedagogy.md` sends away: a learning-objective list (slides 2–3), a code
slide (9, 29), a quiz or its answer key (19–20, 32–34), a table (31, 37), or a reflection
prompt (36). Illustrating those would have added ink without adding structure.

## The density pass (ids 22 and 23)

A later pass asked for a picture on every prose slide, not just the 3–6 the chapter
guidance allows. Two slides of this chapter qualified; both got a picture and lost prose
to their presenter notes:

- **22** (`flow`) on *Components: The Smallest Unit of the UI* — `App.js` → `Sapaan` → the
  element it returns. The picture says what the second bullet said, so that bullet moved
  into the notes verbatim, and the `components/Sapaan.jsx` caption moved there too: with
  both on the slide the code block ran into the page number.
- **23** (`flow`) on *Case Study: Academic Data at BAAK* — `DATA_MAHASISWA` → `Student
  cards` → `GPA average`, with the program filter and the average as the two edge labels.
  The bullet naming the program filter and the aggregate summary moved into the notes.

Both are `flow` because both are derivations with no branch and no return. The pattern mix
survives it: 22 and 23 are the only two `flow` diagrams among this chapter's four kit specs
the old ones being `layers`, `flow` and `sequence`.

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `layers` | Component Composition & Reusable Components | App.js → DaftarMahasiswa → KartuMahasiswa, and where the state sits |
| 03 | `flow` | Lifecycle: Mount, Update, Unmount | mount → update → unmount with the two events between them |
| 04 | `sequence` | The Event Flow: One Tap, One Re-render | tap → handler → setter → re-render across user, component, React |
| 22 | `flow` | Components: The Smallest Unit of the UI | App.js renders Sapaan, which returns the element — component vs element |
| 23 | `flow` | Case Study: Academic Data at BAAK | DATA_MAHASISWA → cards → GPA average, filtered by program and averaged from the cards |

## Re-examined and still text: slide 36

A second density pass re-checked the remaining prose slide of the chapter — **36 · Class
Discussion and Reflection** — and left it without a picture, for four separate reasons:

- **It is a list of peers, not a relationship.** Two reflection questions beside two
  assessment criteria. `references/pedagogy.md` sends exactly this shape away ("a list of
  peers … numbered bullets, or a two-column list").
- **The one pattern that could hold it is ruled out.** The right-hand column is a criteria
  list, and `references/deck-audit.md` is explicit: "`beforeAfter` is for models, not
  criteria lists". Its rows would not even correspond — a question does not answer a
  criterion — and drawing both columns would empty the slide of all four of its bullets.
- **The one real relationship is in the blockquote**, not in the bullets: the chapter's
  comprehension/practice/analysis/challenge questions form the Chapter 4 Exercises, which
  are assessed through the practicum rubric in Appendix A. A `flow` of that chain would
  illustrate a footnote the slide already states in one sentence, leave all four bullets
  untouched, and make `flow` four of this chapter's six kit diagrams — over the
  no-pattern-above-half ceiling.
- **A picture would answer the questions.** The obvious candidate — the trace path of
  "the data changed, the view did not", or an "old intuition vs re-render mechanism"
  contrast — comes from the presenter notes rather than the slide, and would hand students
  the answers the slide exists to make them produce.

The rendered slide confirms the density premise does not apply here either: two two-line
bullets per column, one blockquote, and roughly 160px of unused space beneath it. No id was
allocated for it; the next free id in this folder remains **24**.

## Why these patterns (and not the obvious ones)

- **02 is `layers`, not `tree`.** From the root the chain is four levels deep
  (App.js → DaftarMahasiswa → KartuMahasiswa → its state) and `tree` caps depth at 3 and
  drops notes, so a tree would delete the one fact this slide exists to teach — that the
  card's state lives in the card. Every node here also has exactly one child, so `tree`
  would collapse the chain onto a single y and the nesting would read as three siblings in
  a row (measured: a probe tree of these three names rendered as one 160px strip).
  `layers` is the kit's documented "containment stack": outermost on top, innermost at the
  bottom, which is also the direction data travels.
- **03 is `flow`, not `stateMachine`.** Three stages, two hand-over points, no branch and
  no return — the case the kit's own guidance sends to `flow`. A `stateMachine` would also
  have forced the edge labels into a 90px gap, i.e. into shorthand the deck does not use.
- **04 is `sequence`, not `flow`.** The three stages belong to three different
  participants — the user, the component, React — and the slide's own question is *who*
  produces the new screen ("React only knows state has changed if the setter is called").
  A sequence keeps the participants visible; a flow would show the order and hide the
  actor. `flow` was already carrying the lifecycle, and no pattern may hold more than half
  a chapter's diagrams.

## Provenance

Slides 21, 24 and 26 are picture-only: their slide text is the heading and nothing else, so
the build reports nearly every label as "not on the slide". That is expected here and is the
case `references/deck-audit.md` describes for a `Diagram:` slide. Each label is traceable to
this chapter's material — the legacy Mermaid chart, the slide's presenter notes, or the
chapter's own terminology (`App.js`, `DaftarMahasiswa`, `detailTampil`, `component removed`,
`dependency`, `setter`, `re-render`). No participant, layer or stage was invented.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-04-dasar-react.md
SPECS=slides/diagrams/bab-04-dasar-react

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# facts table for the whole deck (read-only)
node $SKILL/scripts/build.mjs $DECK --audit
```

Output: `slides/assets/diagrams/bab-04-dasar-react-NN.svg`, placed on the slide as
`![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick a pattern with more room — do not lower the font
size and do not edit `lib/`.
