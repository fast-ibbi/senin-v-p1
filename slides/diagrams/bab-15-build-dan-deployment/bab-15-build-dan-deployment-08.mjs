// Chapter 15 — Build and Deployment · diagram 08
// A new picture (no legacy chart at this id). Five bullets of keys are a list, not a
// relationship — but the slide's presenter notes name the one distinction it exists to
// teach: "there are two version readers: humans read version, machines read
// android.versionCode and ios.buildNumber. This is the distinction most often swapped."
// Two readers of the same app, in matched rows, is `beforeAfter`.
//
// Rows correspond, which is what keeps the two panels readable as one picture:
//   expo.version        ↔ expo.android.versionCode           (the key)
//   1.0.0 → … → 2.0.0   ↔ must increase on every upload to Play (what happens to it)
//
// Three rows were the first attempt (key / form / rule) and were cut to two on measurement:
// the three-row panel is 280px tall on a 1160 canvas, and on this slide — a heading, the
// picture, three bullets and a blockquote — the blockquote's last line landed on the
// page-number band (ink at y 604–635 against the number at 623–635). Trimming bullets was
// not the remedy: expo.name, expo.slug and `autoIncrement` are not version readers, so the
// picture does not say them and rule 4 keeps them on the slide. So the picture shed the
// "major.minor.patch / an integer" row; both facts survive in the trimmed bullets below.
//
// Neither reader is a wrong model, so the left panel is written `neutral` instead of the
// pattern's default red: red would say "humans read the wrong thing", and the slide says
// both are read.
//
// ios.buildNumber is named in the notes but not on the slide, so the picture does not draw
// it — expo.version and expo.android.versionCode are the two keys the slide's bullets spell
// out.
export default {
  id: '08',
  slide: 'app.json: Dua Pembaca Versi yang Sering Tertukar',
  pattern: 'beforeAfter',
  alt:
    'Two readers of one app version. Humans read expo.version: the semantic version ' +
    'major.minor.patch, which travels 1.0.0 → 1.1.0 → 1.1.1 → 2.0.0. Machines read ' +
    'expo.android.versionCode: an integer that must increase on every upload to Play.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'HUMANS READ',
      tone: 'neutral',
      items: ['expo.version', '1.0.0 → 1.1.0 → 1.1.1 → 2.0.0'],
    },
    right: {
      title: 'MACHINES READ',
      tone: 'acc',
      items: ['expo.android.versionCode', 'must increase on every upload to Play'],
    },
  },
}
