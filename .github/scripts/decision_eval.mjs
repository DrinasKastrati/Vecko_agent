#!/usr/bin/env node
/* ============================================================
   BESLUTSUTVÄRDERING (LLM-FRI, noll tokens).

   VARFÖR DEN FINNS: backtestet (reports/backtest/) visar att det mekaniska
   skelettet inte tillför mätbar avkastning över indexsleeven – slutsatsen är att
   edgen måste komma ur det KATALYSATORDRIVNA URVALET. Men ingenting i systemet
   mätte urvalet. Den enda mätningen som fanns (computeTradeStats i webbappen)
   kräver STÄNGDA affärer, och de är två stycken. Med ~1 stängd affär i månaden
   är det år till en signal.

   IDÉN: varje rad i state/decisions.json är ett beslut med ticker, datum och
   verifierad kurs – även de AVVISADE (AVVAKTA). Kursdatat finns redan i
   state/price_history.json. Alltså går VARJE beslut att poängsätta mot vad som
   faktiskt hände efteråt, utan att invänta en stängd affär. Antalet mätpunkter
   växer med ~10–15 per vecka i stället för ~1 per månad.

   DET SOM GÖR MÄTNINGEN ANVÄNDBAR: de avvisade kandidaterna är ett KONTRAFAKTISKT
   underlag. Går AVVAKTA-raderna systematiskt bättre än de köpta är filtret för
   strängt; går de sämre tjänar filtret sitt uppehälle. Det är den enda vägen till
   ett svar på "tillför urvalet något?" som inte kräver att man först förlorar
   pengar på tillräckligt många affärer.

   MÄTT MOT INDEX, ALDRIG ABSOLUT: en kurs som steg 3 % i en marknad som steg 4 %
   är ett dåligt val. Varje rad jämförs mot sin egen boks index (^OMX / ^GSPC)
   över EXAKT samma fönster.

   VAD DEN INTE GÖR: den uttalar sig aldrig på för lite data. Under minN rader i
   en grupp skrivs `insufficient: true` och hur många rader som fattas – aldrig en
   siffra som ser ut som ett svar. Statistiken var brus 2026-08-03 (11 rader) och
   ska säga det själv tills den inte är det.
   ============================================================ */
import { readFileSync, writeFileSync } from "node:fs";

export const HORIZONS = [5, 20];        // handelsdagar framåt
export const MIN_N = 8;                 // samma tröskel som Systemguidens per-kategori-krav
export const BENCH = { nordic: "^OMX", us: "^GSPC" };
// Indexsleeven är kapitalparkering, inte ett urvalsbeslut – den skulle späda ut
// statistiken åt fel håll (den följer per definition sitt eget benchmark).
export const SKIP_CATALYST = "index";

// ---- rena funktioner (testas i tests/run.mjs) --------------------------

// Avkastning framåt N handelsdagar ur en [[datum, stängning], …]-serie.
// Returnerar null när serien inte räcker – ett beslut som ännu inte hunnit mogna
// får ALDRIG räknas som noll, det skulle dra alla medelvärden mot mitten.
export function forwardReturn(series, fromDate, bars){
  if (!Array.isArray(series) || !series.length || !fromDate) return null;
  // Första stängningen PÅ eller EFTER beslutsdatumet: beslutet fattas på dagens
  // kurs, så den dagens stängning är utgångspunkten.
  let i = series.findIndex(p => p && String(p[0]) >= String(fromDate));
  if (i < 0) return null;
  const j = i + (bars || 0);
  if (j >= series.length) return null;         // ännu inte moget
  const a = Number(series[i][1]), b = Number(series[j][1]);
  if (!isFinite(a) || !isFinite(b) || a <= 0) return null;
  return { fromDate: series[i][0], toDate: series[j][0], from: a, to: b,
           pct: (b / a - 1) * 100 };
}

// En beslutsrad → utfall per horisont, inklusive index och alpha.
export function evalRow(row, seriesFor, horizons = HORIZONS){
  const sym = row && row.ticker;
  const book = (row && row.book) || "nordic";
  const series = seriesFor(sym);
  const bench = seriesFor(BENCH[book] || BENCH.nordic);
  const out = { date: row.date, ticker: sym, book, action: row.action,
                catalystType: row.catalystType || "other", sector: row.sector || null,
                reconstructed: !!row.source, fwd: {} };
  if (!series || !series.length){ out.missing = true; return out; }
  for (const h of horizons){
    const r = forwardReturn(series, row.date, h);
    if (!r) continue;                                   // ännu inte moget
    const br = bench && bench.length ? forwardReturn(bench, row.date, h) : null;
    out.fwd[h] = {
      pct: round2(r.pct),
      benchPct: br ? round2(br.pct) : null,
      alphaPct: br ? round2(r.pct - br.pct) : null,
      toDate: r.toDate
    };
  }
  return out;
}

function round2(x){ return Math.round(x * 100) / 100; }
function mean(a){ return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; }
function median(a){
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

// Aggregat för en grupp rader vid en horisont. Uttalar sig inte under minN.
export function summarize(rows, horizon, minN = MIN_N){
  const vals = rows.map(r => r.fwd && r.fwd[horizon]).filter(v => v && v.alphaPct !== null);
  const alphas = vals.map(v => v.alphaPct);
  const raw = vals.map(v => v.pct);
  const res = {
    n: alphas.length,
    meanAlphaPct: alphas.length ? round2(mean(alphas)) : null,
    medianAlphaPct: alphas.length ? round2(median(alphas)) : null,
    meanPct: raw.length ? round2(mean(raw)) : null,
    beatIndexPct: alphas.length ? round2(alphas.filter(a => a > 0).length / alphas.length * 100) : null
  };
  if (res.n < minN){ res.insufficient = true; res.need = minN - res.n; }
  return res;
}

// Grupperar rader på en nyckel och summerar varje grupp.
export function groupBy(rows, keyFn, horizon, minN = MIN_N){
  const groups = new Map();
  for (const r of rows){
    const k = keyFn(r);
    if (k === null || k === undefined) continue;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  const out = {};
  for (const [k, list] of groups) out[k] = summarize(list, horizon, minN);
  return out;
}

// KÄRNFRÅGAN: skiljer urvalet köpta från avvisade kandidater?
// Positiv edge = de köpta gick BÄTTRE än de avvisade, mätt mot index.
// Uttalandet kräver minN i BÅDA grupperna – annars är det ett skensvar.
export function selectionEdge(rows, horizon, minN = MIN_N){
  const bought = rows.filter(r => r.action === "KÖP");
  const passed = rows.filter(r => r.action === "AVVAKTA");
  const b = summarize(bought, horizon, minN);
  const p = summarize(passed, horizon, minN);
  const res = { horizon, bought: b, passed: p, edgePct: null, verdict: "för tidigt att uttala sig" };
  if (b.insufficient || p.insufficient){
    res.insufficient = true;
    res.need = { bought: b.need || 0, passed: p.need || 0 };
    return res;
  }
  res.edgePct = round2(b.meanAlphaPct - p.meanAlphaPct);
  // Formuleringarna är medvetet försiktiga: detta är ett observationsmått på ett
  // litet urval, inte ett signifikanstest.
  if (res.edgePct > 1) res.verdict = "urvalet skiljer köpta från avvisade i rätt riktning";
  else if (res.edgePct < -1) res.verdict = "de AVVISADE gick bättre – filtret kan vara för strängt";
  else res.verdict = "ingen skillnad utöver brus mellan köpta och avvisade";
  return res;
}

// Beslut som inte KAN mätas: tickern saknas i price_history.json. Det är en
// åtgärdslista, inte en felnotis – saknas symbolen är beslutet omätbart för alltid,
// eftersom historiken bara backfillas för symboler som hämtas.
export function missingSymbols(evaluated){
  return [...new Set(evaluated.filter(r => r.missing).map(r => r.ticker))].sort();
}

// Hela utvärderingen ur de två filerna. Ren funktion – tar data, inte sökvägar.
export function evaluate(decisionsDb, priceHistory, opts = {}){
  const horizons = opts.horizons || HORIZONS;
  const minN = opts.minN || MIN_N;
  const series = (priceHistory && priceHistory.series) || {};
  const seriesFor = sym => series[sym] || null;
  const rows = ((decisionsDb && decisionsDb.decisions) || [])
    .filter(r => r && r.ticker && r.date && r.catalystType !== SKIP_CATALYST);
  const evaluated = rows.map(r => evalRow(r, seriesFor, horizons));
  const scored = evaluated.filter(r => !r.missing);
  const out = {
    generatedAt: new Date().toISOString(),
    horizons, minN,
    counts: {
      decisions: rows.length,
      measurable: scored.length,
      missing: evaluated.filter(r => r.missing).length,
      pending: scored.filter(r => !Object.keys(r.fwd).length).length
    },
    missingSymbols: missingSymbols(evaluated),
    byHorizon: {},
    rows: evaluated
  };
  for (const h of horizons){
    out.byHorizon[h] = {
      all: summarize(scored, h, minN),
      byAction: groupBy(scored, r => r.action, h, minN),
      byBook: groupBy(scored, r => r.book, h, minN),
      byCatalyst: groupBy(scored, r => r.catalystType, h, minN),
      selectionEdge: selectionEdge(scored, h, minN)
    };
  }
  return out;
}

// ---- main --------------------------------------------------------------
function main(){
  let db = { decisions: [] }, ph = { series: {} };
  try { db = JSON.parse(readFileSync("state/decisions.json", "utf8")); }
  catch { console.error("Kan inte läsa state/decisions.json – avslutar."); process.exit(1); }
  try { ph = JSON.parse(readFileSync("state/price_history.json", "utf8")); }
  catch { console.error("Kan inte läsa state/price_history.json – avslutar."); process.exit(1); }

  const res = evaluate(db, ph);

  // SKRIV BARA VID FAKTISK ÄNDRING. Filen byggs om var 30:e minut i pris-jobbet,
  // men innehållet ändras bara när ett beslut tillkommer eller mognar. Skrevs den
  // varje gång skulle `generatedAt` ensamt ge ~48 tomma commits per dygn, och
  // beslutsloggens historik dränkas i brus. generatedAt jämförs därför inte.
  const body = o => JSON.stringify({ ...o, generatedAt: null });
  let prev = null;
  try { prev = JSON.parse(readFileSync("state/decision_eval.json", "utf8")); } catch {}
  const changed = !prev || body(prev) !== body(res);
  if (changed) writeFileSync("state/decision_eval.json", JSON.stringify(res, null, 1) + "\n");
  else console.log("decision_eval.json oförändrad – skriver inte (undviker tom commit).");

  const h = res.horizons[0];
  const e = res.byHorizon[h].selectionEdge;
  console.log("decision_eval.json:", res.counts.decisions, "beslut,",
    res.counts.measurable, "mätbara,", res.counts.pending, "ännu inte mogna,",
    res.counts.missing, "utan kurshistorik.");
  console.log("Urvalsedge " + h + "d:", e.insufficient
    ? "för tidigt (behöver " + e.need.bought + " fler KÖP, " + e.need.passed + " fler AVVAKTA)"
    : e.edgePct + " pp – " + e.verdict);
  if (res.missingSymbols.length)
    console.log("Omätbara tickers (lägg i watchlist):", res.missingSymbols.join(", "));
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("decision_eval.mjs");
if (invokedDirectly) main();
