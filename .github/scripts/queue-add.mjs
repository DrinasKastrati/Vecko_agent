#!/usr/bin/env node
/* ============================================================
   Lägger en ticker i state/analysis_queue.json (pending).
   Körs av .github/workflows/analys_queue.yml – ingen API-nyckel.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const raw = (process.argv[2] || "").toUpperCase().trim();
const issue = process.argv[3] || "";
const ticker = raw.replace(/[^A-Z0-9.\-^]/g, "");

if (!ticker || !/^[\^A-Z0-9][A-Z0-9.\-]{0,11}$/.test(ticker)) {
  console.log("Ogiltig ticker, hoppar över:", JSON.stringify(raw));
  process.exit(0);
}

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
