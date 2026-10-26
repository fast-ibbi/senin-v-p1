// Chapter 7 — App Navigation · diagram 04
// Replaces the old Mermaid chart (bab-07-…-04.mmd), which drew a closed loop of five
// boxes. The content is modes plus the events that change them — a tab screen mounts
// once, then gains and loses focus forever — so the pattern is `stateMachine`, not a
// chain. `flow` would have flattened a cycle into a pipeline and said the screen is
// mounted again on every return, which is the exact misconception this slide removes.
//
// The cycle is on purpose and is stated in the alt text: the return edge (unfocused →
// focused) is what the slide calls "when focus returns". `initial` puts the entry dot on
// `mounted`, so the picture shows that the mount step happens once while the focus pair
// repeats.
//
// What the picture cannot say, because `stateMachine` has no per-state note: the
// useFocusEffect callback runs on entering `focused` and its cleanup runs on entering
// `unfocused`. That belongs to the next slide (`useFocusEffect` and `useCallback`).
// Transition label "loses focus" is the translated verb of the legacy chart
// ("Kehilangan fokus"), which the slide itself only names as "when focus returns".
export default {
  id: '04',
  slide: 'Kenapa Daftar Masih Basi Setelah Kembali?',
  pattern: 'stateMachine',
  alt:
    'A tab screen mounts once — a plain useEffect runs there and never again — then cycles ' +
    'between focused and unfocused every time the user leaves the tab and focus returns.',
  imgWidth: 1120,
  data: {
    initial: 'mounted',
    states: [
      { id: 'mounted', label: 'mounted' },
      { id: 'focused', label: 'focused' },
      { id: 'unfocused', label: 'unfocused' },
    ],
    transitions: [
      { from: 'mounted', to: 'focused', label: 'gains focus' },
      { from: 'focused', to: 'unfocused', label: 'loses focus' },
      { from: 'unfocused', to: 'focused', label: 'focus returns', tone: 'acc' },
    ],
  },
}
