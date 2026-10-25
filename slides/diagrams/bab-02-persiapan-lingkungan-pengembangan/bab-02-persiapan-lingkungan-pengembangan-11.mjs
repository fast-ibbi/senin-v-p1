// Chapter 2 — Development Environment Setup · diagram 11 (new: no legacy Mermaid chart at 11)
//
// The adb slide is a checklist whose order is the whole difficulty. The presenter notes name that
// order out loud — "Developer options first, then USB debugging, then connect the cable" — and the
// warning explains what goes wrong when it is reversed ("the unauthorized status means the phone
// has not yet approved the computer's authentication"). A peer list cannot show an order; a chain
// can, so `flow`, with the goal (`adb devices` recognizing the device) as the accented last stage.
//
// Edge verbs are the material's own: "then" is the notes' connector, "allow" is the bullet's own
// verb ("then allow RSA authentication"), "lists" is the second bullet's verb. Nothing is inferred
// except the arrow direction.
//
// Trimming: bullets 2, 3 and 4 moved verbatim into the presenter notes; each one is a stage of the
// picture. Bullets 1 and 5 stay. Bullet 1 defines adb as "the command-line bridge" — the picture
// shows a setup order, not what the bridge is for. Bullet 5 is the exception that matters most
// ("For Expo Go, a USB connection is not required — one Wi-Fi network is enough"): drawing it as a
// stage of a USB setup would contradict it, and moving it would leave the class believing a cable
// is mandatory.
export default {
  id: '11',
  slide: 'adb and Physical Devices',
  pattern: 'flow',
  alt:
    'The Android setup order: enable Developer options by tapping Build number seven times, switch ' +
    'on USB debugging, allow RSA authentication when the phone asks, and adb devices then lists the ' +
    'device the computer recognizes.',
  imgWidth: 1120,
  data: {
    steps: [
      { label: 'Developer options', note: 'tap Build number seven times' },
      { label: 'USB debugging', note: 'then switched on' },
      { label: 'RSA authentication', note: 'the phone asks first' },
      { label: 'adb devices', note: 'the device is recognized', tone: 'acc' },
    ],
    edges: ['then', 'allow', 'lists'],
  },
}
