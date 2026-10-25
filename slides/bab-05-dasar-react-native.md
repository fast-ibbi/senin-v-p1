---
marp: true
theme: academic
paginate: true
title: "Chapter 5 — React Native Basics"
description: "Mobile Programming lecture, meeting 6: React web vs React Native, core components, StyleSheet, responsive Flexbox, SafeAreaView, and platform differences."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 5 — React Native Basics"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 5 — React Native Basics

Core components, layout, and platform differences · Meeting 6

<!--
Open with a hook: "Chapter 4 taught the way of thinking in React. Today we learn its
visual alphabet, and the result is a real screen on a phone."

Opening question: "If the way of thinking is the same as React, why must the code be
different?" Collect 2–3 answers without correcting them, because the answer only
appears in Section 5.1 on the next slide.
-->

---

## Learning Objectives

- Explain the difference between React for the web and React Native
- Identify the role of React Native's core components
- Apply StyleSheet, style arrays, and conditional styles
- Compose responsive layouts with Flexbox and `useWindowDimensions`
- Choose the right scroller and handle platform differences

<!--
Read out the verbs only, not the whole objectives. The third and fourth items are the
core of the practicum: both are used directly in the Student Profile layout.

Tie it to assessment: this chapter's practicum result becomes the interface foundation
of Chapter 6 (building UI) and Chapter 7 (navigation), and is graded with the practicum
rubric in Appendix A.

Misconception to prevent: "learning components" is not an exercise in memorizing
property names, but knowing when to use which component.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Two React Worlds

Section 5.1 React for the web vs React Native

<!--
A short part, but it determines the whole chapter. If the meeting time is tight, this
part still may not be cut, because without it the components in Part 2 feel like
memorization with no reason.

An analogy that can be used: the same language, but two different publishers.
-->

---

## React Web vs React Native

![w:1120](assets/diagrams/bab-05-dasar-react-native-15.svg)

- React was born in 2013: JSX is rendered by `react-dom` into DOM elements
- Facebook launched React Native in 2015 with the same idea
- The price: certain platform features need an additional native module

<!--
Trimmed to the picture (the diagram says this):
- What stays the same: components, props, state, and hooks (Chapter 4)
- What changes: the medium, from web pages to native components

Stress that only the render target changes, not the way of thinking. Students who have
passed Chapter 4 have therefore already travelled half of this chapter.

Analogy: the same recipe, but the kitchen and the cooking equipment are different, so
the technique of serving it must be adjusted.

Guiding question: "What is the name of the React module that renders to the DOM?"
(Answer: react-dom. React Native does not use it.)

Misconception: "React Native is a new version of React." Not a new version, but a
different render target.
-->

---

## Diagram: React Web vs React Native

![w:1120](assets/diagrams/bab-05-dasar-react-native-07.svg)

---

## From JSX to Native Components

![w:1120](assets/diagrams/bab-05-dasar-react-native-02.svg)

> Only the render target changes: React Native renders the platform's native components.

<!--
Show that React Native renders the platform's own components, namely UIView on iOS and
ViewGroup on Android. That is why an app's appearance feels native, not like a web page
wrapped in a shell.

Compare it with Chapter 1: there we discussed architecture and trade-offs, here we see
the consequence when writing code.

Guiding question: "If View becomes ViewGroup on Android, what does that mean for the
developer?" (Answer: the framework does the mapping, the developer only writes JSX.)

Remind them that this diagram is assembled from the chapter's Table 5.1, not from
another source.
-->

---

## Table 5.1 — React (web) vs React Native

| Aspect | React (web) | React Native |
|---|---|---|
| Rendered element | DOM: `div`, `span`, `p`, `img` | Native components: `View`, `Text`, `Image` |
| Styling | CSS files: selector, class, cascade | JavaScript objects: `StyleSheet` |
| Layout | CSS Box Model + Flexbox (default `row`) | Yoga: Flexbox (default `column`) |
| Touch event | `onClick`, `onMouseEnter` | `onPress`, `onLongPress` |
| Navigation | Browser URL or react-router | No URL (Chapter 7: Expo Router) |
| Browser API | `document`, `window`, `localStorage` | None (Chapter 12: Expo modules) |

<!--
Compare the columns, not the rows. Start with the Layout and Browser API rows, because
those two rows most often cause errors in the practicum.

The Browser API row is the key: no browser means no document and no window, so entire
web tutorials cannot be copied raw into React Native.

Guiding question: "Why does code that uses localStorage fail in React Native?"
(Answer: localStorage is part of the browser, it is not available in the mobile
runtime.)

Misconception: "React Native is the same as the web, only smaller in size."
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Core Components

Section 5.2 View & Text · 5.3 Image · 5.4 Pressable · 5.5 TextInput · 5.6 lists · 5.7 safe area

<!--
The longest and most practical part. Each component is discussed with the same pattern:
what it is, when to use it, and what its common mistakes are.

Time management suggestion: no more than 2 minutes per component, and leave time for
the layout practicum.
-->

---

## View and Text: The Visual Alphabet

<div class="grid2">
<div>

**`View` — the universal container**

- The `div` counterpart: a place to compose and nest layouts
- Its children are other components, not raw text

</div>
<div>

**`Text` — the only carrier of text**

- Every piece of writing, heading, label, and number must be inside `Text`
- May be nested to mix styles within one sentence
- `numberOfLines` truncates long text with an ellipsis

</div>
</div>

> `<View>Halo!</View>` ✗ triggers an error · `<View><Text>Halo!</Text></View>` ✓

<!--
Stress this single rule: only Text may display text. Students who come from the web
almost always write text directly inside a View.

Quick demonstration: ask one student to guess what happens when that rule is broken
(Answer: a red screen with an error, not merely a warning.)

Guiding question: "If Text may be nested, what is the benefit?" (Answer: emphasizing
part of a sentence, for example one word in bold.)

Misconception: treating View as the same as div in every respect, when View cannot
hold text.
-->

---

## Diagram: View and Text: The Visual Alphabet

![w:1120](assets/diagrams/bab-05-dasar-react-native-08.svg)

---

## Code: View with Nested Text

`File: App.js` — a card with a title and nested text

```jsx
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>Sistem Informasi Akademik</Text>
      <Text numberOfLines={2}>
        Selamat datang di aplikasi <Text style={styles.tebal}>mobile</Text>…
      </Text>
    </View>
  );
}
// styles: kartu, judul, tebal — lengkap di buku, Subbab 5.2
```

<!--
Show three things only: the styles come from the styles object, the second Text is
nested, and numberOfLines limits it to two lines so the card height does not change.

Explain that the complete styles are in the chapter script (Section 5.2), so students
do not need to copy them down from the slide.

Guiding question: "What happens if numberOfLines is removed?" (Answer: the card grows
taller following the text length, and the layout below it shifts.)
-->

---

## Image: Two Image Sources

![w:1120](assets/diagrams/bab-05-dasar-react-native-16.svg)

- Local asset: `source={require('./assets/icon.png')}` bundled at build time
- Remote image: `source={{ uri: 'https://…' }}` loaded while the app runs
- A remote image must be given an explicit `width` and `height` in the style

<!--
Trimmed to the picture (the diagram says this):
- `resizeMode="cover"` fills the box by cropping the overflowing part
- If a photo is not available yet, show an initials placeholder, not an empty box

The reason dimensions are mandatory: React Native cannot guess the pixel size of an
image that has not finished downloading, so an image without width and height measures
zero.

The initials placeholder pattern from the practicum is explained here briefly; the
AvatarPlaceholder component is discussed in the practicum. Caching alternatives with
expo-image are mentioned as further material, not as a required topic of this chapter.

Guiding question: "Why should a logo be bundled rather than fetched from a server?"
(Answer: it always appears even without the internet.)

Misconception: writing `src` as in an img tag on the web. In React Native it is called
source.
-->

---

## Diagram: Image: Two Image Sources

![w:1120](assets/diagrams/bab-05-dasar-react-native-09.svg)

---

## Code: Remote Image

`File: App.js` — a network image with explicit dimensions

```jsx
import { Image, StyleSheet } from 'react-native';

export default function FotoMahasiswa() {
  return (
    <Image
      source={{ uri: 'https://example.com/foto/2201001.jpg' }}
      style={styles.foto}
      resizeMode="cover"
    />
  );
}
const styles = StyleSheet.create({
  foto: { width: 72, height: 72, borderRadius: 36 },
});
```

> URL `example.com` is a placeholder — replace it with a real image URL when trying it out.

<!--
Remind them that example.com is deliberately used as a placeholder so that no invented
URL is taken as real; replace it with a real URL during practice.

Show that a borderRadius of half the width produces a round photo, the same pattern as
the initials avatar in the practicum.

Guiding question: "What happens if the device has no internet?" (Answer: an empty
image box, and that is where the initials placeholder helps.)

Misconception: thinking a local image also needs explicit dimensions. For a local
asset the image can be bundled, but its dimensions still need to be written in the
style.
-->

---

## Touch: Button and Pressable

<div class="grid2">
<div>

**`Button` — ready to use, limited**

- Platform default style: blue text on iOS, a colored button on Android
- Only `title`, `onPress`, `color`, `disabled`; its content cannot be styled

</div>
<div>

**`Pressable` — the main choice**

- Free children: the button is composed from `View` and `Text`
- `style` as a function that receives the `pressed` status
- `android_ripple`, `hitSlop`, `disabled`, `onLongPress`

</div>
</div>

> `Button` is enough for a quick prototype; `Pressable` is the main touch component in this book.

<!--
Stress touch feedback: users must feel that the button responds. Without it, users
press the button repeatedly and think the app has frozen.

Mention that the TouchableOpacity family is still widespread in old code, but Pressable
replaces its role. This is a real example of an outdated API that this book does not
use.

Guiding question: "When is Button still a reasonable choice?" (Answer: a quick
prototype or a one-off button without special design.)

Misconception: thinking Button is easier and therefore better. Its ease actually means
its style cannot be customized at all.
-->

---

## Diagram: Touch: Button and Pressable

![w:1120](assets/diagrams/bab-05-dasar-react-native-10.svg)

---

## Code: Pressable with a Function Style

`File: App.js` — a button with feedback when pressed

```jsx
import { Pressable, StyleSheet, Text } from 'react-native';

export default function TombolSimpan() {
  return (
    <Pressable
      onPress={() => console.log('Tombol ditekan')}
      style={({ pressed }) => [styles.tombol, pressed && styles.tombolTertekan]}
      android_ripple={{ color: '#c9d9f8' }}
    >
      <Text style={styles.labelTombol}>Simpan Data</Text>
    </Pressable>
  );
}
// styles: tombol, tombolTertekan, labelTombol — lengkap di buku, Subbab 5.4
```

<!--
This is the first example of a conditional style in this chapter: pressed is true while
a finger presses, so the tombolTertekan style is only active at that moment.

Explain hitSlop as an extension of the touch area without changing the visual
appearance, because a touch target that is too small is hard for the user's finger.

Guiding question: "Why is the pressed style placed last in the array?" (Answer: a
later style overrides the earlier one, so it is safe to override the base style.)

Misconception: thinking android_ripple also appears on iOS. That ripple effect is
typical of Android.
-->

---

## TextInput: Controlled Component

![w:1120](assets/diagrams/bab-05-dasar-react-native-17.svg)

- One `state` holds the value; `onChangeText` updates it on every keystroke
- Base properties: `keyboardType`, `secureTextEntry`, `multiline`, `maxLength`
- Keyboard details and validation are covered fully in Chapter 8

<!--
Trimmed to the picture (the diagram says this):
- `value={nama}` makes the box always reflect the state
- Without `value`, the component is uncontrolled and out of sync with the state

Connect it with Chapter 4: this is a direct application of the state pattern. Every
keystroke triggers setNama, the state changes, the component re-renders, and the text
below changes too.

Stress that a controlled component is a habit used throughout the book, including the
student data form in Chapter 8.

Guiding question: "What happens if value is written but onChangeText is not?"
(Answer: the user cannot change the box, because its value is locked by the state.)

Misconception: thinking value is only an initial value, when it binds the state
throughout the component's lifecycle.
-->

---

## Diagram: TextInput: Controlled Component

![w:1120](assets/diagrams/bab-05-dasar-react-native-11.svg)

---

## Code: A Simple TextInput

`File: App.js` — an excerpt of the important parts (imports and the full StyleSheet are in the book)

```jsx
export default function App() {
  const [nama, setNama] = useState('');
  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        value={nama}
        onChangeText={setNama}
        placeholder="Ketik nama lengkap"
      />
      <Text>Halo, {nama ? nama : 'belum ada nama'}!</Text>
    </View>
  );
}
```

<!--
Point out three decisive lines: value, onChangeText, and the Text line that displays
the state. All three form the same state loop as in Chapter 4.

A short example in front of the class: ask students to guess what appears before the
user types anything (Answer: the greeting string plus the fallback text from the code,
because nama is still empty).

Warn that all keyboard details, including a keyboard that covers the input box, are
only discussed in Chapter 8, so students do not need to solve that now.
-->

---

## ScrollView or FlatList?

| Aspect | `ScrollView` | `FlatList` |
|---|---|---|
| How it renders | All children are rendered at once | Virtualization: only the visible items |
| Good for | Short content with a fixed structure | Any data that can grow long |
| Example | An article, a form, a few cards | A student list, a product catalog |
| Weakness | 1,000 items exhaust memory | A unique `keyExtractor` is mandatory |

> Rule of thumb: `ScrollView` for short content, `FlatList` for data that can grow long.

<!--
Explain virtualization as the core idea: FlatList keeps a few spare items above and
below the screen, discards the ones already passed, and builds new ones as it scrolls.

Analogy: ScrollView is like printing the whole book to read one page; FlatList is like
printing a page when it is needed.

Guiding question: "What is the render cost of a 1,000-item list in FlatList?"
(Answer: proportional to the number of items visible on the screen, not 1,000.)

Misconception: thinking FlatList is automatically faster in every case, including for
five static cards.
-->

---

<!-- _class: center -->

## What Happens If…?

- Two `View`s are stacked without writing `flexDirection` at all?
- One screen holds a scroller inside a scroller with the same direction?
- `keyExtractor` on a `FlatList` is left empty?

The answers to scenarios 2 and 3 are in the next two slides; scenario 1 is in Section 5.9.

<!--
Ask the class to answer together or raise a hand before moving on. Do not give hints to
the answers.

The third scenario is deliberately repeated as reinforcement: this question appears in
the chapter evaluation, and its answer is the unique key warning in the console.

If the class goes silent on the first question, prompt them with: "What is the default
Flexbox direction on the web?" The answer to the first scenario only arrives in
Section 5.9, in the third part of this meeting.
-->

---

## Code: A Basic FlatList

`File: App.js` — a student list (Section 5.6)

```jsx
<FlatList
  data={DAFTAR_MAHASISWA}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.baris}>
      <Text style={styles.nama}>{item.nama}</Text>
      <Text style={styles.nim}>{item.nim}</Text>
    </View>
  )}
/>
```

> Other properties: `ItemSeparatorComponent`, `ListHeaderComponent`, `ListFooterComponent`, `ListEmptyComponent`, `numColumns`.

<!--
Discuss the three required properties: data, keyExtractor, and renderItem. The rest are
mentioned only as extras so students know where the documentation goes.

keyExtractor is tied to the key concept in Chapter 4: React needs a unique identity to
track a row, and an array index is not a stable identity. This slide also settles the
third scenario from the warm-up slide: without keyExtractor, the console shows a unique
key warning.

Guiding question: "Why is item.id better than the array index as a key?" (Answer: the
index changes when data is filtered or sorted, so React matches rows incorrectly.)

Misconception: filling keyExtractor with a random value that always changes, which
instead makes the list rebuild every time.
-->

---

## One Screen, One Main Scroller

![w:1120](assets/diagrams/bab-05-dasar-react-native-05.svg)

- A `FlatList` inside a same-direction `ScrollView` triggers the VirtualizedLists warning
- Both fight for scroll control, so the FlatList virtualization breaks
- The fix: `FlatList` becomes the outer scroller, fixed content goes into `ListHeaderComponent`
- The alternative: a single `ScrollView` when the whole page has a fixed structure
- This warning really appears in the Metro console, read it (Chapter 14)

<!--
This rule is taken from the chapter's troubleshooting section and is the core of the
analysis question's answer at the end of the chapter; this slide also answers the second
scenario from the warm-up slide. Stress that this mistake does not break the app
immediately, but damages performance unnoticed.

Show the pattern from Practicum Code 5: the profile card is placed as a
ListHeaderComponent inside the FlatList, not wrapped in a ScrollView.

Guiding question: "Why does moving the card into ListHeaderComponent solve the
problem?" (Answer: there is only one scroller, so virtualization works normally.)

Misconception: thinking a console warning can be ignored because the app still runs.
-->

---

## SafeAreaView and the Safe Area

![w:1120](assets/diagrams/bab-05-dasar-react-native-18.svg)

- A phone screen has a notch, a status bar, and a home indicator
- Safe area: the area that is still safe for content, its distance is called an inset
- Since Android 15 content is rendered edge-to-edge, and RN 0.86 follows it

> Installation: `npx expo install react-native-safe-area-context`, then `SafeAreaProvider` at the root and `edges={['top', 'bottom']}`.

<!--
Trimmed to the picture (the diagram says this):
- The built-in `SafeAreaView` only works on iOS, on Android it has no effect
- The modern choice: `react-native-safe-area-context` and the `useSafeAreaInsets` hook

Point out on their own phones where the notch or the status bar is, then ask what
happens if content runs into it.

The version-sensitive marker must be stated: the status of the built-in SafeAreaView
and the edge-to-edge policy can change between releases, so check the official
documentation at reactnative.dev and docs.expo.dev. This chapter uses React Native 0.86
in Expo SDK 57.

Guiding question: "Why does the Android 15 solution make the safe area a mandatory
matter, not an extra?" (Answer: content is now rendered to the edge of the screen, so a
title can be covered by the status bar.)

Misconception: assuming the built-in SafeAreaView already handles both platforms.
-->

---

## Diagram: SafeAreaView and the Safe Area

![w:1120](assets/diagrams/bab-05-dasar-react-native-12.svg)

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 3 — Style, Layout & Platform

Section 5.8 StyleSheet · 5.9 responsive Flexbox · 5.10 platform differences

<!--
This is the part that most often makes students who are former web developers stumble,
because there is no CSS and the Flexbox direction is different.

If little time is left, Section 5.9 may not be skipped: the practicum and Chapter 6
depend on it.
-->

---

## StyleSheet, Not CSS

- There is no CSS file: styles are written as JavaScript objects
- `StyleSheet.create` validates style properties when the app loads
- Style definitions are centralized outside JSX so components are easier to read
- There is no cascade, except for certain text inheritance on iOS

```jsx
const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});
```

<!--
The first benefit students feel most: a typo in a style property name shows up
immediately when the app loads, instead of failing silently as in CSS.

The cascade analogy: on the web, styles drip from parent to child like a waterfall; in
React Native every component declares its own style, so the only way to change the
appearance is to wrap it with a new style.

Guiding question: "How do you style two Views with the same base style but different
sizes?" (Answer: the base style in the StyleSheet, the special style added through a
style array on the next slide.)

Misconception: looking for a separate CSS file inside the Expo project structure, when
styles are written as JavaScript objects.
-->

---

## Style Arrays and Conditional Styles

![w:1120](assets/diagrams/bab-05-dasar-react-native-19.svg)

- A style array merges objects in order; a later style overrides
- Example: `style={[styles.kartu, styles.kartuBesar]}`
- A conditional style picks a style with `&&` or a ternary inside the array
- Example: `style={[styles.baris, aktif && styles.barisAktif]}`
- `false` and `null` values inside a style array are ignored by React Native

<!--
Both patterns are used continuously until the end of the book, so write them both on
the board and ask students to note them down.

Tie it to the BarisMahasiswa component in the practicum: one style array holds the base
style, the selected style, and the pressed style at once.

Guiding question: "Why is the condition `aktif && styles.barisAktif` safe to write, when
`aktif` can be false?" (Answer: React Native ignores false and null values inside a style
array.)

Misconception: using if/else to choose two separate style variables; the array pattern
is more concise and does not duplicate style definitions.
-->

---

## Diagram: Style Arrays and Conditional Styles

![w:1120](assets/diagrams/bab-05-dasar-react-native-13.svg)

---

## Flexbox: Default Direction `column`

![w:1120](assets/diagrams/bab-05-dasar-react-native-06.svg)

- On the web, Flexbox defaults to `row` so elements line up horizontally
- In React Native the layout engine is Yoga: default `column`, stacking downward
- The reason: a phone screen is more naturally read from top to bottom
- Two `View`s stacked on each other are therefore laid out vertically automatically
- This is the point that most often traps web developers

<!--
This slide settles the first question from the warm-up slide in Part 2: the default
direction is column. The other two scenarios were already answered when discussing
nested scrollers and an empty keyExtractor.

Analogy: arranging books on a shelf vertically. To line them up horizontally, the
direction must be stated explicitly with flexDirection row.

Guiding question: "How do you make two cards sit side by side?" (Answer: flexDirection
row, often with gap and flexWrap added.)

Misconception: thinking React Native does not support Flexbox, when the engine is the
same, only the default value differs.
-->

---

## Core Flexbox Properties

| Property | Meaning |
|---|---|
| `flexDirection` | Direction of the main axis: `row` or `column` (default) |
| `justifyContent` | Arrangement along the main axis |
| `alignItems` | Arrangement on the cross axis, default `stretch` |
| `flex` | Share of space between siblings; `flex: 1` fills the remaining space |
| `gap` | Spacing between children without repeated margins (since RN 0.71) |
| `flexWrap` | Children move to a new line when the main axis is full |

<!--
Mastering these six properties is enough; the rest are rarely used in this book's apps.

Stress flex as the secret of a fixed header layout with content filling the screen, and
gap as a replacement for a repeated marginTop.

Guiding question: "What is the difference between flex: 1 and flex: 2 on two sibling
children?" (Answer: the remaining space is divided, the second child gets twice as
much.)

Misconception: translating alignItems as horizontal alignment. The name points to the
cross axis, so its meaning depends on flexDirection.
-->

---

## Code: Row, Grid, and Footer

`File: App.js` — an excerpt of the page layout style

```jsx
const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb', padding: 16 },
  barisJudul: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  barisKartu: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kartuKecil: { width: '48%', padding: 10, backgroundColor: '#ffffff' },
  kaki: { flex: 1 },
});
```

> `flex: 1` on `kaki` pushes all the content up, the classic pattern for a footer at the bottom of the screen.

<!--
Read three patterns from this code: barisJudul as the title on the left and the count on
the right, barisKartu as a two-column grid at 48 percent, and kaki as the pusher that
lifts the content up.

Show that 48 percent was chosen so two cards fit with the remaining gap, not the 50
percent figure that would make them touch.

Guiding question: "What happens if flexWrap is removed on a narrow screen?" (Answer:
the cards stay on one row and overflow off the screen.)

Misconception: adding a margin to every child, when one gap property is enough.
-->

---

## Responsive Layout with `useWindowDimensions`

![w:1120](assets/diagrams/bab-05-dasar-react-native-20.svg)

- This hook returns `{ width, height, scale, fontScale }`
- Pattern: `const jumlahKolom = width >= 600 ? 3 : 2`, then used as `numColumns`

```jsx
const { width } = useWindowDimensions();
const jumlahKolom = width >= 600 ? 3 : 2;

<FlatList key={jumlahKolom} numColumns={jumlahKolom} data={DATA} />
```

<!--
Trimmed to the picture (the diagram says this):
- The value changes and triggers a re-render when the phone is rotated

Explain the reason for key={jumlahKolom}: when numColumns changes, React Native needs to
rebuild the list from the beginning, and changing the key is the standard way.

A quick oral exercise: "On a phone 360 pixels wide, how many columns appear?"
(Answer: two columns, because 360 is less than 600.)

Warn that the complete thinking of responsive design, including typography and
accessibility, is only discussed in Chapter 6.

Misconception: measuring the screen width once at the start and storing it in a
variable; the value is not updated when the orientation changes.
-->

---

## Three Tools for Platform Differences

![w:1120](assets/diagrams/bab-05-dasar-react-native-03.svg)

> A simple rule: `Platform.select` for small differences, file extensions for large differences.

<!--
Stress the selection rule: a small value or style is enough through Platform.select,
while an entirely different component is written as an .ios.js and .android.js file so
that Metro picks the right one at build time.

Mention Platform.OS for the simplest branching. Ask: "If the whole structure differs,
do you still use if inside one file?" (Answer: no, use file extensions.)

The version-sensitive marker also applies here: the edge-to-edge policy and the details
of platform behavior can change between releases, so always check the official
documentation.

Misconception: writing two full code bases for Android and iOS, when only the
differences need handling.
-->

---

## Code: Layered Style with `Platform.select`

`File: components/KartuMahasiswa.js` — a card shadow that differs per platform

```jsx
kartu: {
  flexDirection: 'row',
  alignItems: 'center',
  ...Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 3 },
    default: {},
  }),
},
```

> The `...` (spread) pattern inserts the result of `Platform.select` into the `StyleSheet` style object.

<!--
Show that iOS uses four shadow properties and Android uses elevation, and the two do not
replace each other. This is the most concrete example of a platform difference that
cannot be unified.

Also mention the compact use of Platform.select directly inside JSX, such as the
SalamSistem component in the chapter example, to choose part of a sentence per
platform.

Guiding question: "Why does default need to be filled?" (Answer: as a fallback when the
platform is not recognized, so the style stays valid.)

Misconception: writing elevation on iOS or shadowColor on Android and then concluding
that the style does not work.
-->

---

## Case Study: A List That Lags While Scrolling

![w:1120](assets/diagrams/bab-05-dasar-react-native-21.svg)

**A fictional case with a real pattern.** The Information System of a university.

- A web table shrinks to unreadable on a phone, and its scrolling stutters
- Decision 2: a card layout with `useWindowDimensions`, one to two columns
- Decision 3: `Platform.select` and the safe area for both iOS and Android

> The practicum in this chapter is a miniature of that case — and it grows into the Final Project.

<!--
Trimmed to the picture (the diagram says this):
- The Academic Office displays hundreds to thousands of rows per academic advisor
- Decision 1: `FlatList` so that only the visible rows are rendered

Read it as a story, not a list: academic advisors complain, the rectorate decides to
build a mobile version, the team faces three decisions.

Stress that those three decisions are exactly the three subjects of the chapter: core
components, layout, and platform differences; this chapter is not a collection of
unrelated components.

Guiding question: "Alternative (b) in the chapter's analysis question is a ScrollView
holding cards and a FlatList. What is its main risk?" (Answer: virtualization breaks
because of nested scrollers, and performance is bad again.)

This case is fictional with a real pattern, state that explicitly so students do not
look for it as news.
-->

---

## Diagram: Case Study: A List That Lags While Scrolling

![w:1120](assets/diagrams/bab-05-dasar-react-native-14.svg)

---

## Practicum: Student Profile Layout

![w:1120](assets/diagrams/bab-05-dasar-react-native-04.svg)

> Data flows down through props, touches flow up through `padaPilih` (Chapter 9).

<!--
Summarize the practicum architecture: data separated in data/mahasiswa.js, small
components such as AvatarPlaceholder and BarisInfo, then App as the assembler that holds
the state.

Stress the single direction of the data flow: App stores `terpilih`, sends it as props,
and receives the choice back through the `padaPilih` callback.

Guiding question: "Which component holds the state in this app?" (Answer: only App,
with one terpilih state containing the first student, Budi Santoso.)

Misconception: putting state in every BarisMahasiswa so that the card above can never
change.
-->

---

<!-- _class: center -->

## Comprehension Check

- Why may text not be written directly inside a `View`?
- Which component is right for a list of 1,000 students, and why?
- Which `FlatList` property determines the unique identity of each row?
- On Android, which property does a shadow style use?
- What is the default `flexDirection` in React Native?

<!--
A five-minute oral quiz: show the questions, ask the class to answer together or raise a
hand, then move to the answers slide. Do not leak the answers on this slide.

If answers vary on the fourth question, repeat the iOS and Android distinction before
closing the meeting.

Note the questions most often answered wrongly; they are the material for a short
review at the next meeting.
-->

---

<!-- _class: center -->

## Answers

- Because `View` only accepts components as children, not text
- `FlatList`, because virtualization only renders the visible items
- `keyExtractor`, filled with a unique and stable value such as `item.id`
- `elevation`; on iOS it uses `shadowColor` along with `shadowOpacity`, `shadowRadius`, `shadowOffset`
- `column`, unlike the web where the default is `row`

<!--
Repeat the distinction most often confused: the iOS shadow uses four shadow properties,
Android uses elevation.

If many got the third answer wrong, stress that keyExtractor is an obligation, not an
optional extra, and that an array index is not a stable identity.

Close the quiz with one reinforcing sentence: these five answers are patterns that will
be used again from Chapter 6 to Chapter 8.
-->

---

## Summary (1/2)

1. React Native renders native components, not the DOM, and without CSS or browser APIs
2. `View` is the universal container; `Text` is the only text-carrying component
3. `Pressable` is the main touch component; `TextInput` uses a controlled component
4. A remote `Image` must have explicit dimensions, and the initials placeholder is the answer
5. `ScrollView` renders all children, `FlatList` virtualizes long lists

<!--
Do not read it out. Ask students to pick one number and explain it in their own words,
then complete it from the presenter notes if it falls short.

Stress number 1 as the chapter's key sentence: every other difference flows from the
fact that React Native does not run inside a browser.
-->

---

## Summary (2/2)

1. One screen, one main scroller; nested scrollers break virtualization
2. The built-in `SafeAreaView` is iOS only, the safe area library is for both
3. `StyleSheet`, style arrays, and conditional styles are the styling patterns throughout the book
4. Flexbox defaults to `column`; `useWindowDimensions` makes the layout responsive
5. Platform differences are handled by `Platform.OS`, `Platform.select`, or file extensions

<!--
Repeat the version-sensitive marker on number 2: the status of the built-in
SafeAreaView and the Android edge-to-edge policy can change between releases, so the
official documentation is always the final reference.

A quick closing question: "Which of these five points is most likely to make your app
stutter?" (The expected answer: nested scrollers or a long list rendered entirely.)

State that this summary becomes the checklist when working on the chapter challenge.
-->

---

<!-- _class: center -->

## Class Discussion and Exercises

- Which React concepts stay the same, and which change their form? Why?
- How would you explain to a teammate the reason for choosing `FlatList`?
- Scenario: a `ScrollView` holding statistic cards and a `FlatList` below it

**Question:** which alternative do you recommend for a page with 2,000 records and a summary card at the top, and what are the risks?

<!--
A five-minute class discussion: ask students to pair up, then collect 2–3 answers.

A strong answer names the card-as-ListHeaderComponent pattern, the reason for
virtualization, and the risk of each alternative. An answer that only names a component
has not answered, ask for the reason.

Remind them that the chapter challenge (a responsive list and a compact mode for the
profile card) is graded in the next practicum, and its rubric is in Appendix A.
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

- Chapter 4 — React Basics
- Chapter 6 — Building a mobile user interface

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D, and terms such as virtualization, inset, and
controlled component are in the glossary in Appendix C.

The main source for this chapter remains the official documentation at reactnative.dev
and docs.expo.dev, not a blog or a video that may already be outdated.

Repeat the version-sensitive marker: the built-in SafeAreaView and the Android
edge-to-edge policy need to be re-verified against the release documentation.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 6

**Assignment:** complete the Student Profile layout practicum and the responsive two-column list challenge.

Next meeting: building a tidy and consistent interface.

<!--
Close with one sentence: "Today you learned the visual alphabet of React Native; from
Chapter 6 we learn to arrange it beautifully and consistently."

State the practicum deadline explicitly: when it is collected, in what format, and which
aspects it is graded on (Appendix A — practicum rubric: conceptual understanding 15%,
implementation 25%, code quality 15%, UI/UX 15%, debugging 10%, documentation 20%).

Remind students to keep the profil-mahasiswa project, because it continues in the
following chapters.
-->
