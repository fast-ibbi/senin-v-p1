// Chapter 12 — Accessing Device Features · diagram 05
// Slide 5, "Sandbox: Why Permissions Exist". The slide's five bullets are not a list of
// peers: three of them are one argument told in a row — the counterfactual ("Without
// permissions, any app could photograph you without your knowledge") and the two
// mechanisms that answer it (the sandbox, the runtime permission). Drawn side by side,
// that argument is the two-model contrast `beforeAfter` exists for: what the phone looks
// like without the mechanism, and what it looks like with it. The other two bullets are
// platform facts — Android's version-6 model, iOS's `Info.plist` usage description — and
// they stay on the slide, because the picture does not show them.
//
// Labels are the slide's own sentences, kept verbatim so the picture quotes rather than
// paraphrases: the panel titles are the first bullet's opening words ("Without
// permissions") and its inversion ("With permissions"), and each row is a bullet moved
// whole. The notes on this slide group the two mechanisms the same way ("because of the
// sandbox and permissions"), so the right panel is not inventing a category.
//
// The panels are deliberately uneven — one threat, two defences. Rows 1 do answer each
// other (the camera that could be reached, the space that is now confined); the runtime
// permission has no counterpart because the threat was stated once, not twice.
//
// `mono` stays off: neither panel contains code, and mixing monospace rows into one list
// reads as a rendering accident rather than intent.
export default {
  id: '05',
  slide: 'Sandbox: Kenapa Izin Harus Ada',
  pattern: 'beforeAfter',
  alt:
    'Without permissions, any app could photograph you without your knowledge. With ' +
    'permissions, a sandbox confines each app to its own separate space, and a runtime ' +
    'permission is requested while the app is running.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT PERMISSIONS',
      tone: 'red',
      items: ['Any app could photograph you without your knowledge'],
    },
    right: {
      title: 'WITH PERMISSIONS',
      tone: 'acc',
      items: [
        'A sandbox confines each app to its own separate space',
        'A runtime permission is requested while the app is running',
      ],
    },
  },
}
