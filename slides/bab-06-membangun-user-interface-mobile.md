---
marp: true
theme: academic
paginate: true
title: "Chapter 6 — Building a Mobile User Interface"
description: "Mobile Programming lecture, meeting 7: four mobile UI design principles, the 8pt spacing system, typography scale, color palette, Card/Button/Form/List components, header, bottom navigation, responsive design, accessibility, and wireframes for the Student List and Detail screens."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 6 — Building a Mobile User Interface"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 6 — Building a Mobile User Interface

Principles, visual foundations, and components · Meeting 7

<!--
Open with one hook: "Last chapter we prepared the raw materials; today we learn to
assemble them with reasons."

Opening question: "Why can two apps with similar features feel so far apart in
comfort?" Collect 2–3 answers without correcting them yet; the answers are scattered
across 6.1 (principles), 6.2 (components), and 6.5–6.6 (adaptation).
-->

---

## Learning Objectives

- Explain the four mobile UI design principles and the reasoning behind them
- Identify the role of the 8pt spacing system, typography scale, and color palette
- Implement the Card, Button, Form, and List components consistently
- Design wireframes for the Student List and Detail screens before writing code
- Apply basic accessibility and analyze design decisions in the case study

<!--
Read out only the verbs. The first four objectives rest on Sub-CPMK 3.1 (mobile UI
design principles); the last touches Sub-CPMK 3.2 (responsiveness and basic
accessibility), which the RPS also maps to Chapter 6.

Mention the assessment up front: Chapter 6 Practicum and Assignment 2 — campus app
UI redesign.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Principles of Mobile UI Design

Section 6.1 four principles · 6.2–6.4 visual foundations and components

<!--
This part is conceptual, but it must not be skipped: every decision in the practicum
traces back to the four principles here.

If time is tight, students may read section 6.4 on their own; section 6.1 may not.
-->

---

## Why Does an App Feel Easy or Hard?

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-06.svg)

A designer's first question is not about technology, but about why an interface feels easy or hard to use.

<div class="grid2">
<div>

**Principles, not taste**

- Building an interface with reasons, not by trial and error

</div>
<div>

**The raw materials are ready**

- Chapter 5 gave us `View`, `Text`, `StyleSheet`, Flexbox, `FlatList`

</div>
</div>

<!--
Trimmed to the picture (the diagram says this):
- Born from observing how people read and hold a phone
- This chapter teaches how to assemble them into a reasoned interface

The first moved bullet is the picture's first stage (the observation behind a principle)
and the second is its last stage (this chapter's assembly). What stays on the slide is the
Chapter 5 material list, which no stage names, and the rule about building with reasons,
which stage two only gestures at ("not taste, not trial and error").

Emphasize the shift in role: from screen assembler to designer able to explain the
reason behind every decision.

Guiding question: "If two buttons have different functions, what distinguishes them in
the user's eyes?" (Answer: their appearance and position, not the developer's intent.)

Close by stressing that this chapter does not repeat Chapter 5, it reuses its materials.
-->

---

## Principle 1 — Consistency

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-07.svg)

- In IS: staff with varied digital literacy make fewer data-entry mistakes
- Trade-off: rigid consistency can block solutions specific to a context

<!--
Trimmed to the picture (the diagram says this):
- Similar elements look and behave similarly: same colors, spacing, and label wording
- Lowers cognitive cost: after learning one screen, other screens can be guessed
- What it looks like: **design tokens** — one place that stores colors and sizes

Three of the five bullets are stages of the chain the picture draws (tokens → similar
elements → cognitive cost), so they moved. What stays is the trade-off, which is a limit of
the chain rather than one of its links, and the IS consequence — the reason the chain
matters in this course's own domain.

Cheapest example: ask students to name the color of the "Save" button in an app they
use daily, then show that the answers are uniform.

Warn about the common misconception: consistency does not mean every screen is
identical. Dashboard and form screens may deviate slightly as long as the basic rules
of color, font, and spacing stay the same.

Guiding question: "Why does consistency matter in a campus app?" (Staff with varied
digital literacy must be trained only once.)
-->

---

## Principle 2 — Visual Hierarchy

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-08.svg)

- The eye scans a screen, it does not read it line by line
- Arrange size, weight, color, and position to show order
- Trade-off: too aggressive a hierarchy makes the screen shout everything at once
- Trade-off: too flat a hierarchy leaves users unsure where to start

<!--
Trimmed to the picture (the diagram says this):
- Title most prominent, then the main content, then the faintest notes

That bullet is the three bands of the picture, in the same order, so it moved. The rest of
the slide is untouched: the scanning fact, the four tools, and both failure modes are
sentences the bands cannot state.

Quick demonstration: show two screenshots, one with every text large and bold, one
with a single title that truly stands out.

Guiding question: "Which screen can you scan in one second?" (The second one; a flat
hierarchy actually slows reading down.)

Connect it to the outcome: a good hierarchy makes a screen scannable in seconds.
-->

---

## Principle 3 — Feedback

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-09.svg)

- A pressed button dims; a tapped card gives a visual effect
- Feedback answers the anxiety: "was my touch received?"
- A touchscreen gives no physical sensation, so visual response replaces it
- Trade-off: touch response is mandatory (Pressable); vibration and animation come later

<!--
Trimmed to the picture (the diagram says this):
- Every user action must get a visible response

The rule moved because the picture is that rule as an exchange: the touch goes out and the
response comes back. The example stays — the picture says "dims, visual effect" but never
says which control, and a tapped card is a second case the picture does not carry.

Analogy: pressing a lift button that does not light up — people press it repeatedly
instead of giving up.

Warn that without feedback users conclude the app is broken even when the code is
correct. The technical form is shown on the `Pressable` code slide later.

Guiding question: "Which response is mandatory, and which may follow later?" (A visible
touch response is mandatory; vibration and animation may be considered later.)
-->

---

## Principle 4 — Thumb-friendly

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-05.svg)

- Most phone interaction is done with one thumb
- The bottom and middle of the screen are easy to reach; the top corners are hard
- Important actions go in reachable zones; the top area is for titles
- Trade-off: reach sometimes collides with habit (back in the top left)
- That is why the main action button on modern phones sits at the bottom — not by chance

<!--
Demonstration: ask students to hold their phone in one hand and touch the top right
corner without changing their grip. Let them feel the limitation themselves.

Guiding question: "Where should the Save button sit on a long form?" (Following the
thumb: attached to the bottom of the form, not in the top corner.)

Remind them that the sacrifice is real: some layout density is given up for reach
comfort.
-->

---

## Four Principles Working Together

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-02.svg)

> Principles become real through design tokens, the typography scale, the color palette, and the `Pressable` style when pressed or disabled.

<!--
Main message: principles do not stand alone. Hierarchy without consistency makes every
screen advertise its own method; feedback without hierarchy gives the same response to
different actions.

Mention that every label in the chart can be traced back to its section (6.1, 6.2, 6.4),
so students know where to return when they forget.


Think-pair-share, brief: ask each pair to pick one principle and name one violation of it
in an app they use daily.
-->

---

## The 8pt Spacing System

- A set of spacing values: 4, 8, 12, 16, 24, 32, 48, 64
- Chosen because it divides by 2: small enough for detail, large enough for rhythm

| Rule of thumb | Value |
|---|---|
| Spacing between elements in one group | 8 |
| Spacing between groups | 16 |
| Screen edge margin | 16–24 |
| Spacing inside a card (padding) | 16 |
| Corner radius | 8–12 |

<!--
Stress that the benefit is not aesthetics but decision speed: the team no longer argues
over "16 or 17 pixels?".

Mention that the values in this table are what recurs throughout the practicum code, so
a screen that feels off usually has one value out of rhythm.

Guiding question: "Why 8, not 5 or 7?" (8 divides by 2, so 4, 8, 16, and 32 always
line up.)
-->

---

## Card: One Card, One Entity

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-10.svg)

- Gives a visual boundary so the eye can separate entities while scrolling
- Anatomy: white background, radius 8–12, padding 16, spacing between cards 8
- Trade-off: cards consume vertical space; uniform data is more economical as rows

<!--
Trimmed to the picture (the diagram says this):
- One card = one idea = one entity; in our app, one student

That is the left panel of the picture, so it moved. Three bullets stay because the picture
cannot carry them: the anatomy (background, radius, padding), the price (vertical space),
and the boundary bullet — the panel says "separate entities while scrolling" but not why
that works.

Analogy: a card is like a business card — once stacked, the eye can still separate one
from another.

The most common misconception: packing two entities into one card. Remind them that one
card carries one message.

Guiding question: "When is a row more appropriate than a card?" (When there is a lot of
uniform data, for example a grade table.)
-->

---

## Button: Four Variants

The design question is not "what does it look like?" but "how important is this action?".

| Variant | Appearance | Purpose |
|---|---|---|
| primary | Main color background, white text | The single main action on a screen |
| secondary | Soft gray background | A supporting action that still matters |
| outline | Transparent with a main-color border | An alternative action |
| danger | Red background | A risky or destructive action |

- Rule: one primary per screen — if everything stands out, nothing does
- Labels are clear verbs: "Save", not "OK"

<!--
Main takeaway: users read meaning from color before reading the text. A red button that
is never used for deleting loses its meaning.

Guiding question: "May two important actions both be primary on one screen?" (No — the
action hierarchy disappears immediately.)

Remind them that `danger` does not mean "important", it is reserved for destructive
actions.
-->

---

## Button: Pressed and Disabled States

`File: components/Tombol.js`

```js
style={({ pressed }) => [
  styles.dasar,
  {
    backgroundColor: modeNonaktif ? '#E5E7EB' : LATAR_VARIASI[variasi],
    opacity: pressed && !modeNonaktif ? 0.75 : 1,
  },
]}
```

> Three color states: normal per variant, dimmed when pressed, and locked gray when disabled.

<!--
Discuss the order of the conditions first: a disabled button must not dim when
"pressed", because it does not respond to touch at all.

Ask: "Why is opacity written as an expression rather than two separate styles?" (Because
the `Pressable` style function receives `{ pressed }`, so the state can be read at render
time.)

Stress that this slide is not new syntax: `Pressable` was learned in Chapter 5; what is
new is the design reasoning behind it.
-->

---

## Form: Appearance Only

```plaintext
┌──────────────────────────────┐
│ Full Name               label│
│ ┌──────────────────────────┐ │
│ │ Budi Santoso         [×] │ │  ← input with a value
│ └──────────────────────────┘ │
│ NIM                          │
│ ┌──────────────────────────┐ │
│ │                          │ │  ← empty + placeholder
│ └──────────────────────────┘ │
│          [ Save ]            │ ← primary button
└──────────────────────────────┘
```

- Labels always visible — a placeholder disappears once the user starts typing
- The save button sits at the bottom of the form, within thumb reach

<!--
Discuss only two appearance decisions: labels must not depend on placeholders, and the
position of the save button.

Remind them of this chapter's scope: state, validation, and keyboard behavior are
deliberately postponed to Chapter 8 so the class focuses on the visual pattern.

Guiding question: "Why is the label above the field rather than beside it?" (The phone
screen width is not enough for two paired columns.)
-->

---

## List: Item Consistency

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-12.svg)

- Uniform item structure: the same touch area, inner spacing, and text hierarchy
- Separator: a thin line or 8 of space — pick one and use it consistently
- Three states anticipated: loading, empty, and failed to load

<!--
Trimmed to the picture (the diagram says this):
- One-line pattern: title only; two-line pattern: title on top, small caption below
- Our app uses two lines: student name, then NIM–cohort

Both bullets are the two panels: the picture puts the one-line shape beside the two-line shape
and names this app's two lines in the second panel. Three bullets stay because the picture
cannot show them: the uniform structure (touch area, inner spacing, text hierarchy), the
separator choice, and the three states a list has to anticipate.

Remind them that `FlatList` was introduced in Chapter 5; what is discussed here is the
consistency of its items, not how to use it.

Mention that the three states (loading, empty, failed to load) are only implemented in
Chapter 10 when data comes from a server; for now it is enough to anticipate them in the
design.

Guiding question: "What makes a list feel jittery while scrolling?" (Item heights and
the spacing between items are not uniform.)
-->

---

## Header and Bottom Navigation

![w:1000](assets/diagrams/bab-06-membangun-user-interface-mobile-13.svg)

<div class="grid2">
<div>

**Header (screen top)**

- Answers: where am I, what can I do, how do I go back

</div>
<div>

**Bottom navigation**

- Placed at the bottom because it is the most comfortable place for the thumb
- The active tab is always marked; only for the app's main sections

</div>
</div>

<!--
Trimmed to the picture (the diagram says this):
- Elements: title, contextual action on the right, back button on the left
- A tab bar at the bottom of the screen with 3–5 icon-and-label tabs

Both are the anatomy the tree draws: the header holds the title, the back button on the left
and the contextual action on the right, and the bottom navigation holds 3–5 icon-and-label
tabs. What stays on the slide are the facts a tree cannot show: what the header answers, why
the tab bar belongs at the bottom, and the rule that the active tab is only for the app's
main sections — the picture marks the active tab but does not say where tabs may be used.

Also moved here to keep the picture legible (the slide's own quote):
> Header height is typically 56pt plus the status area; tab implementation with Expo Router is built in Chapter 7.

It states a design constant and a pointer to Chapter 7 — neither is something the picture
shows, and neither has to be read off the projector while the anatomy is being discussed.

Stress why the header exists, not what it looks like: the header is the "name plate" the
user meets on every screen change, so its height, spacing, and style must be consistent.

Warn that bottom navigation is only for main sections; detail pages and forms are not
tabs. This concept is implemented in Chapter 7 with Expo Router.

Guiding question: "If your app has seven main sections, what do you do?" (Reduce them to
3–5; too many tabs become too narrow.)
-->

---

## Typography Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| caption | 12 | 400/500 | small captions, badges |
| small body | 14 | 400 | secondary text, detail values |
| body | 16 | 400 | main text, card content |
| subheading | 18–20 | 600/700 | section titles, name on detail |
| screen title | 20–28 | 700 | screen header title |
| display | 32+ | 700 | large numbers, opening pages |

- Capitalization is a conscious decision: sentence case for screen titles, set via `textTransform`

> Emphasizing text is enough with weight (400 → 600 → 700); large and bold at once overdoes the hierarchy.

<!--
Stress that this scale is what stops the habit of "font size by taste on every screen"
and becomes the cheapest tool for visual hierarchy.

The main misconception: enlarging and bolding at the same time. Pick one.

Platform note: the default font differs on Android (Roboto) and iOS (San Francisco), and
custom fonts are loaded through the expo-font library, which is outside this book's
scope; line spacing (lineHeight) is kept around 1.3–1.5 times the font size.
⚠ version-sensitive: check the latest official documentation (reactnative.dev) for
per-platform weight support.
-->

---

## Color: Layered Palette and Contrast

| Role | Color | Usage |
|---|---|---|
| Primary | Blue `#2563EB` | primary buttons, avatars, main actions |
| Text neutral | `#1F2937`, `#6B7280`, `#9CA3AF` | primary, secondary, faint text |
| Background neutral | `#FFFFFF`, `#F9FAFB`, `#E5E7EB` | cards, screen background, dividers |
| Success | Green `#15803D` | GPA ≥ 3.5 and active status |
| Warning | Orange `#C2410C` | borderline values and warnings |
| Danger | Red `#B91C1C`/`#DC2626` | low GPA and the Delete button |

- WCAG 2.1 level AA contrast: at least 4.5:1 for normal text and 3:1 for large text
- Never rely on color as the only carrier of meaning — include text

<!--
Stress the golden rule: color speeds up scanning, while text carries the meaning. Users
with color blindness do not read "red versus green" as a message.

Mention that the pairs in the table were chosen to pass the contrast threshold: for
example, white on the primary blue sits at about 5:1, enough for normal text.

Guiding question: "How should a low GPA be marked so everyone can still read it?" (Red
as a quick marker, plus the GPA number as text.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Responsive, Accessibility & Application

Section 6.5 responsiveness · 6.6 accessibility · 6.7 case study and practicum

<!--
This part shows up most often in the practicum assessment because it produces a real
artefact: the static Student List and Detail screens.

Mention that responsiveness and accessibility are not optional extras; both feed the
UI/UX aspect of the practicum rubric (Appendix A).
-->

---

## Responsive Design: Five Tools

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-15.svg)

One app runs on thousands of devices; a fixed-width assumption will look broken on some of them.

- **Flexbox** — the foundation of proportioning, already mastered in Chapter 5
- Percentage widths and `flex` to divide space relatively
- `useWindowDimensions` — the current screen width and height, updating on rotation

<!--
Trimmed to the picture (the diagram says this):
- `flexWrap` so elements move to a new row when the screen is narrow
- `maxWidth` so elements do not stretch uncontrollably on large screens

Those two are the ends of the picture: the NARROW panel answers with `flexWrap`, the LARGE
panel with `maxWidth`. Three tools stay on the slide because the picture does not place them
— Flexbox as the foundation, percentage widths and `flex` as the division of space, and
`useWindowDimensions` as the measurement that tells the layout which size it is in.

State the trade-off honestly: responsive code is more complicated and harder to test,
but its cost is far smaller than an app that falls apart on the lecturer's tablet.

Guiding question: "Which tool makes a screen change when the phone is rotated?"
(`useWindowDimensions` — this hook subscribes to screen size changes.)

Remind them to test at several sizes: the Android emulator simulates many devices, and
Expo Go lets you try a real phone (Chapter 2).
-->

---

## Adaptive List: One or Two Columns

`File: screens/DaftarMahasiswa.js`

```js
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const jumlahKolom = width >= 700 ? 2 : 1;

<FlatList
  data={data}
  numColumns={jumlahKolom}
  keyExtractor={(mhs) => mhs.id}
  ...
/>
```

> The 700 threshold is a design decision that must be tested on real devices, not an absolute number.

<!--
Stress the relationship between the last two lines of code: the hook supplies the screen
width, then `numColumns` uses that value to decide the number of columns.

Mention the advanced pattern: master–detail (list on the left, detail on the right) is
common on tablets; on phones the two panels become two separate screens, exactly like the
List and Detail screens we are building.

Guiding question: "What happens if `useWindowDimensions` is called outside a component?"
(Hooks are only valid inside function components.)
-->

---

## Accessibility: Four Basic Practices

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-16.svg)

- `accessibilityRole` — the element's role for screen readers: `button`, `header`, `image`
- `accessibilityLabel` — descriptive alternative text, not "Tap here"
- `accessibilityState` — element state, for example `{ disabled: true }`

<!--
Trimmed to the picture (the diagram says this):
- Minimum touch target 44×44 points (Apple) or 48×48 dp (Material Design)
- If the icon is small, do not shrink the touch area — extend it with `hitSlop`

Also moved here because the slide has no room for it above the footer (the slide's own quote):
> Ethics, law (public services must accommodate people with disabilities), and market — three reasons accessibility is mandatory for IS students.

Both of the trimmed bullets are the right panel of the picture: the area a finger needs, as
opposed to the three things a screen reader needs. The three prop bullets stay on the slide because the picture
names each prop but leaves its values to the prose — `button`, "Tap here", and
`{ disabled: true }` are what the student types.

Stress that accessibility is built in from the start, not patched on at the end; adding
it afterwards usually forces a layout redesign.

Guiding question: "Why is the label 'Tap here' bad for screen reader users?" (Because it
does not explain what will happen.) Mention VoiceOver on iOS and TalkBack on Android.

The common misconception: assuming a small icon automatically means a small touch target.
That is exactly what `hitSlop` is for.
-->

---

<!-- _class: center -->

## What Happens If…?

A screen shows a **Delete History** button in primary (blue) next to a **Save** button, both 36×36.

- Which principles and standards does this screen violate?
- What fixes do you propose, and what is the reason for each?

<!--
Give 2 minutes to think alone, then discuss. Do not leak the answer on this slide: it is
on the next slide, and the PDF export shows both.

This exercise is equivalent to the Analysis Question in the chapter's Exercises section;
use it as a warm-up before students work on it in writing.

If the class is quiet, point them to the "one primary per screen" rule in 6.2.
-->

---

<!-- _class: center -->

## Answer: Violation Analysis

- Action hierarchy: one primary per screen — here two actions stand out equally
- Semantic color: a destructive action should be `danger` (red), not primary (blue)
- The 36×36 touch target is below the 44×44-point minimum
- Fix: Save stays primary, Delete becomes danger, the sizes are increased

<!--
This answer is assembled from the chapter's own rules (6.2 for variants and action
hierarchy, 6.6 for touch targets), not quoted directly from the chapter narrative.

Stress the psychological consequence: when two buttons stand out equally, users hesitate
and may press the destructive action by mistake.

Follow-up question: "Is enlarging them enough?" (No — semantic color and action
hierarchy must be fixed as well.)
-->

---

## Case Study: A Request for an Interface

Student data is scattered across several unsynced spreadsheets; staff open three files to answer one question.

| User need | Where it appears in the material |
|---|---|
| A new staff member can use it after one day of training | Consistency and visual hierarchy (6.1) |
| The screen is scanned quickly in the middle of a busy counter | Typography scale and semantic color (6.4) |
| Used while standing | Thumb-friendly: actions at the bottom (6.1, 6.3) |
| "Don't put the delete button near the save button" | Danger vs primary and spacing between actions (6.2) |
| The flow is corrected before construction costs rise | Wireframes as a negotiation tool (6.7) |

<!--
The main message: the manager's request is an interface request, not a database request.
The data already exists; what has not been designed is how it is presented.

Show that one everyday request such as "a new staff member can use it after one day"
turns directly into the criteria of consistency and hierarchy.

Tie it to careers: turning user complaints into design decisions is the selling point of
a systems analyst on an IS project.
-->

---

## The UI-First Approach

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-03.svg)

> A static screen is not a half-finished product — it is a legitimate design artefact and a team communication tool.

<!--
Explain the reason before the form: the interface is the part whose requirements are
most often misunderstood, so stakeholders need to see a real screen first.

Stress that this order is deliberate: Chapter 7 adds navigation, Chapter 8 adds forms,
Chapter 10 replaces static data with data from a server.

Guiding question: "What is the benefit of showing a static screen to academic staff?"
(They can correct the flow before construction costs rise.)
-->

---

## Wireframe: Student List Screen

```plaintext
┌────────────────────────────────┐
│ Student Management     [Add]   │  ← header: title + action
│ Manage active student records  │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ Budi Santoso  [Information │ │  ← card: name + program badge
│ │ NIM 2201001 · Cohort 2022  │ │
│ │ GPA 3.45                   │ │
│ └────────────────────────────┘ │
│ (…four more cards follow)      │
│ ┌────────────────────────────┐ │
│ │ ● Home ○ Students ○ Profile│ │ ← bottom nav (concept, Ch. 7)
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

> Cards are chosen rather than table rows: each student carries three pieces of information with different weights.

<!--
Read the wireframe from top to bottom, as if walking the class through the screen.

Mention that the drawing shows only one card as a pattern example, while there are five
in total (one drawn card plus four more) per the standard dataset.

Stress two decisions that look trivial but are deliberate: the program badge uses a soft
color per program and is always accompanied by text, and the GPA is given a semantic
color because academic staff often look for "whose GPA is a problem".

Guiding question: "If this wireframe were shown to academic staff, which part would they
most likely comment on?" (Usually the order of information inside the card.)
-->

---

## Wireframe: Student Detail Screen

```plaintext
┌────────────────────────────────┐
│ [← Back]  Student Detail       │ ← header with back action
├────────────────────────────────┤
│           ┌──────┐             │
│           │  BS  │             │ ← initials avatar
│           └──────┘             │
│          Budi Santoso          │
│      [Information Systems]     │
│ ┌────────────────────────────┐ │
│ │ NIM            2201001     │ │  ← label–value pair
│ │ GPA            3.45        │ │ ← sixth row from BARIS_INFORMASI
│ └────────────────────────────┘ │
│     [ Edit ]      [ Delete ]   │ ← actions: supporting + danger
└────────────────────────────────┘
```

> Screen hierarchy: student identity most prominent, then the data, then the actions.

<!--
Point out the label–value pair pattern: one pattern for six rows, rendered from the
`BARIS_INFORMASI` array with `map` — consistency through data, not copy-paste. The
wireframe deliberately draws only two rows as a pattern example; the six rows come from
the array, not from the drawing.

Stress its accessibility decision: the avatar uses initials, not a photo — a valid choice
for a static-data app as long as every element is labelled correctly.

Guiding question: "Why is Delete not placed directly beside Save?" (Both are opposing,
risky actions prone to mis-taps.)
-->

---

## Design Decision Analysis

| Decision in the wireframe | Principle basis |
|---|---|
| Uniform cards, spacing in multiples of 8 | The 8pt system and scanning (6.1, 6.2) |
| One primary per screen, Delete as danger | Action hierarchy and semantic color (6.2, 6.4) |
| Program badge with color and text | Contrast and not relying on color (6.4, 6.6) |
| GPA in a semantic color | Fast scanning of data (6.4) |
| Back button and actions at the bottom | Thumb-friendly (6.1) |
| Touch targets ≥ 44×44 and accessible labels | Accessibility (6.6) |

> A wireframe is a visual contract before code: every decision can be traced back to its principle.

<!--
How to teach it: cover the right column, ask the class to guess the principle behind each
decision, then reveal it. This is the fastest way to test understanding of 6.1 before the
practicum.

Mention out loud one decision left out of the table for space: "A consistent header on
both screens" — its principle basis is consistency (6.1), the same on the List and Detail
wireframes.

Guiding question: "If a decision cannot be traced back to any principle, what does that
mean?" (It has not been designed yet, only assembled.)

Remind them that this table can also be used as a checklist when students review their
own practicum result.
-->

---

## Practicum: Structure and Work Steps

| # | File | Content |
|---|---|---|
| 1 | `components/Tombol.js` | Four variants, pressed and disabled states |
| 2 | `components/CardMahasiswa.js` | Name, program badge, NIM, cohort, GPA |
| 3 | `screens/DaftarMahasiswa.js` | Header and `FlatList` in one or two columns |
| 4 | `screens/DetailMahasiswa.js` | Profile, label–value pairs, Edit/Delete |
| 5 | `App.js` | Five static records and the screen selector state |
| 6 | `npx expo start` | Test scrolling, tapping cards, Back, rotating the device |

> Install the safe area with `npx expo install react-native-safe-area-context`, then wrap the app with `SafeAreaProvider`.

<!--
Order the writing from the smallest component (Button, Card), then the screens, and
finally App.js — this pattern prevents students from writing screens that depend on
components that do not exist yet.

Warn that the built-in `SafeAreaView` in React Native has been marked deprecated in
recent versions, which is why this book uses the react-native-safe-area-context package.
⚠ version-sensitive: check the latest official documentation (docs.expo.dev) before
relying on this behavior.

The complete code for all five files is available in the kode/bab-06-membangun-user-interface-mobile/ folder for
comparison after students try writing it themselves.
-->

---

## Data Flow: Data Down, Events Up

![w:1120](assets/diagrams/bab-06-membangun-user-interface-mobile-04.svg)

> Components never import data themselves — that is what makes them reusable and easy to test (Chapter 14).

<!--
Walk through one complete trip: state in App.js changes after a card is tapped, React
re-renders, and the Detail screen appears — all without any navigation.

Stress the architectural consequence: because data only flows through props, the Detail
screen can later receive data from a server (Chapter 10) without changing its appearance.

Guiding question: "If `onTekan` is not passed along at one of the intermediaries, what is
the symptom?" (The card does not respond at all — the props chain is broken.)
-->

---

## Expected Result

| What you observe | Criteria |
|---|---|
| List header | Title, subtitle, and an "Add" button on the right |
| Five cards | Budi 3.45 · Siti 3.82 · Agus 3.20 · Dewi 3.61 · Rizky 2.95 |
| Tapping a card | Detail screen: avatar "BS", six label–value rows, Edit and Delete |
| Pressing a button | Dims (opacity 0.75) for as long as it is pressed |
| Width ≥ 700 and safe area | The list becomes two columns; content does not hit the status area |
| Screen reader on | The card reads "Open detail [name], NIM [nim], button" |

<!--
This slide is the practicum checklist: ask students to match what they see on their device
against every row before submitting their report.

The GPA color is a quick way to assess: green for GPA ≥ 3.5; gray for 3.0–3.49; red for
below 3.0.

Warn that screen readers are rarely tried by students even though they are easy to test:
turn on TalkBack or VoiceOver, then move through the cards without looking at the screen.
-->

---

<!-- _class: center -->

## Comprehension Check

- What is the principle that demands similar elements look and behave similarly?
- What is the WCAG level AA contrast ratio for normal text?
- What is the industry minimum touch target size?
- What does `useWindowDimensions` do on the Student List screen?

<!--
Four-minute oral quiz: show the questions, ask the class to answer, then move to the
answer slide. Do not leak the answers on this slide.

If answers vary on the third question, repeat the distinction between the two industry
references: Apple uses 44×44 points and Material Design uses 48×48 dp.
-->

---

<!-- _class: center -->

## Answers

- Consistency — similar elements look and behave similarly
- 4.5:1 for normal text; 3:1 for large text or interface elements
- 44×44 points (Apple); Material Design uses 48×48 dp
- It returns the screen width/height and updates the view when the size changes

<!--
Repeat the two distinctions most often confused: the contrast threshold of 4.5:1 for
normal text differs from 3:1 for large text or interface elements, and the touch target
has two industry references — Apple's 44×44 points and Material Design's 48×48 dp; both
are minimums, not numbers you may go below.

If many students miss the first question, repeat the four principles of 6.1 before closing
this part — those principles are used again in every following chapter.
-->

---

## Summary

1. Four principles: consistency, visual hierarchy, feedback, thumb-friendly (6.1)
2. 8pt spacing, a typography scale, and a layered palette with contrast ≥ 4.5:1 (6.2, 6.4)
3. Card, four-variant Button, appearance-only Form, and a consistent List (6.2)
4. Header and bottom navigation: orientation, actions, and thumb reach (6.3)
5. Responsive, accessible, and built UI-first with five static student records (6.5–6.7)

<!--
Do not read it out. Ask students to pick one number and explain it in their own words —
this works better than repeating the reading.

The main message: a design decision that cannot be traced back to any principle has not
been designed yet, only assembled.

Remind them that these five points are reused in Chapter 7 (navigation) and Chapter 8
(forms), so they need not memorize them, only understand the reasoning.
-->

---

## Exercises, Challenges, and Reflection

| Type | Task |
|---|---|
| Practice | Add a green "Status: Active" row to the card, align the wireframe |
| Challenge | Move the color and size constants into `tema/desain.js` without changing the render |
| Challenge | Adaptive master–detail at width ≥ 900: list 40%, detail 60% |

- When is a dense table (NIM–Name–GPA) more appropriate than cards?
- What happens if two buttons on one screen are both primary?
- Designing the wireframe first: wasting time or saving it?

<!--
The full comprehension and analysis questions are in the chapter's Exercises section; the
three table rows here are only the examples quickest to do and discuss in class.

The centralized-token challenge trains safe refactoring: the render result must not change
at all. The master–detail challenge bridges into Chapter 7.

Give 3 minutes in pairs for the last three questions, then collect 2–3 answers. Judge the
quality of the reasoning, not the design choice.
-->

---

## References

| Source | Link |
|---|---|
| React Native documentation (2026) | reactnative.dev |
| Expo documentation (2026) | docs.expo.dev |
| React documentation (2026) | react.dev |
| MDN Web Docs — JavaScript (2026) | developer.mozilla.org |
| Krug, S. (2014). *Don't make me think, revisited* | New Riders |
| Tidwell et al. (2021). *Designing interfaces* (3rd ed.) | O'Reilly Media |

<div class="grid2">
<div>

**Further reading**

- Chapter 7 — App Navigation with Expo Router

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the glossary of terms in Appendix C helps with
terms such as wireframe, Flexbox, and Pressable.

The two books in this table are the UI/UX principle sources used in this chapter; the
official documentation remains the primary reference for API details and current version
behavior.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 7

**Assignment:** complete Practicum 6 (static Student List and Detail screens) and Assignment 2 — campus app UI redesign.

Next in this session: multi-page navigation with Expo Router.

<!--
Close with one sentence: "The interface we design today will be used as-is by navigation,
forms, and server data in the chapters that follow."

State the Assignment 2 deadline explicitly and its assessment aspects: the practicum
rubric in Appendix A covers conceptual understanding 15%, implementation 25%, code
quality 15%, UI/UX 15%, debugging 10%, and documentation 20%.
-->
