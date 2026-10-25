#!/usr/bin/env node
/**
 * Membangun diagram SVG untuk deck `slides/bab-04-dasar-react.md`.
 *
 * Diagram sengaja ditulis sebagai kode (bukan SVG tangan) supaya:
 *   - warna, ukuran huruf, dan jarak konsisten dengan `slides/theme/academic.css`;
 *   - teks mudah diperbarui saat materi berubah, lalu dibangun ulang;
 *   - tidak ada lagi diagram Mermaid bergaya abu-abu yang berbeda dari tema.
 *
 * Pakai:  node scripts/build-diagrams-bab04.mjs [--only=05,06]
 * Hasil:  slides/assets/diagrams/bab-04-dasar-react-NN.svg
 *
 * Kanvas standar 1160 x ~470, dipasang di slide dengan `![w:1120](...)`
 * (skala 0,966) agar tinggi maksimum tetap di bawah area judul 16:9.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'slides', 'assets', 'diagrams')

/* ------------------------------------------------------------------ tokens */

const INK = '#111827'
const MUTED = '#6b7280'
const ACC = '#1d4ed8'
const ACC_SOFT = '#eef2ff'
const ACC_BORDER = '#c7d2fe'
const SURF = '#f8fafc'
const BORDER = '#e5e7eb'
const CODE = '#f6f8fa'
const SLATE = '#94a3b8'
const RED = '#b91c1c'
const RED_SOFT = '#fef2f2'
const RED_BORDER = '#fecaca'
const GREEN = '#15803d'
const GREEN_SOFT = '#f0fdf4'
const GREEN_BORDER = '#bbf7d0'
const AMBER = '#b45309'
const AMBER_SOFT = '#fffbeb'
const AMBER_BORDER = '#fde68a'

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif`
const MONO = `ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`

const PILL = {
  code: { fill: CODE, stroke: BORDER, cls: '' },
  plain: { fill: '#ffffff', stroke: BORDER, cls: '' },
  acc: { fill: ACC_SOFT, stroke: ACC_BORDER, cls: 'ac' },
  bad: { fill: RED_SOFT, stroke: RED_BORDER, cls: 'rd' },
  ok: { fill: GREEN_SOFT, stroke: GREEN_BORDER, cls: 'gn' },
  warn: { fill: AMBER_SOFT, stroke: AMBER_BORDER, cls: 'am' },
  ink: { fill: INK, stroke: INK, cls: 'wh' },
}

const TONE = {
  neutral: { header: SURF, border: BORDER, title: '' },
  acc: { header: ACC_SOFT, border: ACC_BORDER, title: 'ac' },
  red: { header: RED_SOFT, border: RED_BORDER, title: 'rd' },
  green: { header: GREEN_SOFT, border: GREEN_BORDER, title: 'gn' },
  amber: { header: AMBER_SOFT, border: AMBER_BORDER, title: 'am' },
  ink: { header: INK, border: INK, title: 'wh' },
}

const SIZES = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 30, 32, 34, 36, 38]
const sz = (n) => `s${n}`
const r1 = (n) => Math.round(n * 10) / 10
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* ----------------------------------------------------------------- helpers */

function textWidth(s, size, mono = false) {
  if (mono) return s.length * size * 0.6
  let u = 0
  for (const ch of s) {
    if (ch === ' ') u += 0.28
    else if ("iljtfrI.,;:!|'’".includes(ch)) u += 0.3
    else if ('mwMW'.includes(ch)) u += 0.86
    else if (/[A-Z]/.test(ch)) u += 0.68
    else if (/[0-9]/.test(ch)) u += 0.56
    else u += 0.54
  }
  return u * size
}

/** Teks satu baris. `cls` = kelas gaya, mis. "s20 b6 ac". */
const tx = (x, y, s, cls = 's20') =>
  `<text class="t ${cls}" x="${r1(x)}" y="${r1(y)}">${esc(s)}</text>`

/** Teks rata tengah pada x. */
const tc = (x, y, s, cls = 's20') =>
  `<text class="t ${cls} mid" x="${r1(x)}" y="${r1(y)}">${esc(s)}</text>`

/** Teks rata kanan pada x. */
const te = (x, y, s, cls = 's20') =>
  `<text class="t ${cls} end" x="${r1(x)}" y="${r1(y)}">${esc(s)}</text>`

/** Teks mono (kode) satu baris. */
const cm = (x, y, s, cls = 's17') => tx(x, y, s, `m ${cls}`)

function rect(x, y, w, h, o = {}) {
  const { fill = '#fff', stroke = BORDER, sw = 1.5, r = 10, dash, opacity } = o
  return (
    `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${r}"` +
    ` fill="${fill}" stroke="${stroke}" stroke-width="${sw}"` +
    (dash ? ` stroke-dasharray="${dash}"` : '') +
    (opacity != null ? ` opacity="${opacity}"` : '') +
    '/>'
  )
}

function ln(x1, y1, x2, y2, o = {}) {
  const { stroke = BORDER, sw = 1.5, dash } = o
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"` +
    ` stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"` +
    (dash ? ` stroke-dasharray="${dash}"` : '') +
    '/>'
  )
}

const ARROW_COLOR = { slate: SLATE, acc: ACC, red: RED, green: GREEN, ink: INK }

function ar(x1, y1, x2, y2, o = {}) {
  const { color = 'slate', sw = 2, dash, head = true } = o
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"` +
    ` stroke="${ARROW_COLOR[color]}" stroke-width="${sw}" stroke-linecap="round"` +
    (head ? ` marker-end="url(#a-${color})"` : '') +
    (dash ? ` stroke-dasharray="${dash}"` : '') +
    '/>'
  )
}

function path(d, o = {}) {
  const { color = 'slate', sw = 2, dash, fill = 'none', head = true } = o
  return (
    `<path d="${d}" fill="${fill}" stroke="${ARROW_COLOR[color]}" stroke-width="${sw}"` +
    ` stroke-linecap="round" stroke-linejoin="round"` +
    (head ? ` marker-end="url(#a-${color})"` : '') +
    (dash ? ` stroke-dasharray="${dash}"` : '') +
    '/>'
  )
}

/** Kotak kode berlabel. Mengembalikan { w, h, svg }. */
function pill(x, y, s, o = {}) {
  const { size = 17, tone = 'code', padX = 10 } = o
  const h = o.h ?? Math.round(size * 1.8)
  const w = Math.ceil(textWidth(s, size, true) + padX * 2)
  const pal = PILL[tone]
  return {
    w,
    h,
    svg:
      rect(x, y, w, h, { fill: pal.fill, stroke: pal.stroke, sw: 1, r: 7 }) +
      `<text class="m ${sz(size)} ${pal.cls}" x="${r1(x + padX)}" y="${r1(y + h / 2 + size * 0.36)}">${esc(s)}</text>`,
  }
}

/** Panel berkepala. */
function panel(x, y, w, h, o = {}) {
  const { title, tone = 'neutral', headerH = 46, r = 12, body = '#ffffff' } = o
  const pal = TONE[tone]
  const parts = [rect(x, y, w, h, { fill: body, stroke: 'none', r })]
  if (title) {
    parts.push(rect(x, y, w, headerH, { fill: pal.header, stroke: 'none', r }))
    parts.push(rect(x, y + headerH - r, w, r, { fill: pal.header, stroke: 'none', r: 0 }))
    parts.push(tx(x + 18, y + headerH / 2 + 6, title, `s17 b7 ${pal.title}`))
    parts.push(ln(x, y + headerH, x + w, y + headerH, { stroke: pal.border, sw: 1 }))
  }
  parts.push(rect(x, y, w, h, { fill: 'none', stroke: pal.border, r }))
  return parts.join('')
}

function badge(cx, cy, label, o = {}) {
  const { r = 13, tone = 'acc', size = 15 } = o
  const pal = PILL[tone]
  return (
    `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="1"/>` +
    `<text class="t ${sz(size)} b7 ${pal.cls} mid" x="${r1(cx)}" y="${r1(cy + size * 0.36)}">${esc(label)}</text>`
  )
}

/** Baris ikon + teks (dipakai untuk ✅ / ❌). */
function mark(x, y, ok, label, cls = 's18') {
  const color = ok ? 'gn' : 'rd'
  const glyph = ok ? '✓' : '✗'
  return (
    `<text class="t ${cls} b7 ${color}" x="${r1(x)}" y="${r1(y)}">${glyph}</text>` +
    tx(x + 22, y, label, `${cls} ${color} b6`)
  )
}

/** Daftar baris teks, dikembalikan sebagai satu string. */
function lines(x, y, arr, cls = 's17', lh = 22) {
  return arr.map((s, i) => tx(x, y + i * lh, s, cls)).join('')
}

/* ------------------------------------------------------------------ wrapper */

const MARKERS = Object.entries(ARROW_COLOR)
  .map(
    ([key, color]) =>
      `<marker id="a-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
      `<path d="M0 0 L10 5 L0 10 z" fill="${color}"/></marker>`,
  )
  .join('')

const CSS = `
.t{font-family:${FONT};fill:${INK}}
.m{font-family:${MONO}}
.mu{fill:${MUTED}}
.ac{fill:${ACC}}
.rd{fill:${RED}}
.gn{fill:${GREEN}}
.am{fill:${AMBER}}
.wh{fill:#ffffff}
.b6{font-weight:600}
.b7{font-weight:700}
.mid{text-anchor:middle}
.end{text-anchor:end}
${SIZES.map((n) => `.s${n}{font-size:${n}px}`).join('')}
`

function diagram(h, parts) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1160 ${h}" width="1160" height="${h}" role="img">` +
    `<defs>${MARKERS}</defs><style>${CSS}</style>` +
    parts.filter(Boolean).join('\n') +
    '</svg>\n'
  )
}

/* ================================================================= diagrams */

const diagrams = {}

/* 05 — Mengapa React ada: imperatif vs deklaratif (slide 5) ------------- */

diagrams['bab-04-dasar-react-05'] = () =>
  diagram(474, [
    panel(0, 0, 560, 390, { title: 'IMPERATIVE — one command at a time', tone: 'red' }),
    tx(24, 78, 'Code manages every part of the screen itself.', 's17 mu'),

    ...[0, 1, 2].map((i) => {
      const y = 100 + i * 44
      const codes = ['el.textContent = nama', 'list.appendChild(kartu)', 'cart.textContent = total']
      const p = pill(64, y, codes[i], { size: 16 })
      return badge(38, y + p.h / 2, String(i + 1), { tone: 'plain' }) + p.svg
    }),

    // langkah yang terlupa
    rect(64, 240, 300, 42, { fill: RED_SOFT, stroke: RED_BORDER, r: 7, dash: '5 4' }),
    cm(76, 266, '// update the cart count', 's16 rd'),
    tx(374, 266, 'missed', 's15 b7 rd'),

    // layar yang tertinggal
    rect(374, 96, 162, 132, { fill: SURF, stroke: BORDER, r: 8 }),
    tx(386, 118, 'Screen', 's13 b6 mu ls'),
    tx(386, 148, 'Cart (3)', 's16 b6'),
    tx(386, 176, 'Items: 2', 's16 b6 rd'),
    tx(386, 206, '✗ mismatch', 's14 b6 rd'),

    tx(24, 330, 'One part left behind → data and view no longer match.', 's16 mu'),

    panel(600, 0, 560, 390, { title: 'DECLARATIVE — result of data', tone: 'acc' }),
    tx(624, 78, 'Code only states what shows.', 's17 mu'),

    pill(624, 100, 'const data = { keranjang: 3 }', { size: 16, tone: 'acc' }).svg,
    ar(700, 150, 700, 186, { color: 'acc' }),
    tx(712, 174, 'React', 's14 b6 ac'),

    rect(624, 190, 226, 140, { fill: SURF, stroke: BORDER, r: 8 }),
    tx(638, 212, 'Screen', 's13 b6 mu ls'),
    tx(638, 246, 'Cart (3)', 's17 b6'),
    tx(638, 276, 'Items: 3', 's17 b6'),
    tx(638, 310, '✓ always matches', 's15 b6 gn'),

    tx(882, 236, 'No imperative', 's17 b6'),
    tx(882, 262, 'screen handling.', 's17 mu'),
    tx(882, 320, 'single source of data', 's15 mu'),

    rect(0, 412, 1160, 54, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 412, 6, 54, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 446, 'One data change → React updates every part that depends on it.', 's19 b6'),
  ])

/* 06 — UI = f(state) dan reconciliation (slide 6) ----------------------- */

function miniStack(x, y, rows, o = {}) {
  const { w = 96, rh = 16, gap = 5, accentRow = -1 } = o
  return rows
    .map((label, i) => {
      const yy = y + i * (rh + gap)
      const hot = i === accentRow
      return (
        rect(x, yy, w, rh, {
          fill: hot ? ACC_SOFT : SURF,
          stroke: hot ? ACC_BORDER : BORDER,
          sw: 1,
          r: 4,
        }) +
        `<text class="t s12 ${hot ? 'ac b6' : 'mu'}" x="${x + 8}" y="${yy + rh / 2 + 4}">${esc(label)}</text>`
      )
    })
    .join('')
}

diagrams['bab-04-dasar-react-06'] = () =>
  diagram(470, [
    `<text class="m s34 b7 mid" x="580" y="50">` +
      `<tspan fill="${INK}">UI</tspan><tspan fill="${MUTED}"> = </tspan>` +
      `<tspan fill="${ACC}">f</tspan><tspan fill="${INK}">(</tspan>` +
      `<tspan fill="${AMBER}">state</tspan><tspan fill="${INK}">)</tspan></text>`,
    tc(580, 80, 'the view is a function of data — not a sequence of commands', 's17 mu'),

    // empat tahap
    panel(0, 104, 257, 214, { title: '1 · state changes', tone: 'amber' }),
    pill(18, 144, "prodi = 'TI'", { size: 15, tone: 'warn' }).svg,
    tx(18, 214, 'What changes is the', 's15 mu'),
    tx(18, 236, 'data, not the view.', 's15 mu'),
    tx(18, 274, 'React waits for', 's15 mu'),
    tx(18, 296, 'the next trigger.', 's15 mu'),

    ar(259, 211, 297, 211, { color: 'slate' }),

    panel(301, 104, 257, 214, { title: '2 · component runs', tone: 'acc' }),
    pill(319, 144, 'App()', { size: 15, tone: 'acc' }).svg,
    tx(319, 214, 'Produces a description', 's15 mu'),
    tx(319, 236, 'of new UI — not yet', 's15 mu'),
    tx(319, 258, 'touching the screen.', 's15 mu'),
    pill(319, 274, 'render', { size: 14, tone: 'plain' }).svg,

    ar(560, 211, 598, 211, { color: 'slate' }),

    panel(602, 104, 257, 214, { title: '3 · compare', tone: 'neutral' }),
    tx(620, 174, 'old', 's13 b6 mu ls'),
    miniStack(620, 184, ['Budi', 'Siti', 'Andi'], { w: 100, accentRow: -1 }),
    tx(766, 174, 'new', 's13 b6 mu ls'),
    miniStack(766, 184, ['Siti', 'Andi'], { w: 74, accentRow: -1 }),
    tx(620, 272, 'diff: 1 card removed,', 's14 b6 ac'),
    tx(620, 292, 'the rest reused.', 's14 b6 ac'),

    ar(861, 211, 899, 211, { color: 'slate' }),

    panel(903, 104, 257, 214, { title: '4 · patch the screen', tone: 'green' }),
    rect(921, 140, 120, 72, { fill: SURF, stroke: BORDER, r: 6 }),
    tx(933, 158, 'Budi', 's12 mu'),
    rect(933, 170, 96, 16, { fill: ACC_SOFT, stroke: ACC_BORDER, sw: 1, r: 4 }),
    tx(941, 182, 'Siti  ← new', 's11 ac b6'),
    tx(933, 200, 'Andi', 's12 mu'),
    tx(921, 236, 'Only changed nodes', 's15 mu'),
    tx(921, 256, 'are updated.', 's15 mu'),
    tx(921, 286, 'Web: DOM', 's14 b6'),
    tx(921, 306, 'RN: native tree', 's13 mu'),

    rect(0, 344, 1160, 46, { fill: SURF, stroke: 'none', r: 10 }),
    tx(24, 374, 'Reconciliation = keep the old picture, compare, then apply the minimal diff.', 's18 b6'),

    rect(0, 404, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 404, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 439, 'Change state → the screen follows. No “update this text” command one by one.', 's19 b6'),
  ])

/* 07 — Enam aturan penulisan JSX (slide 8) ------------------------------ */

const JSX_RULES = [
  {
    title: 'One root element',
    bad: '<p/><p/>',
    good: '<>…</>',
    note: 'one wrapper, or a fragment',
  },
  {
    title: 'All tags are closed',
    bad: '<img>',
    good: '<img />',
    note: 'HTML allows it, JSX does not',
  },
  {
    title: 'camelCase attributes',
    bad: 'class="kartu"',
    good: 'className="kartu"',
    note: 'class & for are JS keywords',
  },
  {
    title: 'Expressions in { }',
    bad: '<p>nama</p>',
    good: '<p>{nama}</p>',
    note: 'a variable value, not literal text',
  },
  {
    title: 'Comment {/* */}',
    bad: '// comment',
    good: '{/* comment */}',
    note: 'a JSX comment needs braces',
  },
  {
    title: 'style takes an object',
    bad: 'style="color:red"',
    good: "style={{ color: 'red' }}",
    note: 'double braces: a CSS object',
  },
]

diagrams['bab-04-dasar-react-07'] = () =>
  diagram(474, [
    ...JSX_RULES.map((rule, i) => {
      const x = (i % 3) * 394
      const y = Math.floor(i / 3) * 204
      const bad = pill(x + 44, y + 48, rule.bad, { size: 16, tone: 'bad' })
      const good = pill(x + 44, y + 102, rule.good, { size: 16, tone: 'ok' })
      return (
        panel(x, y, 372, 186, { tone: 'neutral' }) +
        badge(x + 24, y + 28, String(i + 1), { tone: 'acc' }) +
        tx(x + 48, y + 35, rule.title, 's19 b7') +
        tx(x + 24, y + 74, '✗', 's17 b7 rd') +
        bad.svg +
        tx(x + 24, y + 128, '✓', 's17 b7 gn') +
        good.svg +
        tx(x + 24, y + 166, rule.note, 's14 mu')
      )
    }),
    rect(0, 412, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 412, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(
      24,
      447,
      'JSX (JavaScript XML) compiles to JavaScript function calls — not HTML.',
      's19 b6',
    ),
  ])

/* 08 — Props: read-only, nilai default, children (slide 10) ------------- */

function lockIcon(cx, cy, color = RED) {
  return (
    `<rect x="${cx - 7}" y="${cy}" width="14" height="11" rx="2" fill="${color}"/>` +
    `<path d="M ${cx - 4} ${cy} v-4 a4 4 0 0 1 8 0 v4" fill="none" stroke="${color}" stroke-width="2"/>`
  )
}

diagrams['bab-04-dasar-react-08'] = () =>
  diagram(474, [
    panel(0, 0, 372, 400, { title: 'READ-ONLY — the child only reads', tone: 'red' }),
    tx(18, 74, 'A child component must not change props.', 's15 mu'),

    rect(96, 90, 180, 54, { fill: ACC_SOFT, stroke: ACC_BORDER, r: 8 }),
    tc(186, 115, 'App', 's18 b7'),
    tc(186, 134, 'parent · owns the data', 's12 mu'),
    ar(186, 146, 186, 176, { color: 'slate' }),
    tx(196, 166, 'props', 's13 b6 mu'),

    rect(76, 180, 220, 54, { fill: '#fff', stroke: BORDER, r: 8 }),
    tc(186, 205, 'KartuMahasiswa', 's17 b6'),
    tc(186, 224, 'child · receiver', 's12 mu'),
    lockIcon(268, 188),

    tx(18, 270, '✗', 's18 b7 rd'),
    tx(42, 270, 'a child must not change props', 's15 b6 rd'),
    tx(18, 306, 'If the child needs a change, it asks', 's14 mu'),
    tx(18, 326, 'the parent via a setter passed down.', 's14 mu'),

    panel(394, 0, 372, 400, { title: 'DEFAULT VALUE — still runs', tone: 'green' }),
    tx(412, 74, 'Fallback when the parent forgets to send.', 's15 mu'),
    pill(412, 90, '{ mahasiswa = {} }', { size: 15, tone: 'ok' }).svg,

    tx(412, 152, 'parent sends the data', 's13 b6 mu ls'),
    tx(412, 180, '✓', 's17 b7 gn'),
    tx(436, 180, 'name and NIM appear', 's16 b6'),

    tx(412, 226, 'parent forgets to send', 's13 b6 mu ls'),
    tx(412, 254, '✓', 's17 b7 gn'),
    tx(436, 254, 'the default is used', 's16 b6'),

    tx(412, 300, 'Result: no error — it just shows', 's14 mu'),
    tx(412, 320, 'empty, and the app keeps running.', 's14 mu'),

    panel(788, 0, 372, 400, { title: 'CHILDREN — content slot', tone: 'acc' }),
    tx(806, 74, 'Content between the tags becomes the child prop.', 's15 mu'),
    cm(806, 104, '<KartuInfo>', 's15 mu'),
    rect(794, 116, 344, 34, { fill: ACC_SOFT, stroke: ACC_BORDER, r: 6, dash: '5 4' }),
    cm(806, 139, '  <p>Card content…</p>', 's15 ac b6'),
    cm(806, 182, '</KartuInfo>', 's15 mu'),
    tx(806, 216, '↑ this becomes the children prop automatically', 's13 b6 ac'),
    tx(806, 258, 'The parent component prepares a slot;', 's14 mu'),
    tx(806, 278, 'the consumer fills its content.', 's14 mu'),

    rect(0, 420, 1160, 54, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 420, 6, 54, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 454, 'Props always flow one way: from parent to child. Never the other way.', 's18 b6'),
  ])

/* 09 — State dan useState (slide 11) ------------------------------------ */

diagrams['bab-04-dasar-react-09'] = () => {
  const SIZE = 17
  let x = 150
  const parts = [
    rect(0, 0, 1160, 112, { fill: SURF, stroke: 'none', r: 10 }),
  ]
  const literal = (s, cls = 's18') => {
    const el = cm(x, 58, s, cls)
    x += textWidth(s, 18, true)
    return el
  }
  const token = (s, tone, label) => {
    const p = pill(x, 34, s, { size: SIZE, tone })
    const el = p.svg
    const cx = x + p.w / 2
    parts.push(el)
    parts.push(ln(cx, 68, cx, 82, { stroke: ARROW_COLOR[tone === 'warn' ? 'amber' : tone === 'ok' ? 'green' : 'acc'], sw: 1 }))
    parts.push(tc(cx, 96, label, 's13 b6 mu'))
    x += p.w
    return ''
  }
  parts.push(literal('const [', 's17 mu'))
  parts.push(token('kategoriProdi', 'warn', 'state value'))
  parts.push(literal(', ', 's17 mu'))
  parts.push(token('setKategoriProdi', 'acc', 'setter · updater'))
  parts.push(literal('] = useState(', 's17 mu'))
  parts.push(token("'All'", 'ok', 'initial value'))
  parts.push(literal(')', 's17 mu'))

  const boxes = [
    { x: 0, title: 'state', body: ["kategoriProdi = 'All'", 'kept by React per component'], tone: 'amber' },
    { x: 303, title: 'render', body: ['the component runs again', 'new JSX is computed'], tone: 'acc' },
    { x: 606, title: 'screen', body: ['student list', 'follows state'], tone: 'neutral' },
    { x: 909, title: 'user', body: ["clicks the 'TI' button", 'calls the setter'], tone: 'neutral' },
  ]
  boxes.forEach((b) => {
    parts.push(panel(b.x, 160, 250, 104, { title: b.title, tone: b.tone }))
    parts.push(tx(b.x + 16, 210, b.body[0], 's15 b6'))
    parts.push(tx(b.x + 16, 234, b.body[1], 's14 mu'))
  })
  parts.push(ar(252, 212, 297, 212, { color: 'slate' }))
  parts.push(ar(555, 212, 600, 212, { color: 'slate' }))
  parts.push(ar(858, 212, 903, 212, { color: 'slate' }))

  parts.push(path('M 1034 264 L 1034 340 L 126 340 L 126 268', { color: 'acc' }))
  parts.push(cm(420, 330, "setKategoriProdi('TI')", 's15 ac b6'))

  parts.push(rect(0, 380, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }))
  parts.push(rect(0, 380, 6, 56, { fill: ACC, stroke: 'none', r: 0 }))
  parts.push(tx(24, 414, 'Calling the setter = asking React to re-render. No manual screen manipulation.', 's18 b6'))
  return diagram(460, parts)
}

/* 10 — Aturan emas immutability (slide 12) ------------------------------ */

function memBox(x, y, w, rows, o = {}) {
  const { accentRow = -1, tone = 'neutral' } = o
  const pal = TONE[tone]
  const parts = [rect(x, y, w, 20 + rows.length * 28, { fill: '#fff', stroke: pal.border, r: 8 })]
  rows.forEach((label, i) => {
    const ry = y + 12 + i * 28
    const hot = i === accentRow
    parts.push(
      rect(x + 10, ry, w - 20, 22, {
        fill: hot ? (tone === 'green' ? GREEN_SOFT : RED_SOFT) : SURF,
        stroke: hot ? (tone === 'green' ? GREEN_BORDER : RED_BORDER) : BORDER,
        sw: 1,
        r: 5,
      }),
    )
    parts.push(
      `<text class="m s13 ${hot ? (tone === 'green' ? 'gn b6' : 'rd b6') : 'mu'}" x="${x + 18}" y="${ry + 15}">${esc(label)}</text>`,
    )
  })
  return parts.join('')
}

diagrams['bab-04-dasar-react-10'] = () =>
  diagram(440, [
    panel(0, 0, 560, 330, { title: 'MUTATION — never', tone: 'red' }),
    tx(18, 74, 'The same array, contents changed.', 's15 mu'),
    tx(18, 104, 'data → #a1b2', 's13 b6 mu ls'),
    memBox(18, 114, 208, ["'Budi'", "'Siti'"], { tone: 'red' }),
    ar(230, 150, 292, 150, { color: 'red' }),
    cm(238, 138, 'push', 's13 rd b6'),
    tx(318, 104, 'still #a1b2', 's13 b6 rd ls'),
    memBox(318, 114, 208, ["'Budi'", "'Siti'", "'Andi' ← new"], { accentRow: 2, tone: 'red' }),
    pill(18, 216, 'data.push(mahasiswaBaru)', { size: 14, tone: 'bad' }).svg,
    tx(18, 268, 'Array reference unchanged →', 's15 b6'),
    tx(18, 290, 'React does not see state change.', 's15 b6 rd'),
    tx(18, 314, 'The screen is not updated.', 's14 mu'),

    panel(600, 0, 560, 330, { title: 'NEW VALUE — do this', tone: 'green' }),
    tx(618, 74, 'A new array is made; the old one stays.', 's15 mu'),
    tx(618, 104, 'data → #a1b2', 's13 b6 mu ls'),
    memBox(618, 114, 208, ["'Budi'", "'Siti'"], { tone: 'green' }),
    ar(830, 150, 892, 150, { color: 'green' }),
    tx(918, 104, 'new → #c3d4', 's13 b6 gn ls'),
    memBox(918, 114, 208, ["'Budi'", "'Siti'", "'Andi' ← new"], { accentRow: 2, tone: 'green' }),
    pill(618, 216, 'setData([...data, mahasiswaBaru])', { size: 14, tone: 'ok' }).svg,
    tx(618, 268, 'New array reference →', 's15 b6'),
    tx(618, 290, 'React detects the change.', 's15 b6 gn'),
    tx(618, 314, 'The screen re-renders.', 's14 mu'),

    rect(0, 352, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 352, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 386, 'What is forbidden is mutating state — not using operations that return a new value.', 's18 b6'),
  ])

/* 11 — Props vs state (slide 13) ---------------------------------------- */

diagrams['bab-04-dasar-react-11'] = () => {
  const rows = [
    ['Source', 'from the parent component', 'inside the component itself'],
    ['Can it change?', 'no — read-only', 'yes, via the setter'],
    ['Triggers re-render?', 'yes, when the parent sends a new value', 'yes, when the setter is called'],
    ['Owner', 'the parent component', 'the component that declares it'],
  ]
  const parts = []
  parts.push(panel(0, 0, 540, 340, { title: 'PROPS — data from the parent', tone: 'acc' }))
  parts.push(panel(620, 0, 540, 340, { title: 'STATE — data it owns', tone: 'amber' }))

  rows.forEach(([label, left, right], i) => {
    const y = 92 + i * 62
    parts.push(tx(18, y, label, 's12 b6 mu ls'))
    parts.push(tx(18, y + 26, left, 's16'))
    parts.push(tx(638, y, label, 's12 b6 mu ls'))
    parts.push(tx(638, y + 26, right, 's16'))
    if (i < rows.length - 1) {
      parts.push(ln(18, y + 40, 522, y + 40, { stroke: BORDER, sw: 1 }))
      parts.push(ln(638, y + 40, 1142, y + 40, { stroke: BORDER, sw: 1 }))
    }
  })

  parts.push(lockIcon(444, 16, RED))
  parts.push(tx(458, 28, 'read-only', 's12 b6 rd'))
  parts.push(tx(1078, 28, 'mutable', 's12 b6 am'))

  parts.push(rect(0, 362, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }))
  parts.push(rect(0, 362, 6, 56, { fill: ACC, stroke: 'none', r: 0 }))
  parts.push(tx(24, 396, 'Both determine the view; the difference is who owns and who may change.', 's18 b6'))
  return diagram(430, parts)
}

/* 12 — Event handling: referensi vs pemanggilan (slide 15) --------------- */

function timelineStep(x, y, n, title, note, tone = 'neutral') {
  const color = tone === 'bad' ? 'red' : tone === 'ok' ? 'green' : 'slate'
  return (
    badge(x, y, String(n), { tone: tone === 'bad' ? 'bad' : tone === 'ok' ? 'ok' : 'plain' }) +
    tx(x + 24, y + 6, title, 's16 b6') +
    tx(x + 24, y + 30, note, 's14 mu')
  )
}

diagrams['bab-04-dasar-react-12'] = () =>
  diagram(474, [
    panel(0, 0, 560, 390, { title: '✗ WRONG — function called during render', tone: 'red' }),
    pill(18, 60, 'onClick={simpanData()}', { size: 15, tone: 'bad' }).svg,
    ln(40, 137, 40, 283, { stroke: RED_BORDER, sw: 2, dash: '4 4' }),
    timelineStep(40, 124, '1', 'Render runs', 'simpanData() runs immediately', 'bad'),
    timelineStep(40, 214, '2', 'The result is stored', 'onClick holds the result (undefined)', 'bad'),
    timelineStep(40, 296, '3', 'Button clicked', 'no function left to call', 'bad'),
    tx(18, 352, 'Symptom: the button looks dead, no error.', 's15 b6 rd'),

    panel(600, 0, 560, 390, { title: '✓ CORRECT — function reference', tone: 'green' }),
    pill(618, 60, 'onClick={simpanData}', { size: 15, tone: 'ok' }).svg,
    ln(640, 137, 640, 283, { stroke: GREEN_BORDER, sw: 2, dash: '4 4' }),
    timelineStep(640, 124, '1', 'Render runs', 'the function is stored, not run', 'ok'),
    timelineStep(640, 214, '2', 'Button clicked', 'React calls simpanData()', 'ok'),
    timelineStep(640, 296, '3', 'The setter runs', 're-render → screen changes', 'ok'),
    tx(618, 352, 'An inline arrow function passes data:', 's14 mu'),
    cm(618, 374, 'onClick={() => pilih(prodi)}', 's14 gn b6'),

    rect(0, 410, 1160, 54, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 410, 6, 54, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 444, 'Hand over the function itself to the prop — not the result of calling it.', 's19 b6'),
  ])

/* 13 — Conditional rendering: tiga pola (slide 16) ----------------------- */

diagrams['bab-04-dasar-react-13'] = () =>
  diagram(392, [
    panel(0, 0, 372, 330, { title: 'Ternary ? :', tone: 'acc' }),
    cm(18, 88, 'kondisi ? <A/> : <B/>', 's15 ac b6'),
    pill(140, 112, 'kondisi', { size: 13, tone: 'acc' }),
    path('M 177 140 L 177 160 L 93 160 L 93 186', { color: 'slate', head: false }),
    path('M 177 140 L 177 160 L 261 160 L 261 186', { color: 'slate' }),
    rect(18, 190, 150, 46, { fill: '#fff', stroke: BORDER, r: 7 }),
    tc(93, 210, '<A/>', 'm s14 b6 mid'),
    tc(93, 228, 'true', 's11 mu mid'),
    rect(186, 190, 150, 46, { fill: '#fff', stroke: BORDER, r: 7 }),
    tc(261, 210, '<B/>', 'm s14 b6 mid'),
    tc(261, 228, 'false', 's11 mu mid'),
    tx(18, 276, 'Pick one of the two views.', 's14'),
    tx(18, 300, 'Used for loading vs done.', 's14 mu'),

    panel(394, 0, 372, 330, { title: 'Operator &&', tone: 'green' }),
    cm(412, 88, 'kondisi && <A/>', 's15 gn b6'),
    pill(450, 112, 'kondisi', { size: 13, tone: 'ok' }),
    ar(487, 140, 487, 186, { color: 'slate' }),
    rect(412, 190, 150, 46, { fill: '#fff', stroke: BORDER, r: 7 }),
    tc(487, 210, '<A/>', 'm s14 b6 mid'),
    tc(487, 228, 'shown', 's11 mu mid'),
    rect(580, 190, 150, 46, { fill: '#fff', stroke: BORDER, r: 7, dash: '4 4' }),
    tc(655, 210, 'not shown', 's12 mu mid'),
    tx(412, 276, 'Show only when the condition is true.', 's14'),
    tx(412, 300, 'Careful when the value is 0 or “”.', 's14 mu'),

    panel(788, 0, 372, 330, { title: 'explicit null', tone: 'neutral' }),
    cm(806, 88, 'if (!ada) return null', 's14 b6'),
    cm(806, 112, 'ada ? <A/> : null', 's14 b6 ac'),
    ar(881, 140, 881, 186, { color: 'slate' }),
    rect(806, 190, 150, 46, { fill: SURF, stroke: BORDER, r: 7 }),
    tc(881, 212, 'null', 'm s15 b6 mid'),
    tc(881, 228, 'nothing at all', 's11 mu mid'),
    tx(806, 276, 'The clearest way to say', 's14'),
    tx(806, 300, '“show nothing at all”.', 's14 mu'),

    tx(0, 366, 'All three are just JavaScript expressions — no if inside JSX.', 's15 mu'),
  ])

/* 14 — List rendering dengan map (slide 17) ------------------------------ */

diagrams['bab-04-dasar-react-14'] = () =>
  diagram(392, [
    panel(0, 0, 330, 292, { title: 'data · array', tone: 'neutral' }),
    tx(18, 74, 'array of objects, unchanged', 's13 mu'),
    ...['m1', 'm2', 'm3'].map((id, i) => {
      const y = 96 + i * 58
      const nama = { m1: 'Budi', m2: 'Siti', m3: 'Andi' }[id]
      return (
        rect(18, y, 294, 44, { fill: SURF, stroke: BORDER, r: 7 }) +
        `<text class="m s13 mu" x="30" y="${y + 28}">{ id: '<tspan class="ac b6">${id}</tspan>', nama: '<tspan>${nama}</tspan>' }</text>`
      )
    }),

    ar(334, 146, 386, 146, { color: 'slate' }),
    tx(344, 132, 'map', 's13 b6 mu'),

    panel(400, 0, 470, 292, { title: 'result · array of JSX elements', tone: 'acc' }),
    tx(418, 74, 'one element per item, with a key', 's13 mu'),
    ...['m1', 'm2', 'm3'].map((id, i) => {
      const y = 96 + i * 58
      return (
        rect(418, y, 434, 44, { fill: '#fff', stroke: ACC_BORDER, r: 7 }) +
        `<text class="m s13 ac" x="430" y="${y + 28}">&lt;KartuMahasiswa</text>` +
        rect(555, y + 10, 74, 24, { fill: GREEN_SOFT, stroke: GREEN_BORDER, r: 5 }) +
        `<text class="m s12 gn b6" x="563" y="${y + 27}">key=&quot;${id}&quot;</text>` +
        `<text class="m s13 ac" x="640" y="${y + 28}">mahasiswa={m${i + 1}} /&gt;</text>`
      )
    }),

    panel(900, 0, 260, 292, { title: 'what to remember', tone: 'amber' }),
    tx(918, 80, '✓', 's15 b7 gn'),
    tx(940, 80, 'key on the returned element', 's13'),
    tx(918, 122, '✓', 's15 b7 gn'),
    tx(940, 122, 'key unique & stable', 's13'),
    tx(918, 164, '✓', 's15 b7 gn'),
    tx(940, 164, 'map returns a new array', 's13'),
    tx(918, 206, '✗', 's15 b7 rd'),
    tx(940, 206, 'data.push inside map', 's13'),
    tx(918, 248, '✗', 's15 b7 rd'),
    tx(940, 248, 'key inside the component', 's13'),

    rect(0, 312, 1160, 54, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 312, 6, 54, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 346, 'map turns data into elements; the key goes on the returned element, not inside the component.', 's17 b6'),
  ])

/* 15 — key: indeks vs id (slide 18) ------------------------------------- */

function listCard(x, y, w, slot, nama, prodi, detail, o = {}) {
  const { tone = 'neutral', slotLabel = 'index' } = o
  const pal = TONE[tone]
  const detailOpen = detail === 'terbuka'
  return (
    rect(x, y, w, 76, { fill: '#fff', stroke: pal.border, r: 8 }) +
    badge(x + 22, y + 24, String(slot), { tone: 'plain', r: 11, size: 12 }) +
    tx(x + 40, y + 30, nama, 's16 b7') +
    tx(x + 40, y + 50, prodi, 's13 mu') +
    rect(x + w - 132, y + 40, 120, 24, {
      fill: detailOpen ? RED_SOFT : SURF,
      stroke: detailOpen ? RED_BORDER : BORDER,
      sw: 1,
      r: 5,
    }) +
    `<text class="t s11 ${detailOpen ? 'rd b6' : 'mu'}" x="${x + w - 122}" y="${y + 57}">${detailOpen ? '● detail open' : 'detail closed'}</text>` +
    `<text class="m s10 mu" x="${x + w - 132}" y="${y + 20}">${esc(slotLabel)}</text>`
  )
}

diagrams['bab-04-dasar-react-15'] = () =>
  diagram(470, [
    tx(0, 18, 'BEFORE FILTERING', 's12 b6 mu ls'),
    listCard(175, 28, 250, 0, 'Budi', 'SI', 'terbuka', { slotLabel: 'key 0' }),
    listCard(455, 28, 250, 1, 'Siti', 'TI', 'tertutup', { slotLabel: 'key 1' }),
    listCard(735, 28, 250, 2, 'Andi', 'TI', 'tertutup', { slotLabel: 'key 2' }),

    pill(430, 118, "filter prodi === 'TI'", { size: 14, tone: 'acc' }),
    ar(580, 146, 580, 168, { color: 'acc' }),
    tx(596, 164, 'Budi (SI) leaves the list', 's12 mu'),

    panel(0, 176, 560, 244, { title: 'key={index} — position reused', tone: 'red' }),
    tx(18, 246, 'After filtering, Siti takes index 0.', 's13 mu'),
    listCard(18, 262, 250, 0, 'Siti', 'TI', 'terbuka', { slotLabel: 'key 0', tone: 'red' }),
    listCard(288, 262, 250, 1, 'Andi', 'TI', 'tertutup', { slotLabel: 'key 1' }),
    tx(18, 368, '✗', 's15 b7 rd'),
    tx(40, 368, 'React reuses the slot-0 state from Budi', 's14 b6 rd'),
    tx(18, 396, "Siti's data is right — the view is wrong.", 's13 mu'),

    panel(600, 176, 560, 244, { title: 'key={mahasiswa.id} — identity kept', tone: 'green' }),
    tx(618, 246, 'After filtering, the id stays with its card.', 's13 mu'),
    listCard(618, 262, 250, 0, 'Siti', 'TI · id m2', 'tertutup', { slotLabel: 'key m2', tone: 'green' }),
    listCard(884, 262, 250, 1, 'Andi', 'TI · id m3', 'tertutup', { slotLabel: 'key m3', tone: 'green' }),
    tx(618, 368, '✓', 's15 b7 gn'),
    tx(640, 368, 'State follows the id, not the position', 's14 b6 gn'),
    tx(618, 396, "Siti's card stays closed as before.", 's13 mu'),

    tx(0, 448, 'Console warning: “Each child in a list should have a unique key prop”.', 's15 mu'),
  ])

/* 16 — Komposisi komponen & reusable (slide 21) --------------------------- */

diagrams['bab-04-dasar-react-02'] = () =>
  diagram(430, [
    rect(440, 0, 280, 88, { fill: ACC_SOFT, stroke: ACC, sw: 1.5, r: 10 }),
    tc(580, 30, 'App', 's20 b7'),
    tc(580, 52, 'pemilik data & state', 's12 mu'),
    tx(452, 76, 'DATA_MAHASISWA · kategoriProdi', 's10 mu'),
    ar(580, 90, 580, 104, { color: 'acc' }),
    tx(592, 102, 'props data', 's11 b6 ac'),

    rect(440, 108, 280, 54, { fill: '#fff', stroke: BORDER, r: 10 }),
    tc(580, 132, 'DaftarMahasiswa', 's17 b7'),
    tc(580, 150, 'menerima props, tidak menyimpan state', 's10 mu'),

    path('M 580 164 L 580 186 M 200 186 L 960 186', { color: 'slate', head: false }),
    path('M 200 186 L 200 206', { color: 'slate' }),
    path('M 580 186 L 580 206', { color: 'slate' }),
    path('M 960 186 L 960 206', { color: 'slate' }),

    ...[0, 1, 2].map((i) => {
      const x = 60 + i * 380
      return (
        rect(x, 210, 280, 96, { fill: '#fff', stroke: BORDER, r: 10 }) +
        tc(x + 140, 236, 'KartuMahasiswa', 's16 b7') +
        rect(x + 18, 250, 160, 26, { fill: AMBER_SOFT, stroke: AMBER_BORDER, r: 5 }) +
        `<text class="m s11 am b6" x="${x + 28}" y="${x > 500 ? 267 : 267}">detailTampil</text>` +
        tc(x + 232, 267, 'state lokal', 's11 mu mid') +
        tc(x + 140, 294, i === 0 ? 'Budi' : i === 1 ? 'Siti' : 'Andi', 's12 mu')
      )
    }),

    tx(0, 342, 'Setiap kartu menyimpan detailTampil sendiri — membuka satu kartu tidak membuka kartu lain.', 's16 b6'),
    tx(0, 370, 'KartuInfo dengan children menjadi slot isi yang ditentukan induk dan diisi pemakainya.', 's14 mu'),

    rect(0, 392, 1160, 32, { fill: 'none', stroke: 'none' }),
    tx(0, 414, 'Props turun ke bawah; state tinggal di komponen yang mendeklarasikannya.', 's14 mu'),
  ])

/* 17 — Dua aturan hooks (slide 22) -------------------------------------- */

function hookStack(x, y, items, o = {}) {
  const { label, tone = 'acc' } = o
  const parts = [tx(x, y - 12, label, 's11 b6 mu ls')]
  items.forEach((item, i) => {
    const yy = y + i * 40
    const pal = item === null ? { fill: SURF, stroke: BORDER, cls: 'mu' } : PILL[tone]
    parts.push(
      rect(x, yy, 150, 30, { fill: pal.fill, stroke: pal.stroke, sw: 1, r: 6 }) +
      `<text class="m s11 ${pal.cls}" x="${x + 10}" y="${yy + 20}">${esc(item ?? '— not called')}</text>`,
    )
  })
  return parts.join('')
}

diagrams['bab-04-dasar-react-16'] = () =>
  diagram(420, [
    panel(0, 0, 560, 330, { title: '✓ TOP LEVEL — order is stable', tone: 'green' }),
    hookStack(36, 96, ['useState(A)', 'useState(B)', 'useEffect'], { label: 'render 1', tone: 'ok' }),
    hookStack(300, 96, ['useState(A)', 'useState(B)', 'useEffect'], { label: 'render 2', tone: 'ok' }),
    tx(243, 162, '=', 's28 b7 gn'),
    tx(18, 268, 'React stores state by call order.', 's14 mu'),
    tx(18, 296, 'Same order → each state finds its slot.', 's14 b6 gn'),

    panel(600, 0, 560, 330, { title: '✗ INSIDE an if — order shifts', tone: 'red' }),
    hookStack(636, 96, ['useState(A)', 'useState(B)', 'useEffect'], { label: 'render 1 (if true)', tone: 'bad' }),
    hookStack(900, 96, ['useState(A)', 'useEffect', null], { label: 'render 2 (if false)', tone: 'bad' }),
    path('M 800 151 L 896 151', { color: 'red', dash: '4 4' }),
    path('M 800 191 L 896 191', { color: 'red', dash: '4 4' }),
    tx(618, 268, 'Slot 2 was useState(B), now holds useEffect.', 's14 mu'),
    tx(618, 296, 'State is misread — not an error, but a silent bug.', 's14 b6 rd'),

    rect(0, 352, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 352, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 386, 'Hooks always at the top level: not in if, loops, or nested functions.', 's17 b6'),
  ])

/* 18 — useEffect: efek samping dan cleanup (slide 23) --------------------- */

diagrams['bab-04-dasar-react-17'] = () =>
  diagram(430, [
    pill(0, 0, 'useEffect(() => { ... return () => clearTimeout(timer) }, [])', { size: 15, tone: 'acc' }),

    panel(0, 62, 372, 250, { title: 'MOUNT — first render', tone: 'acc' }),
    tx(18, 136, 'The component appears on screen.', 's15'),
    tx(18, 168, '→', 's16 b7 ac'),
    cm(42, 168, 'useEffect(fn, [])', 's14 ac b6'),
    tx(18, 196, 'The effect runs once.', 's14 mu'),
    tx(18, 236, 'Example: setTimeout 2 seconds', 's13 mu'),
    tx(18, 258, 'to simulate loading data.', 's13 mu'),

    ar(376, 186, 414, 186, { color: 'slate' }),

    panel(418, 62, 372, 250, { title: 'UPDATE — dependency changes', tone: 'amber' }),
    tx(436, 136, 'A value in the array changed.', 's15'),
    tx(436, 168, '1.', 's13 b6 am'),
    cm(456, 168, 'old cleanup', 's14 am b6'),
    tx(436, 194, '2.', 's13 b6 am'),
    cm(456, 194, 'new effect runs', 's14 am b6'),
    tx(436, 240, 'Without cleanup, the old timer stays', 's13 mu'),
    tx(436, 262, 'alive and piles up.', 's13 mu'),

    ar(794, 186, 832, 186, { color: 'slate' }),

    panel(836, 62, 324, 250, { title: 'UNMOUNT — component removed', tone: 'red' }),
    tx(854, 136, 'The component leaves the screen.', 's15'),
    tx(854, 168, '→', 's16 b7 rd'),
    cm(878, 168, 'final cleanup', 's13 rd b6'),
    tx(854, 210, 'The timer is cancelled; no', 's13 mu'),
    tx(854, 232, 'setState on a component', 's13 mu'),
    tx(854, 254, 'that no longer exists.', 's13 mu'),

    rect(0, 330, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 330, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 364, 'The function returned by useEffect is cleanup: run when the effect repeats or the component unmounts.', 's15 b6'),
  ])

/* 19 — useMemo & useCallback (slide 25) ---------------------------------- */

diagrams['bab-04-dasar-react-18'] = () =>
  diagram(446, [
    panel(0, 0, 620, 168, { title: 'useMemo — caches a VALUE', tone: 'acc' }),
    tx(18, 78, 'Is the computation measurably expensive?', 's17 b6'),
    tx(18, 106, 'filter · aggregate · transform a large dataset', 's14 mu'),
    tx(18, 144, 'If yes → recompute only when a dependency changes.', 's13 mu'),
    ar(624, 84, 676, 84, { color: 'acc' }),
    tx(640, 72, 'yes', 's12 b6 ac'),
    panel(700, 0, 460, 168, { title: 'result', tone: 'acc' }),
    pill(718, 70, 'useMemo(() => filter(...), [data])', { size: 13, tone: 'acc' }).svg,
    tx(718, 116, 'Caches the computed value.', 's14'),
    tx(718, 140, 'Not recomputed on every render.', 's13 mu'),

    panel(0, 188, 620, 168, { title: 'useCallback — caches a FUNCTION', tone: 'green' }),
    tx(18, 266, 'Is the function passed to a React.memo child?', 's17 b6'),
    tx(18, 294, 'the function reference must be stable across renders', 's14 mu'),
    tx(18, 332, 'If yes → the child does not re-render needlessly.', 's13 mu'),
    ar(624, 272, 676, 272, { color: 'green' }),
    tx(640, 260, 'yes', 's12 b6 gn'),
    panel(700, 188, 460, 168, { title: 'result', tone: 'green' }),
    pill(718, 258, 'useCallback(fn, [])', { size: 13, tone: 'ok' }).svg,
    tx(718, 304, 'Caches the function reference.', 's14'),
    tx(718, 328, 'The dependency array works like useEffect.', 's13 mu'),

    rect(0, 376, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 376, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 410, 'Neither? Write it plainly — premature optimization adds memory and complexity.', 's17 b6'),
  ])

/* 03 — Lifecycle: mount, update, unmount (slide 24) --------------------- */

function phaseRow(y, phase, tone, chips, note) {
  const pal = TONE[tone]
  let x = 214
  const parts = [
    rect(0, y, 190, 74, { fill: pal.header, stroke: pal.border, r: 10 }),
    tc(95, y + 32, phase, 's18 b7'),
    tc(95, y + 54, note, 's11 mu'),
  ]
  chips.forEach((c, i) => {
    const p = pill(x, y + 22, c, { size: 14, tone: i === 0 ? 'plain' : tone === 'red' ? 'bad' : tone === 'green' ? 'ok' : 'acc' })
    if (i > 0) parts.push(ar(x - 32, y + 37, x - 4, y + 37, { color: 'slate' }))
    parts.push(p.svg)
    x += p.w + 36
  })
  return parts.join('')
}

diagrams['bab-04-dasar-react-03'] = () =>
  diagram(412, [
    phaseRow(0, 'MOUNT', 'acc', ['render pertama', 'useEffect(fn, []) jalan'], 'komponen muncul'),
    phaseRow(104, 'UPDATE', 'amber', ['dependency berubah', 'cleanup lama', 'efek baru'], 'nilai dependency berubah'),
    phaseRow(208, 'UNMOUNT', 'red', ['komponen dilepas', 'cleanup terakhir'], 'komponen dihapus'),

    tx(214, 306, 'Cleanup adalah fungsi yang dikembalikan efek — dipanggil sebelum efek diulang atau saat komponen dilepas.', 's13 mu'),

    rect(0, 336, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }),
    rect(0, 336, 6, 56, { fill: ACC, stroke: 'none', r: 0 }),
    tx(24, 370, 'Istilah mount dan unmount dipakai lagi pada navigation lifecycle di Bab 7 — maknanya harus konsisten.', 's16 b6'),
  ])

/* 04 — Alur kejadian: satu ketukan, satu re-render (slide 26) ------------ */

diagrams['bab-04-dasar-react-04'] = () => {
  const steps = [
    ['ketukan pengguna', 'menekan tombol'],
    ['handler onClick', 'fungsi dipanggil'],
    ['setter state', 'nilai baru disimpan'],
    ['render ulang', 'komponen dijalankan'],
    ['diff → layar baru', 'hanya yang berubah'],
  ]
  const parts = []
  steps.forEach(([title, note], i) => {
    const x = i * 238
    const tone = i === 2 ? 'acc' : 'neutral'
    parts.push(panel(x, 96, 208, 108, { tone }))
    parts.push(tx(x + 16, 132, title, `s${i === 0 ? 16 : 17} b7${i === 2 ? ' ac' : ''}`))
    parts.push(tx(x + 16, 158, note, 's12 mu'))
    if (i < 4) parts.push(ar(x + 210, 150, x + 234, 150, { color: i === 2 ? 'acc' : 'slate' }))
  })

  parts.push(tx(592, 86, 'satu-satunya pemicu', 's11 b6 ac'))
  parts.push(ar(580, 70, 580, 92, { color: 'acc', dash: '3 3' }))

  parts.push(path('M 1056 206 L 1056 274 L 104 274 L 104 210', { color: 'slate' }))
  parts.push(tc(580, 264, 'pengguna berinteraksi lagi → siklus berulang', 's13 b6 mu'))

  parts.push(rect(0, 310, 1160, 56, { fill: ACC_SOFT, stroke: 'none', r: 10 }))
  parts.push(rect(0, 310, 6, 56, { fill: ACC, stroke: 'none', r: 0 }))
  parts.push(tx(24, 344, 'Tanpa setter, React tidak tahu state berubah — layar tidak akan menyesuaikan.', 's18 b6'))
  return diagram(382, parts)
}

/* 19 — Praktikum: rangkaian langkah kerja (slide 28) --------------------- */

diagrams['bab-04-dasar-react-19'] = () =>
  diagram(330, [
    ...[
      ['Static data', ['DATA_MAHASISWA', 'PILIHAN_PRODI'], 'outside the component'],
      ['State', ['kategoriProdi', 'sedangMemuat'], 'useState'],
      ['Loading effect', ['useEffect(..., [])', 'clearTimeout'], '2-second simulation'],
      ['Derived', ['useMemo', 'filter + average'], 'not new state'],
      ['Wire components', ['KartuMahasiswa', 'DaftarMahasiswa'], 'in App.js'],
    ].map(([title, chips, note], i) => {
      const x = i * 236
      const parts = [
        panel(x, 0, 214, 216, { tone: i === 0 ? 'amber' : 'neutral' }),
        badge(x + 24, 28, String(i + 1), { tone: 'acc' }),
        tx(x + 46, 34, title, 's16 b7'),
      ]
      let cy = 68
      chips.forEach((c) => {
        const p = pill(x + 14, cy, c, { size: 12, tone: 'code' })
        parts.push(p.svg)
        cy += 32
      })
      parts.push(tx(x + 14, cy + 30, note, 's12 mu'))
      if (i < 4) parts.push(ar(x + 216, 108, x + 234, 108, { color: 'slate' }))
      return parts.join('')
    }),

    tx(0, 246, 'Folder structure: App.js at the root, components in the components/ folder.', 's14 mu'),

    rect(0, 272, 1160, 34, { fill: 'none', stroke: 'none' }),
    tx(0, 296, 'Static data outside the component so it is not recreated on every render.', 's13 mu'),
  ])

/* 20 — Troubleshooting praktikum (slide 30) ----------------------------- */

diagrams['bab-04-dasar-react-20'] = () =>
  diagram(420, [
    ...[
      ['“unique key prop” warning', 'key missing or using the index', 'key={mahasiswa.id}', 'key'],
      ['The button does not react', 'handler written as onClick={fn()}', 'drop the parentheses: onClick={fn}', '()'],
      ['The screen looks empty', 'component name starts lowercase', '<KartuMahasiswa />', 'Aa'],
      ['“Loading data…” never disappears', 'the effect does not run', 'useEffect(..., [])', 'fx'],
    ].map(([symptom, cause, fix, tag], i) => {
      const x = (i % 2) * 600
      const y = Math.floor(i / 2) * 190
      return (
        panel(x, y, 560, 170, { tone: 'neutral' }) +
        rect(x, y, 6, 170, { fill: i % 2 === 0 ? RED : AMBER, stroke: 'none', r: 0 }) +
        badge(x + 36, y + 34, String(i + 1), { tone: i % 2 === 0 ? 'bad' : 'warn' }) +
        tx(x + 58, y + 40, symptom, 's17 b7') +
        tx(x + 20, y + 84, 'Cause', 's11 b6 mu ls') +
        tx(x + 112, y + 84, cause, 's14') +
        tx(x + 20, y + 126, 'Fix', 's11 b6 mu ls') +
        pill(x + 112, y + 104, fix, { size: 13, tone: 'ok' }).svg
      )
    }),

    tx(0, 400, 'Read the error message before guessing: the key warning names the exact problem.', 's14 mu'),
  ])

/* 21 — Rangkuman: peta bab (slide 35) ---------------------------------- */

diagrams['bab-04-dasar-react-21'] = () => {
  const nodes = [
    { x: 0, y: 26, title: 'Components & JSX', note: 'function → JSX · one root · camelCase' },
    { x: 860, y: 26, title: 'Props', note: 'read-only · parent → child' },
    { x: 0, y: 330, title: 'State & setter', note: 'immutable · setter triggers render' },
    { x: 860, y: 330, title: 'key & list', note: 'unique · stable · not the index' },
    { x: 430, y: 380, title: 'useEffect & useMemo', note: 'cleanup required · optimize if measured' },
  ]
  const parts = []
  parts.push(rect(430, 170, 300, 120, { fill: ACC, stroke: ACC, r: 14 }))
  parts.push(tc(580, 214, 'UI = f(state)', 'm s26 b7 wh'))
  parts.push(tc(580, 244, 'change state, the screen follows', 's13 wh'))
  parts.push(tc(580, 266, 'not screen-manipulation commands', 's11 wh'))

  const links = [
    'M 300 69 L 430 186',
    'M 860 69 L 730 186',
    'M 300 373 L 430 274',
    'M 860 373 L 730 274',
    'M 580 380 L 580 292',
  ]
  links.forEach((d) => parts.push(path(d, { color: 'slate' })))

  nodes.forEach((n, i) => {
    parts.push(rect(n.x, n.y, 300, 86, { fill: '#fff', stroke: BORDER, r: 10 }))
    parts.push(badge(n.x + 26, n.y + 28, String(i + 1), { tone: 'acc' }))
    parts.push(tx(n.x + 48, n.y + 34, n.title, 's16 b7'))
    parts.push(tx(n.x + 18, n.y + 66, n.note, 's12 mu'))
  })

  parts.push(rect(0, 482, 1160, 40, { fill: 'none', stroke: 'none' }))
  return diagram(492, parts)
}

/* ------------------------------------------------------------------- writer */

const only = process.argv
  .find((a) => a.startsWith('--only='))
  ?.slice('--only='.length)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

mkdirSync(OUT, { recursive: true })
let written = 0
for (const [name, build] of Object.entries(diagrams)) {
  if (only && !only.some((o) => name.endsWith(`-${o}`))) continue
  const svg = build()
  writeFileSync(join(OUT, `${name}.svg`), svg)
  console.log(`✓ ${name}.svg  (${(svg.length / 1024).toFixed(1)} KB)`)
  written += 1
}
console.log(`build-diagrams-bab04: ${written} diagram ditulis ke slides/assets/diagrams/`)
