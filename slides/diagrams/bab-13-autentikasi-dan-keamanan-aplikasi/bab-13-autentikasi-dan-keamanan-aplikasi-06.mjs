// Chapter 13 — Authentication and Application Security · diagram 06
// The slide puts the two questions side by side and answers neither of them with an arrow:
// "The order is always fixed" is a blockquote, not a step. So the shape is `beforeAfter` —
// two panels, one row each, the row being the question the concept answers. A `flow` was
// rejected: an arrow from Authentication to Authorization is the blockquote's job, and
// drawing it would make the slide say the same thing twice.
//
// The panel rows are the slide's first two bullets, so those two moved into the notes, and
// the two bold sub-heads went with them: the panel titles now carry the same two words, one
// line higher, and leaving them would have printed AUTHENTICATION twice. What stays on the
// slide is the hairier half of each concept — credentials matched against stored data, and
// authorization read from the role of an identity already proven — which no panel row shows.
//
// The left panel is `neutral`, not the pattern's default red: authentication is not the wrong
// model, it is the first step. The accent stays on authorization, the decision the chapter
// keeps saying the server must make.
export default {
  id: '06',
  slide: 'Authentication vs Authorization',
  pattern: 'beforeAfter',
  alt:
    'Authentication asks "who are you?" and proves identity; authorization asks "what are ' +
    'you allowed to do?" and determines access rights.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'AUTHENTICATION',
      tone: 'neutral',
      items: ['Proves identity: "who are you?"'],
    },
    right: {
      title: 'AUTHORIZATION',
      tone: 'acc',
      items: ['Determines access rights: "what are you allowed to do?"'],
    },
  },
}
