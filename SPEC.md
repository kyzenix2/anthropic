# Ant ($ANT) landing page: spec

- Token: name "Ant", ticker "ANT" (displayed $ANT). BOTH ARE PLACEHOLDERS (user gave none); flagged in CONFIG. Chain: ethereum.
- CA: 0xd85db1599a0ff426e74129139ef936f022a1f1f0. Empty CA would show "TBA" everywhere, keep Buy & chart as placeholders ("coming soon" toast), and hide the live stats strip.
- X: https://x.com/AnthropicEthX. Telegram is removed. An empty social value removes that element; null would show a "coming soon" toast; a URL uses the real link.
- Copy: short, honest copy from the art: a tiny hard-working ant in a cap, the little guy, colony/teamwork, "small but mighty",
  "building on Ethereum". No price, roadmap or utility claims. Tagline (2 lines): "Small ant. Big colony. / The hardest-working meme on Ethereum."
  Footer disclaimer: independent community meme token, not financial advice.
- Assets (assets/): logo.webp (512x512), banner.webp (1500x500, no text), favicon.ico (16/32/48), favicon.png (64), apple-touch-icon.png (180).
- Hero layout: logo BELOW the banner on mobile; on desktop (md+) the banner is cropped to max 40vh/400px and the logo overlaps
  its faded bottom edge slightly (banner has no text, so nothing is covered).

## Style
Warm light "natural premium". Background #e9e1d6 / cream #f4efe8 / card #fbf8f3 (sampled from the art's beige, banner bg #d3c2af).
Text espresso #2a1d15, muted #5c4a3c. Accent rust sampled from the ant: #ba6033 (highlight) -> #984720 (shadow), used on primary
buttons, links, active states, Copy, glows. Secondary dark espresso #2a1d15 (marquee, footer).
Fonts: Bricolage Grotesque (display/headings) + Inter (body), Google Fonts.
Details: soft shadows, rounded cards, tilted espresso marquee, logo bob + hover wiggle, feature-icon wiggle, animated ant-trail dots
between the How to Buy steps (lg+), faint floating crumbs. Honors prefers-reduced-motion.

## Tech
Plain HTML + JS + Tailwind via CDN. No frameworks or build tools. Files: index.html, style.css, script.js, assets/.
All token data in one CONFIG object at the top of script.js (with comments). The page renders from CONFIG. Mobile-first.

## Sections (in order)
1. Fixed navbar: logo, name, ticker badge, About / How to Buy / Community / Chart links, Buy Now.
2. Hero: banner, centered logo, big name, ticker + chain badge, tagline, CA box + Copy, Buy Now / X, "Ethereum • Live".
3. About: bio + 3 feature cards.
4. How to Buy: "You're on Ethereum" box, steps 01–04 (get MetaMask, buy ETH, open Uniswap, paste CA & swap), "Swap on DEX".
5. Community: X card.
6. Live Chart: DexScreener iframe when CA is real, otherwise a placeholder; "Open on DexScreener" link.
7. Footer: logo, tagline, quick links, socials, CA + Copy, disclaimer, copyright; multi-column with a big wordmark;
   `footer .grid > * { min-width: 0; }` and long CAs wrap (no horizontal overflow on mobile).

## Behavior
- Copy shows "Copied!".
- Placeholder links don't navigate; they show a "coming soon" toast.
- Buy URL (real CA only): https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=0xd85db1599a0ff426e74129139ef936f022a1f1f0
- Chart: https://dexscreener.com/ethereum/{CA} (embed with theme=light). Only DexScreener URLs are embedded.
- Live stats (real CA only): https://api.dexscreener.com/latest/dex/tokens/{CA}, showing price, market cap, liquidity and 24h volume.
  Refreshes every 60s and hides itself on failure.

## Deploy
Not deployed (deliverable is a zip). Static site, no build; serve the folder root.
