// Chapter 10 — REST API and Backend Integration · diagram 09
// New picture — there was no such chart in the old Mermaid set. The slide's three
// definitions (resource, endpoint, stateless) plus the method mapping are a list, not a
// structure: `tree` would be a mind-map of unrelated words and `layers` would invent an
// order the slide does not have, so neither is used. What the slide *does* contain as a
// structure is the address of a resource — and the presenter notes single out the one
// confusion that costs students a debugging hour: "GET /api/mahasiswa requests a
// collection, while GET /api/mahasiswa/1 requests one member of the collection.
// Confusing the two produces a puzzling 404 error." Two addresses, one axis (how much
// of the resource the address names): that is the `beforeAfter` contract.
//
// No bullet was trimmed. The endpoint bullet carries the *definition* ("the unique
// address of each resource"), which the picture does not state — moving it would have
// deleted a fact, so it stays on the slide and the picture adds the member address that
// the slide itself never shows.
//
// Panel titles are the notes' own words, kept parallel: "requests a collection" /
// "requests one member of the collection". `mono` is set by hand on both sides because
// a URL is the whole content of this picture (the kit's automatic mono test looks for
// brackets and operators, which a path has none of).
//
// Accent on the member address: it is the address students forget exists, and the one
// the slide never shows.
export default {
  id: '09',
  slide: 'REST: Resource, Endpoint, and Stateless',
  pattern: 'beforeAfter',
  alt:
    'Two endpoints of the same resource: GET /api/mahasiswa addresses the collection, ' +
    'GET /api/mahasiswa/1 addresses one member of it — confusing the two produces a 404.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'A collection',
      tone: 'neutral',
      mono: true,
      items: ['GET /api/mahasiswa'],
    },
    right: {
      title: 'One member',
      tone: 'acc',
      mono: true,
      items: ['GET /api/mahasiswa/1'],
    },
  },
}
