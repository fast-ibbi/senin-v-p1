---
marp: true
theme: academic
paginate: true
title: "Chapter 11 — Local Data Storage"
description: "Mobile Programming lecture, meeting 12: the need for local storage, AsyncStorage, JSON serialization, simple caching, token storage, and the Notes App project."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 11 — Local Data Storage"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 11 — Local Data Storage

AsyncStorage, JSON, and a persistent notes app · Meeting 12 · Sub-CPMK 6.1

<!--
Opening hook: "Chapter 10 made our app able to call a server; today we make that app stop
losing data the moment it is closed."

Mention the RPS context: meeting 12 covers Chapter 11 (Sub-CPMK 6.1). This material is
reused in Chapter 12 (stored student profile) and Chapter 13 (token in secure storage).
-->

---

## Learning Objectives

| # | After this meeting students are able to |
|---|---|
| 1 | Explain the need for local storage compared with state in memory |
| 2 | Identify the characteristics of AsyncStorage |
| 3 | Implement saving, reading, and deleting data with JSON |
| 4 | Analyze the caching pattern: snapshot, timestamp, and TTL |
| 5 | Evaluate the risk of storing tokens in AsyncStorage |
| 6 | Design a persistent notes app |

<!--
Read out only the verbs. Items 3–6 are assessed through the Chapter 11 Practicum (rubric in
Appendix A); items 1–2 through this chapter's comprehension questions — see the RPS row.

Stress item 6: the notes app is not a typing exercise but proof that data survives after
the app is closed — and that is what students must report.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Requirements & AsyncStorage

Section 11.1 Requirements · 11.2 Saving, Reading, Deleting

<!--
This part is the most conceptual. If meeting time runs short, compress the discussion of
the storage options (SQLite and expo-file-system), but do not skip Section 11.2, because
the whole practicum of this chapter stands on it.
-->

---

## Why State Alone Is Not Enough

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-06.svg)

React state lives in the device's memory (RAM), and memory is **volatile**: once the app is closed or its process is killed by the system, every value vanishes without a trace.

- The operating system can kill the app process at any time to reclaim its memory
- The network is not always available: poor signal, exhausted quota, or a failing server
- Not all data needs to be sent to the server — local is faster and saves quota
- Storing data locally also respects user privacy more

<!--
Analogy: state is the classroom whiteboard (quick to write, quick to erase), local storage
is a notebook (it must be opened and closed, but its content is still there tomorrow).

Ask: "When did an app on your phone last lose data you were in the middle of entering?"
(Usually a draft lost after the app process was killed by the system.)

Misconception warning: pressing Home does not mean the app has stopped. The app process
stays alive until the system needs it back.
-->

---

## Five Kinds of Data That Must Survive

| Data type | Example in an app |
|---|---|
| User preferences | Dark theme, interface language, font size |
| Form drafts | Chapter 8 form input that is not finished |
| Server content cache | A copy of Chapter 10 API data so it still shows |
| Offline operational data | Notes or orders created without signal |
| Session credentials | A token so the user need not log in every time |

<!--
Ask students to pick one row and name a real app that uses it; concrete experience sticks
better than a definition.

The "cache" and "offline operational data" rows are the content of Section 11.4 and the
case-study material; just flag them now, do not explain them yet.

Warning: a form draft is not an ordinary storage problem — it is also a matter of user
trust. Data lost once often makes a user stop using the app.
-->

---

## Three Local Storage Options in Expo

| Option | Character | Best suited for |
|---|---|---|
| AsyncStorage | Simple key–value pairs | Preferences, cache, short lists |
| SQLite | Relational database | Large data with complex queries |
| `expo-file-system` | File storage | Images and media (Chapter 12) |

> Android has SharedPreferences and SQLite, iOS has UserDefaults and Core Data — AsyncStorage unifies that difference.

<!--
Analogy from the chapter: using SQLite to store preferences is as wasteful as bringing a
truck to carry one box. The selection principle is "the simplest tool that is
adequate".

Ask: "For 50 product photos, which one?" (expo-file-system) and "for 10,000 transaction
rows searched by date?" (SQLite) — never AsyncStorage.
-->

---

## What AsyncStorage Is

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-07.svg)

**AsyncStorage** is an asynchronous **key–value storage** library for React Native: community-maintained, fully supported by Expo, and running on Android, iOS, and web.

- Every piece of data is stored under a key, a unique name used to read it back
- Different from `npm install`: `npx expo install` picks the version that matches the SDK

```bash
npx expo install @react-native-async-storage/async-storage
```

<!--
Stress the difference in install commands: installing with `npm install` and a free version
is the most frequent complaint in forums and reappears in this chapter's troubleshooting row.

Misconception warning: AsyncStorage is not a database. There are no tables, no relations,
no queries — only key and value pairs.

Ask: "What happens if the key name is written differently when saving and reading?"
(The data looks lost even though it is stored under another key.)

Trimmed to the picture (the diagram says this):
- The concept is like filing drawers: one drawer, one label, and its contents are read through that label
-->

---

## AsyncStorage API at a Glance

| Method | Function | Return value |
|---|---|---|
| `setItem(key, value)` | Saves one key–value pair | `Promise<void>` |
| `getItem(key)` | Reads the value of one key | `Promise<string \| null>` |
| `removeItem(key)` | Deletes one key together with its value | `Promise<void>` |
| `multiGet([k1, k2])` | Reads several keys at once | `Promise<[key, value][]>` |
| `multiSet([[k1, v1]])` | Saves several pairs at once | `Promise<void>` |
| `getAllKeys()` | Gets the list of all keys | `Promise<string[]>` |

- `clear()` deletes all of the app's data — do not use it without a clear reason

<!--
Do not read it row by row. Group it: three single-key methods, two multi-key methods, two
whole-store management methods.

Stress the third column: all of them return a Promise, so all of them must be awaited.
`multiGet` is more efficient than calling `getItem` repeatedly.

Warning: in a real app `clear()` deletes every user preference and session — call it only
in a logout or a deliberate reset flow.
-->

---

## Example: Saving and Reading a Name

`App.js` — the basic pattern of `setItem` and `getItem`

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

async function simpanNamaPengguna(nama) {
  try {
    await AsyncStorage.setItem('preferensi:nama', nama);
  } catch (error) {
    console.warn('Gagal menyimpan:', error);
  }
}
async function bacaNamaPengguna() {
  const nama = await AsyncStorage.getItem('preferensi:nama');
  console.log(nama === null ? 'Belum ada nama tersimpan' : nama);
}
```

> `getItem` returns `null` — not an empty string — for a key that has never been saved.

<!--
Show only three things: the `await` that waits for the write and read to finish, the
`try/catch` that keeps the app from stopping, and the `null` check before use.

Ask: "If `await` is removed, what happens?" (The next line runs before the data is
written — this is the origin of the 'data not saved' bug.)

Warning: a prefixed key pattern such as `preferensi:nama` prevents collisions between
features; make it a habit from the very first example.
-->

---

## Five Principles for Using AsyncStorage

| Principle | Practical meaning |
|---|---|
| **Asynchronous** | All methods return a Promise; call them with `await` |
| **Strings only** | Keys and values must be strings; objects must be serialized |
| **`null` means not there yet** | Check with `=== null`, not by comparing an empty string |
| **Not encrypted** | Data is stored in plain form inside the app sandbox |
| **Not for large data** | For preferences, cache, and short lists |

> Behind the scenes: SQLite on Android, a small file on iOS, `localStorage` on web — all of it is deleted when the app is uninstalled.

<!--
⚠ version-sensitive: the official documentation mentions a per-entry size limit of about 6 MB
on Android because of the SQLite implementation behind it; the exact value can change between
versions — check the library's official documentation page before quoting the number.

Ask the class to guess the consequence of violating each row before it is explained. The
"not encrypted" row is the doorway into Section 11.5; only touch on it for now.

Misconception warning: local data is not kept forever. Uninstalling, clearing the app's
data, or changing devices deletes it without warning.
-->

---

<!-- _class: center -->

## Think-Pair-Share: The Empty List

- After a restart, the notes list is empty — name three possible causes
- Which cause can you prove from the code, and which is still a guess?

Two minutes in pairs, then 2–3 pairs present their results.

<!--
Do not give the answers. After 2 minutes, collect the answers and write them on the board;
every answer will be verified in the second half of this meeting.

Expected answers: a missing `await`; a key name that differs between saving and reading;
storage deleted because of an uninstall; a `JSON.parse` failure that returns an empty list;
data loaded only once so the screen does not refresh.

Guiding question if the class is silent: "Data that looks lost — was it really not
stored?"
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — JSON, Cache & Tokens

Section 11.3 JSON Serialization · 11.4 Caching · 11.5 Storing Tokens

<!--
This part is the most frequently tested: serialization, the three safety layers for reading
data, the cache components, and the ban on storing tokens.

Mention that Section 11.5 deliberately stops at an introductory level; its implementation
continues in Chapter 13 so there are not two conflicting explanations.
-->

---

## JSON Serialization: Bridging the String Rule

- `JSON.stringify(data)` — turns an object or array into a JSON string
- `JSON.parse(teks)` — turns a JSON string back into an object or array
- **Serialization** turns data into a string; **deserialization** is the reverse

`storage/notesStorage.js` — saving and reading the notes list

```js
const daftarCatatan = [
  { id: '1', judul: 'Belanja mingguan', isi: 'Beras 5 kg', createdAt: '2026-09-02T08:30:00.000Z' },
  { id: '2', judul: 'Ide tugas akhir', isi: 'Aplikasi presensi', createdAt: '2026-09-02T09:00:00.000Z' },
];

const teks = JSON.stringify(daftarCatatan);
await AsyncStorage.setItem('catatan:v1', teks);
const tersimpan = await AsyncStorage.getItem('catatan:v1');
const daftarLagi = tersimpan === null ? [] : JSON.parse(tersimpan);
```

- The key is given a version suffix (`catatan:v1`) — a good practice called key versioning

<!--
Show that one key holds the whole list: one long JSON string, not one key per note. That is
why the rewrite strategy in Section 11.6 makes sense.

Key versioning is explained as insurance: if the note structure changes, a new key
(`catatan:v2`) is created and migration logic is added, without damaging the old data.

A warning about dates: `createdAt` is stored as an ISO 8601 string because it serializes
safely and sorts automatically in chronological order.
-->

---

## Diagram: JSON Serialization: Bridging the String Rule

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-05.svg)

<!--
Picture only, so the three rules, the code excerpt, and the key-versioning bullet on the
previous slide stay whole. Read it left to right: daftarCatatan is the array in memory;
stringify turns it into a JSON string, one long string that a key can hold; setItem stores
that JSON string in AsyncStorage under the key catatan:v1; and then getItem, JSON.parse, and
you have the array again.

Point at the first and the last chip when you say it: the thing that goes in and the thing
that comes out have the same name, and the JSON string in the middle is the only form
AsyncStorage ever sees. That is why an object sent straight to setItem becomes
[object Object] — the chapter's troubleshooting table comes back to this picture.
-->

---

## Reading Local Data Safely

`storage/notesStorage.js` — three safety layers when reading

```js
export async function muatCatatan() {
  try {
    const teks = await AsyncStorage.getItem('catatan:v1');
    if (teks === null) return [];
    const data = JSON.parse(teks);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Gagal membaca catatan:', error);
    return [];
  }
}
```

- Layer 1: `null` is returned as an empty array `[]`
- Layer 2: a parsing error is caught and logged, and the function still returns `[]`
- Layer 3: the result is checked with `Array.isArray` so an unexpected shape is rejected

<!--
Teach it as a sequence of checks, not as a block to memorize: (1) is there anything in it?
(2) can it be read? (3) is the shape correct?

Stress `console.warn` as a diagnostic trace — Chapter 14 uses the same trace when tracing
app failures.

Misconception warning: a `catch` that swallows an error without a trace is as bad as not
handling the error at all. Always log it, then return a safe default value.
-->

---

<!-- _class: center -->

## What Happens If…?

- The note data is corrupted: it was stored truncated because the process stopped midway
- The app is opened and calls `JSON.parse` straight away without `try/catch`
- What does the user experience, and what should the developer do?

<!--
Give one minute to think, then ask for two answers before moving on. Do not leak the
consequence on this slide; the discussion is on the next one.

Expected answers: `JSON.parse` throws a `SyntaxError`, the app crashes the moment it is
opened, and the user has no way in at all. The fix is not to delete the data, but to catch
the error and use a default value.

Tie it to the earlier Think-Pair-Share: this is one of the causes of the "empty list".
-->

---

## Reading Must Not Crash the App

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-08.svg)

- `JSON.parse` throws a `SyntaxError` if the text is not valid JSON
- Without handling, the app crashes the moment it is opened — the user cannot get in
- Sources of damage: interrupted storage, truncated data, or an old-version structure
- Local data is also deleted when the app is uninstalled or cleared

> Principle: local storage is a source that cannot always be trusted — the app must face it gracefully.

<!--
Stress the principle sentence: the app must withstand its own corrupted data. This is the
difference between an app that runs and an app that is ready for other people to use.

Ask: "If the data is corrupted, is deleting all the user's data a justifiable way out?"
(It can be, but it must be a last resort and the user must be told.)

Warning: with high-value data, losing local data must be answered with a backup or server
synchronization — a problem that reappears in the case study later.
-->

---

## Cache: A Copy So the App Stays Useful

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-09.svg)

**Cache** is a copy of data stored closer to its user so that it can be accessed faster or without the original source.

- Speed: the local copy shows immediately without waiting for a server response
- Quota savings: data that rarely changes is not downloaded over and over

> Trade-off: what is sacrificed is freshness — what is shown may not be the newest.

<!--
Connect it to Chapter 10: the pattern of save on success, read the copy on failure is a
direct continuation of fetch and error handling in the previous chapter.

Ask: "Which app on your phone can still be opened in airplane mode?" (Answer: an app that
stores a copy of its data, not one that always waits for the server.)

Trimmed to the picture (the diagram says this):
- Availability: the app keeps showing data when the network is not available
-->

---

## Three Cache Components

- **Snapshot** — the stored copy of the data returned by an API response
- **Timestamp** — the time of storage, written as an ISO 8601 string
- **TTL** (time to live) — the cache's age limit before it is considered stale
- Firm ban: never cache sensitive data such as tokens

`storage/apiCache.js` — the shape of the cache package (used by `simpanCache` and `ambilCache`)

```js
const paket = {
  data: [],                              // snapshot jawaban API
  timestamp: '2026-09-02T08:30:00.000Z', // kapan disimpan
};
```

<!--
Draw one package on the board: data and time, nothing else. Every cache decision is built
from these two pieces of information.

Ask about the TTL trade-off: "Short or long TTL for a per-semester course list?" (Long,
because the data is stable. For market prices the answer is the opposite.)

Warning: the ban on caching sensitive data sits here so students do not conclude "as long
as there is a TTL it is safe" — TTL governs age, not protection.
-->

---

## Cache Workflow When the Network Fails

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-02.svg)

> A professional app does not silently show stale data: give the marker "Showing saved data (offline mode)".

<!--
Read the diagram as a decision flow: try the server, on success save a copy, on failure
check the cache, and only when the cache is already stale show an error message.

Ask: "On which branch may the app lie a little?" (None. The cache branch must carry an
offline marker so the user knows how reliable the data is.)

**Additional explanation:** this chapter chooses the "TTL passed → error message" branch;
showing stale data with a firmer marker is a design alternative discussed in Analysis
Question 2, not behavior this chapter prescribes.
-->

---

## Cache Module: Save and Check Age

`storage/apiCache.js` — importing `AsyncStorage` as in the previous pattern

```js
export async function simpanCache(nama, data) {
  const paket = { data, timestamp: new Date().toISOString() };
  try {
    await AsyncStorage.setItem(`cache:${nama}`, JSON.stringify(paket));
  } catch (error) {
    console.warn('Gagal menyimpan cache:', error);
  }
}

export function cacheKadaluarsa(paket, batasMs) {
  if (!paket) return true;
  const umur = Date.now() - new Date(paket.timestamp).getTime();
  return umur > batasMs;
}
```

<!--
Stress that the cache name becomes part of the key: one module serves the catalog, the
schedule, and the student list at once without overwriting each other.

Mention that `ambilCache(nama)` follows the same pattern as reading notes — `getItem` and
`JSON.parse` inside `try/catch`, returning `null` on failure.

⚠ version-sensitive: the usage examples in this chapter use a development server address
(10.0.2.2 for the Android emulator); change the address to match your environment and check
the Chapter 10 documentation if the behavior differs.
-->

---

## Do Not Store Tokens in AsyncStorage

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-10.svg)

**Token** is data the server grants after login: a kind of "identity card" that is sent on every subsequent API request (Chapter 10.8).

- Any code running inside the app can read it
- A rooted device (Android) or a jailbroken one (iOS) raises the risk

<!--
Read it as a risk, not as a rule: who can read it, how they would do
it, and what it costs the user.

Ask: "Storing the token in AsyncStorage means the user need not log in again. Is that
convenience worth it?" (No — a hijacked account costs far more than one login.)

Misconception warning: "my app is not important, so it will not be attacked" is the most
often misleading excuse in the practicum.

Trimmed to the picture (the diagram says this):
- AsyncStorage data is not encrypted: its values are stored as plain text
- A stolen token: an attacker can call the API on the user's behalf
-->

---

## Secure Storage: Keychain and Android Keystore

**Secure storage** makes use of the operating system's hardware security: **Keychain** on iOS, **Android Keystore** on Android. The Expo library is `expo-secure-store`, discussed in full in Chapter 13.

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-03.svg)

- Separate by sensitivity; when in doubt, do not store it at all
- The decision about where to store is a security decision, not merely a technical one

<!--
Analogy: AsyncStorage is like an unlocked cupboard inside a room, secure storage is like a
chest whose lock is attached to its hardware.

Stress the last principle: data that is never stored cannot be stolen. This principle is
stronger than any library.

Warning: this chapter only introduces it; the complete login, token, and logout flow is
written in Chapter 13 so students do not merge two explanations of different versions.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 3 — Notes App Project

Section 11.6 · Practicum 11 · Troubleshooting

<!--
This part is the practicum. If this meeting is used to work on the project, just show the
three code slides (notesStorage, list, form) and then accompany students while they retype.

Before the practicum starts, make sure the AsyncStorage library is already installed with
`npx expo install` in each project.
-->

---

## Notes App: What Will Be Built

![w:1030](assets/diagrams/bab-11-penyimpanan-data-lokal-11.svg)

- Add, edit, and delete notes with a confirmation dialog
- Search notes by title or content
- All data is still there after the app is closed and reopened

> Persistence test: close the app completely (or press `r` to reload in Metro), open it again — all notes are still there.

<!--
Stress that the last item is the proof this chapter succeeded. Without a restart test, the
app can look correct only because its data is still in state.

Ask students to prepare evidence for the practicum report: notes before the app is closed
and after it is reopened.

Warning: closing the app with the Home button is not enough as a persistence test — close
its process from the list of running apps.

Trimmed to the picture (the diagram says this):
- The note entity `{ id, judul, isi, createdAt }` following the book's data contract
-->

---

## Notes App Project Structure

| File or folder | Responsibility |
|---|---|
| `app/_layout.js` | Stack navigator with three screens (Chapter 7) |
| `app/index.js` | Route `/`: the notes list |
| `app/catatan/buat.js`, `app/catatan/[id].js` | New note form and edit form |
| `storage/notesStorage.js` | A small API for note storage |
| `screens/DaftarCatatan.js`, `screens/FormCatatan.js` | The list screen and the form screen |
| `utils/formatTanggal.js` | ISO timestamp formatter for display |

> Both routes use the same `FormCatatan` component; add or edit mode is determined by whether an `id` parameter is present.

<!--
Navigation is Chapter 7 material and is not repeated here — just show that the name in
`Stack.Screen` must match the route file name, including the brackets on `[id]`.

Ask: "Why is the storage logic placed in the storage/ folder rather than inside the
screen?" (One change to the data format is enough in one file; the screen stays focused.)

Warning: putting `AsyncStorage.setItem` directly in a screen is a habit that must be
dismantled from this meeting on.
-->

---

## Data Flow: Screen, Small API, Storage

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-04.svg)

> Benefit of the separation: the data structure changes, one file changes; storage logic can be tested without a user interface (Chapter 14).

<!--
The term "small API" is explained here: a set of functions with a single responsibility
that the screen uses without needing to know the storage details.

State the data pattern: every change modifies storage first, then updates state so the
display changes too — save first, display later.

Ask: "If the order is reversed, what is the risk?" (The display shows data that in fact
failed to be saved.)
-->

---

## Small API: Saving and Deleting

`storage/notesStorage.js` — saving (rewrite) and deleting
```js
const KUNCI_CATATAN = 'catatan:v1';
export async function simpanCatatan(daftarCatatan) {
  try {
    await AsyncStorage.setItem(KUNCI_CATATAN, JSON.stringify(daftarCatatan));
  } catch (error) {
    console.warn('Gagal menyimpan catatan:', error);
  }
}
export async function hapusCatatan(id) {
  const daftar = await muatCatatan();
  const tersaring = daftar.filter((catatan) => catatan.id !== id);
  await simpanCatatan(tersaring);
  return tersaring;
}
```

<!--
Explain the rewrite strategy: every change reads the whole list, modifies it in memory,
then saves the whole thing back. For a short list this is simplest; with thousands of rows
you need per-row storage or a database.

Mention that a note's identity is made from `Date.now().toString()` — enough for the
practicum, whereas in production a UUID is better so they do not collide.

Warning: the return value of `hapusCatatan` is deliberately the latest list so the screen
can update its state without reading again.
-->

---

## Notes List: Search and Loading

`screens/DaftarCatatan.js` — the core excerpt

```jsx
const [daftar, setDaftar] = useState([]);
const [kataKunci, setKataKunci] = useState('');

// Muat ulang setiap kali layar kembali mendapat fokus
useFocusEffect(useCallback(() => { muatCatatan().then(setDaftar); }, []));

const daftarTersaring = daftar.filter((catatan) => {
  const kunci = kataKunci.trim().toLowerCase();
  if (kunci === '') return true;
  return catatan.judul.toLowerCase().includes(kunci) ||
         catatan.isi.toLowerCase().includes(kunci);
});
```

- Deleting always goes through an `Alert.alert` confirmation so nothing is deleted by accident
- Tapping the card opens the edit form through `router.push` (Chapter 7)

<!--
Dissect the search: trim the edge spaces, lowercase both sides, then compare with
`includes`. The case where "belanja" does not find "Belanja mingguan" is the next
troubleshooting item.

Stress the separation of touch areas: the Delete button is placed apart from the card's
press area so the two actions do not overlap.

Warning: deleting data always goes through a confirmation — a mistaken delete cannot be
undone because there is no history in simple local storage.
-->

---

## Note Form: One Component, Two Modes

`screens/FormCatatan.js` — the mode is determined by whether the route parameter `id` is present

```jsx
const idCatatan = typeof params.id === 'string' ? params.id : null; // null = tambah

const simpan = async () => {
  const daftar = await muatCatatan();
  const daftarBaru = idCatatan === null
    ? [...daftar, catatanBaru]                                  // mode tambah
    : daftar.map((item) => (item.id === idCatatan               // mode edit
        ? { ...item, judul: judulBersih, isi: isi.trim() } : item));
  await simpanCatatan(daftarBaru);
  router.back();
};
```

- An empty title is rejected through `Alert.alert` before the data is saved
- `keyboardShouldPersistTaps` keeps the Save button active while the keyboard is open

<!--
Compare the two modes in one component: `idCatatan` is null on the `/catatan/buat` route,
and holds an id on the `/catatan/[id]` route.

Ask: "Why not make two separate screen files?" (Because most of the form code is the same;
one component means a validation fix is enough in one place.)

Warning: `useLocalSearchParams` can return an array, so its type is checked with
`typeof params.id === 'string'` — not simply trusted.
-->

---

## When Must Data Be Reloaded?

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-12.svg)

- The list screen stays mounted while the form screen covers it (Stack navigation, Chapter 7)
- `useFocusEffect` re-triggers every time the screen gains focus — exactly what is wanted

> `useCallback` is used so the effect is not recreated on every render.

<!--
This is the classic bug of this chapter; discuss it as a story: the note is saved, but the
screen does not know because it has not been reloaded for a long time.

Analogy: the door of the room stays open, but we no longer look inside. Screen focus is the
moment to take a look.

Misconception warning: the problem is not storage but when the data is read. Students often
blame AsyncStorage when this symptom appears.

Trimmed to the picture (the diagram says this):
- `useEffect` with empty dependencies runs only once when the screen mounts
- As a result a new note does not appear when the user returns from the form
-->

---

## Common Troubleshooting Problems

| Problem | Cause | Solution |
|---|---|---|
| A new note does not appear | Loading happens only once (`useEffect`) | Use `useFocusEffect` |
| `[object Object]` is shown | The object is saved without `JSON.stringify` | Always go through the storage module |
| `Module not found` async-storage | Installed through `npm install` | `npx expo install`, then restart |
| Search does not find it | The comparison is case-sensitive | `.toLowerCase()` and `.trim()` |
| Data feels "lost" | The app was uninstalled or the key differs | one key constant in one module |

<!--
Discuss the first row (five to ten minutes) because it happens most often in the practicum;
the rest students can read themselves while working.

For the "key differs" row, show that the practicum uses one `KUNCI_CATATAN` constant so a
typo in the key name becomes impossible.

Warning: do not patch the symptom by forcing a re-render. Find where the data actually is
first before changing code.
-->

---

## Case Study: Still Working Without Signal

![w:1120](assets/diagrams/bab-11-penyimpanan-data-lokal-13.svg)

<div class="grid2">
<div>

**Problem**

- The catalog cannot be read and orders cannot be recorded while offline

</div>
<div>

**Decision: offline-first**

- The sales token is stored in secure storage, not AsyncStorage

</div>
</div>

> Three trade-offs that must be managed: availability vs consistency · freshness vs reliability · convenience vs security.

<!--
Tell it as a company story, not as a list; the goal is to make students feel that a storage
decision is a product decision.

Mention the conflict that appears during synchronization: a "last writer wins" rule using a
timestamp, or asking the user for confirmation.

The biggest risk of this approach is losing data when the app is uninstalled or the device
breaks — which is why a backup and synchronization strategy must be designed as early as
possible, not added later.

Trimmed to the picture (the diagram says this):
- Sales staff visit areas whose network often disappears
- The catalog is cached with snapshot + timestamp, and still shows offline
- Orders go into a local queue, sent when the connection recovers
-->

---

## Application in IS/IT Practice

| App need | Pattern from this chapter |
|---|---|
| Preferences and settings | `setItem`/`getItem` with the key `preferensi:*` |
| Form drafts that must not be lost | JSON serialization and rewrite storage |
| Schedule and catalog stay readable | Cache snapshot + timestamp + TTL |
| Transaction queue without signal | A local JSON list, synchronized when online |
| User session | Secure storage (Chapter 13), not AsyncStorage |

> The Final Project uses the same patterns: the course list and schedule stay readable even when the campus network is unstable.

<!--
Show that the five rows of this table are five design decisions that will be asked for in
the Final Project, complete with the reasons for choosing them.

Ask: "Which row do campus apps most often ignore?" (Usually the form draft: the user loses
their KRS or registration input because the session is cut off.)

Remind them that local storage does not replace the server: it complements it, with
availability and freshness limits the developer must be aware of.
-->

---

<!-- _class: center -->

## Comprehension Check

- If `{ nama: 'Budi' }` is sent straight to `setItem`, what is stored?
- What is the return value of `getItem` for a key that has never been saved?
- Why may an authentication token not be stored in AsyncStorage?
- What is the role of TTL in the caching pattern?

<!--
Five-minute oral quiz: show the questions, ask the class to answer together or raise hands,
then move to the answer slide. Do not leak the answers on this slide.

If the class's answers vary on the first question, repeat the "strings only" rule before
closing the meeting.
-->

---

<!-- _class: center -->

## Answers

- `[object Object]` — a non-string value must be serialized first
- `null` — not an empty string, so it is checked with `=== null`
- Because it is not encrypted; use secure storage as in Chapter 13
- The cache's age limit before its data is considered stale

<!--
Repeat the two distinctions most often swapped: `null` versus an empty string, and TTL (the
data's age limit) versus timeout (the time limit for waiting for a server).

If many are wrong on the third question, repeat the risk of a rooted device before closing
the meeting.
-->

---

## Summary

1. React state is volatile; data that must survive is put in local storage
2. AsyncStorage: key–value, asynchronous, strings only, persistent, not encrypted
3. Non-string values must go through `JSON.stringify` and `JSON.parse` inside `try/catch`
4. Cache = snapshot + timestamp + TTL; give a marker when the data comes from the cache
5. Tokens go to secure storage; storage logic is separated into a small API module

<!--
Do not read it out. Ask five students to pick one number and explain it in their own
sentence; an item that cannot be explained is an item that must be repeated.

Closing message: a good app is not one that never fails, but one that is still useful when
it fails — it does not lose data, and it is honest about the freshness of its data.
-->

---

## Exercises and Class Discussion

<div class="grid2">
<div>

**Exercises (from the chapter)**

- Add a persistent note counter
- Mark important notes with the key version `catatan:v2`

</div>
<div>

**Class discussion**

- Have you ever lost a draft because the app closed?
- Which feature in your daily app proves that a cache exists?
- How do you make being safe a habit from the start, not after it is used?

</div>
</div>

<!--
Three-minute think-pair-share for the discussion questions, then collect two to three
answers. Do not judge right or wrong; judge the ability to give a reason.

The first and second exercises are assessed on understanding key versioning and handling
old data that must stay readable. Other challenges (an archive feature, simple
synchronization) are in the chapter.

What is assessed in the discussion: the awareness that a storage decision is a product
design decision, not merely a library choice.
-->

---

## References

| Source | Link |
|---|---|
| Expo documentation (2026) | docs.expo.dev |
| React Native documentation (2026) | reactnative.dev |
| MDN Web Docs — JavaScript (2026) | developer.mozilla.org |
| AsyncStorage library documentation | the library's official documentation |

<div class="grid2">
<div>

**Further reading**

- Chapter 12 — Accessing Device Features (files and media)
- Chapter 13 — Authentication and Security (secure storage)

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the glossary of terms in Appendix C contains
entries for AsyncStorage, JSON, and Secure Storage along with their term equivalents.

⚠ version-sensitive: the AsyncStorage library documentation can change between versions —
including the data size limit and the behavior on the web platform. Always check the
library's official documentation page, not a blog or an old forum answer.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Towards Chapter 12

**Practicum:** build the Notes App (add, edit, delete, search) and prove that its data survives after the app is restarted.

Next meeting: accessing device features — camera, location, and notifications.

<!--
Close with one sentence: "Today our app learned to remember; next meeting it learns to see
and feel."

State the practicum report submission deadline explicitly and its assessment aspects: see
Appendix A — the practicum rubric (conceptual understanding 15%, implementation 25%, code
quality 15%, UI/UX 15%, debugging 10%, documentation 20%).
-->
