# Chapter 15 diagram specs

`slide-diagrams` kit specs for `slides/bab-15-build-dan-deployment.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively, and every deck lives in `slides/`,
so the flat folder is shared by all fifteen chapters. Each deck's specs therefore live
in their own subfolder and are always built with `--specs` (see
`slides/diagrams/README.md`).

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-15-build-dan-deployment.md
SPECS=slides/diagrams/bab-15-build-dan-deployment

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS
```

Output: `slides/assets/diagrams/bab-15-build-dan-deployment-NN.svg`, placed on the
slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 01 | `sequence` | EAS Build: Heavy Lifting in the Cloud | send the project code → compiling in the cloud → download link |
| 02 | `flow` | Build Flow with EAS | eas-cli → eas login → build:configure → eas build → APK or AAB |
| 03 | `tree` | Why AAB Exists: Split APKs | one AAB → APK per processor architecture / screen density / language |
| 04 | `flow` | EXPO_PUBLIC_: Values Embedded in the Bundle | .env → build time → JavaScript bundle → every user can read it |
| 05 | `flow` | App Store: Conceptual Flow | eas build → App Store Connect → TestFlight → Review → Release |
| 06 | `layers` | iOS Build: Conceptual but Locked | installation path / signing certificate / Apple Developer Program |
| 07 | `flow` | What Is a Build? | JavaScript bundle → native shell → one installable file |
| 08 | `beforeAfter` | app.json: Name, Version, and Version Number | humans read `expo.version` ↔ machines read `expo.android.versionCode` |
| 09 | `flow` | Application ID: Permanent Once Published | application ID → published → a new app whose users and reviews vanish |
| 10 | `layers` | Icon, Adaptive Icon, and Splash Screen | `foregroundImage` drawn on `backgroundColor` |
| 11 | `beforeAfter` | Environment Variables: Configuration Outside the Code | `EXPO_PUBLIC_` inlined into the code ↔ unprefixed values the app never reads |
| 12 | `beforeAfter` | Signing: Proof of Build Authenticity | anyone can rebuild ↔ only the key owner can sign, and what the system does with each |
| 13 | `flow` | Google Play: Four Release Tracks | internal → closed → open → production, with the gate that lets each next audience in |

Ids 02–05 reuse the file names of the old Mermaid charts (the `.mmd` files stay in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit
output and the deck's image lines did not move. Ids 01 and 06 are new pictures; 06
sits on slide 13, before 04 and 05 in slide order, because 02–05 are pinned to the
legacy SVG paths and 06 is the next free integer.

Ids 07–10 come from the density pass — the one that gives every remaining prose slide a
picture instead of stopping at 3–6 per chapter. Pattern tally across all ten: `flow` 5,
`layers` 2, `sequence` 1, `tree` 1, `beforeAfter` 1. `flow` lands on exactly half, which
is the ceiling; each of the five is genuinely a chain (stages with a verb between them),
and the alternatives were worse pictures, not better colour: `stateMachine` for 09 and
`tree` for 07/10 were both considered in the spec comments and rejected for a stated
reason.

### Second-half density pass (ids 11–13)

The pass that finished the chapter: slides 20, 22, 25 and 29 were the last prose slides
with no picture. Three of the four now carry one. Tally across all thirteen: `flow` 6,
`layers` 2, `beforeAfter` 3, `sequence` 1, `tree` 1 — `flow` is 46%, under the half
ceiling, and the two new `beforeAfter` pictures are contrasts the prose states in one
sentence each, not decoration.

| id | slide | why this pattern |
|---|---|---|
| 11 | 20 | one `.env` file, two kinds of value: only the prefixed one reaches the app code. The chain `.env → build time → bundle → user` is already diagram 04 on the next slide, so this picture deliberately answers the other question — *which* variables end up inside the app |
| 12 | 22 | the rule is "anyone can rebuild it, only the key owner can sign it", and the consequence is a reject. Two doers on one axis, three matched rows; `sequence` would have invented an order the slide never states |
| 13 | 25 | the slide's own notes say "read this table as a ladder"; four rungs in a fixed order with a gate between each pair is a chain. `layers` was considered and would have duplicated the rows without naming the gates |

What had to be made to fit:

- **11** and **12** are standard `w:1120` / automatic-height `beforeAfter` pictures and
  needed no compensation — both slides had over 300px of empty space below the bullets.
- **13** is the one picture in this deck that does **not** sit directly under its heading,
  and the only one on a 160-unit canvas. The slide is a heading, two definition bullets
  and a five-row table whose 235px leave ~213px below it; inserted under the heading, the
  table is pushed onto the page-number band (measured: last-row ink y604–623 at the
  160px floor and y607–626 at the auto 184, against the number at y623–635 — that is the
  number drawn *inside* the last row). Below the table the picture's last ink is at y605,
  clear of the number. The image line can sit anywhere in the slide: `build.mjs` finds an
  existing line by its `src` and leaves it where it is, so this placement is stable across
  rebuilds.
- **Bullets moved into presenter notes** (verbatim, under `Trimmed to the picture (the
  diagram says this):`). Slide 20: two — "Only variables prefixed with `EXPO_PUBLIC_` are
  inlined into the app code" and "Inside the code they are read as
  `process.env.EXPO_PUBLIC_API_URL`", which are the two panels' rows. Slide 22: two —
  "Anyone can rebuild the app, but only the owner of the key can sign it" and "The system
  rejects an update signed with a different key", which are rows 1 and 3. Slide 22 keeps
  its definition bullet, the `.jks` / `.keystore` parenthetical (the picture does not draw
  file types) and the EAS-storage bullet. Slide 25 keeps both bullets and loses nothing:
  the picture lists the four track names but never defines the word "track".

### What had to be made to fit, and how

- **07** writes `canvas: [1160, 168]`. `flow` reserves a 44px note row for up to two
  lines and these notes are one line each, so the default 184px left dead space that
  pushed slide 5's bullet list onto the page-number band (measured: bullet ink at
  y 614–635 against the number at 623–635). 168px keeps 14px under the note ink. No
  font size changed.
- **08** started as three rows (key / form / rule) at 280px, which put slide 16's
  blockquote on the same page-number band (ink 604–635). It is two rows now;
  "`major.minor.patch`" and "an integer" survive in the trimmed bullets. Trimming more
  prose was not available: `expo.name`, `expo.slug` and `autoIncrement` are not version
  readers, so the picture does not say them and rule 4 keeps them on the slide.
- **Bullets moved into presenter notes** (verbatim, under `Trimmed to the picture (the
  diagram says this):`). Slide 5: one — "The bundle is combined with the Android/iOS
  native shell", which is the picture's first arrow plus the `Android / iOS` note.
  Slide 16: two — the `expo.version` and `expo.android.versionCode` lines, which are the
  picture's two rows. Slide 17: two — "Once published, the ID may not be changed" and
  "old users and reviews seem to vanish", which is the whole chain the picture draws;
  the three bullets that stay are about how the ID is *written*, which the picture only
  illustrates with its `ac.id.univ + mahasiswa` note. Slide 18 keeps all five: its
  picture duplicates only the adaptive-icon bullet, and that bullet is the one line that
  names `adaptiveIcon`, which `layers` bands cannot draw — trimming it would leave two
  floating labels with no owner.

## Why these three in the second half, and no more

Ids 11–13 exist because the author asked for a density pass over the chapter's remaining
prose slides. Each one names a relationship the prose states but does not show: which
variables survive the prefix rule, who can sign and who gets rejected, and which way the
release ladder points. Nothing here was drawn to fill a slide.

Skipped in the second half, deliberately:

- **Case Study: The SIAKAD Mobile 1.0 Incident** (slide 29). This is the one slide of the
  four that was reconsidered and still refused, for three reasons that stack. (1) It is
  five narrated incident facts with no single relationship between them: three of them are
  parallel damage threads (distribution, signing, configuration) that converge on one cost,
  and none of the six patterns draws "three things converge". (2) The mapping that *does*
  exist — symptom → root cause → fix — is the next slide's five-row table ("Every Symptom,
  One Section"), so any cause picture here would duplicate the table one click away. (3)
  Its own presenter notes say "Read it as a story, not a list", and the deck-audit rule
  reads a case study delivered as a story as a slide already doing its job. `tree` (the
  incident fanning into three failures) and `flow` (one thread, ignoring the other two)
  were both drafted and both misrepresent the slide: the first claims containment where
  there is cause, the second drops three of its five facts. Room was not the objection —
  the slide has ~310px free.

## Why the first ten, and no more

Ids 07–10 exist because the author asked for a density pass; they are the four prose
slides of the first half of this chapter, and each one names a relationship (a chain of
assembly stages, two readers of one version, a consequence chain, a two-surface icon).
Nothing here was drawn to fill a slide.

Skipped in the first half, deliberately:

- **Development Build vs Production Build** and **APK vs AAB** — GFM tables that are
  already the clearest form of a criteria comparison. `beforeAfter` is for models, not
  spec sheets.
- **Three Build Profiles**, **Three Build Environments**, **Every Symptom, One Section**,
  **Application in IS/IT Practice** — tables with no order or dependency to draw. (The
  release-track table was the exception and is now diagram 13.)
- **eas.json**, **Example: app.json** — code. A picture of code teaches nothing.
- **Exercise: Choosing a Release Channel**, **Mini Quiz**, **Answers** — a quiz and its
  answers.
- **Learning Objectives**, **Summary**, **Practicum**, **References** — lists.
- **Learning Objectives / section dividers / the closing slide** — no `## ` heading.

## Provenance: what the build reports, and why

Every spec quotes its slide. The misses that remain, with the reason:

Specs 11–13 report no misses. Two of their labels are not in the visible bullets but in the
presenter notes, which provenance reads as part of the slide block: spec 11's unprefixed
side ("available during the build process", "the app will never read them") is the notes'
own sentence, because the bullet states the rule only in its positive form ("Only
variables prefixed with `EXPO_PUBLIC_` are inlined"); spec 13's edge labels are short forms
of the table's "Note" column. Neither is an invented participant or step.

| spec | label | why it is not on that slide |
|---|---|---|
| 02 | "APK or AAB" | the artifact names live on the next slide's table (APK vs AAB) and in the chapter's section 15.2; slide 10 stops at the command |
| 03 | "APK per …" (3 labels) | "per" is the connector the blockquote implies ("only contains the processor architecture, screen density, and language of that device"); the `APK` noun comes from the heading "Why AAB Exists: Split APKs" |
| 04 | "Build time", "inlined" | the inlining rule is slide 20's ("Only variables prefixed with `EXPO_PUBLIC_` are inlined into the app code"); slide 21 states only the consequence |
| 05 | "eas build" | the iOS build command is in the legacy chart and in section 15.9; slide 27's notes say only that EAS handles "the certificate and the upload" |
| 05 | "Connect" (wrapped half of "App Store Connect") | the two-word gate name is the legacy chart's; slide 27 says "the App Store", and the chip wraps after "App Store" |
| 05 | "the app is registered" | the registration gate is in slide 13's notes ("registering the app in App Store Connect before it is built"), not on slide 27 |
| 05 | "internal and external" (wrapped line of "internal and external testers") | slide 27 says "hundreds of internal testers and thousands of external testers"; the wrap splits the phrase |
| 07 | "Metro produces it" | the slide writes "Metro produces the JavaScript bundle"; the pronoun replaces the chip's own label so the note does not repeat "bundle" three times in one row |
| 08 | "1.0.0 → 1.1.0 → 1.1.1 → 2.0.0" | the blockquote annotates every step — "`1.1.0` (new feature) → `1.1.1` (bug fix)" — so no contiguous run of the four versions exists in the text; the picture drops the annotations to keep the journey on one row |

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture across two slides, or pick another pattern — do not
lower the font size and do not edit `lib/`.
