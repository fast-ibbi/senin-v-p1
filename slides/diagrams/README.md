# Diagram specs

One folder per deck. Each folder holds the `slide-diagrams` kit specs for one chapter:
`<deckDir>/diagrams/<deckSlug>/<deckSlug>-NN.mjs`, one file per picture. A spec carries
data only — geometry, text wrapping, and the font-size floor belong to the kit at
`~/.pi/agent/skills/slide-diagrams`.

## Always pass `--specs`

The kit looks for `<deckDir>/diagrams` (that is, `slides/diagrams`) and does **not**
recurse. Because every deck lives in `slides/`, a flat folder would make each deck load
every other deck's specs, and both builds fail with `names slide … but no ## heading
matches` plus `duplicate id`. So each deck's specs sit in its own subfolder and the
build is always told where they are:

```bash
SKILL=~/.pi/agent/skills/slide-diagrams
DECK=slides/bab-07-navigasi-aplikasi.md        # your deck
SPECS=slides/diagrams/bab-07-navigasi-aplikasi # its specs

# validate + print the plan, write nothing
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --dry

# write the SVGs into slides/assets/diagrams and refresh the image lines
node $SKILL/scripts/build.mjs $DECK --specs $SPECS

# facts table for a whole deck (read-only), before deciding anything
node $SKILL/scripts/build.mjs $DECK --audit

# rasterize one picture to look at it
node $SKILL/scripts/build.mjs $DECK --specs $SPECS --png 04
```

## Naming

- Spec: `slides/diagrams/<deckSlug>/<deckSlug>-NN.mjs`, `id` matching `NN`.
- Output: `slides/assets/diagrams/<deckSlug>-NN.svg`, referenced as
  `![w:1120](assets/diagrams/<deckSlug>-NN.svg)`.
- Deck slug = the deck's filename without `.md`. Never rename a deck: the spec paths,
  the SVG paths, and the deck's own image lines all derive from it.
- When a spec replaces a legacy Mermaid chart, keep that chart's `NN` and therefore its
  SVG path. The `.mmd` file stays as a provenance trail; the `.svg` at that path becomes
  kit output.

## Legibility, not just fit

The kit's 14px floor is in SVG units. On the slide the canvas is scaled by
`imgWidth ÷ canvasWidth` (canvas is 1160 wide): `w:1120` renders a 14px label at
13.5px, `w:720` renders it at 8.7px. Raise `imgWidth` before you shrink anything, and if
the slide is too full for the width it needs, split it into a
`## Diagram: <original heading>` slide placed **after** the prose slide.

## House style

`bab-06-membangun-user-interface-mobile/README.md` is the worked example: what each
spec means, why patterns were chosen, and how to rebuild. Labels come from the slide's
own words; the build prints a provenance report for anything it cannot find there, and
that report should be quoted (with a reason) rather than silenced.
