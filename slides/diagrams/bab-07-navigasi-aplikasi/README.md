# Chapter 7 diagram specs

`slide-diagrams` kit specs for `slides/bab-07-navigasi-aplikasi.md`. One file = one
picture. A spec carries data only; geometry, text wrapping and the font-size floor are
owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so
that flat folder is shared — each deck therefore keeps its specs in its own subfolder and
is always built with `--specs` (see `../README.md`).

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-07-navigasi-aplikasi.md
SPECS=slides/diagrams/bab-07-navigasi-aplikasi

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --png 04
```

Output: `slides/assets/diagrams/bab-07-navigasi-aplikasi-NN.svg`, placed on the slide as
`![w:1120](…)`. Scale 0.966: the smallest label (14px) renders at 13.5px; the tree and
stateMachine chips (16px) at 15.4px.

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 01 | `beforeAfter` | Navigation: An Early Architecture Decision | without a library ↔ with a library, matched rows |
| 02 | `beforeAfter` | From File to Address | four files ↔ the route address each one produces, the dynamic segment as `:id` |
| 03 | `tree` | Nested Navigation: A Tab Containing a Stack | Tabs → tab → the Stack that tab owns → its screens |
| 04 | `stateMachine` | Why Is the List Stale After Going Back? | mounted once, then focus/unfocus, and focus returns |
| 05 | `tree` | Protected Screen: A Single Control Point | one group layout above every screen it protects |
| 06 | `beforeAfter` | What Is Navigation? | the browser's three parts ↔ the navigator's three parts, matched rows |
| 07 | `tree` | File-Based Routing: Folders Become Addresses | the `app/` folder and the address each file becomes |
| 08 | `flow` | Case Study: the "SehatIn" Clinic | the deep link's chain: notification → `sehatin://janji/415` → Appointment Detail |

Ids 02–05 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output
and the deck's image lines are unchanged apart from the width. Id 01 is a new picture;
the deck still has 38 slides — no split was needed, every picture fits its slide at
`w:1120` without touching the footer.

## Choices worth knowing

- **02 is a correspondence, not a hierarchy.** `tree` would draw the `app/` folder and
  lose the addresses; `beforeAfter` is the only pattern with matched rows on two sides,
  which is what "which file produces which address" needs. Both panels are forced to
  monospace so filenames and addresses share one voice.
- **03 merges two ranks.** The legacy chart had four (Tabs → tab → Stack → screens) and
  `tree` stops at three, so the tab and its Stack share the chip
  `Students tab · Stack` — the slide's own phrase is "a tab containing a Stack".
- **04 is a cycle on purpose.** `flow` would have flattened it into a pipeline and said
  the screen is mounted again each time, which is the misconception the slide removes.
  The return edge is labelled "focus returns", the slide's own words.
- **05 dropped the yes/no diamond** that the legacy chart drew: that branch belongs to
  the next slide (`The Redirect Pattern and the Redirect Loop Trap`). Slide 25 says one
  thing — one control point, every screen inside it — which is containment.
- **05 writes the fourth screen as "Form".** `tree` renders any label containing a slash
  in monospace, and one mono chip beside three proportional ones reads as an accident.
  The alt text keeps the route-map name "Add/Edit Form".

## Labels not on their slide

Specs 01 and 02 have no misses at all: both panels are titled with the slide's own words
(`WITHOUT A LIBRARY` / `THE PAYOFF` on 01; `FILE` / `ADDRESS` on 02), and 02's four files
and four addresses are the mapping the `From File to Address` slide now states in its note,
with the dynamic segment written `:id` as on the route map. The build prints what is still
left below every run; it is kept, with the reason:

| spec | label | where it comes from |
|---|---|---|
| 03 | "Home tab", "Students tab · Stack" | the tabs are named on `Practicum 7: The Flow Under Test` ("two tabs: Home and Students"); the stack comes from this slide's notes |
| 04 | "focused", "unfocused", "loses focus" | inflections of the slide's "focus"; the leave event is the translated verb of the legacy chart ("Kehilangan fokus") |
| 05 | "Home", "Student List", "Student Detail", "Form" | the route map table on `Route Map of the Student Data Management App` |
| 08 | "the deep link", "in the Appointments stack" | the chip notes: the slide's own bold label "Deep linking" and the case's "a stack inside each tab" |

## Density pass on the second half of the chapter

Slides 23, 26, 29 and 36 were the prose slides with no picture. One earned a diagram;
the other three are recorded here with the measurement that stopped them, because in
each case the reason is a slide budget, not a missing pattern.

| slide | verdict | why |
|---|---|---|
| 29 · Case Study: the "SehatIn" Clinic | **08 `flow`** | Pattern and Guard are already drawn by 03 and 05; the deep link is the one claim no picture made, and it is a chain |
| 23 · `useFocusEffect` and `useCallback` | skipped | an 11-line code block plus a one-line caption already end at y=620 of the 1280×720 frame (38px of room). The smallest legible picture the kit can emit is 175px (a 160-unit canvas at `w:1120`: 154px plus the theme's 2×0.4em image margin), and both bullets must stay — trimming them is the only thing that would make the room |
| 26 · The Redirect Pattern and the Redirect Loop Trap | skipped | same shape, less code: content ends at y=545, so 113px free, 153px once the `app/(app)/_layout.js` caption moves to the notes — still under the 175px floor. The remaining candidates are also the wrong picture: the check→`<Redirect />` chain restates the code block printed above it, and the redirect loop needs a `stateMachine` (263px) |
| 36 · Class Discussion: A Structure Wrong from the Start | skipped | room is not the problem (198px free). Its four bullets *are* the slide — two questions and the two criteria that grade them — and a two-column grid already pairs them. Any picture of that pairing duplicates a column, and moving a column out only to draw it puts the same words on the slide twice. Rule "keep at least two bullets" leaves exactly two, so the columns cannot both leave. No discussion slide in any chapter of this book carries a picture |

Spec 08 costs one bullet: `**Deep linking:** …` moved verbatim into slide 29's presenter
notes under "Trimmed to the picture (the diagram says this):". The Case Study slide keeps
`Pattern` and `Guard`, which the picture does not show. `trim_check.py` reports
`bullets moved into notes: 1 · bullets lost: 0`, and the picture clears the footer at
`w:1120` (smallest label 13.5px).

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
