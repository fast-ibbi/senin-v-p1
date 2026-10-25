// Chapter 2 — Development Environment Setup · diagram 10 (new: no legacy Mermaid chart at 10)
//
// The emulator slide's first two bullets are not a chain, they are containment: Android Studio is
// "the official Android IDE, where the emulator is managed", and the AVD Manager — a panel inside
// that IDE — "creates a virtual device: choose a phone model and an Android version". So the
// picture is a `tree`: one IDE holding the emulator and the AVD Manager, and the AVD Manager
// holding the two choices that define a virtual device. The two bullets below them are a
// trade-off (advantage vs limitation), which no container shows and which stays on the slide.
//
// Why not `flow`: the slide states no order. The order that does exist lives in the presenter
// notes as a warning ("an AVD that has never been created makes the a key in the Expo terminal do
// nothing"), and drawing that as a pipeline would have claimed a sequence the material never
// states. Containment is what the bullets actually assert.
//
// Trimming: bullets 1 and 2 moved verbatim into the presenter notes — every word of them is in the
// picture. Bullets 3 and 4 stay: the picture says nothing about cost or about sensors.
//
// Canvas 1034, not 1160: `tree` fixes its three level widths and left-packs them, so at 1160 a
// 1034-wide drawing would leave a dead right margin and read as half a picture. The canvas is cut
// to the drawing (24 pad + 218 root + 84 elbow + 300 + 84 elbow + 300 + 24) and `imgWidth` matches
// it, so the picture is drawn at scale 1 — an 18px root label stays 18px on the projector.
//
// Known cost, accepted: `tree` renders labels only, so the panel notes are not in the picture. The
// nouns survive ("Android Studio", "AVD Manager", "a phone model", "an Android version") and the
// explanatory clauses sit in the presenter notes next to them.
export default {
  id: '10',
  slide: 'Android Emulator: Android Studio and AVD',
  pattern: 'tree',
  alt:
    'Android Studio is the official Android IDE that holds two things: the emulator, managed from ' +
    'there, and the AVD Manager, which creates a virtual device by asking for a phone model and an ' +
    'Android version.',
  imgWidth: 1034,
  data: {
    canvas: [1034, 234],
    root: {
      label: 'Android Studio',
      children: [
        { label: 'The emulator' },
        {
          label: 'AVD Manager',
          children: [{ label: 'A phone model' }, { label: 'An Android version' }],
        },
      ],
    },
  },
}
