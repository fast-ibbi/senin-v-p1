// Chapter 11 — Local Data Storage · diagram 02
// Replaces the old Mermaid diagram (bab-11-…-02.mmd), which was a branch graph:
// fetch → "Berhasil?" → yes: save snapshot + timestamp → show fresh data;
// no: "Ada cache dan belum lewat TTL?" → yes: cache + offline marker; no: error.
//
// The shape is a fork, not a chain: `flow` is one-way and would draw the success
// arm as the predecessor of the failure arm, which is false. `beforeAfter` puts the
// two arms side by side, which is what the presenter note calls "a decision flow":
// try the server, on success save a copy, on failure check the cache.
//
// The left panel is `neutral`, not the pattern's default red: nothing here is the
// wrong path. The accent sits on the failure arm because that is the slide's
// subject — its heading is "when the network fails", and its blockquote is about
// the offline marker that arm has to carry.
//
// Honest limit: the arms are not matched row for row (two rows on the left, three on
// the right). The numbered badges order the steps *within* an arm; they do not pair
// left row n with right row n, and the two panels are read as two arms rather than as
// two answers to one question. The alternative, `flow`, would have drawn the failure
// arm as the continuation of the success arm, which is false.
export default {
  id: '02',
  slide: 'Cache Workflow When the Network Fails',
  pattern: 'beforeAfter',
  alt:
    'Two arms of the cache workflow: on success the app saves a copy of the data and shows ' +
    'the data from the server; on failure it reads the cache and its TTL, showing the cache ' +
    'with the offline marker when it is not stale and the error message when it is.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'ON SUCCESS',
      tone: 'neutral',
      items: ['Save a copy', 'Show the data from the server'],
    },
    right: {
      title: 'ON FAILURE',
      tone: 'acc',
      items: [
        'Read the cache and check its TTL',
        'Not stale: show the cache with the offline marker',
        'Stale: show the error message',
      ],
    },
  },
}
