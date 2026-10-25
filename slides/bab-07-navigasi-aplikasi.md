---
marp: true
theme: academic
paginate: true
title: "Chapter 7 — App Navigation"
description: "Mobile Programming lecture, meeting 7: mobile navigation concepts, Expo Router and file-based routing, stack/tab/drawer patterns, parameters between screens, nested navigation, navigation lifecycle, and protected screens."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 7 — App Navigation"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 7 — App Navigation

Expo Router: routes from the folder structure · Meeting 7 · Sub-CPMK 4.1

<!--
Opening hook: "Chapters 5 and 6 produced screens; today those screens are joined into one
app the user can trace through."

State the RPS link: meeting 7 covers Chapter 6 (Sub-CPMK 3.1 and 3.2) and Chapter 7
(Sub-CPMK 4.1). This deck covers Chapter 7 only; its practicum continues into Chapter 8.
-->

---

## Learning Objectives

- Explain the concept of mobile navigation and the stack, tab, and drawer patterns
- Implement Expo Router setup on a blank template project
- Distinguish declarative navigation (`<Link>`) from imperative navigation (`router.push`)
- Implement dynamic routes and parameter passing between screens
- Design nested navigation, `useFocusEffect`, and protected screens

<!--
Read out only the verbs. Item 1 is the concept tested in the midterm exam; items 2 to 5
are assessed directly in this meeting's practicum.

Opening question: "Who has ever pressed the back button and landed on the wrong screen?"
Keep that question for the protected screen slide.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Mobile Navigation Patterns

Section 7.1 Concept · 7.2 Stack · 7.3 Tab · 7.4 Drawer

<!--
The most conceptual part. If meeting time is tight, compress Section 7.4 (drawer), but do
not skip Section 7.1 because the whole chapter depends on it.
-->

---

## What Is Navigation?

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-06.svg)

**Navigation** is the system that governs the stack of screens currently active, the visit history, and the way a screen receives data from another screen.

**What is attached to the operating system**

- Android: the device's "back" button or gesture
- iOS: swipe gesture from the left edge of the screen

<!--
The browser analogy transfers knowledge students already have: the address, the history,
and the data attached to the address are the same concept.

Ask: "What is the equivalent of a browser's back button on an Android phone?" (The
device's back button or gesture, which is why wrong navigation feels so intrusive.)

Trimmed to the picture (the diagram says this):
- Page address, forward/back buttons, data passed through the query string
- On mobile: internal routes, history maintained by the navigator

The column heading "Analogy: a web browser" went with them: the picture's left panel is
titled WEB BROWSER, so the analogy is now read off the picture, not off a label.
-->

---

## Navigation: An Early Architecture Decision

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-01.svg)

- Almost every feature depends on navigation; a mistake here is felt immediately
- Without a library, the active screen is kept in state and the back logic is written by hand
- The result: screen state mixes with data, history is inaccurate, transitions are inconsistent
- The payoff: the app flow is readable from the folder tree, not from registration code
- Trade-off: creating a screen on the fly straight from code becomes more limited

<!--
This is a "why" slide, not a "how" slide. Stress that history management and back gestures
are always recurring work, so they deserve to be handed to a library.

Ask: "What happens if the history is built by hand with state?" (The app grows, state gets
mixed together, the back button becomes unpredictable, and users complain.)
-->

---

## Three Navigation Patterns

| Pattern | Characteristics | Example use |
|---|---|---|
| **Stack** | A new screen covers the old one; the back button reveals the previous screen | List → Detail → Form |
| **Tab** | Side-by-side screens without hierarchy; a screen stays alive when you switch | Home, List, Profile |
| **Drawer** | A menu hidden at the side of the screen; saves screen space | Settings, admin menu |

> The three do not cancel each other out: a professional app uses tabs as the frame, a stack inside each tab, and a drawer for secondary menus.

<!--
Ask students to name one app on their phone for each table row; concrete experience sticks
better than a definition.

Misconception warning: a tab is not a simpler version of a stack. The two solve different
problems, namely side-by-side screens versus tiered screens.
-->

---

## Stack and Tab: Three Differences

| Aspect | Stack | Tab |
|---|---|---|
| Hierarchy | Parent and child: a new screen covers the old one | Siblings: no screen covers another |
| Screen condition | A covered screen can be released from memory | Every screen stays mounted and only loses focus |
| How you move | Push and pop with a stacked transition | Instant switching between side-by-side screens |

> Industry rule of thumb: tabs for two to five main functions that are always needed quickly; a stack for detail flows that are tiered and temporary.

<!--
The second row of this table is the root of the "stale list" problem in Section 7.7. Say
that we will return to this row later; do not explain it yet.

Ask: "Why is a detail flow a poor fit for a tab?" (Going back becomes unnatural; a tab does
not store a step hierarchy.)
-->

---

## Drawer: The Menu That Hides Itself

- Opened by swiping from the left edge or pressing the hamburger icon
- Strong for many secondary menus: settings, help, reports
- A poor fit for daily functions because its menu is not immediately visible

`app/_layout.js` — an introduction, not practicum material

```js
import { Drawer } from 'expo-router/drawer';

export default function LayoutDrawer() {
  return (
    <Drawer screenOptions={{ drawerPosition: 'left' }}>
      <Drawer.Screen name="index" options={{ title: 'Beranda' }} />
      <Drawer.Screen name="pengaturan" options={{ title: 'Pengaturan' }} />
    </Drawer>
  );
}
```

<!--
Introduce it only, without practicing it: this chapter's practicum uses stack and tab
because the two cover most business-app needs.

Read the warning that used to print under the code, verbatim: ⚠ version-sensitive: the
drawer depends on the `@react-navigation/drawer` package; check docs.expo.dev/router for
your SDK version.

Remind them of the version-sensitive marker: drawer import names and install steps depend
on the version, so do not copy from old tutorials.
-->

---

<!-- _class: center -->

## Exercise: Pick the Pattern

- **A.** Search for a patient → view appointment details → cancel the appointment
- **B.** Home, Appointments, and Profile opened dozens of times a day
- **C.** Settings, Help, and Reports menus that are rarely opened

Decide the pattern for each need, then state your reason.

<!--
Think-pair-share for 3 minutes, then collect 2 to 3 answers. The answer is not discussed on
this slide; the discussion is on the next slide.

If the class answers tab for everything, repeat the guiding question: "Which one is tiered
and which one is side by side?"
-->

---

## Discussion: The Patterns and the Reasons

| Need | Pattern | Reason |
|---|---|---|
| A. Search patient → detail → cancel | Stack | Tiered; going back must return to the previous step |
| B. Home, Appointments, Profile | Tab | Main functions, accessed quickly, none covering another |
| C. Settings, Help, Reports | Drawer | Secondary menus; saves screen space |

> The same pattern is used by the practicum app: a Home tab and a Students tab, with a stack inside the Students tab.

<!--
Connect the class answers to this chapter's practicum: this tab-containing-stack structure
is what the Practicum 7 work steps build.

Warning: putting "Details, Payment, Delivery" as three tabs is the mistake discussed in
this chapter's Analysis Question.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Expo Router: Routes from Folders

Section 7.2 file-based routing · setup on a blank project

<!--
This is the most technical part: three configuration adjustments. Make sure students finish
all three before creating files in the app/ folder, because a mistake here shows up as a
blank screen when the app runs.
-->

---

## File-Based Routing: Folders Become Addresses

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-07.svg)

**Expo Router** is the official navigation library of the Expo ecosystem and it applies **file-based routing**: every file in the `app/` folder becomes one screen, and the file name becomes its address.

**How it differs from the old approach**

- Previously every screen was registered one by one inside the code
- Now the app structure is visible from the folder tree

<!--
Stress the practical consequence: adding a screen means adding a file, not adding a
registration line, so two developers no longer fight over one route file.

Ask: "If the mahasiswa/ folder is moved, how many places have to change?" (Answer: one, the
folder structure; the address follows automatically.)

Trimmed to the picture (the diagram says this):
- `app/index.js` becomes `/`
- `app/login.js` becomes `/login`
- `app/mahasiswa/index.js` becomes `/mahasiswa`
-->

---

## Setting Up Expo Router: Three Adjustments

1. Install the navigation packages with `npx expo install` on the blank template project (Chapter 2)
2. Change the `"main"` property in `package.json` to `"expo-router/entry"`
3. Add a `"scheme"` property to `app.json` to support deep linking

**Deep linking** is a direct link that opens a specific screen from outside the app, for example from a notification (Chapter 12).

> Once all three are done, `App.js` is no longer loaded and may be deleted.

<!--
State the consequence if step 2 is missed: Metro is still looking for the deleted App.js,
and the app shows a blank screen. That is the first troubleshooting item in this chapter.

Give 5 minutes to do all three together, then check them one by one before moving on to the
folder structure.
-->

---

## Configuration Changes

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

`package.json` — excerpt, only the relevant properties

```json
{
  "main": "expo-router/entry"
}
```

`app.json` — excerpt, add `"scheme"` inside the `"expo"` object

```json
{
  "expo": {
    "name": "siakad-mobile",
    "slug": "siakad-mobile",
    "version": "1.0.0",
    "scheme": "siakad-mobile"
  }
}
```

> ⚠ version-sensitive: older documentation writes `"main": "node_modules/expo-router/entry"`; `"expo-router/entry"` is the newer form in the official documentation.

<!--
Explain the role of the supporting packages: react-native-screens uses native components for
performance, react-native-safe-area-context handles the screen's safe area, while
expo-linking and expo-constants support deep linking and configuration.

Remind them of the version-sensitive marker on the main value: copy it from the official
documentation for the installed SDK version, not from an old tutorial.
-->

---

## From File to Address

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-02.svg)

> A bracketed folder such as `(app)` is a route group: it adds no segment to the address, so `index.js` is `/`, `login.js` is `/login`, `(app)/mahasiswa/index.js` is `/mahasiswa`, and `(app)/mahasiswa/[id].js` is the dynamic `/mahasiswa/:id`.

<!--
Ask students to read each line aloud: which file produces which address. This is practice in
reading the folder structure used throughout the rest of the chapter.

A frequent mistake: thinking the address becomes /(app)/mahasiswa. Make clear that the
parentheses actually remove that segment from the address.
-->

---

## Route Map of the Student Data Management App

| Flow | File in the `app/` folder | Address |
|---|---|---|
| Initial redirect | `index.js` | `/` |
| Login | `login.js` | `/login` |
| Home | `(app)/index.js` | `/` (inside the group) |
| Student List | `(app)/mahasiswa/index.js` | `/mahasiswa` |
| Student Detail | `(app)/mahasiswa/[id].js` | `/mahasiswa/:id` |
| Add/Edit Form | `(app)/mahasiswa/tambah.js` | `/mahasiswa/tambah?edit=...` |

- Detail and Form are deliberately not tabs: both depend on the List screen
- Login is placed outside the `(app)` group so it is not protected

<!--
This table is the work map for Practicum 7. Have students mark which files they have already
created and which they have not before the practicum starts.

Ask: "Why are Detail and Form not made tabs?" (Both are tiered and must be able to return to
the List; a tab is not designed for a tiered relationship.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 3 — Screens, Parameters & Protection

Section 7.5 parameters · 7.6 nesting · 7.7 lifecycle · 7.8 protected

<!--
The densest part. If little time remains, prioritize Section 7.5 (parameters) and 7.8
(protected screen); Section 7.7 can be continued as a reading assignment.
-->

---

## Root Layout: `<Stack />`

`app/_layout.js` — one stack for the whole app; code in `kode/bab-07-navigasi-aplikasi/app/_layout.js`

```js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function LayoutRoot() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Masuk' }} />
      </Stack>
    </>
  );
}
```

> Unmentioned screens still join the stack by default: the `<Stack.Screen>` list is optional.

<!--
Stress two things: screenOptions gives a uniform style to the whole stack, and the (app)
group has its header hidden because that group shows its own tabs.

Remind them that this file is the stage for the whole app; every screen appears on top of
it. The full version is in kode/bab-07-navigasi-aplikasi/app/_layout.js.
-->

---

## Two Ways to Open a Screen

**Declarative** — a link the user can see

```js
import { Link } from 'expo-router';

<Link href={{ pathname: '/profil', params: { id: '2201001' } }} asChild>
  <Pressable><Text>Buka profil (deklaratif)</Text></Pressable>
</Link>
```

**Imperative** — triggered by program logic

```js
import { router } from 'expo-router';

<Pressable
  onPress={() => router.push({ pathname: '/profil', params: { id: '2201002' } })}
>
  <Text>Buka profil (imperatif)</Text>
</Pressable>
```

<!--
This example follows Example 7.2 in the chapter: two styles, equivalent result, different
roles.

Read the rule of thumb that used to sit under the code, verbatim: Rule of thumb: `<Link>`
for visible links; `router` for transitions produced by a process, such as `replace` after
login and `back` after saving.

Stress asChild: without asChild, Link and Pressable compete for the gesture and the card
feels dead. The chapter's Troubleshooting gives two causes: two touch components competing
for the gesture, or a link rendered as text without a touch style.
-->

---

## Dynamic Routes and Parameters

`app/(app)/mahasiswa/[id].js` — reading a value from the address

```js
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LayarDetail() {
  const { id } = useLocalSearchParams();
  return <Text>Detail mahasiswa dengan id: {String(id)}</Text>;
}
```

- Square brackets mark a dynamic segment: `/mahasiswa/2201001`
- A query parameter for optional values: `/mahasiswa/tambah?edit=2201001`
- Every value from the address is a string; `String(id)` guards against values that arrive as an array
- A missing parameter has the value `undefined`, so check it before use

<!--
Demonstrate with two different addresses, for example 2201001 and 2201003, on the same
[id].js file. This is the core of dynamic routes.

Warning: a value from the address is always a string. A student who compares it directly
with a number will meet "data not found" even though the data exists.
-->

---

## Nested Navigation: A Tab Containing a Stack

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-03.svg)

- Each tab has its own history: switching tabs does not erase your position in the stack
- Double headers are prevented with `headerShown: false` on Tabs, so only one owner shows a header
- The innermost stack shows the screen titles: List, Detail, and Add Student

<!--
Read the diagram as a folder structure: the top layer app/(app)/_layout.js holds Tabs, and
the mahasiswa/ folder has its own _layout.js holding a Stack.

Ask: "What happens if Tabs also shows a header?" (Two stacked title bars; the most obvious
problem in the practicum.)
-->

---

## Why Is the List Stale After Going Back?

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-04.svg)

> A tab screen is not released from memory; a plain `useEffect` runs only on mount, not when focus returns.

<!--
Connect it to the second row of the stack-versus-tab table: because the screen stays
mounted, useEffect is no longer triggered when the user returns to that tab.

Ask: "Then when does the list fetch new data?" (When the screen gains focus. That is why
useFocusEffect exists.)
-->

---

## `useFocusEffect` and `useCallback`

`app/(app)/index.js` — the focus-monitoring pattern

```js
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

useFocusEffect(
  useCallback(() => {
    // berjalan setiap layar mendapat fokus
    return () => {
      // pembersihan setiap layar kehilangan fokus
    };
  }, [])
);
```

- The argument must be wrapped in `useCallback`; without it the effect fires repeatedly on every render
- The `useCallback` dependency list decides when the effect counts as changed, for example `[id]`

<!--
The pattern has two parts: the effect function and the cleanup function. Show that open and
close pair like entering a room and turning off the light on the way out.

Warning from the chapter's troubleshooting: useFocusEffect without useCallback makes the
effect run continuously; the symptom shows in the console, not on the screen.
-->

---

## `useEffect` or `useFocusEffect`?

| Need | Hook | Reason |
|---|---|---|
| Fetch data once when the component mounts | `useEffect` | Runs once; does not depend on focus |
| Refresh the list every time the screen becomes visible again | `useFocusEffect` | The tab screen stays mounted, so focus has to be monitored |

> The practicum for this chapter uses `useFocusEffect` on Home to simulate a refresh; the same pattern is used in Chapter 10 when the data comes from an API.

<!--
This selection rule is what gets asked most often: distinguish "runs once" from "every time
it is visible", not "new" from "old".

Ask: "Home updates the last-seen time; which hook is right?" (useFocusEffect, because the
process has to be repeated every time the screen becomes visible.)
-->

---

## Protected Screen: A Single Control Point

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-05.svg)

> Protection sits at one point, the `(app)` group layout, and applies automatically to every screen inside it, including screens added later.

<!--
Stress the single point of control principle: a per-screen check is easy to forget,
especially when the app grows and one new screen is left without the check.

Ask: "If a Reports screen is added tomorrow, do we need to check the login state there
too?" (No, as long as that screen is inside the (app) group.)
-->

---

## The Redirect Pattern and the Redirect Loop Trap

`app/(app)/_layout.js` — the check before rendering the tabs

```js
import { Redirect, Tabs } from 'expo-router';
import { isLoggedIn } from '../../lib/session';

export default function LayoutAplikasi() {
  if (!isLoggedIn()) {
    return <Redirect href="/login" />;
  }
  return <Tabs>...</Tabs>;
}
```

- `<Redirect />` is preferred over manual navigation: declarative and safe during render
- The login screen must sit outside the protected group so a redirect loop cannot occur

<!--
The main trap in this chapter: if login.js is placed inside the (app) group, a user who is
not signed in is thrown to login, which checks authentication again, and an endless
repeated transition follows.

Also note that the signed-in status in memory (lib/session.js) is lost when the app closes;
the real implementation is in Chapter 11 (storage) and Chapter 13 (tokens).
-->

---

<!-- _class: center -->

## What Happens If…?

- `useFocusEffect` is used without `useCallback`?
- `login.js` is placed inside the `(app)` group?
- Tabs does not hide its header above the Stack?

Name the symptom the user sees, not just the name of the error.

<!--
Four-minute class discussion: split into three small groups, one scenario per group, then
each group reports one symptom visible on the screen.

The full analysis is on the next slide, so do not leak it in advance.
-->

---

## Analysis of Three Scenarios

| Scenario | Cause | Visible symptom |
|---|---|---|
| `useFocusEffect` without `useCallback` | A new function is created on every render | The effect keeps running; there is a warning in the console |
| `login.js` inside the `(app)` group | The login screen is authentication-checked too | The user is thrown back to login again and again |
| Tabs does not hide the header | Tabs and Stack both display a header | Two title bars stacked on the Detail screen |

<!--
For each row, ask students to state the fix in one sentence: wrap it with useCallback; move
login outside the group; set headerShown false on Tabs.

Stress that all three are the mistakes that show up most often in this chapter's practicum,
so all three are also part of the debugging assessment.
-->

---

## Case Study: the "SehatIn" Clinic

![w:1120](assets/diagrams/bab-07-navigasi-aplikasi-08.svg)

An **illustrative example** in this chapter: a primary clinic in Semarang, a three-person team with no mobile experience, must decide the navigation structure before writing code.

- **Pattern:** three tabs (Home, Appointments, Profile) + a stack inside each tab
- **Guard:** the access check on the group layout, not on every screen

> Chapter conclusion: the navigation structure is an architecture decision. Choosing wrong means users get lost, the code is hard to maintain, and fixes become expensive.

<!--
Read it as a story of decisions, not a feature list: without tabs, a patient who wants to see
the schedule has to press back many times from the deepest screen. State that this is an
illustrative example in the chapter, not a real running system.

Stress that the pattern taken from this case is reused in the Final Project "Mobile Academic
Information System": tabs for main functions, stack for details, one guard point.

Trimmed to the picture (the diagram says this):
**Deep linking:** a cancellation notification opens the Appointment Detail via `sehatin://janji/415`
-->

---

## Practicum 7: The Flow Under Test

1. Open the app; the Login screen appears because of the redirect in `index.js`
2. Press Login and land on Home with two tabs: Home and Students
3. The Students tab shows five static-data cards; press one card and Detail opens
4. The "Edit this Data" button opens the form with the fields already filled with the old data
5. Press Logout, return to Login, and the back button does not open Home

> Practicum static data: Budi Santoso, Siti Aminah, Agus Wijaya, Dewi Lestari, and Rizky Pratama.

<!--
Read it as a test scenario to be run in the laboratory, not as a feature list. Stress steps
2 and 5 because both depend on router.replace.

Warning: if step 5 fails, check whether the login screen uses router.push, because the user
would then be able to go back to the login screen after signing in.
-->

---

## Most Common Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| Blank screen after changing `package.json` | `main` is not yet `expo-router/entry`; Metro is still looking for `App.js` | Fix `main`, then `npx expo start -c` |
| The card does not respond when pressed | `Link` without `asChild` wraps `Pressable` | Use the `<Link asChild><Pressable>` pattern |
| "Student data not found" | A string parameter is compared with a non-string `id` | Normalize with `String(id)` |

> These three symptoms cover most of the Practicum 7 questions; the complete list is in the chapter's Troubleshooting section.

<!--
Do not read them all. Pick the one symptom you meet most often in class, ask students to
guess the cause, and only then show the solution column.

The habit being instilled: read the error message and check the configuration files before
asking for help.
-->

---

<!-- _class: center -->

## Comprehension Check

- Which address does the file `app/mahasiswa/[id].js` open?
- What is the role of the `"main": "expo-router/entry"` value in `package.json`?
- Why does a tab screen need `useFocusEffect` rather than a plain `useEffect`?
- Why is the login screen placed outside the `(app)` group?

<!--
Five-minute oral quiz: show the question, ask the class to answer together or raise a hand,
then move on to the answers slide.

Do not answer on this slide, because the PDF export shows every slide to students.
-->

---

<!-- _class: center -->

## Answers

- `/mahasiswa/<value>` for any value, for example `/mahasiswa/2201001`
- The app entry point that reads the `app/` folder and sets up the navigator
- Because a tab screen stays mounted in memory, a run-once effect is not triggered by focus
- So it is not protected; if it were, the user would be thrown back to login repeatedly

<!--
Repeat the two distinctions most often swapped: a parameter is always a string, and a tab
never releases its screen from memory.

If many students got the third question wrong, repeat the lifecycle diagram before closing
the meeting.
-->

---

## Summary (1/2)

1. Navigation governs moving between screens, the history, and data passing between screens
2. The main patterns: stack (tiered), tab (side by side), and drawer
3. Expo Router uses file-based routing: one file in `app/` becomes one route
4. Blank project setup: install the packages, change `main`, then add `scheme`
5. `<Stack />` and `<Tabs />` build navigators with different behavior

<!--
Ask students to pick one number and explain it in their own sentence; this works better than
reading them all again.

Stress number 3 as this chapter's paradigm shift: from registering screens inside the code
to arranging files inside folders.
-->

---

## Summary (2/2)

1. `<Link>` is declarative for visible links; `router` is imperative for logic
2. Parameters are sent through the dynamic route `[id]` and the query `?edit=`, always as strings
3. Nested navigation means a tab containing a stack; `(app)` is a route group with no address
4. `useFocusEffect` with `useCallback` triggers a process every time the screen is focused
5. A protected screen at one point, the group layout, with `<Redirect />`

<!--
Connect number 2 with the "data not found" troubleshooting: most cases are rooted in the
string type, not in the data.

Close with a reflective question: "Which structure decision is riskiest if it is wrong from
the start?" That question is discussed on the next discussion slide.
-->

---

## Class Discussion: A Structure Wrong from the Start

<div class="grid2">
<div>

**Questions**

- Which structure decision is the most expensive if it is wrong from the start?
- How do you test that the back button behaves naturally?

</div>
<div>

**What is assessed**

- Accuracy in connecting the decision to history and screen focus
- The ability to design one test scenario, not just to quote theory

</div>
</div>

> The right structure lets the app grow without losing its way; the same pattern is used in the Final Project.

<!--
Give 3 minutes in pairs, then collect 2 to 3 answers. A strong answer names tabs for main
functions, a stack for detail flows, and one guard point.

If the answer stops at "many screens", redirect: "What does that mean for the user's back
button, and for maintaining the code?"
-->

---

## References

| Source | Link |
|---|---|
| Expo documentation (2026) | docs.expo.dev |
| Expo Router: Introduction (2026) | docs.expo.dev/router/introduction/ |
| React Native documentation (2026) | reactnative.dev |
| React documentation (2026) | react.dev |
| Node.js documentation (2026) | nodejs.org |

<div class="grid2">
<div>

**Related chapters**

- Chapter 2 — blank template, Expo Go, emulator
- Chapter 8 — forms and validation; Chapter 10 — data from an API

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the terms Expo Router and navigation are explained
in Appendix C (glossary), while route group is defined on the "From File to Address" slide
(Section 7.6).

Remind them that online documentation depends heavily on version, so always match it to the
SDK 57 version used in this book.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for the Midterm Exam

**Practicum:** complete the Chapter 6 and Chapter 7 practicums until the Login → Home → List → Detail → Form flow works.

Meeting 8 is the **midterm exam** covering Chapters 1 through 7 (20% weight); Assignment 2 (campus app UI redesign) is still running from Chapter 6.

<!--
Close with one sentence: "This chapter gives the app addresses; the next chapter gives
content to those addresses."

State the midterm scope explicitly (Chapters 1 through 7, 20% weight per the RPS) and the
practicum rubric: conceptual understanding 15%, implementation 25%, code quality 15%, UI/UX
15%, debugging 10%, documentation 20% (Appendix A).
-->
