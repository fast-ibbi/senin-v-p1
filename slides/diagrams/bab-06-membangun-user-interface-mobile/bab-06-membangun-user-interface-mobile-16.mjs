// Chapter 6 — Building a Mobile User Interface · diagram 16
// New picture. The four practices split cleanly by who is on the receiving end, and the
// slide's own words name both: three of them are what a screen reader has to be told (role,
// label, state) and two are about the area a finger has to hit (44×44 / 48×48, and `hitSlop`
// when the icon is small). Two panels, no verdict, one audience each — `beforeAfter`.
//
// Why not `tree` (role, label, state, hitSlop hanging off one element): it is true that all
// four are properties of the same element, but the elbows would add nothing to a list that is
// already about one element, and the values — `button`, "Tap here", `{ disabled: true }` —
// would be dropped, because `tree` draws labels only.
//
// Neither panel is the wrong way to build; both tones are explicit so the default red does
// not paint the screen-reader panel as a mistake. The accent sits on that panel because it
// holds three of the four practices and the exact prop names a student has to type.
//
// The `mono` flags are set by hand: left to the kit, the right panel's parentheses in
// "44×44 points (Apple)" would make it look like code and switch the whole panel to
// monospace, while the panel that really is code — three prop names — would stay in prose
// type. So the props are mono and the sizing rule is not.
export default {
  id: '16',
  slide: 'Accessibility: Four Basic Practices',
  pattern: 'beforeAfter',
  alt:
    'The four practices split by audience: a screen reader needs accessibilityRole, ' +
    'accessibilityLabel and accessibilityState; a finger needs a touch target of at least ' +
    '44×44 points (Apple) or 48×48 dp (Material Design), and a small icon is extended with hitSlop.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'SCREEN READER',
      tone: 'acc',
      mono: true,
      items: [
        "accessibilityRole — the element's role",
        'accessibilityLabel — descriptive alternative text',
        'accessibilityState — element state',
      ],
    },
    right: {
      title: 'TOUCH TARGET',
      tone: 'neutral',
      mono: false,
      items: [
        'Minimum touch target 44×44 points (Apple) or 48×48 dp (Material Design)',
        'Do not shrink the touch area — extend it with hitSlop',
      ],
    },
  },
}
