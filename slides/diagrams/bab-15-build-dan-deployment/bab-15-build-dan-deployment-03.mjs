// Chapter 15 — Build and Deployment · diagram 03
// Replaces the old Mermaid chart (bab-15-…-03.mmd), which was a diamond: an AAB box, a
// Google Play box, three APK boxes, and one "download is smaller" box fanned together.
// A diamond is not one of the six shapes; the relationship underneath it is containment —
// one AAB becomes one build per device category — so the pattern is `tree`.
//
// The root is the AAB because the slide's heading asks "why AAB exists": the picture has
// to start at the one file. Google Play does the assembling (its own slide says so, and
// this slide's notes: "the party assembling the split APKs is Google, not the developer");
// the alt text says it rather than inventing a middle box, because a single-child elbow
// would put AAB and Google Play on one line and read as two siblings.
//
// The "download size drops" outcome is the blockquote directly under this picture on the
// slide, so it is left out of the tree instead of being forced into a sibling slot.
//
// "per" is the connector the prose implies: the blockquote says a split APK "only contains
// the processor architecture, screen density, and language of that device".
export default {
  id: '03',
  slide: 'Kenapa AAB Ada: Satu File, Banyak APK',
  pattern: 'tree',
  alt:
    'One AAB holds every device variant; Google Play assembles it into a split APK per ' +
    'processor architecture, per screen density, and per language, so each user downloads ' +
    'only the parts their device needs.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'AAB',
      children: [
        { label: 'APK per processor architecture' },
        { label: 'APK per screen density' },
        { label: 'APK per language' },
      ],
    },
  },
}
