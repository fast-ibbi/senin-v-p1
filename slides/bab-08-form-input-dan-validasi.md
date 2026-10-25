---
marp: true
theme: academic
paginate: true
title: "Chapter 8 — Forms, Input, and Validation"
description: "Mobile Programming lecture, meeting 9: TextInput and keyboard handling, the controlled component, single-object form state, validation with pure functions, error message UX, the FormField component, and the implementation of three application forms."
author: "Course Instructor — Information Systems / Informatics Engineering Study Program"
footer: "Mobile Programming · Chapter 8 — Forms, Input, and Validation"
size: 16:9
---

<!-- _class: lead -->
<!-- _paginate: skip -->
<!-- _footer: "" -->

# Chapter 8 — Forms, Input, and Validation

From user typing to data worth storing · Meeting 9 · Sub-CPMK 4.3

<!--
Opening hook: "Chapter 7 gave the app an address; today we give that address its
contents — and make sure the contents are correct before they are sent."

Mention the RPS link: meeting 9 covers Chapter 8 (Sub-CPMK 4.3) and continues with
Chapter 9 (Sub-CPMK 4.2) in a separate deck. The three forms in this chapter are a
direct continuation of the routes created in Chapter 7.
-->

---

## Learning Objectives

- Explain the main `TextInput` props and strategies for handling the mobile keyboard
- Analyze the `controlled component` and state as the single source of truth
- Design a single-object form state with a reusable `handleChange`
- Implement validation with pure functions and per-field error messages
- Evaluate the trade-off of a disabled submit button and design `FormField`

<!--
Read out only the verbs. Objectives 4 and 5 are the core of this meeting; objective 5
deliberately uses the word "evaluate" because students must be able to explain the
reason behind a choice, not merely copy code.

Ask as an opener: "Who has ever pressed a save button and nothing happened?" Keep that
question for the disabled button trade-off slide.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 1 — TextInput and Keyboard Handling

Section 8.1 · Main props, `keyboardType`, and the virtual keyboard

<!--
This part looks technical, yet this is where most user complaints come from: fields
covered by the keyboard and buttons that must be pressed twice.

If meeting time is tight, compress the props table (students can read it themselves),
but do not skip the "Handling the Virtual Keyboard" slide.
-->

---

## Context: Bad Data Is a Cost

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-05.svg)

**Garbage in, garbage out** — bad data that goes in will produce bad output as well.

- A wrongly formatted NIM → the database report has to be corrected again and again
- Form validation is the first line of defense, not the only one

> Defense in depth: the client (this chapter), the server (Chapter 10 and Chapter 13), and the database schema.

<!--
Do not start from code. Start from cost: every data correction at the academic office
consumes administrative time and can delay the issuing of a KRS or a transcript.

Guiding question: "If one student mistypes an email during re-registration, who is
harmed?" (The student, the academic advisor, the academic staff — a chain.)

Warning: students often assume client validation is enough. Stress that the app is not
the only entry point for data.

Trimmed to the picture (the diagram says this):
- A misspelled email → academic information does not reach the student
- A phone number short of digits → the academic advisor cannot reach the parents
-->

---

## TextInput: It Does Not Store Its Own Value

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-06.svg)

**TextInput** is the core React Native component for accepting one-line or multi-line typing (`multiline`) from the user.

- Every keystroke fires an `onChangeText` event with the new text
- The typed value must be stored by another component, usually React state
- This characteristic is what gives rise to the *controlled component* (Section 8.2)

> `value`, `onChangeText`, and `placeholder` are a mandatory conceptual pair in every form field.

<!--
Analogy: TextInput is like a whiteboard that stores nothing — if nobody writes it down,
the writing disappears when the board is erased.

Guiding question: "If TextInput does not store its value, who does?" (React state —
that is the essence of the controlled component.)

Warning: students often assume `value` only displays an initial value, when in fact
`value` binds the field to state at all times.
-->

---

## Table 8.1 — Main TextInput Props (1/2)

| Prop | Function | Example value |
|---|---|---|
| `value` | The text value displayed, controlled from outside | `{form.email}` |
| `onChangeText` | Called every time the text changes | `(teks) => handleChange('email', teks)` |
| `placeholder` | Example text shown while the field is empty | `"example: 2201001"` |
| `keyboardType` | Type of virtual keyboard that appears | `"email-address"`, `"number-pad"` |
| `secureTextEntry` | Masks the typing for a password | `secureTextEntry` |
| `autoCapitalize` | Automatic capitalization of text | `"none"`, `"sentences"`, `"words"` |

<!--
Do not read them one by one. Show that the first three rows are the mandatory pair
for every field, then go straight to `keyboardType`.

Guiding question: "Why should NIM preferably use `number-pad`?" (It brings up the
numeric keypad, so typing errors are fewer.)

Warning: this chapter's email field uses `autoCapitalize="none"` and `autoCorrect={false}`
because email is case-sensitive — do not copy the `"words"` value from the name field.
-->

---

## Table 8.1 — Main TextInput Props (2/2)

| Prop | Function | Example value |
|---|---|---|
| `autoCorrect` | Automatic spelling correction | `autoCorrect={false}` |
| `returnKeyType` | Label of the Enter button on the keyboard | `"next"`, `"done"` |
| `maxLength` | Limit on the number of characters that can be typed | `maxLength={10}` |
| `multiline` | Allows more than one line | `multiline` |
| `onSubmitEditing` | Called when the Enter button is pressed | `onSubmitEditing={handleSubmit}` |
| `editable` | Locks the field so that it cannot be edited | `editable={false}` |

> Email uses `autoCapitalize="none"` and `autoCorrect={false}` because email addresses are case-sensitive.

<!--
Tie `autoCorrect` to a real case: spelling correction often damages email addresses.

Guiding question: "Which field deserves `editable={false}`?" (NIM in edit mode — the
identity key must not change.)

Warning: `maxLength` limits the number of characters; it does not validate the content.
NIM still needs `validasiNim` so that it contains only digits.
-->

---

## Handling the Virtual Keyboard

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-07.svg)

- The virtual keyboard takes up half the screen and covers the lower fields
- The `returnKeyType` chain `"next"` → `"next"` → `"done"` without touching the screen

```jsx
// behavior berbeda antar platform, jadi polanya disesuaikan Platform.OS
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
```

> Without `keyboardShouldPersistTaps`, the first tap only closes the keyboard and the button must be pressed twice.

<!--
Demonstrate live: open the form, type in the bottom field, then watch whether the save
button stays visible and responds to a single tap.

Guiding question: "Why does the device not provide a natural way to close the
keyboard?" (There is no physical button; the only way is the system back button.)

⚠ version-sensitive: `keyboardType` values and `behavior` behavior can differ slightly
between SDK versions and platforms — check reactnative.dev for the current values.

Trimmed to the picture (the diagram says this):
- `KeyboardAvoidingView` shifts the content so the field stays visible
- `keyboardShouldPersistTaps="handled"` makes a button respond to a single tap
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 2 — Controlled Component and Form State

Sections 8.2 and 8.3 · State as the single source of truth

<!--
This part is the conceptual core of the chapter. If students understand only one thing
from this meeting, let it be this part: every form pattern in later chapters stands on it.

Stress that the controlled pattern is not a matter of writing style but a prerequisite
for making validation and form reset possible.
-->

---

## Controlled Component: Single Source of Truth

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-08.svg)

**Controlled component** is a pattern in which the input value is fully determined by React state: `value` holds the contents of state, and every keystroke only changes it through `onChangeText`.

```jsx
<TextInput
  value={form.email}
  onChangeText={(teks) => setForm((s) => ({ ...s, email: teks }))}
  placeholder="nama.kecil@students.univ.ac.id"
/>
```

- The text displayed and the application state are always identical — with no second copy
- The value in state can be read, validated, changed, and reset at any time

<!--
Analogy: an input value is like a bank balance — there is no "second record book" that
may differ; whatever is displayed must come from one source.

Guiding question: "What makes edit mode possible on a form?" (Because the form value
lives in state, it can be refilled programmatically from old data.)

Warning: the uncontrolled pattern with `defaultValue` is still valid for very simple
cases, but a validated form almost always uses the controlled pattern.
-->

---

## Form State: One Object, One handleChange

`File: screens/FormMahasiswa.js`

```jsx
const [form, setForm] = useState({
  nim: '', nama: '', prodi: '', angkatan: '',
  ipk: '', email: '', telepon: '',
});

function handleChange(namaField, nilai) {
  setForm((sebelumnya) => ({
    ...sebelumnya,
    [namaField]: nilai,
  }));
}
```

- One function serves every field through the computed key `[namaField]`
- The object keys exactly match the field names and the student data structure

<!--
Slide quote (moved here to keep the slide inside the page): The standard structure:
`{ nim, nama, prodi, angkatan, ipk, email, telepon }` — used from Chapter 4 through Chapter 8.

Stress that `[namaField]` is the computed key from Chapter 3: the key name is only
determined while the function runs, so one function is enough for seven fields.

Guiding question: "How many `handleChange` functions are needed for seven fields?"
(One — that is the main benefit of this pattern.)

Warning: `...sebelumnya` is mandatory; without it every other field is erased. This
mistake is discussed on the "What Happens If…?" slide after the next one.
-->

---

## Pros and Cons of a Single Object

<div class="grid2">
<div>

**Pros**

- Resetting the form only means refilling the object
- Sending to the server only needs sending `form` (Chapter 10)
- Validation runs against one whole object

</div>
<div>

**Cons**

- Every keystroke must spread the old object
- Risk of overwriting other fields if the spread is forgotten

</div>
</div>

> For small to medium-sized forms, readability and ease of reset beat the complexity of the code lines.

<!--
Show that this decision is not right-versus-wrong but a trade-off — just like the
trade-off analysis in Chapter 1.

Guiding question: "If there are only two fields, is one object still better?" (For
pattern consistency, yes; the limits of the pattern show up when a form gets very big.)

Warning: the "forgot to spread" mistake raises no error on screen — the value vanishes
silently, which makes it hard to trace while debugging.
-->

---

<!-- _class: center -->

## What Happens If…?

- …`handleChange` writes `setForm({ [namaField]: nilai })` without spreading the old object?
- …`value` is given fixed text (`value="budi.santoso@students.univ.ac.id"`), not from state?
- …the user presses save before touching a single field?

Discuss for 2 minutes in pairs, then tie it back to validation in Part 3.

<!--
Do not leak the answers; let the class reason. Expected answers: (1) the other six
fields are erased, only the field that was typed remains; (2) the field becomes
read-only — typing does not appear because state never changes; (3) all fields report
"This field is required" at once because full validation runs on submit.

This is not a quiz, so the answers may be discussed right in the classroom; the question
prepares students for the validation pattern in Part 3.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 3 — Validation, Error, and Form UX

Sections 8.4 to 8.6 · Pure functions, error messages, and `FormField`

<!--
This is the longest part and the part assessed in the practicum. If the meeting is split
in two, this part is the one that most deserves full time.

Keep linking back to Chapter 14: pure functions were chosen deliberately so that
validation rules are easy to test automatically without running the interface.
-->

---

## Validation: Definition and the Pure Function Contract

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-09.svg)

**Validation** is the process of making sure the data the user enters meets the rules before it is used.

- Written as a **pure function**: same input, same output, no side effects
- All validation functions live in one file, `utils/validators.js`
- Contract: a value comes in → an error message (string) or the empty string `''` comes out
- A one-way contract makes the function easy to reuse and to test (Chapter 14)

> Adding a new rule means adding one function, not adding validation logic inside the screen.

<!--
Stress the word "pure": the function does not change state, does not call an API, does
not write anything. It only answers one question: "is this value acceptable?"

Guiding question: "Why is the error message returned as a string, not a boolean?"
(So the screen can simply display the message — no message translation table is needed.)

Warning: students often put validation inside the screen's `handleChange`. That makes
the rules impossible to re-test and impossible for other forms to reuse.
-->

---

## Code: Three Core Functions in validators.js

`File: utils/validators.js`

```js
export function wajibDiisi(nilai = '') {
  return nilai.toString().trim() === '' ? 'Field ini wajib diisi' : '';
}
export function validasiEmail(nilai = '') {
  const teks = nilai.trim();
  if (teks === '') return '';
  const pola = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pola.test(teks) ? '' : 'Format email tidak valid (contoh: nama@domain.com)';
}
export function validasiPassword(nilai = '') {
  if (nilai === '') return '';
  return nilai.length >= 6 ? '' : 'Kata sandi minimal 6 karakter';
}
```

> All three follow the same contract, including the `if (teks === '') return ''` line.

<!--
Show only three things: `trim()` makes spaces count as empty, the regular pattern is
deliberately simple (not the RFC 5322 specification), and each function returns an empty
string when the value is empty — so the "required" rule that comes first is the one shown.

Guiding question: "Why does `validasiEmail('')` return an empty string rather than an
error message?" (So that the emptiness check is the job of `wajibDiisi`, and the rule
order determines which message appears.)

Warning: this pattern catches 99% of typos, but it is not a fully specification-compliant
email validation — state this limit honestly in class.
-->

---

## Table 8.2 — Validation Rules (1/2)

| Function | Rule | Example error message |
|---|---|---|
| `wajibDiisi` | The value must not be empty (spaces ignored) | "This field is required" |
| `validasiEmail` | A simple email pattern | "Invalid email format" |
| `validasiPassword` | At least 6 characters | "Password must be at least 6 characters" |
| `validasiKonfirmasiPassword` | Must match the password | "Password confirmation does not match" |
| `validasiTelepon` | 10–13 numeric digits | "Phone number must be 10 to 13 digits" |

<!--
Do not read it line by line. Group it: the first two rules are "the basic rules that are
almost always there", the rest are more specific rules.

Guiding question: "Which rule takes two arguments, and why?" (Password confirmation — it
needs the value of another field as a comparison.)

Warning: `validasiPassword` only enforces a minimum length of 6 characters. Stricter
password-strength rules are a security policy decision in Chapter 13.
-->

---

## Table 8.2 — Validation Rules (2/2)

| Function | Rule | Example error message |
|---|---|---|
| `validasiPanjang` | Does not exceed the maximum length | "Maximum 50 characters" |
| `validasiNim` | Digits only, at most 10 | "NIM may only contain digits" |
| `validasiAngkatan` | 4 digits, range 2000–2030 | "Cohort is 4 digits, example: 2024" |
| `validasiIpk` | A decimal number 0.00–4.00 | "GPA must be between 0.00 and 4.00" |

> `validasiTelepon` strips every non-digit character first, so `0812-3456-7890` counts as 12 digits and is declared valid.

<!--
Read the blockquote slowly — the principle matters: what is validated is the intent of
the data, not the style of typing it. Users write a number in different styles, but the
system only needs the digit count to be right.

Guiding question: "What would happen if we forced the format `08xx-xxxx-xxxx`?" (Users
who write `+62 812...` are rejected even though the number is right — frustration for no
reason.)

Warning: `validasiIpk` normalizes the Indonesian decimal comma into a dot before the
numeric conversion; without that, `3,45` becomes `NaN`.
-->

---

## jalankanAturan: Stop at the First Message

`File: utils/validators.js`

```js
export function jalankanAturan(aturan, nilai, konteks) {
  for (const fungsi of aturan) {
    const pesan = fungsi(nilai, konteks);
    if (pesan !== '') return pesan;
  }
  return '';
}
```

- The rules table per field: `email: [wajibDiisi, validasiEmail]`
- The first error message found is returned immediately
- The `konteks` argument is used by rules that need another field's value

> The order of the rules determines which message appears first — "required" is always in front.

<!--
Explain that this is the "rules as data" pattern: the rules table lists functions, and
one small engine runs them. Adding a new rule does not touch the display code.

Guiding question: "Why does the check stop at the first message instead of collecting
every message for one field?" (One field needs only one message so the screen does not
get crowded; the user fixes one problem at a time.)

Warning: the `konteks` argument is optional — only the password confirmation rule
currently uses it.
-->

---

## When Validation Runs, and the Pattern Chosen

| Moment | Character |
|---|---|
| On submit | A complete list of errors, without disturbing the typing |
| When the field is left (*on blur*) | Feedback after the user has finished filling it in |
| While typing (*real-time*) | Responsive, but annoying on a field that was just touched |

> The choice in this chapter: full validation on submit, then real-time validation per keystroke after the first submit attempt (the `sudahDikirim` state).

<!--
Stress the phrase "after the first submit attempt": before that, no error message
appears while typing. This is what separates a form that helps from a form that nags.

Guiding question: "What is the value of `sudahDikirim` before and after the first
submit?" (`false` then `true` — and only after that does `handleChange` re-validate.)

Warning: students often compute errors in `handleChange` unconditionally. The result is
that the "required" message appears as soon as the user touches the first field.
-->

---

## Flow: from Keystroke to Error Message

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-02.svg)

> One keystroke updates state; one button press checks every field at once.

<!--
This diagram summarizes Section 8.7 in one picture; Additional note: the 1–4b numbering
exists to ease following it during a presentation, it is not part of the source code.

Walk through it with the class: start from the left, and stress the last branch —
validation decides whether data is reported via `onSubmit` or stops as an error message.

Warning: paths 4a and 4b do not run at the same time. If even one field fails, `onSubmit`
is never called.
-->

---

## UX Principles for Error Messages

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-10.svg)

- **Specific and close to the field** — "Invalid email format (example: …)"
- **Two signals at once** — a red border *and* the message text

> Color alone is not enough: some users are color-blind and screen readers do not read it.

<!--
Tie the "two signals" principle to the accessibility of Chapter 6: color is an extra
signal, the message text is the main signal.

Guiding question: "Why must a field that fails validation not be cleared?" (The user
would have to retype from scratch and would actually add new mistakes.)

Warning: these four principles are numbered in Section 8.5; the label and placeholder
rules come from a separate paragraph and are discussed on the next slide.

Trimmed to the picture (the diagram says this):
- **Consistent and brief** — short sentences, without excessive exclamation marks
- **The value is not cleared** — the user only fixes the part that is wrong
-->

---

## Permanent Label vs Placeholder

- A **label** ("Email") explains the name of the field and is always visible
- A **placeholder** (`nama.kecil@students.univ.ac.id`) gives an example value, then disappears
- A placeholder must not replace the label
- As soon as the user types, that hint vanishes and the field is left without a name

> `FormField` always renders the label above the field, separate from the placeholder (Section 8.6).

<!--
Stress the distinction between the two roles: a label explains what the field is for,
while a placeholder only gives an example value. Only the label survives after typing.

Guiding question: "What disappears from the screen as soon as the user types in a field
that only uses a placeholder?" (The field name — the user loses the hint for its contents.)

Warning: placeholders are often used in place of labels because they look tidy; stress
that the hint vanishes as soon as the user starts typing.
-->

---

## Diagram: Permanent Label vs Placeholder

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-04.svg)

<!--
The picture is the previous slide written as three matched rows: what each thing is for,
when it is on screen, and how the two relate. Read it top-down on the left, then top-down
on the right — row 1 against row 1, row 2 against row 2 — rather than left panel then
right panel.

Row 2 carries the lesson: the label is always visible, the placeholder disappears. When a
field has only a placeholder, its name is gone the moment the user starts typing.
-->

---

<!-- _class: center -->

## Think-Pair-Share: A Frustrating Form

- Pick one form in an app that has ever frustrated you
- Decide: when does its validation run, and how are its error messages presented
- Score those findings against the four principles just discussed

2 minutes in pairs, then 2–3 pairs report their findings.

<!--
Give a real 2 minutes and walk around the room. The aim of this exercise is to get
students used to judging a form as a designer, not merely as a user.

Strong answers mention: an "input is wrong" message with no hint for fixing it (breaking
the specific principle), real-time validation that barks the moment a field is just
touched, or a button that does not respond because the keyboard is still open.

Warning: if an answer stops at "the app is bad", steer it toward a technical question —
"when does its validation run, and what signal does it give?"
-->

---

## Trade-off: Disabled Button vs Submit Validation

| Strategy | When it wins | Weakness |
|---|---|---|
| Disabled submit button | Sending is expensive, for example calling an API directly | No error message ever appears when the button is refused |
| Disabled + *on blur* validation | Feedback still exists without pressing the button | Two mechanisms run at the same time |
| Validation on submit | The form requirements need to be transparent with per-field messages | The button is always active, so invalid data is still attempted |

- An example of the disabled pattern: `FormSaran` with `disabled={!formValid}` and `onBlur`

> This chapter chooses validation on submit + real-time after the first attempt.

<!--
Present it as an honest debate, not as "one is right, one is wrong". A disabled button
guarantees that the data sent always passes client validation — that is a real advantage.

Guiding question: "When does a gray button actually harm the user?" (The user does not
know which requirement is unmet, especially on a long form; a gray button is also less
accessible.)

Warning: the forms in this chapter are small to medium-sized and the goal is mastering
the error handling pattern, not preventing submission. State that reason to the class.
-->

---

## FormField: One Component, Many Uses

`File: components/FormField.js`

```jsx
export default function FormField({ label, error, ...propsLain }) {
  const tampilkanError = error !== undefined && error !== '';
  return (
    <View style={styles.wadah}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, tampilkanError && styles.inputError]}
        {...propsLain} />
      {tampilkanError && <Text style={styles.pesanError}>{error}</Text>}
    </View>
  );
}
```

- `...propsLain` forwards the remaining props to `TextInput`
- Usage: `<FormField label="Email" error={errors.email} />`
- One source of styles for three forms — visual consistency is guaranteed

<!--
Show the two Chapter 3 techniques meeting here: the rest operator collects the remaining
props, and spread passes them back to TextInput — the key to this component's reusability.

Guiding question: "What has to change if the error border color changes?" (One place:
`styles.inputError` — not three form screens.)

Warning: `label` and `error` are deliberately "consumed" by FormField so they are not
forwarded to TextInput; the other props arrive automatically without being registered.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Part 4 — Implementation and Case Study

Section 8.7 · Login, Registration, and Student Data forms

<!--
This part assembles all the material into three whole forms. Once one form is
understood, the other two read without new effort — that is the main message of this part.

Remind them that this meeting's practicum centers on FormMahasiswa and the
`app/(app)/mahasiswa/tambah.js` route from Chapter 7.
-->

---

## File Map and Responsibilities

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-03.svg)

> Four layers: validation rules, field appearance, form logic, and the data owner.

<!--
Explain the separation of responsibilities: the route arranges the screen's position in
navigation, the screen arranges its contents and behavior, FormField arranges the field
appearance, and validators.js arranges the rules.

Additional note: this diagram summarizes the four layers named in the Code Explanation
part of the chapter, it is not a figure from the book.

Guiding question: "When is this separation felt to pay off?" (When local storage is
replaced by an API in Chapter 10 — the form code needs no change.)
-->

---

## Table 8.3 — Mapping Forms to Routes

| Form | Screen file | Route (created in Chapter 7) |
|---|---|---|
| Login | `screens/FormLogin.js` | `app/login.js` — placeholder replaced |
| Registration | `screens/FormRegistrasi.js` | `app/registrasi.js` — new route |
| Student Data | `screens/FormMahasiswa.js` | `app/(app)/mahasiswa/tambah.js` |

> A route arranges the *position* of the screen in navigation; the screen arranges its *contents* and behavior.

<!--
Stress that separating the `screens/` folder from the route files is an application of
the separation of responsibilities, not merely folder tidiness.

Guiding question: "Why is `app/registrasi.js` called a new route?" (Chapter 7 had not
prepared it; the pattern is the same as `app/login.js`.)

Warning: route file names are written all lowercase, following the Chapter 7 convention.
-->

---

## The Same Internal Pattern in Three Forms

1. `ATURAN_*` — the rules table per field
2. `validasiSatuField` — runs `jalankanAturan` for one field
3. `validasiSemuaField` — collects the messages into an `errors` object
4. `handleChange` — updates the form; real-time when `sudahDikirim`
5. `handleSubmit` — validates, fills `errors`, calls `onSubmit`

> The three differ only in the list of fields and the rules.

<!--
This is the key slide for reading the code quickly: if students have mastered FormLogin,
FormRegistrasi and FormMahasiswa are only longer lists of fields.

Guiding question: "Which part differs between FormLogin and FormMahasiswa?" (The list of
fields and the rules table; the other five mechanisms are identical.)

Warning: `Object.values(hasil).every((pesan) => pesan === '')` is the whole-form check —
one failed field means the form is not valid yet.
-->

---

## FormRegistrasi: Validation That Needs Another Field

![w:1120](assets/diagrams/bab-08-form-input-dan-validasi-11.svg)

`File: screens/FormRegistrasi.js`

```jsx
const ATURAN_KONFIRMASI = [wajibDiisi, validasiKonfirmasiPassword];

if (namaField === 'konfirmasiPassword') {
  return jalankanAturan(ATURAN_KONFIRMASI, nilai, form.password);
}
```

- If `password` changes, the `konfirmasiPassword` error is recomputed too
- Cross-field synchronization is only possible thanks to the single source of truth

<!--
This is the only place in the chapter where validation needs the value of another field.
Explain the scenario: the user types "confirmation" first, then changes the password —
a confirmation that was correct becomes wrong.

Guiding question: "Why must the confirmation error be recomputed when the password
changes?" (Because its comparison changes, so the old conclusion no longer holds.)

Warning: a rule named `ATURAN_NAMA` uses the arrow function
`(nilai) => validasiPanjang(nilai, 50)` so that a parameterized rule still fits
`jalankanAturan`.

Trimmed to the picture (the diagram says this):
- `validasiKonfirmasiPassword` takes the password as the comparison context
-->

---

## FormMahasiswa: Program Chips and Numeric Fields

`File: screens/FormMahasiswa.js`

```jsx
<Pressable
  key={prodi}
  onPress={() => handleChange('prodi', prodi)}
  style={[styles.chip, aktif && styles.chipAktif]}
>
  <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>{prodi}</Text>
</Pressable>
```

- Chips are friendlier to a touchscreen than a dropdown: no scrolling, generous area
- The NIM, cohort, and GPA fields use a matching `keyboardType` + `maxLength`
- The phone field closes the chain with `returnKeyType="done"` and `onSubmitEditing`

<!--
Explain why chips were chosen: on a small screen, a dropdown list needs extra scrolling
and its touch area is narrow.

Guiding question: "How is the selected program value stored?" (Through
`handleChange('prodi', prodi)`, so that it is validated like any other field.)

Warning: the program field does not use FormField because it is not a text input. Its
error message is rendered separately, and students often forget to add that part.
-->

---

## A Thin Route as Data Owner

`File: app/(app)/mahasiswa/tambah.js`

```jsx
export default function TambahMahasiswa() {
  const [daftarMahasiswa, setDaftarMahasiswa] = useState([]);

  function simpanMahasiswa(dataForm) {
    const dataBaru = { id: Date.now(), ...dataForm };
    setDaftarMahasiswa((lama) => [...lama, dataBaru]);
    Alert.alert('Data Tersimpan', `${dataForm.nama} (${dataForm.nim}) masuk daftar lokal.`);
  }

  return <FormMahasiswa onSubmit={simpanMahasiswa} />;
}
```

- The form screen only reports valid data through `onSubmit`
- Replacing local storage with an API (Chapter 10) does not touch the form code

> This list disappears when the app is closed — the reason Chapters 9, 10, and 11 exist.

<!--
Stress the separation of roles: the route owns the data, the form only reports valid data.
The form does not know, and does not need to know, how that data is used.

Guiding question: "What is `id: Date.now()` for here?" (It gives a unique id for the demo;
a real database will generate its own id.)

Warning: the form really is cleared deliberately after a successful submit. That is
designed behavior, not a bug — the new data is read from `daftarMahasiswa`.
-->

---

## Case Study: Data Quality in the Academic Portal

<div class="grid2">
<div>

**Complaints reaching the helpdesk**

- Email mistyped during re-registration → information does not arrive
- Phone number short of digits → the academic advisor cannot make contact
- NIM and cohort inconsistent → the PDDikti report is corrected again and again

</div>
<div>

**Defense in depth**

- Client (this chapter): `wajibDiisi`, `validasiEmail`, `validasiTelepon`, `validasiNim`
- Server (Chapter 10 and Chapter 13), the database schema, and periodic *data cleansing*

</div>
</div>

> Client validation makes mistakes detected earlier; it does not replace server validation.

<!--
Read it as a story of loss, not as a list of features: every data correction consumes
academic staff time and can delay official documents such as the KRS and the transcript.

Guiding question: "Why are users given per-field messages instead of a disabled button on
a portal serving thousands of students?" (Because explicit messages teach the form
requirements, while a gray button leaves users guessing.)

Warning: the app is not the only data entry point, so old data still needs to be cleaned
up periodically.
-->

---

<!-- _class: center -->

## Mini Quiz

- Where does the value displayed by `TextInput` in a controlled component come from?
- Which combination of props is most appropriate for a password field?
- Why is `validasiTelepon("0812-3456-7890")` declared valid?
- Why can a field's error disappear automatically after the first submit?

<!--
Five-minute oral quiz: show the questions, ask the class to answer together or raise a
hand, then move on to the answer slide. Do not leak the answers on this slide.

If the class answers vary on the third question, repeat the principle "validate the
intent, not the typing style" before closing the meeting.
-->

---

<!-- _class: center -->

## Answers

- From the React state connected through the `value` prop
- `secureTextEntry` and `autoCapitalize="none"`
- The digit count is 12 once the hyphens are removed, inside the 10–13 range
- `handleChange` re-validates the field that changed while `sudahDikirim` is `true`

<!--
Repeat the distinction most often confused: `value` holds state, not TextInput's internal
value.

If many students miss the fourth question, return to the "When Validation Runs" slide
before closing the meeting.
-->

---

## Summary

1. TextInput does not store its own value; state becomes the single source of truth
2. Single-object form state + a generic `handleChange` simplify reset and validation
3. Validation is written as pure functions: a value comes in, an error message or empty string comes out
4. Error messages must be specific, close to the field, give two signals, and not clear the user's value
5. `FormField` makes fields uniform; the form data continues in Chapter 9, Chapter 10, and Chapter 11

<!--
Do not read it out. Ask students to pick one number and explain it in their own words —
this works better than repeating the reading.

Items that are not in the summary but remain important: keyboard handling
(`KeyboardAvoidingView`, `keyboardShouldPersistTaps`) and the `returnKeyType` chain.
Mention them orally so they are not lost.
-->

---

## References

| Source | Link |
|---|---|
| React Native documentation (2026) | reactnative.dev |
| TextInput (React Native) | reactnative.dev/docs/textinput |
| Expo documentation (2026) | docs.expo.dev |
| React documentation (2026) | react.dev |
| JavaScript, MDN Web Docs (2026) | developer.mozilla.org |

<div class="grid2">
<div>

**Related chapters**

- Chapter 7 — the form routes used in this chapter

</div>
<div>

**Technology versions in this book**

- Expo SDK 57 · React Native 0.86 · React 19.2 · Node.js LTS ≥ 22

</div>
</div>

<!--
The complete references are in Appendix D; the terms controlled component, validation,
and TextInput are explained in Appendix C (glossary).

Remind them that `keyboardType` and `behavior` are version-sensitive: always match them
against the official reactnative.dev documentation for the version in use.
-->

---

<!-- _class: lead -->
<!-- _paginate: skip -->

# Ready for Chapter 9

**Practicum:** build `utils/validators.js`, `components/FormField.js`, and `screens/FormMahasiswa.js`, then connect them to the `app/(app)/mahasiswa/tambah.js` route.

Continuation of meeting 9 (separate deck): Chapter 9 — State Management (Sub-CPMK 4.2). Meeting 10: Chapter 10 — REST API (Sub-CPMK 5.1 and 5.2).

Final Project groups are formed starting in meeting 9.

> Exercises: extend `FormSaran` (Example 1), apply edit mode to `FormMahasiswa`, and add a character counter in `FormField`.

<!--
Close with one sentence: "This chapter makes data come in correctly; the next chapter
determines who may read it."

State the follow-up explicitly: Practicum 8 is assessed with the practicum rubric
(conceptual understanding 15%, implementation 25%, code quality 15%, UI/UX 15%, debugging
10%, documentation 20% — Appendix A), and the Final Project groups are formed according
to the RPS for meeting 9.

Point to the three exercise items on the slide as homework: Practice Questions 1 to 3 in
the chapter, while Challenges 1 to 3 are provided for students who want to take up the
security, static data, and API integration areas.
-->
