// Chapter 1 — Introduction to Mobile Programming · diagram 12
// Slide 21, "Expo: Three Main Components". No legacy chart.
//
// The chapter README used to list this slide as deliberately undrawn ("Expo's three
// components" = a list of peers). This pass overrides that: the three peers are not the
// same kind of thing at all, they are the three stages a project passes through, and the
// slide's own closing line fixes the order — `npx expo start` is practiced in Chapter 2,
// publishing in Chapter 15. You write against the SDK, Expo Go runs the project on the
// phone, EAS builds and publishes it. A chain of named stages joined by verbs is `flow`.
//
// `tree` was the other candidate (the heading says the three are components *of* Expo)
// and it was rejected for two reasons: `tree` silently drops `note`, so the three job
// descriptions — the only thing that makes the chips meaningful — would be lost; and a
// two-level tree is left-packed at a fixed width, so it would leave half the canvas
// empty (the same note is in spec 04).
//
// Edge labels: "expo start" is quoted from the slide's "Its main command is `npx expo
// start`" (shortened so it fits the 118px gap at 14px bold), and "publish" is the slide's
// own word in "publishing is explained in Chapter 15". No new verb is invented. The EAS
// note stops at "build and publishing" because the slide's "the app to app stores" does
// not fit two lines in a 292px note box; the stores are named in the alt text.
//
// Trimmed: the first bullet (Expo SDK 57) moved verbatim into the presenter notes — the
// first chip and its note carry the whole bullet. The Expo Go and EAS bullets stay: they
// name what each tool *is*, and the picture only says what it does in the chain.
export default {
  id: '12',
  slide: 'Expo: Three Main Components',
  pattern: 'flow',
  alt:
    'The three Expo components as the stages a project passes through: you write against ' +
    'the Expo SDK 57 (one JavaScript API for camera, location, notifications and storage), ' +
    'expo start serves it to Expo Go, which runs the project on a phone with no native ' +
    'build, and EAS does the cloud build and the publishing to the app stores.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Expo SDK 57', note: 'one JavaScript API for camera, location, notifications, storage' },
      { label: 'Expo Go', note: 'on a phone, without a native build' },
      { label: 'EAS', note: 'a cloud service for build and publishing', tone: 'acc' },
    ],
    edges: ['expo start', 'publish'],
  },
}
