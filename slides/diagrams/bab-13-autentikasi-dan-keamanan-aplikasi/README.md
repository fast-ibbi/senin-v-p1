# Chapter 13 diagram specs

`slide-diagrams` kit specs for `slides/bab-13-autentikasi-dan-keamanan-aplikasi.md`.
One file = one picture. A spec carries data only; geometry, text wrapping, and the
font-size floor are owned by the kit.

## Why this subfolder exists

The kit reads `<deckDir>/diagrams` non-recursively, and every deck lives in `slides/`, so
each deck keeps its specs here and is always built with `--specs`.

## Rebuilding

From the repo root:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-13-autentikasi-dan-keamanan-aplikasi.md
SPECS=slides/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi

# validate and print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs and refresh the image lines in the deck
node $SKILL/scripts/build.mjs $DECK --specs $SPECS
```

Output: `slides/assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-NN.svg`,
placed on the slide as `![w:1120](…)` (scale 0.966; a 14px label renders at 13.5px).

## Diagram map

| id | pattern | slide | content |
|---|---|---|---|
| 02 | `beforeAfter` | Architecture: A Server That Remembers vs One That Does Not | session (send the session ID → look up the record) vs token (send Bearer → verify the signature) |
| 03 | `flow` | JWT: Three Parts Separated by Dots | header → dot → payload → dot → signature, with encoded/encoded/computed under each |
| 04 | `beforeAfter` | Two Layers of Protection | client layer (directs, reads the status, redirects) vs server layer (decides, checks the token, answers 401) |
| 05 | `sequence` | Diagram: The Complete Flow: Login → Token → Access API → Logout | user → application → auth server, plus the two client-side loops (store, delete) |
| 06 | `beforeAfter` | Authentication vs Authorization | the question each concept answers: who are you / what are you allowed to do |
| 07 | `tree` | Register and Login: Two Endpoints | two doors in one wall: `POST /api/auth` → register → 201 Created, login → 200 OK |
| 08 | `flow` | Passwords Are Never Stored in Plaintext | password (the original text) → + salt → bcrypt hashing → the hash value that is the only thing kept |
| 09 | `beforeAfter` | A JWT Is Not Encryption | header + payload (encoded, readable) vs the signature (integrity and authenticity, not confidentiality) |
| 10 | `flow` | Why a JWT Makes the Server Stateless | token → recompute the signature → compare → verified, with no database lookup |
| 11 | `flow` | The Price of Stateless: Revocation Is Hard | access token (15 minutes to 1 hour) → exp → refresh token → new access token |

Ids 02–04 replace the old Mermaid charts (`bab-13-…-NN.mmd` still on disk as the provenance
trail), so the SVG paths and the deck's image lines are unchanged. The old widths were the
problem, not the content: `w:260` on the JWT slide rendered a 14px label at 3.1px on the
projector, and `w:760` on the two comparison slides wasted a third of the canvas. All ten
pictures now sit at `w:1120`.

Id 05 is the only picture in this deck that needs a `## Diagram: …` slide: the prose slide
carries five numbered steps plus a blockquote, so nothing legible fits beside it.

Ids 06–11 are the first-half prose pass (slides 4, 6, 7, 13, 14, 15). Each one is placed under
its heading at `w:1120`, and five of the six let the deck drop prose: nine bullets that the
picture states moved **verbatim** into that slide's presenter notes, under the line
`Trimmed to the picture (the diagram says this):`. Every trimmed slide keeps at least two
visible bullets, and no bullet that carries a fact the picture does not show was moved.

## Why these six, and the one that was skipped

**Authorization in SIAKAD: Roles and Their Rights (slide 5) has no picture, deliberately.**
The slide's only structure is a three-row table, and a table is already the clearest form of a
role → right mapping; a `tree` of it is a redraw with nothing added (see
`references/deck-audit.md`, which sends tables back untouched). Both of the slide's bullets
have to stay — the minimum is two, so neither may move into the notes — which means any
picture that could fit here would restate a sentence that is still on the slide. The size
settles it: the smallest honest tree is 234 canvas units, 226px on the slide, and on the
Marp render at `w:1120` that put the second bullet inside the page-number band. No legible
width fixes it (a 14px label needs `w:1120`; below about `w:1077` it drops under 13px).

Two pictures were also written, rendered, and then replaced during this pass, which is worth
knowing before "fixing" them back:

- **Slide 5** first got the roles → rights `tree`. It rendered as a 1:1 redraw of the table,
  stacked directly above it, and collided with the page number. Deleted.
- **Slide 6** first got a `sequence` (register → 201, login → 200), which is the best shape for
  "two endpoints" because it shows who asks and who answers. But a four-message sequence is
  318 canvas units, 307px on the slide, and it pushed the last bullet onto the footer line.
  The `tree` says the part a sequence cannot say cheaply — two doors in the same wall — at 172
  units, and leaves the table and both bullets where they were.

## Second half of the deck (density pass, slides 17–28 and 39)

| id | pattern | slide | content | width |
|---|---|---|---|---|
| 12 | `tree` | Protected Route: Definition and Its Limits | one decider (`app/index.js`) → three statuses → what each one renders | `w:1120` |
| 13 | `flow` | Principle 1: Input Validation on the Server Side | request → server re-validation → the SQL command it builds | `w:1120` |
| 14 | `flow` | Principle 2: No Secret Key in the Application | bundled code → one user takes it apart → every user at risk | `w:1120` |
| 15 | `beforeAfter` | Principle 3: HTTPS Is Mandatory in Production | without HTTPS (cleartext, localhost only) vs with TLS (encrypted, mandatory) | `w:1120` |
| 16 | `layers` | Principle 4: Least Privilege (Smallest Access Rights) | device permissions / token claims / API access | `w:1120` |

All five sit at `w:1120` (scale 0.966; a 14px note renders at 13.5px) and all five let the deck
drop prose: ten more bullets that the picture states moved **verbatim** into their slide's notes
under the same `Trimmed to the picture (the diagram says this):` line. Every one of the five keeps
at least two visible bullets.

Two of the five were authored together with a rejected alternative, worth knowing before "fixing"
them back:

- **12** could have been a `stateMachine` (memuat → masuk → keluar). Rejected: the slide is not
  about how the application moves between statuses, it is about where each status sends the user,
  which is a decision with three outcomes — one decider, three branches. The three status ids are
  code identifiers taken from the route-group layout the next slide shows in full; `memuat` is on
  the slide, `masuk` and `keluar` are the other two values of the same variable.
- **13** could have been a `beforeAfter` (client validation vs server validation), which is what
  the slide literally contrasts. Rejected because picture 04 already draws the client/server split
  for this chapter, and a second pair of panels would say the same thing in the same shape. The
  flow says what 04 cannot: where on the path the trustworthy gate sits, and that the query below
  it is built by the server. Its two edge verbs (`reaches`, `builds`) are authored — the slide
  states the constraint on the query but never names the act of building it.

### The two slides that got no picture

**SecureStore: Only Three Functions (slide 22) — no room, and it is code.** The slide is a 28-line
code block plus one bullet. On the Marp render the block ends at y≈540 and the bullet at y≈578;
the page-number band starts at y≈684, so about 105px are free. The smallest canvas the kit can
emit is a one-row `beforeAfter` at 164 units, which is 158px on the slide at `w:1120` — it does not
fit, and nothing legible fits at a smaller width (a 16px label at `w:720` renders at 9.9px). The
single bullet cannot move either: the floor is two. And the only structure on offer — one wrapper
with three functions — *is* the code block above it; `references/deck-audit.md` sends code back
untouched.

**Related Chapters and Technology Versions (slide 39) — nothing drawable that is not a redraw.**
Size is not the objection: the two-column grid ends at y≈400, so a 226px tree would fit. The
objection is content. The left column is a list of peers, each with what it contributed — an
aligned list, already in its clearest form. Re-encoding it as a `tree` puts the same three lines
back under the heading, one line lower, and `tree` silently drops `note`, so the contributions
would have to be crammed into the chip labels. The right column (Expo SDK 57 · React Native 0.86 ·
React 19.2 · Node.js LTS ≥ 22) is a `layers` stack only if you assert that each sits on the next;
this slide does not assert it (its notes say "read the technology versions as they are"), so
drawing the stack would invent the one relationship the slide withholds.

## Pattern mix

Fifteen pictures, five patterns: `flow` six times (03, 08, 10, 11, 13, 14), `beforeAfter` five
times (02, 04, 06, 09, 15), `sequence` once (05), `tree` twice (07, 12), `layers` once (16). No
pattern carries more than 40% of the deck (flow, 6 of 15). Every `beforeAfter` is a genuine
two-model comparison whose rows answer each other; the second-half pass added only one (15), and
that one is the literal before/after — one message, sent twice, with and without TLS.

`beforeAfter` was the natural shape for three of the five second-half slides (25, 26, 27 all read
as "two sides"), so two of them were reframed where the content honestly allowed it: 26 became the
escalation chain (code → one user → every user), which a panel cannot draw, and 13 became the
request's path. A third panel in a row would have made the chapter read as a template.

`stateMachine` remains unused. The one candidate — the three auth statuses — is a decision with
three outcomes rather than a mode diagram (see id 12 above), and the deck's other candidate row
(valid → expired → renewed, picture 11's subject) is a straight line with no branch, which `flow`
draws more calmly. `layers` is used once, and only because the slide's own notes call the three
scopes "three layers at once".

## Reading choices worth keeping

- **Accents mark the decision, not the first item.** 02 accents the token, 04 the server, 06
  authorization, 09 the signature, 08 the stored hash value, 10 the verified state, 11 the new
  access token. The left panels of the three first-half `beforeAfter` pictures are `neutral`,
  not the pattern's default `red`: a session, client-side routing, and base64 encoding are not
  *wrong*, they are only not the security boundary.
- **Absences are notes, not stages.** "No database lookup" (10) and "no list of revoked tokens"
  (11) are the lessons of their slides, but a chain cannot draw something that is not there.
  They sit as a stage note and as a bullet respectively. Inventing a database box would have
  drawn the opposite of the slide.
- **The 401 stays prose.** It is an alternative answer to the same login request, and both
  `sequence` and `tree` would have made it look like a later or a second answer.

## Provenance report

`--strict` is not used, because several labels are legitimate compressions of the slide's own
sentences rather than quotes. The build's `not on the slide` list for ids 06–11 means:

| label | why |
|---|---|
| `Bcrypt hashing`, `identical passwords, different hashes`, `what the server stores` | the slide says "the result of one-way **hashing** (for example bcrypt)", "*Salt* makes two identical passwords produce different hash values", and "stores" — the chip has to be a noun phrase |
| `HEADER + PAYLOAD`, `Only encoded, not encrypted`, `Protects integrity and authenticity` | the slide's bullet reads "The header and payload are only *encoded*: anyone can decode and read them" and "The signature protects the **integrity** and **authenticity**"; the panel title and row split that sentence |
| `with the secret key`, `compare`, `Verified` | notes and edge verbs authored for the flow; the slide says "recomputes the signature" and "the secret key" but never names a comparison step |
| `masuk`, `keluar`, `the Stack`, `Redirect /login` (12) | the slide names `memuat` and `app/index.js`; the other two statuses and what each renders come from the route-group layout the next slide prints (`if (status === 'memuat') … if (status === 'keluar') … return <Stack />`) and from that slide's notes |
| `not always your application — curl can call it`, `reaches`, `re-validates types, lengths, email format`, `client data never concatenated` (13) | the stage notes compress three bullets; the two edge verbs are authored (see the id 13 note above) |
| `Bundled JavaScript`, `inside the APK` (14) | the slide says "JavaScript code is bundled into files and can be taken apart from the APK"; the chip name is a compression of that clause |
| `WITH HTTPS`, `Email, passwords, and tokens travel as cleartext`, `Only a local development exception: localhost`, `TLS encrypts the request and the response` (15) | the panel titles are the heading's own frame; the rows are bullets 1, 3 and 5 re-cut as rows ("travel as cleartext" for "are sent as cleartext", the localhost exception split across both panels) |

Ids 02–05 already carried the same kind of warning before this pass.

## When the build says "does not fit its pattern"

That is a content decision, not a kit shortfall: the text is too dense for the picture.
Shorten a label, split the picture, or pick another pattern — do not lower the font size and do
not edit `lib/`.
