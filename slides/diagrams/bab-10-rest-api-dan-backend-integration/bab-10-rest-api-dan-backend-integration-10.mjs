// Chapter 10 — REST API and Backend Integration · diagram 10
// New picture — there was no such chart in the old Mermaid set. The slide is two
// columns ("What fetch does not do" / "What you have to do"), already on the slide, so
// a `beforeAfter` of those two headings would photograph the prose. The structure the
// columns hide is the *pairing*: fetch's two behaviours on one axis (does it throw?),
// and under each behaviour the one thing you have to add. The presenter notes state it
// as the takeaway — "network failures are thrown by fetch, status code failures must be
// caught yourself" — and warn that it is one of the two mistakes that appear most often
// in the practicum. Rows 1 and 1 answer each other (fetch throws / fetch is silent),
// rows 2 and 2 answer each other (your try/catch / your response.ok check), which is
// what makes the two panels read as a matched pair rather than a list.
//
// Two bullets moved verbatim into this slide's presenter notes under "Trimmed to the
// picture (the diagram says this)": the 4xx/5xx-silently-succeeds fact and the
// response.ok remedy — exactly the two the picture redraws. The two kept bullets are
// the ones the picture does not carry in full: the 500-with-no-error case in the first
// column and the try/catch remedy in the second (the picture names the remedy, the
// bullet keeps the full instruction). No column is left without a bullet.
//
// "network failures are thrown by fetch" is the presenter notes' sentence, not visible
// slide text, so the build reports it as a provenance miss: expected, and the reason
// the picture exists.
export default {
  id: '10',
  slide: 'fetch Tidak Melempar Error saat Server Menjawab 500',
  pattern: 'beforeAfter',
  alt:
    'A fetch call has two very different failure surfaces: when the network is in trouble ' +
    'fetch throws and you catch it with try/catch; when the server answers 4xx or 5xx fetch ' +
    'resolves and reports success, so you check response.ok and throw the Error yourself.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'The network is in trouble',
      tone: 'red',
      items: ['network failures are thrown by fetch', 'catch network failures with try/catch'],
    },
    right: {
      title: '4xx and 5xx',
      tone: 'acc',
      items: ['treated as a successful request', 'check response.ok then throw an Error yourself'],
    },
  },
}
