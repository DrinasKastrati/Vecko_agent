#!/usr/bin/env node
/* ============================================================
   Backtest av det MEKANISKA skelettet i rotationsstrategin:
   veckorotation (måndag), topp 2 av universum, 5 handelsdagars
   maxhåll, stop/mål i procent, 50/50-vikt. LLM-omdömet (case-
   urval på katalysatorer) ersätts av en momentum-proxy – så
   resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer,
   hålltid), INTE strategin som helhet.

   Kör:  node .github/scripts/backtest.mjs nordic   (eller: us)
         node .github/scripts/backtest.mjs us 5y    (range, default 2y)
   Skriver reports/backtest/backtest-yymmdd-<marknad>.md
   Kräver nätåtkomst (Yahoo chart-API) – kör på din dator eller i en Action.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---- pure helpers (testbara, ingen nätåtkomst) -------------------------
// Yahoo chart-json -> [{d:"åååå-mm-dd", o,h,l,c}] (stigande datum, hål filtreras).
export function parseCandles(json){
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  if (!r || !r.timestamp || !r.indicators || !r.indicators.quote) return [];
  const q = r.indicators.quote[0] || {};
  const out = [];
  for (let i = 0; i < r.timestamp.length; i++){
    const o = q.open && q.open[i], h = q.high && q.high[i], l = q.low && q.low[i], c = q.close && q.close[i];
    if ([o, h, l, c].some(v => v == null || isNaN(v))) continue;
    out.push({ d: new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10), o, h, l, c });
  }
  return out;
}

// Momentum över `lookback` handelsdagar fram till index i (exklusive dag i).
export function momentumAt(candles, i, lookback){
  const j = i - lookback;
  if (j < 0 || i < 1) return null;
  const base = candles[j].c, now = candles[i - 1].c;
  if (!base || !now) return null;
  return now / base - 1;
}

// Är candles[i] första handelsdagen i en ny vecka? (måndags-proxy)
export function isWeekStart(candles, i){
  if (i === 0) return false;
  const dow = d => new Date(d + "T12:00:00Z").getUTCDay();
  return dow(candles[i].d) < dow(candles[i - 1].d) ||
         (Date.parse(candles[i].d) - Date.parse(candles[i - 1].d)) > 3 * 86400e3;
}

// Simulerar EN position: entry på öppning dag i, stop/mål i %, max `holdDays`
// handelsdagar, konservativt (stop före mål om båda nås samma dag; gap ger gap-kurs).
export function simulateTrade(candles, i, stopPct, targetPct, holdDays){
  const entry = candles[i].o;
  if (!entry) return null;
  const stop = entry * (1 - stopPct), target = entry * (1 + targetPct);
  const last = Math.min(i + holdDays - 1, candles.length - 1);
  for (let j = i; j <= last; j++){
    const day = candles[j];
    if (day.o <= stop)  return { retPct: (day.o / entry - 1) * 100, reason: "stop-gap", days: j - i + 1 };
    if (day.l <= stop)  return { retPct: (stop / entry - 1) * 100, reason: "stop", days: j - i + 1 };
    if (day.o >= target) return { retPct: (day.o / entry - 1) * 100, reason: "mål-gap", days: j - i + 1 };
    if (day.h >= target) return { retPct: (target / entry - 1) * 100, reason: "mål", days: j - i + 1 };
  }
  return { retPct: (candles[last].c / entry - 1) * 100, reason: "rotation", days: last - i + 1 };
}

// Kör hela skelettet över universumet. candlesBySym = { SYM: candles[] }.
// params = { lookback, stopPct, targetPct, holdDays, topN, weight }.
export function backtestUniverse(candlesBySym, params){
  const P = Object.assign({ lookback: 20, stopPct: 0.05, targetPct: 0.10, holdDays: 5, topN: 2, weight: 0.5 }, params);
  const syms = Object.keys(candlesBySym).filter(s => (candlesBySym[s] || []).length > P.lookback + 10);
  if (!syms.length) return null;
  // gemensam datumaxel = symbolen med flest candles
  const ref = syms.reduce((a, b) => candlesBySym[a].length >= candlesBySym[b].length ? a : b);
  const refC = candlesBySym[ref];
  const idxBySym = {}; // datum -> index per symbol
  for (const s of syms){
    const m = new Map(); candlesBySym[s].forEach((c, i) => m.set(c.d, i));
    idxBySym[s] = m;
  }
  const trades = []; const weekly = [];
  for (let i = P.lookback + 1; i < refC.length; i++){
    if (!isWeekStart(refC, i)) continue;
    const date = refC[i].d;
    const ranked = [];
    for (const s of syms){
      const si = idxBySym[s].get(date);
      if (si == null) continue;
      const mom = momentumAt(candlesBySym[s], si, P.lookback);
      if (mom != null && mom > 0) ranked.push({ s, si, mom });
    }
    ranked.sort((a, b) => b.mom - a.mom);
    const picks = ranked.slice(0, P.topN);
    let wkRet = 0;
    for (const p of picks){
      const tr = simulateTrade(candlesBySym[p.s], p.si, P.stopPct, P.targetPct, P.holdDays);
      if (!tr) continue;
      trades.push(Object.assign({ sym: p.s, date }, tr));
      wkRet += P.weight * tr.retPct;
    }
    weekly.push({ date, retPct: wkRet, picks: picks.length });
  }
  // statistik
  const pcts = trades.map(t => t.retPct);
  const wins = pcts.filter(p => p > 0), losses = pcts.filter(p => p < 0);
  let chain = 1, peak = 1, maxDd = 0;
  for (const w of weekly){ chain *= 1 + w.retPct / 100; if (chain > peak) peak = chain; const dd = 1 - chain / peak; if (dd > maxDd) maxDd = dd; }
  const sum = a => a.reduce((x, y) => x + y, 0);
  const byReason = {};
  trades.forEach(t => byReason[t.reason] = (byReason[t.reason] || 0) + 1);
  return {
    params: P, weeks: weekly.length, trades: trades.length,
    winRate: trades.length ? wins.length / trades.length : null,
    avgWin: wins.length ? sum(wins) / wins.length : null,
    avgLoss: losses.length ? sum(losses) / losses.length : null,
    profitFactor: losses.length ? Math.abs(sum(wins) / sum(losses)) : (wins.length ? Infinity : null),
    chainedPct: (chain - 1) * 100,
    maxDrawdownPct: maxDd * 100,
    byReason
  };
}

export function buyHoldPct(candles){
  if (!candles || candles.length < 2) return null;
  return (candles[candles.length - 1].c / candles[0].c - 1) * 100;
}

// ---- nät + CLI ---------------------------------------------------------
async function fetchCandles(sym, range){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const h of hosts){
    try {
      const url = `https://${h}/v8/finance/chart/${encodeURIComponent(sym)}?range=${range}&interval=1d`;
      const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
      if (!r.ok) continue;
      const c = parseCandles(await r.json());
      if (c.length) return c;
    } catch {}
  }
  return [];
}

async function main(){
  const market = (process.argv[2] || "nordic").toLowerCase();
  const range = process.argv[3] || "2y";
  const uniFile = market === "us" ? "config/backtest_universe_us.txt" : "config/backtest_universe_nordic.txt";
  const bench = market === "us" ? "^GSPC" : "^OMX";
  if (!existsSync(uniFile)){ console.error("Saknar " + uniFile); process.exit(1); }
  const syms = readFileSync(uniFile, "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));

  console.log(`Hämtar ${syms.length} symboler (${range})…`);
  const candlesBySym = {};
  for (const s of syms){
    candlesBySym[s] = await fetchCandles(s, range);
    console.log("  " + s + ": " + candlesBySym[s].length + " dagar");
    await new Promise(r => setTimeout(r, 400)); // artigt tempo mot Yahoo
  }
  const benchCandles = await fetchCandles(bench, range);

  const grid = [];
  for (const lookback of [10, 20])
    for (const [stopPct, targetPct] of [[0.03, 0.06], [0.04, 0.08], [0.05, 0.10]])
      grid.push({ lookback, stopPct, targetPct });

  const results = grid.map(p => backtestUniverse(candlesBySym, p)).filter(Boolean);
  const bh = buyHoldPct(benchCandles);
  const f = n => n == null ? "–" : (n > 0 ? "+" : "") + n.toFixed(2);

  const today = new Date();
  const ymd = String(today.getFullYear()).slice(2) + String(today.getMonth() + 1).padStart(2, "0") + String(today.getDate()).padStart(2, "0");
  const lines = [];
  lines.push(`# Backtest av mekaniska skelettet – ${market} (${range})`);
  lines.push(`**Datum:** ${today.toISOString().slice(0, 10)} | **Universum:** ${syms.length} symboler | **Benchmark (${bench}) köp-och-behåll:** ${f(bh)} %`);
  lines.push("");
  lines.push("> Momentum-proxy (positiv " + "lookback-avkastning, topp 2) ersätter LLM:ens case-urval.");
  lines.push("> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, 5-dagars håll) – inte strategin som helhet.");
  lines.push("");
  lines.push("| Lookback | Stop | Mål | Veckor | Affärer | Träff % | Snittvinst | Snittförlust | PF | Kedjat % | Max DD | Mål/Stop/Rot |");
  lines.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of results){
    const p = r.params;
    lines.push(`| ${p.lookback}d | −${(p.stopPct * 100).toFixed(0)} % | +${(p.targetPct * 100).toFixed(0)} % | ${r.weeks} | ${r.trades} | ${r.winRate == null ? "–" : Math.round(r.winRate * 100)} % | ${f(r.avgWin)} % | ${f(r.avgLoss)} % | ${r.profitFactor === Infinity ? "∞" : (r.profitFactor == null ? "–" : r.profitFactor.toFixed(2))} | ${f(r.chainedPct)} % | −${r.maxDrawdownPct.toFixed(1)} % | ${(r.byReason["mål"] || 0) + (r.byReason["mål-gap"] || 0)}/${(r.byReason["stop"] || 0) + (r.byReason["stop-gap"] || 0)}/${r.byReason["rotation"] || 0} |`);
  }
  lines.push("");
  lines.push("**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför stop/mål-kombinationerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet).");
  lines.push("");
  lines.push("*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*");

  mkdirSync("reports/backtest", { recursive: true });
  const out = `reports/backtest/backtest-${ymd}-${market}.md`;
  writeFileSync(out, lines.join("\n") + "\n");
  console.log("\nSkrev " + out);
  console.log(lines.slice(6).join("\n"));
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
