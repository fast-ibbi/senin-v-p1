// Chapter 12 — Accessing Device Features · diagram 06
// Slide 18, "Location: Two Sources of Position". A `beforeAfter` of GPS against
// network-based position lived here once (retired id 05) and was deleted in review: its
// rows were the slide's own bullets re-arranged, so the picture added ink and no
// information. That verdict still holds and this spec does not bring it back.
//
// What the prose does hide is containment. The slide states one package and two sources in
// a flat list, and hides a second level inside a parenthesis: the network source is not one
// mechanism but two — "Network-based position (Wi-Fi and cell towers)". `tree` is the only
// pattern that draws that nesting, and its three ranks map onto the slide exactly: the
// package that unites the sources, the two sources, and the two things the network source
// listens to.
//
// Labels are the slide's words: `expo-location` from the fourth bullet, "GPS" from the
// first, "Network-based position" from the third (written whole, hyphen and all, rather
// than shortened to "Network position"), "Wi-Fi" and "Cell towers" from the third bullet's
// parenthesis. Nothing here is a new participant.
//
// What the tree deliberately does not carry: the four trade-off facts — satellite signals,
// accurate in the open air, hundreds of meters off indoors, faster and less precise. Those
// are properties of the two sources, not containment, and `tree` drops `note` fields
// anyway; the bullets stay on the slide and keep them. The root is the package because the
// slide's claim is that expo-location unites both sources — the arrows read "reaches", not
// "is made of", and the alt text says so.
//
// No `tone` on the children: the accent already marks the unifier at the root, and
// colouring one source blue would suggest it is the preferred one, which the slide does not
// say.
export default {
  id: '06',
  slide: 'Location: Two Sources of Position',
  pattern: 'tree',
  alt:
    'expo-location unites two sources of position: GPS, and network-based position, which ' +
    'itself listens to Wi-Fi and cell towers.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'expo-location',
      children: [
        { label: 'GPS' },
        {
          label: 'Network-based position',
          children: [{ label: 'Wi-Fi' }, { label: 'Cell towers' }],
        },
      ],
    },
  },
}
