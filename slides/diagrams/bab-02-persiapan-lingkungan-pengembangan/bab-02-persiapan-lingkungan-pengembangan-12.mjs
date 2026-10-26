// Chapter 2 — Development Environment Setup · diagram 12 (new: no legacy Mermaid chart at 12)
//
// The iOS slide's first bullet is a stack, not a list: the Simulator runs on macOS and requires
// Xcode, so each thing sits on the one below it and the missing base is the whole answer to "why
// can Windows and Linux not run it at all". That is `layers` — strata where order is the content.
//
// Tones: `layers` accents the top band by default, and here the subject really is the Simulator
// (the heading is "iOS Simulator: An Introduction"), so the accent stays there. The base carries
// the constraint in its own note ("and nothing else") rather than a second coloured band, because
// the slide's message is dependency, not "macOS is the goal".
//
// The top band keeps a gloss ("simulates an iPhone or iPad") even though the definition line under
// the picture says much the same. Tried without it: the accented band went bare while the two bands
// under it carried right-aligned notes, and the stack read as a band with a hole in it. The gloss is
// five words against a twenty-word sentence; the two notes that matter ("which is very large",
// "and nothing else") are facts the prose never states.
//
// Trimming: bullet 1 moved verbatim into the presenter notes — every clause of it is a band or a
// band note. Bullets 2, 3 and 4 stay: the picture shows what the simulator sits on, not that
// Windows and Linux cannot run it, not the two alternatives (a physical iPhone with Expo Go, a
// cloud build with EAS Build) and not the i key.
//
// The notes are quoted from the slide where a contiguous phrase exists ("simulates an iPhone or
// iPad", "which is very large"), so the provenance report only misses "and nothing else", a
// three-word condensation of "runs only on macOS".
export default {
  id: '12',
  slide: 'iOS Simulator Hanya Hidup di macOS',
  pattern: 'layers',
  alt:
    'Three strata: the iOS Simulator simulates an iPhone or iPad, it needs Xcode, which is very ' +
    'large, and Xcode needs macOS — and nothing else, which is why Windows and Linux cannot run the ' +
    'simulator at all.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'The iOS Simulator', note: 'simulates an iPhone or iPad', tone: 'acc' },
      { label: 'Xcode', note: 'which is very large', tone: 'neutral' },
      { label: 'macOS', note: 'and nothing else', tone: 'neutral' },
    ],
  },
}
