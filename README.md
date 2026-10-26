# $ANT — "The Colony" meme-coin site

Static, dependency-free site for **Anthropic ($ANT)**, a community meme token on Ethereum.
Open `index.html` directly, or serve the folder: `python3 -m http.server 8080` → http://localhost:8080

## Design concept — "The Colony"
The page is a cross-section of an underground ant colony. You start at the surface (sky + grass) and dig down:
- **Swarm hero** – a canvas swarm of ants assembles into "$ANT", flees your cursor and scatters on click.
- **The tunnel** – an SVG tunnel is dug as you scroll, snaking between "chambers" (sections), with a pheromone trail and ants marching along the dug length.
- **Depth meter** (0–100 m), parallax soil strata, marching-ants dashed borders, organic blob chamber cards, an orbiting coin with ants, a cursor "escort" of ants, magnetic buttons, ticker tape, counters, reveal-on-scroll, roadmap progress and a lightbox gallery (keyboard, swipe, focus trap).
- Palette: dark soil, amber/honey, leaf green. Fonts: Bricolage Grotesque + JetBrains Mono (Google Fonts; falls back to system fonts offline).
- Icons are inline SVG (sprite at the top of `index.html`); no emojis.
- `prefers-reduced-motion` disables the swarm, tunnel animation, cursor ants and all transitions (static final state).

## Config (top of `js/main.js`)
```
TOKEN_NAME       = 'Anthropic'
TICKER           = '$ANT'
CHAIN            = 'Ethereum'
CONTRACT_ADDRESS = '0xd85db1599a0ff426e74129139ef936f022a1f1f0'
BUY_URL          = 'https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=0xd85db1599a0ff426e74129139ef936f022a1f1f0'
CHART_URL        = 'https://dexscreener.com/ethereum/0xd85db1599a0ff426e74129139ef936f022a1f1f0'
X_URL            = 'https://x.com/AnthropicEthX'
```
All Buy buttons (`data-buy-link`), chart links (`data-chart-link`), X links (`data-x-link`) and CA boxes are filled from this config.

## Logo
The real `logo.png` has not been supplied yet — `assets/logo.png` is a **neutral placeholder coin** ("ANT") made by `tools/make_placeholder_logo.py`.
To swap in the real logo (square PNG, ideally ≥1024 px, transparent background):
```
python3 tools/make_logo_assets.py path/to/logo.png
```
This regenerates `assets/logo.png/.webp`, `assets/logo-round.*`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` and `assets/og-image.png`. Requires Pillow.

## Gallery sources (from https://x.com/AntOnPumpfun, ranked by views at time of build, 2026-10-26)
| File | Post | Views |
|---|---|---|
| assets/gallery/ant-01.webp | https://x.com/AntOnPumpfun/status/2114471034976137625 | 2,493 |
| assets/gallery/ant-02.webp | https://x.com/AntOnPumpfun/status/2114148263947649261 | 1,491 |
| assets/gallery/ant-03.webp | https://x.com/AntOnPumpfun/status/2113652416256135466 | 1,226 |
| assets/gallery/ant-04.webp | https://x.com/AntOnPumpfun/status/2113725730064646305 | 1,185 |
| assets/gallery/ant-05.webp | https://x.com/AntOnPumpfun/status/2113914913190183146 | 1,155 |
| assets/gallery/ant-06.webp | https://x.com/AntOnPumpfun/status/2113355804686594519 | 603 |
| assets/gallery/ant-07.webp | https://x.com/AntOnPumpfun/status/2113236676000522546 | 599 |
| assets/gallery/ant-08.webp | https://x.com/AntOnPumpfun/status/2113206514420998448 | 594 |

Images were resized to max 1400 px, WebP q82. Gallery tiles intentionally do **not** link back to these posts (several post captions reference a Solana/pump.fun contract).

### Excluded posts
| Post | Views | Reason |
|---|---|---|
| 2114705963538329646 | 3,863 | Text only; mentions Solana/pump CA |
| 2114650747845439965 | 3,404 | Real person's likeness |
| 2114206467121365374 | 1,801 | Image text "$ANT on Pumpfun" |
| 2113643404328382668 | 937 | Real-person name plate |
| 2113558531970564332 | 771 | Shows Anthropic company logo/wordmark |
| 2113267379182452996 | 767 | Large Anthropic logo banner |
| 2113482280513765544 | 618 | Document with Anthropic company name |
| 2113396982207410544 | 587 | Anthropic wordmark/logo on stage screen |

**Note:** the ant mascot's cap in several kept images carries a small "A"-style mark. Review before launch and replace those images if you want zero resemblance to any company mark.

## Disclaimer (footer + FAQ)
"$ANT is an independent community meme token. It is not affiliated with, endorsed by, or connected to Anthropic PBC or its products." plus a no-intrinsic-value / not-financial-advice notice. Tokenomics are shown as **TBA**; roadmap has no dates or partnerships — update `index.html` when real figures exist.

## Files
`index.html`, `css/style.css`, `js/main.js`, `assets/` (logo, og-image, gallery), favicons, `site.webmanifest`, `tools/` (logo scripts).
Note: when opened via `file://`, Chrome logs a harmless CORS warning for `site.webmanifest`; it disappears when served over http(s).
