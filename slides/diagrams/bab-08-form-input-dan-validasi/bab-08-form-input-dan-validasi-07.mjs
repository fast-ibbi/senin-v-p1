// Chapter 8 — Forms, Input, and Validation · diagram 07
// New picture; this slide had none. The slide is four fixes without a stated cause, but
// the blockquote gives the pairing away: "Without keyboardShouldPersistTaps, the first tap
// only closes the keyboard and the button must be pressed twice." Symptom on the left,
// mechanism on the right, row against row — that is `beforeAfter`, not a list of props.
//
// Only two rows, on purpose. The fourth bullet (the `returnKeyType` chain "next" → "next"
// → "done") is a sequence of keys within one form, not a symptom with a fix, so it is not
// drawn and stays on the slide. The code fence stays too — it is the platform switch that
// makes `KeyboardAvoidingView` work, and a picture of a `Platform.OS` ternary is not a
// picture of anything.
//
// Bullets 2 and 3 are trimmed into the presenter notes: the right-hand rows say exactly
// what they say ("shifts the content so the field stays visible", "makes a button respond
// to a single tap"). Bullet 1 stays — the picture says the keyboard covers the lower
// fields, but only the bullet says it takes up half the screen.
export default {
  id: '07',
  slide: 'Papan Ketik Virtual Menutupi Setengah Layar',
  pattern: 'beforeAfter',
  alt:
    'Two symptoms against their mechanisms: without the fix the keyboard covers the lower ' +
    'fields and the first tap only closes the keyboard; with the fix KeyboardAvoidingView ' +
    'shifts the content and keyboardShouldPersistTaps answers a single tap.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT THE FIX',
      tone: 'red',
      items: ['The keyboard covers the lower fields', 'The first tap only closes the keyboard'],
    },
    right: {
      title: 'WITH THE FIX',
      tone: 'acc',
      items: [
        'KeyboardAvoidingView shifts the content',
        'keyboardShouldPersistTaps answers a single tap',
      ],
    },
  },
}
