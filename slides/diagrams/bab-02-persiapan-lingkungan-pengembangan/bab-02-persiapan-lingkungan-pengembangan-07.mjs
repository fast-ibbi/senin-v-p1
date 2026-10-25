// Chapter 2 — Development Environment Setup · diagram 07 (new: no legacy Mermaid chart at 07)
//
// The troubleshooting slide is not a checklist, it is a mode set: the terminal answers "command
// not found" because Node.js is absent *or* because the terminal has not read the PATH; installing
// fixes the first and not the second; opening a new terminal fixes the second. The presenter notes
// name the trap in one line — "students often reinstall Node.js many times when they only need to
// open a new terminal" — which is not a step in a chain but a transition that returns to the same
// state, so `stateMachine` (a flow would have had to draw re-installing as progress).
//
// Trimming: bullets 2 and 4 moved verbatim into the presenter notes; "Path not loaded" and the
// self-loop are those two bullets. Bullet 1 stays: the picture says "command not found" but not the
// Windows wording ("'node' is not recognized"), which is the variant students actually search for.
// Bullets 3 and 5 stay because the picture carries neither the nodejs.org download nor the
// prevention rule.
//
// Transition labels are kept short (one word where the material allows) because an
// adjacent-forward arrow has only the 90px gap to write in — a longer verb is a FitError, and a
// 12-character label renders flush against both chips. No `initial` dot: the kit draws it 34px
// left of the first chip with an arrow that does not survive at this width, so it read as debris
// in the middle of the canvas; the row order already says where the sequence starts.
export default {
  id: '07',
  slide: 'When the Command Is Not Recognized',
  pattern: 'stateMachine',
  alt:
    'Three states in a row: command not found, then PATH not loaded after installing the LTS, then a ' +
    'version prints once a new terminal is opened. Reinstalling loops back to the same middle ' +
    'state.',
  imgWidth: 1120,
  data: {
    states: [
      { id: 'notfound', label: 'command not found', tone: 'red' },
      { id: 'stale', label: 'PATH not loaded', tone: 'amber' },
      { id: 'ok', label: 'a version prints', tone: 'green' },
    ],
    transitions: [
      { from: 'notfound', to: 'stale', label: 'install' },
      { from: 'stale', to: 'ok', label: 'reopen', tone: 'green' },
      { from: 'stale', to: 'stale', label: 'reinstall', tone: 'red' },
    ],
  },
}
