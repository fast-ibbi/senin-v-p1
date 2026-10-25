# Chapter 10 diagram specs

`slide-diagrams` kit specs for `slides/bab-10-rest-api-dan-backend-integration.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively, and every deck lives in `slides/`, so
that flat folder would be shared by all fifteen chapters. Each deck's specs therefore sit
in their own subfolder and the build is always told where they are with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-10-rest-api-dan-backend-integration.md
SPECS=slides/diagrams/bab-10-rest-api-dan-backend-integration

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --png 03
```

Output: `slides/assets/diagrams/bab-10-rest-api-dan-backend-integration-NN.svg`, placed on
the slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `sequence` | HTTP: The Request–Response Pattern | one round trip: request out, response back |
| 03 | `stateMachine` | The Three Interface States | loading → empty / error, error → loading |
| 04 | `tree` | From Chapter 10 to the Next Chapters | Chapter 10 → 11, 13, Final Project |
| 05 | `flow` | Integration Flow: Form → Server → List | Save → POST → 201 → back to the list |
| 06 | `sequence` | Diagram: Introduction to API Authentication | login → token → Bearer header → 200 / 401 |
| 07 | `beforeAfter` | From Static Data to Dynamic Data | static ↔ dynamic: when a change reaches the other users |
| 08 | `tree` | The Client–Server Concept | one architecture, two branches, four duties |
| 09 | `beforeAfter` | REST: Resource, Endpoint, and Stateless | the collection address ↔ one member of it |
| 10 | `beforeAfter` | fetch Fails Only When the Network Is in Trouble | fetch throws / fetch is silent, and your move under each |

Ids 02–04 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output.
Ids 05–10 are new pictures, numbered after the legacy set so that no legacy SVG path
moves; they therefore sit out of slide order (05 is slide 29, 04 is slide 30).

## Density pass (ids 07–10)

Slides 5, 6, 9 and 20 were prose slides with no picture. Three of them are Marp `grid2`
slides, which shaped the design: a `beforeAfter` of two columns that are **already on the
slide** would only photograph the prose, so each picture had to show the axis the columns
cannot — when a change propagates (07), the separation between the two branches (08,
`tree`), and which remedy belongs to which failure (10). 09 is the exception: the
collection-vs-member address contrast only exists in the presenter notes, so the picture
is what puts it in front of the class.

Pattern mix after this pass: `beforeAfter` 3, `sequence` 2, `tree` 2, `flow` 1,
`stateMachine` 1 — no pattern over half of the nine pictures.

**What moved, and why.** No bullet was deleted. A bullet the picture redraws moved
verbatim into that slide's notes under "Trimmed to the picture (the diagram says this)":
two on slide 5, two on slide 6 (the duties, going into the tree's labels), two on slide 20.
Each trimmed slide keeps at least two bullets, and every kept bullet carries a fact the
picture does not show (which program runs where, the 500-with-no-error case, the full
try/catch instruction).

Two blockquotes moved into the notes as well — slide 9's "Statelessness makes the server
easy to scale up…" and slide 20's Axios remark — under "Trimmed to the notes (prose; the
picture needed the room)". Both slides were 1-line-blockquote slides whose prose plus the
kit's 160px canvas floor overflowed the 720px slide: at `w:1120` the page number landed on
the blockquote (measured in the Marp PNG export). Shrinking the picture instead would have
broken the 13px effective floor, so the prose moved and the presenter still reads it.

## When the build says "does not fit its pattern"

- **03 has three states, not four.** The legacy chart also drew the happy path ("Daftar
  tampil / FlatList"). Adding it as a fourth state gives `loading` two arcs to the right,
  and the kit routes both at the same bow — the two curves lie within 1–2px of each other
  for half their length and the picture reads as one line with two arrowheads.
- **06 lives on a `Diagram:` slide** placed directly after "Introduction to API
  Authentication". At `w:1120` the picture is 307px tall and pushed that slide's
  blockquote through the footer in the Marp PNG export; shrinking the picture would have
  dropped its 14px labels under 13px on the slide. The prose slide kept all four bullets.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.

## Second half of the deck (density pass, ids 11–12)

| id | pattern | slide | content | width |
|---|---|---|---|---|
| 11 | `beforeAfter` | Empty State and Pull-to-Refresh | the empty list because there is no data ↔ the empty list because the request failed | `w:1120` |
| 12 | `tree` | Application: Three Systems That Are Not in Sync | one record, three copies: the academic web, the mobile app, HR | `w:660` (canvas 660×216) |

Pattern mix after this pass: `beforeAfter` 4, `tree` 3, `sequence` 2, `flow` 1,
`stateMachine` 1 — eleven pictures, no pattern over half.

**11 is the presenter notes, drawn.** The notes tell the teacher to "draw a firm
distinction between two states students often mix up"; the picture is that distinction, one
row per axis (what the empty screen means, what the screen owes the user). The panel titles
pair — "The request succeeds" is bullet 1's words, "The request failed" is the notes'. The
build reports the whole set as not-on-the-slide because both redrawn bullets moved into the
notes; they were checked against the notes text by hand.

**12 is the shape the grid cannot show.** Both `grid2` columns are already on the slide, so
a `beforeAfter` of them would photograph the prose. The tree draws the duplication that the
notes call the root of the problem: one record, three copies. Canvas 660 with `imgWidth`
660 follows picture 08 in Chapter 2 — `tree` left-packs its three fixed level widths, so on
a 1160 canvas this two-level tree filled 55% of the width and left a dead right half; at
scale 1 a 16px node label stays 16px on the projector. Placed under the heading, before the
columns, so the problem is seen before the decision.

**What moved.** No bullet was deleted.

- Slide 25: two bullets into the notes under "Trimmed to the picture (the diagram says
  this)" — the empty-state definition and the "not broken, give a way out" rule, exactly the
  two the picture redraws. The two kept bullets carry what the picture does not: the exact
  copy to show the user, and the whole `RefreshControl` mechanism.
- Slide 31: one bullet ("The academic web, the mobile app, and HR each store a copy of the
  data") into the notes under the same heading — the three tree branches say it — and the
  blockquote about the single point of failure and `/api/v1/` under "Trimmed to the notes
  (prose; the picture needed the room)". Keeping it was not an option: in the render before
  the move the blockquote occupied y≈415–500 of the 720px page, and the same column stack
  with heading + picture + grid already ends at y≈592 with the blockquote gone — so the two
  cannot share the slide (page number sits at y≈623).

**Not drawn: slide 32, "Introduction to API Authentication".** Its relationships are already
on the next page: id 06, a `sequence`, is the login → token → `Authorization: Bearer
<token>` → 200/401 exchange, and the previous pass put it on the `Diagram:` slide precisely
because this prose slide could not hold it. What is left on slide 32 is a two-clause aside
(this chapter's server is open, a production API is protected) and a list of three peer
causes that all end in the same 401 — neither matches a pattern, and a second flow picture
next to id 06 would teach the same thing twice. The skip is not a space decision: slide 32
had ~240px of free space below its blockquote.
