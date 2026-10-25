---
marp: true
theme: academic
paginate: true
title: "Chapter 12 — Accessing Device Features"
description: "Mobile Programming lecture, meeting 13: device APIs and runtime permissions, config plugins, camera and image picker, location and accuracy, local notifications, the file system, device info, data privacy, and the Student Profile App."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 12 — Accessing Device Features"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 12 — Accessing Device Features

Camera, location, notifications, and permissions · Meeting 13

<!--
Open with one hook sentence: "Today our app starts touching the real world —
the camera, location lock, and your phone's notification drawer."

Opening question, without correcting yet: "Name the permissions the campus app asks
for on your phone." Collect two or three answers as material for Section 12.1.
-->

---

## Learning Objectives

- Explain device APIs and the Android and iOS runtime permission model
- Identify the role of six Expo packages for device features
- Implement permission requests and the handling of their denial
- Capture photos and read coordinates together with their accuracy values
- Analyze device data privacy and build the Student Profile App

<!--
Read out only the verbs. Stress that the fifth objective is the one assessed in the
practicum: the app must keep working when permission is denied, not only when it is
granted.

Tie it to the RPS: this meeting maps Sub-CPMK 6.2 to the Student Profile App outcome,
and its assessment follows the practicum rubric (Appendix A).
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Device APIs and Permissions

Section 12.1 · Config plugin declaration · Runtime permission request

<!--
This part is the foundation of the chapter. If meeting time is tight, Section 12.5 is
the one that may move to the next meeting, but 12.1 may not be condensed.

Remind them that this part also applies to any package they will use after graduating —
the permission pattern is the same across the whole mobile ecosystem.
-->

---

## What Is a Device API?

A **device API** is an interface provided by the operating system so that a program can command the hardware or system services.

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-02.svg)

> React Native only bridges: you write JavaScript, the native part is done by an Expo package.

<!--
Analogy: an Expo package is like a receptionist who handles the permits; you just fill
in a form, without needing to talk to the security officer directly.

Stress that the "native" part of React Native is its user interface (Chapter 1),
whereas here what is wrapped is the hardware capability.

Guiding question: "Why must the result come back to JavaScript?" (Answer: because all
display and storage decisions live in our JavaScript code.)
-->

---

## Sandbox: Why Permissions Exist

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-05.svg)

- Android has used this model since version 6 (Marshmallow), and so has iOS
- iOS requires a **usage description** in `Info.plist`; without it the app stops

<!--
Trimmed to the picture (the diagram says this):
- Without permissions, any app could photograph you without your knowledge
- A **sandbox** confines each app to its own separate space
- A **runtime permission** is requested while the app is running

The picture's left panel is the counterfactual and its right panel is the two mechanisms
that answer it, so the three bullets that stated them one after another moved here. The
slide keeps the platform pair — Android's version-6 model and iOS's usage description —
because the picture does not show them.

Stress the Android and iOS difference here: Android shows a system dialog, whereas
iOS requires the reason text in Info.plist — and if that text is missing, the iOS app
stops immediately (crashes), not merely refuses the feature.

This is the most common misunderstanding: students conclude "permission denied" when
the app actually crashed because the usage description was not declared.

Ask: "Who can turn on your phone's camera without you knowing?"
(Answer: supposedly no one, because of the sandbox and permissions.)
-->

---

## Two Layers of Permission

| Layer | When it happens | Who does it |
|---|---|---|
| `plugins` declaration | At build time | Config plugin in `app.json` |
| iOS declaration | At build time | `NS…UsageDescription` keys in `Info.plist` |
| Android declaration | At build time | Entries in `AndroidManifest.xml` |
| Check | Before the feature is used | `getPermissionsAsync()` |
| Request | While the app is running | `requestPermissionsAsync()` |

> In Expo Go, most permissions are already declared by Expo Go; the `plugins` list must still be written for a standalone build.

<!--
Compare the first two rows of the table with the last three: the first rows deal with
configuration files, the last rows deal with the user.

The practical consequence to remember: a quick test in Expo Go will not reveal config
plugin mistakes, so those mistakes only appear at build time (Chapter 15).

Ask: "If the permission is already declared, does the user grant it automatically?"
(Answer: no — the declaration only prepares the gate.)
-->

---

## Config Plugin: Declaring Permissions

`app.json` (excerpt of the `plugins` block)

```json
"plugins": [
  ["expo-image-picker", {
    "photosPermission": "Aplikasi membutuhkan akses galeri untuk memilih foto profil.",
    "cameraPermission": "Aplikasi membutuhkan akses kamera untuk mengambil foto profil."
  }],
  ["expo-location", {
    "locationWhenInUsePermission": "Aplikasi membutuhkan lokasi Anda untuk mengisi data profil."
  }],
  "expo-notifications"
]
```

> Permission texts are written in Indonesian and explain their purpose — part of good privacy practice.

<!--
Show the structure, not the characters: the first and second entries are arrays
because they have options, whereas expo-notifications is enough as a string.

At prebuild or EAS Build, Expo injects the photosPermission value as the
NSPhotoLibraryUsageDescription key in Info.plist and adds the permissions to AndroidManifest.xml.

⚠ version-sensitive: config plugin option names follow the SDK version — check the official
docs.expo.dev documentation for a package's option list before running a build.
-->

---

## Permission Request Flow

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-03.svg)

> This "check first, request if needed" pattern is used repeatedly throughout the chapter.

<!--
Walk through this chart with the class, node by node, with one real scenario:
the "Take Photo" button pressed for the second time.

Stress that there are three exits, not two: granted, denied temporarily, and
denied permanently. The third exit is the one students forget most often.

Misconception warning: `getPermissionsAsync()` will not bring up any dialog — it only
reads the status.
-->

---

## Permission Pattern in Code

`utils/polaIzin.js` — the "check first, request if needed" pattern

```js
import * as ImagePicker from 'expo-image-picker';

export async function pastikanIzinGaleri() {
  const statusSekarang = await ImagePicker.getPermissionsAsync();
  if (statusSekarang.granted) {
    return true;
  }
  const hasilPermintaan = await ImagePicker.requestPermissionsAsync();
  return hasilPermintaan.granted;
}
```

> This function applies the same pattern for every package: check the status, request if needed, return the result.

<!--
Read it as a decision flow, not as syntax: permission already there, then approved
directly without a dialog; not there yet, the system shows the dialog once.

The function deliberately returns a boolean so the calling screen does not need to know
the details of the PermissionResponse object.

Ask: "Why check first instead of requesting straight away?" (Answer: so the user is not
disturbed by repeated dialogs every time the feature is used.)
-->

---

## Reading the Permission Result

| Property | Meaning |
|---|---|
| `granted` | Whether permission is given or not (boolean) |
| `status` | `granted`, `denied`, or `undetermined` |
| `canAskAgain` | Whether it can still be requested, or the user has chosen "don't ask again" |

> These three values determine the decision on the screen: use the feature, ask once more, or send the user to Settings via `Linking.openSettings()`.

<!--
Stress that permission status is not two states but three — and the third demands a
different screen design.

Tie it to a professional habit: read the contents of the API result object before
deciding, not just check a single property.

Ask: "What should the app do when canAskAgain is false and we still call
requestPermissionsAsync?" (Answer: the dialog no longer appears; the function
returns a denied status immediately.)
-->

---

<!-- _class: center -->

## What Happens If…?

**What happens if** an app requests five permissions at once the first time it is opened, and the user then chooses "don't ask again" for the camera?

- What does the user see in the first second of using the app?
- What can the app still do after that?
- How should the permission requests be rearranged?

<!--
Give 3 minutes in pairs. Expected answer: the user is confused because they do not
know the context, the refusal rate rises including permanent denials, and the app
can no longer bring up the dialog so it must provide a route to Settings.

If answers stop at "the user refuses", push to the third question — the part assessed
in the Analysis Question of Section 12.6.
-->

---

## Handling Denial as a Normal State

| State | What appears | App action |
|---|---|---|
| Already granted | No dialog | Use the feature directly |
| Denied temporarily | System dialog once | Explain the reason, ask again when needed |
| Denied permanently | Dialog no longer appears | Show an explanation and an "Open Settings" button |

- Permission is not permanent — the user can revoke it at any time
- Request permission when it is needed, not all at once when the app opens
- Recheck the permission before using a sensitive feature

<!--
This slide is the answer to the question on the previous slide. Stress the last row of
the table: the only route is to send the user there manually, so the app must explain
first why that permission is needed.

Analogy: like a door locked from the inside — knocking many times does not help, you
have to ask the owner to open it.

Misconception warning: showing a "permission denied" message with no way out is the
same as leaving the app dead-ended.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Camera, Location, Notifications, Files

Section 12.2 Camera and Gallery · 12.3 Location · 12.4 Notifications · 12.5 Files and Device

<!--
This part is practical and dense: four Expo packages. If little time remains, do
Section 12.2 and 12.3 in class, then 12.4 and 12.5 as an independent practicum.

Remind them that every package is installed with npx expo install, not npm install, so
that the versions match SDK 57.
-->

---

## Two Packages for the Camera

| Aspect | `expo-camera` | `expo-image-picker` |
|---|---|---|
| View | Live preview through `<CameraView>` | The system's built-in camera interface |
| Flow | Permission, preview, and shutter button managed by you | `launchCameraAsync()` handles everything |
| Result | Full control over the shot and its processing | One image file as a `uri` |
| Suits | QR code scanners, filters, face detection | Profile photos, payment proof, attachments |

> Choose `expo-image-picker` when the end result is "just one image file"; choose `expo-camera` when the app must show or process the shot live.

<!--
Stress that for a "take one photo then show it" need, expo-camera is actually
overkill — students tend to choose the most capable package, when the right size
matters more than completeness.

Tie it to the trade-off analysis of Chapter 1: the package decision is a trade-off
between control and simplicity.

⚠ version-sensitive: the CameraView component replaces the old Camera component, which is
no longer recommended; check the latest official expo-camera documentation.
-->

---

## Think-Pair-Share: Choosing a Package

- A student profile photo for the campus app
- A QR code scanner on an exam card
- A camera filter that must look real-time

**Task:** decide the package for each scenario and state the reason.

<!--
2 minutes in pairs, then collect 2 to 3 answers. Expected answer:
image-picker for the profile photo; expo-camera for the other two scenarios because both
need a live shot.

Judge the reasoning, not the answer: a student who says "because the end result is only
one image file" already understands Section 12.2.
-->

---

## expo-camera: Live Preview

`screens/LayarKamera.js` — a camera with its own permission handling

```js
import { CameraView, useCameraPermissions } from 'expo-camera';
export default function LayarKamera() {
  const [izin, mintaIzin] = useCameraPermissions();
  if (!izin || !izin.granted) {
    return (
      <View style={styles.halaman}>
        <Pressable style={styles.tombol} onPress={mintaIzin}>
          <Text style={styles.teksTombol}>Berikan Izin</Text>
        </Pressable>
      </View>
    );
  }
  return <CameraView style={styles.halaman} facing="back" />;
}
```

> The complete code with `StyleSheet` is in the chapter; here only the decision part.

<!--
Point out just three things: the useCameraPermissions hook returns a pair of status and
request function, the if branch decides what is drawn, and CameraView is the component
that shows the shot.

Note that permission is requested when the screen opens, not when the app starts — this
is the "request permission when needed" application from Section 12.1.

Warning: some lines are simplified for the slide; students copy the complete version
from the chapter so that styles and the Text/View/Pressable components are defined too.
-->

---

## expo-image-picker: One Call and Done

`screens/ProfilMahasiswa.js` — take a photo from the system camera

```js
async function ambilFotoDariKamera() {
  const izin = await ImagePicker.requestCameraPermissionsAsync();
  if (!izin.granted) {
    Alert.alert('Izin Ditolak', 'Aplikasi tidak dapat menggunakan kamera tanpa izin Anda.');
    return;
  }
  const hasil = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.6,
  });
  if (!hasil.canceled) setFotoUri(hasil.assets[0].uri);
}
```

- The result is an object: `canceled` marks a cancellation, `assets[0].uri` holds the image address
- `allowsEditing: true` with `aspect: [1, 1]` crops the photo into a square
- `uri` points to a temporary file in the system cache, not a permanent file

<!--
Compare the length of this code with expo-camera on the previous slide — the difference
is that the whole camera interface is handed over to the system.

Stress testing `!hasil.canceled` before accessing assets: if the user presses
cancel, assets is empty and accessing it directly raises an error.

⚠ version-sensitive: since a newer SDK the mediaTypes option is written as an array of
strings, for example ['images'], replacing the old MediaTypeOptions constants.
-->

---

## Location: Two Sources of Position

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-06.svg)

- **GPS (Global Positioning System)** computes a position from satellite signals
- Most accurate in open areas; indoors it often misses by hundreds of meters
- Network-based position (Wi-Fi and cell towers) is faster, less precise
- `expo-location` unites both sources and returns coordinates

The app only has to choose the accuracy level it needs, then accept the coordinates.

<!--
Analogy: GPS is like measuring with a long ruler from the sky, whereas a network-based
position is like guessing from the nearest neighbor — faster, less exact.

Ask: "Why may an attendance app not use Balanced accuracy?" (Answer: its uncertainty
radius is too large to confirm that a student is really in the classroom.)

Mention once that background location permission exists, is stricter, and is not covered
in this book so that students do not use it without grounds.
-->

---

## Reading Coordinates and Accuracy

`utils/ambilLokasi.js` — the body of the `ambilKoordinat()` function

```js
const izin = await Location.requestForegroundPermissionsAsync();
if (!izin.granted) {
  return null;
}
const posisi = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});
return {
  latitude: posisi.coords.latitude,
  longitude: posisi.coords.longitude,
  akurasi: posisi.coords.accuracy,
  waktu: new Date(posisi.timestamp).toLocaleString('id-ID'),
};
```

> Permission, retrieval, then returning a compact object — the same pattern as `pastikanIzinGaleri`.

<!--
Note the order: permission first, then read the position. If permission is denied, the
function returns null and the screen decides for itself what is displayed.

Stress the name requestForegroundPermissionsAsync: "foreground" means the location is only
read while the app is open on screen.

Ask: "Why does this function return null instead of showing an error message?"
(Answer: so that the view layer decides the message — separation of responsibility.)
-->

---

## Choosing an Accuracy Level

| Value | Approximate precision | Suits |
|---|---|---|
| `Lowest` | Coarsest, easy on the battery | Merely knowing the region |
| `Balanced` | Around 100 meters | Showing profile coordinates |
| `High` | Around 10 meters | Attendance that needs precision |

- `accuracy` is the estimated uncertainty radius in meters, not an exact point
- Show the accuracy value together with the coordinates — coordinates without accuracy mislead

<!--
Stress the number 35 in the "+/- 35 meters" message: it means the actual position is
somewhere inside a circle 70 meters across, not exactly at that point.

This is the biggest misunderstanding in attendance apps: coordinates are treated as an
exact point, when they are the center of an uncertainty circle.

Ask: "Why can showing coordinates with five decimal places without accuracy
mislead?" (Answer: the decimal places give an impression of precision that the data does
not have.)
-->

---

## Notifications: Local vs Remote Push

| Aspect | Local notification | Remote push notification |
|---|---|---|
| Sender | The device itself | A sending server |
| Network | Does not need a network | Needs a push service |
| Example | A class schedule reminder | A new-grade notice |
| Handling | `expo-notifications` | Expo Push Service, FCM (Android), APNs (iOS) |

> Push notifications cannot be handled by `expo-notifications` alone; this chapter only covers local notifications.

<!--
Stress why notifications exist: the app is not always open when an important moment
happens, so reminders move up to the operating-system level.

A misconception that often appears in the practicum: students think
scheduleNotificationAsync can send a message to another student's phone. Push needs a
sending server (Expo Push Service/FCM/APNs) and cannot be handled by expo-notifications
alone — outside this chapter's scope; tie it to the API pattern in Chapter 10 when
students ask further.

Ask: "If the device has no internet, which notification still appears?"
(Answer: the local notification.)
-->

---

## Notification Channels and Permission on Android

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-07.svg)

`utils/kirimNotifikasi.js` — the first step, creating a channel

```js
await Notifications.setNotificationChannelAsync('pengingat-kuliah', {
  name: 'Pengingat Kuliah',
  importance: Notifications.AndroidImportance.DEFAULT,
});
```

- The user sets the sound and interruption level per channel
- On Android 13 and above the notification permission is asked explicitly; older versions grant it directly

<!--
Trimmed to the picture (the diagram says this):
- A **notification channel** groups notifications by type
- Without a channel, notifications may be dropped by the system on Android

The two panels are this pair: left is the requirement (a notification outside a channel
may be discarded), right is the mechanism (a channel groups notifications by type, which
is what makes them controllable). The two bullets that stayed are the facts the picture
does not show — what the user does per channel (sound and interruption level), and the
separate Android 13 permission gate.

Channel analogy: like email folders — the user can mute one folder without turning off
all of the app's notifications.

Stress that a channel is a requirement on Android, not a style choice: a notification
without a channel may be discarded by the system, and the symptom is confusing because
the scheduling looks successful.

Tie it to the Troubleshooting section of the chapter: a notification that "does not appear"
usually comes down to the channel not being created or the permission being denied, not to
the scheduling.
-->

---

## Scheduling a Local Notification

`utils/kirimNotifikasi.js` — the second and third steps

```js
const izin = await Notifications.requestPermissionsAsync();
if (!izin.granted) {
  return false;
}
await Notifications.scheduleNotificationAsync({
  content: { title: judulPesan, body: isiPesan },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: detik,
    channelId: 'pengingat-kuliah',
  },
});
return true;
```

> The `false` return value tells the screen that the user refused the notification.

<!--
Read out its three parts: the permission request, the message content, and the trigger.
Explain that TIME_INTERVAL means "appear after N seconds", not a particular time of day.

⚠ version-sensitive: the named-type trigger shape was introduced in a newer SDK;
on older versions trigger: { seconds: 5 } was enough. Check the official
expo-notifications documentation for the current shape before copying.

Question: "Why does the function return a boolean instead of showing a message directly?"
(Answer: so that the screen decides the feedback.)
-->

---

## File System: The App's Private Directory

`utils/catatanBerkas.js` — the object-oriented `File` and `Paths` API

```js
import { File, Paths } from 'expo-file-system';

export async function simpanCatatan(isian) {
  const berkas = new File(Paths.document, 'catatan-saya.txt');
  await berkas.write(isian);
  return berkas.uri;
}
export async function bacaCatatan() {
  const berkas = new File(Paths.document, 'catatan-saya.txt');
  if (!berkas.exists) return '';
  return await berkas.text();
}
```

- `Paths.document` for permanent files; the cache directory may be cleaned by the system
- These operations need no permission because the directory is private to the app
- Copy the image picker's `uri` into `Paths.document` so the photo survives

<!--
File-sandbox analogy: like a locked private cabinet in your own house — the app comes and
goes freely without permission, but other apps cannot open it.

Stress the difference between the two directories: documentDirectory persists, cacheDirectory
may be cleaned by the system at any time. This is the root of the disappearing profile photo.

⚠ version-sensitive: the File and Paths API replace older functions such as writeAsStringAsync;
check the official expo-file-system documentation for the current shape.
-->

---

## Device Info with expo-device

| Property | Content |
|---|---|
| `deviceName` | Device name |
| `modelName` | Model, for example "Pixel 7" |
| `osName` and `osVersion` | Operating system and its version |
| `isDevice` | Distinguishes a physical device from an emulator |

- Useful for adapting the display and refusing certain features on an emulator
- ⚠ This data combination can be used for **fingerprinting** (unique user identification)
- In practice it is subject to the data minimization principle in Section 12.6

<!--
Connect isDevice with the attendance app: the server can reject attendance from an
emulator, and this is the data used to decide that.

Stress that device data is not neutral technical data: the combination can point to one
person uniquely, so it becomes a privacy matter.

Ask: "Does our student profile app really need every device property?"
(Answer: no — only what is shown on screen.)
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 3 — Privacy and Mini Project

Section 12.6 Security and Privacy · 12.7 Student Profile App

<!--
This part is the differentiator between a student who can write code and a future systems
analyst: anyone can call the camera, but not everyone thinks about the consequences.

If meeting time is nearly up, do 12.6 in class (discussion) and 12.7 as an independent
practicum with a report.
-->

---

## Three Principles of Device Data Privacy

1. **Request permission with an explanation (informed consent)** — explain "what for" it will be used
2. **Do not upload without consent** — only on an explicit user action
3. **Minimize data (data minimization)** — take as little as still works

- AsyncStorage is not a place for sensitive data; tokens are stored in `expo-secure-store` (Chapter 13)

> "Data that is never collected is data that cannot leak."

<!--
Explain each principle with one wrong and one right example: the permission "read
location" versus "location for filling in the profile address".

Stress the third principle as the most practical: coarse accuracy when it is enough, store
the last coordinate rather than a movement track, one image rather than the whole gallery.

Ask: "Why must a published app have a privacy policy?"
(Answer: Google Play and the App Store require it, and users read them more and more.)
-->

---

## Mini Project: Student Profile App

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-04.svg)

- Four data groups: academic, photo, location, and device information
- File structure: `app/(tabs)/profil/index.js`, `utils/polaIzin.js`, `api/presensi.js`
- Proof of success: close the app, open it again, all the data is still shown

<!--
Show the pattern that repeats in every branch: request permission, use the feature, save
the result. This is the pattern that will keep being used in real apps.

Stress that the architecture is deliberately simple — one screen, the storage logic split
into utils, and the small InfoBaris component reused (the component exercise from Chapter 5).

Guiding question: "What happens if data restoration runs on every render rather
than once in useEffect?" (Answer: the stored data overwrites the user's input.)
-->

---

## Profile Save and Load Pattern

`kode/bab-11-penyimpanan-data-lokal/utils/cache.js` — the AsyncStorage wrapper taught in Chapter 11 (snapshot + timestamp)

```js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KUNCI_PROFIL = 'profil-mahasiswa';
export async function simpanProfil(profil) {
  const teksJson = JSON.stringify(profil);
  await AsyncStorage.setItem(KUNCI_PROFIL, teksJson);
}
export async function muatProfil() {
  const teksJson = await AsyncStorage.getItem(KUNCI_PROFIL);
  if (!teksJson) {
    return null;
  }
  return JSON.parse(teksJson);
}
```

> The screen does not need to know the key name or the details of JSON serialization — the same pattern as Chapter 11.

<!--
Stress the separation of responsibility: the screen handles the display, this file
handles storage. If storage moves to a server one day, only this file changes.

Remind them of the restore pattern on the screen: the muatProfil result is tested with if,
then each state is filled with a default value such as || '' so that the screen never
receives undefined.

Warning: an old profile object without a location must still load — this is why those
default values matter.
-->

---

<!-- _class: center -->

## Mini Quiz

- What are the two layers of permission handling in an Expo project?
- Which package is right for scanning a QR code?
- What does `accuracy: 35` mean in a location reading?
- Why is the image picker's `uri` unsafe for long-term storage?
- What is the difference between a local notification and a remote push notification?

<!--
Five-minute oral quiz: show the questions, ask the class to answer together or raise
hands, then move to the answer slide. Do not leak the answers on this slide.

If the class's answers vary on the third question, repeat the explanation of the
uncertainty circle before closing the meeting.
-->

---

<!-- _class: center -->

## Answers

- Declaration through `plugins` in `app.json`, and the request while the app is running
- `expo-camera` — the app must show and process the shot live
- An estimated uncertainty radius of about 35 meters from the actual position
- The file is temporary in the system cache and may be cleaned at any time
- Push is sent by a sending server; local is scheduled by the device itself

<!--
Repeat the distinction most often mixed up: accuracy is an uncertainty radius, not a
speed level or a number of satellites.

If many missed the first question, repeat the two-layer permission table before
closing the meeting.
-->

---

## Case Study: Photo and Location Attendance

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-08.svg)

| What the server checks | Device feature used |
|---|---|
| The photo is taken within the session time window | Camera or gallery (Section 12.2) |
| The coordinates are within a 100-meter radius of the building | Location at `High` accuracy (Section 12.3) |
| No two attendances come from the same device | Device info (Section 12.5) |

- The class session reminder is sent through a local notification (Section 12.4)
- As a result, the practice of having someone else sign the attendance sheet in person becomes far harder

<!--
Tell it as a real problem: a signed attendance sheet can be signed for someone else, so
its academic integrity is weak. Device features close that gap.

Stress the 100-meter radius figure: that value demands High accuracy, not Balanced —
this is why Section 12.3 discusses accuracy in such detail.

Mention once that this case study is a candidate attendance module for the Mobile
Academic Information System in the Final Project.
-->

---

## The Other Side: The Attendance Data Privacy Dilemma

![w:1120](assets/diagrams/bab-12-mengakses-fitur-perangkat-09.svg)

- Risk-limiting practices: honest permission, data minimization, upload on user action
- A check-in point coordinate is enough, not a location track recorded continuously
- Limit the data retention period according to campus policy

> Without these practices, a solution meant to protect academic integrity turns into a surveillance tool that creates new problems.

<!--
Trimmed to the picture (the diagram says this):
- Attendance data combines a student's face, location, and presence time
- From those three points, a picture of "where and when" someone was can be reconstructed

The flow is those two bullets in one direction: the three fields, the reconstruction they
allow, and — labelled with the blockquote's own condition — what that becomes when the
practices are missing. The three bullets that stayed are the counter-measures, which the
picture has nowhere to put and which are the answer the slide exists to give.

The most important slide for Information Systems students. Stress that the same
technology can be a solution or a problem, depending on its design decisions.

Give a concrete example: storing a coordinate history every five minutes has a very
different consequence from storing one coordinate when the attendance button is pressed.

Ask: "If you were the systems analyst, what requirements would you put to a vendor before
student data is handed over?" This is the trigger for the closing discussion.
-->

---

## Summary (1/2)

1. Device APIs are bridged by Expo packages; the sandbox and permissions protect the user
2. Permissions are handled in two layers: `plugins` in `app.json` and the request at runtime
3. Denial is a normal state; send the user to Settings when `canAskAgain` is false
4. `expo-image-picker` for one photo, `expo-camera` for a live shot

<!--
Do not read it out. Ask students to pick one number and explain it in their own words —
this works better than repeating the reading.

If little time remains, prioritize numbers 2 and 3 because both appear most often
in exam questions and are most often practiced wrongly.
-->

---

## Summary (2/2)

1. Location always comes with accuracy; choose the lowest accuracy that still meets the need
2. Local notifications are scheduled on the device; push needs a sending server
3. Copy the file from the image picker so that it becomes permanent; AsyncStorage is only for text
4. Privacy principles: explained permission, no silent uploads, data minimization

<!--
Repeat number 3 because this is the mistake that appears most often in the practicum:
students save the temporary uri into AsyncStorage, then lose the photo after
a few days.

The closing message of this part: the ability to call device features is easy to learn,
the policy for using them is what sets a professional developer apart.
-->

---

## Discussion and Exercises

<div class="grid2">
<div>

**Class discussion**

- Have you ever refused an app's permission? What was the reason?
- What criteria would you set for an attendance app vendor?

</div>
<div>

**Exercises**

- Show the place name with `reverseGeocodeAsync()`
- Send an automatic notification after the profile is saved
- Add a "Delete Profile" button

</div>
</div>

<!--
Give 3 minutes in pairs for the first question, then collect 2 to 3 answers.
A strong answer mentions an unclear request context and a feeling of discomfort.

For the vendor criteria, point to four things: what data is collected, how long it is
stored, who can access it, and how the data is deleted.
-->

---

## References

| Source | Link |
|---|---|
| Expo documentation (2026) | docs.expo.dev |
| Expo SDK: ImagePicker, Location, Notifications (2026) | docs.expo.dev |
| React Native documentation (2026) | reactnative.dev |
| React documentation (2026) | react.dev |
| MDN Web Docs: JavaScript (2026) | developer.mozilla.org |

<div class="grid2">
<div>

**Related chapters**

- Chapter 11 — AsyncStorage and JSON serialization
- Chapter 13 — tokens and `expo-secure-store`

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the glossary of terms such as permission and
secure storage is in Appendix C.

Remind them that the SDK documentation depends heavily on the version — always match it to
the SDK 57 used in this book, and watch for the ⚠ version-sensitive markers in the chapter.

The SDK pages students should open: ImagePicker, Location, Notifications,
FileSystem, and Device in the Expo documentation; all of them live under docs.expo.dev.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 13

**Practicum:** build the Student Profile App until the photo, location, and device info are still shown after the app is reopened.

Next meeting: Chapter 13 — App Authentication and Security (Meeting 14).

<!--
Close with one sentence: "This chapter made the app borrow the phone's eyes and ears;
the next chapter makes it confirm who is currently using it."

State the Chapter 12 Practicum deadline explicitly and remind them of the practicum
rubric (Appendix A): conceptual understanding 15%, implementation 25%, code quality 15%,
UI/UX 15%, debugging 10%, documentation 20%.

Leave one preparation task: students bring notes on which permissions their campus app
asks for, to discuss at the start of Chapter 13.
-->
