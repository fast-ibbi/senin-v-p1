// Chapter 15 — Build and Deployment · diagram 06
// A new picture (no legacy chart at this id): the App Store flow is already diagram 05,
// so drawing this slide as another chain would repeat it. What the slide actually says is
// a dependency — "Absolute requirement … Without that membership, a signing certificate
// cannot be issued … There is no direct installation path" — three strata where the top
// one does not exist without the one below. That is `layers`, not a flow.
//
// The accent sits on the bottom band on purpose: the membership is the gate, and pulling
// it out removes everything above it. `layers` tints the TOP band by default, so all three
// tones are written explicitly (the same trap Chapter 6 hit on its thumb-reach slide).
//
// Kept to three bands: the four numbered steps of a certificate chain are not in the
// material, and inventing them would read as established fact.
export default {
  id: '06',
  slide: 'iOS Build: Conceptual but Locked',
  pattern: 'layers',
  alt:
    'Three dependent layers of an iOS build: the Apple Developer Program membership, paid ' +
    'annually, at the bottom; the signing certificate on top of it, which EAS manages; and ' +
    'the installation path at the top, only the App Store, TestFlight, or registered devices. ' +
    'Without the membership nothing above it exists.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Installation path', note: 'App Store, TestFlight', tone: 'neutral' },
      { label: 'Signing certificate', note: 'EAS manages certificates', tone: 'neutral' },
      { label: 'Apple Developer Program', note: 'paid annually', tone: 'acc' },
    ],
  },
}
