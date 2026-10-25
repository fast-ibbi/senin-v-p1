// Chapter 10 — REST API and Backend Integration · diagram 07
// New picture — there was no such chart in the old Mermaid set. The slide already
// sets the two models side by side (`grid2`), so the picture is NOT allowed to
// repeat the two columns a third time: it carries the one axis the columns do not
// make visible, the axis the blockquote turns on — *when a change reaches the other
// users*. Everything else the columns say stays on the slide as prose.
//
// One row per side on purpose. The left item and the right item are the same kind of
// statement (what happens to the data when something changes), which is what makes the
// two panels read as a before/after rather than as two definitions. The panel titles are
// the model names only — "(Chapters 6–8)" and "(an IS requirement)" stay on the columns
// above the picture, because printing the same heading twice on one slide is noise.
//
// Both bullets drawn here moved verbatim into this slide's presenter notes under
// "Trimmed to the picture (the diagram says this)". Nothing was deleted: the columns
// keep "Written inside the code, the same for all users" and "New students are added,
// GPAs are updated, data is deleted", which are facts the picture does not show.
export default {
  id: '07',
  slide: 'From Static Data to Dynamic Data',
  pattern: 'beforeAfter',
  alt:
    'Two models on the same axis, when a data change reaches the other users: static data ' +
    'changes only when the code changes and the app is rebuilt; dynamic data must be the ' +
    'same on every device, all the time.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'Static data',
      tone: 'red',
      items: ['Changes only when the code changes and the app is rebuilt'],
    },
    right: {
      title: 'Dynamic data',
      tone: 'acc',
      items: ['Must be the same on every device, all the time'],
    },
  },
}
