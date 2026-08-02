#!/usr/bin/env node
/* ============================================================
   Backtest av det MEKANISKA skelettet i rotationsstrategin:
   veckorotation (måndag), topp N av universum, stop/mål i procent,
   likaviktat. LLM-omdömet (case-urval på katalysatorer) ersätts av en
   momentum-proxy – så resultatet validerar RAMVERKET (rotationstakt,
   stop-/målnivåer, hålltid), INTE strategin som helhet.

   Kör:  node .github/scripts/backtest.mjs nordic   (eller: us)
         node .github/scripts/backtest.mjs us 5y    (range, default 2y)
         node .github/scripts/backtest.mjs us 5y 4  (antal positioner)
   Skriver reports/backtest/backtest-yymmdd-<marknad>-top<N>.md
   Kräver nätåtkomst (Yahoo chart-API) – kör på din dator eller i en Action.

   OMBYGGT 2026-08-02 (sex mätfel som gjorde tidigare grid missvisande):

   1. INDEXSLEEVEN MODELLERAS. Böckerna parkerar oallokerat kapital i en
      indexsleeve, men den gamla kedjningen multiplicerade bara ihop STÄNGDA
      affärer i exit-ordning: en tom plats bidrog med noll, fast den live
      ligger i sleeven och följer index. Motorn räknar nu en DAGLIG
      equity-kurva på en gemensam datumaxel där varje plats antingen håller
      en aktie eller sleeven. Det ger också en ärlig max drawdown (den gamla
      mättes på affärskedjan, som saknar tidsaxel).
   2. LOOKBACK-FÖNSTRET SVEPS. Gamla gridet testade bara 10 och 20 dagar –
      kortsiktig reversal-horisont, inte momentum. Nu 10/20/60/120 dagar,
      plus `skip` (hoppa över de senaste N dagarna) som är standard i
      momentum-litteraturen.
   3. OUT-OF-SAMPLE. Nivåbanden i prompterna valdes ur den bästa av 24 celler
      på HELA perioden – urvalsbrus går inte att skilja från signal så.
      Perioden delas nu i två halvor: bästa cellen väljs på första halvan och
      MÄTS på andra, mot medianen av alla celler i samma halva.
   4. SURVIVORSHIP BIAS redovisas explicit i rapporten. Universumfilerna är
      dagens mest likvida namn – de innehåller överlevare per konstruktion,
      vilket gör resultaten för BRA, inte för dåliga.
   5. REGIMFILTER. Nya positioner kan kräva att benchmark ligger över sitt
      glidande medelvärde; annars stannar kapitalet i sleeven.
   6. HÅLLTIDEN SVEPS. `maxHoldDays` var hårdkodad till 30 i gridet.
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

/* Momentum över `lookback` handelsdagar fram till index i (exklusive dag i).
   `skip` hoppar över de senaste `skip` dagarna före i – standard i
   momentum-litteraturen, där den senaste månaden utelämnas eftersom den
   domineras av kortsiktig reversal. skip=0 ger exakt gamla beteendet. */
export function momentumAt(candles, i, lookback, skip = 0){
  const end = i - 1 - skip;          // sista dag som räknas in
  const j = end - lookback + 1;      // basdag
  if (i < 1 || end < 1 || j < 0) return null;
  const base = candles[j].c, now = candles[end].c;
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

// Glidande medelvärde över en talserie; out[i] = medel av de n senaste (null före).
export function smaSeries(values, n){
  const out = new Array(values.length).fill(null);
  if (!(n > 0)) return out;
  let sum = 0;
  for (let i = 0; i < values.length; i++){
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

/* För varje datum i `dates`: index i `candles` för SENASTE candle vars datum
   är <= datumet, annars -1. Behövs för att lägga bench (sleeve/regim) på samma
   axel som aktierna trots att börserna har olika helgdagar. */
export function alignIndex(candles, dates){
  const out = new Array(dates.length).fill(-1);
  if (!candles || !candles.length) return out;
  let k = -1;
  for (let i = 0; i < dates.length; i++){
    while (k + 1 < candles.length && candles[k + 1].d <= dates[i]) k++;
    out[i] = k;
  }
  return out;
}

/* Simulerar EN position: entry på öppning dag i, stop/mål i %, max `holdDays`
   handelsdagar, konservativt (stop före mål om båda nås samma dag; gap ger
   gap-kurs). Returnerar även entryIdx/exitIdx/entryPrice/exitPrice så att
   equity-kurvan kan räknas dag för dag. */
export function simulateTrade(candles, i, stopPct, targetPct, holdDays){
  const entry = candles[i].o;
  if (!entry) return null;
  const stop = entry * (1 - stopPct), target = entry * (1 + targetPct);
  const last = Math.min(i + holdDays - 1, candles.length - 1);
  const done = (j, px, reason) => ({
    retPct: (px / entry - 1) * 100, reason, days: j - i + 1,
    entryIdx: i, entryPrice: entry, exitIdx: j, exitPrice: px
  });
  for (let j = i; j <= last; j++){
    const day = candles[j];
    if (day.o <= stop)   return done(j, day.o, "stop-gap");
    if (day.l <= stop)   return done(j, stop, "stop");
    if (day.o >= target) return done(j, day.o, "mål-gap");
    if (day.h >= target) return done(j, target, "mål");
  }
  return done(last, candles[last].c, "rotation");
}

/* Dagliga avkastningar för en affär: [{ d, ret }] från entry- till exitdagen.
   Produkten av (1+ret) är exakt exitPrice/entryPrice – ingen approximation. */
export function tradeDailyReturns(candles, tr){
  const out = [];
  for (let j = tr.entryIdx; j <= tr.exitIdx; j++){
    const prev = j === tr.entryIdx ? tr.entryPrice : candles[j - 1].c;
    const px   = j === tr.exitIdx  ? tr.exitPrice  : candles[j].c;
    if (!prev) continue;
    out.push({ d: candles[j].d, ret: px / prev - 1 });
  }
  return out;
}

// Skär ut ett datumintervall ur { SYM: candles[] } (för out-of-sample-delning).
export function sliceCandles(bySym, from, to){
  const out = {};
  for (const s of Object.keys(bySym || {}))
    out[s] = (bySym[s] || []).filter(c => (!from || c.d >= from) && (!to || c.d <= to));
  return out;
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

   RESULTATET REDOVISAS PÅ TVÅ SÄTT:
     equityPct    – daglig equity-kurva. Tom plats ligger i indexsleeven om
                    `sleeve` är på. Det här är talet som ska jämföras med
                    benchmark, för det är så böckerna faktiskt är investerade.
     chainedPct   – gamla måttet: affärskedja i exit-ordning, tom plats = noll.
                    Behålls för att äldre rapporter ska gå att jämföra med.

   params = { lookback, skip, stopPct, targetPct, holdDays, maxHoldDays, topN,
              weight, costPct, mode, benchCandles, sleeve, regimeMa }. */
export function backtestUniverse(candlesBySym, params){
  // costPct = rundturskostnad (courtage + spread) i PROCENT per affär, dras från
  // varje affärs utfall så att redovisat resultat är netto – annars ser en strategi
  // med 50 affärer/år mycket bättre ut än den är.
  const P = Object.assign({ lookback: 20, skip: 0, stopPct: 0.05, targetPct: 0.10, holdDays: 5,
    maxHoldDays: 30, topN: 2, weight: 0.5, costPct: 0, mode: "weekly",
    benchCandles: null, sleeve: false, regimeMa: 0 }, params);
  const syms = Object.keys(candlesBySym).filter(s => (candlesBySym[s] || []).length > P.lookback + P.skip + 10);
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
  for (let i = P.lookback + P.skip + 1; i < refC.length; i++) if (isWeekStart(refC, i)) weekStarts.push(i);
  if (!weekStarts.length) return null;

  /* Regimfilter: nya positioner öppnas bara när bench ligger över sitt
     glidande medel. Kapitalet stannar annars i sleeven. Beräknas på bench
     EGEN axel och slås sedan upp per datum, så olika helgdagar inte ger fel. */
  const bench = P.benchCandles && P.benchCandles.length ? P.benchCandles : null;
  const benchSma = bench && P.regimeMa > 0 ? smaSeries(bench.map(c => c.c), P.regimeMa) : null;
  const benchIdxByDate = new Map();
  if (bench) bench.forEach((c, i) => benchIdxByDate.set(c.d, i));
  const benchAt = date => {           // senaste bench-index <= date
    if (!bench) return -1;
    if (benchIdxByDate.has(date)) return benchIdxByDate.get(date);
    let lo = 0, hi = bench.length - 1, res = -1;
    while (lo <= hi){ const m = (lo + hi) >> 1; if (bench[m].d <= date){ res = m; lo = m + 1; } else hi = m - 1; }
    return res;
  };
  const regimeOk = date => {
    if (!benchSma) return true;
    const bi = benchAt(date);
    if (bi < 0 || benchSma[bi] == null) return true;   // saknas underlag = blockera inte
    return bench[bi].c > benchSma[bi];
  };

  // Rangordnade kandidater en given vecka (momentum som platshållare för urval).
  const rankAt = date => {
    const ranked = [];
    for (const s of syms){
      const si = idxBySym[s].get(date);
      if (si == null) continue;
      const mom = momentumAt(candlesBySym[s], si, P.lookback, P.skip);
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
    tr.exitDate = candlesBySym[p.s][tr.exitIdx].d;
    tr.entryDate = candlesBySym[p.s][tr.entryIdx].d;
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
      if (!regimeOk(date)) continue;                // regimen av = kapitalet ligger kvar i sleeven
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
      if (!regimeOk(date)) continue;
      for (const p of rankAt(date).slice(0, P.topN)){
        const tr = openTrade(p, date, P.holdDays);
        if (tr) trades.push(tr);
      }
    }
  }

  /* ---- DAGLIG EQUITY-KURVA -------------------------------------------------
     Gemensam axel = unionen av alla handelsdatum från strategistart och framåt
     (börserna i ett nordiskt universum har olika helgdagar; en axel från EN
     symbol skulle tappa dagar). Varje plats bidrar med sin vikt: håller den en
     aktie används aktiens dagsavkastning, annars sleevens. Rundturskostnaden
     dras på exitdagen. Det här är den enda punkt där tom tid får ett värde –
     och det är hela poängen: live ligger den tiden i indexsleeven. */
  const startDate = refC[weekStarts[0]].d;
  const axisSet = new Set();
  for (const s of syms) for (const c of candlesBySym[s]) if (c.d >= startDate) axisSet.add(c.d);
  if (bench) for (const c of bench) if (c.d >= startDate) axisSet.add(c.d);
  const axis = Array.from(axisSet).sort();
  const axisPos = new Map(axis.map((d, i) => [d, i]));

  const stockRet = new Float64Array(axis.length);   // viktad aktieavkastning per dag
  const occupied = new Int32Array(axis.length);     // antal upptagna platser per dag
  for (const t of trades){
    for (const { d, ret } of tradeDailyReturns(candlesBySym[t.sym], t)){
      const k = axisPos.get(d); if (k == null) continue;
      stockRet[k] += P.weight * ret;
    }
    // kostnaden tas på exitdagen så equity och affärsnetto säger samma sak
    const ke = axisPos.get(t.exitDate);
    if (ke != null) stockRet[ke] -= P.weight * P.costPct / 100;
    // upptagen plats gäller HELA innehavsperioden, även dagar då just den
    // börsen var stängd – annars skulle sleeven felaktigt få de dagarna
    const a = axisPos.get(t.entryDate), b = axisPos.get(t.exitDate);
    if (a != null && b != null) for (let k = a; k <= b; k++) occupied[k]++;
  }

  /* Diagnostik: sleevens EGET bidrag, och vad benchmark gjorde under just de
     dagar då kapital stod ledigt. Utan de två talen går det inte att skilja
     "sleeven är felkopplad" från "platserna stod tomma just när index föll" –
     och de kräver helt olika åtgärder. idleBenchPct räknas oavsett om sleeven
     är på, så av/på-jämförelsen kan tolkas. */
  const benchAlign = bench ? alignIndex(bench, axis) : null;
  let equity = 1, eqPeak = 1, eqMaxDd = 0;
  let sleeveChain = 1, idleBenchChain = 1, idleDays = 0;
  // Loopen börjar på k=0: axis[0] är strategins FÖRSTA dag och positioner som
  // öppnas den dagen har sin entry-dagsavkastning i stockRet[0]. Sleeven kräver
  // en föregående dag att mäta mot och hoppar därför över k=0.
  for (let k = 0; k < axis.length; k++){
    let r = stockRet[k];
    const idle = Math.max(0, P.topN - occupied[k]);
    if (k > 0 && idle > 0 && benchAlign){
      const bi = benchAlign[k], bp = benchAlign[k - 1];
      if (bi > 0 && bp >= 0 && bi !== bp && bench[bp].c){
        const br = bench[bi].c / bench[bp].c - 1;
        if (P.sleeve){ r += idle * P.weight * br; sleeveChain *= 1 + idle * P.weight * br; }
        idleBenchChain *= 1 + br;
        idleDays++;
      }
    }
    equity *= 1 + r;
    if (equity > eqPeak) eqPeak = equity;
    const dd = 1 - equity / eqPeak; if (dd > eqMaxDd) eqMaxDd = dd;
  }

  /* ---- gamla affärskedjan (behålls för jämförbarhet med äldre rapporter) --- */
  trades.sort((a, b) => String(a.exitDate).localeCompare(String(b.exitDate)) || String(a.date).localeCompare(String(b.date)));
  const pcts = trades.map(t => t.retPct);
  const wins = pcts.filter(p => p > 0), losses = pcts.filter(p => p < 0);
  let chain = 1, peak = 1, maxDd = 0;
  for (const t of trades){
    chain *= 1 + P.weight * t.retPct / 100;
    if (chain > peak) peak = chain;
    const dd = 1 - chain / peak; if (dd > maxDd) maxDd = dd;
  }
  const sum = a => a.reduce((x, y) => x + y, 0);
  const byReason = {};
  trades.forEach(t => byReason[t.reason] = (byReason[t.reason] || 0) + 1);
  // År räknas ur den faktiska kalenderspannen, inte veckor/52 – annars blir
  // affärer/år fel så fort perioden delas (out-of-sample) eller har luckor.
  const spanDays = axis.length > 1 ? (Date.parse(axis[axis.length - 1]) - Date.parse(axis[0])) / 86400e3 : 0;
  const years = spanDays / 365.25;
  // Andel av tiden som kapitalet faktiskt stod i aktier (resten låg i sleeven).
  let occSum = 0; for (let k = 0; k < axis.length; k++) occSum += occupied[k];
  return {
    params: P, weeks: weekStarts.length, trades: trades.length,
    from: axis[0] || null, to: axis[axis.length - 1] || null, years,
    // Omsättningstakten är den enskilt största kostnaden – redovisa den explicit
    // i stället för att låta läsaren räkna ut den ur affärsantalet.
    tradesPerYear: years > 0 ? trades.length / years : null,
    avgHoldDays: trades.length ? sum(trades.map(t => t.days)) / trades.length : null,
    costDragPctPerYear: years > 0 ? (trades.length / years) * P.costPct * P.weight : null,
    exposurePct: axis.length ? (occSum / (axis.length * P.topN)) * 100 : null,
    winRate: trades.length ? wins.length / trades.length : null,
    avgWin: wins.length ? sum(wins) / wins.length : null,
    avgLoss: losses.length ? sum(losses) / losses.length : null,
    profitFactor: losses.length ? Math.abs(sum(wins) / sum(losses)) : (wins.length ? Infinity : null),
    equityPct: (equity - 1) * 100,
    equityMaxDdPct: eqMaxDd * 100,
    // sleevens eget bidrag, och benchmarks utveckling under de lediga dagarna
    sleeveContribPct: P.sleeve ? (sleeveChain - 1) * 100 : 0,
    idleBenchPct: idleDays ? (idleBenchChain - 1) * 100 : null,
    idleDays,
    chainedPct: (chain - 1) * 100,
    maxDrawdownPct: eqMaxDd * 100,     // ärlig DD: mätt på equity-kurvan, inte affärskedjan
    tradeMaxDdPct: maxDd * 100,
    byReason
  };
}

export function buyHoldPct(candles){
  if (!candles || candles.length < 2) return null;
  return (candles[candles.length - 1].c / candles[0].c - 1) * 100;
}

// Köp-och-behåll mellan två datum (för out-of-sample-halvornas benchmark).
export function buyHoldBetween(candles, from, to){
  const seg = (candles || []).filter(c => (!from || c.d >= from) && (!to || c.d <= to));
  return buyHoldPct(seg);
}

/* Vad sleeven SKULLE ha gett om den lediga tiden legat jämnt fördelad över
   perioden: benchmarks totalavkastning upphöjt till andelen ledig tid.
   Facit att jämföra `sleeveContribPct` mot – ligger utfallet långt under är
   den lediga tiden koncentrerad till svaga perioder (platser blir tomma när
   positioner stoppas ut, och det sker i nedgångar). */
export function sleeveNeutralPct(benchTotalPct, idleShare){
  if (benchTotalPct == null || !(idleShare >= 0)) return null;
  const g = 1 + benchTotalPct / 100;
  if (g <= 0) return null;
  return (Math.pow(g, idleShare) - 1) * 100;
}

export function median(nums){
  const a = nums.filter(n => n != null && !isNaN(n)).slice().sort((x, y) => x - y);
  if (!a.length) return null;
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
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
  const benchSym = market === "us" ? "^GSPC" : "^OMX";
  if (!existsSync(uniFile)){ console.error("Saknar " + uniFile); process.exit(1); }
  const syms = readFileSync(uniFile, "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));

  console.log(`Hämtar ${syms.length} symboler (${range})…`);
  const candlesBySym = {};
  for (const s of syms){
    candlesBySym[s] = await fetchCandles(s, range);
    console.log("  " + s + ": " + candlesBySym[s].length + " dagar");
    await new Promise(r => setTimeout(r, 400)); // artigt tempo mot Yahoo
  }
  const benchCandles = await fetchCandles(benchSym, range);
  if (!benchCandles.length) console.log("VARNING: benchmark " + benchSym + " kunde inte hämtas – sleeve och regimfilter blir verkningslösa.");

  // Transaktionskostnad ur config/kostnader.json (rundtur i procent per affär).
  let costPct = 0;
  try {
    const c = JSON.parse(readFileSync("config/kostnader.json", "utf8"));
    const b = market === "us" ? c.us : c.nordic;
    costPct = (Number(b.roundTripPct) || 0) + (Number(b.fxSpreadPct) || 0);
  } catch { console.log("Ingen config/kostnader.json – räknar brutto."); }

  /* Basfall = så böckerna FAKTISKT handlas efter omkalibreringen 2026-08-02:
     hållregeln, 30 handelsdagars horisont, sleeven på, inget regimfilter.
     Nivåerna är de som står i respektive prompt. Alla svep nedan varierar EN
     dimension i taget från det här fallet – det är läsbart, och det undviker
     att en "bästa cell" plockas ur ett stort kors (se punkt 3 i filhuvudet). */
  const LEVELS = [[0.03, 0.06], [0.04, 0.08], [0.05, 0.10]];
  const baseLevel = market === "us" ? [0.05, 0.10] : [0.04, 0.08];
  const COMMON = { topN, weight, costPct, benchCandles, sleeve: true, maxHoldDays: 30, regimeMa: 0 };
  const BASE = Object.assign({}, COMMON, { mode: "hold", lookback: 20, skip: 0,
    stopPct: baseLevel[0], targetPct: baseLevel[1] });

  const run = (over, data = candlesBySym, bench = benchCandles) =>
    backtestUniverse(data, Object.assign({}, BASE, { benchCandles: bench }, over));

  const LOOKBACKS = [10, 20, 60, 120];

  // --- svep 1: huvudgrid, läge × lookback × nivåer -------------------------
  const grid = [];
  for (const mode of ["weekly", "hold"])
    for (const lookback of LOOKBACKS)
      for (const [stopPct, targetPct] of LEVELS)
        grid.push({ mode, lookback, stopPct, targetPct });
  const results = grid.map(p => run(p)).filter(Boolean);

  // --- svep 2: skip (momentum-litteraturens hoppfönster) -------------------
  const skipRuns = [];
  for (const lookback of [60, 120])
    for (const skip of [0, 20])
      skipRuns.push(run({ lookback, skip }));

  // --- svep 3: hålltid ------------------------------------------------------
  const holdRuns = [20, 30, 60, 90].map(maxHoldDays => run({ maxHoldDays }));

  // --- svep 4: regimfilter --------------------------------------------------
  const regimeRuns = [0, 100, 200].map(regimeMa => run({ regimeMa }));

  // --- svep 5: sleevens effekt (mätfel 1, kvantifierat) --------------------
  const sleeveOff = run({ sleeve: false }), sleeveOn = run({ sleeve: true });

  /* --- svep 6: out-of-sample ------------------------------------------------
     Perioden delas på mitten. Bästa cellen ur huvudgridet väljs på FÖRSTA
     halvan och mäts sedan på ANDRA, mot medianen av alla celler i samma halva.
     Slår den valda cellen inte medianen är "bästa cellen" urvalsbrus. */
  const allDates = new Set();
  for (const s of Object.keys(candlesBySym)) for (const c of candlesBySym[s]) allDates.add(c.d);
  const dates = Array.from(allDates).sort();
  const mid = dates[Math.floor(dates.length / 2)];
  const inA = sliceCandles(candlesBySym, null, mid), inB = sliceCandles(candlesBySym, mid, null);
  const benchA = benchCandles.filter(c => c.d <= mid), benchB = benchCandles.filter(c => c.d >= mid);
  const gridA = grid.map(p => run(p, inA, benchA)).filter(Boolean);
  const gridB = grid.map(p => run(p, inB, benchB)).filter(Boolean);
  const cellKey = p => `${p.mode}/${p.lookback}/${p.stopPct}/${p.targetPct}`;
  const bestA = gridA.slice().sort((a, b) => b.equityPct - a.equityPct)[0] || null;
  const bMap = new Map(gridB.map(r => [cellKey(r.params), r]));
  const bestAinB = bestA ? bMap.get(cellKey(bestA.params)) : null;
  const medB = median(gridB.map(r => r.equityPct));

  const bh = buyHoldPct(benchCandles);
  const bhA = buyHoldBetween(benchCandles, null, mid), bhB = buyHoldBetween(benchCandles, mid, null);
  const f = n => n == null ? "–" : (n > 0 ? "+" : "") + n.toFixed(2);
  const pf = n => n === Infinity ? "∞" : (n == null ? "–" : n.toFixed(2));
  const pct = n => n == null ? "–" : n.toFixed(0) + " %";

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
  lines.push(`**Datum:** ${todayISO} | **Universum:** ${syms.length} symboler | **Positioner:** ${topN} à ${(weight * 100).toFixed(0)} % | **Benchmark (${benchSym}) köp-och-behåll:** ${f(bh)} % | **Transaktionskostnad:** ${costPct.toFixed(2)} % per affär (netto)`);
  lines.push("");
  lines.push("> Momentum-proxy (positiv lookback-avkastning, topp N) ersätter LLM:ens case-urval.");
  lines.push("> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, hållregel) – inte strategin som helhet.");
  lines.push("> **VECKOVIS** = boken byggs om varje måndag, max 5 dagars håll (originalet).");
  lines.push("> **BEHÅLL** = platsen behålls tills stop/mål eller horisonten löper ut; rotationen fyller bara tomma platser (regeln böckerna kör sedan 2026-07-31).");
  lines.push("> **Equity %** är en DAGLIG kurva där tomma platser ligger i indexsleeven – jämför den med benchmark. **Kedjat %** är det gamla måttet (affärskedja, tom tid = noll) och finns kvar för att äldre rapporter ska gå att jämföra med.");
  lines.push("> **Max DD** mäts numera på equity-kurvan, inte på affärskedjan.");
  lines.push("");
  lines.push("> ⚠️ **SURVIVORSHIP BIAS:** universumfilen innehåller dagens mest likvida namn. Bolag som avnoterats, kraschat eller tappat likviditet under perioden saknas, och dagens vinnare är med just för att de vann. Det gör ALLA tal nedan för BRA, inte för dåliga – en cell som inte slår benchmark här skulle sannolikt gå ännu sämre mot ett punkt-i-tiden-universum.");
  lines.push("");

  const row = r => {
    const p = r.params;
    const mal = (r.byReason["mål"] || 0) + (r.byReason["mål-gap"] || 0);
    const stp = (r.byReason["stop"] || 0) + (r.byReason["stop-gap"] || 0);
    const rot = r.byReason["rotation"] || 0;
    return `| ${p.mode === "hold" ? "BEHÅLL" : "veckovis"} | ${p.lookback}d | −${(p.stopPct * 100).toFixed(0)} % | +${(p.targetPct * 100).toFixed(0)} % | ${r.trades} | ${Math.round(r.tradesPerYear)} | ${r.avgHoldDays == null ? "–" : r.avgHoldDays.toFixed(1)} | ${pct(r.exposurePct)} | ${r.winRate == null ? "–" : Math.round(r.winRate * 100)} % | ${pf(r.profitFactor)} | **${f(r.equityPct)} %** | ${f(r.chainedPct)} % | −${r.maxDrawdownPct.toFixed(1)} % | ${mal}/${stp}/${rot} |`;
  };
  const HEAD = "| Läge | Lookback | Stop | Mål | Affärer | Aff./år | Snitt dagar | Investerad | Träff % | PF | Equity % | Kedjat % | Max DD | Mål/Stop/Tid |";
  const SEP  = "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|";

  lines.push("## 1. Huvudgrid – läge × lookback × nivåer");
  lines.push("");
  lines.push(HEAD); lines.push(SEP);
  for (const r of results.filter(x => x.params.mode === "weekly")) lines.push(row(r));
  for (const r of results.filter(x => x.params.mode === "hold")) lines.push(row(r));
  lines.push("");

  // Direkt jämförelse cell för cell – den avgör om hållregeln faktiskt hjälper.
  const ckey = r => `${r.params.lookback}/${r.params.stopPct}/${r.params.targetPct}`;
  const wkMap = new Map(results.filter(x => x.params.mode === "weekly").map(r => [ckey(r), r]));
  lines.push("**Hållregelns effekt, cell för cell:**");
  lines.push("");
  lines.push("| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |");
  lines.push("|---|---|---|---|");
  for (const h of results.filter(x => x.params.mode === "hold")){
    const w = wkMap.get(ckey(h)); if (!w) continue;
    lines.push(`| ${h.params.lookback}d −${(h.params.stopPct * 100).toFixed(0)}/+${(h.params.targetPct * 100).toFixed(0)} % | ${pf(w.profitFactor)} → **${pf(h.profitFactor)}** | ${f(w.equityPct)} → **${f(h.equityPct)}** | ${Math.round(w.tradesPerYear)} → **${Math.round(h.tradesPerYear)}** |`);
  }
  lines.push("");

  lines.push("## 2. Lookback-fönstret (mätfel 2)");
  lines.push("");
  lines.push("Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.");
  lines.push("");
  lines.push("| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const r of [...LOOKBACKS.map(lookback => run({ lookback })), ...skipRuns.filter(r => r && r.params.skip > 0)]){
    if (!r) continue;
    lines.push(`| ${r.params.lookback}d | ${r.params.skip}d | ${Math.round(r.tradesPerYear)} | ${pct(r.exposurePct)} | ${Math.round(r.winRate * 100)} % | ${pf(r.profitFactor)} | **${f(r.equityPct)} %** | −${r.maxDrawdownPct.toFixed(1)} % |`);
  }
  lines.push("");

  lines.push("## 3. Indexsleeven (mätfel 1)");
  lines.push("");
  lines.push("Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.");
  lines.push("");
  lines.push("| Sleeve | Investerad i aktier | Equity % | Max DD |");
  lines.push("|---|---|---|---|");
  if (sleeveOff) lines.push(`| av (gammalt mätsätt) | ${pct(sleeveOff.exposurePct)} | ${f(sleeveOff.equityPct)} % | −${sleeveOff.maxDrawdownPct.toFixed(1)} % |`);
  if (sleeveOn)  lines.push(`| **på (så böckerna handlas)** | ${pct(sleeveOn.exposurePct)} | **${f(sleeveOn.equityPct)} %** | −${sleeveOn.maxDrawdownPct.toFixed(1)} % |`);
  lines.push("");
  if (sleeveOn){
    const idleShare = 1 - sleeveOn.exposurePct / 100;
    const neutral = sleeveNeutralPct(bh, idleShare);
    lines.push(`Kapitalet stod ledigt ${(idleShare * 100).toFixed(0)} % av tiden, fördelat på ${sleeveOn.idleDays} dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **${f(neutral)} %** (${benchSym} totalt ${f(bh)} % upphöjt till andelen ledig tid). Den gav **${f(sleeveOn.sleeveContribPct)} %**.`);
    lines.push("");
    /* Skillnaden mellan utfall och neutralt facit är hela tolkningen. Talet
       idleBenchPct nedan är OVIKTAT (varje ledig dag räknas lika) – det säger
       inget om timing i sig, så det får inte tolkas som sleevens avkastning. */
    const svag = neutral != null && sleeveOn.sleeveContribPct < neutral * 0.5;
    lines.push(svag
      ? `**Den lediga tiden var koncentrerad till svaga perioder.** Platser blir tomma när positioner stoppas ut, och det sker i nedgångar – sleeven ligger alltså i index just när index är svagt. Sleeven lyfter därför mindre än andelen ledig tid antyder. Mätsättet är ändå rätt: felet var att räkna tom tid som noll.`
      : `Den lediga tiden låg ungefär jämnt fördelad, så sleeven lyfter resultatet i proportion till andelen ledigt kapital.`);
    if (sleeveOn.idleBenchPct != null)
      lines.push(`*(${benchSym} oviktat över samma dagar: ${f(sleeveOn.idleBenchPct)} % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*`);
    lines.push("");
  }

  lines.push("## 4. Hålltid och regimfilter (mätfel 5 och 6)");
  lines.push("");
  lines.push("| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |");
  lines.push("|---|---|---|---|---|---|");
  for (const r of holdRuns) if (r) lines.push(`| horisont ${r.params.maxHoldDays} dgr | ${Math.round(r.tradesPerYear)} | ${pct(r.exposurePct)} | ${pf(r.profitFactor)} | ${f(r.equityPct)} % | −${r.maxDrawdownPct.toFixed(1)} % |`);
  for (const r of regimeRuns) if (r) lines.push(`| regimfilter ${r.params.regimeMa ? "MA" + r.params.regimeMa : "av"} | ${Math.round(r.tradesPerYear)} | ${pct(r.exposurePct)} | ${pf(r.profitFactor)} | ${f(r.equityPct)} % | −${r.maxDrawdownPct.toFixed(1)} % |`);
  lines.push("");

  lines.push("## 5. Out-of-sample (mätfel 3)");
  lines.push("");
  lines.push(`Perioden delas vid **${mid}**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla ${gridB.length} celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.`);
  lines.push("");
  lines.push("| | Period | Benchmark | Vald cell | Median av alla celler |");
  lines.push("|---|---|---|---|---|");
  if (bestA) lines.push(`| In-sample | ${bestA.from} → ${bestA.to} | ${f(bhA)} % | ${f(bestA.equityPct)} % | ${f(median(gridA.map(r => r.equityPct)))} % |`);
  lines.push(`| **Out-of-sample** | ${mid} → ${dates[dates.length - 1]} | ${f(bhB)} % | **${bestAinB ? f(bestAinB.equityPct) : "–"} %** | ${f(medB)} % |`);
  lines.push("");
  if (bestA) lines.push(`Vald cell: **${bestA.params.mode === "hold" ? "BEHÅLL" : "veckovis"} ${bestA.params.lookback}d −${(bestA.params.stopPct * 100).toFixed(0)}/+${(bestA.params.targetPct * 100).toFixed(0)} %**.`);
  if (bestAinB && medB != null)
    lines.push(bestAinB.equityPct > medB
      ? "Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt."
      : "**Cellen slår INTE medianen out-of-sample.** Rangordningen från första halvan överlever inte – behandla nivåbanden som obekräftade och luta dig på riskreglerna i stället.");
  lines.push("");

  /* Nivåbandens stabilitet – den fråga prompterna faktiskt vilar på.
     Det räcker inte att veta vilken cell som vann totalt: frågan är om SAMMA
     stop/mål-nivå vinner i båda halvorna. Gör den inte det är "bästa nivån"
     en egenskap hos perioden, inte hos marknaden, och bandet i prompten ska
     inte skärpas. */
  const bestLevelIn = (rs, mode, lookback) => {
    const c = rs.filter(r => r.params.mode === mode && r.params.lookback === lookback);
    if (!c.length) return null;
    return c.slice().sort((a, b) => b.equityPct - a.equityPct)[0];
  };
  const lvl = r => r ? `−${(r.params.stopPct * 100).toFixed(0)}/+${(r.params.targetPct * 100).toFixed(0)} %` : "–";
  lines.push("**Håller nivåbandet i båda halvorna?**");
  lines.push("");
  lines.push("| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |");
  lines.push("|---|---|---|---|---|---|");
  let agree = 0, tot = 0;
  for (const mode of ["weekly", "hold"]) for (const lookback of LOOKBACKS){
    const a = bestLevelIn(gridA, mode, lookback), b = bestLevelIn(gridB, mode, lookback), w = bestLevelIn(results, mode, lookback);
    if (!a || !b) continue;
    tot++; const same = a.params.stopPct === b.params.stopPct; if (same) agree++;
    lines.push(`| ${mode === "hold" ? "BEHÅLL" : "veckovis"} | ${lookback}d | ${lvl(a)} | ${lvl(b)} | ${lvl(w)} | ${same ? "ja" : "**nej**"} |`);
  }
  lines.push("");
  lines.push(`Samma nivå vinner i båda halvorna i **${agree} av ${tot}** kombinationer.` + (agree * 2 >= tot
    ? " Nivåbandet är åtminstone svagt stabilt – men rangordningen inom bandet är fortfarande brus."
    : " **Nivåbandet är INTE stabilt.** Vilken stop/mål-nivå som ser bäst ut beror på vilken period som mäts. Behandla banden i prompterna som en riskregel (R/R och kostnadströskel), inte som en optimerad parameter."));
  lines.push("");

  lines.push("**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.");
  lines.push("");
  lines.push("*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*");

  mkdirSync("reports/backtest", { recursive: true });
  const out = `reports/backtest/backtest-${ymd}-${market}-top${topN}.md`;
  writeFileSync(out, lines.join("\n") + "\n");
  console.log("\nSkrev " + out);
  // Kompakt konsolsammanfattning – hela rapporten finns i filen.
  const bestOverall = results.slice().sort((a, b) => b.equityPct - a.equityPct)[0];
  console.log(`  benchmark ${benchSym}: ${f(bh)} %`);
  if (bestOverall) console.log(`  bästa cell: ${bestOverall.params.mode} ${bestOverall.params.lookback}d −${(bestOverall.params.stopPct * 100).toFixed(0)}/+${(bestOverall.params.targetPct * 100).toFixed(0)} % → equity ${f(bestOverall.equityPct)} % (PF ${pf(bestOverall.profitFactor)}, DD −${bestOverall.maxDrawdownPct.toFixed(1)} %)`);
  if (sleeveOff && sleeveOn) console.log(`  sleeve av → på: ${f(sleeveOff.equityPct)} % → ${f(sleeveOn.equityPct)} %`);
  if (bestAinB) console.log(`  out-of-sample: vald cell ${f(bestAinB.equityPct)} % mot median ${f(medB)} % (bench ${f(bhB)} %)`);
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
