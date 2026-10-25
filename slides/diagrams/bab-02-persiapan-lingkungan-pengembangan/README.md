# Chapter 2 diagram specs

`slide-diagrams` kit specs for `slides/bab-02-persiapan-lingkungan-pengembangan.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively, and every deck lives in `slides/`.
A flat folder would make each deck load every other deck's specs, and each build would
fail with "names slide … but no ## heading matches" and "duplicate id". Chapter 2's specs
therefore live here and are always built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-02-persiapan-lingkungan-pengembangan.md
SPECS=slides/diagrams/bab-02-persiapan-lingkungan-pengembangan

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --png 04
```

Output: `slides/assets/diagrams/bab-02-persiapan-lingkungan-pengembangan-NN.svg`, placed on
the slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px). Two exceptions are
`tree`s, which the kit left-packs: id 08 cuts its canvas to the drawing (`canvas: [660, 234]`,
`imgWidth: 660`) and id 10 to `canvas: [1034, 234]`, `imgWidth: 1034` — drawn at scale 1, so an
18px root label stays 18px on the projector.

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 01 | `layers` | Diagram: Node.js: A JavaScript Runtime Outside the Browser | V8 → Node.js → Expo CLI · Metro Bundler |
| 02 | `flow` | Metro Bundler and Fast Refresh | source files → Metro (8081) → bundle → device |
| 03 | `tree` | The Flow for Creating the First Project | two phases holding the six practicum steps |
| 04 | `flow` | Execution Flow: index.js then App.js | package.json → index.js → App.js → display |
| 05 | `flow` | npm: The Project's Package Manager | package.json → npm install → registry → node_modules/ |
| 06 | `flow` | VS Code: The Editor and Helper Extensions | save → Prettier → ESLint → Error Lens |
| 07 | `stateMachine` | When the Command Is Not Recognized | not found → PATH not loaded → version prints, with a reinstall loop |
| 08 | `tree` | Expo CLI: The Command-Line Interface | npx → create-expo-app, expo start, expo install |
| 09 | `beforeAfter` | Expo Go: Fast, with Limits | what you get ↔ the price you pay |
| 10 | `tree` | Android Emulator: Android Studio and AVD | Android Studio holds the emulator and the AVD Manager; the AVD Manager asks for a phone model and an Android version |
| 11 | `flow` | adb and Physical Devices | Developer options → USB debugging → RSA authentication → `adb devices` |
| 12 | `layers` | iOS Simulator: An Introduction | iOS Simulator → Xcode → macOS, and nothing else |
| 13 | `beforeAfter` | Creating the First Expo Project | the three parts of the command ↔ what each part does |
| 14 | `flow` | Starting the Development Server | `npx expo start` → the Expo terminal → a · i · w → the display |

Ids 02–04 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output.
Their `imgWidth` was raised from 720 to 1120: at 720 a 14px label rendered at 8.7px.

Id 01 is a new picture on a new slide. The prose slide ("Node.js: A JavaScript Runtime
Outside the Browser") is a two-column grid with six bullets; it has no room for a 1120-wide
image and could only have held the picture at an illegible width. Per the deck-pass
convention the prose slide stays intact and the picture follows it on its own
`## Diagram: <original heading>` slide.

Ids 05–09 are the density pass on the first half of the chapter. Each one sits under the
slide's own heading, and the bullets the picture reproduces moved verbatim into that slide's
presenter notes under "Trimmed to the picture (the diagram says this):". Three slides also
lost a bold column header ("Its duties", "Extensions that help", "What you get" /
"The price you pay") because the header was the emptied column — the wording either survives
inside the picture (05 and 09) or is covered by the slide title (06).

Two slides in the same range were left alone on purpose:

- **Node.js: A JavaScript Runtime Outside the Browser** (slide 4) already has its picture,
one slide later, as id 01. A second drawing of the same stack on the prose slide would be
filler, and the slide has ~100px of free height at `w:1120` — the only pattern that fits
(`beforeAfter` on the two misconceptions) would not fit without gutting both columns.
- **Package Manager: Why, and Which One to Choose** (slide 8) is a spec sheet: three
criteria on three options is what the table already is. Its only relational idea (record →
install → node_modules) is the same pipeline as id 05, one slide earlier.

Ids 10–14 are the density pass on the second half of the chapter, same conventions: picture
under the slide's own heading, duplicated bullets moved verbatim into the presenter notes
under "Trimmed to the picture (the diagram says this):".

- **10** reads the two tool bullets as containment instead of a sequence, because the slide
asserts none; the advantage/limitation pair stays, since no container shows cost or sensors.
- **11** is the one slide here where order is the difficulty — the notes say the order is
"often reversed" — so the setup steps became a chain. The two bullets that stay are the ones a
chain cannot hold: what adb is for, and that Expo Go needs no cable.
- **12** drops its first bullet into the notes and keeps the absence ("Windows and Linux
cannot run it at all") plus the two alternatives: a stack can show what holds the simulator
up, not what cannot run it.
- **13** moved only one of its three bullets, because the rule for this pass keeps two on the
slide. Rows 2 and 3 of the picture therefore repeat the two bullets that stayed; the mapping
is still the point, and a `flow` of the four commands would have redrawn id 03 one slide later.
  Its lead-in line (`` `Terminal` — from the working folder to a running server ``) also moved
into the notes: at `w:1120` the panel ran 60 px past the bottom edge, and trimming prose is the
remedy — not a smaller width, and never a smaller font.
- **14** moved its "what appears" bullet only. The picture names `a · i · w`, but not the
`r` reload key and not Ctrl+C, so both of those bullets stayed.

One slide in this range was left alone on purpose:

- **Class Discussion: Reproducibility** (slide 38) is a discussion prompt — two questions on
the left, the two assessment criteria on the right — already laid out side by side by the
`grid2` theme. Neither column is a relationship between parts. The only relational idea on the
slide (cause against prevention) lives in the presenter notes, and drawing it would mean
inventing a "cause" column the slide never states. Skipped.

## Pattern mix

Fourteen pictures: six `flow`, three `tree`, two `layers`, two `beforeAfter`, one
`stateMachine`. No pattern carries more than half (six of fourteen). Slide 22's checklist has
six steps and `flow` takes five, so the phases are drawn as containment (`tree`) rather than
merging `cd aplikasi-pertama` and `code .` into one stage. Slide 14's trade-off was drawn as
`beforeAfter` rather than a seventh `flow`, and slide 19 (the emulator) as a `tree` rather than
the `flow` its bullets invite, exactly to keep that ratio — and because the slide states no
order.


## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
