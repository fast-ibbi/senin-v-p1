// Chapter 10 — REST API and Backend Integration · diagram 12
// Slide: "Application: Three Systems That Are Not in Sync". Two `grid2` columns
// ("Symptoms" / "The decision") plus a blockquote about the risk. A `beforeAfter` of
// those two headings would only photograph the columns that are already on the slide,
// so the picture takes the one thing the prose cannot show: *the shape*. One record
// exists in three places at once — that is what "not in sync" means, and it is the
// presenter notes' point ("the root of the problem is duplicated data, not the
// technology").
//
// The tree is the chapter's own architecture idiom: picture 08 already draws the
// client–server concept as a root with branches. Here the root is the single record and
// the branches are the three copies the first symptom bullet names. Every label is the
// slide's words: "the data", "a copy", "The academic web", "the mobile app", "HR".
//
// One bullet moved verbatim into this slide's presenter notes under "Trimmed to the
// picture (the diagram says this)": "The academic web, the mobile app, and HR each store
// a copy of the data" — precisely what the three branches spell out. The kept symptom
// bullet carries the fact the picture does not show (the GPA disagreeing, no single
// source of truth), and both decision bullets stay: the picture draws today's
// duplication, not the central API that replaces it.
//
// The blockquote moved into the notes as well, under "Trimmed to the notes (prose; the
// picture needed the room)" — the house pattern for this deck. With it on the slide, the
// picture pushed the page number into its canvas at w:1120; the risk and the `/api/v1/`
// versioning instruction are still read by the presenter.
//
// Canvas width 660, not 1160: `tree` fixes its three level widths and left-packs them, so on
// the default canvas this two-level tree filled 55% of the width and left a dead right half
// (the same shape and the same fix as picture 08 in Chapter 2). The canvas is cut to the
// drawing — 24px pad + 218 root + 84 elbow + 300 nodes + 34 — and height to 216, the last
// node's bottom plus its 10px breathing room. `imgWidth` matches the canvas, so the picture
// is drawn at scale 1 and a 16px node label stays 16px on the projector.
export default {
  id: '12',
  slide: 'Application: Three Systems That Are Not in Sync',
  pattern: 'tree',
  alt:
    'The same record held in three places: one copy of the data lives in the academic web, ' +
    'another in the mobile app and another in HR, which is why the GPA differs in every ' +
    'system and there is no single source of truth.',
  imgWidth: 660,
  data: {
    canvas: [660, 216],
    root: { label: 'the data', children: [
      { label: 'a copy in the academic web' },
      { label: 'a copy in the mobile app' },
      { label: 'a copy in HR' },
    ]},
  },
}
