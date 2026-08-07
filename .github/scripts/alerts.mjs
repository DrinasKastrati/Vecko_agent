#!/usr/bin/env node
/* ============================================================
   Intradag-monitor (LLM-FRITT, ingen API-nyckel). Läser öppna innehav
   + pending-case ur state/portfolj.md, hämtar deras kurser och jämför
   mot stop-loss / målkurs / entry-villkor. Skriver signaler till
   state/alerts.json. Körs varje timme under börstid av monitor.yml.
   Ren aritmetik – förbrukar INGA tokens. Ersätter INTE routinens omdöme;
   flaggar bara att en nivå korsats.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fetchQuote } from "./fetch-prices.mjs";

export function numFrom(s){
  const m = String(s || "").replace(/\s/g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function tableAfter(md, headingRe){
  const lines = md.split("\n");
  let i = lines.findIndex(l => headingRe.test(l));
  if (i < 0) return [];
  const rows = [];
  for (i = i + 1; i < lines.length; i++){
    const l = lines[i];
    if (/^\s*\|.*\|\s*$/.test(l)) rows.push(l);
    else if (rows.length) break;
    else if (/^\s*#/.test(l)) break;
  }
  if (rows.length < 2) return [];
  const cells = rows.map(r => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim()));
  const header = cells[0];
  return cells.slice(1)
    .filter(r => !r.every(c => /^:?-{2,}:?$/.test(c) || c === ""))
    .map(r => { const o = {}; header.forEach((h, k) => o[h] = (r[k] || "").trim()); return o; });
}

const isTicker = t => t && /^[\^A-Z0-9][A-Z0-9.\-]{0,11}$/.test(t);

export function collectTargets(md){
  const held = tableAfter(md, /^##\s+Aktuellt innehav/i)
    .map(o => ({ ticker: (o["Yahoo-ticker"] || "").toUpperCase(), name: o["Aktie"] || "",
      entry: numFrom(o["Entry"]), stop: numFrom(o["Stop-loss"]), target: numFrom(o["Målkurs"]) }))
    .filter(h => isTicker(h.ticker));
  const pending = tableAfter(md, /^###\s+Pending/i)
    .map(o => {
      const cond = o["Planerad entry (villkor)"] || o["Planerad entry"] || "";
      const m = cond.replace(/\s/g, "").replace(",", ".").match(/([≤<≥>])(\d+(?:\.\d+)?)/);
      return { ticker: (o["Yahoo-ticker"] || "").toUpperCase(), name: o["Aktie"] || "",
        cmp: m ? m[1] : null, level: m ? parseFloat(m[2]) : null };
    })
    .filter(p => isTicker(p.ticker) && p.cmp && p.level != null);
  return { held, pending };
}

/* Har nivån korsats? Mätpunkten är timvis, så en nivå kan handlas genom MELLAN
   två mätningar och ändå vara borta när vi tittar. Därför prövas först den
   senaste kursen, sedan dagens extrem åt samma håll. Saabs målkurs 635 nåddes
   2026-08-04 (dagshögsta 636,10) medan senastekursen låg på 619,70 – med bara
   q.price teg monitorn, och försäljningen beslutades först dagen efter.
   Både Yahoo och stooq levererar fälten; saknas de faller vi tillbaka på
   kursen ensam, precis som förut. Returnerar null när nivån inte korsats. */
function crossed(q, level, dir){
  if (level == null) return null;
  const px = q.price, ext = dir === "down" ? q.dayLow : q.dayHigh;
  const under = v => v != null && v <= level, over = v => v != null && v >= level;
  const hitPx = dir === "down" ? under(px) : over(px);
  if (hitPx) return { basis: "price", hitPrice: px };
  const hitExt = dir === "down" ? under(ext) : over(ext);
  if (hitExt) return { basis: "intraday", hitPrice: ext };
  return null;
}

export function evalSignals(targets, quotes){
  const out = [];
  for (const h of targets.held){
    const q = quotes[h.ticker];
    if (!q || q.error || q.price == null) continue;
    const common = { price: q.price, currency: q.currency || null, marketTime: q.marketTime || null };
    // Stoppen prövas FÖRE målet, även när båda korsats samma dag: risken först.
    const stop = crossed(q, h.stop, "down");
    if (stop)
      out.push(Object.assign({ ticker: h.ticker, type: "SÄLJ", reason: "stop-loss träffad", level: h.stop }, common, stop));
    else {
      const target = crossed(q, h.target, "up");
      if (target)
        out.push(Object.assign({ ticker: h.ticker, type: "SÄLJ", reason: "målkurs nådd", level: h.target }, common, target));
    }
  }
  for (const p of targets.pending){
    const q = quotes[p.ticker];
    if (!q || q.error || q.price == null) continue;
    const dir = (p.cmp === "≤" || p.cmp === "<") ? "down"
              : (p.cmp === "≥" || p.cmp === ">") ? "up" : null;
    const hit = dir ? crossed(q, p.level, dir) : null;
    if (hit)
      out.push(Object.assign({ ticker: p.ticker, type: "KÖP", reason: "entry-villkor uppfyllt", level: p.level },
        { price: q.price, currency: q.currency || null, marketTime: q.marketTime || null }, hit));
  }
  return out;
}

// Bevarar utgångna signaler (fanns förra körningen men inte längre) i en
// historiklista, nyast först, max 50 poster. Ren funktion – testbar.
export function mergeHistory(prev, signals, nowISO){
  const key = s => s.ticker + "|" + s.type;
  const curSet = new Set(signals.map(key));
  const expired = ((prev && prev.active) || [])
    .filter(s => !curSet.has(key(s)))
    .map(s => Object.assign({}, s, { expiredAt: nowISO }));
  return [...expired, ...((prev && prev.history) || [])].slice(0, 50);
}

// HJÄRTSLAG. Filen skrevs tidigare bara när signalmängden ändrades, så
// generatedAt betydde "senast signalerna ändrades" – inte "senast monitorn
// kördes". Effekten var att varken dashboarden, dagligprompten eller
// watchdogen kunde skilja "frisk monitor utan signaler" från "död monitor"
// (verifierat 2026-08-01: filen 2 dygn gammal trots sex gröna körningar).
// Lösningen är ett separat checkedAt som stämplas om även vid oförändrat
// läge – men på sin höjd var maxAgeH:e timme, annars blir det en commit i
// timmen av ren tidsstämpel. Watchdogen larmar på checkedAt, inte generatedAt.
export function heartbeatDue(prev, nowISO, maxAgeH = 3){
  const t = Date.parse((prev && (prev.checkedAt || prev.generatedAt)) || "");
  if (isNaN(t)) return true;
  return (Date.parse(nowISO) - t) > maxAgeH * 3600 * 1000;
}

export async function run(fetchImpl = globalThis.fetch){
  const mdN = existsSync("state/portfolj.md") ? readFileSync("state/portfolj.md", "utf8") : "";
  const mdU = existsSync("state/portfolj_us.md") ? readFileSync("state/portfolj_us.md", "utf8") : "";
  const tN = collectTargets(mdN), tU = collectTargets(mdU);
  const targets = { held: [...tN.held, ...tU.held], pending: [...tN.pending, ...tU.pending] };
  const tickers = [...new Set([...targets.held.map(h => h.ticker), ...targets.pending.map(p => p.ticker)])];
  const quotes = {};
  for (const t of tickers){ quotes[t] = await fetchQuote(t, fetchImpl); await new Promise(r => setTimeout(r, 250)); }
  const signals = evalSignals(targets, quotes);

  const path = "state/alerts.json";
  let prev = { active: [] };
  if (existsSync(path)) { try { prev = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  const key = s => s.ticker + "|" + s.type;
  const prevSet = new Set((prev.active || []).map(key));
  const curSet = new Set(signals.map(key));
  const newOnes = signals.filter(s => !prevSet.has(key(s)));
  // Efemär lista över NYA signaler denna körning (läses av monitor.yml för att öppna issues).
  writeFileSync((process.env.RUNNER_TEMP || ".") + "/alerts_new.json", JSON.stringify(newOnes) + "\n");

  const unchanged = prevSet.size === curSet.size && [...curSet].every(k => prevSet.has(k));
  const nowISO = new Date().toISOString();
  if (unchanged && !heartbeatDue(prev, nowISO)){
    console.log(`Oförändrat (${signals.length} aktiva signaler), hjärtslag färskt – rör inte alerts.json.`);
    return prev;
  }
  const out = {
    // generatedAt = senast signalerna ÄNDRADES; checkedAt = senast monitorn KÖRDE.
    generatedAt: unchanged ? (prev.generatedAt || nowISO) : nowISO,
    checkedAt: nowISO,
    watched: tickers,
    active: signals,
    history: unchanged ? (prev.history || []) : mergeHistory(prev, signals, nowISO)
  };
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(unchanged
    ? `Oförändrat (${signals.length} aktiva) – hjärtslag stämplat ${nowISO}. Bevakade: ${tickers.join(", ") || "(inga)"}`
    : `Signaler: ${signals.length} aktiva, ${newOnes.length} nya. Bevakade: ${tickers.join(", ") || "(inga)"}`);
  return out;
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("alerts.mjs");
if (invokedDirectly) run().catch(e => { console.error("Fel:", e); process.exit(1); });
