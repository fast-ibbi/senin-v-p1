# Chapter 12 diagram specs

`slide-diagrams` kit specs for `slides/bab-12-mengakses-fitur-perangkat.md`. One file = one
picture. A spec carries data only; geometry, text wrapping and the font-size floor are owned
by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so that
flat folder is shared — each deck therefore keeps its specs in its own subfolder and is always
built with `--specs` (see `../README.md`).

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-12-mengakses-fitur-perangkat.md
SPECS=slides/diagrams/bab-12-mengakses-fitur-perangkat

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --png 03
```

Output: `slides/assets/diagrams/bab-12-mengakses-fitur-perangkat-NN.svg`, placed on the slide
as `![w:1120](…)`. Scale 0.966 — a 14px label renders at 13.5px, the tree chips (16px) and the
flow/pane titles (17–18px) at 15.4px and above. No legibility warning fires.

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `flow` | What Is a Device API? | JavaScript → Expo package → device API → hardware → result |
| 03 | `stateMachine` | Permission Request Flow | check, request, granted, denied temporarily, denied permanently |
| 04 | `tree` | Mini Project: Student Profile App | App.js → screen → four data groups, storage module beside it |
| 05 | `beforeAfter` | Sandbox: Why Permissions Exist | without permissions ↔ with them: the sandbox and the runtime request |
| 06 | `tree` | Location: Two Sources of Position | expo-location → GPS, network-based position → Wi-Fi, cell towers |
| 07 | `beforeAfter` | Notification Channels and Permission on Android | without a channel → dropped ↔ with a channel → grouped by type |
| 08 | `beforeAfter` | Case Study: Photo and Location Attendance | a signed sheet ↔ photo + location + device: who vouches for the presence |
| 09 | `flow` | The Other Side: The Attendance Data Privacy Dilemma | the three fields → the reconstruction → the surveillance tool |

Ids 02–04 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output and
the deck's image lines are unchanged apart from the width — 02 and 03 went `w:1100 → w:1120`,
04 went `w:720 → w:1120`. The deck still
has 38 slides; no slide needed splitting, every picture clears the footer at `w:1120`.

Ids 05 and 06 are pictures from the later density pass, which gives a diagram to every
prose slide in the first half of the chapter unless the content refuses one. 05 takes the
number the retired picture left behind (see below); 06 is the first new number.

Ids 07–09 are the second half of the same pass: three pictures on the five prose slides it
was handed (22, 24, 25, 32, 33), and two skips with their reasons in the table further down.
The deck is still 38 slides — this pass splits nothing, and each picture clears the footer
at `w:1120` (measured slack under the last line of prose: 29px on 22, 38px on 32, 90px on
33).

## Choices worth knowing

- **02 keeps the chain but labels it.** The legacy chart had five boxes and no arrow words.
  Four verbs now carry the mechanism: "bridges" and "command" are the slide's own words,
  "come back" is the presenter notes' ("why must the result come back to JavaScript?"), and
  "calls" is the one connector the prose only implies. The first stage deliberately has no
  note — the legacy chart's "your components and functions" is not on this slide, and an empty
  note is quieter than an invented one.
- **03 keeps all three exits.** The legacy chart was a flowchart with two diamonds
  (`granted?`, `canAskAgain?`). A diamond is not one of the six patterns, and the slide's own
  framing is a mode set — the notes say "there are three exits, not two […] the third exit is
  the one students forget most often". `stateMachine` draws the two denied chips as the
  destinations they are, and the return arc from "Denied temporarily" to "Request" is the
  recoverable case. The `temporarily → permanently` arc is unlabelled: neighbouring chips are
  90px apart and no label from this slide fits that gap.
- **04 is containment, not the legacy flowchart.** The old chart drew a screen, four feature
  branches converging on a "Save" node, and two leaves under it — three edges met at one
  node, so it was never a tree. What survives is what the slide actually states: the three-file
  skeleton from the "File structure" bullet, and the four data groups from the first bullet
  hanging off the screen. The save/load step is dropped because it is a step, not containment —
  and it is the whole subject of the next slide.
- **05 is an argument, not a list.** "Sandbox: Why Permissions Exist" states one counterfactual
  and the two mechanisms that answer it as three parallel bullets; side by side they are the
  two-model contrast `beforeAfter` draws, so those three bullets moved into the notes (see the
  slide's own "Trimmed to the picture" block) and the slide keeps only the platform pair the
  picture does not show — Android's version-6 model and iOS's `Info.plist` usage description.
  The panels are uneven on purpose: one threat, two defences.
- **06 is the nesting the prose flattens.** The slide lists one package and two sources, and
  hides a second level inside a parenthesis — "Network-based position (Wi-Fi and cell
  towers)". `tree` is the only pattern with three ranks, and the root is the package because
  the slide's claim is that `expo-location` unites both sources: the arrows read "reaches",
  not "is made of". The trade-off facts (satellite signals, hundreds of meters indoors,
  faster but less precise) are properties, not containment — `tree` drops `note` anyway, so
  they stay in the bullets.
- **07 is the same move as 05, on purpose.** "Notification Channels and Permission on
  Android" states one counterfactual and one mechanism about the same object, so the panel
  pair reads exactly like diagram 05 on slide 5: the negative on the left, the mechanism on
  the right. A student meets the shape twice and reads the second one without effort. The
  picture carries the two bullets it duplicates ("A **notification channel** groups
  notifications by type" and "Without a channel, notifications may be dropped…", both now in
  the notes); the two that stayed are the ones it cannot show — the per-channel sound and
  interruption controls, and the separate Android 13 permission gate. Room decided the shape:
  a one-row panel is the shortest thing the kit draws (164 units ≈ 179px) and this slide had
  123px under its code block, so the two single-line bullets had to pay for it.
- **08 does not redraw the table.** The table on "Case Study: Photo and Location Attendance"
  is three checks beside the feature that answers each — already its clearest form. What the
  table cannot say is why the checks exist: the notes' "a signed attendance sheet can be
  signed for someone else" and the slide's "becomes far harder". That contrast is one row per
  side. No bullet moved: the slide has only two, and this pass keeps at least two on every
  slide. A second row per side (the three checks split out) lands 6px past the theme's bottom
  padding, which is why the right panel names all three checks in one row instead.
- **09 is a chain, not a pair.** "The Other Side: The Attendance Data Privacy Dilemma"
  already reads in one direction: the record combines three fields, those three points
  reconstruct where and when, and without the practices that becomes surveillance. Cause →
  consequence → condition is `flow`. `beforeAfter` was the alternative and it is wrong here
  — the slide holds one progression, not two models side by side — and it would have left the
  three counter-measure bullets beside a picture with nowhere to put them. As drawn the slide
  divides cleanly: the picture is the risk, the three bullets left under it are the answer.
  The last stage is `red` because it is the failure mode, not the accent-worthy outcome.

## The retired picture, and why 05 is a different picture now

An earlier id **05** — a `beforeAfter` of GPS versus network position on "Location: Two
Sources of Position" — was deleted after review: its six panel rows were that slide's own
bullets re-arranged, so the picture added ink and no information. That verdict still stands
and the retired picture has not been restored. The density pass later put the free number 05
on a different slide ("Sandbox: Why Permissions Exist"), and slide 18 got a `tree` (id 06)
that draws the nesting the prose hides instead of restating its rows. If you are looking for
the deleted beforeAfter, it is not in this folder and is not coming back.

## Slides that did not get a picture

The density pass walked six prose slides and drew on two. The four that were left alone, with
the reason, so the next pass does not re-litigate them:

| slide | why no picture |
|---|---|
| Handling Denial as a Normal State | The slide's content *is* a 3×3 matrix (state / what appears / app action), already in its clearest form. A `beforeAfter` of the two denial kinds would restate two of its three rows, and the table cannot move into the notes — so the picture would only add weight. A `stateMachine` of the same states would duplicate diagram 03, three slides earlier. |
| Think-Pair-Share: Choosing a Package | The relationship (scenario → package) is the exercise's *answer*; it lives in the presenter notes as the expected answer. Drawing it on the slide would pre-empt the pair work. |
| expo-image-picker: One Call and Done | Measured: the 13-line code block plus three bullets ends at y=638 of a ~690px content area, leaving 52px. The shortest pattern canvas (160 units) still needs ~176px at `w:1120`, and trimming is capped at one bullet (two must stay). A picture here would force Marp's code auto-scaling to shrink the code font, which is the one thing this pass may not do. It is also a picture of code. |
| Choosing an Accuracy Level | Three ordered precision levels plus two definitional cautions. The relationship is a *scale*: `flow` would read it as a process (and has no verb for its arrows on this slide), `layers` as strata and it could not carry the "Suits" column, `beforeAfter` needs a second model the slide does not offer. The table is the clearest form. |
| File System: The App's Private Directory | Measured: the fifteen-line code block plus three bullets already ends at y=666 — eight pixels *past* the theme's bottom padding, before any picture. The shortest pattern canvas (160 units ≈ 175px on the slide) would push the last bullet off the slide, and trimming is capped at one bullet (three must keep two). It is also a picture of code. |
| Device Info with expo-device | The four table rows are peers — `deviceName`, `modelName`, `osName`/`osVersion`, `isDevice` — and a `tree` of peers is a bulleted list in tree clothing, which `references/patterns.md` rules out by name. The three bullets are three separate remarks (where it is useful, the fingerprinting risk, the minimization rule), not two models and not a chain. Space is *not* the blocker here: one trim would buy room for a one-row panel, but there is no honest relationship to draw, and a picture that only restates the table adds weight. |

## Labels not on their slide

The build prints these every run; they are kept, with the reason:

| spec | label | where it comes from |
|---|---|---|
| 02 | "calls" | a connector verb the prose implies — the slide says the package "does the native part", not how it reaches the OS API |
| 03 | "ask again" | the recoverable denial: the word is `canAskAgain` on "Reading the Permission Result" and "don't ask again" on "Handling Denial as a Normal State", not on this slide |
| 05 | "WITH PERMISSIONS" | the inversion of the slide's own first words ("Without permissions, any app could photograph you…"); the panel needs the opposite state named, and the notes group the two mechanisms the same way ("because of the sandbox and permissions") |
| 07 | "WITH A CHANNEL" | the same inversion, for the same reason: the slide only ever writes the negative ("Without a channel, notifications may be dropped…"), and the right panel needs the opposite state named |
| 08 | "PHOTO + LOCATION + DEVICE" | three words the slide and its table use separately, joined into the name of one model; the band holds four words, not a sentence |
| 08 | "The server checks all three" | "the server checks" is the table's own column header ("What the server checks"); "all three" is the panel's count of the three rows |

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size and
do not edit `lib/`.
