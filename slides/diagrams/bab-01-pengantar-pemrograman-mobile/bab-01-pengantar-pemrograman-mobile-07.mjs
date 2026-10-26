// Chapter 1 — Introduction to Mobile Programming · diagram 07
// Slide 4, "What Is a Mobile App?". There was no legacy chart here.
//
// The relationship the slide actually carries is containment, not contrast: one
// definition ("a mobile app is software designed for mobile devices") with two facets
// hanging off it, and the facets carry the five bullets. That is `tree`, and its root is
// the one thing the slide only has as a sentence. A `beforeAfter` was the alternative —
// the slide is laid out as two columns — but two panels would flatten the definition into
// a third column and lose the fact that both facets belong to the same term. The two
// branches each have more than one child, so the single-child elbow quirk (a parent and
// its only child sharing one y) does not bite here.
//
// Every node label is a substring of the slide's own text; the two branch labels are the
// slide's own bold sub-headings. The picture deliberately keeps the full claim
// "not opened through a browser" on the first leaf instead of shortening it to
// "installed on the device", because that bullet moves into the presenter notes and the
// picture has to carry everything the bullet said.
//
// Three of the five bullets were trimmed into the notes (all of the left column): the
// three leaves under "Not just a shrunken website" state them, and the slide then holds a
// heading, the definition, a picture and the two longer "where its value comes from"
// bullets. Those two stay as prose because neither fits in a node box without losing a
// clause ("so the app must survive stop-and-resume").
export default {
  id: '07',
  slide: 'Aplikasi Mobile Bukan Website yang Diperkecil',
  pattern: 'tree',
  alt:
    'A mobile app defined by two facets: it is not just a shrunken website — installed on ' +
    'the device, living inside the app store ecosystem, drawing on the physical ' +
    'capabilities of the device — and its value comes from mobility and from short, often ' +
    'interrupted sessions.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Mobile app',
      children: [
        {
          label: 'Not just a shrunken website',
          children: [
            { label: 'Installed on the device, not opened through a browser' },
            { label: 'Lives inside the app store ecosystem' },
            { label: 'Draws on the physical capabilities of the device' },
          ],
        },
        {
          label: 'Where its value comes from',
          children: [
            { label: 'Mobility: used while on the move' },
            { label: 'Sessions are short and often interrupted' },
          ],
        },
      ],
    },
  },
}
