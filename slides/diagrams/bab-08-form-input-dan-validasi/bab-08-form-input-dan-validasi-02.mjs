// Chapter 8 — Forms, Input, and Validation · diagram 02
// Replaces the old Mermaid chart (bab-08-…-02.mmd) that drew the pipeline as a
// left-to-right flowchart: 1 keystroke → 2 handleChange → 3 handleSubmit → 4a errors
// state / 4b onSubmit(form). The chart's last step forked, and the kit's `flow` is a
// single chain, so the fork is laid flat at the end: the two outcomes stay distinct
// chips (red errors state, green onSubmit) and the arrow between them is labelled with
// the condition, "or all fields valid". Nothing is invented and no stage is dropped;
// the flatness is the compromise, and the alt text says so.
//
// The chip labels are the legacy chart's own words (onChangeText, handleChange,
// form state, handleSubmit, validasiSemuaField, errors state, onSubmit(form), red
// border + message). The edge labels come from this slide's blockquote — "One
// keystroke updates state; one button press checks every field at once" — plus the
// condition the branch needs ("a field fails" / "or all fields valid").
//
// Stages 1–2 are the typing path, 3–5 the submit path: the arrow into handleSubmit is
// one button press, which is how the chapter's own note reads the two halves
// ("paths 4a and 4b do not run at the same time").
export default {
  id: '02',
  slide: 'Satu Ketukan Tombol Memeriksa Semua Field',
  pattern: 'flow',
  alt:
    'One keystroke fires onChangeText, handleChange updates the form state; then one button ' +
    'press runs handleSubmit, which validates every field at once: if a field fails the errors ' +
    'state appears with a red border and a message, otherwise onSubmit(form) is called with all ' +
    'fields valid. The two outcomes never happen at the same time — the picture lays the fork ' +
    'flat, left to right.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Keystroke', note: 'onChangeText' },
      { label: 'Form state', note: 'handleChange' },
      { label: 'handleSubmit', note: 'validasiSemuaField' },
      { label: 'errors state', note: 'red border + message', tone: 'red' },
      { label: 'onSubmit(form)', note: 'all fields valid', tone: 'green' },
    ],
    edges: ['one keystroke', 'one button press', 'a field fails', 'or all fields valid'],
  },
}
