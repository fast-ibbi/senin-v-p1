// Chapter 9 — State Management · diagram 04
// Replaces the old Mermaid chart (bab-09-state-management-04.mmd), a left-to-right
// fan-out that merged both screens into one `useCart` node and then into CartContext.
// A `flow` cannot draw a fan-out plus a merge without lying about the order, so the
// pattern is `tree`: the content is containment — which route sits inside which
// provider scope, and what each route reaches.
//
// Two nodes per level, on purpose. The kit gives a parent with a single child a
// zero-height elbow, which puts parent and child on one y and reads as siblings;
// two children keep the provider visibly above both routes.
//
// The merged CartContext node from the old chart is deliberately not drawn as a
// third child: a tree edge means "contained in", and CartContext is the value the
// provider publishes, not a thing nested under it. The acc-tinted leaves mark the
// point the presenter notes stress — a screen never touches the context directly,
// the only door is useCart().
//
// The root chip carries its mount point in parentheses, which wraps to a second line,
// because "CartProvider at the root" is the whole reason the cart is global. The kit's
// `tree` silently drops a node's `note`, so the mount point cannot live there.
export default {
  id: '04',
  slide: 'Cakupan Provider Menentukan Banyaknya Re-render',
  pattern: 'tree',
  alt:
    'Provider structure: CartProvider mounted in app/_layout.js wraps every route, and both ' +
    'app/index.js and app/keranjang.js reach the cart only through useCart().',
  imgWidth: 1120,
  data: {
    root: {
      label: 'CartProvider (app/_layout.js)',
      children: [
        { label: 'app/index.js', children: [{ label: 'useCart()', tone: 'acc' }] },
        { label: 'app/keranjang.js', children: [{ label: 'useCart()', tone: 'acc' }] },
      ],
    },
  },
}
