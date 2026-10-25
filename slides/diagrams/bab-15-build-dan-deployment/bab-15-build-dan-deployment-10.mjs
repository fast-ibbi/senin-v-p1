// Chapter 15 — Build and Deployment · diagram 10
// A new picture (no legacy chart at this id). The slide's third bullet states the adaptive
// icon as an addition: `foregroundImage` (safe area in the middle) + `backgroundColor`. Its
// presenter notes say why the addition exists and call it the thing to stress — "modern
// Android crops icons to the shape of the device launcher, so the foreground and the
// background must be separated". One surface drawn on another is `layers`, and the order is
// not a metaphor: the foreground really does sit on the background.
//
// The top band takes the accent because the foreground is the band that carries the
// constraint; the lower band is written `neutral` explicitly, since `layers` accents the top
// band by default and leaving it alone would put the emphasis in the right place by luck.
//
// Honest limit: `layers` bands are equal height and cannot draw an inset, so the picture
// cannot show that the safe area is a margin *inside* the foreground — that fact stays in
// the note and in the bullet. The splash bullets (the definition, the file, the config
// plugin and its parameters) are a different subject from the icon layers, so they are not
// drawn; the picture is the adaptive icon only.
export default {
  id: '10',
  slide: 'Icon, Adaptive Icon, and Splash Screen',
  pattern: 'layers',
  alt:
    'The two layers of an adaptive icon: foregroundImage on top, with the safe area in the ' +
    'middle, sitting on backgroundColor, which fills the region the device launcher crops.',
  imgWidth: 1120,
  data: {
    layers: [
      { label: 'foregroundImage', note: 'safe area in the middle', tone: 'acc' },
      { label: 'backgroundColor', note: 'region cropped by the launcher', tone: 'neutral' },
    ],
  },
}
