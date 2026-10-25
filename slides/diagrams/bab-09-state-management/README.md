# Chapter 9 diagram specs

`slide-diagrams` kit specs for `slides/bab-09-state-management.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so
that flat folder is shared by every chapter — the moment one deck puts its specs there,
each deck loads the others' specs and the builds fail with "names slide … but no
## heading matches" and "duplicate id". Chapter 9 specs therefore live here and are
always built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-09-state-management.md

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-09-state-management --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-09-state-management

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-09-state-management --png 04
```

Output: `slides/assets/diagrams/bab-09-state-management-NN.svg`, placed on the slide as
`![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `sequence` | Lifting State Up: Definition and Flow | props go down to both children, the choice comes back up |
| 03 | `flow` | State Decision Hierarchy | local → lifting → Context → library, with the signal to climb |
| 04 | `tree` | Provider Structure and Its Scope | CartProvider over both routes, each reaching `useCart()` |
| 05 | `flow` | The Flow of a Single "Add" Button Press | press → `tambahItem` → context value → consumers → badge |
| 06 | `beforeAfter` | Local State and Global State: Two Scopes | one instance per scope, side by side |
| 07 | `flow` | The Limit of Lifting State Up: Prop Drilling | owner → two intermediaries that ignore the data → the one consumer |
| 08 | `beforeAfter` | When to Use Context — and When Not To | use / avoid, plus what to do instead (explicit props) |
| 09 | `beforeAfter` | Three Signs Global State Is Not Needed | each kind of data that must not be global ↔ the home it lives in instead |
| 10 | `tree` | Designing the Cart State | the cart state object → its stored fields, its operations, its computed values |
| 11 | `flow` | Class Discussion: Where Does the Cart Live? | in memory → local storage → server, with the requirement that forces each move |

Ids 02–05 reuse the file names of the old Mermaid charts. The `.mmd` files stay in
`assets/diagrams/` as a provenance trail; the SVGs at those paths are now kit output.
Ids 06–08 are new pictures from the density pass and add no slides: 39 slides before,
39 after.
## The density pass (06–08)

Three prose slides that the first pass had left as text now carry a picture, and two of
them were lightened by moving duplicated bullets into the presenter notes under the
usual heading:

| id | slide | bullets moved to notes | bullets left on the slide |
|---|---|---|---|
| 06 | Local State and Global State: Two Scopes | 2 of 5 | 3 (second local example, children-visibility rule, copies drifting) |
| 07 | The Limit of Lifting State Up: Prop Drilling | 1 of 3 | 2 (a new field rewrites the row; the code gets noisy) |
| 08 | When to Use Context — and When Not To | 3 of 5 | 2 (the pain signal; the reusability cost) |

No bullet was deleted anywhere; each moved bullet is verbatim inside its slide's notes.

## The second density pass (09–11)

Three more prose slides from the same chapter, same rule, same outcome: 39 slides before, 39
after. Across the deck's ten pictures no pattern now takes more than four (`flow` ×4,
`beforeAfter` ×3, `tree` ×2, `sequence` ×1).

| id | slide | bullets moved to notes | bullets left on the slide |
|---|---|---|---|
| 09 | Three Signs Global State Is Not Needed | 1 of 3 | 2 (server-owned data; temporary one-screen data) |
| 10 | Designing the Cart State | 3 of 5 | 2 (where the state lives; persistence is still a TODO) |
| 11 | Class Discussion: Where Does the Cart Live? | 0 of 4 | 4 — but the blockquote moved (see below) |

**09** trims the first sign, because it is the only row whose *home* the slide does not name:
"recomputable" gets "recomputed from items on every render" from the blockquote two code slides
later. The other two rows repeat what their own sentences already say, which is the point of a
summary picture, so those bullets stay.

**10** trims the three questions the picture answers (what is stored, what the operations are,
what is computed). What is left on the slide is the two a picture cannot hold: where the state
lives, and that permanence is Chapter 11's job. The lead line still says "five questions" — the
picture answers the first three, the presenter names them from the notes, and the two bullets
below are the ones the class answers out loud.

**11 is the one slide in this pass where prose other than a bullet moved.** Its takeaway
blockquote — "A good state design holds up when requirements change: from memory to local
storage, and then to the server" — is now the picture, and it moved verbatim into the notes
under the same heading. Nothing else on the slide changed: both discussion questions and both
assessment lines stay, because neither is something a picture says. The reasons for the
substitution are measured, not stylistic: with the quote in place the grid2 leaves ~107px of a
604px content box under it, while the smallest legible picture on this deck is 184 SVG units,
i.e. ~178px at `w:1120`. In its place the picture gives the discussion the vocabulary to point
at, and every arrow carries the risk the first discussion question asks about. Reverting is one
copy-paste: put the quote back above the image line and delete the trimmed block from the
notes.

## What was skipped, and why

Of 39 slides, 4 already carried a Mermaid chart and 4 were drawn. The rest were read
one by one against `references/deck-audit.md`:

| Slides | Why no picture |
|---|---|
| Learning Objectives, Summary, References | lists of peers / index material |
| Local State and Global State; When to Use Context; Class Discussion | already a two-column `<div class="grid2">` — all three were drawn later anyway (ids 06, 08, 11), because the columns were sentences and these were the worst walls of text in the chapter; every grid stays, and only duplicated bullets moved to the notes |
| Answer: Local or Global; Context API: Three Main Parts; Modern Libraries; Two Screens, One Data Source; Client-side or Server-side?; Answer: Why the Badge Stays Empty; IS/IT Case Study | already GFM tables, which the theme styles properly |
| Example 1, Basic Context API Pattern, Custom Hook, useCart, all four CartContext/_layout slides | code slides — never draw a picture of code |
| Exercise, Mini Quiz, What Happens If…? and their answers | quiz pairs |
| Prop Drilling, Three Checks…, Three Signs…, Designing the Cart State, Expected Result | prose that is already a clean 3–5 item list. Prop Drilling, Three Signs and Designing the Cart State were drawn later anyway (ids 07, 09, 10) — a clean list can still be a relationship. Three Checks… is a genuine list of peers and stays text |
| Custom Hook: Wrapping State Logic | skipped even in the density pass: a 12-line code block plus three hook rules already fill the slide to within 25px of the bottom edge, so nothing at a legible width fits, and the only relational idea (a hook *wraps* state) would need the code block removed to show. The three rules are a list, not a relationship |
| Part 1–3 leads, title, closing | section dividers and a closing statement |

## Provenance: all four slides are picture-only
Slides 18, 27 and 28 contain nothing but a heading, the image and one takeaway line;
slide 7 has a definition and a takeaway line. The provenance report therefore names
almost every label as "not on the slide". That is expected, not sloppiness: the picture
*is* the slide's content, and its words come from the chapter's other slides. Where each
label actually lives:

- 02 — `props`, `callback`: slide 7's own blockquote. `ukuran`, `onPilihUkuran`: the
  prop names in Example 1's code (slide 9). `PilihUkuran`, `RingkasanPesanan`: slide 7's
  presenter notes. `LayarPesan`: slide 9's file reference and the old chart.
- 03 — the four level names: the old chart and Sections 9.1–9.6. `new reader`: slide 7's
  notes ("one store, many readers"). `prop drilling`: the slide before this one.
  `large scale`: the Summary's "Zustand and Redux are for large scale".
- 04 — `CartProvider`, `useCart()`: slide 27's notes. `app/_layout.js`: slide 25's heading.
  `app/index.js`, `app/keranjang.js`: the Two Screens table on slide 26.
- 05 — `tambahItem`, `useCart()`: slide 28's notes. `app/index.js`: Example 1 and the Two
  Screens table. `setItems`: the CartContext code slides. `Badge`, `cart list`: the
  slide's own blockquote says "badge" and the notes say "cart list".
- 06 — `text typed in the search field`, `cart: badge, list, payment`: the slide's own two
  "Example:" bullets, condensed to one line each (the bullets themselves are in the notes).
  The panel titles are the slide's two bold column labels.
- 07 — `props`, `Intermediary`: the slide's own words. `State owner` and `Consumer` are the
  deck's: slide 7 says "the parent holds the state", slide 28 and diagram 05 say
  "consumer". `does not use it` condenses "components that do not use that data at all" to
  fit one 14px note line.
- 08 — `many components far apart`, `data changes across screens`: two of the three moved
  bullets. `theme, language, cart`: the parenthetical of the first moved bullet.
  `only one or two neighbours`: the fourth bullet, respelled from "neighboring".
  `explicit props stay easiest to read`: the slide's own presenter note.
- 09 — both panel titles are the slide title respelled as an instruction (`Global State Is
  Not Needed` → "DON'T MAKE IT GLOBAL", the data each sign describes → "WHERE IT BELONGS").
  `can be recomputed — totalHarga, jumlahItem`, `data owned by the server`, `temporary data
  for one screen`: the slide's three bullets, with the sentence form dropped (`Data that can
  be recomputed — derived state such as …`). `recomputed from items on every render`: the
  blockquote on slide 23 ("recomputed from `items` on every render") and slide 17's own notes.
  `fetched and cached by one dedicated layer`: the second bullet's own clause. `local state in
  that screen`: the third bullet's own words ("are enough as local state").
- 10 — `items`, `id`, `nama`, `harga`, `qty`, `operations`, `add`, `decrease`, `remove`,
  `empty`, `computed`, `not stored`, `jumlahItem`, `totalHarga` are the slide's first three
  bullets and the `value` object on slide 24; nothing in the picture is a new noun. `computed,
  not stored` is the third bullet's own wording.
- 11 — every label is off-slide by construction, because the sentence it draws moved into the
  notes: `In memory`, `Local storage`, `Server` are that sentence's three steps (and slide
  33's "The practicum chooses client-side in memory" / "migration to permanent storage
  (Chapter 11)"). `app closed` is the Summary's "making it survive after the app is closed
  is Chapter 11 material"; `switch devices` is slide 33's note ("so that customers switch
  devices without losing the cart"). `this chapter`, `Chapter 11`, `Chapter 10` are the
  chapters the deck itself assigns to each home.

## Geometry decisions worth knowing

- **02** puts the parent in the middle column. The kit centres a message label on the
  gap between its two actors, so in a `LayarPesan`-first layout the second `props:
  ukuran` message would print its text straight through `PilihUkuran`'s dashed lifeline.
  The cost: `sequence` tints actor 0, so the accent lands on a child. Clean routing beat
  a correct accent — a label crossed by a lifeline reads as a message to the wrong actor.
- **03** neutralises the last stage and tints the **first** one. `flow` accents the final
  stage by default, which would glow on "State management library" on the one slide whose
  job is to kill "professional apps always use Redux".
- **04** draws two children per level. The kit gives a parent with a single child a
  zero-height elbow, which puts parent and child on one y and reads as siblings. The
  merged `CartContext` node from the old chart is deliberately not a third child: a tree
  edge means "contained in", and the context is the value the provider publishes.
- **05** keeps every edge label to one short verb: at five stages the arrow gap is 86px,
  and `tambahItem` as an edge word is wider than the gap.
- **06** asks for less than the pattern allows. A two-row `beforeAfter` (instance, then
  visibility: "known to it and its children" against "one copy, many readers") read better
  as a pair of axes, but at 222 units it pushed the right column's last line onto the page
  number at the bottom right of the slide. One row is 164 units, fits with the grid2 and the
  definition intact, and keeps the third bullet on the slide. The page number sits ~40px
  above the bottom padding on this deck, so a body line that reaches the right margin has
  roughly 615px of vertical room, not 658.
- **07** repeats the `Intermediary` chip twice on purpose: the point is a row of components
  that never read the data, and two of them is what makes the row visible. The accent stays
  on the last stage (`flow`'s default) — the one node that wants the value is at the wrong
  end of the chain, which is the slide's whole complaint.
- **08** leaves row 2 with no counterpart on the avoid side instead of inventing one. The
  avoid panel's footer ("explicit props stay easiest to read") is the presenter-note answer
  to "then what do I do?", deliberately a caption rather than a numbered row: it is not the
  same shape as "data changes across screens".
- **09** is three rows, which at 280 units is 271px on the slide — the most this slide can
  hold between the heading and the page number, and the reason only the first bullet moved.
  The left panel is `amber`, not `beforeAfter`'s default red: these three kinds of data are
  not mistakes, they are data in the wrong place. Putting the picture first is what keeps
  the blockquote off the page number; last, the blockquote plus 271px would overlap it.
- **10** gives `items` four field children, which is both the honest record shape and the
  only way this canvas works. The kit's `tree` is always 1160 units wide with grandchildren
  at x=710, so a three-leaf tree inks only the left half of the canvas and reads as a small
  left-hugging picture; and a parent with a *single* child gets a zero-height elbow, so
  `items` needs at least two children to look like a parent. The cost is height: four field
  slots plus two leaves is a 420-unit canvas, 406px at `w:1120`, which does not fit under
  the heading with the lead line and two bullets. `w:1000` (this deck's second non-1120
  width) is 350px and puts the 16px node labels at 13.8px effective — above the 13px floor,
  and the reason the width came down rather than the type. The image also sits **after** the
  lead line, so "Five questions that must be answered before writing code" introduces the
  picture and the two questions below it instead of hanging under a picture. The cost is
  measured: the last bullet's descenders end 7px above the content edge, the tightest slide
  in this pass, and `slide_check.py` still reports no clipping.
- **11** accents no chip at all. `flow` would tint the last stage, and on this slide that
  would say "the server is the goal" — the opposite of the chapter's "stop at the simplest
  level" and the opposite of a discussion slide, which must not answer its own question.
  The accent lands on the two arrow labels instead, because the requirement that forces the
  climb is the point. The image also sits **after** the grid2 rather than under the heading:
  the build inserts under the heading, but it refreshes an existing line in place, so the
  picture stays where it reads best — prompt, criteria, then the ladder as the summary.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
