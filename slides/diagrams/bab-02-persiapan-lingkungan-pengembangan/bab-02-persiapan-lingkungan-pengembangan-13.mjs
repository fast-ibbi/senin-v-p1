// Chapter 2 — Development Environment Setup · diagram 13 (new: no legacy Mermaid chart at 13)
//
// This slide is one code block plus three bullets that annotate three parts of it — `npx`, the
// project name and `--template blank`. The presenter notes ask the lecturer to do exactly that out
// loud ("Stress reading the command rather than memorizing it: npx, the project name, then the
// template"), so the picture is the annotation: part on the left, job on the right, one row each.
// That is `beforeAfter` in its literal form — two panels, parallel rows, badges carrying the
// correspondence.
//
// Why not `flow`: the code block is four commands, and their order is already drawn one slide
// earlier (id 03, "The Flow for Creating the First Project"), which deliberately left the commands
// out of its labels. A second drawing of the same chain on the next slide would be filler, so this
// one shows the part-to-job mapping that id 03 could not: a `tree` would drop the job of each flag,
// since it renders labels only.
//
// Trimming: only bullet 1 moved (verbatim, into the presenter notes). The picture covers all three
// bullets, but the rule for this pass keeps at least two bullets on a slide that had bullets, so
// bullets 2 and 3 stay and do repeat rows 2 and 3 of the picture — accepted, and the reason the
// left panel is titled "Parts of the command" rather than pretending to be the whole line.
export default {
  id: '13',
  slide: 'Creating the First Expo Project',
  pattern: 'beforeAfter',
  alt:
    'Reading the command part by part: npx runs the newest version of the tool with nothing ' +
    'installed globally, aplikasi-pertama becomes the project folder name — lowercase, no spaces — ' +
    'and --template blank chooses a plain JavaScript template without TypeScript.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'Parts of the command',
      tone: 'neutral',
      mono: true,
      items: ['npx', 'aplikasi-pertama', '--template blank'],
    },
    right: {
      title: 'What each part does',
      tone: 'acc',
      items: [
        'runs the newest version, nothing installed globally',
        'becomes the project folder name: lowercase, no spaces',
        'a plain JavaScript template, without TypeScript',
      ],
    },
  },
}
