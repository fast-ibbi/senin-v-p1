// Chapter 2 — Development Environment Setup · diagram 08 (new: no legacy Mermaid chart at 08)
//
// The Expo CLI slide is three commands with one job each — a list of peers, which the selection
// test normally leaves as text. What the list cannot show is the thing the presenter notes insist
// on: "every command is run through npx: there is no global installation to manage and the tool
// version is always fresh". That is containment — one runner, three verbs hanging off it — so
// `tree`, and the root chip carries the shared prefix that the three bullets all repeat.
//
// Nothing is trimmed: `tree` renders labels only, so the three job descriptions ("creates a new
// project", "starts the development server", "an SDK-bundled package") are not in the picture and
// stay on the slide. The picture is deliberately small: it adds the shared runner, not a second
// list. The argument placeholder is dropped from the third child on purpose — `tree` switches a
// node to monospace as soon as its label contains `<` or `/`, so keeping `<package>` would have
// rendered one child in a different typeface from its two siblings.
//
// Canvas width 660, not 1160: `tree` fixes its three level widths and left-packs them, so at 1160
// the picture filled 55% of the canvas and read as half a drawing on the slide. The canvas is cut
// to the drawing (24px pad + 218 root + 84 elbow + 300 nodes + 34), and `imgWidth` matches it, so
// the picture is drawn at scale 1 — a 16px label stays 16px on the projector.
export default {
  id: '08',
  slide: 'Expo CLI: The Command-Line Interface',
  pattern: 'tree',
  alt:
    'Every Expo CLI job is run through npx, so nothing is installed globally: create-expo-app, ' +
    'expo start, and expo install hang off the same runner.',
  imgWidth: 660,
  data: {
    canvas: [660, 234],
    root: {
      label: 'npx',
      children: [
        { label: 'create-expo-app' },
        { label: 'expo start' },
        { label: 'expo install' },
      ],
    },
  },
}
