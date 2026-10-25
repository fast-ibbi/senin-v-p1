// Chapter 2 — Development Environment Setup · diagram 03
// Replaces the old Mermaid chart (bab-02-…-03.mmd). That chart was already containment:
// two named subgraphs ("Menyiapkan project" / "Menjalankan dan menguji"), each holding three
// numbered steps in order. That is a `tree` — root, two phases, six steps — and the phase
// grouping is the legacy chart's own, echoed by the presenter notes ("Read the diagram as two
// rows (setting up, then running)").
//
// Why not `flow`: the work sequence has six steps and `flow` takes at most five, so a flow would
// have had to merge `cd aplikasi-pertama` and `code .` into one stage and drop the phase split.
// `tree` keeps all six steps and both phases. Order inside a phase is carried by the legacy
// chart's own step numbers, which the notes also use ("point to step 4 (`code .`)"); the two
// phase chips are the container, not a claim that the steps are alternatives.
//
// Known cost, accepted: `tree` renders labels only, so the commands the legacy chart printed on
// a second line (create-expo-app, cd, code ., npx expo start) are not in the picture. They are on
// the two slides that follow this one, and the numbers keep the picture honest to the checklist.
export default {
  id: '03',
  slide: 'The Flow for Creating the First Project',
  pattern: 'tree',
  alt:
    'The six-step first-project checklist in two phases: setting up the project holds steps 1 ' +
    'verify node and npm, 2 create the project, 3 enter the folder; running and testing holds ' +
    'steps 4 open in VS Code, 5 start the server, 6 choose a path.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'First project',
      children: [
        {
          label: 'Setting up the project',
          children: [
            { label: '1 Verify node and npm' },
            { label: '2 Create the project' },
            { label: '3 Enter the folder' },
          ],
        },
        {
          label: 'Running and testing',
          children: [
            { label: '4 Open in VS Code' },
            { label: '5 Start the server' },
            { label: '6 Choose a path' },
          ],
        },
      ],
    },
  },
}
