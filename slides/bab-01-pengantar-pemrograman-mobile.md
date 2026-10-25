---
marp: true
theme: academic
paginate: true
title: "Chapter 1 — Introduction to Mobile Programming"
description: "Mobile Programming lecture, meeting 1: mobile app characteristics, four development approaches, Android & iOS, evolution, React Native, Expo, and app architecture."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 1 — Introduction to Mobile Programming"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 1 — Introduction to Mobile Programming

Conceptual foundations before writing code · Meeting 1

<!--
Open with one hook: "Today we write no code at all, but today's decisions determine the
next 14 chapters."

Opening question: "If the academic data is already on the campus website, why does the
campus still need a mobile app?" Collect 2–3 answers without correcting them yet.
-->

---

## Learning Objectives

- Explain the definition and characteristics of mobile apps
- Distinguish native, web, hybrid, and cross-platform
- Explain the position of Android & iOS and the evolution of mobile technology
- Explain how React Native works and the role of Expo
- Analyze React Native trade-offs and mobile app architecture

<!--
Read out only the verbs. Emphasize that the fifth objective is the core of professional
thinking: technology decisions are always trade-offs, not a matter of taste.

Connect it to the assessment: this meeting is assessed through discussion participation
and Assignment 1 (an observation report on three mobile apps).
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Characteristics, Types & Platforms

Section 1.1 Characteristics · 1.2 Four Approaches · 1.3 Android & iOS · 1.4 Evolution

<!--
This part is conceptual. If time is tight, this is the part that may be condensed, but
Section 1.1 must not be skipped because every later chapter refers back to it.
-->

---

## What Is a Mobile App?

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-07.svg)

**A mobile app** is software designed for mobile devices, especially smartphones and tablets.

- The term *mobile* points to mobility: used while on the move
- Sessions are short and often interrupted, so the app must survive stop-and-resume

<!--
Trimmed to the picture (the diagram says this):
- **Not just a shrunken website**
- Installed on the device, not opened through a browser
- Lives inside the app store ecosystem
- Draws on the physical capabilities of the device
- **Where its value comes from**

The two columns of the grid that used to be here are diagram 07 now. The sub-lead "Where
its value comes from" went with them — it is the picture's second branch label — and the
two bullets below the definition are the only prose left, because neither fits a node box
without losing the clause "so the app must survive stop-and-resume".

Analogy: a web app is like walking to a service counter every time you want to be
served; a mobile app is like a service clerk who lives in the user's pocket.

Ask students to name one app and one website they opened today, then compare how each
"feels".
-->

---

## Mobile App Characteristics (1–4)

| # | Characteristic | Design consequence |
|---|---|---|
| 1 | **Mobility & user context** | Short, often interrupted sessions → must resume without losing data |
| 2 | **Touch-based interface** | Finger size, swipe and pinch gestures, limited screen width |
| 3 | **Access to sensors & device features** | Camera, microphone, GPS, accelerometer, always-on notifications |
| 4 | **Fluctuating connectivity** | Wi-Fi switches to cellular data, sometimes disappears → the *offline-first* principle |

<!--
Do not have them memorize it; connect each item to the students' own experience. Ask:
"When did an app on your phone last feel slow or lose data?"

Characteristic 1 is why state and local storage are treated seriously in Chapter 9 and
Chapter 11 — not merely as theory.
-->

---

## Mobile App Characteristics (5–7)

| # | Characteristic | Design consequence |
|---|---|---|
| 5 | **Distribution through app stores** | Google Play & App Store guarantee basic security, but there is a *review* process |
| 6 | **Limited device resources** | Battery and memory are limited → avoid unnecessary repeated processing |
| 7 | **Lifecycle controlled by the system** | The system can freeze the app → the app must save its state |

> Almost every modern information system has a "mobile face": e-learning, attendance, academic services, hospital queue systems.

<!--
Characteristic 7 is the one most often overlooked. Demonstration: open an app, press
Home, wait, then reopen it — in a poor app the user's position is lost.

Comprehension check: "If the app is closed and reopened tomorrow, what should happen to
the data being entered?" (Answer: it is saved, not lost.)
-->

---

## From Characteristics to Design Decisions

| Characteristic | Design consequence | Practiced in |
|---|---|---|
| Mobility & lifecycle | State and storage so data is not lost | Chapter 9, Chapter 11 |
| Touch interface | Mobile-specific components and layout | Chapters 5, 6 |
| Sensors & device features | Camera, location, notifications through Expo | Chapter 12 |
| Changing connectivity | The *offline-first* pattern and synchronization | Chapter 11 |
| Store distribution | *Build* and app publishing | Chapter 15 |
| Limited resources | Habits for writing frugal code | Every chapter |

<!--
This slide is the hidden roadmap: characteristics that look theoretical turn into lines
of code in a specific chapter.

If someone asks "why theory first instead of coding right away?", answer with this
slide — without characteristics 1 and 4, the app will lose data when the network drops
and its developer will not know why that is wrong.
-->

---

## Four Approaches (1): Native & Web Mobile

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-08.svg)

<div class="grid2">
<div>

**Native app**

- Highest performance, most complete access to device features

</div>
<div>

**Mobile web app**

- Limited sensor and notification access, performance below native

</div>
</div>

<!--
Trimmed to the picture (the diagram says this):
- The official language and tools of one platform: Kotlin/Java, Swift
- Weakness: one codebase per platform, doubled cost
- A website optimized for small screens, opened through a browser

And the mobile-web column's closing line, which is the picture's bottom-right cell:
- One codebase, no app store gatekeeping, updates take effect immediately

The picture carries the two rows the prose does not: what each approach is made with, and
what it costs to ship. The row left to prose is what each one gives the user (performance
and device access), because that pair is the one worth reading as sentences. The split is
deliberate — no bullet below is a cell above.

Emphasize two things that are often confused: (a) native is not always "better", it is
only more expensive; (b) mobile web is the cheapest, but it loses on mobile's main
weapons — notifications and a presence on the home screen.

Guiding question: "If the budget only covers one app, which do you choose and what is
the risk?"
-->

---

## Four Approaches (2): Hybrid & Cross-platform

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-09.svg)

- Never feels native — popular in 2012–2015, then abandoned

**Modern cross-platform**

- One language: JavaScript (React Native) or Dart (Flutter)
- Translated into a genuine native interface, not web pages

<!--
Trimmed to the picture (the diagram says this):
- The interface is written in HTML, CSS, JavaScript
- Wrapped in a native container through a WebView, with a bridge to some features
- **Hybrid app** — the lead-in: the picture directly above this bullet is the hybrid app
- "Write once, run anywhere that *deserves* it." — the pull-quote; say it aloud here

The distinguishing question students must be able to answer: "is the end result a web
page or a UI component owned by the operating system?" Hybrid = web page; modern
cross-platform = native component.

The most common misconception: "cross-platform is the same as hybrid". The Table 1.1
slide that follows is used to break it.
-->

---

## Table 1.1 — Comparing the Approaches (1/2)

| Aspect | Native | Mobile web | Hybrid | Cross-platform |
|---|---|---|---|---|
| **Language** | Kotlin/Java, Swift | HTML, CSS, JS | HTML, CSS, JS | JavaScript/JSX |
| **Codebase** | Two (per platform) | One | One | One |
| **Distribution** | App store | Web browser | App store | App store |
| **Performance** | Highest | Low–medium | Medium | High, close to native |

<!--
Compare the two most contrasting columns (native vs mobile web) first, do not read row
by row.

Ask: "Which column fits a campus app best?" Let the students discover for themselves
that the answer is cross-platform, then prove it on the next slide.
-->

---

## Table 1.1 — Comparing the Approaches (2/2)

| Aspect | Native | Mobile web | Hybrid | Cross-platform |
|---|---|---|---|---|
| **Access to device features** | Full | Limited | Partial (via bridge) | Broad (via modules) |
| **Appearance** | Platform-native | Not native | Not native | Close to native |
| **Development cost** | Highest | Low | Medium | Medium |

> No approach wins outright. Every choice is a trade between cost, performance, and user experience.

<!--
The most important discussion point: the last two columns are both "one codebase", yet
on the Appearance row hybrid is "not native" while cross-platform is "close to native".

That is the heart of the difference between hybrid and modern cross-platform — ask the
class again before moving on.
-->

---

## When to Choose Which?

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-02.svg)

> Market priority sets the order: broad reach (typical for Indonesia) → Android first; premium Apple-ecosystem users → do not skip iOS.

<!--
This chart is a set of guiding criteria, not an absolute rule. Real cases are often
mixed: a cross-platform app with one heavy module written natively.

Follow-up question: "Which branch does an attendance app with a selfie photo and
location fall into?" (Answer: cross-platform — forms, data, and standard device
features.)
-->

---

<!-- _class: center -->

## Exercise: Choosing an Approach

- Your campus will build an app to view schedules and grades
- The team is only **two student interns**, with basic JavaScript skills and a limited budget
- Target users: **lower mid-range Android** and **iPhone**
- Task: choose one approach and name at least **four criteria**

<!--
Think-pair-share for 5 minutes, then discuss. A strong answer mentions: the limits of
low-end devices (app size and memory), the need for two platforms with a small team,
and the role of Expo Go in speeding up development.

An answer that only says "cross-platform because it is modern" has not answered — ask
for the reasoning.
-->

---

## Android and iOS: A Comparison

| Aspect | Android (Google, 2008) | iOS (Apple, 2007) |
|---|---|---|
| Source model | Open (AOSP) | Closed |
| Devices | Hundreds of brands | Apple devices only |
| Native language | Kotlin (Java) | Swift |
| App store | Google Play & other sources | App Store |
| App review | Looser | Strict |
| Development tools | Android Studio (any OS) | Xcode (macOS only) |

<!--
Connect it to the practicum: every practicum in this book runs on Android (Expo Go or
an emulator) because it does not require a Mac, while the same code can still run on
iOS.

Guiding question: "Why do small developers in Indonesia almost always start from
Android?" (Market share, device price range, no Mac needed.)
-->

---

## Fragmentation vs Consistency

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-10.svg)

**Consequences for iOS**

- App behavior is predictable
- Developer and device entry costs are relatively high; the rules are stricter

<!--
Trimmed to the picture (the diagram says this):
- **Consequences for Android**
- The app must be tested on a variety of devices
- Behavior can differ from phone to phone
- Distribution is not always through a store (APK files)

The premise that used to run above the two columns moved here, because the picture's left
panel is that column now. Say it before the picture, in these words:

  Android is open and holds the majority of the market, but it brings fragmentation:
  thousands of models with different screen sizes, performance, and system versions.

From this a natural reaction is born: if building native for two platforms means two
languages, two tools, two review processes, then developers look for a way to build
once for both platforms — that is the birth point of React Native.

Store and privacy policies are covered in Chapter 12 and Chapter 13.
-->

---

## The Evolution of Mobile Technology

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-03.svg)

<!--
Do not memorize dates. What must be understood is the pattern: each generation is born
as an answer to the limitations of the previous one.

Quick question: "What limitation did the app store answer?" (Distribution that was
previously controlled by mobile operators.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — React Native, Expo & Architecture

Section 1.5 React Native · 1.6 Expo · 1.7 Trade-offs · 1.8 Architecture · 1.9–1.10

<!--
This part is the core of the chapter and the part most likely to appear on the exam. If
little time remains in this meeting, move Sections 1.8–1.10 to the next meeting.
-->

---

## React Native: Core Concepts

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-04.svg)

**React Native (RN)**

- An open-source framework from Meta, using JavaScript
- A descendant of React: components, props, and state carried over intact
- Write the interface once, drawn as native components

<!--
This book's version: React Native 0.86 in Expo SDK 57, with React 19.2 as its interface
library (technology versions are summarized in the book's introduction).

This is the biggest difference from hybrid: the View component becomes ViewGroup on
Android and UIView on iOS — interface elements owned by the operating system, not boxes
inside a web page.

Guiding question: "If JavaScript code still runs as JavaScript, what exactly is native?"
(Answer: the interface it displays.)
-->

---

## How React Native Works

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-05.svg)

> **Hot reload** makes code changes visible immediately without rebuilding the app.

<!--
The flow is easy to picture: JavaScript issues the command "create a green button here",
the native layer translates it into a real button, then reports the user's tap back to
JavaScript.

Connect the bridge to the performance limitations in Section 1.7: cross-layer
communication adds overhead, so heavy graphics are still better done natively.
-->

---

## What React Native Is Not

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-11.svg)

- Not a translator of code into Kotlin or Swift
- Not a wrapper of web pages inside a WebView

> The consequence: RN excels at data-driven apps — forms, lists, server integration — not at graphics-heavy games.

<!--
Trimmed to the picture (the diagram says this):
- What is native is **the interface it displays**, not the JavaScript code

Show the title, ask the class to guess first, then click to reveal each statement. These
two misconceptions are the ones that come up most often in class.

Follow-up question: "If RN is not a web wrapper, why can its app be bigger than a native
app?" (Because it carries a JavaScript runtime.)
-->

---

## Expo: Three Main Components

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-12.svg)

- **Expo Go** — runs the project on a phone without a native *build*: scan a QR code
- **EAS** — a cloud service for *build* and publishing the app to app stores

Its main command is `npx expo start`; it is practiced in Chapter 2, publishing is explained in Chapter 15.

<!--
Trimmed to the picture (the diagram says this):
- **Expo SDK 57** — one JavaScript API for camera, location, notifications, storage

The analogy: if React Native is "the language and the engine", Expo is "the workshop
that makes that engine easy to use".

The biggest benefit for students is the learning curve: from zero to an app running on a
phone takes only a few steps, without installing Android Studio first.
-->

---

## Expo: The Price You Pay

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-13.svg)

- Native modules not yet supported by Expo require a *prebuild* or a *development build*
- Cutting-edge device features only become available after Expo adapts to the latest SDK

> For the majority of information-system apps, these three limitations are not blockers. For specialized projects, this is the trade-off consideration.

<!--
Trimmed to the picture (the diagram says this):
- Expo app size tends to be larger

Every technology decision has a price. Ask students to judge: which limitation is the
riskiest for their campus app (usually: app size on low-end devices).

Naming this cost in front of the class is not a weakness, it is part of an honest
analysis.
-->

---

## React Native: Advantages and Limitations

| Advantage | Limitation |
|---|---|
| One codebase for Android and iOS | Performance below native under extreme load |
| A JavaScript team can be productive immediately | The app is larger and uses more memory |
| A very broad npm ecosystem | The newest platform features are sometimes adopted late |
| *Hot reload* speeds up iteration | *Debugging* across the JS and native layers is more complicated |
| Updates without rebuilding the app | Custom native modules still require native expertise |
| A large community and plenty of learning material | Depends on the stability of third-party libraries |

<!--
How to present it: every advantage has another side. "One codebase" saves long-term
maintenance, but dependence on third-party libraries is the price.

Closing question: "Name one limitation that is riskiest for a campus app." (Usually:
low-end Android devices with limited memory.)
-->

---

## When Is React Native the Right Fit?

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-14.svg)

- 3D games and video editors are still better written natively
- The decision is made through trade-off analysis, not because of trends

<!--
Trimmed to the picture (the diagram says this):
- Interface- and data-rich apps, not heavyweight graphics rendering
- Business apps, e-commerce, services, and information systems

Emphasize that the biggest savings are in long-term maintenance, not in the initial
writing — this is the strongest argument when debating with stakeholders.

Remind them that this mindset is what they will use in the workplace, whatever framework
is current at the time.
-->

---

## General Architecture of a Mobile App

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-06.svg)

> Example flow: a grade-checking app → the request "show my grades" → the server answers with JSON → the app draws the grade table.

<!--
The most common pattern is client–server: the device displays the interface and collects
input, the server provides data and business rules.

Emphasize that separating the three layers is not just tidiness: separated layers can be
tested, maintained, and replaced independently.
-->

---

## Three Client Layers and Their Chapters

| Layer | In React Native/Expo | Covered in |
|---|---|---|
| **Presentation** | React components, `View`, `Text`, `FlatList`, Flexbox, navigation | Chapters 4, 5, 6, 7 |
| **Business** | Local and global state, form validation, tested logic | Chapters 8, 9, 14 |
| **Data** | `fetch` to a REST API, local storage, authentication tokens | Chapters 10, 11, 13 |

> In the Final Project, you build an app that applies this three-layer architecture.

<!--
This slide answers the question "when will I use all of this?". Every chapter has a
"home" inside the architecture, so the material does not feel disconnected.

Invite guesses: "Which layers does a login form with validation and an API call touch?"
(Presentation: the display; business: the validation; data: the request to the server.)
-->

---

## Real-World App Examples (1/2)

| Category | Example | Device features used |
|---|---|---|
| Online transport | Online motorcycle taxis, online taxis | GPS, camera, order status notifications |
| Online shopping | Marketplaces, online stores | Promo notifications, QR code scan payment |
| Banking and payments | Bank apps, digital wallets | Fingerprint, camera, transaction notifications |
| Communication | Messaging apps, video calls | Microphone, camera, *real-time* notifications |

<!--
Ask students to pick the row closest to their daily life and name which Section 1.1
characteristic dominates in that app.

Example: a digital wallet scans a QR code with the camera while locking access with a
fingerprint — context, sensors, and notifications working together.
-->

---

## Real-World App Examples (2/2)

| Category | Example | Device features used |
|---|---|---|
| Social media | Social networks, video sharing | Camera, gallery, GPS for location tags |
| Education | Online courses, campus apps | Schedule notifications, offline material downloads |
| Health | Pedometer, teleconsultation | Motion sensors, GPS, camera |
| Productivity | Notes, calendars | Reminder notifications, cross-device synchronization |

> An interesting pattern: many large apps **started as the web**, added a mobile app, then made mobile their main product.

<!--
This slide is the bridge to the Practicum: observing three apps, estimating their type
(Section 1.2), identifying device features, and assessing the user experience.

The ability to "dissect" an app like this will keep being used when designing your own
apps in later chapters.
-->

---

## Case Study: Campus Needs

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-15.svg)

**A fictional case with a real pattern.** Wijaya Nusantara University, ± 8,000 students.

- Students need schedules, grades, course registration, announcements
- Lecturers and academic staff: teaching schedules, a reduced service burden

> The root of the problem is **not the data**, but the channel that delivers it.

<!--
Trimmed to the picture (the diagram says this):
- Class schedules are only posted on the notice board
- Room changes are announced through unofficial chat groups
- Grades are only at the academic office during office hours; course registration always queues

Read it as a story, not as a list. The goal is to make students feel that requirements
analysis starts from the user, not from the technology.

A question before the next slide: "If you were the systems analyst at this campus, what
would your first decision be?" Let them guess first.
-->

---

## Case Study: The Architecture Decision

| Option | Consideration | Outcome |
|---|---|---|
| Mobile website | Cheap, but with no proactive notifications and no icon on the home screen | Rejected |
| Native for two platforms | The best quality, but a small team must maintain two codebases | Rejected |
| **React Native + Expo** | One codebase, notifications through Expo SDK, a learning curve the interns can manage | **Chosen** |

> The architecture follows Section 1.8: a three-layer client, with the server providing a REST API. Authentication (Chapter 13), local storage (Chapter 11), and notifications (Chapter 12).

<!--
Emphasize the decision-making pattern: the first two options are not "wrong", they lost
because they did not fit the context — the need for proactive notifications and the
team's capacity.

This is the form of trade-off analysis that is this meeting's learning objective, and the
pattern is the same as the Final Project.
-->

---

<!-- _class: center -->

## Class Discussion: Technology vs Process

- The course registration queue shrinks because of the app — but it remains if the process itself is convoluted
- Unmaintained data stays wrong, however beautiful the app
- A mature systems analyst separates technology problems from process problems

**Question:** name one problem on your campus that looks like a technology problem but is actually a process or data problem.

<!--
The most important slide for Information Systems students: putting technology in its
place. Give 3 minutes in pairs, then collect 2–3 answers.

If the answers are weak, give direction: an attendance system whose data is never
verified (a data problem), or a leave procedure with layers of signatures (a process
problem) — not a problem with the app.
-->

---

## Competencies and the Map of 15 Chapters

![w:1120](assets/diagrams/bab-01-pengantar-pemrograman-mobile-16.svg)

**Competencies gained**

- Explain the concepts and architecture of mobile apps
- Build apps with React Native and Expo, including UI and navigation

<!--
Trimmed to the picture (the diagram says this):
- Chapters 2–7: environment, JavaScript, React, React Native, UI, navigation
- Chapters 8–11: forms, state, REST API, local storage
- Chapters 12–15: device features, security, testing, release
- The peak: the **Final Project** — a mobile academic information system.

Show that every chapter is a brick: Chapter 3 (JavaScript) becomes the foundation of
Chapter 4 (React), which becomes the foundation of Chapter 5 (React Native).

Emphasize the professional habits that accompany the whole journey: reading the official
documentation, reading the error message before asking, and noting down obstacles.
-->

---

## This Meeting's Practicum

- Download and install **Node.js LTS** from nodejs.org — choose the LTS label, not Current
- Install **Visual Studio Code** as the code editor
- Create an **Expo account** at expo.dev as a requirement for the development services
- Run the `cek-lingkungan.js` script and read its output
- Write an **observation report** on three mobile apps you use daily

> If a step fails, do not move on — resolve it first through the chapter's Troubleshooting section.

<!--
Remind them to choose LTS, not Current: the most common mistake in the practicum, because
npm and Expo CLI behavior can differ from what the book discusses.

Students using campus lab computers must coordinate with the lab manager before the
practicum schedule (Node.js LTS and VS Code are required).
-->

---

## Code Example: cek-lingkungan.js

`kode/bab-01-pengantar-pemrograman-mobile/cek-lingkungan.js` — the assessment part

```js
const nomorUtamaNode = Number(versiNode ? versiNode.match(/^v(\d+)/)?.[1] : 0);
if (nomorUtamaNode >= 22) {
  console.log('\nHasil: lingkungan siap. Versi Node.js memenuhi syarat (minimal 22).');
} else if (versiNode) {
  console.log('\nHasil: Node.js terpasang, tetapi versinya lebih lama dari 22.');
  console.log('       Instal ulang Node.js LTS terbaru dari situs resminya.');
} else {
  console.log('\nHasil: Node.js belum terpasang. Instal dahulu Node.js LTS.');
}
```

> This **check → compare → conclude** pattern is a miniature mirror of how a larger app works.

<!--
Show only three things: the regular expression takes the major version number, the
threshold of 22 is this book's requirement, and the three if/else branches give
different conclusions.

Detailing the syntax is not yet necessary — variables, functions, and regular expressions
are built in Chapter 3.
-->

---

<!-- _class: center -->

## Comprehension Check

- Which characteristic most distinguishes a mobile app from a web app?
- What is an app written with web technology and then wrapped in a WebView called?
- Inside React Native, what is the `View` component drawn as?
- In a client–server architecture, which side does the REST API sit on?

<!--
A 5-minute oral quiz: show the question, ask the class to answer in chorus or by a show
of hands, then move to the answers slide. Do not leak the answers on this slide.

If the class answers vary, note it and repeat the distinction at the end of the meeting.
-->

---

<!-- _class: center -->

## Answers

- It draws on the device's sensors, context, and notifications
- A hybrid app — not mobile web, not native
- A platform's native UI component, for example `ViewGroup` on Android
- On the server side — the client calls it over HTTP

<!--
Repeat the distinction most often confused: hybrid (WebView) versus modern
cross-platform (native components).

If many got the first question wrong, repeat the Section 1.1 characteristics before
closing the meeting.
-->

---

## Summary

1. Seven characteristics typical of mobile apps, from mobility to lifecycle
2. Four approaches: native, mobile web, hybrid, cross-platform
3. Android is open and fragmented; iOS is closed and consistent
4. React Native maps JavaScript to native components; Expo completes it
5. A client–server architecture with three client layers: presentation, business, data

<!--
Do not read it out. Ask students to pick one number and explain it in their own words —
this works better than repeating the reading.

Closing message: professional habits start today — every time you meet an unfamiliar
term, look up its meaning; every time an app fails, read the error message before asking.
-->

---

## References

| Source | Link |
|---|---|
| React Native documentation (2026) | reactnative.dev |
| Expo documentation (2026) | docs.expo.dev |
| React documentation (2026) | react.dev |
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |
| Node.js documentation (2026) | nodejs.org |

<div class="grid2">
<div>

**Further reading**

- Chapter 2 — Development Environment Setup

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the glossary of terms (60 entries) in
Appendix C is very helpful for terms such as bridge, WebView, and hot reload.

The main sources for this chapter remain the official documentation at reactnative.dev
and docs.expo.dev, not blogs that may already be outdated.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 2

**Assignment:** complete the practicum (Node.js LTS, VS Code, an Expo account) and write an observation report on three mobile apps.

Next meeting: setting up the environment and running your first app.

<!--
Close with one sentence: "Today we bought the map; from Chapter 2 we start walking."

State the Assignment 1 deadline explicitly: when it is collected, in what format, and
which aspects it is graded on (see Appendix A — the practicum rubric: conceptual
understanding 15%, implementation 25%, code quality 15%, UI/UX 15%, debugging 10%,
documentation 20%).
-->
