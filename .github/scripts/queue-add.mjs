#!/usr/bin/env node
/* ============================================================
   Lägger en ticker i state/analysis_queue.json (pending) OCH i rätt
   watchlist (config/watchlist*.txt), så pris-hämtaren tar med den och
   analysen får en verifierad kurs. Körs av analys_queue.yml – ingen API-nyckel.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";
import { readJSON, writeAtomic } from "./state-io.mjs";

// ---- watchlist: lägg tickern där pris-hämtaren hittar den ----
function addToWatchlist(t){
  const nordic = /\.(ST|OL|CO|HE)$/.test(t);           // .ST/.OL/.CO/.HE -> nordisk
  const wl = nordic ? "config/watchlist.txt" : "config/watchlist_us.txt";
  let txt = "";
  if (existsSync(wl)) txt = readFileSync(wl, "utf8");
  const present = txt.split("\n").some(line => {
    const x = line.trim();
    return x && !x.startsWith("#") && x.toUpperCase() === t;
  });
  if (present) { console.log("Redan i watchlist:", t); return; }
  const header = "# --- Analys-köade tickers (auto) ---";
  if (txt.includes(header)) txt = txt.replace(header, header + "\n" + t);
  else txt = (txt && !txt.endsWith("\n") ? txt + "\n" : txt) + "\n" + header + "\n" + t + "\n";
  writeAtomic(wl, txt);
  console.log("La till i watchlist:", wl, "->", t);
}

export function enqueue(raw, issue = ""){
  const ticker = String(raw || "").toUpperCase().trim();
  if (!/^[\^A-Z0-9][A-Z0-9.\-=]{0,19}$/.test(ticker))
    throw new Error("Ogiltig ticker: " + JSON.stringify(raw));
  const path = "state/analysis_queue.json";
  // Read and validate the queue before changing either file.
  const q = readJSON(path, { pending: [], done: [] }, v =>
    v && Array.isArray(v.pending) && Array.isArray(v.done));
  addToWatchlist(ticker);
  if (q.pending.some(p => p && p.ticker === ticker)) {
    console.log("Redan i kön:", ticker);
    return;
  }
  q.pending.push({ ticker, requestedAt: new Date().toISOString(), issue: issue ? ("#" + issue) : null });
  writeAtomic(path, JSON.stringify(q, null, 2) + "\n");
  console.log("Köad:", ticker);
}

if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("queue-add.mjs"))
  enqueue(process.argv[2], process.argv[3]);
