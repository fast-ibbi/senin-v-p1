---
marp: true
theme: academic
paginate: true
title: "Chapter 13 — Authentication and Application Security"
description: "Mobile Programming lecture, meeting 14: authentication vs authorization, register and login, session vs token, JWT, protected routes, SecureStore, API security, and the login → token → access API → logout flow."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 13 — Authentication and Application Security"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 13 — Authentication and Application Security

Login → token → store securely → access API → logout · Meeting 14

<!--
Tie it to students' experience: "Which app on your phone still lets you in after the app is
closed? That is what we build today."

Opening question: "If login is already secure, what else needs securing?" (Answer: where the
token is stored, endpoint protection, and the communication channel.)

Remind them that this meeting's practicum is also the authentication milestone of the Final
Project.
-->

---

## Learning Objectives

- Explain the difference between authentication and authorization in information system applications
- Compare session and token mechanisms along with their scalability consequences
- Analyze the structure of a JWT (*JSON Web Token*): header, payload, and signature
- Implement protected routes and token storage with SecureStore
- Evaluate API security principles: server validation, HTTPS, least privilege

<!--
Read out only the verbs, not the whole sentences. Objectives 3 and 5 are the core of the way
of thinking: a token is not secured by the application, but by the server's signature and
the access rights policy.

Tie it to assessment: this meeting is assessed from the Chapter 13 practicum and is also the
authentication milestone of the Final Project with a security weight of 5% (Appendix B).
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — Authentication, Session & Token

Section 13.1 authentication vs authorization · 13.2 login, register, and session · 13.3 token and JWT

<!--
This part is conceptual and is exam material. If time is tight, Section 13.1 may be
condensed, but 13.1 may not be skipped because it is the basis of the whole chapter.

Section 13.3 is the most often misunderstood — set aside the most time here.
-->

---

## Authentication vs Authorization

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-06.svg)

<div class="grid2">
<div>

- Credentials are matched against stored data

</div>
<div>

- Read from the *role* of a user whose identity is already proven

</div>
</div>

> The order is always fixed: authentication first, authorization afterwards.

<!--
Trimmed to the picture (the diagram says this):
- Proves identity: "who are you?"
- Determines access rights: "what are you allowed to do?"
- **Authentication**
- **Authorization**

Those two bullets are the two panel rows, so they left the columns. The two sub-heads went
with them — the picture's panel titles say the same two words one centimetre higher. What
stays beside each column is the half no panel row shows: how authentication is done
(credentials matched against stored data) and where authorization comes from (the role of an
identity already proven). The blockquote below keeps its own job, the fixed order, which a
side-by-side picture cannot state.

The chapter's analogy: entering an office building. Security reads your ID card (authentication),
then your access badge determines which floor you may enter (authorization). The ID card does
not automatically open the server room door.

The most common misconception: assuming "login" already covers both. Ask: "If I am already
logged in as a student, may I open another student's grades?" (No, and it is not login that
forbids it, but authorization on the server.)
-->

---

## Authorization in SIAKAD: Roles and Their Rights

| Role | What it may do |
|---|---|
| `mahasiswa` | View their own grades |
| `dosen` | Enter grades for the courses they teach |
| `admin` | Manage the data of all users |

- Authentication is the same for every role; what differs is the outcome of authorization
- A `role` check on the client is only convenience; the server decides authorization

<!--
Emphasize the last line: that is the sentence students most often violate when building the
Final Project, for example hiding an admin button on the client and then assuming the data
is already safe.

Guiding question: "If the Add Data button is hidden from students, is the data safe?"
(Not yet: a student can still call the POST endpoint directly with curl.)

Warn that the binding authorization decision always sits on the server.
-->

---

## Register and Login: Two Endpoints

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-07.svg)

| Endpoint | Function | Successful response |
|---|---|---|
| `POST /api/auth/register` | Create a new account | `201 Created` |
| `POST /api/auth/login` | Match credentials, answer with a token | `200 OK` |

- Wrong credentials are answered by the server with `401 Unauthorized`
- The book's server is started with `cd backend && npm install && npm start`

<!--
Show that these two endpoints are the entrance; every data endpoint after them demands a
token. Remind them that how to run the server is covered in Chapter 10.

Version-sensitive warning: the exact shape of the response (for example the names of the
token and user fields) follows backend/README.md. If it differs, adjust the code on the
following slides.

Quick question: "What does 401 Unauthorized mean for the application?" (Answer: the user's
identity is not proven yet, so the application must return the user to the login screen —
see 13.7.)
-->

---

## Passwords Are Never Stored in Plaintext

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-08.svg)

- **Credentials** are the user's identity: usually an email and a password
- In this book the password is always written as the placeholder `••••••••`
- A password is never printed to the screen, stored, or written into a log

<!--
Trimmed to the picture (the diagram says this):
- The server stores the result of one-way **hashing** (for example bcrypt), not the original text
- *Salt* makes two identical passwords produce different hash values

Those two bullets are the chain itself — the original text, the one-way hashing with a salt,
and the hash value that is the only thing kept. What stays is what no stage can carry: what
credentials are, the `••••••••` convention of this book, and the rule that a password is never
printed, stored, or logged.

Emphasize the one-way property: the original password cannot be recovered from the hash
value, so a database leak does not immediately open the accounts.

Analogy: a hash is like cutting a photo into small pieces that cannot be put back together,
while a salt is like giving each person a different cutting pattern, so two identical
passwords still look different in the database.

Ask: "If I forget my password, why does the application send a reset link instead of sending
my password?" (Because the server itself does not store it.)
-->

---

<!-- _class: center -->

## What Happens If…?

- …a password is stored as plaintext in the server database?
- …a token is stored in AsyncStorage and then the device is *rooted*?
- …login is secure, but the student list endpoint is unprotected?

<!--
Do not explain immediately; ask three students to answer one scenario each, then continue to
the next slide, which contains the mechanisms.

Expected answers: (1) every account is exposed as soon as the database leaks; (2) the token is
easy to read and is copied into device backups; (3) anyone can pull data without logging in,
even though the login screen is neat.

Note down wrong answers to correct in Sections 13.5 and 13.6.
-->

---

## Session vs Token (Table 13.1)

| Aspect | Session | Token |
|---|---|---|
| State on the server | Stored (database/memory) | Not stored (stateless) |
| Revocation | Easy: delete the session on the server | Hard: wait for the token to expire |
| Scalability | Requires sharing the session across servers | Servers can be added freely |
| Suitable for | Traditional web applications | REST APIs and mobile applications |

- Mobile applications and REST APIs choose tokens because they do not depend on browser *cookies*

<!--
Compare the two contrasting columns, do not read them row by row: a session wins on
revocation, a token wins on scalability.

Tie it to Chapter 10, which already touched on this theme as an introduction; here the
pattern is discussed in full.

Ask: "If the campus application adds three API servers, what must change in the session
mechanism?" (The session must be shared across servers, for example through a shared store.)
-->

---

## Architecture: A Server That Remembers vs One That Does Not

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-02.svg)

> A token makes the server easy to duplicate; a session demands session storage that is shared.

<!--
Ask students to point out the most important difference in the picture: on the token row, is
there a "look up a record" step on the server? There is none. That absence is the meaning of
stateless.

Misconception warning: stateless does not mean the server verifies nothing. The server still
checks the signature and the exp claim on every request.

Analogy: a session is like a receptionist who writes down every guest; a token is like an
official stamp whose authenticity is checked without opening the record book.
-->

---

## JWT: Three Parts Separated by Dots

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-03.svg)

- **JWT** (*JSON Web Token*) is an access pass in JSON form that is signed
- The header and payload are *encoded* with **base64url** (an encoding that keeps JSON characters safe)
- The signature is computed with a **secret key** that only the server knows

<!--
Write the shape on the board as three consecutive blocks so students see that a token is just
one long string with two dots as separators.

Explain the claims one by one only if asked: sub is the subject or user identity, iat is the
issued-at time, exp is the expiration time.

Ask: "Which part makes the token impossible to forge?" (Answer: the third part, the signature.)
-->

---

## Example: Inspecting the Parts of a JWT

`utils/pemeriksaJwt.js` — Example 13.1, used for learning only

```js
// Memecah JWT menjadi tiga bagian untuk keperluan pembelajaran
export function periksaJwt(token) {
  const bagian = token.split('.');
  if (bagian.length !== 3) {
    return { keterangan: 'Bukan JWT yang valid' };
  }
  return {
    header: bagian[0],    // berisi algoritma
    payload: bagian[1],   // berisi klaim pengguna
    signature: bagian[2], // penanda keaslian
  };
}
```

> The real token verification is still done by the server, not by the client application.

<!--
Point out only three things: the split with split('.'), the check on the number of parts, and
the naming of the parts to match header, payload, signature.

Remind them that this function is for learning only; in a production application, verification
is entirely on the server, and if the client needs to read claims, use an established library
such as jwt-decode (version-sensitive: check the library's documentation).

Short demonstration: paste the sample token from the chapter into an online decoding tool, then
show that the payload content is readable as plain text.
-->

---

## A JWT Is Not Encryption

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-09.svg)

- Changing one letter in the header or payload makes the signature mismatch
- Never put a password or secret data inside the payload

<!--
Trimmed to the picture (the diagram says this):
- The header and payload are only *encoded*: anyone can decode and read them
- The signature protects the **integrity** and **authenticity**, not the **confidentiality** of the contents

Those two bullets are the two panel rows, so they moved. What stays on the slide is the
one-letter test — a fact about tampering rather than about encoding — and the payload rule that
follows from it. The title still says the conclusion; the picture says why.

This is the number one misconception in this chapter: students think a JWT is "encrypted" so it
is safe to store any data. Repeat the closing sentence twice if needed.

Guiding question: "If I put someone's national ID number in the payload, is it safe?" (No: the
payload can be read by anyone holding the token.)

Connect backwards: that is why the login response should not send the whole profile, which is
discussed again in Section 13.6 and the case study.
-->

---

## Why a JWT Makes the Server Stateless

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-10.svg)

- There is no database lookup to check a list of valid tokens
- Verification needs only the secret key, arithmetic, and a check of the `exp` claim
- Any server holding the secret key can verify the same token

<!--
Trimmed to the picture (the diagram says this):
- The server recomputes the signature from the header and payload it receives

The three stages are that bullet. What stays is what no stage shows: that there was nothing
to look up in the first place (a list of valid tokens), the three things verification needs —
the secret key, arithmetic, the `exp` claim — and the consequence that any server holding the
key can verify the same token.

Emphasize that there is no "look this token up in the database" step. There is only
recomputation of the signature, then a comparison.

Analogy: like checking the authenticity of a seal on a letter. The officer only needs to know
the correct shape of the seal; there is no need for a register of every letter ever issued.

Guiding question: "So what makes logout on a token architecture different from logout on a
session?" (The server has no record to delete; what is deleted is the token on the client side.)
-->

---

## The Price of Stateless: Revocation Is Hard

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-11.svg)

- The server has no list of revoked tokens: a stolen token stays valid until `exp`
- The refresh token only needs to be understood as a general picture; its implementation is in the Challenge

<!--
Trimmed to the picture (the diagram says this):
- The common pattern: a short-lived access token, for example 15 minutes to 1 hour
- A long-lived **refresh token** issues a new access token without logging in again

Those two bullets are the three stages and the two arrows between them. What stays is the
price itself — no list of revoked tokens, so a stolen token lives until `exp` — which is an
absence a chain cannot draw, and the scope note about the Challenge.

Present this as a trade-off, not a design flaw: every choice has a price, and the price of
stateless is revocation that is not instant.

An easy scenario to imagine: a student loses a phone that is still logged in. Ask: "What can
the server do while the token is still alive?" (Little: wait for exp, or shorten the lifetime
of the access token.)

Emphasize that this is why the exp claim must not be made too long.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Protection, Storage & API Security

Section 13.4 protected route · 13.5 token storage · 13.6 API security · 13.7 the complete flow

<!--
This part is the practical part. If this meeting is used for the laboratory, sections 13.4 to
13.5 are done while typing code, while 13.6 is enough to read out with one example for each
principle.

Leave at least 20 minutes for the practicum at the end.
-->

---

## Protected Route: Definition and Its Limits

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-12.svg)

- A **protected route** is a screen that only a logged-in user may access
- Protection on the client is a user experience (UX) layer, not data security
- Data security is determined by the server's **middleware** on the `Authorization` header
- While the status is `memuat`, show a loading indicator so the screen does not flicker

<!--
Trimmed to the picture (the diagram says this):
- The redirect page `app/index.js` decides the direction based on authentication status

That bullet is the picture: one decider, three statuses, three destinations. What stays is the half
no branch can carry — what a protected route *is*, that the client guard is only UX, and that the
server's middleware is the part that protects data. The `memuat` bullet stays as well, because its
reason ("so the screen does not flicker") is a fact the picture does not show.

Repeat the pattern from Chapter 7, then explain what is new in this chapter: the check is no
longer static, but uses real authentication state from token storage.

Emphasize the division of roles: the client directs the user, the server rejects the request.
The two are not substitutes for each other.

Guiding question: "If I turn off client protection, is the data still safe?" (Still safe if the
endpoint is protected by the server; that is the point of the next slide.)

Mention the standard structure from Chapter 7: the route group `app/(app)/` contains Home,
Student List, Detail, and Form; outside that group there is only `app/login.js` and the
redirect page.
-->

---

## Two Layers of Protection

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-04.svg)

> The client directs the user; the server decides whether access is allowed.

<!--
Ask students to guess what happens if only the server layer is active, and if only the client
layer is active. Answer: without the client layer the application feels confusing but the data
is safe; without the server layer the data is open even though the display already looks neat.

Mention that in the book's backend this protection is available as optional middleware, and how
to enable it is in backend/README.md (version-sensitive: the name and the activation method of
the middleware follow that README).

Warning: do not write down header or middleware function names of your own that are not in the
README.
-->

---

## Protected Route for the Whole Route Group

`app/(app)/_layout.js` — a condensed version of Code 8

```js
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LayoutTerproteksi() {
  const { status } = useAuth();

  if (status === 'memuat') return <ActivityIndicator size="large" />;
  if (status === 'keluar') return <Redirect href="/login" />;
  return <Stack />;
}
```

> One `_layout.js` file protects Home, List, Detail, and Form without touching their screens.

<!--
Show that three statuses determine three different outputs: `memuat` shows the indicator,
`keluar` redirects, and `masuk` shows the Stack.

Explain the reason for the loading indicator: without it, the application briefly "flickers"
to login before the token finishes being read from SecureStore.

Authoring note: the code on this slide is condensed from Code 8 in the chapter (the View
wrapper that centers the indicator is removed so it fits on the screen); point students to the
chapter for the full version.

Guiding question: "Why `Redirect`, not moving the user with a button?" (Because the status can
change by itself when the application opens, not only when the user presses something.)
-->

---

## Handling an Expired Token (401)

`context/AuthContext.js` — Example 13.3

```js
// Dipanggil ketika server menjawab 401 (token ditolak)
async function keluarKarenaKedaluwarsa() {
  await hapusToken();
  setToken(null);
  setUser(null);
  setStatus('keluar'); // protected route akan Redirect ke /login
}
```

> How to use it: when `response.status === 401`, call this function from the API caller.

<!--
Emphasize that this function is almost the same as signOut, the difference being no user
confirmation, because the condition was not requested by the user.

Explain the benefit from the experience side: a user whose token has expired is not stuck
staring at a repeated error message on the same screen.

Guiding question: "Why does the application need to wait for the server to answer 401, instead
of just counting the token's age itself?" (Because the server is the authority that decides the
validity of a token.)
-->

---

## AsyncStorage vs SecureStore (Table 13.2)

| Aspect | AsyncStorage (Chapter 11) | SecureStore (this chapter) |
|---|---|---|
| Encryption | No (plaintext) | Yes (Keystore/Keychain) |
| Included in device backup | Yes | Not recommended |
| Value size | Large (unlimited) | ±2 KB per value |
| Suitable for | Non-sensitive data, cache | Tokens, PINs, small secrets |

- A token is like digital cash: where you store it determines its safety

<!--
Summarize the division of storage duties: large, non-sensitive data stays in AsyncStorage
(Chapter 11), while tokens and small secrets go into SecureStore.

Explain the mechanism behind it as simply as possible: Android uses a key from the Keystore,
iOS uses the Keychain; the cryptographic key never leaves the device's secure area.

Version-sensitive warning: the size limits and platform behavior of SecureStore can change
between SDK versions; check docs.expo.dev before using it in production code.

Ask: "Why does the student list cache not need SecureStore?" (Because it is not a secret and
its size can be large.)
-->

---

## SecureStore: Only Three Functions

`utils/tokenStorage.js` — Code 1

```js
import * as SecureStore from 'expo-secure-store';
const KUNCI_TOKEN = 'token_mahasiswa_app';

export async function simpanToken(token) {
  await SecureStore.setItemAsync(KUNCI_TOKEN, token);
}
export async function bacaToken() {
  return await SecureStore.getItemAsync(KUNCI_TOKEN); // null bila belum ada
}
export async function hapusToken() {
  await SecureStore.deleteItemAsync(KUNCI_TOKEN);
}
```

- Install it with `npx expo install expo-secure-store` so the version matches the SDK

<!--
Show the benefit of the wrapper: only this file knows the key name, so a mistyped key is
impossible on the other screens.

Explain that getItemAsync returns null if the item does not exist yet, so checking "is the user
already logged in" only needs to inspect that value.

Mention the practicum problem that appears most often here: the message "Cannot find native
module ExpoSecureStore". The cause is that the package is not installed or its version does not
match; the fix is npx expo install expo-secure-store then npx expo start -c.
-->

---

<!-- _class: center -->

## Mini Quiz

- What guarantees the authenticity of a JWT?
- Why is the server still called stateless even though it uses tokens?
- When is the advantage of a session most needed?
- Which `expo-secure-store` function deletes the token at logout?

<!--
Four-minute oral quiz: show the questions, ask the class to answer together or raise a hand,
then move to the answers slide. Do not leak the answers on this slide.

If class answers vary on the second question, repeat the explanation of signature verification
before closing the meeting.
-->

---

<!-- _class: center -->

## Answers

- The signature computed with the server's own secret key
- Verification needs only the secret key, arithmetic, and the `exp` claim
- When access revocation must take effect immediately: delete the session on the server
- `deleteItemAsync`

<!--
Repeat the distinction most often swapped: stateless does not mean without verification, and a
session wins not on scalability but on the ease of revocation.

Follow-up question if time remains: "When would a mobile application still choose a session?"
(Rarely, usually when instant revocation is mandatory, for example an internal banking
application.)
-->

---

## Principle 1: Input Validation on the Server Side

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-13.svg)

- Form validation (Chapter 8) only gives quick feedback to the user
- The one-sentence rule: the client is an environment that cannot be trusted

<!--
Trimmed to the picture (the diagram says this):
- The sender of a request is not always your application: the endpoint can be called with curl
- The server re-validates data types, lengths, email format, and required fields
- Client data is never concatenated directly into an SQL command (**SQL injection**)

Those three bullets are the chain and its two arrows: a request arrives from anywhere, the server
re-validates it, and the server builds the query without ever concatenating what the client sent.
The picture's middle stage is the slide's title. What stays is the judgement no stage can make —
that form validation is only feedback (with its Chapter 8 pointer, which a stage cannot carry), and
that the client is an environment that cannot be trusted.

Emphasize that client validation is never removed, only its role changes: it is for the user's
convenience, not for security.

A cheap demonstration: send one request through an API testing tool with a wrong field, then
show the server rejecting it. That rejection message proves server validation works.

Warning: never write "client validation is enough" in a practicum report; in the Final Project
rubric this is part of the security aspect.
-->

---

## Principle 2: No Secret Key in the Application

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-14.svg)

- JWT signing keys and third-party API keys live only on the server
- The client may store only the result of authentication, and only through SecureStore

<!--
Trimmed to the picture (the diagram says this):
- JavaScript code is bundled into files and can be taken apart from the APK
- Once one user takes the application apart, every user is at risk

Those two bullets are the chain: the code ships inside the APK, one user takes it apart, and
because that file is identical on every device, one leak is every user's leak. The picture draws
the escalation; the two bullets left on the slide state the rule that follows from it — where a
key may live, and the only thing the client is allowed to keep.

Emphasize the asymmetry of the risk: one leak on the client affects all users, not only the
user who took the application apart.

Tie it to Chapter 15: what may live on the client is public configuration such as
EXPO_PUBLIC_API_URL, not secrets; server secrets are kept as environment variables on the
server side.

Essay question 2 in the chapter uses this scenario; use it as a follow-up exercise.
-->

---

## Principle 3: HTTPS Is Mandatory in Production

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-15.svg)

- An eavesdropper on the same network can read them: a **man-in-the-middle** attack (MITM)
- Android 9 (API 28) blocks *cleartext* traffic in production builds

<!--
Trimmed to the picture (the diagram says this):
- Without HTTPS, email, passwords, and tokens are sent as **cleartext** (plaintext)
- **TLS** (*Transport Layer Security*) encrypts the request and the response
- HTTP to `localhost` is only a local development exception, not for production

Those three bullets are the two panels and both rows: what the data looks like on the wire with
and without TLS, and where an unencrypted connection is still allowed to be used. What stays on
the slide is the attack itself (a man in the middle reading someone else's password — a picture
of two messages cannot show a third party) and the Android 9 / API 28 block, which is a platform
rule with a version number in it.

The scenario that makes it concrete: the same campus Wi-Fi, a student running a network
sniffing tool, and a friend's password shown as text. Ask: "Who is at fault in this scenario?"
(The developer who let production run without HTTPS.)

Answer the question that often comes up in the practicum: why may the practicum use HTTP?
Because Expo Go allows HTTP to localhost for development. Mark it version-sensitive: Expo Go's
cleartext policy can change between versions, so match it with the official documentation
before the semester runs.

Sum it up in one sentence: HTTP only for your own development machine, HTTPS for everything
else.
-->

---

## Principle 4: Least Privilege (Smallest Access Rights)

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-16.svg)

- Give users, functions, and applications only the rights they truly need
- A student application does not receive admin rights just because login succeeded
- Least privilege narrows the attack surface

<!--
Trimmed to the picture (the diagram says this):
- Device permissions are requested when the feature is used, not all at once when the application opens
- Token claims are made as few as possible; API access is limited per role

Those two bullets are the three bands: the permission on the device, the claims in the token, the
access the server allows. What stays on the slide is the principle itself, the counter-example
everyone recognises (admin rights because login succeeded is not a right, it is a bug), and what
the rule buys — a narrower attack surface. None of those three is a band.

Tie it to Chapter 12 for device permissions: the camera is requested when the user presses the
photo button, not when the application opens.

Emphasize that this principle applies on three layers at once: device permissions, the claims
inside the token, and the data the server sends in every response.

Guiding question: "The application only displays a name and a role, but the login response
contains a national ID number and an address. What is violated?" (Least privilege; this case
appears again in the case study after this.)
-->

---

## The Complete Flow: Login → Token → Access API → Logout

1. The user sends an email and a password through the Login screen
2. The auth server answers with a JWT token if the credentials are valid
3. The application stores the token in SecureStore (encrypted, not AsyncStorage)
4. Every API call includes the `Authorization: Bearer <token>` header
5. Logout deletes the token from SecureStore and then `Redirect`s to `/login`

> Logout in a token architecture means throwing away the key on the client; the server has no session to close.

<!--
Make this slide the practicum map: every step has its own file, and students can point to which
code does which step.

Mention the four design decisions in the flow: the token is accepted only from a legitimate
server, stored encrypted, sent back through the Authorization header with the Bearer scheme,
and deleted at logout.

One branch that does not appear in the steps above: if the token is lost or expired, the next
request is rejected with 401 and the user is redirected back to the login screen.
-->

---

## Diagram: The Complete Flow: Login → Token → Access API → Logout

![w:1120](assets/diagrams/bab-13-autentikasi-dan-keamanan-aplikasi-05.svg)

<!--
Picture only, so the five steps on the previous slide stay whole. Read it downwards: who talks
to whom, and where the token lives between two messages.

Point at the last loop: no arrow leaves the application, because on the server there is no
session to close. That is the whole cost and the whole benefit of statelessness in one line.
-->

---

## Chapter 13 Practicum: What Is Built

- Continuing the Student Data Management application from the Chapter 10 practicum
- Register an account through `/api/auth/register`, sign in through `/api/auth/login`
- The token is stored in SecureStore; the student list only appears with a token
- First test: the application is opened without a token → the Login screen appears, not Home
- Second test: after logout, access to `/(app)/mahasiswa` is rejected and redirected to `/login`

<!--
This practicum is the authentication milestone of the Final Project, so ask students to keep
screenshots as evidence: the Login screen on the first open, the greeting with the user's name
on Home, and the access rejection after logout.

Mention the other results that are in the chapter but not tested in class because of time:
closing and reopening the application without logging out should keep the user signed in (the
token is read from SecureStore), and reinstalling the application deletes the token because it
is stored in the device's secure area.

Time warning: the practicum steps require writing the storage utility, the API caller, the
authentication provider, and three route files at once, so it will not finish in one meeting if
typed from scratch; ask students to prepare the base files before the practicum.
-->

---

## Core Code: The Token in Every Request

`api/client.js` — Code 2 (trimmed so it fits on the slide)

```js
export const BASE_URL = 'http://localhost:3000'; // emulator Android: http://10.0.2.2:3000

async function kirim(method, path, { body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`; // token disisipkan di sini
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error((data && data.pesan) || `Permintaan gagal (status ${response.status})`);
  return data;
}
```

<!--
Emphasize only one line: the insertion of the Authorization header with the Bearer scheme. This
is the point where the token moves from storage into the request.

Explain the reason for centralizing the fetch calls in one file: handling 401 and server error
messages only needs to be written once, and all screens share the same behavior.

Mention the "Network request failed" practicum problem from the chapter: the cause is a wrong
BASE_URL, the server not running yet, or the Android emulator being unable to use localhost.
For the emulator, use http://10.0.2.2:3000; for Expo Go on a device, use localhost or the
computer's IP.

Authoring note: the full version is in the chapter (Code 2); this slide shows only the send
function and the lines that determine the token flow, while loginApi, registerApi, and
ambilMahasiswa that call it are read directly in the chapter.
-->

---

## e-Kampus Case Study: Four Audit Findings

**Illustrative example** — the case in this chapter, with real patterns of weakness.

| Finding | Principle violated |
|---|---|
| Token stored in AsyncStorage | Storing secrets on insecure media (13.5) |
| The profile and student list endpoints are unprotected | Inconsistent route protection (13.4) |
| Plain HTTP communication on the campus Wi-Fi | No HTTPS (13.6) |
| The login response contains the whole profile (national ID number, address) | Least privilege (13.6) |

<!--
Present it as a story, not as a list: the campus has an e-Kampus application, six months later
there are news reports of a data leak, and the audit finds four patterns of weakness that are
actually common in many systems.

Ask students to guess which principle is violated before the right column appears. This way
tests the understanding of 13.5 and 13.6 at once.

Warning: this case is composed as a learning story; do not present it as an incident report of
a particular higher-education institution.
-->

---

## Case Study: The Auditor's Order of Fixes

1. Move the token to SecureStore, remove sensitive data from the login response
2. Protect every server route that carries personal data, not only some
3. Require HTTPS in production; limit HTTP to local development only
4. Apply minimal data requests: only the fields that will truly be displayed

> Security is a system, not a single feature.

<!--
Emphasize the order and the reason: the biggest fix with the smallest change comes first. Moving
token storage and trimming the login response touch only a few files, but close the biggest
risk.

Guiding question: "If the budget only covers one fix, which is chosen?" (Answer: fix a in the
first point.)

Tie it to the Final Project mindset: every design decision is tested with the question "what if
a malicious person holds this device?".
-->

---

## Application in IS/IT Practice

| Principle | Test question before release |
|---|---|
| Secret storage | What if a malicious person holds this device? |
| Server protection | Which endpoints carry personal data and are not yet protected? |
| Transport | Does the production server still accept plain HTTP? |
| Least privilege | Which data and claims does the application not actually need? |

- These four questions become part of the QA checklist in Chapter 14

<!--
Show that these four questions can be used as a checklist on the Final Project, and the results
become material for the QA report in Chapter 14.

Emphasize that the security weight in the Final Project rubric is indeed small, but a data leak
cancels the score of the other components: an application whose data is open cannot be called
finished.

If time remains, ask each group to write one answer for one question about their own
application.
-->

---

## Exercises and Discussion

<div class="grid2">
<div>

**Group discussion (5 minutes)**

- Which principle do you most easily forget when building your own application?
- Which decision would you fight for in the campus team: token storage or HTTPS?

</div>
<div>

**Selected exercises**

- Comprehension question 4: why is client protection alone not enough?
- Practice question 1: sign out automatically when the server answers 401
- Analysis question 1: assessing a password stored in the JWT payload

</div>
</div>

<!--
Give 5 minutes in pairs for the left column, then collect 2–3 answers. A strong answer names
the reason and not just the name of the principle.

For the analysis question, the expected answer touches three things: the password can be read
by anyone from the payload, the correct fix is to call the profile endpoint, and the impact if
the token leaks before it expires.

Assessment reminder: practice questions 1 and 3 in the chapter are strong candidates for
assessment in the following practicum.
-->

---

## Summary

1. Authentication proves identity; authorization determines access rights
2. A session stores state on the server; a token makes the server stateless
3. JWT = header.payload.signature; authenticity is guaranteed by the signature, not by encryption
4. A protected route governs the experience; data security is determined by the server
5. The token is stored with `expo-secure-store`, not AsyncStorage

<!--
Do not read it out. Ask five students to explain one number in their own words; if wrong,
correct on the spot before the meeting ends.

What is not yet written on the slide and needs to be said aloud: the four API security
principles, and the meaning of logout as throwing away the key on the client.

Closing message: ask "what if a malicious person holds this device?" at every design decision
that follows.
-->

---

## References

| Source | Link |
|---|---|
| Expo documentation — SecureStore (2026) | docs.expo.dev |
| Expo documentation — Expo Router (2026) | docs.expo.dev |
| React Native documentation (2026) | reactnative.dev |
| Express documentation (2026) | expressjs.com |
| MDN Web Docs — HTTP and JavaScript (2026) | developer.mozilla.org |

<!--
The complete references are in Appendix D; terms such as JWT, Secure Storage, and Token are
explained in Appendix C (glossary).

Remind them that the Expo and MDN documentation is version-sensitive: re-check the SecureStore
version and the cleartext behavior before using them in production code.
-->

---

## Related Chapters and Technology Versions

<div class="grid2">
<div>

**Related chapters**

- Chapter 7 — introduction to protected screens and route groups
- Chapters 10 and 11 — fetch and local storage
- Chapter 12 — device permissions and least privilege

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
Remind them that the four related chapters were already discussed earlier and are only reused
here: Chapter 7 for route groups, Chapter 10 for fetch, Chapter 11 for local storage, and
Chapter 12 for device permissions.

Read the technology versions as they are, do not adjust them yourself if the libraries on the
students' computers are newer; a version mismatch is the most common cause of practicum errors.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 14

**Practicum:** complete the login → token → access API → logout flow, then submit screenshot evidence as the project's authentication milestone.

Next in this session: Chapter 14 — Debugging, Testing, and QA alongside Chapter 15 — Build & Deployment.

<!--
Close with one sentence: "This chapter teaches the application to guard the door; the next
chapter teaches us to inspect every room before it is handed over to the user."

State the screenshot submission deadline explicitly, and tie it to the practicum rubric
(Appendix A): conceptual understanding 15%, implementation 25%, code quality 15%, UI/UX 15%,
debugging 10%, documentation 20%.
-->
