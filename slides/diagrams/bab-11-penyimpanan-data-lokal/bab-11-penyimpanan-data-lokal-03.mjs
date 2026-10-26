// Chapter 11 — Local Data Storage · diagram 03
// Replaces the old Mermaid diagram (bab-11-…-03.mmd): one decision ("sensitive?")
// with two destinations — AsyncStorage for preferences, cache, catatan; secure
// storage (Keychain or Keystore) for token, kata sandi, kunci API.
//
// The two destinations are the picture; the sensitivity test that separates them is
// the slide's first bullet ("Separate by sensitivity"). Both panels therefore have
// the same two rows, so they answer the same two questions: what goes in, and what
// protects it. `tree` was the other candidate but it would need nine nodes on a
// slide that already carries a paragraph, two bullets and this picture; the row
// pairing keeps the same classification in half the height.
//
// Neither panel is red: both storage choices are correct for their own data class.
export default {
  id: '03',
  slide: 'Secure Storage: Kunci yang Menempel pada Perangkat',
  pattern: 'beforeAfter',
  alt:
    'Two destinations chosen by sensitivity: AsyncStorage holds preferences, cache and notes ' +
    'as plain text that is not encrypted, while secure storage holds tokens, passwords and ' +
    'API keys with the hardware security of Keychain and Android Keystore.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'ASYNCSTORAGE',
      tone: 'neutral',
      items: ['Preferences, cache, notes', 'Plain text, not encrypted'],
    },
    right: {
      title: 'SECURE STORAGE',
      tone: 'acc',
      items: ['Tokens, passwords, API keys', 'Keychain and Android Keystore'],
    },
  },
}
