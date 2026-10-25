// Chapter 12 — Accessing Device Features · diagram 07
// Slide 22, "Notification Channels and Permission on Android".
//
// The slide states one counterfactual and one mechanism about the same object: a
// notification without a channel is discarded, a notification inside a channel is
// grouped by type and therefore user-controllable. That is the two-model contrast
// `beforeAfter` draws, and it is the same move diagram 05 makes on slide 5
// ("WITHOUT PERMISSIONS" / "WITH PERMISSIONS") — deliberately, so a student meets the
// same shape twice and reads the second one without effort.
//
// The picture carries only the two duplicated bullets: "Without a channel,
// notifications may be dropped by the system on Android" and "A **notification
// channel** groups notifications by type". Both moved into the notes verbatim (see the
// slide's "Trimmed to the picture" block). The two that stayed are the ones the
// picture does not show and cannot: the per-channel sound and interruption controls
// (what the user actually does with a channel) and the Android 13 permission split
// (a different gate entirely — the OS switch, not the channel).
//
// Room is what decided the shape. At `w:1120` this slide had 123px left under its
// seven-line code block, and the one-row-per-side panel is the shortest thing the kit
// can draw (164 units ≈ 179px on the slide). Removing those two single-line bullets
// buys 75px, which is exactly enough. A second row per side would cost 56px more and
// there is no third duplicated bullet to pay for it.
//
// "WITH A CHANNEL" is the one label not on the slide: the panel needs the opposite
// state named, and the slide only ever writes the negative ("Without a channel…"). It
// is the same inversion diagram 05 documents for "WITH PERMISSIONS".
export default {
  id: '07',
  slide: 'Notification Channels and Permission on Android',
  pattern: 'beforeAfter',
  alt:
    'Without a channel, notifications may be dropped by the system on Android; with a ' +
    'channel, notifications are grouped by type.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'WITHOUT A CHANNEL',
      tone: 'red',
      items: ['Notifications may be dropped by the system on Android'],
    },
    right: {
      title: 'WITH A CHANNEL',
      tone: 'acc',
      items: ['Groups notifications by type'],
    },
  },
}
