# Chapter 11 diagram specs

`slide-diagrams` kit specs for `slides/bab-11-penyimpanan-data-lokal.md`. One file =
one picture. A spec carries data only; geometry, text wrapping, and the font-size
floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively. Every deck lives in `slides/`, so
that flat folder would load every chapter's specs at once and both builds would fail
with "names slide … but no ## heading matches" and "duplicate id". Chapter 11's specs
therefore live here and are always built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-11-penyimpanan-data-lokal.md

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-11-penyimpanan-data-lokal --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs slides/diagrams/bab-11-penyimpanan-data-lokal

# facts table for the whole deck (read-only), before deciding anything
node $SKILL/scripts/build.mjs $DECK --audit
```

Output: `slides/assets/diagrams/bab-11-penyimpanan-data-lokal-NN.svg`, placed on the
slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `beforeAfter` | Cache Workflow When the Network Fails | the success arm and the failure arm of one request |
| 03 | `beforeAfter` | Secure Storage: Keychain and Android Keystore | what goes in AsyncStorage vs secure storage, and what protects it |
| 04 | `layers` | Data Flow: Screen, Small API, Storage | screen → small API → storage, with the file that owns each level |
| 05 | `flow` | Diagram: JSON Serialization: Bridging the String Rule | array → JSON string → storage → array again |
| 06 | `beforeAfter` | Why State Alone Is Not Enough | state in RAM that vanishes vs local storage that is still there tomorrow |
| 07 | `tree` | What AsyncStorage Is | one store, two keys, and the value inside each drawer |
| 08 | `flow` | Reading Must Not Crash the App | parse → SyntaxError → crash, the chain the guard exists to stop |
| 09 | `beforeAfter` | Cache: A Copy So the App Stays Useful | the same screen without a cache and with one |

Ids 02–04 reuse the file names of the old Mermaid charts (the `.mmd` files are still in
`assets/diagrams/` as a provenance trail), so the SVGs at those paths are now kit output.
Id 05 is a new picture and takes the next free number, the same way Chapter 6's id 05 does
even though its slide comes earlier in the deck. Ids 06–09 are the density pass over the
first half of the deck and keep counting from 05.

Pattern spread after 06–09: `beforeAfter` 4, `flow` 2, `layers` 1, `tree` 1 of 8 — exactly
half is beforeAfter, which is the ceiling, not a comfortable average. 06 and 09 are both
two-model contrasts and neither can be reframed honestly: 06 has no order (a `flow` would
invent a sequence) and 09 has no strata (a `layers` stack would claim the cache sits *on*
the server). If a later pass adds pictures to this deck, add them in another pattern.

### Second half of the deck (density pass)

| id | pattern | slide | content | width |
|---|---|---|---|---|
| 10 | `flow` | Do Not Store Tokens in AsyncStorage | plain text → readable by app code → a rooted device → a stolen token → the attacker acts as the user | `w:1120` |
| 11 | `tree` | Notes App: What Will Be Built | one note holds `id`, `judul`, `isi`, `createdAt` — the data contract the rest of the practicum reads from | `w:1030` |
| 12 | `flow` | When Must Data Be Reloaded? | `useEffect` runs once at mount → the form covers the list → the new note is missing → `useFocusEffect` is the fix | `w:1120` |
| 13 | `flow` | Case Study: Still Working Without Signal | sales staff → the cached catalog → the local order queue → sent when the connection recovers | `w:1120` |

Ids 10–13 continue from 09.

Pattern spread after 10–13: `beforeAfter` 4, `flow` 5, `tree` 2, `layers` 1 of 12 — 42% is
flow and 33% is beforeAfter, both under the half ceiling the first density pass left behind.
None of 10–13 needed a fifth `beforeAfter`: 10, 12 and 13 are chains in time and 11 is
containment, so the two most obvious two-model contrasts (`useEffect` vs `useFocusEffect`, and
"what will be built" vs "what exists") were deliberately drawn as a chain instead.

## Slides in the first half that were left alone

| slide | why no picture |
|---|---|
| JSON Serialization: Bridging the String Rule | already drawn by id 05 on the `Diagram:` slide four lines below, and the prose slide itself ends at y≈620 of 658 usable pixels — there is no room for a second copy of the same picture |
| Reading Local Data Safely | the eleven-line code fence plus three bullets end at y≈595; trimming the two bullets the rule allows frees ~65px and the smallest useful picture (a `flow`) needs 199px |
| Three Cache Components | four bullets, a wrapped preamble and a four-line fence end at y≈548; trimming two bullets leaves ~176px and a three-component `tree` needs 247px, a two-component one is the wrong picture for a slide titled "three" |

Width is never the problem on those three — height is. Splitting them is the deck pass's
normal remedy and is forbidden in this pass, so the prose stays and the picture is absent.

## Slides in the second half that were left alone

Both end inside the frame, in ink measured on the 1280×720 render. The theme's usable column
is 658px tall; a picture needs about 170px of it (the kit's smallest canvas, 160 units, at the
narrowest width that keeps a 14-unit label above 13px effective, plus the theme's
`img { margin: 0.4em }`).

| slide | room left | why no picture |
|---|---|---|
| Notes List: Search and Loading | 37px | a twelve-line code fence and exactly **two** bullets, which is the floor the trim rule allows. Even deleting both would leave 127px. |
| Note Form: One Component, Two Modes | 64px | a thirteen-line fence and exactly **two** bullets — same floor, same answer. |

Both were measured the same way the first-half skips were: fence and bullet block to the last
ink row, then subtract from 658. Both have exactly two bullets, and the pass may not go below
two, so no amount of trimming opens them up. Their pictures would have to replace the code
fence, which this pass may not delete.

### Case Study: why it needed three trims, not one

Its first measurement — 85px left — looked like a skip and was briefly treated as one. The
two-column grid is what makes it different: the taller column sets the grid's height, so
removing one right-hand bullet frees **nothing** (the left column is then still two bullets
long). The grid only shortens when **each** column loses a bullet: 165px, measured, once the
sales-staff bullet came out of the Problem column and the catalog and queue bullets out of the
Decision column. That took the slide from 85px to 250px of room, and the picture now renders at
178px with 40px clear below the blockquote.

The bullet that had to stay is the one the picture contradicts: "The catalog cannot be read and
orders cannot be recorded while offline" states the failure the decision prevents, so it is
the one fact on that slide a picture of the decision cannot carry.

## The one split

Id 05 sits on `## Diagram: JSON Serialization: Bridging the String Rule`, added directly
after the prose slide. The prose slide carries three bullets, a nine-line code fence and a
closing bullet; at w:1120 the picture pushed the last bullet past the frame, and shrinking
the picture would break the 13px floor (a 14px label at w:720 renders at 8.7px). No bullet
was removed. The presenter note on the new slide carries the reading order, because a
`Diagram:` slide has no prose of its own.

## Provenance

The build reports every label it cannot find in the bound slide's text. These are known
and deliberate:

| spec | label | why it is not on the slide |
|---|---|---|
| 02 | "Read the cache and check its TTL" | condenses the two decision nodes of the slide's old chart into one row; "check the cache" and "TTL" are in the presenter note |
| 02 | "Not stale: show the cache with the offline marker" | the note says "the cache branch must carry an offline marker"; the row states the condition |
| 02 | "Stale: show the error message" | the note says "only when the cache is already stale show an error message" |
| 02 | "Show the data from the server" | the success arm's output; the slide's chart said "tampilkan data segar" and the note only says "save a copy" |
| 03 | "Preferences, cache, notes" | the data classes come from this slide's old chart and the Five Kinds table, not from this slide's three lines |
| 03 | "Plain text, not encrypted" | the contrast lives in the Five Principles table and in "Do Not Store Tokens in AsyncStorage" |
| 03 | "Tokens, passwords, API keys" | same source: this slide's old chart ("token, kata sandi, kunci API") |
| 04 | "screens/DaftarCatatan.js" | the file names are on the project-structure slide four slides earlier |
| 04 | "storage/notesStorage.js" | same |
| 04 | "AsyncStorage, key catatan:v1" | same |

Id 05 reports nothing: every label appears in the picture's own presenter note, which was
written as the reading order for the presenter (not as a label list), so the check passes
for the right reason.

Ids 06–09:

| spec | label | why it is not on the slide |
|---|---|---|
| 06 | "STATE IN RAM" | the slide's phrase is spread across the sentence ("state lives in the device's memory (RAM)"); the panel title needs it in three words |
| 07 | "preferensi:nama", "catatan:v1" | the two keys this chapter actually uses, from the worked example and Section 11.3; the alternative was "key1 / key2" on a slide about keys |
| 07 | "The saved name", "The notes list as one string" | what each drawer holds; `tree` has no per-node note, so the leaf has to say it |
| 08 | "reads the stored text" | plain-language gloss of `JSON.parse` for a chip caption |
| 08 | "not handled" | the slide says "Without handling"; the phrase measures 105px against a 106px lane by the kit's estimator and then overran both chips in the browser, so the arrow carries the two-word form |
| 09 | "WITHOUT A CACHE", "WITH A CACHE" | panel titles for the two columns the slide's bullets compare |
| 09 | "Waits for a server response" | the slide's "without waiting for a server response", stated as the left column's state |
| 09 | "Nothing to show when the network is not available" | the negation of the Availability bullet, which is what the left column means |

Two bullets moved into presenter notes in this pass, both verbatim, both under the line
"Trimmed to the picture (the diagram says this):" — the filing-drawers bullet on "What
AsyncStorage Is" (the `tree` is that metaphor) and the Availability bullet on "Cache: A Copy
So the App Stays Useful" (the `beforeAfter` right column is that fact). `trim_check.py`
reports `bullets lost: 0`; it counts a `- ` line inside a note block as still on the slide,
so its "moved into notes" counter reads 0 for the same reason.

Ids 10–13:

| spec | label | why it is not on the slide |
|---|---|---|
| 10 | "plain text, not encrypted" | joins the two halves of bullet 1 — "not encrypted" and "values are stored as plain text" — into one chip caption |
| 10 | "App code" | chip-sized form of "Any code running inside the app" |
| 10 | "or jailbroken (iOS)" | bullet 3 names both platforms; the chip keeps the one its label does not already say |
| 10 | "calls the API on the user's behalf" | bullet 4's tail, kept verbatim but reported because the build compares the whole chip note and the apostrophe sits inside a quoted string |
| 12 | "empty dependencies, runs once on mount" | bullet 1 states the same three facts across one sentence: "with empty dependencies", "runs only once", "when the screen mounts" |
| 12 | "Form opens", "No new note" | stage names for what the bullets describe in a clause; `flow` chips are 1–2 words |
| 12 | "on mount" | the second wrapped line of the note above, reported separately by the build's label splitter |
| 13 | "areas whose network often disappears" | joins "areas" and "whose network often disappears" from bullet 1, which the chip label already prefixes with "Sales staff" |
| 13 | "recorded while offline" | the Problem bullet's "orders cannot be recorded while offline" with the decision applied |
| 13 | "connection recovers" | the slide's "the connection recovers" needs three lines in the 88-unit lane between two chips and the kit allows two |

### Bullets this pass moved into notes

Seven, all verbatim, all under "Trimmed to the picture (the diagram says this):" in the
slide's own presenter note. Every one of them is a fact the picture now states in full; no
bullet whose fact the picture cannot show was moved, and no slide keeps fewer than two.

| slide | bullet | the picture that says it |
|---|---|---|
| Do Not Store Tokens in AsyncStorage | "AsyncStorage data is not encrypted…" | chip 1 plus its note |
| Do Not Store Tokens in AsyncStorage | "A stolen token: an attacker can call the API…" | the last arrow plus chip 4 |
| Notes App: What Will Be Built | "The note entity `{ id, judul, isi, createdAt }`…" | the whole `tree` |
| When Must Data Be Reloaded? | "`useEffect` with empty dependencies…" | chip 1 plus its note |
| When Must Data Be Reloaded? | "As a result a new note does not appear…" | the arrow into the red chip plus that chip's label and note |
| Case Study: Still Working Without Signal | "Sales staff visit areas whose network often disappears" | chip 1 plus its note |
| Case Study: Still Working Without Signal | "The catalog is cached with snapshot + timestamp…" | chip 2 plus the first arrow |
| Case Study: Still Working Without Signal | "Orders go into a local queue, sent when the connection recovers" | chips 3 and 4 plus their two arrows |

The existing note blocks were kept at their original length on purpose: the trimmed bullets
join a note block, they do not replace it.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size
and do not edit `lib/`.
