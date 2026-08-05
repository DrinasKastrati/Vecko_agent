#!/usr/bin/env node
/* ============================================================
   Hämtar nordiska aktiekurser och skriver state/prices.json.
   Körs av GitHub Actions (fri nätåtkomst) – INTE av routinen.
   Routinen läser sedan bara den committade filen.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
// Basen kräver minst 2 tecken: annars plockas skräp som "B.ST" ur text skriven
// med mellanslag ("BAHN B.ST") – klassaktier ska skrivas med bindestreck (BAHN-B.ST).
// Efterledet tillåter upp till 6 tecken så att ETF:er som XACT-OMXS30.ST
// (indexsleeven) fångas, inte bara klassbokstäver som SAAB-B.ST.
const TICKER_RE = /\b[A-Z0-9]{2,6}(?:-[A-Z0-9]{1,6})?\.(?:ST|OL|CO|HE)\b/gi;

// ---- pure helpers (testbara) ------------------------------------------
export function extractTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  for (const m of clean.matchAll(TICKER_RE)) out.add(m[0].toUpperCase());
  return [...out];
}

// Fångar korta tickers ur "(TICKER / Börs)" och bygger Yahoo-symbol via börsen,
// t.ex. "(KOG / Oslo Børs)" -> KOG.OL, "(SAAB B / Nasdaq Stockholm)" -> SAAB-B.ST.
export function extractCaseTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  const re = /\(\s*([A-Za-z0-9][A-Za-z0-9 .\-]{0,9}?)\s*\/\s*([^)]{2,40})\)/g;
  for (const m of clean.matchAll(re)){
    let base = m[1].trim().toUpperCase();
    if (base.includes(".")) continue;            // redan full ticker – tas av extractTickers
    base = base.replace(/\s+/g, "-");
    const ex = m[2].toLowerCase();
    let suf = null;
    if (/stockholm|first north|spotlight/.test(ex)) suf = "ST";
    else if (/oslo/.test(ex)) suf = "OL";
    else if (/copenhagen|k[oö]penham|k[oø]benhav/.test(ex)) suf = "CO";
    else if (/helsink/.test(ex)) suf = "HE";
    if (!suf) continue;
    if (!/^[A-Z0-9-]{1,10}$/.test(base)) continue;
    out.add(base + "." + suf);
  }
  return [...out];
}

export function readFirst(paths){
  for (const p of paths){ if (existsSync(p)) { try { return readFileSync(p, "utf8"); } catch {} } }
  return "";
}

export function newestWeekly(){
  const dirs = ["reports/weekly", "."];
  let best = null;
  for (const d of dirs){
    let files = [];
    try { files = readdirSync(d); } catch { continue; }
    for (const f of files){
      const m = f.match(/^veckorapport-(\d{6})(?:_\d+)?\.md$/i);
      if (m && (!best || m[1] > best.key)) best = { key: m[1], path: d + "/" + f };
    }
  }
  return best ? readFirst([best.path]) : "";
}

export function collectTickers(){
  const tickers = new Set();
  const portf   = readFirst(["state/portfolj.md", "portfolj.md"]);
  const watch   = readFirst(["config/watchlist.txt", "watchlist.txt"]);
  const weekly  = newestWeekly();
  for (const t of extractTickers(portf))  tickers.add(t);
  for (const t of extractTickers(weekly)) tickers.add(t);
  for (const t of extractCaseTickers(weekly)) tickers.add(t);
  for (const t of extractCaseTickers(portf))  tickers.add(t);
  for (const line of watch.split("\n")){
    const t = line.trim().toUpperCase();
    if (t && !t.startsWith("#") && /^[A-Z0-9-]{1,14}\.(ST|OL|CO|HE)$/.test(t)) tickers.add(t);
  }
  return [...tickers].sort();
}

/* Symboler som RAPPORTERAR SNART, ur state/earnings_calendar.json.

   Varför de måste med: fram till 2026-08-04 fylldes watchlistan i efterhand, av
   en människa som läst en rapport. Palantir flaggades av scouten tre dagar i rad
   inför sin rapport 3/8, saknade rad i watchlisten, fick därför ingen kurs i
   prices.json, föll på grind 1 (verifierbar kurs) och kunde inte utvärderas –
   och lades till DAGEN EFTER att aktien gått +27,6 %. Kalendern gör tillägget
   automatiskt och i FÖRVÄG.

   Posterna faller ur av sig själv när rapportdatumet passerat (kalendern skriver
   bara `upcoming`), så listan växer inte obegränsat. Saknas eller är filen
   trasig returneras en tom lista – kursbevakningen ska aldrig falla för att
   kalendern gjort det. */
export function collectEarningsTickers(readFile = readFirst){
  const raw = readFile(["state/earnings_calendar.json"]);
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    const up = Array.isArray(j.upcoming) ? j.upcoming : [];
    return up.map(u => u && u.symbol).filter(s => typeof s === "string" && s).sort();
  } catch { return []; }
}

/* Symboler som ska få ett EXTRA anrop med förbörs-/efterbörsdata.

   Varför mängden är smal: det extra anropet är `interval=1m` och ger ~1400
   punkter per symbol. Att göra det för alla ~54 symboler var 30:e minut är
   onödig last mot ett API som redan svarar 403 när det tycker att det är för
   mycket. Varje MÄTT miss (PLTR 2026-08-04, ANET och AMD 2026-08-05) är en
   rapporthändelse, så mängden begränsas till dem.

   `isEstimate: true` räknas MED här. CLAUDE.md drar gränsen så: ett gissat
   datum duger för att säkra en kurs i förväg, men aldrig som bekräftad binär
   händelse. Den här funktionen avgör bara HÄMTNING – aldrig ett beslut. */
export function extendedScope(calendar, candidates, today){
  const out = new Set();
  const up = (calendar && Array.isArray(calendar.upcoming)) ? calendar.upcoming : [];
  for (const u of up){
    if (!u || typeof u.symbol !== "string" || !u.symbol) continue;
    if (typeof u.tradingDaysAway !== "number") continue;
    if (u.tradingDaysAway < 0 || u.tradingDaysAway > 2) continue;
    out.add(u.symbol);
  }
  const cs = (candidates && Array.isArray(candidates.candidates)) ? candidates.candidates : [];
  for (const c of cs){
    if (!c || c.status !== "new" || c.confirmed !== true) continue;
    if (typeof c.ticker !== "string" || !c.ticker) continue;
    if (today && c.expiresAt && String(c.expiresAt) < today) continue;
    out.add(c.ticker);
  }
  return [...out].sort();
}

// ---- USA + krypto (scout-routinen) ------------------------------------
export function newestScout(){
  const dirs = ["reports/scout", "."];
  let best = null;
  for (const d of dirs){
    let files = [];
    try { files = readdirSync(d); } catch { continue; }
    for (const f of files){
      const m = f.match(/^rapport-(\d{6})(?:_\d+)?\.md$/i);
      if (m && (!best || m[1] > best.key)) best = { key: m[1], path: d + "/" + f };
    }
  }
  return best ? readFirst([best.path]) : "";
}

// Fångar (TICKER / Börs) ur scout-case: NYSE/NASDAQ -> vanlig symbol,
// kryptonätverk -> <MYNT>-USD.
export function extractUsCaseTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  const re = /\(\s*([A-Za-z0-9][A-Za-z0-9 .\-]{0,9}?)\s*\/\s*([^)]{2,40})\)/g;
  for (const m of clean.matchAll(re)){
    const base = m[1].trim().toUpperCase().replace(/\s+/g, "-");
    const ex = m[2].toLowerCase();
    if (/bitcoin|ethereum|solana|crypto|krypto|on-chain|\bnetwork\b|nätverk|\bchain\b|kedja/.test(ex)){
      if (/^[A-Z0-9]{2,6}(-USD)?$/.test(base)) out.add(base.endsWith("-USD") ? base : base + "-USD");
    } else if (/nasdaq|nyse|cboe|amex|arca/.test(ex)){
      if (/^[A-Z]{1,6}(\.[A-Z]{1,2})?$/.test(base)) out.add(base);
    }
  }
  return [...out];
}

// Senaste us-veckorapporten (US-rotationens case) – för prisinsamling.
export function newestUsWeekly(){
  const dirs = ["reports/us_weekly", "."];
  let best = null;
  for (const d of dirs){
    let files = [];
    try { files = readdirSync(d); } catch { continue; }
    for (const f of files){
      const m = f.match(/^us-veckorapport-(\d{6})(?:_\d+)?\.md$/i);
      if (m && (!best || m[1] > best.key)) best = { key: m[1], path: d + "/" + f };
    }
  }
  return best ? readFirst([best.path]) : "";
}

// Plockar US-symboler ur portfolj_us.md:s tabeller (Yahoo-ticker-kolumnen).
export function extractUsPortfolioTickers(md){
  if (!md) return [];
  const out = new Set();
  const lines = md.split("\n");
  let tkCol = -1;
  for (const ln of lines){
    if (!/^\s*\|.*\|\s*$/.test(ln)) { tkCol = -1; continue; }
    const cells = ln.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
    if (tkCol < 0){ // headerrad
      tkCol = cells.findIndex(c => /yahoo|ticker/i.test(c));
      continue;
    }
    if (tkCol >= 0 && cells[tkCol]){
      const t = cells[tkCol].toUpperCase();
      if (/^\^?[A-Z]{1,6}(-[A-Z]{1,3})?$/.test(t) && !/^-+$/.test(t)) out.add(t);
    }
  }
  return [...out];
}

// Läser config/watchlist_us.txt (US-symbol, <MYNT>-USD, ^INDEX, klass-aktie) + senaste
// scout-rapportens case.
export function collectUsTickers(){
  const set = new Set();
  const watch = readFirst(["config/watchlist_us.txt", "watchlist_us.txt"]);
  for (const line of watch.split("\n")){
    const t = line.trim().toUpperCase();
    if (!t || t.startsWith("#")) continue;
    // Sista mönstret = valutapar i Yahoo-format (USDSEK=X) – us-boken är
    // USD-denominerad och dashboardens Total-vy visar kursen.
    if (/^\^?[A-Z]{1,6}$/.test(t) || /^[A-Z0-9]{2,6}-USD$/.test(t) || /^[A-Z]{1,5}\.[A-Z]{1,2}$/.test(t) ||
        /^[A-Z]{6}=X$/.test(t)) set.add(t);
  }
  for (const t of extractUsCaseTickers(newestScout())) set.add(t);
  // US-rotationens egna innehav/case (så deras kurser garanterat hämtas):
  for (const t of extractUsPortfolioTickers(readFirst(["state/portfolj_us.md", "portfolj_us.md"]))) set.add(t);
  for (const t of extractUsCaseTickers(newestUsWeekly())) set.add(t);
  return [...set];
}

// FÖREGÅENDE STÄNGNING – hämtas ur SERIEN, inte ur chartPreviousClose.
//
// Yahoos chart-meta har ett fält som HETER som det vi vill ha men inte är det:
// `chartPreviousClose` är stängningen före HELA det begärda fönstret, och vi
// begär range=5d – alltså ~en vecka bakåt. Fältet `previousClose` finns inte i
// chart-API:ts meta (kontrollerat live 2026-08-02: null för SAAB-B.ST, MSFT och
// XACT-OMXS30.ST). Att läsa chartPreviousClose som dagsrörelse gav veckorörelser
// presenterade som dagsrörelser – MSFT chartPrev 381,70 mot faktisk föregående
// stängning 451,10 blir "+21,7 %" i stället för +3,0 %, exakt den falska siffra
// scouten flaggade i fyra rapporter.
//
// Rätt nivå är den sista stängningen DATERAD FÖRE den session kursen kommer
// ifrån. Att bara ta näst sista giltiga stängningen räcker inte: när dagens bar
// ännu inte konsoliderats (close = null, sett på ELUX-B.ST 2026-07-31) skulle
// det ge en tvåsessionersrörelse. Därför jämförs mot regularMarketTime.
export function prevCloseFrom(res){
  const meta = (res && res.meta) || null;
  if (meta && meta.previousClose != null) return meta.previousClose;
  const ts = (res && res.timestamp) || [];
  const q = res && res.indicators && res.indicators.quote && res.indicators.quote[0];
  const closes = (q && q.close) || [];
  const day = sec => new Date(sec * 1000).toISOString().slice(0, 10);
  const cur = meta && meta.regularMarketTime ? day(meta.regularMarketTime) : null;

  let prev = null;
  for (let i = 0; i < ts.length; i++){
    const c = closes[i];
    if (c == null || isNaN(c)) continue;
    if (cur && day(ts[i]) >= cur) continue;   // hoppa dagens bar (och allt senare)
    prev = c;
  }
  if (prev != null) return prev;

  // Ingen användbar tidsstämpel att jämföra mot: näst sista giltiga stängningen.
  const valid = closes.filter(v => v != null && !isNaN(v));
  if (!cur && valid.length >= 2) return valid[valid.length - 2];
  return (meta && meta.chartPreviousClose != null) ? meta.chartPreviousClose : null;
}

export function parseChart(json, sym){
  const res = json && json.chart && json.chart.result && json.chart.result[0];
  const meta = res && res.meta;
  if (!meta || meta.regularMarketPrice == null) return { symbol: sym, error: "ingen kursdata" };
  const t = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null;
  return {
    symbol: meta.symbol || sym,
    price: meta.regularMarketPrice,
    currency: meta.currency || null,
    exchange: meta.fullExchangeName || meta.exchangeName || null,
    marketTime: t,
    marketState: meta.marketState || null,
    previousClose: prevCloseFrom(res),
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    source: "Yahoo Finance (chart API)"
  };
}

// ---- network ----------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Reservkälla när Yahoo fallerar: stooq CSV (USA + krypto främst).
export async function fetchStooq(sym, fetchImpl = globalThis.fetch){
  let s = null;
  if (/^[A-Z]{1,6}$/.test(sym)) s = sym.toLowerCase() + ".us";
  else if (/^[A-Z0-9]{2,6}-USD$/.test(sym)) s = sym.replace("-", "").toLowerCase();
  else if (/^[A-Z]{6}=X$/.test(sym)) s = sym.slice(0, 6).toLowerCase();   // USDSEK=X -> usdsek
  else if (/\.ST$/.test(sym)) s = sym.toLowerCase();
  if (!s) return null;
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(s)}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const r = await fetchImpl(url, { headers: { "User-Agent": UA } });
    if (!r.ok) return null;
    const txt = await r.text();
    const lines = txt.trim().split("\n");
    if (lines.length < 2) return null;
    const c = lines[1].split(",");            // Symbol,Date,Time,Open,High,Low,Close,Volume
    const close = parseFloat(c[6]);
    if (isNaN(close) || c[1] === "N/D") return null;
    const mt = (c[1] && c[2]) ? new Date(c[1] + "T" + c[2] + "Z").toISOString() : null;
    return { symbol: sym, price: close, currency: null, exchange: "stooq",
      marketTime: mt, marketState: null, previousClose: null,
      dayHigh: parseFloat(c[4]) || null, dayLow: parseFloat(c[5]) || null, source: "stooq.com (CSV)" };
  } catch { return null; }
}

export async function fetchQuote(sym, fetchImpl = globalThis.fetch){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const host of hosts){
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(sym)}?range=5d&interval=1d`;
    try {
      const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Accept": "application/json", "Accept-Language": "en-US,en;q=0.9" } });
      if (!r.ok) continue;
      const j = await r.json();
      const q = parseChart(j, sym);
      if (!q.error) return q;
    } catch { /* try next host */ }
  }
  const st = await fetchStooq(sym, fetchImpl);
  if (st && !st.error) return st;
  return { symbol: sym, error: "kunde inte hämtas (alla källor gav fel)" };
}

// ---- main -------------------------------------------------------------
export async function run(fetchImpl = globalThis.fetch){
  const tickers = [...new Set([...collectTickers(), ...collectUsTickers(),
                               ...collectEarningsTickers()])].sort();
  const quotes = {};
  let okCount = 0;
  for (const t of tickers){
    const q = await fetchQuote(t, fetchImpl);
    quotes[t] = q;
    if (!q.error) okCount++;
    await sleep(250); // var snäll mot API:t
  }
  const out = {
    generatedAt: new Date().toISOString(),
    source: "Yahoo Finance chart API via GitHub Actions",
    // VARFÖR schemaVersion finns: 2026-08-02 rättades previousClose (läste tidigare
    // chartPreviousClose ≈ en vecka bakåt). Samma dag "verifierade" en routine fixen mot en
    // prices.json som skrivits FÖRE rättelsen – det gamla värdet såg rimligt ut för en nordisk
    // ticker (601,00 mot korrekta 599,60) och slutsatsen blev fel. Filen kunde inte tala om
    // vilken kod som skrivit den. Nu kan den. Bumpa strängen när ett fälts BETYDELSE ändras,
    // inte vid vanliga ändringar.
    schemaVersion: "2026-08-02-prevclose",
    note: "Automatiskt hämtade kurser. 'marketTime' är kursens verifierade tidsstämpel (ISO). " +
          "Använd endast om marketTime är från idag eller senaste handelsdagens stängning. " +
          "'previousClose' är föregående SESSIONS stängning (dagsrörelse = price/previousClose − 1). " +
          "Saknas 'schemaVersion' är filen skriven före 2026-08-02 och previousClose pekar då " +
          "~en vecka bakåt – räkna INTE dagsrörelser ur en sådan fil.",
    tickerCount: tickers.length,
    okCount,
    quotes
  };
  mkdirSync("state", { recursive: true });
  writeFileSync("state/prices.json", JSON.stringify(out, null, 2) + "\n");
  updatePriceHistory(quotes);
  console.log(`Skrev state/prices.json: ${okCount}/${tickers.length} tickers hämtade.`);
  return out;
}

// Rullande prishistorik (max 250 punkter/ticker ≈ 1 år, en per dag).
// Taket var 60 punkter när filen bara matade sparklines. Sedan alpha-mätningen tillkom
// används serien till att räkna benchmarkets utveckling över varje affärs EXAKTA hållperiod,
// och katalysator-horisonterna är nu upp till 6 veckor – med 60 punkter föll äldre affärer
// tyst ur mätningen (perioden utanför historiken ⇒ alpha = null). Retron läser samma fil.
export function updatePriceHistory(quotes){
  const path = "state/price_history.json";
  let hist = { series: {} };
  if (existsSync(path)) { try { hist = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  hist.series = hist.series || {};
  const today = new Date().toISOString().slice(0, 10);
  for (const [sym, q] of Object.entries(quotes)){
    if (!q || q.error || q.price == null) continue;
    const arr = hist.series[sym] || (hist.series[sym] = []);
    if (arr.length && arr[arr.length - 1][0] === today) arr[arr.length - 1] = [today, q.price];
    else arr.push([today, q.price]);
    if (arr.length > 250) hist.series[sym] = arr.slice(-250);
  }
  hist.generatedAt = new Date().toISOString();
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(hist) + "\n");
  return hist;
}

// kör bara när scriptet startas direkt (inte vid import i test)
const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("fetch-prices.mjs");
if (invokedDirectly) {
  run().catch(e => { console.error("Fel:", e); process.exit(1); });
}
