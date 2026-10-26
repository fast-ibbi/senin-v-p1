// Chapter 4 — React Fundamentals · diagram 22
// Density pass: this slide was a lead sentence, three bullets and a code block with no
// picture. The chain the slide actually teaches is containment put in action — the root
// component sits at the project root, it imports and renders one small function component,
// and that component returns the element the student sees. The code block already shows
// the last step (`return <p>Halo, mahasiswa!</p>;`), so the picture only has to show who
// calls whom.
//
// Pattern: `flow`, and the height budget decided it as much as the relationship did.
// `layers` is the semantically natural shape for containment and is what diagram 02 uses
// for the four-name chain — but three bands need a 276px canvas, i.e. 266px on the slide,
// and this slide already spends 510px of its 720 on prose and code. `flow`'s three-stage
// row needs 184px, or 154px on the slide with the canvas override written below. That fits
// — just — once the bullet the picture duplicates moves into the notes and the file-path
// caption moves there with it. `tree` was rejected on the kit's own quirk: every node here
// has exactly one child, so the ladder would collapse onto one y and read as three
// siblings in a row. `beforeAfter` (component vs element, the presenter notes' guiding
// question) is a 430px canvas — nearly three times the room this slide has.
//
// Honest limits of `flow`: it is one-way, so it shows "App.js renders Sapaan" and not the
// reverse, and it cannot show that Sapaan may be used in more than one place. The two
// arrows are the whole claim: `renders` (a parent uses the child) and `returns` (the child
// hands back an element). Nothing here says the component reaches the screen by itself —
// the presenter notes still carry that warning, and the arrow that starts at App.js is the
// picture's answer to it.
//
// Labels: `App.js`, `Sapaan` and `<p>Halo, mahasiswa!</p>` are the slide's own names (the
// heading, the bullet, the code). "root component" and "function component" are the slide's
// words for the first two roles; the third note quotes the lead sentence ("returns a
// description of the view"), which is also how the presenter notes define an element. The
// only paraphrase is the edge word "renders" — the slide's own verb for a parent using a
// child is "used by a parent component" in the notes, but an arrow labelled "used" would
// read as if the child were doing something to the parent, so the chapter's normal term
// wins.
//
// Tone: the last stage is the accent by default and it is the accent here too — the
// element is the thing that appears on screen, and it is the half of the component/element
// pair students confuse. The two stages above it stay neutral so only one box glows.
export default {
  id: '22',
  slide: 'Component: Satuan Terkecil Antarmuka',
  pattern: 'flow',
  alt:
    'App.js, the root component, renders one function component called Sapaan, which returns ' +
    'the element <p>Halo, mahasiswa!</p> — the description of the view.',
  imgWidth: 1120,
  data: {
    // The kit's natural flow canvas is 184px tall: 24px pad, the 76px box row, the 10px gap,
    // a 44px note band and another 24px pad. A single-line note only inks ~28px of that band,
    // so the canvas carries ~46px of dead white at the bottom, and this slide has 720px of
    // heading, prose and code to pay for. 160 is the kit's floor and it costs nothing here:
    // the note text still ends inside the canvas, and the picture drops 24px of empty sky —
    // which is the difference between the code block clearing the page number and covering it.
    canvas: [1160, 160],
    steps: [
      { label: 'App.js', note: 'root component', tone: 'neutral' },
      { label: 'Sapaan', note: 'function component', tone: 'neutral' },
      { label: '<p>Halo, mahasiswa!</p>', note: 'a description of the view', tone: 'acc' },
    ],
    // The verbs of the chain: a parent renders a child, a child returns an element.
    edges: ['renders', 'returns'],
  },
}
