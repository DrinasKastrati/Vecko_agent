#!/usr/bin/env node
/* ============================================================
   Lägger en ticker i state/analysis_queue.json (pending) OCH i rätt
   watchlist (config/watchlist*.txt), så pris-hämtaren tar med den och
   analysen får en verifierad kurs. Körs av analys_queue.yml – ingen API-nyckel.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const raw = (process.argv[2] || "").toUpperCase().trim();
const issue = process.argv[3] || "";
const ticker = raw.replace(/[^A-Z0-9.\-^]/g, "");

if (!ticker || !/^[\^A-Z0-9][A-Z0-9.\-]{0,11}$/.test(ticker)) {
  console.log("Ogiltig ticker, hoppar över:", JSON.stringify(raw));
  process.exit(0);
}

// ---- watchlist: lägg tickern där pris-hämtaren hittar den ----
function addToWatchlist(t){
  const nordic = /\.(ST|OL|CO|HE)$/.test(t);           // .ST/.OL/.CO/.HE -> nordisk
  const wl = nordic ? "config/watchlist.txt" : "config/watchlist_us.txt";
  let txt = "";
  if (existsSync(wl)) { try { txt = readFileSync(wl, "utf8"); } catch {} }
  const present = txt.split("\n").some(line => {
    const x = line.trim();
    return x && !x.startsWith("#") && x.toUpperCase() === t;
  });
  if (present) { console.log("Redan i watchlist:", t); return; }
  const header = "# --- Analys-köade tickers (auto) ---";
  if (txt.includes(header)) txt = txt.replace(header, header + "\n" + t);
  else txt = (txt && !txt.endsWith("\n") ? txt + "\n" : txt) + "\n" + header + "\n" + t + "\n";
  writeFileSync(wl, txt);
  console.log("La till i watchlist:", wl, "->", t);
}
addToWatchlist(ticker);

// ---- analyskö ----
const path = "state/analysis_queue.json";
let q = { pending: [], done: [] };
if (existsSync(path)) { try { q = JSON.parse(readFileSync(path, "utf8")); } catch {} }
q.pending = Array.isArray(q.pending) ? q.pending : [];
q.done = Array.isArray(q.done) ? q.done : [];

if (q.pending.some(p => p && p.ticker === ticker)) {
  console.log("Redan i kön:", ticker);
  process.exit(0);
}

q.pending.push({ ticker, requestedAt: new Date().toISOString(), issue: issue ? ("#" + issue) : null });
writeFileSync(path, JSON.stringify(q, null, 2) + "\n");
console.log("Köad:", ticker);
