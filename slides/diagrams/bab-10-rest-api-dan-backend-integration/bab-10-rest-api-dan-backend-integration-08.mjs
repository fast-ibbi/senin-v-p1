// Chapter 10 — REST API and Backend Integration · diagram 08
// New picture — there was no such chart in the old Mermaid set. The slide is a
// definition plus two columns of duties, and the columns are already on the slide, so
// a `beforeAfter` of Client | Server would only photograph the prose. What the columns
// cannot show is the *separation* the definition insists on — "a firm separation
// between the party requesting a service and the party providing it" — and the
// misconception the presenter notes warn about ("students often think the server is
// part of the app"). `tree` draws exactly that: one architecture, two separate
// branches, and four duties hanging off the branches, not off each other.
//
// `tree` renders `label` only (a `note` is silently dropped), so the duties have to be
// labels. They are the slide's words, kept verbatim and split at the commas:
// "Stores, manages, and safeguards the data" becomes "stores, manages" +
// "safeguards the data" — two chips, no word invented and none dropped.
//
// Both bullet clauses drawn here moved verbatim into this slide's presenter notes under
// "Trimmed to the picture (the diagram says this)". The two bullets that stay are the
// ones the picture does *not* show: which program runs where (the Expo app on a phone;
// an Express program in backend/, port 3000).
export default {
  id: '08',
  slide: 'The Client–Server Concept',
  pattern: 'tree',
  alt:
    'One client–server architecture with two separate branches: the client composes the ' +
    'request and displays the result; the server stores, manages and safeguards the data.',
  imgWidth: 1120,
  data: {
    root: {
      label: 'Client–server',
      children: [
        {
          label: 'Client',
          children: [{ label: 'composes the request' }, { label: 'displays the result' }],
        },
        {
          label: 'Server',
          children: [{ label: 'stores, manages' }, { label: 'safeguards the data' }],
        },
      ],
    },
  },
}
