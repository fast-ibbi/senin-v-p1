# Chapter 3 diagram specs

`slide-diagrams` kit specs for `slides/bab-03-javascript-modern-untuk-react-native.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-03-javascript-modern-untuk-react-native.md
SPECS=slides/diagrams/bab-03-javascript-modern-untuk-react-native

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# facts table for the whole deck (read-only), before deciding anything
node $SKILL/scripts/build.mjs $DECK --audit
```

`--specs` is mandatory: the kit reads `<deckDir>/diagrams` non-recursively, so every deck
in `slides/` needs its own folder (see `../README.md`).

Output: `slides/assets/diagrams/bab-03-javascript-modern-untuk-react-native-NN.svg`,
placed on the slide as `![w:1120](…)` (canvas 1160, so the smallest 14px label renders at
13.5px — above the 13px floor).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 01 | `beforeAfter` | Falsy and Truthy (10) | the closed falsy set ↔ every other value is truthy |
| 02 | `flow` | Modules: Splitting Code into Files (23) | data file → logic file → JSON output |
| 03 | `stateMachine` | Promises and Their Three States (25) | pending → fulfilled / rejected |
| 04 | `beforeAfter` | `try`/`catch`: the App Must Not Stay Silent (28) | a catch that hides ↔ a catch that reacts |
| 05 | `beforeAfter` | Variables: `const` and `let` (4) | `const` for a value filled once ↔ `let` for one that really changes |
| 06 | `flow` | Optional Chaining and Nullish Coalescing (8) | `alamat` is null → `?.kota` gives undefined → `??` gives the default |
| 07 | `flow` | Spread Operator: Copying and Updating (19) | `dataLama` → `{ ...dataLama }` → `dataBaru` with `ipk: 3.35` |
| 08 | `tree` | `map`, `filter`, and `reduce` (20) | one untouched array → three methods → three result shapes |
| 09 | `beforeAfter` | Running Modules in Node.js (24) | `.mjs` ↔ `"type": "module"` — the two ways to declare ESM |
| 10 | `flow` | `async`/`await`: Asynchronous as if Synchronous (27) | the call returns a promise → `await` waits → `data`, as if synchronous |

Ids 02–04 replace the three legacy Mermaid charts of this chapter, so they keep the ids
(and the slide positions) those charts had. Ids 05–07 are new pictures from the first density
pass: three slides that were code plus two bullets, or prose, and had no picture at all.
Ids 08–10 are from the second one — see "The second density pass" below.

### Path note: the legacy charts were misnamed

The old Mermaid artifacts of this deck were written by an earlier pipeline that truncated
the deck slug: `bab-03-javascript-modern-untuk-react-nat-NN.svg` instead of
`…-react-native-NN.svg`. The kit derives its output filename from the deck filename, so the
three replaced pictures now live at the full-slug paths above. The ids are unchanged; the
old `…-react-nat-NN.mmd` files stay beside the old SVGs as a provenance trail, and nothing
references them any more.

## Why these, and not more

The chapter is 37 slides of language material; most of it is code, tables, peer lists,
quizzes and story slides that a picture would only decorate. What earned a drawing:

- a **partition** whose costliest member is the one students get wrong (the empty array
  is truthy), so the two classes are shown side by side;
- a **chain across three files**, which is what "splitting code into files" means;
- a **mode set** — two of the three promise states are alternatives, not a sequence;
- a **choice about the catch block**, which is the slide's own blockquote.

Deliberately skipped: `spread` vs `rest` (a comparison of two options on criteria — a table's
job), the reference-type aliasing slide and every code-only slide (never draw a picture of
code), the two quiz slides, the summary and the practicum list. `map`/`filter`/`reduce` was on
this list too — "a table already" — until the second pass found the relationship the table does
not carry (picture 08 below).

### What the density pass added, and what it cost

05–07 sit on slides that read as walls of text: a `const`/`let` comparison and two operator
slides, each a fence plus two bullets.

- **05** works because the slide's own bullets 2 and 3 *are* the two panels, so they moved
  verbatim into the presenter notes; bullets 1 (block scoped) and 4 (`var` is function scoped)
  stay, because the picture shows neither fact.
- **06** and **07** keep both of their bullets: a slide that had bullets keeps at least two, and
  neither picture carries the rest of what those bullets say (the `?.`/`??` qualifiers; `rest`
  gathers).
- **07 is the one slide that lost visible material that is not a bullet.** Its file line, an
  eight-line fence and two bullets could not share a slide with a picture at `w:1120`, and a
  narrower picture would put its 14px labels under the 13px floor. The `Set` deduplication
  example (the last two fence lines) therefore moved into the presenter notes, leaving a
  five-line fence with the copy-then-update example the heading is about. No slide was added,
  split or renumbered — the deck is still 37 slides.

Pattern mix across the seven pictures: 3 `beforeAfter`, 3 `flow`, 1 `stateMachine`. Half is the
ceiling, so 07 was the last `flow` available — and `spread` vs `rest`, the other honest reading of
that slide, would have been a fourth `beforeAfter`.

## The second density pass: 08–10

Three more pictures on three slides that were prose, code or a table with nothing to look at. No
slide was added, split or renumbered; the deck is still 37 slides. Pattern mix across the ten
pictures is now 4 `beforeAfter`, 4 `flow`, 1 `tree`, 1 `stateMachine` — under the half ceiling.

- **08** is a `tree` because the table it sits under is a spec sheet: it lists each method and its
  result, but not the fact that all three hang off one array that stays as it is. Three levels, not
  two, both to use the canvas width and because the result belongs to the method, not to the array.
  `canvas` cropped from 234 to 216 to remove a dead band; nothing was trimmed from this slide, and
  every label is a fragment of the slide (the build reports no provenance miss).
- **09** is a `beforeAfter` because the slide is already two parallel blocks — the file you run and
  the `package.json` line that is "the alternative". One row per panel plus a `footer`, because the
  run commands and both bullets have to stay on the slide. The `package.json` intro line and its
  three-line fence moved into the presenter notes (verbatim); the panel now carries the literal.
  The panel is 196 units tall, not the computed 164: at 164 the footer box is drawn straight through
  the row text (measured on the first build).
- **10** is a `flow` and not the `sequence` that usually teaches `await`: a sequence needs 262 units,
  and this slide holds a fence plus two bullets. The fence lost the `try`/`catch` wrapper — the next
  slide is `try`/`catch` with its own picture — and the file line; both are in the presenter notes,
  verbatim. `canvas` cropped from 184 to 160 to remove the note band's dead space (as in 07).

Slides considered and given nothing: nothing in this pass. All three asked-for slides had a
relationship that one of the six patterns could hold — a fan-out of results (20), a pair of
alternatives (24), a chain of three beats (27).

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.

## Provenance warnings this deck accepts

`02` and `03` report labels the bound slide does not contain. Both cases are recorded in
the spec comments and in the pass report: the file names live on the practicum slides of
the same chapter, and the three promise state names plus `resolve`/`reject` lived only in
the old Mermaid chart that `03` replaces.

`06` reports one: "undefined, not an error" is the fence's own comment (`// undefined, tidak
error`), left in Indonesian by the translation pass, and the notes only say that the
unguarded access "throws an error". The note stays, because "no error" is the point of the
first guard.

`09` reports two: "the extension in the file name" and "one line in package.json". Both are
compositions of the slide's own two parts ("the `.js` extension", "`praktik-js/package.json`",
`"type": "module"`) — the slide says the comparison as two code blocks, so it never says either
sentence in one piece. The pattern needs one line per panel, and those are the lines.
