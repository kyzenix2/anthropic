/* =====================================================================
   CONFIG: all token data lives here. The page renders from this object.
   ---------------------------------------------------------------------
   ca:        "" (empty)  -> shows "TBA" everywhere; Buy + Chart become
                             placeholders and the live stats strip stays hidden.
              "0x…"       -> real contract: Buy links to Uniswap swap, chart
                             embeds DexScreener, live stats load every 60s.
   twitter /
   telegram:  null        -> placeholder button ("coming soon" toast, no navigation)
              ""          -> removes every element for that social
              "https://…" -> uses the real link (opens in a new tab)
   ===================================================================== */
const CONFIG = {
  // PLACEHOLDERS: the user gave no name or ticker yet. "Ant" / "ANT" are temporary.
  // Replace name + ticker (and the matching text in index.html <title>/meta) once they're final.
  name: "Ant",                 // PLACEHOLDER name
  ticker: "ANT",               // PLACEHOLDER ticker, displayed as $ANT
  chain: "ethereum",
  ca: "0xd85db1599a0ff426e74129139ef936f022a1f1f0",
  twitter: "https://x.com/AnthropicEthX",
  telegram: "",                // "" removes every Telegram element
  tagline: "Small ant. Big colony.\nThe hardest-working meme on Ethereum.",
  bio: "Meet $ANT: a tiny ant in a well-worn cap who shows up every day and gets to work. He's the little guy, and he knows it. No ego, no shortcuts, just one more grain carried for the colony. Alone he's small. Together we're a colony. A community meme, building on Ethereum.",
  features: [
    { icon: "🐜", title: "Small but Mighty", text: "Ants carry many times their own weight. Size was never the point; showing up is." },
    { icon: "🧢", title: "Cap On, Clocked In", text: "A worker's meme for the builders, grinders and quiet doers. Head down, antennae up." },
    { icon: "🏗️", title: "Built by the Colony", text: "No single ant runs the hill. It's teamwork, community first, building on Ethereum." }
  ],
  marquee: ["$ANT", "SMALL BUT MIGHTY", "BIG COLONY", "BUILDING ON ETHEREUM", "CAP ON", "TEAMWORK", "THE LITTLE GUY"],
  disclaimer: "Ant ($ANT) is an independent community meme token with no intrinsic value, roadmap or expectation of financial return. Nothing on this site is financial advice. Crypto is volatile; only use what you can afford to lose and always verify the contract address."
};

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const ca = (CONFIG.ca || "").trim();
const hasCA = ca.length > 0;
const chainLabel = CONFIG.chain.charAt(0).toUpperCase() + CONFIG.chain.slice(1);
const buyUrl = hasCA ? `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${encodeURIComponent(ca)}` : null;
const chartUrl = hasCA ? `https://dexscreener.com/${CONFIG.chain}/${encodeURIComponent(ca)}` : null;

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

function setLink(el, url, soonMsg) {
  if (url) {
    el.href = url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.classList.remove("is-placeholder");
  } else {
    el.setAttribute("href", "#");
    el.dataset.soon = soonMsg;
    el.classList.add("is-placeholder");
    el.title = soonMsg;
    el.setAttribute("aria-disabled", "true");
  }
}

/* ---------- render ---------- */
function render() {
  $$("[data-name]").forEach(e => (e.textContent = CONFIG.name));
  $$("[data-ticker]").forEach(e => (e.textContent = "$" + CONFIG.ticker));
  $$("[data-chain]").forEach(e => (e.textContent = chainLabel));
  $$("[data-tagline]").forEach(e => (e.textContent = CONFIG.tagline));
  $$("[data-bio]").forEach(e => (e.textContent = CONFIG.bio));
  $$("[data-disclaimer]").forEach(e => (e.textContent = CONFIG.disclaimer));
  $$("[data-ca]").forEach(e => (e.textContent = hasCA ? ca : "TBA"));
  $("#year").textContent = new Date().getFullYear();

  // features
  $("#features").innerHTML = CONFIG.features.map(f => `
    <div class="card"><div class="feat-icon" aria-hidden="true">${f.icon}</div>
    <h3>${f.title}</h3><p>${f.text}</p></div>`).join("");

  // marquee (duplicated for a seamless loop)
  const items = CONFIG.marquee.map(m => `<span>${m}</span><span class="star" aria-hidden="true">•••</span>`).join("");
  $("#marqueeTrack").innerHTML = items + items + items + items;

  // buy + chart links
  $$("[data-buy]").forEach(e => setLink(e, buyUrl, "Buy link coming soon. CA is TBA"));
  $$("[data-chart-link]").forEach(e => setLink(e, chartUrl, "Chart coming soon. CA is TBA"));

  // socials
  ["twitter", "telegram"].forEach(key => {
    const val = CONFIG[key];
    const label = key === "twitter" ? "X" : "Telegram";
    $$(`[data-social="${key}"]`).forEach(el => {
      if (val === "") { el.closest("li") ? el.closest("li").remove() : el.remove(); return; }
      setLink(el, val || null, `${label} coming soon`);
      const cta = $("[data-social-label]", el);
      if (cta && !val) cta.textContent = "Soon";
    });
  });

  // chart
  const wrap = $("#chartWrap");
  if (hasCA && /^https:\/\/dexscreener\.com\//.test(chartUrl)) {
    const src = `${chartUrl}?embed=1&loadChartSettings=0&theme=light&trades=0&info=0`;
    if (/^https:\/\/dexscreener\.com\//.test(src)) {
      wrap.innerHTML = `<iframe src="${src}" title="${CONFIG.name} chart on DexScreener" loading="lazy"></iframe>`;
    }
  } else {
    wrap.innerHTML = `
      <div class="chart-ph">
        <svg width="120" height="56" viewBox="0 0 120 56" fill="none" aria-hidden="true">
          <polyline points="2,48 20,40 34,44 50,26 64,32 80,14 96,20 118,6" stroke="url(#g)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#ba6033"/><stop offset="1" stop-color="#2a1d15"/></linearGradient></defs>
        </svg>
        <p class="font-display text-2xl text-espresso font-bold">Chart coming soon</p>
        <p class="text-[#6b5747] max-w-md">The live DexScreener chart appears here once the official contract address is announced.</p>
        <span class="badge badge-dark">CA: TBA</span>
      </div>`;
  }
}

/* ---------- interactions ---------- */
function bind() {
  // placeholder links never navigate
  document.addEventListener("click", e => {
    const a = e.target.closest("a.is-placeholder");
    if (a) { e.preventDefault(); toast(a.dataset.soon || "Coming soon"); }
  });

  // copy CA
  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const text = hasCA ? ca : "TBA";
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
    } catch (_) { /* still show feedback */ }
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    toast(hasCA ? "Contract address copied!" : "Copied! (CA is TBA for now)");
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1800);
  }));

  // mobile menu
  const mb = $("#menuBtn"), mm = $("#mobileMenu");
  mb.addEventListener("click", () => {
    const open = mm.classList.toggle("hidden") === false;
    mb.setAttribute("aria-expanded", String(open));
  });
  $$("a", mm).forEach(a => a.addEventListener("click", () => { mm.classList.add("hidden"); mb.setAttribute("aria-expanded", "false"); }));

  // nav background on scroll
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
}

/* ---------- crumbs (soft floating dots, decorative) ---------- */
function sparkles() {
  const box = $(".sparkles");
  const n = window.innerWidth < 640 ? 8 : 16;
  let html = "";
  for (let i = 0; i < n; i++) {
    const size = 4 + Math.random() * 6;
    html += `<span class="sparkle" style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;--d:${5 + Math.random() * 5}s;--delay:${Math.random() * 5}s"></span>`;
  }
  box.innerHTML = html;
}

/* ---------- live stats (only with a real CA) ---------- */
const fmtUsd = (n, small) => {
  if (n == null || isNaN(n)) return "-";
  n = Number(n);
  if (small && n < 1) return "$" + n.toPrecision(4);
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toFixed(2);
};
async function loadStats() {
  const box = $("#stats");
  if (!hasCA) { box.classList.add("hidden"); return; }
  try {
    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(ca)}`);
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    const pairs = (d.pairs || []).filter(p => p.chainId === CONFIG.chain);
    if (!pairs.length) throw new Error("no pairs");
    const p = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
    $('[data-stat="price"]').textContent = fmtUsd(p.priceUsd, true);
    $('[data-stat="mcap"]').textContent = fmtUsd(p.marketCap ?? p.fdv);
    $('[data-stat="liq"]').textContent = fmtUsd(p.liquidity?.usd);
    $('[data-stat="vol"]').textContent = fmtUsd(p.volume?.h24);
    box.classList.remove("hidden");
  } catch (_) {
    box.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  bind();
  sparkles();
  if (hasCA) { loadStats(); setInterval(loadStats, 60000); }
});
