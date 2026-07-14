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

export function evalSignals(targets, quotes){
  const out = [];
  for (const h of targets.held){
    const q = quotes[h.ticker];
    if (!q || q.error || q.price == null) continue;
    if (h.stop != null && q.price <= h.stop)
      out.push({ ticker: h.ticker, type: "SÄLJ", reason: "stop-loss träffad", level: h.stop, price: q.price, currency: q.currency || null, marketTime: q.marketTime || null });
    else if (h.target != null && q.price >= h.target)
      out.push({ ticker: h.ticker, type: "SÄLJ", reason: "målkurs nådd", level: h.target, price: q.price, currency: q.currency || null, marketTime: q.marketTime || null });
  }
  for (const p of targets.pending){
    const q = quotes[p.ticker];
    if (!q || q.error || q.price == null) continue;
    const hit = (p.cmp === "≤" || p.cmp === "<") ? q.price <= p.level
              : (p.cmp === "≥" || p.cmp === ">") ? q.price >= p.level : false;
    if (hit)
      out.push({ ticker: p.ticker, type: "KÖP", reason: "entry-villkor uppfyllt", level: p.level, price: q.price, currency: q.currency || null, marketTime: q.marketTime || null });
  }
  return out;
}

export async function run(fetchImpl = globalThis.fetch){
  const md = existsSync("state/portfolj.md") ? readFileSync("state/portfolj.md", "utf8") : "";
  const targets = collectTargets(md);
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
  if (unchanged){
    console.log(`Oförändrat (${signals.length} aktiva signaler) – rör inte alerts.json.`);
    return prev;
  }
  const out = { generatedAt: new Date().toISOString(), active: signals };
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(`Signaler: ${signals.length} aktiva, ${newOnes.length} nya. Bevakade: ${tickers.join(", ") || "(inga)"}`);
  return out;
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("alerts.mjs");
if (invokedDirectly) run().catch(e => { console.error("Fel:", e); process.exit(1); });
