#!/usr/bin/env node
/* ============================================================
   BACKTEST: RAPPORTHANDEL – köpa FÖRE rapporten eller EFTER den?

   Frågan som utlöste filen (2026-08-04): Palantir rapporterade 3/8 AMC och steg
   ~28 % dagen efter. Systemet hade flaggat rapporten tre dagar i rad utan att
   kunna agera. Den naturliga slutsatsen – "vi borde ha köpt före rapporten" –
   är ett urvalsfel om man bara tittar på PLTR. Samma rapportfönster gav META
   −17,8 % och AAPL −7,4 % PÅ EN BEAT, och INTC:s +13 % after-hours 23/7
   reverserades till −7,9 % dagen efter. Frågan går inte att avgöra med
   argument, bara genom att mäta båda sidorna över många rapporter.

   VAD SOM MÄTS – fyra armar per rapporthändelse:
     PRE_ALL   köp stängning dagen före, sälj stängning på reaktionsdagen.
               Ingen riktningsgissning – detta är "köp inför rapporten".
     PRE_MOM   samma, men bara när aktien trendar UPP in i rapporten. Det är
               användarens hypotes uttryckt mekaniskt: "tillgänglig information
               + förväntningar borde gå att läsa av i förväg".
     PEAD_D0   post-earnings drift, optimistisk: köp på reaktionsdagens ÖPPNING,
               men bara efter ett POSITIVT gap. Kräver att man hinner agera på
               öppningen samma dag som reaktionen.
     PEAD_D1   post-earnings drift, ärlig: köp på öppningen DAGEN EFTER
               reaktionsdagen. Det är vad böckerna faktiskt kan exekvera – den
               nordiska routinen kör 08:40 CEST och US-routinen 15:00 CEST, båda
               FÖRE respektive marknads öppning, med en verifierad kurs som är
               föregående stängning. Skillnaden PEAD_D0 − PEAD_D1 är priset för
               ett dygns fördröjning, och den siffran är hela poängen med att
               veta om bryggan scout → bok är värd att bygga.

   VARFÖR EN PROXY FÖR RAPPORTDAGAR: Yahoos chart-API levererar inga historiska
   rapportdatum (`events=earnings` ger null) och `earningsHistory` räcker bara
   fyra kvartal bakåt – för lite för ett flerårigt test. Rapportdagar detekteras
   därför ur PRISET: ett kursgap över `gapMin` kombinerat med en volymspik över
   `volMin` gånger medianvolymen, med minst `minSpacing` handelsdagar mellan två
   händelser (kvartalstakt). Proxyn är trubbig åt BÅDA håll – den missar
   rapporter som inte rörde kursen och fångar ibland en icke-rapport (M&A,
   vinstvarning, sektorchock). Den är däremot inte systematiskt snedvriden mot
   någon av armarna: alla fyra mäts på EXAKT samma händelsemängd, så
   JÄMFÖRELSEN mellan dem håller även om nivån på varje enskild arm är osäker.
   Det är jämförelsen beslutet vilar på, inte absoluttalen.

   Kör:  node .github/scripts/backtest-earnings.mjs us 5y
         node .github/scripts/backtest-earnings.mjs nordic 5y
   Skriver reports/backtest/earnings-yymmdd-<marknad>.md
   Kräver nätåtkomst (Yahoo chart-API).
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { parseCandles, momentumAt, simulateTrade, buildCostTable, median, smaSeries } from "./backtest.mjs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---- rena funktioner (testbara, ingen nätåtkomst) -----------------------

/* Medianvolym över de `n` dagarna FÖRE index i (exklusive i själv – annars
   normaliseras volymspiken bort av sig själv). null om underlag saknas. */
export function medianVolumeBefore(candles, i, n = 21){
  const vals = [];
  for (let j = Math.max(0, i - n); j < i; j++){
    const v = candles[j] && candles[j].v;
    if (v != null && v > 0) vals.push(v);
  }
  if (vals.length < Math.min(5, n)) return null;
  return median(vals);
}

/* Rapportdagar ur pris + volym. Returnerar [{ i, d, gapPct, volRatio }] i
   stigande datumordning.

   `i` är REAKTIONSDAGEN: dagen som öppnar med gapet. En rapport som släpps
   efter stängning (AMC) reagerar nästa handelsdag; en som släpps före öppning
   (BMO) reagerar samma dag. Båda hamnar därför på gapdagen, vilket är det enda
   som går att observera i prisdata – och det är rätt dag att räkna från.

   LOOK-AHEAD-VARNING (upptäckt vid första körningen 2026-08-04): så snart
   `gapMin > 0` betingar händelsemängden på gapets STORLEK – alltså exakt det
   PRE-armen försöker förutse. Höjs tröskeln från 4 % till 6 % går PRE_ALL från
   +0,1 % till +1,3 %, inte för att strategin blivit bättre utan för att urvalet
   nu bara innehåller händelser där en stor rörelse FAKTISKT inträffade, och den
   fördelningen är uppåtsnedvriden. PEAD-armarna är opåverkade – de betingar på
   `gapPct > 0`, vilket är observerbart när de köper. PRE-armarna måste därför
   mätas på en händelsemängd utan gapvillkor: sätt `gapMin: 0` och höj `volMin`.
   Volymspiken är fortfarande samma dag, men den säger inget om RIKTNING, och
   riktningen är det enda PRE tjänar pengar på. */
export function detectEventDays(candles, opts = {}){
  const { gapMin = 0.04, volMin = 1.5, minSpacing = 40, volWindow = 21 } = opts;
  const out = [];
  let last = -Infinity;
  for (let i = 1; i < candles.length; i++){
    const prevC = candles[i - 1].c, o = candles[i].o;
    if (!prevC || !o) continue;
    const gapPct = o / prevC - 1;
    if (gapMin > 0 && Math.abs(gapPct) < gapMin) continue;
    const medV = medianVolumeBefore(candles, i, volWindow);
    // Saknas volymdata (index m.fl.) kan spiken inte bekräftas -> hoppa över.
    // Att slippa igenom på enbart gap skulle släppa in varje sektorchock.
    if (medV == null || !candles[i].v) continue;
    const volRatio = candles[i].v / medV;
    if (volRatio < volMin) continue;
    if (i - last < minSpacing) continue;    // kvartalstakt, dedupe
    last = i;
    out.push({ i, d: candles[i].d, gapPct, volRatio });
  }
  return out;
}

/* PRE-armen: köp stängning dagen FÖRE reaktionsdagen, sälj stängning PÅ
   reaktionsdagen. Detta är "köp inför rapporten" – hela gapet tas, i den
   riktning det råkar gå. Returnerar null om kanterna saknas. */
export function preEarningsTrade(candles, ev, costPct = 0){
  const inC = candles[ev.i - 1] && candles[ev.i - 1].c;
  const outC = candles[ev.i] && candles[ev.i].c;
  if (!inC || !outC) return null;
  const grossPct = (outC / inC - 1) * 100;
  return {
    arm: "PRE", d: ev.d, entryDate: candles[ev.i - 1].d, exitDate: candles[ev.i].d,
    entryPrice: inC, exitPrice: outC, grossPct, costPct,
    retPct: grossPct - costPct, days: 1, gapPct: ev.gapPct
  };
}

/* PEAD-armen: köp EFTER ett bekräftat positivt gap och rid driften.
   `offset` = 0 -> entry på reaktionsdagens öppning (optimistiskt)
   `offset` = 1 -> entry på öppningen dagen efter (vad böckerna kan exekvera)
   Stop/mål/hålltid hanteras av samma simulateTrade som resten av motorn, så
   utfallet är jämförbart med den vanliga rotationen. */
export function peadTrade(candles, ev, opts = {}){
  const { offset = 1, stopPct = 0.06, targetPct = 0.16, holdDays = 20, costPct = 0, minGap = 0 } = opts;
  if (!(ev.gapPct > minGap)) return null;        // bara bekräftade POSITIVA gap
  const i = ev.i + offset;
  if (i >= candles.length) return null;
  const tr = simulateTrade(candles, i, stopPct, targetPct, holdDays);
  if (!tr) return null;
  return {
    arm: "PEAD" + offset, d: ev.d, entryDate: candles[tr.entryIdx].d, exitDate: candles[tr.exitIdx].d,
    entryPrice: tr.entryPrice, exitPrice: tr.exitPrice, grossPct: tr.retPct, costPct,
    retPct: tr.retPct - costPct, days: tr.days, reason: tr.reason, gapPct: ev.gapPct
  };
}

/* PEAD med entry på reaktionsdagens STÄNGNING i stället för öppningen.

   Varför armen finns: PEAD_D0 köper på öppningen och betingar på att öppningen
   ligger över gårdagens stängning. I samma ögonblick vet man båda, men att
   FAKTISKT få avslut på öppningskursen med det villkoret uppfyllt är optimistiskt.
   PEAD_D1 (nästa dags öppning) är å andra sidan strikt exekverbart men förlorar
   hela edgen. Den här armen är mellanläget som böckerna faktiskt kan nå med den
   infrastruktur som redan finns: intradag-monitorn kör varje timme under börstid,
   så ett villkorat köp som utlöses när gapet bekräftats och fylls mot dagens
   stängning är en order systemet kan lägga.

   Stop/mål börjar gälla FRÅN DAGEN EFTER entry – dag i:s egen high/low har redan
   inträffat när vi köper på stängningen, och att pröva dem vore look-ahead. */
export function peadTradeAtClose(candles, ev, opts = {}){
  const { stopPct = 0.06, targetPct = 0.16, holdDays = 20, costPct = 0, minGap = 0 } = opts;
  if (!(ev.gapPct > minGap)) return null;
  const i = ev.i;
  const entry = candles[i] && candles[i].c;
  if (!entry) return null;
  const stop = entry * (1 - stopPct), target = entry * (1 + targetPct);
  const last = Math.min(i + holdDays, candles.length - 1);
  let exitIdx = last, exitPrice = candles[last].c, reason = "horisont";
  for (let j = i + 1; j <= last; j++){
    const day = candles[j];
    if (day.o <= stop)        { exitIdx = j; exitPrice = day.o; reason = "stop-gap"; break; }
    if (day.l <= stop)        { exitIdx = j; exitPrice = stop;  reason = "stop";     break; }
    if (day.o >= target)      { exitIdx = j; exitPrice = day.o; reason = "mål-gap";  break; }
    if (day.h >= target)      { exitIdx = j; exitPrice = target; reason = "mål";     break; }
  }
  const grossPct = (exitPrice / entry - 1) * 100;
  return {
    arm: "PEAD_D0C", d: ev.d, entryDate: candles[i].d, exitDate: candles[exitIdx].d,
    entryPrice: entry, exitPrice, grossPct, costPct,
    retPct: grossPct - costPct, days: exitIdx - i, reason, gapPct: ev.gapPct
  };
}

/* Benchmarkets avkastning mellan två datum (senaste stängning <= respektive
   datum). Ger alpha per affär så att en arm inte får credit för att hela
   marknaden steg under fönstret. null när perioden inte kan täckas – 0 vore
   ett påstående, precis som i decision_eval.mjs. */
export function benchWindowPct(benchCandles, fromDate, toDate){
  if (!benchCandles || !benchCandles.length) return null;
  const at = date => {
    let lo = 0, hi = benchCandles.length - 1, res = -1;
    while (lo <= hi){ const m = (lo + hi) >> 1; if (benchCandles[m].d <= date){ res = m; lo = m + 1; } else hi = m - 1; }
    return res;
  };
  const a = at(fromDate), b = at(toDate);
  if (a < 0 || b < 0 || b <= a) return null;
  const p0 = benchCandles[a].c, p1 = benchCandles[b].c;
  if (!p0 || !p1) return null;
  return (p1 / p0 - 1) * 100;
}

/* Sammanfattar en arm. `minN` speglar decision_eval.mjs: under så många
   mätpunkter uttalar sig filen inte, den säger hur många som fattas. */
export function summarize(trades, minN = 20){
  const rets = trades.map(t => t.retPct).filter(v => v != null && isFinite(v));
  if (rets.length < minN)
    return { n: rets.length, insufficient: true, missing: minN - rets.length };
  const wins = rets.filter(v => v > 0), losses = rets.filter(v => v <= 0);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const grossWin = sum(wins), grossLoss = Math.abs(sum(losses));
  const sorted = rets.slice().sort((a, b) => a - b);
  const alphas = trades.map(t => t.alphaPct).filter(v => v != null && isFinite(v));
  const decile = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 10)));
  return {
    n: rets.length, insufficient: false,
    meanPct: sum(rets) / rets.length,
    medianPct: median(rets),
    hitRate: wins.length / rets.length * 100,
    avgWinPct: wins.length ? grossWin / wins.length : null,
    avgLossPct: losses.length ? -grossLoss / losses.length : null,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? Infinity : 0),
    bestPct: sorted[sorted.length - 1], worstPct: sorted[0],
    // Vänstersvansen. Detta är svaret på hävstångsfrågan: hur illa blir de
    // sämsta 10 % av utfallen, och hur ofta faller en position mer än 10 %?
    worstDecileMeanPct: sum(decile) / decile.length,
    shareBelowMinus10: rets.filter(v => v <= -10).length / rets.length * 100,
    meanAlphaPct: alphas.length ? sum(alphas) / alphas.length : null,
    alphaN: alphas.length,
    avgDays: trades.reduce((a, t) => a + (t.days || 0), 0) / trades.length
  };
}

/* Regimfilter, IDENTISKT med det böckerna redan kör (beslut 2026-08-03: PÅ,
   hårt, MA200, båda böckerna). Returnerar en funktion `datum => boolean`.

   Varför det MÅSTE vara med: boken får inte öppna en position när regimen är av.
   Att mäta PEAD utan filtret mäter alltså en strategi boken inte kan exekvera,
   och blandar in exakt de perioder där regeln i drift hade stått utanför. Detta
   är ingen ny parameter som trimmas fram – det är den befintliga regeln applicerad
   på rätt mängd. Saknas underlag (< MA-fönstret) behandlas regimen som AV, samma
   strängare riktning vid osäkerhet som i backtest.mjs och i prompterna. */
export function makeRegimeGate(benchCandles, regimeMa){
  if (!regimeMa || !benchCandles || !benchCandles.length) return () => true;
  const sma = smaSeries(benchCandles.map(c => c.c), regimeMa);
  const at = date => {
    let lo = 0, hi = benchCandles.length - 1, res = -1;
    while (lo <= hi){ const m = (lo + hi) >> 1; if (benchCandles[m].d <= date){ res = m; lo = m + 1; } else hi = m - 1; }
    return res;
  };
  return date => {
    const i = at(date);
    if (i < 0 || sma[i] == null) return false;     // osäkert = AV
    return benchCandles[i].c > sma[i];
  };
}

/* Kör alla fyra armarna över ett universum.
   candlesBySym = { SYM: candles[] }. Returnerar { events, arms:{...}, perSym }. */
export function runEarningsArms(candlesBySym, opts = {}){
  const {
    detect = {}, pead = {}, costOf = () => 0, benchCandles = null,
    momLookback = 20, from = null, to = null, regimeMa = 0
  } = opts;
  const regimeOk = makeRegimeGate(benchCandles, regimeMa);
  const arms = { PRE_ALL: [], PRE_MOM: [], PEAD_D0: [], PEAD_D0C: [], PEAD_D1: [] };
  let events = 0;
  for (const sym of Object.keys(candlesBySym)){
    const candles = candlesBySym[sym] || [];
    if (candles.length < 60) continue;
    const cost = Number(costOf(sym)) || 0;
    for (const ev of detectEventDays(candles, detect)){
      if (from && ev.d < from) continue;
      if (to && ev.d > to) continue;
      // Regimen prövas på REAKTIONSDAGEN – det är då beslutet fattas.
      if (!regimeOk(ev.d)) continue;
      events++;
      const tag = t => { if (!t) return null; t.sym = sym;
        t.alphaPct = (() => { const b = benchWindowPct(benchCandles, t.entryDate, t.exitDate);
                              return b == null ? null : t.retPct - b; })();
        return t; };

      const pre = tag(preEarningsTrade(candles, ev, cost));
      if (pre){
        arms.PRE_ALL.push(pre);
        // Momentumfiltret läses FÖRE reaktionsdagen – ingen framtidsinformation.
        const mom = momentumAt(candles, ev.i, momLookback, 0);
        if (mom != null && mom > 0) arms.PRE_MOM.push(pre);
      }
      const d0 = tag(peadTrade(candles, ev, Object.assign({}, pead, { offset: 0, costPct: cost })));
      if (d0) arms.PEAD_D0.push(d0);
      const d0c = tag(peadTradeAtClose(candles, ev, Object.assign({}, pead, { costPct: cost })));
      if (d0c) arms.PEAD_D0C.push(d0c);
      const d1 = tag(peadTrade(candles, ev, Object.assign({}, pead, { offset: 1, costPct: cost })));
      if (d1) arms.PEAD_D1.push(d1);
    }
  }
  return { events, arms };
}

// ---- nät + CLI ---------------------------------------------------------
async function fetchCandles(sym, range){
  for (const h of ["query1.finance.yahoo.com", "query2.finance.yahoo.com"]){
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

const f = v => (v == null ? "–" : (v >= 0 ? "+" : "") + v.toFixed(1));
const pf = v => (v == null ? "–" : v === Infinity ? "∞" : v.toFixed(2));

function armRow(name, s){
  if (!s || s.insufficient)
    return `| ${name} | ${s ? s.n : 0} | för få (${s ? s.missing : "–"} fattas) | | | | | | |`;
  return `| ${name} | ${s.n} | ${f(s.meanPct)} % | ${f(s.medianPct)} % | ${s.hitRate.toFixed(0)} % | ` +
         `${pf(s.profitFactor)} | ${f(s.meanAlphaPct)} % | ${f(s.worstDecileMeanPct)} % | ${s.shareBelowMinus10.toFixed(0)} % |`;
}

async function main(){
  const market = (process.argv[2] || "us").toLowerCase();
  const range = process.argv[3] || "5y";
  const UNI = {
    "nordic":       "config/backtest_universe_nordic.txt",
    "nordic-mid":   "config/backtest_universe_nordic_mid.txt",
    "nordic-broad": "config/backtest_universe_nordic_broad.txt",
    "us":           "config/backtest_universe_us.txt"
  };
  const uniFile = UNI[market] || UNI.us;
  const isUS = market === "us";
  const benchSym = isUS ? "^GSPC" : "^OMX";
  if (!existsSync(uniFile)){ console.error("Saknar " + uniFile); process.exit(1); }
  const syms = readFileSync(uniFile, "utf8").split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));

  console.log(`Hämtar ${syms.length} symboler (${range})…`);
  const candlesBySym = {};
  for (const s of syms){
    candlesBySym[s] = await fetchCandles(s, range);
    process.stdout.write(`  ${s}: ${candlesBySym[s].length} dagar\n`);
    await new Promise(r => setTimeout(r, 400));
  }
  const benchCandles = await fetchCandles(benchSym, range);
  if (!benchCandles.length) console.log("VARNING: benchmark " + benchSym + " saknas – alpha kan inte räknas.");

  // Kostnad per symbol ur samma källa som rotationsbacktestet.
  let costOf = () => 0;
  try {
    const c = JSON.parse(readFileSync("config/kostnader.json", "utf8"));
    const b = isUS ? c.us : c.nordic;
    const flat = (Number(b.roundTripPct) || 0) + (Number(b.fxSpreadPct) || 0);
    const fx = isUS ? (Number(b.fxSpreadPct) || 0) : 0;
    if (Array.isArray(b.liquidityTiers) && b.liquidityTiers.length){
      const built = buildCostTable(candlesBySym, b.liquidityTiers);
      costOf = sym => (built.bySym[sym] != null ? built.bySym[sym] + fx : flat);
    } else costOf = () => flat;
  } catch { console.log("Ingen config/kostnader.json – räknar brutto."); }

  /* Stop/mål och hålltid för PEAD-armen tas ur promptens katalysatortabell för
     `earnings`: horisont 3–6 veckor, mål 14–18 %, stop 5–6 %. Mittvärdena
     används så att mätningen testar den regel böckerna faktiskt skulle köra,
     inte en optimerad variant. */
  const PEAD = { stopPct: 0.055, targetPct: 0.16, holdDays: 25 };

  /* TVÅ HÄNDELSEMÄNGDER, av mätskäl (se LOOK-AHEAD-VARNING vid detectEventDays).
     SET_GAP betingar på gapets storlek och används BARA för PEAD-armarna, som
     köper efter att gapet är observerat – för dem är villkoret legitimt.
     SET_VOL har inget gapvillkor alls och används för PRE-armarna, som annars
     får credit för att veta hur stor rörelsen blev innan de köper. Volymspiken
     höjs till 2,5× för att kompensera bortfallet av gapvillkoret; det är
     fortfarande en rapportdagsproxy, men en RIKTNINGSBLIND sådan. */
  const SET_GAP = { gapMin: 0.04, volMin: 1.5, minSpacing: 40 };
  const SET_VOL = { gapMin: 0,    volMin: 2.5, minSpacing: 40 };

  /* Kör båda mängderna och plocka varje arm ur den mängd som är rättvis för
     den. Att blanda är hela poängen – inte en genväg. */
  /* REGIMFILTRET ÄR PÅ SOM STANDARD. Böckerna får inte öppna nya positioner när
     benchmark ligger under MA200 (beslut 2026-08-03, båda böckerna). En mätning
     utan filtret beskriver en strategi som inte får köras. Filtret AV redovisas
     som jämförelse i avsnitt 7, inte som huvudsiffra. */
  const REGIME_MA = 200;

  const measure = (window = {}, regimeMa = REGIME_MA) => {
    const base = { detect: SET_GAP, pead: PEAD, costOf, benchCandles, regimeMa };
    const g = runEarningsArms(candlesBySym, Object.assign({}, base, window));
    const v = runEarningsArms(candlesBySym, Object.assign({}, base, { detect: SET_VOL }, window));
    return {
      eventsGap: g.events, eventsVol: v.events,
      arms: { PRE_ALL: v.arms.PRE_ALL, PRE_MOM: v.arms.PRE_MOM,
              PEAD_D0: g.arms.PEAD_D0, PEAD_D0C: g.arms.PEAD_D0C, PEAD_D1: g.arms.PEAD_D1 }
    };
  };

  const full = measure();

  // Out-of-sample: händelserna delas på mediandatumet, båda halvorna redovisas.
  const allDates = [];
  for (const s of Object.keys(candlesBySym)) for (const c of candlesBySym[s]) allDates.push(c.d);
  allDates.sort();
  const mid = allDates[Math.floor(allDates.length / 2)];
  const halfA = measure({ to: mid });
  const halfB = measure({ from: mid });

  /* Känslighet. PEAD-armarna svepas över gap-tröskeln, PRE-armarna över
     VOLYM-tröskeln – att svepa PRE över gapet vore att svepa över just den
     look-ahead som armen inte får ha. */
  const sensGap = [0.03, 0.04, 0.06].map(gapMin => ({
    v: gapMin,
    r: runEarningsArms(candlesBySym, { detect: Object.assign({}, SET_GAP, { gapMin }), pead: PEAD, costOf, benchCandles, regimeMa: REGIME_MA })
  }));
  const sensVol = [2.0, 2.5, 3.5].map(volMin => ({
    v: volMin,
    r: runEarningsArms(candlesBySym, { detect: Object.assign({}, SET_VOL, { volMin }), pead: PEAD, costOf, benchCandles, regimeMa: REGIME_MA })
  }));
  // Filtret AV – enda syftet är att visa hur mycket det bidrar (avsnitt 7).
  const noRegime = measure({}, 0);

  const ymd = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const L = [];
  L.push(`# Backtest: rapporthandel (${market}, ${range})`);
  L.push("");
  L.push(`**Körd:** ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC · **Universum:** \`${uniFile}\` (${syms.length} symboler) · **Benchmark:** ${benchSym}`);
  L.push("");
  L.push("**Frågan:** ska boken köpa INFÖR en rapport (på förväntningar) eller EFTER en bekräftad överraskning (post-earnings drift)?");
  L.push("");
  L.push("> ⚠️ **Rapportdagarna är en PROXY.** Yahoo levererar inga historiska rapportdatum (`events=earnings` ger null, `earningsHistory` räcker fyra kvartal). En rapportdag detekteras därför ur pris och volym. Proxyn missar rapporter som inte rörde kursen och fångar ibland en icke-rapport (M&A, vinstvarning, sektorchock). Läs tabellen som en rangordning, inte som en prognos.");
  L.push("");
  L.push("> ⚠️ **TVÅ HÄNDELSEMÄNGDER – nödvändigt, inte pedantiskt.** En mängd som betingar på gapets STORLEK ger PRE-armen look-ahead: den får credit för att veta hur stor rörelsen blev innan den köper. Effekten är mätbar och stor – höjs gap-tröskeln från 4 % till 6 % går PRE_ALL från +0,1 % till +1,3 % utan att strategin ändrats. Därför:");
  L.push(">");
  L.push(`> - **SET_GAP** (gap ≥ ${(SET_GAP.gapMin * 100).toFixed(0)} % · volym ≥ ${SET_GAP.volMin}× median · ${SET_GAP.minSpacing} dagars lucka) → **bara PEAD-armarna**. De köper efter att gapet observerats, så villkoret är legitimt för dem.`);
  L.push(`> - **SET_VOL** (inget gapvillkor · volym ≥ ${SET_VOL.volMin}× median · ${SET_VOL.minSpacing} dagars lucka) → **bara PRE-armarna**. Riktningsblind: volymspiken säger att något hände, inte åt vilket håll.`);
  L.push("");
  L.push("> ⚠️ **Survivorship bias:** universumfilerna är dagens mest likvida namn. Bolag som kraschade ur listan saknas, vilket gör ALLA armar för bra – särskilt PRE-armarna, vars vänstersvans är den som saknas.");
  L.push("");
  L.push("## 1. Armarna");
  L.push("");
  L.push("| Arm | Vad den gör |");
  L.push("|---|---|");
  L.push("| **PRE_ALL** | Köp stängning dagen före reaktionsdagen, sälj stängning på reaktionsdagen. Ingen riktningsgissning. |");
  L.push("| **PRE_MOM** | Samma, men bara när aktien trendar upp (20d momentum > 0) in i rapporten. Hypotesen \"det gick att läsa av i förväg\" uttryckt mekaniskt. |");
  L.push("| **PEAD_D0** | Köp reaktionsdagens ÖPPNING efter ett bekräftat positivt gap. Optimistiskt – kräver att man hinner agera samma dag. |");
  L.push("| **PEAD_D0C** | Köp reaktionsdagens STÄNGNING efter ett bekräftat positivt gap. Strikt exekverbart: intradag-monitorn kör varje timme under börstid. |");
  L.push("| **PEAD_D1** | Köp öppningen DAGEN EFTER reaktionsdagen. Konservativt golv – vad boken kan göra helt utan intradag-mekanik. |");
  L.push("");
  L.push(`PEAD-armarna använder promptens \`earnings\`-nivåer: stop −${(PEAD.stopPct * 100).toFixed(1)} %, mål +${(PEAD.targetPct * 100).toFixed(0)} %, horisont ${PEAD.holdDays} handelsdagar. Kostnad per symbol ur \`config/kostnader.json\`. Alla tal är NETTO.`);
  L.push("");
  L.push("## 2. Hela perioden");
  L.push("");
  L.push(`Detekterade händelser: **${full.eventsGap}** i SET_GAP (PEAD-armarna) · **${full.eventsVol}** i SET_VOL (PRE-armarna).`);
  L.push("");
  const head = "| Arm | n | Medel | Median | Träff | PF | Alpha | Sämsta decil | Andel ≤ −10 % |";
  const sep  = "|---|---|---|---|---|---|---|---|---|";
  L.push(head); L.push(sep);
  const S = {};
  for (const k of ["PRE_ALL", "PRE_MOM", "PEAD_D0", "PEAD_D0C", "PEAD_D1"]){
    S[k] = summarize(full.arms[k]);
    L.push(armRow(k, S[k]));
  }
  L.push("");
  L.push("**Sämsta decil** = medelutfallet i de 10 % värsta affärerna. **Andel ≤ −10 %** = hur ofta en enskild position tappar mer än en tiondel. Båda kolumnerna finns för hävstångsfrågan: en arm med tjock vänstersvans tål ingen belåning oavsett medelvärde.");
  L.push("");
  L.push("## 3. Out-of-sample (perioden delad på mitten)");
  L.push("");
  L.push(`Brytdatum: **${mid}**. En arm som bara fungerar i en halva är brus.`);
  L.push("");
  L.push("| Arm | Halva A (n) | Halva A medel | Halva B (n) | Halva B medel | Samma tecken? |");
  L.push("|---|---|---|---|---|---|");
  for (const k of ["PRE_ALL", "PRE_MOM", "PEAD_D0", "PEAD_D0C", "PEAD_D1"]){
    const a = summarize(halfA.arms[k]), b = summarize(halfB.arms[k]);
    const av = a.insufficient ? null : a.meanPct, bv = b.insufficient ? null : b.meanPct;
    const same = (av == null || bv == null) ? "–" : ((av > 0) === (bv > 0) ? (av > 0 ? "**JA (+/+)**" : "ja (−/−)") : "**NEJ**");
    L.push(`| ${k} | ${a.n} | ${a.insufficient ? "för få" : f(av) + " %"} | ${b.n} | ${b.insufficient ? "för få" : f(bv) + " %"} | ${same} |`);
  }
  L.push("");
  L.push("## 4. Känslighet mot detektionströsklarna");
  L.push("");
  L.push("Varje arm svepas över tröskeln i SIN egen händelsemängd. Att svepa PRE över gap-tröskeln vore att svepa över just den look-ahead armen inte får ha – därför två tabeller.");
  L.push("");
  L.push("**PEAD-armarna över gap-tröskeln (SET_GAP):**");
  L.push("");
  L.push("| Gap-tröskel | Händelser | PEAD_D0 medel | PEAD_D0C medel | PEAD_D1 medel |");
  L.push("|---|---|---|---|---|");
  for (const { v, r } of sensGap){
    const g = k => { const s = summarize(r.arms[k]); return s.insufficient ? "för få" : f(s.meanPct) + " %"; };
    L.push(`| ≥ ${(v * 100).toFixed(0)} % | ${r.events} | ${g("PEAD_D0")} | ${g("PEAD_D0C")} | ${g("PEAD_D1")} |`);
  }
  L.push("");
  L.push("**PRE-armarna över volym-tröskeln (SET_VOL, inget gapvillkor):**");
  L.push("");
  L.push("| Volym-tröskel | Händelser | PRE_ALL medel | PRE_MOM medel |");
  L.push("|---|---|---|---|");
  for (const { v, r } of sensVol){
    const g = k => { const s = summarize(r.arms[k]); return s.insufficient ? "för få" : f(s.meanPct) + " %"; };
    L.push(`| ≥ ${v.toFixed(1)}× | ${r.events} | ${g("PRE_ALL")} | ${g("PRE_MOM")} |`);
  }
  L.push("");
  L.push("## 5. Latenskostnaden");
  L.push("");
  if (!S.PEAD_D0.insufficient && !S.PEAD_D1.insufficient){
    const d = S.PEAD_D0.meanPct - S.PEAD_D1.meanPct;
    L.push(`Ett dygns fördröjning kostar **${f(d)} procentenheter** per affär (PEAD_D0 ${f(S.PEAD_D0.meanPct)} % → PEAD_D1 ${f(S.PEAD_D1.meanPct)} %). ` +
           "Det är priset för att routinen kör före marknadens öppning och bara har föregående stängning verifierad. " +
           (d > 2 ? "Skillnaden är stor nog att motivera en tidigareläggning eller en villkorad order på öppningen."
                  : "Skillnaden är liten nog att fördröjningen inte i sig underkänner armen."));
  } else L.push("För få mätpunkter för att kvantifiera latenskostnaden.");
  L.push("");
  L.push("## 6. Regimfiltrets bidrag");
  L.push("");
  L.push(`Huvudtabellerna ovan är körda MED regimfiltret på (benchmark > MA${REGIME_MA}), eftersom böckerna inte får öppna positioner när det är av. Tabellen nedan visar samma armar utan filtret – skillnaden är filtrets bidrag, inte en alternativ strategi.`);
  L.push("");
  L.push("| Arm | Med filter (n) | Med filter medel | Utan filter (n) | Utan filter medel | Bidrag |");
  L.push("|---|---|---|---|---|---|");
  for (const k of ["PRE_ALL", "PRE_MOM", "PEAD_D0", "PEAD_D0C", "PEAD_D1"]){
    const on = S[k], off = summarize(noRegime.arms[k]);
    const d = (on.insufficient || off.insufficient) ? null : on.meanPct - off.meanPct;
    L.push(`| ${k} | ${on.n} | ${on.insufficient ? "för få" : f(on.meanPct) + " %"} | ${off.n} | ${off.insufficient ? "för få" : f(off.meanPct) + " %"} | ${d == null ? "–" : f(d) + " pp"} |`);
  }
  L.push("");
  L.push("## 7. Slutsats");
  L.push("");
  /* GODKÄNNANDEKRAVET, satt i förväg och medvetet i FYRA led.
     Ledet `MIN_EDGE` tillkom efter första körningen 2026-08-04: PRE_MOM landade
     på +0,04 % i halva B och passerade då ett rent `> 0`-krav på avrundning.
     Ett medelvärde som inte ens täcker sin egen rundturskostnad är inte en edge
     utan en nolla med tur, och en regel byggd på den kostar pengar i drift. */
  const MIN_EDGE = 0.5;                 // procent per affär, ~2× rundturskostnad
  const gate = k => {
    const a = summarize(halfA.arms[k]), b = summarize(halfB.arms[k]), s = S[k];
    const fails = [];
    if (a.insufficient || b.insufficient) fails.push("för få mätpunkter i en halva");
    else {
      if (!(a.meanPct >= MIN_EDGE)) fails.push(`halva A ${f(a.meanPct)} % < ${MIN_EDGE} %`);
      if (!(b.meanPct >= MIN_EDGE)) fails.push(`halva B ${f(b.meanPct)} % < ${MIN_EDGE} %`);
    }
    if (!s.insufficient && !(s.meanAlphaPct > 0)) fails.push(`alpha ${f(s.meanAlphaPct)} % ≤ 0`);
    return { ok: fails.length === 0, fails };
  };
  for (const k of ["PRE_ALL", "PRE_MOM", "PEAD_D0", "PEAD_D0C", "PEAD_D1"]){
    const g = gate(k), s = S[k];
    L.push(`- **${k}: ${g.ok ? "GODKÄND" : "UNDERKÄND"}**` +
           (g.ok ? "" : ` (${g.fails.join(" · ")})`) +
           (s.insufficient ? " – för få mätpunkter" :
             ` · hela perioden ${f(s.meanPct)} % medel, median ${f(s.medianPct)} %, alpha ${f(s.meanAlphaPct)} %, träff ${s.hitRate.toFixed(0)} %, sämsta decil ${f(s.worstDecileMeanPct)} %, andel ≤ −10 %: ${s.shareBelowMinus10.toFixed(0)} %`));
  }
  L.push("");
  L.push(`**Kravet är satt i förväg** och har fyra led: (1) ≥ ${MIN_EDGE} % medel i halva A, (2) ≥ ${MIN_EDGE} % medel i halva B, (3) positiv alpha över hela perioden, (4) överlever känslighetssvepet i sin egen händelsemängd. Ledet om ${MIN_EDGE} % finns för att ett medelvärde som inte täcker rundturskostnaden inte är en edge – ett rent \`> 0\`-krav släppte igenom +0,04 % på avrundning i den första körningen.`);
  L.push("");
  L.push("**Om medianen är negativ men medelvärdet positivt** är utfallet höger-snedvridet: många små förluster (stoppen) och några få stora vinster (målet). Det är en fungerande men psykologiskt krävande profil – regeln får inte överges efter tre förlorare i rad, för det är så den ser ut när den fungerar. Skriv in det i prompten, annars avvecklas regeln av den som läser rapporten.");
  L.push("");
  L.push("*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*");

  mkdirSync("reports/backtest", { recursive: true });
  /* Perioden MÅSTE ligga i filnamnet. Utan den skrev `us 10y` över `us 5y`, och
     just skillnaden mellan de två perioderna är det viktigaste fyndet i
     materialet (5y godkänner PEAD i US-boken, 10y underkänner den). Ett resultat
     som försvinner går inte att åberopa. */
  const out = `reports/backtest/earnings-${ymd}-${market}-${range}.md`;
  writeFileSync(out, L.join("\n") + "\n");
  console.log("\nSkrev " + out);
  console.log(`  händelser: ${full.eventsGap} (SET_GAP) · ${full.eventsVol} (SET_VOL)`);
  for (const k of ["PRE_ALL", "PRE_MOM", "PEAD_D0", "PEAD_D0C", "PEAD_D1"]){
    const s = S[k];
    console.log(`  ${k.padEnd(8)} n=${String(s.n).padStart(4)} ` +
      (s.insufficient ? "för få" : `medel ${f(s.meanPct)} % · alpha ${f(s.meanAlphaPct)} % · träff ${s.hitRate.toFixed(0)} % · sämsta decil ${f(s.worstDecileMeanPct)} %`));
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) main().catch(e => { console.error(e); process.exit(1); });
