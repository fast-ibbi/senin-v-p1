// Chapter 1 — Introduction to Mobile Programming · diagram 15
// Slide 29, "Case Study: Campus Needs". No legacy chart.
//
// The slide is one case with two sides: three symptoms under "The problem" and two under
// "The requirements formulated", with the diagnosis ("the root of the problem is not the
// data, but the channel that delivers it") closing it. The slide already lays the two sides
// out as columns, and this chapter has used `beforeAfter` for exactly that shape four times
// (specs 02, 08, 10, 11, and Chapter 2's spec 09): two mental models side by side, panel
// titles taken from the slide's own bold sub-headings.
//
// `tree` was built first and rejected on two grounds. One is space: at 8 nodes it is 358
// canvas units ≈ 346px on the slide, and with five bullets below it the last bullet and the
// closing line fell off the bottom edge — measured, not guessed (slide 29 clipped at the
// footer in the Marp render). The other is meaning: a tree that keeps both branches whole
// duplicates what stays on the slide, and a tree that stops the requirements branch at its
// label leaves a branch with nothing hanging off it, which reads as an unfinished picture.
//
// Rows are 3 against 2, and they are NOT paired one to one — the same caveat as Chapter 2's
// spec 09. The left rows are the three problem bullets verbatim (they move into the
// presenter notes); the right rows drop their subject on purpose ("Students need …",
// "Lecturers and academic staff: …") because that subject is what the two surviving bullets
// below the picture supply. The leaf-level text therefore stays a substring of the slide,
// and the duplication with the two kept bullets is a phrase, not a repeated sentence.
//
// Tones: `amber` on the problems — the friction the case is about, not an error; `acc` on
// the requirements, which are what the case turns into.
export default {
  id: '15',
  slide: 'Case Study: Campus Needs',
  pattern: 'beforeAfter',
  alt:
    'The case in two columns. The problem: class schedules are only posted on the notice ' +
    'board, room changes are announced through unofficial chat groups, and grades are only ' +
    'at the academic office during office hours while course registration always queues. ' +
    'The requirements formulated: schedules, grades, course registration and announcements, ' +
    'and teaching schedules with a reduced service burden.',
  imgWidth: 1120,
  data: {
    left: {
      title: 'THE PROBLEM',
      tone: 'amber',
      items: [
        'Class schedules are only posted on the notice board',
        'Room changes are announced through unofficial chat groups',
        'Grades are only at the academic office during office hours; course registration always queues',
      ],
    },
    right: {
      title: 'THE REQUIREMENTS FORMULATED',
      tone: 'acc',
      items: [
        'Schedules, grades, course registration, announcements',
        'Teaching schedules, a reduced service burden',
      ],
    },
  },
}
