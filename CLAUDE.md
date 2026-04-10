# mpwww

Personal intro site for Michael Pogorzhelskiy. A single page whose main statement cycles through 4 variations on click/tap, with a fixed `BERLIN UTC+1` / `→MAIL` footer.

Designed in Figma (file `mpwww`) and built pixel-perfect to the 1440×1024 desktop frames.

## Stack

Plain HTML / CSS / JS. No framework, no build step. Static files only.

## Files

- `index.html` — markup: `<main>` holds the statement, `<footer>` holds the location and mail link
- `styles.css` — `@font-face`, typography, flex layout, responsive scaling
- `main.js` — 4-statement array, click/keyboard cycling, `?i=N` deep-link
- `fonts/CooperHewitt-Book.ttf` — self-hosted (SIL OFL, from the official Cooper Hewitt release via tom10271's compiled mirror)

## Design specs (from Figma)

| Property | Value |
|---|---|
| Canvas | 1440 × 1024 |
| Background | `#49AAFF` |
| Font | Cooper Hewitt Book (weight 400) |
| Font size | 133px |
| Line-height | 115px (tight) |
| Letter-spacing | -0.04em (-4%) |
| Color | `#FFFFFF` |
| Case | `text-transform: uppercase` |
| Frame padding | 30px vertical, 8px horizontal |
| Footer | fixed bottom, same type, space-between |

**Critical**: Figma reports `fontName.style: "Book"` — use the Book weight, not Heavy. Book is narrow enough for "MICHAEL POGORZHELSKIY" to fit on one line at 1424px; Heavy wraps and breaks the design.

## The four statements

Stored in `statements[]` in `main.js`. Strings match Figma verbatim including explicit `\n` line breaks:

1. `Michael Pogorzhelskiy designs digital products and experiences for people.`
2. `Michael Pogorzhelskiy works at the intersection of industrial, interaction and user experience design.`
3. `Michael Pogorzhelskiy\ndid research on telepresence, virtual reality for clinical training and augmented reality for surgery` (no trailing period — matches Figma)
4. `Michael Pogorzhelskiy\nprefers pen and paper, then AI.`

`.statement { white-space: pre-line }` honors the `\n` breaks; `text-transform: uppercase` handles the casing.

## Interaction

- Click anywhere — advance to next statement
- `Space`, `Enter`, `→` — advance
- `←` — previous
- Clicking `→MAIL` opens mail client and does NOT advance (handled via `e.target.closest("#mail")` check)
- `?i=N` URL param — start at statement N (useful for deep links and visual diffing)

## Responsive strategy

Three tiers (inferred — no mobile frames in Figma):

1. **≥ 1440px** — fixed `133px` / `115px`, exact Figma values
2. **< 1440px** — scales with `vw` units (`9.23vw` font, `7.99vw` line-height, `2.08vw/0.55vw` padding). Preserves Figma proportions exactly; line breaks shift naturally.
3. **< 480px** — floors at `44px` / `38px` so phones stay legible; footer gets `flex-wrap`.

When adding Figma frames for intermediate widths, replace the `vw` tier with explicit breakpoints matching those designs.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No install, no build.

## Pixel-perfect verification

Use headless Chrome at 1440×1024 and diff against the Figma frames:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,1024 \
  --screenshot=/tmp/mpwww-N.png \
  "http://localhost:8000/?i=N"
```

Frame IDs in the Figma file (`nrfpJ1aIA53A68O42GZetF`):
- `1:23` — p1 "designs digital products..."
- `1:4` — p2 "works at the intersection..."
- `1:10` — p3 "did research on telepresence..."
- `1:16` — p4 "prefers pen and paper..."

Line wrapping must match Figma exactly — this is the primary parity signal.

## Open items

- Replace `mailto:hello@example.com` in `index.html` with the real address
- Discuss transitions for statement swaps (fade, slide, type-on, etc.)
- Decide whether intermediate responsive breakpoints need their own Figma designs
