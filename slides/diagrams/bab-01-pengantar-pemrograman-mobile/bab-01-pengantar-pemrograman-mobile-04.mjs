// Chapter 1 — Introduction to Mobile Programming · diagram 04
// Replaces the old Mermaid chart (bab-01-…-04.mmd), which drew JS/JSX code → React Native
// → Android ViewGroup / iOS UIView. That is one source forking into two native targets,
// and `tree` is the only primitive in the kit that forks, so it is the pattern — used as a
// fan-out, not as a containment claim.
//
// Three levels on purpose: a two-level tree (React Native → two children) would stop at
// x=626 of the 1160 canvas and leave half the picture empty. With the code at level 0 the
// canvas is filled and the legacy chart's "written once" origin survives.
//
// Known kit quirk, accepted knowingly: a root with a single child puts both on the same y,
// so "JavaScript / JSX" and "React Native" sit side by side. Here that is the truth of the
// slide — the code becomes React Native before anything forks — so it reads as a chain
// that forks rather than as two siblings. The alternative (dropping the code node) would
// lose the bullet the picture is illustrating.
//
// The picture sits at the top of its own slide, under the heading, instead of inside the
// two-column grid it used to share with the bullets. In that column it could only be w:520,
// which renders a 14px label at 6.3px — illegible. The slide was not too full (heading +
// three bullets + a 166px-tall picture uses about 360 of the 720px), so this needed no new
// slide: the grid was the constraint, not the slide. The three bullets survive untouched
// below the picture, which is the shape Chapter 6's "Principle 4" slide already uses.
export default {
  id: '04',
  slide: 'Ditulis Sekali, Digambar Native di Dua Platform',
  pattern: 'tree',
  alt:
    'JavaScript and JSX code written once goes into React Native, which draws ViewGroup on ' +
    'Android and UIView on iOS — components owned by the operating system.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'JavaScript / JSX',
      children: [
        {
          label: 'React Native',
          children: [{ label: 'ViewGroup on Android' }, { label: 'UIView on iOS' }],
        },
      ],
    },
  },
}
