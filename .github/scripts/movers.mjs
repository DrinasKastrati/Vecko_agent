#!/usr/bin/env node
/* ============================================================
   Veckans kursrörelser i ett BREDDAT nordiskt universum.
   NYCKELLÖST och LLM-FRITT – ren aritmetik, noll tokens.

   VARFÖR: miss-retron letade tidigare missar i price_history.json, som bara
   innehåller de ~10 tickers systemet redan bevakar. Den kunde alltså per
   konstruktion inte hitta en vinnare den inte redan tittat på, och kategori A
   (UTANFÖR UNIVERSUM) blev det dominerande hålet i tratten. Det här skriptet
   hämtar dagsstänginingar för ~100 nordiska namn en gång i veckan och skriver
   de största rörelserna till state/movers.json, som retron läser i STEG 1.

   Att en ticker dyker upp här är ett BEVAKNINGS-fynd, inte en köpsignal:
   rörelsen har redan inträffat. Syftet är att kunna svara på frågan "var i
   tratten föll den bort?" – inte att jaga gårdagens kurs.

   Kör: node .github/scripts/movers.mjs            (kräver nät)
        node .github/scripts/movers.mjs 5          (tröskel i procent)
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---- rena funktioner (testas i tests/run.mjs, ingen nätåtkomst) ---------

// "namn.ST"-rader ur en universum-fil; # och tomrader ignoreras.
export function parseUniverse(txt){
  return String(txt || "").split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#"));
}

// Dagsstängningar ur Yahoos chart-json -> [{d,c}] i stigande datumordning.
export function closesFrom(json){
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  if (!r || !r.timestamp || !r.indicators || !r.indicators.quote) return [];
  const q = r.indicators.quote[0] || {};
  const out = [];
  for (let i = 0; i < r.timestamp.length; i++){
    const c = q.close && q.close[i];
    if (c == null || isNaN(c)) continue;
    out.push({ d: new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10), c });
  }
  return out;
}

// Rörelse i procent över `sessions` handelsdagar fram till sista noteringen.
// sessions = 1 ger dagsrörelsen. Saknas historik returneras null (ALDRIG 0 –
// ett okänt tal får inte se ut som "ingen rörelse").
export function moveOver(closes, sessions){
  if (!Array.isArray(closes) || closes.length < sessions + 1) return null;
  const last = closes[closes.length - 1], base = closes[closes.length - 1 - sessions];
  if (!last || !base || !base.c) return null;
  return (last.c / base.c - 1) * 100;
}

// Bygger den sorterade rörelselistan. bySym: { SYM: closes[] }.
// Tas med om |veckorörelse| >= weekPct ELLER |dagsrörelse| >= dayPct.
export function rankMovers(bySym, opts = {}){
  const { weekPct = 8, dayPct = 6, sessionsWeek = 5 } = opts;
  const rows = [];
  for (const [symbol, closes] of Object.entries(bySym || {})){
    const week = moveOver(closes, sessionsWeek);
    const day = moveOver(closes, 1);
    if (week == null && day == null) continue;
    const hit = (week != null && Math.abs(week) >= weekPct) ||
                (day != null && Math.abs(day) >= dayPct);
    if (!hit) continue;
    const last = closes[closes.length - 1];
    rows.push({
      symbol,
      lastClose: last ? Number(last.c.toFixed(4)) : null,
      lastDate: last ? last.d : null,
      weekPct: week == null ? null : Number(week.toFixed(2)),
      dayPct: day == null ? null : Number(day.toFixed(2)),
      // Vilket villkor som fångade raden – gör listan läsbar utan att räkna om.
      trigger: (day != null && Math.abs(day) >= dayPct) ? "dag" : "vecka"
    });
  }
  // Störst absolut veckorörelse först; rader utan veckotal sist.
  rows.sort((a, b) => Math.abs(b.weekPct ?? -1) - Math.abs(a.weekPct ?? -1));
  return rows;
}

// ---- nät ----------------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchCloses(sym, fetchImpl = globalThis.fetch){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const h of hosts){
    try {
      const url = `https://${h}/v8/finance/chart/${encodeURIComponent(sym)}?range=1mo&interval=1d`;
      const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
      if (!r.ok) continue;
      const cs = closesFrom(await r.json());
      if (cs.length) return cs;
    } catch { /* nästa host */ }
  }
  return [];
}

async function main(){
  const weekPct = Number(process.argv[2]) || 8;
  const file = "config/universe_nordic_movers.txt";
  if (!existsSync(file)){ console.error("Saknar " + file); process.exit(1); }
  const syms = parseUniverse(readFileSync(file, "utf8"));
  console.log(`Hämtar ${syms.length} symboler…`);

  const bySym = {}; const failed = [];
  for (const s of syms){
    const cs = await fetchCloses(s);
    if (cs.length) bySym[s] = cs; else failed.push(s);
    await sleep(250);
  }

  const movers = rankMovers(bySym, { weekPct, dayPct: Math.max(4, weekPct - 2) });
  const dates = Object.values(bySym).map(c => c[c.length - 1].d).sort();
  const out = {
    generatedAt: new Date().toISOString(),
    note: "Breddad rörelsedetektion för miss-retrons STEG 1. Rörelsen har REDAN " +
          "inträffat – detta är bevakningsunderlag, inte köpsignaler.",
    universeCount: syms.length,
    okCount: Object.keys(bySym).length,
    failed,
    thresholds: { weekPct, dayPct: Math.max(4, weekPct - 2), sessionsWeek: 5 },
    asOf: dates.length ? dates[dates.length - 1] : null,
    movers
  };
  mkdirSync("state", { recursive: true });
  writeFileSync("state/movers.json", JSON.stringify(out, null, 1) + "\n");
  console.log(`movers.json: ${movers.length} rörelser av ${out.okCount}/${syms.length} hämtade.` +
    (failed.length ? " Misslyckade: " + failed.join(", ") : ""));
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("movers.mjs");
if (invokedDirectly) main().catch(e => { console.error("Fel:", e); process.exit(1); });
