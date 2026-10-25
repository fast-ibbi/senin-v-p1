# Chapter 5 diagram specs

`slide-diagrams` kit specs for `slides/bab-05-dasar-react-native.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so that
flat folder is shared by all 15 chapters — the moment one deck puts specs there, every
deck loads every other deck's specs and the builds fail with "names slide … but no ##
heading matches" and "duplicate id". Chapter 5 specs therefore live here and are always
built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-05-dasar-react-native.md

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-05-dasar-react-native --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-05-dasar-react-native

# facts table for the whole deck (read-only)
node $SKILL/scripts/build.mjs $DECK --audit

# look at one picture (needs rsvg-convert, qlmanage, or Chrome)
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-05-dasar-react-native --png 11
```

Output: `slides/assets/diagrams/bab-05-dasar-react-native-NN.svg`, placed on the slide as
`![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

Ids run in slide order. Ids 02–04 reuse the file names of the old Mermaid charts (the
`.mmd` files stay in `assets/diagrams/` as a provenance trail), so the SVGs at those paths
are now kit output and the deck's image lines did not move. Ids 05–14 and 18–21 are
additions; there is no id 01.

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `tree` | From JSX to Native Components | one JSX → react-dom → DOM, or → React Native → UIView / ViewGroup |
| 03 | `tree` | Three Tools for Platform Differences | small difference → `Platform.OS`, `Platform.select`; large → `.ios.js`, `.android.js` |
| 04 | `sequence` | Practicum: Student Profile Layout | data down through props, the touch back up through `padaPilih` |
| 05 | `beforeAfter` | One Screen, One Main Scroller | nested scrollers break virtualization ↔ one main scroller keeps it |
| 06 | `beforeAfter` | Flexbox: Default Direction `column` | the web default `row` ↔ the React Native default `column` |
| 07 | `flow` | Diagram: React Web vs React Native | React 2013 → React Native 2015 → native components, and the price |
| 08 | `tree` | Diagram: View and Text: The Visual Alphabet | `View` holds components; `Text` is the only text carrier |
| 09 | `beforeAfter` | Diagram: Image: Two Image Sources | local `require` ↔ remote `uri` with explicit dimensions |
| 10 | `beforeAfter` | Diagram: Touch: Button and Pressable | the fixed platform button ↔ the composable `Pressable` |
| 11 | `flow` | Diagram: TextInput: Controlled Component | `onChangeText` → state → re-render → `value={nama}` |
| 12 | `layers` | Diagram: SafeAreaView and the Safe Area | notch, safe area, content, home indicator from top to bottom |
| 13 | `layers` | Diagram: Style Arrays and Conditional Styles | the later style sits above the base style and overrides it |
| 14 | `flow` | Diagram: Case Study: A List That Lags While Scrolling | slow list → flatlist → card layout → `Platform.select` |
| 15 | `beforeAfter` | React Web vs React Native | what stays (thinking, concepts) ↔ what changes (the medium) |
| 16 | `beforeAfter` | Image: Two Image Sources | the box before a remote photo loads ↔ once it is loaded |
| 17 | `beforeAfter` | TextInput: Controlled Component | `value={nama}` present ↔ absent, and the consequence |
| 18 | `beforeAfter` | SafeAreaView and the Safe Area | the built-in `SafeAreaView` (iOS only) ↔ `react-native-safe-area-context` |
| 19 | `stateMachine` | Style Arrays and Conditional Styles | a row's two style modes, `baris` ↔ `barisAktif`, switched by `aktif` |
| 20 | `flow` | Responsive Layout with `useWindowDimensions` | rotation → width → re-render → `numColumns` |
| 21 | `layers` | Case Study: A List That Lags While Scrolling | the `FlatList` above the hundreds-to-thousands of rows it renders |

Pattern mix after id 21: eight `beforeAfter`, three `tree`, four `flow`, three `layers`,
one `sequence`, one `stateMachine`. No pattern carries more than half of the twenty
pictures (`beforeAfter` is 8/20).

## Why some pictures sit on a prose slide

`02`, `05`, `06`, `03`, `04`, `15`, `16`, `17`, `18`, `19`, `20` and `21` are bound to the
prose slide itself; every other spec is bound to its own `Diagram: <heading>` slide placed
after the prose. For `02`–`04` the image line is the only thing added. `15`–`21` also move
prose: each slide's presenter notes now open with a
`Trimmed to the picture (the diagram says this):` block holding the bullets the picture
duplicates, word for word (`19` moves nothing — no bullet is fully shown by it). No bullet
was deleted — see the density-pass sections below. The prose-slide pictures were checked in
the Marp PNG export at `w:1120`: nothing clips and nothing collides with the footer.

## What this chapter deliberately does not draw

- **Every table slide** (Table 5.1, `ScrollView` or `FlatList`, Core Flexbox Properties,
  the References). A spec sheet is already in its clearest form, and `beforeAfter` is for
  models, not criteria lists.
- **Every code slide** (`View with Nested Text`, `Remote Image`, `Pressable with a
  Function Style`, `A Simple TextInput`, `A Basic FlatList`, `Row, Grid, and Footer`,
  `Layered Style with Platform.select`). A picture of code teaches less than the code.
- **`StyleSheet, Not CSS`** — see the second density pass below: a one-row pair was drawn
  and then withdrawn, because the slide has no room for any picture the kit can render.
- **`What Happens If…?`** — three questions whose answers are drawn on later slides. A
  picture here would answer them early.
- **Lists of peers** (the five learning objectives, both summaries, the comprehension
  check and its answers, the discussion prompts), and the part-title slides.

The English pass added no picture: every relational slide in this chapter was already
served, and the prose above is text that wanted to stay text.

## Notes from the English pass

The specs were written against the Indonesian deck and re-bound to the English headings
when the deck was translated. Three were corrected after looking at the rendered SVGs:

- **03** — `large difference` had a single child (`.ios.js / .android.js` in one chip).
  A `tree` parent with one child gets a zero-height elbow, so parent and child sat on the
  same y and read as siblings. The pair is now the two files the slide names.
- **07** — the edge label `native modules` measured 106px in a 118px gap in Chrome, 6px
  from the next chip. It is now the singular the prose uses, with 10px of clearance.
- **11** — the chain started at `nama state` with the edge label `keystroke` on the arrow
  state → onChangeText, which reads against the prose ("onChangeText updates it on every
  keystroke"). It now starts at `onChangeText`, and the label that overflowed its 100px
  gap (`state changes`, 91px) is `triggers`.

## Density pass (prose slides 4, 9, 12, 15, 18)

A later pass asked for a picture on the five prose slides that still carried no image. All
five already have a facing `Diagram: <heading>` slide with a picture of their central
relationship, so the pass drew only where a *different* relationship was available and
skipped where it was not. No slide was added or removed (46 slides before and after), no
picture was deleted, and every trimmed bullet is preserved word for word in the
presenter notes.

| slide | verdict | picture | why |
|---|---|---|---|
| 4 · React Web vs React Native | drawn | `15` | facing `07` is a `flow` of the history; this takes the other axis (invariant ↔ change) |
| 9 · View and Text | skipped | — | containment is on facing `08`; the second reading is the `✗`/`✓` rule, which is already a styled blockquote on the slide |
| 12 · Image: Two Image Sources | drawn | `16` | facing `09` is local ↔ remote; this draws what the box holds *before* and *after* a remote photo loads, which no other slide shows |
| 15 · Touch: Button and Pressable | skipped | — | the `Button` ↔ `Pressable` comparison is on facing `10` |
| 18 · TextInput: Controlled Component | drawn | `17` | facing `11` is a `flow` of the controlled loop; this draws controlled ↔ uncontrolled, the case `11` cannot show |

The two skips also fail on space, measured in the Marp PNG export: slides 9 and 15 are
`grid2` slides whose two-column prose plus blockquote already reach y≈520 and y≈545 of a
720px frame, so the smallest legible picture (a 184-unit `flow`, ≈178px at `w:1120`) fits
neither. Going below `w:1080` would put a 14px label under 13px on the projector, which
this chapter does not do.

Trimming: `15` moved two bullets to its notes, `16` two, `17` two. Each slide still
shows three bullets, and no bullet that the picture does not show was moved.

## Second density pass (prose slides 25, 28, 29, 34, 37)

The same task, run again on the second half of the chapter with the usual 3–6 pictures per
chapter explicitly overridden: every prose slide with no image gets a picture unless it
has no room. No slide was added or removed (46 slides before and after), no earlier picture
was touched, and every trimmed bullet is preserved word for word in its notes.

| slide | verdict | picture | why |
|---|---|---|---|
| 25 · SafeAreaView and the Safe Area | drawn | `18` | facing `12` is the screen's `layers`; this takes the other axis the slide teaches — which API you write and what it does per platform, the notes' own misconception |
| 28 · StyleSheet, Not CSS | **skipped** | — | measured: no room. See below |
| 29 · Style Arrays and Conditional Styles | drawn | `19` | facing `13` is the precedence stack; this draws the conditional, which no picture showed |
| 34 · Responsive Layout with `useWindowDimensions` | drawn | `20` | the chain the second bullet states: a rotation is not a one-off measurement |
| 37 · Case Study: A List That Lags While Scrolling | drawn | `21` | facing `14` is the decision chain; this draws what makes the lag stop — the list renders only the visible slice of the data |

Trimming: `18` (slide 25) moved two bullets, `20` (slide 34) one, `21` (slide 37) two.
Slide 29 keeps all five: no bullet is fully shown by a two-chip state machine, so nothing
could honestly move. Because nothing could move there, `19` is the one spec in this
deck that overrides the canvas (`canvas: [1160, 200]`): the natural `stateMachine` height
carries 66 units of unused bottom room, and cutting it moved the last bullet's ink from
y=623 — hard against the page-number band — to y=553. Same trade as `bab-11-13`.

### Why slide 28 has no picture

Measured in the Marp PNG export at `w:1120`, not estimated:

- the code block ends at y=541 of a 720px frame, leaving ~115px before the theme's bottom
  padding, and the page number sits in the band y=623–635;
- a picture inserted under the heading costs its own height **plus 34px** of heading/image
  margin, and each bullet trimmed buys back 45px;
- rule 4 caps the trim at two bullets on a four-bullet slide, so the largest admissible
  picture is ~135px tall;
- the shortest picture the kit can emit is a one-row `beforeAfter` at 164 units = **158px**
  (`layers` 198 units, `tree` 172, `flow` 184, `sequence` 206, `stateMachine` 272).

A one-row pair was drawn and built: the code block then ended at y=643 and the page number
`24 / 41` sat on its grey panel — the only slide in the deck where that happens, and the
house rule is that nothing collides with the footer. Lowering `imgWidth` to buy the 23px
would put the panel's 14px badge digit at 12.1px on the projector, so the picture was
withdrawn and the slide's four bullets were restored, not left trimmed. Ids stay
sequential: the withdrawn spec was 19, so `20`–`22` were renumbered to `19`–`21` in the
same pass.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
