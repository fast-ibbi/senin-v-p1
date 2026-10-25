// Chapter 15 — Build and Deployment · diagram 11
// A new picture (no legacy chart at this id). Slide 20 is the chapter's environment-variable
// slide, and its teaching point — the one its notes say to stress — is the prefix rule: only
// prefixed variables reach the app code. The relationship is not a chain (the chain is already
// drawn on the next slide as diagram 04: .env → build time → bundle → every user); it is a
// fork: one `.env` file, two kinds of value, only one of them inlined. Two mental models on
// one axis is `beforeAfter`.
//
// The picture deliberately does NOT restate diagram 04's pipeline. It answers the question a
// student asks next: "which of my variables end up inside the app?"
//
// Rows correspond:
//   inlined into the app code            ↔ available during the build process
//   read as process.env.EXPO_PUBLIC_API_URL ↔ the app never reads them
//
// Label sources: row 1 left is bullet 3's own phrase; row 2 left is bullet 4's expression; the
// two right-hand rows are the presenter notes' sentence — "Variables without the prefix are
// still available during the build process … but the app will never read them" — because the
// slide's bullet 3 states the rule only in its positive form ("Only variables prefixed with…").
// The right panel title therefore says "WITHOUT THE PREFIX", which the notes supply verbatim.
//
// Tones: the left panel takes the accent (that is the path into the app code) and the right is
// written `neutral` rather than the pattern's default red — an unprefixed variable is not a
// mistake, it simply never reaches the app. Red would say "wrong", which the slide does not.
//
// Trimmed to the picture: bullets 3 and 4, which are the two panels' rows word for word. The
// remaining three (where the values live, the files Expo reads, the restart rule) are facts the
// picture does not show.
export default {
  id: '11',
  slide: 'Environment Variables: Configuration Outside the Code',
  pattern: 'beforeAfter',
  alt:
    'Two kinds of value in one .env file. A variable prefixed with EXPO_PUBLIC_ is inlined into ' +
    'the app code and is read there as process.env.EXPO_PUBLIC_API_URL. A variable without the ' +
    'prefix is still available during the build process, but the app never reads it.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'EXPO_PUBLIC_',
      tone: 'acc',
      items: ['inlined into the app code', 'read as process.env.EXPO_PUBLIC_API_URL'],
    },
    right: {
      title: 'WITHOUT THE PREFIX',
      tone: 'neutral',
      items: ['available during the build process', 'the app will never read them'],
    },
  },
}
