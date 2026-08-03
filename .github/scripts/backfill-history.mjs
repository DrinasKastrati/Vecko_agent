#!/usr/bin/env node
/* ============================================================
   ENGÅNGS-BACKFILL av state/price_history.json.

   VARFÖR DEN FINNS (2026-08-03):
   `fetch-prices.mjs` skriver EN punkt per ticker och dag och har taket 250
   punkter. Taket var alltså aldrig problemet – filen var bara ny. Den 3 augusti
   2026 innehöll den 16 sessioner, och det räckte inte för de regler systemet
   faktiskt kör på:
     * regimfiltret (punkt 2b i prompterna) kräver MA100 för ^OMX  -> 100 punkter
     * MACD(12,26,9) kräver ~35 stängningar
     * EMA200 kräver 200
   Rotationen 2026-08-03 kunde därför inte mäta 3 av 5 indikatorer i sitt egna
   tekniska filter, och tillämpade regimfiltret "i sin strängare riktning" utan
   att ha data. Backtestet visade samtidigt att regimfiltret är den ENDA parameter
   som förbättrar både avkastning och drawdown i BÅDA marknaderna – alltså kördes
   systemet blint på sin bästa regel. Det här skriptet fyller hålet en gång.
   Därefter räcker den löpande hämtningen.

   Kör:  node .github/scripts/backfill-history.mjs          (1 år, alla symboler)
         node .github/scripts/backfill-history.mjs 2y       (annat spann)
         node .github/scripts/backfill-history.mjs 1y ^OMX  (bara vissa symboler)

   MERGE-REGEL: Yahoos STÄNGNING vinner för alla dagar utom dagens. Befintliga
   punkter är skrivna av pris-hämtaren under dagen och är alltså intradagsvärden
   för innevarande dag men stängningar för äldre dagar; en officiell stängning är
   aldrig sämre. Dagens punkt lämnas orörd om Yahoo ännu inte har en stängd bar,
   annars vore ett halvfärdigt dagsvärde att skriva över ett annat halvfärdigt.
   Symboler som INTE går att hämta lämnas exakt som de är – skriptet raderar
   aldrig historik.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const MAX_POINTS = 250;   // samma tak som fetch-prices.mjs – håll dem i synk

/* ---- rena hjälpfunktioner (testbara, ingen nätåtkomst) ---------------- */

// Yahoo chart-json -> [[datum, stängning], …] stigande, hål bortfiltrerade.
export function candlesToSeries(json){
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  if (!r || !r.timestamp || !r.indicators || !r.indicators.quote) return [];
  const close = (r.indicators.quote[0] || {}).close || [];
  const out = [];
  for (let i = 0; i < r.timestamp.length; i++){
    const c = close[i];
    if (c == null || isNaN(c)) continue;
    out.push([new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10), c]);
  }
  return out;
}

/* Slår ihop befintlig serie med backfyllda punkter.
   `today` skickas in i stället för att läsas ur klockan så funktionen går att
   testa. Yahoo vinner på alla datum UTOM `today`, där en befintlig punkt
   behålls (pris-hämtaren har redan skrivit dagens värde, och Yahoo kan mitt på
   dagen leverera en obekräftad bar). Resultatet är sorterat och kapat till
   MAX_POINTS – de SENASTE punkterna behålls. */
export function mergeSeries(existing, fetched, today, maxPoints = MAX_POINTS){
  const byDate = new Map();
  for (const [d, p] of (existing || [])) if (d && p != null) byDate.set(d, p);
  for (const [d, p] of (fetched || [])){
    if (!d || p == null) continue;
    if (d === today && byDate.has(d)) continue;    // rör inte dagens egna värde
    byDate.set(d, p);
  }
  const merged = Array.from(byDate.entries()).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  return merged.length > maxPoints ? merged.slice(-maxPoints) : merged;
}

// Symboler att backfylla: allt filen redan känner till + båda watchlists.
export function collectSymbols(historySeries, watchlistTexts){
  const out = new Set(Object.keys(historySeries || {}));
  for (const text of watchlistTexts || []){
    for (const line of String(text).split("\n")){
      const s = line.trim();
      if (!s || s.startsWith("#")) continue;
      out.add(s);
    }
  }
  return [...out].sort();
}

/* ---- nätdel ----------------------------------------------------------- */
async function fetchSeries(sym, range){
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" +
              encodeURIComponent(sym) + "?range=" + range + "&interval=1d";
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return { error: "HTTP " + res.status };
    return { series: candlesToSeries(await res.json()) };
  } catch (e){ return { error: String(e && e.message || e) }; }
}

async function main(){
  const range = process.argv[2] || "1y";
  const only = process.argv.slice(3).filter(Boolean);
  const path = "state/price_history.json";

  let hist = { series: {} };
  if (existsSync(path)){ try { hist = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  hist.series = hist.series || {};

  const wl = [];
  for (const f of ["config/watchlist.txt", "config/watchlist_us.txt"])
    if (existsSync(f)) wl.push(readFileSync(f, "utf8"));

  const symbols = only.length ? only : collectSymbols(hist.series, wl);
  const today = new Date().toISOString().slice(0, 10);
  console.log(`Backfyller ${symbols.length} symboler (${range})…`);

  let ok = 0, fail = 0, added = 0;
  const failed = [];
  for (const sym of symbols){
    const before = (hist.series[sym] || []).length;
    const r = await fetchSeries(sym, range);
    if (r.error || !r.series.length){
      fail++; failed.push(sym + " (" + (r.error || "tom serie") + ")");
      console.log(`  ${sym}: MISSLYCKADES – ${r.error || "tom serie"} (behåller ${before} befintliga)`);
    } else {
      hist.series[sym] = mergeSeries(hist.series[sym], r.series, today);
      const after = hist.series[sym].length;
      added += after - before;
      ok++;
      console.log(`  ${sym}: ${before} → ${after} punkter`);
    }
    await new Promise(r2 => setTimeout(r2, 350));   // artigt tempo mot Yahoo
  }

  hist.generatedAt = new Date().toISOString();
  hist.backfilledAt = new Date().toISOString();
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(hist) + "\n");

  const langd = Object.values(hist.series).map(a => a.length);
  const minst = Math.min(...langd), median = langd.slice().sort((a, b) => a - b)[langd.length >> 1];
  console.log(`\nSkrev ${path}: ${ok} hämtade, ${fail} misslyckade, +${added} punkter.`);
  console.log(`Serielängder: kortast ${minst}, median ${median}, längst ${Math.max(...langd)}.`);
  if (failed.length) console.log("Misslyckade symboler: " + failed.join(", "));
  // Regimfiltret är hela poängen med körningen – säg rakt ut om det går att köra nu.
  for (const b of ["^OMX", "^GSPC"]){
    const n = (hist.series[b] || []).length;
    console.log(`${b}: ${n} punkter ⇒ MA100 ${n >= 100 ? "GÅR att beräkna" : "går INTE att beräkna"}` +
                `, MA200 ${n >= 200 ? "GÅR" : "går INTE"}.`);
  }
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("backfill-history.mjs");
if (invokedDirectly) main().catch(e => { console.error("Fel:", e); process.exit(1); });
