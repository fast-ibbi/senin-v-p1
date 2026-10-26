// Chapter 3 — Modern JavaScript for React Native · diagram 10
// New picture: this slide had none. The heading names the relationship — asynchronous code
// written as if it were synchronous — and that is a chain of three beats: a call hands back a
// promise, `await` waits for that one promise, and the value lands on the next line as if
// nothing asynchronous had happened. `flow` is that chain.
//
// Why not `sequence`, the pattern that usually teaches `await`: it needs two participants and
// at least two messages, which is 3 × 56 + 94 = 262 units tall — 253px on the slide. This slide
// holds a ten-line fence and two bullets, and has 1px of spare room. Even after the trim below,
// a sequence does not fit; the flow fits at 184 units. Recorded here rather than silently
// serialised: a sequence would show the message to the promise and back, which is the richer
// picture. The two bullets already say the promise part in words.
//
// Labels are the slide's own: "the call" is the presenter note's "the `await` in front of the
// call"; "a promise" is bullet 1; "await" and "waits for one Promise" are bullet 2; "data" is
// the fence's `const data =`; "as if synchronous" is the heading. Only the second edge label,
// "then", is not on this slide — it is the sequencing between the wait and the value, and it is
// also the name of the `.then` method the previous slide taught.
//
// Trimmed to the picture: nothing that the picture says. Two things left the fence, both
// reproduced verbatim in the presenter notes. First the `try`/`catch` wrapper: the next slide is
// `try`/`catch` with its own diagram, and ten code lines plus two bullets plus a picture is more
// than a projector slide can hold. Second the `console.log('Memuat data...')` progress line and
// the blank line that separated the function from its call: the fence still shows the template
// — the awaited call, the line after it, the return, and the invocation — so "asynchronous as if
// synchronous" is still in code, and the file line that says where to find it stays.
//
// `canvas` height is forced to 160. The pattern computes 184 (24 pad + 76 chip + 16 gap + 44 note
// box + 24 pad), but a one-line note needs 18 of those 44, so the default leaves a dead band at
// the bottom — 24px of projector space this slide does not have. Cropping the band changes no
// label and no font, and the note ink ends at 135, well inside 160. Same crop as diagram 07.
export default {
  id: '10',
  slide: 'async/await Membuat Asinkron Terbaca Berurutan',
  pattern: 'flow',
  alt:
    'The chain of one awaited call: the call returns a promise, await waits for that one ' +
    'promise — pausing this function, not freezing the entire application — and the resolved ' +
    'data is there on the next line, as if the code were synchronous.',
  imgWidth: 1120,
  data: {
    canvas: [1160, 160],
    steps: [
      { label: 'the call', note: 'a promise' },
      { label: 'await', note: 'waits for one Promise' },
      { label: 'data', note: 'as if synchronous', tone: 'acc' },
    ],
    edges: ['returns', 'then'],
  },
}
