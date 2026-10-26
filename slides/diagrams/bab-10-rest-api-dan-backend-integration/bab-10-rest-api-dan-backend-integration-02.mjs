// Chapter 10 — REST API and Backend Integration · diagram 02
// Replaces the old Mermaid chart (bab-10-…-02.mmd), which drew three boxes with two
// opposing arrows between client and server plus a third box for the screen update.
// Opposing arrows in one picture read as "two paths at once"; `sequence` reads as a
// round trip in time order, which is what "the request–response pattern" means.
//
// Deliberately two messages only. The legacy chart's third node ("Menampilkan data
// atau pesan error" / display the data or the error message) is the client's rendering
// step — it is the content of "The Three Interface States" later in this chapter and is
// drawn there as diagram 03. Repeating it here would put a fourth idea on a slide whose
// heading names exactly two: request and response.
//
// The four parts of a request and the two parts of a response come from this slide's
// presenter notes (method and URL are the intent and the address, headers are the
// remarks, body is the attached document, status code is the result stamp) and from
// "One Complete HTTP Exchange" (the header conveys metadata, the body holds the data,
// the status code states the result). They are not visible words on this slide, so the
// build reports them as provenance misses — expected, and the reason the picture exists.
export default {
  id: '02',
  slide: 'HTTP: Satu Permintaan, Satu Tanggapan',
  pattern: 'sequence',
  alt:
    'One HTTP round trip: the client sends a request carrying a method, a URL, headers and ' +
    'a body; the server answers with a status code and a JSON body.',
  imgWidth: 1120,
  data: {
    actors: ['Client', 'Server'],
    messages: [
      { from: 'Client', to: 'Server', label: 'request: method + URL + headers + body' },
      { from: 'Server', to: 'Client', label: 'response: status code + body JSON', tone: 'acc' },
    ],
  },
}
