// Chapter 8 — Forms, Input, and Validation · diagram 04
// A new picture; this slide had none. The slide compares two things that sit in the same
// spot on a form field and differ on three axes: what each one is for, when it is on
// screen, and how it relates to the other. That is `beforeAfter`'s shape — two panels,
// matched rows — not a list, so the left/right rows answer each other line for line.
//
// Every item is the slide's own wording (provenance is clean): "explains the name of the
// field", "gives an example value", "always visible", "disappears", "separate from the
// placeholder", "must not replace the label".
//
// The left panel is `acc` and the right `neutral`, deliberately not the default
// red/accent pair: a placeholder is not the wrong model, it is the secondary one — the
// slide's objection is only that it must not take the label's job.
export default {
  id: '04',
  slide: 'Label Selalu Tampil, Placeholder Menghilang',
  pattern: 'beforeAfter',
  alt:
    'A permanent label explains the name of the field, is always visible, and is separate ' +
    'from the placeholder; a placeholder only gives an example value, disappears as soon as ' +
    'the user types, and must not replace the label.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'LABEL',
      tone: 'acc',
      items: [
        'Explains the name of the field',
        'Always visible',
        'Separate from the placeholder',
      ],
    },
    right: {
      title: 'PLACEHOLDER',
      tone: 'neutral',
      items: [
        'Gives an example value',
        'Disappears',
        'Must not replace the label',
      ],
    },
  },
}
