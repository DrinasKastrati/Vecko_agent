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

/* Kör skelettet över universumet. candlesBySym = { SYM: candles[] }.

   TVÅ LÄGEN – skillnaden är hela poängen med den här filen:

   mode "weekly" (originalet): varje måndag byggs boken om från grunden, topN
     nya positioner öppnas, var och en hålls högst `holdDays` dagar. Det ger
     ~200 affärer/år. Mätningen 2026-08-02 visade att **46 % av alla exits i
     bästa cellen var femdagarsklockan** – varken mål eller stop, alltså full
     rundturskostnad för noll information.

   mode "hold" (den regel böckerna FAKTISKT kör sedan 2026-07-31): topN platser.
     En position behåller sin plats tills stop eller mål träffas, eller tills
     `maxHoldDays` löper ut. Måndagens rotation fyller bara TOMMA platser.
     Det är "BEHÅLL är standardvalet" uttryckt mekaniskt.

   Utan mode "hold" mätte backtestet en strategi som inte längre körs – och
   nivåbanden i prompterna är hämtade ur det gridet.

   params = { lookback, stopPct, targetPct, holdDays, maxHoldDays, topN, weight,
              costPct, mode }. */
export function backtestUniverse(candlesBySym, params){
  // costPct = rundturskostnad (courtage + spread) i PROCENT per affär, dras från
  // varje affärs utfall så att kedjat resultat är netto – annars ser en strategi
  // med 50 affärer/år mycket bättre ut än den är.
  const P = Object.assign({ lookback: 20, stopPct: 0.05, targetPct: 0.10, holdDays: 5,
    maxHoldDays: 30, topN: 2, weight: 0.5, costPct: 0, mode: "weekly" }, params);
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
  const trades = [];
  const weekStarts = [];
  for (let i = P.lookback + 1; i < refC.length; i++) if (isWeekStart(refC, i)) weekStarts.push(i);

  // Rangordnade kandidater en given vecka (momentum som platshållare för urval).
  const rankAt = date => {
    const ranked = [];
    for (const s of syms){
      const si = idxBySym[s].get(date);
      if (si == null) continue;
      const mom = momentumAt(candlesBySym[s], si, P.lookback);
      if (mom != null && mom > 0) ranked.push({ s, si, mom });
    }
    ranked.sort((a, b) => b.mom - a.mom);
    return ranked;
  };
  const openTrade = (p, date, holdCap) => {
    const tr = simulateTrade(candlesBySym[p.s], p.si, P.stopPct, P.targetPct, holdCap);
    if (!tr) return null;
    tr.grossPct = tr.retPct;
    tr.retPct = tr.retPct - P.costPct;               // netto efter courtage/spread
    const exitIdx = Math.min(p.si + tr.days - 1, candlesBySym[p.s].length - 1);
    tr.exitDate = candlesBySym[p.s][exitIdx].d;
    return Object.assign({ sym: p.s, date }, tr);
  };

  if (P.mode === "hold"){
    // topN platser; en position behåller sin plats tills den stängts.
    const slots = new Array(P.topN).fill(null);   // null | { sym, exitDate }
    for (const i of weekStarts){
      const date = refC[i].d;
      for (let k = 0; k < slots.length; k++)       // frigör stängda platser
        if (slots[k] && slots[k].exitDate < date) slots[k] = null;
      const free = slots.reduce((n, s) => n + (s ? 0 : 1), 0);
      if (!free) continue;                          // allt upptaget = ingen omsättning
      const held = new Set(slots.filter(Boolean).map(s => s.sym));
      const picks = rankAt(date).filter(p => !held.has(p.s)).slice(0, free);
      for (const p of picks){
        const tr = openTrade(p, date, P.maxHoldDays);
        if (!tr) continue;
        trades.push(tr);
        const k = slots.indexOf(null);
        if (k >= 0) slots[k] = { sym: tr.sym, exitDate: tr.exitDate };
      }
    }
  } else {
    // originalet: boken byggs om varje vecka, allt hålls högst holdDays
    for (const i of weekStarts){
      const date = refC[i].d;
      for (const p of rankAt(date).slice(0, P.topN)){
        const tr = openTrade(p, date, P.holdDays);
        if (tr) trades.push(tr);
      }
    }
  }

  /* Kedjning per STÄNGD affär i exit-ordning, inte per vecka. Med läget "hold"
     kan en position spänna över flera veckor – en veckovis kedja skulle då
     antingen dubbelräkna eller tappa den. Samma metod används för båda lägena
     så jämförelsen är intern konsistent. */
  trades.sort((a, b) => String(a.exitDate).localeCompare(String(b.exitDate)) || String(a.date).localeCompare(String(b.date)));
  const pcts = trades.map(t => t.retPct);
  const wins = pcts.filter(p => p > 0), losses = pcts.filter(p => p < 0);
  let chain = 1, peak = 1, maxDd = 0;
  for (const t of trades){
    chain *= 1 + P.weight * t.retPct / 100;
    if (chain > peak) peak = chain;
    const dd = 1 - chain / peak; if (dd > maxDd) maxDd = dd;
  }
  const weekly = weekStarts;   // behålls bara för veckoräkningen i rapporten
  const sum = a => a.reduce((x, y) => x + y, 0);
  const byReason = {};
  trades.forEach(t => byReason[t.reason] = (byReason[t.reason] || 0) + 1);
  const years = weekly.length / 52;
  return {
    params: P, weeks: weekly.length, trades: trades.length,
    // Omsättningstakten är den enskilt största kostnaden – redovisa den explicit
    // i stället för att låta läsaren räkna ut den ur affärsantalet.
    tradesPerYear: years > 0 ? trades.length / years : null,
    avgHoldDays: trades.length ? sum(trades.map(t => t.days)) / trades.length : null,
    costDragPctPerYear: years > 0 ? (trades.length / years) * P.costPct * P.weight : null,
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
  // Antal samtidiga positioner. Strategin gick 2026-07-31 från 2 à 50 % till 4 à 25 %, men
  // gridet simulerade fortfarande 2 – och det är ur det gridet stoppbanden i prompterna är
  // hämtade. Vikten följer positionsantalet (4 positioner ⇒ 0,25), så kedjningen och
  // kostnadsdraget per affär blir jämförbara med hur boken faktiskt handlas.
  const topN = Math.max(1, Number(process.argv[4]) || 4);
  const weight = 1 / topN;
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

  // Transaktionskostnad ur config/kostnader.json (rundtur i procent per affär).
  let costPct = 0;
  try {
    const c = JSON.parse(readFileSync("config/kostnader.json", "utf8"));
    const b = market === "us" ? c.us : c.nordic;
    costPct = (Number(b.roundTripPct) || 0) + (Number(b.fxSpreadPct) || 0);
  } catch { console.log("Ingen config/kostnader.json – räknar brutto."); }

  /* Gridet körs i BÅDA lägena. "weekly" är originalet (boken byggs om varje
     måndag, 5 dagars håll); "hold" är den regel böckerna faktiskt kör sedan
     2026-07-31 (platsen behålls tills stop/mål eller horisonten löper ut,
     rotationen fyller bara tomma platser). maxHoldDays = 30 handelsdagar ≈ 6
     veckor, den längsta katalysatorhorisonten i prompterna.

     Stoppbanden i prompterna är hämtade ur "weekly"-gridet. Om rangordningen
     mellan cellerna skiljer sig mellan lägena är de banden en artefakt av
     femdagarsklockan, inte en egenskap hos marknaden. */
  const grid = [];
  for (const mode of ["weekly", "hold"])
    for (const lookback of [10, 20])
      for (const [stopPct, targetPct] of [[0.03, 0.06], [0.04, 0.08], [0.05, 0.10]])
        grid.push({ lookback, stopPct, targetPct, costPct, topN, weight, mode, maxHoldDays: 30 });

  const results = grid.map(p => backtestUniverse(candlesBySym, p)).filter(Boolean);
  const bh = buyHoldPct(benchCandles);
  const f = n => n == null ? "–" : (n > 0 ? "+" : "") + n.toFixed(2);

  // Filnamn och rapportdatum MÅSTE komma ur samma tidszon. Tidigare byggdes ymd av lokala
  // komponenter medan headern skrev toISOString() (UTC), så en körning strax efter lokal
  // midnatt gav en fil vid namn 260802 med "Datum: 2026-08-01" i rubriken.
  const today = new Date();
  const yyyy = String(today.getFullYear()), mm = String(today.getMonth() + 1).padStart(2, "0"),
        dd = String(today.getDate()).padStart(2, "0");
  const ymd = yyyy.slice(2) + mm + dd;
  const todayISO = `${yyyy}-${mm}-${dd}`;
  const lines = [];
  lines.push(`# Backtest av mekaniska skelettet – ${market} (${range})`);
  lines.push(`**Datum:** ${todayISO} | **Universum:** ${syms.length} symboler | **Positioner:** ${topN} à ${(weight * 100).toFixed(0)} % | **Benchmark (${bench}) köp-och-behåll:** ${f(bh)} % | **Transaktionskostnad:** ${costPct.toFixed(2)} % per affär (netto)`);
  lines.push("");
  lines.push("> Momentum-proxy (positiv " + "lookback-avkastning, topp 2) ersätter LLM:ens case-urval.");
  lines.push("> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, hållregel) – inte strategin som helhet.");
  lines.push("> **VECKOVIS** = boken byggs om varje måndag, max 5 dagars håll (originalet).");
  lines.push("> **BEHÅLL** = platsen behålls tills stop/mål eller 30 handelsdagar; rotationen fyller bara tomma platser (regeln böckerna kör sedan 2026-07-31).");
  lines.push("> Kedjningen sker per stängd affär i exit-ordning, viktad – samma metod i båda lägena.");
  lines.push("");
  const row = r => {
    const p = r.params;
    const mal = (r.byReason["mål"] || 0) + (r.byReason["mål-gap"] || 0);
    const stp = (r.byReason["stop"] || 0) + (r.byReason["stop-gap"] || 0);
    const rot = r.byReason["rotation"] || 0;
    return `| ${p.mode === "hold" ? "BEHÅLL" : "veckovis"} | ${p.lookback}d | −${(p.stopPct * 100).toFixed(0)} % | +${(p.targetPct * 100).toFixed(0)} % | ${r.trades} | ${r.tradesPerYear == null ? "–" : Math.round(r.tradesPerYear)} | ${r.avgHoldDays == null ? "–" : r.avgHoldDays.toFixed(1)} | ${r.winRate == null ? "–" : Math.round(r.winRate * 100)} % | ${r.profitFactor === Infinity ? "∞" : (r.profitFactor == null ? "–" : r.profitFactor.toFixed(2))} | ${f(r.chainedPct)} % | −${r.maxDrawdownPct.toFixed(1)} % | ${mal}/${stp}/${rot} |`;
  };
  lines.push("| Läge | Lookback | Stop | Mål | Affärer | Aff./år | Snitt dagar | Träff % | PF | Kedjat % | Max DD | Mål/Stop/Tid |");
  lines.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const r of results.filter(x => x.params.mode === "weekly")) lines.push(row(r));
  for (const r of results.filter(x => x.params.mode === "hold")) lines.push(row(r));
  lines.push("");
  // Direkt jämförelse cell för cell – den avgör om hållregeln faktiskt hjälper.
  const ckey = r => `${r.params.lookback}/${r.params.stopPct}/${r.params.targetPct}`;
  const wkMap = new Map(results.filter(x => x.params.mode === "weekly").map(r => [ckey(r), r]));
  lines.push("**Hållregelns effekt, cell för cell:**");
  lines.push("");
  lines.push("| Cell | PF veckovis → BEHÅLL | Kedjat % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |");
  lines.push("|---|---|---|---|");
  for (const h of results.filter(x => x.params.mode === "hold")){
    const w = wkMap.get(ckey(h)); if (!w) continue;
    const pf = n => n === Infinity ? "∞" : (n == null ? "–" : n.toFixed(2));
    lines.push(`| ${h.params.lookback}d −${(h.params.stopPct * 100).toFixed(0)}/+${(h.params.targetPct * 100).toFixed(0)} % | ${pf(w.profitFactor)} → **${pf(h.profitFactor)}** | ${f(w.chainedPct)} → **${f(h.chainedPct)}** | ${Math.round(w.tradesPerYear)} → **${Math.round(h.tradesPerYear)}** |`);
  }
  lines.push("");
  lines.push("**Tolkning:** kedjat % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.**");
  lines.push("");
  lines.push("*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*");

  mkdirSync("reports/backtest", { recursive: true });
  const out = `reports/backtest/backtest-${ymd}-${market}-top${topN}.md`;
  writeFileSync(out, lines.join("\n") + "\n");
  console.log("\nSkrev " + out);
  console.log(lines.slice(6).join("\n"));
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
