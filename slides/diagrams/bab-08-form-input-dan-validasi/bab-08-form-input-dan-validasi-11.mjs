// Chapter 8 — Forms, Input, and Validation · diagram 11
// New picture; this slide had none. This is the only place in the chapter where a
// field's rule reads another field's value, and the slide's second bullet states the
// consequence as a chain: `password` changes → the confirmation error is recomputed.
// That is a cause with three named stages (the value, the rule that reads it, the
// message that comes out), so `flow` — not a comparison.
//
// All three labels are the slide's own names: `form.password` and
// `validasiKonfirmasiPassword` are in the code and the bullets, `konfirmasiPassword` is
// the field the bullets name. The edge words are the two verbs the second bullet uses:
// the rule re-runs, and a new message comes out.
//
// Canvas is cropped to 160: every note here is one line, and the flow pattern reserves
// 44px of note room under the chips. The 24px it saves is what keeps the picture above
// the slide's bottom edge.
//
// One bullet is trimmed into the presenter notes: "`validasiKonfirmasiPassword` takes the
// password as the comparison context" is stage 1's note and stage 2's label, word for
// word. Two bullets stay — the recompute rule and the single-source-of-truth reason, which
// the picture does not show. Without the trim the slide's last bullet landed on the
// pagination row.
export default {
  id: '11',
  slide: 'FormRegistrasi: Validation That Needs Another Field',
  pattern: 'flow',
  alt:
    'A chain with three stages: form.password is the comparison context, ' +
    'validasiKonfirmasiPassword re-runs against it, and the konfirmasiPassword error is ' +
    'recomputed — which is why changing the password can turn a correct confirmation wrong.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'form.password', note: 'the comparison context' },
      { label: 'validasiKonfirmasiPassword', note: 'compares the two values' },
      { label: 'konfirmasiPassword error', note: 'recomputed too', tone: 'acc' },
    ],
    edges: ['re-runs', 'new message'],
  },
}
