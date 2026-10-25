# Chapter 8 diagram specs

`slide-diagrams` kit specs for `slides/bab-08-form-input-dan-validasi.md`. One file =
one picture. A spec carries data only; geometry, wrapping and the font-size floor are
owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so that
flat folder would be shared — each deck therefore keeps its specs in its own subfolder and
is always built with `--specs` (see `../README.md`).

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-08-form-input-dan-validasi.md
SPECS=slides/diagrams/bab-08-form-input-dan-validasi

# validate + print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs into slides/assets/diagrams and refresh the image lines
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# facts table for the whole deck (read-only)
node $SKILL/scripts/build.mjs $DECK --audit

# rasterize one picture
rsvg-convert -z 1.4 slides/assets/diagrams/bab-08-form-input-dan-validasi-04.svg -o /tmp/04.png
```

Output: `slides/assets/diagrams/bab-08-form-input-dan-validasi-NN.svg`, placed on its
slide as `![w:1120](…)`. Scale 0.966, so the smallest label (14px) renders at 13.5px and
the tree's 16px chips at 15.4px.

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `flow` | Flow: from Keystroke to Error Message (21) | keystroke → form state → handleSubmit → errors state / onSubmit(form) |
| 04 | `beforeAfter` | Diagram: Permanent Label vs Placeholder (24) | label ↔ placeholder on three matched rows |
| 03 | `tree` | File Map and Responsibilities (29) | thin route owns the form screen, which uses FormField and validators |
| 05 | `beforeAfter` | Context: Bad Data Is a Cost (4) | the typo ↔ who pays, two matched rows |
| 06 | `flow` | TextInput: It Does Not Store Its Own Value (5) | TextInput → onChangeText → React state |
| 07 | `beforeAfter` | Handling the Virtual Keyboard (8) | symptom without the fix ↔ mechanism with it |
| 08 | `flow` | Controlled Component: Single Source of Truth (10) | React state → value → TextInput → setForm (the loop, said as a chain) |
| 09 | `flow` | Validation: Definition and the Pure Function Contract (15) | a value comes in → pure function → a message or `''` |
| 10 | `beforeAfter` | UX Principles for Error Messages (22) | the four error-message principles ↔ the form each takes on screen |
| 11 | `flow` | FormRegistrasi: Validation That Needs Another Field (32) | `form.password` → rule re-runs → the confirmation error is recomputed |

Ids 02 and 03 reuse the file names of the two old Mermaid charts (their `.mmd` files stay
in `assets/diagrams/` as a provenance trail), so those SVG paths are unchanged and the
deck's two existing image lines only had their width raised (`w:1000` → `w:1120`,
`w:600` → `w:1120`). Id 04 was the first new picture; ids 05–09 were added by the second
pass (see below), which is why the map is no longer in slide order either.

**Why the ids are not in slide order.** 02 and 03 are pinned to the legacy chart numbers,
and 04's slide (23 in the translated deck, now 24 after the split) sits between them.
There is no integer between 2 and 3, so one of the two rules — "sequential in slide order"
and "a legacy replacement keeps its NN" — has to give. The legacy paths won: 04 is
appended after the legacy range instead of renumbering 03 onto the new slide, which would
have moved a picture and changed an existing image path.

## Choices worth knowing

- **02 flattens a fork.** The legacy chart ended with a branch (4a errors state, 4b
  `onSubmit(form)`), and none of the six patterns draws a fork — `flow` is a single chain.
  The outcomes stay two distinct chips, red and green, and the arrow between them is
  labelled with the condition (`or all fields valid`) so the branch reads as an
  alternative laid flat. Both outcomes survive; the presenter note that "paths 4a and 4b
  do not run at the same time" is still true and still needed. Stages 1–2 are the typing
  path, 3–5 the submit path; the arrow into `handleSubmit` is the one button press.
- **02 keeps the legacy labels.** `onChangeText`, `handleChange`, `handleSubmit`,
  `validasiSemuaField`, `errors state` and `onSubmit(form)` are the words students saw on
  the old chart and the words the chapter uses in code. The edge labels come from the
  slide's own blockquote ("One keystroke … one button press …") plus the two conditions.
- **03 wraps the root path onto two lines.** `tree` gives the root a 218px chip and drops
  node notes, so `app/(app)/mahasiswa/tambah.js — thin route, data owner` cannot fit as
  one label. The path is written as `app/(app)/ mahasiswa/tambah.js` (two lines, split at
  the folder boundary) and the "thin route — data owner" descriptor lives in the alt text.
  The three children keep their folder prefixes, as in the legacy chart.
- **03's root has one child, and that is fine here.** With a single child the kit's elbow
  has zero height, so the route and the screen share one y — the quirk that usually makes
  parent and child look like siblings. Because the root is the accented chip and the
  connector carries an arrowhead, the pair reads as a chain: route → screen → the two
  components the screen uses. Nothing was added to give the root a second child.
- **04 is `beforeAfter`, not a table.** The slide compares two things that occupy the same
  place on a field and differ on three axes (what it is for, when it is on screen, how the
  two relate). `beforeAfter` gives matched rows; the four bullets are untouched.
- **04 uses `acc` / `neutral`,** not the default `red` / `acc`: a placeholder is not the
  wrong model, it is the secondary one. Red would say "never do this", which the slide
  does not.
- **The deck gained one slide (39 → 40).** Slide 23 as translated held the four bullets,
  the blockquote *and* a 1120px picture; at that width the picture's 270px pushed the
  blockquote into the footer. Per the deck-audit convention the prose slide stays intact
  and a new `## Diagram: Permanent Label vs Placeholder` slide follows it, carrying the
  picture. Spec 04 is bound to the new heading. No bullet was deleted.
- **Not drawn, on purpose.** Every other heading slide is already in its clearest form: the
  eight tables (Table 8.1 twice, Table 8.2 twice, `When Validation Runs`, the disabled-button
  trade-off, Table 8.3, References), the code slides (`validators.js`, `FormField`,
  `FormRegistrasi`, `FormMahasiswa`, the thin route — and, with no room left over, the form
  state and `jalankanAturan`; see the second pass above), the three lists of peers (learning
  objectives, the four error-message principles, the five mechanisms in three forms), the
  two definitions, the quiz and its answers, the discussion prompts, the summary, the three
  prose slides that are already a two-column grid, and the pair activity. A picture there
  would add ink, not structure. `Permanent Label vs Placeholder` is the prose half of a
  split, so its relationship is drawn on the `Diagram:` slide right after it.

## Labels not on their slide

The build prints these every run; they are kept, with the reason:

| spec | label(s) | where it comes from |
|---|---|---|
| 02 | `onChangeText`, `Form state`, `handleChange`, `handleSubmit`, `validasiSemuaField`, `errors state`, `red border + message`, `onSubmit(form)`, `all fields valid` | the legacy chart's own content (`bab-08-…-02.mmd`); the slide is the picture plus one blockquote, and the same names appear in the chapter's code on `jalankanAturan`, `The Same Internal Pattern in Three Forms` and `Code: Three Core Functions in validators.js` |
| 02 | `a field fails`, `or all fields valid` | the two conditions of a branch. The legacy chart drew the branch with edges and no words; a flat `flow` needs the words on the arrows, and they restate the chart's notes (4a `errors state`, 4b `semua field valid`) |
| 03 | `app/(app)/`, `mahasiswa/tambah.js`, `screens/FormMahasiswa.js`, `components/FormField.js`, `utils/validators.js` | the legacy chart's four node labels; this slide's prose is the picture plus "Four layers: validation rules, field appearance, form logic, and the data owner" |
| 04 | `Explains the name of the field`, `Gives an example value`, `Separate from the placeholder`, `Must not replace the label` | all four are verbatim on the prose slide immediately before (`Permanent Label vs Placeholder`); spec 04 is bound to the `Diagram:` slide, which has no prose of its own — the kit quirk the deck-audit notes file lists |
| 05 | `THE COST` | the heading itself (`Context: Bad Data Is a Cost`) names the cost; the panel needs a two-word banner and "cost" alone reads as a fragment. The rows under it are verbatim bullets |
| 07 | `WITHOUT THE FIX`, `WITH THE FIX` | the blockquote frames the slide as "Without `keyboardShouldPersistTaps` …"; "the fix" is the deck's own word for those remedies (bullets 2–3 are written as fixes). Neither panel is a quote of the prose |
| 07 | `The keyboard covers the lower fields` | bullet 1 says "takes up half the screen and covers the lower fields"; the panel states only the half that the matched row answers, and bullet 1 stays on the slide with the "half the screen" half |
| 07 | `keyboardShouldPersistTaps answers a single tap` | bullet 3 says "makes a button respond to a single tap"; the panel compresses it to fit the row beside `KeyboardAvoidingView` |
| 10 | `ON THE SCREEN` | the left panel's `PRINCIPLE` is the heading's own word; the right panel is not named anywhere on the slide. It needs a two-word banner, and its rows are verbatim bullets — same treatment as `THE COST` in spec 05 |
| 11 | `re-runs`, `compares the two values`, `new message` | the two edge labels and one chip note compress the slide's own sentence: "If `password` changes, the `konfirmasiPassword` error is recomputed too", plus bullet 1's "takes the password as the comparison context". A `flow` needs a verb on each arrow, and the slide writes the change as a clause rather than as a verb. The chip labels themselves are the slide's identifiers, word for word |

## Second pass — five pictures on the prose slides (ids 05–09)

This pass was asked for by the author, who overrode the usual 3–6-per-chapter guidance: the
slides still read as walls of text. Every picture here is bound to its prose slide (no new
slide was added, the deck stays at 40 pages), and two slides gave up bullets to the
presenter notes so the picture could sit at `w:1120`.

### What each picture says, and what it cost

- **05 · Context: Bad Data Is a Cost — two rows, not three.** The slide's four bullets are
  two-part sentences (the typo → who pays), which is `beforeAfter`'s shape. A three-row
  `beforeAfter` is 270px on the slide and this slide has 181px of slack under its
  blockquote, so the first two rows are drawn and bullets 1–2 moved, verbatim, into the
  presenter notes under "Trimmed to the picture (the diagram says this)". The NIM row and
  "first line of defense" stay on the slide: a third trim would leave one bullet, and the
  rule is at least two.
- **06 · TextInput: It Does Not Store Its Own Value — the outbound half.** `flow` of the
  slide's three bullets: the field holds nothing, `onChangeText` fires with the new text,
  another component stores it. Nothing trimmed; the picture does not draw the return trip,
  because that is the next slide's subject.
- **07 · Handling the Virtual Keyboard — symptom against mechanism.** `beforeAfter` of two
  matched rows (covered fields ↔ `KeyboardAvoidingView`; tap twice ↔ `keyboardShouldPersistTaps`).
  Bullets 2–3 moved into the notes; bullet 1 stays because only it says "half the screen",
  and bullet 4 (the `returnKeyType` chain) is not a symptom with a fix, so it is not drawn.
- **08 · Controlled Component: Single Source of Truth — the return half.** `flow`:
  state → `value` → `TextInput` → `setForm`. The honest shape is `sequence` (a round trip),
  but `sequence` needs 188px of canvas minimum — 202px on the slide — and this slide has
  178px of slack under its second bullet, so the loop is drawn as a chain with the return
  leg written in the last chip's note, and the alt text says the loop outright. Together
  with 06 the two pictures are the two halves of one loop.
- **09 · Validation: Definition and the Pure Function Contract — the one-way pipe.**
  `flow`: a value comes in → pure function → a message or `''`. The purity claim rides as
  the middle chip's note (it is a property of the arrow, not a stage); bullet 2
  (`utils/validators.js`) and bullet 4 (reuse and test) stay on the slide and are named
  only in the alt text. Nothing trimmed.

### Geometry worth knowing

- Specs 06, 08 and 09 carry `canvas: [1160, 160]`. The flow pattern reserves 44px of note
  room under every chip; all their notes are one line, so 160px holds the chips (24–100)
  and the note line (122–141) and crops empty space. The build's ink check refuses an SVG
  whose content falls outside the canvas, so nothing can clip quietly. The 24px it buys is
  what keeps the blockquote under slides 5 and 15 clear of the pagination row.
- Rendered bottoms of the five touched slides, measured on the PNG export against the
  604px content box (bottom edge at 658): slide 4 → 620, slide 5 → 612, slide 8 → 653,
  slide 10 → 652, slide 15 → 618. Slides 8 and 10 are close to the edge but inside it, and
  `slide_check.py` reports 0 problem slides for the deck.
- Pattern mix after this pass: `flow` 4 (02, 06, 08, 09), `beforeAfter` 3 (04, 05, 07),
  `tree` 1 (03). No pattern is over half of the eight pictures.

### Slides left without a picture, and why

- **Form State: One Object, One handleChange (11).** Full: a 9-line code block plus its
  `File:` caption and two bullets end at 593, leaving 57px of the content box. The
  shortest legal picture (a three-stage flow on the 160px canvas) is 175px, and the two
  bullets are the whole trimming budget — the rule keeps at least two.
- **Pros and Cons of a Single Object (12).** The slide is already a two-column
  `grid2` pros/cons comparison — exactly the layout `beforeAfter` would draw. A picture
  there would be a second copy of the same two columns, and fitting it (235px for two
  rows, 291px for three) would empty three of the five bullets out of the grid, leaving one
  bullet per column. A wrong picture is worse than no picture.
- **jalankanAturan: Stop at the First Message (19).** Full: a 9-line code block, three
  bullets and a two-line blockquote end at 618 — 32px of the content box left. One bullet
  can be trimmed at most, which does not reach the 175px the shortest picture needs.

## Third pass — two pictures on the second half (ids 10–11)

Same instruction as the second pass (density first, quality still winning), applied to the
second half of the deck: slides 22, 23, 27, 32, 33, 34 and 35. Two of the seven could take
a picture; five could not, and the measurements below are why. No slide was added or
removed — the deck is still 40 pages — and no id below 10 was renumbered.

### What each picture says, and what it cost

- **10 · UX Principles for Error Messages — the dashed pair, drawn.** Each of the four
  bullets is written as *principle* — dash — *the form it takes*, so the slide is four
  matched pairs, not a list of unrelated peers. `beforeAfter` draws them as four rows;
  nothing was invented, the dash is the split. Bullets 3–4 moved verbatim into the notes
  (two must stay, and the two kept are the ones the blockquote continues from). Four rows
  at `w:1120` are 338 units — 326px on the slide — which is what the slide had room for
  once two bullets were gone.
- **11 · FormRegistrasi — the cause, not the comparison.** The slide's second bullet is
  already a consequence: `password` changes → the confirmation error is recomputed. Three
  named stages (the value, the rule that reads it, the message that comes out), so `flow`.
  Bullet 1 moved into the notes: stage 1's note and stage 2's label say it word for word.
  Canvas is cropped to 160 because every note is one line.

### Geometry, measured

The floor for **any** picture on this theme is 181px: the shortest legal canvas is 160
units (the kit refuses less), 160 × 1120/1160 = 154.5px, plus 26px of Marp image margin.
That number decides every skip below, and it was measured, not assumed — slide 32 ran from
a content bottom of 479 to 660 with a `canvas: [1160, 160]` picture inserted.

| slide | content bottom before | slack to the 658 box | verdict |
|---|---|---|---|
| 22 UX Principles | 367 | 291 | picture at 326px after two trims → bottom 636 |
| 23 Permanent Label | 367 | 291 | fits, but already drawn as spec 04 on the next slide → skipped |
| 27 FormField | 666 | −8 | no room at all → skipped |
| 32 FormRegistrasi | 479 | 179 | picture at 155px → bottom 615 after one trim |
| 33 FormMahasiswa | 533 | 125 | 170 even after the one legal trim, floor is 181 → skipped |
| 34 A Thin Route | 679 | −21 | the blockquote is already below the box → skipped |
| 35 Case Study | 537 | 121 | below the floor, and the grid is the picture already → skipped |

### Slides left without a picture, and why

- **Permanent Label vs Placeholder (23).** It fits (291px of slack), but its relationship
  is exactly spec 04's three matched rows, bound to the `Diagram:` slide one page later.
  That split was deliberate: prose slide, then the picture. A second copy of the picture on
  the prose slide would undo the split and show the class the same picture twice in a row.
- **FormField: One Component, Many Uses (27).** Full. A 10-line code block plus its `File:`
  caption and three single-line bullets end at 666 — already 8px past the 658 content box,
  sitting on the pagination row. Trimming one bullet buys 45px, which does not reach 181.
- **FormMahasiswa: Program Chips and Numeric Fields (33).** Two obstacles. Geometrically
  it is 11px short (125px of slack, 170 after the single legal trim, floor 181), and the
  layout would put the picture over the page number. More importantly the slide's content
  is a *mapping* — each field kind beside the control it uses — whose honest shapes are a
  three-row `beforeAfter` (296px) or a `tree` (252px), both far past the budget. Drawing it
  as a `flow` would mean inventing a chain the material does not contain.
- **A Thin Route as Data Owner (34).** Full: a 12-line code block, two bullets and a
  two-line blockquote end at 679, 21px *below* the content box and one line above the
  footer. Both bullets are the whole trimming budget and the rule keeps at least two.
- **Case Study: Data Quality in the Academic Portal (35).** The slide is already a
  `grid2` two-column comparison (complaints ↔ defense in depth) and the blockquote is the
  synthesis. A picture of the defense stack (`layers`, 4 bands = 368px) or of the
  complaint↔validator pairs (`beforeAfter`, 296px) needs more than the 121px left, and
  trimming the column a picture duplicates would empty that column of the grid.

### Pattern mix after this pass

`flow` 5 (02, 06, 08, 09, 11), `beforeAfter` 4 (04, 05, 07, 10), `tree` 1 (03) — ten
pictures. `flow` is exactly half (5/10) and `beforeAfter` is under it; no pattern exceeds
half. The two new pictures deliberately split one each: the principles slide is a
comparison, the registration slide is a chain.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
