---
marp: true
theme: academic
paginate: true
title: "Chapter 15 — Build and Deployment"
description: "Mobile Programming lecture, meeting 15: development build vs production build, EAS Build and its three profiles, APK vs AAB, app.json configuration, the EXPO_PUBLIC_ environment variable, signing, and distribution to Google Play and the App Store."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 15 — Build and Deployment"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 15 — Build and Deployment

From code to the app store · Meeting 15

<!--
Open with a hook: "Throughout Chapters 1 to 14 we only ever ran the app on our own
emulator. Today we produce a file that anyone can install."

Opening question: "What do you do when a friend asks to try your app?" Collect 2-3
answers and do not correct them yet, because those answers will be compared with the
official release track at the end of the meeting.

Mention that this meeting is combined with Chapter 14 and assessed through Assignment 3:
the QA report and the build report.
-->

---

## Learning Objectives (1/2)

- Distinguish development builds from production builds, then decide when to use each
- Explain the role of EAS Build and its three build profiles along with their products (APK/AAB)
- Configure `app.json`: name, slug, application ID, version, icon, splash screen

<!--
Read out only the verbs, then stress the third objective: app.json is the app's "birth
certificate", read by the app store and the build service.

Ask: "How many wrong values in app.json does it take to fail a build?" (Answer: one is
enough — a wrong icon path or a plugin that is not configured.)

Objectives 1 and 3 are the most likely to appear in the final exam; mention that both are
based on comparison, not memorization.
-->

---

## Learning Objectives (2/2)

- Analyze the role of the `EXPO_PUBLIC_` environment variable and its limits regarding secrets
- Identify the concept of signing and the risk of losing the signing key
- Design a Google Play distribution strategy and understand the App Store flow

<!--
The fourth objective is the most often underestimated: students imagine an environment
variable is the same as "hiding a secret". Warn them from the start that a value prefixed
with EXPO_PUBLIC_ is in fact embedded inside the app bundle.

Ask: "If it is not for secrets, then what is this environment variable for?" (Answer:
separating the server address per environment without changing the code.)

Objectives five and six are conceptual; this meeting's practicum only goes as far as the
Android build, so for the iOS flow it is enough to understand the order.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — From Code to an Installable File

Section 15.1 build types · 15.2 EAS Build · 15.3 APK & AAB · 15.4 iOS

<!--
This part covers the first phase: how code becomes an installable file. Allow about 35
minutes.

Section 15.4 (iOS) is conceptual and not practised; if time is tight, that part may be
read out briefly without losing the practicum skills.
-->

---

## What Is a Build?

![w:1120](assets/diagrams/bab-15-build-dan-deployment-07.svg)

**Build** is the end result of the compilation process: JavaScript code, assets, and native configuration are assembled into one installable file.

<div class="grid2">
<div>

**What happens during a build**

- Metro produces the JavaScript bundle (Chapter 2)
- The result is one file that can be installed

</div>
<div>

**What is not a build**

- Not `npx expo start`: that is a development server
- Not Expo Go: that is Expo's own wrapper app

</div>
</div>

<!--
Trimmed to the picture (the diagram says this):
- The bundle is combined with the Android/iOS native shell

Analogy: a build is like cooking food to take away, no longer tasting in the developer's
kitchen. So far students have only tasted in the kitchen.

Demonstration: mention the Metro that has been serving the bundle through npx expo start.
Guiding question: "If Metro stops, what happens to an app from a production build?"
(Answer: it keeps running, because the bundle is stored inside the app.)

The most common misconception: thinking Expo Go is the build result of their own project.
Make clear that Expo Go is Expo's app, which runs a bundle from a development server.
-->

---

## Development Build vs Production Build

| Criterion | Development build | Production build |
|---|---|---|
| Iteration speed | Fast, changes appear immediately (Fast Refresh) | Created only when about to be released or tested |
| Bundle source | Loaded from Metro on the developer's computer | Stored inside the app, without Metro |
| Debugging | Rich error messages, connected to DevTools (Chapter 14) | Minified; debugging tools are not included |
| Size and speed | Large files and slower | Smaller, faster, assets optimized |
| When to use | Every day by developers and testers | When releasing, testing, or sharing with a limited group |

<!--
Compare column by column, not row by row; the last row is the conclusion.

Stress that this trade-off is deliberate: ease of debugging is sacrificed for size,
speed, and security. End users never need to read internal error messages.

Question: "Why does a production build not include debugging tools?" (Answer: end users
do not need them, and including them makes the file bigger and slows startup.)

Misconception: thinking a production build is "another version" of the app. Both are
products of the same build process, only with different purposes.

Signing is deliberately not made a row of this table: the source chapter (15.1) only
mentions that a production build is signed as proof of authenticity, and does not compare
the signing status of the two build types — the concept is discussed separately in section
15.7 (slide 24).
-->

---

## EAS Build: Heavy Lifting in the Cloud

![w:1120](assets/diagrams/bab-15-build-dan-deployment-01.svg)

- **EAS** — a cloud service from Expo for building, signing, and submitting apps
- An Android build needs the Android SDK, JDK, and Gradle; iOS needs macOS and Xcode
- Expo's server does the compiling; you just send the project code
- The output is a download link and a QR code that appear in the terminal
- A build can also run on a local machine, but EAS is what prepares it

<!--
Stress the practical reason for students: not every practicum laptop can install the
Android SDK, let alone macOS and Xcode for iOS.

Analogy: EAS is like a professional printing service — you send the design, the result
comes back with a download link; the printing press is not yours.

Warn about the consequence: because the whole project is uploaded to the server, a wrong
configuration goes along with it. That is why a configuration check step exists in the
practicum.

Mention that build duration, queues, and the EAS free/paid plan policy are marked
version-sensitive in this chapter.
-->

---

## Three Build Profiles

| Profile | Purpose | Output for Android |
|---|---|---|
| development | Daily development and testing native modules | development build with expo-dev-client |
| preview | Testing a release candidate by internal testers | APK (`distribution: internal`) |
| production | Releasing to the app store | AAB, signed, `autoIncrement` |

> The `development` profile uses `developmentClient: true` and runs together with `npx expo start --dev-client`.

<!--
Connect to the previous slide: the development profile produces a development build, the
production profile produces a production build. These are the same terms, not two
different things.

Ask: "Which profile do you use to send a beta to the lecturer?" (Answer: preview, because
the output is an APK that can be installed directly without going through an app store.)

Stress the practicum deliverable of this chapter: app.json, eas.json, and one APK from
EAS Build.
-->

---

## eas.json: The Build Control Center

`kode/bab-15-build-dan-deployment/eas.json` — three profiles and one submit section

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "autoIncrement": true }
  },
  "submit": { "production": {} }
}
```

> The content above is the same as Example 2 in the chapter, only compressed so it reads on a slide.

<!--
Point out three things: developmentClient true produces a dev client, preview with
distribution internal produces an APK for testers, and production with autoIncrement
increments the machine version number automatically.

Warn: npx eas-cli build:configure may add a cli section containing the eas-cli version;
do not delete that section when overwriting the file with your own version.

Question: "What happens if versionCode does not increase on the second AAB upload?"
(Answer: Google Play rejects it with a message that the version code is already used.)

Mention that the eas.json schema is marked version-sensitive in the chapter: rely on the
output of build:configure as the truth for your version.
-->

---

## Build Flow with EAS

![w:1120](assets/diagrams/bab-15-build-dan-deployment-02.svg)

1. Install `eas-cli` globally, or call it with `npx eas-cli`
2. `eas login`, then `eas whoami` to confirm the session is active
3. `eas build:configure` creates `eas.json` in the project root
4. `eas build --platform android --profile preview`

<!--
The order is mandatory: check the configuration, authenticate, prepare the profile, then
build. The `npx expo config` command with the public type is the last "peek window" before
the code is sent to the cloud; if the name or application ID is wrong here, the build
result is wrong too.

Stress that eas whoami is the cheapest way to confirm the login session is active before
waiting for a long build.

Warn: the build runs on the server, so the upload must not be interrupted; once the upload
stage is finished, the laptop may be closed and the result checked through the same link.
-->

---

## APK vs AAB: Two Android Formats

| Aspect | APK | AAB |
|---|---|---|
| Role | An installation file ready to be installed | A packaging file for the app store |
| How to use | Can be installed directly (sideload) | Cannot be installed directly |
| Who assembles it | You, once | Google Play assembles split APKs from the AAB |
| When to use | Internal testing and direct distribution | Upload to Play, mandatory since 2021 |

<!--
These two formats are the most often swapped in exams. The key distinction is simple: an
APK is the file that is installed, an AAB is the file that is uploaded.

Ask: "If an AAB cannot be installed, how do internal testers get an installation file?"
(Answer: by using the preview profile, which produces an APK.)

Mention that the AAB requirement for new apps since August 2021 is a policy marked
version-sensitive in this chapter: the upload format can change, check Play Console.
-->

---

## Why AAB Exists: Split APKs

![w:1120](assets/diagrams/bab-15-build-dan-deployment-03.svg)

> A split APK only contains the processor architecture, screen density, and language of that device — the user's download size drops drastically.

<!--
Explain the historical reason: previously developers assembled one universal APK holding
every possible device variant, so it wasted space and download time.

Stress that the party assembling the split APKs is Google, not the developer. That is precisely
the advantage, because Google's infrastructure knows each device's needs better.

Question: "Which parts are trimmed from my download?" (Answer: code for other processor
architectures, graphics for other screen densities, and translations for other languages.)
-->

---

## iOS Build: Conceptual but Locked

![w:1120](assets/diagrams/bab-15-build-dan-deployment-06.svg)

- EAS provides a macOS server, so an iOS build can run from Windows
- Absolute requirement: an Apple Developer Program membership paid annually
- Without that membership, a signing certificate cannot be issued
- EAS manages certificates and provisioning profiles automatically
- There is no direct installation path: only the App Store, TestFlight, or registered devices

<!--
Stress the two requirements that cannot be skipped: Apple Developer Program membership and
registering the app in App Store Connect before it is built.

Mention that the annual fee and the TestFlight tester quota are marked version-sensitive in
the chapter: understand the pattern, do not memorize the numbers.

Warn: on iOS there is no "install from anywhere" path like an APK on Android. For students
without a paid account, understanding the flow is enough because the practicum uses the
Android path.
-->

---

<!-- _class: center -->

## Exercise: Choosing a Release Channel

- APK via a chat group — cheap and fast, without version control
- Play internal testing track — at most 100 testers, without a review process
- Play production release — all users, passing through Google review
- Task: determine the channel for (a) the team's daily testing, (b) a beta for 20 friends, (c) a campus release

<!--
Think-pair-share, 4 minutes: each pair picks one channel per need and states the reason,
then 2-3 pairs report.

Expected answers: (a) internal testing, because it releases without review and suits daily
test rounds; (b) closed testing, because testers are invited through a link; (c)
production, because it targets all users and passes through review.

Stress that an APK via a chat group is not merely "less tidy": the circulating version is
uncontrolled and there is no centralized update path.

Judge the quality of an answer by its reasoning, not by the name of the channel.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Identity, Authenticity & Distribution

Section 15.5 app.json · 15.6 Environment variables · 15.7 Signing · 15.8–15.10

<!--
This part covers the second and third phases: how the app is guaranteed authentic, and
through which channel it reaches the user.

Allow about 45 minutes. Sections 15.5 to 15.7 are mandatory; 15.9 (App Store) may be
compressed if time runs short because it is entirely conceptual.
-->

---

## app.json: Name, Version, and Version Number

![w:1120](assets/diagrams/bab-15-build-dan-deployment-08.svg)

- `expo.name` — the name under the icon and in the app store; may change at any time
- `expo.slug` — the internal identity in the Expo ecosystem; without spaces or uppercase letters
- `autoIncrement: true` on the production profile increments the machine version number

> Example version journey: `1.0.0` → `1.1.0` (new feature) → `1.1.1` (bug fix) → `2.0.0` (overhaul).

<!--
Trimmed to the picture (the diagram says this):
- `expo.version` — the semantic version `major.minor.patch` that humans read
- `expo.android.versionCode` — an integer that must increase on every upload to Play

Open the real kode/bab-15-build-dan-deployment/app.json file when explaining this slide; abstraction without a
real file makes these keys feel like memorization.

Stress that there are two version readers: humans read version, machines read
android.versionCode and ios.buildNumber. This is the distinction most often swapped.

Question: "The version goes from 1.1.1 to 2.0.0 — what usually changed?" (Answer: a major
overhaul that is incompatible with the previous version.)

Warn: slug should stay stable because it becomes part of the project link in the Expo
ecosystem, whereas name is free to be changed at any time.
-->

---

## Application ID: Permanent Once Published

![w:1120](assets/diagrams/bab-15-build-dan-deployment-09.svg)

- `android.package` and `ios.bundleIdentifier` — the app's globally unique identity
- Written using the reverse-domain rule: `ac.id.univ` + `mahasiswa`
- The rules: lowercase letters, digits, and dots; every segment starts with a letter

<!--
Trimmed to the picture (the diagram says this):
- Once published, the ID may not be changed — it is considered a new app
- As a result, old users and reviews seem to vanish along with the old ID

Practice the reverse-domain rule on the board: politeknik.ac.id plus siakad becomes
ac.id.politeknik.siakad. Ask the class to do one more example before moving on.

Stress its permanent nature: changing the application ID means the store considers it a
different app, complete with the loss of users and the reviews already gathered.

Warn about the writing rules that are often violated: no two consecutive dots, and
every segment must start with a letter, not a digit.

Question: "When is the cheapest time to decide the application ID?" (Answer: before the
first published build.)
-->

---

## Icon, Adaptive Icon, and Splash Screen

![w:1120](assets/diagrams/bab-15-build-dan-deployment-10.svg)

- **Splash screen** — the opening screen shown briefly when the app is opened
- `expo.icon` — a square 1024×1024 pixel PNG as the app icon
- `adaptiveIcon` — `foregroundImage` (safe area in the middle) + `backgroundColor`
- The splash is configured through the `expo-splash-screen` config plugin in `plugins`
- Splash parameters: `image`, `imageWidth`, `resizeMode`, `backgroundColor`

<!--
Stress why an adaptive icon has two layers: modern Android crops icons to the shape of the
device launcher, so the foreground and the background must be separated. `foregroundImage`
is the foreground image with a safe area in the middle, while `backgroundColor` fills the
region cropped by the launcher.

Define splash screen first before going into its configuration (section 15.5): the screen
shown briefly when the app is opened, covering the native framework loading process.

Warn about the safe area on foregroundImage: text or a logo that crosses it will be cropped
on some launchers. The specification of the safe area and recommended sizes is marked
version-sensitive in the chapter, so refer to the Android asset guidelines when preparing
the icon.

Question: "Why is the splash recommended to use the same background color as the app
theme?" (Answer: so the transition to the first page feels smooth, without flicker.)

Mention that the way to configure the splash changes between SDKs: the chapter and this
slide follow the config plugin pattern on SDK 57, not the old splash keys.
-->

---

## Example: app.json for the Student App

`kode/bab-15-build-dan-deployment/app.json` — the identity that the app store reads

```json
{
  "expo": {
    "name": "Aplikasi Mahasiswa",
    "slug": "aplikasi-mahasiswa",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": { "bundleIdentifier": "ac.id.univ.mahasiswa" },
    "android": {
      "package": "ac.id.univ.mahasiswa",
      "versionCode": 1,
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" }
    }
  }
}
```

<!--
Show that every key on this slide has already been discussed: name, slug, version, icon,
application ID, versionCode, and adaptiveIcon. There are no new keys.

Stress that ios and android use the same ID, ac.id.univ.mahasiswa, because both are the
reverse domain of the example campus.

Remind that the complete file contains orientation, scheme, buildNumber, the expo-router
plugins, and the full expo-splash-screen configuration; the excerpt on the slide is
deliberately shortened so it can be read from the back row, and the full version is in
kode/bab-15-build-dan-deployment/app.json and Example 1.
-->

---

## Environment Variables: Configuration Outside the Code

![w:1120](assets/diagrams/bab-15-build-dan-deployment-11.svg)

- Configuration values are stored outside the code, commonly in a `.env` file
- Expo reads `.env`, `.env.local`, `.env.development`, and `.env.production`
- After changing `.env`, restart `npx expo start` so the new values are inlined

<!--
Trimmed to the picture (the diagram says this):
- Only variables prefixed with `EXPO_PUBLIC_` are inlined into the app code
- Inside the code they are read as `process.env.EXPO_PUBLIC_API_URL`

Analogy: environment variables are like location labels on a toolbox. The contents of the
box are the same; what differs per work location is the label.

Stress the prefix rule: only EXPO_PUBLIC_ values reach the app code. Variables without the
prefix are still available during the build process, for example for app.config.js, but
the app will never read them.

Warn: values are inlined when the bundle is created, not when the app runs. Changing .env
without restarting the development server is the most common cause of old values still
being used.

Mention that the Android emulator calls the backend at 10.0.2.2 as in Chapter 10, while
production uses an https domain.
-->

---

## EXPO_PUBLIC_: Values Embedded in the Bundle

![w:1120](assets/diagrams/bab-15-build-dan-deployment-04.svg)

> `EXPO_PUBLIC_*` values are embedded in the JavaScript bundle shared with all users: anyone can read them.

<!--
This is the most important security slide in this chapter. Stress the last arrow: the file
shared with every user contains that value as it is.

Ask: "So where are the API keys that protect the server stored?" (Answer: on the server
side, for example the backend .env file from Chapter 10, or a JWT token managed by Chapter
13.)

Misconception: thinking the EXPO_PUBLIC_ prefix makes the value hidden or safe. Quite the
opposite — the value is bundled along and can be read by anyone, so never include
passwords, tokens, API keys, or card numbers.
-->

---

## Signing: Proof of Build Authenticity

![w:1120](assets/diagrams/bab-15-build-dan-deployment-12.svg)

- **Signing** — a digital signature marking that the file comes from a legitimate developer
- Android: a **keystore** (`.jks` or `.keystore`) holds the key and certificate
- EAS creates and stores the keystore in your account, download it via `eas credentials`

<!--
Trimmed to the picture (the diagram says this):
- Anyone can rebuild the app, but only the owner of the key can sign it
- The system rejects an update signed with a different key

Analogy: a digital signature is like a notary's seal. The document contents may be the
same, but the seal can only be made by the key holder.

Stress the two roles of a signature: verifying authenticity at installation, and verifying
the continuity of identity at update. The second role is what makes losing the key
dangerous.

Question: "Why does the system reject an update signed with a different key?" (Answer:
because it is considered another app, not a new version of the same app.)

Mention that building on a local machine requires your own keystore via keytool, and the
syntax details are marked version-sensitive in the chapter.
-->

---

<!-- _class: center -->

## What Happens If the Keystore Is Lost?

- The developer's laptop breaks down and the local keystore has no copy
- The old version of the app is already installed on a number of user devices
- You have to release a bug fix next week

**Question:** what happens when the new build is installed on the old device?

<!--
Do not answer on this slide; the answer is on the next slide. Give 60 seconds of
think-pair-share, then collect 2-3 guesses before moving on.

Prompt if no one answers: "Can users delete the old app and install the new one?" (Answer:
they can, but they lose data and most of them will not do it.)

This scenario is raised from an incident in the chapter's Case Study; link to it after the
answer appears. The source chapter does not mention the number of installed devices — only
the first five student testers (Budi, Siti, Agus, Dewi, Rizky) and distribution through the
class WhatsApp group — so do not invent quantities.
-->

---

## Answer: Safeguarding the Signing Key

- The installed app can never be updated — the signatures do not match
- The system treats the new build as a different app
- First mitigation: EAS stores the keystore in your Expo account, safe from a broken laptop
- Second mitigation: **Play App Signing** stores the production key at Google
- With Play App Signing, the developer only holds the **upload key**

<!--
Repeat the answer firmly: the installed app loses its update path; users have to reinstall
it as a new app, and usually they are unwilling to.

Stress the two layers of mitigation: EAS keeps the keystore in the account so it is not
destroyed along with the laptop, and Play App Signing separates the production key from the
upload key.

Question: "Why does EAS use a two-person approval mechanism to download the key?" (Answer:
because that key is the most valuable item in the app's life cycle.)

Remind students to keep a copy of the keystore in a safe place from the first practicum.
-->

---

## Google Play: Four Release Tracks

- **Deployment** — bringing the build to users through an official channel
- **Track** (release track) — a Play Console release channel: internal, closed, open, production

| Track | Who receives it | Note |
|---|---|---|
| internal testing | at most 100 registered testers | fast release without a review process |
| closed testing | testers invited through a link | mandatory for new personal developer accounts |
| open testing | anyone who signs up as a tester | appears as an "early release" |
| production | all users | passing through Google review |

![w:1120](assets/diagrams/bab-15-build-dan-deployment-13.svg)

<!--
Read this table as a ladder from most private to most public: each step down adds testers
and reduces speed.

Stress that internal testing does not pass through review, whereas production always
passes through Google review with a varying duration.

Mention the policy marked version-sensitive: for new personal developer accounts, Google
requires testing in closed testing with a certain number of testers and duration before a
production release is allowed.

Warn that a Google Play developer account is charged a one-time registration fee.

The two bullets above are the chapter's definitions of key terms: deployment is defined in
section 15.8, and track (release path/channel) in the list of Play tracks in the same
section.
-->

---

## Upload Flow to Play Console

1. Build the AAB: `eas build --platform android --profile production`
2. Fill in the app's presence: description, store icon, screenshots, data safety
3. Choose the track, upload the AAB, and make sure `versionCode` has increased
4. Write the release notes, then press the release button
5. Monitor statistics, crash reports, and reviews in the Play dashboard

> A production release can be limited to a certain percentage of users through a staged rollout.

<!--
Stress that the first step is not uploading but preparing the app's presence: name, short
and long description, category, 512x512 store icon, feature graphic, screenshots, content
rating questionnaire, and the data safety declaration.

Warn about the third step: versionCode must increase on every upload. This is the most
common mistake on a second upload, and the message in Play Console is version code already
used.

Question: "Why do professional teams use a staged rollout?" (Answer: to monitor stability
on part of the users before reaching all users.)

Stress that the dashboard and reviews are valuable product feedback, not an interruption.
-->

---

## App Store: Conceptual Flow

![w:1120](assets/diagrams/bab-15-build-dan-deployment-05.svg)

- There is no public path outside the App Store: only review, TestFlight, or a dev build
- An annual membership fee and stricter review than Play
- TestFlight: hundreds of internal testers and thousands of external testers

<!--
Compare with Play on two things: the fee pattern (Play once, Apple annually) and the
strictness of review.

Stress the most distinctive iOS consequence: there is no installation path from unknown
sources. Internal distribution depends on TestFlight or a development build to registered
devices.

Warn against memorizing the TestFlight quota numbers and the review duration: both are
marked version-sensitive, and both change over time.

Question: "If EAS handles the certificate and the upload, what remains your
responsibility?" (Answer: preparing the membership, the app information, and the release
decisions.)
-->

---

## Three Build Environments

| Environment | Build form | Distribution |
|---|---|---|
| Development | Expo Go or a development build | Local Metro, not shared |
| Preview/Testing | APK `distribution: internal` | Play internal/closed track, TestFlight |
| Production | AAB or store file, signed | Play/Apple review, public |

> The same code, a different configuration — this is the cure for the "it works on my machine" disease.

<!--
Closing concept slide: the three EAS build profiles actually mirror three environments
common in software organizations, just as in the web world.

Stress the principle binding all three: one code base, three different configurations in
app.json, environment variables, version, and signature.

Question: "What changes between environments and what does not?" (Answer: what changes is
the configuration, the version, and the signature; what does not change is the app code.)

Mention that the next evolution, updates without a rebuild through the EAS Update
mechanism, is marked version-sensitive in the chapter and will be met again in the world
of work.
-->

---

## Case Study: The SIAKAD Mobile 1.0 Incident

- APK 1.0 was built hastily and then spread through the class WhatsApp group
- Version 1.0.1 was released, but two versions kept circulating and data clashed in the backend
- The developer's laptop broke down; the local keystore was lost; updates were rejected by the system
- The Play build carried the laptop IP as its API address, not the production server address
- Cost of repair: three weeks of rework and a drop in user trust

<!--
Read it as a story, not a list. The five student testers in this incident use the book's
static data from Chapters 4 to 8, so the class will recognize them.

Question before the next slide: "If you were the lead of this team, which decision would
you change earliest?" Collect 2-3 answers without correcting them.

Stress that this is not a failure to write code: the app runs, users can log in, and the
features work. What failed was the packaging and distribution process.
-->

---

## Every Symptom, One Section

| Symptom | Root cause | Fix (section) |
|---|---|---|
| Two versions circulating in the chat group | No official release channel | Play internal/closed track (15.8) |
| The keystore lost along with the laptop | Signing managed locally | EAS + Play App Signing (15.2, 15.7) |
| API address hard-coded in the code | Configuration fused with code | `EXPO_PUBLIC_` and `.env` (15.6) |

<!--
Diagnosis exercise: cover the last column, ask the class to guess the section underlying
each fix, then reveal the answers.

Stress the big pattern: every symptom of the incident maps directly to one section of this
chapter, so this chapter is not extra theory but a list of preventions.

Question: "Which is the most expensive to fix?" (Answer: the lost keystore, because the
installed app loses its update path entirely.)

Close with the systems analyst's message: those three weeks of repair cost far more than
one meeting spent understanding builds and deployment.
-->

---

## Practicum for This Meeting

- Complete `app.json`: name, slug, version, application ID, versionCode, buildNumber
- Verify with `npx expo config --type public` before sending the code to the cloud
- Create `eas.json` with three profiles: development, preview, production
- Separate the API address into `.env` then restart `npx expo start`
- Without an EAS account: `npx expo export --platform android` produces a bundle in `dist/`

<!--
Remind them to work on a copy of the praktikum15 project, not the main project; a cloud
build uploads the whole folder, so junk files are carried along too.

Mention the two paths available in the chapter: the cloud path with a free Expo account,
and the alternative npx expo export path that produces a production bundle in dist/ but not
an installable APK. The alternative still exercises understanding of what gets packaged.

Warn about the most common practicum mistake: asset paths differing in capital letters
between Windows and the EAS server, so the build fails with an asset-not-found message.

Remind them that the practicum result is closed with LAPORAN-BUILD.md in the praktikum15
folder.
-->

---

## Application in IS/IT Practice

| Activity | Artefact | Basis |
|---|---|---|
| Preparing a release | `app.json`, `eas.json`, `.env.production` | 15.2, 15.5, 15.6 |
| Testing a release candidate | Preview APK for the lecturer and testers | 15.2, 15.8 |
| Recording release history | `LAPORAN-BUILD.md` containing date, profile, result | Practicum |
| Designing publication | Final Project Deployment Plan | 15.8–15.10 |

> A build report has the same shape as the release notes a company asks for when you apply for a job.

<!--
Connect the course artefact with the work artefact: LAPORAN-BUILD.md is the simplest form
of the release notes used by product teams.

Stress that the Deployment Plan in the Final Project is a direct continuation of this
chapter: the version list and changelog, the build profiles used, the distribution channel
per environment, and the steps in Play Console.

Question: "If you were a systems analyst, which part would you ask the developer team about
first?" (Open answer; steer toward application ID, versionCode, and release channel.)
-->

---

## Summary

1. Development builds pursue iteration; production builds pursue size and security
2. EAS Build is a cloud build with three profiles: development, preview, production
3. An APK can be installed directly; an AAB is the parent format for Play, mandatory since 2021
4. `EXPO_PUBLIC_*` is embedded in the bundle: handy for server addresses, not for secrets
5. Signing guarantees authenticity; a lost keystore means the app cannot be updated

<!--
Do not read it out. Ask five students to explain one number in their own words, and correct
on the spot if wrong.

What is not yet written on the slide and needs to be said aloud: the application ID is
permanent, the machine version must increase on every upload, and the three environments
use the same code with different configurations.

Closing message: release decisions are made before the first release, not after users
complain.
-->

---

<!-- _class: center -->

## Mini Quiz

- The main difference between a production build and a development build is...
- The reason Google Play requires an AAB for new apps is...
- The `EXPO_PUBLIC_API_URL` variable in the app code...
- The Play track without review and with at most 100 testers is...

<!--
Five-minute oral quiz: show the questions, ask the class to answer in unison or by raising
fingers, then move on to the answer slide.

Do not leak the answers on this slide; the PDF file students carry contains all slides, so
the answers must be on the next slide.

If the class's answers vary on the third question, repeat the EXPO_PUBLIC_ slide before
closing the meeting.
-->

---

<!-- _class: center -->

## Answers

- Minified, optimized, signed, and without debugging tools
- Play assembles split APKs per device from the AAB so downloads are smaller
- The value is inlined into the bundle at build time, so it is unsuitable for secrets
- Internal testing: up to 100 testers, a fast release without a review process

<!--
Repeat the distinctions most often swapped: a production build sacrifices ease of debugging
for size and security; an AAB is not an installable file; EXPO_PUBLIC_ values are embedded
in the bundle.

If many get the fourth question wrong, repeat the release track table before moving on to
the closing discussion.

Remind them that these four questions are equivalent to the multiple-choice items in the
Chapter Evaluation, so the answers double as self-study material.
-->

---

## Exercises and Discussion

<div class="grid2">
<div>

**Group discussion (5 minutes)**

- What channel have you used so far to share an app with friends?
- Which habit would you require from day one on your team?
- What is the hidden risk of sending an APK through a chat group?

</div>
<div>

**Selected exercises**

- Analysis question 1: compare WhatsApp, internal testing, and production
- Challenge 1: draft a one-page mini Deployment Plan

</div>
</div>

<!--
Give 5 minutes in pairs for the left column, then collect 2-3 answers. A strong answer
names the reason, not just the name of the habit.

For the right column, analysis question 1 and Challenge 1 are candidates for the Assignment
3 assessment together with the build report and the Chapter 14 QA report.

If the class raises the choice of habits in the left column, steer toward four things: the
app.json configuration, version numbering, signing key management, and the release channel.

Deadline reminder: the QA report and the build report are collected before the final exam
at the next meeting, with the column format as on the practicum slide.
-->

---

## References

| Source | Link |
|---|---|
| Expo documentation — EAS Build (2026) | docs.expo.dev |
| Expo documentation — app.json and environment variables (2026) | docs.expo.dev |
| React Native documentation (2026) | reactnative.dev |
| React documentation (2026) | react.dev |

<div class="grid2">
<div>

**Related chapters**

- Chapter 2 — project birth, first `app.json`
- Chapter 10 — `fetch`, `10.0.2.2`, and the book's `backend/`
- Chapter 14 — app content quality assurance

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D — covering the React, React Native, and Expo
documentation. Play Console upload policies and Apple Developer requirements are not listed
there because both are version-sensitive; direct students to check the official sites of
both. The terms EAS Build, splash screen, environment variable, APK/AAB, and application ID
are explained in Appendix C (glossary); the terms signing and keystore are defined in
section 15.7 (slide 24).

Remind them that the EAS documentation, Play Console upload policies, and Apple
requirements are version-sensitive: match them again against the official documentation
before the semester runs.

Stress that this chapter refers to the Chapter 6-8 project and the Chapter 10 backend
without repeating their material.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for the Final Project

**Assignment 3:** QA report (Chapter 14) and build report (Chapter 15) — date, profile, platform, result, notes.

Next meeting: Final Exam — presentation and demo of the Final Project "Sistem Informasi Akademik Mobile".

<!--
Close with one sentence: "Chapter 14 checks the contents of the app; this chapter makes sure
the app reaches users safely and under control."

State the Assignment 3 deadline explicitly: the Chapter 14 QA report and the Chapter 15
build report, with the columns date, profile, platform, result, and notes as on the
practicum slide.

The next meeting is the final exam: app demo, architecture, API, testing, and a deployment
plan following the Final Project rubric in Appendix B.
-->
