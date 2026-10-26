// Chapter 1 — Introduction to Mobile Programming · diagram 16
// Slide 32, "Competencies and the Map of 15 Chapters". No legacy chart.
//
// The right column of this slide is a journey in four steps — Chapters 2–7, 8–11, 12–15,
// then the Final Project — and the presenter notes give the metaphor the picture should
// carry: "every chapter is a brick: Chapter 3 (JavaScript) becomes the foundation of
// Chapter 4 (React)". Bricks under bricks is `layers`: the earliest chapters are the base,
// and the Final Project is the slab everything rests on. `flow` was the alternative and was
// rejected on space, not on meaning: with four stages its note boxes are ~203px wide, too
// narrow for "environment, JavaScript, React, React Native, UI, navigation", so the topics
// that make each band legible would have been cut. `layers` gives the note 545px.
//
// Band order is inverted on purpose: `layers` puts the first item on top, and the top of a
// course stack is the peak — the accent band is "The peak: the **Final Project**", the
// slide's own sentence.
//
// Trimmed: the three "15-chapter journey" bullets and the closing "The peak: the **Final
// Project** — a mobile academic information system" line moved verbatim into the presenter
// notes — they are the four bands, and the top band's note is the peak sentence. The two
// "competencies gained" bullets stay: they are what the student walks away with, not a step
// on the map, so the picture does not restate them. Rule four requires two bullets to
// remain, and those two are the whole surviving list.
//
// The peak line went in the second pass, after the render showed the slide clipping below
// the bottom edge: four bands are 354 canvas units ≈ 342px, and heading + picture + label +
// two bullets + that line overflowed the 604px content box. Prose that the picture carries
// word for word is the right thing to move — the top band is that sentence.
//
// The two-column grid was dropped in the same edit: the right column held only the journey,
// which is now the picture, so the slide reads top-down — picture, competencies.
export default {
  id: '16',
  slide: 'Peta 15 Bab: Setiap Bab Satu Bata',
  pattern: 'layers',
  alt:
    'The course as a stack, oldest at the bottom: Chapters 2–7 (environment, JavaScript, ' +
    'React, React Native, UI, navigation) carries Chapters 8–11 (forms, state, REST API, ' +
    'local storage), which carries Chapters 12–15 (device features, security, testing, ' +
    'release), and the peak on top is the Final Project, a mobile academic information ' +
    'system.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'Final Project', note: 'a mobile academic information system', tone: 'acc' },
      { label: 'Chapters 12–15', note: 'device features, security, testing, release' },
      { label: 'Chapters 8–11', note: 'forms, state, REST API, local storage' },
      {
        label: 'Chapters 2–7',
        note: 'environment, JavaScript, React, React Native, UI, navigation',
      },
    ],
  },
}
